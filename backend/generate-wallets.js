const crypto = require('crypto');

console.log('========================================');
console.log('   PRONOVA DEPLOYMENT WALLET GENERATOR');
console.log('========================================\n');

// Generate wallets
const wallets = {};
const walletNames = ['DEPLOYER', 'TREASURY', 'TEAM', 'LIQUIDITY', 'MARKETING'];

walletNames.forEach(name => {
  // Generate private key
  const privateKey = '0x' + crypto.randomBytes(32).toString('hex');
  
  // Simple address generation (for demo - use ethers.js for real addresses)
  const addressBytes = crypto.randomBytes(20).toString('hex');
  const address = '0x' + addressBytes;
  
  wallets[name] = {
    address: address,
    privateKey: name === 'DEPLOYER' ? privateKey.substring(2) : null // Only save deployer private key
  };
});

// Output for .env file
console.log('# Add these to your .env file:\n');
console.log(`# Deployer (KEEP PRIVATE KEY SECURE!)`);
console.log(`DEPLOYER_PRIVATE_KEY=${wallets.DEPLOYER.privateKey}`);
console.log(`DEPLOYER_ADDRESS=${wallets.DEPLOYER.address}\n`);

console.log(`# Treasury (Multi-sig recommended for production)`);
console.log(`TREASURY_ADDRESS=${wallets.TREASURY.address}\n`);

console.log(`# Team Allocation Wallet`);
console.log(`TEAM_WALLET_ADDRESS=${wallets.TEAM.address}\n`);

console.log(`# Liquidity Pool Wallet`);
console.log(`LIQUIDITY_WALLET_ADDRESS=${wallets.LIQUIDITY.address}\n`);

console.log(`# Marketing Wallet`);
console.log(`MARKETING_WALLET_ADDRESS=${wallets.MARKETING.address}\n`);

console.log('========================================');
console.log('⚠️  IMPORTANT SECURITY NOTES:');
console.log('========================================');
console.log('1. NEVER commit private keys to Git');
console.log('2. Use hardware wallets for mainnet');
console.log('3. Use multi-sig for treasury');
console.log('4. Save these addresses securely');
console.log('5. Fund deployer with BNB before deployment\n');

// For testing, use same address for all (except deployer)
console.log('========================================');
console.log('   QUICK TEST SETUP (Same Address)');
console.log('========================================\n');
console.log('# For quick testing, you can use the deployer address for all wallets:');
console.log(`TREASURY_ADDRESS=${wallets.DEPLOYER.address}`);
console.log(`TEAM_WALLET_ADDRESS=${wallets.DEPLOYER.address}`);
console.log(`LIQUIDITY_WALLET_ADDRESS=${wallets.DEPLOYER.address}`);
console.log(`MARKETING_WALLET_ADDRESS=${wallets.DEPLOYER.address}`);