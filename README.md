# 🚀 Pronova Token Presale Platform

A complete cryptocurrency presale platform built with React, Solidity, and Node.js.

## 📋 Features

- ✅ **Smart Contracts**: Token (ERC-20), Presale, and Vesting contracts
- ✅ **Modern Frontend**: React with Tailwind CSS and Framer Motion
- ✅ **Wallet Integration**: MetaMask and WalletConnect support
- ✅ **Multi-Currency**: Accept ETH, BNB, and USDT payments
- ✅ **Referral System**: 5% bonus for referrals
- ✅ **Admin Dashboard**: Track presale progress and manage users
- ✅ **Responsive Design**: Works on all devices
- ✅ **Multi-Language**: English and Arabic support

## 🛠️ Tech Stack

### Frontend
- React 18
- Tailwind CSS
- Ethers.js
- Framer Motion
- React Router

### Smart Contracts
- Solidity 0.8.20
- Hardhat
- OpenZeppelin
- Chainlink Price Feeds

### Backend
- Node.js
- Express
- Prisma ORM
- PostgreSQL
- Redis

## 📁 Project Structure

```
pronova-website/
├── src/                    # React frontend source
│   ├── components/         # UI components
│   ├── pages/             # Page components
│   ├── context/           # React contexts
│   └── services/          # API services
├── backend/               # Backend API
│   ├── contracts/         # Smart contracts
│   │   ├── contracts/     # Solidity files
│   │   ├── scripts/       # Deployment scripts
│   │   └── test/          # Contract tests
│   ├── src/               # API source code
│   └── prisma/            # Database schema
├── public/                # Static assets
└── build/                 # Production build
```

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- MetaMask wallet
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/pronova-presale.git
cd pronova-presale
```

2. Install dependencies:
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
```

3. Set up environment variables:
```bash
# Copy example env files
cp .env.example .env
cp backend/.env.example backend/.env
```

4. Run development servers:
```bash
# Terminal 1: Start frontend
npm start

# Terminal 2: Start backend
cd backend
npm run dev
```

## 📝 Smart Contract Deployment

### Deploy to Testnet

1. Configure your `.env` file with deployment wallet
2. Deploy contracts:
```bash
cd backend/contracts
npx hardhat run scripts/deploy-testnet.js --network bscTestnet
```

### Deploy to Mainnet

```bash
npx hardhat run scripts/deploy-mainnet.js --network bsc
```

## 🌐 Environment Variables

### Frontend (.env)
```
REACT_APP_NETWORK_ID=56
REACT_APP_TOKEN_ADDRESS=0x...
REACT_APP_PRESALE_ADDRESS=0x...
```

### Backend (backend/.env)
```
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret
ETHEREUM_RPC_URL=https://...
```

## 📄 Available Scripts

### Frontend
- `npm start` - Run development server
- `npm run build` - Build for production
- `npm test` - Run tests

### Backend
- `npm run dev` - Run development server
- `npm run build` - Build TypeScript
- `npm run deploy:testnet` - Deploy to testnet
- `npm run deploy:mainnet` - Deploy to mainnet

## 🔐 Security

- Smart contracts audited (pending)
- Multi-signature treasury wallet
- Pause functionality for emergencies
- Input validation on all forms
- Rate limiting on API endpoints

## 📊 Token Information

- **Name**: Pronova
- **Symbol**: PRN
- **Total Supply**: 1,000,000,000 PRN
- **Presale Allocation**: 400,000,000 PRN (40%)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

- Website: [pronova.io](https://pronova.io)
- Telegram: [@PronovaOfficial](https://t.me/PronovaOfficial)
- Email: support@pronova.io

## 🙏 Acknowledgments

- OpenZeppelin for secure contract libraries
- Chainlink for price feeds
- The entire crypto community

---

**⚠️ Disclaimer**: This is a presale platform. Cryptocurrency investments carry risk. Always do your own research.