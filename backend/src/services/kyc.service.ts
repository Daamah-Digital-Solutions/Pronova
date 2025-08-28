import { prisma } from '../config/database';
import { KycStatus, DocumentType } from '@prisma/client';
import { emailService } from './email.service';
import { getWebSocketService } from './websocket.service';

export interface KycSubmissionData {
  userId: string;
  personalInfo: {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    nationality: string;
    address: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
  };
  documents: {
    type: DocumentType;
    url: string;
  }[];
}

export class KycService {
  async submitKyc(data: KycSubmissionData): Promise<void> {
    const { userId, personalInfo, documents } = data;

    // Check if user already has KYC submitted
    const existingKyc = await prisma.user.findUnique({
      where: { id: userId },
      select: { kycStatus: true },
    });

    if (existingKyc?.kycStatus === KycStatus.APPROVED) {
      throw new Error('KYC already approved');
    }

    if (existingKyc?.kycStatus === KycStatus.PENDING) {
      throw new Error('KYC already under review');
    }

    await prisma.$transaction(async (tx) => {
      // Update user KYC status and data
      await tx.user.update({
        where: { id: userId },
        data: {
          kycStatus: KycStatus.PENDING,
          kycData: personalInfo,
        },
      });

      // Create document records
      for (const doc of documents) {
        await tx.kycDocument.create({
          data: {
            userId,
            documentType: doc.type,
            documentUrl: doc.url,
            verificationStatus: KycStatus.PENDING,
          },
        });
      }
    });
  }

  async getKycStatus(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        kycStatus: true,
        kycData: true,
      },
    });

    const documents = await prisma.kycDocument.findMany({
      where: { userId },
      select: {
        id: true,
        documentType: true,
        verificationStatus: true,
        verificationNotes: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return {
      status: user?.kycStatus || KycStatus.PENDING,
      personalInfo: user?.kycData,
      documents,
    };
  }

  async approveKyc(userId: string, adminId: string): Promise<void> {
    await prisma.$transaction(async (tx) => {
      // Update user KYC status
      await tx.user.update({
        where: { id: userId },
        data: { kycStatus: KycStatus.APPROVED },
      });

      // Update all documents status
      await tx.kycDocument.updateMany({
        where: { userId },
        data: {
          verificationStatus: KycStatus.APPROVED,
          verifiedBy: adminId,
        },
      });

      // Create notification
      await tx.notification.create({
        data: {
          userId,
          type: 'kyc_approved',
          subject: 'KYC Verification Approved',
          message: 'Your KYC verification has been approved. You can now participate in the presale.',
        },
      });
    });

    // Send approval email
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true },
    });

    if (user) {
      await emailService.sendKycApprovalEmail(user.email, user.email);
      
      // Send WebSocket notification
      try {
        const wsService = getWebSocketService();
        wsService.notifyKycStatusChange(userId, KycStatus.APPROVED);
      } catch (error) {
        console.log('WebSocket service not available:', error.message);
      }
    }
  }

  async rejectKyc(userId: string, adminId: string, reason: string): Promise<void> {
    await prisma.$transaction(async (tx) => {
      // Update user KYC status
      await tx.user.update({
        where: { id: userId },
        data: { kycStatus: KycStatus.REJECTED },
      });

      // Update all documents status
      await tx.kycDocument.updateMany({
        where: { userId },
        data: {
          verificationStatus: KycStatus.REJECTED,
          verifiedBy: adminId,
          verificationNotes: reason,
        },
      });

      // Create notification
      await tx.notification.create({
        data: {
          userId,
          type: 'kyc_rejected',
          subject: 'KYC Verification Rejected',
          message: `Your KYC verification has been rejected. Reason: ${reason}`,
        },
      });
    });

    // Send rejection email
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true },
    });

    if (user) {
      await emailService.sendKycRejectionEmail(user.email, user.email, reason);
      
      // Send WebSocket notification
      try {
        const wsService = getWebSocketService();
        wsService.notifyKycStatusChange(userId, KycStatus.REJECTED, reason);
      } catch (error) {
        console.log('WebSocket service not available:', error.message);
      }
    }
  }

  async getPendingKycSubmissions(limit: number = 50, offset: number = 0) {
    const submissions = await prisma.user.findMany({
      where: { kycStatus: KycStatus.PENDING },
      select: {
        id: true,
        email: true,
        kycData: true,
        createdAt: true,
        kycDocuments: {
          select: {
            id: true,
            documentType: true,
            documentUrl: true,
            verificationStatus: true,
            createdAt: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
      skip: offset,
      take: limit,
    });

    const total = await prisma.user.count({
      where: { kycStatus: KycStatus.PENDING },
    });

    return {
      submissions,
      total,
      hasMore: offset + limit < total,
    };
  }

  async getKycStats() {
    const stats = await prisma.user.groupBy({
      by: ['kycStatus'],
      _count: {
        kycStatus: true,
      },
    });

    const totalSubmissions = await prisma.user.count({
      where: {
        kycStatus: {
          in: [KycStatus.PENDING, KycStatus.APPROVED, KycStatus.REJECTED],
        },
      },
    });

    const formattedStats = {
      total: totalSubmissions,
      pending: 0,
      approved: 0,
      rejected: 0,
    };

    stats.forEach(stat => {
      switch (stat.kycStatus) {
        case KycStatus.PENDING:
          formattedStats.pending = stat._count.kycStatus;
          break;
        case KycStatus.APPROVED:
          formattedStats.approved = stat._count.kycStatus;
          break;
        case KycStatus.REJECTED:
          formattedStats.rejected = stat._count.kycStatus;
          break;
      }
    });

    return formattedStats;
  }

  async updateDocumentStatus(
    documentId: string,
    status: KycStatus,
    adminId: string,
    notes?: string
  ): Promise<void> {
    await prisma.kycDocument.update({
      where: { id: documentId },
      data: {
        verificationStatus: status,
        verifiedBy: adminId,
        verificationNotes: notes,
      },
    });
  }

  async deleteKycSubmission(userId: string): Promise<void> {
    await prisma.$transaction(async (tx) => {
      // Delete documents
      await tx.kycDocument.deleteMany({
        where: { userId },
      });

      // Reset user KYC status
      await tx.user.update({
        where: { id: userId },
        data: {
          kycStatus: KycStatus.PENDING,
          kycData: null,
        },
      });
    });
  }
}

export const kycService = new KycService();