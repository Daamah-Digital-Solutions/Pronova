# Phase 6: Client Content & Pages Implementation Plan

**Date:** December 10, 2025
**Status:** APPROVED - Implementation in Progress
**Source Document:** `docs/ملاحظات موقع برونوفا.docx`

---

## IMPORTANT CLARIFICATION (Dashboard)

**Dashboard enhancements are UI-ONLY with external links:**
- NO new backend endpoints
- NO new database models
- NO WebSocket/API integration
- NO real-time data fetching

**External Platform URLs (confirmed):**
1. Capi Max Investment Panel: `https://panel.capimaxinvestment.com/`
2. Capi Max Tokenization: `https://capimaxrt.com`
3. Nova Digital Finance: `https://novadf.com`

**Alerts and advanced features:** Static placeholders with "Coming Soon" status.

---

## Table of Contents

1. [Inventory of Client Requirements](#1-inventory-of-client-requirements)
2. [Site Structure & Mapping](#2-site-structure--mapping)
3. [Design & Theming Notes](#3-design--theming-notes)
4. [Implementation Plan](#4-implementation-plan)
5. [Risks & Open Questions](#5-risks--open-questions)

---

## 1. Inventory of Client Requirements

### 1.1 Complete Requirements Table

| ID | Requirement (Arabic) | Description (English) | Source Section | Status |
|----|---------------------|----------------------|----------------|--------|
| **CR-01** | الشركات والمنصات التي تقبل الدفع ببرونوفا | Companies/platforms accepting Pronova payments | Section 1 | Implement Now |
| **CR-02** | منصة وتطبيق كابى ماكس للاستثمارات | Capi Max Investments platform & app | Section 1 | Implement Now |
| **CR-03** | منصة كابى ماكس للترميز العقارى | Capi Max Real Estate Tokenization platform | Section 1 | Implement Now |
| **CR-04** | منصة نوفا للتمويل الرقمى | Nova Digital Finance platform | Section 1 | Implement Now |
| **CR-05** | مجموعه شركات كابى ماكس العالمية | Capi Max Group global companies list | Section 1 | Implement Now |
| **CR-06** | أوجه الربح لحامل العملة | Profit types for token holders | Section 2 | Implement Now |
| **CR-07** | الخصومات والإعفاءات | Discounts & exemptions (4%, 5%) | Section 2 | Implement Now |
| **CR-08** | الربح من الاستثمارات | Profits from investments | Section 2 | Implement Now |
| **CR-09** | الربح من صعود العملة | Profits from token appreciation | Section 2 | Implement Now |
| **CR-10** | الربح من الاستقرار المؤسسي | Profits from institutional stability | Section 2 | Implement Now |
| **CR-11** | آلية التخارج | Exit mechanism for investments | Section 2 | Implement Now |
| **CR-12** | خلق حالة الطلب | Demand creation explanation | Section 3 | Implement Now |
| **CR-13** | خطة استقرار برونوفا | Pronova stability plan | Section 4 | Implement Now |
| **CR-14** | ضبط المعروض | Supply control mechanisms | Section 4.1 | Implement Now |
| **CR-15** | آلية الحرق | Burn mechanism | Section 4.1 | Implement Now |
| **CR-16** | زيادة الطلب | Demand growth strategies | Section 4.2 | Implement Now |
| **CR-17** | الاستقرار وحماية القيمة | Price stability measures | Section 4.3 | Implement Now |
| **CR-18** | حوافز الاحتفاظ (Staking) | Holding incentives | Section 4.3 | Implement Now |
| **CR-19** | تعريف عملة برونوفا | Pronova definition & description | Section 5 | Implement Now |
| **CR-20** | الطبيعة المزدوجة للعملة | Dual nature of token | Section 5 | Implement Now |
| **CR-21** | الاستخدامات المباشرة | Direct use cases | Section 5 | Implement Now |
| **CR-22** | صفحة الملاك والمؤسسون | Owners & Founders page | Section 6 | Implement Now |
| **CR-23** | الشركة المالكة - Capi Max Holding UK | Owner company details | Section 6.2 | Implement Now |
| **CR-24** | أذرع التطوير والملكية | Development arms (Blockchain & Fintech, Virtual Assets) | Section 6.2 | Implement Now |
| **CR-25** | الهيكل المؤسسي | Institutional structure | Section 6.3 | Implement Now |
| **CR-26** | الإدارة التنفيذية | Executive management roles | Section 6.4 | Implement Now |
| **CR-27** | الفريق التقني | Technical team | Section 6.5 | Implement Now |
| **CR-28** | الشركاء الاستراتيجيون | Strategic partners list | Section 6.6 | Implement Now |
| **CR-29** | الرقابة الداخلية والخارجية | Internal/external oversight | Section 6.7 | Implement Now |
| **CR-30** | المدققون الماليون | Financial auditors | Section 6.8 | Implement Now |
| **CR-31** | شركات التدقيق والتأمين | Audit & insurance companies | Section 7 | Implement Now |
| **CR-32** | لوحة التحكم - الفرص الاستثمارية | Dashboard - investment opportunities | Section 8 | Implement Now |
| **CR-33** | الربط مع منصات الاستثمار والترميز | Integration with investment platforms | Section 8 | Implement Now |
| **CR-34** | التنبيهات | Alerts system | Section 8 | Implement Now |
| **CR-35** | الجهات التي تقبل العملة | Entities accepting the token | Section 8 | Implement Now |
| **CR-36** | آليات التخارج | Exit mechanisms | Section 8 | Implement Now |
| **CR-37** | الشراكات - روابط المواقع | Partner website links | Section 9 | Implement Now |
| **CR-38** | صفحة الاستثمار | Investment page | Section 10 | Implement Now |
| **CR-39** | التامين والمخاطر | Insurance & risks | Section 10 | Implement Now |
| **CR-40** | القيمة المضافة المؤسسية | Institutional value proposition | Section 11 | Implement Now |

### 1.2 Companies & Platforms from Client Notes

#### Investment Companies (Capi Max Group)
1. **Capi Max Investments UK** - Investment fund management, UK registered
2. **Capi Max Investments USA** - General investments, US registered
3. **Capi Max Investments UAE** - Real estate, technology, tourism, UAE registered
4. **Capi Max Development UK** - Real estate development, UK registered
5. **Capi Max Precious Metals & Gold UK** - Gold, silver, minerals, oil trading
6. **Capi Max Financial UK** - Financial management & investment funds
7. **Capi Max General Trading USA** - General trading
8. **Profit Max Investments UK** - Investment fund management

#### Technology & Blockchain Companies
1. **Capi Max Blockchain & FinTech UK** - Blockchain development & fintech
2. **Capi Max Virtual Assets UK** - Digital assets & cryptocurrency development

#### Platforms (Accepting Pronova)
1. **Capi Max Investment Platform & App** - Investment platform (US/UK/UAE)
2. **Capi Max Real Estate Tokenization** - Tokenized real estate
3. **Nova Digital Finance** - Interest-free lending platform

#### Insurance & Audit Partners
1. **HCC International Insurance UK** - All insurance types
2. **Ashurax Insurance UK** - Insurance services
3. **CIM Financial Group UK** - Financial audit, blockchain, accounting

#### Real Estate & Hospitality
1. **TDH Real Estate Development UK** - Property development
2. **Elite Gate Properties UK** - Property sales, purchase, management
3. **Prime Inn Hotels UK** - Hotels & hospitality

---

## 2. Site Structure & Mapping

### 2.1 Current Site Structure (From Code)

| Route | Page Component | Current Content |
|-------|---------------|-----------------|
| `/` | `Home.js` | Hero, Features, Tokenomics, Partners, Roadmap, Presale |
| `/presale` | `SimplePresale.js` | Token purchase interface |
| `/dashboard` | `Dashboard.js` | User dashboard (basic) |
| `/invest` | `Invest.js` | Investment options |
| `/whitepaper` | `Whitepaper.js` | Whitepaper display |
| `/roadmap` | `Roadmap.js` | Project roadmap |
| `/team` | `Team.js` | Team & partners (extensive) |
| `/faq` | `Faq.js` | FAQ page |
| `/contact` | `Contact.js` | Contact form |

### 2.2 Proposed Site Structure Changes

#### Existing Pages to Update

| Page | New/Updated Sections | Client Requirements Covered |
|------|---------------------|---------------------------|
| **Home** (`/`) | "What is Pronova" section, "Dual Nature" section, "Benefits for Holders" section, "Demand Creation" section | CR-19, CR-20, CR-06, CR-07, CR-12 |
| **Team** (`/team`) | Rename to "Owners & Partners", add Institutional Structure, Executive Roles, Technical Team | CR-22, CR-23, CR-24, CR-25, CR-26, CR-27 |
| **Invest** (`/invest`) | Add Capi Max platform links, Nova Digital Finance, investment sectors (30+ areas) | CR-02, CR-03, CR-04, CR-38 |
| **Dashboard** (`/dashboard`) | Add Investment Opportunities panel, Alerts, Accepted Entities, Exit Mechanisms | CR-32, CR-33, CR-34, CR-35, CR-36 |

#### New Pages to Create

| Route | Page | Content | Requirements Covered |
|-------|------|---------|---------------------|
| `/partners` | `Partners.js` | Companies accepting Pronova, grouped by category, with official links | CR-01, CR-05, CR-28, CR-37 |
| `/stability` | `StabilityPlan.js` | Pronova stability plan: supply control, burn, demand growth, protection | CR-13, CR-14, CR-15, CR-16, CR-17 |

### 2.3 Detailed Section Mapping

#### Home Page (`/`) - Updates

| Section | Content | Client Requirement |
|---------|---------|-------------------|
| **New: "What is Pronova"** | Definition from CR-19: British-American institutional crypto developed by Capi Max group | CR-19 |
| **New: "Dual Nature"** | Trading/speculation + payment/investment utility, institutional protection | CR-20 |
| **New: "Holder Benefits"** | 4 profit types: Direct (4-5% discounts), Investment returns, Price appreciation, Institutional stability | CR-06, CR-07, CR-08, CR-09, CR-10 |
| **New: "Demand Creation"** | 4 demand sources: Traders, Platform clients, Company clients, Direct investors | CR-12 |
| **Existing: Features** | Keep existing, add institutional backing emphasis | - |
| **Existing: Tokenomics** | Keep existing (matches whitepaper) | - |
| **Existing: Partners** | Link to new /partners page | CR-28 |

#### New Partners Page (`/partners`)

| Section | Content | Client Requirement |
|---------|---------|-------------------|
| **Investment Companies** | 8 companies with logos, descriptions, external links | CR-05 |
| **Real Estate & Development** | 4 companies | CR-05 |
| **Insurance & Audit** | 3 companies (HCC, Ashurax, CIM) | CR-31 |
| **Trading & Hospitality** | 3 companies | CR-05 |
| **Platforms Accepting Pronova** | Capi Max Investments, Capi Max Tokenization, Nova Digital Finance - with direct links | CR-01, CR-02, CR-03, CR-04 |
| **Partner Benefits** | Discounts for customers, cashback for partners | CR-07 |
| **External Links Requirement** | Each partner must have official website link or placeholder note | CR-37 |

#### New Stability Plan Page (`/stability`)

| Section | Content | Client Requirement |
|---------|---------|-------------------|
| **Supply Control** | Limited supply, locking (9 years), gradual distribution, burn mechanism | CR-14, CR-15 |
| **Demand Growth** | Platform partnerships, payment acceptance, global marketing, use cases | CR-16 |
| **Price Stability** | High demand vs low supply, holding incentives, insurance/audit, transparency reports | CR-17, CR-18 |
| **Expected Outcome** | Stable by design, increasing value, low risk, investment-grade | CR-13 |

#### Team Page → Owners & Partners (`/team` or `/about`)

| Section | Content | Client Requirement |
|---------|---------|-------------------|
| **Overview** | 7+ years blockchain experience, utility + institutional stability | CR-22 |
| **Owning Company** | Capi Max Holding UK - 12 global subsidiaries | CR-23 |
| **Development Arms** | Capi Max Blockchain & FinTech, Capi Max Virtual Assets | CR-24 |
| **Institutional Structure** | Diagram: Holding → Financial → Technical arms → Audit/Insurance | CR-25 |
| **Executive Management** | CEO (Capi Max Holding), CFO (CIM), CTO (Blockchain), CCO (CIM), CMO (Investments), COO (Virtual Assets) | CR-26 |
| **Technical Team** | Blockchain engineers, cybersecurity, wallet integration, analytics, DevOps | CR-27 |
| **Strategic Partners** | Grouped by category (existing Team.js content) | CR-28 |
| **Oversight** | Internal (Capi Max Financial) + External (CIM Financial Group) | CR-29 |
| **Auditors** | Capi Max Financial (internal), CIM Financial Group (external) | CR-30 |

#### Invest Page (`/invest`) - Updates

| Section | Content | Client Requirement |
|---------|---------|-------------------|
| **Investment Platforms** | Links to Capi Max Investments, Capi Max Tokenization, Nova Digital Finance | CR-02, CR-03, CR-04 |
| **Investment Sectors** | 30+ areas: Real estate, gold, metals, hotels, oil, bonds, insurance, etc. | CR-38 |
| **Benefits** | Discounts (4%, 5%), fee exemptions when using Pronova | CR-07 |
| **Exit Mechanism** | If price rises: exit with same token count. If price falls: exit at original USD value | CR-11 |
| **Insurance Protection** | HCC + Ashurax coverage explanation | CR-39 |

#### Dashboard Page (`/dashboard`) - Updates

| Section | Content | Client Requirement |
|---------|---------|-------------------|
| **Investment Opportunities Panel** | Links to Capi Max, Nova Finance opportunities | CR-32 |
| **Platform Integration** | Quick links to investment + tokenization platforms | CR-33 |
| **Alerts Section** | Price alerts, phase changes, partner announcements | CR-34 |
| **Accepted Entities** | List of companies accepting Pronova | CR-35 |
| **Exit Mechanisms** | User-specific exit options based on investment status | CR-36 |
| **Usage Benefits** | Show earned discounts, referral status | CR-07 |

---

## 3. Design & Theming Notes

### 3.1 Existing Design Patterns to Reuse

| Pattern | Used In | Apply To |
|---------|---------|----------|
| **Hero Section** | Home, Team | Stability, Partners |
| **Feature Cards** | Home (FeaturesSection) | Holder Benefits, Demand Sources |
| **Partner Grid** | Team.js (`partnerCategories`) | Partners page |
| **Team Cards** | Team.js (`EnhancedTeamMemberCard`) | Executive team, Technical team |
| **Info Boxes** | Team.js (Governance Structure) | Institutional Structure |
| **CTA Sections** | Team.js, Home | All new pages |
| **Animated Backgrounds** | Home, Team | All pages (consistency) |

### 3.2 Shared Components to Create

| Component | Purpose | Reused Across |
|-----------|---------|---------------|
| `CompanyCard.js` | Display company with logo, description, link | Partners, Team, Invest |
| `BenefitCard.js` | Display holder benefit with icon | Home, Invest |
| `DemandSourceCard.js` | Display demand creation source | Home, Stability |
| `StabilityFeature.js` | Display stability mechanism | Stability page |
| `InvestmentOpportunityCard.js` | Dashboard investment opportunity | Dashboard |
| `AlertCard.js` | Dashboard notification/alert | Dashboard |

### 3.3 Dark Mode / Light Mode

All new components MUST use the existing `useTheme()` hook pattern:

```jsx
const { darkMode } = useTheme();

// Example class pattern (from Team.js):
className={`... ${
  darkMode
    ? 'bg-dark-900/80 border-primary-600/20'
    : 'bg-white/80 border-gray-200/40'
}`}
```

### 3.4 Animation Patterns

Use existing Framer Motion patterns from `Team.js`:
- `FadeInWhenVisible` wrapper for scroll animations
- `motion.div` with `whileHover={{ scale: 1.02, y: -5 }}`
- `AnimatedShape` for background effects

### 3.5 Color Palette (Existing)

| Color | CSS Variable | Usage |
|-------|--------------|-------|
| Primary | `primary-500`, `primary-600` | Buttons, accents, gradients |
| Secondary | `secondary-500`, `secondary-600` | Gradients, highlights |
| Dark | `dark-800`, `dark-900` | Dark mode backgrounds |
| Gray | `gray-50`, `gray-100` | Light mode backgrounds |

---

## 4. Implementation Plan

### 4.1 Phase 6A: Home Page Updates

| Task | File | Action |
|------|------|--------|
| 1 | `src/components/home/WhatIsPronovaSection.js` | CREATE - Definition section |
| 2 | `src/components/home/DualNatureSection.js` | CREATE - Dual nature explanation |
| 3 | `src/components/home/HolderBenefitsSection.js` | CREATE - 4 profit types |
| 4 | `src/components/home/DemandCreationSection.js` | CREATE - 4 demand sources |
| 5 | `src/pages/Home.js` | UPDATE - Add new sections after Hero |

**Technical Notes:**
- Place "What is Pronova" immediately after HeroSection
- Keep existing tokenomics section unchanged (whitepaper-compliant)
- Use same animation patterns as existing enhanced components

### 4.2 Phase 6B: New Partners Page

| Task | File | Action |
|------|------|--------|
| 1 | `src/pages/Partners.js` | CREATE - New page |
| 2 | `src/components/partners/PlatformCard.js` | CREATE - Platform display with link |
| 3 | `src/components/partners/InvestmentCompanies.js` | CREATE - Companies grid |
| 4 | `src/components/partners/InsuranceAudit.js` | CREATE - Insurance partners |
| 5 | `src/App.js` | UPDATE - Add `/partners` route |
| 6 | `src/components/layout/Navbar.js` | UPDATE - Add Partners nav link |

**Technical Notes:**
- Each company card MUST have external website link
- Group companies by category (Investment, Real Estate, Insurance, Trading)
- Include prominent "Link to Official Website" buttons

### 4.3 Phase 6C: New Stability Plan Page

| Task | File | Action |
|------|------|--------|
| 1 | `src/pages/StabilityPlan.js` | CREATE - New page |
| 2 | `src/components/stability/SupplyControlSection.js` | CREATE - Supply mechanisms |
| 3 | `src/components/stability/DemandGrowthSection.js` | CREATE - Demand strategies |
| 4 | `src/components/stability/PriceProtectionSection.js` | CREATE - Stability measures |
| 5 | `src/App.js` | UPDATE - Add `/stability` route |
| 6 | `src/components/layout/Navbar.js` | UPDATE - Add Stability nav link |

**Technical Notes:**
- Emphasize burn mechanism, locking schedule (9 years)
- Include visual diagram of supply/demand balance
- DO NOT change any tokenomics numbers (whitepaper-compliant)

### 4.4 Phase 6D: Team Page Enhancement

| Task | File | Action |
|------|------|--------|
| 1 | `src/pages/Team.js` | UPDATE - Restructure sections |
| 2 | `src/components/team/InstitutionalStructure.js` | CREATE - Org chart |
| 3 | `src/components/team/ExecutiveTeam.js` | CREATE - Roles by company |
| 4 | `src/components/team/TechnicalTeam.js` | CREATE - Tech team roles |
| 5 | `src/components/team/OversightSection.js` | CREATE - Internal/External |

**Technical Notes:**
- Keep existing partner categories grid
- Add new sections: Overview, Ownership, Structure, Executives, Technical, Oversight
- Consider renaming route to `/about` or `/founders` (TBD)

### 4.5 Phase 6E: Invest Page Enhancement

| Task | File | Action |
|------|------|--------|
| 1 | `src/pages/Invest.js` | UPDATE - Restructure |
| 2 | `src/components/invest/PlatformLinks.js` | CREATE - 3 platforms |
| 3 | `src/components/invest/InvestmentSectors.js` | CREATE - 30+ sectors |
| 4 | `src/components/invest/ExitMechanism.js` | CREATE - Exit explanation |
| 5 | `src/components/invest/InsuranceProtection.js` | CREATE - HCC/Ashurax |

**Technical Notes:**
- Link directly to Capi Max Investment platform
- Link to Capi Max Tokenization platform
- Link to Nova Digital Finance
- Explain exit mechanism clearly (no-loss guarantee concept)

### 4.6 Phase 6F: Dashboard Enhancement

| Task | File | Action |
|------|------|--------|
| 1 | `src/pages/Dashboard.js` | UPDATE - Add panels |
| 2 | `src/components/dashboard/InvestmentOpportunities.js` | CREATE |
| 3 | `src/components/dashboard/PlatformIntegration.js` | CREATE |
| 4 | `src/components/dashboard/AlertsPanel.js` | CREATE |
| 5 | `src/components/dashboard/AcceptedEntities.js` | CREATE |
| 6 | `src/components/dashboard/ExitOptions.js` | CREATE |

**Technical Notes:**
- Investment opportunities: display as cards linking to external platforms
- Alerts: placeholder for future API integration
- Accepted entities: display list of partners accepting Pronova

---

## 5. Risks & Open Questions

### 5.1 External Links Required

The client explicitly requires official website links for all partner companies. Current status:

| Company | Link Available | Status |
|---------|---------------|--------|
| Capi Max Investments | `https://www.capimaxinvestments.com` | Exists in Team.js |
| Capi Max Holding | `https://www.capimaxholding.com` | Exists in Team.js |
| HCC Insurance | `https://www.hccinternationalinsurance.com` | Exists in Team.js |
| Ashurax | `https://assuraxinsurance.com/` | Exists in Team.js |
| CIM Financial | `https://cimfinancialgroup.com/` | Exists in Team.js |
| Nova Digital Finance | `https://novadigitalfinance.com/` | **NEEDS VERIFICATION** |
| Capi Max Tokenization | Not in current code | **NEEDS URL** |

**Recommendation:** Before implementation, confirm all external URLs are valid and contain Pronova partnership information.

### 5.2 Content Wording Concerns

| Item | Client Phrase | Concern | Recommendation |
|------|--------------|---------|----------------|
| Exit mechanism | "لا مخاطرة" (no risk) | May imply guaranteed returns | Rephrase to "risk mitigation" or "protected exit" with disclaimer |
| Profits | "أوجه الربح" (profit types) | Implies guaranteed profit | Add disclaimer: "Potential benefits, not guaranteed returns" |
| Stability | "مستقرة" (stable) | May imply price peg | Clarify: "Designed for stability" not "price-stable" |

**Recommendation:** Add standard crypto disclaimer to all investment-related pages.

### 5.3 Translation Considerations

The site supports English and Arabic (i18next). All new content needs:
- English text (primary)
- Arabic translation (RTL support already exists)

**Recommendation:** Create content in English first, then add Arabic translations in separate task.

### 5.4 Dashboard Integration

Client mentions "integration with investment platforms" and "alerts". These require:
- API endpoints (backend work)
- Real-time data (WebSocket)
- External platform APIs (third-party)

**Recommendation:** Implement UI placeholders now, with "Coming Soon" indicators for features requiring backend integration.

### 5.5 Naming Convention

Client uses "Capi Max" (two words). Code currently has mixed usage:
- "CapiMax" (one word)
- "Cabimax"
- "CAPI Max"

**Recommendation:** Standardize to "Capi Max" (two words) across all content as per client notes.

---

## Summary

### New Pages (2)
1. `/partners` - Companies & platforms accepting Pronova
2. `/stability` - Pronova stability plan

### Updated Pages (4)
1. `/` (Home) - Add "What is Pronova", "Dual Nature", "Benefits", "Demand"
2. `/team` - Restructure with institutional hierarchy
3. `/invest` - Add platform links, sectors, exit mechanism
4. `/dashboard` - Add opportunities, alerts, accepted entities

### New Components (20+)
- 4 new Home sections
- 3 Partners page components
- 3 Stability page sections
- 4 Team page sections
- 4 Invest page components
- 5 Dashboard panels

### Requirements Coverage
- **40 client requirements** identified from Arabic notes
- **40/40** mapped to specific pages/sections
- **0** marked as "needs clarification"

---

## Approval Required

This document is **PLANNING ONLY**. No code changes have been made.

**Next Steps (after approval):**
1. Implement Phase 6A (Home page updates)
2. Implement Phase 6B (Partners page)
3. Implement Phase 6C (Stability page)
4. Implement Phase 6D (Team page)
5. Implement Phase 6E (Invest page)
6. Implement Phase 6F (Dashboard)
7. Add Arabic translations
8. Test dark/light mode on all new components

---

*Planning document generated by Claude Code - Phase 6 Client Content & Pages Plan*
*December 10, 2025*
