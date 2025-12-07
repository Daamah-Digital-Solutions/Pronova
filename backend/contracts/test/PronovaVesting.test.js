const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

describe("PronovaVesting - Comprehensive Security Tests", function () {
    let pronovaToken, pronovaVesting;
    let owner, admin1, admin2, treasury;
    let foundersWallet, teamWallet, partnershipsWallet;

    // Updated allocation amounts (from whitepaper)
    const FOUNDERS_ALLOCATION = ethers.parseEther("140000000"); // 14%
    const TEAM_ALLOCATION = ethers.parseEther("50000000"); // 5%
    const PARTNERSHIPS_ALLOCATION = ethers.parseEther("150000000"); // 15%
    const TOTAL_VESTED = FOUNDERS_ALLOCATION + TEAM_ALLOCATION + PARTNERSHIPS_ALLOCATION;

    const VESTING_DURATION = 9n * 365n * 24n * 60n * 60n; // 9 years
    const UNLOCK_INTERVAL = 180n * 24n * 60n * 60n; // 6 months
    const UNLOCK_PERCENTAGE = 250; // 2.5% in basis points
    const TOTAL_PERIODS = 18; // 9 years / 6 months

    beforeEach(async function () {
        [owner, admin1, admin2, treasury, foundersWallet, teamWallet, partnershipsWallet] = await ethers.getSigners();

        // Deploy PronovaToken
        const PronovaToken = await ethers.getContractFactory("PronovaToken");
        pronovaToken = await PronovaToken.deploy(treasury.address);
        await pronovaToken.waitForDeployment();

        // Deploy PronovaVesting
        const PronovaVesting = await ethers.getContractFactory("PronovaVesting");
        pronovaVesting = await PronovaVesting.deploy(
            pronovaToken.target,
            treasury.address
        );
        await pronovaVesting.waitForDeployment();

        // Grant roles
        const ADMIN_ROLE_TOKEN = await pronovaToken.ADMIN_ROLE();
        const ADMIN_ROLE_VESTING = await pronovaVesting.ADMIN_ROLE();

        await pronovaToken.grantRole(ADMIN_ROLE_TOKEN, admin1.address);
        await pronovaToken.grantRole(ADMIN_ROLE_TOKEN, admin2.address);
        await pronovaVesting.grantRole(ADMIN_ROLE_VESTING, admin1.address);
        await pronovaVesting.grantRole(ADMIN_ROLE_VESTING, admin2.address);

        // Setup and distribute tokens
        await pronovaToken.connect(admin1).setAllocationWallets(
            owner.address,
            foundersWallet.address,
            owner.address,
            partnershipsWallet.address,
            teamWallet.address,
            owner.address,
            owner.address,
            owner.address,
            pronovaVesting.target
        );

        await pronovaToken.connect(admin2).setAllocationWallets(
            owner.address,
            foundersWallet.address,
            owner.address,
            partnershipsWallet.address,
            teamWallet.address,
            owner.address,
            owner.address,
            owner.address,
            pronovaVesting.target
        );

        await pronovaToken.connect(admin1).distributeAllocations();
        await pronovaToken.connect(admin2).distributeAllocations();
    });

    describe("Contract Initialization", function () {
        it("Should have correct vesting parameters", async function () {
            expect(await pronovaVesting.VESTING_DURATION()).to.equal(VESTING_DURATION);
            expect(await pronovaVesting.UNLOCK_INTERVAL()).to.equal(UNLOCK_INTERVAL);
            expect(await pronovaVesting.UNLOCK_PERCENTAGE_PER_INTERVAL()).to.equal(UNLOCK_PERCENTAGE);
            expect(await pronovaVesting.TOTAL_UNLOCK_PERIODS()).to.equal(TOTAL_PERIODS);
        });

        it("Should have correct locked percentage (45%)", async function () {
            expect(await pronovaVesting.LOCKED_PERCENTAGE()).to.equal(45);
        });

        it("Should receive vested tokens from token contract", async function () {
            const vestingBalance = await pronovaToken.balanceOf(pronovaVesting.target);
            expect(vestingBalance).to.equal(TOTAL_VESTED);
        });

        it("Should have correct treasury wallet", async function () {
            expect(await pronovaVesting.treasuryWallet()).to.equal(treasury.address);
        });
    });

    describe("AUDIT FIX: setupWhitepaperAllocations Multi-Sig", function () {
        it("Should require 2 confirmations to setup allocations", async function () {
            // First admin calls setup
            await pronovaVesting.connect(admin1).setupWhitepaperAllocations(
                foundersWallet.address,
                teamWallet.address,
                partnershipsWallet.address
            );

            // Check that allocations are not set yet
            const foundersInfo = await pronovaVesting.getBeneficiaryInfo(foundersWallet.address);
            expect(foundersInfo.totalVested).to.equal(0);

            // Second admin confirms
            await pronovaVesting.connect(admin2).setupWhitepaperAllocations(
                foundersWallet.address,
                teamWallet.address,
                partnershipsWallet.address
            );

            // Now allocations should be set
            const foundersInfoAfter = await pronovaVesting.getBeneficiaryInfo(foundersWallet.address);
            expect(foundersInfoAfter.totalVested).to.equal(FOUNDERS_ALLOCATION);
        });

        it("Should use deterministic operation ID", async function () {
            await pronovaVesting.connect(admin1).setupWhitepaperAllocations(
                foundersWallet.address,
                teamWallet.address,
                partnershipsWallet.address
            );

            await pronovaVesting.connect(admin2).setupWhitepaperAllocations(
                foundersWallet.address,
                teamWallet.address,
                partnershipsWallet.address
            );

            // Try to execute again - should fail
            await expect(
                pronovaVesting.connect(admin1).setupWhitepaperAllocations(
                    foundersWallet.address,
                    teamWallet.address,
                    partnershipsWallet.address
                )
            ).to.be.revertedWith("Already executed");
        });

        it("Should create correct vesting schedules for all beneficiaries", async function () {
            await pronovaVesting.connect(admin1).setupWhitepaperAllocations(
                foundersWallet.address,
                teamWallet.address,
                partnershipsWallet.address
            );

            await pronovaVesting.connect(admin2).setupWhitepaperAllocations(
                foundersWallet.address,
                teamWallet.address,
                partnershipsWallet.address
            );

            // Check founders
            const foundersInfo = await pronovaVesting.getBeneficiaryInfo(foundersWallet.address);
            expect(foundersInfo.totalVested).to.equal(FOUNDERS_ALLOCATION);

            // Check team
            const teamInfo = await pronovaVesting.getBeneficiaryInfo(teamWallet.address);
            expect(teamInfo.totalVested).to.equal(TEAM_ALLOCATION);

            // Check partnerships
            const partnershipsInfo = await pronovaVesting.getBeneficiaryInfo(partnershipsWallet.address);
            expect(partnershipsInfo.totalVested).to.equal(PARTNERSHIPS_ALLOCATION);
        });
    });

    describe("AUDIT FIX: createCustomVesting startTime Validation", function () {
        beforeEach(async function () {
            const VESTING_MANAGER_ROLE = await pronovaVesting.VESTING_MANAGER_ROLE();
            await pronovaVesting.grantRole(VESTING_MANAGER_ROLE, admin1.address);
        });

        it("Should allow custom vesting with valid future startTime", async function () {
            const startTime = (await time.latest()) + 3600; // 1 hour from now
            const amount = ethers.parseEther("1000");

            await expect(
                pronovaVesting.connect(admin1).createCustomVesting(
                    foundersWallet.address,
                    amount,
                    startTime,
                    0, // no cliff
                    365 * 24 * 60 * 60, // 1 year
                    false
                )
            ).to.not.be.reverted;
        });

        it("Should reject custom vesting with past startTime", async function () {
            const startTime = (await time.latest()) - 3600; // 1 hour ago
            const amount = ethers.parseEther("1000");

            await expect(
                pronovaVesting.connect(admin1).createCustomVesting(
                    foundersWallet.address,
                    amount,
                    startTime,
                    0,
                    365 * 24 * 60 * 60,
                    false
                )
            ).to.be.revertedWith("Start time must be in future or present");
        });

        it("Should reject custom vesting with startTime too far in future", async function () {
            const startTime = (await time.latest()) + (366 * 24 * 60 * 60); // > 1 year
            const amount = ethers.parseEther("1000");

            await expect(
                pronovaVesting.connect(admin1).createCustomVesting(
                    foundersWallet.address,
                    amount,
                    startTime,
                    0,
                    365 * 24 * 60 * 60,
                    false
                )
            ).to.be.revertedWith("Start time too far in future");
        });
    });

    describe("AUDIT FIX: Vesting Release and totalLockedAmount Accounting", function () {
        beforeEach(async function () {
            // Setup allocations
            await pronovaVesting.connect(admin1).setupWhitepaperAllocations(
                foundersWallet.address,
                teamWallet.address,
                partnershipsWallet.address
            );

            await pronovaVesting.connect(admin2).setupWhitepaperAllocations(
                foundersWallet.address,
                teamWallet.address,
                partnershipsWallet.address
            );
        });

        it("Should correctly decrement totalLockedAmount on release", async function () {
            // Fast forward 6 months
            await time.increase(UNLOCK_INTERVAL);

            const initialInfo = await pronovaVesting.getBeneficiaryInfo(foundersWallet.address);
            const initialLocked = initialInfo.totalLocked;

            // Release tokens
            await pronovaVesting.connect(foundersWallet).release(1); // Schedule index 1 (locked portion)

            const afterInfo = await pronovaVesting.getBeneficiaryInfo(foundersWallet.address);
            const afterLocked = afterInfo.totalLocked;

            // totalLocked should have decreased
            expect(afterLocked).to.be.lt(initialLocked);
        });

        it("Should correctly handle releaseAll accounting", async function () {
            // Fast forward 6 months
            await time.increase(UNLOCK_INTERVAL);

            const initialInfo = await pronovaVesting.getBeneficiaryInfo(foundersWallet.address);

            await pronovaVesting.connect(foundersWallet).releaseAll();

            const afterInfo = await pronovaVesting.getBeneficiaryInfo(foundersWallet.address);

            // Total released should increase
            expect(afterInfo.totalReleased).to.be.gt(initialInfo.totalReleased);
        });
    });

    describe("AUDIT FIX: revoke() Treasury Routing", function () {
        beforeEach(async function () {
            await pronovaVesting.connect(admin1).setupWhitepaperAllocations(
                foundersWallet.address,
                teamWallet.address,
                partnershipsWallet.address
            );

            await pronovaVesting.connect(admin2).setupWhitepaperAllocations(
                foundersWallet.address,
                teamWallet.address,
                partnershipsWallet.address
            );
        });

        it("Should require multi-sig for revocation", async function () {
            // First admin attempts revoke
            await pronovaVesting.connect(admin1).revoke(foundersWallet.address, 1);

            // Vesting should not be revoked yet
            const schedule = await pronovaVesting.getVestingSchedule(foundersWallet.address, 1);
            expect(schedule.revoked).to.equal(false);

            // Second admin confirms
            await pronovaVesting.connect(admin2).revoke(foundersWallet.address, 1);

            // Now should be revoked
            const scheduleAfter = await pronovaVesting.getVestingSchedule(foundersWallet.address, 1);
            expect(scheduleAfter.revoked).to.equal(true);
        });

        it("Should route revoked tokens to treasury wallet", async function () {
            const initialTreasuryBalance = await pronovaToken.balanceOf(treasury.address);

            // Revoke vesting
            await pronovaVesting.connect(admin1).revoke(foundersWallet.address, 1);
            await pronovaVesting.connect(admin2).revoke(foundersWallet.address, 1);

            const finalTreasuryBalance = await pronovaToken.balanceOf(treasury.address);

            // Treasury should receive the unvested tokens
            expect(finalTreasuryBalance).to.be.gt(initialTreasuryBalance);
        });
    });

    describe("Token Release Functionality", function () {
        beforeEach(async function () {
            await pronovaVesting.connect(admin1).setupWhitepaperAllocations(
                foundersWallet.address,
                teamWallet.address,
                partnershipsWallet.address
            );

            await pronovaVesting.connect(admin2).setupWhitepaperAllocations(
                foundersWallet.address,
                teamWallet.address,
                partnershipsWallet.address
            );
        });

        it("Should release immediate tokens (55%)", async function () {
            const initialBalance = await pronovaToken.balanceOf(foundersWallet.address);

            // Release immediate portion (schedule index 0)
            await pronovaVesting.connect(foundersWallet).release(0);

            const finalBalance = await pronovaToken.balanceOf(foundersWallet.address);
            const released = finalBalance - initialBalance;

            // Should be 55% of founders allocation
            const expected = (FOUNDERS_ALLOCATION * 55n) / 100n;
            expect(released).to.equal(expected);
        });

        it("Should calculate correct vested amount after 6 months", async function () {
            // Fast forward 6 months
            await time.increase(UNLOCK_INTERVAL);

            const releasable = await pronovaVesting.getTotalReleasableAmount(foundersWallet.address);

            // Should have immediate + first 6-month unlock
            expect(releasable).to.be.gt(0);
        });

        it("Should handle 9-year vesting correctly", async function () {
            // Fast forward 9 years
            await time.increase(VESTING_DURATION);

            const releasable = await pronovaVesting.getTotalReleasableAmount(foundersWallet.address);

            // Should be able to release everything
            expect(releasable).to.equal(FOUNDERS_ALLOCATION);
        });
    });

    describe("View Functions", function () {
        beforeEach(async function () {
            await pronovaVesting.connect(admin1).setupWhitepaperAllocations(
                foundersWallet.address,
                teamWallet.address,
                partnershipsWallet.address
            );

            await pronovaVesting.connect(admin2).setupWhitepaperAllocations(
                foundersWallet.address,
                teamWallet.address,
                partnershipsWallet.address
            );
        });

        it("Should return correct vesting schedule info", async function () {
            const schedule = await pronovaVesting.getVestingSchedule(foundersWallet.address, 1);

            expect(schedule.totalAmount).to.be.gt(0);
            expect(schedule.vestingType).to.equal(1); // Whitepaper vesting
            expect(schedule.revoked).to.equal(false);
        });

        it("Should return correct beneficiary info", async function () {
            const info = await pronovaVesting.getBeneficiaryInfo(foundersWallet.address);

            expect(info.totalVested).to.equal(FOUNDERS_ALLOCATION);
            expect(info.scheduleCount).to.equal(2); // Immediate + locked
        });

        it("Should calculate next unlock time", async function () {
            const nextUnlock = await pronovaVesting.getNextUnlockTime(foundersWallet.address, 1);
            expect(nextUnlock).to.be.gt(0);
        });

        it("Should return contract stats", async function () {
            const stats = await pronovaVesting.getContractStats();

            expect(stats.managed).to.equal(TOTAL_VESTED);
            expect(stats.vestingDurationYears).to.equal(9);
            expect(stats.totalPeriods).to.equal(TOTAL_PERIODS);
        });
    });

    describe("Access Control", function () {
        it("Should prevent non-admin from setting up allocations", async function () {
            await expect(
                pronovaVesting.connect(foundersWallet).setupWhitepaperAllocations(
                    foundersWallet.address,
                    teamWallet.address,
                    partnershipsWallet.address
                )
            ).to.be.reverted;
        });

        it("Should prevent non-admin from revoking vesting", async function () {
            await pronovaVesting.connect(admin1).setupWhitepaperAllocations(
                foundersWallet.address,
                teamWallet.address,
                partnershipsWallet.address
            );

            await pronovaVesting.connect(admin2).setupWhitepaperAllocations(
                foundersWallet.address,
                teamWallet.address,
                partnershipsWallet.address
            );

            await expect(
                pronovaVesting.connect(foundersWallet).revoke(foundersWallet.address, 0)
            ).to.be.reverted;
        });
    });
});
