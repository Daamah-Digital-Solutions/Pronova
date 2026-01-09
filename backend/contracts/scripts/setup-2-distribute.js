/**
 * STEP 2: Distribute Token Allocations
 *
 * This script distributes tokens to all allocation wallets.
 * Requires 2 admin confirmations (run twice with different admin keys).
 *
 * PREREQUISITE: Step 1 (set-wallets) must be complete first.
 *
 * Usage:
 *   First admin:  set PRIVATE_KEY=<admin1_key> && npx hardhat run scripts/setup-2-distribute.js --network bscTestnet
 *   Second admin: set PRIVATE_KEY=<admin2_key> && npx hardhat run scripts/setup-2-distribute.js --network bscTestnet
 */

const hre = require("hardhat");
require("dotenv").config();

const CONTRACTS = {
  TOKEN: "0xa3896C07c4e7D9771e9E3417b7352fBD14704253",
  PRESALE: "0x29Ffc342bE650C1ce3e4e102AfB2285FD29f7cF5",
  VESTING: "0xd8Cce8EE40B8BdE0f220DCa8084Cd7CeF423bD2a"
};

async function main() {
  console.log("\n" + "=".repeat(60));
  console.log("STEP 2: DISTRIBUTE TOKEN ALLOCATIONS");
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

  // Load contract
  const tokenArtifact = await hre.artifacts.readArtifact("PronovaToken");
  const token = new hre.ethers.Contract(CONTRACTS.TOKEN, tokenArtifact.abi, signer);

  // Check prerequisites
  console.log("Checking prerequisites...");
  const presaleContract = await token.presaleContract();
  const allocationsDistributed = await token.allocationsDistributed();

  if (presaleContract === "0x0000000000000000000000000000000000000000") {
    console.log("\n❌ PREREQUISITE NOT MET: Wallets not set yet.");
    console.log("   Run setup-1-set-wallets.js first (with both admins).");
    return;
  }

  if (allocationsDistributed) {
    console.log("\n✅ ALREADY COMPLETE: Allocations already distributed.");

    // Show current balances
    const presaleBalance = await token.balanceOf(CONTRACTS.PRESALE);
    const vestingBalance = await token.balanceOf(CONTRACTS.VESTING);

    console.log("\nCurrent balances:");
    console.log("   Presale contract:", hre.ethers.formatEther(presaleBalance), "PRN");
    console.log("   Vesting contract:", hre.ethers.formatEther(vestingBalance), "PRN");
    console.log("\n   Proceed to Step 3: setup-3-vesting.js");
    return;
  }

  console.log("✅ Prerequisites met. Wallets are set.");

  // Execute distributeAllocations
  console.log("\nCalling distributeAllocations...");
  console.log("This will transfer tokens to:");
  console.log("   - Presale contract (250M PRN)");
  console.log("   - Vesting contract (340M PRN for Founders+Team+Partnerships)");
  console.log("   - Liquidity wallet (150M PRN)");
  console.log("   - Community wallet (80M PRN)");
  console.log("   - Strategic wallet (60M PRN)");
  console.log("   - Marketing wallet (120M PRN)");

  try {
    const tx = await token.distributeAllocations({ gasLimit: 1000000 });

    console.log("\nTransaction sent:", tx.hash);
    console.log("Waiting for confirmation...");

    const receipt = await tx.wait();
    console.log("Confirmed in block:", receipt.blockNumber);

    // Check result
    const newAllocationsDistributed = await token.allocationsDistributed();

    if (newAllocationsDistributed) {
      console.log("\n" + "=".repeat(60));
      console.log("✅ SUCCESS! Allocations have been distributed");
      console.log("=".repeat(60));

      // Show balances
      const presaleBalance = await token.balanceOf(CONTRACTS.PRESALE);
      const vestingBalance = await token.balanceOf(CONTRACTS.VESTING);

      console.log("\nNew balances:");
      console.log("   Presale contract:", hre.ethers.formatEther(presaleBalance), "PRN");
      console.log("   Vesting contract:", hre.ethers.formatEther(vestingBalance), "PRN");
      console.log("\nNext: Run setup-3-vesting.js");
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
    } else if (error.message.includes("Already distributed")) {
      console.log("\n✅ Allocations already distributed.");
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
