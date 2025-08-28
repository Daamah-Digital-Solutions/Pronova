# 🚀 PRONOVA BSC DEPLOYMENT GUIDE
**Complete Step-by-Step Plan for BSC Testnet & Mainnet**

---

## 📊 CURRENT PROJECT ANALYSIS

✅ **What's Good:**
- Smart contracts are written and compiled
- Hardhat config has BSC networks configured
- Basic deployment scripts exist
- TypeScript support is set up

⚠️ **Issues Found:**
- Deploy script is incomplete (missing constructor parameters)
- No proper BSC testnet/mainnet configuration
- Missing verification setup for BscScan
- No proper wallet management
- Incomplete contract setup and token distribution

---

## 📝 STEP-BY-STEP DEPLOYMENT PLAN

### 🎯 PHASE 1: WALLET PREPARATION

#### Wallets You Need (5 Total):

| Wallet | Purpose | Network | Security Level |
|--------|---------|---------|----------------|
| **DEPLOYER** | Deploy contracts only | Both | Medium (Hot wallet OK) |
| **TREASURY** | Receive presale funds | Both | HIGH (Multi-sig) |
| **TEAM** | Team token allocation | Both | HIGH (Multi-sig) |
| **LIQUIDITY** | DEX liquidity tokens | Both | Medium (Hardware wallet) |
| **MARKETING** | Marketing tokens | Both | Medium (Hardware wallet) |

#### How to Create Wallets:

**Option 1: MetaMask (Easiest)**
```bash
# Install MetaMask browser extension
# Create 5 separate accounts
# Save private keys securely (NEVER share them!)
```

**Option 2: Command Line (More Secure)**
```bash
# Install ethers or web3 tools
npm install -g ethereumjs-wallet

# Generate wallets
node -e "
const Wallet = require('ethereumjs-wallet').default;
for(let i = 1; i <= 5; i++) {
  const wallet = Wallet.generate();
  console.log(\`Wallet \${i}:\`);
  console.log('Address:', wallet.getAddressString());
  console.log('Private Key:', wallet.getPrivateKeyString());
  console.log('---');
}
"
```

### 🔧 PHASE 2: HARDHAT CONFIGURATION

#### 1. Update hardhat.config.ts:

```typescript
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-verify";
import * as dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {
      chainId: 31337,
    },
    localhost: {
      url: "http://127.0.0.1:8545",
    },
    // BSC Testnet
    bscTestnet: {
      url: "https://data-seed-prebsc-1-s1.binance.org:8545",
      accounts: process.env.DEPLOYER_PRIVATE_KEY ? [process.env.DEPLOYER_PRIVATE_KEY] : [],
      chainId: 97,
      gasPrice: 20000000000, // 20 gwei
      gas: 2100000,
    },
    // BSC Mainnet
    bscMainnet: {
      url: "https://bsc-dataseed.binance.org/",
      accounts: process.env.DEPLOYER_PRIVATE_KEY ? [process.env.DEPLOYER_PRIVATE_KEY] : [],
      chainId: 56,
      gasPrice: 5000000000, // 5 gwei
      gas: 2100000,
    },
  },
  paths: {
    sources: "./contracts/contracts",
    tests: "./contracts/test",
    cache: "./contracts/cache",
    artifacts: "./contracts/artifacts",
  },
  etherscan: {
    apiKey: {
      bsc: process.env.BSCSCAN_API_KEY || "",
      bscTestnet: process.env.BSCSCAN_API_KEY || "",
    },
  },
  sourcify: {
    enabled: true
  }
};

export default config;
```

#### 2. Create .env file:

