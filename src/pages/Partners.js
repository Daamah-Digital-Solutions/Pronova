import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  FaBuilding, FaGlobe, FaHandshake, FaShieldAlt, FaGem, FaHotel,
  FaChartLine, FaUsers, FaPercent, FaCoins, FaExternalLinkAlt,
  FaCheck, FaArrowRight
} from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';
import { Helmet } from 'react-helmet';

// Import partner logos
import capiMaxHoldingsLogo from '../assets/images/logos for partner/CAPI Max Holdings UK.png';
import capiMaxInvestmentsUSALogo from '../assets/images/logos for partner/CAPI Max Investments USA.png';
import capiMaxInvestmentsUKLogo from '../assets/images/logos for partner/CAPI Max Investments UK.png';
import capiMaxInvestmentsUAELogo from '../assets/images/logos for partner/CAPI Max Investments UAE.png';
import capiMaxFinancialLogo from '../assets/images/logos for partner/CAPI Max Financial  uk.png';
import hccLogo from '../assets/images/logos for partner/hcc logo.png';
import assuraxLogo from '../assets/images/logos for partner/assurax logo-01.png';
import cimLogo from '../assets/images/logos for partner/cim logo.png';
import profitmaxLogo from '../assets/images/logos for partner/profitmax logo.png';
import tdhLogo from '../assets/images/logos for partner/tdh logo.png';
import novaPropertyLogo from '../assets/images/logos for partner/nova property logo.png';
import primeinnLogo from '../assets/images/logos for partner/primeinn logo.png';
import capiMaxDevelopmentLogo from '../assets/images/logos for partner/CAPI Max development  UK.png';
import capiMaxTradingLogo from '../assets/images/logos for partner/CAPI Max for general Trading  USA.png';
import capiMaxMetalsLogo from '../assets/images/logos for partner/CAPI Max for Investment in precious metals and minerals  UK.png';
import elitGatePropertiesLogo from '../assets/images/logos for partner/elitgate properties.png';
import capiMaxVirtualAssetLogo from '../assets/images/logos for partner/capi max  Virtual Asset uk dark .png';
import capiMaxFintechBlockchainLogo from '../assets/images/logos for partner/capi max  Fintech and Blockchain uk dark  copy.png';

// Animation Hook
const FadeInWhenVisible = ({ children, delay = 0, direction = null }) => {
  const [ref, setRef] = React.useState(null);
  const [inView, setInView] = React.useState(false);

  React.useEffect(() => {
    if (ref) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setInView(true);
            observer.disconnect();
          }
        },
        { threshold: 0.1 }
      );
      observer.observe(ref);
      return () => observer.disconnect();
    }
  }, [ref]);

  return (
    <motion.div
      ref={setRef}
      initial={{
        opacity: 0,
        y: direction === 'up' ? 50 : direction === 'down' ? -50 : 0,
        x: direction === 'left' ? 50 : direction === 'right' ? -50 : 0,
      }}
      animate={inView ?
        { opacity: 1, y: 0, x: 0 } :
        { opacity: 0 }
      }
      transition={{
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
        delay
      }}
    >
      {children}
    </motion.div>
  );
};

