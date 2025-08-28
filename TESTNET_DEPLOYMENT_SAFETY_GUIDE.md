# 🛡️ BSC TESTNET DEPLOYMENT SAFETY GUIDE
**How to NEVER accidentally deploy to mainnet**

---

## ⚠️ YOUR CURRENT STATUS

Good news: Your deployment script is properly configured and will NOT default to mainnet. It checks the network name and will throw an error if you use the wrong network.

---

## 🔍 STEP 1: VERIFY YOUR METAMASK IS ON TESTNET

### Check Your MetaMask Network:
1. Open MetaMask
2. Check the network dropdown (top of MetaMask)
3. Should show: **"Smart Chain - Testnet"** or **"BSC Testnet"**
4. Chain ID should be: **97**

### If you see 0 TBNB balance but funded from faucet:
```bash
# Check your actual balance with this command:
npx hardhat run --network bscTestnet -e "
const [signer] = await ethers.getSigners();
const balance = await signer.getBalance();
console.log('✅ Testnet Balance:', ethers.formatEther(balance), 'TBNB');
console.log('✅ Address:', signer.address);
"
```

### If still 0 balance:
1. **Wrong network**: Switch MetaMask to BSC Testnet
2. **Wrong address**: Check if faucet sent to different address
3. **Faucet delay**: Wait 5-10 minutes and refresh

---

## 🎯 STEP 2: EXACT TESTNET DEPLOYMENT COMMAND

**COPY THIS EXACT COMMAND (SAFE FOR TESTNET):**

```bash
cd backend
npx hardhat run contracts/scripts/deploy-bsc.ts --network bscTestnet
```

**DO NOT USE:**
- `--network bscMainnet` ❌
- `--network bsc` ❌ 
- `--network mainnet` ❌

---

## 🔒 STEP 3: TRIPLE-CHECK BEFORE DEPLOYMENT

### Pre-Deployment Safety Check Script:
```bash
# Run this first to confirm you're on testnet
npx hardhat run --network bscTestnet -e "
console.log('🌐 Network Name:', hre.network.name);
console.log('🆔 Chain ID:', hre.network.config.chainId);
console.log('🌍 RPC URL:', hre.network.config.url);

if (hre.network.name === 'bscTestnet' && hre.network.config.chainId === 97) {
  console.log('✅ SAFE: You are on BSC TESTNET');
  console.log('✅ Proceed with deployment');
} else {
  console.log('❌ DANGER: You are NOT on testnet!');
  console.log('❌ DO NOT PROCEED');
}
"
```

### Expected Output:
```
🌐 Network Name: bscTestnet
🆔 Chain ID: 97
🌍 RPC URL: https://data-seed-prebsc-1-s1.binance.org:8545
✅ SAFE: You are on BSC TESTNET
✅ Proceed with deployment
```

---

## 🚀 STEP 4: SAFE DEPLOYMENT SEQUENCE

### 1. Confirm Environment Setup:
```bash
cd backend

# Check your .env has testnet deployer key
grep DEPLOYER_PRIVATE_KEY .env

# Should NOT be empty
```

### 2. Check Testnet Balance:
```bash
npx hardhat run --network bscTestnet -e "
const [signer] = await ethers.getSigners();
const balance = await signer.getBalance();
console.log('Balance:', ethers.formatEther(balance), 'TBNB');
if (parseFloat(ethers.formatEther(balance)) < 0.05) {
  console.log('❌ Need more TBNB for deployment');
} else {
  console.log('✅ Sufficient TBNB for deployment');
}
"
```

### 3. Deploy with Network Verification:
```bash
# This command includes safety checks
npx hardhat run contracts/scripts/deploy-bsc.ts --network bscTestnet
```

### 4. Verify Deployment on TESTNET Explorer:
After deployment, you'll get addresses. Check them here:
```
https://testnet.bscscan.com/address/YOUR_CONTRACT_ADDRESS
```

