# API Keys Setup Guide

This guide will help you obtain all the required API keys to run the Pronova presale platform.

## Required API Keys (Essential)

### 1. Infura API Key (For Blockchain RPC)
**Required for**: Frontend Web3 provider
**Cost**: Free tier available

**Steps**:
1. Go to https://infura.io
2. Sign up for a free account
3. Create a new project
4. Copy the Project ID (API Key)
5. Add to `.env`:
   ```
   REACT_APP_INFURA_KEY=your-api-key-here
   ```

### 2. WalletConnect Project ID
**Required for**: WalletConnect integration
**Cost**: Free

**Steps**:
1. Go to https://cloud.walletconnect.com
2. Sign up for a free account
3. Create a new project
4. Copy the Project ID
5. Add to `.env`:
   ```
   REACT_APP_WALLETCONNECT_PROJECT_ID=your-project-id-here
   ```

### 3. Database (PostgreSQL)
**Required for**: Backend data storage
**Cost**: Free (local) or various cloud options

**Option A - Local PostgreSQL**:
1. Download from https://www.postgresql.org/download/
2. Install and create database named `pronova`
3. Update `backend/.env`:
   ```
   DATABASE_URL=postgresql://postgres:your_password@localhost:5432/pronova
   ```

**Option B - Cloud (Supabase - Free)**:
1. Go to https://supabase.com
2. Create free account and new project
3. Get connection string from Settings > Database
4. Add to `backend/.env`

## Optional API Keys (For Full Features)

### 4. SendGrid API Key (For Emails)
**Required for**: Email notifications, verification emails
**Cost**: Free tier (100 emails/day)

**Steps**:
1. Go to https://sendgrid.com
2. Sign up for free account
3. Navigate to Settings > API Keys
4. Create new API key with "Full Access"
5. Add to `backend/.env`:
   ```
   SENDGRID_API_KEY=SG.your-api-key-here
   EMAIL_FROM=noreply@yourdomain.com
   ```

**Note**: You can skip this for testing - emails will just be logged to console.

### 5. Stripe API Keys (For Fiat Payments)
**Required for**: Credit card payments (optional)
**Cost**: Free test account

**Steps**:
1. Go to https://stripe.com
2. Sign up for account
3. Navigate to Developers > API Keys
4. Copy "Secret key" (starts with `sk_test_`)
5. Add to `backend/.env`:
   ```
   STRIPE_SECRET_KEY=sk_test_your-key-here
   ```

**Note**: You can skip this if only accepting crypto payments.

### 6. BSCScan API Key (For Contract Verification)
**Required for**: Verifying contracts on BSCScan
**Cost**: Free

**Steps**:
1. Go to https://bscscan.com
2. Sign up for account
3. Navigate to My Profile > API Keys
4. Create new API key
5. Add to `backend/contracts/.env`:
   ```
   BSCSCAN_API_KEY=your-api-key-here
   ```

## Testing Wallets & Funds

### Get Test BNB (BSC Testnet)
1. Go to https://testnet.binance.org/faucet-smart
2. Connect your MetaMask wallet
3. Request test BNB (for gas fees)

### Get Test USDT (Mock)
The platform deploys a mock USDT contract on testnet. You can mint test USDT from the contract.

## Quick Start Checklist

For immediate testing (minimum setup):
- [x] Infura API Key
- [x] WalletConnect Project ID
- [x] PostgreSQL Database
- [ ] SendGrid (optional - will log to console)
- [ ] Stripe (optional - skip if no fiat)
- [ ] BSCScan (optional - for verification)

For full production:
- [x] All of the above
- [x] Production database (not localhost)
- [x] Domain email for SendGrid
- [x] Production Stripe account

## Environment Variables Summary

### Frontend (.env)
```
REACT_APP_INFURA_KEY=required
REACT_APP_WALLETCONNECT_PROJECT_ID=required
```

### Backend (backend/.env)
```
DATABASE_URL=required
SENDGRID_API_KEY=optional (for emails)
STRIPE_SECRET_KEY=optional (for fiat)
```

### Contracts (backend/contracts/.env)
```
PRIVATE_KEY=required (your deployer wallet private key)
BSCSCAN_API_KEY=optional (for verification)
```

## Security Warnings

1. **NEVER commit .env files to Git**
2. **NEVER share your PRIVATE_KEY**
3. **Use test keys for development**
4. **Rotate keys if exposed**
5. **Use environment variables in production**

## Next Steps

After setting up API keys:
1. Copy `.env.example` to `.env` in both root and backend directories
2. Fill in your API keys
3. Run `npm install` in root and backend
4. Run `cd backend && npx prisma migrate dev`
5. Start backend: `cd backend && npm run dev`
6. Start frontend: `npm start`

## Troubleshooting

### "Infura rate limit exceeded"
- Free tier has limits. Upgrade or use multiple project IDs

### "SendGrid authentication failed"
- Verify API key starts with "SG."
- Check email domain is verified

### "Database connection failed"
- Check PostgreSQL is running
- Verify DATABASE_URL format
- Check username/password

### "Contract not found"
- Verify you're on BSC Testnet (chain ID 97)
- Check contract addresses are correct
- Ensure you have test BNB for gas

Need help? Check CLAUDE.md or IMPLEMENTATION_PLAN_100_PERCENT.md
