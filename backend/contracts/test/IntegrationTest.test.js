const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

describe("Pronova Integration Tests - Full System", function () {
    let pronovaToken, pronovaPresale, pronovaVesting;
    let owner, admin1, admin2, user1, user2, user3;
    let foundersWallet, teamWallet, partnershipsWallet;
    let liquidityWallet, marketingWallet, communityWallet, strategicReservesWallet;
    let stakingContract, mockPriceFeed;

    const TOTAL_SUPPLY = ethers.parseEther("1000000000"); // 1 billion tokens
    const PRESALE_ALLOCATION = ethers.parseEther("250000000"); // 25% (250M)

    beforeEach(async function () {
        [owner, admin1, admin2, user1, user2, user3, foundersWallet, teamWallet,
         partnershipsWallet, liquidityWallet, marketingWallet, communityWallet,
         strategicReservesWallet, stakingContract] = await ethers.getSigners();

        // Deploy mock price feed
        const MockPriceFeed = await ethers.getContractFactory("MockV3Aggregator");
        mockPriceFeed = await MockPriceFeed.deploy(8, 200000000000); // $2000 ETH price
        await mockPriceFeed.waitForDeployment();

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

        // Deploy PronovaPresale
        const PronovaPresale = await ethers.getContractFactory("PronovaPresale");
        pronovaPresale = await PronovaPresale.deploy(
            pronovaToken.target,
            mockPriceFeed.target, // ETH/USD price feed
            mockPriceFeed.target  // BNB/USD price feed
        );
        await pronovaPresale.waitForDeployment();

        // Setup admin roles
        const ADMIN_ROLE_TOKEN = await pronovaToken.ADMIN_ROLE();
        const ADMIN_ROLE_PRESALE = await pronovaPresale.ADMIN_ROLE();
        const ADMIN_ROLE_VESTING = await pronovaVesting.ADMIN_ROLE();

        await pronovaToken.grantRole(ADMIN_ROLE_TOKEN, admin1.address);
        await pronovaToken.grantRole(ADMIN_ROLE_TOKEN, admin2.address);
        await pronovaPresale.grantRole(ADMIN_ROLE_PRESALE, admin1.address);
        await pronovaPresale.grantRole(ADMIN_ROLE_PRESALE, admin2.address);
        await pronovaVesting.grantRole(ADMIN_ROLE_VESTING, admin1.address);
        await pronovaVesting.grantRole(ADMIN_ROLE_VESTING, admin2.address);
    });

    describe("Complete System Integration", function () {
        it("Should execute complete token distribution flow", async function () {
            // Step 1: Set allocation wallets
            await pronovaToken.connect(admin1).setAllocationWallets(
                pronovaPresale.target,
                foundersWallet.address,
                liquidityWallet.address,
                partnershipsWallet.address,
                teamWallet.address,
                communityWallet.address,
                strategicReservesWallet.address,
                marketingWallet.address,
                stakingContract.address,
                pronovaVesting.target
            );

            await pronovaToken.connect(admin2).setAllocationWallets(
                pronovaPresale.target,
                foundersWallet.address,
                liquidityWallet.address,
                partnershipsWallet.address,
                teamWallet.address,
                communityWallet.address,
                strategicReservesWallet.address,
                marketingWallet.address,
                stakingContract.address,
                pronovaVesting.target
            );

            // Step 2: Distribute allocations
            await pronovaToken.connect(admin1).distributeAllocations();
            await pronovaToken.connect(admin2).distributeAllocations();

            // Verify distributions
            expect(await pronovaToken.balanceOf(pronovaPresale.target)).to.equal(ethers.parseEther("250000000"));
            expect(await pronovaToken.balanceOf(liquidityWallet.address)).to.equal(ethers.parseEther("120000000"));
            expect(await pronovaToken.balanceOf(marketingWallet.address)).to.equal(ethers.parseEther("120000000"));
            expect(await pronovaToken.balanceOf(communityWallet.address)).to.equal(ethers.parseEther("50000000"));
            expect(await pronovaToken.balanceOf(strategicReservesWallet.address)).to.equal(ethers.parseEther("60000000"));
            expect(await pronovaToken.balanceOf(stakingContract.address)).to.equal(ethers.parseEther("150000000"));

            // Vested tokens should go to vesting contract
            const vestedAmount = ethers.parseEther("75000000") + // Founders
                              ethers.parseEther("25000000") + // Team
                              ethers.parseEther("150000000"); // Partnerships
            expect(await pronovaToken.balanceOf(pronovaVesting.target)).to.equal(vestedAmount);
        });

        it("Should handle complete presale lifecycle", async function () {
            // Setup token distribution first
            await pronovaToken.connect(admin1).setAllocationWallets(
                pronovaPresale.target, foundersWallet.address, liquidityWallet.address,
                partnershipsWallet.address, teamWallet.address, communityWallet.address,
                strategicReservesWallet.address, marketingWallet.address,
                stakingContract.address, pronovaVesting.target
            );
            await pronovaToken.connect(admin2).setAllocationWallets(
                pronovaPresale.target, foundersWallet.address, liquidityWallet.address,
                partnershipsWallet.address, teamWallet.address, communityWallet.address,
                strategicReservesWallet.address, marketingWallet.address,
                stakingContract.address, pronovaVesting.target
            );
            await pronovaToken.connect(admin1).distributeAllocations();
            await pronovaToken.connect(admin2).distributeAllocations();

            // Start presale
            await pronovaPresale.connect(admin1).startPresale();
            await pronovaPresale.connect(admin2).startPresale();

            // Phase 1 purchase at $0.80
            const ethAmount = ethers.parseEther("1");
            const expectedTokens = (ethAmount * BigInt(2000) * BigInt(1000000)) / BigInt(800000);

            const commitHash = ethers.keccak256(ethers.toUtf8Bytes("secret1"));
            await pronovaPresale.connect(user1).commitPurchase(commitHash);
            await time.increase(1);

            await pronovaPresale.connect(user1).revealAndPurchaseETH("secret1", expectedTokens, {
                value: ethAmount
            });

            // Verify purchase
            expect(await pronovaToken.balanceOf(user1.address)).to.be.closeTo(expectedTokens, ethers.parseEther("100"));

            // Advance to Phase 2
            await pronovaPresale.connect(admin1).advanceToNextPhase();
            await pronovaPresale.connect(admin2).advanceToNextPhase();

            expect(await pronovaPresale.currentPhase()).to.equal(2);

            // Phase 2 purchase at $1.00
            const expectedTokensPhase2 = (ethAmount * BigInt(2000) * BigInt(1000000)) / BigInt(1000000);

            const commitHash2 = ethers.keccak256(ethers.toUtf8Bytes("secret2"));
            await pronovaPresale.connect(user2).commitPurchase(commitHash2);
            await time.increase(1);

            await pronovaPresale.connect(user2).revealAndPurchaseETH("secret2", expectedTokensPhase2, {
                value: ethAmount
            });

            expect(await pronovaToken.balanceOf(user2.address)).to.be.closeTo(expectedTokensPhase2, ethers.parseEther("100"));
        });

        it("Should execute complete vesting lifecycle", async function () {
            // Setup system
            await pronovaToken.connect(admin1).setAllocationWallets(
                pronovaPresale.target, foundersWallet.address, liquidityWallet.address,
                partnershipsWallet.address, teamWallet.address, communityWallet.address,
                strategicReservesWallet.address, marketingWallet.address,
                stakingContract.address, pronovaVesting.target
            );
            await pronovaToken.connect(admin2).setAllocationWallets(
                pronovaPresale.target, foundersWallet.address, liquidityWallet.address,
                partnershipsWallet.address, teamWallet.address, communityWallet.address,
                strategicReservesWallet.address, marketingWallet.address,
                stakingContract.address, pronovaVesting.target
            );
            await pronovaToken.connect(admin1).distributeAllocations();
            await pronovaToken.connect(admin2).distributeAllocations();

            // Initialize vesting
            await pronovaVesting.connect(admin1).initializeVesting();
            await pronovaVesting.connect(admin2).initializeVesting();

            // Fast forward 6 months for first unlock
            await time.increase(180 * 24 * 60 * 60); // 6 months

            // Claim first unlock (2.5% of allocation)
            await pronovaVesting.connect(foundersWallet).claimTokens();

            const foundersBalance = await pronovaToken.balanceOf(foundersWallet.address);
            const expectedFirstUnlock = ethers.parseEther("75000000") * 250n / 10000n; // 2.5% of 75M
            expect(foundersBalance).to.equal(expectedFirstUnlock);

            // Fast forward 2.5 years (5 more periods = 6 total periods)
            await time.increase(5 * 180 * 24 * 60 * 60);

            // Claim accumulated tokens (15% total = 6 * 2.5%)
            await pronovaVesting.connect(foundersWallet).claimTokens();

            const foundersBalanceAfter6Periods = await pronovaToken.balanceOf(foundersWallet.address);
            const expected6Periods = ethers.parseEther("75000000") * 1500n / 10000n; // 15% of 75M
            expect(foundersBalanceAfter6Periods).to.equal(expected6Periods);

            // Fast forward to end (9 years total)
            await time.increase(6.5 * 365 * 24 * 60 * 60); // Remaining time to reach 9 years

            // Claim all remaining tokens
            await pronovaVesting.connect(foundersWallet).claimTokens();

            const finalFoundersBalance = await pronovaToken.balanceOf(foundersWallet.address);
            expect(finalFoundersBalance).to.equal(ethers.parseEther("75000000")); // Full allocation
        });

        it("Should handle referral system in presale", async function () {
            // Setup system
            await pronovaToken.connect(admin1).setAllocationWallets(
                pronovaPresale.target, foundersWallet.address, liquidityWallet.address,
                partnershipsWallet.address, teamWallet.address, communityWallet.address,
                strategicReservesWallet.address, marketingWallet.address,
                stakingContract.address, pronovaVesting.target
            );
            await pronovaToken.connect(admin2).setAllocationWallets(
                pronovaPresale.target, foundersWallet.address, liquidityWallet.address,
                partnershipsWallet.address, teamWallet.address, communityWallet.address,
                strategicReservesWallet.address, marketingWallet.address,
                stakingContract.address, pronovaVesting.target
            );
            await pronovaToken.connect(admin1).distributeAllocations();
            await pronovaToken.connect(admin2).distributeAllocations();

            // Start presale
            await pronovaPresale.connect(admin1).startPresale();
            await pronovaPresale.connect(admin2).startPresale();

            // Set referral
            await pronovaPresale.connect(user1).setReferrer(user3.address);

            // Purchase with referral (should get 5% bonus)
            const ethAmount = ethers.parseEther("1");
            const baseTokens = (ethAmount * BigInt(2000) * BigInt(1000000)) / BigInt(800000);
            const bonusTokens = baseTokens * 5n / 100n; // 5% bonus
            const totalExpected = baseTokens + bonusTokens;

            const commitHash = ethers.keccak256(ethers.toUtf8Bytes("referral_secret"));
            await pronovaPresale.connect(user1).commitPurchase(commitHash);
            await time.increase(1);

            await pronovaPresale.connect(user1).revealAndPurchaseETH("referral_secret", totalExpected, {
                value: ethAmount
            });

            // Verify bonus was applied
            expect(await pronovaToken.balanceOf(user1.address)).to.be.closeTo(totalExpected, ethers.parseEther("100"));
        });

        it("Should handle automatic burn mechanism", async function () {
            // Setup and distribute tokens
            await pronovaToken.connect(admin1).setAllocationWallets(
                pronovaPresale.target, foundersWallet.address, liquidityWallet.address,
                partnershipsWallet.address, teamWallet.address, communityWallet.address,
                strategicReservesWallet.address, marketingWallet.address,
                stakingContract.address, pronovaVesting.target
            );
            await pronovaToken.connect(admin2).setAllocationWallets(
                pronovaPresale.target, foundersWallet.address, liquidityWallet.address,
                partnershipsWallet.address, teamWallet.address, communityWallet.address,
                strategicReservesWallet.address, marketingWallet.address,
                stakingContract.address, pronovaVesting.target
            );
            await pronovaToken.connect(admin1).distributeAllocations();
            await pronovaToken.connect(admin2).distributeAllocations();

            // Enable auto-burn
            await pronovaToken.setAutoBurn(true);

            const transferAmount = ethers.parseEther("10000");
            const burnAmount = transferAmount * 10n / 10000n; // 0.1% burn
            const receiveAmount = transferAmount - burnAmount;

            const initialSupply = await pronovaToken.totalSupply();

            // Transfer with burn
            await pronovaToken.connect(marketingWallet).transfer(user1.address, transferAmount);

            // Verify burn occurred
            expect(await pronovaToken.balanceOf(user1.address)).to.equal(receiveAmount);
            expect(await pronovaToken.totalBurned()).to.equal(burnAmount);
            expect(await pronovaToken.totalSupply()).to.equal(initialSupply - burnAmount);
        });

        it("Should handle emergency situations across all contracts", async function () {
            // Setup system
            await pronovaToken.connect(admin1).setAllocationWallets(
                pronovaPresale.target, foundersWallet.address, liquidityWallet.address,
                partnershipsWallet.address, teamWallet.address, communityWallet.address,
                strategicReservesWallet.address, marketingWallet.address,
                stakingContract.address, pronovaVesting.target
            );
            await pronovaToken.connect(admin2).setAllocationWallets(
                pronovaPresale.target, foundersWallet.address, liquidityWallet.address,
                partnershipsWallet.address, teamWallet.address, communityWallet.address,
                strategicReservesWallet.address, marketingWallet.address,
                stakingContract.address, pronovaVesting.target
            );
            await pronovaToken.connect(admin1).distributeAllocations();
            await pronovaToken.connect(admin2).distributeAllocations();

            // Start presale and vesting
            await pronovaPresale.connect(admin1).startPresale();
            await pronovaPresale.connect(admin2).startPresale();
            await pronovaVesting.connect(admin1).initializeVesting();
            await pronovaVesting.connect(admin2).initializeVesting();

            // Emergency pause all contracts
            const PAUSER_ROLE = await pronovaToken.PAUSER_ROLE();
            await pronovaToken.grantRole(PAUSER_ROLE, admin1.address);
            await pronovaToken.connect(admin1).pause();

            await pronovaPresale.connect(admin1).emergencyPause();
            await pronovaPresale.connect(admin2).emergencyPause();

            await pronovaVesting.connect(admin1).emergencyPause();
            await pronovaVesting.connect(admin2).emergencyPause();

            // Verify all contracts are paused
            expect(await pronovaToken.paused()).to.equal(true);
            expect(await pronovaPresale.paused()).to.equal(true);
            expect(await pronovaVesting.paused()).to.equal(true);

            // Verify operations are blocked
            await expect(
                pronovaToken.connect(marketingWallet).transfer(user1.address, ethers.parseEther("100"))
            ).to.be.revertedWithCustomError(pronovaToken, "EnforcedPause");

            const commitHash = ethers.keccak256(ethers.toUtf8Bytes("test"));
            await expect(
                pronovaPresale.connect(user1).commitPurchase(commitHash)
            ).to.be.revertedWithCustomError(pronovaPresale, "EnforcedPause");

            await expect(
                pronovaVesting.connect(foundersWallet).claimTokens()
            ).to.be.revertedWithCustomError(pronovaVesting, "EnforcedPause");
        });
    });

    describe("System Security Verification", function () {
        it("Should enforce multi-signature requirements across all contracts", async function () {
            // Token contract multi-sig
            await pronovaToken.connect(admin1).setAllocationWallets(
                pronovaPresale.target, foundersWallet.address, liquidityWallet.address,
                partnershipsWallet.address, teamWallet.address, communityWallet.address,
                strategicReservesWallet.address, marketingWallet.address,
                stakingContract.address, pronovaVesting.target
            );
            expect(await pronovaToken.presaleContract()).to.equal(ethers.ZeroAddress); // Not set yet

            await pronovaToken.connect(admin2).setAllocationWallets(
                pronovaPresale.target, foundersWallet.address, liquidityWallet.address,
                partnershipsWallet.address, teamWallet.address, communityWallet.address,
                strategicReservesWallet.address, marketingWallet.address,
                stakingContract.address, pronovaVesting.target
            );
            expect(await pronovaToken.presaleContract()).to.equal(pronovaPresale.target); // Now set

            // Presale multi-sig
            await pronovaPresale.connect(admin1).startPresale();
            expect(await pronovaPresale.presaleActive()).to.equal(false);

            await pronovaPresale.connect(admin2).startPresale();
            expect(await pronovaPresale.presaleActive()).to.equal(true);

            // Vesting multi-sig
            await pronovaVesting.connect(admin1).initializeVesting();
            expect(await pronovaVesting.vestingStarted()).to.equal(false);

            await pronovaVesting.connect(admin2).initializeVesting();
            expect(await pronovaVesting.vestingStarted()).to.equal(true);
        });

        it("Should prevent unauthorized access to critical functions", async function () {
            // Non-admin cannot set token allocations
            await expect(
                pronovaToken.connect(user1).setAllocationWallets(
                    pronovaPresale.target, foundersWallet.address, liquidityWallet.address,
                    partnershipsWallet.address, teamWallet.address, communityWallet.address,
                    strategicReservesWallet.address, marketingWallet.address,
                    stakingContract.address, pronovaVesting.target
                )
            ).to.be.reverted;

            // Non-admin cannot start presale
            await expect(
                pronovaPresale.connect(user1).startPresale()
            ).to.be.reverted;

            // Non-admin cannot initialize vesting
            await expect(
                pronovaVesting.connect(user1).initializeVesting()
            ).to.be.reverted;
        });
    });
});