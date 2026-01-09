/**
 * STEP 1: Set Allocation Wallets
 *
 * This script sets all allocation wallets on the PronovaToken contract.
 * Requires 2 admin confirmations (run twice with different admin keys).
 *
 * Usage:
 *   First admin:  set PRIVATE_KEY=<admin1_key> && npx hardhat run scripts/setup-1-set-wallets.js --network bscTestnet
 *   Second admin: set PRIVATE_KEY=<admin2_key> && npx hardhat run scripts/setup-1-set-wallets.js --network bscTestnet
 */

const hre = require("hardhat");
require("dotenv").config();

const CONTRACTS = {
  TOKEN: "0xa3896C07c4e7D9771e9E3417b7352fBD14704253",
  PRESALE: "0x29Ffc342bE650C1ce3e4e102AfB2285FD29f7cF5",
  VESTING: "0xd8Cce8EE40B8BdE0f220DCa8084Cd7CeF423bD2a"
};

const WALLETS = {
  FOUNDERS: "0x27091d9ee966d21CE26756Ac56c4e701b2832ca5",
  TEAM: "0xc77CE346B515d30008Be050Fa8358bA599E704A4",
  PARTNERSHIPS: "0xCCBD97E46CE45936f327398bFe3AECB546AD6DFA",
  LIQUIDITY: "0xb5D628943a0601ccc501FC47f7E45464758D547a",
  COMMUNITY: "0x7A1138433e0C2080827F44f7Bd7C6f56c37a7274",
  STRATEGIC: "0x117fa5FB9dC11c44fE4b3AA2F64CF3F8750847fa",
  MARKETING: "0x8dF71232dd9a9845Ea54D063A019fc483538E9D5"
};

async function main() {
  console.log("\n" + "=".repeat(60));
  console.log("STEP 1: SET ALLOCATION WALLETS");
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

  // Check current state
  console.log("Checking current state...");
  const presaleContract = await token.presaleContract();
  const allocationsDistributed = await token.allocationsDistributed();

  if (presaleContract !== "0x0000000000000000000000000000000000000000") {
    console.log("\n✅ ALREADY COMPLETE: Wallets are already set.");
    console.log("   Presale contract:", presaleContract);
    console.log("\n   Proceed to Step 2: setup-2-distribute.js");
    return;
  }

  if (allocationsDistributed) {
    console.log("\n⚠️  Allocations already distributed. Cannot change wallets.");
    return;
  }

  // Execute setAllocationWallets
  console.log("\nCalling setAllocationWallets...");
  console.log("   Presale:", CONTRACTS.PRESALE);
  console.log("   Founders:", WALLETS.FOUNDERS);
  console.log("   Liquidity:", WALLETS.LIQUIDITY);
  console.log("   Partnerships:", WALLETS.PARTNERSHIPS);
  console.log("   Team:", WALLETS.TEAM);
  console.log("   Community:", WALLETS.COMMUNITY);
  console.log("   Strategic:", WALLETS.STRATEGIC);
  console.log("   Marketing:", WALLETS.MARKETING);
  console.log("   Vesting:", CONTRACTS.VESTING);

  try {
    const tx = await token.setAllocationWallets(
      CONTRACTS.PRESALE,
      WALLETS.FOUNDERS,
      WALLETS.LIQUIDITY,
      WALLETS.PARTNERSHIPS,
      WALLETS.TEAM,
      WALLETS.COMMUNITY,
      WALLETS.STRATEGIC,
      WALLETS.MARKETING,
      CONTRACTS.VESTING,
      { gasLimit: 500000 }
    );

    console.log("\nTransaction sent:", tx.hash);
    console.log("Waiting for confirmation...");

    const receipt = await tx.wait();
    console.log("Confirmed in block:", receipt.blockNumber);

    // Check result
    const newPresaleContract = await token.presaleContract();

    if (newPresaleContract !== "0x0000000000000000000000000000000000000000") {
      console.log("\n" + "=".repeat(60));
      console.log("✅ SUCCESS! Wallets have been set (2nd confirmation received)");
      console.log("=".repeat(60));
      console.log("\nNext: Run setup-2-distribute.js");
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
