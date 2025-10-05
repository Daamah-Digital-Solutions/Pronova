# Pronova Full Deployment Strategy - Self-Contained Version
**Without External Wallets**

## Overview
This deployment strategy enables the FULL Pronova system (100% whitepaper compliant) to operate entirely self-contained without requiring external wallet addresses. All allocations, vesting, and treasury operations are managed internally within the smart contracts.

## 🎯 Deployment Architecture

### Self-Contained Design
```
┌─────────────────────────────────────────────────────┐
│                  DEPLOYER WALLET                     │
│              (Your Admin Address)                    │
└──────────────┬──────────────────────────────────────┘
               │ Deploys & Configures
               ▼
┌─────────────────────────────────────────────────────┐
│                 PronovaToken                         │
│  • Holds initial 1B supply                          │
│  • Manages allocations internally                    │
│  • Multi-sig admin functions                        │
└──────────────┬──────────────────────────────────────┘
               │ Distributes to
               ▼
┌─────────────────────────────────────────────────────┐
│           PronovaPresale          PronovaVesting     │
│  • Treasury: Internal            • Holds vested tokens│
│  • Receives presale allocation   • Self-custody      │
│  • Manages sales internally      • Manages schedules │
└─────────────────────────────────────────────────────┘
```

## 📋 Required Inputs From You

### For Full Deployment (Self-Contained):
```javascript
{
  // 1. Your deployer address (automatically assigned all admin roles)
  "deployerAddress": "YOUR_WALLET_ADDRESS",

  // 2. Network selection
  "network": "bsc-testnet" // or "bsc-mainnet",

  // 3. Oracle configuration (required for presale)
  "oracles": {
    "ethUsdFeed": "0x143db3CEEfbdfe5631aDD3E50f7614B6ba708BA7", // BSC Testnet
    "bnbUsdFeed": "0x2514895c72f50D8bd4B4F9b1110F0D6bD2c97526", // BSC Testnet
    // Mainnet feeds will be different
  },

  // 4. USDT token address
  "usdtAddress": "0x337610d27c682E347C9cD60BD4b3b107C9d34dDd" // BSC Testnet USDT
}
```

## 🚀 Step-by-Step Deployment Plan

### Phase 1: Testnet Deployment

#### Step 1: Deploy Core Contracts
```javascript
// deploy-testnet.js
const { ethers } = require("hardhat");

async function deployTestnet() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  // 1. Deploy PronovaToken
  const PronovaToken = await ethers.getContractFactory("PronovaToken");
  const token = await PronovaToken.deploy();
  await token.waitForDeployment();
  console.log("PronovaToken deployed to:", await token.getAddress());

  // 2. Deploy PronovaVesting (will hold vested tokens internally)
  const PronovaVesting = await ethers.getContractFactory("PronovaVesting");
  const vesting = await PronovaVesting.deploy(await token.getAddress());
  await vesting.waitForDeployment();
  console.log("PronovaVesting deployed to:", await vesting.getAddress());

  // 3. Deploy PronovaPresale (treasury managed internally)
  const PronovaPresale = await ethers.getContractFactory("PronovaPresale");
  const presale = await PronovaPresale.deploy(
    await token.getAddress(),
    "0x337610d27c682E347C9cD60BD4b3b107C9d34dDd", // BSC Testnet USDT
    ethers.ZeroAddress, // Internal treasury (contract itself)
    "0x143db3CEEfbdfe5631aDD3E50f7614B6ba708BA7", // ETH/USD feed
    "0x2514895c72f50D8bd4B4F9b1110F0D6bD2c97526"  // BNB/USD feed
  );
  await presale.waitForDeployment();
  console.log("PronovaPresale deployed to:", await presale.getAddress());

  return { token, vesting, presale, deployer };
}
```

#### Step 2: Configure Internal Allocations
```javascript
async function configureAllocations(token, vesting, presale, deployer) {
  // Set up multi-sig admins (using deployer as both admins for self-contained setup)
  await token.grantRole(await token.ADMIN_ROLE(), deployer.address);

  // Configure allocation wallets (all internal to contracts)
  const allocationWallets = {
    presale: await presale.getAddress(),      // Presale contract holds its allocation
    founders: await vesting.getAddress(),     // Vesting contract holds founders tokens
    liquidity: await token.getAddress(),      // Temporarily held in token contract
    partnerships: await vesting.getAddress(), // Vesting contract holds partnership tokens
    team: await vesting.getAddress(),        // Vesting contract holds team tokens
    community: await token.getAddress(),     // Temporarily held in token contract
    strategic: await token.getAddress(),     // Temporarily held in token contract
    marketing: await token.getAddress(),     // Temporarily held in token contract
    staking: await token.getAddress()        // Temporarily held in token contract
  };

  // Multi-sig: First confirmation
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

  // Multi-sig: Second confirmation (in production, this would be a different admin)
  // For self-contained deployment, we'll use the same deployer
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

  console.log("Allocation wallets configured internally");
}
```

