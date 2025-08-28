import Redis from 'ioredis';

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

export const redis = new Redis(redisUrl, {
  maxRetriesPerRequest: 3,
  retryStrategy: (times) => {
    if (times > 3) {
      console.log('Redis connection failed, continuing without cache');
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
});

redis.on('connect', () => {
  console.log('✅ Redis connected successfully');
});

redis.on('error', (err) => {
  console.error('❌ Redis connection error:', err);
});

// Helper functions for caching
export const cache = {
  get: async (key: string) => {
    try {
      const value = await redis.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Redis get error:', error);
      return null;
    }
  },

  set: async (key: string, value: any, ttl?: number) => {
    try {
      const stringValue = JSON.stringify(value);
      if (ttl) {
        await redis.setex(key, ttl, stringValue);
      } else {
        await redis.set(key, stringValue);
      }
      return true;
    } catch (error) {
      console.error('Redis set error:', error);
      return false;
    }
  },

  del: async (key: string) => {
    try {
      await redis.del(key);
      return true;
    } catch (error) {
      console.error('Redis delete error:', error);
      return false;
    }
  },

  flush: async () => {
    try {
      await redis.flushall();
      return true;
    } catch (error) {
      console.error('Redis flush error:', error);
      return false;
    }
  },
};