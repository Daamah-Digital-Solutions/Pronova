import { prisma } from '../config/database';
import { web3Service } from './blockchain/web3.service';
import { emailService } from './email.service';
import { getWebSocketService } from './websocket.service';
import { PaymentMethod, TransactionStatus } from '@prisma/client';

interface PurchaseRequest {
  userId: string;
  paymentMethod: PaymentMethod;
  amountPaid: number;
  transactionHash?: string;
  walletAddress?: string;
  referralCode?: string;
}

interface PhaseInfo {
  id: number;
  name: string;
  pricePerToken: number;
  tokenSupply: number;
  tokensSold: number;
  startDate: Date;
  endDate: Date;
  minPurchase: number;
  maxPurchase: number;
  isActive: boolean;
}

export class PresaleService {
  async getCurrentPhase(): Promise<PhaseInfo | null> {
    const currentPhase = await prisma.presalePhase.findFirst({
      where: { isActive: true },
      orderBy: { phaseNumber: 'asc' },
    });

    if (!currentPhase) return null;

    return {
      id: currentPhase.phaseNumber,
      name: currentPhase.name,
      pricePerToken: currentPhase.pricePerToken,
      tokenSupply: currentPhase.tokenSupply,
      tokensSold: currentPhase.tokensSold,
      startDate: currentPhase.startDate,
      endDate: currentPhase.endDate,
      minPurchase: currentPhase.minPurchase,
      maxPurchase: currentPhase.maxPurchase,
      isActive: currentPhase.isActive,
    };
  }

  async getAllPhases(): Promise<PhaseInfo[]> {
    const phases = await prisma.presalePhase.findMany({
      orderBy: { phaseNumber: 'asc' },
    });

    return phases.map(phase => ({
      id: phase.phaseNumber,
      name: phase.name,
      pricePerToken: phase.pricePerToken,
      tokenSupply: phase.tokenSupply,
      tokensSold: phase.tokensSold,
      startDate: phase.startDate,
      endDate: phase.endDate,
      minPurchase: phase.minPurchase,
      maxPurchase: phase.maxPurchase,
      isActive: phase.isActive,
    }));
  }

  async calculateTokens(usdAmount: number, phaseId?: number): Promise<{
    tokens: number;
    pricePerToken: number;
    phase: number;
  } | null> {
    let phase;
    
    if (phaseId) {
      phase = await prisma.presalePhase.findUnique({
        where: { phaseNumber: phaseId },
      });
    } else {
      phase = await prisma.presalePhase.findFirst({
        where: { isActive: true },
      });
    }

    if (!phase) return null;

    const tokens = usdAmount / phase.pricePerToken;
    
    return {
      tokens,
      pricePerToken: phase.pricePerToken,
      phase: phase.phaseNumber,
    };
  }

