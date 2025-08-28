import React from 'react';
import { motion } from 'framer-motion';
import { FaBuilding, FaGlobe, FaHandshake, FaShieldAlt, FaGem, FaHotel, FaChartLine, FaUsers, FaAward, FaCog } from 'react-icons/fa';
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

// Enhanced Animation Hook
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

// Animated background shape component
const AnimatedShape = ({ className, delay = 0, duration = 20, darkMode }) => (
  <motion.div
    className={`${className} ${
      darkMode 
        ? 'bg-gradient-to-r from-primary-500/12 via-primary-400/8 to-primary-300/4' 
        : 'bg-gradient-to-r from-primary-200/25 via-primary-100/15 to-primary-50/8'
    } blur-[80px] pointer-events-none`}
    animate={{ 
      y: [0, -30, 0],
      opacity: [0.4, 0.6, 0.4],
      scale: [1, 1.03, 1]
    }}
    transition={{ 
      duration,
      delay,
      repeat: Infinity,
      repeatType: "reverse" 
    }}
  />
);

// Enhanced Team Member Card Component
const EnhancedTeamMemberCard = ({ name, role, description, icon, logo, website, delay = 0, darkMode }) => {
  return (
    <FadeInWhenVisible delay={delay}>
      <motion.div
        whileHover={{ scale: 1.02, y: -5 }}
        className={`group relative overflow-hidden rounded-2xl backdrop-blur-sm border transition-all duration-500 hover:shadow-2xl ${
          darkMode 
            ? 'bg-dark-900/90 border-primary-600/30 hover:border-primary-500/50 hover:shadow-primary-500/20' 
            : 'bg-white/90 border-gray-200/50 hover:border-primary-300/70 hover:shadow-primary-300/20'
        }`}
      >
        {/* Background gradient */}
        <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
          darkMode 
            ? 'bg-gradient-to-br from-primary-600/5 via-transparent to-secondary-600/5'
            : 'bg-gradient-to-br from-primary-100/30 via-transparent to-secondary-100/30'
        }`}></div>
        
        <div className="relative p-8">
          {/* Logo Container - Enhanced Size */}
          {logo ? (
            <div className="mb-6 flex justify-center">
              <div className={`relative p-6 rounded-2xl shadow-inner transition-all duration-300 group-hover:shadow-lg h-24 w-full flex items-center justify-center ${
                darkMode ? 'bg-white/95' : 'bg-white'
              }`}>
                <img 
                  src={logo} 
                  alt={`${name} logo`} 
                  className="max-w-full max-h-full object-contain filter drop-shadow-md group-hover:drop-shadow-lg transition-all duration-300"
                />
              </div>
            </div>
          ) : (
            <div className="mb-6 flex justify-center">
              <div className={`relative p-4 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 text-white shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative text-2xl">
                  {icon}
                </div>
              </div>
            </div>
          )}
          
          {/* Company Info */}
          <div className="text-center">
            <h3 className={`text-xl font-heading font-bold mb-3 transition-colors duration-300 ${
              darkMode 
                ? 'text-white group-hover:text-primary-400'
                : 'text-gray-900 group-hover:text-primary-600'
            }`}>
              {name}
            </h3>
            <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-4 ${
              darkMode
                ? 'bg-primary-600/20 text-primary-400 border border-primary-600/30'
                : 'bg-primary-100 text-primary-700 border border-primary-200'
            }`}>
              {role}
            </div>
            <p className={`text-sm leading-relaxed mb-4 ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              {description}
            </p>
            
            {/* Website Link */}
            {website && (
              <a 
                href={website} 
                target="_blank" 
                rel="noopener noreferrer"
                className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105 ${
                  darkMode
                    ? 'bg-primary-600/20 text-primary-400 border border-primary-600/30 hover:bg-primary-600/30'
                    : 'bg-primary-100 text-primary-700 border border-primary-200 hover:bg-primary-200'
                }`}
              >
                🌐 Visit Website
              </a>
            )}
          </div>
          
          {/* Hover Effect Indicator */}
          <div className="mt-6 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-12 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full"></div>
          </div>
        </div>
      </motion.div>
    </FadeInWhenVisible>
  );
};

// Enhanced Partner Card Component
const EnhancedPartnerCard = ({ name, logo, description, website, delay = 0, darkMode }) => {
  return (
    <FadeInWhenVisible delay={delay}>
      <motion.div
        whileHover={{ scale: 1.02, y: -3 }}
        className={`group relative overflow-hidden rounded-xl backdrop-blur-sm border transition-all duration-300 hover:shadow-xl ${
          darkMode 
            ? 'bg-dark-900/80 border-primary-600/20 hover:border-primary-500/40 hover:shadow-primary-500/20' 
            : 'bg-white/80 border-gray-200/40 hover:border-primary-300/60 hover:shadow-primary-300/20'
        }`}
      >
        <div className="p-6">
          {/* Logo Container - Enhanced Size for Better Visibility */}
          <div className={`mb-4 rounded-xl shadow-inner p-8 flex items-center justify-center h-28 transition-all duration-300 group-hover:shadow-lg ${
            darkMode ? 'bg-white/95' : 'bg-white'
          }`}>
            <img 
              src={logo} 
              alt={`${name} logo`} 
              className="max-w-full max-h-full object-contain filter drop-shadow-md group-hover:drop-shadow-lg transition-all duration-300"
            />
          </div>
          
          {/* Company Info */}
          <div className="text-center">
            <h4 className={`text-sm font-semibold mb-2 transition-colors duration-300 line-clamp-2 ${
              darkMode 
                ? 'text-white group-hover:text-primary-400'
                : 'text-gray-900 group-hover:text-primary-600'
            }`}>
              {name}
            </h4>
            <p className={`text-xs leading-relaxed mb-3 ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {description}
            </p>
            
            {/* Website Link */}
            {website && (
              <a 
                href={website} 
                target="_blank" 
                rel="noopener noreferrer"
                className={`inline-flex items-center px-3 py-1 rounded-md text-xs font-medium transition-all duration-300 hover:scale-105 ${
                  darkMode
                    ? 'bg-primary-600/20 text-primary-400 border border-primary-600/30 hover:bg-primary-600/30'
                    : 'bg-primary-100 text-primary-700 border border-primary-200 hover:bg-primary-200'
                }`}
              >
                🔗 Visit
              </a>
            )}
          </div>
          
          {/* Hover Effect */}
          <div className="mt-3 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-6 h-0.5 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full"></div>
          </div>
        </div>
      </motion.div>
    </FadeInWhenVisible>
  );
};

