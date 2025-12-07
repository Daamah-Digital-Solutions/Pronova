# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Pronova is a cryptocurrency presale platform with:
- React 18 frontend with Tailwind CSS, Framer Motion, and Web3 integration
- Node.js/Express/TypeScript backend with Prisma ORM and PostgreSQL
- Hardhat-based Solidity smart contracts (Token, Presale, Vesting)
- Multi-currency payment support (ETH, BNB, USDT)
- Referral system and KYC functionality
- Real-time WebSocket updates

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
- **Context Providers** (`context/`): Five main contexts manage global state
  - `WalletContext.js` - Primary wallet connection (MetaMask/WalletConnect)
  - `SimpleWalletContext.js` - Simplified wallet state
  - `Web3Context.js` - Web3 provider and contract instances
  - `ThemeContext.js` - Dark/light theme switching
  - `LanguageContext.js` - i18next language switching (EN/AR)

- **Services Layer** (`services/`):
  - `web3Service.js` - Web3 interactions, contract calls
  - `apiService.js` - Axios-based backend API calls
  - `websocketService.js` - Socket.io client for real-time updates

- **Pages** (`pages/`): Route-level components
  - Home, Presale, Dashboard, Admin, KYC, Profile pages

- **Enhanced Components** (`components/home/enhanced/`):
  - Feature-rich UI sections with Framer Motion animations
  - Examples: EnhancedHeroSection, EnhancedPresaleSection, EnhancedTokenomicsSection

- **Hooks** (`hooks/`): Custom React hooks for reusable logic

- **Wallet Integration**:
  - Dual library support: ethers.js v5 AND web3.js v1.9
  - Additional library: wagmi v2.19 with viem v2.38 (modern Web3 React hooks)
  - MetaMask via window.ethereum
  - WalletConnect via @web3modal/react and @web3modal/wagmi

### Backend Structure (backend/src/)
- **API Routes** (`routes/`): RESTful endpoints organized by domain
  - `auth.routes.ts` - Registration, login, JWT refresh
  - `presale.routes.ts` - Token purchase, phase management
  - `payment.routes.ts` - Multi-currency payments, Stripe webhooks
  - `kyc.routes.ts` - Document upload, verification
  - `admin.routes.ts` - Admin dashboard, user management
  - `user.routes.ts` - Profile, transaction history

- **Controllers** (`controllers/`): Request handlers for each route domain
  - Business logic delegation to services
  - Request/response formatting

- **Services** (`services/`):
  - `blockchain/web3.service.ts` - Ethers.js v6 for blockchain reads/writes
  - `email.service.ts` - SendGrid email notifications
  - `websocket.service.ts` - Socket.io server for live updates
  - `payment.service.ts` - Payment processing logic
  - `presale.service.ts` - Presale business logic
  - `kyc.service.ts` - KYC verification workflows
  - `admin.service.ts` - Admin operations
  - `upload.service.ts` - File upload handling (multer)

- **Middleware** (`middleware/`):
  - `auth.middleware.ts` - JWT token verification
  - `validation.middleware.ts` - Express-validator integration
  - `error.middleware.ts` - Global error handler

- **Validations** (`validations/`): Express-validator schemas for request validation

- **Models** (`models/`): TypeScript interfaces and types

- **Config** (`config/`): Configuration files (database, Redis, email, etc.)

- **Utils** (`utils/`): Helper functions and utilities

- **Database** (`prisma/schema.prisma`):
  - PostgreSQL with Prisma ORM
  - Models: User, Transaction, ReferralReward, KycDocument, Whitelist, PresalePhase, Notification, SystemSettings
  - Enums: KycStatus, TransactionStatus, PaymentMethod, DocumentType, UserRole
  - Redis (ioredis) for caching and rate limiting

### Smart Contracts (backend/contracts/)
**Contracts** (`contracts/`):
- `PronovaToken.sol` - ERC-20 token with 1B supply
- `PronovaPresale.sol` - Multi-phase presale with Chainlink price feeds
- `PronovaVesting.sol` - Token vesting schedules
- `MockUSDT.sol`, `MockV3Aggregator.sol` - Testing utilities

