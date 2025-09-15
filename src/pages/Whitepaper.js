import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';
import PartnerCard from '../components/ui/PartnerCard';
import { 
  FaDownload, 
  FaBook, 
  FaShieldAlt, 
  FaChartLine, 
  FaUsers, 
  FaHandshake, 
  FaRoad, 
  FaGavel, 
  FaFileContract, 
  FaGlobe, 
  FaCoins,
  FaCog,
  FaLightbulb,
  FaRocket,
  FaStar,
  FaTrophy,
  FaFlag,
  FaEye,
  FaArrowUp
} from 'react-icons/fa';
import TokenomicsChart from '../components/ui/TokenomicsChart';
import LockedTokensChart from '../components/ui/LockedTokensChart';

// Import partner logos
import capiMaxHoldingsLogo from '../assets/images/logos for partner/CAPI Max Holdings UK.png';
import capiMaxInvestmentsUKLogo from '../assets/images/logos for partner/CAPI Max Investments UK.png';
import capiMaxInvestmentsUSALogo from '../assets/images/logos for partner/CAPI Max Investments USA.png';
import capiMaxInvestmentsUAELogo from '../assets/images/logos for partner/CAPI Max Investments UAE.png';
import capiMaxFinancialLogo from '../assets/images/logos for partner/CAPI Max Financial  uk.png';
import capiMaxTradingLogo from '../assets/images/logos for partner/CAPI Max for general Trading  USA.png';
import capiMaxDevelopmentLogo from '../assets/images/logos for partner/CAPI Max development  UK.png';
import capiMaxMetalsLogo from '../assets/images/logos for partner/CAPI Max for Investment in precious metals and minerals  UK.png';
import profitMaxLogo from '../assets/images/logos for partner/profitmax logo.png';
import tdhLogo from '../assets/images/logos for partner/tdh logo.png';
import primeInnLogo from '../assets/images/logos for partner/primeinn logo.png';
import eliteGateLogo from '../assets/images/logos for partner/elitgate properties.png';
import novaPropertyLogo from '../assets/images/logos for partner/nova property logo.png';
// Note: trustech and future group logos not available in assets folder
import hccLogo from '../assets/images/logos for partner/hcc logo.png';
import assuraxLogo from '../assets/images/logos for partner/assurax logo-01.png';
import cimLogo from '../assets/images/logos for partner/cim logo.png';

