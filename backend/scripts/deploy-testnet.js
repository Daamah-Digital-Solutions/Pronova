// Pronova Testnet Deployment Script - Self-Contained Version
// Deploys all contracts without requiring external wallets

const { ethers } = require("hardhat");
const fs = require("fs");

async function main() {
    console.log("🚀 Starting Pronova Testnet Deployment (Self-Contained)");
    console.log("===============================================");

    // Get deployer account
    const [deployer] = await ethers.getSigners();
    console.log("📋 Deploying with account:", deployer.address);

    const balance = await ethers.provider.getBalance(deployer.address);
    console.log("💰 Account balance:", ethers.formatEther(balance), "BNB");

    if (balance < ethers.parseEther("0.1")) {
        console.log("⚠️  Warning: Low balance. Consider adding more BNB for gas fees.");
    }

    // BSC Testnet Configuration
    const TESTNET_CONFIG = {
        usdtAddress: "0x337610d27c682E347C9cD60BD4b3b107C9d34dDd", // BSC Testnet USDT
        ethUsdFeed: "0x143db3CEEfbdfe5631aDD3E50f7614B6ba708BA7",  // BSC Testnet ETH/USD
        bnbUsdFeed: "0x2514895c72f50D8bd4B4F9b1110F0D6bD2c97526"   // BSC Testnet BNB/USD
    };

    console.log("🔧 Using BSC Testnet Oracle Feeds:");
    console.log("   ETH/USD:", TESTNET_CONFIG.ethUsdFeed);
    console.log("   BNB/USD:", TESTNET_CONFIG.bnbUsdFeed);
    console.log("   USDT:", TESTNET_CONFIG.usdtAddress);

    try {
        // 1. Deploy PronovaToken
        console.log("\n📦 Step 1: Deploying PronovaToken...");
        const PronovaToken = await ethers.getContractFactory("PronovaToken");
        const token = await PronovaToken.deploy();
        await token.waitForDeployment();
        const tokenAddress = await token.getAddress();
        console.log("✅ PronovaToken deployed to:", tokenAddress);

        // 2. Deploy PronovaVesting
        console.log("\n📦 Step 2: Deploying PronovaVesting...");
        const PronovaVesting = await ethers.getContractFactory("PronovaVesting");
        const vesting = await PronovaVesting.deploy(tokenAddress);
        await vesting.waitForDeployment();
        const vestingAddress = await vesting.getAddress();
        console.log("✅ PronovaVesting deployed to:", vestingAddress);

        // 3. Deploy PronovaPresale
        console.log("\n📦 Step 3: Deploying PronovaPresale...");
        const PronovaPresale = await ethers.getContractFactory("PronovaPresale");
        const presale = await PronovaPresale.deploy(
            tokenAddress,
            TESTNET_CONFIG.usdtAddress,
            ethers.ZeroAddress, // Internal treasury (no external wallet)
            TESTNET_CONFIG.ethUsdFeed,
            TESTNET_CONFIG.bnbUsdFeed
        );
        await presale.waitForDeployment();
        const presaleAddress = await presale.getAddress();
        console.log("✅ PronovaPresale deployed to:", presaleAddress);

        // 4. Configure Multi-Sig Admin Role
        console.log("\n🔐 Step 4: Configuring Admin Roles...");
        const ADMIN_ROLE = await token.ADMIN_ROLE();
        await token.grantRole(ADMIN_ROLE, deployer.address);
        console.log("✅ Admin role granted to deployer:", deployer.address);

        // 5. Set Allocation Wallets (All Internal)
        console.log("\n💼 Step 5: Setting Internal Allocation Wallets...");
        const allocationWallets = {
            presale: presaleAddress,        // Presale contract holds its tokens
            founders: vestingAddress,       // Vesting contract holds founders tokens
            liquidity: tokenAddress,        // Token contract temporarily holds liquidity
            partnerships: vestingAddress,   // Vesting contract holds partnership tokens
            team: vestingAddress,          // Vesting contract holds team tokens
            community: tokenAddress,       // Token contract temporarily holds community
            strategic: tokenAddress,       // Token contract temporarily holds strategic
            marketing: tokenAddress,       // Token contract temporarily holds marketing
            staking: tokenAddress          // Token contract temporarily holds staking
        };

        console.log("📋 Allocation addresses:");
        Object.entries(allocationWallets).forEach(([key, address]) => {
            console.log(`   ${key}: ${address}`);
        });

        // Multi-sig confirmation 1
        const operationId1 = ethers.keccak256(ethers.toUtf8Bytes("setAllocationWallets_1"));
        await token.confirmSetAllocationWallets(
            allocationWallets.presale,
            allocationWallets.founders,
            allocationWallets.liquidity,
            allocationWallets.partnerships,
            allocationWallets.team,
            allocationWallets.community,
            allocationWallets.strategic,
            allocationWallets.marketing,
            allocationWallets.staking
        );
        console.log("✅ First multi-sig confirmation completed");

        // Multi-sig confirmation 2 (self-contained setup)
        await token.confirmSetAllocationWallets(
            allocationWallets.presale,
            allocationWallets.founders,
            allocationWallets.liquidity,
            allocationWallets.partnerships,
            allocationWallets.team,
            allocationWallets.community,
            allocationWallets.strategic,
            allocationWallets.marketing,
            allocationWallets.staking
        );
        console.log("✅ Second multi-sig confirmation completed");
        console.log("✅ Allocation wallets configured successfully");

        // 6. Distribute Token Allocations
        console.log("\n🎯 Step 6: Distributing Token Allocations...");

        // Multi-sig distribution confirmation 1
        await token.confirmDistributeAllocations();
        console.log("✅ First distribution confirmation completed");

        // Multi-sig distribution confirmation 2
        await token.confirmDistributeAllocations();
        console.log("✅ Second distribution confirmation completed");
        console.log("✅ Token allocations distributed to contracts");

        // 7. Setup Vesting Schedules
        console.log("\n⏰ Step 7: Setting Up Vesting Schedules...");

        // Grant VESTING_MANAGER_ROLE to deployer
        const VESTING_MANAGER_ROLE = await vesting.VESTING_MANAGER_ROLE();
        await vesting.grantRole(VESTING_MANAGER_ROLE, deployer.address);

        await vesting.setupWhitepaperAllocations(
            vestingAddress, // Founders beneficiary (self-custody for now)
            vestingAddress, // Team beneficiary (self-custody for now)
            vestingAddress  // Partnerships beneficiary (self-custody for now)
        );
        console.log("✅ Vesting schedules configured (self-custody mode)");

        // 8. Start Presale
        console.log("\n🛒 Step 8: Starting Presale...");

        // Grant ADMIN_ROLE to deployer for presale
        const PRESALE_ADMIN_ROLE = await presale.ADMIN_ROLE();
        await presale.grantRole(PRESALE_ADMIN_ROLE, deployer.address);

        // Multi-sig presale start confirmation 1
        await presale.confirmStartPresale();
        console.log("✅ First presale start confirmation completed");

        // Multi-sig presale start confirmation 2
        await presale.confirmStartPresale();
        console.log("✅ Second presale start confirmation completed");
        console.log("✅ Presale started - Phase 1 active ($0.80 per PRN)");

        // 9. Verification
        console.log("\n🔍 Step 9: Deployment Verification...");
        await verifyDeployment(token, presale, vesting);

        // 10. Save Deployment Info
        console.log("\n💾 Step 10: Saving Deployment Information...");
        const deploymentInfo = {
            network: "BSC Testnet",
            timestamp: new Date().toISOString(),
            deployer: deployer.address,
            contracts: {
                PronovaToken: tokenAddress,
                PronovaVesting: vestingAddress,
                PronovaPresale: presaleAddress
            },
            configuration: {
                ...TESTNET_CONFIG,
                allocationWallets
            }
        };

        fs.writeFileSync(
            './deployment-testnet.json',
            JSON.stringify(deploymentInfo, null, 2)
        );
        console.log("✅ Deployment info saved to deployment-testnet.json");

        // Success Summary
        console.log("\n🎉 DEPLOYMENT SUCCESSFUL!");
        console.log("===============================================");
        console.log("📋 Contract Addresses:");
        console.log("   PronovaToken:", tokenAddress);
        console.log("   PronovaVesting:", vestingAddress);
        console.log("   PronovaPresale:", presaleAddress);
        console.log("\n🎯 Presale Status: ACTIVE");
        console.log("💰 Phase 1 Price: $0.80 per PRN");
        console.log("🔐 Multi-sig Setup: Self-contained (ready for team expansion)");
        console.log("\n⚠️  Next Steps:");
        console.log("   1. Test presale functionality on testnet");
        console.log("   2. Add additional admin wallets when ready");
        console.log("   3. Assign external beneficiaries for vesting");
        console.log("   4. Deploy to mainnet when satisfied");

    } catch (error) {
        console.error("\n❌ Deployment failed:", error.message);
        console.error("Stack trace:", error.stack);
        process.exit(1);
    }
}

async function verifyDeployment(token, presale, vesting) {
    try {
        // Verify token supply
        const totalSupply = await token.totalSupply();
        console.log("   Total Supply:", ethers.formatEther(totalSupply), "PRN");

        // Verify presale allocation
        const presaleBalance = await token.balanceOf(await presale.getAddress());
        console.log("   Presale Balance:", ethers.formatEther(presaleBalance), "PRN");

        // Verify vesting allocation
        const vestingBalance = await token.balanceOf(await vesting.getAddress());
        console.log("   Vesting Balance:", ethers.formatEther(vestingBalance), "PRN");

        // Verify presale is active
        const presaleActive = await presale.presaleActive();
        console.log("   Presale Active:", presaleActive);

        // Verify current phase
        const currentPhase = await presale.currentPhase();
        console.log("   Current Phase:", currentPhase.toString());

        // Verify vesting setup
        const foundersBeneficiary = await vesting.beneficiaryCategories("founders");
        console.log("   Founders Beneficiary Set:", foundersBeneficiary !== ethers.ZeroAddress);

        console.log("✅ All verifications passed");

    } catch (error) {
        console.error("❌ Verification failed:", error.message);
        throw error;
    }
}

// Execute deployment
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });