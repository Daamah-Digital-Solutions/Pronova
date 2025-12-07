# Pronova Smart Contracts - Technical Whitepaper

**Version:** 2.0
**Date:** January 2025
**Network:** Binance Smart Chain (BSC)
**Solidity Version:** 0.8.20

---

## Executive Summary

This document provides comprehensive technical documentation for the Pronova (PRN) token ecosystem smart contracts. The system consists of three core smart contracts deployed on Binance Smart Chain, implementing an ERC-20 token with advanced tokenomics, a multi-phase presale mechanism, and a sophisticated vesting system.

### Key Highlights

- **Total Supply:** 1,000,000,000 PRN tokens
- **Presale Allocation:** 250,000,000 PRN (25%)
- **Presale Hard Cap:** $267,500,000 USD
- **Multi-Signature Security:** 2-of-N admin approval for critical operations
- **Vesting Duration:** 9-year vesting schedule for team allocations
- **MEV Protection:** Commit-reveal pattern for presale purchases
- **Oracle Integration:** Chainlink price feeds for ETH/BNB to USD conversion

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [PronovaToken (PRN) Contract](#pronovatoken-prn-contract)
3. [PronovaPresale Contract](#pronovapresale-contract)
4. [PronovaVesting Contract](#pronovavesting-contract)
5. [Security Features](#security-features)
6. [Tokenomics & Distribution](#tokenomics--distribution)
7. [Technical Specifications](#technical-specifications)
8. [Deployment Guide](#deployment-guide)
9. [Integration Guide](#integration-guide)

---

## Architecture Overview

### Contract Ecosystem

```
┌─────────────────────────────────────────────────────────────┐
│                     Pronova Ecosystem                        │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────┐      ┌──────────────────┐            │
│  │  PronovaToken    │◄─────┤  PronovaPresale  │            │
│  │     (PRN)        │      │                  │            │
│  │                  │      │  - ETH/BNB/USDT  │            │
│  │  - ERC20         │      │  - 3 Phases      │            │
│  │  - Burnable      │      │  - Chainlink     │            │
│  │  - Pausable      │      │  - MEV Protected │            │
│  │  - Multi-sig     │      └──────────────────┘            │
│  └────────┬─────────┘                                        │
│           │                                                  │
│           │          ┌──────────────────┐                   │
│           └──────────►  PronovaVesting  │                   │
│                      │                  │                   │
│                      │  - 9-year vesting│                   │
│                      │  - Multi-schedule│                   │
│                      │  - Linear/Custom │                   │
│                      └──────────────────┘                   │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack

- **Smart Contract Language:** Solidity 0.8.20
- **Framework:** Hardhat
- **Standards:** ERC-20, OpenZeppelin v5.4.0
- **Oracle:** Chainlink Price Feeds
- **Network:** Binance Smart Chain (BSC)
- **Testing:** Hardhat with Chai matchers

---

## PronovaToken (PRN) Contract

### Overview

The PronovaToken contract implements the core ERC-20 token with enhanced features including burning, pausing, multi-signature controls, and automated token distribution.

### Key Features

#### 1. **ERC-20 Standard Implementation**
- Full compliance with ERC-20 standard
- 18 decimal places
- Symbol: **PRN**
- Name: **Pronova**

#### 2. **Token Supply & Allocation**

| Allocation          | Percentage | Amount (PRN)   | Vesting           |
|---------------------|------------|----------------|-------------------|
| Presale             | 25%        | 250,000,000    | None              |
| Founders            | 14%        | 140,000,000    | 9 years (45% locked) |
| Liquidity           | 15%        | 150,000,000    | Immediate         |
| Partnerships        | 15%        | 150,000,000    | 9 years (45% locked) |
| Team                | 5%         | 50,000,000     | 9 years (45% locked) |
| Community           | 8%         | 80,000,000     | Immediate         |
| Strategic Reserves  | 6%         | 60,000,000     | Immediate         |
| Marketing           | 12%        | 120,000,000    | Immediate         |
| **TOTAL**           | **100%**   | **1,000,000,000** | -              |

#### 3. **Multi-Signature Security**

All critical operations require confirmation from 2 administrators:

- Setting allocation wallets
- Distributing token allocations
- Emergency withdrawals
- Adding/removing admin roles

```solidity
uint256 public constant REQUIRED_CONFIRMATIONS = 2;
```

**Operation Flow:**
1. Admin A initiates operation → logged
2. Admin B confirms operation → executed
3. Both confirmations logged on-chain for transparency

#### 4. **Vesting Mechanism**

**9-Year Vesting Schedule:**
- **45%** of team allocations locked for 9 years
- **2.5%** unlocks every 6 months
- **18 unlock periods** total (9 years ÷ 6 months)
- **55%** immediately available

```solidity
uint256 public constant LOCKED_PERCENTAGE = 45;
uint256 public constant UNLOCK_INTERVAL = 180 days;
uint256 public constant UNLOCK_PERCENTAGE_PER_INTERVAL = 250; // 2.5% in basis points
uint256 public constant TOTAL_VESTING_DURATION = 9 * 365 days;
```

#### 5. **Auto-Burn Mechanism**

Optional automatic burning on transfers:
- **0.1%** burn rate per transaction
- Can be enabled/disabled by admins
- Tracks total burned tokens
- Deflationary tokenomics

```solidity
uint256 public constant BURN_RATE = 10; // 0.1% (10 basis points)
```

#### 6. **Access Control Roles**

| Role                | Permissions                                      |
|---------------------|--------------------------------------------------|
| DEFAULT_ADMIN_ROLE  | Can grant/revoke all roles                      |
| ADMIN_ROLE          | Set wallets, distribute allocations, multi-sig  |
| MINTER_ROLE         | (Reserved for future use)                        |
| PAUSER_ROLE         | Pause/unpause token transfers                    |

#### 7. **Pausable**

Emergency pause functionality:
- Stops all token transfers
- Protects against exploits during emergencies
- Only PAUSER_ROLE can pause/unpause

### Contract Functions

#### Admin Functions

```solidity
// Set all allocation wallets (multi-sig required)
function setAllocationWallets(
    address _presaleContract,
    address _foundersWallet,
    address _liquidityWallet,
    address _partnershipsWallet,
    address _teamWallet,
    address _communityWallet,
    address _strategicReservesWallet,
    address _marketingWallet,
    address _vestingContract
) external onlyRole(ADMIN_ROLE);

// Distribute tokens to all wallets (multi-sig required)
function distributeAllocations() external onlyRole(ADMIN_ROLE);

// Enable/disable automatic burn
function setAutoBurn(bool _enabled) external onlyRole(ADMIN_ROLE);

// Pause all transfers
function pause() public onlyRole(PAUSER_ROLE);

// Unpause transfers
function unpause() public onlyRole(PAUSER_ROLE);
```

#### View Functions

```solidity
// Get allocation amounts
function getAllocationInfo() external pure returns (
    uint256 presale,
    uint256 founders,
    uint256 liquidity,
    uint256 partnerships,
    uint256 team,
    uint256 community,
    uint256 strategic,
    uint256 marketing
);

// Get vesting parameters
function getVestingInfo() external pure returns (
    uint256 lockedPercentage,
    uint256 vestingDuration,
    uint256 unlockInterval,
    uint256 unlockPercentage
);
```

---

## PronovaPresale Contract

### Overview

The PronovaPresale contract manages a three-phase token sale with multi-currency support, Chainlink price oracles, MEV protection, and comprehensive security features.

### Key Features

#### 1. **Three-Phase Presale Structure**

| Phase | Price per PRN | Allocation (PRN) | % of Presale | Duration |
|-------|---------------|------------------|--------------|----------|
| 1     | $0.80         | 100,000,000      | 40%          | 30 days  |
| 2     | $1.00         | 75,000,000       | 30%          | 30 days  |
| 3     | $1.50         | 75,000,000       | 30%          | 30 days  |
| **TOTAL** | -         | **250,000,000**  | **100%**     | 90 days  |

**Expected Listing Price:** $1.70 - $2.50

#### 2. **Multi-Currency Payment Support**

Accepts three payment methods:
- **ETH** (Ethereum)
- **BNB** (Binance Coin)
- **USDT** (Tether)

All prices converted to USD equivalents using Chainlink oracles.

#### 3. **Chainlink Price Feeds**

Real-time price conversion with fallback mechanisms:

```solidity
AggregatorV3Interface public ethUsdPriceFeed;
AggregatorV3Interface public bnbUsdPriceFeed;

// Fallback prices
uint256 public ethToUsdPrice = 3000 * 10**6; // $3000 per ETH
uint256 public bnbToUsdPrice = 300 * 10**6;  // $300 per BNB
```

**Price Protection:**
- Maximum 20% deviation from fallback price
- 1-hour freshness requirement
- Automatic fallback on oracle failure

#### 4. **Purchase Limits**

| Limit Type                | Amount (USD)    |
|---------------------------|-----------------|
| Minimum per transaction   | $100            |
| Maximum per transaction   | $100,000        |
| Maximum per user (lifetime) | $500,000      |
| Hard Cap (total)          | $267,500,000    |

#### 5. **MEV Protection (Commit-Reveal Pattern)**

Prevents front-running and sandwich attacks:

1. **Commit Phase:** User submits commitment hash
   ```solidity
   function commitPurchase(bytes32 _commitment) external;
   ```

2. **Delay:** Must wait 2 blocks (COMMITMENT_DELAY)

3. **Reveal Phase:** User reveals purchase details within 10 blocks
   ```solidity
   function buyWithETH(address referrer, uint256 minTokensExpected, bytes32 nonce) external payable;
   ```

4. **Verification:** Contract verifies commitment matches reveal

#### 6. **Slippage Protection**

Users specify minimum tokens expected:

```solidity
function buyWithETH(
    address referrer,
    uint256 minTokensExpected, // Slippage protection
    bytes32 nonce
) external payable;
```

If price moves unfavorably, transaction reverts.

#### 7. **Referral System**

- **5% referral bonus** in PRN tokens
- Paid to referrer on successful purchase
- Maximum 50,000 PRN per referrer
- Referrer must be whitelisted

```solidity
uint256 public constant REFERRAL_PERCENTAGE = 5;
uint256 public constant MAX_REFERRAL_REWARDS = 50_000 * 10**18;
```

#### 8. **Whitelist System**

- Presale restricted to whitelisted addresses
- Can be enabled/disabled by operators
- Batch whitelist updates supported

```solidity
function updateWhitelist(address[] calldata users, bool status) external onlyRole(OPERATOR_ROLE);
```

### Contract Functions

#### Purchase Functions

```solidity
// Purchase with ETH
function buyWithETH(
    address referrer,
    uint256 minTokensExpected,
    bytes32 nonce
) external payable;

// Purchase with BNB
function buyWithBNB(
    address referrer,
    uint256 minTokensExpected,
    bytes32 nonce
) external payable;

// Purchase with USDT
function buyWithUSDT(
    uint256 amount,
    address referrer,
    uint256 minTokensExpected,
    bytes32 nonce
) external;

// Claim purchased tokens (after presale ends)
function claimTokens() external;
```

#### Admin Functions

```solidity
// Activate/deactivate phases (multi-sig required)
function updatePhase(uint256 phaseId, bool _isActive) external onlyRole(ADMIN_ROLE);

// Update oracle fallback prices
function updatePrices(uint256 _ethPrice, uint256 _bnbPrice) external onlyRole(PRICE_ORACLE_ROLE);

// Enable token claiming
function setClaimEnabled(bool _enabled) external onlyRole(ADMIN_ROLE);

// Update whitelist
function updateWhitelist(address[] calldata users, bool status) external onlyRole(OPERATOR_ROLE);

// Emergency pause
function pause() external onlyRole(ADMIN_ROLE);
```

#### View Functions

```solidity
// Get user purchase information
function getUserPurchaseInfo(address user) external view returns (
    uint256 totalTokens,
    uint256 totalPaid,
    uint256 referralTokens,
    bool claimed
);

// Get phase information
function getPhaseInfo(uint256 phaseId) external view returns (
    uint256 pricePerToken,
    uint256 tokensAllocated,
    uint256 tokensSold,
    uint256 tokensRemaining,
    bool isActive
);

// Get expected listing price
function getExpectedListingPrice() external pure returns (uint256 minPrice, uint256 maxPrice);
```

### Purchase Flow Example

**Scenario:** User wants to buy PRN with 1 ETH

1. **Check Whitelist**
   ```javascript
   const isWhitelisted = await presale.whitelist(userAddress);
   ```

2. **Commit Purchase**
   ```javascript
   const nonce = ethers.randomBytes(32);
   const commitment = ethers.keccak256(
       ethers.solidityPacked(['address', 'uint256', 'bytes32'],
       [userAddress, ethers.parseEther("1"), nonce])
   );
   await presale.commitPurchase(commitment);
   ```

3. **Wait 2 blocks** (MEV protection delay)

4. **Execute Purchase**
   ```javascript
   const minTokens = calculateMinTokens(ethAmount, currentPhasePrice, slippageTolerance);
   await presale.buyWithETH(referrerAddress, minTokens, nonce, {
       value: ethers.parseEther("1")
   });
   ```

5. **After Presale:** Claim tokens
   ```javascript
   await presale.claimTokens();
   ```

---

## PronovaVesting Contract

### Overview

The PronovaVesting contract manages token vesting schedules for founders, team, and partnerships with both whitepaper-compliant and custom vesting options.

### Key Features

#### 1. **Whitepaper Vesting (9-Year Schedule)**

Designed for Founders, Team, and Partnerships allocations:

**Structure:**
- **Total Allocation:** 340,000,000 PRN (14% + 5% + 15%)
- **Immediate Release:** 55% (187,000,000 PRN)
- **Locked Amount:** 45% (153,000,000 PRN)
- **Vesting Duration:** 9 years
- **Unlock Frequency:** Every 6 months
- **Unlock Amount:** 2.5% of locked amount per period
- **Total Periods:** 18 unlocks

**Unlock Schedule Example:**

| Period | Time        | Unlocked % | Cumulative % | Tokens Unlocked |
|--------|-------------|------------|--------------|-----------------|
| 0      | Day 0       | 55%        | 55%          | 187M PRN        |
| 1      | 6 months    | 2.5%       | 57.5%        | 8.5M PRN        |
| 2      | 12 months   | 2.5%       | 60%          | 8.5M PRN        |
| ...    | ...         | ...        | ...          | ...             |
| 18     | 9 years     | 2.5%       | 100%         | 8.5M PRN        |

```solidity
uint256 public constant LOCKED_PERCENTAGE = 45;
uint256 public constant VESTING_DURATION = 9 * 365 days;
uint256 public constant UNLOCK_INTERVAL = 180 days;
uint256 public constant UNLOCK_PERCENTAGE_PER_INTERVAL = 250; // 2.5%
```

#### 2. **Custom Linear Vesting**

Flexible vesting for other use cases:
- Custom start time
- Custom cliff period
- Custom vesting duration
- Revocable or non-revocable

#### 3. **Multi-Schedule Support**

Each beneficiary can have multiple vesting schedules:
- One immediate release schedule (55%)
- One 9-year locked schedule (45%)
- Additional custom schedules as needed

#### 4. **Vesting Types**

```solidity
struct VestingSchedule {
    uint256 totalAmount;
    uint256 startTime;
    uint256 cliffDuration;
    uint256 vestingDuration;
    uint256 releasedAmount;
    uint256 lastReleaseTime;
    bool revocable;
    bool revoked;
    uint8 vestingType; // 0: Linear, 1: Whitepaper
    address beneficiary;
}
```

#### 5. **Allocation Tracking**

Tracks whitepaper allocations separately:

| Allocation   | Amount (PRN)    | Wallet             |
|--------------|-----------------|-------------------|
| FOUNDERS     | 140,000,000     | foundersWallet     |
| TEAM         | 50,000,000      | teamWallet         |
| PARTNERSHIPS | 150,000,000     | partnershipsWallet |

### Contract Functions

#### Setup Functions

```solidity
// Setup whitepaper allocations (multi-sig required)
function setupWhitepaperAllocations(
    address _foundersWallet,
    address _teamWallet,
    address _partnershipsWallet
) external onlyRole(ADMIN_ROLE);

// Create custom vesting schedule
function createCustomVesting(
    address beneficiary,
    uint256 amount,
    uint256 startTime,
    uint256 cliffDuration,
    uint256 vestingDuration,
    bool revocable
) external onlyRole(VESTING_MANAGER_ROLE);
```

#### Release Functions

```solidity
// Release vested tokens from specific schedule
function release(uint256 scheduleIndex) external;

// Release all available tokens from all schedules
function releaseAll() external;
```

#### Admin Functions

```solidity
// Revoke vesting schedule (multi-sig required)
function revoke(address beneficiary, uint256 scheduleIndex) external onlyRole(ADMIN_ROLE);
```

#### View Functions

```solidity
// Get specific vesting schedule details
function getVestingSchedule(address beneficiary, uint256 index) external view returns (
    uint256 totalAmount,
    uint256 startTime,
    uint256 vestingDuration,
    uint256 releasedAmount,
    uint256 releasableAmount,
    bool revoked,
    uint8 vestingType
);

// Get total releasable amount across all schedules
function getTotalReleasableAmount(address beneficiary) external view returns (uint256);

// Get next unlock time for whitepaper vesting
function getNextUnlockTime(address beneficiary, uint256 scheduleIndex) external view returns (uint256);

// Get vesting progress (percentage)
function getVestingProgress(address beneficiary, uint256 scheduleIndex) external view returns (uint256);

// Get beneficiary summary
function getBeneficiaryInfo(address beneficiary) external view returns (
    uint256 totalVested,
    uint256 totalReleased,
    uint256 totalLocked,
    uint256 totalReleasable,
    uint256 scheduleCount
);

// Get contract statistics
function getContractStats() external view returns (
    uint256 managed,
    uint256 released,
    uint256 remaining,
    uint256 vestingDurationYears,
    uint256 unlockPercentagePerPeriod,
    uint256 totalPeriods
);
```

### Vesting Calculation Logic

#### Whitepaper Vesting Formula

```solidity
function _computeWhitepaperReleasableAmount(VestingSchedule memory schedule) internal view returns (uint256) {
    uint256 timeElapsed = block.timestamp - schedule.startTime;

    // Calculate periods passed (each period = 6 months)
    uint256 periodsPassed = timeElapsed / UNLOCK_INTERVAL;

    // Cap at 18 periods
    if (periodsPassed > TOTAL_UNLOCK_PERIODS) {
        periodsPassed = TOTAL_UNLOCK_PERIODS;
    }

    // Calculate unlocked percentage (2.5% per period)
    uint256 unlockedPercentage = periodsPassed * UNLOCK_PERCENTAGE_PER_INTERVAL;

    // Calculate total unlocked amount
    uint256 totalUnlocked = (schedule.totalAmount * unlockedPercentage) / BASIS_POINTS;

    // Return only unreleased amount
    return totalUnlocked - schedule.releasedAmount;
}
```

#### Linear Vesting Formula

```solidity
function _computeLinearReleasableAmount(VestingSchedule memory schedule) internal view returns (uint256) {
    if (block.timestamp < schedule.startTime + schedule.cliffDuration) {
        return 0; // Still in cliff period
    }

    if (block.timestamp >= schedule.startTime + schedule.vestingDuration) {
        return schedule.totalAmount - schedule.releasedAmount; // Fully vested
    }

    // Calculate proportional amount
    uint256 timeFromStart = block.timestamp - schedule.startTime;
    uint256 vestedAmount = (schedule.totalAmount * timeFromStart) / schedule.vestingDuration;

    return vestedAmount - schedule.releasedAmount;
}
```

---

## Security Features

### 1. Multi-Signature Controls

**Implementation:**
- All critical operations require 2+ admin confirmations
- Each confirmation stored on-chain
- Operations cannot be executed twice
- Transparent audit trail

**Protected Operations:**
- Token allocation setup
- Token distribution
- Phase activation
- Vesting schedule creation
- Emergency withdrawals

### 2. Reentrancy Protection

All external calls protected with OpenZeppelin's ReentrancyGuard:

```solidity
function claimTokens() external nonReentrant {
    // State changes before external call
    userPurchase.hasClaimedTokens = true;
    referralRewards[msg.sender] = 0;

    // External call last
    pronovaToken.safeTransfer(msg.sender, totalToClaim);
}
```

### 3. MEV Protection

**Commit-Reveal Pattern:**
1. User commits hash of purchase intent
2. Minimum 2-block delay enforced
3. User reveals actual purchase within 10 blocks
4. Contract verifies commitment matches reveal

**Benefits:**
- Prevents front-running
- Prevents sandwich attacks
- Protects against price manipulation

### 4. Slippage Protection

Users specify minimum tokens expected:

```solidity
require(tokensReceived >= minTokensExpected, "Slippage too high");
```

Transaction reverts if price moves unfavorably.

### 5. Price Oracle Safety

**Chainlink Integration with Safeguards:**
- Maximum 20% deviation from fallback price
- Price freshness check (< 1 hour old)
- Automatic fallback on oracle failure
- Manual price update by PRICE_ORACLE_ROLE

### 6. Access Control

**Role-Based Permissions:**

```solidity
bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");
bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
bytes32 public constant PRICE_ORACLE_ROLE = keccak256("PRICE_ORACLE_ROLE");
bytes32 public constant VESTING_MANAGER_ROLE = keccak256("VESTING_MANAGER_ROLE");
```

### 7. Pausable Functionality

Emergency stop mechanism:
- Pauses token transfers
- Pauses presale purchases
- Only authorized roles can pause/unpause

### 8. SafeERC20

All token transfers use OpenZeppelin's SafeERC20:

```solidity
using SafeERC20 for IERC20;

pronovaToken.safeTransfer(user, amount);
usdtToken.safeTransferFrom(user, treasury, amount);
```

Prevents issues with non-standard ERC20 implementations.

### 9. Input Validation

Comprehensive validation on all inputs:
- Address zero checks
- Amount bounds checking
- Time validation
- State validation

### 10. Upgrade Protection

Contracts are **non-upgradeable** by design:
- Immutable logic
- No proxy patterns
- Complete transparency
- Auditable code

---

## Tokenomics & Distribution

### Token Allocation Breakdown

```
Total Supply: 1,000,000,000 PRN

┌─────────────────────────────────────────────┐
│  Presale (25%)              250M PRN        │
│  ├─ Phase 1 ($0.80)         100M PRN        │
│  ├─ Phase 2 ($1.00)          75M PRN        │
│  └─ Phase 3 ($1.50)          75M PRN        │
├─────────────────────────────────────────────┤
│  Liquidity (15%)            150M PRN        │  Immediate
├─────────────────────────────────────────────┤
│  Partnerships (15%)         150M PRN        │  45% locked 9yrs
├─────────────────────────────────────────────┤
│  Founders (14%)             140M PRN        │  45% locked 9yrs
├─────────────────────────────────────────────┤
│  Marketing (12%)            120M PRN        │  Immediate
├─────────────────────────────────────────────┤
│  Community (8%)              80M PRN        │  Immediate
├─────────────────────────────────────────────┤
│  Strategic Reserves (6%)     60M PRN        │  Immediate
├─────────────────────────────────────────────┤
│  Team (5%)                   50M PRN        │  45% locked 9yrs
└─────────────────────────────────────────────┘
```

### Presale Economics

**Phase Pricing:**

| Phase | Price  | Tokens      | Raise        | % Discount |
|-------|--------|-------------|--------------|------------|
| 1     | $0.80  | 100,000,000 | $80,000,000  | 53% off    |
| 2     | $1.00  | 75,000,000  | $75,000,000  | 41% off    |
| 3     | $1.50  | 75,000,000  | $112,500,000 | 12% off    |
| **Total** | - | **250,000,000** | **$267,500,000** | -     |

**Expected Listing:** $1.70 - $2.50 (42-167% gain from Phase 1)

### Vesting Schedule Impact

**Immediate Circulation at Launch:**
- Presale: 250M PRN (25%)
- Liquidity: 150M PRN (15%)
- Community: 80M PRN (8%)
- Marketing: 120M PRN (12%)
- Strategic: 60M PRN (6%)
- Team/Founders/Partnerships (55%): 187M PRN (18.7%)

**Total Immediate:** ~847M PRN (84.7%)

**Locked for Vesting:** 153M PRN (15.3%) over 9 years

**Circulating Supply Growth:**

| Year | Unlocked | Cumulative | % of Total |
|------|----------|------------|------------|
| 0    | 847M     | 847M       | 84.7%      |
| 0.5  | 8.5M     | 855.5M     | 85.6%      |
| 1    | 8.5M     | 864M       | 86.4%      |
| 2    | 17M      | 881M       | 88.1%      |
| 5    | 42.5M    | 932M       | 93.2%      |
| 9    | 68M      | 1000M      | 100%       |

### Burn Mechanism

**Optional Auto-Burn:**
- Rate: 0.1% per transaction
- Can be enabled/disabled by admins
- Reduces circulating supply over time
- Creates deflationary pressure

**Example Impact:**

If auto-burn enabled and 1B transactions occur with average 1000 PRN:
- Total volume: 1,000,000,000,000 PRN
- Burned: 1,000,000,000 PRN (0.1%)
- Effective burn rate depends on transaction volume

---

## Technical Specifications

### Contract Addresses (To Be Deployed)

| Contract          | Address                                    |
|-------------------|--------------------------------------------|
| PronovaToken      | `0x...` (Deploy first)                     |
| PronovaPresale    | `0x...` (Deploy second)                    |
| PronovaVesting    | `0x...` (Deploy third)                     |
| Treasury Wallet   | `0x...` (Receive presale funds)            |

### Gas Optimization

**Strategies Implemented:**
- Struct packing (uint128, uint64 types)
- Storage over memory where appropriate
- Batch operations (whitelist updates)
- Minimal storage reads/writes
- Event emission for off-chain indexing

**Estimated Gas Costs:**

| Operation                 | Gas Cost      |
|---------------------------|---------------|
| buyWithETH                | ~150,000 gas  |
| buyWithUSDT               | ~120,000 gas  |
| claimTokens               | ~80,000 gas   |
| release (vesting)         | ~60,000 gas   |
| Transfer PRN              | ~65,000 gas   |
| Transfer PRN (with burn)  | ~75,000 gas   |

### Events

**PronovaToken Events:**

```solidity
event AllocationWalletSet(string allocation, address indexed wallet);
event AllocationsDistributed(uint256 timestamp);
event VestingStarted(uint256 startTime);
event AutoBurnToggled(bool enabled);
event TokensBurnedAutomatically(uint256 amount);
event OperationConfirmed(bytes32 indexed operation, address indexed admin);
event OperationExecuted(bytes32 indexed operation);
```

**PronovaPresale Events:**

```solidity
event TokensPurchased(
    address indexed buyer,
    uint256 amountUSD,
    uint256 tokens,
    uint256 phase,
    string paymentMethod
);
event PurchaseCommitted(address indexed buyer, bytes32 commitment);
event PhaseUpdated(uint256 phase, bool isActive);
event ReferralRewardEarned(address indexed referrer, address indexed buyer, uint256 reward);
event TokensClaimed(address indexed user, uint256 amount);
event WhitelistUpdated(address indexed user, bool status);
event PriceUpdated(string token, uint256 price);
```

**PronovaVesting Events:**

```solidity
event VestingScheduleCreated(
    address indexed beneficiary,
    uint256 amount,
    uint256 startTime,
    uint256 vestingDuration,
    uint8 vestingType,
    string allocation
);
event TokensReleased(address indexed beneficiary, uint256 amount);
event VestingRevoked(address indexed beneficiary, uint256 scheduleIndex);
event AllocationSet(string allocation, address beneficiary, uint256 amount);
```

### Dependencies

**OpenZeppelin Contracts v5.4.0:**
- `ERC20.sol`
- `ERC20Burnable.sol`
- `ERC20Pausable.sol`
- `AccessControl.sol`
- `ReentrancyGuard.sol`
- `Pausable.sol`
- `SafeERC20.sol`

**Chainlink Contracts:**
- `AggregatorV3Interface.sol` (Price feeds)

### Network Configuration

**Binance Smart Chain Mainnet:**
- Chain ID: 56
- RPC: https://bsc-dataseed.binance.org/
- Explorer: https://bscscan.com/

**BSC Testnet:**
- Chain ID: 97
- RPC: https://data-seed-prebsc-1-s1.binance.org:8545/
- Explorer: https://testnet.bscscan.com/

**Chainlink Price Feeds (BSC Mainnet):**
- ETH/USD: `0x9ef1B8c0E4F7dc8bF5719Ea496883DC6401d5b2e`
- BNB/USD: `0x0567F2323251f0Aab15c8dFb1967E4e8A7D42aeE`

---

## Deployment Guide

### Prerequisites

1. **Hardhat Environment Setup**
   ```bash
   cd backend/contracts
   npm install
   ```

2. **Environment Variables** (create `.env` file):
   ```
   PRIVATE_KEY=0x...
   BSC_MAINNET_RPC=https://bsc-dataseed.binance.org/
   BSC_TESTNET_RPC=https://data-seed-prebsc-1-s1.binance.org:8545/
   BSCSCAN_API_KEY=YOUR_API_KEY
   ```

3. **Wallet Addresses Prepared:**
   - Treasury wallet (receives presale funds)
   - Founders wallet
   - Team wallet
   - Partnerships wallet
   - Liquidity wallet
   - Community wallet
   - Strategic reserves wallet
   - Marketing wallet

### Deployment Steps

#### Step 1: Deploy PronovaToken

```bash
npx hardhat run scripts/deploy-testnet.js --network bscTestnet
```

**Script performs:**
1. Deploy PronovaToken contract
2. Grant ADMIN_ROLE to deployer
3. Mint 1B PRN to contract
4. Log deployment address

**Expected Output:**
```
Deploying PronovaToken...
PronovaToken deployed to: 0x...
Total Supply: 1000000000 PRN
```

#### Step 2: Deploy PronovaVesting

**Constructor Parameters:**
- `_pronovaToken`: PronovaToken address from Step 1

```bash
# Deploy PronovaVesting
const vesting = await PronovaVesting.deploy(pronovaTokenAddress);
await vesting.waitForDeployment();
```

**Expected Output:**
```
PronovaVesting deployed to: 0x...
```

#### Step 3: Deploy PronovaPresale

**Constructor Parameters:**
- `_pronovaToken`: PronovaToken address
- `_usdtToken`: USDT contract address (BSC: `0x55d398326f99059fF775485246999027B3197955`)
- `_treasuryWallet`: Treasury wallet address
- `_ethUsdPriceFeed`: Chainlink ETH/USD feed
- `_bnbUsdPriceFeed`: Chainlink BNB/USD feed

```bash
# Deploy PronovaPresale
const presale = await PronovaPresale.deploy(
    pronovaTokenAddress,
    usdtTokenAddress,
    treasuryWalletAddress,
    ethUsdPriceFeed,
    bnbUsdPriceFeed
);
await presale.waitForDeployment();
```

**Expected Output:**
```
PronovaPresale deployed to: 0x...
Phase 1 initialized: $0.80/PRN, 100M tokens
```

#### Step 4: Configure PronovaToken Allocations

**Multi-Sig Setup:**

Admin 1 sets wallets:
```solidity
await pronovaToken.setAllocationWallets(
    presaleAddress,
    foundersWallet,
    liquidityWallet,
    partnershipsWallet,
    teamWallet,
    communityWallet,
    strategicReservesWallet,
    marketingWallet,
    vestingAddress
);
```

Admin 2 confirms:
```solidity
await pronovaToken.confirmSetAllocationWallets(
    presaleAddress,
    foundersWallet,
    liquidityWallet,
    partnershipsWallet,
    teamWallet,
    communityWallet,
    strategicReservesWallet,
    marketingWallet,
    vestingAddress
);
```

#### Step 5: Distribute Tokens

Admin 1 initiates distribution:
```solidity
await pronovaToken.distributeAllocations();
```

Admin 2 confirms distribution:
```solidity
await pronovaToken.confirmDistributeAllocations();
```

**Result:**
- 250M PRN → Presale contract
- 340M PRN → Vesting contract (Founders + Team + Partnerships)
- 150M PRN → Liquidity wallet
- 80M PRN → Community wallet
- 60M PRN → Strategic reserves wallet
- 120M PRN → Marketing wallet

#### Step 6: Setup Vesting Schedules

Admin 1 initiates vesting setup:
```solidity
await vestingContract.setupWhitepaperAllocations(
    foundersWallet,
    teamWallet,
    partnershipsWallet
);
```

Admin 2 confirms (multi-sig):
```solidity
// Second admin calls same function to confirm
await vestingContract.setupWhitepaperAllocations(
    foundersWallet,
    teamWallet,
    partnershipsWallet
);
```

**Result:**
- Founders: 140M PRN (77M immediate, 63M locked)
- Team: 50M PRN (27.5M immediate, 22.5M locked)
- Partnerships: 150M PRN (82.5M immediate, 67.5M locked)

#### Step 7: Configure Presale

1. **Update Whitelist:**
   ```solidity
   await presaleContract.updateWhitelist([addr1, addr2, ...], true);
   ```

2. **Start Presale (Activate Phase 1):**
   ```solidity
   await presaleContract.updatePhase(1, true);
   ```

3. **Grant Price Oracle Role:**
   ```solidity
   await presaleContract.grantRole(PRICE_ORACLE_ROLE, oracleAddress);
   ```

#### Step 8: Verify Contracts on BSCScan

```bash
npx hardhat verify --network bsc <CONTRACT_ADDRESS> <CONSTRUCTOR_ARGS>
```

Example:
```bash
npx hardhat verify --network bsc 0x... --constructor-args arguments.js
```

### Post-Deployment Checklist

- [ ] All three contracts deployed
- [ ] Allocation wallets set and confirmed (multi-sig)
- [ ] Tokens distributed to all wallets
- [ ] Vesting schedules created for team allocations
- [ ] Presale whitelist populated
- [ ] Phase 1 activated
- [ ] Contracts verified on BSCScan
- [ ] Treasury wallet configured
- [ ] Price oracle role assigned
- [ ] Admin roles properly distributed
- [ ] Emergency pause functionality tested

---

## Integration Guide

### Frontend Integration

#### 1. Contract ABI Import

```javascript
import PronovaTokenABI from './abis/PronovaToken.json';
import PronovaPresaleABI from './abis/PronovaPresale.json';
import PronovaVestingABI from './abis/PronovaVesting.json';
```

#### 2. Contract Instances

```javascript
import { ethers } from 'ethers';

const provider = new ethers.BrowserProvider(window.ethereum);
const signer = await provider.getSigner();

const tokenContract = new ethers.Contract(
    TOKEN_ADDRESS,
    PronovaTokenABI,
    signer
);

const presaleContract = new ethers.Contract(
    PRESALE_ADDRESS,
    PronovaPresaleABI,
    signer
);

const vestingContract = new ethers.Contract(
    VESTING_ADDRESS,
    PronovaVestingABI,
    signer
);
```

#### 3. Check Whitelist Status

```javascript
async function checkWhitelist(address) {
    const isWhitelisted = await presaleContract.whitelist(address);
    return isWhitelisted;
}
```

#### 4. Get Current Phase Information

```javascript
async function getCurrentPhase() {
    const currentPhase = await presaleContract.currentPhase();
    const phaseInfo = await presaleContract.getPhaseInfo(currentPhase);

    return {
        phase: currentPhase,
        pricePerToken: ethers.formatUnits(phaseInfo.pricePerToken, 6), // 6 decimals
        tokensAllocated: ethers.formatEther(phaseInfo.tokensAllocated),
        tokensSold: ethers.formatEther(phaseInfo.tokensSold),
        tokensRemaining: ethers.formatEther(phaseInfo.tokensRemaining),
        isActive: phaseInfo.isActive
    };
}
```

#### 5. Purchase with ETH (with MEV Protection)

```javascript
async function buyWithETH(ethAmount, referrer, slippageTolerance = 0.5) {
    // Step 1: Commit purchase
    const nonce = ethers.randomBytes(32);
    const userAddress = await signer.getAddress();

    const commitment = ethers.keccak256(
        ethers.solidityPacked(
            ['address', 'uint256', 'bytes32'],
            [userAddress, ethers.parseEther(ethAmount), nonce]
        )
    );

    const commitTx = await presaleContract.commitPurchase(commitment);
    await commitTx.wait();

    console.log('Purchase committed, waiting 2 blocks...');

    // Step 2: Wait 2 blocks
    const commitBlock = await provider.getBlockNumber();
    while ((await provider.getBlockNumber()) < commitBlock + 2) {
        await new Promise(resolve => setTimeout(resolve, 3000)); // Wait 3s
    }

    // Step 3: Calculate minimum tokens (slippage protection)
    const phaseInfo = await presaleContract.getPhaseInfo(
        await presaleContract.currentPhase()
    );
    const ethPrice = await presaleContract._getETHPriceInUSD();
    const usdAmount = ethers.parseEther(ethAmount) * ethPrice / ethers.parseEther("1");
    const expectedTokens = usdAmount * ethers.parseEther("1") / phaseInfo.pricePerToken;
    const minTokens = expectedTokens * BigInt(100 - slippageTolerance * 100) / BigInt(100);

    // Step 4: Execute purchase
    const buyTx = await presaleContract.buyWithETH(
        referrer || ethers.ZeroAddress,
        minTokens,
        nonce,
        { value: ethers.parseEther(ethAmount) }
    );

    const receipt = await buyTx.wait();
    console.log('Purchase successful!', receipt);

    return receipt;
}
```

#### 6. Purchase with USDT

```javascript
async function buyWithUSDT(usdtAmount, referrer, slippageTolerance = 0.5) {
    // Step 1: Approve USDT
    const usdtContract = new ethers.Contract(USDT_ADDRESS, ERC20_ABI, signer);
    const approveTx = await usdtContract.approve(
        PRESALE_ADDRESS,
        ethers.parseUnits(usdtAmount, 6) // USDT has 6 decimals
    );
    await approveTx.wait();

    // Step 2: Commit purchase
    const nonce = ethers.randomBytes(32);
    const userAddress = await signer.getAddress();
    const amount = ethers.parseUnits(usdtAmount, 6);

    const commitment = ethers.keccak256(
        ethers.solidityPacked(
            ['address', 'uint256', 'bytes32'],
            [userAddress, amount, nonce]
        )
    );

    const commitTx = await presaleContract.commitPurchase(commitment);
    await commitTx.wait();

    // Step 3: Wait 2 blocks
    const commitBlock = await provider.getBlockNumber();
    while ((await provider.getBlockNumber()) < commitBlock + 2) {
        await new Promise(resolve => setTimeout(resolve, 3000));
    }

    // Step 4: Calculate minimum tokens
    const phaseInfo = await presaleContract.getPhaseInfo(
        await presaleContract.currentPhase()
    );
    const expectedTokens = amount * ethers.parseEther("1") / phaseInfo.pricePerToken;
    const minTokens = expectedTokens * BigInt(100 - slippageTolerance * 100) / BigInt(100);

    // Step 5: Execute purchase
    const buyTx = await presaleContract.buyWithUSDT(
        amount,
        referrer || ethers.ZeroAddress,
        minTokens,
        nonce
    );

    const receipt = await buyTx.wait();
    return receipt;
}
```

#### 7. Claim Tokens After Presale

```javascript
async function claimTokens() {
    const claimTx = await presaleContract.claimTokens();
    const receipt = await claimTx.wait();
    console.log('Tokens claimed!', receipt);
    return receipt;
}
```

#### 8. Check User Purchase Info

```javascript
async function getUserInfo(address) {
    const info = await presaleContract.getUserPurchaseInfo(address);

    return {
        totalTokens: ethers.formatEther(info.totalTokens),
        totalPaid: ethers.formatUnits(info.totalPaid, 6), // USD with 6 decimals
        referralTokens: ethers.formatEther(info.referralTokens),
        claimed: info.claimed
    };
}
```

#### 9. Check Vesting Information

```javascript
async function getVestingInfo(address) {
    const info = await vestingContract.getBeneficiaryInfo(address);

    return {
        totalVested: ethers.formatEther(info.totalVested),
        totalReleased: ethers.formatEther(info.totalReleased),
        totalLocked: ethers.formatEther(info.totalLocked),
        totalReleasable: ethers.formatEther(info.totalReleasable),
        scheduleCount: info.scheduleCount.toString()
    };
}
```

#### 10. Release Vested Tokens

```javascript
async function releaseVestedTokens() {
    const releaseTx = await vestingContract.releaseAll();
    const receipt = await releaseTx.wait();
    console.log('Vested tokens released!', receipt);
    return receipt;
}
```

### Backend Integration

#### 1. Monitor Presale Events

```javascript
import { ethers } from 'ethers';

const provider = new ethers.JsonRpcProvider(BSC_RPC_URL);
const presaleContract = new ethers.Contract(
    PRESALE_ADDRESS,
    PronovaPresaleABI,
    provider
);

// Listen for purchases
presaleContract.on('TokensPurchased', (buyer, amountUSD, tokens, phase, paymentMethod, event) => {
    console.log('New purchase:', {
        buyer,
        amountUSD: ethers.formatUnits(amountUSD, 6),
        tokens: ethers.formatEther(tokens),
        phase: phase.toString(),
        paymentMethod,
        txHash: event.log.transactionHash
    });

    // Store in database
    savePurchaseToDatabase({
        buyer,
        amountUSD,
        tokens,
        phase,
        paymentMethod,
        txHash: event.log.transactionHash,
        timestamp: new Date()
    });
});

// Listen for referral rewards
presaleContract.on('ReferralRewardEarned', (referrer, buyer, reward, event) => {
    console.log('Referral reward earned:', {
        referrer,
        buyer,
        reward: ethers.formatEther(reward)
    });

    // Update referrer stats
    updateReferrerStats(referrer, reward);
});
```

#### 2. Sync Blockchain Data

```javascript
async function syncPresaleData() {
    const currentPhase = await presaleContract.currentPhase();
    const phaseInfo = await presaleContract.getPhaseInfo(currentPhase);
    const totalRaised = await presaleContract.totalRaisedUSD();

    return {
        currentPhase: currentPhase.toString(),
        pricePerToken: ethers.formatUnits(phaseInfo.pricePerToken, 6),
        tokensSold: ethers.formatEther(phaseInfo.tokensSold),
        tokensRemaining: ethers.formatEther(phaseInfo.tokensRemaining),
        totalRaisedUSD: ethers.formatUnits(totalRaised, 6)
    };
}

// Update database every 30 seconds
setInterval(async () => {
    const data = await syncPresaleData();
    await updateDashboard(data);
}, 30000);
```

#### 3. Validate Transactions

```javascript
async function validateTransaction(txHash) {
    const tx = await provider.getTransaction(txHash);
    const receipt = await provider.getTransactionReceipt(txHash);

    if (!receipt || receipt.status !== 1) {
        throw new Error('Transaction failed');
    }

    // Parse logs to find TokensPurchased event
    const logs = receipt.logs;
    const purchaseEvent = logs.find(log => {
        try {
            const parsed = presaleContract.interface.parseLog({
                topics: log.topics,
                data: log.data
            });
            return parsed.name === 'TokensPurchased';
        } catch {
            return false;
        }
    });

    if (!purchaseEvent) {
        throw new Error('No purchase event found');
    }

    const parsed = presaleContract.interface.parseLog({
        topics: purchaseEvent.topics,
        data: purchaseEvent.data
    });

    return {
        buyer: parsed.args.buyer,
        amountUSD: ethers.formatUnits(parsed.args.amountUSD, 6),
        tokens: ethers.formatEther(parsed.args.tokens),
        phase: parsed.args.phase.toString(),
        paymentMethod: parsed.args.paymentMethod
    };
}
```

---

## Appendix

### A. Contract Source Code Locations

- **PronovaToken:** `backend/contracts/contracts/PronovaToken.sol`
- **PronovaPresale:** `backend/contracts/contracts/PronovaPresale.sol`
- **PronovaVesting:** `backend/contracts/contracts/PronovaVesting.sol`
- **Test Files:** `backend/contracts/test/*.js`
- **Deployment Scripts:** `backend/contracts/scripts/*.js`

### B. Testing

**Run All Tests:**
```bash
cd backend/contracts
npx hardhat test
```

**Run Specific Test:**
```bash
npx hardhat test test/PronovaToken.test.js
```

**Test Coverage:**
```bash
npx hardhat coverage
```

**Expected Coverage:**
- Statements: >95%
- Branches: >90%
- Functions: >95%
- Lines: >95%

### C. Audit Reports

Refer to:
- `FINAL_AUDIT_REPORT_V2.md` - Comprehensive security audit
- `SECURITY_COMPLIANCE_CHECKLIST.md` - Security verification
- `TEST_COVERAGE_REPORT.md` - Testing documentation

### D. Additional Resources

- **OpenZeppelin Documentation:** https://docs.openzeppelin.com/
- **Chainlink Price Feeds:** https://docs.chain.link/data-feeds
- **BSC Documentation:** https://docs.bnbchain.org/
- **Hardhat Docs:** https://hardhat.org/docs

### E. Support & Contact

For technical support or questions about the smart contracts:

- **GitHub Issues:** [Repository URL]
- **Email:** dev@pronova.io
- **Telegram:** @PronovaDevSupport
- **Documentation:** https://docs.pronova.io

---

## Conclusion

The Pronova smart contract ecosystem represents a comprehensive, secure, and feature-rich tokenomics implementation. With multi-signature controls, MEV protection, Chainlink oracle integration, and sophisticated vesting mechanisms, the contracts provide enterprise-grade security while maintaining flexibility for future growth.

**Key Achievements:**

✅ **Security:** Multi-sig, reentrancy protection, MEV resistance
✅ **Transparency:** Non-upgradeable, fully auditable, on-chain verification
✅ **Compliance:** 9-year vesting, proper tokenomics, referral system
✅ **Scalability:** Gas-optimized, batch operations, efficient storage
✅ **Integration:** Comprehensive APIs, event logging, frontend-ready

The contracts are production-ready and awaiting deployment to Binance Smart Chain.

---

**Document Version:** 2.0
**Last Updated:** January 2025
**Prepared For:** Pronova Project Client
**Prepared By:** Smart Contract Development Team
