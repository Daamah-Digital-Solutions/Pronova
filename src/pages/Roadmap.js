import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheck, FaClock, FaRocket, FaChartLine, FaGlobeAmericas, FaCogs, FaShieldAlt, FaUsers } from 'react-icons/fa';

// Enhanced Roadmap Item Component
const EnhancedRoadmapItem = ({ 
  item, 
  index, 
  isVisible,
  onItemClick
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const getStatusIcon = () => {
    if (item.isCompleted) return <FaCheck className="w-5 h-5" />;
    if (item.isActive) return <FaClock className="w-5 h-5 animate-pulse" />;
    return <FaClock className="w-5 h-5" />;
  };

  const getStatusColor = () => {
    if (item.isCompleted) return 'text-green-500 dark:text-green-400';
    if (item.isActive) return 'text-primary-600 dark:text-primary-400';
    return 'text-gray-500 dark:text-gray-400';
  };

  const getCardStyle = () => {
    if (item.isCompleted) return 'border-green-400/50 dark:border-green-500/50 bg-green-50/50 dark:bg-green-500/5 shadow-green-400/20 dark:shadow-green-500/10';
    if (item.isActive) return 'border-primary-400/50 dark:border-primary-500/50 bg-primary-50/50 dark:bg-primary-500/10 shadow-primary-400/20 dark:shadow-primary-500/20 shadow-lg dark:shadow-neon';
    return 'border-gray-200/50 dark:border-gray-600/30 bg-white/80 dark:bg-white/5 hover:border-primary-300/50 dark:hover:border-primary-500/30 hover:bg-primary-50/30 dark:hover:bg-primary-500/5';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className={`relative group cursor-pointer`}
      onClick={() => onItemClick && onItemClick(item)}
    >
      {/* Timeline connector */}
      <div className="flex items-start">
        {/* Timeline dot and line */}
        <div className="flex flex-col items-center mr-6 z-10">
          <motion.div 
            className={`w-12 h-12 rounded-full border-2 flex items-center justify-center backdrop-blur-sm transition-all duration-300 ${getStatusColor()} ${getCardStyle()}`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {getStatusIcon()}
          </motion.div>
        </div>

        {/* Content card */}
        <motion.div 
          className={`flex-1 p-6 rounded-2xl border backdrop-blur-sm transition-all duration-300 shadow-md dark:shadow-none ${getCardStyle()}`}
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <motion.h3 
                className="text-xl font-heading font-bold text-gray-900 dark:text-white mb-2"
                layoutId={`title-${index}`}
              >
                {item.title}
              </motion.h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{item.date}</p>
            </div>
            
            {item.isActive && (
              <motion.div 
                className="px-3 py-1 bg-primary-600 text-white text-xs font-bold rounded-full"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Active
              </motion.div>
            )}
          </div>

          {/* Progress bar for active phase */}
          {item.progress > 0 && (
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-300">Progress</span>
                <span className="text-sm text-primary-600 dark:text-primary-400 font-bold">{item.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                <motion.div 
                  className="h-2 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${item.progress}%` }}
                  transition={{ duration: 1.5, delay: index * 0.2 }}
                />
              </div>
            </div>
          )}

          {/* Milestones preview */}
          <div className="space-y-2">
            {item.milestones.slice(0, isExpanded ? item.milestones.length : 3).map((milestone, idx) => (
              <motion.div 
                key={idx}
                className="flex items-start text-sm"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: (index * 0.1) + (idx * 0.05) }}
              >
                <span className={`mr-3 mt-1 ${
                  milestone.completed ? 'text-green-500 dark:text-green-400' : 
                  item.isActive ? 'text-primary-600 dark:text-primary-400' : 
                  'text-gray-400 dark:text-gray-500'
                }`}>
                  {milestone.completed ? '✓' : '•'}
                </span>
                <span className={`${
                  milestone.completed ? 'text-green-600 dark:text-green-300 line-through' : 'text-gray-700 dark:text-gray-300'
                }`}>
                  {milestone.text}
                </span>
              </motion.div>
            ))}
            
            {item.milestones.length > 3 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsExpanded(!isExpanded);
                }}
                className="text-primary-600 dark:text-primary-400 text-sm hover:text-primary-500 dark:hover:text-primary-300 transition-colors duration-200"
              >
                {isExpanded ? 'Show less' : `+${item.milestones.length - 3} more`}
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

// Statistics Component
const RoadmapStats = () => {
  const stats = [
    { icon: FaRocket, label: 'Phases', value: '6', color: 'text-primary-600 dark:text-primary-400' },
    { icon: FaCheck, label: 'Completed', value: '3', color: 'text-green-600 dark:text-green-400' },
    { icon: FaClock, label: 'Active', value: '1', color: 'text-yellow-600 dark:text-yellow-400' },
    { icon: FaChartLine, label: 'Progress', value: '75%', color: 'text-blue-600 dark:text-blue-400' }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
          className="stats-card bg-white/80 dark:bg-white/5 backdrop-blur-sm border border-gray-200/50 dark:border-gray-600/30 rounded-xl p-4 text-center group hover:border-primary-400/50 dark:hover:border-primary-500/50 transition-all duration-300 shadow-sm dark:shadow-none"
        >
          <stat.icon className={`w-6 h-6 mx-auto mb-2 ${stat.color} group-hover:scale-110 transition-transform duration-300`} />
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</div>
        </motion.div>
      ))}
    </div>
  );
};

