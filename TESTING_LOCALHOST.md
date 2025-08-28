# 🧪 Testing Pronova Contracts on Localhost

## ✅ Current Status
- ✅ Hardhat node is running on `http://127.0.0.1:8545`
- ✅ All contracts deployed and configured
- ✅ Frontend configuration updated for localhost

## 📋 Deployed Contract Addresses

| Contract | Address |
|----------|---------|
| **MockUSDT** | `0x5FbDB2315678afecb367f032d93F642f64180aa3` |
| **PronovaToken** | `0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512` |
| **PronovaPresale** | `0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0` |
| **PronovaVesting** | `0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9` |

## 🔧 How to Test

### 1. Setup MetaMask for Localhost
1. Open MetaMask
2. Add Custom Network:
   - **Network Name**: Hardhat Localhost
   - **RPC URL**: `http://127.0.0.1:8545`
   - **Chain ID**: `31337`
   - **Currency Symbol**: ETH

### 2. Import Test Account
Import this private key into MetaMask for testing:
```
0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```
**Address**: `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266`
**Balance**: 10,000 ETH

⚠️ **WARNING**: This is a test account. Never use on mainnet!

### 3. Test the Presale

#### A. Check Your Wallet Balance
- You should see 10,000 ETH in MetaMask
- You're already whitelisted for the presale

#### B. Visit the Presale Page
1. Go to `http://localhost:3002/presale`
2. Connect your MetaMask wallet
3. You should see:
   - Current Phase: 1
   - Token Price: $0.05
   - Your wallet connected

#### C. Make a Test Purchase
1. Try purchasing with ETH (minimum $100 worth)
2. Since ETH price is set to $3000, you need ~0.033 ETH minimum
3. Enter amount and confirm transaction in MetaMask

### 4. Contract Information

#### Presale Configuration
- **Phase 1**: $0.05 per token (100M tokens)
- **Phase 2**: $0.07 per token (75M tokens) 
- **Phase 3**: $0.09 per token (75M tokens)
- **Phase 4**: $0.10 per token (150M tokens)
- **Total Hard Cap**: $31M USD
- **Referral Bonus**: 5%

#### Token Allocations
- **Presale**: 400M PRN (40%)
- **Team**: 150M PRN (15%)
- **Liquidity**: 200M PRN (20%)
- **Marketing**: 100M PRN (10%)
- **Staking**: 150M PRN (15%)

### 5. Additional Test Accounts

| Account | Address | Private Key |
|---------|---------|-------------|
| Account #1 | `0xf39Fd6e...92266` | `0xac0974bec...f2ff80` |
| Account #2 | `0x70997970...dc79C8` | `0x59c6995e9...8690d` |

## 🛠️ Troubleshooting

### MetaMask Issues
- **Wrong Network**: Make sure you're on Hardhat Localhost (Chain ID: 31337)
- **No Balance**: Import the test account private key
- **Transaction Fails**: Check if you're whitelisted for presale

### Hardhat Node Issues
If the node stops working:
```bash
cd backend
npx hardhat node
```
Then redeploy contracts:
```bash
npx hardhat run contracts/scripts/deploy-local.js --network localhost
```

### Frontend Issues
- Make sure frontend is running on `http://localhost:3002`
- Check browser console for any JavaScript errors
- Verify contract addresses in `src/config/contracts.js`

## 📊 Test Scenarios

### 1. Basic ETH Purchase
- Amount: 0.1 ETH (~$300)
- Expected Tokens: 6,000 PRN
- Gas Cost: ~0.003 ETH

### 2. Referral Test
- Use second account as referrer
- First account gets tokens + referrer gets 5% bonus

### 3. Phase Switching
- Test admin functions (if you have owner access)
- Switch between presale phases

### 4. Error Cases
- Try purchasing without whitelist (should fail)
- Try purchasing below minimum ($100)
- Try purchasing above maximum ($50,000)

## 🎯 What You Can Test

✅ **MetaMask Connection**
✅ **Wallet Balance Display** 
✅ **Presale Phase Information**
✅ **ETH Purchase Flow**
✅ **Transaction Confirmation**
✅ **Purchase History**
✅ **Error Handling**
✅ **Network Switching**

## 📞 Need Help?

If you encounter issues:
1. Check browser console for errors
2. Verify MetaMask is on correct network
3. Ensure Hardhat node is still running
4. Check contract addresses match deployment

---
*Last updated: Contract deployment successful ✅*