# 🚀 PRONOVA DEPLOYMENT - QUICK COMMANDS

## 📋 COPY-PASTE DEPLOYMENT COMMANDS

### 1️⃣ GENERATE WALLETS (1 minute)
```bash
cd backend
node generate-wallets.js
```
Copy the output addresses to your `.env` file.

### 2️⃣ SETUP ENVIRONMENT (2 minutes)
```bash
# Copy template to .env
cp .env.deployment .env

# Edit .env with your values
# REQUIRED:
# - DEPLOYER_PRIVATE_KEY (from step 1)
# - All wallet addresses (from step 1)
# - BSCSCAN_API_KEY (get from https://bscscan.com/myapikey)
```

### 3️⃣ GET TESTNET BNB (3 minutes)
```bash
# Get your deployer address
grep DEPLOYER_ADDRESS .env

# Go to faucet and get 0.5 BNB:
# https://testnet.binance.org/faucet-smart
```

### 4️⃣ DEPLOY TO BSC TESTNET (5 minutes)
```bash
# Compile contracts
npx hardhat compile

# Deploy to testnet
npx hardhat run contracts/scripts/deploy-bsc.ts --network bscTestnet

# SAVE THE OUTPUT ADDRESSES!
```

### 5️⃣ VERIFY DEPLOYMENT (2 minutes)
```bash
# Run verification script
npx hardhat run contracts/scripts/verify-deployment.js --network bscTestnet
```

### 6️⃣ UPDATE FRONTEND (3 minutes)
```bash
# Add to frontend .env
cd ..
echo "
REACT_APP_TOKEN_ADDRESS_TESTNET=YOUR_TOKEN_ADDRESS_HERE
REACT_APP_PRESALE_ADDRESS_TESTNET=YOUR_PRESALE_ADDRESS_HERE
REACT_APP_VESTING_ADDRESS_TESTNET=YOUR_VESTING_ADDRESS_HERE
" >> .env

# Copy ABIs
mkdir -p src/contracts/abis
cp backend/contracts/artifacts/contracts/contracts/PronovaToken.sol/PronovaToken.json src/contracts/abis/
cp backend/contracts/artifacts/contracts/contracts/PronovaPresale.sol/PronovaPresale.json src/contracts/abis/
cp backend/contracts/artifacts/contracts/contracts/PronovaVesting.sol/PronovaVesting.json src/contracts/abis/
```

### 7️⃣ TEST FRONTEND CONNECTION (5 minutes)
```bash
# Start frontend
npm start

# In browser:
# 1. Connect MetaMask
# 2. Switch to BSC Testnet
# 3. Test purchase with 0.01 BNB
```

### 8️⃣ DEPLOY TO MAINNET (When Ready)
```bash
cd backend

# Get mainnet BNB (need ~0.1 BNB = $30-40)
# Buy from Binance or any exchange

# Deploy to mainnet
npx hardhat run contracts/scripts/deploy-bsc.ts --network bscMainnet

# Verify on BscScan
npx hardhat run contracts/scripts/verify-deployment.js --network bscMainnet
```

---

## 🔍 VERIFICATION COMMANDS

### Check Contract on BscScan
```bash
# Testnet
echo "https://testnet.bscscan.com/address/YOUR_CONTRACT_ADDRESS"

# Mainnet
echo "https://bscscan.com/address/YOUR_CONTRACT_ADDRESS"
```

### Manual Contract Verification
```bash
# Token
npx hardhat verify --network bscTestnet YOUR_TOKEN_ADDRESS

# Presale (with constructor args)
npx hardhat verify --network bscTestnet YOUR_PRESALE_ADDRESS \
  TOKEN_ADDRESS \
  USDT_ADDRESS \
  TREASURY_ADDRESS \
  ETH_FEED \
  BNB_FEED

# Vesting
npx hardhat verify --network bscTestnet YOUR_VESTING_ADDRESS \
  TOKEN_ADDRESS
```

---

## 🧪 TESTING COMMANDS

### Test Purchase Function
```bash
npx hardhat run --network bscTestnet -e "
  const presale = await ethers.getContractAt('PronovaPresale', 'YOUR_PRESALE_ADDRESS');
  const tx = await presale.buyWithBNB(ethers.constants.AddressZero, {
    value: ethers.parseEther('0.01')
  });
  console.log('Purchase TX:', tx.hash);
  await tx.wait();
  console.log('Purchase successful!');
"
```

### Check User Balance
```bash
npx hardhat run --network bscTestnet -e "
  const presale = await ethers.getContractAt('PronovaPresale', 'YOUR_PRESALE_ADDRESS');
  const [signer] = await ethers.getSigners();
  const info = await presale.getUserPurchaseInfo(signer.address);
  console.log('Your tokens:', ethers.formatEther(info[0]));
"
```

---

## ⚡ QUICK FIXES

### If deployment fails with "insufficient funds"
```bash
# Check balance
npx hardhat run --network bscTestnet -e "
  const [signer] = await ethers.getSigners();
  const balance = await signer.getBalance();
  console.log('Balance:', ethers.formatEther(balance), 'BNB');
"

# Get more testnet BNB from faucet
```

### If verification fails
```bash
# Make sure BSCSCAN_API_KEY is set
grep BSCSCAN_API_KEY .env

# Try manual verification with exact constructor args
```

### If frontend can't connect
```bash
# Check contract addresses in frontend .env
grep REACT_APP .env

# Make sure ABIs are copied
ls src/contracts/abis/

# Check network in MetaMask (should be BSC Testnet)
```

---

## 📊 DEPLOYMENT CHECKLIST

### Before Testnet
- [ ] Wallets generated
- [ ] .env configured
- [ ] BscScan API key obtained
- [ ] Testnet BNB received

### After Testnet
- [ ] Contracts deployed
- [ ] Addresses saved
- [ ] Frontend updated
- [ ] Functions tested

### Before Mainnet
- [ ] Testnet fully tested
- [ ] Team approval received
- [ ] Mainnet BNB funded
- [ ] Security audit done (if required)

### After Mainnet
- [ ] Contracts verified on BscScan
- [ ] Frontend switched to mainnet
- [ ] Monitoring enabled
- [ ] Documentation updated

---

## 🆘 EMERGENCY CONTACTS

- **BscScan Support**: https://bscscan.com/contactus
- **BSC Discord**: https://discord.gg/bnbchain
- **Binance Support**: https://www.binance.com/en/support

---

**Total Time: ~20 minutes for testnet deployment**
**Cost: $0 for testnet, ~$30-40 for mainnet**