// Modal Component for detailed view
const RoadmapModal = ({ item, isOpen, onClose }) => {
  if (!item) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal-backdrop fixed inset-0 bg-black/70 dark:bg-black/80 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            className="modal-content fixed inset-4 md:inset-8 lg:inset-16 bg-white dark:bg-dark-800 border border-gray-200/50 dark:border-primary-500/30 rounded-2xl z-50 overflow-hidden shadow-2xl"
          >
            <div className="h-full flex flex-col">
              {/* Header */}
              <div className="p-6 border-b border-gray-200/50 dark:border-gray-600/30 bg-gradient-to-r from-primary-50/80 dark:from-primary-600/20 to-secondary-50/80 dark:to-secondary-600/20">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white">{item.title}</h2>
                    <p className="text-gray-600 dark:text-gray-300">{item.date}</p>
                  </div>
                  <button
                    onClick={onClose}
                    className="w-10 h-10 rounded-full bg-gray-100/80 dark:bg-white/10 hover:bg-gray-200/80 dark:hover:bg-white/20 flex items-center justify-center text-gray-600 dark:text-white transition-colors duration-200"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 p-6 overflow-y-auto">
                {item.progress > 0 && (
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-lg font-semibold text-gray-900 dark:text-white">Overall Progress</span>
                      <span className="text-primary-600 dark:text-primary-400 font-bold">{item.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                      <div 
                        className="h-3 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full transition-all duration-1000"
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Milestones & Deliverables</h3>
                  {item.milestones.map((milestone, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className={`p-4 rounded-xl border ${
                        milestone.completed 
                          ? 'border-green-300/50 dark:border-green-500/30 bg-green-50/80 dark:bg-green-500/10' 
                          : 'border-gray-200/50 dark:border-gray-600/30 bg-gray-50/80 dark:bg-white/5'
                      }`}
                    >
                      <div className="flex items-start">
                        <span className={`mr-3 mt-1 ${
                          milestone.completed ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'
                        }`}>
                          {milestone.completed ? '✓' : '○'}
                        </span>
                        <span className={`${
                          milestone.completed ? 'text-green-700 dark:text-green-300 line-through' : 'text-gray-700 dark:text-gray-300'
                        }`}>
                          {milestone.text}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const Roadmap = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Updated roadmap data from whitepaper
  const roadmapItems = [
    {
      title: "Q2 2025 - Development & Initial Launch",
      date: "April - June 2025",
      milestones: [
        { text: "Website Development -- Launch of the official Pronova website with detailed whitepaper, tokenomics, and project vision", completed: true },
        { text: "Smart Contract Deployment -- Developing and deploying the Pronova token on Ethereum network with a security-first approach", completed: true },
        { text: "Community Building & Social Media Presence -- Launching Telegram, Twitter, and Discord channels for engagement", completed: true },
        { text: "Private Sale & Early Investor Round -- Offering early investment opportunities to strategic partners and investors", completed: false }
      ],
      isActive: true,
      isCompleted: false,
      progress: 75,
      icon: FaRocket
    },
    {
      title: "Q3 2025 - Token Sale & DEX Listing",
      date: "July - September 2025",
      milestones: [
        { text: "Initial Smart Contract Audit -- Conducting an initial audit by CertiK, Hacken, SolidProof, or SlowMist to identify vulnerabilities", completed: false },
        { text: "Beginning of the Pre-Sale (ICO/IDO/IEO) -- Conducting multi-stage fundraising", completed: false },
        { text: "CEX & DEX Listings -- Listing on Uniswap, Pancake Swap to ensure liquidity", completed: false },
        { text: "CEX Negotiations -- Starting talks with Kuching, bitget, Gate.io for early centralized exchange listing", completed: false },
        { text: "Smart Contract Final Audit -- Conducting a second security audit after pre-sale completion", completed: false },
        { text: "Marketing & Partnerships Expansion -- Influencer collaborations, PR campaigns, and strategic partnerships", completed: false }
      ],
      isActive: false,
      isCompleted: false,
      progress: 0,
      icon: FaChartLine
    },
    {
      title: "Q4 2025 - Ecosystem Expansion & Adoption",
      date: "October - December 2025",
      milestones: [
        { text: "Pronova Wallet Launch (Beta Version) -- Secure multi-chain wallet for holding and transacting Pronova tokens", completed: false },
        { text: "Payment Gateway Integration -- Allowing merchants to accept Pronova for payments", completed: false },
        { text: "Pronova Rewards Program -- Introducing cashback and loyalty incentives for holders", completed: false }
      ],
      isActive: false,
      isCompleted: false,
      progress: 0,
      icon: FaGlobeAmericas
    },
    {
      title: "Q1 2026 - Utility & Real-World Use Cases",
      date: "January - March 2026",
      milestones: [
        { text: "Integration with E-commerce Platforms -- Partnership with Shopify, WooCommerce for token payments", completed: false },
        { text: "Real Estate & Gold Investment Use Cases -- Facilitating tokenized real estate and gold investments", completed: false },
        { text: "Expansion into More Exchanges -- Listing on Binance, Coinbase, OKX, or Kraken (subject to market conditions)", completed: false }
      ],
      isActive: false,
      isCompleted: false,
      progress: 0,
      icon: FaShieldAlt
    },
    {
      title: "Q2-Q4 2026 - AI Integration & Enterprise Solutions",
      date: "April - December 2026",
      milestones: [
        { text: "AI-Driven Investment Tools -- Implementing AI-based financial analysis & risk management tools for investors", completed: false },
        { text: "Pronova Pay Launch -- Payment cards & virtual debit cards for real-world spending", completed: false },
        { text: "Enterprise & Institutional Adoption -- Collaborating with large businesses and hedge funds for adoption", completed: false }
      ],
      isActive: false,
      isCompleted: false,
      progress: 0,
      icon: FaCogs
    },
    {
      title: "2027 - Mass Adoption & Long-Term Growth",
      date: "January - December 2027",
      milestones: [
        { text: "Pronova 2.0 Ecosystem Upgrade -- Scalability improvements, Layer 2 solutions, and lower transaction fees", completed: false },
        { text: "Global Financial Partnerships -- Expanding partnerships with banks, fintech startups, and governments", completed: false },
        { text: "Pronova Blockchain Mainnet Development -- Transitioning from Ethereum/BSC to a dedicated blockchain (if needed)", completed: false },
        { text: "Sustainable Growth & Long-Term Vision -- Establishing Pronova as a top-tier digital asset for payments, trading, and investments", completed: false }
      ],
      isActive: false,
      isCompleted: false,
      progress: 0,
      icon: FaUsers
    }
  ];

  const handleItemClick = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-primary-500/5 dark:bg-primary-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary-500/5 dark:bg-secondary-500/10 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-primary-500/3 dark:from-primary-500/5 to-transparent rounded-full" />
      </div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-20 overflow-hidden">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <motion.div 
              className="inline-flex items-center px-6 py-2 rounded-full bg-gradient-to-r from-primary-500/10 to-secondary-500/10 border border-primary-300/30 dark:border-primary-500/20 mb-6"
              whileHover={{ scale: 1.05 }}
            >
              <FaRocket className="w-4 h-4 mr-2 text-primary-600 dark:text-primary-400" />
              <span className="text-primary-600 dark:text-primary-400 text-sm font-semibold uppercase tracking-wider">Development Timeline</span>
            </motion.div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6">
              <span className="text-gray-900 dark:text-white">Pronova </span>
              <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                Roadmap
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
              Our strategic development plan to revolutionize cryptocurrency integration with traditional finance, 
              from initial launch to global adoption
            </p>
          </motion.div>

          {/* Statistics */}
          <RoadmapStats />
        </div>
      </section>

      {/* Timeline Section */}
      <section className="relative py-16 md:py-24">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6 text-gray-900 dark:text-white">
              Development Phases
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Follow our journey as we build the future of cryptocurrency integration. 
              Click on any phase to view detailed milestones and progress.
            </p>
          </motion.div>

          {/* Timeline */}
          <div className="max-w-4xl mx-auto roadmap-timeline">
            {roadmapItems.map((item, index) => (
              <EnhancedRoadmapItem
                key={index}
                item={item}
                index={index}
                isVisible={isVisible}
                onItemClick={handleItemClick}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="relative py-16 md:py-24 bg-gradient-to-b from-transparent to-primary-50/30 dark:to-primary-900/10">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6 text-gray-900 dark:text-white">
                Our Vision for the
                <span className="block bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                  Future of Finance
                </span>
              </h2>
              <div className="text-gray-600 dark:text-gray-300 space-y-6 text-lg leading-relaxed">
                <p>
                  At Pronova, we're not just building another cryptocurrency – we're creating a comprehensive 
                  ecosystem that bridges traditional finance with blockchain innovation.
                </p>
                <p>
                  Our roadmap represents a carefully orchestrated plan to deliver real-world utility, 
                  ensuring each milestone builds upon previous achievements while maintaining 
                  sustainable growth and value creation.
                </p>
                <p>
                  By 2027, we envision Pronova as a leading digital asset powering global commerce, 
                  investments, and financial services across both traditional and decentralized systems.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-6"
            >
              {[
                { icon: FaShieldAlt, title: 'Security First', desc: 'Multiple audits and continuous monitoring' },
                { icon: FaGlobeAmericas, title: 'Real-World Utility', desc: 'Practical applications in payments and investments' },
                { icon: FaUsers, title: 'Strategic Partnerships', desc: 'Collaboration with established institutions' },
                { icon: FaCogs, title: 'Continuous Innovation', desc: 'Regular platform improvements and new features' }
              ].map((pillar, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start p-4 bg-white/80 dark:bg-white/5 backdrop-blur-sm border border-gray-200/50 dark:border-gray-600/30 rounded-xl hover:border-primary-400/50 dark:hover:border-primary-500/50 transition-all duration-300 shadow-sm dark:shadow-none"
                >
                  <pillar.icon className="w-6 h-6 text-primary-600 dark:text-primary-400 mr-4 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">{pillar.title}</h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">{pillar.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-16 md:py-24">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative p-8 md:p-12 rounded-3xl bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600 text-white text-center overflow-hidden shadow-2xl"
          >
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="grid-pattern w-full h-full" />
            </div>
            
            <div className="relative z-10">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold mb-4">
                Join the Pronova Revolution
              </h2>
              <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto opacity-90">
                Be part of the future of finance. Contribute to shaping the next generation 
                of cryptocurrency integration with traditional business practices.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <motion.a 
                  href="/#presale" 
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary-700 font-semibold rounded-xl hover:bg-gray-100 transition-all duration-300 shadow-lg click-ripple"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaRocket className="w-5 h-5 mr-2" />
                  Join Presale
                </motion.a>
                <motion.a 
                  href="https://t.me/pronovaofficial" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center justify-center px-8 py-4 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border border-white/30 font-semibold rounded-xl transition-all duration-300 click-ripple"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaUsers className="w-5 h-5 mr-2" />
                  Join Community
                </motion.a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Modal */}
      <RoadmapModal 
        item={selectedItem} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
};

export default Roadmap;