# Pronova Platform - Master Implementation Plan to 100% Functionality

**Created**: November 25, 2025
**Status**: Ready for Implementation
**Estimated Timeline**: 3-4 Weeks
**Goal**: Fully functional, production-ready platform

---

## EXECUTIVE SUMMARY

This plan will take the Pronova platform from **40% functional** to **100% production-ready** in 3-4 weeks of focused development.

### Current Status: 40% Functional
- ✅ Smart contracts: Production-ready (95%)
- 🔴 Backend: Won't compile (30%)
- 🟡 Frontend: UI ready, integration disabled (60%)
- 🔴 Integration: Disconnected (20%)

### Target Status: 100% Functional
- ✅ Smart contracts: Deployed on mainnet
- ✅ Backend: Compiled, tested, deployed
- ✅ Frontend: Full Web3 integration working
- ✅ Integration: All flows working end-to-end

---

## PHASE 1: CRITICAL FIXES (Week 1 - Days 1-7)

**Goal**: Fix all compilation errors and enable core functionality

### Day 1-2: Fix Backend TypeScript Errors (CRITICAL)

#### Issue 1: jwt.utils.ts (Lines 22, 26)
**Error**: `No overload matches this call`

**Current Code**:
```typescript
// backend/src/utils/jwt.utils.ts:22
export const generateAccessToken = (payload: any): string => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '15m'
  });
};
```

**Fix**:
```typescript
export const generateAccessToken = (payload: string | object): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined');
  }
  return jwt.sign(payload, secret, {
    expiresIn: process.env.JWT_EXPIRES_IN || '15m'
  });
};

export const generateRefreshToken = (payload: string | object): string => {
  const secret = process.env.JWT_REFRESH_SECRET;
  if (!secret) {
    throw new Error('JWT_REFRESH_SECRET is not defined');
  }
  return jwt.sign(payload, secret, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d'
  });
};
```

**Verification**: `cd backend && npm run build` should succeed

---

#### Issue 2: payment.service.ts (Line 7)
**Error**: `Type '"2023-10-16"' is not assignable to type '"2025-06-30.basil"'`

**Current Code**:
```typescript
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});
```

**Fix**:
```typescript
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-06-30.basil',
  typescript: true,
});
```

**Additional**: Update package.json
```json
{
  "dependencies": {
    "stripe": "^18.3.0"  // Already correct version
  }
}
```

**Verification**: Check Stripe API changes and test payment flow

---

#### Issue 3: web3.service.ts (Line 121)
**Error**: `Property 'value' does not exist on type 'TransactionReceipt'`

**Current Code**:
```typescript
const receipt = await tx.wait();
const value = receipt.value; // ❌ Error
```

**Fix**:
```typescript
// Ethers v6 syntax
const receipt = await tx.wait();
// Transaction value is on the transaction object, not receipt
const transaction = await provider.getTransaction(receipt.hash);
const value = transaction?.value || 0n;
```

**Verification**: Test with actual transaction on testnet

---

#### Issue 4: email.service.ts (Lines 271, 292)
**Error**: `No value exists in scope for shorthand property 'amount'`

**Current Code**:
```typescript
await sendEmail({
  to: user.email,
  subject: 'Purchase Confirmed',
  templateData: {
    amount,  // ❌ Error: amount not in scope
  }
});
```

**Fix**:
```typescript
// Find the function and ensure amount is defined
async function sendPurchaseConfirmation(user: User, transactionAmount: number) {
  await sendEmail({
    to: user.email,
    subject: 'Purchase Confirmed',
    templateData: {
      amount: transactionAmount,  // ✅ Explicit value
      // ... other fields
    }
  });
}
```

**Verification**: Search for all shorthand property issues and fix

---

#### Issue 5: kyc.service.ts (Lines 139, 187, 294)
**Error**: `'error' is of type 'unknown'` and `Type 'null' not assignable`

**Current Code**:
```typescript
try {
  // ... code
} catch (error) {
  console.error('Error:', error.message); // ❌ Error: unknown type
}

// Line 294
data: null  // ❌ Error: null not assignable
```

**Fix**:
```typescript
// Fix error handling
try {
  // ... code
} catch (error) {
  const errorMessage = error instanceof Error ? error.message : 'Unknown error';
  console.error('Error:', errorMessage);
  throw new AppError(errorMessage, 500);
}

// Fix null assignment
import { Prisma } from '@prisma/client';

// Instead of null, use:
data: Prisma.JsonNull
// or
data: undefined
// or
data: {} as Prisma.InputJsonValue
```

**Verification**: Run `npm run build` and check for remaining errors

---

#### Issue 6: presale.service.ts (Line 223)
**Error**: `'error' is of type 'unknown'`

**Fix**: Same pattern as kyc.service.ts above
```typescript
try {
  // ... code
} catch (error) {
  const err = error instanceof Error ? error : new Error('Unknown error');
  logger.error('Presale error:', err.message);
  throw new AppError(err.message, 500);
}
```

---

#### Day 1-2 Checklist:
- [ ] Fix jwt.utils.ts - JWT signing functions
- [ ] Update payment.service.ts - Stripe API version
- [ ] Fix web3.service.ts - Transaction receipt handling
- [ ] Fix email.service.ts - Property scope errors
- [ ] Fix kyc.service.ts - Error handling and null types
- [ ] Fix presale.service.ts - Error handling
- [ ] Run `cd backend && npm run build` - Must succeed with 0 errors
- [ ] Document any Stripe API changes needed

**Success Criteria**: `npm run build` completes without errors

---

### Day 3-4: Enable Frontend Web3 Integration (CRITICAL)

#### Task 1: Update Contract Addresses in Config

**File**: `src/config/contracts.js`

**Current**:
```javascript
BSC_TESTNET: {
  PRONOVA_TOKEN: '0x...',      // ❌ Placeholder
  PRONOVA_PRESALE: '0x...',    // ❌ Placeholder
  PRONOVA_VESTING: '0x...',    // ❌ Placeholder
  USDT: '0x...',               // ❌ Placeholder
}
```

