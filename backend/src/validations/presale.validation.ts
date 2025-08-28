import { body, param, query } from 'express-validator';
import { PaymentMethod } from '@prisma/client';

export const calculateTokensValidation = [
  body('amount')
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be a positive number'),
  body('phaseId')
    .optional()
    .isInt({ min: 1, max: 10 })
    .withMessage('Phase ID must be a valid integer'),
];

export const purchaseTokensValidation = [
  body('paymentMethod')
    .isIn(Object.values(PaymentMethod))
    .withMessage('Invalid payment method'),
  body('amount')
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be a positive number'),
  body('transactionHash')
    .optional()
    .matches(/^0x[a-fA-F0-9]{64}$/)
    .withMessage('Invalid transaction hash format'),
  body('walletAddress')
    .optional()
    .matches(/^0x[a-fA-F0-9]{40}$/)
    .withMessage('Invalid wallet address format'),
  body('referralCode')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Invalid referral code'),
];

export const verifyPaymentValidation = [
  body('transactionId')
    .isUUID()
    .withMessage('Invalid transaction ID format'),
  body('network')
    .isIn(['ethereum', 'bsc', 'polygon'])
    .withMessage('Invalid network'),
];

export const leaderboardValidation = [
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
];

export const networkInfoValidation = [
  param('network')
    .isIn(['ethereum', 'bsc', 'polygon'])
    .withMessage('Invalid network'),
];