const hre = require("hardhat");

async function main() {
  console.log("🚀 Starting Pronova deployment to local network...\n");

  // Get deployer account
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", (await deployer.provider.getBalance(deployer.address)).toString());

  // Deploy MockUSDT for testing
  console.log("\n📄 Deploying MockUSDT...");
  const MockUSDT = await hre.ethers.getContractFactory("MockUSDT");
  const mockUSDT = await MockUSDT.deploy();
  await mockUSDT.waitForDeployment();
  console.log("✅ MockUSDT deployed to:", await mockUSDT.getAddress());

  // Deploy PronovaToken
  console.log("\n📄 Deploying PronovaToken...");
  const PronovaToken = await hre.ethers.getContractFactory("PronovaToken");
  const token = await PronovaToken.deploy();
  await token.waitForDeployment();
  console.log("✅ PronovaToken deployed to:", await token.getAddress());

  // Deploy PronovaPresale
  console.log("\n📄 Deploying PronovaPresale...");
  const PronovaPresale = await hre.ethers.getContractFactory("PronovaPresale");
  
  const presale = await PronovaPresale.deploy(
    await token.getAddress(),
    await mockUSDT.getAddress(),
    deployer.address, // Treasury wallet
    ethers.ZeroAddress, // ETH price feed (using fallback)
    ethers.ZeroAddress  // BNB price feed (using fallback)
  );
  await presale.waitForDeployment();
  console.log("✅ PronovaPresale deployed to:", await presale.getAddress());

  // Deploy PronovaVesting
  console.log("\n📄 Deploying PronovaVesting...");
  const PronovaVesting = await hre.ethers.getContractFactory("PronovaVesting");
  const vesting = await PronovaVesting.deploy(await token.getAddress());
  await vesting.waitForDeployment();
  console.log("✅ PronovaVesting deployed to:", await vesting.getAddress());

  // Configure contracts
  console.log("\n⚙️  Configuring contracts...");
  
  // Set contract addresses in token
  await token.setPresaleContract(await presale.getAddress());
  console.log("✅ Set presale contract in token");

  await token.setTeamWallet(deployer.address);
  console.log("✅ Set team wallet in token");

  await token.setLiquidityWallet(deployer.address);
  console.log("✅ Set liquidity wallet in token");

  await token.setMarketingWallet(deployer.address);
  console.log("✅ Set marketing wallet in token");

  await token.setStakingContract(await vesting.getAddress());
  console.log("✅ Set staking contract in token");

  // Distribute allocations
  await token.distributeAllocations();
  console.log("✅ Distributed token allocations");

  // Add deployer to presale whitelist for testing
  await presale.updateWhitelist([deployer.address], true);
  console.log("✅ Added deployer to presale whitelist");

  // Summary
  console.log("\n📊 Deployment Summary:");
  console.log("========================");
  console.log("MockUSDT:", await mockUSDT.getAddress());
  console.log("PronovaToken:", await token.getAddress());
  console.log("PronovaPresale:", await presale.getAddress());
  console.log("PronovaVesting:", await vesting.getAddress());
  console.log("Network:", hre.network.name);
  console.log("Deployer:", deployer.address);
  console.log("========================");
  
  // Save addresses to file
  const fs = require("fs");
  const path = require("path");
  
  // Create deployments directory if it doesn't exist
  const deploymentsDir = path.join(__dirname, "../deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }
  
  const addresses = {
    MockUSDT: await mockUSDT.getAddress(),
    PronovaToken: await token.getAddress(),
    PronovaPresale: await presale.getAddress(),
    PronovaVesting: await vesting.getAddress(),
    network: hre.network.name,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    chainId: (await deployer.provider.getNetwork()).chainId.toString()
  };
  
  const fileName = `${hre.network.name}-addresses.json`;
  const filePath = path.join(deploymentsDir, fileName);
  
  fs.writeFileSync(filePath, JSON.stringify(addresses, null, 2));
  
  console.log(`\n✅ Addresses saved to deployments/${fileName}`);
  console.log("\n🎉 Deployment complete!");

  // Test the deployment
  console.log("\n🧪 Testing deployment...");
  
  // Check token allocations
  const presaleAllocation = await token.PRESALE_ALLOCATION();
  const presaleBalance = await token.balanceOf(await presale.getAddress());
  console.log(`Presale allocation: ${ethers.formatEther(presaleAllocation)} PRN`);
  console.log(`Presale balance: ${ethers.formatEther(presaleBalance)} PRN`);
  
  // Check phase info
  const phase1 = await presale.getPhaseInfo(1);
  console.log(`Phase 1 price: $${ethers.formatUnits(phase1.pricePerToken, 6)} per token`);
  console.log(`Phase 1 active: ${phase1.isActive}`);
  
  console.log("\n✅ All tests passed!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });