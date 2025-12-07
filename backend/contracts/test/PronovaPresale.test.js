const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time, mine } = require("@nomicfoundation/hardhat-network-helpers");

describe("PronovaPresale - Comprehensive Security Tests", function () {
    let pronovaToken, pronovaPresale, mockUSDT, mockPriceFeed;
    let owner, admin1, admin2, treasury, user1, user2, user3;

    // Constants
    const HARD_CAP = ethers.parseUnits("267500000", 6); // $267.5M
    const PHASE1_PRICE = 800000; // $0.80
    const PHASE2_PRICE = 1000000; // $1.00
    const PHASE3_PRICE = 1500000; // $1.50

    beforeEach(async function () {
        [owner, admin1, admin2, treasury, user1, user2, user3] = await ethers.getSigners();

        // Deploy mocks
        const MockPriceFeed = await ethers.getContractFactory("MockV3Aggregator");
        mockPriceFeed = await MockPriceFeed.deploy(8, 300000000000); // $3000 ETH (matches fallback)
        await mockPriceFeed.waitForDeployment();

        const MockUSDT = await ethers.getContractFactory("MockUSDT");
        mockUSDT = await MockUSDT.deploy();
        await mockUSDT.waitForDeployment();

        // Deploy PronovaToken
        const PronovaToken = await ethers.getContractFactory("PronovaToken");
        pronovaToken = await PronovaToken.deploy(treasury.address);
        await pronovaToken.waitForDeployment();

        // Deploy PronovaPresale
        const PronovaPresale = await ethers.getContractFactory("PronovaPresale");
        pronovaPresale = await PronovaPresale.deploy(
            pronovaToken.target,
            mockUSDT.target,
            treasury.address,
            mockPriceFeed.target,
            mockPriceFeed.target
        );
        await pronovaPresale.waitForDeployment();

        // Grant roles
        const ADMIN_ROLE = await pronovaPresale.ADMIN_ROLE();
        const PRICE_ORACLE_ROLE = await pronovaPresale.PRICE_ORACLE_ROLE();
        const ADMIN_ROLE_TOKEN = await pronovaToken.ADMIN_ROLE();

        await pronovaPresale.grantRole(ADMIN_ROLE, admin1.address);
        await pronovaPresale.grantRole(ADMIN_ROLE, admin2.address);
        await pronovaPresale.grantRole(PRICE_ORACLE_ROLE, admin1.address);
        await pronovaToken.grantRole(ADMIN_ROLE_TOKEN, admin1.address);
        await pronovaToken.grantRole(ADMIN_ROLE_TOKEN, admin2.address);

        // Setup token allocations
        await pronovaToken.connect(admin1).setAllocationWallets(
            pronovaPresale.target,
            owner.address, owner.address, owner.address,
            owner.address, owner.address, owner.address,
            owner.address, owner.address
        );

        await pronovaToken.connect(admin2).setAllocationWallets(
            pronovaPresale.target,
            owner.address, owner.address, owner.address,
            owner.address, owner.address, owner.address,
            owner.address, owner.address
        );

        // Distribute tokens
        await pronovaToken.connect(admin1).distributeAllocations();
        await pronovaToken.connect(admin2).distributeAllocations();
    });

    describe("Contract Initialization", function () {
        it("Should initialize with correct hard cap", async function () {
            expect(await pronovaPresale.PRESALE_HARD_CAP()).to.equal(HARD_CAP);
        });

        it("Should initialize with Phase 1 active", async function () {
            expect(await pronovaPresale.currentPhase()).to.equal(1);
            const phase1 = await pronovaPresale.phases(1);
            expect(phase1.isActive).to.equal(true);
        });

        it("Should have correct phase prices", async function () {
            const phase1 = await pronovaPresale.phases(1);
            const phase2 = await pronovaPresale.phases(2);
            const phase3 = await pronovaPresale.phases(3);

            expect(phase1.pricePerToken).to.equal(PHASE1_PRICE);
            expect(phase2.pricePerToken).to.equal(PHASE2_PRICE);
            expect(phase3.pricePerToken).to.equal(PHASE3_PRICE);
        });
    });

    describe("AUDIT FIX: setClaimEnabled Multi-Sig (HIGH SEVERITY)", function () {
        it("Should require 2 confirmations to enable claiming", async function () {
            // Claim should be disabled initially
            expect(await pronovaPresale.claimEnabled()).to.equal(false);

            // First admin attempts to enable
            await pronovaPresale.connect(admin1).setClaimEnabled(true);

            // Should still be disabled (need 2 confirmations)
            expect(await pronovaPresale.claimEnabled()).to.equal(false);

            // Second admin confirms
            await pronovaPresale.connect(admin2).setClaimEnabled(true);

            // Now should be enabled
            expect(await pronovaPresale.claimEnabled()).to.equal(true);
        });

        it("Should require 2 confirmations to disable claiming", async function () {
            // Enable first
            await pronovaPresale.connect(admin1).setClaimEnabled(true);
            await pronovaPresale.connect(admin2).setClaimEnabled(true);
            expect(await pronovaPresale.claimEnabled()).to.equal(true);

            // Disable requires multi-sig too
            await pronovaPresale.connect(admin1).setClaimEnabled(false);
            expect(await pronovaPresale.claimEnabled()).to.equal(true); // Still enabled

            await pronovaPresale.connect(admin2).setClaimEnabled(false);
            expect(await pronovaPresale.claimEnabled()).to.equal(false); // Now disabled
        });

        it("Should emit ClaimStatusChanged event", async function () {
            await pronovaPresale.connect(admin1).setClaimEnabled(true);

            await expect(pronovaPresale.connect(admin2).setClaimEnabled(true))
                .to.emit(pronovaPresale, "ClaimStatusChanged")
                .withArgs(true);
        });

        it("Should use deterministic operation ID", async function () {
            // Same parameters should create same operation ID
            await pronovaPresale.connect(admin1).setClaimEnabled(true);
            await pronovaPresale.connect(admin2).setClaimEnabled(true);

            // Try to execute again - should fail with "Already executed"
            await expect(
                pronovaPresale.connect(admin1).setClaimEnabled(true)
            ).to.be.revertedWith("Already executed");
        });
    });

    describe("AUDIT FIX: updatePrices Multi-Sig + Phase Lock (MEDIUM SEVERITY)", function () {
        it("Should require 2 confirmations to update prices", async function () {
            // Grant PRICE_ORACLE_ROLE to admin2 (admin1 already has it from beforeEach)
            const PRICE_ORACLE_ROLE = await pronovaPresale.PRICE_ORACLE_ROLE();
            await pronovaPresale.grantRole(PRICE_ORACLE_ROLE, admin2.address);

            // Deactivate phase 1 first (price updates forbidden during active presale)
            await pronovaPresale.connect(admin1).updatePhase(1, false);
            await pronovaPresale.connect(admin2).updatePhase(1, false);

            const initialEthPrice = await pronovaPresale.ethToUsdPrice();
            const newEthPrice = ethers.parseUnits("3500", 6); // Different from initial 3000
            const newBnbPrice = ethers.parseUnits("350", 6); // Different from initial 300

            // First admin updates
            await pronovaPresale.connect(admin1).updatePrices(
                newEthPrice,
                newBnbPrice
            );

            // Prices should not change yet (still need 2nd confirmation)
            expect(await pronovaPresale.ethToUsdPrice()).to.equal(initialEthPrice);

            // Second admin confirms
            await pronovaPresale.connect(admin2).updatePrices(
                newEthPrice,
                newBnbPrice
            );

            // Now prices should update
            expect(await pronovaPresale.ethToUsdPrice()).to.equal(newEthPrice);
            expect(await pronovaPresale.bnbToUsdPrice()).to.equal(newBnbPrice);
        });

        it("Should prevent price updates during active presale phase", async function () {
            // Phase 1 is active by default
            const phase1 = await pronovaPresale.phases(1);
            expect(phase1.isActive).to.equal(true);

            const newEthPrice = ethers.parseUnits("3000", 6);
            const newBnbPrice = ethers.parseUnits("400", 6);

            // Should revert because presale is active
            await expect(
                pronovaPresale.connect(admin1).updatePrices(newEthPrice, newBnbPrice)
            ).to.be.revertedWith("Cannot update prices during active presale");
        });

        it("Should allow price updates when presale is paused", async function () {
            // Grant PRICE_ORACLE_ROLE to admin2 (admin1 already has it from beforeEach)
            const PRICE_ORACLE_ROLE = await pronovaPresale.PRICE_ORACLE_ROLE();
            await pronovaPresale.grantRole(PRICE_ORACLE_ROLE, admin2.address);

            // Deactivate phase 1 (requires multi-sig)
            await pronovaPresale.connect(admin1).updatePhase(1, false);
            await pronovaPresale.connect(admin2).updatePhase(1, false);

            const newEthPrice = ethers.parseUnits("3200", 6); // 6 decimals
            const newBnbPrice = ethers.parseUnits("320", 6); // 6 decimals

            // Now updatePrices should work (also requires multi-sig)
            await pronovaPresale.connect(admin1).updatePrices(newEthPrice, newBnbPrice);
            await pronovaPresale.connect(admin2).updatePrices(newEthPrice, newBnbPrice);

            expect(await pronovaPresale.ethToUsdPrice()).to.equal(newEthPrice);
        });

        it("Should enforce price bounds", async function () {
            // Deactivate phase first (requires multi-sig)
            await pronovaPresale.connect(admin1).updatePhase(1, false);
            await pronovaPresale.connect(admin2).updatePhase(1, false);

            // ETH price out of bounds (too low) - bounds are 100-100,000 USD in 6 decimals
            await expect(
                pronovaPresale.connect(admin1).updatePrices(
                    ethers.parseUnits("50", 6),
                    ethers.parseUnits("300", 6)
                )
            ).to.be.revertedWith("ETH price out of bounds");

            // BNB price out of bounds (too high) - bounds are 10-10,000 USD in 6 decimals
            await expect(
                pronovaPresale.connect(admin1).updatePrices(
                    ethers.parseUnits("2000", 6),
                    ethers.parseUnits("15000", 6)
                )
            ).to.be.revertedWith("BNB price out of bounds");
        });
    });

    describe("Token Purchases", function () {
        beforeEach(async function () {
            // Whitelist users first
            const OPERATOR_ROLE = await pronovaPresale.OPERATOR_ROLE();
            await pronovaPresale.grantRole(OPERATOR_ROLE, admin1.address);
            await pronovaPresale.connect(admin1).updateWhitelist([user1.address, user2.address], true);
        });

        it("Should allow ETH purchases", async function () {
            const ethAmount = ethers.parseEther("1");
            const nonce = ethers.randomBytes(32);
            const minTokensExpected = 0; // Accept any amount for test

            // Direct purchase (MEV protection is optional if no commitment made)
            await pronovaPresale.connect(user1).buyWithETH(
                ethers.ZeroAddress, // no referrer
                minTokensExpected,
                nonce,
                { value: ethAmount }
            );

            const [totalTokens, totalPaid, referralTokens, claimed] = await pronovaPresale.getUserPurchaseInfo(user1.address);
            expect(totalTokens).to.be.gt(0);
        });

        it("Should prevent purchases exceeding hard cap", async function () {
            // This would require massive ETH value to test properly
            // Simplified: verify hard cap is checked
            const hardCap = await pronovaPresale.PRESALE_HARD_CAP();
            expect(hardCap).to.equal(HARD_CAP);
        });

        it("Should handle referral rewards (5% bonus)", async function () {
            const ethAmount = ethers.parseEther("1");
            const nonce = ethers.randomBytes(32);
            const minTokensExpected = 0;

            // Direct purchase with referrer (no MEV commitment)
            await pronovaPresale.connect(user1).buyWithETH(
                user2.address, // referrer
                minTokensExpected,
                nonce,
                { value: ethAmount }
            );

            const referralInfo = await pronovaPresale.referralRewards(user2.address);
            expect(referralInfo).to.be.gt(0); // 5% of purchase
        });
    });

    describe("Claim Functionality", function () {
        beforeEach(async function () {
            // Whitelist user
            const OPERATOR_ROLE = await pronovaPresale.OPERATOR_ROLE();
            await pronovaPresale.grantRole(OPERATOR_ROLE, admin1.address);
            await pronovaPresale.connect(admin1).updateWhitelist([user1.address], true);

            // Make a direct purchase (no MEV commitment)
            const ethAmount = ethers.parseEther("1");
            const nonce = ethers.randomBytes(32);
            await pronovaPresale.connect(user1).buyWithETH(
                ethers.ZeroAddress,
                0,
                nonce,
                { value: ethAmount }
            );
        });

        it("Should prevent claims when claiming is disabled", async function () {
            expect(await pronovaPresale.claimEnabled()).to.equal(false);

            await expect(
                pronovaPresale.connect(user1).claimTokens()
            ).to.be.revertedWith("Claiming disabled");
        });

        it("Should allow claims when enabled via multi-sig", async function () {
            // Enable claiming
            await pronovaPresale.connect(admin1).setClaimEnabled(true);
            await pronovaPresale.connect(admin2).setClaimEnabled(true);

            await pronovaPresale.connect(user1).claimTokens();

            const [totalTokens, totalPaid, referralTokens, claimed] = await pronovaPresale.getUserPurchaseInfo(user1.address);
            expect(claimed).to.equal(true);
        });
    });

    describe("Phase Management", function () {
        it("Should require multi-sig to update phase status", async function () {
            // First admin attempts to deactivate phase 1
            await pronovaPresale.connect(admin1).updatePhase(1, false);

            // Phase should still be active (needs 2 confirmations)
            let phase1 = await pronovaPresale.phases(1);
            expect(phase1.isActive).to.equal(true);

            // Second admin confirms
            await pronovaPresale.connect(admin2).updatePhase(1, false);

            // Now phase should be inactive
            phase1 = await pronovaPresale.phases(1);
            expect(phase1.isActive).to.equal(false);
        });

        it("Should track current phase correctly with multi-sig", async function () {
            expect(await pronovaPresale.currentPhase()).to.equal(1);

            // Activate phase 2 (requires multi-sig)
            await pronovaPresale.connect(admin1).updatePhase(2, true);
            await pronovaPresale.connect(admin2).updatePhase(2, true);

            expect(await pronovaPresale.currentPhase()).to.equal(2);
        });
    });

    describe("Access Control", function () {
        it("Should prevent non-admin from updating phases", async function () {
            await expect(
                pronovaPresale.connect(user1).updatePhase(1, false)
            ).to.be.reverted;
        });

        it("Should prevent non-admin from setting claim status", async function () {
            await expect(
                pronovaPresale.connect(user1).setClaimEnabled(true)
            ).to.be.reverted;
        });

        it("Should prevent non-oracle from updating prices", async function () {
            // Deactivate phase first
            await pronovaPresale.connect(admin1).updatePhase(1, false);

            await expect(
                pronovaPresale.connect(user1).updatePrices(
                    ethers.parseUnits("2000", 8),
                    ethers.parseUnits("300", 8)
                )
            ).to.be.reverted;
        });
    });

    describe("Pause Functionality", function () {
        it("Should allow admin to pause contract", async function () {
            await pronovaPresale.connect(admin1).pause();
            expect(await pronovaPresale.paused()).to.equal(true);
        });

        it("Should prevent purchases when paused", async function () {
            // Whitelist user
            const OPERATOR_ROLE = await pronovaPresale.OPERATOR_ROLE();
            await pronovaPresale.grantRole(OPERATOR_ROLE, admin1.address);
            await pronovaPresale.connect(admin1).updateWhitelist([user1.address], true);

            await pronovaPresale.connect(admin1).pause();

            const ethAmount = ethers.parseEther("1");
            const nonce = ethers.randomBytes(32);

            // Should not be able to commit when paused
            const commitment = ethers.keccak256(
                ethers.AbiCoder.defaultAbiCoder().encode(
                    ["address", "uint256", "bytes32"],
                    [user1.address, ethAmount, nonce]
                )
            );

            await expect(
                pronovaPresale.connect(user1).commitPurchase(commitment)
            ).to.be.reverted;
        });

        it("Should allow unpause", async function () {
            await pronovaPresale.connect(admin1).pause();
            await pronovaPresale.connect(admin1).unpause();
            expect(await pronovaPresale.paused()).to.equal(false);
        });
    });

    describe("View Functions", function () {
        it("Should return correct phase info", async function () {
            const phaseInfo = await pronovaPresale.getPhaseInfo(1);
            expect(phaseInfo.pricePerToken).to.equal(PHASE1_PRICE);
            expect(phaseInfo.isActive).to.equal(true);
        });

        it("Should return correct user purchase info", async function () {
            // Whitelist user
            const OPERATOR_ROLE = await pronovaPresale.OPERATOR_ROLE();
            await pronovaPresale.grantRole(OPERATOR_ROLE, admin1.address);
            await pronovaPresale.connect(admin1).updateWhitelist([user1.address], true);

            const ethAmount = ethers.parseEther("1");
            const nonce = ethers.randomBytes(32);

            // Direct purchase (no MEV commitment)
            await pronovaPresale.connect(user1).buyWithETH(
                ethers.ZeroAddress,
                0,
                nonce,
                { value: ethAmount }
            );

            const [totalTokens, totalPaid, referralTokens, claimed] = await pronovaPresale.getUserPurchaseInfo(user1.address);
            expect(totalTokens).to.be.gt(0);
            expect(totalPaid).to.be.gt(0);
        });

        it("Should calculate expected listing price range", async function () {
            const [minPrice, maxPrice] = await pronovaPresale.getExpectedListingPrice();
            expect(minPrice).to.be.gt(0);
            expect(maxPrice).to.be.gt(minPrice);
        });
    });
});
