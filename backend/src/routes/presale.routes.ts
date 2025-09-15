import { Router } from 'express';
import {
  getPresaleInfo,
  calculateTokens,
  purchaseTokens,
  verifyPayment,
  getUserTransactions,
  getUserStats,
  getLeaderboard,
  getCryptoPrices,
  getNetworkInfo,
} from '../controllers/presale.controller';
import { validate } from '../middleware/validation.middleware';
import { authenticate, optionalAuth } from '../middleware/auth.middleware';
import {
  calculateTokensValidation,
  purchaseTokensValidation,
  verifyPaymentValidation,
  leaderboardValidation,
  networkInfoValidation,
} from '../validations/presale.validation';

const router = Router();

// Public routes
router.get('/info', getPresaleInfo);
router.post('/calculate', validate(calculateTokensValidation), calculateTokens);
router.get('/leaderboard', validate(leaderboardValidation), getLeaderboard);
router.get('/prices', getCryptoPrices);
router.get('/network/:network', validate(networkInfoValidation), getNetworkInfo);

// Protected routes
router.post('/purchase', authenticate, validate(purchaseTokensValidation), purchaseTokens);
router.post('/verify-payment', authenticate, validate(verifyPaymentValidation), verifyPayment);
router.get('/transactions', authenticate, getUserTransactions);
router.get('/stats', authenticate, getUserStats);

export default router;