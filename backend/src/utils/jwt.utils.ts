import jwt from 'jsonwebtoken';
import { User } from '@prisma/client';

interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

interface DecodedToken extends TokenPayload {
  iat: number;
  exp: number;
}

export const generateTokens = (user: Partial<User>) => {
  const payload: TokenPayload = {
    userId: user.id!,
    email: user.email!,
    role: user.role!,
  };

  const accessToken = jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRE || '1d',
  });

  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, {
    expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d',
  });

  return {
    accessToken,
    refreshToken,
  };
};

export const verifyAccessToken = (token: string): DecodedToken => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
  } catch (error) {
    throw new Error('Invalid access token');
  }
};

export const verifyRefreshToken = (token: string): DecodedToken => {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as DecodedToken;
  } catch (error) {
    throw new Error('Invalid refresh token');
  }
};

export const generateEmailVerificationToken = (email: string): string => {
  return jwt.sign({ email }, process.env.JWT_SECRET!, {
    expiresIn: '24h',
  });
};

export const verifyEmailToken = (token: string): { email: string } => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as { email: string };
  } catch (error) {
    throw new Error('Invalid or expired email verification token');
  }
};

export const generatePasswordResetToken = (userId: string, email: string): string => {
  return jwt.sign({ userId, email, type: 'password-reset' }, process.env.JWT_SECRET!, {
    expiresIn: '1h',
  });
};

export const verifyPasswordResetToken = (token: string): { userId: string; email: string } => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    if (decoded.type !== 'password-reset') {
      throw new Error('Invalid token type');
    }
    return { userId: decoded.userId, email: decoded.email };
  } catch (error) {
    throw new Error('Invalid or expired password reset token');
  }
};