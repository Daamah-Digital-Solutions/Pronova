# 🚀 PRONOVA PROJECT - COMPLETE DEPLOYMENT GUIDE

## 📋 PRE-DEPLOYMENT CHECKLIST

### Required Accounts & Services
- [ ] **Ethereum/BSC Wallet** with sufficient funds for deployment
- [ ] **Alchemy/Infura** API keys for blockchain connection
- [ ] **Etherscan/BSCScan** API keys for contract verification
- [ ] **Domain name** purchased and DNS configured
- [ ] **Hosting service** (Vercel/Netlify recommended)
- [ ] **Database** (PostgreSQL on Railway/Supabase)

---

# 🔗 SMART CONTRACT DEPLOYMENT

## Step 1: Environment Setup

1. **Create deployment wallet:**
   ```bash
   # Create new wallet for deployment (recommended)
   # Save private key securely - you'll need it
   ```

2. **Get testnet funds first:**
   - Ethereum Sepolia: https://sepoliafaucet.com/
   - BSC Testnet: https://testnet.binance.org/faucet-smart

3. **Configure network in hardhat.config.ts:**
   ```javascript
   networks: {
     sepolia: {
       url: `https://eth-sepolia.g.alchemy.com/v2/YOUR_ALCHEMY_KEY`,
       accounts: [`0x${PRIVATE_KEY}`]
     },
     bscTestnet: {
       url: "https://data-seed-prebsc-1-s1.binance.org:8545/",
       accounts: [`0x${PRIVATE_KEY}`]
     }
   }
   ```

## Step 2: Deploy to Testnet First

```bash
cd backend/contracts
npm install

# Deploy to Sepolia testnet
npx hardhat run scripts/deploy-testnet.js --network sepolia

# Or deploy to BSC testnet
npx hardhat run scripts/deploy-testnet.js --network bscTestnet
```

## Step 3: Deploy to Mainnet

**IMPORTANT: Only after successful testnet testing!**

```bash
# Deploy to Ethereum mainnet
npx hardhat run scripts/deploy-testnet.js --network mainnet

# Or deploy to BSC mainnet
npx hardhat run scripts/deploy-testnet.js --network bsc
```

## Step 4: Contract Configuration

After deployment, you'll need to:

1. **Set wallet addresses:**
   ```javascript
   await token.setTeamWallet("0x...TEAM_WALLET_ADDRESS");
   await token.setLiquidityWallet("0x...LIQUIDITY_WALLET_ADDRESS");
   await token.setMarketingWallet("0x...MARKETING_WALLET_ADDRESS");
   await token.setStakingContract("0x...STAKING_CONTRACT_ADDRESS");
   ```

2. **Distribute allocations:**
   ```javascript
   await token.distributeAllocations();
   ```

3. **Configure presale:**
   ```javascript
   // Add addresses to whitelist
   await presale.updateWhitelist([...addresses], true);
   
   // Set treasury wallet
   await presale.setTreasuryWallet("0x...TREASURY_WALLET");
   ```

---

# 🌐 FRONTEND DEPLOYMENT

## Step 1: Update Contract Addresses

1. **Update contract addresses in frontend:**
   ```javascript
   // src/config/contracts.js
   export const CONTRACTS = {
     PRONOVA_TOKEN: "0x...DEPLOYED_TOKEN_ADDRESS",
     PRONOVA_PRESALE: "0x...DEPLOYED_PRESALE_ADDRESS",
     NETWORK_ID: 1, // 1 for Ethereum, 56 for BSC
   };
   ```

2. **Update ABI files:**
   ```bash
   cp backend/contracts/artifacts/contracts/PronovaToken.sol/PronovaToken.json src/config/abis/
   cp backend/contracts/artifacts/contracts/PronovaPresale.sol/PronovaPresale.json src/config/abis/
   ```

## Step 2: Deploy Frontend

### Option A: Vercel (Recommended)

1. **Connect GitHub repo to Vercel:**
   - Go to https://vercel.com
   - Import your GitHub repository
   - Set build command: `npm run build`
   - Set output directory: `build`

2. **Environment variables:**
   ```
   REACT_APP_NETWORK_ID=1
   REACT_APP_TOKEN_ADDRESS=0x...
   REACT_APP_PRESALE_ADDRESS=0x...
   ```

### Option B: Netlify

1. **Deploy to Netlify:**
   ```bash
   npm run build
   npx netlify deploy --prod --dir=build
   ```

## Step 3: Domain Configuration

1. **Add custom domain:**
   - In Vercel/Netlify dashboard
   - Add your domain (e.g., pronova.io)
   - Update DNS records as instructed

---

# 🗄️ BACKEND DEPLOYMENT

## Step 1: Database Setup

### Option A: Railway (Recommended)
1. Go to https://railway.app
2. Create new PostgreSQL database
3. Get connection string

### Option B: Supabase
1. Go to https://supabase.com
2. Create new project
3. Get connection string

## Step 2: Deploy Backend

### Using Railway:
1. **Connect GitHub repo to Railway**
2. **Set environment variables:**
   ```
   DATABASE_URL=postgresql://...
   JWT_SECRET=your_jwt_secret
   ETHEREUM_RPC_URL=https://mainnet.infura.io/v3/...
   PRESALE_CONTRACT_ADDRESS=0x...
   TOKEN_CONTRACT_ADDRESS=0x...
   ```

3. **Deploy:**
   - Railway will auto-deploy from GitHub

## Step 3: Run Database Migrations

```bash
npx prisma migrate deploy
npx prisma generate
```

---

# 🔍 TESTING & VERIFICATION

## Step 1: Contract Verification

```bash
# Verify on Etherscan
npx hardhat verify --network mainnet DEPLOYED_ADDRESS

