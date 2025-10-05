# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Pronova is a cryptocurrency presale platform with:
- React frontend with Tailwind CSS, Framer Motion, and Web3 integration
- Node.js/Express/TypeScript backend with Prisma ORM and PostgreSQL
- Smart contracts for token (ERC-20), presale, and vesting
- Multi-currency payment support (ETH, BNB, USDT)
- Referral system and KYC functionality

## Development Commands

### Frontend (Root directory)
```bash
npm start          # Start development server (uses craco)
npm run build      # Build for production
npm test           # Run tests
```

### Backend (backend/ directory)
```bash
npm run dev                 # Start development server with nodemon
npm run build              # Compile TypeScript
npm start                  # Run production server
npm run prisma:generate    # Generate Prisma client
npm run prisma:migrate     # Run database migrations
npm run prisma:studio      # Open Prisma Studio
npm test                   # Run tests
```

### Smart Contracts (backend/contracts/ directory)
```bash
npx hardhat run scripts/deploy-testnet.js --network bscTestnet  # Deploy to testnet
npx hardhat run scripts/deploy-mainnet.js --network bsc        # Deploy to mainnet
```

## Architecture & Key Components

### Frontend Structure
- **Context Providers**: `WalletContext`, `Web3Context`, `ThemeContext`, `LanguageContext` - Manage global application state
- **Services**: `web3Service.js`, `apiService.js`, `websocketService.js` - Handle external integrations
- **Enhanced Components**: Located in `src/components/home/enhanced/` - Feature-rich UI components with animations
- **Wallet Integration**: MetaMask and WalletConnect support through ethers.js and web3.js

### Backend Structure
- **API Routes**: Auth, Presale, Payment, KYC, Admin, User - RESTful endpoints
- **Services**: Blockchain/Web3, Email, WebSocket, Payment processing
- **Middleware**: Authentication (JWT), validation, error handling
- **Database**: PostgreSQL with Prisma ORM, Redis for caching

### Build Configuration
- **Frontend**: Uses CRACO to override CRA webpack config for Web3 polyfills
- **Styling**: Tailwind CSS with custom color scheme (primary/secondary/dark)
- **Bundling**: Handles Node.js polyfills for browser (crypto, buffer, stream, etc.)

## Important Technical Details

### Web3 Integration
- Frontend uses both ethers.js v5 and web3.js for wallet connections
- Backend uses ethers.js v6 for blockchain interactions
- Smart contracts interact with Chainlink price feeds

### State Management
- React Context API for global state (no Redux/MobX)
- Multiple wallet contexts: `WalletContext` and `SimpleWalletContext`
- WebSocket service for real-time updates

### Multi-language Support
- i18next integration for English/Arabic
- RTL support configured
- Language context provider manages locale switching

### Security Features
- JWT authentication with bcrypt password hashing
- Rate limiting with express-rate-limit
- Helmet.js for security headers
- Input validation using express-validator