/**
 * UPDATE PHASE TIMES
 *
 * This script updates the presale phase timestamps to start from today.
 * Requires 2 admin confirmations (multi-sig).
 *
 * Phase durations (per whitepaper):
 *   - Phase 1: 30 days
 *   - Phase 2: 30 days
 *   - Phase 3: 30 days
 *
 * Usage:
 *   npx hardhat run scripts/update-phase-times.js --network bscTestnet
 */

const hre = require("hardhat");
require("dotenv").config();

const PRESALE = "0x29Ffc342bE650C1ce3e4e102AfB2285FD29f7cF5";

// Admin keys from environment
const ADMIN1_KEY = process.env.ADMIN1_PRIVATE_KEY;
const ADMIN2_KEY = process.env.ADMIN2_PRIVATE_KEY;

async function main() {
  console.log("\n" + "=".repeat(70));
  console.log("UPDATE PHASE TIMES - Starting from TODAY");
  console.log("=".repeat(70) + "\n");

  if (!ADMIN1_KEY || !ADMIN2_KEY) {
    console.error("ERROR: Admin keys not found in .env");
    console.error("Add ADMIN1_PRIVATE_KEY and ADMIN2_PRIVATE_KEY to your .env file");
    process.exit(1);
  }

  const provider = new hre.ethers.JsonRpcProvider(hre.config.networks.bscTestnet.url);

  const admin1 = new hre.ethers.Wallet(ADMIN1_KEY, provider);
  const admin2 = new hre.ethers.Wallet(ADMIN2_KEY, provider);

  console.log("Admin1:", admin1.address);
  console.log("Admin2:", admin2.address);

  const presaleArtifact = await hre.artifacts.readArtifact("PronovaPresale");
  const presaleAdmin1 = new hre.ethers.Contract(PRESALE, presaleArtifact.abi, admin1);
  const presaleAdmin2 = new hre.ethers.Contract(PRESALE, presaleArtifact.abi, admin2);

  // Calculate new phase times starting from NOW
  const now = Math.floor(Date.now() / 1000);
  const DAY = 24 * 60 * 60;
  const PHASE_DURATION = 30 * DAY;

  const phaseTimes = [
    {
      phase: 1,
      name: "Phase 1 - Early Bird",
      startTime: now,
      endTime: now + PHASE_DURATION
    },
    {
      phase: 2,
      name: "Phase 2 - Growth",
      startTime: now + PHASE_DURATION,
      endTime: now + (2 * PHASE_DURATION)
    },
    {
      phase: 3,
      name: "Phase 3 - Final",
      startTime: now + (2 * PHASE_DURATION),
      endTime: now + (3 * PHASE_DURATION)
    }
  ];

  console.log("\n--- New Phase Times ---");
  for (const pt of phaseTimes) {
    console.log(`\n${pt.name}:`);
    console.log(`  Start: ${new Date(pt.startTime * 1000).toISOString()}`);
    console.log(`  End:   ${new Date(pt.endTime * 1000).toISOString()}`);
  }
  console.log("\n");

  // Update each phase
  for (const pt of phaseTimes) {
    console.log(`\n${"=".repeat(50)}`);
    console.log(`Updating Phase ${pt.phase}: ${pt.name}`);
    console.log("=".repeat(50));

    try {
      // Admin1 confirms
      console.log("\n[1/2] Admin1 confirming...");
      const tx1 = await presaleAdmin1.setPhaseTime(pt.phase, pt.startTime, pt.endTime);
      await tx1.wait();
      console.log("      Admin1 confirmed - TX:", tx1.hash);

      // Admin2 confirms + executes
      console.log("\n[2/2] Admin2 confirming and executing...");
      const tx2 = await presaleAdmin2.setPhaseTime(pt.phase, pt.startTime, pt.endTime);
      await tx2.wait();
      console.log("      Admin2 confirmed + executed - TX:", tx2.hash);

      console.log(`\n      Phase ${pt.phase} times updated successfully!`);
    } catch (error) {
      console.error(`\nError updating Phase ${pt.phase}:`, error.message);
      if (error.message.includes("Already executed")) {
        console.log("      (Phase times may already be updated)");
      }
    }
  }

  // Verify the updates
  console.log("\n\n" + "=".repeat(70));
  console.log("VERIFICATION - Current Phase Times");
  console.log("=".repeat(70) + "\n");

  for (let i = 1; i <= 3; i++) {
    const phase = await presaleAdmin1.phases(i);
    const startTime = Number(phase.startTime);
    const endTime = Number(phase.endTime);

    console.log(`Phase ${i}:`);
    console.log(`  Active: ${phase.isActive}`);
    console.log(`  Start:  ${startTime} (${new Date(startTime * 1000).toISOString()})`);
    console.log(`  End:    ${endTime} (${new Date(endTime * 1000).toISOString()})`);

    if (startTime <= now && now <= endTime) {
      console.log(`  STATUS: IN PROGRESS`);
    } else if (now < startTime) {
      console.log(`  STATUS: NOT STARTED YET`);
    } else {
      console.log(`  STATUS: ENDED`);
    }
    console.log("");
  }

  console.log("\n" + "=".repeat(70));
  console.log("Phase times updated successfully!");
  console.log("=".repeat(70) + "\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
