import express from 'express';
import cors from 'cors';
import { prisma } from './config/database';

const app = express();
const PORT = process.env.PORT || 5000;

// Basic middleware
app.use(cors());
app.use(express.json());

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Pronova Backend API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      api: {
        test: {
          db: '/api/test/db'
        }
      }
    },
    documentation: 'API documentation coming soon',
    frontend: 'http://localhost:3002'
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    message: 'Pronova Backend Server is running'
  });
});

// Database test endpoint
app.get('/api/test/db', async (req, res) => {
  try {
    // Simple database test
    await prisma.$connect();
    res.json({ 
      status: 'OK', 
      message: 'Database connection successful',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ 
      status: 'ERROR', 
      message: 'Database connection failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Test user creation endpoint
app.post('/api/test/user', async (req, res) => {
  try {
    const testUser = await prisma.user.create({
      data: {
        email: `test-${Date.now()}@example.com`,
        passwordHash: 'hashed-password-placeholder',
        role: 'USER',
      }
    });

    res.json({
      status: 'OK',
      message: 'Test user created successfully',
      user: {
        id: testUser.id,
        email: testUser.email,
        role: testUser.role
      }
    });
  } catch (error) {
    console.error('User creation error:', error);
    res.status(500).json({
      status: 'ERROR',
      message: 'Failed to create test user',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Test server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🗄️  Database test: http://localhost:${PORT}/api/test/db`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down server...');
  await prisma.$disconnect();
  process.exit(0);
});