const { ethers, network } require("hardhat");
const fs = require("fs");
const path = require("path");

// Color codes for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

async function main() {
  console.log(`${colors.blue}========================================${colors.reset}`);
  console.log(`${colors.blue}   PRONOVA DEPLOYMENT VERIFICATION${colors.reset}`);
  console.log(`${colors.blue}========================================${colors.reset}\n`);
  
  console.log(`Network: ${colors.yellow}${network.name}${colors.reset}`);
  console.log(`Chain ID: ${colors.yellow}${network.config.chainId}${colors.reset}\n`);

  // Get deployer
  const [deployer] = await ethers.getSigners();
  console.log(`Deployer: ${colors.yellow}${deployer.address}${colors.reset}`);
  
  // Check balance
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log(`Balance: ${colors.yellow}${ethers.formatEther(balance)} BNB${colors.reset}\n`);

  // Check if contracts are deployed
  console.log(`${colors.blue}Checking Deployed Contracts...${colors.reset}\n`);
  
  const contracts = {
    PronovaToken: process.env.TOKEN_CONTRACT_ADDRESS_TESTNET || process.env.TOKEN_CONTRACT_ADDRESS_MAINNET,
    PronovaPresale: process.env.PRESALE_CONTRACT_ADDRESS_TESTNET || process.env.PRESALE_CONTRACT_ADDRESS_MAINNET,
    PronovaVesting: process.env.VESTING_CONTRACT_ADDRESS_TESTNET || process.env.VESTING_CONTRACT_ADDRESS_MAINNET
  };

  const results = {};
  
  for (const [name, address] of Object.entries(contracts)) {
    if (!address || address === '') {
      console.log(`❌ ${name}: ${colors.red}NOT DEPLOYED${colors.reset}`);
      results[name] = { deployed: false };
    } else {
      try {
        const code = await ethers.provider.getCode(address);
        if (code !== '0x') {
          console.log(`✅ ${name}: ${colors.green}${address}${colors.reset}`);
          results[name] = { 
            deployed: true, 
            address: address,
            hasCode: true 
          };
          
          // Try to get basic info
          if (name === 'PronovaToken') {
            const token = await ethers.getContractAt('PronovaToken', address);
            const [symbol, totalSupply] = await Promise.all([
              token.symbol(),
              token.totalSupply()
            ]);
            console.log(`   Symbol: ${symbol}`);
            console.log(`   Total Supply: ${ethers.formatEther(totalSupply)} PRN`);
          }
          
          if (name === 'PronovaPresale') {
            const presale = await ethers.getContractAt('PronovaPresale', address);
            const [currentPhase, totalRaised] = await Promise.all([
              presale.currentPhase(),
              presale.totalRaisedUSD()
            ]);
            console.log(`   Current Phase: ${currentPhase}`);
            console.log(`   Total Raised: $${ethers.formatUnits(totalRaised, 6)}`);
          }
        } else {
          console.log(`❌ ${name}: ${colors.red}Address exists but no code${colors.reset}`);
          results[name] = { 
            deployed: false, 
            address: address,
            hasCode: false 
          };
        }
      } catch (error) {
        console.log(`❌ ${name}: ${colors.red}Error checking contract${colors.reset}`);
        results[name] = { 
          deployed: false, 
          error: error.message 
        };
      }
    }
  }

  // Check configuration
  console.log(`\n${colors.blue}Checking Configuration...${colors.reset}\n`);
  
  const requiredEnvVars = [
    'DEPLOYER_PRIVATE_KEY',
    'TREASURY_ADDRESS',
    'TEAM_WALLET_ADDRESS',
    'LIQUIDITY_WALLET_ADDRESS',
    'MARKETING_WALLET_ADDRESS',
    'BSCSCAN_API_KEY'
  ];

  let configComplete = true;
  for (const envVar of requiredEnvVars) {
    if (process.env[envVar] && process.env[envVar] !== '') {
      console.log(`✅ ${envVar}: ${colors.green}SET${colors.reset}`);
    } else {
      console.log(`❌ ${envVar}: ${colors.red}NOT SET${colors.reset}`);
      configComplete = false;
    }
  }

  // Summary
  console.log(`\n${colors.blue}========================================${colors.reset}`);
  console.log(`${colors.blue}   VERIFICATION SUMMARY${colors.reset}`);
  console.log(`${colors.blue}========================================${colors.reset}\n`);

  const allDeployed = Object.values(results).every(r => r.deployed);
  
  if (allDeployed && configComplete) {
    console.log(`${colors.green}✅ ALL CONTRACTS DEPLOYED SUCCESSFULLY!${colors.reset}`);
    console.log(`${colors.green}✅ CONFIGURATION COMPLETE!${colors.reset}`);
    console.log(`\n${colors.green}Ready for production use!${colors.reset}`);
  } else if (allDeployed && !configComplete) {
    console.log(`${colors.green}✅ Contracts deployed${colors.reset}`);
    console.log(`${colors.yellow}⚠️ Some configuration missing${colors.reset}`);
  } else {
    console.log(`${colors.red}❌ Deployment incomplete${colors.reset}`);
    console.log(`${colors.yellow}Please run deployment script first${colors.reset}`);
  }

  // Save verification results
  const verificationFile = path.join(__dirname, '..', 'deployments', `verification-${network.name}-${Date.now()}.json`);
  fs.writeFileSync(verificationFile, JSON.stringify({
    network: network.name,
    chainId: network.config.chainId,
    timestamp: new Date().toISOString(),
    deployer: deployer.address,
    balance: ethers.formatEther(balance),
    contracts: results,
    configComplete
  }, null, 2));

  console.log(`\n📄 Verification saved to: ${verificationFile}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(`${colors.red}Verification failed:${colors.reset}`, error);
    process.exit(1);
  });