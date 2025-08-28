# 📋 PRONOVA FRONTEND INTEGRATION REQUIREMENTS
**For: Contract Owner / Deployment Manager**  
**Purpose: Connect Live React Frontend to Deployed Smart Contracts**  
**Document Version: 1.0**  
**Created: December 2024**

---

## 🎯 OVERVIEW

This document lists **EVERYTHING** needed from you to successfully connect the PRONOVA React frontend to the deployed smart contracts. Please prepare all items in this checklist before handover to ensure smooth integration.

**Current Status:**
- ✅ Smart contracts deployed to testnet
- ⏳ Awaiting mainnet deployment
- 🔄 Frontend ready for integration

---

## 1️⃣ SMART CONTRACT DETAILS

### A. Contract Addresses (REQUIRED)

Please provide all deployed contract addresses for each network:

```json
{
  "testnet": {
    "network_name": "Sepolia / BSC Testnet",
    "contracts": {
      "PronovaToken": "0x...",
      "PronovaPresale": "0x...",
      "PronovaVesting": "0x...",
      "MockUSDT": "0x..." // Only for testnet
    }
  },
  "mainnet": {
    "network_name": "Ethereum / BSC",
    "contracts": {
      "PronovaToken": "0x...",
      "PronovaPresale": "0x...",
      "PronovaVesting": "0x...",
      "USDT": "0x..." // Actual USDT address on mainnet
    }
  }
}
```

### B. Contract ABIs (REQUIRED)

Please provide the ABI files from compilation:

- [ ] `PronovaToken.json` (from `artifacts/contracts/PronovaToken.sol/`)
- [ ] `PronovaPresale.json` (from `artifacts/contracts/PronovaPresale.sol/`)
- [ ] `PronovaVesting.json` (from `artifacts/contracts/PronovaVesting.sol/`)
- [ ] `MockUSDT.json` (for testnet only)
- [ ] `ERC20.json` (standard ERC20 ABI for USDT interaction)

**Format needed:**
```json
{
  "contractName": "PronovaToken",
  "abi": [...],
  "bytecode": "0x..." // Optional but helpful
}
```

### C. Deployment Transaction Details

For verification and transparency:

- [ ] Token deployment TX hash: `0x...`
- [ ] Presale deployment TX hash: `0x...`
- [ ] Vesting deployment TX hash: `0x...`
- [ ] Block numbers for each deployment
- [ ] Deployment timestamp (UTC)

### D. Contract Configuration Values

Please confirm these values as deployed:

```json
{
  "token_config": {
    "name": "Pronova",
    "symbol": "PRN",
    "decimals": 18,
    "total_supply": "1000000000" // 1 billion
  },
  "presale_phases": [
    {
      "phase": 1,
      "price_usd": 0.05,
      "allocation": 100000000,
      "min_purchase_usd": 100,
      "max_purchase_usd": 50000,
      "start_time": "timestamp",
      "end_time": "timestamp"
    },
    {
      "phase": 2,
      "price_usd": 0.07,
      "allocation": 100000000,
      "min_purchase_usd": 100,
      "max_purchase_usd": 50000,
      "start_time": "timestamp",
      "end_time": "timestamp"
    },
    {
      "phase": 3,
      "price_usd": 0.09,
      "allocation": 100000000,
      "min_purchase_usd": 100,
      "max_purchase_usd": 75000,
      "start_time": "timestamp",
      "end_time": "timestamp"
    },
    {
      "phase": 4,
      "price_usd": 0.10,
      "allocation": 100000000,
      "min_purchase_usd": 100,
      "max_purchase_usd": 100000,
      "start_time": "timestamp",
      "end_time": "timestamp"
    }
  ],
  "wallets": {
    "treasury": "0x...",
    "team": "0x...",
    "liquidity": "0x...",
    "marketing": "0x...",
    "owner": "0x..." // Multi-sig
  }
}
```

### E. Contract Verification Status

