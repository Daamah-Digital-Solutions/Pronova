import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaSearch, FaQuestionCircle, FaShieldAlt, FaChartLine, FaUsers, FaRocket } from 'react-icons/fa';
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
        answer: "Pronova (PRN) is a next-generation institutional digital asset ecosystem, owned by Pronova Virtual Asset (registered in Wyoming, USA) and operated through a network of incorporated entities across the USA and UK, in partnership with 12 companies from the Capimax Group ecosystem.\n\nUnlike conventional cryptocurrencies that rely purely on speculation, PRN is engineered around real operational utility — used to acquire fractional real estate, access investment structures, pay platform fees, obtain PRN-based financing, and transact across a growing international network of partner companies. This utility exists today, before exchange listing.\n\nBuilt on the BNB Smart Chain (BEP-20), Pronova is backed by real-world assets, an independent SolidProof audit, and institutional insurance frameworks."
      },
      {
        question: "What blockchain is Pronova built on?",
        answer: "Pronova is built on the BNB Smart Chain (BSC), leveraging its robust smart contract capabilities, low transaction fees, security, and widespread adoption.\n\nBNB Smart Chain was chosen for its:\n• Proven security and decentralization\n• Advanced smart contract functionality\n• Low, fast transaction fees\n• Extensive ecosystem and DeFi integration\n• Compatibility with major wallets and exchanges"
      },
      {
        question: "What makes Pronova unique in the crypto space?",
        answer: "Pronova differs fundamentally across five dimensions:\n\n🏢 Utility Before Listing: PRN is operationally usable across multiple real platforms before it reaches public exchanges — a present reality, not a future promise.\n🏠 Real Asset Backing: The ecosystem is anchored in real estate and real-world assets, creating economically motivated demand independent of speculation.\n🏛️ Institutional Architecture: Six incorporated legal entities (USA & UK), professional insurance frameworks (HCC, Assurax, HCC International), and a completed SolidProof audit.\n🔄 Multi-Arm Utility: PRN functions as a payment currency, investment vehicle, financing instrument, and real estate acquisition tool simultaneously.\n✅ Verifiable Transparency: Partner companies, insurance arrangements, audit results, and entity registrations are all publicly verifiable.\n\nPronova does not ask participants to speculate on an idea — it invites them into an already-operational ecosystem."
      },
      {
        question: "How can I store Pronova tokens?",
        answer: "Pronova tokens can be stored in any BNB Smart Chain (BEP-20) compatible wallet:\n\n• MetaMask (Web browser and mobile)\n• Trust Wallet (Mobile)\n• Ledger Hardware Wallet (Most secure)\n• Trezor Hardware Wallet\n• SafePal Wallet\n• Any BEP-20 compatible wallet\n\nFor maximum security, we recommend using hardware wallets for large amounts. Always verify you are using the official Pronova smart contract address before interacting with any contract."
      },
      {
        question: "What can I do with PRN right now, before exchange listing?",
        answer: "PRN has active, operational utility across real platforms today — you do not need to wait for exchange listing:\n\n🏠 Real Estate:\n• Fractional and full property acquisition on Capimax platforms (capimaxrt.com, capimaxbrx.com, capimaxpropshare.com, capimaxasset.com)\n• Tokenized RWA property stakes\n\n🏦 Financing:\n• PRN-based loans, collateralized credit, and real estate mortgages via Nova Digital Finance (novadf.com)\n\n💳 Payments:\n• Transactions with 18+ partner companies that publicly accept PRN\n• Platform fee payments with 5–30% discounts vs. fiat or other crypto\n\n🔐 Staking:\n• Earn yield, participate in governance, and unlock premium features\n\nThis is a present reality, verifiable through participating platforms and ecosystem partners — not a future promise."
      }
    ],
    tokenomics: [
      {
        question: "What is the total supply of Pronova?",
        answer: "The total supply of Pronova (PRN) is exactly 1,000,000,000 (1 billion) tokens.\n\nThis fixed supply ensures scarcity and prevents inflation, making PRN a deflationary asset as demand increases through real-world adoption and token burning mechanisms."
      },
      {
        question: "How are Pronova tokens distributed?",
        answer: "Pronova tokens are strategically distributed across nine categories to ensure long-term sustainability:\n\n🎯 Pre-Sale (25% - 250M tokens):\n• Stage 1: 100M tokens at $0.80\n• Stage 2: 75M tokens at $1.00\n• Stage 3: 75M tokens at $1.50\n\n🏠 Direct Asset Purchase (15% - 150M tokens):\nReserved for real estate and finance platforms, used after the pre-sale\n\n🤝 Partnerships (15% - 150M tokens):\nStrategic partners, ecosystem company allocations, platform incentives\n\n💧 Liquidity (12% - 120M tokens):\nDEX/CEX liquidity provision and post-listing market depth\n\n📈 Marketing & Development (12% - 120M tokens):\nGlobal campaigns, technology development, ecosystem expansion\n\n👥 Founders (7.5% - 75M tokens):\nSubject to multi-year vesting with cliff periods\n\n🏦 Reserves (6% - 60M tokens):\nStrategic reserve for compliance, insurance, and unforeseen needs\n\n🎁 Community (5% - 50M tokens):\nCommunity incentives, participation rewards, governance programs\n\n👨‍💼 Team (2.5% - 25M tokens):\nCore team compensation with long vesting schedules"
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
        answer: "Pronova's staking protocol lets PRN holders lock their tokens in time-locked smart contracts to earn ecosystem yield.\n\n🔑 Key Features:\n• Configurable APY based on staking tier (amount and duration)\n• Automated reward distribution through smart contracts — no manual claiming\n• Elevated rates for participants meeting minimum holding and activity thresholds\n• Governance participation rights weighted by staked PRN\n• Premium platform feature access\n\n📊 Rates: Specific APY rates are dynamic and subject to ecosystem protocol parameters. Current rates are published on the official Pronova platform.\n\n⚠️ Staking carries smart contract risk — review the SolidProof audit before staking."
      }
    ],
    presale: [
      {
        question: "How is the Pronova presale structured?",
        answer: "The Pronova presale is carefully structured in 3 phases over 90 days:\n\n🚀 Phase 1 (30 days):\n• Price: $0.80 per PRN\n• Supply: 100,000,000 tokens\n• Target Raise: $80,000,000\n• Early bird bonuses included\n\n⭐ Phase 2 (30 days):\n• Price: $1.00 per PRN\n• Supply: 75,000,000 tokens\n• Target Raise: $75,000,000\n• Partnership announcements\n\n💎 Phase 3 (30 days):\n• Price: $1.50 per PRN\n• Supply: 75,000,000 tokens\n• Target Raise: $112,500,000\n• Pre-launch preparation\n\n📊 Total Pre-Sale:\n• 250,000,000 tokens (25% of supply)\n• Three sequential stages rewarding earlier participants\n\nAll figures are targets; digital assets carry market risk and no price performance is guaranteed."
      },
      {
        question: "What payment methods are accepted?",
        answer: "The pre-sale accepts the following payment methods for maximum global accessibility:\n\n• ETH (Ethereum)\n• BNB (Binance Coin)\n• USD (US Dollar — wire transfer and select payment rails)\n• USDT (Tether — stable digital currency)\n\nThis multi-currency approach serves institutional participants, family offices, and retail investors alike. Always verify the official Pronova website and smart contract address before sending any funds."
      },
      {
        question: "How can I participate in the PRN pre-sale?",
        answer: "To participate in the Pronova pre-sale:\n\n1. Visit the official Pronova website\n2. Complete the KYC/identity verification process as required\n3. Connect a compatible BNB Smart Chain wallet\n4. Select your preferred payment currency: ETH, BNB, USD, or USDT\n5. Purchase PRN at the current stage price ($0.80 Stage 1, $1.00 Stage 2, $1.50 Stage 3)\n6. PRN tokens are delivered to your wallet upon transaction confirmation\n\n⚠️ Always verify you are using the official Pronova website and official smart contract address before sending funds. Beware of phishing sites and impersonator accounts."
      },
      {
        question: "What is the 'Utility Before Listing' model?",
        answer: "'Utility Before Listing' means PRN holders can use their tokens for real economic purposes — property acquisition, investment participation, financing, platform payments, and partner company transactions — during the pre-sale phase, before public exchange listing.\n\nThis eliminates the most common risk of crypto pre-sales: the risk that a project's promised utility never materializes. In Pronova's case, the utility infrastructure was operational before the pre-sale began, not planned for afterward."
      },
      {
        question: "What is the Pre-Listing Exit Model?",
        answer: "The Pre-Listing Exit Model creates pathways for participants to realize returns through ecosystem real estate and investment platforms before PRN achieves exchange listing.\n\n• A participant can deploy PRN into tokenized real estate investments during the pre-sale phase.\n• Returns (rental yield, appreciation, or pool distributions) can be realized through ecosystem operational channels.\n• This creates liquidity optionality that conventional pre-sales do not provide — participants are not entirely dependent on exchange listing timelines.\n\nNote: All digital assets carry market risk; this is not a guarantee of returns."
      }
    ],
    partnerships: [
      {
        question: "Which platforms and companies accept PRN?",
        answer: "PRN is actively integrated across the Capimax ecosystem and a growing international network:\n\n🏢 Capimax Platforms (live):\n• capimaxrt.com — tokenized real estate trading\n• capimaxbrx.com — blockchain real estate exchange\n• capimaxpropshare.com — fractional ownership\n• capimaxasset.com — digital asset & RWA management\n\n🌍 International Companies (publicly accept PRN):\n• capimaxgroup.com (USA & UK)\n• westoriacapital.com (USA)\n• crestmarkglobal.com (UK)\n• valoraestatesglobal.com (Spain)\n• aetheradevelopment.com (Greece)\n• verdeaestates.com (Georgia)\n• elitegateproperties.com (UK)\n• priminnhotels.com (USA & Europe)\n\nAll are independently verifiable through their official websites."
      },
      {
        question: "What is Nova Digital Finance and why is it significant?",
        answer: "Nova Digital Finance (novadf.com) is a UK-incorporated digital finance platform and one of the first platforms globally designed specifically to provide financing and lending using PRN itself as the financial instrument.\n\nThis transforms PRN from a conventional cryptocurrency into a functional financial instrument. Users can obtain financing in PRN and directly use the token to acquire real-world assets and investment opportunities — a complete financing cycle operating within the blockchain ecosystem, including PRN-collateralized lending, real estate mortgages, and cross-border payments."
      },
      {
        question: "How do partnerships benefit PRN holders?",
        answer: "Partnership integrations create verifiable, real-world value:\n\n💰 Holder Benefits:\n• 5–30% discounts when paying in PRN vs. fiat or other crypto\n• Priority access to premium real estate and investment opportunities for qualified stakers\n• Exclusive PRN-holder benefits across partner companies\n\n📈 Ecosystem Effect:\n• Each partner accepting PRN creates an independent demand node motivated by real business activity\n• As the network expands, operational demand for PRN grows organically\n\nThis operational demand is fundamentally different from speculation-driven demand alone."
      },
      {
        question: "How are partnerships verified?",
        answer: "Every partnership is designed to be independently verifiable:\n\n🌐 Public Verification:\n• Each partner company publicly announces PRN acceptance on its own official website\n• Any institutional due diligence team can confirm this through direct research\n\n🏛️ Institutional Backing:\n• Six incorporated legal entities across the USA and UK\n• Financial oversight by CIM Financial Group\n\nThe public, verifiable nature of these integrations is a cornerstone of Pronova's institutional credibility — a standard the vast majority of pre-listing digital assets cannot provide."
      }
    ],
    investment: [
      {
        question: "How does Pronova integrate with real estate?",
        answer: "Pronova's real estate integration operates through three principal tokenization models:\n\n🏢 Full Property Acquisition:\n• Ecosystem-integrated platforms accept PRN for complete property acquisitions, handling conversion, title transfer, and legal completion.\n\n🧩 Fractional Ownership:\n• Individual properties are tokenized on BNB Smart Chain, with each token representing a defined fractional stake. Holders acquire fractional tokens with PRN and gain proportional rights to rental yield (payable in PRN) and appreciation.\n\n📊 Tokenized Property Investment Pools:\n• Diversified pools of tokenized real estate assets — functioning analogously to a blockchain-native REIT — accessed through a single PRN deployment.\n\nAll four Capimax platforms operationally support these models today."
      },
      {
        question: "What is RWA tokenization and how does Pronova use it?",
        answer: "Real World Asset (RWA) tokenization is the process of placing traditional, physical assets — such as real estate — on a blockchain as digital tokens, making them divisible, programmable, and transferable.\n\nThe Boston Consulting Group projects the tokenized asset market to reach $16 trillion by 2030. Pronova connects PRN directly to this opportunity: participants acquire tokenized property stakes, receive on-chain yield distributions, and exit positions through ecosystem channels. PRN is the gateway currency for the entire RWA participation model."
      },
      {
        question: "Can PRN be used as collateral for lending?",
        answer: "Yes. Through Nova Digital Finance, participants can use PRN holdings as collateral for loans — accessing liquidity without selling their tokens:\n\n• Deposit PRN as collateral into an ecosystem lending smart contract\n• Receive a loan based on the collateral value and loan-to-value ratio\n• Use the funds for real estate acquisition, investment, or operational needs while keeping PRN exposure\n• Automated liquidation mechanisms protect the protocol if collateral value falls below threshold\n• On repayment, PRN collateral is returned\n\nSpecific terms are governed by smart contract parameters. This creates structural demand for PRN while letting long-term holders access liquidity without sell pressure."
      },
      {
        question: "Is PRN a security, utility token, or payment currency?",
        answer: "PRN is designed and operated as a utility token — a digital asset that provides access to services and capabilities within the Pronova ecosystem. Its purposes include:\n\n• Accessing ecosystem platforms and services\n• Participating in real estate tokenization and fractional ownership\n• Paying fees across platforms and partner companies\n• Participating in ecosystem governance\n• Serving as collateral for lending and financing\n\n⚠️ The regulatory classification of PRN may vary across jurisdictions. Prospective participants should seek qualified legal and tax counsel. This is not legal or financial advice."
      }
    ],
    security: [
      {
        question: "Has the PRN smart contract been independently audited?",
        answer: "Yes. A comprehensive professional security audit was completed by SolidProof — one of the blockchain industry's most recognized independent audit firms — prior to the pre-sale launch.\n\n📋 Scope: The audit covers three contracts — the PRN token, the vesting contract, and the pre-sale contract.\n\nSolidProof's methodology encompasses automated vulnerability scanning, manual code review by certified engineers, economic attack vector analysis, and reentrancy and overflow testing.\n\n🔗 The audit report is formally published and publicly accessible at app.solidproof.io/projects/pronova — independently verifiable by anyone."
      },
      {
        question: "What insurance frameworks protect the Pronova ecosystem?",
        answer: "Pronova established institutional insurance frameworks through three specialized providers prior to the pre-sale launch:\n\n🛡️ HCC — technology and digital asset risk; smart contract failures; blockchain-native operational risks (hccglobalcoverage.com)\n\n🔐 Assurax Insurance — cyber insurance; hot wallet security breaches; private key compromise; cyberattack-induced disruptions (assuraxinsurance.com)\n\n🏦 HCC International Insurance — broad institutional coverage, backed by a global insurance conglomerate (Tokio Marine Group)\n\nThese arrangements are verifiable through official websites. Note: no system can guarantee absolute protection — participants should conduct their own risk assessment."
      },
      {
        question: "What cybersecurity infrastructure protects the ecosystem?",
        answer: "Pronova's cybersecurity framework operates across multiple layers:\n\n• Smart Contract Security: pre-launch independent audit by SolidProof with ongoing assessment\n• Modular Architecture: contracts are designed in isolated modules so a vulnerability in one component cannot cascade to others\n• Multi-Signature Controls: treasury operations require multi-signature authorization\n• Cold Storage: the majority of treasury holdings are kept in cold storage, minimizing hot wallet exposure\n• Incident Response Protocols: predefined procedures for containment and remediation\n\nDespite these institutional-grade protections, no system can guarantee absolute protection against all cyberattacks."
      },
      {
        question: "How is Pronova governed, and does it perform KYC/AML?",
        answer: "Pronova operates under a dual-layer governance model:\n\n🔗 On-Chain: PRN holders participate in governance through weighted voting anchored to staked PRN.\n🏛️ Off-Chain: Six incorporated entities operate under formal governance frameworks, with financial oversight by CIM Financial Group (cimfingroup.com).\n\n🔒 KYC/AML: Pronova implements a comprehensive AML/KYC compliance framework across onboarding touchpoints — document verification, biometric matching, PEP and sanctions screening, and ongoing transaction monitoring — consistent with FATF Recommendations and UK/US regulatory requirements."
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
                6
              </motion.div>
              <div className="text-white/90 font-medium">Incorporated Entities</div>
            </div>
            <div className="group">
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="text-3xl md:text-4xl font-bold mb-2 group-hover:scale-110 transition-transform"
              >
                5–30%
              </motion.div>
              <div className="text-white/90 font-medium">PRN Discounts</div>
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