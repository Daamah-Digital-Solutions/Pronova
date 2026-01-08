/**
 * Complete Setup Script for Pronova Contracts
 *
 * This script completes the multi-sig setup for the deployed contracts.
 *
 * IMPORTANT: This script must be run TWICE with different admin private keys:
 *   1. First run with ADMIN1 private key
 *   2. Second run with ADMIN2 private key
 *
 * Usage:
 *   PRIVATE_KEY=<admin1_key> npx hardhat run scripts/complete-setup.js --network bscTestnet
 *   PRIVATE_KEY=<admin2_key> npx hardhat run scripts/complete-setup.js --network bscTestnet
 */

const hre = require("hardhat");
require("dotenv").config();

// Deployed contract addresses (from bscTestnet-deployment-1762872894997.json)
const CONTRACTS = {
  TOKEN: "0xa3896C07c4e7D9771e9E3417b7352fBD14704253",
  PRESALE: "0x29Ffc342bE650C1ce3e4e102AfB2285FD29f7cF5",
  VESTING: "0xd8Cce8EE40B8BdE0f220DCa8084Cd7CeF423bD2a",
  USDT: "0xbcA887cE632E642DA28aF66433A70B62925F4a08"
};

// Wallet addresses (from deployment)
const WALLETS = {
  TREASURY: "0x0490bac2D0F032d206d50EE3e8ba70E8287A1413",
  ADMIN1: "0xc52ca59C5dA00e1c3fe74c27524692b2918E15b7",
  ADMIN2: "0xC81482651055c5a9181ea6986b0607C174e4011d",
  FOUNDERS: "0x27091d9ee966d21CE26756Ac56c4e701b2832ca5",
  TEAM: "0xc77CE346B515d30008Be050Fa8358bA599E704A4",
  PARTNERSHIPS: "0xCCBD97E46CE45936f327398bFe3AECB546AD6DFA",
  LIQUIDITY: "0xb5D628943a0601ccc501FC47f7E45464758D547a",
  COMMUNITY: "0x7A1138433e0C2080827F44f7Bd7C6f56c37a7274",
  STRATEGIC: "0x117fa5FB9dC11c44fE4b3AA2F64CF3F8750847fa",
  MARKETING: "0x8dF71232dd9a9845Ea54D063A019fc483538E9D5"
};

