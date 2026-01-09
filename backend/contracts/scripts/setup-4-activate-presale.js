/**
 * STEP 4: Activate Presale Phase 1
 *
 * This script activates Phase 1 of the presale.
 * Requires 2 admin confirmations (run twice with different admin keys).
 *
 * PREREQUISITE: Steps 1-3 should be complete first.
 *
 * Usage:
 *   First admin:  set PRIVATE_KEY=<admin1_key> && npx hardhat run scripts/setup-4-activate-presale.js --network bscTestnet
 *   Second admin: set PRIVATE_KEY=<admin2_key> && npx hardhat run scripts/setup-4-activate-presale.js --network bscTestnet
 */

const hre = require("hardhat");
require("dotenv").config();

const CONTRACTS = {
  TOKEN: "0xa3896C07c4e7D9771e9E3417b7352fBD14704253",
  PRESALE: "0x29Ffc342bE650C1ce3e4e102AfB2285FD29f7cF5"
};

async function main() {
  console.log("\n" + "=".repeat(60));
  console.log("STEP 4: ACTIVATE PRESALE PHASE 1");
  console.log("=".repeat(60) + "\n");

  // Setup
  if (!process.env.PRIVATE_KEY) {
    throw new Error("PRIVATE_KEY not set. Use: set PRIVATE_KEY=<key>");
  }

  const provider = new hre.ethers.JsonRpcProvider(hre.config.networks.bscTestnet.url);
  const signer = new hre.ethers.Wallet(process.env.PRIVATE_KEY, provider);

  console.log("Wallet:", signer.address);
  const balance = await provider.getBalance(signer.address);
  console.log("Balance:", hre.ethers.formatEther(balance), "BNB\n");

  if (balance === 0n) {
    throw new Error("Wallet has no BNB for gas. Get testnet BNB from faucet.");
  }

  // Load contracts
  const tokenArtifact = await hre.artifacts.readArtifact("PronovaToken");
  const presaleArtifact = await hre.artifacts.readArtifact("PronovaPresale");

  const token = new hre.ethers.Contract(CONTRACTS.TOKEN, tokenArtifact.abi, signer);
  const presale = new hre.ethers.Contract(CONTRACTS.PRESALE, presaleArtifact.abi, signer);

  // Check prerequisites
  console.log("Checking prerequisites...");
  const allocationsDistributed = await token.allocationsDistributed();

  if (!allocationsDistributed) {
    console.log("\n⚠️  WARNING: Allocations not distributed yet.");
    console.log("   Presale will work but tokens won't be available for purchase.");
    console.log("   Consider running setup-2-distribute.js first.\n");
  }

  // Check presale contract has tokens
  const presaleBalance = await token.balanceOf(CONTRACTS.PRESALE);
  console.log("Presale contract balance:", hre.ethers.formatEther(presaleBalance), "PRN");

  // Check current phase status
  const currentPhase = await presale.currentPhase();
  const phaseInfo = await presale.phases(1);

  console.log("\nCurrent state:");
  console.log("   Current phase:", currentPhase.toString());
  console.log("   Phase 1 active:", phaseInfo.isActive);
  console.log("   Phase 1 price:", hre.ethers.formatUnits(phaseInfo.pricePerToken, 6), "USD");
  console.log("   Phase 1 allocation:", hre.ethers.formatEther(phaseInfo.tokensAllocated), "PRN");
  console.log("   Phase 1 sold:", hre.ethers.formatEther(phaseInfo.tokensSold), "PRN");

  if (phaseInfo.isActive) {
    console.log("\n✅ ALREADY COMPLETE: Phase 1 is already active!");
    console.log("\n" + "=".repeat(60));
    console.log("🎉 PRESALE IS LIVE!");
    console.log("=".repeat(60));
    console.log("\nUsers can now purchase tokens at $0.80 per PRN");
    return;
  }

  // Activate Phase 1 using updatePhase
  console.log("\nCalling updatePhase(1, true) to activate Phase 1...");

  try {
    const tx = await presale.updatePhase(1, true, { gasLimit: 500000 });

    console.log("\nTransaction sent:", tx.hash);
    console.log("Waiting for confirmation...");

    const receipt = await tx.wait();
    console.log("Confirmed in block:", receipt.blockNumber);

    // Check result
    const newPhaseInfo = await presale.phases(1);

    if (newPhaseInfo.isActive) {
      console.log("\n" + "=".repeat(60));
      console.log("🎉 SUCCESS! PRESALE PHASE 1 IS NOW ACTIVE!");
      console.log("=".repeat(60));
      console.log("\nPresale Details:");
      console.log("   Price: $0.80 per PRN");
      console.log("   Available:", hre.ethers.formatEther(phaseInfo.tokensAllocated - phaseInfo.tokensSold), "PRN");
      console.log("   Min purchase: $", hre.ethers.formatUnits(phaseInfo.minPurchase, 6));
      console.log("   Max purchase: $", hre.ethers.formatUnits(phaseInfo.maxPurchase, 6));
      console.log("\n✅ ALL SETUP COMPLETE! Ready for deployment to server.");
    } else {
      console.log("\n" + "=".repeat(60));
      console.log("⏳ FIRST CONFIRMATION RECORDED");
      console.log("=".repeat(60));
      console.log("\nWaiting for second admin to confirm.");
      console.log("Run this script again with the OTHER admin's private key.");
    }
  } catch (error) {
    if (error.message.includes("Already confirmed") || error.message.includes("already confirmed")) {
      console.log("\n⚠️  You already confirmed this operation.");
      console.log("   Need the OTHER admin to run this script.");
    } else if (error.message.includes("Already executed")) {
      console.log("\n✅ Phase activation already executed.");
    } else {
      console.error("\n❌ Error:", error.message);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