```env
# NEVER COMMIT THIS FILE TO GIT!
# Add .env to your .gitignore

# Wallet Private Keys (WITHOUT 0x prefix)
DEPLOYER_PRIVATE_KEY=your_deployer_private_key_here
TREASURY_ADDRESS=0x_your_treasury_wallet_address
TEAM_WALLET_ADDRESS=0x_your_team_wallet_address
LIQUIDITY_WALLET_ADDRESS=0x_your_liquidity_wallet_address
MARKETING_WALLET_ADDRESS=0x_your_marketing_wallet_address

# API Keys
BSCSCAN_API_KEY=your_bscscan_api_key_here

# BSC RPC URLs (backups)
BSC_MAINNET_RPC=https://bsc-dataseed.binance.org/
BSC_TESTNET_RPC=https://data-seed-prebsc-1-s1.binance.org:8545

# Token Addresses (for mainnet deployment)
USDT_BSC_MAINNET=0x55d398326f99059fF775485246999027B3197955
BUSD_BSC_MAINNET=0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56

# Price Feed Addresses (Chainlink)
BNB_USD_FEED_MAINNET=0x0567F2323251f0Aab15c8dFb1967E4e8A7D42aeE
ETH_USD_FEED_MAINNET=0x9ef1B8c0E4F7dc8bF5719Ea496883DC6401d5b2e
```

### 💰 PHASE 3: FUND YOUR WALLETS

#### BSC Testnet (FREE):

**Get BNB Testnet Tokens:**
1. Go to: https://testnet.binance.org/faucet-smart
2. Connect your MetaMask to BSC Testnet
3. Enter your deployer wallet address
4. Request 0.5 BNB (should be enough)

**Alternative Faucets:**
- https://testnet.bnbchain.org/faucet-smart
- https://testnet.binance.org/faucet-smart

#### BSC Mainnet (COSTS MONEY):

**Required BNB for Deployment:**
- Contract deployment: ~0.05 BNB ($15-20)
- Contract configuration: ~0.02 BNB ($5-10)
- Contract verification: ~0.01 BNB ($3-5)
- **Total needed: ~0.1 BNB ($30-40)**

**How to buy BNB:**
1. Use Binance exchange
2. Use PancakeSwap (swap from other tokens)
3. Use centralized exchanges (Coinbase, KuCoin, etc.)

### 🛠 PHASE 4: UPDATED DEPLOYMENT SCRIPT

#### Create scripts/deploy-bsc.ts:

```typescript
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
```

### 🧪 PHASE 5: TESTNET DEPLOYMENT

#### Commands to run:

```bash
# 1. Navigate to contracts directory
cd backend

# 2. Install dependencies (if not already done)
npm install

# 3. Compile contracts
npx hardhat compile

# 4. Deploy to BSC Testnet
npx hardhat run scripts/deploy-bsc.ts --network bscTestnet

# 5. Save the output addresses!
```

#### Expected Output:
```
🚀 Starting Pronova BSC Deployment
📅 Date: 2024-12-XX...
🌐 Network: bscTestnet
==================================================
👤 Deployer: 0x...
💰 Balance: 0.5 BNB

📦 DEPLOYING CONTRACTS...
1️⃣ Deploying PronovaToken...
   ✅ PronovaToken: 0x...
2️⃣ Deploying PronovaPresale...
   ✅ PronovaPresale: 0x...
3️⃣ Deploying PronovaVesting...
   ✅ PronovaVesting: 0x...

⚙️ CONFIGURING CONTRACTS...
✅ All contracts configured!

🔍 VERIFYING CONTRACTS...
✅ PronovaToken verified
✅ PronovaPresale verified
✅ PronovaVesting verified

✅ DEPLOYMENT COMPLETE!
```

### 🔍 PHASE 6: CONTRACT VERIFICATION

#### Get BscScan API Key:
1. Go to: https://bscscan.com/myapikey
2. Create account and get API key
3. Add to your .env file

#### Manual Verification (if auto-verify fails):
```bash
# Verify PronovaToken
npx hardhat verify --network bscTestnet YOUR_TOKEN_ADDRESS

# Verify PronovaPresale (with constructor args)
npx hardhat verify --network bscTestnet YOUR_PRESALE_ADDRESS \
  "TOKEN_ADDRESS" \
  "USDT_ADDRESS" \
  "TREASURY_ADDRESS" \
  "ETH_USD_FEED" \
  "BNB_USD_FEED"

# Verify PronovaVesting
npx hardhat verify --network bscTestnet YOUR_VESTING_ADDRESS \
  "TOKEN_ADDRESS"
```

### 🚀 PHASE 7: MAINNET DEPLOYMENT

#### Pre-deployment Checklist:
- [ ] Testnet deployment successful
- [ ] All contracts verified on testnet
- [ ] Contract functionality tested
- [ ] Mainnet wallets funded with BNB
- [ ] All wallet addresses confirmed
- [ ] Team approval for mainnet deployment

