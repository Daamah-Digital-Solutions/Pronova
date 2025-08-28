import { body, param, query } from 'express-validator';
import { DocumentType, KycStatus } from '@prisma/client';

export const submitKycValidation = [
  body('personalInfo')
    .custom((value) => {
      try {
        const parsed = typeof value === 'string' ? JSON.parse(value) : value;
        const required = ['firstName', 'lastName', 'dateOfBirth', 'nationality', 'address'];
        const missing = required.filter(field => !parsed[field]);
        
        if (missing.length > 0) {
          throw new Error(`Missing required fields: ${missing.join(', ')}`);
        }

        // Validate address object
        if (typeof parsed.address !== 'object') {
          throw new Error('Address must be an object');
        }

        const addressRequired = ['street', 'city', 'state', 'zipCode', 'country'];
        const missingAddress = addressRequired.filter(field => !parsed.address[field]);
        
        if (missingAddress.length > 0) {
          throw new Error(`Missing address fields: ${missingAddress.join(', ')}`);
        }

        return true;
      } catch (error) {
        throw new Error('Invalid personal information format');
      }
    })
    .withMessage('Valid personal information is required'),
  
  body('documentTypes')
    .custom((value) => {
      try {
        const parsed = typeof value === 'string' ? JSON.parse(value) : value;
        
        if (!Array.isArray(parsed)) {
          throw new Error('Document types must be an array');
        }

        const validTypes = Object.values(DocumentType);
        const invalidTypes = parsed.filter((type: string) => !validTypes.includes(type as DocumentType));
        
        if (invalidTypes.length > 0) {
          throw new Error(`Invalid document types: ${invalidTypes.join(', ')}`);
        }

        return true;
      } catch (error) {
        throw new Error('Invalid document types format');
      }
    })
    .withMessage('Valid document types are required'),
];

export const updateKycStatusValidation = [
  param('userId')
    .isUUID()
    .withMessage('Invalid user ID format'),
  body('status')
    .isIn(['APPROVED', 'REJECTED'])
    .withMessage('Status must be APPROVED or REJECTED'),
  body('reason')
    .if(body('status').equals('REJECTED'))
    .notEmpty()
    .withMessage('Reason is required for rejection')
    .isLength({ min: 10, max: 500 })
    .withMessage('Reason must be between 10 and 500 characters'),
];

export const paginationValidation = [
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('offset')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Offset must be a non-negative integer'),
];

export const updateDocumentStatusValidation = [
  param('documentId')
    .isUUID()
    .withMessage('Invalid document ID format'),
  body('status')
    .isIn(Object.values(KycStatus))
    .withMessage('Invalid status'),
  body('notes')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Notes cannot exceed 500 characters'),
];

export const deleteKycValidation = [
  param('userId')
    .isUUID()
    .withMessage('Invalid user ID format'),
];