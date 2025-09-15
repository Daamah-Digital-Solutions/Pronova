import { Router } from 'express';
import {
  getDashboard,
  getAllUsers,
  getAllTransactions,
  updateUserRole,
  suspendUser,
  getSystemSettings,
  updateSystemSetting,
  updatePresalePhase,
  createPresalePhase,
  updatePresalePhaseDetails,
  getAnalytics,
} from '../controllers/admin.controller';
import { validate } from '../middleware/validation.middleware';
import { authenticate, authorize } from '../middleware/auth.middleware';
import {
  updateUserRoleValidation,
  suspendUserValidation,
  updateSystemSettingValidation,
  updatePresalePhaseValidation,
  createPresalePhaseValidation,
  updatePresalePhaseDetailsValidation,
  userFiltersValidation,
  transactionFiltersValidation,
  analyticsValidation,
} from '../validations/admin.validation';

const router = Router();

// All routes require admin authentication
router.use(authenticate);
router.use(authorize('ADMIN'));

// Dashboard and overview
router.get('/dashboard', getDashboard);
router.get('/analytics', validate(analyticsValidation), getAnalytics);

// User management
router.get('/users', validate(userFiltersValidation), getAllUsers);
router.put('/users/:userId/role', validate(updateUserRoleValidation), updateUserRole);
router.post('/users/:userId/suspend', validate(suspendUserValidation), suspendUser);

// Transaction management
router.get('/transactions', validate(transactionFiltersValidation), getAllTransactions);

// System settings
router.get('/settings', getSystemSettings);
router.put('/settings/:key', validate(updateSystemSettingValidation), updateSystemSetting);

// Presale management
router.put('/presale/phase/:phaseNumber', validate(updatePresalePhaseValidation), updatePresalePhase);
router.post('/presale/phase', validate(createPresalePhaseValidation), createPresalePhase);
router.patch('/presale/phase/:phaseNumber', validate(updatePresalePhaseDetailsValidation), updatePresalePhaseDetails);

export default router;