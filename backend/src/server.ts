// Add global error handler for uncaught errors during startup
process.on('uncaughtException', (error) => {
  console.error('UNCAUGHT EXCEPTION:', error);
  console.error('Stack:', error.stack);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('UNHANDLED REJECTION at:', promise, 'reason:', reason);
});

console.log('Starting server initialization...');

import express from 'express';
console.log('Loaded: express');

import cors from 'cors';
console.log('Loaded: cors');

import helmet from 'helmet';
console.log('Loaded: helmet');

import morgan from 'morgan';
console.log('Loaded: morgan');

import compression from 'compression';
console.log('Loaded: compression');

import dotenv from 'dotenv';
console.log('Loaded: dotenv');

import { createServer } from 'http';
console.log('Loaded: http');

import { rateLimit } from 'express-rate-limit';
console.log('Loaded: express-rate-limit');

// Load environment variables
dotenv.config();
console.log('Environment loaded');

// Import database connection
console.log('Loading database config...');
import { connectDatabase } from './config/database';
console.log('Loaded: database');

console.log('Loading websocket service...');
import { initializeWebSocket } from './services/websocket.service';
console.log('Loaded: websocket');

// Import routes
console.log('Loading routes...');
import authRoutes from './routes/auth.routes';
console.log('Loaded: auth routes');

import userRoutes from './routes/user.routes';
console.log('Loaded: user routes');

import presaleRoutes from './routes/presale.routes';
console.log('Loaded: presale routes');

import paymentRoutes from './routes/payment.routes';
console.log('Loaded: payment routes');

import kycRoutes from './routes/kyc.routes';
console.log('Loaded: kyc routes');

import adminRoutes from './routes/admin.routes';
console.log('Loaded: admin routes');

// Import middleware
console.log('Loading error middleware...');
import { errorHandler } from './middleware/error.middleware';
console.log('Loaded: error middleware');

const app = express();
const server = createServer(app);
const PORT = process.env.PORT || 5000;

// Global rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Middleware
app.use(helmet()); // Security headers
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(compression()); // Compress responses
// Stripe webhook needs raw body
app.use('/api/payments/webhook', express.raw({ type: 'application/json' }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('dev')); // Logging
app.use('/api', limiter); // Apply rate limiting to API routes

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/presale', presaleRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/kyc', kycRoutes);
app.use('/api/admin', adminRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Global error handler
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    // Connect to database
    await connectDatabase();

    // Initialize WebSocket
    const webSocketService = initializeWebSocket(server);
    console.log('🔌 WebSocket service initialized');

    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV}`);
      console.log(`🔗 Health check: http://localhost:${PORT}/health`);
      console.log(`🌐 WebSocket server ready`);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('SIGTERM signal received: closing HTTP server');
      server.close(() => {
        console.log('HTTP server closed');
      });
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;