  async createPurchase(request: PurchaseRequest): Promise<string> {
    const { userId, paymentMethod, amountPaid, transactionHash, referralCode } = request;

    // Get current phase
    const currentPhase = await this.getCurrentPhase();
    if (!currentPhase || !currentPhase.isActive) {
      throw new Error('No active presale phase');
    }

    // Check if within time bounds
    const now = new Date();
    if (now < currentPhase.startDate || now > currentPhase.endDate) {
      throw new Error('Presale phase not active');
    }

    // Check minimum and maximum purchase limits
    if (amountPaid < currentPhase.minPurchase) {
      throw new Error(`Minimum purchase is $${currentPhase.minPurchase}`);
    }

    if (amountPaid > currentPhase.maxPurchase) {
      throw new Error(`Maximum purchase is $${currentPhase.maxPurchase}`);
    }

    // Calculate tokens
    const calculation = await this.calculateTokens(amountPaid, currentPhase.id);
    if (!calculation) {
      throw new Error('Unable to calculate tokens');
    }

    // Check if enough tokens available
    if (currentPhase.tokensSold + calculation.tokens > currentPhase.tokenSupply) {
      throw new Error('Not enough tokens available in this phase');
    }

    // Handle referral
    let referrerId = null;
    if (referralCode) {
      const referrer = await prisma.user.findUnique({
        where: { referralCode },
        select: { id: true },
      });
      if (referrer) {
        referrerId = referrer.id;
      }
    }

    // Create transaction
    const transaction = await prisma.transaction.create({
      data: {
        userId,
        transactionHash,
        paymentMethod,
        amountPaid,
        tokensPurchased: calculation.tokens,
        pricePerToken: calculation.pricePerToken,
        phase: calculation.phase,
        status: transactionHash ? TransactionStatus.PENDING : TransactionStatus.CONFIRMED,
      },
    });

    // Update user totals
    await prisma.user.update({
      where: { id: userId },
      data: {
        totalInvested: { increment: amountPaid },
        totalTokens: { increment: calculation.tokens },
      },
    });

    // Update phase tokens sold
    await prisma.presalePhase.update({
      where: { phaseNumber: currentPhase.id },
      data: {
        tokensSold: { increment: calculation.tokens },
      },
    });

    // Create referral reward if applicable
    if (referrerId) {
      const referralReward = calculation.tokens * 0.05; // 5% referral bonus
      
      await prisma.referralReward.create({
        data: {
          userId: referrerId,
          referredEmail: request.userId, // This should be the referred user's email
          transactionId: transaction.id,
          commissionRate: 0.05,
          rewardAmount: amountPaid * 0.05,
          tokenAmount: referralReward,
        },
      });
    }

    // Send purchase confirmation email if transaction is confirmed
    if (!transactionHash || (transactionHash && calculation)) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { email: true },
      });

      if (user) {
        await emailService.sendPurchaseConfirmationEmail(
          user.email,
          user.email,
          {
            amount: amountPaid,
            tokens: calculation.tokens,
            paymentMethod,
            transactionId: transaction.id,
          }
        );

        // Send WebSocket notification
        try {
          const wsService = getWebSocketService();
          wsService.notifyNewPurchase({
            id: transaction.id,
            userEmail: user.email,
            amountPaid,
            tokensPurchased: calculation.tokens,
            paymentMethod,
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          console.log('WebSocket service not available:', errorMessage);
        }
      }
    }

    return transaction.id;
  }

  async verifyTransaction(transactionId: string, network: string): Promise<boolean> {
    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
    });

    if (!transaction || !transaction.transactionHash) {
      return false;
    }

    const isValid = await web3Service.validateTransaction(
      network,
      transaction.transactionHash
    );

    if (isValid) {
      await prisma.transaction.update({
        where: { id: transactionId },
        data: { status: TransactionStatus.CONFIRMED },
      });
    } else {
      await prisma.transaction.update({
        where: { id: transactionId },
        data: { status: TransactionStatus.FAILED },
      });
    }

    return isValid;
  }

  async getUserTransactions(userId: string) {
    return prisma.transaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getUserStats(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        totalInvested: true,
        totalTokens: true,
        referralCode: true,
      },
    });

    const transactions = await prisma.transaction.findMany({
      where: { userId },
      select: {
        status: true,
        tokensPurchased: true,
      },
    });

    const confirmedTokens = transactions
      .filter(tx => tx.status === TransactionStatus.CONFIRMED)
      .reduce((sum, tx) => sum + tx.tokensPurchased, 0);

    const referralRewards = await prisma.referralReward.findMany({
      where: { userId },
      select: {
        tokenAmount: true,
        claimed: true,
      },
    });

    const totalReferralTokens = referralRewards.reduce(
      (sum, reward) => sum + reward.tokenAmount,
      0
    );

    const unclaimedReferralTokens = referralRewards
      .filter(reward => !reward.claimed)
      .reduce((sum, reward) => sum + reward.tokenAmount, 0);

    return {
      totalInvested: user?.totalInvested || 0,
      totalTokensPurchased: user?.totalTokens || 0,
      confirmedTokens,
      totalReferralTokens,
      unclaimedReferralTokens,
      referralCode: user?.referralCode,
      transactionCount: transactions.length,
    };
  }

  async getPresaleStats() {
    const phases = await this.getAllPhases();
    const totalTokensAllocated = phases.reduce((sum, phase) => sum + phase.tokenSupply, 0);
    const totalTokensSold = phases.reduce((sum, phase) => sum + phase.tokensSold, 0);

    const totalUsers = await prisma.user.count();
    const totalTransactions = await prisma.transaction.count({
      where: { status: TransactionStatus.CONFIRMED },
    });

    const totalRaised = await prisma.transaction.aggregate({
      where: { status: TransactionStatus.CONFIRMED },
      _sum: { amountPaid: true },
    });

    return {
      totalTokensAllocated,
      totalTokensSold,
      totalUsers,
      totalTransactions,
      totalRaised: totalRaised._sum.amountPaid || 0,
      phases,
    };
  }

  async getLeaderboard(limit: number = 10) {
    return prisma.user.findMany({
      where: {
        totalInvested: { gt: 0 },
      },
      select: {
        email: true,
        totalInvested: true,
        totalTokens: true,
      },
      orderBy: { totalInvested: 'desc' },
      take: limit,
    });
  }
}

export const presaleService = new PresaleService();