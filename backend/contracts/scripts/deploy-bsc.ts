import { ethers, network, run } from "hardhat";
import * as fs from "fs";
import * as path from "path";

interface DeploymentConfig {
  network: string;
  usdtAddress: string;
  treasuryAddress: string;
  teamWallet: string;
  liquidityWallet: string;
  marketingWallet: string;
  ethUsdFeed: string;
  bnbUsdFeed: string;
}

async function main() {
  console.log("🚀 Starting Pronova BSC Deployment");
  console.log("📅 Date:", new Date().toISOString());
  console.log("🌐 Network:", network.name);
  console.log("=" .repeat(50));

  // Get configuration based on network
  const config = getNetworkConfig();
  
  // Get deployer
  const [deployer] = await ethers.getSigners();
  console.log("👤 Deployer:", deployer.address);
  
  // Check balance
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("💰 Balance:", ethers.formatEther(balance), "BNB");
  
  if (balance < ethers.parseEther("0.05")) {
    throw new Error("❌ Insufficient BNB for deployment. Need at least 0.05 BNB");
  }

  console.log("\n📝 DEPLOYMENT CONFIGURATION:");
  console.log("Treasury:", config.treasuryAddress);
  console.log("Team:", config.teamWallet);
  console.log("Liquidity:", config.liquidityWallet);
  console.log("Marketing:", config.marketingWallet);
  console.log("USDT:", config.usdtAddress);

  // Deploy contracts
  const contracts = await deployContracts(config);
  
  // Configure contracts
  await configureContracts(contracts, config);
  
  // Save deployment info
  await saveDeploymentInfo(contracts, config);
  
  // Verify contracts
  if (network.name !== "localhost") {
    await verifyContracts(contracts, config);
  }

  console.log("\n✅ DEPLOYMENT COMPLETE!");
  printSummary(contracts);
}

async function deployContracts(config: DeploymentConfig) {
  console.log("\n📦 DEPLOYING CONTRACTS...");
  
  // 1. Deploy PronovaToken
  console.log("\n1️⃣ Deploying PronovaToken...");
  const PronovaToken = await ethers.getContractFactory("PronovaToken");
  const pronovaToken = await PronovaToken.deploy();
  await pronovaToken.waitForDeployment();
  const tokenAddress = await pronovaToken.getAddress();
  console.log("   ✅ PronovaToken:", tokenAddress);

  // 2. Deploy PronovaPresale
  console.log("\n2️⃣ Deploying PronovaPresale...");
  const PronovaPresale = await ethers.getContractFactory("PronovaPresale");
  const pronovaPresale = await PronovaPresale.deploy(
    tokenAddress,
    config.usdtAddress,
    config.treasuryAddress,
    config.ethUsdFeed,
    config.bnbUsdFeed
  );
  await pronovaPresale.waitForDeployment();
  const presaleAddress = await pronovaPresale.getAddress();
  console.log("   ✅ PronovaPresale:", presaleAddress);

  // 3. Deploy PronovaVesting
  console.log("\n3️⃣ Deploying PronovaVesting...");
  const PronovaVesting = await ethers.getContractFactory("PronovaVesting");
  const pronovaVesting = await PronovaVesting.deploy(tokenAddress);
  await pronovaVesting.waitForDeployment();
  const vestingAddress = await pronovaVesting.getAddress();
  console.log("   ✅ PronovaVesting:", vestingAddress);

  return {
    pronovaToken,
    pronovaPresale,
    pronovaVesting,
    tokenAddress,
    presaleAddress,
    vestingAddress
  };
}

async function configureContracts(contracts: any, config: DeploymentConfig) {
  console.log("\n⚙️ CONFIGURING CONTRACTS...");
  
  const { pronovaToken, pronovaPresale } = contracts;

  // Set presale contract
  console.log("1. Setting presale contract...");
  let tx = await pronovaToken.setPresaleContract(contracts.presaleAddress);
  await tx.wait();

  // Set wallets
  console.log("2. Setting team wallet...");
  tx = await pronovaToken.setTeamWallet(config.teamWallet);
  await tx.wait();

  console.log("3. Setting liquidity wallet...");
  tx = await pronovaToken.setLiquidityWallet(config.liquidityWallet);
  await tx.wait();

  console.log("4. Setting marketing wallet...");
  tx = await pronovaToken.setMarketingWallet(config.marketingWallet);
  await tx.wait();

  // Distribute allocations
  console.log("5. Distributing token allocations...");
  tx = await pronovaToken.distributeAllocations();
  await tx.wait();

  // Configure presale phases
  console.log("6. Setting up presale phases...");
  const phases = [
    { price: 50000, allocation: 100_000_000, min: 100, max: 50000 },   // $0.05
    { price: 70000, allocation: 100_000_000, min: 100, max: 50000 },   // $0.07
    { price: 90000, allocation: 100_000_000, min: 100, max: 75000 },   // $0.09
    { price: 100000, allocation: 100_000_000, min: 100, max: 100000 }  // $0.10
  ];

  for (let i = 0; i < phases.length; i++) {
    const phase = phases[i];
    tx = await pronovaPresale.setPhase(
      i + 1,
      phase.price,
      ethers.parseEther(phase.allocation.toString()),
      phase.min * 10**6, // Convert to 6 decimals (USDT format)
      phase.max * 10**6,
      Math.floor(Date.now() / 1000), // Start now
      Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60) // 30 days
    );
    await tx.wait();
    console.log(`   Phase ${i + 1} configured`);
  }

  console.log("✅ All contracts configured!");
}

