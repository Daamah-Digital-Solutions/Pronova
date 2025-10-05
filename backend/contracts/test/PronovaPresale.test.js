const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

describe("PronovaPresale - Updated with Whitepaper Specifications", function () {
    let pronovaToken, pronovaPresale;
    let owner, admin1, admin2, user1, user2, user3;
    let mockPriceFeed;

    // Updated prices as per whitepaper ($0.80, $1.00, $1.50)
    const PHASE1_PRICE = 800000; // $0.80 in micro-dollars
    const PHASE2_PRICE = 1000000; // $1.00 in micro-dollars
    const PHASE3_PRICE = 1500000; // $1.50 in micro-dollars

    // Hard cap as per whitepaper ($267.5M)
    const HARD_CAP = ethers.parseUnits("267500000", 6); // $267.5M in micro-dollars

    // Phase allocations (25% = 250M tokens total)
    const PHASE1_ALLOCATION = ethers.parseEther("83333333.33"); // ~83.33M tokens
    const PHASE2_ALLOCATION = ethers.parseEther("83333333.33"); // ~83.33M tokens
    const PHASE3_ALLOCATION = ethers.parseEther("83333333.34"); // ~83.34M tokens

    beforeEach(async function () {
        [owner, admin1, admin2, user1, user2, user3] = await ethers.getSigners();

        // Deploy mock price feed
        const MockPriceFeed = await ethers.getContractFactory("MockV3Aggregator");
        mockPriceFeed = await MockPriceFeed.deploy(8, 200000000000); // $2000 ETH price
        await mockPriceFeed.waitForDeployment();

        // Deploy PronovaToken
        const PronovaToken = await ethers.getContractFactory("PronovaToken");
        pronovaToken = await PronovaToken.deploy();
        await pronovaToken.waitForDeployment();

        // Deploy PronovaPresale
        const PronovaPresale = await ethers.getContractFactory("PronovaPresale");
        pronovaPresale = await PronovaPresale.deploy(
            pronovaToken.target,
            mockPriceFeed.target, // ETH/USD price feed
            mockPriceFeed.target  // BNB/USD price feed
        );
        await pronovaPresale.waitForDeployment();

        // Setup admin roles for multi-sig
        const ADMIN_ROLE = await pronovaPresale.ADMIN_ROLE();
        const PRICE_ORACLE_ROLE = await pronovaPresale.PRICE_ORACLE_ROLE();
        await pronovaPresale.grantRole(ADMIN_ROLE, admin1.address);
        await pronovaPresale.grantRole(ADMIN_ROLE, admin2.address);
        await pronovaPresale.grantRole(PRICE_ORACLE_ROLE, admin1.address);

        // Transfer tokens to presale contract
        const ADMIN_ROLE_TOKEN = await pronovaToken.ADMIN_ROLE();
        await pronovaToken.grantRole(ADMIN_ROLE_TOKEN, admin1.address);
        await pronovaToken.grantRole(ADMIN_ROLE_TOKEN, admin2.address);

        // Set allocation wallets first
        await pronovaToken.connect(admin1).setAllocationWallets(
            pronovaPresale.target,
            user1.address, // founders
            user2.address, // liquidity
            user3.address, // partnerships
            owner.address, // team
            owner.address, // community
            owner.address, // strategic
            owner.address, // marketing
            owner.address, // staking
            owner.address  // vesting
        );

        await pronovaToken.connect(admin2).setAllocationWallets(
            pronovaPresale.target,
            user1.address, // founders
            user2.address, // liquidity
            user3.address, // partnerships
            owner.address, // team
            owner.address, // community
            owner.address, // strategic
            owner.address, // marketing
            owner.address, // staking
            owner.address  // vesting
        );

        // Distribute tokens
        await pronovaToken.connect(admin1).distributeAllocations();
        await pronovaToken.connect(admin2).distributeAllocations();
    });

    describe("Presale Specifications", function () {
        it("Should have correct hard cap of $267.5M", async function () {
            expect(await pronovaPresale.PRESALE_HARD_CAP()).to.equal(HARD_CAP);
        });

        it("Should have correct phase prices as per whitepaper", async function () {
            const phase1 = await pronovaPresale.presalePhases(1);
            const phase2 = await pronovaPresale.presalePhases(2);
            const phase3 = await pronovaPresale.presalePhases(3);

            expect(phase1.pricePerToken).to.equal(PHASE1_PRICE);
            expect(phase2.pricePerToken).to.equal(PHASE2_PRICE);
            expect(phase3.pricePerToken).to.equal(PHASE3_PRICE);
        });

        it("Should have correct phase allocations", async function () {
            const phase1 = await pronovaPresale.presalePhases(1);
            const phase2 = await pronovaPresale.presalePhases(2);
            const phase3 = await pronovaPresale.presalePhases(3);

            expect(phase1.tokenAllocation).to.be.closeTo(PHASE1_ALLOCATION, ethers.parseEther("1000"));
            expect(phase2.tokenAllocation).to.be.closeTo(PHASE2_ALLOCATION, ethers.parseEther("1000"));
            expect(phase3.tokenAllocation).to.be.closeTo(PHASE3_ALLOCATION, ethers.parseEther("1000"));
        });

        it("Should start with phase 1 active", async function () {
            expect(await pronovaPresale.currentPhase()).to.equal(1);
        });
    });

    describe("Multi-Signature Functionality", function () {
        it("Should require 2 confirmations to start presale", async function () {
            // First admin starts
            await pronovaPresale.connect(admin1).startPresale();

            // Presale should not be active yet
            expect(await pronovaPresale.presaleActive()).to.equal(false);

            // Second admin confirms
            await pronovaPresale.connect(admin2).startPresale();

            // Now presale should be active
            expect(await pronovaPresale.presaleActive()).to.equal(true);
        });

        it("Should require 2 confirmations to advance phases", async function () {
            // Start presale first
            await pronovaPresale.connect(admin1).startPresale();
            await pronovaPresale.connect(admin2).startPresale();

            // First admin advances phase
            await pronovaPresale.connect(admin1).advanceToNextPhase();
            expect(await pronovaPresale.currentPhase()).to.equal(1); // Still phase 1

            // Second admin confirms
            await pronovaPresale.connect(admin2).advanceToNextPhase();
            expect(await pronovaPresale.currentPhase()).to.equal(2); // Now phase 2
        });

        it("Should require 2 confirmations to end presale", async function () {
            // Start presale first
            await pronovaPresale.connect(admin1).startPresale();
            await pronovaPresale.connect(admin2).startPresale();

            // First admin ends
            await pronovaPresale.connect(admin1).endPresale();
            expect(await pronovaPresale.presaleActive()).to.equal(true); // Still active

            // Second admin confirms
            await pronovaPresale.connect(admin2).endPresale();
            expect(await pronovaPresale.presaleActive()).to.equal(false); // Now ended
        });
    });

    describe("Token Purchase with Correct Pricing", function () {
        beforeEach(async function () {
            // Start presale
            await pronovaPresale.connect(admin1).startPresale();
            await pronovaPresale.connect(admin2).startPresale();
        });

        it("Should calculate correct tokens for Phase 1 purchase ($0.80)", async function () {
            const ethAmount = ethers.parseEther("1"); // 1 ETH
            const ethPriceUSD = 2000; // $2000 per ETH
            const usdValue = ethAmount * BigInt(ethPriceUSD); // $2000 USD value
            const expectedTokens = usdValue * BigInt(1000000) / BigInt(PHASE1_PRICE); // Tokens at $0.80

            // Commit purchase
            const commitHash = ethers.keccak256(ethers.toUtf8Bytes("secret123"));
            await pronovaPresale.connect(user1).commitPurchase(commitHash);

            // Wait for next block
            await time.increase(1);

            // Reveal purchase
            await pronovaPresale.connect(user1).revealAndPurchaseETH("secret123", expectedTokens, {
                value: ethAmount
            });

            const userBalance = await pronovaToken.balanceOf(user1.address);
            expect(userBalance).to.be.closeTo(expectedTokens, ethers.parseEther("100"));
        });

        it("Should handle phase transitions correctly", async function () {
            // Fill Phase 1 completely
            const phase1Allocation = (await pronovaPresale.presalePhases(1)).tokenAllocation;
            const ethNeededPhase1 = (phase1Allocation * BigInt(PHASE1_PRICE)) / (BigInt(2000) * BigInt(1000000));

            const commitHash1 = ethers.keccak256(ethers.toUtf8Bytes("secret1"));
            await pronovaPresale.connect(user1).commitPurchase(commitHash1);
            await time.increase(1);

            await pronovaPresale.connect(user1).revealAndPurchaseETH("secret1", phase1Allocation, {
                value: ethNeededPhase1 + ethers.parseEther("1") // Add extra to ensure full purchase
            });

            // Should automatically advance to Phase 2
            expect(await pronovaPresale.currentPhase()).to.equal(2);

            // Next purchase should be at Phase 2 price ($1.00)
            const ethAmount = ethers.parseEther("1");
            const expectedTokensPhase2 = (ethAmount * BigInt(2000) * BigInt(1000000)) / BigInt(PHASE2_PRICE);

            const commitHash2 = ethers.keccak256(ethers.toUtf8Bytes("secret2"));
            await pronovaPresale.connect(user2).commitPurchase(commitHash2);
            await time.increase(1);

            await pronovaPresale.connect(user2).revealAndPurchaseETH("secret2", expectedTokensPhase2, {
                value: ethAmount
            });

            const user2Balance = await pronovaToken.balanceOf(user2.address);
            expect(user2Balance).to.be.closeTo(expectedTokensPhase2, ethers.parseEther("100"));
        });
    });

    describe("Slippage Protection", function () {
        beforeEach(async function () {
            await pronovaPresale.connect(admin1).startPresale();
            await pronovaPresale.connect(admin2).startPresale();
        });

        it("Should reject purchase if tokens received is less than expected", async function () {
            const ethAmount = ethers.parseEther("1");
            const unrealisticExpectedTokens = ethers.parseEther("10000000"); // Way too high

            const commitHash = ethers.keccak256(ethers.toUtf8Bytes("secret"));
            await pronovaPresale.connect(user1).commitPurchase(commitHash);
            await time.increase(1);

            await expect(
                pronovaPresale.connect(user1).revealAndPurchaseETH("secret", unrealisticExpectedTokens, {
                    value: ethAmount
                })
            ).to.be.revertedWith("Slippage protection: insufficient tokens");
        });
    });

    describe("Referral System", function () {
        beforeEach(async function () {
            await pronovaPresale.connect(admin1).startPresale();
            await pronovaPresale.connect(admin2).startPresale();
        });

        it("Should provide 5% referral bonus as specified", async function () {
            const ethAmount = ethers.parseEther("1");
            const baseTokens = (ethAmount * BigInt(2000) * BigInt(1000000)) / BigInt(PHASE1_PRICE);
            const bonusTokens = baseTokens * 5n / 100n; // 5% bonus
            const totalExpectedTokens = baseTokens + bonusTokens;

            // Set referral first
            await pronovaPresale.connect(user1).setReferrer(user3.address);

            const commitHash = ethers.keccak256(ethers.toUtf8Bytes("secret"));
            await pronovaPresale.connect(user1).commitPurchase(commitHash);
            await time.increase(1);

            await pronovaPresale.connect(user1).revealAndPurchaseETH("secret", totalExpectedTokens, {
                value: ethAmount
            });

            const userBalance = await pronovaToken.balanceOf(user1.address);
            expect(userBalance).to.be.closeTo(totalExpectedTokens, ethers.parseEther("100"));
        });
    });

    describe("MEV Protection", function () {
        it("Should prevent same-block reveal and commit", async function () {
            await pronovaPresale.connect(admin1).startPresale();
            await pronovaPresale.connect(admin2).startPresale();

            const commitHash = ethers.keccak256(ethers.toUtf8Bytes("secret"));
            await pronovaPresale.connect(user1).commitPurchase(commitHash);

            // Try to reveal in same block (should fail)
            await expect(
                pronovaPresale.connect(user1).revealAndPurchaseETH("secret", ethers.parseEther("1000"), {
                    value: ethers.parseEther("1")
                })
            ).to.be.revertedWith("Must wait at least one block");
        });
    });

    describe("Hard Cap Enforcement", function () {
        beforeEach(async function () {
            await pronovaPresale.connect(admin1).startPresale();
            await pronovaPresale.connect(admin2).startPresale();
        });

        it("Should enforce hard cap of $267.5M", async function () {
            // Try to exceed hard cap
            const excessiveAmount = ethers.parseEther("200000"); // Very large amount

            const commitHash = ethers.keccak256(ethers.toUtf8Bytes("secret"));
            await pronovaPresale.connect(user1).commitPurchase(commitHash);
            await time.increase(1);

            await expect(
                pronovaPresale.connect(user1).revealAndPurchaseETH("secret", ethers.parseEther("1000"), {
                    value: excessiveAmount
                })
            ).to.be.revertedWith("Hard cap exceeded");
        });
    });

    describe("Emergency Functions", function () {
        it("Should allow emergency pause with multi-sig", async function () {
            await pronovaPresale.connect(admin1).startPresale();
            await pronovaPresale.connect(admin2).startPresale();

            // First admin pauses
            await pronovaPresale.connect(admin1).emergencyPause();
            expect(await pronovaPresale.paused()).to.equal(false); // Not paused yet

            // Second admin confirms
            await pronovaPresale.connect(admin2).emergencyPause();
            expect(await pronovaPresale.paused()).to.equal(true); // Now paused
        });

        it("Should reject purchases when paused", async function () {
            await pronovaPresale.connect(admin1).startPresale();
            await pronovaPresale.connect(admin2).startPresale();

            await pronovaPresale.connect(admin1).emergencyPause();
            await pronovaPresale.connect(admin2).emergencyPause();

            const commitHash = ethers.keccak256(ethers.toUtf8Bytes("secret"));

            await expect(
                pronovaPresale.connect(user1).commitPurchase(commitHash)
            ).to.be.revertedWithCustomError(pronovaPresale, "EnforcedPause");
        });
    });

    describe("Price Oracle Integration", function () {
        it("Should use Chainlink price feeds for calculations", async function () {
            await pronovaPresale.connect(admin1).startPresale();
            await pronovaPresale.connect(admin2).startPresale();

            // Update ETH price to $3000
            await mockPriceFeed.updateAnswer(300000000000); // $3000 with 8 decimals

            const ethAmount = ethers.parseEther("1");
            const expectedTokens = (ethAmount * BigInt(3000) * BigInt(1000000)) / BigInt(PHASE1_PRICE);

            const commitHash = ethers.keccak256(ethers.toUtf8Bytes("secret"));
            await pronovaPresale.connect(user1).commitPurchase(commitHash);
            await time.increase(1);

            await pronovaPresale.connect(user1).revealAndPurchaseETH("secret", expectedTokens, {
                value: ethAmount
            });

            const userBalance = await pronovaToken.balanceOf(user1.address);
            expect(userBalance).to.be.closeTo(expectedTokens, ethers.parseEther("100"));
        });

        it("Should enforce price bounds", async function () {
            // Try to set unrealistic price
            await expect(
                pronovaPresale.connect(admin1).updateETHPrice(100) // $0.01 - too low
            ).to.be.revertedWith("Price out of bounds");

            await expect(
                pronovaPresale.connect(admin1).updateETHPrice(1000000000000) // $10M - too high
            ).to.be.revertedWith("Price out of bounds");
        });
    });
});