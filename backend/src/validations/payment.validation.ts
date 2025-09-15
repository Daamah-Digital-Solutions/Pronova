import { body, param } from 'express-validator';

export const createPaymentIntentValidation = [
  body('amount')
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be a positive number'),
  body('currency')
    .isIn(['usd', 'eur', 'gbp'])
    .withMessage('Invalid currency'),
  body('referralCode')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Invalid referral code'),
];

export const createCheckoutSessionValidation = [
  body('amount')
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be a positive number'),
  body('tokenAmount')
    .isFloat({ min: 0.01 })
    .withMessage('Token amount must be a positive number'),
  body('referralCode')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Invalid referral code'),
];

export const paymentIntentIdValidation = [
  param('paymentIntentId')
    .matches(/^pi_[a-zA-Z0-9]+$/)
    .withMessage('Invalid payment intent ID format'),
];

export const refundPaymentValidation = [
  ...paymentIntentIdValidation,
  body('reason')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage('Reason must be between 1 and 500 characters'),
];