async function main() {
  console.log("🔧 Pronova Contract Setup Script\n");
  console.log("=".repeat(50));

  // Get signer
  if (!process.env.PRIVATE_KEY) {
    throw new Error("PRIVATE_KEY not found in .env file");
  }

  const provider = new hre.ethers.JsonRpcProvider(
    hre.config.networks.bscTestnet.url
  );
  const signer = new hre.ethers.Wallet(process.env.PRIVATE_KEY, provider);

  console.log("Connected wallet:", signer.address);
  console.log("Balance:", hre.ethers.formatEther(await provider.getBalance(signer.address)), "BNB\n");

  // Check if this is Admin1 or Admin2
  const isAdmin1 = signer.address.toLowerCase() === WALLETS.ADMIN1.toLowerCase();
  const isAdmin2 = signer.address.toLowerCase() === WALLETS.ADMIN2.toLowerCase();
  const isDeployer = !isAdmin1 && !isAdmin2;

  if (isDeployer) {
    console.log("⚠️  Running as DEPLOYER (original deployer wallet)");
  } else {
    console.log(`✅ Running as ${isAdmin1 ? 'ADMIN1' : 'ADMIN2'}`);
  }
  console.log("");

  // Load contract ABIs
  const tokenArtifact = await hre.artifacts.readArtifact("PronovaToken");
  const presaleArtifact = await hre.artifacts.readArtifact("PronovaPresale");
  const vestingArtifact = await hre.artifacts.readArtifact("PronovaVesting");

  // Connect to contracts
  const token = new hre.ethers.Contract(CONTRACTS.TOKEN, tokenArtifact.abi, signer);
  const presale = new hre.ethers.Contract(CONTRACTS.PRESALE, presaleArtifact.abi, signer);
  const vesting = new hre.ethers.Contract(CONTRACTS.VESTING, vestingArtifact.abi, signer);

  // Check current status
  console.log("📊 Checking current status...\n");

  const allocationsDistributed = await token.allocationsDistributed();
  console.log("Token allocations distributed:", allocationsDistributed);

  const presaleContract = await token.presaleContract();
  console.log("Presale contract set:", presaleContract !== "0x0000000000000000000000000000000000000000");

  // Check presale phase
  const currentPhase = await presale.currentPhase();
  const phaseInfo = await presale.phases(currentPhase);
  console.log("Current presale phase:", currentPhase.toString());
  console.log("Phase active:", phaseInfo.isActive);
  console.log("");

  // ============================================
  // STEP 1: Set Allocation Wallets (needs 2 confirmations)
  // ============================================
  if (!allocationsDistributed && presaleContract === "0x0000000000000000000000000000000000000000") {
    console.log("📝 STEP 1: Setting allocation wallets...");
    console.log("   (Requires 2 admin confirmations)\n");

    try {
      const tx = await token.setAllocationWallets(
        CONTRACTS.PRESALE,      // presale contract
        WALLETS.FOUNDERS,       // founders wallet
        WALLETS.LIQUIDITY,      // liquidity wallet
        WALLETS.PARTNERSHIPS,   // partnerships wallet
        WALLETS.TEAM,           // team wallet
        WALLETS.COMMUNITY,      // community wallet
        WALLETS.STRATEGIC,      // strategic reserves wallet
        WALLETS.MARKETING,      // marketing wallet
        CONTRACTS.VESTING       // vesting contract
      );

      console.log("   Transaction sent:", tx.hash);
      const receipt = await tx.wait();
      console.log("   ✅ Confirmed in block:", receipt.blockNumber);

      // Check if executed or just confirmed
      const newPresaleContract = await token.presaleContract();
      if (newPresaleContract !== "0x0000000000000000000000000000000000000000") {
        console.log("   ✅ Wallets set successfully (2nd confirmation received)!\n");
      } else {
        console.log("   ⏳ First confirmation received. Need second admin to confirm.\n");
      }
    } catch (error) {
      if (error.message.includes("already confirmed")) {
        console.log("   ℹ️  You already confirmed this operation.\n");
      } else {
        console.error("   ❌ Error:", error.message, "\n");
      }
    }
  } else if (presaleContract !== "0x0000000000000000000000000000000000000000") {
    console.log("✅ STEP 1: Allocation wallets already set\n");
  }

  // ============================================
  // STEP 2: Distribute Allocations (needs 2 confirmations)
  // ============================================
  const presaleContractCheck = await token.presaleContract();
  if (presaleContractCheck !== "0x0000000000000000000000000000000000000000" && !allocationsDistributed) {
    console.log("📝 STEP 2: Distributing token allocations...");
    console.log("   (Requires 2 admin confirmations)\n");

    try {
      const tx = await token.distributeAllocations();
      console.log("   Transaction sent:", tx.hash);
      const receipt = await tx.wait();
      console.log("   ✅ Confirmed in block:", receipt.blockNumber);

      const newAllocationsDistributed = await token.allocationsDistributed();
      if (newAllocationsDistributed) {
        console.log("   ✅ Allocations distributed successfully!\n");
      } else {
        console.log("   ⏳ First confirmation received. Need second admin to confirm.\n");
      }
    } catch (error) {
      if (error.message.includes("already confirmed")) {
        console.log("   ℹ️  You already confirmed this operation.\n");
      } else {
        console.error("   ❌ Error:", error.message, "\n");
      }
    }
  } else if (allocationsDistributed) {
    console.log("✅ STEP 2: Allocations already distributed\n");
  } else {
    console.log("⏳ STEP 2: Waiting for Step 1 to complete first\n");
  }

  // ============================================
  // STEP 3: Setup Vesting Schedules
  // ============================================
  const allocDistCheck = await token.allocationsDistributed();
  if (allocDistCheck) {
    console.log("📝 STEP 3: Setting up vesting schedules...");

    try {
      // Check if vesting already has schedules
      const vestingInfo = await vesting.getVestingScheduleCount();
      console.log("   Current vesting schedules:", vestingInfo.toString());

      if (vestingInfo.toString() === "0") {
        // Setup whitepaper allocations
        const tx = await vesting.setupWhitepaperAllocations(
          WALLETS.FOUNDERS,
          WALLETS.TEAM,
          WALLETS.PARTNERSHIPS,
          WALLETS.STRATEGIC
        );
        console.log("   Transaction sent:", tx.hash);
        const receipt = await tx.wait();
        console.log("   ✅ Vesting schedules created in block:", receipt.blockNumber, "\n");
      } else {
        console.log("   ✅ Vesting schedules already set up\n");
      }
    } catch (error) {
      if (error.message.includes("already confirmed")) {
        console.log("   ⏳ First confirmation received. Need second admin to confirm.\n");
      } else {
        console.error("   ❌ Error:", error.message, "\n");
      }
    }
  } else {
    console.log("⏳ STEP 3: Waiting for Step 2 to complete first\n");
  }

  // ============================================
  // STEP 4: Enable Presale Phase 1
  // ============================================
  const phaseInfoCheck = await presale.phases(1);
  if (!phaseInfoCheck.isActive) {
    console.log("📝 STEP 4: Enabling Presale Phase 1...\n");

    try {
      // Set phase times (start now, end in 90 days)
      const startTime = Math.floor(Date.now() / 1000);
      const endTime = startTime + (90 * 24 * 60 * 60); // 90 days

      const tx = await presale.setPhaseTime(1, startTime, endTime);
      console.log("   Setting phase time, tx:", tx.hash);
      await tx.wait();

      const tx2 = await presale.setPhaseActive(1, true);
      console.log("   Activating phase, tx:", tx2.hash);
      await tx2.wait();

      console.log("   ✅ Presale Phase 1 is now ACTIVE!\n");
    } catch (error) {
      console.error("   ❌ Error:", error.message, "\n");
    }
  } else {
    console.log("✅ STEP 4: Presale Phase 1 already active\n");
  }

  // ============================================
  // Final Status Check
  // ============================================
  console.log("=".repeat(50));
  console.log("📊 FINAL STATUS CHECK\n");

  const finalAllocations = await token.allocationsDistributed();
  const finalPresale = await token.presaleContract();
  const finalPhase = await presale.phases(1);
  const tokenBalance = await token.balanceOf(CONTRACTS.PRESALE);

  console.log("✅ Allocations distributed:", finalAllocations);
  console.log("✅ Presale contract linked:", finalPresale !== "0x0000000000000000000000000000000000000000");
  console.log("✅ Phase 1 active:", finalPhase.isActive);
  console.log("✅ Presale token balance:", hre.ethers.formatEther(tokenBalance), "PRN");

  console.log("\n" + "=".repeat(50));

  if (finalAllocations && finalPhase.isActive) {
    console.log("🎉 SETUP COMPLETE! Ready for testnet launch!");
  } else {
    console.log("⏳ Setup incomplete. Run this script with the other admin wallet.");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