// Partner Card Component
const PartnerCard = ({ partner, darkMode, delay = 0 }) => {
  return (
    <FadeInWhenVisible delay={delay}>
      <motion.div
        whileHover={{ scale: 1.03, y: -5 }}
        className={`group relative overflow-hidden rounded-2xl backdrop-blur-sm border transition-all duration-300 h-full ${
          darkMode
            ? 'bg-dark-900/80 border-primary-600/20 hover:border-primary-500/50 hover:shadow-lg hover:shadow-primary-500/20'
            : 'bg-white/90 border-gray-200/50 hover:border-primary-300/70 hover:shadow-xl hover:shadow-primary-300/20'
        }`}
      >
        <div className="p-6">
          {/* Logo Container */}
          <div className={`mb-4 rounded-xl shadow-inner p-6 flex items-center justify-center h-24 transition-all duration-300 group-hover:shadow-lg ${
            darkMode ? 'bg-white/95' : 'bg-white'
          }`}>
            <img
              src={partner.logo}
              alt={`${partner.name} logo`}
              className="max-w-full max-h-full object-contain filter drop-shadow-md group-hover:drop-shadow-lg transition-all duration-300"
            />
          </div>

          {/* Company Info */}
          <div className="text-center">
            <h4 className={`text-sm font-bold mb-2 transition-colors duration-300 ${
              darkMode
                ? 'text-white group-hover:text-primary-400'
                : 'text-gray-900 group-hover:text-primary-600'
            }`}>
              {partner.name}
            </h4>

            {/* Sectors */}
            <div className="flex flex-wrap justify-center gap-1 mb-3">
              {partner.sectors.slice(0, 2).map((sector, idx) => (
                <span key={idx} className={`text-xs px-2 py-0.5 rounded-full ${
                  darkMode
                    ? 'bg-primary-600/20 text-primary-400'
                    : 'bg-primary-100 text-primary-700'
                }`}>
                  {sector}
                </span>
              ))}
            </div>

            <p className={`text-xs leading-relaxed mb-3 ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {partner.description}
            </p>

            {/* Accepts Pronova Badge */}
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
              darkMode
                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                : 'bg-green-100 text-green-700 border border-green-200'
            }`}>
              <FaCheck className="mr-1" size={10} />
              Accepts PRN
            </div>

            {/* Website Link */}
            {partner.website && (
              <a
                href={partner.website}
                target="_blank"
                rel="noopener noreferrer"
                className={`mt-3 inline-flex items-center text-xs font-medium transition-all duration-300 hover:underline ${
                  darkMode ? 'text-primary-400' : 'text-primary-600'
                }`}
              >
                Visit Website <FaExternalLinkAlt className="ml-1" size={10} />
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </FadeInWhenVisible>
  );
};

// Sector Card Component
const SectorCard = ({ sector, darkMode, delay = 0 }) => {
  return (
    <FadeInWhenVisible delay={delay}>
      <motion.div
        whileHover={{ scale: 1.02, y: -3 }}
        className={`group relative overflow-hidden rounded-xl backdrop-blur-sm border transition-all duration-300 ${
          darkMode
            ? 'bg-dark-900/60 border-primary-600/20 hover:border-primary-500/40'
            : 'bg-white/80 border-gray-200/40 hover:border-primary-300/60'
        }`}
      >
        <div className="p-6 text-center">
          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${sector.color} flex items-center justify-center text-white mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
            {sector.icon}
          </div>
          <h4 className={`text-lg font-bold mb-2 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            {sector.name}
          </h4>
          <p className={`text-sm ${
            darkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {sector.description}
          </p>
        </div>
      </motion.div>
    </FadeInWhenVisible>
  );
};

const Partners = () => {
  const { darkMode } = useTheme();

  // All 18+ partner companies accepting Pronova
  const partners = [
    {
      name: "Capimax Holdings UK",
      logo: capiMaxHoldingsLogo,
      description: "Parent company overseeing 12 global investment companies across diverse sectors.",
      sectors: ["Investments", "Finance"],
      website: "https://www.capimaxholding.com"
    },
    {
      name: "Capimax Investments USA",
      logo: capiMaxInvestmentsUSALogo,
      description: "US investment division focusing on American markets and opportunities.",
      sectors: ["Investments", "USA"],
      website: "https://www.capimaxinvestments.com"
    },
    {
      name: "Capimax Investments UK",
      logo: capiMaxInvestmentsUKLogo,
      description: "UK investment arm specializing in European markets and growth.",
      sectors: ["Investments", "UK"],
      website: "https://www.capimaxinvestments.com"
    },
    {
      name: "Capimax Investments UAE",
      logo: capiMaxInvestmentsUAELogo,
      description: "Middle East investment hub for regional growth opportunities.",
      sectors: ["Investments", "UAE"],
      website: "https://www.capimaxinvestments.com"
    },
    {
      name: "Capimax Financial UK",
      logo: capiMaxFinancialLogo,
      description: "Financial management and capital markets expertise.",
      sectors: ["Finance", "Risk"],
      website: "https://www.capimaxinvestments.com"
    },
    {
      name: "HCC International Insurance",
      logo: hccLogo,
      description: "Cyber insurance specialist for blockchain and digital assets.",
      sectors: ["Insurance", "Cyber"],
      website: "https://www.hccinternationalinsurance.com"
    },
    {
      name: "Assurax Insurance",
      logo: assuraxLogo,
      description: "Credit risk management and comprehensive asset protection.",
      sectors: ["Insurance", "Risk"],
      website: "https://assuraxinsurance.com/"
    },
    {
      name: "CIM Financial Group",
      logo: cimLogo,
      description: "Financial technology and virtual asset management solutions.",
      sectors: ["Fintech", "Assets"],
      website: "https://cimfinancialgroup.com/"
    },
    {
      name: "Profit Max British Investments",
      logo: profitmaxLogo,
      description: "High-growth investment opportunities and portfolio management.",
      sectors: ["Investments", "UK"],
      website: "https://profitmaxinvestment.co.uk/"
    },
    {
      name: "Capimax Development UK",
      logo: capiMaxDevelopmentLogo,
      description: "Construction and real estate development across the UK.",
      sectors: ["Real Estate", "Development"],
      website: "https://www.capimaxdevelopment.com"
    },
    {
      name: "TDH Developments",
      logo: tdhLogo,
      description: "Real estate development and investment solutions.",
      sectors: ["Real Estate", "Development"],
      website: "https://www.tdhdevelopments.com"
    },
    {
      name: "Nova Property Management",
      logo: novaPropertyLogo,
      description: "Luxury and commercial property management specialists.",
      sectors: ["Real Estate", "Property"],
      website: "https://novapropertymanagment.com/"
    },
    {
      name: "Elite Gate Properties",
      logo: elitGatePropertiesLogo,
      description: "Premium real estate and property services.",
      sectors: ["Real Estate", "Luxury"],
      website: "https://elitegateproperties.com/"
    },
    {
      name: "Prime Inn Hotels",
      logo: primeinnLogo,
      description: "Hotel chain with exclusive investment opportunities.",
      sectors: ["Hotels", "Hospitality"],
      website: "https://priminnhotels.com/"
    },
    {
      name: "Capimax General Trading USA",
      logo: capiMaxTradingLogo,
      description: "International trading and commercial operations.",
      sectors: ["Trading", "Commerce"],
      website: "https://www.capimaxtrading.com"
    },
    {
      name: "Capimax Precious Metals UK",
      logo: capiMaxMetalsLogo,
      description: "Investment in gold, silver, and precious minerals.",
      sectors: ["Metals", "Gold"],
      website: "https://www.capimaxmetals.com"
    },
    {
      name: "Capimax Virtual Asset UK",
      logo: capiMaxVirtualAssetLogo,
      description: "Virtual asset management and digital currency services.",
      sectors: ["Digital Assets", "Crypto"],
      website: "https://www.capimaxvirtualasset.com"
    },
    {
      name: "Capimax Fintech & Blockchain",
      logo: capiMaxFintechBlockchainLogo,
      description: "Blockchain technology and fintech innovation solutions.",
      sectors: ["Blockchain", "Fintech"],
      website: "https://www.capimaxfintech.com"
    }
  ];

  // Investment sectors available through partners
  const sectors = [
    { name: "Real Estate", icon: <FaBuilding size={24} />, description: "Property investments and development", color: "from-blue-500 to-cyan-500" },
    { name: "Gold & Metals", icon: <FaGem size={24} />, description: "Precious metals and minerals", color: "from-yellow-500 to-amber-500" },
    { name: "Hotels", icon: <FaHotel size={24} />, description: "Hospitality investments", color: "from-purple-500 to-pink-500" },
    { name: "Oil & Energy", icon: <FaChartLine size={24} />, description: "Energy sector investments", color: "from-green-500 to-emerald-500" },
    { name: "Bonds", icon: <FaCoins size={24} />, description: "Fixed income securities", color: "from-red-500 to-orange-500" },
    { name: "Insurance", icon: <FaShieldAlt size={24} />, description: "Risk protection services", color: "from-indigo-500 to-violet-500" }
  ];

  // Benefits of using Pronova with partners
  const benefits = [
    { icon: <FaPercent size={20} />, title: "Up to 5% Purchase Discount", description: "Save on products and services when paying with PRN" },
    { icon: <FaCoins size={20} />, title: "Up to 4% Fee Exemption", description: "Reduced or zero fees on investment platforms" },
    { icon: <FaHandshake size={20} />, title: "Partner Cashback", description: "Companies receive cashback, creating sustainable demand" },
    { icon: <FaGlobe size={20} />, title: "Global Access", description: "Use PRN across 18+ companies in 3 countries" }
  ];

  return (
    <>
      <Helmet>
        <title>Partners - Companies Accepting Pronova | PRN</title>
        <meta name="description" content="Discover 18+ global companies accepting Pronova (PRN) as payment. Get up to 10% discounts across real estate, gold, hotels, insurance, and more investment sectors." />
      </Helmet>

      {/* Hero Section */}
      <section className={`relative min-h-[60vh] flex items-center pt-32 pb-20 overflow-hidden ${
        darkMode
          ? 'bg-gradient-to-b from-dark-900 via-dark-900/95 to-dark-800'
          : 'bg-gradient-to-b from-white via-gray-50 to-white'
      }`}>
        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute top-20 right-10 w-96 h-96 bg-primary-500/5 dark:bg-primary-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-10 w-80 h-80 bg-secondary-500/5 dark:bg-secondary-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="container-custom relative z-10">
          <FadeInWhenVisible>
            <div className="text-center max-w-5xl mx-auto">
              {/* Badge */}
              <div className={`inline-flex items-center py-2 px-6 rounded-full backdrop-blur-sm border mb-8 ${
                darkMode
                  ? 'bg-primary-600/20 border-primary-600/30'
                  : 'bg-primary-100/60 border-primary-200/40'
              }`}>
                <FaHandshake className="mr-2 text-primary-600 dark:text-primary-400" />
                <span className={`text-sm font-medium ${
                  darkMode ? 'text-primary-400' : 'text-primary-700'
                }`}>18+ Partner Companies</span>
              </div>

              {/* Main Heading */}
              <h1 className={`text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-8 leading-tight ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Companies <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">Accepting</span><br className="hidden sm:block" />
                <span className="bg-gradient-to-r from-secondary-600 to-primary-600 bg-clip-text text-transparent">Pronova</span>
              </h1>

              {/* Subtitle */}
              <p className={`text-lg md:text-xl mb-12 max-w-3xl mx-auto leading-relaxed ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Use your PRN tokens across <span className="font-semibold text-primary-600 dark:text-primary-400">18+ global companies</span> and enjoy
                <span className="font-semibold text-secondary-600 dark:text-secondary-400"> up to 10% discounts</span> on investments, services, and products.
              </p>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
                {[
                  { number: "18+", label: "Companies" },
                  { number: "30+", label: "Sectors" },
                  { number: "10%", label: "Max Discount" },
                  { number: "3", label: "Countries" }
                ].map((stat, index) => (
                  <div key={index} className={`p-4 rounded-xl backdrop-blur-sm border ${
                    darkMode
                      ? 'bg-dark-900/60 border-primary-600/20'
                      : 'bg-white/60 border-gray-200/40'
                  }`}>
                    <div className={`text-2xl md:text-3xl font-bold ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>{stat.number}</div>
                    <div className={`text-sm ${
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </FadeInWhenVisible>
        </div>
      </section>

      {/* Benefits Section */}
      <section className={`relative py-20 ${
        darkMode ? 'bg-dark-800' : 'bg-gray-50'
      }`}>
        <div className="container-custom">
          <FadeInWhenVisible>
            <div className="text-center mb-12">
              <h2 className={`text-3xl md:text-4xl font-heading font-bold mb-4 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Benefits of <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">Using PRN</span>
              </h2>
              <p className={`text-lg max-w-2xl mx-auto ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Pay with Pronova and unlock exclusive benefits across all partner companies
              </p>
            </div>
          </FadeInWhenVisible>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <FadeInWhenVisible key={index} delay={0.1 * (index + 1)}>
                <div className={`p-6 rounded-2xl backdrop-blur-sm border text-center h-full ${
                  darkMode
                    ? 'bg-dark-900/60 border-primary-600/20'
                    : 'bg-white/80 border-gray-200/40'
                }`}>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white mx-auto mb-4`}>
                    {benefit.icon}
                  </div>
                  <h4 className={`text-lg font-bold mb-2 ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {benefit.title}
                  </h4>
                  <p className={`text-sm ${
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {benefit.description}
                  </p>
                </div>
              </FadeInWhenVisible>
            ))}
          </div>
        </div>
      </section>

      {/* Investment Sectors */}
      <section className={`relative py-20 ${
        darkMode ? 'bg-dark-900' : 'bg-white'
      }`}>
        <div className="container-custom">
          <FadeInWhenVisible>
            <div className="text-center mb-12">
              <div className={`inline-flex items-center px-6 py-2 rounded-full border mb-6 ${
                darkMode
                  ? 'bg-primary-600/20 border-primary-600/30'
                  : 'bg-primary-100/60 border-primary-200/40'
              }`}>
                <span className={`text-sm font-medium uppercase tracking-wider ${
                  darkMode ? 'text-primary-400' : 'text-primary-700'
                }`}>Investment Opportunities</span>
              </div>
              <h2 className={`text-3xl md:text-4xl font-heading font-bold mb-4 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">30+ Sectors</span> Available
              </h2>
              <p className={`text-lg max-w-3xl mx-auto ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Access diverse investment opportunities across multiple industries through our partner network
              </p>
            </div>
          </FadeInWhenVisible>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {sectors.map((sector, index) => (
              <SectorCard
                key={index}
                sector={sector}
                darkMode={darkMode}
                delay={0.1 * (index + 1)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* All Partners Grid */}
      <section className={`relative py-24 ${
        darkMode ? 'bg-dark-800' : 'bg-gray-50'
      }`}>
        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500/5 dark:bg-primary-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary-500/5 dark:bg-secondary-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="container-custom relative z-10">
          <FadeInWhenVisible>
            <div className="text-center mb-16">
              <div className={`inline-flex items-center px-6 py-2 rounded-full border mb-6 ${
                darkMode
                  ? 'bg-primary-600/20 border-primary-600/30'
                  : 'bg-primary-100/60 border-primary-200/40'
              }`}>
                <FaUsers className="w-4 h-4 mr-2 text-primary-600 dark:text-primary-400" />
                <span className={`text-sm font-medium ${
                  darkMode ? 'text-primary-400' : 'text-primary-700'
                }`}>Our Partner Network</span>
              </div>
              <h2 className={`text-4xl md:text-5xl font-heading font-bold mb-6 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                All <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">Partner Companies</span>
              </h2>
              <p className={`text-xl max-w-3xl mx-auto ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                These companies accept Pronova (PRN) as payment and offer exclusive benefits to token holders
              </p>
            </div>
          </FadeInWhenVisible>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {partners.map((partner, index) => (
              <PartnerCard
                key={index}
                partner={partner}
                darkMode={darkMode}
                delay={0.05 * (index + 1)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className={`relative py-20 ${
        darkMode ? 'bg-dark-900' : 'bg-white'
      }`}>
        <div className="container-custom">
          <FadeInWhenVisible>
            <div className="text-center mb-12">
              <h2 className={`text-3xl md:text-4xl font-heading font-bold mb-4 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                How to <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">Use PRN</span> with Partners
              </h2>
            </div>
          </FadeInWhenVisible>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: "1", title: "Buy PRN", description: "Purchase Pronova tokens during presale or on exchanges" },
              { step: "2", title: "Choose Partner", description: "Select from 18+ partner companies" },
              { step: "3", title: "Pay with PRN", description: "Use your tokens for payments or investments" },
              { step: "4", title: "Enjoy Benefits", description: "Get discounts and fee exemptions automatically" }
            ].map((item, index) => (
              <FadeInWhenVisible key={index} delay={0.1 * (index + 1)}>
                <div className="text-center relative">
                  {index < 3 && (
                    <div className={`hidden md:block absolute top-8 left-full w-full h-0.5 ${
                      darkMode ? 'bg-primary-600/30' : 'bg-primary-200'
                    }`}>
                      <FaArrowRight className={`absolute -right-2 -top-2 ${
                        darkMode ? 'text-primary-500' : 'text-primary-400'
                      }`} />
                    </div>
                  )}
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4`}>
                    {item.step}
                  </div>
                  <h4 className={`text-lg font-bold mb-2 ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {item.title}
                  </h4>
                  <p className={`text-sm ${
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {item.description}
                  </p>
                </div>
              </FadeInWhenVisible>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={`relative py-20 ${
        darkMode ? 'bg-dark-800' : 'bg-gray-50'
      }`}>
        <div className="container-custom">
          <FadeInWhenVisible>
            <div className="relative p-8 md:p-12 rounded-3xl bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600 text-white text-center overflow-hidden shadow-2xl">
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="w-full h-full" style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                }} />
              </div>

              <div className="relative z-10">
                <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
                  Start Using Pronova Today
                </h2>
                <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
                  Join the presale now and get ready to use your PRN tokens across our entire partner network with exclusive benefits.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link
                      to="/presale"
                      className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary-700 font-semibold rounded-xl hover:bg-gray-100 transition-all duration-300"
                    >
                      Join Presale
                    </Link>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link
                      to="/team"
                      className="inline-flex items-center justify-center px-8 py-4 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border border-white/30 font-semibold rounded-xl transition-all duration-300"
                    >
                      Meet The Team
                    </Link>
                  </motion.div>
                </div>
              </div>
            </div>
          </FadeInWhenVisible>
        </div>
      </section>
    </>
  );
};

export default Partners;
