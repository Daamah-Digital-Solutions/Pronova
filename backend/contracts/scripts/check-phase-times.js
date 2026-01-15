const hre = require("hardhat");
require("dotenv").config();

const PRESALE = "0x29Ffc342bE650C1ce3e4e102AfB2285FD29f7cF5";

async function main() {
  const provider = new hre.ethers.JsonRpcProvider(hre.config.networks.bscTestnet.url);
  const presaleArtifact = await hre.artifacts.readArtifact("PronovaPresale");
  const presale = new hre.ethers.Contract(PRESALE, presaleArtifact.abi, provider);

  console.log("\n=== ON-CHAIN PHASE TIMESTAMPS ===\n");

  const now = Math.floor(Date.now() / 1000);
  console.log("Current time:", now, "(" + new Date().toISOString() + ")\n");

  for (let i = 1; i <= 3; i++) {
    const phase = await presale.phases(i);
    const startTime = Number(phase.startTime);
    const endTime = Number(phase.endTime);

    console.log("Phase " + i + ":");
    console.log("  Active: " + phase.isActive);
    console.log("  Start Time: " + startTime + " (" + new Date(startTime * 1000).toISOString() + ")");
    console.log("  End Time: " + endTime + " (" + new Date(endTime * 1000).toISOString() + ")");
    console.log("  Price: $" + hre.ethers.formatUnits(phase.pricePerToken, 6));

    if (startTime === 0 && endTime === 0) {
      console.log("  STATUS: NOT CONFIGURED (times are 0)");
    } else if (now < startTime) {
      console.log("  STATUS: NOT STARTED YET");
    } else if (now > endTime) {
      console.log("  STATUS: ENDED");
    } else {
      console.log("  STATUS: IN PROGRESS");
    }
    console.log("");
  }
}

main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