- [ ] Contracts verified on Etherscan/BscScan? (Yes/No)
- [ ] Verification links:
  - PronovaToken: `https://etherscan.io/address/0x...`
  - PronovaPresale: `https://etherscan.io/address/0x...`
  - PronovaVesting: `https://etherscan.io/address/0x...`

---

## 2️⃣ NETWORK CONFIGURATION

### A. Testnet Configuration

```json
{
  "testnet": {
    "network_name": "Sepolia",
    "chain_id": 11155111,
    "rpc_urls": [
      "https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY",
      "https://sepolia.infura.io/v3/YOUR_KEY",
      "https://rpc.sepolia.org" // Public backup
    ],
    "block_explorer": "https://sepolia.etherscan.io",
    "native_currency": {
      "name": "SepoliaETH",
      "symbol": "ETH",
      "decimals": 18
    },
    "price_feeds": {
      "ETH_USD": "0x694AA1769357215DE4FAC081bf1f309aDC325306",
      "BNB_USD": "0x1b44F3514812d835EB1BDB0acB33d3fA3351Ee43"
    }
  }
}
```

### B. Mainnet Configuration

```json
{
  "mainnet": {
    "network_name": "Ethereum Mainnet",
    "chain_id": 1,
    "rpc_urls": [
      "https://eth-mainnet.g.alchemy.com/v2/YOUR_KEY",
      "https://mainnet.infura.io/v3/YOUR_KEY",
      "https://cloudflare-eth.com" // Public backup
    ],
    "block_explorer": "https://etherscan.io",
    "native_currency": {
      "name": "Ether",
      "symbol": "ETH",
      "decimals": 18
    },
    "price_feeds": {
      "ETH_USD": "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419",
      "BNB_USD": "0x14e613AC84a31f709eadbdF89C6CC390fDc9540A",
      "USDT_ADDRESS": "0xdAC17F958D2ee523a2206206994597C13D831ec7"
    }
  }
}
```

### C. Alternative Networks (if applicable)

If deploying to BSC or other chains:

```json
{
  "bsc_mainnet": {
    "network_name": "Binance Smart Chain",
    "chain_id": 56,
    "rpc_urls": [
      "https://bsc-dataseed.binance.org/",
      "https://bsc-dataseed1.defibit.io/"
    ],
    "block_explorer": "https://bscscan.com",
    "native_currency": {
      "name": "BNB",
      "symbol": "BNB",
      "decimals": 18
    },
    "price_feeds": {
      "ETH_USD": "0x9ef1B8c0E4F7dc8bF5719Ea496883DC6401d5b2e",
      "BNB_USD": "0x0567F2323251f0Aab15c8dFb1967E4e8A7D42aeE",
      "USDT_ADDRESS": "0x55d398326f99059fF775485246999027B3197955"
    }
  }
}
```

---

## 3️⃣ API KEYS & SERVICES

### A. Blockchain RPC Providers

Please provide API keys for reliable RPC access:

- [ ] **Alchemy API Key**: `YOUR_ALCHEMY_KEY`
  - Dashboard: https://dashboard.alchemy.com
  - Endpoints needed: Ethereum Mainnet, Sepolia
  
- [ ] **Infura Project ID**: `YOUR_INFURA_PROJECT_ID`
  - Dashboard: https://infura.io/dashboard
  - Endpoints needed: Ethereum Mainnet, Sepolia

- [ ] **QuickNode Endpoint** (optional backup): `YOUR_QUICKNODE_URL`

### B. Blockchain Explorers

- [ ] **Etherscan API Key**: `YOUR_ETHERSCAN_API_KEY`
  - For transaction tracking and verification
  - Get from: https://etherscan.io/myapikey

- [ ] **BscScan API Key**: `YOUR_BSCSCAN_API_KEY` (if using BSC)
  - Get from: https://bscscan.com/myapikey

### C. Backend API Endpoints

- [ ] **Production API URL**: `https://api.pronova.io` (or your backend URL)
- [ ] **Staging API URL**: `https://staging-api.pronova.io`
- [ ] **WebSocket URL**: `wss://ws.pronova.io`