async function verifyContracts(contracts: any, config: DeploymentConfig) {
  console.log("\n🔍 VERIFYING CONTRACTS...");
  
  // Wait for block confirmations
  console.log("Waiting for block confirmations...");
  await new Promise(resolve => setTimeout(resolve, 30000));

  try {
    console.log("Verifying PronovaToken...");
    await run("verify:verify", {
      address: contracts.tokenAddress,
      constructorArguments: [],
    });
    console.log("✅ PronovaToken verified");
  } catch (error: any) {
    console.log("❌ PronovaToken verification failed:", error.message);
  }

  try {
    console.log("Verifying PronovaPresale...");
    await run("verify:verify", {
      address: contracts.presaleAddress,
      constructorArguments: [
        contracts.tokenAddress,
        config.usdtAddress,
        config.treasuryAddress,
        config.ethUsdFeed,
        config.bnbUsdFeed
      ],
    });
    console.log("✅ PronovaPresale verified");
  } catch (error: any) {
    console.log("❌ PronovaPresale verification failed:", error.message);
  }

  try {
    console.log("Verifying PronovaVesting...");
    await run("verify:verify", {
      address: contracts.vestingAddress,
      constructorArguments: [contracts.tokenAddress],
    });
    console.log("✅ PronovaVesting verified");
  } catch (error: any) {
    console.log("❌ PronovaVesting verification failed:", error.message);
  }
}

async function saveDeploymentInfo(contracts: any, config: DeploymentConfig) {
  const deploymentInfo = {
    network: network.name,
    chainId: network.config.chainId,
    timestamp: new Date().toISOString(),
    contracts: {
      PronovaToken: contracts.tokenAddress,
      PronovaPresale: contracts.presaleAddress,
      PronovaVesting: contracts.vestingAddress,
    },
    configuration: config,
    explorerUrls: {
      PronovaToken: `${getExplorerUrl()}/address/${contracts.tokenAddress}`,
      PronovaPresale: `${getExplorerUrl()}/address/${contracts.presaleAddress}`,
      PronovaVesting: `${getExplorerUrl()}/address/${contracts.vestingAddress}`,
    }
  };

  const deploymentsDir = path.join(__dirname, "..", "deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir);
  }

  const filename = `${network.name}-deployment-${Date.now()}.json`;
  fs.writeFileSync(
    path.join(deploymentsDir, filename),
    JSON.stringify(deploymentInfo, null, 2)
  );

  console.log(`📄 Deployment saved: ${filename}`);
}

function getNetworkConfig(): DeploymentConfig {
  const networkName = network.name;
  
  if (networkName === "bscTestnet") {
    return {
      network: "bscTestnet",
      usdtAddress: "0x337610d27c682E347C9cD60BD4b3b107C9d34dDd", // USDT testnet
      treasuryAddress: process.env.TREASURY_ADDRESS!,
      teamWallet: process.env.TEAM_WALLET_ADDRESS!,
      liquidityWallet: process.env.LIQUIDITY_WALLET_ADDRESS!,
      marketingWallet: process.env.MARKETING_WALLET_ADDRESS!,
      ethUsdFeed: "0x143db3CEEfbdfe5631aDD3E50f7614B6ba708BA7", // ETH/USD testnet
      bnbUsdFeed: "0x2514895c72f50D8bd4B4F9b1110F0D6bD2c97526"  // BNB/USD testnet
    };
  } else if (networkName === "bscMainnet") {
    return {
      network: "bscMainnet",
      usdtAddress: process.env.USDT_BSC_MAINNET!,
      treasuryAddress: process.env.TREASURY_ADDRESS!,
      teamWallet: process.env.TEAM_WALLET_ADDRESS!,
      liquidityWallet: process.env.LIQUIDITY_WALLET_ADDRESS!,
      marketingWallet: process.env.MARKETING_WALLET_ADDRESS!,
      ethUsdFeed: process.env.ETH_USD_FEED_MAINNET!,
      bnbUsdFeed: process.env.BNB_USD_FEED_MAINNET!
    };
  } else {
    throw new Error(`Unsupported network: ${networkName}`);
  }
}

function getExplorerUrl(): string {
  if (network.name === "bscTestnet") {
    return "https://testnet.bscscan.com";
  } else if (network.name === "bscMainnet") {
    return "https://bscscan.com";
  }
  return "";
}

function printSummary(contracts: any) {
  console.log("\n📊 DEPLOYMENT SUMMARY");
  console.log("=" .repeat(50));
  console.log("PronovaToken:", contracts.tokenAddress);
  console.log("PronovaPresale:", contracts.presaleAddress);
  console.log("PronovaVesting:", contracts.vestingAddress);
  console.log("=" .repeat(50));
  console.log("🔗 View on BscScan:");
  console.log(`${getExplorerUrl()}/address/${contracts.tokenAddress}`);
  console.log(`${getExplorerUrl()}/address/${contracts.presaleAddress}`);
  console.log(`${getExplorerUrl()}/address/${contracts.vestingAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });