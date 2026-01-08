import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaChevronDown, FaSearch, FaQuestionCircle, FaShieldAlt, FaChartLine, FaUsers, FaRocket, FaCog } from 'react-icons/fa';
import FAQItem from '../components/ui/FAQItem';
import Button from '../components/ui/Button';

const Faq = () => {
  const [activeCategory, setActiveCategory] = useState('general');
  const [searchTerm, setSearchTerm] = useState('');

  // FAQ categories with icons
  const categories = [
    { id: 'general', label: 'General', icon: FaQuestionCircle },
    { id: 'tokenomics', label: 'Tokenomics', icon: FaChartLine },
    { id: 'presale', label: 'Presale', icon: FaRocket },
    { id: 'partnerships', label: 'Partnerships', icon: FaUsers },
    { id: 'investment', label: 'Investment', icon: FaChartLine },
    { id: 'security', label: 'Security', icon: FaShieldAlt }
  ];

  // Enhanced FAQ data with more comprehensive answers
  const faqData = {
    general: [
      {
        question: "What is Pronova (PRN)?",
        answer: "Pronova (PRN) is an innovative cryptocurrency developed by Capimax Holding, a British-American company that owns 12 global investment companies operating in over 60 business fields.\n\nPronova revolutionizes the investment landscape by providing seamless integration of cryptocurrencies into traditional business practices, offering immediate utility through partnerships with 18 international companies across real estate, gold trading, insurance, and financial services.\n\nBuilt on Ethereum blockchain, Pronova serves not just as a digital currency but as a gateway to real-world investments with guaranteed discounts and corporate benefits."
      },
      {
        question: "What blockchain is Pronova built on?",
        answer: "Pronova is built on the Ethereum blockchain, leveraging its robust smart contract capabilities, security, and widespread adoption.\n\nEthereum was chosen for its:\n• Proven security and decentralization\n• Advanced smart contract functionality\n• Extensive ecosystem and DeFi integration\n• Strong developer community and tools\n• Compatibility with major wallets and exchanges"
      },
      {
        question: "What makes Pronova unique in the crypto space?",
        answer: "Pronova stands out through several revolutionary features:\n\n🏢 Real Business Integration: Direct partnerships with 18 international companies\n💰 Immediate Utility: 10% discounts on real investments and purchases\n🔒 Investment Guarantee: Can be used as collateral for investment opportunities\n🏦 Corporate Cashback: Partner companies receive benefits for accepting PRN\n🛡️ Insurance Coverage: Comprehensive protection by HCC and Assurax Insurance\n📈 Asset-Backed Value: Connected to real estate, gold, and business investments\n\nUnlike purely speculative cryptocurrencies, Pronova offers tangible value through real-world business applications."
      },
      {
        question: "How can I store Pronova tokens?",
        answer: "Pronova tokens can be stored in any Ethereum-compatible wallet:\n\n• MetaMask (Web browser and mobile)\n• Trust Wallet (Mobile)\n• Ledger Hardware Wallet (Most secure)\n• Trezor Hardware Wallet\n• MyEtherWallet (Web interface)\n• Any ERC-20 compatible wallet\n\nFor maximum security, we recommend using hardware wallets for large amounts. The official Pronova wallet with enhanced features will be launched in Q4 2025."
      },
      {
        question: "What are the main use cases for Pronova?",
        answer: "Pronova offers multiple real-world use cases:\n\n💼 Investment Gateway:\n• Real estate investments with 10% discount\n• Gold and precious metals trading\n• Stock and bond investments through partner companies\n\n🏪 Payment System:\n• Merchant payments with cashback rewards\n• Hotel bookings (Prime Inn Hotels)\n• Insurance premium payments\n\n🔐 Financial Services:\n• Investment collateral and guarantees\n• Corporate financing solutions\n• Cross-border remittances\n\n📱 Platform Services:\n• Staking rewards and governance\n• Access to exclusive investment opportunities\n• Premium platform features"
      }
    ],
    tokenomics: [
      {
        question: "What is the total supply of Pronova?",
        answer: "The total supply of Pronova (PRN) is exactly 1,000,000,000 (1 billion) tokens.\n\nThis fixed supply ensures scarcity and prevents inflation, making PRN a deflationary asset as demand increases through real-world adoption and token burning mechanisms."
      },
      {
        question: "How are Pronova tokens distributed?",
        answer: "Pronova tokens are strategically distributed to ensure long-term sustainability:\n\n🎯 Presale (40% - 400M tokens):\n• Phase 1: 100M tokens at $0.80\n• Phase 2: 75M tokens at $1.00  \n• Phase 3: 75M tokens at $1.50\n• Phase 4: 150M tokens at market price\n\n🤝 Partnerships (15% - 150M tokens):\nStrategic alliances and business integrations\n\n💧 Liquidity (12% - 120M tokens):\nExchange liquidity and market stability\n\n📈 Marketing & Development (12% - 120M tokens):\nPlatform growth and ecosystem expansion\n\n👥 Founders (7.5% - 75M tokens):\nLocked for 7 years with gradual release\n\n🏦 Strategic Reserves (6% - 60M tokens):\nFuture partnerships and emergency fund\n\n🎁 Community (5% - 50M tokens):\nRewards, airdrops, and community incentives\n\n👨‍💼 Team (2.5% - 25M tokens):\nDevelopment team allocation"
      },
      {
        question: "Are there token lock-up periods?",
        answer: "Yes, 45% of all tokens are locked to ensure project stability:\n\n🔒 Locked Tokens (450M total):\n• 7% out of 7.5% Founders tokens (7 years)\n• 15% out of 15% Partnership tokens (gradual release)\n• 2% out of 2.5% Team tokens (3 years)\n• 5% out of 5% Community tokens (2 years)\n• 6% out of 6% Strategic reserves (5 years)\n• 10% out of 12% Marketing tokens (gradual release)\n\n📅 Release Schedule:\n• 2.5% unlock every 6 months\n• 9-year total unlock period\n• Smart contract enforced\n• Transparent on-chain tracking\n\nThis gradual release prevents market dumping and ensures long-term value appreciation."
      },
      {
        question: "What is the token burning mechanism?",
        answer: "Pronova implements a deflationary token burning strategy:\n\n🔥 Burning Sources:\n• 2% of all transaction fees\n• 1% of investment profits generated\n• Quarterly burns from company revenue\n• Community-voted special burns\n\n📊 Burning Schedule:\n• Monthly automatic burns\n• Quarterly performance-based burns\n• Annual strategic burns\n• Emergency deflationary measures if needed\n\n🎯 Target: Reduce total supply by 15-20% over 10 years\n\n📈 Benefits:\n• Increased scarcity and value\n• Reward for long-term holders\n• Inflation control\n• Market stability"
      },
      {
        question: "What staking rewards are available?",
        answer: "Pronova offers attractive staking rewards:\n\n💰 Staking Tiers:\n• Bronze (1,000+ PRN): 8% APY\n• Silver (10,000+ PRN): 12% APY  \n• Gold (100,000+ PRN): 18% APY\n• Diamond (1,000,000+ PRN): 25% APY\n\n🎁 Additional Benefits:\n• Priority access to investment opportunities\n• Exclusive partnership discounts\n• Governance voting rights\n• Early access to new features\n\n⏰ Lock-up Options:\n• 30 days: Base rate\n• 90 days: +2% bonus\n• 180 days: +5% bonus\n• 365 days: +10% bonus\n\n🔒 Security: All staking rewards are generated from platform revenue and partner profits, ensuring sustainability."
      }
    ],
    presale: [
      {
        question: "How is the Pronova presale structured?",
        answer: "The Pronova presale is carefully structured in 3 phases over 90 days:\n\n🚀 Phase 1 (30 days):\n• Price: $0.80 per PRN\n• Supply: 100,000,000 tokens\n• Target Raise: $80,000,000\n• Early bird bonuses included\n\n⭐ Phase 2 (30 days):\n• Price: $1.00 per PRN\n• Supply: 75,000,000 tokens\n• Target Raise: $75,000,000\n• Partnership announcements\n\n💎 Phase 3 (30 days):\n• Price: $1.50 per PRN\n• Supply: 75,000,000 tokens\n• Target Raise: $112,500,000\n• Pre-launch preparation\n\n📊 Total Presale:\n• 250,000,000 tokens (25% of supply)\n• $267,500,000 total target\n• Expected listing: $1.70-$2.50"
      },
      {
        question: "What payment methods are accepted?",
        answer: "Multiple payment methods are accepted for maximum accessibility:\n\n💳 Cryptocurrencies:\n• ETH (Ethereum)\n• BNB (Binance Coin)\n• USDT (Tether)\n• USDC (USD Coin)\n• BTC (Bitcoin) - converted to ETH\n\n💰 Fiat Currencies:\n• USD (US Dollar)\n• EUR (Euro)\n• GBP (British Pound)\n• AED (UAE Dirham)\n\n🏦 Payment Processors:\n• Bank wire transfers\n• Credit/Debit cards\n• PayPal (in select regions)\n• Stripe integration\n\n🔒 Security: All payments are processed through secure, audited systems with multi-signature wallets."
      },
      {
        question: "When will tokens be distributed?",
        answer: "Token distribution follows a clear timeline:\n\n⚡ Immediate Distribution:\n• Tokens sent immediately after payment confirmation\n• Direct to your wallet address\n• No waiting periods during presale\n\n📱 Smart Contract Deployment:\n• Q2 2025: Contract audit completion\n• Q3 2025: Mainnet deployment\n• Automatic token activation\n\n💼 Vesting Schedule:\n• Presale tokens: 100% unlocked at TGE\n• No vesting for retail investors\n• Immediate trading capability\n\n🎁 Bonus Tokens:\n• Early bird bonuses: Immediate\n• Referral rewards: Within 24 hours\n• Milestone bonuses: End of each phase"
      },
      {
        question: "Are there minimum/maximum purchase limits?",
        answer: "Balanced limits ensure fair distribution:\n\n💡 Minimum Purchase:\n• $100 USD equivalent\n• Approximately 125-200 PRN (depending on phase)\n• Designed for retail accessibility\n\n🏦 Maximum Purchase:\n• $1,000,000 USD per wallet\n• KYC required for purchases over $10,000\n• Enterprise packages available separately\n\n👥 Fair Launch Features:\n• Anti-whale mechanisms\n• 24-hour cooldown for large purchases\n• Community allocation priority\n\n🎯 Whitelist Benefits:\n• Guaranteed allocation\n• Extended purchase limits\n• Early access periods\n• Exclusive bonus opportunities"
      },
      {
        question: "What bonuses are available during presale?",
        answer: "Multiple bonus opportunities maximize your investment:\n\n🎉 Early Bird Bonuses:\n• First 24 hours: +15% bonus tokens\n• First week: +10% bonus tokens\n• Phase 1 only: +5% bonus tokens\n\n👫 Referral Program:\n• 5% bonus for referee\n• 3% commission for referrer\n• Unlimited referrals\n• Paid in PRN tokens\n\n📊 Volume Bonuses:\n• $10K-$50K: +2% bonus\n• $50K-$100K: +5% bonus\n• $100K-$500K: +8% bonus\n• $500K+: +12% bonus\n\n🏆 Milestone Rewards:\n• Community goals achievement\n• Social media milestones\n• Partnership announcements\n• Special event bonuses"
      }
    ],
    partnerships: [
      {
        question: "Which companies are partnered with Pronova?",
        answer: "Pronova has established partnerships with 18 international companies across diverse sectors:\n\n🏢 Capimax Group:\n• Capimax Holdings UK (Parent Company)\n• Capimax Investments (USA, UK, UAE)\n• Capimax Financial UK\n• Capimax Development UK\n• Capimax General Trading USA\n\n🛡️ Insurance Partners:\n• HCC International Insurance (USA/UK)\n• Assurax Insurance (USA/UK)\n• CIM Financial Group (USA/UK)\n\n🏠 Real Estate Partners:\n• TDH Developments (UK/UAE)\n• Elite Gate Properties (UK)\n• Nova Property Management (UK)\n• Future Real Estate Group\n\n🏨 Hospitality:\n• Prime Inn Hotels (USA/UK)\n\n💼 Investment Partners:\n• Profit Max Investments (UK)\n• Trustech Group (UK/UAE)\n\nAll partnerships are legally documented and registered on official company websites."
      },
      {
        question: "How do partnerships benefit Pronova holders?",
        answer: "Partnership benefits create immediate real-world value:\n\n💰 Holder Benefits:\n• 10% automatic discount on all services\n• Priority access to investment opportunities\n• Exclusive deal notifications\n• VIP customer service\n• Special financing terms\n\n🏢 Partner Company Benefits:\n• 5% corporate cashback in PRN\n• Increased customer base\n• Marketing support\n• Technology integration\n• Revenue sharing opportunities\n\n📈 Ecosystem Growth:\n• More partners = more utility\n• Network effects increase value\n• Cross-promotion opportunities\n• Shared customer benefits\n\n🔄 Continuous Expansion:\n• Quarterly new partner announcements\n• Geographic expansion into new markets\n• New industry verticals\n• Strategic acquisitions"
      },
      {
        question: "How are partnerships verified and secured?",
        answer: "All partnerships undergo rigorous verification:\n\n📋 Legal Documentation:\n• Formal partnership agreements\n• Corporate registration verification\n• Financial background checks\n• Regulatory compliance review\n\n🌐 Public Verification:\n• Official website confirmations\n• Press release announcements\n• Social media verifications\n• Third-party audit confirmations\n\n🔒 Smart Contract Integration:\n• Automated discount systems\n• Cashback payment mechanisms\n• Performance tracking\n• Dispute resolution protocols\n\n📊 Ongoing Monitoring:\n• Monthly partnership reviews\n• Performance metrics tracking\n• Customer satisfaction surveys\n• Financial health assessments\n\n🎯 Quality Assurance:\n• Minimum revenue requirements\n• Reputation standards\n• Customer service benchmarks\n• Technology integration capabilities"
      },
      {
        question: "Can new companies join the Pronova ecosystem?",
        answer: "Yes! We actively seek new strategic partnerships:\n\n📝 Application Process:\n• Submit partnership proposal\n• Financial and legal review\n• Technical integration assessment\n• Community benefit evaluation\n\n✅ Partnership Criteria:\n• Minimum $1M annual revenue\n• 2+ years operational history\n• Strong reputation and compliance\n• Customer-focused business model\n• Technology integration capability\n\n🎯 Priority Sectors:\n• Real estate and property management\n• Gold and precious metals trading\n• Travel and hospitality\n• Automotive and luxury goods\n• Healthcare and wellness\n• Education and professional services\n\n💼 Partnership Benefits:\n• Revenue sharing opportunities\n• Marketing and promotional support\n• Technology platform access\n• Community exposure\n• Strategic business development\n\n📞 Contact: partnerships@pronova.com"
      },
      {
        question: "What exclusive services do partners offer?",
        answer: "Partners provide exclusive services to PRN holders:\n\n🏠 Real Estate Services:\n• Property investment opportunities\n• Exclusive property listings\n• Property management services\n• Real estate development projects\n• Land acquisition deals\n\n💰 Financial Services:\n• Investment portfolio management\n• Insurance products and services\n• Mortgage and financing solutions\n• Wealth management consulting\n• Risk assessment and mitigation\n\n🏨 Hospitality & Travel:\n• Hotel bookings and accommodations\n• Travel packages and tours\n• Event planning and venues\n• Corporate retreat services\n• Luxury experience packages\n\n⚡ Additional Services:\n• Gold and precious metals trading\n• Corporate development consulting\n• Legal and compliance services\n• Technology integration support\n• Business process optimization\n\nAll services come with guaranteed PRN holder benefits and preferential pricing."
      }
    ],
    investment: [
      {
        question: "How can I invest in real estate using Pronova?",
        answer: "Pronova offers multiple real estate investment pathways:\n\n🏢 Direct Property Investment:\n• Minimum investment: 1,000 PRN\n• Available properties across UK, USA, UAE\n• Tokenized property ownership\n• Regular rental income in PRN\n• 10% discount on all purchases\n\n🏗️ Development Projects:\n• Participate in new construction projects\n• Early access to pre-construction pricing\n• Potential for higher returns\n• Progress-based token releases\n\n💼 REIT-Style Investments:\n• Diversified property portfolios\n• Professional management\n• Quarterly dividend payments\n• Lower minimum investments (100 PRN)\n\n🌍 Global Opportunities:\n• UK residential and commercial\n• US real estate markets\n• UAE luxury developments\n• European expansion markets\n\n📊 Investment Process:\n1. Browse available properties on platform\n2. Complete KYC verification\n3. Select investment amount in PRN\n4. Receive tokenized ownership certificates\n5. Track returns via dashboard"
      },
      {
        question: "Can Pronova be used as investment collateral?",
        answer: "Yes! Pronova serves as high-quality collateral:\n\n🔒 Collateral Applications:\n• Real estate mortgage backing\n• Business loan guarantees\n• Investment portfolio leverage\n• Margin trading collateral\n• Insurance policy backing\n\n💰 Loan-to-Value Ratios:\n• Real estate: Up to 70% LTV\n• Business loans: Up to 60% LTV\n• Investment leverage: Up to 50% LTV\n• Personal loans: Up to 40% LTV\n\n⚡ Smart Contract Automation:\n• Automated collateral management\n• Real-time value tracking\n• Instant liquidation protection\n• Transparent terms and conditions\n\n🛡️ Risk Management:\n• Conservative valuation methods\n• Market volatility buffers\n• Insurance coverage included\n• Professional risk assessment\n\n📈 Benefits:\n• Maintain PRN exposure while accessing capital\n• Competitive interest rates\n• Flexible repayment terms\n• No credit score requirements"
      },
      {
        question: "What investment opportunities are available?",
        answer: "Diverse investment opportunities across multiple asset classes:\n\n🏠 Real Estate (40% of opportunities):\n• Residential properties (rental income)\n• Commercial real estate (office, retail)\n• Development projects (new construction)\n• Land investments (future development)\n• International property markets\n\n🥇 Precious Metals (25%):\n• Physical gold storage and trading\n• Silver and platinum investments\n• Rare metals and commodities\n• Mining company equity stakes\n• Futures and derivatives trading\n\n💼 Business Investments (20%):\n• Startup equity funding\n• Private company acquisitions\n• Franchise opportunities\n• Revenue-sharing agreements\n• Venture capital partnerships\n\n📈 Financial Markets (15%):\n• Stock market investments\n• Bond and treasury securities\n• Cryptocurrency portfolios\n• Hedge fund participation\n• Index fund investments\n\n🎯 Minimum Investments:\n• Real Estate: 1,000 PRN\n• Precious Metals: 500 PRN\n• Business: 2,000 PRN\n• Financial Markets: 100 PRN"
      },
      {
        question: "What are the expected returns on investments?",
        answer: "Conservative yet attractive return projections:\n\n📊 Historical Performance (Partner Companies):\n• Real Estate: 8-15% annual returns\n• Gold Trading: 12-18% annual returns\n• Business Investments: 15-25% annual returns\n• Mixed Portfolios: 10-20% annual returns\n\n🎯 Pronova Platform Advantages:\n• 10% immediate discount boost\n• Professional management fees waived\n• Priority access to best opportunities\n• Risk diversification benefits\n\n⚠️ Risk Considerations:\n• All investments carry inherent risks\n• Past performance doesn't guarantee future results\n• Diversification recommended\n• Professional advice available\n\n🔒 Risk Mitigation:\n• Insurance coverage on major investments\n• Professional due diligence\n• Regular performance monitoring\n• Exit strategy planning\n\n📈 Payment Options:\n• Returns paid in PRN (additional benefits)\n• Fiat currency options available\n• Reinvestment opportunities\n• Flexible withdrawal terms\n\n⏰ Investment Horizons:\n• Short-term: 6-24 months\n• Medium-term: 2-5 years\n• Long-term: 5+ years\n• Custom terms available"
      },
      {
        question: "How liquid are Pronova-based investments?",
        answer: "Liquidity varies by investment type with flexible options:\n\n⚡ High Liquidity (1-7 days):\n• PRN token trading on exchanges\n• Money market investments\n• Short-term bond holdings\n• Cryptocurrency portfolios\n\n🔄 Medium Liquidity (1-6 months):\n• Precious metals trading\n• Stock market investments\n• Business revenue sharing\n• Secondary market sales\n\n🏠 Lower Liquidity (6+ months):\n• Real estate investments\n• Development projects\n• Private equity stakes\n• Long-term business investments\n\n💡 Liquidity Solutions:\n• Secondary marketplace for investment tokens\n• Partial liquidation options\n• Emergency withdrawal provisions\n• Collateral lending against illiquid investments\n\n📊 Exit Strategies:\n• Planned exit dates for each investment\n• Early exit penalties clearly defined\n• Market-making services for tokens\n• Professional assistance with sales\n\n🎯 Platform Features:\n• Real-time liquidity dashboard\n• Automated rebalancing options\n• Liquidity forecasting tools\n• Portfolio optimization recommendations"
      }
    ],
    security: [
      {
        question: "How is Pronova secured against cyber threats?",
        answer: "Multi-layered security approach protects user assets:\n\n🛡️ Smart Contract Security:\n• Audited by CertiK, Hacken, SolidProof\n• Multi-signature wallet requirements\n• Time-locked critical functions\n• Emergency pause mechanisms\n• Regular security assessments\n\n🔒 Platform Security:\n• Advanced encryption (AES-256)\n• Two-factor authentication (2FA)\n• Biometric authentication options\n• IP whitelisting capabilities\n• Session management and timeouts\n\n🏦 Insurance Coverage:\n• HCC International Insurance partnership\n• Coverage for digital asset theft\n• Cyber attack protection\n• Business interruption coverage\n• Legal expense protection\n\n🌐 Infrastructure Security:\n• AWS cloud infrastructure\n• DDoS protection services\n• Regular penetration testing\n• 24/7 security monitoring\n• Incident response team\n\n📱 User Security Features:\n• Hardware wallet integration\n• Mobile app security protocols\n• Secure backup and recovery\n• Privacy protection measures\n• Educational security resources"
      },
      {
        question: "What insurance coverage does Pronova have?",
        answer: "Comprehensive insurance coverage through leading providers:\n\n🏢 Primary Coverage (HCC International):\n• Digital asset protection: Up to $50M\n• Cyber attack coverage: Up to $25M\n• Business interruption: Up to $10M\n• Professional liability: Up to $5M\n• Regulatory fines: Up to $2M\n\n🔐 Secondary Coverage (Assurax Insurance):\n• Additional digital asset coverage\n• Personal data breach protection\n• Transaction error coverage\n• Key person insurance\n• Directors and officers protection\n\n📋 Coverage Details:\n• Hacking and unauthorized access\n• Employee fraud and theft\n• Technical failures and errors\n• Regulatory compliance costs\n• Legal defense expenses\n\n✅ Claim Process:\n• 24/7 incident reporting\n• Professional claim assistance\n• Fast-track processing\n• Legal support included\n• Regular coverage reviews\n\n🔗 Verification:\n• Insurance certificates available on website\n• Third-party verification\n• Annual coverage audits\n• Transparent policy terms"
      },
      {
        question: "How is user data protected?",
        answer: "Strict data protection compliance and best practices:\n\n🔐 Data Protection Standards:\n• GDPR compliance (EU users)\n• CCPA compliance (California users)\n• SOC 2 Type II certification\n• ISO 27001 standards\n• NIST cybersecurity framework\n\n💾 Data Storage:\n• End-to-end encryption\n• Geographically distributed backups\n• Zero-knowledge architecture where possible\n• Regular data purging schedules\n• Secure data centers\n\n👤 User Privacy:\n• Minimal data collection principle\n• Explicit consent for all data use\n• Right to data portability\n• Right to be forgotten\n• Transparent privacy policies\n\n🔒 Access Controls:\n• Role-based access permissions\n• Regular access reviews\n• Employee background checks\n• Confidentiality agreements\n• Security training programs\n\n📊 Monitoring & Compliance:\n• Real-time security monitoring\n• Regular compliance audits\n• Incident response procedures\n• Data breach notification protocols\n• Privacy impact assessments"
      },
      {
        question: "Are smart contracts audited?",
        answer: "Comprehensive smart contract auditing by top-tier firms:\n\n🔍 Audit Partners:\n• CertiK: Lead security audit\n• Hacken: Secondary review\n• SolidProof: Code quality assessment\n• SlowMist: Penetration testing\n\n📋 Audit Scope:\n• Token contract functionality\n• Staking and rewards mechanisms\n• Investment platform integration\n• Governance and voting systems\n• Upgrade and emergency protocols\n\n✅ Audit Process:\n1. Code review and static analysis\n2. Dynamic testing and simulation\n3. Economic model verification\n4. Security vulnerability assessment\n5. Final report and recommendations\n\n📊 Audit Results:\n• Public audit reports available\n• All critical issues resolved\n• Medium/low issues documented\n• Continuous monitoring implemented\n• Regular re-audits scheduled\n\n🔒 Additional Security Measures:\n• Bug bounty program ($100K+ rewards)\n• Community code review\n• Gradual deployment strategy\n• Emergency response protocols\n• Insurance coverage for contract risks"
      },
      {
        question: "What happens in case of a security breach?",
        answer: "Comprehensive incident response and recovery procedures:\n\n🚨 Immediate Response (0-1 hour):\n• Automatic security systems activation\n• Platform pause if necessary\n• Incident response team mobilization\n• User notification initiation\n• Insurance provider notification\n\n📞 Communication (1-4 hours):\n• Official announcement to users\n• Social media and website updates\n• Email notifications sent\n• Press release preparation\n• Regulatory authority notification\n\n🔍 Investigation (4-24 hours):\n• Forensic analysis of the incident\n• Scope and impact assessment\n• Root cause identification\n• Evidence preservation\n• Law enforcement coordination\n\n💰 Recovery Process:\n• Insurance claim processing\n• User fund protection measures\n• System restoration procedures\n• Additional security implementations\n• Compensation planning\n\n📋 Post-Incident (1-30 days):\n• Detailed incident report\n• Security improvements implementation\n• Third-party security review\n• User education and awareness\n• Process improvement updates\n\n🛡️ Protection Measures:\n• Multi-signature wallet protection\n• Cold storage for majority of funds\n• Real-time monitoring systems\n• Automated threat detection\n• Regular security drills"
      }
    ]
  };

  // Filter FAQ items based on search term
  const getFilteredFAQs = (category) => {
    if (!searchTerm) return faqData[category];
    
    return faqData[category].filter(faq => 
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <>
      {/* Hero Section with enhanced gradient */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-dark-900 dark:via-dark-800 dark:to-dark-900 overflow-hidden">
        {/* Background shapes */}
        <div className="absolute inset-0">
          <div className="shape shape-primary w-96 h-96 top-10 -left-20 opacity-20"></div>
          <div className="shape shape-secondary w-72 h-72 top-20 -right-16 opacity-20"></div>
        </div>
        
        <div className="container-custom relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-3 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 px-6 py-3 rounded-full mb-6 font-medium"
            >
              <FaQuestionCircle className="text-xl" />
              <span>Everything You Need to Know</span>
            </motion.div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gray-900 dark:text-white">
              Frequently Asked{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-secondary-600">
                Questions
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
              Get comprehensive answers about Pronova cryptocurrency, tokenomics, partnerships, 
              and investment opportunities from our expert team.
            </p>

            {/* Search Box */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="relative max-w-lg mx-auto"
            >
              <div className="relative">
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                <input
                  type="text"
                  placeholder="Search FAQ..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-6 py-4 bg-white dark:bg-dark-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-primary-500 focus:outline-none transition-colors shadow-lg"
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-secondary-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container-custom relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-white"
          >
            <div className="group">
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-3xl md:text-4xl font-bold mb-2 group-hover:scale-110 transition-transform"
              >
                1B
              </motion.div>
              <div className="text-white/90 font-medium">Total Supply</div>
            </div>
            <div className="group">
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-3xl md:text-4xl font-bold mb-2 group-hover:scale-110 transition-transform"
              >
                18
              </motion.div>
              <div className="text-white/90 font-medium">Partner Companies</div>
            </div>
            <div className="group">
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-3xl md:text-4xl font-bold mb-2 group-hover:scale-110 transition-transform"
              >
                60+
              </motion.div>
              <div className="text-white/90 font-medium">Business Fields</div>
            </div>
            <div className="group">
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="text-3xl md:text-4xl font-bold mb-2 group-hover:scale-110 transition-transform"
              >
                10%
              </motion.div>
              <div className="text-white/90 font-medium">Instant Discount</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24 bg-gray-50 dark:bg-dark-800 relative">
        <div className="container-custom">
          {/* Category Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-wrap justify-center gap-3 mb-12"
          >
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <motion.button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`group flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                    activeCategory === category.id
                      ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/30'
                      : 'bg-white dark:bg-dark-900 text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 border border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <IconComponent className={`text-lg transition-transform group-hover:scale-110 ${
                    activeCategory === category.id ? 'text-white' : 'text-primary-600'
                  }`} />
                  <span>{category.label}</span>
                </motion.button>
              );
            })}
          </motion.div>

          {/* FAQ Items */}
          <motion.div
            key={activeCategory + searchTerm}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-4xl mx-auto"
          >
            {getFilteredFAQs(activeCategory).length > 0 ? (
              getFilteredFAQs(activeCategory).map((faq, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <FAQItem
                    question={faq.question}
                    answer={faq.answer}
                    isOpen={index === 0 && !searchTerm}
                    delay={index * 0.1}
                  />
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <div className="text-gray-400 dark:text-gray-500 text-6xl mb-4">
                  <FaSearch />
                </div>
                <h3 className="text-xl font-medium text-gray-600 dark:text-gray-400 mb-2">
                  No results found
                </h3>
                <p className="text-gray-500 dark:text-gray-500">
                  Try adjusting your search terms or browse different categories
                </p>
              </motion.div>
            )}
          </motion.div>

          {/* Contact Support */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mt-16 bg-gradient-to-br from-white to-gray-50 dark:from-dark-900 dark:to-dark-800 p-8 md:p-12 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 max-w-3xl mx-auto text-center"
          >
            <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaQuestionCircle className="text-3xl text-primary-600 dark:text-primary-400" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
              Still Have Questions?
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              Our expert support team is here to help you 24/7. Whether you need technical assistance, 
              investment guidance, or have questions about partnerships, we're ready to assist.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button 
                variant="primary"
                size="large"
                href="mailto:support@pronova.com"
                className="group"
              >
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
                Contact Support
              </Button>
              <Button 
                variant="outline"
                size="large"
                href="https://t.me/pronovaofficial"
                target="_blank"
                className="group"
              >
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
                Join Telegram
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Resources Section */}
      <section className="py-16 md:py-24 bg-white dark:bg-dark-900">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              Explore More <span className="text-gradient-enhanced">Resources</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Dive deeper into the Pronova ecosystem with our comprehensive documentation and insights
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                title: "Whitepaper",
                description: "Comprehensive technical documentation covering tokenomics, technology, and vision",
                icon: "📄",
                link: "/whitepaper",
                color: "from-blue-500 to-cyan-500"
              },
              {
                title: "Roadmap", 
                description: "Detailed development timeline with milestones and future expansion plans",
                icon: "🗺️",
                link: "/roadmap",
                color: "from-purple-500 to-pink-500"
              },
              {
                title: "Team & Partners",
                description: "Meet the experienced professionals and companies powering Pronova",
                icon: "👥", 
                link: "/team",
                color: "from-green-500 to-emerald-500"
              }
            ].map((resource, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="group"
              >
                <div className="bg-white dark:bg-dark-800 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 h-full">
                  <div className={`w-16 h-16 bg-gradient-to-r ${resource.color} rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform`}>
                    {resource.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {resource.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    {resource.description}
                  </p>
                  <Button 
                    variant="outline"
                    to={resource.link}
                    className="w-full group-hover:bg-primary-50 dark:group-hover:bg-primary-900/20"
                  >
                    Explore {resource.title}
                    <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="shape w-96 h-96 bg-white/5 -top-20 -left-20"></div>
          <div className="shape w-72 h-72 bg-white/5 -bottom-10 -right-16"></div>
        </div>
        
        <div className="container-custom relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center text-white max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <FaRocket className="text-4xl" />
            </motion.div>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Ready to Join the{' '}
              <span className="text-secondary-200">Pronova Revolution?</span>
            </h2>
            
            <p className="text-xl md:text-2xl mb-8 text-white/90 leading-relaxed">
              Don't miss the opportunity to be part of the future of integrated cryptocurrency investments
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-lg mx-auto">
              <Button 
                size="large"
                variant="white"
                to="/#presale"
                className="bg-white text-primary-700 hover:bg-gray-100 font-bold group"
              >
                <FaRocket className="group-hover:rotate-12 transition-transform" />
                Join Presale Now
              </Button>
              <Button 
                size="large"
                variant="ghost"
                to="/whitepaper"
                className="text-white border-white/30 hover:bg-white/10 font-bold"
              >
                Read Whitepaper
              </Button>
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-8 text-white/70"
            >
              <p>🔒 Secure • 🛡️ Insured • 🚀 Revolutionary</p>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Faq;