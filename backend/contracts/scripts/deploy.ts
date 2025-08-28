import { ethers } from "hardhat";

async function main() {
  console.log("Starting deployment...");

  // Get deployer account
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", (await ethers.provider.getBalance(deployer.address)).toString());

  // Deploy PronovaToken
  console.log("\nDeploying PronovaToken...");
  const PronovaToken = await ethers.getContractFactory("PronovaToken");
  const pronovaToken = await PronovaToken.deploy("Pronova Token", "PRON");
  await pronovaToken.waitForDeployment();
  const tokenAddress = await pronovaToken.getAddress();
  console.log("PronovaToken deployed to:", tokenAddress);

  // Deploy mock USDT for testing (in production, use actual USDT address)
  console.log("\nDeploying Mock USDT...");
  const MockUSDT = await ethers.getContractFactory("ERC20");
  const usdtToken = await MockUSDT.deploy("Mock USDT", "USDT");
  await usdtToken.waitForDeployment();
  const usdtAddress = await usdtToken.getAddress();
  console.log("Mock USDT deployed to:", usdtAddress);

  // Deploy PronovaPresale
  console.log("\nDeploying PronovaPresale...");
  const PronovaPresale = await ethers.getContractFactory("PronovaPresale");
  const presale = await PronovaPresale.deploy(
    tokenAddress,
    usdtAddress,
    deployer.address // treasury wallet
  );
  await presale.waitForDeployment();
  const presaleAddress = await presale.getAddress();
  console.log("PronovaPresale deployed to:", presaleAddress);

  // Deploy PronovaVesting
  console.log("\nDeploying PronovaVesting...");
  const PronovaVesting = await ethers.getContractFactory("PronovaVesting");
  const vesting = await PronovaVesting.deploy(tokenAddress);
  await vesting.waitForDeployment();
  const vestingAddress = await vesting.getAddress();
  console.log("PronovaVesting deployed to:", vestingAddress);

  // Set up contracts
  console.log("\nSetting up contracts...");
  
  // Set presale contract in token
  await pronovaToken.setPresaleContract(presaleAddress);
  console.log("Presale contract set in token");

  // Set other wallets (for demo purposes, using deployer address)
  await pronovaToken.setTeamWallet(deployer.address);
  await pronovaToken.setLiquidityWallet(deployer.address);
  await pronovaToken.setMarketingWallet(deployer.address);
  await pronovaToken.setStakingContract(deployer.address);
  console.log("All wallets set");

  // Distribute allocations
  await pronovaToken.distributeAllocations();
  console.log("Token allocations distributed");

  // Save deployment addresses
  const deploymentInfo = {
    network: "hardhat",
    deployer: deployer.address,
    contracts: {
      PronovaToken: tokenAddress,
      PronovaPresale: presaleAddress,
      PronovaVesting: vestingAddress,
      MockUSDT: usdtAddress,
    },
    deploymentTime: new Date().toISOString(),
  };

  console.log("\n=== Deployment Summary ===");
  console.log(JSON.stringify(deploymentInfo, null, 2));

  // Write deployment info to file
  const fs = require("fs");
  const path = require("path");
  const deploymentsDir = path.join(__dirname, "../deployments");
  
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir);
  }
  
  fs.writeFileSync(
    path.join(deploymentsDir, `deployment-${Date.now()}.json`),
    JSON.stringify(deploymentInfo, null, 2)
  );

  console.log("\nDeployment completed successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });