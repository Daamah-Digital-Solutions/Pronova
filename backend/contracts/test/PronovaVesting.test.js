const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

describe("PronovaVesting - Updated with 9-Year Vesting Period", function () {
    let pronovaToken, pronovaVesting;
    let owner, admin1, admin2, foundersWallet, teamWallet, partnershipsWallet;

    const FOUNDERS_ALLOCATION = ethers.parseEther("75000000"); // 7.5% (75M)
    const TEAM_ALLOCATION = ethers.parseEther("25000000"); // 2.5% (25M)
    const PARTNERSHIPS_ALLOCATION = ethers.parseEther("150000000"); // 15% (150M)
    const TOTAL_VESTED_ALLOCATION = FOUNDERS_ALLOCATION + TEAM_ALLOCATION + PARTNERSHIPS_ALLOCATION;

    // Vesting parameters (9 years as per whitepaper)
    const VESTING_DURATION = 9 * 365 * 24 * 60 * 60; // 9 years in seconds
    const UNLOCK_INTERVAL = 180 * 24 * 60 * 60; // 6 months in seconds
    const UNLOCK_PERCENTAGE = 250; // 2.5% in basis points
    const TOTAL_UNLOCK_PERIODS = 18; // 9 years / 6 months

    beforeEach(async function () {
        [owner, admin1, admin2, foundersWallet, teamWallet, partnershipsWallet] = await ethers.getSigners();

        // Deploy PronovaToken
        const PronovaToken = await ethers.getContractFactory("PronovaToken");
        pronovaToken = await PronovaToken.deploy();
        await pronovaToken.waitForDeployment();

        // Deploy PronovaVesting
        const PronovaVesting = await ethers.getContractFactory("PronovaVesting");
        pronovaVesting = await PronovaVesting.deploy(
            pronovaToken.target,
            foundersWallet.address,
            teamWallet.address,
            partnershipsWallet.address
        );
        await pronovaVesting.waitForDeployment();

        // Setup admin roles
        const ADMIN_ROLE = await pronovaVesting.ADMIN_ROLE();
        await pronovaVesting.grantRole(ADMIN_ROLE, admin1.address);
        await pronovaVesting.grantRole(ADMIN_ROLE, admin2.address);

        // Setup token permissions
        const ADMIN_ROLE_TOKEN = await pronovaToken.ADMIN_ROLE();
        await pronovaToken.grantRole(ADMIN_ROLE_TOKEN, admin1.address);
        await pronovaToken.grantRole(ADMIN_ROLE_TOKEN, admin2.address);

        // Set allocation wallets and distribute tokens
        await pronovaToken.connect(admin1).setAllocationWallets(
            owner.address, // presale
            foundersWallet.address,
            owner.address, // liquidity
            partnershipsWallet.address,
            teamWallet.address,
            owner.address, // community
            owner.address, // strategic
            owner.address, // marketing
            owner.address, // staking
            pronovaVesting.target // vesting contract
        );

        await pronovaToken.connect(admin2).setAllocationWallets(
            owner.address, // presale
            foundersWallet.address,
            owner.address, // liquidity
            partnershipsWallet.address,
            teamWallet.address,
            owner.address, // community
            owner.address, // strategic
            owner.address, // marketing
            owner.address, // staking
            pronovaVesting.target // vesting contract
        );

        // Distribute allocations
        await pronovaToken.connect(admin1).distributeAllocations();
        await pronovaToken.connect(admin2).distributeAllocations();
    });

    describe("Vesting Specifications", function () {
        it("Should have correct vesting duration of 9 years", async function () {
            expect(await pronovaVesting.VESTING_DURATION()).to.equal(VESTING_DURATION);
        });

        it("Should have correct unlock interval of 6 months", async function () {
            expect(await pronovaVesting.UNLOCK_INTERVAL()).to.equal(UNLOCK_INTERVAL);
        });

        it("Should have correct unlock percentage of 2.5%", async function () {
            expect(await pronovaVesting.UNLOCK_PERCENTAGE_PER_INTERVAL()).to.equal(UNLOCK_PERCENTAGE);
        });

        it("Should have 18 total unlock periods (9 years / 6 months)", async function () {
            expect(await pronovaVesting.TOTAL_UNLOCK_PERIODS()).to.equal(TOTAL_UNLOCK_PERIODS);
        });

        it("Should have correct beneficiary allocations", async function () {
            expect(await pronovaVesting.FOUNDERS_ALLOCATION()).to.equal(FOUNDERS_ALLOCATION);
            expect(await pronovaVesting.TEAM_ALLOCATION()).to.equal(TEAM_ALLOCATION);
            expect(await pronovaVesting.PARTNERSHIPS_ALLOCATION()).to.equal(PARTNERSHIPS_ALLOCATION);
        });

        it("Should receive total vested tokens from token contract", async function () {
            expect(await pronovaToken.balanceOf(pronovaVesting.target)).to.equal(TOTAL_VESTED_ALLOCATION);
        });
    });

    describe("Multi-Signature Functionality", function () {
        it("Should require 2 confirmations to start vesting", async function () {
            // First admin starts vesting
            await pronovaVesting.connect(admin1).initializeVesting();

            // Vesting should not be started yet
            expect(await pronovaVesting.vestingStarted()).to.equal(false);

            // Second admin confirms
            await pronovaVesting.connect(admin2).initializeVesting();

            // Now vesting should be started
            expect(await pronovaVesting.vestingStarted()).to.equal(true);
            expect(await pronovaVesting.vestingStartTime()).to.be.gt(0);
        });

        it("Should require 2 confirmations for emergency pause", async function () {
            // Start vesting first
            await pronovaVesting.connect(admin1).initializeVesting();
            await pronovaVesting.connect(admin2).initializeVesting();

            // First admin pauses
            await pronovaVesting.connect(admin1).emergencyPause();
            expect(await pronovaVesting.paused()).to.equal(false);

            // Second admin confirms
            await pronovaVesting.connect(admin2).emergencyPause();
            expect(await pronovaVesting.paused()).to.equal(true);
        });
    });

    describe("Vesting Schedule and Claims", function () {
        beforeEach(async function () {
            // Initialize vesting
            await pronovaVesting.connect(admin1).initializeVesting();
            await pronovaVesting.connect(admin2).initializeVesting();
        });

        it("Should calculate correct vested amount after 6 months (first unlock)", async function () {
            // Fast forward 6 months
            await time.increase(UNLOCK_INTERVAL);

            // Check vested amounts for each beneficiary
            const foundersVested = await pronovaVesting.getVestedAmount(foundersWallet.address);
            const teamVested = await pronovaVesting.getVestedAmount(teamWallet.address);
            const partnershipsVested = await pronovaVesting.getVestedAmount(partnershipsWallet.address);

            // Each should have 2.5% of their total allocation vested
            const expectedFoundersVested = FOUNDERS_ALLOCATION * BigInt(UNLOCK_PERCENTAGE) / 10000n;
            const expectedTeamVested = TEAM_ALLOCATION * BigInt(UNLOCK_PERCENTAGE) / 10000n;
            const expectedPartnershipsVested = PARTNERSHIPS_ALLOCATION * BigInt(UNLOCK_PERCENTAGE) / 10000n;

            expect(foundersVested).to.equal(expectedFoundersVested);
            expect(teamVested).to.equal(expectedTeamVested);
            expect(partnershipsVested).to.equal(expectedPartnershipsVested);
        });

        it("Should allow claiming after first unlock period", async function () {
            // Fast forward 6 months
            await time.increase(UNLOCK_INTERVAL);

            const expectedVested = FOUNDERS_ALLOCATION * BigInt(UNLOCK_PERCENTAGE) / 10000n;

            // Claim tokens
            await pronovaVesting.connect(foundersWallet).claimTokens();

            // Check balance
            expect(await pronovaToken.balanceOf(foundersWallet.address)).to.equal(expectedVested);

            // Check claimed amount is tracked
            const beneficiaryInfo = await pronovaVesting.getBeneficiaryInfo(foundersWallet.address);
            expect(beneficiaryInfo.totalClaimed).to.equal(expectedVested);
        });

        it("Should calculate correct vested amount after 18 months (3 unlock periods)", async function () {
            // Fast forward 18 months (3 unlock periods)
            await time.increase(UNLOCK_INTERVAL * 3);

            const foundersVested = await pronovaVesting.getVestedAmount(foundersWallet.address);

            // Should have 3 * 2.5% = 7.5% of allocation vested
            const expectedVested = FOUNDERS_ALLOCATION * BigInt(UNLOCK_PERCENTAGE * 3) / 10000n;
            expect(foundersVested).to.equal(expectedVested);
        });

        it("Should vest all tokens after 9 years", async function () {
            // Fast forward 9 years
            await time.increase(VESTING_DURATION);

            const foundersVested = await pronovaVesting.getVestedAmount(foundersWallet.address);
            const teamVested = await pronovaVesting.getVestedAmount(teamWallet.address);
            const partnershipsVested = await pronovaVesting.getVestedAmount(partnershipsWallet.address);

            // All allocations should be fully vested
            expect(foundersVested).to.equal(FOUNDERS_ALLOCATION);
            expect(teamVested).to.equal(TEAM_ALLOCATION);
            expect(partnershipsVested).to.equal(PARTNERSHIPS_ALLOCATION);
        });

        it("Should allow claiming all tokens after 9 years", async function () {
            // Fast forward 9 years
            await time.increase(VESTING_DURATION);

            // All beneficiaries claim their tokens
            await pronovaVesting.connect(foundersWallet).claimTokens();
            await pronovaVesting.connect(teamWallet).claimTokens();
            await pronovaVesting.connect(partnershipsWallet).claimTokens();

            // Check final balances
            expect(await pronovaToken.balanceOf(foundersWallet.address)).to.equal(FOUNDERS_ALLOCATION);
            expect(await pronovaToken.balanceOf(teamWallet.address)).to.equal(TEAM_ALLOCATION);
            expect(await pronovaToken.balanceOf(partnershipsWallet.address)).to.equal(PARTNERSHIPS_ALLOCATION);

            // Vesting contract should have no tokens left
            expect(await pronovaToken.balanceOf(pronovaVesting.target)).to.equal(0);
        });

        it("Should prevent double claiming in same period", async function () {
            // Fast forward 6 months
            await time.increase(UNLOCK_INTERVAL);

            // First claim should succeed
            await pronovaVesting.connect(foundersWallet).claimTokens();

            const balanceAfterFirstClaim = await pronovaToken.balanceOf(foundersWallet.address);

            // Second claim in same period should give no additional tokens
            await pronovaVesting.connect(foundersWallet).claimTokens();

            expect(await pronovaToken.balanceOf(foundersWallet.address)).to.equal(balanceAfterFirstClaim);
        });

        it("Should handle partial claims correctly", async function () {
            // Fast forward 1 year (2 unlock periods)
            await time.increase(UNLOCK_INTERVAL * 2);

            // Claim first time
            await pronovaVesting.connect(foundersWallet).claimTokens();

            const balanceAfterFirst = await pronovaToken.balanceOf(foundersWallet.address);
            const expectedAfterFirst = FOUNDERS_ALLOCATION * BigInt(UNLOCK_PERCENTAGE * 2) / 10000n;
            expect(balanceAfterFirst).to.equal(expectedAfterFirst);

            // Fast forward another 6 months
            await time.increase(UNLOCK_INTERVAL);

            // Claim again
            await pronovaVesting.connect(foundersWallet).claimTokens();

            const balanceAfterSecond = await pronovaToken.balanceOf(foundersWallet.address);
            const expectedAfterSecond = FOUNDERS_ALLOCATION * BigInt(UNLOCK_PERCENTAGE * 3) / 10000n;
            expect(balanceAfterSecond).to.equal(expectedAfterSecond);
        });
    });

    describe("Access Control", function () {
        it("Should not allow non-admins to initialize vesting", async function () {
            await expect(
                pronovaVesting.connect(foundersWallet).initializeVesting()
            ).to.be.reverted;
        });

        it("Should not allow non-admins to emergency pause", async function () {
            await expect(
                pronovaVesting.connect(foundersWallet).emergencyPause()
            ).to.be.reverted;
        });

        it("Should only allow registered beneficiaries to claim", async function () {
            await pronovaVesting.connect(admin1).initializeVesting();
            await pronovaVesting.connect(admin2).initializeVesting();

            await time.increase(UNLOCK_INTERVAL);

            // Unregistered address should not be able to claim
            await expect(
                pronovaVesting.connect(owner).claimTokens()
            ).to.be.revertedWith("Not a beneficiary");
        });
    });

    describe("Emergency Functions", function () {
        it("Should prevent claims when paused", async function () {
            await pronovaVesting.connect(admin1).initializeVesting();
            await pronovaVesting.connect(admin2).initializeVesting();

            await time.increase(UNLOCK_INTERVAL);

            // Pause the contract
            await pronovaVesting.connect(admin1).emergencyPause();
            await pronovaVesting.connect(admin2).emergencyPause();

            // Should not be able to claim when paused
            await expect(
                pronovaVesting.connect(foundersWallet).claimTokens()
            ).to.be.revertedWithCustomError(pronovaVesting, "EnforcedPause");
        });

        it("Should allow emergency withdrawal with multi-sig", async function () {
            await pronovaVesting.connect(admin1).initializeVesting();
            await pronovaVesting.connect(admin2).initializeVesting();

            const initialBalance = await pronovaToken.balanceOf(pronovaVesting.target);

            // First admin attempts withdrawal
            await pronovaVesting.connect(admin1).emergencyWithdraw();

            // Tokens should still be in contract
            expect(await pronovaToken.balanceOf(pronovaVesting.target)).to.equal(initialBalance);

            // Second admin confirms
            await pronovaVesting.connect(admin2).emergencyWithdraw();

            // Now tokens should be withdrawn to admin2
            expect(await pronovaToken.balanceOf(admin2.address)).to.be.gt(0);
            expect(await pronovaToken.balanceOf(pronovaVesting.target)).to.equal(0);
        });
    });

    describe("Vesting Information Queries", function () {
        beforeEach(async function () {
            await pronovaVesting.connect(admin1).initializeVesting();
            await pronovaVesting.connect(admin2).initializeVesting();
        });

        it("Should return correct beneficiary information", async function () {
            const foundersInfo = await pronovaVesting.getBeneficiaryInfo(foundersWallet.address);
            const teamInfo = await pronovaVesting.getBeneficiaryInfo(teamWallet.address);
            const partnershipsInfo = await pronovaVesting.getBeneficiaryInfo(partnershipsWallet.address);

            expect(foundersInfo.totalAllocation).to.equal(FOUNDERS_ALLOCATION);
            expect(foundersInfo.totalClaimed).to.equal(0);
            expect(foundersInfo.isActive).to.equal(true);

            expect(teamInfo.totalAllocation).to.equal(TEAM_ALLOCATION);
            expect(partnershipsInfo.totalAllocation).to.equal(PARTNERSHIPS_ALLOCATION);
        });

        it("Should return correct claimable amount", async function () {
            // Fast forward 1 year
            await time.increase(UNLOCK_INTERVAL * 2);

            // Claim once
            await pronovaVesting.connect(foundersWallet).claimTokens();

            // Fast forward another 6 months
            await time.increase(UNLOCK_INTERVAL);

            const claimable = await pronovaVesting.getClaimableAmount(foundersWallet.address);
            const expectedClaimable = FOUNDERS_ALLOCATION * BigInt(UNLOCK_PERCENTAGE) / 10000n;

            expect(claimable).to.equal(expectedClaimable);
        });
    });

    describe("Edge Cases", function () {
        it("Should handle zero vesting before start", async function () {
            // Don't initialize vesting
            const vested = await pronovaVesting.getVestedAmount(foundersWallet.address);
            expect(vested).to.equal(0);
        });

        it("Should not allow initialization twice", async function () {
            await pronovaVesting.connect(admin1).initializeVesting();
            await pronovaVesting.connect(admin2).initializeVesting();

            // Try to initialize again
            await expect(
                pronovaVesting.connect(admin1).initializeVesting()
            ).to.be.revertedWith("Already initialized");
        });

        it("Should handle claims at exact vesting periods", async function () {
            await pronovaVesting.connect(admin1).initializeVesting();
            await pronovaVesting.connect(admin2).initializeVesting();

            const startTime = await pronovaVesting.vestingStartTime();

            // Jump to exact 6-month mark
            await time.increaseTo(startTime + BigInt(UNLOCK_INTERVAL));

            const vested = await pronovaVesting.getVestedAmount(foundersWallet.address);
            const expected = FOUNDERS_ALLOCATION * BigInt(UNLOCK_PERCENTAGE) / 10000n;

            expect(vested).to.equal(expected);
        });
    });
});