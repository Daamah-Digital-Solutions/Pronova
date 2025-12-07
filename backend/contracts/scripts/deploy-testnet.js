const hre = require("hardhat");
require("dotenv").config();

async function main() {
  console.log("🚀 Starting Pronova deployment to testnet...\n");

  // Get deployer account
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", ethers.formatEther(await deployer.provider.getBalance(deployer.address)), "BNB");

  // Verify environment variables
  const usdtAddress = process.env.USDT_ADDRESS_TESTNET;
  if (!usdtAddress || usdtAddress === '') {
    throw new Error("❌ USDT_ADDRESS_TESTNET not set in .env file");
  }
  console.log("USDT Address:", usdtAddress);

  // Deploy PronovaToken
  console.log("\n📄 Deploying PronovaToken...");
  const PronovaToken = await hre.ethers.getContractFactory("PronovaToken");
  const token = await PronovaToken.deploy();
  await token.waitForDeployment();
  const tokenAddress = await token.getAddress();
  console.log("✅ PronovaToken deployed to:", tokenAddress);

  // Deploy PronovaPresale
  console.log("\n📄 Deploying PronovaPresale...");
  const PronovaPresale = await hre.ethers.getContractFactory("PronovaPresale");

  // Constructor parameters for BSC Testnet
  const presale = await PronovaPresale.deploy(
    tokenAddress,
    usdtAddress,
    deployer.address, // Treasury wallet (deployer for testnet)
    ethers.ZeroAddress, // ETH price feed (using fallback for testnet)
    ethers.ZeroAddress  // BNB price feed (using fallback for testnet)
  );
  await presale.waitForDeployment();
  const presaleAddress = await presale.getAddress();
  console.log("✅ PronovaPresale deployed to:", presaleAddress);

  // Deploy PronovaVesting
  console.log("\n📄 Deploying PronovaVesting...");
  const PronovaVesting = await hre.ethers.getContractFactory("PronovaVesting");
  const vesting = await PronovaVesting.deploy(tokenAddress);
  await vesting.waitForDeployment();
  const vestingAddress = await vesting.getAddress();
  console.log("✅ PronovaVesting deployed to:", vestingAddress);

  // Configure contracts
  console.log("\n⚙️  Configuring contracts...");

  // Set contract addresses in token
  await token.setPresaleContract(presaleAddress);
  console.log("✅ Set presale contract in token");

  await token.setTeamWallet(deployer.address);
  console.log("✅ Set team wallet in token");

  await token.setLiquidityWallet(deployer.address);
  console.log("✅ Set liquidity wallet in token");

  await token.setMarketingWallet(deployer.address);
  console.log("✅ Set marketing wallet in token");

  await token.setStakingContract(vestingAddress);
  console.log("✅ Set staking contract in token");

  // Distribute allocations
  console.log("\n💰 Distributing token allocations...");
  await token.distributeAllocations();
  console.log("✅ Distributed token allocations");

  // Verify contracts on BSCScan
  console.log("\n🔍 Verifying contracts on BSCScan...");
  console.log("⏳ Waiting 30 seconds for BSCScan to index contracts...");
  await new Promise(resolve => setTimeout(resolve, 30000));

  try {
    await hre.run("verify:verify", {
      address: tokenAddress,
      constructorArguments: [],
    });
    console.log("✅ PronovaToken verified");
  } catch (error) {
    console.log("❌ PronovaToken verification failed:", error.message);
  }

  try {
    await hre.run("verify:verify", {
      address: presaleAddress,
      constructorArguments: [
        tokenAddress,
        usdtAddress,
        deployer.address,
        ethers.ZeroAddress,
        ethers.ZeroAddress
      ],
    });
    console.log("✅ PronovaPresale verified");
  } catch (error) {
    console.log("❌ PronovaPresale verification failed:", error.message);
  }

  try {
    await hre.run("verify:verify", {
      address: vestingAddress,
      constructorArguments: [tokenAddress],
    });
    console.log("✅ PronovaVesting verified");
  } catch (error) {
    console.log("❌ PronovaVesting verification failed:", error.message);
  }

  // Summary
  console.log("\n📊 Deployment Summary:");
  console.log("========================");
  console.log("Network:", hre.network.name);
  console.log("Chain ID:", (await deployer.provider.getNetwork()).chainId.toString());
  console.log("Deployer:", deployer.address);
  console.log("PronovaToken:", tokenAddress);
  console.log("PronovaPresale:", presaleAddress);
  console.log("PronovaVesting:", vestingAddress);
  console.log("USDT:", usdtAddress);
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
    PronovaToken: tokenAddress,
    PronovaPresale: presaleAddress,
    PronovaVesting: vestingAddress,
    USDT: usdtAddress,
    network: hre.network.name,
    chainId: (await deployer.provider.getNetwork()).chainId.toString(),
    deployer: deployer.address,
    timestamp: new Date().toISOString()
  };

  const fileName = `${hre.network.name}-addresses.json`;
  const filePath = path.join(deploymentsDir, fileName);

  fs.writeFileSync(filePath, JSON.stringify(addresses, null, 2));

  console.log(`\n✅ Addresses saved to deployments/${fileName}`);
  console.log("\n🎉 Deployment complete!");

  console.log("\n📝 Next steps:");
  console.log("1. Update frontend .env with contract addresses");
  console.log("2. Update backend .env with contract addresses");
  console.log("3. Test the presale functionality");
  console.log("4. Run: npx hardhat run scripts/test-deployment.js --network bscTestnet");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });