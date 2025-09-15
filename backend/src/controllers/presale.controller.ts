import { Request, Response, NextFunction } from 'express';
import { presaleService } from '../services/presale.service';
import { web3Service } from '../services/blockchain/web3.service';
import { AppError, asyncHandler } from '../middleware/error.middleware';
import { PaymentMethod } from '@prisma/client';

export const getPresaleInfo = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const currentPhase = await presaleService.getCurrentPhase();
  const allPhases = await presaleService.getAllPhases();
  const stats = await presaleService.getPresaleStats();

  res.status(200).json({
    success: true,
    data: {
      currentPhase,
      phases: allPhases,
      stats,
    },
  });
});

export const calculateTokens = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { amount, phaseId } = req.body;

  if (!amount || amount <= 0) {
    throw new AppError('Invalid amount', 400);
  }

  const calculation = await presaleService.calculateTokens(amount, phaseId);

  if (!calculation) {
    throw new AppError('Unable to calculate tokens for this phase', 400);
  }

  res.status(200).json({
    success: true,
    data: calculation,
  });
});

export const purchaseTokens = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { paymentMethod, amount, transactionHash, walletAddress, referralCode } = req.body;
  const userId = req.user?.userId;

  if (!userId) {
    throw new AppError('Authentication required', 401);
  }

  if (!paymentMethod || !amount) {
    throw new AppError('Payment method and amount are required', 400);
  }

  // Validate payment method
  if (!Object.values(PaymentMethod).includes(paymentMethod)) {
    throw new AppError('Invalid payment method', 400);
  }

  // For crypto payments, validate transaction hash
  if ([PaymentMethod.ETH, PaymentMethod.BNB, PaymentMethod.USDT].includes(paymentMethod)) {
    if (!transactionHash) {
      throw new AppError('Transaction hash required for crypto payments', 400);
    }

    if (!web3Service.isValidTransactionHash(transactionHash)) {
      throw new AppError('Invalid transaction hash format', 400);
    }
  }

  // Validate wallet address if provided
  if (walletAddress && !web3Service.isValidAddress(walletAddress)) {
    throw new AppError('Invalid wallet address format', 400);
  }

  const transactionId = await presaleService.createPurchase({
    userId,
    paymentMethod,
    amountPaid: amount,
    transactionHash,
    walletAddress,
    referralCode,
  });

  res.status(201).json({
    success: true,
    message: 'Purchase created successfully',
    data: {
      transactionId,
    },
  });
});

export const verifyPayment = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { transactionId, network } = req.body;
  const userId = req.user?.userId;

  if (!userId) {
    throw new AppError('Authentication required', 401);
  }

  if (!transactionId || !network) {
    throw new AppError('Transaction ID and network are required', 400);
  }

  // Verify the transaction belongs to the user
  const userTransactions = await presaleService.getUserTransactions(userId);
  const transaction = userTransactions.find(tx => tx.id === transactionId);

  if (!transaction) {
    throw new AppError('Transaction not found', 404);
  }

  const isValid = await presaleService.verifyTransaction(transactionId, network);

  res.status(200).json({
    success: true,
    data: {
      verified: isValid,
      transactionId,
    },
  });
});

export const getUserTransactions = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?.userId;

  if (!userId) {
    throw new AppError('Authentication required', 401);
  }

  const transactions = await presaleService.getUserTransactions(userId);

  res.status(200).json({
    success: true,
    data: {
      transactions,
    },
  });
});

export const getUserStats = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?.userId;

  if (!userId) {
    throw new AppError('Authentication required', 401);
  }

  const stats = await presaleService.getUserStats(userId);

  res.status(200).json({
    success: true,
    data: stats,
  });
});

export const getLeaderboard = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { limit } = req.query;
  const limitNumber = limit ? parseInt(limit as string) : 10;

  if (limitNumber > 100) {
    throw new AppError('Limit cannot exceed 100', 400);
  }

  const leaderboard = await presaleService.getLeaderboard(limitNumber);

  res.status(200).json({
    success: true,
    data: {
      leaderboard,
    },
  });
});

export const getCryptoPrices = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const ethPrice = await web3Service.getCachedPrice('eth');
  const bnbPrice = await web3Service.getCachedPrice('bnb');
  const maticPrice = await web3Service.getCachedPrice('matic');

  res.status(200).json({
    success: true,
    data: {
      ETH: ethPrice,
      BNB: bnbPrice,
      MATIC: maticPrice,
      lastUpdated: new Date().toISOString(),
    },
  });
});

export const getNetworkInfo = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { network } = req.params;

  if (!web3Service.getSupportedNetworks().includes(network)) {
    throw new AppError('Unsupported network', 400);
  }

  const gasPrice = await web3Service.getGasPrice(network);
  const blockNumber = await web3Service.getBlockNumber(network);

  res.status(200).json({
    success: true,
    data: {
      network,
      gasPrice: gasPrice?.toString(),
      blockNumber,
      timestamp: new Date().toISOString(),
    },
  });
});