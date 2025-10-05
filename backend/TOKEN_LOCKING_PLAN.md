# Pronova Token Locking & Vesting Implementation Plan

## Executive Summary

This document outlines the comprehensive locking mechanism for Pronova token allocations, ensuring controlled token release and long-term project stability.

## 🔐 Current Implementation Status

### ✅ Already Implemented (PronovaVesting.sol)
- **Founders**: 140M PRN - 9-year vesting (45% locked)
- **Team**: 50M PRN - 9-year vesting (45% locked)
- **Partnerships**: 150M PRN - 9-year vesting (45% locked)
- **Total Vested**: 340M PRN

### ❌ Not Yet Locked
- **Liquidity**: 150M PRN - Currently unlocked
- **Community**: 80M PRN - Currently unlocked
- **Strategic**: 60M PRN - Currently unlocked
- **Marketing**: 120M PRN - Currently unlocked
- **Total Unlocked**: 410M PRN

## 🎯 Proposed Locking Architecture

### Option 1: Comprehensive Multi-Contract System (RECOMMENDED)

#### A. PronovaVesting.sol (Existing - Enhanced)
**Purpose**: Long-term team allocations
```solidity
Founders: 140M PRN
- 55% (77M) immediate for operations
- 45% (63M) locked 9 years
- Release: 3.5M every 6 months

Team: 50M PRN
- 55% (27.5M) immediate
- 45% (22.5M) locked 9 years
- Release: 1.25M every 6 months

Partnerships: 150M PRN
- 55% (82.5M) immediate
- 45% (67.5M) locked 9 years
- Release: 3.75M every 6 months
```

#### B. PronovaLiquidityLock.sol (NEW)
**Purpose**: DEX liquidity protection
```solidity
contract PronovaLiquidityLock {
    uint256 public constant LOCK_DURATION = 2 years;
    uint256 public constant INITIAL_LOCK = 80%; // 120M locked
    uint256 public constant UNLOCK_RATE = 20%; // 30M every 6 months

    // Multi-sig required for emergency withdrawal
    // Auto-unlock portions for market making
}
```

#### C. PronovaCommunityVault.sol (NEW)
**Purpose**: Community rewards distribution
```solidity
contract PronovaCommunityVault {
    uint256 public constant TOTAL_ALLOCATION = 80_000_000 * 10**18;

    // Monthly unlock: 8M PRN (10%)
    // Governance voting for allocation
    // Staking rewards pool
    // Airdrop allocations
}
```

#### D. PronovaStrategicTimelock.sol (NEW)
**Purpose**: Strategic reserves management
```solidity
contract PronovaStrategicTimelock {
    uint256 public constant LOCK_DURATION = 3 years;
    uint256 public constant QUARTERLY_UNLOCK = 5_000_000 * 10**18;

    // Multi-sig approval for usage
    // Emergency fund provisions
}
```

### Option 2: Unified Treasury Contract

```solidity
contract PronovaTreasury {
    struct Allocation {
        uint256 totalAmount;
        uint256 released;
        uint256 lockDuration;
        uint256 unlockStart;
        uint256 unlockRate;
        address beneficiary;
    }

    mapping(string => Allocation) public allocations;

    // Single contract managing all non-vested allocations
    // Simplified management but less flexibility
}
```

## 🏗️ Wallet Control Structure

### Multi-Signature Architecture
```
Level 1: Deployment (1-of-1)
- Initial deployment wallet
- Transfers admin to multi-sig after setup

Level 2: Operations (2-of-3)
- Daily operations
- Marketing spend
- Community distributions

Level 3: Critical (3-of-5)
- Vesting changes
- Emergency withdrawals
- Contract upgrades
```

### Recommended Wallet Setup
```javascript
{
  "deploymentWallet": "0x...", // Temporary, transfers control

  "multiSigWallets": {
    "operations": "0x...", // 2-of-3 Gnosis Safe
    "critical": "0x...",    // 3-of-5 Gnosis Safe
    "treasury": "0x..."     // 2-of-4 for funds
  },

  "allocationWallets": {
    "liquidityLock": "PronovaLiquidityLock contract",
    "communityVault": "PronovaCommunityVault contract",
    "strategicTimelock": "PronovaStrategicTimelock contract",
    "marketingOps": "0x...", // EOA or multi-sig
    "vestingContract": "PronovaVesting contract"
  }
}
```

## 📅 Unlock Schedule Timeline

### Year 1
- **Monthly**: Marketing (10M/month), Community (6.67M/month)
- **Q1-Q4**: Strategic (5M/quarter)
- **Month 6**: Liquidity first unlock (30M)

### Year 2-3
- **Semi-Annual**: Team/Founders/Partnerships vesting
- **Quarterly**: Strategic continues
- **Year 2 End**: Liquidity fully unlocked

### Year 4-9
- **Semi-Annual**: Only long-term vesting continues
- **Decreasing circulation**: Natural deflation from burns