**Tests** (`test/`): Comprehensive test suite with Hardhat
- `PronovaToken.test.js` - Token functionality tests
- `PronovaPresale.test.js` - Presale logic tests
- `PronovaVesting.test.js` - Vesting schedule tests
- `IntegrationTest.test.js` - End-to-end integration tests

**Documentation** (important reference files):
- `PRONOVA_SMART_CONTRACTS_WHITEPAPER.md` - Technical specifications
- `FINAL_AUDIT_REPORT_V2.md` - Security audit findings
- `SECURITY_COMPLIANCE_CHECKLIST.md` - Security best practices
- `TEST_COVERAGE_REPORT.md` - Test coverage analysis
- `DEPLOYMENT_RECOMMENDATION.md` - Deployment guidelines

### Build Configuration

#### Frontend (CRACO Override)
- `craco.config.js` overrides Create React App webpack config
- **Critical**: Provides Node.js polyfills for browser (crypto-browserify, buffer, stream-browserify, etc.)
- Webpack fallbacks required for web3.js/ethers.js compatibility
- ProvidePlugin injects Buffer and process globals
- Ignores source map warnings from node_modules

#### Styling
- Tailwind CSS v3 (`tailwind.config.js`)
- PostCSS with autoprefixer (`postcss.config.js`)
- Custom color scheme: primary/secondary/dark variables

#### Backend TypeScript
- `tsconfig.json`: ES2020 target, CommonJS modules, strict mode
- Compiles src/ → dist/
- Prisma client generation: `@prisma/client` must be regenerated after schema changes

## Critical Integration Points

### Ethers.js Version Conflict (CRITICAL)
- **Frontend**: ethers v5.7.2 (older API)
- **Backend**: ethers v6.15.0 (new API)
- **Breaking changes between versions**: Contract constructor, provider methods, signer APIs
- When sharing code between frontend/backend, you MUST account for these API differences
- Do NOT copy ethers code directly between frontend and backend without modification

### Web3 Multi-Library Usage (CRITICAL)
- Frontend uses THREE Web3 libraries simultaneously:
  1. **ethers.js v5** - Legacy wallet connections
  2. **web3.js v1.9** - Alternative wallet provider support
  3. **wagmi v2.19 + viem v2.38** - Modern React hooks for Web3
- Reason: Comprehensive wallet compatibility + modern hooks API
- Be careful not to mix provider instances between libraries

### State Management Pattern
- React Context API exclusively (no Redux/MobX/Zustand)
- Multiple contexts compose together in App.js
- WebSocket updates trigger context state changes for real-time UI

### Database Workflow
1. Edit `backend/prisma/schema.prisma`
2. Run `npm run prisma:migrate` (creates migration + applies)
3. Run `npm run prisma:generate` (updates Prisma client types)
4. Restart `npm run dev` (ts-node picks up new types)

### Smart Contract Deployment Flow
1. Contracts in `backend/contracts/contracts/*.sol`
2. Compile with Hardhat (artifacts → `artifacts/`, `cache/`)
3. Deploy via scripts in `backend/contracts/scripts/`
4. Update frontend/backend .env with deployed addresses
5. Verify on BSCScan (deployment verification scripts available)

## Network Configuration

### Supported Networks
The platform is configured for Binance Smart Chain:

- **BSC Mainnet**
  - Chain ID: 56
  - RPC: `https://bsc-dataseed.binance.org/`
  - Explorer: `https://bscscan.com`

- **BSC Testnet**
  - Chain ID: 97
  - RPC: `https://data-seed-prebsc-1-s1.binance.org:8545/`
  - Explorer: `https://testnet.bscscan.com`

- **Hardhat Local**
  - Chain ID: 31337
  - RPC: `http://127.0.0.1:8545`
  - For development and testing

### Chainlink Price Feeds
The presale contract uses Chainlink oracles for real-time price data:
- ETH/USD price feed
- BNB/USD price feed
- Configurable oracle addresses per network

## Security Considerations

