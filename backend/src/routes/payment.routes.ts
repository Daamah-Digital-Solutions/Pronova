import { Router } from 'express';
import {
  createPaymentIntent,
  createCheckoutSession,
  handleWebhook,
  getPaymentStatus,
  refundPayment,
} from '../controllers/payment.controller';
import { validate } from '../middleware/validation.middleware';
import { authenticate, authorize } from '../middleware/auth.middleware';
import {
  createPaymentIntentValidation,
  createCheckoutSessionValidation,
  paymentIntentIdValidation,
  refundPaymentValidation,
} from '../validations/payment.validation';

const router = Router();

// Webhook route (no auth needed, Stripe handles verification)
router.post('/webhook', handleWebhook);

// Protected routes
router.post('/create-intent', authenticate, validate(createPaymentIntentValidation), createPaymentIntent);
router.post('/create-checkout', authenticate, validate(createCheckoutSessionValidation), createCheckoutSession);
router.get('/status/:paymentIntentId', authenticate, validate(paymentIntentIdValidation), getPaymentStatus);

// Admin routes
router.post('/refund/:paymentIntentId', authenticate, authorize('ADMIN'), validate(refundPaymentValidation), refundPayment);

export default router;