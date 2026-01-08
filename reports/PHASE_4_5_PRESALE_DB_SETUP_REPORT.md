# Phase 4.5: Presale Phase Configuration (Database) Report

**Date:** December 9, 2025
**Status:** COMPLETE
**Executed By:** Claude Code

---

## Overview

This intermediate phase configures the `PresalePhase` table in PostgreSQL to match the on-chain presale configuration from the BSC Testnet smart contract.

---

## Task Summary

| Task | Status | Details |
|------|--------|---------|
| Inspect presale service | PASS | `presale.service.ts` uses `PresalePhase` model |
| Read contract config | PASS | Extracted 3 phases from `PronovaPresale.sol` |
| Create seed script | PASS | `prisma/seed-presale-phases.ts` created |
| Populate DB | PASS | 3 phases inserted successfully |
| Test endpoints | PASS | `/info` and `/calculate` now work |

---

## Smart Contract Phase Configuration

From `backend/contracts/contracts/PronovaPresale.sol` (`_initializePhases()` function):

| Phase | Price | Tokens Allocated | Duration | Min/Max |
|-------|-------|------------------|----------|---------|
| 1 | $0.80 | 100M (40% of 250M) | 30 days | $100 / $100K |
| 2 | $1.00 | 75M (30% of 250M) | 30 days | $100 / $100K |
| 3 | $1.50 | 75M (30% of 250M) | 30 days | $100 / $100K |

**Total Presale Allocation:** 250M tokens (25% of 1B total supply)

---

## Database Data Inserted

The following data was inserted into the `PresalePhase` table:

```sql
-- Phase 1
INSERT INTO "PresalePhase" (
  "phaseNumber", "name", "pricePerToken", "tokenSupply", "tokensSold",
  "startDate", "endDate", "minPurchase", "maxPurchase", "isActive"
) VALUES (
  1, 'Phase 1 - Early Bird', 0.80, 100000000, 0,
  NOW(), NOW() + INTERVAL '30 days', 100, 100000, true
);

-- Phase 2
INSERT INTO "PresalePhase" (
  "phaseNumber", "name", "pricePerToken", "tokenSupply", "tokensSold",
  "startDate", "endDate", "minPurchase", "maxPurchase", "isActive"
) VALUES (
  2, 'Phase 2 - Growth', 1.00, 75000000, 0,
  NOW() + INTERVAL '30 days', NOW() + INTERVAL '60 days', 100, 100000, false
);

-- Phase 3
INSERT INTO "PresalePhase" (
  "phaseNumber", "name", "pricePerToken", "tokenSupply", "tokensSold",
  "startDate", "endDate", "minPurchase", "maxPurchase", "isActive"
) VALUES (
  3, 'Phase 3 - Final', 1.50, 75000000, 0,
  NOW() + INTERVAL '60 days', NOW() + INTERVAL '90 days', 100, 100000, false
);
```

---

## Seed Script

**File:** `backend/prisma/seed-presale-phases.ts`

**How to run:**

```bash
# Option 1: Using npm script
cd backend
npm run seed:presale

# Option 2: Direct execution
cd backend
npx ts-node prisma/seed-presale-phases.ts
```

**Script behavior:**
- Deletes any existing phases first (clean slate)
- Inserts all 3 phases matching contract config
- Sets Phase 1 as active
- Outputs a summary table

**Example output:**

```
Starting presale phase seed...

Inserting presale phases...

Created Phase 1: Phase 1 - Early Bird
  - Price: $0.8
  - Supply: 100,000,000 tokens
  - Min/Max Purchase: $100 - $100000
  - Active: true
  - Period: 12/9/2025 - 1/8/2026

Created Phase 2: Phase 2 - Growth
  - Price: $1
  - Supply: 75,000,000 tokens
  - Min/Max Purchase: $100 - $100000
  - Active: false
  - Period: 1/8/2026 - 2/7/2026

Created Phase 3: Phase 3 - Final
  - Price: $1.5
  - Supply: 75,000,000 tokens
  - Min/Max Purchase: $100 - $100000
  - Active: false
  - Period: 2/7/2026 - 3/9/2026

==================================================
Successfully seeded 3 presale phases.
==================================================
```

---

## API Endpoint Test Results

### GET /api/presale/info

**Response (after seeding):**

