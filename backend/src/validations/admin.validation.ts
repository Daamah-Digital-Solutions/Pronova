import { body, param, query } from 'express-validator';
import { UserRole, KycStatus, TransactionStatus } from '@prisma/client';

export const updateUserRoleValidation = [
  param('userId')
    .isUUID()
    .withMessage('Invalid user ID format'),
  body('role')
    .isIn(Object.values(UserRole))
    .withMessage('Invalid role'),
];

export const suspendUserValidation = [
  param('userId')
    .isUUID()
    .withMessage('Invalid user ID format'),
  body('reason')
    .optional()
    .isLength({ min: 1, max: 500 })
    .withMessage('Reason must be between 1 and 500 characters'),
];

export const updateSystemSettingValidation = [
  param('key')
    .isString()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Key must be between 1 and 100 characters'),
  body('value')
    .notEmpty()
    .withMessage('Value is required'),
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
];

export const updatePresalePhaseValidation = [
  param('phaseNumber')
    .isInt({ min: 1 })
    .withMessage('Phase number must be a positive integer'),
  body('isActive')
    .isBoolean()
    .withMessage('isActive must be a boolean'),
];

export const createPresalePhaseValidation = [
  body('phaseNumber')
    .isInt({ min: 1 })
    .withMessage('Phase number must be a positive integer'),
  body('name')
    .isString()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Name must be between 1 and 100 characters'),
  body('pricePerToken')
    .isFloat({ min: 0.001 })
    .withMessage('Price per token must be a positive number'),
  body('tokenSupply')
    .isFloat({ min: 1 })
    .withMessage('Token supply must be a positive number'),
  body('startDate')
    .isISO8601()
    .withMessage('Start date must be a valid ISO 8601 date'),
  body('endDate')
    .isISO8601()
    .withMessage('End date must be a valid ISO 8601 date')
    .custom((value, { req }) => {
      if (new Date(value) <= new Date(req.body.startDate)) {
        throw new Error('End date must be after start date');
      }
      return true;
    }),
  body('minPurchase')
    .isFloat({ min: 0.01 })
    .withMessage('Minimum purchase must be a positive number'),
  body('maxPurchase')
    .isFloat({ min: 0.01 })
    .withMessage('Maximum purchase must be a positive number')
    .custom((value, { req }) => {
      if (value <= req.body.minPurchase) {
        throw new Error('Maximum purchase must be greater than minimum purchase');
      }
      return true;
    }),
];

export const updatePresalePhaseDetailsValidation = [
  param('phaseNumber')
    .isInt({ min: 1 })
    .withMessage('Phase number must be a positive integer'),
  body('name')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Name must be between 1 and 100 characters'),
  body('pricePerToken')
    .optional()
    .isFloat({ min: 0.001 })
    .withMessage('Price per token must be a positive number'),
  body('tokenSupply')
    .optional()
    .isFloat({ min: 1 })
    .withMessage('Token supply must be a positive number'),
  body('startDate')
    .optional()
    .isISO8601()
    .withMessage('Start date must be a valid ISO 8601 date'),
  body('endDate')
    .optional()
    .isISO8601()
    .withMessage('End date must be a valid ISO 8601 date'),
  body('minPurchase')
    .optional()
    .isFloat({ min: 0.01 })
    .withMessage('Minimum purchase must be a positive number'),
  body('maxPurchase')
    .optional()
    .isFloat({ min: 0.01 })
    .withMessage('Maximum purchase must be a positive number'),
];

export const userFiltersValidation = [
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('offset')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Offset must be a non-negative integer'),
  query('search')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 1 })
    .withMessage('Search term must not be empty'),
  query('kycStatus')
    .optional()
    .isIn(Object.values(KycStatus))
    .withMessage('Invalid KYC status'),
  query('role')
    .optional()
    .isIn(Object.values(UserRole))
    .withMessage('Invalid role'),
];

export const transactionFiltersValidation = [
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('offset')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Offset must be a non-negative integer'),
  query('status')
    .optional()
    .isIn(Object.values(TransactionStatus))
    .withMessage('Invalid transaction status'),
  query('userId')
    .optional()
    .isUUID()
    .withMessage('Invalid user ID format'),
  query('phase')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Phase must be a positive integer'),
];

export const analyticsValidation = [
  query('startDate')
    .optional()
    .isISO8601()
    .withMessage('Start date must be a valid ISO 8601 date'),
  query('endDate')
    .optional()
    .isISO8601()
    .withMessage('End date must be a valid ISO 8601 date'),
];