#### Step 3: Distribute Tokens & Setup Vesting
```javascript
async function distributeAndSetupVesting(token, vesting, deployer) {
  // Multi-sig: Distribute allocations
  await token.confirmDistributeAllocations();
  await token.confirmDistributeAllocations(); // Second confirmation

  console.log("Token allocations distributed to contracts");

  // Setup vesting schedules (internally managed)
  // The vesting contract now holds tokens for founders, team, and partnerships
  await vesting.setupWhitepaperAllocations(
    await vesting.getAddress(), // Founders beneficiary (self-custody)
    await vesting.getAddress(), // Team beneficiary (self-custody)
    await vesting.getAddress()  // Partnerships beneficiary (self-custody)
  );

  console.log("Vesting schedules configured for internal management");
}
```

#### Step 4: Start Presale
```javascript
async function startPresale(presale, deployer) {
  // Multi-sig: Start presale
  await presale.connect(deployer).confirmStartPresale();
  await presale.connect(deployer).confirmStartPresale(); // Second confirmation

  console.log("Presale started - Phase 1 active");
  console.log("Users can now purchase tokens");
}
```

### Phase 2: Mainnet Deployment

#### Pre-Deployment Checklist:
```markdown
□ Testnet deployment successful
□ All functions tested on testnet
□ Gas costs calculated and acceptable
□ Security audit recommendations implemented
□ Emergency procedures documented
□ Team briefed on deployment process
```

#### Mainnet Deployment Script:
```javascript
// deploy-mainnet.js
async function deployMainnet() {
  // CRITICAL: Use mainnet addresses
  const MAINNET_CONFIG = {
    usdtAddress: "0x55d398326f99059fF775485246999027B3197955", // BSC Mainnet USDT
    ethUsdFeed: "0x9ef1B8c0E4F7dc8bF5719Ea496883DC6401d5b2e",  // BSC Mainnet ETH/USD
    bnbUsdFeed: "0x0567F2323251f0Aab15c8dFb1967E4e8A7D42aeE"   // BSC Mainnet BNB/USD
  };

  // Same deployment process as testnet but with mainnet configuration
  // ... (deployment code similar to testnet)
}
```

## 🔄 How Allocations Work Without External Wallets

### 1. **Presale Allocation (250M tokens)**
- Sent directly to PronovaPresale contract
- Contract manages its own treasury internally
- Sales proceeds accumulate in contract
- Tokens distributed directly from contract to buyers

### 2. **Vesting Allocations (250M total)**
- **Founders (75M)**: Held by PronovaVesting contract
- **Team (25M)**: Held by PronovaVesting contract
- **Partnerships (150M)**: Held by PronovaVesting contract
- Vesting contract acts as custodian
- Claimable after vesting periods (self-service or admin-triggered)

### 3. **Immediate Allocations (500M total)**
- **Liquidity (120M)**: Held in PronovaToken contract
- **Community (50M)**: Held in PronovaToken contract
- **Strategic (60M)**: Held in PronovaToken contract
- **Marketing (120M)**: Held in PronovaToken contract
- **Staking (150M)**: Held in PronovaToken contract
- Can be transferred later to dedicated contracts/wallets when ready

## ⚠️ Limitations of Self-Contained Approach

### Current Limitations:
1. **No External Beneficiaries**: Vesting benefits cannot be assigned to specific individuals initially
2. **Centralized Treasury**: Presale funds accumulate in contract (requires withdrawal mechanism)
3. **Delayed Distribution**: Some allocations remain in token contract until external wallets provided
4. **Admin Dependency**: Requires admin action to distribute from holding contracts

### Mitigation Strategies:
```solidity
// Add these functions to manage internal holdings:

// In PronovaToken.sol
function withdrawAllocation(
    string memory category,
    address recipient,
    uint256 amount
) external onlyRole(ADMIN_ROLE) {
    // Allow admin to distribute held allocations when ready
}

// In PronovaPresale.sol
function withdrawTreasury(
    address recipient,
    uint256 amount
) external requiresMultiSig {
    // Allow multi-sig withdrawal of accumulated funds
}

// In PronovaVesting.sol
function assignBeneficiary(
    address currentHolder,
    address newBeneficiary
) external onlyRole(ADMIN_ROLE) {
    // Reassign vesting benefits to actual recipients later
}
```