```json
{
  "success": true,
  "data": {
    "currentPhase": {
      "id": 1,
      "name": "Phase 1 - Early Bird",
      "pricePerToken": 0.8,
      "tokenSupply": 100000000,
      "tokensSold": 0,
      "startDate": "2025-12-09T10:28:19.820Z",
      "endDate": "2026-01-08T10:28:19.820Z",
      "minPurchase": 100,
      "maxPurchase": 100000,
      "isActive": true
    },
    "phases": [
      {
        "id": 1,
        "name": "Phase 1 - Early Bird",
        "pricePerToken": 0.8,
        "tokenSupply": 100000000,
        "tokensSold": 0,
        "isActive": true
      },
      {
        "id": 2,
        "name": "Phase 2 - Growth",
        "pricePerToken": 1,
        "tokenSupply": 75000000,
        "tokensSold": 0,
        "isActive": false
      },
      {
        "id": 3,
        "name": "Phase 3 - Final",
        "pricePerToken": 1.5,
        "tokenSupply": 75000000,
        "tokensSold": 0,
        "isActive": false
      }
    ],
    "stats": {
      "totalTokensAllocated": 250000000,
      "totalTokensSold": 0,
      "totalUsers": 4,
      "totalTransactions": 0,
      "totalRaised": 0
    }
  }
}
```

**Status:** PASS

---

### POST /api/presale/calculate

**Request ($100 USD):**

```json
{
  "amount": 100,
  "paymentMethod": "BNB"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "tokens": 125,
    "pricePerToken": 0.8,
    "phase": 1
  }
}
```

**Calculation:** $100 / $0.80 = 125 tokens

---

**Request ($1,000 USD):**

```json
{
  "amount": 1000,
  "paymentMethod": "USDT"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "tokens": 1250,
    "pricePerToken": 0.8,
    "phase": 1
  }
}
```

**Calculation:** $1,000 / $0.80 = 1,250 tokens

**Status:** PASS

---

## Backend Service Architecture

**How presale phases are used:**

1. **`presale.service.ts`** reads from `PresalePhase` table via Prisma
2. **`getCurrentPhase()`** finds the first active phase ordered by `phaseNumber`
3. **`calculateTokens()`** uses the active phase's `pricePerToken` to compute tokens
4. **`createPurchase()`** validates against `minPurchase`, `maxPurchase`, and phase dates
5. **`getPresaleStats()`** aggregates data across all phases

---

## Files Created/Modified

| File | Action | Purpose |
|------|--------|---------|
| `backend/prisma/seed-presale-phases.ts` | Created | Seed script for presale phases |
| `backend/package.json` | Modified | Added `seed:presale` npm script |

---

## Resync Instructions

If you need to reset the presale phases (e.g., after deployment to a new environment):

```bash
cd backend

# 1. Run the seed script
npm run seed:presale

# 2. Verify the data
psql -d pronova -c "SELECT * FROM \"PresalePhase\" ORDER BY \"phaseNumber\";"

# Or via API
curl http://localhost:5000/api/presale/info
```

---

## Consistency Check: Backend vs Smart Contract

| Property | Smart Contract | Backend DB | Match |
|----------|----------------|------------|-------|
| Phase 1 Price | $0.80 (800_000 / 10^6) | $0.80 | Yes |
| Phase 2 Price | $1.00 (1_000_000 / 10^6) | $1.00 | Yes |
| Phase 3 Price | $1.50 (1_500_000 / 10^6) | $1.50 | Yes |
| Phase 1 Supply | 100M tokens | 100M tokens | Yes |
| Phase 2 Supply | 75M tokens | 75M tokens | Yes |
| Phase 3 Supply | 75M tokens | 75M tokens | Yes |
| Min Purchase | $100 | $100 | Yes |
| Max Purchase | $100,000 | $100,000 | Yes |
| Total Phases | 3 | 3 | Yes |

---

## Phase 4.5 Status: COMPLETE

The backend presale logic is now fully functional and synchronized with the BSC Testnet smart contract configuration.

---

## Next Steps

1. User can now perform manual testing on BSC Testnet following the Phase 4 report guide
2. After manual testing approval, proceed to Phase 5 (Mainnet Deployment)

---

*Report generated by Claude Code - Phase 4.5 Presale DB Setup*