const Whitepaper = () => {
  const [activeSection, setActiveSection] = useState('executive-summary');
  const [isScrollTopVisible, setIsScrollTopVisible] = useState(false);

  // Handle scroll to top visibility
  useEffect(() => {
    const handleScroll = () => {
      setIsScrollTopVisible(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const sections = [
    { id: 'executive-summary', title: 'Executive Summary', icon: FaFileContract },
    { id: 'introduction', title: 'Introduction', icon: FaBook },
    { id: 'features', title: 'Features & Support', icon: FaChartLine },
    { id: 'basic-services', title: 'Basic Services', icon: FaGlobe },
    { id: 'tokenomics', title: 'Tokenomics', icon: FaCoins },
    { id: 'technical-architecture', title: 'Technical Architecture', icon: FaCog },
    { id: 'business-model', title: 'Business Model', icon: FaHandshake },
    { id: 'use-cases', title: 'Use Cases', icon: FaUsers },
    { id: 'risk-insurance', title: 'Risk Insurance', icon: FaShieldAlt },
    { id: 'roadmap', title: 'Roadmap', icon: FaRoad },
    { id: 'presale', title: 'Pre-sale Information', icon: FaChartLine },
    { id: 'team', title: 'Team & Consultants', icon: FaUsers },
    { id: 'partners', title: 'Partners', icon: FaHandshake },
    { id: 'legal', title: 'Law & Compliance', icon: FaGavel },
    { id: 'risks', title: 'Risks & Challenges', icon: FaShieldAlt },
    { id: 'conclusion', title: 'Conclusion', icon: FaFlag }
  ];

  // Company data arrays
  const capiMaxCompanies = [
    { name: 'CAPI Max Holdings UK', logo: capiMaxHoldingsLogo, website: 'https://www.capimaxholding.com' },
    { name: 'CAPI Max Investments USA', logo: capiMaxInvestmentsUSALogo, website: 'https://www.capimaxinvestments.com' },
    { name: 'CAPI Max Investments UK', logo: capiMaxInvestmentsUKLogo, website: 'https://www.capimaxinvestments.com' },
    { name: 'CAPI Max Investments UAE', logo: capiMaxInvestmentsUAELogo, website: 'https://www.capimaxinvestments.com' },
    { name: 'CAPI Max Financial UK', logo: capiMaxFinancialLogo, website: 'https://www.capimaxinvestments.com' },
    { name: 'CAPI Max General Trading USA', logo: capiMaxTradingLogo, website: 'https://www.capimaxinvestments.com' },
    { name: 'CAPI Max Development UK', logo: capiMaxDevelopmentLogo, website: 'https://www.capimaxinvestments.com' },
    { name: 'CAPI Max Investment in Precious Metals UK', logo: capiMaxMetalsLogo, website: 'https://www.capimaxinvestments.com' }
  ];

  const partnerCompanies = [
    { name: 'Profit Max Investments UK', logo: profitMaxLogo, website: '#' },
    { name: 'TDH Development UK-UAE', logo: tdhLogo, website: '#' },
    { name: 'Prime Inn Hotels USA-UK', logo: primeInnLogo, website: '#' },
    { name: 'Elite Gate Properties UK', logo: eliteGateLogo, website: '#' },
    { name: 'Nova Property Management UK', logo: novaPropertyLogo, website: '#' }
    // Note: Trustech Group and Future Group logos not available
  ];

  const insuranceCompanies = [
    { name: 'HCC International Insurance USA-UK', logo: hccLogo, website: 'https://www.hccinternationalinsurance.com' },
    { name: 'Assurax Insurance USA-UK', logo: assuraxLogo, website: 'https://www.assurainsurance.com' }
  ];

  const financialCompanies = [
    { name: 'CIM Financial Group UK-USA', logo: cimLogo, website: '#' }
  ];

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 120; // Account for fixed header
      const elementPosition = element.offsetTop - offset;
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
      setActiveSection(sectionId);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Scroll spy functionality
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('[id^=""]');
      let currentSection = '';

      sections.forEach((section) => {
        const sectionTop = section.offsetTop - 150;
        const sectionHeight = section.offsetHeight;
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
          currentSection = section.getAttribute('id');
        }
      });

      if (currentSection && currentSection !== activeSection) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeSection]);

  return (
    <>
      {/* Enhanced Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-white dark:bg-dark-900">
          <div className="absolute inset-0 bg-grid-pattern opacity-30"></div>
          {/* Floating orbs */}
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary-500/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-secondary-500/20 rounded-full blur-3xl animate-float-slow"></div>
        </div>
        
        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-5xl mx-auto"
          >
            {/* Badge */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-primary-500/10 to-secondary-500/10 backdrop-blur border border-primary-500/20 mb-8"
            >
              <FaBook className="text-primary-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Revolutionary Cryptocurrency Whitepaper</span>
            </motion.div>

            {/* Main Title */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mb-8"
            >
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold mb-4 text-gray-900 dark:text-white leading-tight">
                Pronova 
                <span className="block text-gradient-animated">Whitepaper</span>
              </h1>
              <div className="w-32 h-1.5 bg-gradient-to-r from-primary-600 to-secondary-600 mx-auto rounded-full shadow-neon"></div>
            </motion.div>
            
            {/* Subtitle */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed"
            >
              Revolutionary cryptocurrency developed by 
              <span className="text-primary-600 dark:text-primary-400 font-semibold"> CAPI MAX Holding</span> - 
              bridging traditional business with cryptocurrency innovation through 
              <span className="text-secondary-600 dark:text-secondary-400 font-semibold"> 18+ international companies</span> 
              across <span className="text-primary-600 dark:text-primary-400 font-semibold">60+ business fields</span>.
            </motion.p>
            
            {/* Action Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="flex flex-col sm:flex-row justify-center gap-6"
            >
              <Button 
                variant="gradient"
                size="large"
                href="https://drive.google.com/file/d/1cslWhHupmJs8sPg8RLFnbjaavv7ljNvp/view"
                target="_blank"
                className="shadow-2xl hover:shadow-neon-strong transform hover:scale-105 transition-all duration-300 group"
              >
                <FaDownload className="mr-3 group-hover:animate-bounce" />
                <span>Download Complete PDF</span>
              </Button>
              <Button 
                variant="outline"
                size="large"
                onClick={() => scrollToSection('executive-summary')}
                className="border-2 hover:shadow-lg transform hover:scale-105 transition-all duration-300 group"
              >
                <FaEye className="mr-3 group-hover:scale-110 transition-transform" />
                <span>Read Online</span>
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16"
            >
              {[
                { number: '18+', label: 'Partner Companies', icon: FaHandshake },
                { number: '60+', label: 'Business Fields', icon: FaGlobe },
                { number: '1B', label: 'Total Supply', icon: FaCoins },
                { number: '10%', label: 'User Discount', icon: FaStar }
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-3 shadow-neon">
                    <stat.icon className="text-white text-xl" />
                  </div>
                  <div className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">{stat.number}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="py-20 bg-gray-50 dark:bg-dark-800 relative">
        <div className="container-custom">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Enhanced Sidebar Navigation */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:w-1/4"
            >
              <div className="lg:sticky lg:top-32">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-dark-900 dark:to-dark-800 rounded-2xl p-8 shadow-2xl border border-gray-200 dark:border-gray-700 backdrop-blur-sm">
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-neon">
                      <FaBook className="text-white text-xl" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Table of Contents</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Navigate through the whitepaper</p>
                  </div>
                  
                  <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
                    {sections.map((section, index) => {
                      const IconComponent = section.icon;
                      const isActive = activeSection === section.id;
                      return (
                        <motion.button
                          key={section.id}
                          onClick={() => scrollToSection(section.id)}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          className={`text-left w-full px-4 py-4 rounded-xl transition-all duration-300 flex items-center text-sm group relative overflow-hidden ${
                            isActive
                              ? 'bg-gradient-to-r from-primary-100 to-primary-50 dark:from-primary-900/50 dark:to-primary-800/50 text-primary-700 dark:text-primary-400 font-semibold shadow-lg border-l-4 border-primary-500'
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-800/70 hover:shadow-md hover:scale-105'
                          }`}
                        >
                          <IconComponent className={`mr-3 flex-shrink-0 transition-all duration-300 ${isActive ? 'text-primary-600 dark:text-primary-400' : 'group-hover:text-primary-500'}`} />
                          <span className="truncate">{section.title}</span>
                          {isActive && (
                            <motion.div 
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute right-3 w-2 h-2 bg-primary-500 rounded-full"
                            />
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                  
                  <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <Button 
                      variant="gradient"
                      href="https://drive.google.com/file/d/1cslWhHupmJs8sPg8RLFnbjaavv7ljNvp/view"
                      target="_blank"
                      fullWidth
                      className="shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                    >
                      <FaDownload className="mr-2" />
                      <span>Download PDF</span>
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Enhanced Main Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="lg:w-3/4"
            >
              {/* Executive Summary */}
              <div id="executive-summary" className="mb-20 scroll-mt-32">
                <div className="bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-900/50 dark:to-gray-800/50 rounded-2xl p-10 shadow-2xl border border-primary-200 dark:border-gray-700 mb-12 relative overflow-hidden">
                  {/* Background decoration */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-500/20 to-secondary-500/20 rounded-full blur-3xl"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-secondary-500/20 to-primary-500/20 rounded-full blur-2xl"></div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="relative z-10"
                  >
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center shadow-neon">
                        <FaFileContract className="text-white text-xl" />
                      </div>
                      <h2 className="text-4xl font-heading font-bold text-gray-900 dark:text-white">
                        Executive Summary
                      </h2>
                    </div>
                    
                    <div className="prose prose-xl max-w-none dark:prose-invert">
                      <p className="text-xl leading-relaxed mb-6 text-gray-700 dark:text-gray-300">
                        <strong className="text-primary-600 dark:text-primary-400">Pronova</strong> is an innovative cryptocurrency developed by{' '}
                        <strong className="text-secondary-600 dark:text-secondary-400">CAPI MAX Holding</strong>, 
                        a British-American company that owns 12 Global companies, working in more than 60 fields including Finance, 
                        investment fund trust, Market Administration, Gold, silver, petroleum Trading, real estate financing, 
                        financial leasing, Tourism, Fintech, commercial activity, AI Activity, cryptocurrency financial management, 
                        credit risk, currencies, financial markets, real estate, general trading, and more.
                      </p>
                      
                      {/* Company showcase */}
                      <div className="bg-white dark:bg-dark-800 rounded-xl p-8 my-8 border border-primary-200 dark:border-gray-700 shadow-lg">
                        <h4 className="text-2xl font-semibold mb-6 text-primary-700 dark:text-primary-400 text-center">
                          🏢 CAPI MAX Holding Companies
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-base">
                          <div className="space-y-3">
                            {[
                              'Capi Max Holding UK',
                              'Capi Max Investments USA',
                              'Capi Max Investments UK',
                              'CapiMax General Trading USA',
                              'CapiMax Development UK',
                              'Capi Max Investment In Mineral and Precious Metal UK'
                            ].map((company, index) => (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                                className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20"
                              >
                                <span className="w-6 h-6 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                  {index + 1}
                                </span>
                                <span className="text-gray-700 dark:text-gray-300">{company}</span>
                              </motion.div>
                            ))}
                          </div>
                          <div className="space-y-3">
                            {[
                              'Capi Max Financial UK',
                              'Capi Max Investments UAE',
                              'HCC Cyber Insurance',
                              'CIM Financial',
                              'Assurax Insurance and Credit Risk',
                              'Profit Max British Investment'
                            ].map((company, index) => (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                                className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-secondary-50 to-primary-50 dark:from-secondary-900/20 dark:to-primary-900/20"
                              >
                                <span className="w-6 h-6 bg-secondary-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                  {index + 7}
                                </span>
                                <span className="text-gray-700 dark:text-gray-300">{company}</span>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 rounded-xl p-8 border-l-4 border-green-500 shadow-lg">
                        <h4 className="text-xl font-semibold mb-4 text-green-700 dark:text-green-400 flex items-center gap-2">
                          <FaTrophy className="text-yellow-500" />
                          Revolutionary Vision
                        </h4>
                        <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
                          To bridge the gap between traditional business practices and the rapidly evolving world of cryptocurrencies, 
                          Pronova aims to revolutionize the investment landscape by providing seamless integration of cryptocurrencies 
                          into investment, trading and investment strategies with <strong className="text-green-600 dark:text-green-400">18 international companies</strong> specializing 
                          in Investments and financial, funds, real estate, gold, metals, hotels, oil, bonds, insurance, and other real 
                          contracts fixed on opportunities, investments, and documents.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Introduction */}
              <div id="introduction" className="mb-20 scroll-mt-32">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-neon">
                      <FaBook className="text-white text-xl" />
                    </div>
                    <h2 className="text-4xl font-heading font-bold text-gray-900 dark:text-white">
                      Introduction
                    </h2>
                  </div>
                  
                  <div className="prose prose-xl max-w-none dark:prose-invert">
                    <p className="text-xl leading-relaxed mb-8 text-gray-700 dark:text-gray-300">
                      Despite the increasing adoption, many companies and investors face challenges in integrating these technologies 
                      into their existing systems. Pronova addresses these challenges by offering a comprehensive range of services 
                      that simplify the use of digital currencies in investment and business contexts.
                    </p>
                    
                    {/* Challenges section */}
                    <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-xl p-8 border-l-4 border-red-500 mb-8 shadow-lg">
                      <h3 className="text-2xl font-semibold mb-6 text-red-700 dark:text-red-400 flex items-center gap-3">
                        <FaLightbulb className="text-yellow-500" />
                        Industries Challenges Addressed
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <h4 className="font-semibold text-red-600 dark:text-red-400 text-lg">Complex Integration:</h4>
                          <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                            <li className="flex items-start gap-2">
                              <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                              <span>The difficulty of integrating cryptocurrencies with investment</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                              <span>The difficulty of integrating cryptocurrencies into traditional financial systems</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                              <span>Make the secured cryptocurrency accessible to companies and investors</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                              <span>Ensure security concerns, secure transactions and storage of digital assets</span>
                            </li>
                          </ul>
                        </div>
                        <div className="bg-white dark:bg-dark-800 rounded-lg p-6 shadow-md">
                          <h4 className="font-semibold text-green-600 dark:text-green-400 text-lg mb-4 flex items-center gap-2">
                            <FaRocket className="text-blue-500" />
                            Pronova Solution
                          </h4>
                          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            Pronova offers a multifaceted approach to integrating cryptocurrencies into the business and investment 
                            sectors. Our platform is designed to provide users with the tools they need to manage, invest in and 
                            transact cryptocurrencies effortlessly.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Features & Support */}
              <div id="features" className="mb-20 scroll-mt-32">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-neon">
                      <FaChartLine className="text-white text-xl" />
                    </div>
                    <h2 className="text-4xl font-heading font-bold text-gray-900 dark:text-white">
                      Features & Support to Increase Demand
                    </h2>
                  </div>
                  
                  <div className="prose prose-xl max-w-none dark:prose-invert">
                    <p className="text-xl leading-relaxed mb-8 text-gray-700 dark:text-gray-300">
                      Our cryptocurrency has been supported by several exceptional features to make the demand for the currency 
                      large and its purchase is continuous, required, useful and profitable, and its circulation is continuous.
                    </p>
                    
                    {/* Feature cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                      {[
                        {
                          icon: FaChartLine,
                          title: 'Price Appreciation',
                          description: 'Its price increases as a result of increased demand',
                          color: 'blue',
                          bgGradient: 'from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20'
                        },
                        {
                          icon: FaStar,
                          title: 'User Benefits',
                          description: 'Holders benefit from discounts when used as payment method',
                          color: 'green',
                          bgGradient: 'from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20'
                        },
                        {
                          icon: FaTrophy,
                          title: 'Corporate Cashback',
                          description: 'Companies receive cashback profits when accepting Pronova',
                          color: 'purple',
                          bgGradient: 'from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20'
                        }
                      ].map((feature, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          className={`bg-gradient-to-br ${feature.bgGradient} rounded-2xl p-8 border border-${feature.color}-200 dark:border-${feature.color}-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`}
                        >
                          <div className={`w-16 h-16 bg-${feature.color}-600 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg`}>
                            <feature.icon className="text-white text-2xl" />
                          </div>
                          <h4 className={`text-xl font-semibold text-center mb-4 text-${feature.color}-700 dark:text-${feature.color}-400`}>
                            {feature.title}
                          </h4>
                          <p className="text-center text-gray-700 dark:text-gray-300 leading-relaxed">
                            {feature.description}
                          </p>
                        </motion.div>
                      ))}
                    </div>

                    {/* Highlighted feature */}
                    <div className="bg-gradient-to-r from-primary-100 to-secondary-100 dark:from-primary-900/30 dark:to-secondary-900/30 rounded-2xl p-10 border border-primary-200 dark:border-gray-700 shadow-2xl">
                      <div className="text-center">
                        <div className="w-20 h-20 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-neon">
                          <FaRocket className="text-white text-2xl" />
                        </div>
                        <h3 className="text-3xl font-bold mb-6 text-primary-700 dark:text-primary-400">
                          From Pronova Website in 3 Minutes
                        </h3>
                        <p className="text-xl leading-relaxed mb-6 text-gray-700 dark:text-gray-300">
                          The currency platform's website is effectively linked to investments available to 18 global companies 
                          around the world for investment and payment in Pronova. Through the website, investors can pay, buy, 
                          and invest in real estate, gold, bonds, stocks, and other investments or purchases within minutes.
                        </p>
                        <div className="bg-yellow-100 dark:bg-yellow-900/30 rounded-xl p-6 border-l-4 border-yellow-500 shadow-lg">
                          <p className="text-center font-bold text-xl text-yellow-700 dark:text-yellow-400 flex items-center justify-center gap-3">
                            <FaStar className="text-yellow-500" />
                            Investors receive an immediate 10% discount when purchasing or paying in Pronova
                            <FaStar className="text-yellow-500" />
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Basic Services */}
              <div id="basic-services" className="mb-20 scroll-mt-32">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-neon">
                      <FaGlobe className="text-white text-xl" />
                    </div>
                    <h2 className="text-4xl font-heading font-bold text-gray-900 dark:text-white">
                      Basic Services of Pronova
                    </h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[
                      "Digital wallets: secure storage solutions for Pronova",
                      "Investment in real estate, gold, stocks, insurance, bonds, trade, and others",
                      "Buying and investing with major companies worldwide",
                      "Partial investment in 12 investment activities around the world",
                      "Currency Guarantee Investment in 12 Investment Activities",
                      "Investment opportunities for companies through the application",
                      "Investment opportunities for individuals under digital currencies",
                      "Diversify investors' portfolios in cryptocurrencies",
                      "Using profits to obtain investment opportunities insured by insurance policies",
                      "Converting currencies into investment and converting profits into real estate assets",
                      "Payment Cards: Physical and virtual cards for daily transactions",
                      "Dedicated remittance system with instant, secure and low-cost transactions",
                      "Everything in one platform for seamless experience",
                      "Multi-signature and encrypted storage capabilities",
                      "Asset tokenization platforms for financial solutions"
                    ].map((service, index) => (
                      <motion.div 
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.05 }}
                        className="bg-white dark:bg-dark-900 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:scale-105 group"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300">
                            <span className="text-white font-bold text-lg">{index + 1}</span>
                          </div>
                          <div>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                              {service}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Tokenomics */}
              <div id="tokenomics" className="mb-20 scroll-mt-32">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center shadow-neon">
                      <FaCoins className="text-white text-xl" />
                    </div>
                    <h2 className="text-4xl font-heading font-bold text-gray-900 dark:text-white">
                      Tokenomics
                    </h2>
                  </div>
                  
                  <div className="prose prose-xl max-w-none dark:prose-invert mb-12">
                    <p className="text-xl leading-relaxed mb-8 text-gray-700 dark:text-gray-300">
                      Understanding the economic model of Pronova is critical for users and investors alike. Our tokens are 
                      designed to ensure sustainability and maintain a balanced system.
                    </p>
                    
                    {/* Token info cards */}
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-dark-900 dark:to-dark-800 rounded-2xl p-8 mb-12 border border-gray-200 dark:border-gray-700 shadow-xl">
                      <h3 className="text-2xl font-semibold mb-8 text-gray-900 dark:text-white text-center">Token Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                          { label: 'Token Name', value: 'Pronova', icon: FaCoins },
                          { label: 'Code', value: 'PRN', icon: FaFlag },
                          { label: 'Blockchain', value: 'Ethereum', icon: FaCog },
                          { label: 'Total Supply', value: '1,000,000,000', icon: FaChartLine }
                        ].map((info, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="text-center bg-white dark:bg-dark-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
                          >
                            <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-neon">
                              <info.icon className="text-white" />
                            </div>
                            <p className="font-semibold text-primary-600 dark:text-primary-400 mb-2">{info.label}</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{info.value}</p>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Charts */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-dark-900 dark:to-dark-800 p-8 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700">
                      <h3 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">
                        Token Distribution
                      </h3>
                      <TokenomicsChart className="h-80" />
                    </div>
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-dark-900 dark:to-dark-800 p-8 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700">
                      <h3 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">
                        Locked Tokens
                      </h3>
                      <LockedTokensChart className="h-80" />
                    </div>
                  </div>

                  {/* Lock information */}
                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-2xl p-8 border-l-4 border-yellow-500 mb-12 shadow-xl">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
                        <FaShieldAlt className="text-white text-xl" />
                      </div>
                      <h3 className="text-2xl font-semibold text-yellow-700 dark:text-yellow-400">
                        Important Lock Information
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <p className="text-xl font-semibold text-yellow-600 dark:text-yellow-300 mb-2">
                          🔒 45% of tokens will be locked and will unlock within 9 years
                        </p>
                        <p className="text-yellow-700 dark:text-yellow-300">
                          2.5% will unlock every 6 months, ensuring long-term stability and commitment
                        </p>
                      </div>
                      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Benefits of Token Locking:</h4>
                        <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                          <li>• Prevents market manipulation</li>
                          <li>• Ensures long-term project commitment</li>
                          <li>• Builds investor confidence</li>
                          <li>• Supports price stability</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Utility section */}
                  <div className="bg-white dark:bg-dark-900 rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-700">
                    <h3 className="text-2xl font-semibold mb-8 text-gray-900 dark:text-white text-center">Utility for Pronova</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        {[
                          'Payments and Conversions',
                          'Partial and total investment and financial payments',
                          'Digital transactions with merchants and partners',
                          'Investment products offered by CAPIMAX',
                          'Guarantee for investment products subscription'
                        ].map((utility, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            className="flex items-start gap-3 p-4 rounded-lg bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20"
                          >
                            <span className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                              {index + 1}
                            </span>
                            <span className="text-gray-700 dark:text-gray-300 font-medium">{utility}</span>
                          </motion.div>
                        ))}
                      </div>
                      <div className="space-y-4">
                        {[
                          'Transaction fees payment for platform services',
                          'Storage to earn rewards and secure the network',
                          'Expected impressive rise in cryptocurrency market',
                          'Global profits through international company support',
                          'Investment opportunities guarantee mechanism'
                        ].map((utility, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            className="flex items-start gap-3 p-4 rounded-lg bg-gradient-to-r from-secondary-50 to-primary-50 dark:from-secondary-900/20 dark:to-primary-900/20"
                          >
                            <span className="w-8 h-8 bg-secondary-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                              {index + 6}
                            </span>
                            <span className="text-gray-700 dark:text-gray-300 font-medium">{utility}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Enhanced Partners Section */}
              <div id="partners" className="mb-20 scroll-mt-32">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-neon">
                      <FaHandshake className="text-white text-xl" />
                    </div>
                    <h2 className="text-4xl font-heading font-bold text-gray-900 dark:text-white">
                      Our Partners
                    </h2>
                  </div>
                  
                  {/* CAPI MAX Companies */}
                  <div className="mb-16">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6 }}
                      className="text-center mb-12"
                    >
                      <h3 className="text-3xl font-semibold mb-4 text-primary-700 dark:text-primary-400">
                        🏢 CAPI MAX Group Companies
                      </h3>
                      <p className="text-lg text-gray-600 dark:text-gray-400">
                        The core companies driving Pronova's innovation and growth
                      </p>
                    </motion.div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                      {capiMaxCompanies.map((company, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                          <PartnerCard
                            name={company.name}
                            logo={company.logo}
                            website={company.website}
                            delay={index * 0.1}
                          />
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Strategic Partners */}
                  <div className="mb-16">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6 }}
                      className="text-center mb-12"
                    >
                      <h3 className="text-3xl font-semibold mb-4 text-green-700 dark:text-green-400">
                        🤝 Strategic Partners
                      </h3>
                      <p className="text-lg text-gray-600 dark:text-gray-400">
                        Leading companies in real estate, hospitality, and development
                      </p>
                    </motion.div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {partnerCompanies.map((company, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                          <PartnerCard
                            name={company.name}
                            logo={company.logo}
                            website={company.website}
                            delay={index * 0.1}
                          />
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Insurance Partners */}
                  <div className="mb-16">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6 }}
                      className="text-center mb-12"
                    >
                      <h3 className="text-3xl font-semibold mb-4 text-red-700 dark:text-red-400">
                        🛡️ Insurance Partners
                      </h3>
                      <p className="text-lg text-gray-600 dark:text-gray-400">
                        Providing comprehensive protection and risk management
                      </p>
                    </motion.div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {insuranceCompanies.map((company, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                          <PartnerCard
                            name={company.name}
                            logo={company.logo}
                            website={company.website}
                            delay={index * 0.1}
                          />
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Financial Partners */}
                  <div className="mb-12">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6 }}
                      className="text-center mb-12"
                    >
                      <h3 className="text-3xl font-semibold mb-4 text-blue-700 dark:text-blue-400">
                        💼 Financial Partners
                      </h3>
                      <p className="text-lg text-gray-600 dark:text-gray-400">
                        Expert financial services and blockchain technology solutions
                      </p>
                    </motion.div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {financialCompanies.map((company, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                          <PartnerCard
                            name={company.name}
                            logo={company.logo}
                            website={company.website}
                            delay={index * 0.1}
                          />
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Partnership guarantee */}
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 shadow-xl">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-neon">
                        <FaShieldAlt className="text-white text-xl" />
                      </div>
                      <h3 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
                        Partnership Guarantee
                      </h3>
                      <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
                        All agreements are registered on the companies' official websites
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        The agreements have entered into force with the launch of investments within the currency's website or through their applications
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Technical Architecture */}
              <div id="technical-architecture" className="mb-20 scroll-mt-32">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-neon">
                      <FaCog className="text-white text-xl" />
                    </div>
                    <h2 className="text-4xl font-heading font-bold text-gray-900 dark:text-white">
                      Technical Architecture
                    </h2>
                  </div>
                  
                  <div className="prose prose-xl max-w-none dark:prose-invert mb-8">
                    <p className="text-xl leading-relaxed mb-8 text-gray-700 dark:text-gray-300">
                      Pronova's infrastructure is designed to ensure scalability, security and interoperability providing 
                      a strong foundation for all its services.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[
                      {
                        title: 'Blockchain Technology',
                        description: 'Ethereum blockchain for smart contract capabilities and security',
                        icon: FaCog,
                        color: 'blue'
                      },
                      {
                        title: 'Consensus Mechanism',
                        description: 'Proof of Stake for energy efficiency and scalability',
                        icon: FaShieldAlt,
                        color: 'green'
                      },
                      {
                        title: 'Smart Contracts',
                        description: 'Automated transactions with regular security audits',
                        icon: FaFileContract,
                        color: 'purple'
                      },
                      {
                        title: 'Security Measures',
                        description: 'Advanced encryption, multi-signature wallets, regular audits',
                        icon: FaShieldAlt,
                        color: 'red'
                      },
                      {
                        title: 'Scalability',
                        description: 'Layer 2 solutions for enhanced transaction speeds',
                        icon: FaRocket,
                        color: 'orange'
                      },
                      {
                        title: 'Interoperability',
                        description: 'Seamless interaction with other blockchain networks',
                        icon: FaGlobe,
                        color: 'teal'
                      }
                    ].map((tech, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className={`bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:scale-105 group`}
                      >
                        <div className={`w-16 h-16 bg-gradient-to-r from-${tech.color}-500 to-${tech.color}-600 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                          <tech.icon className="text-white text-2xl" />
                        </div>
                        <h4 className={`text-xl font-semibold mb-4 text-${tech.color}-600 dark:text-${tech.color}-400 text-center`}>
                          {tech.title}
                        </h4>
                        <p className="text-gray-700 dark:text-gray-300 text-center leading-relaxed">
                          {tech.description}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Business Model */}
              <div id="business-model" className="mb-20 scroll-mt-32">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-neon">
                      <FaHandshake className="text-white text-xl" />
                    </div>
                    <h2 className="text-4xl font-heading font-bold text-gray-900 dark:text-white">
                      Business Model
                    </h2>
                  </div>
                  
                  <div className="prose prose-xl max-w-none dark:prose-invert mb-12">
                    <p className="text-xl leading-relaxed mb-8 text-gray-700 dark:text-gray-300">
                      Pronova business model is designed to generate sustainable revenue while providing profits and value 
                      to its users through a range of strategic services and partnerships.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
                    {/* Revenue Streams */}
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-8 border border-green-200 dark:border-green-700 shadow-xl">
                      <h3 className="text-2xl font-semibold mb-6 text-green-700 dark:text-green-400 flex items-center gap-3">
                        <FaChartLine className="text-emerald-500" />
                        Revenue Streams
                      </h3>
                      <div className="space-y-4">
                        {[
                          'Collaboration with companies and financial institutions',
                          'Investment service fees',
                          'Partnership services for opportunities',
                          'Partnerships with financial entities',
                          'Transaction fees',
                          'Integration services'
                        ].map((stream, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            className="flex items-center gap-3 p-3 rounded-lg bg-white dark:bg-gray-800 shadow-md"
                          >
                            <span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">•</span>
                            <span className="text-gray-700 dark:text-gray-300">{stream}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Target Markets */}
                    <div className="space-y-8">
                      <h3 className="text-2xl font-semibold text-gray-900 dark:text-white flex items-center gap-3">
                        <FaUsers className="text-blue-500" />
                        Target Markets
                      </h3>
                      <div className="space-y-6">
                        {[
                          {
                            title: 'Companies',
                            description: 'Providing financial solutions and tools to simplify operations',
                            icon: FaHandshake,
                            color: 'blue'
                          },
                          {
                            title: 'Investors',
                            description: 'Providing investment opportunities in digital assets and financial products',
                            icon: FaChartLine,
                            color: 'purple'
                          },
                          {
                            title: 'Individuals',
                            description: 'Enable daily transactions, personal investment, and portfolio diversification',
                            icon: FaUsers,
                            color: 'orange'
                          }
                        ].map((market, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className={`bg-gradient-to-r from-${market.color}-50 to-${market.color}-100 dark:from-${market.color}-900/20 dark:to-${market.color}-800/20 rounded-xl p-6 border border-${market.color}-200 dark:border-${market.color}-700 shadow-lg`}
                          >
                            <div className="flex items-center gap-4 mb-3">
                              <div className={`w-10 h-10 bg-${market.color}-500 rounded-lg flex items-center justify-center`}>
                                <market.icon className="text-white" />
                              </div>
                              <h4 className={`font-semibold text-${market.color}-700 dark:text-${market.color}-400 text-lg`}>
                                {market.title}
                              </h4>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                              {market.description}
                            </p>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Use Cases */}
              <div id="use-cases" className="mb-20 scroll-mt-32">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center shadow-neon">
                      <FaUsers className="text-white text-xl" />
                    </div>
                    <h2 className="text-4xl font-heading font-bold text-gray-900 dark:text-white">
                      Use Cases
                    </h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {[
                      {
                        title: 'Digital Wallets',
                        description: 'Allowing investors to distribute their digital investments securely',
                        icon: FaShieldAlt,
                        gradient: 'from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20',
                        border: 'border-indigo-200 dark:border-indigo-700',
                        textColor: 'text-indigo-700 dark:text-indigo-400'
                      },
                      {
                        title: 'Investment Portfolios',
                        description: 'Diversify commercial, real estate and metals investments',
                        icon: FaChartLine,
                        gradient: 'from-teal-50 to-teal-100 dark:from-teal-900/20 dark:to-teal-800/20',
                        border: 'border-teal-200 dark:border-teal-700',
                        textColor: 'text-teal-700 dark:text-teal-400'
                      },
                      {
                        title: 'E-commerce Payments',
                        description: 'Facilitate purchases using PRONOVA through payment cards',
                        icon: FaCoins,
                        gradient: 'from-rose-50 to-rose-100 dark:from-rose-900/20 dark:to-rose-800/20',
                        border: 'border-rose-200 dark:border-rose-700',
                        textColor: 'text-rose-700 dark:text-rose-400'
                      },
                      {
                        title: 'Global Remittances',
                        description: 'Simplify international remittances with the lowest fees',
                        icon: FaGlobe,
                        gradient: 'from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20',
                        border: 'border-amber-200 dark:border-amber-700',
                        textColor: 'text-amber-700 dark:text-amber-400'
                      }
                    ].map((useCase, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className={`bg-gradient-to-br ${useCase.gradient} rounded-2xl p-8 shadow-lg border ${useCase.border} hover:shadow-xl transition-all duration-300 hover:scale-105`}
                      >
                        <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-neon">
                          <useCase.icon className="text-white text-2xl" />
                        </div>
                        <h4 className={`text-xl font-semibold mb-4 ${useCase.textColor} text-center`}>
                          {useCase.title}
                        </h4>
                        <p className="text-gray-700 dark:text-gray-300 text-center leading-relaxed">
                          {useCase.description}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Risk Insurance */}
              <div id="risk-insurance" className="mb-20 scroll-mt-32">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl flex items-center justify-center shadow-neon">
                      <FaShieldAlt className="text-white text-xl" />
                    </div>
                    <h2 className="text-4xl font-heading font-bold text-gray-900 dark:text-white">
                      Risk Insurance and Asset Protection
                    </h2>
                  </div>
                  
                  <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-2xl p-10 border border-red-200 dark:border-red-700 shadow-2xl">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                      {/* Insurance Partners */}
                      <div>
                        <div className="flex items-center gap-3 mb-8">
                          <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                            <FaShieldAlt className="text-white text-xl" />
                          </div>
                          <h3 className="text-2xl font-semibold text-red-700 dark:text-red-400">
                            Insurance Partners
                          </h3>
                        </div>
                        <div className="space-y-6">
                          {[
                            { name: 'HCC International Insurance', country: 'USA-UK', logo: hccLogo },
                            { name: 'Assurax Insurance', country: 'USA-UK', logo: assuraxLogo }
                          ].map((partner, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: -20 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.5, delay: index * 0.1 }}
                              className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md"
                            >
                              <img src={partner.logo} alt={partner.name} className="w-16 h-16 object-contain" />
                              <div>
                                <p className="font-semibold text-gray-900 dark:text-white">{partner.name}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{partner.country}</p>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Protection Coverage */}
                      <div>
                        <div className="flex items-center gap-3 mb-8">
                          <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                            <FaShieldAlt className="text-white text-xl" />
                          </div>
                          <h3 className="text-2xl font-semibold text-orange-700 dark:text-orange-400">
                            Protection Coverage
                          </h3>
                        </div>
                        <div className="space-y-4">
                          {[
                            'Data breaches protection',
                            'Cyber attacks coverage',
                            'Cyber threats protection',
                            'Business interruption coverage',
                            'Legal and regulatory expenses'
                          ].map((coverage, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: 20 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.3, delay: index * 0.1 }}
                              className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-md"
                            >
                              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                              <span className="text-gray-700 dark:text-gray-300 font-medium">{coverage}</span>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-8 pt-8 border-t border-red-200 dark:border-red-700 text-center">
                      <p className="text-red-700 dark:text-red-400 font-semibold text-lg mb-4">
                        For detailed insurance documents, visit:
                      </p>
                      <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <a href="https://www.hccinternationalinsurance.com" target="_blank" rel="noopener noreferrer" 
                           className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 text-red-600 dark:text-red-400 font-medium">
                          <FaGlobe />
                          www.hccinternationalinsurance.com
                        </a>
                        <a href="https://www.assurainsurance.com" target="_blank" rel="noopener noreferrer" 
                           className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 text-red-600 dark:text-red-400 font-medium">
                          <FaGlobe />
                          www.assurainsurance.com
                        </a>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Roadmap */}
              <div id="roadmap" className="mb-20 scroll-mt-32">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-gradient-to-r from-violet-500 to-purple-500 rounded-xl flex items-center justify-center shadow-neon">
                      <FaRoad className="text-white text-xl" />
                    </div>
                    <h2 className="text-4xl font-heading font-bold text-gray-900 dark:text-white">
                      Pronova Roadmap
                    </h2>
                  </div>
                  
                  <div className="space-y-8">
                    {[
                      {
                        period: 'Q2 2025 (April - June)',
                        title: 'Development & Initial Launch 🚀',
                        color: 'blue',
                        items: [
                          'Website Development Begins',
                          'Smart Contract Deployment',
                          'Community Building & Social Media Presence',
                          'Private Sale & Early Investor Round'
                        ]
                      },
                      {
                        period: 'Q3 2025 (July - September)',
                        title: 'Token Sale & DEX Listing 💰',
                        color: 'green',
                        items: [
                          'Initial Smart Contract Audit',
                          'Pre-Sale (ICO/IDO/IEO) Beginning',
                          'DEX Listings (Uniswap, PancakeSwap)',
                          'CEX Negotiations (KuCoin, Bitget, Gate.io)',
                          'Final Smart Contract Audit',
                          'Marketing & Partnerships Expansion'
                        ]
                      },
                      {
                        period: 'Q4 2025 (October - December)',
                        title: 'Ecosystem Expansion & Adoption 🌎',
                        color: 'purple',
                        items: [
                          'PRONOVA Wallet Launch (Beta)',
                          'Payment Gateway Integration',
                          'PRONOVA Rewards Program',
                          'Merchant Adoption'
                        ]
                      },
                      {
                        period: 'Q1 2026 (January - March)',
                        title: 'Utility & Real-World Use Cases 🚀',
                        color: 'orange',
                        items: [
                          'E-commerce Platform Integration',
                          'Real Estate & Gold Investment Use Cases',
                          'Major Exchange Listings',
                          'Partnership Expansion'
                        ]
                      },
                      {
                        period: 'Q2-Q4 2026',
                        title: 'Global Expansion & AI Integration 🤖',
                        color: 'teal',
                        items: [
                          'AI-Driven Investment Tools',
                          'PRONOVA Pay (Payment Cards)',
                          'Enterprise & Institutional Adoption',
                          'Global Market Expansion'
                        ]
                      },
                      {
                        period: '2027',
                        title: 'Mass Adoption & Long-Term Growth 🌍',
                        color: 'amber',
                        items: [
                          'PRONOVA 2.0 Ecosystem Upgrade',
                          'Global Financial Partnerships',
                          'Dedicated Blockchain Development',
                          'Top-Tier Digital Asset Status'
                        ]
                      }
                    ].map((phase, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        className={`bg-gradient-to-r from-${phase.color}-50 to-${phase.color}-100 dark:from-${phase.color}-900/20 dark:to-${phase.color}-800/20 rounded-2xl p-8 border border-${phase.color}-200 dark:border-${phase.color}-700 shadow-xl hover:shadow-2xl transition-all duration-300`}
                      >
                        <div className="flex items-center gap-4 mb-6">
                          <div className={`w-12 h-12 bg-${phase.color}-500 rounded-full flex items-center justify-center text-white font-bold text-lg`}>
                            {index + 1}
                          </div>
                          <div>
                            <h3 className={`text-2xl font-bold text-${phase.color}-700 dark:text-${phase.color}-400`}>
                              📅 {phase.period}
                            </h3>
                            <p className={`text-lg font-semibold text-${phase.color}-600 dark:text-${phase.color}-300`}>
                              {phase.title}
                            </p>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {phase.items.map((item, itemIndex) => (
                            <motion.div
                              key={itemIndex}
                              initial={{ opacity: 0, y: 10 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.3, delay: itemIndex * 0.1 }}
                              className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-md"
                            >
                              <span className="text-green-500 font-bold">✔️</span>
                              <span className="text-gray-700 dark:text-gray-300 font-medium">{item}</span>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Pre-sale Information */}
              <div id="presale" className="mb-20 scroll-mt-32">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl flex items-center justify-center shadow-neon">
                      <FaChartLine className="text-white text-xl" />
                    </div>
                    <h2 className="text-4xl font-heading font-bold text-gray-900 dark:text-white">
                      Pronova Pre-sale
                    </h2>
                  </div>
                  
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-10 border border-green-200 dark:border-green-700 shadow-2xl">
                    <div className="text-center mb-12">
                      <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-neon">
                        <FaChartLine className="text-white text-2xl" />
                      </div>
                      <h3 className="text-3xl font-bold mb-4 text-green-700 dark:text-green-400">
                        📊 Pre-Sale Breakdown
                      </h3>
                    </div>
                    
                    {/* Key stats */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                      {[
                        { label: 'Total Supply', value: '1,000,000,000', subtitle: 'PRN Tokens', icon: FaCoins },
                        { label: 'Pre-Sale Allocation', value: '250,000,000', subtitle: '25% of total supply', icon: FaChartLine },
                        { label: 'Duration', value: '90 days', subtitle: '3 phases × 30 days', icon: FaRoad },
                        { label: 'Accepted Currencies', value: 'ETH, BNB', subtitle: 'USD, USDT', icon: FaGlobe }
                      ].map((stat, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.8 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border border-green-200 dark:border-gray-700 text-center"
                        >
                          <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-neon">
                            <stat.icon className="text-white" />
                          </div>
                          <p className="font-semibold text-green-700 dark:text-green-400 mb-2">{stat.label}</p>
                          <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{stat.subtitle}</p>
                        </motion.div>
                      ))}
                    </div>

                    {/* Phases table */}
                    <div className="overflow-x-auto mb-8">
                      <table className="w-full bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-green-200 dark:border-gray-700">
                        <thead className="bg-green-100 dark:bg-green-900/30">
                          <tr>
                            <th className="px-6 py-4 text-left font-semibold text-green-700 dark:text-green-400">Phase</th>
                            <th className="px-6 py-4 text-left font-semibold text-green-700 dark:text-green-400">Duration</th>
                            <th className="px-6 py-4 text-left font-semibold text-green-700 dark:text-green-400">Tokens for Sale</th>
                            <th className="px-6 py-4 text-left font-semibold text-green-700 dark:text-green-400">Price per PRN</th>
                            <th className="px-6 py-4 text-left font-semibold text-green-700 dark:text-green-400">Total Raised</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-green-200 dark:divide-gray-700">
                          {[
                            { phase: 'Phase 1', duration: '30 days', tokens: '100M PRN', price: '$0.8', total: '$80M', bgColor: 'bg-green-50 dark:bg-green-900/10' },
                            { phase: 'Phase 2', duration: '30 days', tokens: '75M PRN', price: '$1.0', total: '$75M', bgColor: '' },
                            { phase: 'Phase 3', duration: '30 days', tokens: '75M PRN', price: '$1.5', total: '$112.5M', bgColor: 'bg-green-50 dark:bg-green-900/10' },
                            { phase: 'Total', duration: '90 days', tokens: '250M (25%)', price: '-', total: '$267.5M', bgColor: 'bg-green-100 dark:bg-green-900/20 font-bold' }
                          ].map((row, index) => (
                            <motion.tr
                              key={index}
                              initial={{ opacity: 0, x: -20 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.3, delay: index * 0.1 }}
                              className={row.bgColor}
                            >
                              <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">{row.phase}</td>
                              <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{row.duration}</td>
                              <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{row.tokens}</td>
                              <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{row.price}</td>
                              <td className="px-6 py-4 font-semibold text-green-600 dark:text-green-400">{row.total}</td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Expected listing price */}
                    <div className="text-center">
                      <div className="bg-yellow-100 dark:bg-yellow-900/20 rounded-xl p-6 border-l-4 border-yellow-500 shadow-lg inline-block">
                        <p className="text-xl font-bold text-yellow-700 dark:text-yellow-400 flex items-center justify-center gap-3">
                          <FaStar className="text-yellow-500" />
                          Expected Listing Price: $1.7 - $2.5
                          <FaStar className="text-yellow-500" />
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Team & Consultants */}
              <div id="team" className="mb-20 scroll-mt-32">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-neon">
                      <FaUsers className="text-white text-xl" />
                    </div>
                    <h2 className="text-4xl font-heading font-bold text-gray-900 dark:text-white">
                      Team & Consultants
                    </h2>
                  </div>
                  
                  <div className="prose prose-xl max-w-none dark:prose-invert mb-12">
                    <p className="text-xl leading-relaxed mb-8 text-gray-700 dark:text-gray-300">
                      CAPI Holding group and Partners boasts a team of experts and experienced professionals with extensive 
                      experience in finance, blockchain technology, cyber insurance, cryptocurrency markets, business development, 
                      financial market management, and multiple and diversified investments in many fields and several countries.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
                    {/* Core Team Structure */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-8 border border-blue-200 dark:border-blue-700 shadow-xl">
                      <h3 className="text-2xl font-semibold mb-8 text-blue-700 dark:text-blue-400 flex items-center gap-3">
                        <FaUsers className="text-indigo-500" />
                        Core Team Structure
                      </h3>
                      <div className="space-y-6">
                        {[
                          {
                            category: 'Management',
                            items: ['CAPIMax Holdings UK', 'CAPIMax Investments UK', 'CAPIMax Financial Management']
                          },
                          {
                            category: 'Insurance & Risk',
                            items: ['HCC Insurance & Risk', 'Assurax Insurance & Risk', 'CIM Finance']
                          },
                          {
                            category: 'Investments',
                            items: ['Profit Max British Investments', 'CAPIMAX Investments USA', 'Advisory Board']
                          }
                        ].map((team, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md"
                          >
                            <h4 className="font-semibold text-blue-600 dark:text-blue-400 mb-3 text-lg">{team.category}</h4>
                            <ul className="space-y-2">
                              {team.items.map((item, itemIndex) => (
                                <li key={itemIndex} className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Governance Structure */}
                    <div className="space-y-8">
                      <div className="bg-purple-50 dark:bg-purple-900/20 rounded-2xl p-8 border border-purple-200 dark:border-purple-700 shadow-xl">
                        <h3 className="text-2xl font-semibold mb-6 text-purple-700 dark:text-purple-400 flex items-center gap-3">
                          <FaGavel className="text-purple-500" />
                          Governance Structure
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                          Our team, companies, diversity and success are managed by teams, groups, companies and entities and are 
                          not subject to one person, one property or one official, but there are multiple responsibilities, powers and control.
                        </p>
                        <div className="space-y-4">
                          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
                            <h4 className="font-semibold text-purple-600 dark:text-purple-400 mb-2">Supervisory Board</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              CAPI Max Financial and Risk Management, HCC Insurance & Risk, CIM Financial, Assurax Risk Assurance
                            </p>
                          </div>
                          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
                            <h4 className="font-semibold text-purple-600 dark:text-purple-400 mb-2">Advisory Board</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              HCC Insurance & Credit Risk, CAPIMax Risk Management, CIM Finance, CAPIMAX Investments USA
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Law & Compliance */}
              <div id="legal" className="mb-20 scroll-mt-32">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-gradient-to-r from-gray-600 to-gray-700 rounded-xl flex items-center justify-center shadow-neon">
                      <FaGavel className="text-white text-xl" />
                    </div>
                    <h2 className="text-4xl font-heading font-bold text-gray-900 dark:text-white">
                      Law & Compliance
                    </h2>
                  </div>
                  
                  <div className="prose prose-xl max-w-none dark:prose-invert mb-12">
                    <p className="text-xl leading-relaxed mb-8 text-gray-700 dark:text-gray-300">
                      Founders is committed to operating within the legal frameworks of the countries in which it operates. 
                      Ensuring compliance with regulatory standards is critical to building trust and maintaining the peace of the Pronova project.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Legal Structure */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-8 border border-blue-200 dark:border-blue-700 shadow-xl">
                      <h3 className="text-2xl font-semibold mb-6 text-blue-700 dark:text-blue-400 flex items-center gap-3">
                        <FaFileContract className="text-blue-500" />
                        Legal Structure
                      </h3>
                      <p className="mb-6 text-gray-700 dark:text-gray-300">
                        Formation of CAPI Max Holding is a company registered and licensed from the following countries:
                      </p>
                      <div className="grid grid-cols-1 gap-3">
                        {[
                          'CAPI Max investments UK',
                          'CAPI Max Investments USA',
                          'HCC Insurance & Risk',
                          'CIM Finance',
                          'Assurax Risk Assurance',
                          'Profit Max British Investments'
                        ].map((company, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-md"
                          >
                            <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                              {index + 1}
                            </span>
                            <span className="text-gray-700 dark:text-gray-300">{company}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Regulatory Compliance */}
                    <div className="space-y-8">
                      <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-8 border border-green-200 dark:border-green-700 shadow-xl">
                        <h3 className="text-2xl font-semibold mb-6 text-green-700 dark:text-green-400 flex items-center gap-3">
                          <FaShieldAlt className="text-green-500" />
                          Regulatory Compliance
                        </h3>
                        <div className="space-y-6">
                          {[
                            {
                              title: 'KYC/AML Procedures',
                              description: 'Implement Know Your Customer (KYC) and Anti-Money Laundering (AML) protocols to verify users identities and prevent illegal activities. The company has certificates in compliance.'
                            },
                            {
                              title: 'Data Protection',
                              description: 'Comply with data privacy laws such as the General Data Protection Regulation (GDPR) to protect user information.'
                            },
                            {
                              title: 'Smart Contract Audits',
                              description: 'Conduct regular secure audits to ensure compliance with industry standards and prevent security vulnerabilities.'
                            }
                          ].map((compliance, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, y: 20 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.5, delay: index * 0.1 }}
                              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md"
                            >
                              <h4 className="font-semibold text-green-600 dark:text-green-400 mb-3">{compliance.title}</h4>
                              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{compliance.description}</p>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Risks & Challenges */}
              <div id="risks" className="mb-20 scroll-mt-32">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center shadow-neon">
                      <FaShieldAlt className="text-white text-xl" />
                    </div>
                    <h2 className="text-4xl font-heading font-bold text-gray-900 dark:text-white">
                      Risks & Challenges
                    </h2>
                  </div>
                  
                  <div className="prose prose-xl max-w-none dark:prose-invert mb-12">
                    <p className="text-xl leading-relaxed mb-8 text-gray-700 dark:text-gray-300">
                      While Pronova offers great potential, it is essential to recognize and address the risks and challenges inherent in the project.
                    </p>
                  </div>
                  
                  <div className="space-y-12">
                    {[
                      {
                        title: 'Regulatory Uncertainty',
                        description: 'The regulatory environment for cryptocurrencies is constantly evolving with different requirements across jurisdictions.',
                        solutions: [
                          'Proactive engagement with regulatory bodies',
                          'Continuous monitoring of legal developments',
                          'Legal compliance team',
                          'Regular compliance audits'
                        ],
                        color: 'red'
                      },
                      {
                        title: 'Market Volatility',
                        description: 'Cryptocurrency markets are volatile which may affect business value and investor confidence.',
                        solutions: [
                          'Diversification of revenue sources',
                          'Sustainable monitoring',
                          'Linking to investment opportunities and assets',
                          'Transparent community communication'
                        ],
                        color: 'orange'
                      },
                      {
                        title: 'Security Threats',
                        description: 'Risks of cyberattacks, hacking and other security breaches.',
                        solutions: [
                          'Advanced security measures implementation',
                          'Regular security audits and checks',
                          'User education on security best practices',
                          'Insurance with HCC against cyber attacks'
                        ],
                        color: 'purple'
                      }
                    ].map((risk, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: index * 0.2 }}
                        className={`bg-gradient-to-r from-${risk.color}-50 to-${risk.color}-100 dark:from-${risk.color}-900/20 dark:to-${risk.color}-800/20 rounded-2xl p-8 border border-${risk.color}-200 dark:border-${risk.color}-700 shadow-xl`}
                      >
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                          <div>
                            <div className="flex items-center gap-4 mb-6">
                              <div className={`w-12 h-12 bg-${risk.color}-500 rounded-full flex items-center justify-center`}>
                                <FaLightbulb className="text-white text-xl" />
                              </div>
                              <h3 className={`text-2xl font-semibold text-${risk.color}-700 dark:text-${risk.color}-400`}>
                                {index + 1}. {risk.title}
                              </h3>
                            </div>
                            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
                              <h4 className={`font-semibold text-${risk.color}-600 dark:text-${risk.color}-400 mb-3`}>Description</h4>
                              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{risk.description}</p>
                            </div>
                          </div>
                          <div>
                            <div className="flex items-center gap-4 mb-6">
                              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                                <FaRocket className="text-white text-xl" />
                              </div>
                              <h4 className="text-2xl font-semibold text-green-700 dark:text-green-400">Solutions</h4>
                            </div>
                            <div className="space-y-3">
                              {risk.solutions.map((solution, solutionIndex) => (
                                <motion.div
                                  key={solutionIndex}
                                  initial={{ opacity: 0, x: 20 }}
                                  whileInView={{ opacity: 1, x: 0 }}
                                  viewport={{ once: true }}
                                  transition={{ duration: 0.3, delay: solutionIndex * 0.1 }}
                                  className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md"
                                >
                                  <span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">✓</span>
                                  <span className="text-gray-700 dark:text-gray-300 font-medium">{solution}</span>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Conclusion */}
              <div id="conclusion" className="mb-20 scroll-mt-32">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-900/30 dark:to-secondary-900/30 rounded-2xl p-10 shadow-2xl border border-primary-200 dark:border-gray-700 relative overflow-hidden">
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-primary-500/20 to-secondary-500/20 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-br from-secondary-500/20 to-primary-500/20 rounded-full blur-2xl"></div>
                    
                    <div className="relative z-10">
                      <div className="flex items-center gap-4 mb-8">
                        <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center shadow-neon">
                          <FaFlag className="text-white text-2xl" />
                        </div>
                        <h2 className="text-4xl font-heading font-bold text-gray-900 dark:text-white">
                          Conclusion
                        </h2>
                      </div>
                      
                      <div className="prose prose-xl max-w-none dark:prose-invert">
                        <p className="text-xl leading-relaxed mb-8 text-gray-700 dark:text-gray-300">
                          Pronova represents a transformative step in integrating cryptocurrencies with traditional business and 
                          investment practices. By offering a comprehensive range of innovative services, Pronova not only simplifies 
                          the use of digital currencies but also enables users to leverage cutting-edge technologies to enhance their 
                          financial management and investment opportunities.
                        </p>
                        
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 border-l-4 border-primary-600 shadow-lg mb-8">
                          <h4 className="text-2xl font-semibold mb-6 text-primary-700 dark:text-primary-400 flex items-center gap-3">
                            <FaTrophy className="text-yellow-500" />
                            Key Takeaways
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                              {[
                                'Backed by 18+ international companies',
                                'Operating in 60+ business fields',
                                'Comprehensive insurance coverage',
                                'Immediate 10% user discounts'
                              ].map((takeaway, index) => (
                                <motion.div
                                  key={index}
                                  initial={{ opacity: 0, x: -20 }}
                                  whileInView={{ opacity: 1, x: 0 }}
                                  viewport={{ once: true }}
                                  transition={{ duration: 0.3, delay: index * 0.1 }}
                                  className="flex items-center gap-3"
                                >
                                  <span className="text-green-500 text-xl">✅</span>
                                  <span className="text-gray-700 dark:text-gray-300 font-medium">{takeaway}</span>
                                </motion.div>
                              ))}
                            </div>
                            <div className="space-y-4">
                              {[
                                'Multi-phase roadmap to 2027',
                                'Strong regulatory compliance',
                                'Professional team structure',
                                'Real-world utility and adoption'
                              ].map((takeaway, index) => (
                                <motion.div
                                  key={index}
                                  initial={{ opacity: 0, x: 20 }}
                                  whileInView={{ opacity: 1, x: 0 }}
                                  viewport={{ once: true }}
                                  transition={{ duration: 0.3, delay: index * 0.1 }}
                                  className="flex items-center gap-3"
                                >
                                  <span className="text-green-500 text-xl">✅</span>
                                  <span className="text-gray-700 dark:text-gray-300 font-medium">{takeaway}</span>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="text-center">
                          <p className="text-2xl font-semibold text-primary-700 dark:text-primary-400 mb-4">
                            🚀 Join the future of cryptocurrency investment with Pronova
                          </p>
                          <p className="text-lg text-gray-600 dark:text-gray-400">
                            Where traditional business meets blockchain innovation.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Download Button at the bottom */}
              <div className="mt-20 text-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <Button 
                    variant="gradient"
                    size="large"
                    href="https://drive.google.com/file/d/1cslWhHupmJs8sPg8RLFnbjaavv7ljNvp/view"
                    target="_blank"
                    className="shadow-2xl hover:shadow-neon-strong transform hover:scale-105 transition-all duration-300 group"
                  >
                    <FaDownload className="mr-3 group-hover:animate-bounce" />
                    <span>Download Complete Whitepaper</span>
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Scroll to Top Button */}
      {isScrollTopVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center shadow-2xl hover:shadow-neon-strong z-50 transition-all duration-300 hover:scale-110"
        >
          <FaArrowUp className="text-white text-lg" />
        </motion.button>
      )}

      {/* Custom scrollbar styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(156, 163, 175, 0.1);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #5C27FE, #7C42FF);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #4915d9, #6C36F5);
        }
      `}</style>
    </>
  );
};

export default Whitepaper;