**NOT here:** `https://bscscan.com` ← This is mainnet!

---

## 🔍 STEP 5: CONTRACT VERIFICATION ON TESTNET

### Manual Verification Commands:
```bash
# Get BscScan API key first (if you don't have one)
# Go to: https://bscscan.com/myapikey (same key works for testnet)

# Verify PronovaToken
npx hardhat verify --network bscTestnet YOUR_TOKEN_ADDRESS

# Verify PronovaPresale (with constructor parameters)
npx hardhat verify --network bscTestnet YOUR_PRESALE_ADDRESS \
  "YOUR_TOKEN_ADDRESS" \
  "0x337610d27c682E347C9cD60BD4b3b107C9d34dDd" \
  "YOUR_TREASURY_ADDRESS" \
  "0x143db3CEEfbdfe5631aDD3E50f7614B6ba708BA7" \
  "0x2514895c72f50D8bd4B4F9b1110F0D6bD2c97526"

# Verify PronovaVesting
npx hardhat verify --network bscTestnet YOUR_VESTING_ADDRESS \
  "YOUR_TOKEN_ADDRESS"
```

### Check Verification Success:
Your contracts should appear verified at:
- `https://testnet.bscscan.com/address/YOUR_TOKEN_ADDRESS`
- `https://testnet.bscscan.com/address/YOUR_PRESALE_ADDRESS`
- `https://testnet.bscscan.com/address/YOUR_VESTING_ADDRESS`

---

## 🚨 NETWORK CONFIRMATION CHECKLIST

**Before running ANY deployment command, verify ALL of these:**

- [ ] **Hardhat network**: `bscTestnet` (in command)
- [ ] **Chain ID**: `97` (run safety check script)
- [ ] **MetaMask network**: "BSC Testnet" 
- [ ] **Explorer**: `testnet.bscscan.com` (not bscscan.com)
- [ ] **Balance**: Have TBNB (not BNB)
- [ ] **USDT address**: `0x337610d27c682E347C9cD60BD4b3b107C9d34dDd` (testnet USDT)

---

## ⚡ QUICK BALANCE CHECK COMMANDS

```bash
# Check testnet balance
npx hardhat run --network bscTestnet -e "
const [signer] = await ethers.getSigners();
console.log('Address:', signer.address);
console.log('Balance:', ethers.formatEther(await signer.getBalance()), 'TBNB');
"

# If balance is 0, get more from faucet:
# https://testnet.binance.org/faucet-smart
```

---

## 🔐 MAINNET PROTECTION

Your deployment script has these safety features:
1. **Network detection** - Only runs on specified network
2. **Config validation** - Uses different addresses per network  
3. **Error throwing** - Stops if wrong network detected

**The script CANNOT accidentally deploy to mainnet if you use `--network bscTestnet`**

---

## 📋 FINAL DEPLOYMENT CHECKLIST

**Run this checklist EVERY time before deploying:**

```bash
# 1. Confirm network
echo "Network command will be: --network bscTestnet"

# 2. Check you're in right directory
pwd
# Should end with: /backend

# 3. Verify hardhat config
grep -A 10 "bscTestnet:" hardhat.config.ts
# Should show chainId: 97

# 4. Check balance
npx hardhat run --network bscTestnet -e "console.log('TBNB:', ethers.formatEther(await (await ethers.getSigners())[0].getBalance()))"

# 5. Deploy
npx hardhat run contracts/scripts/deploy-bsc.ts --network bscTestnet
```

---

## 🎯 BOTTOM LINE

**Your setup is SAFE. The deployment script correctly detects networks.**

**Just use the exact command:**
```bash
npx hardhat run contracts/scripts/deploy-bsc.ts --network bscTestnet
```

**If you see 0 TBNB balance, run the balance check script above to confirm your actual balance.**

**The script will tell you exactly which network it's deploying to in the first few lines of output.**