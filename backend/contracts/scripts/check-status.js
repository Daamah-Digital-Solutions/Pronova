/**
 * STATUS CHECK: View current contract state
 *
 * This script shows the current state of all contracts without making any changes.
 * Safe to run anytime.
 *
 * Usage:
 *   npx hardhat run scripts/check-status.js --network bscTestnet
 */

const hre = require("hardhat");
require("dotenv").config();

const CONTRACTS = {
  TOKEN: "0xa3896C07c4e7D9771e9E3417b7352fBD14704253",
  PRESALE: "0x29Ffc342bE650C1ce3e4e102AfB2285FD29f7cF5",
  VESTING: "0xd8Cce8EE40B8BdE0f220DCa8084Cd7CeF423bD2a",
  USDT: "0xbcA887cE632E642DA28aF66433A70B62925F4a08"
};

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
  console.log("\n" + "=".repeat(70));
  console.log("PRONOVA CONTRACT STATUS CHECK");
  console.log("=".repeat(70) + "\n");

  const provider = new hre.ethers.JsonRpcProvider(hre.config.networks.bscTestnet.url);

  // Load contracts
  const tokenArtifact = await hre.artifacts.readArtifact("PronovaToken");
  const presaleArtifact = await hre.artifacts.readArtifact("PronovaPresale");
  const vestingArtifact = await hre.artifacts.readArtifact("PronovaVesting");

  const token = new hre.ethers.Contract(CONTRACTS.TOKEN, tokenArtifact.abi, provider);
  const presale = new hre.ethers.Contract(CONTRACTS.PRESALE, presaleArtifact.abi, provider);
  const vesting = new hre.ethers.Contract(CONTRACTS.VESTING, vestingArtifact.abi, provider);

  // ==================== TOKEN STATUS ====================
  console.log("📋 TOKEN CONTRACT");
  console.log("-".repeat(50));
  console.log("Address:", CONTRACTS.TOKEN);

  const totalSupply = await token.totalSupply();
  const presaleContract = await token.presaleContract();
  const allocationsDistributed = await token.allocationsDistributed();

  console.log("Total Supply:", hre.ethers.formatEther(totalSupply), "PRN");
  console.log("Presale Contract Set:", presaleContract !== "0x0000000000000000000000000000000000000000" ? "✅ Yes" : "❌ No");
  console.log("Allocations Distributed:", allocationsDistributed ? "✅ Yes" : "❌ No");

  // Step 1 status
  const step1Complete = presaleContract !== "0x0000000000000000000000000000000000000000";
  console.log("\n   Step 1 (Set Wallets):", step1Complete ? "✅ Complete" : "⏳ Pending");

  // Step 2 status
  console.log("   Step 2 (Distribute):", allocationsDistributed ? "✅ Complete" : "⏳ Pending");

  // Token balances
  if (allocationsDistributed) {
    console.log("\n   Token Balances:");
    const presaleBalance = await token.balanceOf(CONTRACTS.PRESALE);
    const vestingBalance = await token.balanceOf(CONTRACTS.VESTING);
    const liquidityBalance = await token.balanceOf(WALLETS.LIQUIDITY);
    const communityBalance = await token.balanceOf(WALLETS.COMMUNITY);
    const strategicBalance = await token.balanceOf(WALLETS.STRATEGIC);
    const marketingBalance = await token.balanceOf(WALLETS.MARKETING);

    console.log("   - Presale:", hre.ethers.formatEther(presaleBalance), "PRN");
    console.log("   - Vesting:", hre.ethers.formatEther(vestingBalance), "PRN");
    console.log("   - Liquidity:", hre.ethers.formatEther(liquidityBalance), "PRN");
    console.log("   - Community:", hre.ethers.formatEther(communityBalance), "PRN");
    console.log("   - Strategic:", hre.ethers.formatEther(strategicBalance), "PRN");
    console.log("   - Marketing:", hre.ethers.formatEther(marketingBalance), "PRN");
  }

  // ==================== VESTING STATUS ====================
  console.log("\n\n📋 VESTING CONTRACT");
  console.log("-".repeat(50));
  console.log("Address:", CONTRACTS.VESTING);

  let step3Complete = false;
  try {
    const foundersAllocation = await vesting.allocationAmounts("FOUNDERS");
    step3Complete = foundersAllocation > 0n;

    if (step3Complete) {
      const teamAllocation = await vesting.allocationAmounts("TEAM");
      const partnershipsAllocation = await vesting.allocationAmounts("PARTNERSHIPS");

      console.log("Founders Allocation:", hre.ethers.formatEther(foundersAllocation), "PRN");
      console.log("Team Allocation:", hre.ethers.formatEther(teamAllocation), "PRN");
      console.log("Partnerships Allocation:", hre.ethers.formatEther(partnershipsAllocation), "PRN");
    }
  } catch (e) {
    // Allocation amounts might not be queryable
  }

  console.log("\n   Step 3 (Vesting Setup):", step3Complete ? "✅ Complete" : "⏳ Pending");

  // ==================== PRESALE STATUS ====================
  console.log("\n\n📋 PRESALE CONTRACT");
  console.log("-".repeat(50));
  console.log("Address:", CONTRACTS.PRESALE);

  const currentPhase = await presale.currentPhase();
  const totalRaised = await presale.totalRaisedUSD();
  const whitelistEnabled = await presale.whitelistEnabled();
  const claimEnabled = await presale.claimEnabled();

  console.log("Current Phase:", currentPhase.toString());
  console.log("Total Raised: $", hre.ethers.formatUnits(totalRaised, 6));
  console.log("Whitelist Enabled:", whitelistEnabled ? "Yes" : "No");
  console.log("Claim Enabled:", claimEnabled ? "Yes" : "No");

  // Phase details
  console.log("\n   Phase Details:");
  for (let i = 1; i <= 3; i++) {
    const phase = await presale.phases(i);
    const status = phase.isActive ? "🟢 ACTIVE" : "⚪ Inactive";
    console.log(`   Phase ${i}: ${status} | $${hre.ethers.formatUnits(phase.pricePerToken, 6)}/PRN | Sold: ${hre.ethers.formatEther(phase.tokensSold)}/${hre.ethers.formatEther(phase.tokensAllocated)} PRN`);
  }

  const phase1Info = await presale.phases(1);
  const step4Complete = phase1Info.isActive;
  console.log("\n   Step 4 (Activate Presale):", step4Complete ? "✅ Complete" : "⏳ Pending");

  // ==================== OVERALL STATUS ====================
  console.log("\n\n" + "=".repeat(70));
  console.log("OVERALL SETUP STATUS");
  console.log("=".repeat(70));

  const allComplete = step1Complete && allocationsDistributed && step3Complete && step4Complete;

  console.log("\n   Step 1 - Set Allocation Wallets:", step1Complete ? "✅" : "❌");
  console.log("   Step 2 - Distribute Allocations:", allocationsDistributed ? "✅" : "❌");
  console.log("   Step 3 - Setup Vesting Schedules:", step3Complete ? "✅" : "❌");
  console.log("   Step 4 - Activate Presale Phase 1:", step4Complete ? "✅" : "❌");

  if (allComplete) {
    console.log("\n" + "=".repeat(70));
    console.log("🎉 ALL SETUP COMPLETE! PRESALE IS LIVE!");
    console.log("=".repeat(70));
  } else {
    console.log("\n⏳ Setup incomplete. Run the pending step scripts.");
  }

  // Admin wallet balances
  console.log("\n\n📋 ADMIN WALLET BALANCES");
  console.log("-".repeat(50));
  const admin1Balance = await provider.getBalance(WALLETS.ADMIN1);
  const admin2Balance = await provider.getBalance(WALLETS.ADMIN2);
  console.log("Admin1:", hre.ethers.formatEther(admin1Balance), "BNB", admin1Balance === 0n ? "⚠️ NEEDS GAS" : "✅");
  console.log("Admin2:", hre.ethers.formatEther(admin2Balance), "BNB", admin2Balance === 0n ? "⚠️ NEEDS GAS" : "✅");

  console.log("\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
