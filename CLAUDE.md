# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Pronova is a cryptocurrency presale platform with:
- React 18 frontend with Tailwind CSS, Framer Motion, and Web3 integration
- Node.js/Express 5/TypeScript backend with Prisma ORM and PostgreSQL
- Hardhat-based Solidity smart contracts (Token, Presale, Vesting)
- Multi-currency payment support (ETH, BNB, USDT)
- Referral system and KYC functionality
- Real-time WebSocket updates via Socket.io

## Development Commands

### Frontend (Root directory)
```bash
npm start          # Start development server on port 3000 (uses CRACO)
npm run build      # Build for production
npm test           # Run tests
```

### Backend (backend/ directory)
```bash
npm run dev                 # Start development server with nodemon and ts-node
npm run build              # Compile TypeScript to dist/
npm start                  # Run production server from dist/
npm run prisma:generate    # Generate Prisma client after schema changes
npm run prisma:migrate     # Run database migrations
npm run prisma:studio      # Open Prisma Studio GUI
npm run seed:presale       # Seed presale phase data
npm test                   # Run Hardhat contract tests
```

### Smart Contracts (backend/contracts/ directory)
```bash
npx hardhat compile                                                   # Compile all contracts
npx hardhat test                                                      # Run all contract tests
npx hardhat test test/PronovaToken.test.js                           # Run specific test file
npx hardhat run scripts/deploy-testnet.js --network bscTestnet       # Deploy to BSC testnet
npx hardhat run scripts/deploy-testnet-comprehensive.js --network bscTestnet  # Comprehensive testnet deployment
npx hardhat run scripts/verify-deployment.js --network bscTestnet    # Verify deployment
npx hardhat node                                                      # Start local Hardhat node
```

Note: Hardhat configured for BSC Testnet (chainId 97) and BSC Mainnet (chainId 56). Requires PRIVATE_KEY and BSCSCAN_API_KEY in backend/contracts/.env

## Architecture & Key Components

### Frontend Structure (src/)
- **Context Providers** (`context/`): Five contexts manage global state
  - `WalletContext.js` - Primary wallet connection (MetaMask/WalletConnect)
  - `SimpleWalletContext.js` - Simplified wallet state
  - `Web3Context.js` - Web3 provider and contract instances
  - `ThemeContext.js` - Dark/light theme switching
  - `LanguageContext.js` - i18next language switching (EN/AR)

- **Services Layer** (`services/`):
  - `web3Service.js` - Web3 interactions, contract calls
  - `apiService.js` - Axios-based backend API calls
  - `websocketService.js` - Socket.io client for real-time updates

- **Pages** (`pages/`): Route-level components (Home, Presale, Dashboard, Admin, KYC, Profile)

- **Enhanced Components** (`components/home/enhanced/`): Feature-rich UI sections with Framer Motion animations

- **Wallet Integration**:
  - ethers.js v5.7.2 for blockchain interactions
  - wagmi v2.19 + viem v2.38 for modern React Web3 hooks
  - @web3modal for WalletConnect integration
  - MetaMask via window.ethereum

### Backend Structure (backend/src/)
- **API Routes** (`routes/`): RESTful endpoints
  - `auth.routes.ts` - Registration, login, JWT refresh
  - `presale.routes.ts` - Token purchase, phase management
  - `payment.routes.ts` - Multi-currency payments, Stripe webhooks
  - `kyc.routes.ts` - Document upload, verification
  - `admin.routes.ts` - Admin dashboard, user management
  - `user.routes.ts` - Profile, transaction history

- **Services** (`services/`):
  - `blockchain/web3.service.ts` - Ethers.js v6 for blockchain reads/writes
  - `email.service.ts` - Nodemailer email notifications
  - `websocket.service.ts` - Socket.io server for live updates
  - `payment.service.ts`, `presale.service.ts`, `kyc.service.ts`, `admin.service.ts`

- **Middleware** (`middleware/`): JWT auth, validation, error handling

- **Database** (`prisma/schema.prisma`):
  - PostgreSQL with Prisma ORM
  - Models: User, Transaction, ReferralReward, KycDocument, Whitelist, PresalePhase, Notification, SystemSettings
  - Redis (ioredis) for caching and rate limiting

### Smart Contracts (backend/contracts/)
**Contracts** (`contracts/`):
- `PronovaToken.sol` - ERC-20 token with 1B supply
- `PronovaPresale.sol` - Multi-phase presale with Chainlink price feeds
- `PronovaVesting.sol` - Token vesting schedules
- `MockUSDT.sol`, `MockV3Aggregator.sol` - Testing utilities

**Tests** (`test/`): Hardhat test suite
- `PronovaToken.test.js`, `PronovaPresale.test.js`, `PronovaVesting.test.js`, `IntegrationTest.test.js`

