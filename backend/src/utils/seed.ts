import { prisma } from '../config/database';

export async function seedPresalePhases() {
  console.log('Seeding presale phases...');

  const phases = [
    {
      phaseNumber: 1,
      name: 'Phase 1 - Early Bird',
      pricePerToken: 0.05,
      tokenSupply: 100_000_000,
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      minPurchase: 100,
      maxPurchase: 50_000,
      isActive: true,
    },
    {
      phaseNumber: 2,
      name: 'Phase 2 - Early Access',
      pricePerToken: 0.07,
      tokenSupply: 100_000_000,
      startDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days
      minPurchase: 100,
      maxPurchase: 50_000,
      isActive: false,
    },
    {
      phaseNumber: 3,
      name: 'Phase 3 - Public Sale',
      pricePerToken: 0.09,
      tokenSupply: 100_000_000,
      startDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
      minPurchase: 100,
      maxPurchase: 50_000,
      isActive: false,
    },
    {
      phaseNumber: 4,
      name: 'Phase 4 - Final Round',
      pricePerToken: 0.10,
      tokenSupply: 100_000_000,
      startDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000), // 120 days
      minPurchase: 100,
      maxPurchase: 50_000,
      isActive: false,
    },
  ];

  for (const phase of phases) {
    await prisma.presalePhase.upsert({
      where: { phaseNumber: phase.phaseNumber },
      update: phase,
      create: phase,
    });
  }

  console.log('✅ Presale phases seeded successfully');
}

export async function seedSystemSettings() {
  console.log('Seeding system settings...');

  const settings = [
    {
      key: 'presale_enabled',
      value: { enabled: true },
      description: 'Enable/disable presale functionality',
    },
    {
      key: 'whitelist_enabled',
      value: { enabled: true },
      description: 'Enable/disable whitelist requirement',
    },
    {
      key: 'kyc_required',
      value: { required: false },
      description: 'Require KYC for purchases',
    },
    {
      key: 'referral_bonus',
      value: { percentage: 5 },
      description: 'Referral bonus percentage',
    },
    {
      key: 'min_purchase_usd',
      value: { amount: 100 },
      description: 'Minimum purchase amount in USD',
    },
    {
      key: 'max_purchase_usd',
      value: { amount: 50000 },
      description: 'Maximum purchase amount in USD',
    },
  ];

  for (const setting of settings) {
    await prisma.systemSettings.upsert({
      where: { key: setting.key },
      update: {
        value: setting.value,
        description: setting.description,
      },
      create: setting,
    });
  }

  console.log('✅ System settings seeded successfully');
}

export async function runSeeders() {
  try {
    await seedPresalePhases();
    await seedSystemSettings();
    console.log('🌱 All seeders completed successfully');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  }
}

// Run seeders if this file is executed directly
if (require.main === module) {
  runSeeders()
    .then(() => {
      console.log('Seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seeding failed:', error);
      process.exit(1);
    });
}