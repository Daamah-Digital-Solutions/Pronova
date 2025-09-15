# 🚀 PRONOVA SMART CONTRACT DEPLOYMENT GUIDE
**Complete Step-by-Step Deployment Instructions**
**Created: December 2024**

---

## 📋 TABLE OF CONTENTS
1. [Wallet Structure & Requirements](#1-wallet-structure--requirements)
2. [Environment Setup](#2-environment-setup)
3. [Deployment Scripts](#3-deployment-scripts)
4. [Testnet Deployment](#4-testnet-deployment)
5. [Mainnet Deployment](#5-mainnet-deployment)
6. [Contract Verification](#6-contract-verification)
7. [Frontend Integration](#7-frontend-integration)
8. [Security Checklist](#8-security-checklist)
9. [Gas Cost Estimates](#9-gas-cost-estimates)
10. [Emergency Procedures](#10-emergency-procedures)

---

## 1. WALLET STRUCTURE & REQUIREMENTS

### Required Wallets (6 Total)

```
┌─────────────────────────────────────────────────────────────┐
│                    WALLET ARCHITECTURE                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. DEPLOYER WALLET (Hot Wallet)                           │
│     └── Deploys all contracts                              │
│     └── Initial owner of contracts                         │
│     └── Transfers ownership after deployment               │
│                                                              │
│  2. OWNER WALLET (Multi-sig Cold Wallet)                   │
│     └── Final owner of all contracts                       │
│     └── Can pause/unpause contracts                        │
│     └── Emergency functions access                         │
│                                                              │
│  3. TREASURY WALLET (Multi-sig)                            │
│     └── Receives presale funds                             │
│     └── 2/3 or 3/5 multi-sig recommended                  │
│                                                              │
│  4. TEAM WALLET                                            │
│     └── Receives 15% allocation (150M PRN)                │
│     └── Subject to vesting schedule                        │
│                                                              │
│  5. LIQUIDITY WALLET                                       │
│     └── Receives 20% allocation (200M PRN)                │
│     └── For DEX liquidity provision                       │
│                                                              │
│  6. MARKETING WALLET                                       │
│     └── Receives 10% allocation (100M PRN)                │
│     └── For marketing activities                           │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Why These Wallets?

- **DEPLOYER**: Temporary wallet for deployment only. Should NOT hold long-term funds.
- **OWNER**: Multi-sig for security. Controls critical functions.
- **TREASURY**: Multi-sig to protect presale funds. Requires multiple signatures for withdrawals.
- **TEAM/LIQUIDITY/MARKETING**: Separate wallets for transparency and proper fund management.

---

## 2. ENVIRONMENT SETUP

### Step 1: Generate Wallet Keys

```bash
# Install Node.js tools
npm install -g ethereumjs-wallet

# Generate wallets using Node.js
node -e "
const Wallet = require('ethereumjs-wallet').default;
for(let i = 1; i <= 6; i++) {
  const wallet = Wallet.generate();
  console.log('Wallet ' + i + ':');
  console.log('Address:', wallet.getAddressString());
  console.log('Private Key:', wallet.getPrivateKeyString());
  console.log('---');
}
"
```

### Step 2: Create .env File

Create `.env` file in `backend/contracts/` directory:

```env
# Network Configuration
ALCHEMY_API_KEY=your_alchemy_api_key_here
INFURA_API_KEY=your_infura_api_key_here
ETHERSCAN_API_KEY=your_etherscan_api_key_here
BSCSCAN_API_KEY=your_bscscan_api_key_here

# Wallet Private Keys (NEVER COMMIT THIS FILE!)
DEPLOYER_PRIVATE_KEY=0x_your_deployer_private_key
OWNER_ADDRESS=0x_multisig_owner_address
TREASURY_ADDRESS=0x_multisig_treasury_address
TEAM_WALLET_ADDRESS=0x_team_wallet_address
LIQUIDITY_WALLET_ADDRESS=0x_liquidity_wallet_address
MARKETING_WALLET_ADDRESS=0x_marketing_wallet_address

# Contract Addresses (Will be filled after deployment)
PRONOVA_TOKEN_ADDRESS=
PRONOVA_PRESALE_ADDRESS=
PRONOVA_VESTING_ADDRESS=

# Chainlink Price Feeds
# Ethereum Mainnet
ETH_USD_FEED_MAINNET=0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419
BNB_USD_FEED_MAINNET=0x14e613AC84a31f709eadbdF89C6CC390fDc9540A

# Sepolia Testnet
ETH_USD_FEED_SEPOLIA=0x694AA1769357215DE4FAC081bf1f309aDC325306
BNB_USD_FEED_SEPOLIA=0x1b44F3514812d835EB1BDB0acB33d3fA3351Ee43

# BSC Mainnet
ETH_USD_FEED_BSC=0x9ef1B8c0E4F7dc8bF5719Ea496883DC6401d5b2e
BNB_USD_FEED_BSC=0x0567F2323251f0Aab15c8dFb1967E4e8A7D42aeE

# BSC Testnet
ETH_USD_FEED_BSC_TESTNET=0x143db3CEEfbdfe5631aDD3E50f7614B6ba708BA7
BNB_USD_FEED_BSC_TESTNET=0x2514895c72f50D8bd4B4F9b1110F0D6bD2c97526

# USDT Addresses
USDT_MAINNET=0xdAC17F958D2ee523a2206206994597C13D831ec7
USDT_BSC=0x55d398326f99059fF775485246999027B3197955
USDT_SEPOLIA=0x7169D38820dfd117C3FA1f22a697dBA58d90BA06
```

### Step 3: Install Dependencies

```bash
cd backend/contracts
npm install --save-dev @nomicfoundation/hardhat-toolbox @nomicfoundation/hardhat-verify
npm install dotenv
```

---

## 3. DEPLOYMENT SCRIPTS

### Main Deployment Script

Create `backend/contracts/scripts/deploy-all.ts`:

```typescript
import { ethers, network, run } from "hardhat";
import * as fs from "fs";
import * as path from "path";
import dotenv from "dotenv";

dotenv.config();

// Configuration interface
interface DeploymentConfig {
  network: string;
  ethUsdFeed: string;
  bnbUsdFeed: string;
  usdtAddress: string;
  treasuryAddress: string;
  teamWallet: string;
  liquidityWallet: string;
  marketingWallet: string;
  ownerAddress: string;
}

// Delay function for rate limiting
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function main() {
  console.log("🚀 Starting Pronova Deployment");
  console.log("📅 Deployment Date:", new Date().toISOString());
  console.log("🌐 Network:", network.name);
  console.log("=" .repeat(50));

  // Get deployment configuration
  const config = getDeploymentConfig();
  
  // Get deployer
  const [deployer] = await ethers.getSigners();
  console.log("👤 Deployer address:", deployer.address);
  
  // Check deployer balance
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("💰 Deployer balance:", ethers.formatEther(balance), "ETH");
  
  if (balance < ethers.parseEther("0.1")) {
    throw new Error("Insufficient balance for deployment. Need at least 0.1 ETH");
  }

  console.log("\n" + "=" .repeat(50));
  console.log("📝 DEPLOYMENT CONFIGURATION");
  console.log("=" .repeat(50));
  console.log("Treasury:", config.treasuryAddress);
  console.log("Team Wallet:", config.teamWallet);
  console.log("Liquidity Wallet:", config.liquidityWallet);
  console.log("Marketing Wallet:", config.marketingWallet);
  console.log("Owner (Multi-sig):", config.ownerAddress);
  console.log("=" .repeat(50) + "\n");

  // Deploy contracts
  const contracts = await deployContracts(config);
  
  // Configure contracts
  await configureContracts(contracts, config);
  
  // Save deployment info
  await saveDeploymentInfo(contracts, config);
  
  // Verify contracts if not on localhost
  if (network.name !== "localhost" && network.name !== "hardhat") {
    await verifyContracts(contracts);
  }

  console.log("\n✅ DEPLOYMENT COMPLETE!");
  console.log("=" .repeat(50));
  displayDeploymentSummary(contracts);
}

async function deployContracts(config: DeploymentConfig) {
  console.log("\n📦 DEPLOYING CONTRACTS...\n");
  
  // 1. Deploy PronovaToken
  console.log("1️⃣ Deploying PronovaToken...");
  const PronovaToken = await ethers.getContractFactory("PronovaToken");
  const pronovaToken = await PronovaToken.deploy();
  await pronovaToken.waitForDeployment();
  const tokenAddress = await pronovaToken.getAddress();
  console.log("   ✅ PronovaToken deployed to:", tokenAddress);
  console.log("   Gas used:", (await pronovaToken.deploymentTransaction()?.wait())?.gasUsed.toString());

  // 2. Deploy MockUSDT (for testnet only)
  let usdtAddress = config.usdtAddress;
  if (network.name === "localhost" || network.name === "sepolia" || network.name === "bscTestnet") {
    console.log("\n2️⃣ Deploying MockUSDT (Testnet)...");
    const MockUSDT = await ethers.getContractFactory("MockUSDT");
    const mockUSDT = await MockUSDT.deploy();
    await mockUSDT.waitForDeployment();
    usdtAddress = await mockUSDT.getAddress();
    console.log("   ✅ MockUSDT deployed to:", usdtAddress);
  }

  // 3. Deploy PronovaPresale
  console.log("\n3️⃣ Deploying PronovaPresale...");
  const PronovaPresale = await ethers.getContractFactory("PronovaPresale");
  const pronovaPresale = await PronovaPresale.deploy(
    tokenAddress,
    usdtAddress,
    config.treasuryAddress,
    config.ethUsdFeed,
    config.bnbUsdFeed
  );
  await pronovaPresale.waitForDeployment();
  const presaleAddress = await pronovaPresale.getAddress();
  console.log("   ✅ PronovaPresale deployed to:", presaleAddress);
  console.log("   Gas used:", (await pronovaPresale.deploymentTransaction()?.wait())?.gasUsed.toString());

  // 4. Deploy PronovaVesting
  console.log("\n4️⃣ Deploying PronovaVesting...");
  const PronovaVesting = await ethers.getContractFactory("PronovaVesting");
  const pronovaVesting = await PronovaVesting.deploy(tokenAddress);
  await pronovaVesting.waitForDeployment();
  const vestingAddress = await pronovaVesting.getAddress();
  console.log("   ✅ PronovaVesting deployed to:", vestingAddress);
  console.log("   Gas used:", (await pronovaVesting.deploymentTransaction()?.wait())?.gasUsed.toString());

  return {
    pronovaToken,
    pronovaPresale,
    pronovaVesting,
    tokenAddress,
    presaleAddress,
    vestingAddress,
    usdtAddress
  };
}

async function configureContracts(contracts: any, config: DeploymentConfig) {
  console.log("\n⚙️ CONFIGURING CONTRACTS...\n");
  
  const { pronovaToken, pronovaPresale, pronovaVesting, presaleAddress, vestingAddress } = contracts;

  // 1. Configure PronovaToken
  console.log("1️⃣ Configuring PronovaToken...");
  
  console.log("   Setting presale contract...");
  let tx = await pronovaToken.setPresaleContract(presaleAddress);
  await tx.wait();
  console.log("   ✅ Presale contract set");

  console.log("   Setting team wallet...");
  tx = await pronovaToken.setTeamWallet(config.teamWallet);
  await tx.wait();
  console.log("   ✅ Team wallet set");

  console.log("   Setting liquidity wallet...");
  tx = await pronovaToken.setLiquidityWallet(config.liquidityWallet);
  await tx.wait();
  console.log("   ✅ Liquidity wallet set");

  console.log("   Setting marketing wallet...");
  tx = await pronovaToken.setMarketingWallet(config.marketingWallet);
  await tx.wait();
  console.log("   ✅ Marketing wallet set");

  console.log("   Distributing initial allocations...");
  tx = await pronovaToken.distributeAllocations();
  await tx.wait();
  console.log("   ✅ Allocations distributed");

  // 2. Configure PronovaPresale phases
  console.log("\n2️⃣ Configuring Presale Phases...");
  
  const phases = [
    { price: 50000, allocation: 100_000_000, min: 100, max: 50000 }, // Phase 1: $0.05
    { price: 70000, allocation: 100_000_000, min: 100, max: 50000 }, // Phase 2: $0.07
    { price: 90000, allocation: 100_000_000, min: 100, max: 75000 }, // Phase 3: $0.09
    { price: 100000, allocation: 100_000_000, min: 100, max: 100000 } // Phase 4: $0.10
  ];

  for (let i = 0; i < phases.length; i++) {
    const phase = phases[i];
    console.log(`   Setting Phase ${i + 1}...`);
    tx = await pronovaPresale.setPhase(
      i + 1,
      phase.price,
      ethers.parseEther(phase.allocation.toString()),
      phase.min * 10**6,
      phase.max * 10**6,
      Math.floor(Date.now() / 1000),
      Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60) // 30 days
    );
    await tx.wait();
    console.log(`   ✅ Phase ${i + 1} configured`);
  }

  // 3. Transfer ownership to multi-sig
  console.log("\n3️⃣ Transferring Ownership...");
  
  console.log("   Transferring PronovaToken ownership...");
  tx = await pronovaToken.transferOwnership(config.ownerAddress);
  await tx.wait();
  console.log("   ✅ Token ownership transferred");

  console.log("   Transferring PronovaPresale ownership...");
  tx = await pronovaPresale.transferOwnership(config.ownerAddress);
  await tx.wait();
  console.log("   ✅ Presale ownership transferred");

  console.log("   Transferring PronovaVesting ownership...");
  tx = await pronovaVesting.transferOwnership(config.ownerAddress);
  await tx.wait();
  console.log("   ✅ Vesting ownership transferred");
}

async function saveDeploymentInfo(contracts: any, config: DeploymentConfig) {
  const deploymentInfo = {
    network: network.name,
    chainId: network.config.chainId,
    deploymentDate: new Date().toISOString(),
    contracts: {
      PronovaToken: contracts.tokenAddress,
      PronovaPresale: contracts.presaleAddress,
      PronovaVesting: contracts.vestingAddress,
      MockUSDT: contracts.usdtAddress
    },
    configuration: {
      treasury: config.treasuryAddress,
      team: config.teamWallet,
      liquidity: config.liquidityWallet,
      marketing: config.marketingWallet,
      owner: config.ownerAddress
    },
    priceFeeds: {
      ethUsd: config.ethUsdFeed,
      bnbUsd: config.bnbUsdFeed
    }
  };

  const filename = `deployment-${network.name}-${Date.now()}.json`;
  const filepath = path.join(__dirname, "..", "deployments", filename);
  
  // Create deployments directory if it doesn't exist
  if (!fs.existsSync(path.join(__dirname, "..", "deployments"))) {
    fs.mkdirSync(path.join(__dirname, "..", "deployments"));
  }
  
  fs.writeFileSync(filepath, JSON.stringify(deploymentInfo, null, 2));
  console.log(`\n💾 Deployment info saved to: ${filename}`);
}

async function verifyContracts(contracts: any) {
  console.log("\n🔍 VERIFYING CONTRACTS ON EXPLORER...\n");
  
  // Wait for block confirmations
  console.log("Waiting for block confirmations...");
  await delay(30000); // Wait 30 seconds for indexing

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
        contracts.usdtAddress,
        process.env.TREASURY_ADDRESS,
        getDeploymentConfig().ethUsdFeed,
        getDeploymentConfig().bnbUsdFeed
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

function getDeploymentConfig(): DeploymentConfig {
  const networkName = network.name;
  let config: DeploymentConfig;

  switch(networkName) {
    case "mainnet":
      config = {
        network: "mainnet",
        ethUsdFeed: process.env.ETH_USD_FEED_MAINNET!,
        bnbUsdFeed: process.env.BNB_USD_FEED_MAINNET!,
        usdtAddress: process.env.USDT_MAINNET!,
        treasuryAddress: process.env.TREASURY_ADDRESS!,
        teamWallet: process.env.TEAM_WALLET_ADDRESS!,
        liquidityWallet: process.env.LIQUIDITY_WALLET_ADDRESS!,
        marketingWallet: process.env.MARKETING_WALLET_ADDRESS!,
        ownerAddress: process.env.OWNER_ADDRESS!
      };
      break;
    case "sepolia":
      config = {
        network: "sepolia",
        ethUsdFeed: process.env.ETH_USD_FEED_SEPOLIA!,
        bnbUsdFeed: process.env.BNB_USD_FEED_SEPOLIA!,
        usdtAddress: process.env.USDT_SEPOLIA || "",
        treasuryAddress: process.env.TREASURY_ADDRESS!,
        teamWallet: process.env.TEAM_WALLET_ADDRESS!,
        liquidityWallet: process.env.LIQUIDITY_WALLET_ADDRESS!,
        marketingWallet: process.env.MARKETING_WALLET_ADDRESS!,
        ownerAddress: process.env.OWNER_ADDRESS!
      };
      break;
    case "bsc":
      config = {
        network: "bsc",
        ethUsdFeed: process.env.ETH_USD_FEED_BSC!,
        bnbUsdFeed: process.env.BNB_USD_FEED_BSC!,
        usdtAddress: process.env.USDT_BSC!,
        treasuryAddress: process.env.TREASURY_ADDRESS!,
        teamWallet: process.env.TEAM_WALLET_ADDRESS!,
        liquidityWallet: process.env.LIQUIDITY_WALLET_ADDRESS!,
        marketingWallet: process.env.MARKETING_WALLET_ADDRESS!,
        ownerAddress: process.env.OWNER_ADDRESS!
      };
      break;
    case "bscTestnet":
      config = {
        network: "bscTestnet",
        ethUsdFeed: process.env.ETH_USD_FEED_BSC_TESTNET!,
        bnbUsdFeed: process.env.BNB_USD_FEED_BSC_TESTNET!,
        usdtAddress: "",
        treasuryAddress: process.env.TREASURY_ADDRESS!,
        teamWallet: process.env.TEAM_WALLET_ADDRESS!,
        liquidityWallet: process.env.LIQUIDITY_WALLET_ADDRESS!,
        marketingWallet: process.env.MARKETING_WALLET_ADDRESS!,
        ownerAddress: process.env.OWNER_ADDRESS!
      };
      break;
    default:
      // localhost/hardhat
      config = {
        network: "localhost",
        ethUsdFeed: "0x0000000000000000000000000000000000000001",
        bnbUsdFeed: "0x0000000000000000000000000000000000000002",
        usdtAddress: "",
        treasuryAddress: process.env.TREASURY_ADDRESS || "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
        teamWallet: process.env.TEAM_WALLET_ADDRESS || "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
        liquidityWallet: process.env.LIQUIDITY_WALLET_ADDRESS || "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
        marketingWallet: process.env.MARKETING_WALLET_ADDRESS || "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65",
        ownerAddress: process.env.OWNER_ADDRESS || "0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc"
      };
  }

  return config;
}

function displayDeploymentSummary(contracts: any) {
  console.log("\n📊 DEPLOYMENT SUMMARY");
  console.log("=" .repeat(50));
  console.log("PronovaToken:", contracts.tokenAddress);
  console.log("PronovaPresale:", contracts.presaleAddress);
  console.log("PronovaVesting:", contracts.vestingAddress);
  console.log("MockUSDT:", contracts.usdtAddress);
  console.log("=" .repeat(50));
  console.log("\n🎯 NEXT STEPS:");
  console.log("1. Save these addresses in your .env file");
  console.log("2. Update frontend configuration");
  console.log("3. Test all contract functions");
  console.log("4. Set up monitoring and alerts");
  console.log("5. Prepare for public announcement");
}

// Run deployment
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
```

---

## 4. TESTNET DEPLOYMENT

### Step 1: Configure Hardhat

Update `backend/contracts/hardhat.config.ts`:

```typescript
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-verify";
import dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545"
    },
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
      accounts: process.env.DEPLOYER_PRIVATE_KEY ? [process.env.DEPLOYER_PRIVATE_KEY] : [],
      chainId: 11155111
    },
    mainnet: {
      url: `https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
      accounts: process.env.DEPLOYER_PRIVATE_KEY ? [process.env.DEPLOYER_PRIVATE_KEY] : [],
      chainId: 1
    },
    bsc: {
      url: "https://bsc-dataseed.binance.org/",
      accounts: process.env.DEPLOYER_PRIVATE_KEY ? [process.env.DEPLOYER_PRIVATE_KEY] : [],
      chainId: 56
    },
    bscTestnet: {
      url: "https://data-seed-prebsc-1-s1.binance.org:8545/",
      accounts: process.env.DEPLOYER_PRIVATE_KEY ? [process.env.DEPLOYER_PRIVATE_KEY] : [],
      chainId: 97
    }
  },
  etherscan: {
    apiKey: {
      mainnet: process.env.ETHERSCAN_API_KEY!,
      sepolia: process.env.ETHERSCAN_API_KEY!,
      bsc: process.env.BSCSCAN_API_KEY!,
      bscTestnet: process.env.BSCSCAN_API_KEY!
    }
  },
  sourcify: {
    enabled: true
  }
};

export default config;
```

### Step 2: Get Testnet ETH

```bash
# Sepolia Faucets
# 1. Alchemy Faucet: https://sepoliafaucet.com
# 2. Chainlink Faucet: https://faucets.chain.link/sepolia
# 3. Infura Faucet: https://www.infura.io/faucet/sepolia

# BSC Testnet Faucet
# https://testnet.binance.org/faucet-smart
```

### Step 3: Deploy to Testnet

```bash
cd backend/contracts

# Compile contracts first
npx hardhat compile

# Deploy to Sepolia
npx hardhat run scripts/deploy-all.ts --network sepolia

# Or deploy to BSC Testnet
npx hardhat run scripts/deploy-all.ts --network bscTestnet
```

### Step 4: Test Contract Functions

Create `backend/contracts/scripts/test-contracts.ts`:

```typescript
import { ethers, network } from "hardhat";
import * as fs from "fs";
import * as path from "path";

async function testContracts() {
  console.log("🧪 Testing Deployed Contracts");
  console.log("Network:", network.name);
  
  // Load deployment info
  const deploymentFiles = fs.readdirSync(path.join(__dirname, "..", "deployments"));
  const latestDeployment = deploymentFiles
    .filter(f => f.includes(network.name))
    .sort()
    .pop();
    
  if (!latestDeployment) {
    throw new Error("No deployment found for this network");
  }
  
  const deployment = JSON.parse(
    fs.readFileSync(
      path.join(__dirname, "..", "deployments", latestDeployment),
      "utf8"
    )
  );

  const [tester] = await ethers.getSigners();
  console.log("Tester address:", tester.address);

  // Get contract instances
  const token = await ethers.getContractAt("PronovaToken", deployment.contracts.PronovaToken);
  const presale = await ethers.getContractAt("PronovaPresale", deployment.contracts.PronovaPresale);
  const vesting = await ethers.getContractAt("PronovaVesting", deployment.contracts.PronovaVesting);

  console.log("\n📊 Testing Token Contract...");
  const totalSupply = await token.totalSupply();
  console.log("Total Supply:", ethers.formatEther(totalSupply), "PRN");
  
  const presaleBalance = await token.balanceOf(deployment.contracts.PronovaPresale);
  console.log("Presale Balance:", ethers.formatEther(presaleBalance), "PRN");

  console.log("\n💰 Testing Presale Contract...");
  const currentPhase = await presale.currentPhase();
  console.log("Current Phase:", currentPhase.toString());
  
  const phase1 = await presale.phases(1);
  console.log("Phase 1 Price:", phase1.pricePerToken.toString(), "USD (in micro units)");
  console.log("Phase 1 Allocated:", ethers.formatEther(phase1.tokensAllocated), "PRN");

  console.log("\n🔒 Testing Vesting Contract...");
  // Add vesting schedule test
  console.log("Vesting contract deployed at:", deployment.contracts.PronovaVesting);

  console.log("\n✅ Basic tests completed!");
}

testContracts()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

Run tests:
```bash
npx hardhat run scripts/test-contracts.ts --network sepolia
```

---

## 5. MAINNET DEPLOYMENT

### Pre-Deployment Checklist

```bash
# Create pre-deployment checklist script
cat > scripts/pre-deployment-check.ts << 'EOF'
import { ethers, network } from "hardhat";
import dotenv from "dotenv";

dotenv.config();

async function preDeploymentCheck() {
  console.log("🔍 PRE-DEPLOYMENT SAFETY CHECK");
  console.log("=" .repeat(50));
  
  const checks = {
    network: false,
    balance: false,
    wallets: false,
    gasPrice: false,
    multisig: false
  };

  // 1. Network Check
  console.log("\n1. Checking Network...");
  if (network.name === "mainnet" || network.name === "bsc") {
    console.log("   ✅ Mainnet selected");
    checks.network = true;
  } else {
    console.log("   ❌ Not on mainnet!");
  }

  // 2. Balance Check
  console.log("\n2. Checking Deployer Balance...");
  const [deployer] = await ethers.getSigners();
  const balance = await ethers.provider.getBalance(deployer.address);
  const balanceInEth = ethers.formatEther(balance);
  
  if (parseFloat(balanceInEth) >= 0.5) {
    console.log(`   ✅ Sufficient balance: ${balanceInEth} ETH`);
    checks.balance = true;
  } else {
    console.log(`   ❌ Insufficient balance: ${balanceInEth} ETH (need 0.5+)`);
  }

  // 3. Wallet Addresses Check
  console.log("\n3. Checking Wallet Configurations...");
  const requiredEnvVars = [
    'TREASURY_ADDRESS',
    'TEAM_WALLET_ADDRESS',
    'LIQUIDITY_WALLET_ADDRESS',
    'MARKETING_WALLET_ADDRESS',
    'OWNER_ADDRESS'
  ];
  
  let allWalletsSet = true;
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar] || !ethers.isAddress(process.env[envVar]!)) {
      console.log(`   ❌ ${envVar} not set or invalid`);
      allWalletsSet = false;
    } else {
      console.log(`   ✅ ${envVar}: ${process.env[envVar]}`);
    }
  }
  checks.wallets = allWalletsSet;

  // 4. Gas Price Check
  console.log("\n4. Checking Gas Prices...");
  const feeData = await ethers.provider.getFeeData();
  const gasPrice = feeData.gasPrice ? ethers.formatUnits(feeData.gasPrice, "gwei") : "0";
  console.log(`   Current gas price: ${gasPrice} gwei`);
  
  if (parseFloat(gasPrice) < 100) {
    console.log("   ✅ Gas price acceptable");
    checks.gasPrice = true;
  } else {
    console.log("   ⚠️ High gas price detected!");
  }

  // 5. Multi-sig Check
  console.log("\n5. Confirming Multi-sig Setup...");
  console.log("   ⚠️ MANUAL CHECK REQUIRED:");
  console.log("   - Is OWNER_ADDRESS a multi-sig? [REQUIRED]");
  console.log("   - Is TREASURY_ADDRESS a multi-sig? [REQUIRED]");
  console.log("   - Are signer thresholds set correctly? (2/3 or 3/5)");
  
  // Summary
  console.log("\n" + "=" .repeat(50));
  console.log("DEPLOYMENT READINESS SUMMARY");
  console.log("=" .repeat(50));
  
  const allChecks = Object.values(checks).every(check => check);
  
  if (allChecks) {
    console.log("✅ ALL AUTOMATED CHECKS PASSED");
    console.log("⚠️ Ensure manual multi-sig verification before proceeding!");
  } else {
    console.log("❌ SOME CHECKS FAILED - DO NOT PROCEED");
    process.exit(1);
  }
}

preDeploymentCheck()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
EOF
```

### Mainnet Deployment Steps

```bash
# 1. Run pre-deployment check
npx hardhat run scripts/pre-deployment-check.ts --network mainnet

# 2. If all checks pass, deploy
npx hardhat run scripts/deploy-all.ts --network mainnet

# 3. Save the output immediately!
# Copy all contract addresses to a secure location
```

---

## 6. CONTRACT VERIFICATION

### Automatic Verification (Recommended)

The deployment script includes automatic verification. If it fails, use manual verification:

### Manual Verification

```bash
# Verify PronovaToken
npx hardhat verify --network mainnet YOUR_TOKEN_ADDRESS

# Verify PronovaPresale
npx hardhat verify --network mainnet YOUR_PRESALE_ADDRESS \
  "TOKEN_ADDRESS" \
  "USDT_ADDRESS" \
  "TREASURY_ADDRESS" \
  "ETH_USD_FEED" \
  "BNB_USD_FEED"

# Verify PronovaVesting
npx hardhat verify --network mainnet YOUR_VESTING_ADDRESS \
  "TOKEN_ADDRESS"
```

---

## 7. FRONTEND INTEGRATION

### Step 1: Update Contract Configuration

Create `src/config/contracts.config.js`:

```javascript
// Network configurations
export const NETWORKS = {
  1: {
    name: 'Ethereum Mainnet',
    rpcUrl: process.env.REACT_APP_ETH_RPC_URL,
    explorer: 'https://etherscan.io',
    nativeCurrency: 'ETH'
  },
  56: {
    name: 'BSC Mainnet',
    rpcUrl: process.env.REACT_APP_BSC_RPC_URL,
    explorer: 'https://bscscan.com',
    nativeCurrency: 'BNB'
  },
  11155111: {
    name: 'Sepolia Testnet',
    rpcUrl: process.env.REACT_APP_SEPOLIA_RPC_URL,
    explorer: 'https://sepolia.etherscan.io',
    nativeCurrency: 'ETH'
  }
};

// Contract addresses (update after deployment)
export const CONTRACTS = {
  1: { // Ethereum Mainnet
    PronovaToken: process.env.REACT_APP_TOKEN_ADDRESS_ETH,
    PronovaPresale: process.env.REACT_APP_PRESALE_ADDRESS_ETH,
    PronovaVesting: process.env.REACT_APP_VESTING_ADDRESS_ETH,
    USDT: '0xdAC17F958D2ee523a2206206994597C13D831ec7'
  },
  56: { // BSC Mainnet
    PronovaToken: process.env.REACT_APP_TOKEN_ADDRESS_BSC,
    PronovaPresale: process.env.REACT_APP_PRESALE_ADDRESS_BSC,
    PronovaVesting: process.env.REACT_APP_VESTING_ADDRESS_BSC,
    USDT: '0x55d398326f99059fF775485246999027B3197955'
  },
  11155111: { // Sepolia
    PronovaToken: process.env.REACT_APP_TOKEN_ADDRESS_SEPOLIA,
    PronovaPresale: process.env.REACT_APP_PRESALE_ADDRESS_SEPOLIA,
    PronovaVesting: process.env.REACT_APP_VESTING_ADDRESS_SEPOLIA,
    USDT: process.env.REACT_APP_USDT_ADDRESS_SEPOLIA
  }
};

// Default network
export const DEFAULT_NETWORK = parseInt(process.env.REACT_APP_DEFAULT_NETWORK || '1');
```

### Step 2: Update Web3 Service

Update `src/services/web3Service.js`:

```javascript
import { ethers } from 'ethers';
import { CONTRACTS, NETWORKS, DEFAULT_NETWORK } from '../config/contracts.config';
import PronovaTokenABI from '../config/abis/PronovaToken.json';
import PronovaPresaleABI from '../config/abis/PronovaPresale.json';
import PronovaVestingABI from '../config/abis/PronovaVesting.json';
import ERC20ABI from '../config/abis/ERC20.json';

class Web3Service {
  constructor() {
    this.provider = null;
    this.signer = null;
    this.network = null;
    this.contracts = {};
  }

  async initialize() {
    if (!window.ethereum) {
      throw new Error('MetaMask not installed');
    }

    // Connect to provider
    this.provider = new ethers.providers.Web3Provider(window.ethereum);
    
    // Get network
    const network = await this.provider.getNetwork();
    this.network = network.chainId;

    // Check if supported network
    if (!NETWORKS[this.network]) {
      throw new Error(`Unsupported network. Please switch to Ethereum or BSC Mainnet`);
    }

    // Get signer
    this.signer = this.provider.getSigner();

    // Initialize contracts
    await this.initializeContracts();
  }

  async initializeContracts() {
    const addresses = CONTRACTS[this.network];
    
    if (!addresses) {
      throw new Error('Contracts not deployed on this network');
    }

    this.contracts = {
      token: new ethers.Contract(
        addresses.PronovaToken,
        PronovaTokenABI.abi,
        this.signer
      ),
      presale: new ethers.Contract(
        addresses.PronovaPresale,
        PronovaPresaleABI.abi,
        this.signer
      ),
      vesting: new ethers.Contract(
        addresses.PronovaVesting,
        PronovaVestingABI.abi,
        this.signer
      ),
      usdt: new ethers.Contract(
        addresses.USDT,
        ERC20ABI,
        this.signer
      )
    };
  }

  async switchNetwork(chainId) {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainId.toString(16)}` }],
      });
      await this.initialize();
    } catch (error) {
      if (error.code === 4902) {
        // Network not added to MetaMask
        await this.addNetwork(chainId);
      } else {
        throw error;
      }
    }
  }

  async addNetwork(chainId) {
    const network = NETWORKS[chainId];
    if (!network) throw new Error('Unknown network');

    await window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [{
        chainId: `0x${chainId.toString(16)}`,
        chainName: network.name,
        nativeCurrency: {
          name: network.nativeCurrency,
          symbol: network.nativeCurrency,
          decimals: 18
        },
        rpcUrls: [network.rpcUrl],
        blockExplorerUrls: [network.explorer]
      }]
    });
  }

  // Presale functions
  async buyWithETH(amount, referrer = ethers.constants.AddressZero) {
    const value = ethers.utils.parseEther(amount);
    return await this.contracts.presale.buyWithETH(referrer, { value });
  }

  async buyWithUSDT(amount, referrer = ethers.constants.AddressZero) {
    const usdtAmount = ethers.utils.parseUnits(amount, 6); // USDT has 6 decimals
    
    // First approve USDT
    const approveTx = await this.contracts.usdt.approve(
      this.contracts.presale.address,
      usdtAmount
    );
    await approveTx.wait();
    
    // Then buy tokens
    return await this.contracts.presale.buyWithUSDT(usdtAmount, referrer);
  }

  async getPresaleInfo() {
    const [
      currentPhase,
      totalRaised,
      presaleProgress
    ] = await Promise.all([
      this.contracts.presale.currentPhase(),
      this.contracts.presale.totalRaisedUSD(),
      this.contracts.presale.getPresaleProgress()
    ]);

    return {
      currentPhase: currentPhase.toNumber(),
      totalRaised: ethers.utils.formatUnits(totalRaised, 6),
      tokensSold: ethers.utils.formatEther(presaleProgress[0]),
      tokensAvailable: ethers.utils.formatEther(presaleProgress[1])
    };
  }

  async getUserInfo(address) {
    const userPurchase = await this.contracts.presale.userPurchases(address);
    
    return {
      totalTokens: ethers.utils.formatEther(userPurchase.totalTokensPurchased),
      totalPaid: ethers.utils.formatUnits(userPurchase.totalAmountPaid, 6),
      hasClaimed: userPurchase.hasClaimedTokens
    };
  }
}

export default new Web3Service();
```

### Step 3: Environment Variables

Create `.env` in frontend root:

```env
# Network Configuration
REACT_APP_DEFAULT_NETWORK=1

# RPC URLs
REACT_APP_ETH_RPC_URL=https://eth-mainnet.g.alchemy.com/v2/YOUR_KEY
REACT_APP_BSC_RPC_URL=https://bsc-dataseed.binance.org/
REACT_APP_SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY

# Contract Addresses - Ethereum Mainnet
REACT_APP_TOKEN_ADDRESS_ETH=0x...
REACT_APP_PRESALE_ADDRESS_ETH=0x...
REACT_APP_VESTING_ADDRESS_ETH=0x...

# Contract Addresses - BSC Mainnet
REACT_APP_TOKEN_ADDRESS_BSC=0x...
REACT_APP_PRESALE_ADDRESS_BSC=0x...
REACT_APP_VESTING_ADDRESS_BSC=0x...

# Contract Addresses - Sepolia Testnet
REACT_APP_TOKEN_ADDRESS_SEPOLIA=0x...
REACT_APP_PRESALE_ADDRESS_SEPOLIA=0x...
REACT_APP_VESTING_ADDRESS_SEPOLIA=0x...
REACT_APP_USDT_ADDRESS_SEPOLIA=0x...
```

---

## 8. SECURITY CHECKLIST

### Pre-Launch Security Audit

```markdown
## CRITICAL SECURITY CHECKLIST

### Smart Contracts
- [ ] All contracts audited by reputable firm
- [ ] No admin functions that can drain funds
- [ ] Reentrancy guards on all payable functions
- [ ] Proper access control (onlyOwner modifiers)
- [ ] Emergency pause functionality tested
- [ ] Integer overflow/underflow protection
- [ ] Front-running protection implemented
- [ ] Slippage protection for swaps

### Wallet Security
- [ ] Multi-sig wallets configured (2/3 or 3/5)
- [ ] Hardware wallets for signing
- [ ] Private keys NEVER in code/GitHub
- [ ] Backup seeds stored securely
- [ ] Team members KYC'd

### Infrastructure
- [ ] SSL certificates active
- [ ] DDoS protection enabled
- [ ] Rate limiting configured
- [ ] Database backups automated
- [ ] Monitoring alerts set up
- [ ] Incident response plan ready

### Frontend Security
- [ ] Input validation on all forms
- [ ] XSS protection implemented
- [ ] CORS properly configured
- [ ] Content Security Policy set
- [ ] No sensitive data in localStorage

### Operational Security
- [ ] Team 2FA enabled on all accounts
- [ ] Discord/Telegram admin verification
- [ ] Phishing protection measures
- [ ] Regular security training
- [ ] Bug bounty program ready
```

---

## 9. GAS COST ESTIMATES

### Ethereum Mainnet

| Contract | Estimated Gas | Cost @ 30 Gwei | Cost @ 50 Gwei | Cost @ 100 Gwei |
|----------|---------------|----------------|----------------|-----------------|
| PronovaToken | 2,500,000 | 0.075 ETH | 0.125 ETH | 0.25 ETH |
| PronovaPresale | 3,500,000 | 0.105 ETH | 0.175 ETH | 0.35 ETH |
| PronovaVesting | 1,500,000 | 0.045 ETH | 0.075 ETH | 0.15 ETH |
| Configuration | 500,000 | 0.015 ETH | 0.025 ETH | 0.05 ETH |
| **TOTAL** | **8,000,000** | **0.24 ETH** | **0.40 ETH** | **0.80 ETH** |

### BSC Mainnet

| Contract | Estimated Gas | Cost @ 3 Gwei | Cost @ 5 Gwei |
|----------|---------------|---------------|---------------|
| PronovaToken | 2,500,000 | 0.0075 BNB | 0.0125 BNB |
| PronovaPresale | 3,500,000 | 0.0105 BNB | 0.0175 BNB |
| PronovaVesting | 1,500,000 | 0.0045 BNB | 0.0075 BNB |
| Configuration | 500,000 | 0.0015 BNB | 0.0025 BNB |
| **TOTAL** | **8,000,000** | **0.024 BNB** | **0.04 BNB** |

### Cost in USD (Approximate)
- **Ethereum**: $400 - $1,600 (depending on gas prices)
- **BSC**: $10 - $20

---

## 10. EMERGENCY PROCEDURES

### Emergency Pause Script

Create `scripts/emergency-pause.ts`:

```typescript
import { ethers, network } from "hardhat";
import dotenv from "dotenv";

dotenv.config();

async function emergencyPause() {
  console.log("🚨 EMERGENCY PAUSE PROCEDURE");
  console.log("Network:", network.name);
  
  const [owner] = await ethers.getSigners();
  
  // Get contract addresses from env or deployment file
  const presaleAddress = process.env.PRONOVA_PRESALE_ADDRESS;
  const tokenAddress = process.env.PRONOVA_TOKEN_ADDRESS;
  
  if (!presaleAddress || !tokenAddress) {
    throw new Error("Contract addresses not found in env");
  }
  
  // Get contract instances
  const presale = await ethers.getContractAt("PronovaPresale", presaleAddress);
  const token = await ethers.getContractAt("PronovaToken", tokenAddress);
  
  console.log("Pausing presale contract...");
  let tx = await presale.pause();
  await tx.wait();
  console.log("✅ Presale paused");
  
  console.log("Pausing token contract...");
  tx = await token.pause();
  await tx.wait();
  console.log("✅ Token paused");
  
  console.log("\n🛑 ALL CONTRACTS PAUSED");
  console.log("Remember to investigate the issue before unpausing!");
}

emergencyPause()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Failed to pause:", error);
    process.exit(1);
  });
```

### Emergency Contacts

```markdown
## EMERGENCY CONTACT LIST

### Technical Team
- Lead Developer: [Your contact]
- Backup Developer: [Backup contact]
- DevOps Engineer: [DevOps contact]

### Security Team
- Security Lead: [Security contact]
- Audit Firm: [Audit firm emergency line]

### Infrastructure
- AWS Support: [Support ticket URL]
- Alchemy Support: [Support email]
- Domain Registrar: [Support contact]

### Legal/Compliance
- Legal Counsel: [Legal contact]
- Compliance Officer: [Compliance contact]

### Communication
- Community Manager: [CM contact]
- PR Agency: [PR contact]
```

---

## FINAL DEPLOYMENT COMMANDS SUMMARY

```bash
# 1. Setup
cd backend/contracts
npm install

# 2. Compile
npx hardhat compile

# 3. Test locally
npx hardhat node
# In another terminal:
npx hardhat run scripts/deploy-all.ts --network localhost

# 4. Deploy to testnet
npx hardhat run scripts/deploy-all.ts --network sepolia

# 5. Test on testnet
npx hardhat run scripts/test-contracts.ts --network sepolia

# 6. Pre-deployment check for mainnet
npx hardhat run scripts/pre-deployment-check.ts --network mainnet

# 7. Deploy to mainnet
npx hardhat run scripts/deploy-all.ts --network mainnet

# 8. Verify contracts
npx hardhat verify --network mainnet [CONTRACT_ADDRESS]

# 9. Update frontend
# Copy contract addresses to frontend .env
# Deploy frontend to Vercel/Netlify

# 10. Go live! 🚀
```

---

**IMPORTANT REMINDERS:**
1. **NEVER** share private keys
2. **ALWAYS** test on testnet first
3. **USE** multi-sig wallets for treasury and owner
4. **BACKUP** all deployment information
5. **MONITOR** contracts after deployment
6. **HAVE** emergency procedures ready

Good luck with your deployment! 🚀