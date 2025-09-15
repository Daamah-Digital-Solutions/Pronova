import { Request, Response, NextFunction } from 'express';
import { kycService } from '../services/kyc.service';
import { uploadService } from '../services/upload.service';
import { AppError, asyncHandler } from '../middleware/error.middleware';
import { DocumentType } from '@prisma/client';

export const submitKyc = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?.userId;
  const files = req.files as Express.Multer.File[];
  const { personalInfo, documentTypes } = req.body;

  if (!userId) {
    throw new AppError('Authentication required', 401);
  }

  if (!files || files.length === 0) {
    throw new AppError('At least one document is required', 400);
  }

  if (!personalInfo) {
    throw new AppError('Personal information is required', 400);
  }

  if (!documentTypes || documentTypes.length !== files.length) {
    throw new AppError('Document types must match uploaded files', 400);
  }

  // Parse personal info if it's a string
  const parsedPersonalInfo = typeof personalInfo === 'string' 
    ? JSON.parse(personalInfo) 
    : personalInfo;

  // Parse document types if it's a string
  const parsedDocumentTypes = typeof documentTypes === 'string'
    ? JSON.parse(documentTypes)
    : documentTypes;

  // Validate file sizes and types
  const sizeValidation = uploadService.validateFileSize(files);
  if (!sizeValidation.valid) {
    throw new AppError(sizeValidation.errors.join(', '), 400);
  }

  const typeValidation = uploadService.validateFileTypes(files);
  if (!typeValidation.valid) {
    throw new AppError(typeValidation.errors.join(', '), 400);
  }

  // Create document array with URLs
  const documents = files.map((file, index) => ({
    type: parsedDocumentTypes[index] as DocumentType,
    url: uploadService.getFileUrl(file.filename),
  }));

  await kycService.submitKyc({
    userId,
    personalInfo: parsedPersonalInfo,
    documents,
  });

  res.status(201).json({
    success: true,
    message: 'KYC submitted successfully. Your documents are under review.',
    data: {
      documentsUploaded: files.length,
      status: 'PENDING',
    },
  });
});

export const getKycStatus = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?.userId;

  if (!userId) {
    throw new AppError('Authentication required', 401);
  }

  const kycData = await kycService.getKycStatus(userId);

  res.status(200).json({
    success: true,
    data: kycData,
  });
});

export const updateKycStatus = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;
  const { status, reason } = req.body;
  const adminId = req.user?.userId;

  if (!adminId) {
    throw new AppError('Authentication required', 401);
  }

  if (!['APPROVED', 'REJECTED'].includes(status)) {
    throw new AppError('Invalid status. Must be APPROVED or REJECTED', 400);
  }

  if (status === 'APPROVED') {
    await kycService.approveKyc(userId, adminId);
  } else {
    if (!reason) {
      throw new AppError('Reason is required for rejection', 400);
    }
    await kycService.rejectKyc(userId, adminId, reason);
  }

  res.status(200).json({
    success: true,
    message: `KYC ${status.toLowerCase()} successfully`,
  });
});

export const getPendingKyc = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { limit, offset } = req.query;
  const limitNumber = limit ? parseInt(limit as string) : 50;
  const offsetNumber = offset ? parseInt(offset as string) : 0;

  if (limitNumber > 100) {
    throw new AppError('Limit cannot exceed 100', 400);
  }

  const result = await kycService.getPendingKycSubmissions(limitNumber, offsetNumber);

  res.status(200).json({
    success: true,
    data: result,
  });
});

export const getKycStats = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const stats = await kycService.getKycStats();

  res.status(200).json({
    success: true,
    data: stats,
  });
});

export const updateDocumentStatus = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { documentId } = req.params;
  const { status, notes } = req.body;
  const adminId = req.user?.userId;

  if (!adminId) {
    throw new AppError('Authentication required', 401);
  }

  if (!['APPROVED', 'REJECTED'].includes(status)) {
    throw new AppError('Invalid status. Must be APPROVED or REJECTED', 400);
  }

  await kycService.updateDocumentStatus(documentId, status, adminId, notes);

  res.status(200).json({
    success: true,
    message: `Document ${status.toLowerCase()} successfully`,
  });
});

export const deleteKycSubmission = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;
  const adminId = req.user?.userId;

  if (!adminId) {
    throw new AppError('Authentication required', 401);
  }

  await kycService.deleteKycSubmission(userId);

  res.status(200).json({
    success: true,
    message: 'KYC submission deleted successfully',
  });
});