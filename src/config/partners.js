// Canonical institutional partner entities (client final-edits v3).
//
// Single source of truth for the audit, financial, insurance, legal, and
// ecosystem partners that the client asked to surface across the site
// (Home "Audited & Cyber-Insured", Home "Strongest Partners", Whitepaper,
// Team, and News pages). Keeping the facts here means a link, blurb, or logo
// only has to change in one place.
//
// Logos that the client has not supplied yet are `null` — every consumer
// renders a styled initials badge as a graceful fallback, so a logo simply
// drops in here (import + reference) when it arrives.

import cimLogo from '../assets/images/logos for partner/cim logo.png';
import hccLogo from '../assets/images/logos for partner/hcc logo.png';
import assuraxLogo from '../assets/images/logos for partner/assurax logo-01.png';
import solidproofLogo from '../assets/images/logos for partner/logo_shield_trustnet.svg';
import capimaxGroupLogo from '../assets/images/logos for partner/capimax-group-logo.png';

// Capimax Ecosystem — the digital gateway that unites every Capimax platform.
export const CAPIMAX_ECOSYSTEM = {
  name: 'Capimax Ecosystem',
  category: 'Ecosystem',
  url: 'https://www.capimax.io/',
  altUrl: 'https://www.capimax.us/',
  logo: capimaxGroupLogo,
  description:
    'The digital gateway uniting all Capimax platforms, partnerships, services, news, and updates into one integrated ecosystem.',
};

// Smart-contract audit & blockchain security partners.
export const AUDIT_PARTNERS = [
  {
    name: 'SolidProof',
    category: 'Smart Contract Audit',
    url: 'https://app.solidproof.io/projects/pronova',
    logo: solidproofLogo,
    description:
      'Independent security audit of the PRN token, vesting, and pre-sale contracts — completed and published before launch.',
  },
  {
    name: 'Proof Anchor',
    category: 'Smart Contract Audit',
    url: 'https://www.proofanchor.io',
    verifyUrl: 'https://www.proofanchor.io/verify?q=PA-VERIFY-2026-000095',
    logo: null,
    description:
      'Independent smart-contract and project audit with on-chain verification for the Pronova ecosystem.',
  },
];

// Financial oversight partners.
export const FINANCIAL_PARTNERS = [
  {
    name: 'CIM Global Financial',
    category: 'Financial Partner',
    url: 'https://www.cimglobalfinancial.com/strategic-partnership',
    logo: cimLogo,
    description:
      'Institutional financial studies, document custody, accounting, and financial audit oversight across the ecosystem.',
  },
];

// Insurance & cyber-risk partners.
export const INSURANCE_PARTNERS = [
  {
    name: 'CoverTech Insurance',
    category: 'Insurance Partner',
    url: 'https://www.covertechinsurance.com/pronova-virtual-assets',
    logo: null,
    description:
      'Full cyber-insurance coverage protecting the Pronova token, platform, and digital assets.',
  },
  {
    name: 'HCC',
    category: 'Insurance Partner',
    url: 'https://hccglobalcoverage.com/',
    logo: hccLogo,
    description:
      'Technology-focused insurance infrastructure for digital asset operations and protocol-level events.',
  },
  {
    name: 'Assurax Insurance',
    category: 'Insurance Partner',
    url: 'https://assuraxinsurance.com/',
    logo: assuraxLogo,
    description:
      'Cyber insurance and digital asset protection — hot-wallet breaches, key compromise, and third-party failures.',
  },
];

// Legal partners.
export const LEGAL_PARTNERS = [
  {
    name: 'LexCrest Legal',
    category: 'Legal Partner',
    url: 'https://www.lexcrestlegal.com',
    logo: null,
    description:
      'Legal counsel and regulatory structuring for the Pronova ecosystem across its US and UK jurisdictions.',
  },
];

// The full institutional partner roster (audit + financial + insurance + legal),
// ordered the way the client asked for it to read on the trust sections.
export const INSTITUTIONAL_PARTNERS = [
  ...AUDIT_PARTNERS,
  ...FINANCIAL_PARTNERS,
  ...INSURANCE_PARTNERS,
  ...LEGAL_PARTNERS,
];