const Team = () => {
  const { darkMode } = useTheme();
  
  // Core Team data with enhanced structure
  const coreTeam = [
    {
      name: "CAPI Max Holdings UK",
      role: "Lead Organization",
      description: "British-American company that owns 12 global investment companies across diverse sectors including finance, real estate, and precious metals.",
      icon: <FaBuilding />,
      logo: capiMaxHoldingsLogo,
      website: "https://www.capimaxholding.com",
      delay: 0.1
    },
    {
      name: "CAPI Max Financial Management",
      role: "Risk & Capital Markets",
      description: "Specializing in financial risk management, capital markets oversight, and strategic investment planning across global markets.",
      icon: <FaChartLine />,
      logo: capiMaxFinancialLogo,
      website: "https://www.capimaxinvestments.com",
      delay: 0.15
    },
    {
      name: "HCC Insurance & Risk",
      role: "Blockchain Security",
      description: "Leading provider of cyber insurance specializing in digital currencies, smart contracts, and blockchain technology protection.",
      icon: <FaShieldAlt />,
      logo: hccLogo,
      website: "https://www.hccinternationalinsurance.com",
      delay: 0.2
    },
    {
      name: "Assurax Insurance",
      role: "Credit Risk Management",
      description: "Comprehensive insurance and credit risk management for digital assets, providing protection against cyber threats and business interruption.",
      icon: <FaAward />,
      logo: assuraxLogo,
      website: "https://assuraxinsurance.com/",
      delay: 0.25
    },
    {
      name: "CIM Financial Group",
      role: "Financial Technology",
      description: "Advanced financial services specializing in smart contracts, blockchain technology, and virtual asset management solutions.",
      icon: <FaCog />,
      logo: cimLogo,
      website: "https://cimfinancialgroup.com/",
      delay: 0.3
    },
    {
      name: "Profit Max British Investments",
      role: "Investment Strategy",
      description: "Focusing on high-growth investment opportunities and strategic portfolio management across global markets.",
      icon: <FaUsers />,
      logo: profitmaxLogo,
      website: "https://profitmaxinvestment.co.uk/",
      delay: 0.35
    }
  ];
  
  // Partner data organized by categories
  const partnerCategories = [
    {
      category: "Investment & Finance",
      icon: <FaChartLine size={24} />,
      description: "Leading investment firms providing diverse financial services",
      partners: [
        {
          name: "CAPI Max Holdings UK",
          logo: capiMaxHoldingsLogo,
          description: "Parent company overseeing global investment operations",
          website: "https://www.capimaxholding.com",
          delay: 0.1
        },
        {
          name: "CAPI Max Investments USA",
          logo: capiMaxInvestmentsUSALogo,
          description: "US investment division focusing on American markets",
          website: "https://www.capimaxinvestments.com",
          delay: 0.15
        },
        {
          name: "CAPI Max Investments UK",
          logo: capiMaxInvestmentsUKLogo,
          description: "UK investment arm specializing in European markets",
          website: "https://www.capimaxinvestments.com",
          delay: 0.2
        },
        {
          name: "CAPI Max Investments UAE",
          logo: capiMaxInvestmentsUAELogo,
          description: "Middle East investment hub for regional growth",
          website: "https://www.capimaxinvestments.com",
          delay: 0.25
        },
        {
          name: "CAPI Max Financial UK",
          logo: capiMaxFinancialLogo,
          description: "Financial management and capital markets expertise",
          website: "https://www.capimaxinvestments.com",
          delay: 0.3
        },
        {
          name: "Profit Max British Investments",
          logo: profitmaxLogo,
          description: "High-growth investment opportunities and portfolio management",
          website: "https://profitmaxinvestment.co.uk/",
          delay: 0.35
        }
      ]
    },
    {
      category: "Insurance & Risk Management",
      icon: <FaShieldAlt size={24} />,
      description: "Comprehensive protection for digital assets and operations",
      partners: [
        {
          name: "HCC International Insurance",
          logo: hccLogo,
          description: "Cyber insurance specialist for blockchain and digital assets",
          website: "https://www.hccinternationalinsurance.com",
          delay: 0.4
        },
        {
          name: "Assurax Insurance",
          logo: assuraxLogo,
          description: "Credit risk management and asset protection services",
          website: "https://assuraxinsurance.com/",
          delay: 0.45
        },
        {
          name: "CIM Financial Group",
          logo: cimLogo,
          description: "Financial technology and virtual asset management",
          website: "https://cimfinancialgroup.com/",
          delay: 0.5
        }
      ]
    },
    {
      category: "Real Estate & Development",
      icon: <FaBuilding size={24} />,
      description: "Premium property development and investment opportunities",
      partners: [
        {
          name: "CAPI Max Development UK",
          logo: capiMaxDevelopmentLogo,
          description: "Construction and development projects across the UK",
          website: "https://www.capimaxdevelopment.com",
          delay: 0.55
        },
        {
          name: "TDH Developments",
          logo: tdhLogo,
          description: "Real estate development and investment solutions",
          website: "https://www.tdhdevelopments.com",
          delay: 0.6
        },
        {
          name: "Nova Property Management",
          logo: novaPropertyLogo,
          description: "Luxury and commercial property specialists",
          website: "https://novapropertymanagment.com/",
          delay: 0.65
        },
        {
          name: "Elite Gate Properties",
          logo: elitGatePropertiesLogo,
          description: "Premium real estate and property management services",
          website: "https://elitegateproperties.com/",
          delay: 0.7
        }
      ]
    },
    {
      category: "Trading & Precious Metals",
      icon: <FaGem size={24} />,
      description: "Global trading operations and precious metals investment",
      partners: [
        {
          name: "CAPI Max General Trading USA",
          logo: capiMaxTradingLogo,
          description: "International trading and commercial operations",
          website: "https://www.capimaxtrading.com",
          delay: 0.75
        },
        {
          name: "CAPI Max Precious Metals UK",
          logo: capiMaxMetalsLogo,
          description: "Investment in gold, silver, and precious minerals",
          website: "https://www.capimaxmetals.com",
          delay: 0.8
        }
      ]
    },
    {
      category: "Hospitality & Services",
      icon: <FaHotel size={24} />,
      description: "Hotel and hospitality investment opportunities",
      partners: [
        {
          name: "Prime Inn Hotels",
          logo: primeinnLogo,
          description: "Hotel chain offering exclusive investment opportunities",
          website: "https://priminnhotels.com/",
          delay: 0.85
        }
      ]
    }
  ];

  return (
    <>
      <Helmet>
        <title>Team & Partners - Pronova</title>
        <meta name="description" content="Meet the powerhouse team and strategic partners behind Pronova - 18 global companies providing real-world utility and investment opportunities." />
      </Helmet>

      {/* Add custom CSS for enhanced animations */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes float {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-20px);
            }
          }
          
          @keyframes pulse-slow {
            0%, 100% {
              opacity: 1;
            }
            50% {
              opacity: 0.7;
            }
          }
          
          @keyframes spin-slow {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
          
          @keyframes spin-slow-reverse {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(-360deg);
            }
          }
          
          .animate-float {
            animation: float 6s ease-in-out infinite;
          }
          
          .animate-pulse-slow {
            animation: pulse-slow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          }
          
          .animate-spin-slow {
            animation: spin-slow 20s linear infinite;
          }
          
          .animate-spin-slow-reverse {
            animation: spin-slow-reverse 15s linear infinite;
          }
          
          .line-clamp-2 {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
          
          .shadow-neon {
            box-shadow: 0 0 20px rgba(92, 39, 254, 0.3);
          }
          
          .shadow-neon-strong {
            box-shadow: 0 0 30px rgba(92, 39, 254, 0.4), 0 0 60px rgba(92, 39, 254, 0.2);
          }
        `
      }} />

      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-primary-500/5 dark:bg-primary-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary-500/5 dark:bg-secondary-500/10 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-primary-500/3 dark:from-primary-500/5 to-transparent rounded-full" />
      </div>

      {/* Enhanced Hero Section */}
      <section className={`relative min-h-[70vh] flex items-center pt-32 pb-20 overflow-hidden ${
        darkMode 
          ? 'bg-gradient-to-b from-dark-900 via-dark-900/95 to-dark-800' 
          : 'bg-white'
      }`}>
        {/* Background elements */}
        <div className="absolute top-0 left-0 w-full h-full z-0">
          <div className={`absolute top-0 left-0 w-full h-full opacity-30 ${
            darkMode 
              ? 'bg-gradient-to-br from-primary-900/20 via-transparent to-secondary-900/10' 
              : 'bg-gradient-to-br from-primary-50/10 via-transparent to-secondary-50/10'
          }`}></div>
          
          {/* Animated Background Shapes */}
          <AnimatedShape 
            className="absolute rounded-full w-[400px] h-[400px] top-[10%] right-[20%]" 
            darkMode={darkMode}
            duration={25}
            delay={0}
          />
          <AnimatedShape 
            className="absolute rounded-full w-[300px] h-[300px] bottom-[20%] left-[15%]" 
            darkMode={darkMode}
            duration={30}
            delay={5}
          />
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
                <div className="w-2 h-2 bg-primary-500 rounded-full mr-3 animate-pulse"></div>
                <span className={`text-sm font-medium ${
                  darkMode ? 'text-primary-400' : 'text-primary-700'
                }`}>18 Global Partners</span>
              </div>
              
              {/* Main Heading */}
              <h1 className={`text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-heading font-bold mb-8 leading-tight ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Meet Our <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">Powerhouse</span><br className="hidden sm:block" />
                Team & <span className="bg-gradient-to-r from-secondary-600 to-primary-600 bg-clip-text text-transparent">Partners</span>
              </h1>
              
              {/* Subtitle */}
              <p className={`text-lg md:text-xl xl:text-2xl mb-12 max-w-4xl mx-auto leading-relaxed ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Pronova is powered by a robust ecosystem of <span className="font-semibold text-primary-600 dark:text-primary-400">established global companies</span> and <span className="font-semibold text-secondary-600 dark:text-secondary-400">industry experts</span>, providing real-world utility and investment opportunities across multiple sectors.
              </p>
              
              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                {[
                  { number: "18+", label: "Global Partners", icon: "🤝" },
                  { number: "60+", label: "Business Fields", icon: "🌐" },
                  { number: "12", label: "Investment Companies", icon: "🏢" },
                  { number: "10%", label: "Partner Discounts", icon: "💰" }
                ].map((stat, index) => (
                  <FadeInWhenVisible key={index} delay={0.1 * (index + 1)}>
                    <div className={`p-6 rounded-2xl backdrop-blur-sm border transition-all duration-300 hover:scale-105 ${
                      darkMode 
                        ? 'bg-dark-900/60 border-primary-600/20 hover:border-primary-500/40' 
                        : 'bg-white/60 border-gray-200/40 hover:border-primary-300/60'
                    }`}>
                      <div className="text-3xl mb-2">{stat.icon}</div>
                      <div className={`text-2xl md:text-3xl font-heading font-bold mb-1 ${
                        darkMode ? 'text-white' : 'text-gray-900'
                      }`}>{stat.number}</div>
                      <div className={`text-sm ${
                        darkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>{stat.label}</div>
                    </div>
                  </FadeInWhenVisible>
                ))}
              </div>
            </div>
          </FadeInWhenVisible>
        </div>
        
        {/* Wave separator */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className={`w-full h-16 ${
            darkMode ? 'text-dark-800' : 'text-gray-50'
          }`}>
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.27C57.71,118.14,136.14,104.9,187.95,88.38Z" fill="currentColor"></path>
          </svg>
        </div>
      </section>

      {/* Core Team Section */}
      <section className={`relative py-24 ${
        darkMode ? 'bg-dark-800' : 'bg-gray-50'
      }`}>
        <div className="container-custom">
          <FadeInWhenVisible>
            <div className="text-center mb-20">
              <div className={`inline-flex items-center px-6 py-2 rounded-full border mb-6 ${
                darkMode 
                  ? 'bg-primary-600/20 border-primary-600/30' 
                  : 'bg-primary-100/60 border-primary-200/40'
              }`}>
                <FaUsers className="w-4 h-4 mr-2 text-primary-600 dark:text-primary-400" />
                <span className={`text-sm font-medium ${
                  darkMode ? 'text-primary-400' : 'text-primary-700'
                }`}>Core Leadership</span>
              </div>
              <h2 className={`text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">Executive</span> Team
              </h2>
              <p className={`text-xl max-w-4xl mx-auto leading-relaxed ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                The companies and organizations leading the Pronova project with expertise in finance, blockchain, and global investments
              </p>
            </div>
          </FadeInWhenVisible>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {coreTeam.map((member, index) => (
              <EnhancedTeamMemberCard
                key={index}
                name={member.name}
                role={member.role}
                description={member.description}
                icon={member.icon}
                logo={member.logo}
                website={member.website}
                delay={member.delay}
                darkMode={darkMode}
              />
            ))}
          </div>

          {/* Team Structure Info */}
          <FadeInWhenVisible delay={0.5}>
            <div className={`mt-20 backdrop-blur-sm border rounded-3xl p-8 md:p-12 shadow-xl ${
              darkMode 
                ? 'bg-dark-900/80 border-primary-600/20' 
                : 'bg-white/80 border-gray-200/40'
            }`}>
              <div className="text-center mb-12">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 bg-gradient-to-br from-primary-500 to-secondary-500 text-white shadow-lg`}>
                  <FaCog className="w-8 h-8" />
                </div>
                <h3 className={`text-3xl md:text-4xl font-heading font-bold mb-4 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">Governance</span> Structure
                </h3>
                <p className={`text-lg leading-relaxed max-w-3xl mx-auto ${
                  darkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Pronova's team, companies, diversity, and success are managed by teams, groups, companies, and entities. We operate with distributed responsibilities, powers, and control across multiple organizations.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    title: "Supervisory Board",
                    icon: <FaShieldAlt className="w-6 h-6" />,
                    description: "A team composed of CAPI Max for Financial and Risk Management, Cryptocurrencies, HCC Insurance & Risk, CIM Financial, and Assurax Risk Assurance."
                  },
                  {
                    title: "Advisory Board",
                    icon: <FaUsers className="w-6 h-6" />,
                    description: "Includes HCC Insurance & Credit Risk Company, CAPIMax Risk Management Company, and CIM Finance providing strategic guidance."
                  },
                  {
                    title: "Management Team",
                    icon: <FaBuilding className="w-6 h-6" />,
                    description: "Led by CAPIMAX Holdings UK with support from international branches including CAPIMAX Investments United States."
                  }
                ].map((board, index) => (
                  <FadeInWhenVisible key={index} delay={0.6 + (index * 0.1)}>
                    <div className={`p-6 rounded-2xl backdrop-blur-sm border transition-all duration-300 hover:scale-105 ${
                      darkMode 
                        ? 'bg-dark-800/60 border-primary-600/10 hover:border-primary-500/30' 
                        : 'bg-white/60 border-gray-200/40 hover:border-primary-300/60'
                    }`}>
                      <div className={`p-3 rounded-xl mb-4 bg-gradient-to-br from-primary-500 to-secondary-500 text-white inline-flex`}>
                        {board.icon}
                      </div>
                      <h4 className={`text-xl font-semibold mb-3 ${
                        darkMode ? 'text-white' : 'text-gray-900'
                      }`}>{board.title}</h4>
                      <p className={`text-sm leading-relaxed ${
                        darkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {board.description}
                      </p>
                    </div>
                  </FadeInWhenVisible>
                ))}
              </div>
            </div>
          </FadeInWhenVisible>
        </div>
      </section>

      {/* Strategic Partners Section */}
      <section className={`relative py-24 ${
        darkMode ? 'bg-dark-900' : 'bg-white'
      }`}>
        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500/5 dark:bg-primary-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary-500/5 dark:bg-secondary-500/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container-custom relative z-10">
          <FadeInWhenVisible>
            <div className="text-center mb-20">
              <div className={`inline-flex items-center px-6 py-2 rounded-full border mb-6 ${
                darkMode 
                  ? 'bg-primary-600/20 border-primary-600/30' 
                  : 'bg-primary-100/60 border-primary-200/40'
              }`}>
                <div className="w-2 h-2 bg-primary-500 rounded-full mr-3 animate-pulse"></div>
                <span className={`text-sm font-medium uppercase tracking-wider ${
                  darkMode ? 'text-primary-400' : 'text-primary-700'
                }`}>Trusted Partners</span>
              </div>
              <h2 className={`text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">Strategic</span> Partnerships
              </h2>
              <p className={`text-xl max-w-4xl mx-auto leading-relaxed ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Pronova is backed by a powerful network of <span className={`font-semibold ${
                  darkMode ? 'text-primary-400' : 'text-primary-600'
                }`}>18 global companies</span> providing real-world utility and investment opportunities
              </p>
            </div>
          </FadeInWhenVisible>

          <div className="space-y-16">
            {partnerCategories.map((category, index) => (
              <div key={index} className="mb-12">
                <FadeInWhenVisible delay={0.1 * index}>
                  <div className="flex items-center mb-12">
                    <div className="p-4 bg-gradient-to-br from-primary-500 to-secondary-500 text-white rounded-xl mr-6 shadow-lg">
                      {category.icon}
                    </div>
                    <div className="flex-grow">
                      <h3 className={`text-3xl font-heading font-bold mb-2 ${
                        darkMode ? 'text-white' : 'text-gray-900'
                      }`}>{category.category}</h3>
                      <p className={`text-sm ${
                        darkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>{category.description}</p>
                    </div>
                    <div className={`ml-6 flex-grow h-px bg-gradient-to-r from-primary-500/30 via-secondary-500/30 to-transparent`}></div>
                  </div>
                </FadeInWhenVisible>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                  {category.partners.map((partner, idx) => (
                    <EnhancedPartnerCard
                      key={idx}
                      name={partner.name}
                      logo={partner.logo}
                      description={partner.description}
                      website={partner.website}
                      delay={partner.delay}
                      darkMode={darkMode}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partnership Benefits Section */}
      <section className={`relative py-24 ${
        darkMode ? 'bg-dark-800' : 'bg-gray-50'
      }`}>
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <FadeInWhenVisible direction="left">
              <h2 className={`text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-6 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Partnership<br />
                <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                  Benefits
                </span>
              </h2>
              <div className={`text-lg leading-relaxed space-y-6 ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                <p>
                  Our strategic partnerships create a powerful ecosystem that benefits all participants in the Pronova network.
                </p>
                <p>
                  Partners offer customers up to 10% discount when paying in Pronova, while companies receive cashback, creating a sustainable economic model.
                </p>
                <p>
                  These agreements are registered on the companies' official websites and have already entered into force, providing immediate utility for Pronova token holders.
                </p>
              </div>
            </FadeInWhenVisible>

            <FadeInWhenVisible direction="right" delay={0.2}>
              <div className={`backdrop-blur-sm border rounded-3xl p-8 shadow-xl ${
                darkMode 
                  ? 'bg-dark-900/80 border-primary-600/20' 
                  : 'bg-white/80 border-gray-200/40'
              }`}>
                <h3 className={`text-2xl font-heading font-bold mb-8 text-center ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  How Our Partnership Network Benefits You
                </h3>
                <div className="space-y-6">
                  {[
                    {
                      emoji: "🏢",
                      title: "Investment Opportunities",
                      description: "Access real estate, gold, metals, hotels, oil, bonds, and insurance investments through our partner network with exclusive advantages."
                    },
                    {
                      emoji: "💰",
                      title: "Mutual Benefits",
                      description: "Customers receive up to 10% discount when paying with Pronova, while partners get cashback rewards, creating a sustainable ecosystem."
                    },
                    {
                      emoji: "🛡️",
                      title: "Insurance Protection",
                      description: "Comprehensive cyber insurance and risk protection for digital assets through our specialized insurance partners."
                    },
                    {
                      emoji: "🌍",
                      title: "Global Network",
                      description: "Access to investment opportunities across multiple countries and sectors through our international partner network."
                    }
                  ].map((benefit, index) => (
                    <FadeInWhenVisible key={index} delay={0.3 + (index * 0.1)}>
                      <div className="flex items-start">
                        <div className="text-3xl mr-4 mt-1">{benefit.emoji}</div>
                        <div>
                          <h4 className={`text-lg font-semibold mb-2 ${
                            darkMode ? 'text-white' : 'text-gray-900'
                          }`}>{benefit.title}</h4>
                          <p className={`text-sm leading-relaxed ${
                            darkMode ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            {benefit.description}
                          </p>
                        </div>
                      </div>
                    </FadeInWhenVisible>
                  ))}
                </div>
              </div>
            </FadeInWhenVisible>
          </div>
        </div>
      </section>

      {/* Risk Protection Section */}
      <section className={`relative py-24 ${
        darkMode ? 'bg-dark-900' : 'bg-white'
      }`}>
        <div className="container-custom">
          <FadeInWhenVisible>
            <div className="text-center mb-16">
              <h2 className={`text-4xl md:text-5xl font-heading font-bold mb-6 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Risk Insurance & <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">Asset Protection</span>
              </h2>
              <p className={`text-xl max-w-3xl mx-auto ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Our partnership with insurance companies provides comprehensive protection
              </p>
            </div>
          </FadeInWhenVisible>

          <FadeInWhenVisible delay={0.2}>
            <div className={`backdrop-blur-sm border rounded-3xl p-8 md:p-12 shadow-xl ${
              darkMode 
                ? 'bg-dark-900/80 border-primary-600/20' 
                : 'bg-white/80 border-gray-200/40'
            }`}>
              <p className={`text-lg mb-8 text-center leading-relaxed ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                HCC and Assurax have been contracted to insure digital assets and currencies to provide protection and financial support in the event of data breaches, cyber attacks, cyber threats, business interruption coverage resulting from cyber incidents, and legal and regulatory expenses and fines.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    title: "Data Security",
                    icon: <FaShieldAlt className="w-8 h-8" />,
                    features: [
                      "Protection against data breaches",
                      "Regular security assessments",
                      "Data encryption standards"
                    ]
                  },
                  {
                    title: "Cyber Protection",
                    icon: <FaCog className="w-8 h-8" />,
                    features: [
                      "Safeguards against cyber attacks",
                      "Continuous monitoring",
                      "Rapid incident response"
                    ]
                  },
                  {
                    title: "Business Continuity",
                    icon: <FaAward className="w-8 h-8" />,
                    features: [
                      "Coverage for business interruption",
                      "Legal and regulatory expense coverage",
                      "Risk management consulting"
                    ]
                  }
                ].map((protection, index) => (
                  <FadeInWhenVisible key={index} delay={0.4 + (index * 0.1)}>
                    <div className={`p-6 rounded-2xl backdrop-blur-sm border ${
                      darkMode 
                        ? 'bg-dark-800/60 border-primary-600/10' 
                        : 'bg-white/60 border-gray-200/40'
                    }`}>
                      <div className="flex items-center mb-4">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 text-white mr-4">
                          {protection.icon}
                        </div>
                        <h4 className={`text-lg font-semibold ${
                          darkMode ? 'text-white' : 'text-gray-900'
                        }`}>{protection.title}</h4>
                      </div>
                      <ul className="space-y-3">
                        {protection.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="text-green-500 mr-2 mt-1">✓</span>
                            <span className={`text-sm ${
                              darkMode ? 'text-gray-400' : 'text-gray-600'
                            }`}>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </FadeInWhenVisible>
                ))}
              </div>

              <div className="mt-8 text-center">
                <p className={`text-sm ${
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  View the Insurance Documents: <a href="#" className="text-primary-600 dark:text-primary-400 font-medium hover:underline">
                    HCC International Insurance
                  </a> | <a href="#" className="text-primary-600 dark:text-primary-400 font-medium hover:underline">
                    Assurax Insurance
                  </a>
                </p>
              </div>
            </div>
          </FadeInWhenVisible>
        </div>
      </section>

      {/* CTA Section */}
      <section className={`relative py-24 ${
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
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-6">
                  Join the Pronova Revolution
                </h2>
                <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto opacity-90 leading-relaxed">
                  Be part of the future of finance. Contribute to shaping the next generation 
                  of cryptocurrency integration with traditional business practices.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-6">
                  <motion.a 
                    href="/#presale" 
                    className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary-700 font-semibold rounded-xl hover:bg-gray-100 transition-all duration-300 shadow-lg"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    🚀 Join Presale
                  </motion.a>
                  <motion.a 
                    href="/whitepaper" 
                    className="inline-flex items-center justify-center px-8 py-4 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border border-white/30 font-semibold rounded-xl transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    📄 Read Whitepaper
                  </motion.a>
                </div>
              </div>
            </div>
          </FadeInWhenVisible>
        </div>
      </section>
    </>
  );
};

export default Team;