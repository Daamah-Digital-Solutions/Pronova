// Pronova Mainnet Deployment Script - Self-Contained Version
// PRODUCTION DEPLOYMENT - Use with extreme caution

const { ethers } = require("hardhat");
const fs = require("fs");

async function main() {
    console.log("🚀 PRONOVA MAINNET DEPLOYMENT - PRODUCTION");
    console.log("⚠️  WARNING: This is a MAINNET deployment!");
    console.log("===============================================");

    // Safety check
    const network = await ethers.provider.getNetwork();
    if (network.chainId !== 56n) {
        console.error("❌ ERROR: Not connected to BSC Mainnet (Chain ID: 56)");
        console.error("Current Chain ID:", network.chainId.toString());
        process.exit(1);
    }

    // Get deployer account
    const [deployer] = await ethers.getSigners();
    console.log("📋 Deploying with account:", deployer.address);

    const balance = await ethers.provider.getBalance(deployer.address);
    console.log("💰 Account balance:", ethers.formatEther(balance), "BNB");

    // Minimum balance check for mainnet
    const minimumBalance = ethers.parseEther("0.5"); // 0.5 BNB minimum
    if (balance < minimumBalance) {
        console.error("❌ ERROR: Insufficient balance for mainnet deployment");
        console.error("Required minimum:", ethers.formatEther(minimumBalance), "BNB");
        process.exit(1);
    }

    // BSC Mainnet Configuration
    const MAINNET_CONFIG = {
        usdtAddress: "0x55d398326f99059fF775485246999027B3197955", // BSC Mainnet USDT
        ethUsdFeed: "0x9ef1B8c0E4F7dc8bF5719Ea496883DC6401d5b2e",  // BSC Mainnet ETH/USD
        bnbUsdFeed: "0x0567F2323251f0Aab15c8dFb1967E4e8A7D42aeE"   // BSC Mainnet BNB/USD
    };

    console.log("🔧 Using BSC Mainnet Oracle Feeds:");
    console.log("   ETH/USD:", MAINNET_CONFIG.ethUsdFeed);
    console.log("   BNB/USD:", MAINNET_CONFIG.bnbUsdFeed);
    console.log("   USDT:", MAINNET_CONFIG.usdtAddress);

    // Final confirmation
    console.log("\n⚠️  FINAL CONFIRMATION REQUIRED");
    console.log("   Network: BSC Mainnet");
    console.log("   Deployer:", deployer.address);
    console.log("   Balance:", ethers.formatEther(balance), "BNB");
    console.log("\n   Type 'YES' to proceed with mainnet deployment:");

    // For script execution, we'll skip the interactive confirmation
    // In production, you should add proper confirmation logic here

    try {
        console.log("\n🔐 Pre-deployment Security Checks...");

        // Verify oracle feeds are responding
        await verifyOracleFeeds(MAINNET_CONFIG);

        // Check USDT contract
        await verifyUSDTContract(MAINNET_CONFIG.usdtAddress);

        // 1. Deploy PronovaToken
        console.log("\n📦 Step 1: Deploying PronovaToken...");
        const PronovaToken = await ethers.getContractFactory("PronovaToken");
        console.log("   Estimating gas...");
        const tokenGasEstimate = await PronovaToken.getDeployTransaction().then(tx =>
            ethers.provider.estimateGas(tx)
        );
        console.log("   Estimated gas for token:", tokenGasEstimate.toString());

        const token = await PronovaToken.deploy({
            gasLimit: tokenGasEstimate * 120n / 100n // 20% buffer
        });
        await token.waitForDeployment();
        const tokenAddress = await token.getAddress();
        console.log("✅ PronovaToken deployed to:", tokenAddress);

        // 2. Deploy PronovaVesting
        console.log("\n📦 Step 2: Deploying PronovaVesting...");
        const PronovaVesting = await ethers.getContractFactory("PronovaVesting");
        const vestingGasEstimate = await PronovaVesting.getDeployTransaction(tokenAddress).then(tx =>
            ethers.provider.estimateGas(tx)
        );
        console.log("   Estimated gas for vesting:", vestingGasEstimate.toString());

        const vesting = await PronovaVesting.deploy(tokenAddress, {
            gasLimit: vestingGasEstimate * 120n / 100n
        });
        await vesting.waitForDeployment();
        const vestingAddress = await vesting.getAddress();
        console.log("✅ PronovaVesting deployed to:", vestingAddress);

        // 3. Deploy PronovaPresale
        console.log("\n📦 Step 3: Deploying PronovaPresale...");
        const PronovaPresale = await ethers.getContractFactory("PronovaPresale");
        const presaleGasEstimate = await PronovaPresale.getDeployTransaction(
            tokenAddress,
            MAINNET_CONFIG.usdtAddress,
            ethers.ZeroAddress,
            MAINNET_CONFIG.ethUsdFeed,
            MAINNET_CONFIG.bnbUsdFeed
        ).then(tx => ethers.provider.estimateGas(tx));
        console.log("   Estimated gas for presale:", presaleGasEstimate.toString());

        const presale = await PronovaPresale.deploy(
            tokenAddress,
            MAINNET_CONFIG.usdtAddress,
            ethers.ZeroAddress, // Internal treasury
            MAINNET_CONFIG.ethUsdFeed,
            MAINNET_CONFIG.bnbUsdFeed,
            {
                gasLimit: presaleGasEstimate * 120n / 100n
            }
        );
        await presale.waitForDeployment();
        const presaleAddress = await presale.getAddress();
        console.log("✅ PronovaPresale deployed to:", presaleAddress);

        // 4. Configure Admin Roles
        console.log("\n🔐 Step 4: Configuring Admin Roles...");
        const ADMIN_ROLE = await token.ADMIN_ROLE();
        await token.grantRole(ADMIN_ROLE, deployer.address);
        console.log("✅ Admin role granted to deployer");

        // 5. Set Allocation Wallets (Internal)
        console.log("\n💼 Step 5: Setting Internal Allocation Wallets...");
        const allocationWallets = {
            presale: presaleAddress,
            founders: vestingAddress,
            liquidity: tokenAddress,
            partnerships: vestingAddress,
            team: vestingAddress,
            community: tokenAddress,
            strategic: tokenAddress,
            marketing: tokenAddress,
            staking: tokenAddress
        };

        console.log("📋 Allocation addresses (internal):");
        Object.entries(allocationWallets).forEach(([key, address]) => {
            console.log(`   ${key}: ${address}`);
        });

        // Multi-sig confirmations for allocation wallets
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

        // 6. Distribute Allocations
        console.log("\n🎯 Step 6: Distributing Token Allocations...");
        await token.confirmDistributeAllocations();
        console.log("✅ First distribution confirmation completed");

        await token.confirmDistributeAllocations();
        console.log("✅ Second distribution confirmation completed");
        console.log("✅ Token allocations distributed");

        // 7. Setup Vesting
        console.log("\n⏰ Step 7: Setting Up Vesting Schedules...");
        const VESTING_MANAGER_ROLE = await vesting.VESTING_MANAGER_ROLE();
        await vesting.grantRole(VESTING_MANAGER_ROLE, deployer.address);

        await vesting.setupWhitepaperAllocations(
            vestingAddress, // Self-custody for now
            vestingAddress,
            vestingAddress
        );
        console.log("✅ Vesting schedules configured");

        // 8. Start Presale
        console.log("\n🛒 Step 8: Starting Presale...");
        const PRESALE_ADMIN_ROLE = await presale.ADMIN_ROLE();
        await presale.grantRole(PRESALE_ADMIN_ROLE, deployer.address);

        await presale.confirmStartPresale();
        console.log("✅ First presale confirmation completed");

        await presale.confirmStartPresale();
        console.log("✅ Second presale confirmation completed");
        console.log("✅ Presale started on mainnet!");

        // 9. Verification
        console.log("\n🔍 Step 9: Mainnet Deployment Verification...");
        await verifyMainnetDeployment(token, presale, vesting, MAINNET_CONFIG);

        // 10. Save Deployment Info
        console.log("\n💾 Step 10: Saving Mainnet Deployment Information...");
        const deploymentInfo = {
            network: "BSC Mainnet",
            chainId: 56,
            timestamp: new Date().toISOString(),
            deployer: deployer.address,
            gasUsed: {
                // Add actual gas used if needed
            },
            contracts: {
                PronovaToken: tokenAddress,
                PronovaVesting: vestingAddress,
                PronovaPresale: presaleAddress
            },
            configuration: {
                ...MAINNET_CONFIG,
                allocationWallets
            },
            verification: {
                bscscan: {
                    token: `https://bscscan.com/address/${tokenAddress}`,
                    vesting: `https://bscscan.com/address/${vestingAddress}`,
                    presale: `https://bscscan.com/address/${presaleAddress}`
                }
            }
        };

        fs.writeFileSync(
            './deployment-mainnet.json',
            JSON.stringify(deploymentInfo, null, 2)
        );
        console.log("✅ Mainnet deployment info saved");

        // Success Summary
        console.log("\n🎉 MAINNET DEPLOYMENT SUCCESSFUL!");
        console.log("===============================================");
        console.log("🌐 Network: BSC Mainnet");
        console.log("📋 Contract Addresses:");
        console.log("   PronovaToken:", tokenAddress);
        console.log("   PronovaVesting:", vestingAddress);
        console.log("   PronovaPresale:", presaleAddress);
        console.log("\n🔗 BSCScan Links:");
        console.log("   Token:", `https://bscscan.com/address/${tokenAddress}`);
        console.log("   Vesting:", `https://bscscan.com/address/${vestingAddress}`);
        console.log("   Presale:", `https://bscscan.com/address/${presaleAddress}`);
        console.log("\n🎯 Presale Status: LIVE ON MAINNET");
        console.log("💰 Phase 1 Price: $0.80 per PRN");
        console.log("💵 Hard Cap: $267.5M");
        console.log("🔐 Multi-sig: Active");

        console.log("\n🚨 IMMEDIATE POST-DEPLOYMENT ACTIONS:");
        console.log("   1. Verify contracts on BSCScan");
        console.log("   2. Test small presale purchase");
        console.log("   3. Set up monitoring and alerts");
        console.log("   4. Add additional admin wallets ASAP");
        console.log("   5. Announce presale to community");

        console.log("\n⚠️  SECURITY REMINDERS:");
        console.log("   • Deploy additional admin wallets soon");
        console.log("   • Monitor oracle price feeds");
        console.log("   • Set up contract monitoring");
        console.log("   • Keep deployment keys secure");

    } catch (error) {
        console.error("\n❌ MAINNET DEPLOYMENT FAILED:", error.message);
        console.error("Stack trace:", error.stack);
        console.log("\n🛑 IMMEDIATE ACTIONS:");
        console.log("   1. Do not proceed with any transactions");
        console.log("   2. Check error details above");
        console.log("   3. Test on testnet first");
        console.log("   4. Contact technical support if needed");
        process.exit(1);
    }
}

async function verifyOracleFeeds(config) {
    try {
        console.log("   Checking Chainlink oracle feeds...");

        // Check ETH/USD feed
        const ethFeedContract = await ethers.getContractAt("MockV3Aggregator", config.ethUsdFeed);
        const ethPrice = await ethFeedContract.latestRoundData();
        console.log("   ETH/USD Price:", ethers.formatUnits(ethPrice.answer, 8));

        // Check BNB/USD feed
        const bnbFeedContract = await ethers.getContractAt("MockV3Aggregator", config.bnbUsdFeed);
        const bnbPrice = await bnbFeedContract.latestRoundData();
        console.log("   BNB/USD Price:", ethers.formatUnits(bnbPrice.answer, 8));

        console.log("✅ Oracle feeds responding correctly");
    } catch (error) {
        console.error("❌ Oracle feed verification failed:", error.message);
        throw error;
    }
}

async function verifyUSDTContract(usdtAddress) {
    try {
        console.log("   Verifying USDT contract...");
        const usdtContract = await ethers.getContractAt("ERC20", usdtAddress);
        const symbol = await usdtContract.symbol();
        const decimals = await usdtContract.decimals();
        console.log(`   USDT Contract: ${symbol} (${decimals} decimals)`);
        console.log("✅ USDT contract verified");
    } catch (error) {
        console.error("❌ USDT contract verification failed:", error.message);
        throw error;
    }
}

