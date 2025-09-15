# Pronova Presale Backend - Complete Implementation

A comprehensive backend system for the Pronova cryptocurrency presale platform, featuring user management, KYC verification, payment processing, smart contract integration, and real-time updates.

## 🚀 Features

### Core Functionality
- **User Authentication** - JWT-based auth with refresh tokens
- **Presale Management** - Multi-phase token sale with dynamic pricing
- **Payment Processing** - Stripe integration + crypto payments (ETH/BNB/USDT)
- **KYC/AML Compliance** - Document upload and verification system
- **Smart Contract Integration** - Ethereum-compatible contract deployment
- **Real-time Updates** - WebSocket notifications for live data
- **Email Notifications** - SendGrid integration for automated emails
- **Admin Dashboard** - Complete admin panel with analytics
- **File Upload** - Secure document storage for KYC
- **Referral System** - Built-in referral tracking and rewards

### Security Features
- Rate limiting and DDoS protection
- Input validation and sanitization
- Secure file upload with type checking
- JWT token management with blacklisting
- Password hashing with bcrypt
- CORS and helmet security headers

## 📋 Prerequisites

- **Node.js** (v16 or higher)
- **PostgreSQL** (v12 or higher)
- **Redis** (v6 or higher)
- **SendGrid API Key** (for emails)
- **Stripe Account** (for payments)

## 🛠 Installation

1. **Clone and install dependencies:**
```bash
cd backend
npm install
```

2. **Set up environment variables:**
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. **Set up the database:**
```bash
# Make sure PostgreSQL is running
npx prisma generate
npx prisma migrate dev
npx prisma db seed  # Optional: seed initial data
```

4. **Start Redis:**
```bash
# On macOS/Linux
redis-server

# On Windows (if using WSL)
sudo service redis-server start
```

5. **Start the development server:**
```bash
npm run dev
```

## 📡 API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - Register new user
- `POST /login` - User login
- `POST /logout` - Logout (requires auth)
- `POST /refresh-token` - Refresh access token
- `GET /verify-email?token=xxx` - Verify email
- `POST /forgot-password` - Request password reset
- `POST /reset-password` - Reset password

### User Management (`/api/users`)
- `GET /profile` - Get user profile
- `PUT /profile` - Update user profile
- `POST /change-password` - Change password
- `POST /connect-wallet` - Connect crypto wallet
- `POST /disconnect-wallet` - Disconnect wallet
- `GET /dashboard` - Get dashboard data
- `GET /referrals` - Get referral information

### Presale (`/api/presale`)
- `GET /info` - Get presale information and stats
- `POST /calculate` - Calculate tokens for amount
- `POST /purchase` - Purchase tokens
- `POST /verify-payment` - Verify crypto payment
- `GET /transactions` - Get user transactions
- `GET /stats` - Get user presale statistics
- `GET /leaderboard` - Get top investors
- `GET /prices` - Get current crypto prices
- `GET /network/:network` - Get network information

### Payments (`/api/payments`)
- `POST /create-intent` - Create Stripe payment intent
- `POST /create-checkout` - Create Stripe checkout session
- `POST /webhook` - Stripe webhook handler
- `GET /status/:paymentIntentId` - Get payment status
- `POST /refund/:paymentIntentId` - Refund payment (admin)

### KYC (`/api/kyc`)
- `POST /submit` - Submit KYC documents
- `GET /status` - Get KYC status
- `GET /pending` - Get pending KYC submissions (admin)
- `GET /stats` - Get KYC statistics (admin)
- `PUT /approve/:userId` - Approve/reject KYC (admin)
- `PUT /document/:documentId` - Update document status (admin)
- `DELETE /:userId` - Delete KYC submission (admin)

### Admin (`/api/admin`)
- `GET /dashboard` - Admin dashboard stats
- `GET /analytics` - Analytics data
- `GET /users` - Get all users with filters
- `PUT /users/:userId/role` - Update user role
- `POST /users/:userId/suspend` - Suspend user
- `GET /transactions` - Get all transactions
- `GET /settings` - Get system settings
- `PUT /settings/:key` - Update system setting
- `PUT /presale/phase/:phaseNumber` - Update presale phase
- `POST /presale/phase` - Create new presale phase
- `PATCH /presale/phase/:phaseNumber` - Update phase details

### Utility
- `GET /health` - Server health check
- `GET /uploads/*` - Serve uploaded files

## 🏗 Project Structure

```
backend/
├── contracts/                    # Smart contracts
│   ├── contracts/               # Solidity contracts
│   │   ├── PronovaToken.sol    # ERC20 token contract
│   │   ├── PronovaPresale.sol  # Presale contract
│   │   └── PronovaVesting.sol  # Token vesting contract
│   ├── scripts/                # Deployment scripts
│   └── test/                   # Contract tests
├── src/
│   ├── config/                 # Configuration files
│   │   ├── database.ts         # Prisma database config
│   │   └── redis.ts           # Redis configuration
│   ├── controllers/           # Route controllers
│   │   ├── auth.controller.ts # Authentication logic
│   │   ├── user.controller.ts # User management
│   │   ├── presale.controller.ts # Presale operations
│   │   ├── payment.controller.ts # Payment processing
│   │   ├── kyc.controller.ts  # KYC management
│   │   └── admin.controller.ts # Admin operations
│   ├── middleware/            # Express middleware
│   │   ├── auth.middleware.ts # JWT authentication
│   │   ├── error.middleware.ts # Error handling
│   │   └── validation.middleware.ts # Input validation
│   ├── routes/               # API routes
│   ├── services/             # Business logic
│   │   ├── blockchain/       # Web3 services
│   │   ├── admin.service.ts  # Admin operations
│   │   ├── email.service.ts  # Email handling
│   │   ├── kyc.service.ts    # KYC processing
│   │   ├── payment.service.ts # Payment processing
│   │   ├── presale.service.ts # Presale logic
│   │   ├── upload.service.ts # File uploads
│   │   └── websocket.service.ts # Real-time updates
│   ├── utils/                # Utility functions
│   │   ├── jwt.utils.ts      # JWT token management
│   │   ├── password.utils.ts # Password hashing
│   │   └── seed.ts          # Database seeding
│   ├── validations/          # Input validation schemas
│   └── server.ts            # Main server file
├── prisma/
│   └── schema.prisma        # Database schema
├── uploads/                 # File upload directory
├── hardhat.config.ts       # Hardhat configuration
├── package.json
└── README.md
```

## 🔧 Smart Contracts

The project includes complete smart contract implementation:

### PronovaToken.sol
- ERC20 compliant token with 1B total supply
- Pausable functionality for emergencies
- Token allocation management (presale, team, liquidity, etc.)
- Burnable tokens for deflationary mechanism

### PronovaPresale.sol
- Multi-phase presale with dynamic pricing
- Whitelist functionality
- Multiple payment methods (ETH, BNB, USDT)
- Referral system with rewards
- Vesting and claiming mechanisms

### PronovaVesting.sol
- Linear token vesting schedules
- Cliff periods support
- Revocable/non-revocable options
- Multiple vesting schedules per beneficiary

### Deployment
```bash
# Deploy to local hardhat network
npx hardhat run contracts/scripts/deploy.ts --network localhost

# Deploy to testnet
npx hardhat run contracts/scripts/deploy.ts --network sepolia

# Verify contracts
npx hardhat verify --network sepolia <contract-address>
```

## 🌐 WebSocket Events

### Client to Server
- `subscribe:presale` - Subscribe to presale updates
- `subscribe:admin` - Subscribe to admin updates (admin only)

### Server to Client
- `user:stats` - User-specific statistics
- `presale:stats` - General presale statistics
- `admin:stats` - Admin dashboard statistics
- `transaction:new` - New transaction notification
- `purchase:new` - New purchase announcement
- `kyc:status_changed` - KYC status update
- `presale:phase_changed` - Phase change notification

## 📧 Email Templates

The system includes professional email templates for:
- Welcome and email verification
- Password reset
- KYC approval/rejection
- Purchase confirmations
- Admin notifications

## 🔒 Security Features

- **Rate Limiting**: Prevents API abuse
- **Input Validation**: Comprehensive validation using express-validator
- **File Upload Security**: Type checking and size limits
- **JWT Security**: Secure token management with refresh tokens
- **Password Security**: Bcrypt hashing with salt rounds
- **CORS Protection**: Configurable cross-origin resource sharing
- **Helmet Integration**: Security headers for production

## 📊 Database Schema

Complete Prisma schema with:
- **Users**: Authentication and profile data
- **Transactions**: Purchase records and status tracking
- **KYC Documents**: Verification document management
- **Presale Phases**: Multi-phase sale configuration
- **Referral System**: Tracking and rewards
- **Notifications**: In-app messaging system
- **System Settings**: Configurable platform settings

## 🚀 Deployment

### Environment Variables
Ensure all required environment variables are set:

```bash
# Server
NODE_ENV=production
PORT=5000

# Database
DATABASE_URL="postgresql://..."
REDIS_URL="redis://..."

# Authentication
JWT_SECRET="your-secret"
JWT_REFRESH_SECRET="your-refresh-secret"

# Email
SENDGRID_API_KEY="your-sendgrid-key"
EMAIL_FROM="noreply@pronova.com"

# Payments
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Blockchain
ETHEREUM_RPC_URL="https://mainnet.infura.io/..."
PRIVATE_KEY="your-deployment-private-key"

# Frontend
FRONTEND_URL="https://pronova.com"
```

### Production Deployment
```bash
# Build the application
npm run build

# Start production server
npm start

# Or use PM2 for process management
pm2 start dist/server.js --name "pronova-backend"
```

## 🧪 Testing

```bash
# Run smart contract tests
npx hardhat test

# Run unit tests (when implemented)
npm test

# Test database migrations
npx prisma migrate reset
```

## 📈 Monitoring

The backend includes comprehensive logging and health checks:
- Health endpoint for uptime monitoring
- Structured logging with Morgan
- Error tracking and notifications
- Performance monitoring capabilities

## 🎯 Next Steps

1. **Testing**: Implement comprehensive unit and integration tests
2. **CI/CD**: Set up automated deployment pipeline
3. **Monitoring**: Add performance monitoring (e.g., New Relic, DataDog)
4. **Security Audit**: Conduct thorough security review
5. **Load Testing**: Performance testing for high traffic
6. **Documentation**: API documentation with Swagger
7. **Mobile API**: Optimize endpoints for mobile applications

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**Built with ❤️ for the Pronova community**