### D. Additional Services

- [ ] **IPFS Gateway** (if using): `https://ipfs.io/ipfs/`
- [ ] **The Graph API** (if using): `Subgraph URL`

---

## 4️⃣ ENVIRONMENT VARIABLES SETUP

### A. Frontend .env File Template

Create `.env.production` and `.env.development` files:

```env
# Network Configuration
REACT_APP_DEFAULT_NETWORK_ID=1
REACT_APP_SUPPORTED_NETWORKS=1,56,11155111

# Contract Addresses - Mainnet
REACT_APP_TOKEN_ADDRESS_MAINNET=0x...
REACT_APP_PRESALE_ADDRESS_MAINNET=0x...
REACT_APP_VESTING_ADDRESS_MAINNET=0x...
REACT_APP_USDT_ADDRESS_MAINNET=0xdAC17F958D2ee523a2206206994597C13D831ec7

# Contract Addresses - Testnet
REACT_APP_TOKEN_ADDRESS_TESTNET=0x...
REACT_APP_PRESALE_ADDRESS_TESTNET=0x...
REACT_APP_VESTING_ADDRESS_TESTNET=0x...
REACT_APP_MOCKUSDT_ADDRESS_TESTNET=0x...

# RPC Endpoints
REACT_APP_ALCHEMY_KEY=your_alchemy_key
REACT_APP_INFURA_KEY=your_infura_key
REACT_APP_RPC_URL_MAINNET=https://eth-mainnet.g.alchemy.com/v2/${REACT_APP_ALCHEMY_KEY}
REACT_APP_RPC_URL_TESTNET=https://eth-sepolia.g.alchemy.com/v2/${REACT_APP_ALCHEMY_KEY}

# API Endpoints
REACT_APP_API_URL=https://api.pronova.io
REACT_APP_WS_URL=wss://ws.pronova.io

# Blockchain Explorers
REACT_APP_ETHERSCAN_API_KEY=your_etherscan_key
REACT_APP_EXPLORER_URL_MAINNET=https://etherscan.io
REACT_APP_EXPLORER_URL_TESTNET=https://sepolia.etherscan.io

# Feature Flags
REACT_APP_ENABLE_TESTNET=false
REACT_APP_ENABLE_WALLET_CONNECT=true
REACT_APP_ENABLE_KYC=true
REACT_APP_MAINTENANCE_MODE=false

# Public Configuration
REACT_APP_REFERRAL_PERCENTAGE=5
REACT_APP_MIN_PURCHASE_USD=100
REACT_APP_MAX_PURCHASE_USD=100000
REACT_APP_PRESALE_START_DATE=2024-12-15T00:00:00Z
REACT_APP_PRESALE_END_DATE=2025-03-15T23:59:59Z

# Analytics (Optional)
REACT_APP_GA_TRACKING_ID=UA-XXXXXXXXX-X
REACT_APP_HOTJAR_ID=XXXXXXX
```

### B. Backend .env Requirements

What the backend needs to interact with contracts:

```env
# Blockchain Configuration
BLOCKCHAIN_NETWORK=mainnet
CHAIN_ID=1

# Contract Addresses
TOKEN_CONTRACT_ADDRESS=0x...
PRESALE_CONTRACT_ADDRESS=0x...
VESTING_CONTRACT_ADDRESS=0x...

# RPC Configuration
ETHEREUM_RPC_URL=https://eth-mainnet.g.alchemy.com/v2/YOUR_KEY
BACKUP_RPC_URL=https://mainnet.infura.io/v3/YOUR_KEY

# Contract Monitoring
BLOCK_CONFIRMATION_COUNT=12
POLLING_INTERVAL_MS=3000

# DO NOT INCLUDE PRIVATE KEYS IN FRONTEND!
```

---

## 5️⃣ SECURITY REQUIREMENTS

### A. What Should NEVER Be in Frontend

❌ **NEVER INCLUDE:**
- Private keys of any wallet
- Mnemonic phrases / seed words
- Admin wallet private keys
- Backend API secret keys
- Database credentials
- Internal API endpoints
- Sensitive webhook URLs

### B. What IS Safe for Frontend

✅ **SAFE TO INCLUDE:**
- Public wallet addresses
- Contract addresses
- RPC endpoints (with rate limiting)
- Public API keys (with domain restrictions)
- Block explorer API keys (with domain restrictions)
- Public configuration values

### C. API Key Security Setup

**For Alchemy:**
1. Go to https://dashboard.alchemy.com
2. Select your app
3. Go to "Security"
4. Add allowed domains:
   - `https://pronova.io`
   - `https://www.pronova.io`
   - `https://app.pronova.io`
5. Enable rate limiting

**For Infura:**
1. Go to https://infura.io/dashboard
2. Select project settings
3. Add allowlisted contract addresses
4. Add allowlisted domains
5. Set daily request limits

### D. Frontend Security Checklist

- [ ] All API keys have domain restrictions
- [ ] Rate limiting enabled on all services
- [ ] CORS properly configured on backend
- [ ] Content Security Policy headers set
- [ ] Subresource Integrity (SRI) for CDN resources
- [ ] HTTPS enforced everywhere
- [ ] Input validation on all user inputs
- [ ] Transaction simulation before execution

---

## 6️⃣ ADDITIONAL REQUIREMENTS

### A. Contract Interaction Functions Needed

Please confirm these functions are available and working:

**PronovaToken Contract:**
- [ ] `balanceOf(address)` - Check token balance
- [ ] `totalSupply()` - Get total supply
- [ ] `decimals()` - Get token decimals
- [ ] `symbol()` - Get token symbol
- [ ] `name()` - Get token name

**PronovaPresale Contract:**
- [ ] `buyWithETH(referrer)` - Purchase with ETH
- [ ] `buyWithBNB(referrer)` - Purchase with BNB
- [ ] `buyWithUSDT(amount, referrer)` - Purchase with USDT
- [ ] `getCurrentPhase()` - Get current presale phase
- [ ] `getUserPurchaseInfo(address)` - Get user's purchase data
- [ ] `getPresaleProgress()` - Get overall progress
- [ ] `claimTokens()` - Claim purchased tokens
- [ ] `phases(uint)` - Get phase details

**PronovaVesting Contract:**
- [ ] `getVestingSchedule(address)` - Get vesting info
- [ ] `getClaimableAmount(address)` - Check claimable tokens
- [ ] `claim()` - Claim vested tokens

### B. Event Listeners Required

Events to monitor from contracts:

```javascript
// PronovaPresale Events
- TokensPurchased(address buyer, uint256 amount, uint256 tokens, uint256 phase, string paymentMethod)
- PhaseUpdated(uint256 phase, bool isActive)
- ReferralRewardEarned(address referrer, address buyer, uint256 reward)
- TokensClaimed(address user, uint256 amount)

// PronovaToken Events
- Transfer(address from, address to, uint256 value)
- Approval(address owner, address spender, uint256 value)

// PronovaVesting Events
- TokensVested(address beneficiary, uint256 amount)
- TokensClaimed(address beneficiary, uint256 amount)
```

### C. Testing Requirements

- [ ] Testnet faucet ETH for testing (provide wallet: `0x...`)
- [ ] Test USDT tokens for purchase testing
- [ ] Whitelisted test addresses (if applicable)
- [ ] Test referral codes for referral system

### D. UI/UX Assets

- [ ] Token logo (SVG/PNG, transparent, 512x512)
- [ ] Network icons for supported chains
- [ ] Wallet icons (MetaMask, WalletConnect, etc.)
- [ ] Success/Error animation assets

### E. Legal & Compliance

- [ ] Terms of Service URL
- [ ] Privacy Policy URL
- [ ] Token disclaimer text
- [ ] Restricted countries list (if any)
- [ ] KYC requirements (if applicable)

---

## 7️⃣ MONITORING & ANALYTICS

### A. Contract Monitoring Setup

Please provide access to:

- [ ] Contract monitoring dashboard (Tenderly/OpenZeppelin Defender)
- [ ] Alert webhook URLs for critical events
- [ ] Gas price oracle endpoints
- [ ] Historical data API (if available)

### B. Analytics Requirements

- [ ] Google Analytics Property ID
- [ ] Mixpanel/Amplitude Project Token
- [ ] Error tracking (Sentry DSN)
- [ ] Performance monitoring endpoints

---

## 8️⃣ DEPLOYMENT VERIFICATION CHECKLIST

Before handover, please verify:

### Smart Contracts
- [ ] All contracts deployed successfully
- [ ] Ownership transferred to multi-sig
- [ ] Initial token distribution complete
- [ ] Presale phases configured
- [ ] Emergency pause tested
- [ ] Contracts verified on explorer

### Integration Testing
- [ ] Can connect MetaMask
- [ ] Can read contract data
- [ ] Can simulate transactions
- [ ] Events are firing correctly
- [ ] Error handling works

### Security
- [ ] No private keys exposed
- [ ] API keys restricted
- [ ] Rate limiting active
- [ ] CORS configured
- [ ] SSL certificates valid

---

## 9️⃣ DELIVERY FORMAT

Please provide all information in the following structure:

```
pronova-frontend-integration/
├── contracts/
│   ├── addresses.json
│   ├── abis/
│   │   ├── PronovaToken.json
│   │   ├── PronovaPresale.json
│   │   └── PronovaVesting.json
│   └── deployment-info.json
├── config/
│   ├── networks.json
│   ├── api-endpoints.json
│   └── feature-flags.json
├── env/
│   ├── .env.production.example
│   ├── .env.development.example
│   └── .env.local.example
├── docs/
│   ├── integration-guide.md
│   ├── api-documentation.md
│   └── troubleshooting.md
└── security/
    ├── api-key-setup.md
    ├── domain-whitelist.txt
    └── security-checklist.md
```

---

## 🔟 CONTACT & SUPPORT

### During Integration

**Primary Contact:**
- Name: [Your Name]
- Telegram: @username
- Email: contact@pronova.io
- Available: [Hours/Timezone]

**Technical Support:**
- Smart Contract Issues: [Contact]
- RPC/Network Issues: [Contact]
- Frontend Issues: [Contact]

**Emergency Contact:**
- 24/7 Hotline: [If applicable]
- Emergency Email: emergency@pronova.io

---

## ✅ SIGN-OFF

### Information Provider Confirmation

I confirm that all information provided is:
- Complete and accurate
- Tested and verified
- Securely transmitted
- Ready for production

**Name:** _______________________  
**Role:** _______________________  
**Date:** _______________________  
**Signature:** _______________________

### Developer Acknowledgment

I confirm receipt of all required information:
- Contract details received
- Network configuration complete
- Security measures understood
- Ready to integrate

**Name:** _______________________  
**Role:** Lead Developer  
**Date:** _______________________  
**Signature:** _______________________

---

## 📎 APPENDIX: QUICK REFERENCE

### Common Contract Methods
```javascript
// Check user's token balance
const balance = await tokenContract.balanceOf(userAddress);

// Get current presale phase
const phase = await presaleContract.getCurrentPhase();

// Purchase tokens with ETH
await presaleContract.buyWithETH(referrerAddress, {
  value: ethers.utils.parseEther(ethAmount)
});

// Check claimable tokens
const claimable = await vestingContract.getClaimableAmount(userAddress);
```

### Error Codes Reference
- `INSUFFICIENT_FUNDS`: User doesn't have enough ETH/USDT
- `PRESALE_NOT_ACTIVE`: Presale hasn't started or has ended
- `EXCEEDS_MAX_PURCHASE`: Purchase exceeds maximum limit
- `NOT_WHITELISTED`: User not on whitelist (if applicable)
- `ALREADY_CLAIMED`: Tokens already claimed

---

**END OF REQUIREMENTS DOCUMENT**

Please prepare all items in this checklist and deliver them securely to begin frontend integration.