## 📊 Deployment Verification

### Post-Deployment Checks:
```javascript
async function verifyDeployment(token, presale, vesting) {
  console.log("=== Deployment Verification ===");

  // 1. Verify token supply
  const totalSupply = await token.totalSupply();
  console.log("Total Supply:", ethers.formatEther(totalSupply), "PRN");

  // 2. Verify presale allocation
  const presaleBalance = await token.balanceOf(await presale.getAddress());
  console.log("Presale Balance:", ethers.formatEther(presaleBalance), "PRN");

  // 3. Verify vesting allocation
  const vestingBalance = await token.balanceOf(await vesting.getAddress());
  console.log("Vesting Balance:", ethers.formatEther(vestingBalance), "PRN");

  // 4. Verify presale is active
  const presaleActive = await presale.presaleActive();
  console.log("Presale Active:", presaleActive);

  // 5. Verify vesting schedules
  const totalVested = await vesting.getTotalVestedAmount();
  console.log("Total Vested:", ethers.formatEther(totalVested), "PRN");
}
```

## 🔐 Security Considerations

### Multi-Signature Setup (Self-Contained):
Since you're deploying without external wallets initially:
1. Deploy with your single admin wallet
2. Both multi-sig confirmations come from same wallet (temporary)
3. **IMPORTANT**: Add second admin ASAP after deployment
4. Transition to proper 2-of-3 or 3-of-5 multi-sig when team wallets available

### Emergency Procedures:
```javascript
// Emergency pause (if needed)
await token.pause();
await presale.emergencyPause();
await vesting.emergencyPause();

// Emergency withdrawal (multi-sig required)
await token.emergencyWithdraw(recipient, amount);
```

## 📝 Configuration File Template

Create `deployment-config.json`:
```json
{
  "testnet": {
    "network": "bsc-testnet",
    "rpcUrl": "https://data-seed-prebsc-1-s1.binance.org:8545/",
    "chainId": 97,
    "contracts": {
      "usdt": "0x337610d27c682E347C9cD60BD4b3b107C9d34dDd",
      "ethUsdFeed": "0x143db3CEEfbdfe5631aDD3E50f7614B6ba708BA7",
      "bnbUsdFeed": "0x2514895c72f50D8bd4B4F9b1110F0D6bD2c97526"
    },
    "gasPrice": "10000000000",
    "deployerPrivateKey": "YOUR_PRIVATE_KEY_HERE"
  },
  "mainnet": {
    "network": "bsc-mainnet",
    "rpcUrl": "https://bsc-dataseed.binance.org/",
    "chainId": 56,
    "contracts": {
      "usdt": "0x55d398326f99059fF775485246999027B3197955",
      "ethUsdFeed": "0x9ef1B8c0E4F7dc8bF5719Ea496883DC6401d5b2e",
      "bnbUsdFeed": "0x0567F2323251f0Aab15c8dFb1967E4e8A7D42aeE"
    },
    "gasPrice": "5000000000",
    "deployerPrivateKey": "YOUR_PRIVATE_KEY_HERE"
  }
}
```

## 🎯 Summary

### What You Get:
✅ **Full Pronova system** aligned 100% with whitepaper
✅ **Self-contained operation** without external wallets
✅ **All security features** (multi-sig, MEV protection, etc.)
✅ **Vesting implementation** (9-year schedule)
✅ **Complete presale system** (3 phases, correct pricing)
✅ **Token allocations** (all 9 categories)

### Your Roles (Automatically Assigned):
- DEFAULT_ADMIN_ROLE (manage other roles)
- ADMIN_ROLE (multi-sig operations)
- PAUSER_ROLE (emergency pause)
- PRICE_ORACLE_ROLE (price updates if needed)
- VESTING_MANAGER_ROLE (vesting management)

### Next Steps:
1. Review this deployment strategy
2. Provide your deployer wallet address
3. Confirm testnet deployment first
4. Run deployment scripts
5. Verify all functions work correctly
6. Proceed to mainnet when ready

This self-contained approach allows you to launch immediately while maintaining flexibility to assign external wallets and beneficiaries later as your team and partnerships develop.