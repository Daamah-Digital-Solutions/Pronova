import { Request, Response, NextFunction } from 'express';
import { adminService } from '../services/admin.service';
import { AppError, asyncHandler } from '../middleware/error.middleware';
import { UserRole, KycStatus, TransactionStatus } from '@prisma/client';

export const getDashboard = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const stats = await adminService.getDashboardStats();

  res.status(200).json({
    success: true,
    data: stats,
  });
});

export const getAllUsers = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { limit, offset, search, kycStatus, role } = req.query;

  const filters = {
    limit: limit ? parseInt(limit as string) : undefined,
    offset: offset ? parseInt(offset as string) : undefined,
    search: search as string,
    kycStatus: kycStatus as KycStatus,
    role: role as UserRole,
  };

  if (filters.limit && filters.limit > 100) {
    throw new AppError('Limit cannot exceed 100', 400);
  }

  const result = await adminService.getAllUsers(filters);

  res.status(200).json({
    success: true,
    data: result,
  });
});

export const getAllTransactions = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { limit, offset, status, userId, phase } = req.query;

  const filters = {
    limit: limit ? parseInt(limit as string) : undefined,
    offset: offset ? parseInt(offset as string) : undefined,
    status: status as TransactionStatus,
    userId: userId as string,
    phase: phase ? parseInt(phase as string) : undefined,
  };

  if (filters.limit && filters.limit > 100) {
    throw new AppError('Limit cannot exceed 100', 400);
  }

  const result = await adminService.getAllTransactions(filters);

  res.status(200).json({
    success: true,
    data: result,
  });
});

export const updateUserRole = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;
  const { role } = req.body;

  if (!Object.values(UserRole).includes(role)) {
    throw new AppError('Invalid role', 400);
  }

  const user = await adminService.updateUserRole(userId, role);

  res.status(200).json({
    success: true,
    message: 'User role updated successfully',
    data: { user },
  });
});

export const suspendUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;
  const { reason } = req.body;

  await adminService.suspendUser(userId, reason);

  res.status(200).json({
    success: true,
    message: 'User suspended successfully',
  });
});

export const getSystemSettings = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const settings = await adminService.getSystemSettings();

  res.status(200).json({
    success: true,
    data: settings,
  });
});

export const updateSystemSetting = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { key } = req.params;
  const { value, description } = req.body;

  const setting = await adminService.updateSystemSetting(key, value, description);

  res.status(200).json({
    success: true,
    message: 'System setting updated successfully',
    data: setting,
  });
});

export const updatePresalePhase = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { phaseNumber } = req.params;
  const { isActive } = req.body;

  const phase = await adminService.updatePresalePhase(parseInt(phaseNumber), isActive);

  res.status(200).json({
    success: true,
    message: 'Presale phase updated successfully',
    data: phase,
  });
});

export const createPresalePhase = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const {
    phaseNumber,
    name,
    pricePerToken,
    tokenSupply,
    startDate,
    endDate,
    minPurchase,
    maxPurchase,
  } = req.body;

  const phase = await adminService.createPresalePhase({
    phaseNumber,
    name,
    pricePerToken,
    tokenSupply,
    startDate: new Date(startDate),
    endDate: new Date(endDate),
    minPurchase,
    maxPurchase,
  });

  res.status(201).json({
    success: true,
    message: 'Presale phase created successfully',
    data: phase,
  });
});

export const updatePresalePhaseDetails = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { phaseNumber } = req.params;
  const updateData = req.body;

  // Convert date strings to Date objects if present
  if (updateData.startDate) {
    updateData.startDate = new Date(updateData.startDate);
  }
  if (updateData.endDate) {
    updateData.endDate = new Date(updateData.endDate);
  }

  const phase = await adminService.updatePresalePhaseDetails(parseInt(phaseNumber), updateData);

  res.status(200).json({
    success: true,
    message: 'Presale phase details updated successfully',
    data: phase,
  });
});

export const getAnalytics = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { startDate, endDate } = req.query;

  let start: Date | undefined;
  let end: Date | undefined;

  if (startDate) {
    start = new Date(startDate as string);
    if (isNaN(start.getTime())) {
      throw new AppError('Invalid start date format', 400);
    }
  }

  if (endDate) {
    end = new Date(endDate as string);
    if (isNaN(end.getTime())) {
      throw new AppError('Invalid end date format', 400);
    }
  }

  if (start && end && start > end) {
    throw new AppError('Start date cannot be after end date', 400);
  }

  const analytics = await adminService.getAnalytics(start, end);

  res.status(200).json({
    success: true,
    data: analytics,
  });
});