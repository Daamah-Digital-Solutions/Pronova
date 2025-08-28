import { Router } from 'express';
import {
  getProfile,
  updateProfile,
  changePassword,
  connectWallet,
  disconnectWallet,
  getDashboard,
  getReferrals,
} from '../controllers/user.controller';
import { validate } from '../middleware/validation.middleware';
import { authenticate } from '../middleware/auth.middleware';
import {
  updateProfileValidation,
  changePasswordValidation,
  connectWalletValidation,
} from '../validations/user.validation';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.get('/profile', getProfile);
router.put('/profile', validate(updateProfileValidation), updateProfile);
router.post('/change-password', validate(changePasswordValidation), changePassword);
router.post('/connect-wallet', validate(connectWalletValidation), connectWallet);
router.post('/disconnect-wallet', disconnectWallet);
router.get('/dashboard', getDashboard);
router.get('/referrals', getReferrals);

export default router;