- JWT authentication with bcrypt password hashing (bcryptjs)
- Rate limiting: 100 requests per 15 minutes per IP (express-rate-limit)
- Helmet.js for security headers (CSP, XSS protection)
- CORS restricted to FRONTEND_URL environment variable
- Input validation using express-validator on all routes
- Stripe webhook raw body parser (must come before express.json())
- File uploads limited to 10mb
- Smart contracts use OpenZeppelin v5.4.0 audited libraries
- Contracts include pausable functionality for emergency stops

## Environment Setup

### Frontend .env (root directory)
```env
REACT_APP_NETWORK_ID=56                           # BSC Mainnet (97 for testnet)
REACT_APP_TOKEN_ADDRESS=0x...                     # Deployed PronovaToken address
REACT_APP_PRESALE_ADDRESS=0x...                   # Deployed PronovaPresale address
REACT_APP_VESTING_ADDRESS=0x...                   # Deployed PronovaVesting address
REACT_APP_API_URL=http://localhost:5000           # Backend API URL
REACT_APP_WS_URL=http://localhost:5000            # WebSocket URL
```

### Backend .env (backend/.env)
```env
# Server
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/pronova
REDIS_URL=redis://localhost:6379

# Authentication
JWT_SECRET=your-jwt-secret-key
JWT_REFRESH_SECRET=your-refresh-secret-key

# Blockchain
ETHEREUM_RPC_URL=https://bsc-dataseed.binance.org/
PRIVATE_KEY=0x...                                 # Deployer wallet private key

# External Services
SENDGRID_API_KEY=...                              # Email service
STRIPE_SECRET_KEY=...                             # Payment processing
STRIPE_WEBHOOK_SECRET=...                         # Stripe webhook verification

# Smart Contracts (update after deployment)
TOKEN_ADDRESS=0x...
PRESALE_ADDRESS=0x...
VESTING_ADDRESS=0x...
```

### Smart Contracts .env (backend/contracts/.env)
```env
# Network Configuration
BSC_TESTNET_RPC_URL=https://data-seed-prebsc-1-s1.binance.org:8545/
BSC_MAINNET_RPC_URL=https://bsc-dataseed.binance.org/

# Deployment Account
PRIVATE_KEY=0x...                                 # Must start with 0x, no 0x prefix will fail

# Verification
BSCSCAN_API_KEY=...                               # For contract verification on BSCScan

# Optional
COINMARKETCAP_API_KEY=...                         # For gas reporting
REPORT_GAS=true                                   # Enable gas cost reporting in tests
```

## Troubleshooting

### Frontend build fails with "Can't resolve 'crypto'" or similar polyfill errors
- CRACO polyfills may be misconfigured. Check `craco.config.js` fallbacks
- Ensure all polyfill packages installed: `buffer`, `crypto-browserify`, `stream-browserify`, etc.
- Clear cache: `rm -rf node_modules/.cache` and rebuild

### Backend "Cannot find module '@prisma/client'"
- Run `npm run prisma:generate` to regenerate Prisma client
- If schema changed, run `npm run prisma:migrate` first, then generate
- Restart dev server after generation

### Smart contract deployment fails with "Private key not found"
- Ensure `PRIVATE_KEY` in `backend/contracts/.env` starts with `0x`
- Check hardhat.config.js line 5 logs to verify key is loaded
- Private key must be from a funded wallet for testnet/mainnet deployments

### Smart contract tests fail with timeout errors
- Default Mocha timeout is 100s (configured in hardhat.config.js:59)
- Check RPC connection if deploying to network
- For local tests, ensure no port conflicts on 8545

### WebSocket not connecting
- Verify backend WebSocket service initialized (check server.ts logs)
- Ensure frontend websocketService.js points to correct backend URL
- Check CORS configuration allows WebSocket connections

### TypeScript compilation errors in backend
- Run `npm run build` to see full error output
- Ensure all types are installed: `npm install --save-dev @types/node @types/express` etc.
- Check tsconfig.json compilerOptions match your TypeScript version

### Database connection failures
- Verify PostgreSQL is running: `psql -U postgres`
- Check DATABASE_URL format: `postgresql://user:password@host:port/database`
- Run `npm run prisma:studio` to test connection with GUI