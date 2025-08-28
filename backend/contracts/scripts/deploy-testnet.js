const hre = require("hardhat");

async function main() {
  console.log("🚀 Starting Pronova deployment to testnet...\n");

  // Get deployer account
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  // Deploy PronovaToken
  console.log("\n📄 Deploying PronovaToken...");
  const PronovaToken = await hre.ethers.getContractFactory("PronovaToken");
  const token = await PronovaToken.deploy();
  await token.deployed();
  console.log("✅ PronovaToken deployed to:", token.address);

  // Deploy PronovaPresale
  console.log("\n📄 Deploying PronovaPresale...");
  const PronovaPresale = await hre.ethers.getContractFactory("PronovaPresale");
  
  // Constructor parameters
  const presaleParams = {
    token: token.address,
    usdt: "0x..." // Add testnet USDT address
  };
  
  const presale = await PronovaPresale.deploy(
    presaleParams.token,
    presaleParams.usdt
  );
  await presale.deployed();
  console.log("✅ PronovaPresale deployed to:", presale.address);

  // Deploy PronovaVesting
  console.log("\n📄 Deploying PronovaVesting...");
  const PronovaVesting = await hre.ethers.getContractFactory("PronovaVesting");
  const vesting = await PronovaVesting.deploy(token.address);
  await vesting.deployed();
  console.log("✅ PronovaVesting deployed to:", vesting.address);

  // Configure contracts
  console.log("\n⚙️  Configuring contracts...");
  
  // Set presale contract in token
  await token.setPresaleContract(presale.address);
  console.log("✅ Set presale contract in token");

  // Set vesting contract in token
  await token.setVestingContract(vesting.address);
  console.log("✅ Set vesting contract in token");

  // Transfer tokens to presale contract
  const presaleAllocation = await token.PRESALE_ALLOCATION();
  await token.transfer(presale.address, presaleAllocation);
  console.log("✅ Transferred presale allocation");

  // Verify contracts on Etherscan
  console.log("\n🔍 Verifying contracts on Etherscan...");
  
  try {
    await hre.run("verify:verify", {
      address: token.address,
      constructorArguments: [],
    });
    console.log("✅ PronovaToken verified");
  } catch (error) {
    console.log("❌ PronovaToken verification failed:", error.message);
  }

  // Summary
  console.log("\n📊 Deployment Summary:");
  console.log("========================");
  console.log("PronovaToken:", token.address);
  console.log("PronovaPresale:", presale.address);
  console.log("PronovaVesting:", vesting.address);
  console.log("========================");
  
  // Save addresses to file
  const fs = require("fs");
  const addresses = {
    PronovaToken: token.address,
    PronovaPresale: presale.address,
    PronovaVesting: vesting.address,
    network: hre.network.name,
    deployer: deployer.address,
    timestamp: new Date().toISOString()
  };
  
  fs.writeFileSync(
    `./deployments/${hre.network.name}-addresses.json`,
    JSON.stringify(addresses, null, 2)
  );
  
  console.log("\n✅ Addresses saved to deployments folder");
  console.log("\n🎉 Deployment complete!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });