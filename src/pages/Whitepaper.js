import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { useTheme } from '../context/ThemeContext';
import TokenomicsChart from '../components/ui/TokenomicsChart';
import {
  FaFileContract, FaBullseye, FaExclamationTriangle, FaProjectDiagram, FaWater,
  FaBuilding, FaCoins, FaMicrochip, FaGavel, FaShieldAlt, FaRobot, FaChartPie,
  FaGlobeAmericas, FaRoad, FaHandshake, FaHandHoldingUsd, FaFlag, FaArrowUp,
  FaExternalLinkAlt, FaCheckCircle, FaLock, FaInfinity, FaNetworkWired, FaRocket,
  FaHome, FaExchangeAlt, FaCube, FaBalanceScale, FaLayerGroup, FaMoneyBillWave,
  FaNewspaper, FaLink
} from 'react-icons/fa';

// Logos (available in assets)
import solidproofLogo from '../assets/images/logos for partner/logo_shield_trustnet.svg';
import novaDigitalFinanceLogo from '../assets/images/logos for partner/novadf-logo.png';
import capimaxGroupLogo from '../assets/images/logos for partner/capimax-group-logo.png';
import capiMaxVirtualAssetLogo from '../assets/images/logos for partner/capi max  Virtual Asset uk dark .png';
import capiMaxFintechBlockchainLogo from '../assets/images/logos for partner/capi max  Fintech and Blockchain uk dark  copy.png';
import capiMaxTokenizationLogo from '../assets/images/logos for partner/capimax logos png/dark/capi max all versions logos-tokenization dark.png';
import hccLogo from '../assets/images/logos for partner/hcc logo.png';
import assuraxLogo from '../assets/images/logos for partner/assurax logo-01.png';
import cimLogo from '../assets/images/logos for partner/cim logo.png';
import eliteGateLogo from '../assets/images/logos for partner/elitgate properties.png';
import primeInnLogo from '../assets/images/logos for partner/primeinn logo.png';
import pronovaLogo from '../assets/images/logos for partner/pronova coin.png';

const AUDIT_URL = 'https://app.solidproof.io/projects/pronova';

const SECTIONS = [
  { id: 'executive-summary', title: 'Executive Summary', icon: FaFileContract },
  { id: 'vision-mission', title: 'Vision & Mission', icon: FaBullseye },
  { id: 'problem', title: 'The Problem', icon: FaExclamationTriangle },
  { id: 'ecosystem', title: 'The Ecosystem', icon: FaProjectDiagram },
  { id: 'liquidity', title: 'Utility-Backed Liquidity', icon: FaWater },
  { id: 'rwa', title: 'RWA Integration', icon: FaBuilding },
  { id: 'tokenomics', title: 'Tokenomics', icon: FaCoins },
  { id: 'technology', title: 'Technology & Audit', icon: FaMicrochip },
  { id: 'governance', title: 'Governance & Legal', icon: FaGavel },
  { id: 'insurance', title: 'Insurance & Risk', icon: FaShieldAlt },
  { id: 'ai', title: 'AI Infrastructure', icon: FaRobot },
  { id: 'revenue', title: 'Revenue Model', icon: FaChartPie },
  { id: 'expansion', title: 'Global Expansion', icon: FaGlobeAmericas },
  { id: 'roadmap', title: 'Roadmap', icon: FaRoad },
  { id: 'partnerships', title: 'Partnerships', icon: FaHandshake },
  { id: 'financing', title: 'Financing', icon: FaHandHoldingUsd },
  { id: 'media', title: 'Media & Links', icon: FaNewspaper },
  { id: 'conclusion', title: 'Conclusion', icon: FaFlag },
];

const TOKEN_METRICS = [
  { label: 'Token', value: 'Pronova (PRN)', icon: FaCoins },
  { label: 'Network', value: 'BNB Smart Chain', icon: FaNetworkWired },
  { label: 'Total Supply', value: '1,000,000,000', icon: FaInfinity },
  { label: 'Pre-Sale', value: '250M (25%)', icon: FaRocket },
  { label: 'Long-Term Lock', value: '~45% · 9 yrs', icon: FaLock },
  { label: 'Audit', value: 'SolidProof ✓', icon: FaShieldAlt },
];

const DIFF_TABLE = [
  ['Utility Model', 'Speculation-driven; utility typically post-listing', 'Real utility active from pre-sale day one'],
  ['Asset Backing', 'None or synthetic', 'Real estate, RWA & tokenized property — accepted on 4 platforms + 12 companies, usable now'],
  ['Institutional Structure', 'Typically anonymous or minimally incorporated', 'Six incorporated entities across US & UK — all verifiable'],
  ['Insurance & Protection', 'Absent or unverified', 'HCC, Assurax & HCC International (hccglobalcoverage.com, assuraxinsurance.com)'],
  ['Audit Status', 'Often pending or absent at launch', 'Completed by SolidProof for three contracts prior to pre-sale launch'],
];

const CORE_PRINCIPLES = [
  ['Utility Before Speculation', 'Every design decision prioritizes operational utility over speculative value creation — demand generated through real economic activity.', FaBullseye, 'from-primary-500 to-secondary-500'],
  ['Institutional Governance', 'Built on incorporated global entities, insurance partnerships, audit completion, and financial oversight — operational from launch, not a roadmap item.', FaBalanceScale, 'from-indigo-500 to-blue-500'],
  ['Real Asset Anchoring', 'Liquidity deliberately anchored to real-world assets, principally real estate, creating a demand floor independent of crypto cycles.', FaHome, 'from-teal-500 to-emerald-500'],
  ['Transparent Operations', 'All activities, deployments, audit results, insurance, and partnerships are reflected through publicly accessible channels for independent verification.', FaShieldAlt, 'from-amber-500 to-orange-500'],
  ['Long-Term Sustainable Growth', 'Tokenomics, locking schedules, and governance calibrated for multi-year sustainable growth — the 45% lock extends up to nine years.', FaRocket, 'from-violet-500 to-purple-500'],
];

const MARKET_CONTEXT = [
  'The global RWA tokenization market is projected to grow from ~$0.6T (2023) to over $16T by 2030 — a CAGR exceeding 50%.',
  'Institutional digital asset allocation is accelerating, with BlackRock, Fidelity, Franklin Templeton, and 40+ major asset managers developing digital asset products.',
  'BNB Smart Chain demonstrates 3M+ daily transactions with sub-$0.01 costs — an operationally validated layer for utility-first tokens.',
  "FATF's Travel Rule and the EU's MiCA are driving rapid formalization of digital asset compliance — an advantage for institutionally governed projects.",
  'Global cross-border payment volumes are projected to exceed $250T annually by 2027.',
];

const PROBLEMS = [
  ['01 · Absence of Real-World Economic Utility', 'Most digital assets derive value entirely from speculative demand — fewer than 10% of the top 500 operate within ecosystems generating measurable economic activity.', 'PRN token utility was engineered to be active from the first day of the pre-sale, integrated with real estate, investment, and payment systems already operational at launch.'],
  ['02 · Institutional Infrastructure Deficit', 'The vast majority of projects lack governance, compliance, legal incorporation, insurance, and audit — a segment that has suffered over $50B in documented losses since 2017.', 'Six incorporated entities across the US & UK, a completed SolidProof audit (token + vesting + pre-sale), institutional insurance via HCC/Assurax/HCC International, plus CIM Financial Group oversight.'],
  ['03 · The Real Asset Integration Gap', "Real estate is the world's largest asset class (~$380T), yet its blockchain integration remains fragmented — a trillion-dollar opportunity substantially unfilled.", 'A purpose-built RWA framework connecting PRN to property acquisition, fractional ownership, and real estate-backed liquidity through operational platforms.'],
  ['04 · Security & Trust Infrastructure Failure', 'The sector has suffered ~$70B in documented security incidents since 2011, eroding institutional trust and complicating regulatory engagement.', 'Pre-launch SolidProof audit, multi-layered institutional insurance, professional cybersecurity infrastructure, and operational risk management at the architecture level.'],
  ['05 · Traditional Business Integration Failure', 'Merchant acceptance and enterprise-grade crypto payment rails are available from fewer than 1% of global businesses.', 'A business integration model spanning payments, real estate, fractional investment, and digital finance — designed for seamless adoption by traditional businesses.'],
];

const ARCH_LAYERS = [
  ['Layer 1 — Blockchain', 'BNB Smart Chain (BEP-20), smart contract layer, security audit, Layer 2 scalability'],
  ['Layer 2 — Token Utility', 'PRN payments, staking, lending, fees, rewards'],
  ['Layer 3 — Real Asset', 'Real estate acquisition, fractional ownership, tokenized assets, RWA integration'],
  ['Layer 4 — Institutional', 'Investment funds, portfolio management, financial oversight, insurance'],
  ['Layer 5 — Digital Finance', 'Cross-border payments, lending, digital banking integration'],
  ['Layer 6 — AI Intelligence', 'Smart investment analytics, risk scoring, portfolio optimization'],
  ['Layer 7 — Governance', 'DAO structures, compliance frameworks, multi-jurisdictional legal entities'],
];

const OP_FLOW = [
  ['Real Estate Pathway', 'Fractional & full property acquisition, tokenized property pools, and rental yield distributions in PRN.', FaHome],
  ['Investment Pathway', 'Institutional investment structures with AI-powered portfolio management and institutional oversight.', FaChartPie],
  ['Finance Pathway', 'PRN used as collateral for lending facilities, enabling leveraged investment without token liquidation.', FaHandHoldingUsd],
  ['Payment Pathway', 'PRN accepted across 18+ integrated partner companies — continuous organic demand from real business activity.', FaMoneyBillWave],
  ['Staking Pathway', 'PRN staked to earn yield, participate in governance, and access premium features and fee discounts.', FaCoins],
];

const ENTITIES = [
  { name: 'Pronova Virtual Assets', juris: 'Wyoming, USA', fn: 'Primary token issuer & ecosystem anchor; Wyoming’s progressive blockchain legislation provides an optimal regulatory environment', logo: pronovaLogo },
  { name: 'Capimax Group Holding', juris: 'Delaware, USA', fn: 'Strategic holding company for ecosystem investments, institutional capital management, and cross-entity governance', logo: capimaxGroupLogo },
  { name: 'Capimax Real Estate Technologies', juris: 'Delaware, USA', fn: 'Strategic holding for real estate technologies and tokenization', logo: capiMaxTokenizationLogo },
  { name: 'Capimax Virtual Asset', juris: 'United Kingdom', fn: 'UK-registered virtual asset service provider enabling European market access and FCA-framework positioning', logo: capiMaxVirtualAssetLogo },
  { name: 'Capimax Blockchain', juris: 'United Kingdom', fn: 'Financial technology and blockchain systems development; technical infrastructure and protocol governance', logo: capiMaxFintechBlockchainLogo },
  { name: 'Nova Digital Finance', juris: 'United Kingdom', fn: 'Digital financing, lending, and investment platform; cross-border digital payment infrastructure', logo: novaDigitalFinanceLogo },
  { name: 'CIM Financial Group', juris: 'UK & USA', fn: 'Financial oversight, institutional supervision, risk assessment, and governance monitoring', logo: cimLogo },
];

const LIQ_INFLOWS = ['Pre-Sale purchases (Stages 1–3)', 'Real estate transaction fees', 'Platform service fees (18+ partners)', 'Staking rewards reinvestment', 'Institutional investment inflows', 'Lending collateral'];
const LIQ_OUTFLOWS = ['Long-term lock (45% of supply, up to 9 years)', 'Staking lock (voluntary participant locking)', 'Burn mechanisms (deflationary pressure)', 'Gradual release schedules', 'Vesting timelines (founders & team)'];

const STABILITY = [
  ['Supply Control', 'Fixed 1B cap, ~45% locked up to 9 years, graduated release schedules, and burn mechanisms linked to activity — structural scarcity that compounds with demand.'],
  ['Demand Expansion', 'Systematic growth of the partner network, continuous real estate integration, expanded payment acceptance, and new PRN-denominated investment products.'],
  ['Value Protection', 'Real-world property anchoring, institutional governance across six entities, and professional insurance (HCC, Assurax, HCC International).'],
  ['Institutional Foundation', 'Multi-entity structure, regulatory compliance, audit completion, and CIM oversight — the conditions for compounding institutional participation.'],
];

const RWA_MODELS = [
  ['Full Property Acquisition via PRN', 'Integrated platforms accept PRN as consideration for full property acquisitions; the settlement infrastructure handles conversion, title transfer, and legal completion.', FaBuilding, 'from-primary-500 to-secondary-500'],
  ['Fractional Ownership via Tokenization', 'Properties tokenized on BSC, each token a defined fractional stake — holders acquire with PRN and gain rental yield (in PRN), appreciation, and governance rights.', FaChartPie, 'from-amber-500 to-orange-500'],
  ['Tokenized Property Investment Pools', 'Diversified pools assembled by ecosystem entities — like a blockchain-native REIT with fractional granularity, automated distribution, and 24/7 platform liquidity.', FaLayerGroup, 'from-violet-500 to-purple-500'],
];

const RWA_INSTITUTIONAL = [
  ['Club Deal Structures', 'PRN-denominated co-investment vehicles for multiple institutions to jointly acquire and manage high-value assets, governed by smart contracts.'],
  ['Separately Managed RWA Accounts', 'Customized tokenized real estate portfolios by risk/return, geography, and asset-class specifications.'],
  ['Liquidity Bridge Mechanisms', 'Pre-listing exit pathways enabling institutions to realize returns from tokenized real estate before exchange listing.'],
];

const TOKEN_PARAMS = [
  ['Token Name', 'Pronova'],
  ['Token Symbol', 'PRN'],
  ['Token Standard', 'BEP-20 (BNB Smart Chain)'],
  ['Total Supply', '1,000,000,000 PRN — Fixed, Non-Inflationary, Permanently Capped'],
  ['Decimal Places', '18 (standard BEP-20)'],
  ['Mint Authority', 'Renounced post-launch — no additional minting possible'],
  ['Burn Mechanism', 'Active — transaction-linked deflationary burn schedule'],
  ['Audit Status', 'Completed by SolidProof — publicly published'],
];

const ALLOCATION = [
  ['Pre-Sale', 25, '250,000,000', 'Primary ecosystem funding across three stages', '#2563eb'],
  ['Direct Asset Purchase', 15, '150,000,000', 'For real estate & finance platforms, after the pre-sale', '#14b8a6'],
  ['Partnerships', 15, '150,000,000', 'Strategic partners, ecosystem allocations, incentives', '#7c3aed'],
  ['Liquidity', 12, '120,000,000', 'DEX/CEX liquidity provision and market depth', '#f59e0b'],
  ['Marketing & Development', 12, '120,000,000', 'Global campaigns, technology, ecosystem expansion', '#8b5cf6'],
  ['Founders', 7.5, '75,000,000', 'Multi-year vesting with cliff periods', '#ef4444'],
  ['Reserves', 6, '60,000,000', 'Compliance, insurance, and unforeseen needs', '#6366f1'],
  ['Community', 5, '50,000,000', 'Incentives, rewards, governance programs', '#10b981'],
  ['Team', 2.5, '25,000,000', 'Core team compensation, long vesting', '#f97316'],
];

const STAGES = [
  { stage: 'Stage 1', tokens: '100,000,000 PRN', price: '$0.80', target: '$80,000,000', valuation: '$800M implied', live: true },
  { stage: 'Stage 2', tokens: '75,000,000 PRN', price: '$1.00', target: '$75,000,000', valuation: '$1.0B implied', live: false },
  { stage: 'Stage 3', tokens: '75,000,000 PRN', price: '$1.50', target: '$112,500,000', valuation: '$1.5B implied', live: false },
];

const BSC_COMPARE = [
  ['Avg. Transaction Cost', '< $0.01', '$1–$50+ (variable)', '< $0.001'],
  ['Block Time', '~3 seconds', '~12 seconds', '~0.4 seconds'],
  ['EVM Compatibility', 'Full', 'Native', 'Partial (SVM)'],
  ['Daily Active Addresses', '1–3M+', '500K–1M', 'Variable'],
  ['Institutional Wallet Support', 'Broad', 'Broadest', 'Growing'],
];

const CONTRACT_MODULES = [
  ['PRN Core Token Contract', 'BEP-20 with fixed supply, burn functionality, and event logging. Audit: Completed by SolidProof.'],
  ['Staking Contract', 'Time-locked pools with configurable APY, automated rewards, and multi-sig emergency withdrawal.'],
  ['Vesting Contract', 'Time-locked release for team, founder & partner allocations — cannot be accelerated by any single party.'],
  ['RWA Fractional Ownership Contract', 'Tokenization framework for real estate representation, stake management, and automated yield distribution.'],
  ['Lending & Collateral Contract', 'Collateralized lending with automated liquidation triggers and collateral-ratio management.'],
  ['Governance Contract', 'Weighted on-chain voting by staked PRN with multi-tiered proposal thresholds.'],
];

const RISK_CATS = [
  ['Technology & Security Risk', 'Pre-launch SolidProof audit, modular architecture, multi-sig treasury, cold storage, ongoing assessments, and incident response protocols.'],
  ['Market & Liquidity Risk', 'Multi-pillar utility-backed liquidity, 45% long-term lock, diversified pre-sale pricing, and planned market-making infrastructure.'],
  ['Regulatory & Compliance Risk', 'Multi-jurisdictional structure, proactive framework aligned with MiCA/FCA/US guidance, and ongoing legal counsel engagement.'],
  ['Counterparty & Operational Risk', 'Formal agreements with incorporated entities, due diligence, and diversification across 18+ partner companies.'],
  ['Real Estate & RWA Risk', 'Valuation governance, geographic diversification, professional management, legal title insurance, and clear liquidation protocols.'],
  ['Governance Risk', 'Hybrid on-chain/off-chain model, CIM oversight, multi-sig for major decisions, and predefined escalation procedures.'],
];

const AI_DOMAINS = [
  ['Smart Portfolio Optimization', 'Real-time analysis of market data, correlations, and ecosystem metrics to generate dynamic allocation across staking, RWA, lending, and liquidity.', FaChartPie, 'from-primary-500 to-secondary-500'],
  ['Real Estate Valuation Intelligence', 'ML models trained on property datasets provide AI-assisted valuations supporting fractional ownership token issuance.', FaHome, 'from-teal-500 to-emerald-500'],
  ['Risk Scoring & Credit Assessment', 'AI evaluates on-chain history, staking behaviour, and portfolio composition to generate dynamic credit scores for lending.', FaBalanceScale, 'from-indigo-500 to-blue-500'],
  ['Market Intelligence & Predictive Analytics', 'Aggregates transaction data and external indicators for early-warning signals and demand forecasting.', FaRobot, 'from-violet-500 to-purple-500'],
  ['Automated Compliance Monitoring', 'Continuous AML/KYC screening, suspicious-activity recognition, and automated regulatory reporting.', FaGavel, 'from-amber-500 to-orange-500'],
];

const REVENUE_STREAMS = [
  ['Transaction Fees', 'Percentage of transaction value in PRN; partial burn, partial treasury allocation'],
  ['Real Estate Platform Fees', 'Fixed & percentage fees on property tokenization, issuance, and management'],
  ['Lending Interest Revenue', 'Interest-rate spread between borrowing costs and lending rates'],
  ['Staking Pool Management', 'Percentage of staking yields allocated to ecosystem treasury'],
  ['Investment Management Fees', 'AUM-based management fees plus performance fees on RWA pools'],
  ['Partner Integration Fees', 'One-time integration fees plus recurring volume-linked fees'],
  ['AI Analytics Subscriptions', 'Tiered subscriptions with PRN payment discounts for participants'],
];

const FORECAST = [
  ['Active Ecosystem Partners', '18–30', '50–100', '200+'],
  ['Properties Tokenized', '10–25', '100–250', '1,000+'],
  ['Active Stakers', '5,000–15,000', '50,000–150,000', '500,000+'],
  ['Lending Book (PRN)', '10M–50M', '100M–300M', '500M+'],
  ['Ecosystem Transaction Volume', '$10M–$50M', '$100M–$500M', '$1B+'],
];

const EXPANSION_PHASES = [
  ['Phase 1 · Core Markets', 'USA & UK', "Corporate domicile jurisdictions; access to the world's deepest institutional capital pools."],
  ['Phase 2 · GCC & Middle East', 'Saudi Arabia, UAE, Qatar, Kuwait, Bahrain, Oman', 'Fastest-growing adoption region; progressive regulation (ADGM, VARA, CBB); strong real estate culture.'],
  ['Phase 3 · Asia-Pacific', 'Singapore, Hong Kong, Japan, South Korea, Australia', 'Multiple advanced regulatory frameworks and significant institutional markets.'],
  ['Phase 4 · Emerging Markets', 'Southeast Asia, South Asia, Africa, Latin America', 'High adoption; demand for fractional ownership and cross-border payment utility.'],
];

const COMPETITIVE = [
  ['RWA Tokenization', 'Centrifuge, RealT, Maple Finance', 'Multi-asset RWA + payments + institutional governance combined', 'Earlier stage vs. established protocols'],
  ['Utility Token Ecosystems', 'BNB, MATIC, AVAX', 'Real estate anchoring, institutional insurance, pre-sale utility', 'Lower current liquidity vs. large-caps'],
  ['Institutional Digital Finance', 'Fireblocks, Anchorage, Copper', 'Token-native ecosystem vs. custody infrastructure only', 'Different product category'],
  ['Real Estate Platforms', 'Lofty.ai, Fundrise (tokenized)', 'Broader ecosystem beyond a single asset class', 'Specialists have deeper UX'],
];

const SECTORS = [
  ['Real Estate & Property Development', 'Developers, agencies, and property investment platforms enabling PRN acceptance for acquisitions, fractional participation, and management fees.'],
  ['Blockchain & Technology', 'Development firms, smart contract specialists, security providers, and Web3 operators supporting technical infrastructure.'],
  ['Digital Finance & Fintech', 'Digital banking, payment processors, and lending infrastructure supporting cross-border PRN payments and lending.'],
  ['Investment & Asset Management', 'Funds, asset managers, family offices, and institutional platforms creating demand from high-value participants.'],
  ['Insurance & Risk Management', 'HCC, Assurax, and HCC International — protective arrangements and institutional credibility signaling.'],
];

const PLATFORMS = [
  { name: 'Capimax RT', url: 'https://capimaxrt.com/', desc: 'Tokenized real estate trading & digital real estate asset marketplace', icon: FaCube },
  { name: 'Capimax BRX', url: 'https://capimaxbrx.com/', desc: 'Blockchain real estate exchange — institutional-grade access to digitized property', icon: FaExchangeAlt },
  { name: 'Capimax ProShare', url: 'https://capimaxpropshare.com/', desc: 'Fractional property ownership marketplace — stake acquisition & yield receipt', icon: FaChartPie },
  { name: 'Capimax ASseT', url: 'https://capimaxasset.com/', desc: 'Digital asset & RWA management — connecting capital to property investment', icon: FaBuilding },
];

const COMPANIES = [
  { name: 'Capimax Group', country: 'USA & UK', url: 'https://capimaxgroup.com/', role: 'Primary holding group of 12 subsidiaries — the operational backbone of the ecosystem' },
  { name: 'Westoria Capital', country: 'United States', url: 'https://westoriacapital.com/', role: 'US capital & institutional investment platform accepting PRN' },
  { name: 'Crestmark Global', country: 'United Kingdom', url: 'https://crestmarkglobal.com/', role: 'UK global real estate & investment management integrating PRN' },
  { name: 'Valora Estates', country: 'Spain', url: 'https://valoraestatesglobal.com/', role: 'Spanish real estate platform — EU property acquisitions in PRN' },
  { name: 'Aethera Development', country: 'Greece', url: 'https://aetheradevelopment.com/', role: 'Greek property development accepting PRN for Mediterranean projects' },
  { name: 'Verdea Estates', country: 'Georgia', url: 'https://verdeaestates.com/', role: 'Caucasus & Eastern European real estate accepting PRN' },
  { name: 'Elite Gate Properties', country: 'United Kingdom', url: 'https://elitegateproperties.com/', role: 'UK luxury & premium real estate agency accepting PRN' },
  { name: 'Prime Inn Hotels', country: 'USA & Europe', url: 'https://priminnhotels.com/', role: 'International hospitality & hotel investment accepting PRN' },
];

const PLATFORM_APPS = [
  ['Pronova Exchange Interface', 'PRN acquisition, trading (post-listing), staking, and portfolio management.'],
  ['Real Estate Investment Platform', 'Fractional property ownership, tokenized listing, yield tracking, and governance.'],
  ['Institutional Investment Dashboard', 'Portfolio management, RWA allocation tracking, analytics, and governance for institutions.'],
  ['Lending & Finance Portal', 'PRN-collateralized lending, loan management, and collateral-ratio monitoring.'],
  ['AI Analytics Suite', 'AI-powered optimization, risk assessment, and market intelligence for premium participants.'],
  ['Business Integration Portal', 'Onboarding for businesses accepting PRN payments, with conversion facilities and partner benefits.'],
];

const NOVA_ROLES = [
  ['Financing Asset', 'Deployed as the primary asset in structured financing without traditional banking intermediaries.'],
  ['Lending Asset', 'Used in collateralized loan structures; borrowers receive PRN-denominated facilities against qualified collateral.'],
  ['Real Estate Financing Tool', 'Deployed to finance property acquisitions — a mortgage-equivalent instrument.'],
  ['Partial Property Financing', 'Enables fractional property financing without requiring full purchase capital.'],
  ['Operational Digital Instrument', 'An active financial tool within Nova Digital Finance’s comprehensive services.'],
  ['Asset Acquisition Currency', 'Used directly to acquire real-world assets and investment opportunities.'],
];

const MULTI_ARM = [
  ['Speculative & Trading Arm', 'Traders & market participants', 'Post-listing trading, arbitrage, market-making'],
  ['Utility & Operational Arm', 'Platform users & businesses', 'Fee payments, partner transactions, discounts across companies'],
  ['Investment & Asset-Backed Arm', 'Real estate & RWA investors', 'Property acquisition, fractional stakes, tokenized pools'],
  ['Financing & Lending Arm', 'Borrowers & leveraged investors', 'Collateral deployment, mortgages, Nova Digital Finance products'],
];

const INCENTIVES = [
  ['Platform Fee Discounts', '5–30% discount on platform fees when paid in PRN vs. fiat or other crypto'],
  ['Staking Yield Enhancement', 'Elevated APY for participants meeting minimum holding & activity thresholds'],
  ['Investment Access Priority', 'Priority access to premium real estate & investment opportunities for qualified stakers'],
  ['Partner Exclusive Benefits', 'Exclusive PRN-holder discounts and priority services across partner companies'],
];

const UNIFIED = [
  ['Trading', 'Post-listing CEX trading and DEX liquidity pools on BNB Smart Chain'],
  ['Financing', 'Nova Digital Finance PRN-based lending & mortgage infrastructure'],
  ['Real Estate Participation', 'Four Capimax platforms + international partners accepting PRN across six countries'],
  ['Tokenized Assets', 'On-chain RWA framework with fractional ownership, yield distribution & governance'],
  ['Institutional Ecosystems', 'Six incorporated entities, CIM oversight, insurance & SolidProof audit'],
  ['Real Operational Utility', 'Active pre-listing utility across 18+ platforms & partners — verifiable today'],
  ['Asset-Backed Liquidity', 'Real estate-anchored liquidity independent of crypto market sentiment'],
];

const ROADMAP = [
  { phase: 'Phase 1 — Foundation & Pre-Sale', when: 'Completed / In Progress', done: true, items: ['Six incorporated entities (USA & UK)', 'SolidProof audit — token, vesting & pre-sale contracts', 'Insurance frameworks (HCC, Assurax, HCC International)', '18+ partner PRN acceptance announcements', 'CIM Financial Group oversight & real estate platform integrations', 'Pre-Sale Stage 1 launch (100M PRN @ $0.80)'] },
  { phase: 'Phase 2 — Ecosystem Activation', when: '2026', done: false, items: ['Pre-Sale Stages 2 & 3 completion', 'Staking protocol deployment & activation', 'Lending & collateral protocol launch', 'First tokenized real estate properties listed', 'AI analytics beta & Tier 2 CEX listings', 'Partner network expansion & GCC regional launch'] },
  { phase: 'Phase 3 — Institutional Scale', when: '2026 – 2027', done: false, items: ['Tier 1 CEX listing campaign', '100+ properties tokenized across the ecosystem', 'Institutional investment fund products', 'Cross-chain interoperability bridges', 'Asia-Pacific market expansion & Layer 2 integration'] },
  { phase: 'Phase 4 — Global Leadership', when: '2027+', done: false, items: ['Dedicated blockchain infrastructure evaluation', 'Global top-tier exchange listings', 'Full cross-chain interoperability', 'Integration with traditional finance & institutional custodians'] },
];

const MEDIA = [
  { name: 'GB Journal', url: 'https://www.gbjournal.world/' },
  { name: 'Domynex Global', url: 'https://domynexglobal.com/' },
  { name: 'Econix Global', url: 'https://econixglobal.com/' },
];

const OFFICIAL_LINKS = [
  ['Smart Contract Audit', 'Published via SolidProof', AUDIT_URL],
  ['Nova Digital Finance', 'PRN-based financing platform', 'https://novadf.com/'],
  ['Capimax Group', 'Ecosystem holding group', 'https://capimaxgroup.com/'],
  ['HCC Insurance', 'Technology & digital asset coverage', 'https://hccglobalcoverage.com/'],
  ['Assurax Insurance', 'Cyber & digital asset protection', 'https://assuraxinsurance.com/'],
  ['CIM Financial Group', 'Financial oversight', 'https://cimfingroup.com/'],
];

// ---------- Presentational helpers ----------

const Fade = ({ children, delay = 0, className = '' }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-60px' }}
    transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
  >
    {children}
  </motion.div>
);

const Section = ({ id, number, eyebrow, title, children }) => (
  <section id={id} className="scroll-mt-28 mb-20 md:mb-28">
    <Fade>
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-600 to-secondary-500 text-white flex items-center justify-center font-heading font-bold text-xl shadow-lg shadow-primary-500/25">
          {number}
        </div>
        <div>
          {eyebrow && <div className="text-primary-500 text-xs font-semibold uppercase tracking-[0.2em] mb-1">{eyebrow}</div>}
          <h2 className="text-2xl md:text-4xl font-heading font-bold text-gray-900 dark:text-white leading-tight">{title}</h2>
        </div>
      </div>
      <div className="h-px w-full bg-gradient-to-r from-primary-500/40 via-secondary-500/20 to-transparent mb-8" />
      <div className="space-y-5 text-gray-600 dark:text-gray-300 leading-relaxed text-[1.03rem]">{children}</div>
    </Fade>
  </section>
);

const SubHead = ({ children }) => (
  <h3 className="text-xl font-heading font-bold mt-10 mb-4 text-gray-900 dark:text-white">{children}</h3>
);

const IconCard = ({ icon: Icon, title, children, accent = 'from-primary-500 to-secondary-500' }) => {
  const { darkMode } = useTheme();
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={`group relative overflow-hidden rounded-2xl border p-6 h-full ${
        darkMode ? 'bg-dark-800 border-primary-600/20 hover:border-primary-500/50' : 'bg-white border-gray-200/80 hover:border-primary-300/70 shadow-sm hover:shadow-xl'
      }`}
    >
      <div className={`absolute -top-10 -right-10 w-28 h-28 rounded-full bg-gradient-to-br ${accent} opacity-[0.07] group-hover:opacity-[0.14] blur-2xl transition-opacity`} />
      {Icon && (
        <div className={`relative inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${accent} text-white mb-4 shadow-md`}>
          <Icon size={20} />
        </div>
      )}
      <h4 className="relative font-semibold text-gray-900 dark:text-white mb-2">{title}</h4>
      <p className="relative text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{children}</p>
    </motion.div>
  );
};

const Callout = ({ icon: Icon, title, children, href, hrefLabel, tone = 'primary' }) => {
  const tones = {
    primary: { chip: 'from-primary-500 to-secondary-500', box: 'border-primary-500/30 bg-primary-500/[0.06]' },
    amber: { chip: 'from-amber-500 to-orange-500', box: 'border-amber-500/30 bg-amber-500/[0.06]' },
  };
  const t = tones[tone] || tones.primary;
  return (
    <div className={`rounded-2xl border ${t.box} p-6 my-8`}>
      <div className="flex items-start gap-4">
        {Icon && (
          <div className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${t.chip} text-white flex items-center justify-center shadow-md`}>
            <Icon size={20} />
          </div>
        )}
        <div className="min-w-0">
          {title && <h4 className="font-semibold text-gray-900 dark:text-white mb-1">{title}</h4>}
          <div className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{children}</div>
          {href && (
            <a href={href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 mt-3 text-sm font-semibold text-primary-500 hover:gap-3 transition-all">
              {hrefLabel} <FaExternalLinkAlt size={11} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

const Table = ({ head, rows }) => {
  const { darkMode } = useTheme();
  return (
    <div className={`overflow-x-auto my-8 rounded-2xl border ${darkMode ? 'border-primary-600/20' : 'border-gray-200/80 shadow-sm'}`}>
      <table className="w-full text-sm text-left">
        <thead>
          <tr className="bg-gradient-to-r from-primary-500/10 to-secondary-500/10">
            {head.map((h, i) => (
              <th key={i} className="px-5 py-4 font-semibold text-gray-900 dark:text-white whitespace-nowrap">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className={`border-t transition-colors ${darkMode ? 'border-primary-600/10 hover:bg-dark-800/60' : 'border-gray-100 hover:bg-primary-50/40'}`}>
              {r.map((c, j) => (
                <td key={j} className={`px-5 py-4 align-top ${j === 0 ? 'font-medium text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-300'}`}>{c}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const Grid = ({ children, cols = 'md:grid-cols-3' }) => (
  <div className={`grid grid-cols-1 ${cols} gap-5 my-8`}>{children}</div>
);

const Bullets = ({ items, cols = 'sm:grid-cols-2' }) => {
  const { darkMode } = useTheme();
  return (
    <div className={`grid grid-cols-1 ${cols} gap-3 my-6`}>
      {items.map((it, i) => (
        <div key={i} className={`flex items-start gap-3 p-4 rounded-xl border ${darkMode ? 'bg-dark-800 border-primary-600/20' : 'bg-white border-gray-200/80'}`}>
          <FaCheckCircle className="text-primary-500 flex-shrink-0 mt-0.5" size={14} />
          <span className="text-sm text-gray-700 dark:text-gray-300">{it}</span>
        </div>
      ))}
    </div>
  );
};

const Whitepaper = () => {
  const { darkMode } = useTheme();
  const [activeSection, setActiveSection] = useState(SECTIONS[0].id);
  const [showTop, setShowTop] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      setShowTop(window.scrollY > 500);
      const h = document.documentElement;
      const scrolled = h.scrollTop / (h.scrollHeight - h.clientHeight);
      setProgress(Math.min(1, Math.max(0, scrolled)));
    };
    window.addEventListener('scroll', onScroll);
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) setActiveSection(e.target.id); }),
      { rootMargin: '-30% 0px -60% 0px' }
    );
    SECTIONS.forEach((s) => { const el = document.getElementById(s.id); if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id) => { const el = document.getElementById(id); if (el) el.scrollIntoView({ behavior: 'smooth' }); };

  return (
    <>
      <Helmet>
        <title>Whitepaper — Pronova (PRN) Institutional Ecosystem</title>
        <meta name="description" content="The official Pronova (PRN) whitepaper — an institutional, utility-backed digital asset ecosystem bridging real estate, RWA, and institutional finance on BNB Smart Chain." />
      </Helmet>

      {/* Reading progress bar */}
      <div className="fixed top-0 left-0 right-0 h-1 z-50 bg-transparent">
        <div className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 origin-left transition-transform duration-150" style={{ transform: `scaleX(${progress})` }} />
      </div>

      {/* Hero */}
      <section className={`relative pt-32 pb-20 overflow-hidden ${darkMode ? 'bg-dark-900' : 'bg-white'}`}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[10%] w-[420px] h-[420px] rounded-full bg-primary-600/20 blur-[120px]" />
          <div className="absolute top-[20%] right-[5%] w-[380px] h-[380px] rounded-full bg-secondary-500/20 blur-[120px]" />
          <div className={`absolute inset-0 opacity-[0.35] ${darkMode
            ? 'bg-[radial-gradient(circle_at_1px_1px,rgba(148,130,255,0.12)_1px,transparent_0)]'
            : 'bg-[radial-gradient(circle_at_1px_1px,rgba(124,66,255,0.07)_1px,transparent_0)]'}`}
            style={{ backgroundSize: '32px 32px' }} />
        </div>

        <div className="container-custom relative z-10">
          <Fade>
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-600/15 border border-primary-500/25 text-primary-500 text-sm font-semibold mb-6 backdrop-blur-sm">
                <FaFileContract /> Official Whitepaper · v1.0 — Institutional Edition
              </div>
              <h1 className={`text-5xl md:text-7xl font-heading font-bold mb-6 leading-[0.95] ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Pronova <span className="gradient-text">(PRN)</span>
              </h1>
              <p className={`text-lg md:text-2xl leading-relaxed font-light ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                An institutional, global, <span className="font-semibold text-primary-500">utility-backed</span> digital asset
                ecosystem — bridging blockchain with real-world investment, real estate, tokenized assets, and institutional finance.
              </p>

              <div className="flex flex-wrap gap-2.5 mt-8">
                {[
                  { icon: FaShieldAlt, label: 'SolidProof Audited' },
                  { icon: FaBalanceScale, label: '6 Incorporated Entities' },
                  { icon: FaLayerGroup, label: 'BNB Smart Chain' },
                  { icon: FaLock, label: 'Insured Pre-Launch' },
                ].map((c, i) => {
                  const Icon = c.icon;
                  return (
                    <span key={i} className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium border ${darkMode ? 'bg-dark-800 border-primary-600/20 text-gray-300' : 'bg-white border-gray-200/80 text-gray-600 shadow-sm'}`}>
                      <Icon className="text-primary-500" size={12} /> {c.label}
                    </span>
                  );
                })}
              </div>

              <div className="flex flex-wrap gap-3 mt-8">
                <a href={AUDIT_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-primary-600 to-secondary-600 text-white font-semibold shadow-lg shadow-primary-500/25 hover:scale-105 transition-transform">
                  View SolidProof Audit <FaExternalLinkAlt size={13} />
                </a>
                <button onClick={() => scrollTo('tokenomics')} className={`inline-flex items-center gap-2 px-7 py-3.5 rounded-full border-2 font-semibold transition-colors ${darkMode ? 'border-slate-600 text-slate-200 hover:bg-slate-800/50' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}>
                  Explore Tokenomics
                </button>
              </div>
            </div>
          </Fade>

          <Fade delay={0.1}>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-16">
              {TOKEN_METRICS.map((m, i) => {
                const Icon = m.icon;
                return (
                  <div key={i} className={`group rounded-2xl border p-5 transition-all hover:-translate-y-1 ${darkMode ? 'bg-dark-800 border-primary-600/20 hover:border-primary-500/40' : 'bg-white border-gray-200/80 shadow-sm hover:shadow-lg'}`}>
                    <div className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500 text-white mb-3">
                      <Icon size={15} />
                    </div>
                    <div className="text-[0.68rem] uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-0.5">{m.label}</div>
                    <div className={`font-heading font-bold text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>{m.value}</div>
                  </div>
                );
              })}
            </div>
          </Fade>
        </div>
      </section>

      {/* Body */}
      <div className={`${darkMode ? 'bg-dark-900' : 'bg-gray-50'}`}>
        <div className="container-custom py-16">
          <div className="lg:grid lg:grid-cols-[260px_1fr] lg:gap-14">
            {/* Sidebar TOC */}
            <aside className="hidden lg:block">
              <div className="sticky top-28">
                <div className="text-[0.7rem] uppercase tracking-[0.2em] text-gray-400 mb-4 font-semibold px-3">Contents</div>
                <nav className="space-y-0.5">
                  {SECTIONS.map((s, idx) => {
                    const Icon = s.icon;
                    const active = activeSection === s.id;
                    return (
                      <button
                        key={s.id}
                        onClick={() => scrollTo(s.id)}
                        className={`w-full text-left flex items-center gap-3 pl-3 pr-2 py-2 rounded-lg text-sm transition-all border-l-2 ${
                          active
                            ? 'border-primary-500 bg-primary-500/10 text-primary-500 font-semibold'
                            : darkMode ? 'border-transparent text-gray-400 hover:text-white hover:bg-dark-800' : 'border-transparent text-gray-500 hover:text-gray-900 hover:bg-white'
                        }`}
                      >
                        <span className={`flex-shrink-0 text-[0.65rem] font-mono ${active ? 'text-primary-500' : 'text-gray-400'}`}>{String(idx + 1).padStart(2, '0')}</span>
                        <Icon size={13} className="flex-shrink-0" />
                        <span className="truncate">{s.title}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>
            </aside>

            {/* Content */}
            <div className="min-w-0">
              {/* 01 */}
              <Section id="executive-summary" number="01" eyebrow="Overview" title="Executive Summary">
                <p>
                  Pronova (PRN) is a next-generation institutional digital asset ecosystem, owned by{' '}
                  <strong className="text-gray-900 dark:text-white">Pronova Virtual Asset</strong> (Wyoming, USA) and operated
                  through a network of incorporated entities across the USA and UK, in partnership with 12 companies from the
                  Capimax Group ecosystem — purpose-built to bridge blockchain infrastructure with real-world investment, real
                  estate ownership, tokenized assets, and institutional finance.
                </p>
                <p>
                  The global digital asset sector has grown into a multi-trillion-dollar asset class, yet a profound structural gap
                  persists: most projects remain disconnected from real-world economic activity. Pronova was conceived to address
                  this gap — the PRN token functions as the operational currency of a multi-layered investment, real estate, and
                  digital finance infrastructure, deriving demand from real economic activity rather than speculation.
                </p>

                <SubHead>The Pronova Differentiation</SubHead>
                <Table head={['Dimension', 'Traditional Crypto Projects', 'Pronova Ecosystem']} rows={DIFF_TABLE} />

                <SubHead>Ecosystem Architecture at a Glance</SubHead>
                <p>
                  Pronova operates through an integrated multi-layer architecture spanning six dimensions: (1) the PRN utility token
                  on BNB Smart Chain; (2) a real estate & RWA integration framework; (3) institutional investment infrastructure;
                  (4) a digital finance & payment network; (5) a governance & compliance framework across US & UK entities; and
                  (6) an AI-powered smart investment layer.
                </p>

                <SubHead>Investment Thesis</SubHead>
                <p>
                  Pronova converges three of the most compelling institutional themes of the decade: the maturation of blockchain
                  from speculative asset to institutional infrastructure; the tokenization of real-world assets; and the integration
                  of AI into investment management. Backed by incorporated entities, insurance frameworks, independent audits, and
                  real estate-anchored liquidity, Pronova invites participants into an already-operational ecosystem.
                </p>
              </Section>

              {/* 02 */}
              <Section id="vision-mission" number="02" eyebrow="Direction" title="Vision, Mission & Core Principles">
                <p>
                  <strong className="text-gray-900 dark:text-white">Vision:</strong> to become the world's leading institutional
                  ecosystem integrating blockchain technology, real-world asset ownership, tokenized investment infrastructure, and
                  digital financial services — a globally accessible, institutionally governed, utility-first digital asset standard.
                </p>
                <p>
                  <strong className="text-gray-900 dark:text-white">Mission:</strong> to architect, deploy, and scale an
                  institutional-grade ecosystem that democratizes access to real-world investment, real estate ownership, and digital
                  financial services — while maintaining the highest standards of governance, compliance, security, and transparency.
                </p>
                <SubHead>Five Core Strategic Principles</SubHead>
                <Grid cols="md:grid-cols-2 lg:grid-cols-3">
                  {CORE_PRINCIPLES.map(([t, d, Icon, accent], i) => (
                    <IconCard key={i} icon={Icon} title={t} accent={accent}>{d}</IconCard>
                  ))}
                </Grid>
                <SubHead>The Market Opportunity</SubHead>
                <p>
                  The total addressable market spans several converging sectors: the global real estate market (~$380 trillion), the
                  RWA tokenization market (projected to exceed $16 trillion by 2030), and the digital payments market (expected to
                  surpass $15 trillion in annual volume by the end of the decade).
                </p>
                <Bullets items={MARKET_CONTEXT} cols="sm:grid-cols-1" />
              </Section>

              {/* 03 */}
              <Section id="problem" number="03" eyebrow="Market Gap" title="Problem Statement & Global Market Analysis">
                <p>
                  Despite generating over $2 trillion in peak market capitalization, the sector suffers from deeply embedded
                  structural deficiencies. Pronova was designed with explicit awareness of each, with institutional-grade solutions
                  engineered into its core architecture from day one.
                </p>
                <div className="space-y-4 my-6">
                  {PROBLEMS.map(([title, problem, response], i) => (
                    <div key={i} className={`rounded-2xl border p-6 ${darkMode ? 'bg-dark-800 border-primary-600/20' : 'bg-white border-gray-200/80 shadow-sm'}`}>
                      <h4 className="font-heading font-bold text-gray-900 dark:text-white mb-2">{title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{problem}</p>
                      <div className="flex items-start gap-2 text-sm">
                        <span className="text-primary-500 font-semibold flex-shrink-0">Pronova Response:</span>
                        <span className="text-gray-600 dark:text-gray-300">{response}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <Callout icon={FaLink} title="Verify the operational platforms" href="https://capimaxgroup.com/" hrefLabel="capimaxgroup.com">
                  Check capimaxrt.com · capimaxbrx.com · capimaxpropshare.com · capimaxasset.com · and finance with PRN at novadf.com —
                  all linked from the Pronova web and independently verifiable.
                </Callout>
              </Section>

              {/* 04 */}
              <Section id="ecosystem" number="04" eyebrow="Architecture" title="The Pronova Ecosystem">
                <p>
                  The PRN token functions as the central operational currency connecting six interdependent domains. Pronova is not a
                  token seeking to build utility in the future — it is an operational ecosystem with existing infrastructure that the
                  token powers from launch.
                </p>
                <SubHead>Seven-Layer Architecture</SubHead>
                <div className="space-y-2 my-6">
                  {ARCH_LAYERS.map(([name, desc], i) => (
                    <div key={i} className={`flex items-center gap-4 p-4 rounded-xl border ${darkMode ? 'bg-dark-800 border-primary-600/20' : 'bg-white border-gray-200/80'}`}>
                      <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500 text-white flex items-center justify-center text-xs font-bold">{i + 1}</div>
                      <div>
                        <span className="font-semibold text-gray-900 dark:text-white text-sm">{name}</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400"> — {desc}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <SubHead>Institutional Entity Structure</SubHead>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {ENTITIES.map((e, i) => (
                    <motion.div key={i} whileHover={{ y: -4 }} className={`rounded-2xl border p-5 flex items-center gap-4 ${darkMode ? 'bg-dark-800 border-primary-600/20 hover:border-primary-500/40' : 'bg-white border-gray-200/80 shadow-sm hover:shadow-lg'}`}>
                      <div className={`flex-shrink-0 w-16 h-16 rounded-xl flex items-center justify-center p-2.5 ${darkMode ? 'bg-white' : 'bg-gray-50 border border-gray-100'}`}>
                        <img src={e.logo} alt={e.name} className="max-h-full max-w-full object-contain" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-gray-900 dark:text-white text-sm leading-snug">{e.name}</div>
                        <div className="text-xs text-primary-500 font-medium mb-1">{e.juris}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 leading-snug">{e.fn}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <SubHead>Ecosystem Operational Flow</SubHead>
                <p>A participant may acquire PRN and deploy it across any combination of five operational pathways:</p>
                <Grid cols="md:grid-cols-2 lg:grid-cols-3">
                  {OP_FLOW.map(([t, d, Icon], i) => (
                    <IconCard key={i} icon={Icon} title={t}>{d}</IconCard>
                  ))}
                </Grid>
              </Section>

              {/* 05 */}
              <Section id="liquidity" number="05" eyebrow="Innovation" title="Utility-Backed Liquidity Model">
                <p>
                  Conventional crypto liquidity is generated almost exclusively through speculative trading, which evaporates in bear
                  markets. Pronova's Utility-Backed Liquidity Model (UBLM) supplements — and ultimately partially supplants —
                  speculative liquidity with liquidity generated by real economic activity, across three pillars:
                </p>
                <Grid>
                  <IconCard icon={FaHome} title="1 · Real Estate-Backed" accent="from-teal-500 to-emerald-500">Property transactions in PRN create economically-motivated demand; the property's valuation anchors the PRN transacted.</IconCard>
                  <IconCard icon={FaExchangeAlt} title="2 · Operational Platform">18+ companies accepting PRN create continuous, cycling buy/sell demand proportional to operational volume.</IconCard>
                  <IconCard icon={FaLock} title="3 · Staking & Lock" accent="from-indigo-500 to-blue-500">~45% of supply locked up to 9 years creates asymmetric dynamics — natural price support from supply scarcity.</IconCard>
                </Grid>

                <SubHead>Liquidity Flow Architecture</SubHead>
                <div className="grid md:grid-cols-2 gap-5 my-6">
                  <div className={`rounded-2xl border p-6 ${darkMode ? 'bg-dark-800 border-primary-600/20' : 'bg-white border-gray-200/80 shadow-sm'}`}>
                    <div className="text-xs uppercase tracking-wider text-green-500 font-semibold mb-3">Inflow Sources</div>
                    <ul className="space-y-2">{LIQ_INFLOWS.map((x, i) => <li key={i} className="text-sm text-gray-600 dark:text-gray-300 flex items-start gap-2"><span className="text-green-500 mt-0.5">↓</span>{x}</li>)}</ul>
                  </div>
                  <div className={`rounded-2xl border p-6 ${darkMode ? 'bg-dark-800 border-primary-600/20' : 'bg-white border-gray-200/80 shadow-sm'}`}>
                    <div className="text-xs uppercase tracking-wider text-primary-500 font-semibold mb-3">Outflow Controls</div>
                    <ul className="space-y-2">{LIQ_OUTFLOWS.map((x, i) => <li key={i} className="text-sm text-gray-600 dark:text-gray-300 flex items-start gap-2"><span className="text-primary-500 mt-0.5">•</span>{x}</li>)}</ul>
                  </div>
                </div>

                <SubHead>Stability Strategy Framework</SubHead>
                <Grid cols="md:grid-cols-2">
                  {STABILITY.map(([t, d], i) => <IconCard key={i} icon={[FaCoins, FaChartPie, FaShieldAlt, FaBalanceScale][i]} title={t} accent={['from-primary-500 to-secondary-500', 'from-teal-500 to-emerald-500', 'from-amber-500 to-orange-500', 'from-indigo-500 to-blue-500'][i]}>{d}</IconCard>)}
                </Grid>
              </Section>

              {/* 06 */}
              <Section id="rwa" number="06" eyebrow="Real Assets" title="Real World Asset (RWA) Integration Framework">
                <p>
                  RWA tokenization is identified by institutional analysts as the most transformative application of blockchain in
                  finance. BlackRock's Larry Fink described it as the 'next generation for markets,' and Boston Consulting Group
                  projects the tokenized asset market to reach $16 trillion by 2030. Pronova connects PRN to this megatrend through
                  three principal models:
                </p>
                <Grid>
                  {RWA_MODELS.map(([t, d, Icon, accent], i) => <IconCard key={i} icon={Icon} title={t} accent={accent}>{d}</IconCard>)}
                </Grid>
                <SubHead>Institutional RWA Investment Framework</SubHead>
                <Grid>
                  {RWA_INSTITUTIONAL.map(([t, d], i) => <IconCard key={i} icon={[FaHandshake, FaChartPie, FaWater][i]} title={t}>{d}</IconCard>)}
                </Grid>
                <SubHead>Legal & Compliance Framework for RWA</SubHead>
                <Bullets items={[
                  'Jurisdictional Legal Review — tokenized structures reviewed for property-law compliance in the asset’s jurisdiction.',
                  'KYC/AML Integration — identity verification and screening consistent with FCA (UK) and US regulations.',
                  'Smart Contract Legal Wrapping — contractual frameworks ensuring on-chain transfers have off-chain recognition.',
                  'Regulatory Monitoring — ongoing monitoring of property tokenization regulations, particularly under MiCA.',
                ]} />
              </Section>

              {/* 07 */}
              <Section id="tokenomics" number="07" eyebrow="Economics" title="Tokenomics & Token Architecture">
                <p>
                  PRN's tokenomics were designed to support sustainable, long-term ecosystem growth with structural protections
                  against the supply-side shocks and governance failures that undermine most comparable projects.
                </p>
                <SubHead>Core Token Parameters</SubHead>
                <Table head={['Parameter', 'Specification']} rows={TOKEN_PARAMS} />

                <SubHead>Token Allocation</SubHead>
                <div className={`rounded-3xl border p-6 md:p-8 my-8 ${darkMode ? 'bg-dark-800 border-primary-600/20' : 'bg-white border-gray-200/80 shadow-sm'}`}>
                  <div className="grid lg:grid-cols-2 gap-8 items-center">
                    <div><TokenomicsChart /></div>
                    <div className="space-y-2.5">
                      {ALLOCATION.map(([label, pct, tokens, , color], i) => (
                        <div key={i} className={`flex items-center justify-between gap-3 p-3 rounded-xl ${darkMode ? 'bg-dark-900' : 'bg-gray-50'}`}>
                          <div className="flex items-center gap-3 min-w-0">
                            <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                            <span className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{label}</span>
                          </div>
                          <div className="flex items-center gap-4 flex-shrink-0">
                            <span className="text-sm font-bold text-gray-900 dark:text-white">{pct}%</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400 w-24 text-right hidden sm:block">{tokens}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <SubHead>Token Locking & Vesting</SubHead>
                <p>
                  Approximately 45% of total supply — 450,000,000 tokens — is subject to long-term locking extending up to nine years,
                  implemented through time-locked smart contracts that cannot be modified by any single party, including the founding
                  entities. This provides cryptographic guarantees, not merely contractual promises.
                </p>

                <SubHead>Pre-Sale Structure</SubHead>
                <div className="grid sm:grid-cols-3 gap-5">
                  {STAGES.map((s, i) => (
                    <motion.div key={i} whileHover={{ y: -6 }} className={`relative rounded-2xl border p-6 text-center overflow-hidden ${
                      s.live
                        ? 'bg-gradient-to-br from-primary-600 to-secondary-600 text-white border-transparent shadow-xl shadow-primary-500/30'
                        : darkMode ? 'bg-dark-800 border-primary-600/20' : 'bg-white border-gray-200/80 shadow-sm'
                    }`}>
                      {s.live && <span className="absolute top-3 right-3 text-[0.6rem] font-bold uppercase tracking-wider bg-white/25 px-2 py-0.5 rounded-full">Live</span>}
                      <div className={`text-xs uppercase tracking-wider mb-2 ${s.live ? 'text-white/80' : 'text-primary-500'}`}>{s.stage}</div>
                      <div className={`text-4xl font-heading font-bold mb-1 ${s.live ? 'text-white' : 'text-gray-900 dark:text-white'}`}>{s.price}</div>
                      <div className={`text-sm mb-4 ${s.live ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'}`}>per PRN</div>
                      <div className={`text-sm font-medium ${s.live ? 'text-white/90' : 'text-gray-700 dark:text-gray-300'}`}>{s.tokens}</div>
                      <div className={`text-xs mt-1 ${s.live ? 'text-white/70' : 'text-gray-400'}`}>Target: {s.target}</div>
                      <div className={`text-xs ${s.live ? 'text-white/70' : 'text-gray-400'}`}>{s.valuation}</div>
                    </motion.div>
                  ))}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-6">
                  Accepted currencies: ETH, BNB, USD, and USDT. All figures are targets; digital assets carry market risk and no price
                  performance is guaranteed.
                </p>
              </Section>

              {/* 08 */}
              <Section id="technology" number="08" eyebrow="Infrastructure" title="Technology & Infrastructure">
                <p>
                  Pronova is deployed on BNB Smart Chain following a comprehensive technical evaluation of throughput, cost,
                  ecosystem maturity, and institutional adoption. Its sub-cent costs and three-second finality are operational
                  necessities for real estate micro-transactions, fractional distributions, staking, and lending.
                </p>
                <Table head={['Metric', 'BNB Smart Chain', 'Ethereum', 'Solana']} rows={BSC_COMPARE} />
                <SubHead>Smart Contract Architecture</SubHead>
                <div className="grid sm:grid-cols-2 gap-4 my-6">
                  {CONTRACT_MODULES.map(([t, d], i) => (
                    <div key={i} className={`rounded-2xl border p-5 ${darkMode ? 'bg-dark-800 border-primary-600/20' : 'bg-white border-gray-200/80 shadow-sm'}`}>
                      <div className="flex items-center gap-2 mb-1"><FaCube className="text-primary-500" size={13} /><span className="font-semibold text-gray-900 dark:text-white text-sm">{t}</span></div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{d}</p>
                    </div>
                  ))}
                </div>
                <div className={`rounded-3xl border p-6 md:p-8 my-8 flex flex-col sm:flex-row items-center gap-6 ${darkMode ? 'bg-dark-800 border-primary-500/30' : 'bg-white border-primary-200 shadow-sm'}`}>
                  <img src={solidproofLogo} alt="SolidProof" className="h-24 w-24 object-contain flex-shrink-0" />
                  <div>
                    <div className="inline-flex items-center gap-2 text-xs font-semibold text-green-500 mb-2"><FaCheckCircle /> Audit Completed & Published</div>
                    <h4 className="text-xl font-heading font-bold text-gray-900 dark:text-white mb-2">Independent Security Audit — SolidProof</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">A comprehensive audit of the token, vesting, and pre-sale contracts was completed and published prior to the pre-sale launch — independently verifiable by any counterparty.</p>
                    <a href={AUDIT_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold text-primary-500 hover:gap-3 transition-all">View published report <FaExternalLinkAlt size={11} /></a>
                  </div>
                </div>
                <SubHead>Future Infrastructure Roadmap</SubHead>
                <Grid>
                  <IconCard icon={FaLayerGroup} title="Layer 2 Integration">ZK-Rollup solutions evaluated as volumes scale — potentially 10–100× throughput at proportionally lower cost.</IconCard>
                  <IconCard icon={FaNetworkWired} title="Cross-Chain Interoperability" accent="from-indigo-500 to-blue-500">Bridges enabling PRN across Ethereum, Polygon, Arbitrum, and other networks.</IconCard>
                  <IconCard icon={FaMicrochip} title="Dedicated Blockchain" accent="from-violet-500 to-purple-500">Long-term evaluation of a Pronova-specific chain optimized for RWA transaction characteristics.</IconCard>
                </Grid>
              </Section>

              {/* 09 */}
              <Section id="governance" number="09" eyebrow="Compliance" title="Institutional Governance, Compliance & Legal">
                <p>
                  Pronova operates a dual-layer governance architecture combining on-chain decentralized governance with off-chain
                  institutional governance across six incorporated entities.
                </p>
                <Grid cols="md:grid-cols-2">
                  <IconCard icon={FaGavel} title="On-Chain Governance">Weighted voting anchored to staked PRN — scope includes token parameters, contract upgrades, feature activation, and treasury allocation. Critical decisions require supermajority plus institutional sign-off.</IconCard>
                  <IconCard icon={FaBalanceScale} title="Off-Chain Governance" accent="from-indigo-500 to-blue-500">Board structures, fiduciary duties, and compliance programs, with dedicated financial oversight by CIM Financial Group (cimfingroup.com) — operational from launch.</IconCard>
                </Grid>
                <SubHead>Compliance Framework</SubHead>
                <p>
                  Pronova implements a comprehensive AML/KYC framework — document verification, biometric matching, PEP & sanctions
                  screening, and ongoing transaction monitoring — consistent with FATF Recommendations, the UK's Money Laundering
                  Regulations 2017, and US Bank Secrecy Act requirements. Data is processed in compliance with GDPR.
                </p>
                <SubHead>Legal Structure & Jurisdictional Strategy</SubHead>
                <Table head={['Jurisdiction', 'Rationale']} rows={[
                  ['Wyoming, USA', 'First US state with comprehensive blockchain legislation (Blockchain Extender Act, DAO LLC Act) — optimal for token issuers.'],
                  ['Delaware, USA', 'Dominant US corporate jurisdiction with extensive governance precedent and institutional credibility.'],
                  ['United Kingdom', 'Progressive post-Brexit framework (FSMA 2023) rewarding institutionally structured projects; positions for FCA engagement.'],
                ]} />
                <p className="text-sm text-gray-500 dark:text-gray-400">The ecosystem is designed to accommodate MiCA (EU), UK FCA frameworks, SEC/CFTC guidance, and FATF Travel Rule requirements.</p>
              </Section>

              {/* 10 */}
              <Section id="insurance" number="10" eyebrow="Protection" title="Institutional Insurance & Risk Management">
                <p>
                  While most crypto projects treat insurance as a future aspiration, Pronova established concrete relationships with
                  specialized institutional insurers prior to the pre-sale launch — verifiable rather than merely promised.
                </p>
                <Grid>
                  <IconCard icon={FaShieldAlt} title="HCC">Technology-focused insurance infrastructure for digital asset operations, smart contract failures, oracle manipulation, and protocol-level events. (hccglobalcoverage.com)</IconCard>
                  <IconCard icon={FaLock} title="Assurax Insurance" accent="from-teal-500 to-emerald-500">Cyber insurance and digital asset protection — hot wallet breaches, private key compromise, and third-party security failures. (assuraxinsurance.com)</IconCard>
                  <IconCard icon={FaBalanceScale} title="HCC International" accent="from-indigo-500 to-blue-500">Broad institutional coverage backed by a globally recognized conglomerate (Tokio Marine Group) with demonstrable claims-paying capacity.</IconCard>
                </Grid>
                <div className={`rounded-2xl border p-6 my-6 flex items-center justify-center gap-8 flex-wrap ${darkMode ? 'bg-white border-primary-600/20' : 'bg-white border-gray-200/80 shadow-sm'}`}>
                  <img src={hccLogo} alt="HCC" className="h-12 object-contain" />
                  <img src={assuraxLogo} alt="Assurax" className="h-12 object-contain" />
                  <img src={cimLogo} alt="CIM Financial Group" className="h-12 object-contain" />
                </div>
                <SubHead>Risk Management Framework</SubHead>
                <div className="grid sm:grid-cols-2 gap-4 my-6">
                  {RISK_CATS.map(([t, d], i) => (
                    <div key={i} className={`rounded-2xl border p-5 ${darkMode ? 'bg-dark-800 border-primary-600/20' : 'bg-white border-gray-200/80 shadow-sm'}`}>
                      <div className="flex items-center gap-2 mb-1"><span className="text-primary-500 font-bold text-sm">{i + 1}.</span><span className="font-semibold text-gray-900 dark:text-white text-sm">{t}</span></div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{d}</p>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">No system can guarantee absolute protection against all cyberattacks — participants should conduct their own risk assessment.</p>
              </Section>

              {/* 11 */}
              <Section id="ai" number="11" eyebrow="Intelligence" title="AI-Powered Smart Investment Infrastructure">
                <p>
                  The convergence of blockchain-native asset ownership with AI-powered investment intelligence creates capabilities
                  neither technology achieves alone. AI is integrated across five domains, with outputs delivered to smart contracts
                  through oracle integrations — enabling AI to directly influence protocol parameters such as dynamic collateral
                  ratios based on real-time risk.
                </p>
                <Grid>
                  {AI_DOMAINS.map(([t, d, Icon, accent], i) => <IconCard key={i} icon={Icon} title={t} accent={accent}>{d}</IconCard>)}
                </Grid>
              </Section>

              {/* 12 */}
              <Section id="revenue" number="12" eyebrow="Sustainability" title="Revenue Model & Financial Framework">
                <p>The ecosystem generates revenue across multiple concurrent streams, building diversification at the design stage:</p>
                <Table head={['Revenue Stream', 'Revenue Mechanism']} rows={REVENUE_STREAMS} />
                <SubHead>Financial Forecast Framework</SubHead>
                <p className="text-sm text-gray-500 dark:text-gray-400 -mt-2">Illustrative and based on modeled assumptions — not guarantees of financial performance.</p>
                <Table head={['Metric', 'Conservative (Y1)', 'Base Case (Y2)', 'Optimistic (Y3)']} rows={FORECAST} />
              </Section>

              {/* 13 */}
              <Section id="expansion" number="13" eyebrow="Growth" title="Global Expansion & Competitive Positioning">
                <SubHead>Geographic Expansion Framework</SubHead>
                <div className="space-y-3 my-6">
                  {EXPANSION_PHASES.map(([phase, markets, rationale], i) => (
                    <div key={i} className={`rounded-2xl border p-5 ${darkMode ? 'bg-dark-800 border-primary-600/20' : 'bg-white border-gray-200/80 shadow-sm'}`}>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-900 dark:text-white text-sm">{phase}</span>
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-primary-500/15 text-primary-500 font-medium">{markets}</span>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{rationale}</p>
                    </div>
                  ))}
                </div>
                <SubHead>Competitive Positioning</SubHead>
                <Table head={['Category', 'Key Competitors', 'Pronova Advantage', 'Limitation']} rows={COMPETITIVE} />
                <Callout icon={FaRocket} title="Utility Before Listing & Pre-Listing Exit">
                  Pronova's 18+ partner companies publicly announce PRN acceptance on their official websites — independently
                  verifiable before any investment decision. The Pre-Listing Exit Model further lets participants deploy PRN into
                  tokenized real estate and realize returns through ecosystem channels before exchange listing.
                </Callout>
              </Section>

              {/* 14 */}
              <Section id="roadmap" number="14" eyebrow="Execution" title="Ecosystem Development Roadmap">
                <div className="relative pl-8 md:pl-10">
                  <div className="absolute left-[11px] md:left-[15px] top-2 bottom-2 w-0.5 bg-gradient-to-b from-primary-500 via-secondary-500/50 to-transparent" />
                  <div className="space-y-6">
                    {ROADMAP.map((p, i) => (
                      <Fade key={i} delay={i * 0.05}>
                        <div className="relative">
                          <div className={`absolute -left-8 md:-left-10 top-1 w-6 h-6 rounded-full flex items-center justify-center border-4 ${darkMode ? 'border-dark-900' : 'border-gray-50'} ${p.done ? 'bg-green-500' : 'bg-gradient-to-br from-primary-500 to-secondary-500'}`}>
                            {p.done && <FaCheckCircle className="text-white" size={10} />}
                          </div>
                          <div className={`rounded-2xl border p-6 ${darkMode ? 'bg-dark-800 border-primary-600/20' : 'bg-white border-gray-200/80 shadow-sm'}`}>
                            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                              <h4 className="font-heading font-bold text-gray-900 dark:text-white">{p.phase}</h4>
                              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${p.done ? 'bg-green-500/15 text-green-500' : 'bg-primary-500/15 text-primary-500'}`}>{p.when}</span>
                            </div>
                            <ul className="space-y-2">
                              {p.items.map((it, j) => (
                                <li key={j} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                                  <FaCheckCircle className={`flex-shrink-0 mt-0.5 ${p.done ? 'text-green-500' : 'text-gray-300 dark:text-gray-600'}`} size={13} />
                                  {it}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </Fade>
                    ))}
                  </div>
                </div>
              </Section>

              {/* 15 */}
              <Section id="partnerships" number="15" eyebrow="Ecosystem" title="Partnerships, Platforms & Sector Integration">
                <p>
                  Pronova's partnership network is the most immediately verifiable element of its institutional credibility — a
                  growing roster of companies across five strategic sectors that publicly accept or support PRN today.
                </p>
                <SubHead>Strategic Sectors</SubHead>
                <div className="grid sm:grid-cols-2 gap-4 my-6">
                  {SECTORS.map(([t, d], i) => (
                    <div key={i} className={`rounded-2xl border p-5 ${darkMode ? 'bg-dark-800 border-primary-600/20' : 'bg-white border-gray-200/80 shadow-sm'}`}>
                      <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">{t}</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{d}</p>
                    </div>
                  ))}
                </div>

                <SubHead>Active Capimax Platforms Accepting PRN</SubHead>
                <Grid cols="md:grid-cols-2">
                  {PLATFORMS.map((p, i) => {
                    const Icon = p.icon;
                    return (
                      <motion.a key={i} href={p.url} target="_blank" rel="noopener noreferrer" whileHover={{ y: -4 }}
                        className={`group rounded-2xl border p-5 flex items-center gap-4 transition-colors ${darkMode ? 'bg-dark-800 border-primary-600/20 hover:border-primary-500/50' : 'bg-white border-gray-200/80 hover:border-primary-300 shadow-sm hover:shadow-lg'}`}>
                        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 text-white flex items-center justify-center"><Icon size={18} /></div>
                        <div className="flex-grow min-w-0">
                          <div className="font-semibold text-gray-900 dark:text-white">{p.name}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{p.desc}</div>
                        </div>
                        <FaExternalLinkAlt className="text-gray-400 group-hover:text-primary-500 flex-shrink-0" size={13} />
                      </motion.a>
                    );
                  })}
                </Grid>

                <SubHead>International Companies Accepting PRN</SubHead>
                <div className="grid sm:grid-cols-2 gap-3">
                  {COMPANIES.map((c, i) => (
                    <a key={i} href={c.url} target="_blank" rel="noopener noreferrer" className={`group flex items-start justify-between gap-3 p-4 rounded-xl border transition-colors ${darkMode ? 'bg-dark-800 border-primary-600/20 hover:border-primary-500/50' : 'bg-white border-gray-200/80 hover:border-primary-300 shadow-sm'}`}>
                      <div className="min-w-0">
                        <div className="font-semibold text-gray-900 dark:text-white text-sm">{c.name} <span className="text-xs font-normal text-primary-500">· {c.country}</span></div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 leading-snug mt-0.5">{c.role}</div>
                      </div>
                      <FaExternalLinkAlt className="text-gray-400 group-hover:text-primary-500 flex-shrink-0 mt-1" size={12} />
                    </a>
                  ))}
                </div>
                <div className={`rounded-2xl border p-6 mt-6 flex items-center justify-center gap-8 flex-wrap ${darkMode ? 'bg-white border-primary-600/20' : 'bg-white border-gray-200/80 shadow-sm'}`}>
                  {[[capimaxGroupLogo, 'Capimax Group'], [eliteGateLogo, 'Elite Gate'], [primeInnLogo, 'Prime Inn']].map(([logo, name], i) => (
                    <img key={i} src={logo} alt={name} className="h-11 object-contain" />
                  ))}
                </div>

                <SubHead>Platform Ecosystem — Integrated Applications</SubHead>
                <div className="grid sm:grid-cols-2 gap-4 my-6">
                  {PLATFORM_APPS.map(([t, d], i) => (
                    <div key={i} className={`rounded-2xl border p-5 ${darkMode ? 'bg-dark-800 border-primary-600/20' : 'bg-white border-gray-200/80 shadow-sm'}`}>
                      <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">{t}</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{d}</p>
                    </div>
                  ))}
                </div>
              </Section>

              {/* 16 */}
              <Section id="financing" number="16" eyebrow="Digital Finance" title="Financing, Lending & Digital Finance">
                <div className={`rounded-2xl border p-6 mb-6 flex items-center gap-5 ${darkMode ? 'bg-dark-800 border-primary-600/20' : 'bg-white border-gray-200/80 shadow-sm'}`}>
                  <div className={`flex-shrink-0 w-16 h-16 rounded-xl flex items-center justify-center p-2 ${darkMode ? 'bg-white' : 'bg-gray-50 border border-gray-100'}`}>
                    <img src={novaDigitalFinanceLogo} alt="Nova Digital Finance" className="max-h-full max-w-full object-contain" />
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    <strong className="text-gray-900 dark:text-white">Nova Digital Finance</strong> (novadf.com) is a UK-incorporated
                    platform and one of the first globally designed to provide financing and lending using PRN itself as the financial
                    instrument. Within its framework, PRN functions across six distinct financial roles:
                  </p>
                </div>
                <Table head={['PRN Financial Role', 'Description']} rows={NOVA_ROLES} />

                <SubHead>The Multi-Arm Utility Model</SubHead>
                <Table head={['Utility Arm', 'Primary Participants', 'PRN Demand Mechanism']} rows={MULTI_ARM} />

                <SubHead>Cross-Border Digital Finance</SubHead>
                <p>
                  Traditional correspondent banking costs 3–7% in fees and 2–5 business days in settlement. PRN-based cross-border
                  payments, where both parties operate within the ecosystem, achieve near-instant settlement at a fraction of the cost.
                </p>

                <SubHead>Incentive, Bonus & Discount Architecture</SubHead>
                <Table head={['Incentive Type', 'Benefit']} rows={INCENTIVES} />

                <SubHead>A Unified Global Blockchain Ecosystem</SubHead>
                <Table head={['Capability', 'How Pronova Delivers It']} rows={UNIFIED} />
                <Callout icon={FaHandHoldingUsd} href="https://novadf.com/" hrefLabel="Visit novadf.com">
                  Users can obtain financing in PRN and directly deploy it to acquire real-world assets — a complete financing cycle
                  operating within the blockchain ecosystem.
                </Callout>
              </Section>

              {/* 17 */}
              <Section id="media" number="17" eyebrow="Coverage" title="Media & Official Links">
                <p>
                  Pronova and its ecosystem have attracted attention from international media platforms and specialized publications
                  focused on cryptocurrencies, blockchain, Real World Assets, fintech, and institutional investment — highlighting its
                  integration of real estate, digital finance, fractional ownership, asset-backed liquidity, and token-native financing.
                </p>
                <SubHead>Featured In</SubHead>
                <div className="grid sm:grid-cols-3 gap-4 my-6">
                  {MEDIA.map((m, i) => (
                    <a key={i} href={m.url} target="_blank" rel="noopener noreferrer" className={`group rounded-2xl border p-5 text-center transition-colors ${darkMode ? 'bg-dark-800 border-primary-600/20 hover:border-primary-500/50' : 'bg-white border-gray-200/80 hover:border-primary-300 shadow-sm'}`}>
                      <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 text-white mb-3"><FaNewspaper size={16} /></div>
                      <div className="font-semibold text-gray-900 dark:text-white text-sm">{m.name}</div>
                      <div className="text-xs text-primary-500 inline-flex items-center gap-1 mt-1">Read coverage <FaExternalLinkAlt size={9} /></div>
                    </a>
                  ))}
                </div>
                <SubHead>Official Links & Resources</SubHead>
                <div className="grid sm:grid-cols-2 gap-3">
                  {OFFICIAL_LINKS.map(([name, desc, url], i) => (
                    <a key={i} href={url} target="_blank" rel="noopener noreferrer" className={`group flex items-center justify-between gap-3 p-4 rounded-xl border transition-colors ${darkMode ? 'bg-dark-800 border-primary-600/20 hover:border-primary-500/50' : 'bg-white border-gray-200/80 hover:border-primary-300 shadow-sm'}`}>
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white text-sm">{name}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{desc}</div>
                      </div>
                      <FaExternalLinkAlt className="text-gray-400 group-hover:text-primary-500 flex-shrink-0" size={12} />
                    </a>
                  ))}
                </div>
              </Section>

              {/* 18 */}
              <Section id="conclusion" number="18" eyebrow="Closing" title="Conclusion">
                <p>
                  Pronova (PRN) represents a disciplined departure from the speculative token paradigm — an institutional ecosystem
                  that is architecturally designed, legally incorporated, professionally insured, independently audited, and
                  operationally deployed. What distinguishes Pronova is simple: everything described in this whitepaper exists today.
                  The entities are incorporated, the audit is published, the insurance frameworks are established, the partner network
                  is operational, and the real estate integrations are active.
                </p>
                <p>
                  The digital asset sector is at an inflection point — the transition from speculative, retail-dominated markets to
                  institutionally structured, utility-anchored ecosystems. Pronova is built for this inflection point: not catching up
                  to it, but leading it.
                </p>
                <Callout icon={FaExclamationTriangle} title="Important Risk Notice" tone="amber">
                  This whitepaper is for informational purposes only and does not constitute financial, investment, legal, or tax
                  advice. Digital assets are highly volatile and you may lose all or a substantial portion of your capital. Read the
                  full disclaimer and risk factors on the{' '}
                  <a href="/legal" className="text-primary-500 hover:underline font-semibold">Legal</a> page before participating.
                </Callout>
              </Section>
            </div>
          </div>
        </div>
      </div>

      {showTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 z-40 w-12 h-12 rounded-full bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-lg shadow-primary-500/30 flex items-center justify-center hover:scale-110 transition-transform"
          aria-label="Back to top"
        >
          <FaArrowUp />
        </button>
      )}
    </>
  );
};

export default Whitepaper;
