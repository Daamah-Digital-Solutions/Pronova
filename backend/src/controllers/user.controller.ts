import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { hashPassword, comparePassword } from '../utils/password.utils';
import { AppError, asyncHandler } from '../middleware/error.middleware';

export const getProfile = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?.userId;

  if (!userId) {
    throw new AppError('Authentication required', 401);
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      walletAddress: true,
      emailVerified: true,
      kycStatus: true,
      referralCode: true,
      totalInvested: true,
      totalTokens: true,
      createdAt: true,
      referrals: {
        select: {
          id: true,
          email: true,
          totalInvested: true,
          createdAt: true,
        },
      },
    },
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  res.status(200).json({
    success: true,
    data: {
      user,
    },
  });
});

export const updateProfile = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?.userId;
  const { walletAddress } = req.body;

  if (!userId) {
    throw new AppError('Authentication required', 401);
  }

  const updateData: any = {};

  if (walletAddress) {
    // Validate wallet address format
    if (!/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
      throw new AppError('Invalid wallet address format', 400);
    }

    // Check if wallet address is already used by another user
    const existingUser = await prisma.user.findFirst({
      where: {
        walletAddress,
        id: { not: userId },
      },
    });

    if (existingUser) {
      throw new AppError('Wallet address already connected to another account', 400);
    }

    updateData.walletAddress = walletAddress;
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: updateData,
    select: {
      id: true,
      email: true,
      walletAddress: true,
      emailVerified: true,
      kycStatus: true,
      referralCode: true,
    },
  });

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    data: {
      user,
    },
  });
});

export const changePassword = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?.userId;
  const { currentPassword, newPassword } = req.body;

  if (!userId) {
    throw new AppError('Authentication required', 401);
  }

  // Get user with password
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      passwordHash: true,
    },
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Verify current password
  const isCurrentPasswordValid = await comparePassword(currentPassword, user.passwordHash);
  if (!isCurrentPasswordValid) {
    throw new AppError('Current password is incorrect', 400);
  }

  // Hash new password
  const newPasswordHash = await hashPassword(newPassword);

  // Update password
  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash: newPasswordHash },
  });

  res.status(200).json({
    success: true,
    message: 'Password changed successfully',
  });
});

export const connectWallet = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?.userId;
  const { walletAddress, signature, message } = req.body;

  if (!userId) {
    throw new AppError('Authentication required', 401);
  }

  // Validate wallet address
  if (!/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
    throw new AppError('Invalid wallet address format', 400);
  }

  // Check if wallet is already connected to another user
  const existingUser = await prisma.user.findFirst({
    where: {
      walletAddress,
      id: { not: userId },
    },
  });

  if (existingUser) {
    throw new AppError('Wallet already connected to another account', 400);
  }

  // TODO: Verify signature to ensure wallet ownership
  // This would involve verifying the signature against the message and wallet address

  // Update user with wallet address
  const user = await prisma.user.update({
    where: { id: userId },
    data: { walletAddress },
    select: {
      id: true,
      email: true,
      walletAddress: true,
    },
  });

  res.status(200).json({
    success: true,
    message: 'Wallet connected successfully',
    data: {
      user,
    },
  });
});

export const disconnectWallet = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?.userId;

  if (!userId) {
    throw new AppError('Authentication required', 401);
  }

  await prisma.user.update({
    where: { id: userId },
    data: { walletAddress: null },
  });

  res.status(200).json({
    success: true,
    message: 'Wallet disconnected successfully',
  });
});

export const getDashboard = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?.userId;

  if (!userId) {
    throw new AppError('Authentication required', 401);
  }

  // Get user stats
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      totalInvested: true,
      totalTokens: true,
      referralCode: true,
    },
  });

  // Get recent transactions
  const recentTransactions = await prisma.transaction.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 5,
    select: {
      id: true,
      paymentMethod: true,
      amountPaid: true,
      tokensPurchased: true,
      status: true,
      createdAt: true,
    },
  });

  // Get referral stats
  const referralCount = await prisma.user.count({
    where: { referredById: userId },
  });

  const referralRewards = await prisma.referralReward.findMany({
    where: { userId },
    select: {
      tokenAmount: true,
      claimed: true,
    },
  });

  const totalReferralRewards = referralRewards.reduce(
    (sum, reward) => sum + reward.tokenAmount,
    0
  );

  const unclaimedRewards = referralRewards
    .filter(reward => !reward.claimed)
    .reduce((sum, reward) => sum + reward.tokenAmount, 0);

  // Get notifications
  const notifications = await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 5,
    select: {
      id: true,
      type: true,
      subject: true,
      message: true,
      read: true,
      createdAt: true,
    },
  });

  res.status(200).json({
    success: true,
    data: {
      stats: {
        totalInvested: user?.totalInvested || 0,
        totalTokens: user?.totalTokens || 0,
        referralCount,
        totalReferralRewards,
        unclaimedRewards,
        referralCode: user?.referralCode,
      },
      recentTransactions,
      notifications,
    },
  });
});

export const getReferrals = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?.userId;

  if (!userId) {
    throw new AppError('Authentication required', 401);
  }

  const referrals = await prisma.user.findMany({
    where: { referredById: userId },
    select: {
      id: true,
      email: true,
      totalInvested: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  const referralRewards = await prisma.referralReward.findMany({
    where: { userId },
    select: {
      referredEmail: true,
      rewardAmount: true,
      tokenAmount: true,
      claimed: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  res.status(200).json({
    success: true,
    data: {
      referrals,
      rewards: referralRewards,
    },
  });
});