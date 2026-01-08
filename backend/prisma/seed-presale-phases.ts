/**
 * Presale Phase Seed Script
 *
 * This script populates the PresalePhase table with data matching
 * the BSC Testnet smart contract configuration.
 *
 * Usage:
 *   npx ts-node prisma/seed-presale-phases.ts
 *
 * Or via npm script:
 *   npm run seed:presale
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Presale phases matching the smart contract PronovaPresale.sol _initializePhases()
const presalePhases = [
  {
    phaseNumber: 1,
    name: 'Phase 1 - Early Bird',
    pricePerToken: 0.80, // $0.80 per token
    tokenSupply: 100_000_000, // 100M tokens (40% of 250M presale allocation)
    tokensSold: 0,
    startDate: new Date(), // Starts now
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    minPurchase: 100, // $100 minimum
    maxPurchase: 100_000, // $100,000 maximum per transaction
    isActive: true, // Phase 1 is active
  },
  {
    phaseNumber: 2,
    name: 'Phase 2 - Growth',
    pricePerToken: 1.00, // $1.00 per token
    tokenSupply: 75_000_000, // 75M tokens (30% of 250M presale allocation)
    tokensSold: 0,
    startDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
    minPurchase: 100,
    maxPurchase: 100_000,
    isActive: false,
  },
  {
    phaseNumber: 3,
    name: 'Phase 3 - Final',
    pricePerToken: 1.50, // $1.50 per token
    tokenSupply: 75_000_000, // 75M tokens (30% of 250M presale allocation)
    tokensSold: 0,
    startDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
    endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
    minPurchase: 100,
    maxPurchase: 100_000,
    isActive: false,
  },
];

async function main() {
  console.log('Starting presale phase seed...\n');

  // Check existing phases
  const existingPhases = await prisma.presalePhase.findMany();

  if (existingPhases.length > 0) {
    console.log(`Found ${existingPhases.length} existing phases.`);
    console.log('Deleting existing phases...');
    await prisma.presalePhase.deleteMany();
    console.log('Existing phases deleted.\n');
  }

  // Insert new phases
  console.log('Inserting presale phases...\n');

  for (const phase of presalePhases) {
    const created = await prisma.presalePhase.create({
      data: phase,
    });

    console.log(`Created Phase ${created.phaseNumber}: ${created.name}`);
    console.log(`  - Price: $${created.pricePerToken}`);
    console.log(`  - Supply: ${created.tokenSupply.toLocaleString()} tokens`);
    console.log(`  - Min/Max Purchase: $${created.minPurchase} - $${created.maxPurchase}`);
    console.log(`  - Active: ${created.isActive}`);
    console.log(`  - Period: ${created.startDate.toLocaleDateString()} - ${created.endDate.toLocaleDateString()}`);
    console.log('');
  }

  // Verify insertion
  const phases = await prisma.presalePhase.findMany({
    orderBy: { phaseNumber: 'asc' },
  });

  console.log('='.repeat(50));
  console.log(`Successfully seeded ${phases.length} presale phases.`);
  console.log('='.repeat(50));

  // Summary table
  console.log('\nPhase Summary:');
  console.log('-'.repeat(70));
  console.log('| Phase | Name              | Price  | Tokens (M) | Active |');
  console.log('-'.repeat(70));
  for (const p of phases) {
    const tokens = (p.tokenSupply / 1_000_000).toFixed(0);
    console.log(`|   ${p.phaseNumber}   | ${p.name.padEnd(17)} | $${p.pricePerToken.toFixed(2).padStart(4)} | ${tokens.padStart(10)} | ${p.isActive ? 'Yes   ' : 'No    '} |`);
  }
  console.log('-'.repeat(70));
}

main()
  .then(async () => {
    await prisma.$disconnect();
    process.exit(0);
  })
  .catch(async (e) => {
    console.error('Error seeding presale phases:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
