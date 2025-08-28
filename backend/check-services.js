const { Client } = require('pg');
const Redis = require('ioredis');

async function checkPostgreSQL() {
  console.log('🔍 Checking PostgreSQL connection...');
  
  const client = new Client({
    connectionString: 'postgresql://postgres:Y%40hia01098098418@localhost:5432/pronova'
  });

  try {
    await client.connect();
    console.log('✅ PostgreSQL connection successful');
    
    // Test query
    const result = await client.query('SELECT version()');
    console.log('📊 PostgreSQL version:', result.rows[0].version);
    
    await client.end();
    return true;
  } catch (error) {
    console.log('❌ PostgreSQL connection failed:', error.message);
    return false;
  }
}

async function checkRedis() {
  console.log('🔍 Checking Redis connection...');
  
  const redis = new Redis('redis://localhost:6379', {
    lazyConnect: true,
    maxRetriesPerRequest: 1
  });

  try {
    await redis.connect();
    console.log('✅ Redis connection successful');
    
    // Test ping
    const pong = await redis.ping();
    console.log('🏓 Redis ping response:', pong);
    
    await redis.disconnect();
    return true;
  } catch (error) {
    console.log('❌ Redis connection failed:', error.message);
    return false;
  }
}

async function main() {
  console.log('🚀 Checking Pronova Backend Services...\n');
  
  const pgSuccess = await checkPostgreSQL();
  console.log('');
  const redisSuccess = await checkRedis();
  
  console.log('\n📋 Service Status Summary:');
  console.log('PostgreSQL:', pgSuccess ? '✅ Working' : '❌ Failed');
  console.log('Redis:', redisSuccess ? '✅ Working' : '❌ Failed (Optional for development)');
  
  if (pgSuccess) {
    console.log('\n🎉 Database is ready! You can start the backend server.');
  } else {
    console.log('\n⚠️  Please ensure PostgreSQL is running and the database "pronova" exists.');
    console.log('   You may need to:');
    console.log('   1. Start PostgreSQL service');
    console.log('   2. Create the database: CREATE DATABASE pronova;');
    console.log('   3. Check the connection string in .env file');
  }
}

main().catch(console.error);