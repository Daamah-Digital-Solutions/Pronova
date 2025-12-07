const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

describe("PronovaToken - Updated with Whitepaper Specifications", function () {
    let pronovaToken;
    let owner, admin1, admin2, user1, user2;
    let presaleContract, vestingContract, liquidityWallet, marketingWallet;
    let communityWallet, strategicReservesWallet, stakingContract;
    let foundersWallet, teamWallet, partnershipsWallet, treasuryWallet;

    const TOTAL_SUPPLY = ethers.parseEther("1000000000"); // 1 billion tokens
    const PRESALE_ALLOCATION = ethers.parseEther("250000000"); // 25% (250M)
    const FOUNDERS_ALLOCATION = ethers.parseEther("140000000"); // 14% (140M)
    const LIQUIDITY_ALLOCATION = ethers.parseEther("150000000"); // 15% (150M)
    const PARTNERSHIPS_ALLOCATION = ethers.parseEther("150000000"); // 15% (150M)
    const TEAM_ALLOCATION = ethers.parseEther("50000000"); // 5% (50M)
    const COMMUNITY_ALLOCATION = ethers.parseEther("80000000"); // 8% (80M)
    const STRATEGIC_RESERVES_ALLOCATION = ethers.parseEther("60000000"); // 6% (60M)
    const MARKETING_ALLOCATION = ethers.parseEther("120000000"); // 12% (120M)
    const STAKING_REWARDS_ALLOCATION = ethers.parseEther("0"); // 0% (removed)

    beforeEach(async function () {
        [owner, admin1, admin2, user1, user2, presaleContract, vestingContract,
         liquidityWallet, marketingWallet, communityWallet, strategicReservesWallet,
         stakingContract, foundersWallet, teamWallet, partnershipsWallet, treasuryWallet] = await ethers.getSigners();

        const PronovaToken = await ethers.getContractFactory("PronovaToken");
        // AUDIT FIX: Constructor now requires treasuryWallet parameter
        pronovaToken = await PronovaToken.deploy(treasuryWallet.address);
        await pronovaToken.waitForDeployment();

        // Grant admin roles for multi-sig testing
        const ADMIN_ROLE = await pronovaToken.ADMIN_ROLE();
        await pronovaToken.grantRole(ADMIN_ROLE, admin1.address);
        await pronovaToken.grantRole(ADMIN_ROLE, admin2.address);
    });

    describe("Token Specifications", function () {
        it("Should have correct name and symbol", async function () {
            expect(await pronovaToken.name()).to.equal("Pronova");
            expect(await pronovaToken.symbol()).to.equal("PRN");
        });

        it("Should have correct total supply of 1 billion tokens", async function () {
            expect(await pronovaToken.totalSupply()).to.equal(TOTAL_SUPPLY);
        });

        it("Should have 18 decimals", async function () {
            expect(await pronovaToken.decimals()).to.equal(18);
        });
    });

    describe("Allocation Percentages (Optimized Model)", function () {
        it("Should have correct allocation amounts as per optimized model", async function () {
            const allocations = await pronovaToken.getAllocationInfo();

            expect(allocations[0]).to.equal(PRESALE_ALLOCATION);
            expect(allocations[1]).to.equal(FOUNDERS_ALLOCATION);
            expect(allocations[2]).to.equal(LIQUIDITY_ALLOCATION);
            expect(allocations[3]).to.equal(PARTNERSHIPS_ALLOCATION);
            expect(allocations[4]).to.equal(TEAM_ALLOCATION);
            expect(allocations[5]).to.equal(COMMUNITY_ALLOCATION);
            expect(allocations[6]).to.equal(STRATEGIC_RESERVES_ALLOCATION);
            expect(allocations[7]).to.equal(MARKETING_ALLOCATION);

            // Verify total equals 100% (excluding staking which was removed)
            const total = PRESALE_ALLOCATION + FOUNDERS_ALLOCATION + LIQUIDITY_ALLOCATION +
                         PARTNERSHIPS_ALLOCATION + TEAM_ALLOCATION + COMMUNITY_ALLOCATION +
                         STRATEGIC_RESERVES_ALLOCATION + MARKETING_ALLOCATION;
            expect(total).to.equal(TOTAL_SUPPLY);
        });
    });

    describe("Multi-Signature Functionality", function () {
        it("Should require 2 confirmations for setting allocation wallets", async function () {
            // First admin confirmation
            // AUDIT FIX: setAllocationWallets now has 9 parameters (staking removed)
            await pronovaToken.connect(admin1).setAllocationWallets(
                presaleContract.address,
                foundersWallet.address,
                liquidityWallet.address,
                partnershipsWallet.address,
                teamWallet.address,
                communityWallet.address,
                strategicReservesWallet.address,
                marketingWallet.address,
                vestingContract.address
            );

            // Wallets should not be set yet
            expect(await pronovaToken.presaleContract()).to.equal(ethers.ZeroAddress);

            // Second admin confirmation
            await pronovaToken.connect(admin2).setAllocationWallets(
                presaleContract.address,
                foundersWallet.address,
                liquidityWallet.address,
                partnershipsWallet.address,
                teamWallet.address,
                communityWallet.address,
                strategicReservesWallet.address,
                marketingWallet.address,
                vestingContract.address
            );

            // Now wallets should be set
            expect(await pronovaToken.presaleContract()).to.equal(presaleContract.address);
            expect(await pronovaToken.vestingContract()).to.equal(vestingContract.address);
        });

        it("Should require 2 confirmations for distributing allocations", async function () {
            // Set wallets first (requires multi-sig)
            // AUDIT FIX: setAllocationWallets now has 9 parameters (staking removed)
            await pronovaToken.connect(admin1).setAllocationWallets(
                presaleContract.address,
                foundersWallet.address,
                liquidityWallet.address,
                partnershipsWallet.address,
                teamWallet.address,
                communityWallet.address,
                strategicReservesWallet.address,
                marketingWallet.address,
                vestingContract.address
            );

            await pronovaToken.connect(admin2).setAllocationWallets(
                presaleContract.address,
                foundersWallet.address,
                liquidityWallet.address,
                partnershipsWallet.address,
                teamWallet.address,
                communityWallet.address,
                strategicReservesWallet.address,
                marketingWallet.address,
                vestingContract.address
            );

            // First admin distributes
            await pronovaToken.connect(admin1).distributeAllocations();

            // Check allocations not distributed yet
            expect(await pronovaToken.allocationsDistributed()).to.equal(false);

            // Second admin distributes
            await pronovaToken.connect(admin2).distributeAllocations();

            // Now should be distributed
            expect(await pronovaToken.allocationsDistributed()).to.equal(true);

            // Verify correct distribution
            expect(await pronovaToken.balanceOf(presaleContract.address)).to.equal(PRESALE_ALLOCATION);
            expect(await pronovaToken.balanceOf(liquidityWallet.address)).to.equal(LIQUIDITY_ALLOCATION);
            expect(await pronovaToken.balanceOf(marketingWallet.address)).to.equal(MARKETING_ALLOCATION);
            expect(await pronovaToken.balanceOf(communityWallet.address)).to.equal(COMMUNITY_ALLOCATION);
            expect(await pronovaToken.balanceOf(strategicReservesWallet.address)).to.equal(STRATEGIC_RESERVES_ALLOCATION);
            expect(await pronovaToken.balanceOf(stakingContract.address)).to.equal(STAKING_REWARDS_ALLOCATION);

            // Vested amounts go to vesting contract
            const vestedAmount = FOUNDERS_ALLOCATION + TEAM_ALLOCATION + PARTNERSHIPS_ALLOCATION;
            expect(await pronovaToken.balanceOf(vestingContract.address)).to.equal(vestedAmount);
        });
    });

    describe("Vesting Parameters (9-Year Period)", function () {
        it("Should have correct vesting duration of 9 years", async function () {
            const vestingInfo = await pronovaToken.getVestingInfo();
            const nineyears = 9n * 365n * 24n * 60n * 60n; // 9 years in seconds
            expect(vestingInfo.vestingDuration).to.equal(nineyears);
        });

        it("Should have correct unlock interval of 6 months", async function () {
            const vestingInfo = await pronovaToken.getVestingInfo();
            const sixMonths = 180n * 24n * 60n * 60n; // 180 days in seconds
            expect(vestingInfo.unlockInterval).to.equal(sixMonths);
        });

        it("Should have correct unlock percentage of 2.5% per interval", async function () {
            const vestingInfo = await pronovaToken.getVestingInfo();
            expect(vestingInfo.unlockPercentage).to.equal(250); // 2.5% in basis points
        });

        it("Should lock 45% of tokens as specified", async function () {
            const vestingInfo = await pronovaToken.getVestingInfo();
            expect(vestingInfo.lockedPercentage).to.equal(45);
        });
    });

    describe("Automatic Burn Mechanism", function () {
        beforeEach(async function () {
            // Setup allocations for testing
            // AUDIT FIX: setAllocationWallets now has 9 parameters (staking removed)
            await pronovaToken.connect(admin1).setAllocationWallets(
                presaleContract.address,
                foundersWallet.address,
                liquidityWallet.address,
                partnershipsWallet.address,
                teamWallet.address,
                communityWallet.address,
                strategicReservesWallet.address,
                marketingWallet.address,
                vestingContract.address
            );

            await pronovaToken.connect(admin2).setAllocationWallets(
                presaleContract.address,
                foundersWallet.address,
                liquidityWallet.address,
                partnershipsWallet.address,
                teamWallet.address,
                communityWallet.address,
                strategicReservesWallet.address,
                marketingWallet.address,
                vestingContract.address
            );

            await pronovaToken.connect(admin1).distributeAllocations();
            await pronovaToken.connect(admin2).distributeAllocations();
        });

        it("Should burn 0.1% of tokens on transfer when auto-burn is enabled", async function () {
            // Enable auto-burn
            await pronovaToken.setAutoBurn(true);

            const transferAmount = ethers.parseEther("1000");
            const burnAmount = transferAmount * 10n / 10000n; // 0.1%
            const receiveAmount = transferAmount - burnAmount;

            // Transfer from marketing wallet to user1
            await pronovaToken.connect(marketingWallet).transfer(user1.address, transferAmount);

            expect(await pronovaToken.balanceOf(user1.address)).to.equal(receiveAmount);
            expect(await pronovaToken.totalBurned()).to.equal(burnAmount);
        });

        it("Should not burn when auto-burn is disabled", async function () {
            // Auto-burn is disabled by default
            const transferAmount = ethers.parseEther("1000");

            await pronovaToken.connect(marketingWallet).transfer(user1.address, transferAmount);

            expect(await pronovaToken.balanceOf(user1.address)).to.equal(transferAmount);
            expect(await pronovaToken.totalBurned()).to.equal(0);
        });
    });

    describe("Pause Functionality", function () {
        beforeEach(async function () {
            // Setup and distribute tokens for pause testing
            await pronovaToken.connect(admin1).setAllocationWallets(
                presaleContract.address,
                foundersWallet.address,
                liquidityWallet.address,
                partnershipsWallet.address,
                teamWallet.address,
                communityWallet.address,
                strategicReservesWallet.address,
                marketingWallet.address,
                vestingContract.address
            );

            await pronovaToken.connect(admin2).setAllocationWallets(
                presaleContract.address,
                foundersWallet.address,
                liquidityWallet.address,
                partnershipsWallet.address,
                teamWallet.address,
                communityWallet.address,
                strategicReservesWallet.address,
                marketingWallet.address,
                vestingContract.address
            );

            await pronovaToken.connect(admin1).distributeAllocations();
            await pronovaToken.connect(admin2).distributeAllocations();
        });

        it("Should allow pauser to pause and unpause transfers", async function () {
            const PAUSER_ROLE = await pronovaToken.PAUSER_ROLE();
            await pronovaToken.grantRole(PAUSER_ROLE, admin1.address);

            // Setup for transfer test - use marketingWallet which has tokens
            await pronovaToken.connect(marketingWallet).transfer(user1.address, ethers.parseEther("100"));

            // Pause the contract
            await pronovaToken.connect(admin1).pause();

            // Transfer should fail when paused
            await expect(
                pronovaToken.connect(user1).transfer(user2.address, ethers.parseEther("50"))
            ).to.be.revertedWithCustomError(pronovaToken, "EnforcedPause");

            // Unpause
            await pronovaToken.connect(admin1).unpause();

            // Transfer should work now
            await pronovaToken.connect(user1).transfer(user2.address, ethers.parseEther("50"));
            expect(await pronovaToken.balanceOf(user2.address)).to.equal(ethers.parseEther("50"));
        });
    });

    describe("Access Control", function () {
        it("Should not allow non-admin to set allocation wallets", async function () {
            await expect(
                pronovaToken.connect(user1).setAllocationWallets(
                    presaleContract.address,
                    foundersWallet.address,
                    liquidityWallet.address,
                    partnershipsWallet.address,
                    teamWallet.address,
                    communityWallet.address,
                    strategicReservesWallet.address,
                    marketingWallet.address,
                    vestingContract.address
                )
            ).to.be.reverted;
        });

        it("Should not allow non-admin to distribute allocations", async function () {
            await expect(
                pronovaToken.connect(user1).distributeAllocations()
            ).to.be.reverted;
        });

        it("Should allow DEFAULT_ADMIN to add and remove admins", async function () {
            const ADMIN_ROLE = await pronovaToken.ADMIN_ROLE();

            await pronovaToken.addAdmin(user1.address);
            expect(await pronovaToken.hasRole(ADMIN_ROLE, user1.address)).to.equal(true);

            await pronovaToken.removeAdmin(user1.address);
            expect(await pronovaToken.hasRole(ADMIN_ROLE, user1.address)).to.equal(false);
        });
    });

    describe("Emergency Withdrawal", function () {
        it("Should require multi-sig for emergency withdrawal", async function () {
            // AUDIT FIX: Emergency withdrawal routes to treasuryWallet (not msg.sender)
            const contractBalance = await pronovaToken.balanceOf(pronovaToken.target);
            const initialTreasuryBalance = await pronovaToken.balanceOf(treasuryWallet.address);

            // Verify contract has tokens (all 1B initially)
            expect(contractBalance).to.equal(ethers.parseEther("1000000000"));

            // First admin attempts withdrawal
            await pronovaToken.connect(admin1).emergencyWithdraw();

            // Treasury balance shouldn't change yet (need 2 confirmations)
            expect(await pronovaToken.balanceOf(treasuryWallet.address)).to.equal(initialTreasuryBalance);

            // Second admin confirms
            await pronovaToken.connect(admin2).emergencyWithdraw();

            // AUDIT FIX: Tokens go to treasuryWallet
            expect(await pronovaToken.balanceOf(treasuryWallet.address)).to.equal(contractBalance);
            expect(await pronovaToken.balanceOf(pronovaToken.target)).to.equal(0);
        });

        it("Should prevent emergency withdraw after distribution", async function () {
            // Setup and distribute tokens first
            await pronovaToken.connect(admin1).setAllocationWallets(
                presaleContract.address,
                foundersWallet.address,
                liquidityWallet.address,
                partnershipsWallet.address,
                teamWallet.address,
                communityWallet.address,
                strategicReservesWallet.address,
                marketingWallet.address,
                vestingContract.address
            );

            await pronovaToken.connect(admin2).setAllocationWallets(
                presaleContract.address,
                foundersWallet.address,
                liquidityWallet.address,
                partnershipsWallet.address,
                teamWallet.address,
                communityWallet.address,
                strategicReservesWallet.address,
                marketingWallet.address,
                vestingContract.address
            );

            await pronovaToken.connect(admin1).distributeAllocations();
            await pronovaToken.connect(admin2).distributeAllocations();

            // Now emergency withdraw should be blocked
            await expect(
                pronovaToken.connect(admin1).emergencyWithdraw()
            ).to.be.revertedWith("Cannot withdraw after distribution");
        });
    });

});