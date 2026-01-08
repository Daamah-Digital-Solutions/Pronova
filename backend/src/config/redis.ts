import Redis from 'ioredis';

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

// Track Redis availability to prevent log spam
let redisAvailable = false;
let connectionAttempted = false;

export const redis = new Redis(redisUrl, {
  maxRetriesPerRequest: 3,
  retryStrategy: (times) => {
    if (times > 3) {
      if (!connectionAttempted) {
        console.log('[Redis] Connection failed after 3 attempts. Running without cache.');
        connectionAttempted = true;
      }
      return null; // Stop retrying
    }
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  reconnectOnError: (err) => {
    const targetError = 'READONLY';
    if (err.message.includes(targetError)) {
      return true;
    }
    return false;
  },
  lazyConnect: true, // Don't connect immediately
  enableOfflineQueue: false, // Don't queue commands when disconnected
});

redis.on('connect', () => {
  redisAvailable = true;
  console.log('[Redis] Connected successfully');
});

redis.on('error', (err) => {
  if (!connectionAttempted) {
    // Only log the first error
    connectionAttempted = true;
    console.warn('[Redis] Connection unavailable. Running without cache.');
  }
  redisAvailable = false;
});

redis.on('close', () => {
  redisAvailable = false;
});

// Helper functions for caching with graceful fallback
export const cache = {
  get: async (key: string): Promise<string | null> => {
    if (!redisAvailable) return null;
    try {
      const value = await redis.get(key);
      return value;
    } catch (error) {
      // Silently fail - cache is optional
      return null;
    }
  },

  set: async (key: string, value: string, ttl?: number): Promise<boolean> => {
    if (!redisAvailable) return false;
    try {
      if (ttl) {
        await redis.setex(key, ttl, value);
      } else {
        await redis.set(key, value);
      }
      return true;
    } catch (error) {
      // Silently fail - cache is optional
      return false;
    }
  },

  del: async (key: string): Promise<boolean> => {
    if (!redisAvailable) return false;
    try {
      await redis.del(key);
      return true;
    } catch (error) {
      return false;
    }
  },

  flush: async (): Promise<boolean> => {
    if (!redisAvailable) return false;
    try {
      await redis.flushall();
      return true;
    } catch (error) {
      return false;
    }
  },

  isAvailable: (): boolean => redisAvailable,
};
