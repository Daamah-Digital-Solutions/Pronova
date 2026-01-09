/**
 * STEP 3: Setup Vesting Schedules
 *
 * This script creates vesting schedules for Founders, Team, and Partnerships.
 * Requires 2 admin confirmations (run twice with different admin keys).
 *
 * PREREQUISITE: Step 2 (distribute) must be complete first.
 *
 * Usage:
 *   First admin:  set PRIVATE_KEY=<admin1_key> && npx hardhat run scripts/setup-3-vesting.js --network bscTestnet
 *   Second admin: set PRIVATE_KEY=<admin2_key> && npx hardhat run scripts/setup-3-vesting.js --network bscTestnet
 */

const hre = require("hardhat");
require("dotenv").config();

const CONTRACTS = {
  TOKEN: "0xa3896C07c4e7D9771e9E3417b7352fBD14704253",
  VESTING: "0xd8Cce8EE40B8BdE0f220DCa8084Cd7CeF423bD2a"
};

const WALLETS = {
  FOUNDERS: "0x27091d9ee966d21CE26756Ac56c4e701b2832ca5",
  TEAM: "0xc77CE346B515d30008Be050Fa8358bA599E704A4",
  PARTNERSHIPS: "0xCCBD97E46CE45936f327398bFe3AECB546AD6DFA"
};

async function main() {
  console.log("\n" + "=".repeat(60));
  console.log("STEP 3: SETUP VESTING SCHEDULES");
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
  const vestingArtifact = await hre.artifacts.readArtifact("PronovaVesting");

  const token = new hre.ethers.Contract(CONTRACTS.TOKEN, tokenArtifact.abi, signer);
  const vesting = new hre.ethers.Contract(CONTRACTS.VESTING, vestingArtifact.abi, signer);

  // Check prerequisites
  console.log("Checking prerequisites...");
  const allocationsDistributed = await token.allocationsDistributed();

  if (!allocationsDistributed) {
    console.log("\n❌ PREREQUISITE NOT MET: Allocations not distributed yet.");
    console.log("   Run setup-2-distribute.js first (with both admins).");
    return;
  }

  // Check vesting contract token balance
  const vestingBalance = await token.balanceOf(CONTRACTS.VESTING);
  console.log("Vesting contract balance:", hre.ethers.formatEther(vestingBalance), "PRN");

  if (vestingBalance === 0n) {
    console.log("\n❌ Vesting contract has no tokens. Something went wrong in distribution.");
    return;
  }

  // Check if vesting already set up by checking allocation amounts
  try {
    const foundersAllocation = await vesting.allocationAmounts("FOUNDERS");
    if (foundersAllocation > 0n) {
      console.log("\n✅ ALREADY COMPLETE: Vesting schedules already set up.");
      console.log("   Founders allocation:", hre.ethers.formatEther(foundersAllocation), "PRN");
      console.log("\n   Proceed to Step 4: setup-4-activate-presale.js");
      return;
    }
  } catch (e) {
    // allocationAmounts might not exist or return 0, continue
  }

  console.log("✅ Prerequisites met. Setting up vesting schedules...");

  // Execute setupWhitepaperAllocations
  // Note: This function takes exactly 3 parameters
  console.log("\nCalling setupWhitepaperAllocations...");
  console.log("   Founders wallet:", WALLETS.FOUNDERS, "(140M PRN, 45% locked 9 years)");
  console.log("   Team wallet:", WALLETS.TEAM, "(50M PRN, 45% locked 9 years)");
  console.log("   Partnerships wallet:", WALLETS.PARTNERSHIPS, "(150M PRN, 45% locked 9 years)");

  try {
    const tx = await vesting.setupWhitepaperAllocations(
      WALLETS.FOUNDERS,
      WALLETS.TEAM,
      WALLETS.PARTNERSHIPS,
      { gasLimit: 1500000 }
    );

    console.log("\nTransaction sent:", tx.hash);
    console.log("Waiting for confirmation...");

    const receipt = await tx.wait();
    console.log("Confirmed in block:", receipt.blockNumber);

    // Check result
    let vestingComplete = false;
    try {
      const foundersAllocation = await vesting.allocationAmounts("FOUNDERS");
      vestingComplete = foundersAllocation > 0n;
    } catch (e) {
      // Check events instead
      const events = receipt.logs.filter(log => {
        try {
          return vesting.interface.parseLog(log)?.name === "OperationExecuted";
        } catch { return false; }
      });
      vestingComplete = events.length > 0;
    }

    if (vestingComplete) {
      console.log("\n" + "=".repeat(60));
      console.log("✅ SUCCESS! Vesting schedules have been created");
      console.log("=".repeat(60));
      console.log("\nVesting details:");
      console.log("   - 55% immediately claimable");
      console.log("   - 45% locked for 9 years (2.5% unlocks every 6 months)");
      console.log("\nNext: Run setup-4-activate-presale.js");
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
      console.log("\n✅ Vesting already set up.");
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
