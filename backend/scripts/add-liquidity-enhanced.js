// Enhanced Liquidity Management Script
// This script automates liquidity addition to PancakeSwap

const { ethers } = require("hardhat");

// PancakeSwap Router V2 address on BSC
const PANCAKE_ROUTER = "0x10ED43C718714eb63d5aA57B78B54704E256024E"; // Mainnet
const PANCAKE_FACTORY = "0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73"; // Mainnet

// Testnet addresses
const PANCAKE_ROUTER_TESTNET = "0xD99D1c33F9fC3444f8101754aBC46c52416550D1";
const PANCAKE_FACTORY_TESTNET = "0x6725F303b657a9f3e44Ad51cdD3AC6E32B7AB44B";

async function main() {
    console.log("🚀 Pronova Liquidity Addition Process");
    console.log("=====================================");

    const [deployer] = await ethers.getSigners();
    const network = await ethers.provider.getNetwork();
    const isTestnet = network.chainId === 97n;

    // Select appropriate router
    const routerAddress = isTestnet ? PANCAKE_ROUTER_TESTNET : PANCAKE_ROUTER;
    const factoryAddress = isTestnet ? PANCAKE_FACTORY_TESTNET : PANCAKE_FACTORY;

    console.log(`📋 Network: ${isTestnet ? 'BSC Testnet' : 'BSC Mainnet'}`);
    console.log(`📋 Router: ${routerAddress}`);

    // Load deployment info
    const deploymentFile = isTestnet ? 'deployment-testnet-whitepaper.json' : 'deployment-mainnet-whitepaper.json';
    const deploymentInfo = require(`../${deploymentFile}`);
    const tokenAddress = deploymentInfo.contracts.PronovaToken;

    console.log(`📋 PRN Token: ${tokenAddress}`);

    // Get contracts
    const token = await ethers.getContractAt("PronovaToken", tokenAddress);
    const router = await ethers.getContractAt("IPancakeRouter02", routerAddress);

    // Liquidity parameters
    const LIQUIDITY_PRN = ethers.parseEther("120000000"); // 120M PRN
    const LISTING_PRICE = ethers.parseEther("2.0"); // $2.00 per PRN target

    // Calculate required BNB (this needs real-time BNB price)
    console.log("\n⚠️  MANUAL INPUT REQUIRED:");
    console.log("Please check current BNB price and calculate required BNB amount");
    console.log(`Target: ${ethers.formatEther(LIQUIDITY_PRN)} PRN tokens`);
    console.log(`Listing price: $${ethers.formatEther(LISTING_PRICE)} per PRN`);
    console.log("Required value: $240,000,000 worth of BNB");

    // Verify token balance
    const liquidityWallet = deploymentInfo.configuration.wallets.allocationWallets.liquidityWallet;
    const tokenBalance = await token.balanceOf(liquidityWallet);
    console.log(`\n💰 Liquidity wallet balance: ${ethers.formatEther(tokenBalance)} PRN`);

    if (tokenBalance < LIQUIDITY_PRN) {
        throw new Error("Insufficient PRN tokens in liquidity wallet");
    }

    // Approve router to spend tokens
    console.log("\n🔐 Step 1: Approving PancakeSwap Router...");
    const approveTx = await token.approve(routerAddress, LIQUIDITY_PRN);
    await approveTx.wait();
    console.log("✅ Router approved");

    // Add liquidity (this requires manual BNB amount input)
    console.log("\n🏊 Step 2: Adding Liquidity...");
    console.log("⚠️  Please provide BNB amount manually based on current market price");

    // Uncomment and modify when ready to execute:
    /*
    const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes
    const minTokens = ethers.parseEther("119000000"); // 99% of tokens (1% slippage)
    const minBnb = ethers.parseEther("790"); // Adjust based on BNB price
    const bnbAmount = ethers.parseEther("800"); // Input actual BNB amount

    const liquidityTx = await router.addLiquidityETH(
        tokenAddress,
        LIQUIDITY_PRN,
        minTokens,
        minBnb,
        liquidityWallet,
        deadline,
        { value: bnbAmount }
    );

    const receipt = await liquidityTx.wait();
    console.log("✅ Liquidity added successfully");
    console.log(`📋 Transaction: ${receipt.transactionHash}`);
    */

    console.log("\n📋 Next Steps:");
    console.log("1. Manually calculate required BNB amount");
    console.log("2. Uncomment and execute addLiquidityETH");
    console.log("3. Lock LP tokens via PinkLock");
    console.log("4. Verify pool on PancakeSwap");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });