import { Router } from 'express';
import {
  submitKyc,
  getKycStatus,
  updateKycStatus,
  getPendingKyc,
  getKycStats,
  updateDocumentStatus,
  deleteKycSubmission,
} from '../controllers/kyc.controller';
import { validate } from '../middleware/validation.middleware';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { uploadService } from '../services/upload.service';
import {
  submitKycValidation,
  updateKycStatusValidation,
  paginationValidation,
  updateDocumentStatusValidation,
  deleteKycValidation,
} from '../validations/kyc.validation';

const router = Router();

// User routes (require authentication)
router.post('/submit', 
  authenticate, 
  uploadService.getKycUploadMiddleware(),
  validate(submitKycValidation),
  submitKyc
);
router.get('/status', authenticate, getKycStatus);

// Admin routes (require admin authorization)
router.get('/pending', 
  authenticate, 
  authorize('ADMIN'), 
  validate(paginationValidation), 
  getPendingKyc
);
router.get('/stats', authenticate, authorize('ADMIN'), getKycStats);
router.put('/approve/:userId', 
  authenticate, 
  authorize('ADMIN'), 
  validate(updateKycStatusValidation), 
  updateKycStatus
);
router.put('/document/:documentId', 
  authenticate, 
  authorize('ADMIN'), 
  validate(updateDocumentStatusValidation), 
  updateDocumentStatus
);
router.delete('/:userId', 
  authenticate, 
  authorize('ADMIN'), 
  validate(deleteKycValidation), 
  deleteKycSubmission
);

export default router;