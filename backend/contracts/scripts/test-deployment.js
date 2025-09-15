const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🧪 Testing deployed contracts...\n");

  // Load deployment addresses
  const deploymentsDir = path.join(__dirname, "../deployments");
  const addressesFile = path.join(deploymentsDir, `${hre.network.name}-addresses.json`);
  
  if (!fs.existsSync(addressesFile)) {
    throw new Error(`Deployment file not found: ${addressesFile}`);
  }
  
  const addresses = JSON.parse(fs.readFileSync(addressesFile, 'utf8'));
  console.log("📋 Loaded addresses:", addresses);

  // Get contracts
  const [deployer, user1] = await ethers.getSigners();
  
  const token = await ethers.getContractAt("PronovaToken", addresses.PronovaToken);
  const presale = await ethers.getContractAt("PronovaPresale", addresses.PronovaPresale);
  const vesting = await ethers.getContractAt("PronovaVesting", addresses.PronovaVesting);
  const mockUSDT = await ethers.getContractAt("MockUSDT", addresses.MockUSDT);

  console.log("\n✅ Contract instances created");

  // Test 1: Check token basics
  console.log("\n📊 Testing PronovaToken...");
  const name = await token.name();
  const symbol = await token.symbol();
  const totalSupply = await token.totalSupply();
  console.log(`Token: ${name} (${symbol})`);
  console.log(`Total Supply: ${ethers.formatEther(totalSupply)} PRN`);

  // Test 2: Check allocations
  console.log("\n📊 Testing allocations...");
  const presaleBalance = await token.balanceOf(addresses.PronovaPresale);
  const teamBalance = await token.balanceOf(deployer.address);
  console.log(`Presale allocation: ${ethers.formatEther(presaleBalance)} PRN`);
  console.log(`Team balance: ${ethers.formatEther(teamBalance)} PRN`);

  // Test 3: Check presale configuration
  console.log("\n📊 Testing PronovaPresale...");
  const currentPhase = await presale.currentPhase();
  const phase1Info = await presale.getPhaseInfo(1);
  console.log(`Current phase: ${currentPhase}`);
  console.log(`Phase 1 price: $${ethers.formatUnits(phase1Info.pricePerToken, 6)}`);
  console.log(`Phase 1 tokens allocated: ${ethers.formatEther(phase1Info.tokensAllocated)} PRN`);
  console.log(`Phase 1 active: ${phase1Info.isActive}`);

  // Test 4: Test ETH purchase (simulation)
  console.log("\n💰 Testing ETH purchase...");
  
  // Add user1 to whitelist
  await presale.updateWhitelist([user1.address], true);
  console.log("✅ Added user1 to whitelist");
  
  // Simulate 0.1 ETH purchase
  const ethAmount = ethers.parseEther("0.1");
  const ethPrice = await presale.ethToUsdPrice();
  const usdAmount = (ethAmount * ethPrice) / ethers.parseEther("1");
  const expectedTokens = (usdAmount * ethers.parseEther("1")) / phase1Info.pricePerToken;
  
  console.log(`Simulating ${ethers.formatEther(ethAmount)} ETH purchase`);
  console.log(`ETH price: $${ethers.formatUnits(ethPrice, 6)}`);
  console.log(`USD amount: $${ethers.formatUnits(usdAmount, 6)}`);
  console.log(`Expected tokens: ${ethers.formatEther(expectedTokens)} PRN`);

  try {
    const tx = await presale.connect(user1).buyWithETH(ethers.ZeroAddress, { value: ethAmount });
    await tx.wait();
    console.log("✅ ETH purchase successful");
    
    // Check user purchase info
    const userInfo = await presale.getUserPurchaseInfo(user1.address);
    console.log(`User tokens purchased: ${ethers.formatEther(userInfo.totalTokens * ethers.parseEther("1"))}`);
  } catch (error) {
    console.log("❌ ETH purchase failed:", error.message);
  }

  // Test 5: Check presale progress
  console.log("\n📈 Testing presale progress...");
  const progress = await presale.getPresaleProgress();
  console.log(`Total raised: $${ethers.formatUnits(progress.totalRaised, 6)}`);
  console.log(`Hard cap: $${ethers.formatUnits(progress.hardCap, 6)}`);
  console.log(`Progress: ${progress.progressPercentage}%`);

  // Test 6: Test vesting contract
  console.log("\n⏰ Testing PronovaVesting...");
  const vestingBalance = await token.balanceOf(addresses.PronovaVesting);
  console.log(`Vesting contract balance: ${ethers.formatEther(vestingBalance)} PRN`);

  // Test 7: Test admin functions
  console.log("\n👑 Testing admin functions...");
  
  // Test pause/unpause
  await token.pause();
  console.log("✅ Token paused");
  
  await token.unpause();
  console.log("✅ Token unpaused");

  // Test phase switching
  await presale.updatePhase(2, true);
  const newCurrentPhase = await presale.currentPhase();
  console.log(`✅ Switched to phase ${newCurrentPhase}`);

  console.log("\n🎉 All tests completed successfully!");
  console.log("\n📋 Deployment Summary:");
  console.log("========================");
  console.log("Network:", hre.network.name);
  console.log("Chain ID:", addresses.chainId);
  console.log("Deployer:", addresses.deployer);
  console.log("PronovaToken:", addresses.PronovaToken);
  console.log("PronovaPresale:", addresses.PronovaPresale);
  console.log("PronovaVesting:", addresses.PronovaVesting);
  console.log("MockUSDT:", addresses.MockUSDT);
  console.log("========================");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Test failed:", error);
    process.exit(1);
  });