**Fix**:
```javascript
BSC_TESTNET: {
  PRONOVA_TOKEN: '0xa3896C07c4e7D9771e9E3417b7352fBD14704253',
  PRONOVA_PRESALE: '0x29Ffc342bE650C1ce3e4e102AfB2285FD29f7cF5',
  PRONOVA_VESTING: '0xd8Cce8EE40B8BdE0f220DCa8084Cd7CeF423bD2a',
  USDT: '0xbcA887cE632E642DA28aF66433A70B62925F4a08'
}
```

---

#### Task 2: Enable Web3Service Initialization

**File**: `src/pages/Presale.js:98`

**Current**:
```javascript
useEffect(() => {
    if (account && chainId) {
      // TODO: Re-enable when full Web3 integration is ready
      // web3Service.initialize(provider, signer, chainId);
      // loadPresaleData();
    }
}, [account, chainId]);
```

**Fix**:
```javascript
useEffect(() => {
    if (account && chainId) {
      // Initialize Web3 service with provider and signer
      web3Service.initialize(provider, signer, chainId);
      loadPresaleData();
    }
}, [account, chainId, provider, signer]);

// Add the loadPresaleData function
const loadPresaleData = async () => {
  try {
    setIsLoading(true);

    // Load current phase info
    const phase = await web3Service.getCurrentPhaseInfo();
    setPhaseInfo(phase);

    // Load presale stats
    const stats = await web3Service.getPresaleStats();
    setPresaleStats({
      totalRaised: parseFloat(stats.totalRaised),
      targetRaise: 267500000,
      participantsCount: parseInt(stats.participantsCount),
      currentPhase: phase.phaseNumber
    });

    // If user is connected, load their info
    if (account) {
      const userPurchases = await web3Service.getUserPurchaseInfo(account);
      setUserInfo(userPurchases);
    }
  } catch (error) {
    console.error('Error loading presale data:', error);
  } finally {
    setIsLoading(false);
  }
};
```

---

#### Task 3: Enable Real-Time Data in Components

**File**: `src/components/ui/PresaleStats.js`

**Current**:
```javascript
// TODO: Re-enable when Web3 integration is ready
// const stats = await web3Service.getPresaleStats();

// TODO: Replace with actual Web3 calls when ready
const stats = {
  totalRaised: 45750000,  // Hardcoded
  // ...
};
```

**Fix**:
```javascript
useEffect(() => {
  const loadStats = async () => {
    try {
      if (web3Service.contracts.pronovaPresale) {
        const contractStats = await web3Service.getPresaleStats();
        setStats({
          totalRaised: parseFloat(contractStats.totalRaised),
          tokensSold: parseFloat(contractStats.tokensSold),
          participantsCount: parseInt(contractStats.participantsCount),
          currentPhase: parseInt(contractStats.currentPhase)
        });
      }
    } catch (error) {
      console.error('Error loading stats:', error);
      // Fallback to cached data or show error
    }
  };

  loadStats();

  // Refresh every 30 seconds
  const interval = setInterval(loadStats, 30000);
  return () => clearInterval(interval);
}, []);
```

---

#### Task 4: Enable Token Purchase Functionality

**File**: `src/components/ui/PresalePurchase.js`

**Current**:
```javascript
// TODO: Implement actual network checking when Web3 is ready
```

**Fix**:
```javascript
const handlePurchase = async () => {
  if (!account || !chainId) {
    toast.error('Please connect your wallet first');
    return;
  }

  if (chainId !== 97 && chainId !== 56) {
    toast.error('Please switch to BSC network');
    return;
  }

  setIsProcessing(true);

  try {
    let txHash;

    switch (selectedPayment) {
      case 'ETH':
        txHash = await web3Service.buyWithETH(
          amount,
          referralCode || ethers.constants.AddressZero,
          minTokensExpected
        );
        break;

      case 'BNB':
        txHash = await web3Service.buyWithBNB(
          amount,
          referralCode || ethers.constants.AddressZero,
          minTokensExpected
        );
        break;

      case 'USDT':
        // First approve USDT
        await web3Service.approveUSDT(amount);
        // Then purchase
        txHash = await web3Service.buyWithUSDT(
          amount,
          referralCode || ethers.constants.AddressZero,
          minTokensExpected
        );
        break;

      default:
        throw new Error('Invalid payment method');
    }

    // Record purchase in backend
    await apiService.post('/api/presale/purchase', {
      paymentMethod: selectedPayment,
      amount: amount,
      transactionHash: txHash,
      walletAddress: account,
      referralCode: referralCode
    });

    toast.success('Purchase successful!');

    // Refresh data
    await loadPresaleData();

  } catch (error) {
    console.error('Purchase error:', error);
    toast.error(error.message || 'Purchase failed');
  } finally {
    setIsProcessing(false);
  }
};
```

---

#### Task 5: Enable Price Display

**File**: `src/components/ui/PriceDisplay.js`

**Current**:
```javascript
// TODO: Re-enable when Web3 integration is ready
// TODO: Replace with actual price calls when Web3 is ready
```

**Fix**:
```javascript
useEffect(() => {
  const loadPrices = async () => {
    try {
      // Load from contract
      const phaseInfo = await web3Service.getCurrentPhaseInfo();
      setTokenPrice(phaseInfo.pricePerToken);

      // Load crypto prices from backend
      const cryptoPrices = await apiService.get('/api/presale/prices');
      setCryptoPrices(cryptoPrices.data);

    } catch (error) {
      console.error('Error loading prices:', error);
    }
  };

  loadPrices();

  // Update every 60 seconds
  const interval = setInterval(loadPrices, 60000);
  return () => clearInterval(interval);
}, []);
```

---

#### Day 3-4 Checklist:
- [ ] Update contract addresses in src/config/contracts.js
- [ ] Enable web3Service initialization in Presale.js
- [ ] Implement loadPresaleData function
- [ ] Enable real-time stats in PresaleStats.js
- [ ] Enable price display in PriceDisplay.js
- [ ] Implement purchase functionality in PresalePurchase.js
- [ ] Add error handling and loading states
- [ ] Test wallet connection on BSC testnet
- [ ] Test token purchase with test BNB
- [ ] Verify data loads from contracts

**Success Criteria**: Can connect wallet and see real contract data

---

### Day 5-7: End-to-End Testing & Integration

#### Test Flow 1: User Registration & Login
```bash
# Test commands
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!@#",
    "confirmPassword": "Test123!@#"
  }'
```

**Checklist**:
- [ ] Start backend: `cd backend && npm run dev`
- [ ] Start frontend: `npm start`
- [ ] Test registration form
- [ ] Test login form
- [ ] Verify JWT tokens work
- [ ] Test logout

---

#### Test Flow 2: Token Purchase (Complete Flow)

**Steps**:
1. Connect MetaMask to BSC Testnet
2. Ensure you have test BNB from faucet
3. Navigate to Presale page
4. Enter purchase amount
5. Click Buy with BNB
6. Confirm transaction in MetaMask
7. Wait for confirmation
8. Verify tokens received
9. Check backend recorded transaction

**Checklist**:
- [ ] Frontend shows correct presale phase
- [ ] Frontend shows correct token price
- [ ] Frontend calculates tokens correctly
- [ ] MetaMask prompts for signature
- [ ] Transaction succeeds on blockchain
- [ ] Frontend shows success message
- [ ] Backend records transaction
- [ ] User balance updates
- [ ] WebSocket notification received (if implemented)

---

#### Test Flow 3: Referral System

**Steps**:
1. User A completes purchase
2. User A shares referral code
3. User B uses referral code
4. Verify both receive bonuses

**Checklist**:
- [ ] User can generate/view referral code
- [ ] Referral code input works in purchase form
- [ ] Referrer receives 5% bonus
- [ ] Referee receives bonus (if applicable)
- [ ] Backend tracks referrals
- [ ] Frontend displays referral stats

---

#### Day 5-7 Deliverables:
- [ ] All compilation errors fixed
- [ ] Backend starts without errors
- [ ] Frontend connects to contracts
- [ ] Can complete token purchase on testnet
- [ ] All data loads from blockchain
- [ ] Backend API endpoints tested
- [ ] Integration tests passing
- [ ] Bug list created for minor issues

**Success Criteria**: Complete purchase flow works end-to-end

---

## PHASE 2: INFRASTRUCTURE & TESTING (Week 2 - Days 8-14)

**Goal**: Set up production infrastructure and comprehensive testing

### Day 8-9: Production Infrastructure Setup

#### Task 1: Create Environment Files

**File**: `.env.example` (root - frontend)
```env
# Frontend Environment Variables

# Network Configuration
REACT_APP_NETWORK_ID=56                                    # BSC Mainnet (97 for testnet)
REACT_APP_NETWORK_NAME=BSC Mainnet

# Contract Addresses (update after mainnet deployment)
REACT_APP_TOKEN_ADDRESS=0x...
REACT_APP_PRESALE_ADDRESS=0x...
REACT_APP_VESTING_ADDRESS=0x...

# API Configuration
REACT_APP_API_URL=http://localhost:5000                    # Backend API URL
REACT_APP_WS_URL=http://localhost:5000                     # WebSocket URL

# Feature Flags
REACT_APP_ENABLE_KYC=true
REACT_APP_ENABLE_REFERRALS=true
REACT_APP_ENABLE_TESTNET=false                             # Set to false for production

# Analytics (optional)
REACT_APP_GA_ID=
```

**File**: `backend/.env.example`
```env
# Backend Environment Variables

# Server Configuration
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://yoursite.com

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/pronova_production
REDIS_URL=redis://localhost:6379

# Authentication
JWT_SECRET=your-super-secret-jwt-key-min-256-bits
JWT_REFRESH_SECRET=your-super-secret-refresh-key-min-256-bits
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Blockchain
ETHEREUM_RPC_URL=https://bsc-dataseed.binance.org/
PRIVATE_KEY=0x...                                          # Admin wallet private key (for backend operations)

# Smart Contract Addresses (update after deployment)
TOKEN_ADDRESS=0x...
PRESALE_ADDRESS=0x...
VESTING_ADDRESS=0x...

# External Services
SENDGRID_API_KEY=SG.xxx
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# Chainlink Oracles (BSC Mainnet)
BNB_USD_PRICE_FEED=0x0567F2323251f0Aab15c8dFb1967E4e8A7D42aeE
ETH_USD_PRICE_FEED=0x9ef1B8c0E4F7dc8bF5719Ea496883DC6401d5b2e

# File Upload
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760                                     # 10MB in bytes

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000                                # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100

# Monitoring (optional)
SENTRY_DSN=
LOG_LEVEL=info
```

---

#### Task 2: Create Docker Configuration

**File**: `backend/Dockerfile`
```dockerfile
FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s \
  CMD node -e "require('http').get('http://localhost:5000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start server
CMD ["node", "dist/server.js"]
```

**File**: `Dockerfile` (root - frontend)
```dockerfile
# Build stage
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built files
COPY --from=build /app/build /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

**File**: `nginx.conf`
```nginx
server {
    listen 80;
    server_name _;

    root /usr/share/nginx/html;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

**File**: `docker-compose.yml` (root)
```yaml
version: '3.8'

services:
  # PostgreSQL Database
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: pronova
      POSTGRES_USER: pronova_user
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U pronova_user"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Redis Cache
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Backend API
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://pronova_user:${DB_PASSWORD}@postgres:5432/pronova
      - REDIS_URL=redis://redis:6379
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    env_file:
      - ./backend/.env
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:5000/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  # Frontend
  frontend:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  postgres_data:
  redis_data:
```

---

#### Task 3: Database Setup Script

**File**: `backend/scripts/setup-db.sh`
```bash
#!/bin/bash

# Setup database for production

echo "🔧 Setting up production database..."

# Load environment variables
source .env

# Run Prisma migrations
echo "📦 Running Prisma migrations..."
npx prisma migrate deploy

# Generate Prisma client
echo "⚙️  Generating Prisma client..."
npx prisma generate

# Seed database (if seed script exists)
if [ -f "prisma/seed.ts" ]; then
  echo "🌱 Seeding database..."
  npx prisma db seed
fi

echo "✅ Database setup complete!"
```

---

#### Day 8-9 Checklist:
- [ ] Create .env.example files for frontend and backend
- [ ] Create Dockerfile for backend
- [ ] Create Dockerfile for frontend
- [ ] Create nginx.conf for frontend
- [ ] Create docker-compose.yml
- [ ] Create database setup script
- [ ] Test Docker build locally
- [ ] Document deployment process

---

### Day 10-11: Comprehensive Testing

#### Task 1: Add Backend API Tests

**File**: `backend/src/tests/auth.test.ts`
```typescript
import request from 'supertest';
import app from '../server';

describe('Authentication API', () => {
  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'Test123!@#',
          confirmPassword: 'Test123!@#'
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('accessToken');
    });

    it('should reject duplicate email', async () => {
      // Register first user
      await request(app)
        .post('/api/auth/register')
        .send({
          email: 'duplicate@example.com',
          password: 'Test123!@#',
          confirmPassword: 'Test123!@#'
        });

      // Try to register again with same email
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'duplicate@example.com',
          password: 'Test123!@#',
          confirmPassword: 'Test123!@#'
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login existing user', async () => {
      // Register user first
      await request(app)
        .post('/api/auth/register')
        .send({
          email: 'login@example.com',
          password: 'Test123!@#',
          confirmPassword: 'Test123!@#'
        });

      // Login
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'login@example.com',
          password: 'Test123!@#'
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('accessToken');
    });
  });
});
```

**Install test dependencies**:
```bash
cd backend
npm install --save-dev jest @types/jest ts-jest supertest @types/supertest
```

**Add to package.json**:
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  },
  "jest": {
    "preset": "ts-jest",
    "testEnvironment": "node",
    "testMatch": ["**/*.test.ts"],
    "collectCoverageFrom": [
      "src/**/*.ts",
      "!src/**/*.d.ts"
    ]
  }
}
```

---

#### Task 2: Update Contract Integration Tests

**File**: `backend/contracts/test/IntegrationTest.test.js`

**Fix the 8 failing tests by updating function signature**:

Find instances of:
```javascript
await pronovaToken.connect(admin1).setAllocationWallets(
  treasuryWallet, founders, team, partnerships,
  liquidity, community, strategic, marketing, staking
);
```

Check the actual contract function signature and update accordingly. The error suggests the function signature changed or parameters need to be passed differently.

---

#### Day 10-11 Checklist:
- [ ] Add backend API tests (auth, presale, kyc, admin)
- [ ] Fix 8 failing contract integration tests
- [ ] Run full test suite: `cd backend/contracts && npx hardhat test`
- [ ] Achieve 100% test pass rate
- [ ] Run backend tests: `cd backend && npm test`
- [ ] Test frontend manually (automated tests optional)
- [ ] Create test coverage report
- [ ] Document test results

**Success Criteria**: All tests passing (100%)

---

### Day 12-14: Security & Performance

#### Task 1: Security Audit Checklist

**File**: `SECURITY_CHECKLIST.md`
```markdown
# Security Checklist

## Backend Security
- [ ] All environment variables properly secured
- [ ] JWT secrets are strong (256+ bits)
- [ ] Database credentials not committed
- [ ] Rate limiting configured (100 req/15min)
- [ ] Helmet.js security headers enabled
- [ ] CORS restricted to frontend URL only
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention (Prisma ORM)
- [ ] XSS prevention (input sanitization)
- [ ] File upload restrictions (size, type)
- [ ] Password hashing with bcrypt (cost 12+)
- [ ] HTTPS enforced in production
- [ ] Stripe webhook signature verification

## Frontend Security
- [ ] No sensitive data in localStorage
- [ ] API keys not exposed in code
- [ ] XSS prevention in React components
- [ ] CSP headers configured
- [ ] Web3 transaction confirmations
- [ ] User signature verification
- [ ] Network validation (BSC only)

## Smart Contract Security
- [ ] Audit report approved (✅ Done - A+ grade)
- [ ] Multi-sig wallet configured
- [ ] Private keys in hardware wallets
- [ ] No private keys on servers
- [ ] Emergency pause implemented
- [ ] Access control properly configured

## Infrastructure Security
- [ ] SSL/TLS certificates installed
- [ ] Firewall configured
- [ ] Database backups encrypted
- [ ] Logs properly secured
- [ ] Monitoring and alerting active
```

---

#### Task 2: Performance Optimization

**Backend Optimizations**:
```typescript
// Add caching for frequently accessed data
import { RedisClient } from './config/redis';

const cache = new RedisClient();

// Cache presale stats (refresh every 60 seconds)
export async function getPresaleStats() {
  const cacheKey = 'presale:stats';
  const cached = await cache.get(cacheKey);

  if (cached) {
    return JSON.parse(cached);
  }

  const stats = await calculatePresaleStats();
  await cache.setex(cacheKey, 60, JSON.stringify(stats));

  return stats;
}
```

**Frontend Optimizations**:
```javascript
// Lazy load routes
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Admin = lazy(() => import('./pages/Admin'));

// Use React.memo for expensive components
const PresaleStats = React.memo(({ stats }) => {
  // Component code
});

// Debounce Web3 calls
const debouncedLoadData = useCallback(
  debounce(() => loadPresaleData(), 1000),
  []
);
```

---

#### Day 12-14 Checklist:
- [ ] Complete security audit checklist
- [ ] Update Stripe to latest API version
- [ ] Implement Redis caching for API
- [ ] Add database indexes for performance
- [ ] Optimize frontend bundle size
- [ ] Add lazy loading for routes
- [ ] Implement service worker for PWA
- [ ] Run lighthouse audit
- [ ] Load test backend API
- [ ] Document security measures

**Success Criteria**: Security score 95%+, Load time < 3s

---

## PHASE 3: SMART CONTRACT DEPLOYMENT (Week 3 - Days 15-21)

**Goal**: Deploy contracts to BSC mainnet and integrate with production

### Day 15-16: Pre-Deployment Preparation

#### Task 1: Multi-Signature Wallet Setup

**Use Gnosis Safe** (https://app.safe.global/)

1. **Create 2-of-3 Multi-Sig Wallet**:
   - Admin 1: Primary wallet
   - Admin 2: Secondary wallet
   - Admin 3: Backup wallet

2. **Fund the Wallet**:
   - Deposit ~0.1 BNB for contract deployment
   - Keep additional BNB for operations

3. **Document Wallet**:
   - Multi-sig address: `0x...`
   - Admin addresses: `0x...`, `0x...`, `0x...`
   - Recovery process documented

---

#### Task 2: Deployment Wallet Preparation

**Create Dedicated Deployment Wallet**:
```bash
# Generate new wallet for deployment (use hardware wallet in production)
npx hardhat run scripts/generate-wallet.js
```

**Fund Deployment Wallet**:
- Send 0.05 BNB for gas fees
- Use test deployment to estimate exact cost

---

#### Task 3: Final Contract Verification

**Run full test suite**:
```bash
cd backend/contracts
npx hardhat test

# Expected: 76/76 tests passing
```

**Compile contracts**:
```bash
npx hardhat compile

# Verify no warnings
```

---

#### Day 15-16 Checklist:
- [ ] Create multi-sig wallet (Gnosis Safe)
- [ ] Add all admin addresses to multi-sig
- [ ] Fund multi-sig wallet with BNB
- [ ] Create deployment wallet
- [ ] Fund deployment wallet
- [ ] Run full contract test suite
- [ ] Verify all tests passing
- [ ] Compile contracts successfully
- [ ] Document wallet addresses

---

### Day 17-18: Mainnet Deployment

#### Task 1: Deploy Contracts

**File**: `backend/contracts/scripts/deploy-mainnet.js`
```javascript
const hre = require("hardhat");
const fs = require('fs');

