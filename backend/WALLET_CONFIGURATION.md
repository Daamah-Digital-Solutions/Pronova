# Pronova Wallet Configuration - Optimized Allocation

## Token Allocations (Updated from Whitepaper)

### Total Supply: 1,000,000,000 PRN (100%)

| Allocation | Percentage | Amount (PRN) | Vesting | Wallet Required |
|------------|------------|--------------|---------|-----------------|
| **Pre-Sale** | 25% | 250,000,000 | No | PronovaPresale Contract |
| **Founders** | 14% | 140,000,000 | 9 years | Yes - Founders Wallet |
| **Liquidity** | 15% | 150,000,000 | No | Yes - Liquidity Wallet |
| **Partnerships** | 15% | 150,000,000 | 9 years | Yes - Partnerships Wallet |
| **Team** | 5% | 50,000,000 | 9 years | Yes - Team Wallet |
| **Community Incentives** | 8% | 80,000,000 | No | Yes - Community Wallet |
| **Strategic Reserves** | 6% | 60,000,000 | No | Yes - Strategic Wallet |
| **Marketing & Development** | 12% | 120,000,000 | No | Yes - Marketing Wallet |
| **TOTAL** | **100%** | **1,000,000,000** | | |

## Vesting Schedule

### Vested Allocations (45% of relevant allocations):
- **Duration**: 9 years
- **Unlock Schedule**: 2.5% every 6 months
- **Total Periods**: 18 unlock events
- **Applies to**: Founders (14%), Team (5%), Partnerships (15%)

## Pre-Sale Phases

With 25% allocation (250M tokens) distributed proportionally:

| Phase | Price | Tokens | Raise |
|-------|-------|--------|-------|
| **Phase 1** | $0.80 | 100M | $80M |
| **Phase 2** | $1.00 | 75M | $75M |
| **Phase 3** | $1.50 | 75M | $112.5M |
| **TOTAL** | | **250M** | **$267.5M** |

## Required Wallet Addresses

Please provide the following wallet addresses for deployment:

```javascript
{
  // 1. Primary Deployer (gets all admin roles initially)
  "deployerAddress": "0x...",

  // 2. Treasury (receives presale funds)
  "treasuryWallet": "0x...",

  // 3. Token Allocation Wallets
  "allocationWallets": {
    "foundersWallet": "0x...",      // 140M tokens (9-year vesting)
    "liquidityWallet": "0x...",     // 150M tokens (immediate)
    "partnershipsWallet": "0x...",  // 150M tokens (9-year vesting)
    "teamWallet": "0x...",          // 50M tokens (9-year vesting)
    "communityWallet": "0x...",     // 80M tokens (immediate)
    "strategicWallet": "0x...",     // 60M tokens (immediate)
    "marketingWallet": "0x..."      // 120M tokens (immediate)
  },

  // 4. Multi-Signature Admins (optional - can add after deployment)
  "additionalAdmins": [
    "0x...", // Admin 2
    "0x...", // Admin 3
    // Add more for 3-of-5 setup if desired
  ]
}
```

## Deployment Configuration

### Network Settings

#### BSC Testnet:
```javascript
{
  "network": "bsc-testnet",
  "rpcUrl": "https://data-seed-prebsc-1-s1.binance.org:8545/",
  "chainId": 97,
  "usdtAddress": "0x337610d27c682E347C9cD60BD4b3b107C9d34dDd",
  "ethUsdFeed": "0x143db3CEEfbdfe5631aDD3E50f7614B6ba708BA7",
  "bnbUsdFeed": "0x2514895c72f50D8bd4B4F9b1110F0D6bD2c97526"
}
```

#### BSC Mainnet:
```javascript
{
  "network": "bsc-mainnet",
  "rpcUrl": "https://bsc-dataseed.binance.org/",
  "chainId": 56,
  "usdtAddress": "0x55d398326f99059fF775485246999027B3197955",
  "ethUsdFeed": "0x9ef1B8c0E4F7dc8bF5719Ea496883DC6401d5b2e",
  "bnbUsdFeed": "0x0567F2323251f0Aab15c8dFb1967E4e8A7D42aeE"
}
```

## Smart Contract Addresses (Post-Deployment)

After deployment, these contracts will be deployed:

1. **PronovaToken (PRN)**: `0x...` - Main token contract
2. **PronovaPresale**: `0x...` - Manages 400M token presale
3. **PronovaVesting**: `0x...` - Manages 9-year vesting for 250M tokens

## Security Notes

### Multi-Signature Requirements:
- All critical functions require 2 admin confirmations
- Emergency functions protected by multi-sig
- Add additional admins immediately after deployment

### Recommended Wallet Security:
- Use hardware wallets for all admin accounts
- Use multi-signature wallets for treasury
- Store recovery phrases securely offline
- Implement regular key rotation procedures

## Deployment Steps

1. **Prepare Wallets**: Create all required wallets listed above
2. **Fund Deployer**: Ensure deployer wallet has sufficient BNB for gas
3. **Deploy Contracts**: Run deployment script with wallet addresses
4. **Verify Contracts**: Verify on BSCScan for transparency
5. **Add Admins**: Add additional admin wallets for multi-sig
6. **Start Presale**: Activate Phase 1 of presale

## Important Reminders

✅ **Optimized token allocations for better market stability**
✅ **25% (250M tokens) allocated to presale**
✅ **15% liquidity for enhanced DEX trading**
✅ **9-year vesting for Founders, Team, Partnerships**
✅ **All percentages sum to 100%**

## Contact for Deployment Support

For any questions about wallet configuration or deployment, refer to the smart contract audit reports and deployment recommendation documents.