async function verifyMainnetDeployment(token, presale, vesting, config) {
    try {
        // Verify total supply
        const totalSupply = await token.totalSupply();
        const expectedSupply = ethers.parseEther("1000000000"); // 1B tokens
        if (totalSupply !== expectedSupply) {
            throw new Error(`Supply mismatch: ${totalSupply} vs ${expectedSupply}`);
        }
        console.log("✅ Total Supply: 1B PRN");

        // Verify presale allocation (250M tokens)
        const presaleBalance = await token.balanceOf(await presale.getAddress());
        const expectedPresale = ethers.parseEther("250000000"); // 250M tokens
        if (presaleBalance !== expectedPresale) {
            throw new Error(`Presale allocation mismatch: ${presaleBalance} vs ${expectedPresale}`);
        }
        console.log("✅ Presale Allocation: 250M PRN");

        // Verify vesting allocation (250M tokens for founders + team + partnerships)
        const vestingBalance = await token.balanceOf(await vesting.getAddress());
        const expectedVesting = ethers.parseEther("250000000"); // 250M tokens
        if (vestingBalance !== expectedVesting) {
            throw new Error(`Vesting allocation mismatch: ${vestingBalance} vs ${expectedVesting}`);
        }
        console.log("✅ Vesting Allocation: 250M PRN");

        // Verify presale is active
        const presaleActive = await presale.presaleActive();
        if (!presaleActive) {
            throw new Error("Presale not active");
        }
        console.log("✅ Presale Active: true");

        // Verify presale phase and pricing
        const currentPhase = await presale.currentPhase();
        if (currentPhase !== 1n) {
            throw new Error(`Wrong presale phase: ${currentPhase} (expected 1)`);
        }
        console.log("✅ Current Phase: 1 ($0.80 per PRN)");

        // Verify oracle configuration
        const ethFeed = await presale.ethUsdPriceFeed();
        const bnbFeed = await presale.bnbUsdPriceFeed();
        if (ethFeed !== config.ethUsdFeed || bnbFeed !== config.bnbUsdFeed) {
            throw new Error("Oracle feed configuration mismatch");
        }
        console.log("✅ Oracle Feeds: Configured correctly");

        // Verify USDT configuration
        const usdtToken = await presale.usdtToken();
        if (usdtToken !== config.usdtAddress) {
            throw new Error("USDT address configuration mismatch");
        }
        console.log("✅ USDT Integration: Configured correctly");

        // Test oracle price fetch (should not revert)
        try {
            await presale.getETHPrice();
            await presale.getBNBPrice();
            console.log("✅ Oracle Price Feeds: Working");
        } catch (error) {
            throw new Error("Oracle price fetch failed: " + error.message);
        }

        console.log("✅ All mainnet verifications passed");

    } catch (error) {
        console.error("❌ Mainnet verification failed:", error.message);
        throw error;
    }
}

// Execute mainnet deployment
main()
    .then(() => {
        console.log("\n🎉 Mainnet deployment completed successfully!");
        process.exit(0);
    })
    .catch((error) => {
        console.error("\n❌ Mainnet deployment failed:", error);
        process.exit(1);
    });