## 🔄 Token Flow Mechanism

### Release Process
```
1. Time Trigger → Smart Contract Check
2. Unlock Condition Met → Tokens Available
3. Beneficiary Claims → Multi-sig Approval (if required)
4. Transfer Execution → Event Emission
5. Dashboard Update → Transparency Report
```

### Emergency Procedures
```solidity
// All contracts include emergency functions
function emergencyPause() external onlyRole(EMERGENCY_ROLE)
function emergencyWithdraw() external requires3of5Multisig()
```

## 📝 Required Contract Changes

### 1. PronovaToken.sol
```solidity
// Add treasury contract addresses
address public liquidityLockContract;
address public communityVaultContract;
address public strategicTimelockContract;

// Update distribution function
function distributeAllocations() {
    // Send to lock contracts instead of direct wallets
    _transfer(address(this), liquidityLockContract, LIQUIDITY_ALLOCATION);
    _transfer(address(this), communityVaultContract, COMMUNITY_ALLOCATION);
    _transfer(address(this), strategicTimelockContract, STRATEGIC_ALLOCATION);
}
```

### 2. Deployment Script Updates
```javascript
// Deploy lock contracts first
const liquidityLock = await LiquidityLock.deploy(tokenAddress);
const communityVault = await CommunityVault.deploy(tokenAddress);
const strategicTimelock = await StrategicTimelock.deploy(tokenAddress);

// Then set in token contract
await token.setLockContracts(
    liquidityLock.address,
    communityVault.address,
    strategicTimelock.address
);
```

## 💰 Economic Impact Analysis

### Circulating Supply Control
```
Initial (Day 1):
- Presale: 250M (unlocked)
- Team Immediate: 187M (55% of vested)
- Marketing: 120M (operational)
- Total Circulating: ~557M (55.7%)

After 1 Year:
- Community Released: 80M
- Strategic Released: 20M
- Liquidity Released: 60M
- Total Circulating: ~717M (71.7%)

After Full Unlock (9 years):
- Total Circulating: 1,000M (100%)
- Expected Burned: ~50-100M
- Net Supply: 900-950M
```

## 🚀 Implementation Steps

### Phase 1: Contract Development (Week 1)
1. [ ] Create PronovaLiquidityLock.sol
2. [ ] Create PronovaCommunityVault.sol
3. [ ] Create PronovaStrategicTimelock.sol
4. [ ] Update PronovaToken.sol distribution

### Phase 2: Testing (Week 2)
1. [ ] Unit tests for each lock contract
2. [ ] Integration tests with token contract
3. [ ] Time-based unlock simulations
4. [ ] Multi-sig operation tests

### Phase 3: Deployment (Week 3)
1. [ ] Deploy to testnet
2. [ ] Configure multi-sig wallets
3. [ ] Verify all contracts
4. [ ] Execute initial distribution

### Phase 4: Monitoring
1. [ ] Create transparency dashboard
2. [ ] Set up monitoring alerts
3. [ ] Publish monthly unlock reports
4. [ ] Community communication plan

## ⚠️ Risk Mitigation

### Smart Contract Risks
- **Solution**: Professional audit before mainnet
- **Timelock**: 48-hour delay on critical changes
- **Multi-sig**: No single point of failure

### Liquidity Risks
- **Solution**: Gradual unlock schedule
- **Reserve**: 10% emergency liquidity fund
- **Monitoring**: Real-time DEX metrics

### Regulatory Compliance
- **Vesting**: Compliant with securities guidelines
- **Transparency**: Public unlock schedule
- **Documentation**: Legal opinion on structure

## 📊 Comparison with Industry Standards

| Project | Team Vesting | Liquidity Lock | Community |
|---------|-------------|----------------|-----------|
| **Pronova** | 9 years | 2 years | 1 year |
| Uniswap | 4 years | Permanent | No lock |
| Sushiswap | 2 years | 1 year | Monthly |
| Curve | 4 years | Permanent | Linear |
| Aave | 3 years | No lock | Governance |

## ✅ Recommendation

**Implement Option 1: Comprehensive Multi-Contract System**

**Rationale:**
1. Maximum flexibility for different allocation types
2. Better security through isolation
3. Easier upgrades and modifications
4. Clear separation of concerns
5. Industry-standard approach

**Timeline:** 3 weeks to full implementation
**Cost:** ~$15-20k for development and audit
**Risk Level:** Low with proper testing

## 📋 Approval Checklist

- [ ] Review and approve locking schedule
- [ ] Confirm multi-sig participants
- [ ] Approve contract architecture
- [ ] Set emergency procedures
- [ ] Define monitoring requirements
- [ ] Approve implementation timeline

---

**Next Steps:**
1. Review and approve this plan
2. Select Option 1 or Option 2
3. Authorize contract development
4. Schedule audit timeline

This plan ensures maximum token value preservation while maintaining operational flexibility and community trust.