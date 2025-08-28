import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { cache } from '../config/redis';
import { hashPassword, comparePassword } from '../utils/password.utils';
import { emailService } from '../services/email.service';
import { 
  generateTokens, 
  generateEmailVerificationToken,
  verifyEmailToken,
  generatePasswordResetToken,
  verifyPasswordResetToken,
  verifyRefreshToken
} from '../utils/jwt.utils';
import { AppError, asyncHandler } from '../middleware/error.middleware';

export const register = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { email, password, referralCode } = req.body;

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new AppError('User already exists with this email', 400);
  }

  // Hash password
  const passwordHash = await hashPassword(password);

  // Check referral code if provided
  let referrerId = null;
  if (referralCode) {
    const referrer = await prisma.user.findUnique({
      where: { referralCode },
    });
    
    if (referrer) {
      referrerId = referrer.id;
    }
  }

  // Create user
  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      referredById: referrerId,
    },
    select: {
      id: true,
      email: true,
      role: true,
      referralCode: true,
    },
  });

  // Generate tokens
  const { accessToken, refreshToken } = generateTokens(user);

  // Store refresh token in Redis
  await cache.set(`refresh_token:${user.id}`, refreshToken, 7 * 24 * 60 * 60); // 7 days

  // Generate email verification token
  const emailToken = generateEmailVerificationToken(user.email);
  
  // Send verification email
  await emailService.sendWelcomeEmail(user.email, user.email, emailToken);

  res.status(201).json({
    success: true,
    message: 'Registration successful. Please check your email to verify your account.',
    data: {
      user: {
        id: user.id,
        email: user.email,
        referralCode: user.referralCode,
      },
      tokens: {
        accessToken,
        refreshToken,
      },
    },
  });
});

export const login = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  // Find user
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new AppError('Invalid credentials', 401);
  }

  // Check password
  const isPasswordValid = await comparePassword(password, user.passwordHash);
  
  if (!isPasswordValid) {
    throw new AppError('Invalid credentials', 401);
  }

  // Generate tokens
  const { accessToken, refreshToken } = generateTokens(user);

  // Store refresh token in Redis
  await cache.set(`refresh_token:${user.id}`, refreshToken, 7 * 24 * 60 * 60);

  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: {
      user: {
        id: user.id,
        email: user.email,
        emailVerified: user.emailVerified,
        kycStatus: user.kycStatus,
        role: user.role,
      },
      tokens: {
        accessToken,
        refreshToken,
      },
    },
  });
});

export const logout = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?.userId;

  if (userId) {
    // Remove refresh token from Redis
    await cache.del(`refresh_token:${userId}`);
  }

  res.status(200).json({
    success: true,
    message: 'Logout successful',
  });
});

export const refreshToken = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    throw new AppError('Refresh token is required', 400);
  }

  // Verify refresh token
  const decoded = verifyRefreshToken(refreshToken);

  // Check if refresh token exists in Redis
  const storedToken = await cache.get(`refresh_token:${decoded.userId}`);
  
  if (!storedToken || storedToken !== refreshToken) {
    throw new AppError('Invalid refresh token', 401);
  }

  // Get user
  const user = await prisma.user.findUnique({
    where: { id: decoded.userId },
    select: {
      id: true,
      email: true,
      role: true,
    },
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Generate new tokens
  const tokens = generateTokens(user);

  // Update refresh token in Redis
  await cache.set(`refresh_token:${user.id}`, tokens.refreshToken, 7 * 24 * 60 * 60);

  res.status(200).json({
    success: true,
    data: {
      tokens,
    },
  });
});

export const verifyEmail = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { token } = req.query;

  if (!token || typeof token !== 'string') {
    throw new AppError('Invalid verification token', 400);
  }

  // Verify token
  const { email } = verifyEmailToken(token);

  // Update user
  const user = await prisma.user.update({
    where: { email },
    data: { emailVerified: true },
  });

  res.status(200).json({
    success: true,
    message: 'Email verified successfully',
  });
});

export const forgotPassword = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;

  // Find user
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    // Don't reveal if user exists
    res.status(200).json({
      success: true,
      message: 'If an account exists with this email, you will receive a password reset link.',
    });
    return;
  }

  // Generate reset token
  const resetToken = generatePasswordResetToken(user.id, user.email);

  // Store token in Redis with 1 hour expiry
  await cache.set(`password_reset:${user.id}`, resetToken, 3600);

  // Send password reset email
  await emailService.sendPasswordResetEmail(user.email, user.email, resetToken);

  res.status(200).json({
    success: true,
    message: 'If an account exists with this email, you will receive a password reset link.',
  });
});

export const resetPassword = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { token, password } = req.body;

  // Verify token
  const { userId, email } = verifyPasswordResetToken(token);

  // Check if token exists in Redis
  const storedToken = await cache.get(`password_reset:${userId}`);
  
  if (!storedToken || storedToken !== token) {
    throw new AppError('Invalid or expired reset token', 400);
  }

  // Hash new password
  const passwordHash = await hashPassword(password);

  // Update user password
  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash },
  });

  // Delete reset token from Redis
  await cache.del(`password_reset:${userId}`);

  res.status(200).json({
    success: true,
    message: 'Password reset successful. You can now login with your new password.',
  });
});