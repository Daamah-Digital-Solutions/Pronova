import { prisma } from '../config/database';
import { TransactionStatus, KycStatus, UserRole } from '@prisma/client';

export class AdminService {
  async getDashboardStats() {
    // Get user statistics
    const totalUsers = await prisma.user.count();
    const newUsersThisMonth = await prisma.user.count({
      where: {
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      },
    });

    // Get transaction statistics
    const totalTransactions = await prisma.transaction.count();
    const confirmedTransactions = await prisma.transaction.count({
      where: { status: TransactionStatus.CONFIRMED },
    });

    const totalRaised = await prisma.transaction.aggregate({
      where: { status: TransactionStatus.CONFIRMED },
      _sum: { amountPaid: true },
    });

    const totalTokensSold = await prisma.transaction.aggregate({
      where: { status: TransactionStatus.CONFIRMED },
      _sum: { tokensPurchased: true },
    });

    // Get KYC statistics
    const kycStats = await prisma.user.groupBy({
      by: ['kycStatus'],
      _count: { kycStatus: true },
    });

    const formattedKycStats = {
      pending: 0,
      approved: 0,
      rejected: 0,
    };

    kycStats.forEach(stat => {
      switch (stat.kycStatus) {
        case KycStatus.PENDING:
          formattedKycStats.pending = stat._count.kycStatus;
          break;
        case KycStatus.APPROVED:
          formattedKycStats.approved = stat._count.kycStatus;
          break;
        case KycStatus.REJECTED:
          formattedKycStats.rejected = stat._count.kycStatus;
          break;
      }
    });

    // Get presale phase statistics
    const phases = await prisma.presalePhase.findMany({
      orderBy: { phaseNumber: 'asc' },
    });

    const currentPhase = phases.find(phase => phase.isActive);

    // Get recent transactions
    const recentTransactions = await prisma.transaction.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { email: true },
        },
      },
    });

    return {
      users: {
        total: totalUsers,
        newThisMonth: newUsersThisMonth,
      },
      transactions: {
        total: totalTransactions,
        confirmed: confirmedTransactions,
        totalRaised: totalRaised._sum.amountPaid || 0,
        tokensSold: totalTokensSold._sum.tokensPurchased || 0,
      },
      kyc: formattedKycStats,
      presale: {
        currentPhase: currentPhase?.phaseNumber || null,
        phases: phases.map(phase => ({
          id: phase.phaseNumber,
          name: phase.name,
          tokensSold: phase.tokensSold,
          tokenSupply: phase.tokenSupply,
          isActive: phase.isActive,
        })),
      },
      recentTransactions: recentTransactions.map(tx => ({
        id: tx.id,
        userEmail: tx.user.email,
        amount: tx.amountPaid,
        tokens: tx.tokensPurchased,
        status: tx.status,
        paymentMethod: tx.paymentMethod,
        createdAt: tx.createdAt,
      })),
    };
  }

  async getAllUsers(filters: {
    limit?: number;
    offset?: number;
    search?: string;
    kycStatus?: KycStatus;
    role?: UserRole;
  }) {
    const { limit = 50, offset = 0, search, kycStatus, role } = filters;

    const where: any = {};

    if (search) {
      where.email = {
        contains: search,
        mode: 'insensitive',
      };
    }

    if (kycStatus) {
      where.kycStatus = kycStatus;
    }

    if (role) {
      where.role = role;
    }

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        walletAddress: true,
        emailVerified: true,
        kycStatus: true,
        role: true,
        totalInvested: true,
        totalTokens: true,
        createdAt: true,
        _count: {
          select: {
            transactions: true,
            referrals: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip: offset,
      take: limit,
    });

    const total = await prisma.user.count({ where });

    return {
      users,
      total,
      hasMore: offset + limit < total,
    };
  }

  async getAllTransactions(filters: {
    limit?: number;
    offset?: number;
    status?: TransactionStatus;
    userId?: string;
    phase?: number;
  }) {
    const { limit = 50, offset = 0, status, userId, phase } = filters;

    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (userId) {
      where.userId = userId;
    }

    if (phase) {
      where.phase = phase;
    }

    const transactions = await prisma.transaction.findMany({
      where,
      include: {
        user: {
          select: {
            email: true,
            walletAddress: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip: offset,
      take: limit,
    });

    const total = await prisma.transaction.count({ where });

    return {
      transactions,
      total,
      hasMore: offset + limit < total,
    };
  }

  async updateUserRole(userId: string, role: UserRole) {
    return prisma.user.update({
      where: { id: userId },
      data: { role },
      select: {
        id: true,
        email: true,
        role: true,
      },
    });
  }

  async suspendUser(userId: string, reason?: string) {
    await prisma.$transaction(async (tx) => {
      // You might want to add a suspended field to the user model
      // For now, we'll create a notification
      await tx.notification.create({
        data: {
          userId,
          type: 'account_suspended',
          subject: 'Account Suspended',
          message: `Your account has been suspended. ${reason ? `Reason: ${reason}` : ''}`,
        },
      });
    });
  }

  async getSystemSettings() {
    const settings = await prisma.systemSettings.findMany({
      orderBy: { key: 'asc' },
    });

    return settings.reduce((acc, setting) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {} as Record<string, any>);
  }

  async updateSystemSetting(key: string, value: any, description?: string) {
    return prisma.systemSettings.upsert({
      where: { key },
      update: {
        value,
        description,
        updatedAt: new Date(),
      },
      create: {
        key,
        value,
        description,
      },
    });
  }

  async updatePresalePhase(phaseNumber: number, isActive: boolean) {
    await prisma.$transaction(async (tx) => {
      // Deactivate all phases
      await tx.presalePhase.updateMany({
        data: { isActive: false },
      });

      // Activate the specified phase if requested
      if (isActive) {
        await tx.presalePhase.update({
          where: { phaseNumber },
          data: { isActive: true },
        });
      }
    });

    return prisma.presalePhase.findUnique({
      where: { phaseNumber },
    });
  }

  async createPresalePhase(data: {
    phaseNumber: number;
    name: string;
    pricePerToken: number;
    tokenSupply: number;
    startDate: Date;
    endDate: Date;
    minPurchase: number;
    maxPurchase: number;
  }) {
    return prisma.presalePhase.create({
      data: {
        ...data,
        isActive: false,
      },
    });
  }

  async updatePresalePhaseDetails(phaseNumber: number, data: {
    name?: string;
    pricePerToken?: number;
    tokenSupply?: number;
    startDate?: Date;
    endDate?: Date;
    minPurchase?: number;
    maxPurchase?: number;
  }) {
    return prisma.presalePhase.update({
      where: { phaseNumber },
      data,
    });
  }

  async getAnalytics(startDate?: Date, endDate?: Date) {
    const dateFilter = startDate && endDate ? {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    } : {};

    // User registration over time
    const userRegistrations = await prisma.user.groupBy({
      by: ['createdAt'],
      where: dateFilter,
      _count: { id: true },
      orderBy: { createdAt: 'asc' },
    });

    // Transaction volume over time
    const transactionVolume = await prisma.transaction.groupBy({
      by: ['createdAt'],
      where: {
        ...dateFilter,
        status: TransactionStatus.CONFIRMED,
      },
      _sum: { amountPaid: true },
      _count: { id: true },
      orderBy: { createdAt: 'asc' },
    });

    // Payment method distribution
    const paymentMethods = await prisma.transaction.groupBy({
      by: ['paymentMethod'],
      where: {
        ...dateFilter,
        status: TransactionStatus.CONFIRMED,
      },
      _sum: { amountPaid: true },
      _count: { id: true },
    });

    return {
      userRegistrations,
      transactionVolume,
      paymentMethods,
    };
  }
}

export const adminService = new AdminService();