async function main() {
  console.log("🚀 Deploying Pronova contracts to BSC Mainnet...");

  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  // Deploy PronovaToken
  console.log("\n1️⃣ Deploying PronovaToken...");
  const PronovaToken = await hre.ethers.getContractFactory("PronovaToken");
  const pronovaToken = await PronovaToken.deploy();
  await pronovaToken.deployed();
  console.log("✅ PronovaToken deployed to:", pronovaToken.address);

  // Wait for confirmations
  console.log("⏳ Waiting for 5 confirmations...");
  await pronovaToken.deployTransaction.wait(5);

  // Deploy PronovaVesting
  console.log("\n2️⃣ Deploying PronovaVesting...");
  const PronovaVesting = await hre.ethers.getContractFactory("PronovaVesting");
  const pronovaVesting = await PronovaVesting.deploy(
    pronovaToken.address,
    process.env.TREASURY_WALLET
  );
  await pronovaVesting.deployed();
  console.log("✅ PronovaVesting deployed to:", pronovaVesting.address);
  await pronovaVesting.deployTransaction.wait(5);

  // Deploy PronovaPresale
  console.log("\n3️⃣ Deploying PronovaPresale...");
  const PronovaPresale = await hre.ethers.getContractFactory("PronovaPresale");
  const pronovaPresale = await PronovaPresale.deploy(
    pronovaToken.address,
    process.env.USDT_ADDRESS_MAINNET,
    process.env.TREASURY_WALLET,
    process.env.ETH_USD_PRICE_FEED,
    process.env.BNB_USD_PRICE_FEED
  );
  await pronovaPresale.deployed();
  console.log("✅ PronovaPresale deployed to:", pronovaPresale.address);
  await pronovaPresale.deployTransaction.wait(5);

  // Save deployment info
  const deployment = {
    network: "bscMainnet",
    chainId: "56",
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    contracts: {
      PronovaToken: pronovaToken.address,
      PronovaPresale: pronovaPresale.address,
      PronovaVesting: pronovaVesting.address
    },
    transactionHashes: {
      PronovaToken: pronovaToken.deployTransaction.hash,
      PronovaPresale: pronovaPresale.deployTransaction.hash,
      PronovaVesting: pronovaVesting.deployTransaction.hash
    }
  };

  const filename = `deployments/bscMainnet-deployment-${Date.now()}.json`;
  fs.writeFileSync(filename, JSON.stringify(deployment, null, 2));
  console.log("\n📝 Deployment info saved to:", filename);

  console.log("\n✅ All contracts deployed successfully!");
  console.log("\n📋 Deployment Summary:");
  console.log("=====================");
  console.log("PronovaToken:   ", pronovaToken.address);
  console.log("PronovaPresale: ", pronovaPresale.address);
  console.log("PronovaVesting: ", pronovaVesting.address);
  console.log("\n⚠️  NEXT STEPS:");
  console.log("1. Verify contracts on BSCScan");
  console.log("2. Configure multi-sig wallet roles");
  console.log("3. Set allocation wallets");
  console.log("4. Distribute tokens");
  console.log("5. Update frontend/backend config");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

**Execute deployment**:
```bash
cd backend/contracts
npx hardhat run scripts/deploy-mainnet.js --network bscMainnet
```

---

#### Task 2: Verify Contracts on BSCScan

**File**: `backend/contracts/scripts/verify-mainnet.js`
```javascript
const hre = require("hardhat");

async function main() {
  const deployment = require('../deployments/bscMainnet-deployment-XXXXX.json');

  console.log("🔍 Verifying contracts on BSCScan...");

  // Verify PronovaToken
  console.log("\n1️⃣ Verifying PronovaToken...");
  await hre.run("verify:verify", {
    address: deployment.contracts.PronovaToken,
    constructorArguments: [],
  });

  // Verify PronovaVesting
  console.log("\n2️⃣ Verifying PronovaVesting...");
  await hre.run("verify:verify", {
    address: deployment.contracts.PronovaVesting,
    constructorArguments: [
      deployment.contracts.PronovaToken,
      process.env.TREASURY_WALLET
    ],
  });

  // Verify PronovaPresale
  console.log("\n3️⃣ Verifying PronovaPresale...");
  await hre.run("verify:verify", {
    address: deployment.contracts.PronovaPresale,
    constructorArguments: [
      deployment.contracts.PronovaToken,
      process.env.USDT_ADDRESS_MAINNET,
      process.env.TREASURY_WALLET,
      process.env.ETH_USD_PRICE_FEED,
      process.env.BNB_USD_PRICE_FEED
    ],
  });

  console.log("\n✅ All contracts verified!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

**Execute verification**:
```bash
npx hardhat run scripts/verify-mainnet.js --network bscMainnet
```

---

#### Task 3: Configure Multi-Sig Roles

**Using Gnosis Safe UI**:

1. **Grant ADMIN_ROLE to Multi-Sig**:
   - Connect to PronovaToken contract
   - Call `grantRole(ADMIN_ROLE, MULTI_SIG_ADDRESS)`
   - Confirm in multi-sig wallet

2. **Configure Presale Contract**:
   - Grant roles to appropriate addresses
   - Set up admin confirmations

3. **Transfer Ownership**:
   - Transfer DEFAULT_ADMIN_ROLE to multi-sig
   - Renounce role from deployment wallet

---

#### Day 17-18 Checklist:
- [ ] Deploy PronovaToken to BSC mainnet
- [ ] Deploy PronovaVesting to BSC mainnet
- [ ] Deploy PronovaPresale to BSC mainnet
- [ ] Wait for 5+ confirmations per contract
- [ ] Save deployment addresses
- [ ] Verify all contracts on BSCScan
- [ ] Configure multi-sig roles
- [ ] Test multi-sig functionality
- [ ] Document all transaction hashes

**Success Criteria**: All contracts deployed and verified on BSCScan

---

### Day 19-21: Token Distribution & Testing

#### Task 1: Set Allocation Wallets

**Execute via Multi-Sig**:
```javascript
// Prepare transaction for multi-sig
const allocationWallets = {
  presale: "0x...",
  founders: "0x...",
  liquidity: "0x...",
  partnerships: "0x...",
  team: "0x...",
  community: "0x...",
  strategic: "0x...",
  marketing: "0x...",
  staking: "0x..."
};

// This will require 2 admin confirmations
await pronovaToken.setAllocationWallets(
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
```

---

#### Task 2: Distribute Tokens

**Execute via Multi-Sig**:
```javascript
// Requires 2 admin confirmations
await pronovaToken.distributeAllocations();

// Verify distribution
const presaleBalance = await pronovaToken.balanceOf(PRESALE_ADDRESS);
console.log("Presale allocation:", presaleBalance.toString()); // Should be 250M tokens
```

---

#### Task 3: Initialize Vesting

**Execute via Multi-Sig**:
```javascript
// Setup vesting schedules (requires 2 admin confirmations)
await pronovaVesting.setupWhitepaperAllocations();

// Verify vesting
const foundersVesting = await pronovaVesting.getBeneficiaryInfo(FOUNDERS_WALLET);
console.log("Founders vesting:", foundersVesting);
```

---

#### Task 4: Update Frontend/Backend Config

**File**: `src/config/contracts.js`
```javascript
BSC: {
  PRONOVA_TOKEN: '0x...', // ✅ Update with mainnet address
  PRONOVA_PRESALE: '0x...', // ✅ Update with mainnet address
  PRONOVA_VESTING: '0x...', // ✅ Update with mainnet address
  USDT: '0x55d398326f99059fF775485246999027B3197955'
}
```

**File**: `backend/.env`
```env
TOKEN_ADDRESS=0x...         # ✅ Update with mainnet address
PRESALE_ADDRESS=0x...       # ✅ Update with mainnet address
VESTING_ADDRESS=0x...       # ✅ Update with mainnet address
```

**Rebuild and redeploy**:
```bash
# Frontend
npm run build

# Backend
cd backend && npm run build
```

---

#### Day 19-21 Checklist:
- [ ] Set allocation wallets via multi-sig
- [ ] Distribute tokens via multi-sig
- [ ] Initialize vesting schedules via multi-sig
- [ ] Verify all allocations correct
- [ ] Update frontend contract addresses
- [ ] Update backend contract addresses
- [ ] Rebuild frontend
- [ ] Rebuild backend
- [ ] Test on mainnet with small amount
- [ ] Verify all data loads correctly

**Success Criteria**: Tokens distributed, contracts fully configured

---

## PHASE 4: PRODUCTION DEPLOYMENT & LAUNCH (Week 4 - Days 22-28)

**Goal**: Deploy to production and launch platform

### Day 22-23: Production Deployment

#### Task 1: Deploy Database

**Option A: Managed Database (Recommended)**
- AWS RDS PostgreSQL
- DigitalOcean Managed Database
- Google Cloud SQL

**Setup Steps**:
1. Create PostgreSQL instance (15.x)
2. Configure security groups (allow backend IP only)
3. Create database: `pronova_production`
4. Create user with strong password
5. Enable automated backups (daily, 30-day retention)
6. Enable point-in-time recovery
7. Save connection string

**Option B: Self-Hosted**
```bash
# Use Docker Compose
docker-compose up -d postgres redis
```

---

#### Task 2: Deploy Backend

**Option A: Docker Deployment (Recommended)**
```bash
# Build image
docker build -t pronova-backend ./backend

# Run container
docker run -d \
  --name pronova-backend \
  -p 5000:5000 \
  --env-file backend/.env.production \
  --restart unless-stopped \
  pronova-backend
```

**Option B: Traditional Deployment**
```bash
# On production server
git clone [your-repo]
cd backend
npm ci --only=production
npm run build
pm2 start dist/server.js --name pronova-backend
```

---

#### Task 3: Deploy Frontend

**Option A: CDN/Static Hosting (Recommended)**
- Vercel
- Netlify
- AWS S3 + CloudFront

**Vercel Deployment**:
```bash
npm install -g vercel
vercel --prod
```

**Option B: Self-Hosted with Nginx**
```bash
# Build
npm run build

# Copy to server
scp -r build/* user@server:/var/www/pronova

# Configure nginx (already have nginx.conf)
sudo systemctl restart nginx
```

---

#### Task 4: Configure SSL/HTTPS

**Using Let's Encrypt**:
```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d yoursite.com -d www.yoursite.com

# Auto-renewal
sudo certbot renew --dry-run
```

---

#### Day 22-23 Checklist:
- [ ] Deploy PostgreSQL database
- [ ] Deploy Redis cache
- [ ] Run database migrations
- [ ] Deploy backend to production
- [ ] Deploy frontend to production/CDN
- [ ] Configure SSL certificates
- [ ] Configure DNS records
- [ ] Test HTTPS connection
- [ ] Verify health checks
- [ ] Test backend API endpoints

**Success Criteria**: Platform accessible via HTTPS

---

### Day 24-25: Monitoring & Security Setup

#### Task 1: Set Up Monitoring

**Install Sentry for Error Tracking**:

Backend:
```bash
cd backend
npm install @sentry/node
```

```typescript
// backend/src/server.ts
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});

// Add before routes
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

// Add before error handler
app.use(Sentry.Handlers.errorHandler());
```

Frontend:
```bash
npm install @sentry/react
```

```javascript
// src/index.js
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
  integrations: [new Sentry.BrowserTracing()],
  tracesSampleRate: 1.0,
});
```

---

#### Task 2: Set Up Uptime Monitoring

**Using UptimeRobot (Free)**:
1. Create account at https://uptimerobot.com
2. Add monitors:
   - Frontend: https://yoursite.com
   - Backend Health: https://api.yoursite.com/health
   - Check interval: 5 minutes
3. Set up email/SMS alerts
4. Add status page (optional)

---

#### Task 3: Set Up Logging

**Winston Logger** (already in backend):
```typescript
// backend/src/config/logger.ts
import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

export default logger;
```

---

#### Day 24-25 Checklist:
- [ ] Set up Sentry for backend
- [ ] Set up Sentry for frontend
- [ ] Configure UptimeRobot monitoring
- [ ] Set up Winston logging
- [ ] Configure log rotation
- [ ] Set up database backup monitoring
- [ ] Test alert notifications
- [ ] Create monitoring dashboard
- [ ] Document monitoring procedures

**Success Criteria**: All monitoring active and tested

---

### Day 26-27: Soft Launch & Testing

#### Task 1: Soft Launch to Limited Users

**Checklist**:
1. **Whitelist Testing**:
   - Add 10-20 test users to whitelist
   - Provide test accounts with instructions
   - Monitor transactions closely

2. **Test Scenarios**:
   - User registration
   - Wallet connection
   - Small token purchase (0.01 BNB)
   - Referral code usage
   - KYC document upload
   - Admin functions

3. **Monitoring**:
   - Watch error logs in real-time
   - Monitor blockchain transactions
   - Check database for consistency
   - Monitor server resources

---

#### Task 2: Create User Documentation

**File**: `USER_GUIDE.md`
```markdown
# Pronova Presale - User Guide

## How to Participate

### Step 1: Connect Your Wallet
1. Click "Connect Wallet" button
2. Select MetaMask or WalletConnect
3. Approve connection in your wallet

### Step 2: Switch to BSC Network
1. MetaMask will prompt to switch to BSC
2. If not automatic, switch manually:
   - Network Name: BSC Mainnet
   - RPC URL: https://bsc-dataseed.binance.org/
   - Chain ID: 56
   - Symbol: BNB

### Step 3: Purchase Tokens
1. Enter amount in BNB
2. Review token amount received
3. Enter referral code (optional)
4. Click "Buy Tokens"
5. Confirm transaction in wallet
6. Wait for confirmation

### Step 4: Verify Purchase
- View transaction on BSCScan
- Check your wallet for tokens
- See purchase history in dashboard

## FAQ
...
```

---

#### Task 3: Bug Tracking & Fixes

**Create bug tracking system**:
1. Use GitHub Issues
2. Label by severity: Critical, High, Medium, Low
3. Track in project board
4. Fix critical bugs immediately
5. Schedule non-critical fixes

---

#### Day 26-27 Checklist:
- [ ] Whitelist 10-20 test users
- [ ] Send test instructions
- [ ] Monitor test purchases
- [ ] Collect user feedback
- [ ] Fix identified bugs
- [ ] Create user documentation
- [ ] Create FAQ page
- [ ] Test all edge cases
- [ ] Verify referral system
- [ ] Test admin functions

**Success Criteria**: 10+ successful test purchases, no critical bugs

---

### Day 28: Full Public Launch

#### Launch Day Checklist

**Morning (T-12 hours)**:
- [ ] Final code review
- [ ] Run all tests
- [ ] Check smart contract state
- [ ] Verify presale configuration
- [ ] Test purchase flow one more time
- [ ] Prepare social media announcements
- [ ] Prepare emergency procedures
- [ ] Team briefing and role assignment

**Launch (T-0)**:
- [ ] Remove whitelist restriction (if any)
- [ ] Publish social media announcement
- [ ] Monitor system in real-time
- [ ] Have team on standby

**First Hour**:
- [ ] Monitor first purchases
- [ ] Watch error logs
- [ ] Check server load
- [ ] Verify transactions on blockchain
- [ ] Respond to user questions

**First 24 Hours**:
- [ ] Continuous monitoring
- [ ] Regular status updates
- [ ] Fix minor issues
- [ ] Collect metrics
- [ ] User support

---

## POST-LAUNCH (Ongoing)

### Daily Tasks
- Monitor system health
- Check error logs
- Review transactions
- User support
- Social media engagement

### Weekly Tasks
- Review metrics and analytics
- User feedback analysis
- Performance optimization
- Security review
- Backup verification

### Monthly Tasks
- Comprehensive security audit
- Performance report
- User growth analysis
- Feature planning
- Smart contract status review

---

## SUCCESS METRICS

### Technical Metrics
- [ ] Backend uptime: 99.9%+
- [ ] Frontend load time: < 3 seconds
- [ ] API response time: < 500ms
- [ ] Zero critical errors
- [ ] All tests passing

### Business Metrics
- [ ] Successful token purchases
- [ ] User registration growth
- [ ] Referral usage rate
- [ ] KYC completion rate
- [ ] Zero security incidents

### Smart Contract Metrics
- [ ] Correct token allocation
- [ ] Vesting schedules accurate
- [ ] Multi-sig operations working
- [ ] No unauthorized transactions
- [ ] Oracle data accurate

---

## ROLLBACK PROCEDURES

### If Critical Bug Found

**Immediate Actions**:
1. Pause presale smart contract (if needed)
2. Display maintenance message on frontend
3. Stop accepting new purchases
4. Notify users via social media
5. Investigate and fix issue

**Emergency Contacts**:
- Smart Contract Admin 1: [Contact]
- Smart Contract Admin 2: [Contact]
- Backend Developer: [Contact]
- Frontend Developer: [Contact]

**Recovery Steps**:
1. Identify root cause
2. Develop fix
3. Test fix thoroughly
4. Deploy fix
5. Resume operations
6. Post-mortem analysis

---

## APPENDIX

### A. Environment Variables Checklist

**Frontend** (.env.production):
```
✅ REACT_APP_NETWORK_ID=56
✅ REACT_APP_TOKEN_ADDRESS=[mainnet address]
✅ REACT_APP_PRESALE_ADDRESS=[mainnet address]
✅ REACT_APP_VESTING_ADDRESS=[mainnet address]
✅ REACT_APP_API_URL=https://api.yoursite.com
✅ REACT_APP_WS_URL=https://api.yoursite.com
```

**Backend** (.env.production):
```
✅ NODE_ENV=production
✅ PORT=5000
✅ FRONTEND_URL=https://yoursite.com
✅ DATABASE_URL=[production db url]
✅ REDIS_URL=[production redis url]
✅ JWT_SECRET=[strong secret]
✅ JWT_REFRESH_SECRET=[strong secret]
✅ ETHEREUM_RPC_URL=https://bsc-dataseed.binance.org/
✅ TOKEN_ADDRESS=[mainnet address]
✅ PRESALE_ADDRESS=[mainnet address]
✅ VESTING_ADDRESS=[mainnet address]
✅ SENDGRID_API_KEY=[api key]
✅ STRIPE_SECRET_KEY=[live key]
✅ STRIPE_WEBHOOK_SECRET=[webhook secret]
✅ SENTRY_DSN=[sentry dsn]
```

---

### B. Deployment Commands Reference

```bash
# Backend
cd backend
npm run build                    # Build TypeScript
npm start                        # Start production server
pm2 start dist/server.js        # With PM2
docker build -t backend .       # Docker build
docker-compose up -d             # Docker Compose

# Frontend
npm run build                    # Build React app
vercel --prod                    # Deploy to Vercel
netlify deploy --prod            # Deploy to Netlify

# Smart Contracts
cd backend/contracts
npx hardhat compile              # Compile contracts
npx hardhat test                 # Run tests
npx hardhat run scripts/deploy-mainnet.js --network bscMainnet
npx hardhat run scripts/verify-mainnet.js --network bscMainnet

# Database
cd backend
npx prisma migrate deploy        # Run migrations
npx prisma generate              # Generate client
npx prisma studio                # Open GUI
```

---

### C. Testing Commands Reference

```bash
# Backend Tests
cd backend
npm test                         # Run all tests
npm run test:watch              # Watch mode
npm run test:coverage           # With coverage

# Smart Contract Tests
cd backend/contracts
npx hardhat test                # All tests
npx hardhat test --grep "presale"  # Specific tests
npx hardhat coverage            # Coverage report

# Frontend (manual testing)
npm start                       # Development
npm run build                   # Production build
```

---

### D. Monitoring URLs

**Production URLs**:
- Frontend: https://yoursite.com
- Backend API: https://api.yoursite.com
- Health Check: https://api.yoursite.com/health
- BSCScan Token: https://bscscan.com/token/[TOKEN_ADDRESS]
- BSCScan Presale: https://bscscan.com/address/[PRESALE_ADDRESS]

**Monitoring Dashboards**:
- Sentry: https://sentry.io/[your-project]
- UptimeRobot: https://uptimerobot.com
- Database: [Your DB provider dashboard]

---

### E. Support Contacts

**Development Team**:
- Smart Contract Developer: [Contact]
- Backend Developer: [Contact]
- Frontend Developer: [Contact]
- DevOps Engineer: [Contact]

**External Services**:
- Domain Registrar: [Provider]
- Hosting Provider: [Provider]
- Database Provider: [Provider]
- Sentry Support: support@sentry.io
- Stripe Support: [Your support plan]

---

## FINAL NOTES

This plan takes you from 40% functional to 100% production-ready in 3-4 weeks.

**Week 1**: Fix compilation errors, enable Web3 integration
**Week 2**: Set up infrastructure, comprehensive testing
**Week 3**: Deploy smart contracts to mainnet
**Week 4**: Production deployment and launch

**Key Success Factors**:
1. Fix backend TypeScript errors first (blocks everything)
2. Enable Web3 integration next (core functionality)
3. Test thoroughly at each phase
4. Deploy infrastructure before launch
5. Start with soft launch to limited users
6. Monitor closely in first 24-48 hours

**Remember**:
- Smart contracts are already excellent (A+ grade)
- Backend and frontend are well-structured
- Main issues are integration and configuration
- All issues are fixable in the timeline given

**You can do this!** 🚀

---

**Document Version**: 1.0
**Last Updated**: November 25, 2025
**Next Review**: After Week 1 completion