#### Mainnet Deployment Commands:
```bash
# Deploy to BSC Mainnet (COSTS REAL MONEY!)
npx hardhat run scripts/deploy-bsc.ts --network bscMainnet
```

### 📁 PHASE 8: EXPORT FOR FRONTEND

#### Files to Share with Frontend Team:

**1. Contract Addresses:**
```json
{
  "bscMainnet": {
    "PronovaToken": "0x...",
    "PronovaPresale": "0x...",
    "PronovaVesting": "0x...",
    "chainId": 56
  },
  "bscTestnet": {
    "PronovaToken": "0x...",
    "PronovaPresale": "0x...",
    "PronovaVesting": "0x...",
    "chainId": 97
  }
}
```

**2. ABI Files (from artifacts folder):**
- `artifacts/contracts/contracts/PronovaToken.sol/PronovaToken.json`
- `artifacts/contracts/contracts/PronovaPresale.sol/PronovaPresale.json`
- `artifacts/contracts/contracts/PronovaVesting.sol/PronovaVesting.json`

**3. Network Configuration:**
```json
{
  "bscMainnet": {
    "name": "BSC Mainnet",
    "rpcUrl": "https://bsc-dataseed.binance.org/",
    "explorerUrl": "https://bscscan.com",
    "chainId": 56
  },
  "bscTestnet": {
    "name": "BSC Testnet", 
    "rpcUrl": "https://data-seed-prebsc-1-s1.binance.org:8545",
    "explorerUrl": "https://testnet.bscscan.com",
    "chainId": 97
  }
}
```

---

## ✅ FINAL DEPLOYMENT CHECKLIST

### 🔐 Security Checklist:
- [ ] Private keys NEVER committed to git
- [ ] .env file added to .gitignore
- [ ] Multi-sig wallets set up for treasury and team
- [ ] Hardware wallets used for high-value addresses
- [ ] All wallet addresses verified multiple times
- [ ] Contract ownership transferred to secure wallet

### 📋 Pre-Testnet Checklist:
- [ ] 5 wallet addresses generated and secured
- [ ] BscScan API key obtained
- [ ] BSC Testnet BNB obtained (0.5 BNB minimum)
- [ ] .env file configured with all addresses
- [ ] hardhat.config.ts updated
- [ ] deploy-bsc.ts script ready

### 📋 Pre-Mainnet Checklist:
- [ ] Testnet deployment successful and tested
- [ ] All contracts verified on testnet BscScan
- [ ] Frontend team has testnet addresses for integration
- [ ] Mainnet BNB purchased (0.1 BNB minimum)
- [ ] All team members approve mainnet deployment
- [ ] Emergency procedures documented
- [ ] Contract monitoring set up

### 📋 Post-Deployment Checklist:
- [ ] All contract addresses saved securely
- [ ] Verification completed on BscScan
- [ ] ABI files exported for frontend
- [ ] Deployment documentation updated
- [ ] Contract ownership transferred
- [ ] Initial token distribution completed
- [ ] Presale phases configured correctly

---

## 🎯 WHAT YOU NEED TO PROVIDE ME

**CRITICAL - I NEED THESE FROM YOU:**

1. **Wallet Addresses (5 addresses):**
   ```
   DEPLOYER_ADDRESS=0x...
   TREASURY_ADDRESS=0x...
   TEAM_WALLET_ADDRESS=0x...
   LIQUIDITY_WALLET_ADDRESS=0x...
   MARKETING_WALLET_ADDRESS=0x...
   ```

2. **Private Key (DEPLOYER ONLY):**
   ```
   DEPLOYER_PRIVATE_KEY=xxx (without 0x)
   ```

3. **BscScan API Key:**
   ```
   BSCSCAN_API_KEY=xxx
   ```

4. **Confirmation that you want BSC (not Ethereum)**
   - Lower gas fees (~$30 vs $500+)
   - Faster transactions
   - Compatible with PancakeSwap

Once you provide these, I can:
- ✅ Update all configuration files
- ✅ Deploy to BSC testnet immediately  
- ✅ Help you test everything
- ✅ Deploy to BSC mainnet when ready
- ✅ Export all files for frontend team

**Ready to deploy? Send me those wallet addresses! 🚀**