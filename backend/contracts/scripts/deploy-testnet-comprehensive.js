const hre = require("hardhat");
require("dotenv").config();

async function main() {
  console.log("🚀 Starting Pronova COMPREHENSIVE testnet deployment...\n");

  // Get deployer wallet directly from PRIVATE_KEY
  if (!process.env.PRIVATE_KEY) {
    throw new Error("PRIVATE_KEY not found in .env file");
  }

  const provider = new hre.ethers.JsonRpcProvider(
    hre.config.networks.bscTestnet.url
  );
  const deployer = new hre.ethers.Wallet(process.env.PRIVATE_KEY, provider);

  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", hre.ethers.formatEther(await provider.getBalance(deployer.address)), "BNB\n");

  // Wallet addresses (from user input)
  const TREASURY = "0x0490bac2D0F032d206d50EE3e8ba70E8287A1413";
  const ADMIN1 = "0xc52ca59C5dA00e1c3fe74c27524692b2918E15b7";
  const ADMIN2 = "0xC81482651055c5a9181ea6986b0607C174e4011d";
  const FOUNDERS = "0x27091d9ee966d21CE26756Ac56c4e701b2832ca5";
  const TEAM = "0xc77CE346B515d30008Be050Fa8358bA599E704A4";
  const PARTNERSHIPS = "0xCCBD97E46CE45936f327398bFe3AECB546AD6DFA";
  const LIQUIDITY = "0xb5D628943a0601ccc501FC47f7E45464758D547a";
  const COMMUNITY = "0x7A1138433e0C2080827F44f7Bd7C6f56c37a7274";
  const STRATEGIC = "0x117fa5FB9dC11c44fE4b3AA2F64CF3F8750847fa";
  const MARKETING = "0x8dF71232dd9a9845Ea54D063A019fc483538E9D5";

  // Check if USDT address is provided, otherwise deploy mock
  let usdtAddress = process.env.USDT_ADDRESS_TESTNET;

  if (!usdtAddress || usdtAddress === '' || usdtAddress === 'undefined') {
    console.log("⚠️  No USDT address found, deploying MockUSDT...");
    const MockUSDT = await hre.ethers.getContractFactory("MockUSDT", deployer);
    const mockUSDT = await MockUSDT.deploy();
    await mockUSDT.waitForDeployment();
    usdtAddress = mockUSDT.target;
    console.log("✅ MockUSDT deployed to:", usdtAddress, "\n");
  } else {
    console.log("Using existing USDT:", usdtAddress, "\n");
  }

  // ============================================
  // PHASE 1: DEPLOY CONTRACTS
  // ============================================
  console.log("📦 PHASE 1: DEPLOYING CONTRACTS");
  console.log("================================\n");

  // Deploy PronovaToken with treasury wallet
  console.log("📄 Deploying PronovaToken...");
  const PronovaToken = await hre.ethers.getContractFactory("PronovaToken", deployer);
  const token = await PronovaToken.deploy(TREASURY);
  await token.waitForDeployment();
  const tokenAddress = token.target;
  console.log("✅ PronovaToken deployed:", tokenAddress);
  console.log("   Treasury wallet:", TREASURY, "\n");

  // Deploy PronovaVesting with token and treasury wallet
  console.log("📄 Deploying PronovaVesting...");
  const PronovaVesting = await hre.ethers.getContractFactory("PronovaVesting", deployer);
  const vesting = await PronovaVesting.deploy(tokenAddress, TREASURY);
  await vesting.waitForDeployment();
  const vestingAddress = vesting.target;
  console.log("✅ PronovaVesting deployed:", vestingAddress);
  console.log("   Treasury wallet:", TREASURY, "\n");

  // Deploy PronovaPresale with all parameters
  console.log("📄 Deploying PronovaPresale...");
  const PronovaPresale = await hre.ethers.getContractFactory("PronovaPresale", deployer);
  const presale = await PronovaPresale.deploy(
    tokenAddress,
    usdtAddress,
    TREASURY,
    hre.ethers.ZeroAddress, // ETH price feed (using fallback for testnet)
    hre.ethers.ZeroAddress  // BNB price feed (using fallback for testnet)
  );
  await presale.waitForDeployment();
  const presaleAddress = presale.target;
  console.log("✅ PronovaPresale deployed:", presaleAddress);
  console.log("   Token:", tokenAddress);
  console.log("   USDT:", usdtAddress);
  console.log("   Treasury:", TREASURY);
  console.log("   ETH Feed: ZeroAddress (fallback)");
  console.log("   BNB Feed: ZeroAddress (fallback)\n");

  // ============================================
  // PHASE 2: GRANT ADMIN ROLES
  // ============================================
  console.log("👥 PHASE 2: GRANTING ADMIN ROLES");
  console.log("==================================\n");

  // Grant roles on PronovaToken
  console.log("Setting up PronovaToken roles...");
  const ADMIN_ROLE_TOKEN = await token.ADMIN_ROLE();
  await token.grantRole(ADMIN_ROLE_TOKEN, ADMIN1);
  console.log("✅ Granted ADMIN_ROLE to Admin1:", ADMIN1);
  await token.grantRole(ADMIN_ROLE_TOKEN, ADMIN2);
  console.log("✅ Granted ADMIN_ROLE to Admin2:", ADMIN2, "\n");

  // Grant roles on PronovaVesting
  console.log("Setting up PronovaVesting roles...");
  const ADMIN_ROLE_VESTING = await vesting.ADMIN_ROLE();
  await vesting.grantRole(ADMIN_ROLE_VESTING, ADMIN1);
  console.log("✅ Granted ADMIN_ROLE to Admin1:", ADMIN1);
  await vesting.grantRole(ADMIN_ROLE_VESTING, ADMIN2);
  console.log("✅ Granted ADMIN_ROLE to Admin2:", ADMIN2, "\n");

  // Grant roles on PronovaPresale
  console.log("Setting up PronovaPresale roles...");
  const ADMIN_ROLE_PRESALE = await presale.ADMIN_ROLE();
  await presale.grantRole(ADMIN_ROLE_PRESALE, ADMIN1);
  console.log("✅ Granted ADMIN_ROLE to Admin1:", ADMIN1);
  await presale.grantRole(ADMIN_ROLE_PRESALE, ADMIN2);
  console.log("✅ Granted ADMIN_ROLE to Admin2:", ADMIN2, "\n");

  // ============================================
  // PHASE 3: TOKEN ALLOCATION (MULTI-SIG)
  // ============================================
  console.log("💰 PHASE 3: TOKEN ALLOCATION (MULTI-SIG)");
  console.log("=========================================\n");

  console.log("Setting allocation wallets (requires 2 confirmations)...");
  console.log("Deployer (acting as Admin1) - First confirmation...");

  // First admin sets allocation wallets
  await token.setAllocationWallets(
    presaleAddress,  // Presale
    FOUNDERS,        // Founders
    LIQUIDITY,       // Liquidity
    PARTNERSHIPS,    // Partnerships
    TEAM,            // Team
    COMMUNITY,       // Community
    STRATEGIC,       // Strategic Reserves
    MARKETING,       // Marketing
    vestingAddress   // Vesting contract
  );
  console.log("✅ First confirmation submitted\n");

  console.log("⚠️  NOTE: Second confirmation needed from Admin1 or Admin2 wallet");
  console.log("   Admin1 address:", ADMIN1);
  console.log("   Admin2 address:", ADMIN2);
  console.log("   They need to call: setAllocationWallets() with same parameters\n");

  // ============================================
  // PHASE 4: SAVE DEPLOYMENT INFO
  // ============================================
  console.log("💾 PHASE 4: SAVING DEPLOYMENT INFO");
  console.log("===================================\n");

  const fs = require("fs");
  const path = require("path");

  // Create deployments directory
  const deploymentsDir = path.join(__dirname, "../deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }

  const deploymentInfo = {
    network: hre.network.name,
    chainId: (await deployer.provider.getNetwork()).chainId.toString(),
    deployer: deployer.address,
    timestamp: new Date().toISOString(),

    contracts: {
      PronovaToken: tokenAddress,
      PronovaPresale: presaleAddress,
      PronovaVesting: vestingAddress,
      USDT: usdtAddress
    },

    wallets: {
      treasury: TREASURY,
      admin1: ADMIN1,
      admin2: ADMIN2,
      founders: FOUNDERS,
      team: TEAM,
      partnerships: PARTNERSHIPS,
      liquidity: LIQUIDITY,
      community: COMMUNITY,
      strategic: STRATEGIC,
      marketing: MARKETING
    },

    nextSteps: [
      "1. Admin1 or Admin2 must call setAllocationWallets() with same parameters",
      "2. After 2nd confirmation, Admin must call distributeAllocations() (needs 2 confirmations)",
      "3. Setup vesting schedules: setupWhitepaperAllocations() (needs 2 confirmations)",
      "4. Enable presale phase",
      "5. Test multi-sig flows",
      "6. Verify contracts on BSCScan"
    ]
  };

  const fileName = `${hre.network.name}-deployment-${Date.now()}.json`;
  const filePath = path.join(deploymentsDir, fileName);

  fs.writeFileSync(filePath, JSON.stringify(deploymentInfo, null, 2));
  console.log(`✅ Deployment info saved to: deployments/${fileName}\n`);

  // ============================================
  // DEPLOYMENT SUMMARY
  // ============================================
  console.log("📊 DEPLOYMENT SUMMARY");
  console.log("====================");
  console.log("Network:", hre.network.name);
  console.log("Chain ID:", deploymentInfo.chainId);
  console.log("Deployer:", deployer.address, "\n");

  console.log("📄 Contracts:");
  console.log("  PronovaToken:", tokenAddress);
  console.log("  PronovaPresale:", presaleAddress);
  console.log("  PronovaVesting:", vestingAddress);
  console.log("  USDT:", usdtAddress, "\n");

  console.log("👥 Wallets:");
  console.log("  Treasury:", TREASURY);
  console.log("  Admin1:", ADMIN1);
  console.log("  Admin2:", ADMIN2);
  console.log("  Founders:", FOUNDERS);
  console.log("  Team:", TEAM);
  console.log("  Partnerships:", PARTNERSHIPS);
  console.log("  Liquidity:", LIQUIDITY);
  console.log("  Community:", COMMUNITY);
  console.log("  Strategic:", STRATEGIC);
  console.log("  Marketing:", MARKETING, "\n");

  console.log("🎯 MULTI-SIG STATUS:");
  console.log("  ⏳ Allocation wallets: 1/2 confirmations");
  console.log("  ⏳ Distribution: Not started");
  console.log("  ⏳ Vesting setup: Not started\n");

  console.log("📝 NEXT STEPS (REQUIRES ADMIN1 OR ADMIN2):");
  console.log("==========================================");
  console.log("1. Connect with Admin1 or Admin2 wallet");
  console.log("2. Call setAllocationWallets() with same parameters");
  console.log("3. Call distributeAllocations() twice (2 confirmations)");
  console.log("4. Call setupWhitepaperAllocations() twice (2 confirmations)");
  console.log("5. Run verification: npx hardhat run scripts/verify-deployment.js --network bscTestnet\n");

  console.log("🔗 Contract Verification Commands:");
  console.log("===================================");
  console.log(`npx hardhat verify --network bscTestnet ${tokenAddress} ${TREASURY}`);
  console.log(`npx hardhat verify --network bscTestnet ${vestingAddress} ${tokenAddress} ${TREASURY}`);
  console.log(`npx hardhat verify --network bscTestnet ${presaleAddress} ${tokenAddress} ${usdtAddress} ${TREASURY} ${hre.ethers.ZeroAddress} ${hre.ethers.ZeroAddress}\n`);

  console.log("🎉 DEPLOYMENT PHASE 1 COMPLETE!");
  console.log("================================");
  console.log("⚠️  Multi-sig configuration required before tokens can be distributed");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