# Verify on BSCScan
npx hardhat verify --network bsc DEPLOYED_ADDRESS
```

## Step 2: Frontend Testing

1. **Test wallet connection**
2. **Test purchase flow**
3. **Test dashboard access**
4. **Test all pages and links**

## Step 3: End-to-End Testing

1. **Connect real wallet**
2. **Make small test purchase**
3. **Verify tokens received**
4. **Check dashboard updates**

---

# 🎉 GO-LIVE STEPS

## Step 1: Pre-Launch (24 hours before)

- [ ] All contracts deployed and verified
- [ ] Frontend deployed with correct contract addresses
- [ ] Backend deployed and connected to database
- [ ] Domain configured and SSL active
- [ ] Test purchases completed successfully
- [ ] Marketing materials ready
- [ ] Social media accounts set up

## Step 2: Launch Day

1. **Announce presale start**
2. **Monitor contract interactions**
3. **Watch for any issues**
4. **Engage with community**

## Step 3: Post-Launch Monitoring

- [ ] Monitor gas prices and adjust if needed
- [ ] Track presale progress
- [ ] Respond to user issues
- [ ] Update social media regularly

---

# 🚨 SECURITY CHECKLIST

- [ ] **Multi-sig wallet** for contract ownership
- [ ] **Time locks** on critical functions
- [ ] **Pause functionality** working
- [ ] **Emergency withdrawal** tested
- [ ] **Private keys** stored securely
- [ ] **Regular backups** of database
- [ ] **Rate limiting** on API endpoints
- [ ] **HTTPS** enforced everywhere

---

# 📞 EMERGENCY CONTACTS

- **Contract Owner:** [Your wallet address]
- **Technical Lead:** [Your contact]
- **Marketing Lead:** [Contact]
- **Legal Advisor:** [Contact if applicable]

---

# 🎯 SUCCESS METRICS

- **Total funds raised**
- **Number of participants**
- **Website traffic**
- **Social media engagement**
- **Community growth**

---

*🔥 Remember: Test everything on testnet first! Never deploy to mainnet without thorough testing.*