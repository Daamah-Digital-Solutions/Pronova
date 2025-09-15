import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { verifyAccessToken } from '../utils/jwt.utils';
import { prisma } from '../config/database';

export interface SocketUser {
  userId: string;
  email: string;
  role: string;
}

declare module 'socket.io' {
  interface Socket {
    user?: SocketUser;
  }
}

export class WebSocketService {
  private io: SocketIOServer;
  private connectedUsers: Map<string, string> = new Map(); // userId -> socketId

  constructor(server: HTTPServer) {
    this.io = new SocketIOServer(server, {
      cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        methods: ['GET', 'POST'],
        credentials: true,
      },
    });

    this.setupMiddleware();
    this.setupEventHandlers();
  }

  private setupMiddleware() {
    // Authentication middleware
    this.io.use(async (socket, next) => {
      try {
        const token = socket.handshake.auth.token;
        
        if (!token) {
          throw new Error('No token provided');
        }

        const decoded = verifyAccessToken(token);
        
        // Get user from database
        const user = await prisma.user.findUnique({
          where: { id: decoded.userId },
          select: { id: true, email: true, role: true },
        });

        if (!user) {
          throw new Error('User not found');
        }

        socket.user = {
          userId: user.id,
          email: user.email,
          role: user.role,
        };

        next();
      } catch (error) {
        next(new Error('Authentication failed'));
      }
    });
  }

  private setupEventHandlers() {
    this.io.on('connection', (socket) => {
      console.log(`User connected: ${socket.user?.email} (${socket.id})`);

      if (socket.user) {
        // Store user connection
        this.connectedUsers.set(socket.user.userId, socket.id);

        // Join user to their personal room
        socket.join(`user:${socket.user.userId}`);

        // Join admin users to admin room
        if (socket.user.role === 'ADMIN') {
          socket.join('admin');
        }

        // Send initial data
        this.sendUserStats(socket.user.userId);
      }

      // Handle presale subscription
      socket.on('subscribe:presale', () => {
        socket.join('presale');
        this.sendPresaleStats(socket.id);
      });

      // Handle admin subscription
      socket.on('subscribe:admin', () => {
        if (socket.user?.role === 'ADMIN') {
          socket.join('admin');
          this.sendAdminStats(socket.id);
        }
      });

      // Handle disconnect
      socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.user?.email} (${socket.id})`);
        
        if (socket.user) {
          this.connectedUsers.delete(socket.user.userId);
        }
      });
    });
  }

  // Send real-time updates to specific user
  public notifyUser(userId: string, event: string, data: any) {
    this.io.to(`user:${userId}`).emit(event, data);
  }

  // Send updates to all users in presale room
  public notifyPresaleUsers(event: string, data: any) {
    this.io.to('presale').emit(event, data);
  }

  // Send updates to admin users
  public notifyAdmins(event: string, data: any) {
    this.io.to('admin').emit(event, data);
  }

  // Send updates to all connected users
  public broadcast(event: string, data: any) {
    this.io.emit(event, data);
  }

  // Send user-specific stats
  private async sendUserStats(userId: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          totalInvested: true,
          totalTokens: true,
          kycStatus: true,
        },
      });

      const recentTransactions = await prisma.transaction.findMany({
        where: { userId },
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          amountPaid: true,
          tokensPurchased: true,
          status: true,
          createdAt: true,
        },
      });

      this.notifyUser(userId, 'user:stats', {
        ...user,
        recentTransactions,
      });
    } catch (error) {
      console.error('Error sending user stats:', error);
    }
  }

  // Send presale stats to specific socket
  private async sendPresaleStats(socketId: string) {
    try {
      const currentPhase = await prisma.presalePhase.findFirst({
        where: { isActive: true },
      });

      const totalRaised = await prisma.transaction.aggregate({
        where: { status: 'CONFIRMED' },
        _sum: { amountPaid: true },
      });

      const totalTokensSold = await prisma.transaction.aggregate({
        where: { status: 'CONFIRMED' },
        _sum: { tokensPurchased: true },
      });

      this.io.to(socketId).emit('presale:stats', {
        currentPhase: currentPhase ? {
          id: currentPhase.phaseNumber,
          name: currentPhase.name,
          pricePerToken: currentPhase.pricePerToken,
          tokensSold: currentPhase.tokensSold,
          tokenSupply: currentPhase.tokenSupply,
          progress: (currentPhase.tokensSold / currentPhase.tokenSupply) * 100,
        } : null,
        totalRaised: totalRaised._sum.amountPaid || 0,
        totalTokensSold: totalTokensSold._sum.tokensPurchased || 0,
      });
    } catch (error) {
      console.error('Error sending presale stats:', error);
    }
  }

  // Send admin stats to specific socket
  private async sendAdminStats(socketId: string) {
    try {
      const pendingKyc = await prisma.user.count({
        where: { kycStatus: 'PENDING' },
      });

      const recentTransactions = await prisma.transaction.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
          },
        },
      });

      this.io.to(socketId).emit('admin:stats', {
        pendingKyc,
        recentTransactions,
      });
    } catch (error) {
      console.error('Error sending admin stats:', error);
    }
  }

  // Notify about new purchase
  public notifyNewPurchase(transaction: {
    id: string;
    userEmail: string;
    amountPaid: number;
    tokensPurchased: number;
    paymentMethod: string;
  }) {
    // Notify admins
    this.notifyAdmins('transaction:new', transaction);

    // Notify all presale users (anonymized)
    this.notifyPresaleUsers('purchase:new', {
      amount: transaction.amountPaid,
      tokens: transaction.tokensPurchased,
      paymentMethod: transaction.paymentMethod,
      timestamp: new Date(),
    });
  }

  // Notify about KYC status change
  public notifyKycStatusChange(userId: string, status: string, reason?: string) {
    this.notifyUser(userId, 'kyc:status_changed', {
      status,
      reason,
      timestamp: new Date(),
    });

    // Notify admins
    this.notifyAdmins('kyc:status_updated', {
      userId,
      status,
      timestamp: new Date(),
    });
  }

  // Notify about phase change
  public notifyPhaseChange(phase: {
    id: number;
    name: string;
    pricePerToken: number;
    isActive: boolean;
  }) {
    this.broadcast('presale:phase_changed', {
      ...phase,
      timestamp: new Date(),
    });
  }

  // Get connected users count
  public getConnectedUsersCount(): number {
    return this.connectedUsers.size;
  }

  // Get connected admin count
  public getConnectedAdminsCount(): number {
    const adminRoom = this.io.sockets.adapter.rooms.get('admin');
    return adminRoom ? adminRoom.size : 0;
  }
}

let webSocketService: WebSocketService;

export const initializeWebSocket = (server: HTTPServer): WebSocketService => {
  webSocketService = new WebSocketService(server);
  return webSocketService;
};

export const getWebSocketService = (): WebSocketService => {
  if (!webSocketService) {
    throw new Error('WebSocket service not initialized');
  }
  return webSocketService;
};