**Reference Documentation** (in backend/contracts/):
- `FINAL_AUDIT_REPORT_V2.md` - Security audit findings
- `SECURITY_COMPLIANCE_CHECKLIST.md` - Security best practices
- `DEPLOYMENT_RECOMMENDATION.md` - Deployment guidelines

### Build Configuration

#### Frontend (CRACO Override)
- `craco.config.js` overrides Create React App webpack config
- **Critical**: Provides Node.js polyfills for browser (crypto-browserify, buffer, stream-browserify, etc.)
- ProvidePlugin injects Buffer and process globals

#### Styling
- Tailwind CSS v3 with custom color scheme (primary purple #7C42FF, secondary #DEC7FF, dark #070A29)
- Custom fonts: Readex Pro (sans), Conthrax (headings), Cairo (Arabic)
- PostCSS with autoprefixer

## Critical Integration Points

### Ethers.js Version Conflict (CRITICAL)
- **Frontend**: ethers v5.7.2 (older API)
- **Backend**: ethers v6.15.0 (new API)
- **Breaking changes between versions**: Contract constructor, provider methods, signer APIs
- Do NOT copy ethers code directly between frontend and backend without modification

### State Management Pattern
- React Context API exclusively (no Redux/MobX/Zustand)
- Multiple contexts compose together in App.js
- WebSocket updates trigger context state changes for real-time UI

### Database Workflow
1. Edit `backend/prisma/schema.prisma`
2. Run `npm run prisma:migrate` (creates migration + applies)
3. Run `npm run prisma:generate` (updates Prisma client types)
4. Restart dev server

### Smart Contract Deployment Flow
1. Contracts in `backend/contracts/contracts/*.sol`
2. Compile: `npx hardhat compile` (artifacts → `artifacts/`, `cache/`)
3. Deploy via scripts in `backend/contracts/scripts/`
4. Update frontend/backend .env with deployed addresses
5. Verify on BSCScan using verification scripts

## Network Configuration

### Supported Networks
- **BSC Mainnet**: Chain ID 56, RPC `https://bsc-dataseed.binance.org/`
- **BSC Testnet**: Chain ID 97, RPC `https://data-seed-prebsc-1-s1.binance.org:8545/`
- **Hardhat Local**: Chain ID 31337, RPC `http://127.0.0.1:8545`

### Chainlink Price Feeds
The presale contract uses Chainlink oracles for ETH/USD and BNB/USD price data.

## Environment Setup

### Frontend .env (root directory)
```env
REACT_APP_NETWORK_ID=56                           # BSC Mainnet (97 for testnet)
REACT_APP_TOKEN_ADDRESS=0x...
REACT_APP_PRESALE_ADDRESS=0x...
REACT_APP_VESTING_ADDRESS=0x...
REACT_APP_API_URL=http://localhost:5000
REACT_APP_WS_URL=http://localhost:5000
```

### Backend .env (backend/.env)
```env
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000
DATABASE_URL=postgresql://user:password@localhost:5432/pronova
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-jwt-secret-key
JWT_REFRESH_SECRET=your-refresh-secret-key
ETHEREUM_RPC_URL=https://bsc-dataseed.binance.org/
PRIVATE_KEY=0x...
SENDGRID_API_KEY=...
STRIPE_SECRET_KEY=...
STRIPE_WEBHOOK_SECRET=...
TOKEN_ADDRESS=0x...
PRESALE_ADDRESS=0x...
VESTING_ADDRESS=0x...
```

### Smart Contracts .env (backend/contracts/.env)
```env
BSC_TESTNET_RPC_URL=https://data-seed-prebsc-1-s1.binance.org:8545/
BSC_MAINNET_RPC_URL=https://bsc-dataseed.binance.org/
PRIVATE_KEY=0x...                                 # Must start with 0x
BSCSCAN_API_KEY=...
```

## Troubleshooting

### Frontend build fails with polyfill errors
- Check `craco.config.js` fallbacks
- Clear cache: `rm -rf node_modules/.cache` and rebuild

### Backend "Cannot find module '@prisma/client'"
- Run `npm run prisma:generate` (after `npm run prisma:migrate` if schema changed)
- Restart dev server

### Smart contract deployment fails
- Ensure `PRIVATE_KEY` in `backend/contracts/.env` starts with `0x`
- Verify wallet has funds for testnet/mainnet deployments

### Smart contract tests fail with timeout
- Default Mocha timeout is 100s (hardhat.config.js)
- For local tests, ensure no port conflicts on 8545

### WebSocket not connecting
- Verify backend WebSocket service initialized
- Check CORS configuration allows WebSocket connections

### Database connection failures
- Verify PostgreSQL running and DATABASE_URL format correct
- Test with `npm run prisma:studio`
