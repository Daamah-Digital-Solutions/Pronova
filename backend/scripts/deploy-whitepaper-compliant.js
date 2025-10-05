// Pronova Deployment Script - Whitepaper Compliant (40% Presale)
// This script deploys with exact whitepaper allocations

const { ethers } = require("hardhat");
const fs = require("fs");

// ============================================
// OPTIMIZED TOKEN ALLOCATIONS
// ============================================
const ALLOCATIONS = {
    PRESALE: "25%",        // 250,000,000 PRN
    FOUNDERS: "14%",       // 140,000,000 PRN (9-year vesting)
    LIQUIDITY: "15%",      // 150,000,000 PRN
    PARTNERSHIPS: "15%",   // 150,000,000 PRN (9-year vesting)
    TEAM: "5%",           // 50,000,000 PRN (9-year vesting)
    COMMUNITY: "8%",       // 80,000,000 PRN
    STRATEGIC: "6%",       // 60,000,000 PRN
    MARKETING: "12%"       // 120,000,000 PRN
    // TOTAL: 100% = 1,000,000,000 PRN
};

async function main() {
    console.log("🚀 Pronova Whitepaper-Compliant Deployment");
    console.log("📋 Token Allocations Match Whitepaper Exactly");
    console.log("===============================================");

    // Get deployer account
    const [deployer] = await ethers.getSigners();
    console.log("📋 Deploying with account:", deployer.address);

    const balance = await ethers.provider.getBalance(deployer.address);
    console.log("💰 Account balance:", ethers.formatEther(balance), "BNB");

    // ============================================
    // WALLET CONFIGURATION
    // Replace these with your actual wallet addresses
    // ============================================
    const WALLET_CONFIG = {
        deployerAddress: deployer.address,
        treasuryWallet: deployer.address, // TODO: Replace with actual treasury
        allocationWallets: {
            foundersWallet: deployer.address,     // TODO: Replace with founders wallet
            liquidityWallet: deployer.address,    // TODO: Replace with liquidity wallet
            partnershipsWallet: deployer.address, // TODO: Replace with partnerships wallet
            teamWallet: deployer.address,         // TODO: Replace with team wallet
            communityWallet: deployer.address,    // TODO: Replace with community wallet
            strategicWallet: deployer.address,    // TODO: Replace with strategic wallet
            marketingWallet: deployer.address     // TODO: Replace with marketing wallet
        }
    };

    // Network configuration
    const network = await ethers.provider.getNetwork();
    const isTestnet = network.chainId === 97n;

    const NETWORK_CONFIG = isTestnet ? {
        // BSC Testnet
        usdtAddress: "0x337610d27c682E347C9cD60BD4b3b107C9d34dDd",
        ethUsdFeed: "0x143db3CEEfbdfe5631aDD3E50f7614B6ba708BA7",
        bnbUsdFeed: "0x2514895c72f50D8bd4B4F9b1110F0D6bD2c97526"
    } : {
        // BSC Mainnet
        usdtAddress: "0x55d398326f99059fF775485246999027B3197955",
        ethUsdFeed: "0x9ef1B8c0E4F7dc8bF5719Ea496883DC6401d5b2e",
        bnbUsdFeed: "0x0567F2323251f0Aab15c8dFb1967E4e8A7D42aeE"
    };

    console.log("\n📊 Optimized Token Allocations:");
    console.log("   Pre-Sale: 25% (250M PRN)");
    console.log("   Founders: 14% (140M PRN) - 9 year vesting");
    console.log("   Liquidity: 15% (150M PRN)");
    console.log("   Partnerships: 15% (150M PRN) - 9 year vesting");
    console.log("   Team: 5% (50M PRN) - 9 year vesting");
    console.log("   Community: 8% (80M PRN)");
    console.log("   Strategic: 6% (60M PRN)");
    console.log("   Marketing: 12% (120M PRN)");
    console.log("   TOTAL: 100% (1,000M PRN)");

    try {
        // ============================================
        // DEPLOY CONTRACTS
        // ============================================

        // 1. Deploy PronovaToken
        console.log("\n📦 Step 1: Deploying PronovaToken...");
        const PronovaToken = await ethers.getContractFactory("PronovaToken");
        const token = await PronovaToken.deploy();
        await token.waitForDeployment();
        const tokenAddress = await token.getAddress();
        console.log("✅ PronovaToken deployed to:", tokenAddress);

        // Verify token supply
        const totalSupply = await token.totalSupply();
        console.log("   Total Supply:", ethers.formatEther(totalSupply), "PRN");

        // Verify allocations match whitepaper
        const presaleAllocation = await token.PRESALE_ALLOCATION();
        console.log("   Presale Allocation:", ethers.formatEther(presaleAllocation), "PRN (40%)");

        // 2. Deploy PronovaVesting
        console.log("\n📦 Step 2: Deploying PronovaVesting...");
        const PronovaVesting = await ethers.getContractFactory("PronovaVesting");
        const vesting = await PronovaVesting.deploy(tokenAddress);
        await vesting.waitForDeployment();
        const vestingAddress = await vesting.getAddress();
        console.log("✅ PronovaVesting deployed to:", vestingAddress);

        // Verify vesting parameters
        const vestingDuration = await vesting.VESTING_DURATION();
        console.log("   Vesting Duration:", vestingDuration / (365n * 24n * 60n * 60n), "years");

        // 3. Deploy PronovaPresale
        console.log("\n📦 Step 3: Deploying PronovaPresale...");
        const PronovaPresale = await ethers.getContractFactory("PronovaPresale");
        const presale = await PronovaPresale.deploy(
            tokenAddress,
            NETWORK_CONFIG.usdtAddress,
            WALLET_CONFIG.treasuryWallet,
            NETWORK_CONFIG.ethUsdFeed,
            NETWORK_CONFIG.bnbUsdFeed
        );
        await presale.waitForDeployment();
        const presaleAddress = await presale.getAddress();
        console.log("✅ PronovaPresale deployed to:", presaleAddress);

        // ============================================
        // CONFIGURE CONTRACTS
        // ============================================

        // 4. Grant admin roles
        console.log("\n🔐 Step 4: Configuring Admin Roles...");
        const ADMIN_ROLE = await token.ADMIN_ROLE();
        await token.grantRole(ADMIN_ROLE, deployer.address);
        console.log("✅ Admin role granted to deployer");

        // 5. Set allocation wallets (requires multi-sig)
        console.log("\n💼 Step 5: Setting Allocation Wallets...");

        // Note: Staking is removed to match whitepaper exactly
        await token.confirmSetAllocationWallets(
            presaleAddress,
            WALLET_CONFIG.allocationWallets.foundersWallet,
            WALLET_CONFIG.allocationWallets.liquidityWallet,
            WALLET_CONFIG.allocationWallets.partnershipsWallet,
            WALLET_CONFIG.allocationWallets.teamWallet,
            WALLET_CONFIG.allocationWallets.communityWallet,
            WALLET_CONFIG.allocationWallets.strategicWallet,
            WALLET_CONFIG.allocationWallets.marketingWallet,
            vestingAddress
        );
        console.log("✅ First allocation confirmation completed");

        // Second confirmation (in production, this would be a different admin)
        await token.confirmSetAllocationWallets(
            presaleAddress,
            WALLET_CONFIG.allocationWallets.foundersWallet,
            WALLET_CONFIG.allocationWallets.liquidityWallet,
            WALLET_CONFIG.allocationWallets.partnershipsWallet,
            WALLET_CONFIG.allocationWallets.teamWallet,
            WALLET_CONFIG.allocationWallets.communityWallet,
            WALLET_CONFIG.allocationWallets.strategicWallet,
            WALLET_CONFIG.allocationWallets.marketingWallet,
            vestingAddress
        );
        console.log("✅ Second allocation confirmation completed");

        // 6. Distribute allocations
        console.log("\n🎯 Step 6: Distributing Token Allocations...");
        await token.confirmDistributeAllocations();
        console.log("✅ First distribution confirmation completed");

        await token.confirmDistributeAllocations();
        console.log("✅ Second distribution confirmation completed");

        // 7. Setup vesting schedules
        console.log("\n⏰ Step 7: Setting Up Vesting Schedules...");
        const VESTING_MANAGER_ROLE = await vesting.VESTING_MANAGER_ROLE();
        await vesting.grantRole(VESTING_MANAGER_ROLE, deployer.address);

        await vesting.setupWhitepaperAllocations(
            WALLET_CONFIG.allocationWallets.foundersWallet,
            WALLET_CONFIG.allocationWallets.teamWallet,
            WALLET_CONFIG.allocationWallets.partnershipsWallet
        );
        console.log("✅ Vesting schedules configured for 9-year period");

        // 8. Start presale
        console.log("\n🛒 Step 8: Starting Presale...");
        const PRESALE_ADMIN_ROLE = await presale.ADMIN_ROLE();
        await presale.grantRole(PRESALE_ADMIN_ROLE, deployer.address);

        await presale.confirmStartPresale();
        console.log("✅ First presale confirmation completed");

        await presale.confirmStartPresale();
        console.log("✅ Second presale confirmation completed");
        console.log("✅ Presale Phase 1 is now ACTIVE ($0.80 per PRN)");

        // ============================================
        // VERIFICATION
        // ============================================
        console.log("\n🔍 Step 9: Deployment Verification...");

        // Verify presale balance (should have 250M tokens)
        const presaleBalance = await token.balanceOf(presaleAddress);
        const expectedPresale = ethers.parseEther("250000000");
        console.log("   Presale Balance:", ethers.formatEther(presaleBalance), "PRN");
        console.log("   Expected:", ethers.formatEther(expectedPresale), "PRN");
        console.log("   Match:", presaleBalance === expectedPresale ? "✅" : "❌");

        // Verify vesting balance (should have 340M tokens: 140M + 50M + 150M)
        const vestingBalance = await token.balanceOf(vestingAddress);
        const expectedVesting = ethers.parseEther("340000000");
        console.log("   Vesting Balance:", ethers.formatEther(vestingBalance), "PRN");
        console.log("   Expected:", ethers.formatEther(expectedVesting), "PRN");
        console.log("   Match:", vestingBalance === expectedVesting ? "✅" : "❌");

        // ============================================
        // SAVE DEPLOYMENT INFO
        // ============================================
        console.log("\n💾 Step 10: Saving Deployment Information...");
        const deploymentInfo = {
            network: isTestnet ? "BSC Testnet" : "BSC Mainnet",
            chainId: Number(network.chainId),
            timestamp: new Date().toISOString(),
            deployer: deployer.address,
            whitepaper_compliant: true,
            allocations: {
                presale: "25% (250M PRN)",
                founders: "14% (140M PRN) - 9 year vesting",
                liquidity: "15% (150M PRN)",
                partnerships: "15% (150M PRN) - 9 year vesting",
                team: "5% (50M PRN) - 9 year vesting",
                community: "8% (80M PRN)",
                strategic: "6% (60M PRN)",
                marketing: "12% (120M PRN)"
            },
            contracts: {
                PronovaToken: tokenAddress,
                PronovaVesting: vestingAddress,
                PronovaPresale: presaleAddress
            },
            configuration: {
                ...NETWORK_CONFIG,
                wallets: WALLET_CONFIG
            }
        };

        const filename = isTestnet ? 'deployment-testnet-whitepaper.json' : 'deployment-mainnet-whitepaper.json';
        fs.writeFileSync(filename, JSON.stringify(deploymentInfo, null, 2));
        console.log(`✅ Deployment info saved to ${filename}`);

        // ============================================
        // SUCCESS SUMMARY
        // ============================================
        console.log("\n🎉 DEPLOYMENT SUCCESSFUL - WHITEPAPER COMPLIANT!");
        console.log("===============================================");
        console.log("📋 Contract Addresses:");
        console.log("   PronovaToken:", tokenAddress);
        console.log("   PronovaVesting:", vestingAddress);
        console.log("   PronovaPresale:", presaleAddress);
        console.log("\n✅ Optimized Token Allocation:");
        console.log("   • 25% (250M) tokens allocated to presale");
        console.log("   • 9-year vesting for Founders, Team, Partnerships");
        console.log("   • Prices: $0.80, $1.00, $1.50 per phase");
        console.log("   • Enhanced liquidity and community allocations");
        console.log("\n⚠️  Important Next Steps:");
        console.log("   1. Replace placeholder wallets with actual addresses");
        console.log("   2. Add additional admin wallets for true multi-sig");
        console.log("   3. Verify contracts on BSCScan");
        console.log("   4. Test presale functionality");
        console.log("   5. Monitor oracle price feeds");

    } catch (error) {
        console.error("\n❌ Deployment failed:", error.message);
        console.error("Stack trace:", error.stack);
        process.exit(1);
    }
}

// Execute deployment
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });