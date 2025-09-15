import React from 'react';
import { motion } from 'framer-motion';
import { FaBuilding, FaGlobe, FaHandshake } from 'react-icons/fa';

// Import partner logos
import capiMaxHoldingsLogo from '../../../assets/images/logos for partner/CAPI Max Holdings UK.png';
import capiMaxInvestmentsUSALogo from '../../../assets/images/logos for partner/CAPI Max Investments USA.png';
import capiMaxInvestmentsUKLogo from '../../../assets/images/logos for partner/CAPI Max Investments UK.png';
import capiMaxInvestmentsUAELogo from '../../../assets/images/logos for partner/CAPI Max Investments UAE.png';
import capiMaxFinancialLogo from '../../../assets/images/logos for partner/CAPI Max Financial  uk.png';
import hccLogo from '../../../assets/images/logos for partner/hcc logo.png';
import assuraxLogo from '../../../assets/images/logos for partner/assurax logo-01.png';
import cimLogo from '../../../assets/images/logos for partner/cim logo.png';
import profitmaxLogo from '../../../assets/images/logos for partner/profitmax logo.png';
import tdhLogo from '../../../assets/images/logos for partner/tdh logo.png';
import novaPropertyLogo from '../../../assets/images/logos for partner/nova property logo.png';
import primeinnLogo from '../../../assets/images/logos for partner/primeinn logo.png';
import capiMaxDevelopmentLogo from '../../../assets/images/logos for partner/CAPI Max development  UK.png';
import capiMaxTradingLogo from '../../../assets/images/logos for partner/CAPI Max for general Trading  USA.png';
import capiMaxMetalsLogo from '../../../assets/images/logos for partner/CAPI Max for Investment in precious metals and minerals  UK.png';
import elitGatePropertiesLogo from '../../../assets/images/logos for partner/elitgate properties.png';

// Animation for section elements when they come into view
const FadeInWhenVisible = ({ children, delay = 0, direction = null }) => {
  const [ref, inView] = React.useState([null, false]);

  React.useEffect(() => {
    if (ref && ref.current) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            inView[1](true);
            observer.disconnect();
          }
        },
        { threshold: 0.1 }
      );
      observer.observe(ref.current);
      return () => observer.disconnect();
    }
  }, [ref]);

  return (
    <motion.div
      ref={elem => {
        ref[0] = elem;
        return elem;
      }}
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
const AnimatedShape = ({ className, delay = 0, duration = 20 }) => (
  <motion.div
    className={`shape ${className}`}
    animate={{ 
      y: [0, -30, 0],
      opacity: [0.3, 0.5, 0.3],
      scale: [1, 1.05, 1]
    }}
    transition={{ 
      duration,
      delay,
      repeat: Infinity,
      repeatType: "reverse" 
    }}
  />
);

// Enhanced Partner Card Component
const EnhancedPartnerCard = ({ name, logo, description, delay = 0 }) => {
  return (
    <FadeInWhenVisible delay={delay}>
      <div className="group bg-white dark:bg-dark-900/90 backdrop-blur-sm rounded-2xl p-6 transition-all duration-500 hover:shadow-2xl hover:scale-105 border border-gray-200 dark:border-primary-600/30 shadow-lg hover:shadow-primary-500/20 dark:hover:shadow-primary-500/40">
        {/* Logo Container */}
        <div className="mb-6 bg-white dark:bg-gray-100 rounded-xl shadow-inner p-4 flex items-center justify-center h-20 group-hover:shadow-lg transition-all duration-300">
          <img 
            src={logo} 
            alt={`${name} logo`} 
            className="max-w-full max-h-full object-contain filter drop-shadow-md"
          />
        </div>
        
        {/* Company Info */}
        <div className="text-center">
          <h3 className="text-lg font-heading font-bold mb-3 text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300">
            {name}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
            {description}
          </p>
        </div>
        
        {/* Hover Effect Indicator */}
        <div className="mt-4 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-8 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full"></div>
        </div>
      </div>
    </FadeInWhenVisible>
  );
};

const EnhancedPartnersSection = () => {
  // Partner data grouped by category
  const partnerCategories = [
    {
      category: "Investment Companies",
      icon: <FaBuilding size={24} />,
      partners: [
        {
          name: "CAPI Max Holdings UK",
          logo: capiMaxHoldingsLogo,
          description: "British-American company that owns 12 investment companies",
          delay: 0.1
        },
        {
          name: "CAPI Max Investments USA",
          logo: capiMaxInvestmentsUSALogo,
          description: "US-based investment arm specializing in American markets",
          delay: 0.15
        },
        {
          name: "CAPI Max Investments UK",
          logo: capiMaxInvestmentsUKLogo,
          description: "UK-based investment division focusing on European markets",
          delay: 0.2
        },
        {
          name: "CAPI Max Investments UAE",
          logo: capiMaxInvestmentsUAELogo,
          description: "Middle East investment division focused on regional growth",
          delay: 0.25
        },
        {
          name: "CAPI Max Development UK",
          logo: capiMaxDevelopmentLogo,
          description: "Development and construction projects across the UK",
          delay: 0.3
        },
        {
          name: "CAPI Max General Trading USA",
          logo: capiMaxTradingLogo,
          description: "General trading and commercial activities in the US market",
          delay: 0.35
        },
        {
          name: "CAPI Max Precious Metals UK",
          logo: capiMaxMetalsLogo,
          description: "Investment in precious metals, minerals, and gold",
          delay: 0.4
        }
      ]
    },
    {
      category: "Financial Services",
      icon: <FaGlobe size={24} />,
      partners: [
        {
          name: "CAPI Max Financial UK",
          logo: capiMaxFinancialLogo,
          description: "Specializing in financial management and capital markets",
          delay: 0.3
        },
        {
          name: "HCC International Insurance",
          logo: hccLogo,
          description: "Specializing in smart contracts and blockchain insurance",
          delay: 0.35
        },
        {
          name: "Assurax Insurance",
          logo: assuraxLogo,
          description: "Insurance and credit risk management for digital assets",
          delay: 0.4
        },
        {
          name: "CIM Financial Group",
          logo: cimLogo,
          description: "Financial services specializing in blockchain and virtual assets",
          delay: 0.45
        }
      ]
    },
    {
      category: "Real Estate & Properties",
      icon: <FaHandshake size={24} />,
      partners: [
        {
          name: "Profit Max British Investments",
          logo: profitmaxLogo,
          description: "Investment company focused on high-growth opportunities",
          delay: 0.5
        },
        {
          name: "TDH British Properties",
          logo: tdhLogo,
          description: "Real estate development and investment",
          delay: 0.55
        },
        {
          name: "Nova British Real Estate",
          logo: novaPropertyLogo,
          description: "Luxury and commercial property specialists",
          delay: 0.6
        },
        {
          name: "Prime Inn Hotels",
          logo: primeinnLogo,
          description: "Hotel chain offering investment opportunities",
          delay: 0.65
        },
        {
          name: "Elite Gate Properties",
          logo: elitGatePropertiesLogo,
          description: "Premium real estate and property management services",
          delay: 0.7
        }
      ]
    }
  ];

  return (
    <section id="partners" className="relative py-24 bg-gray-50 dark:bg-dark-800">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500/5 dark:bg-primary-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary-500/5 dark:bg-secondary-500/10 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container-custom">
        <FadeInWhenVisible>
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-6 py-2 rounded-full bg-gradient-to-r from-primary-500/10 to-secondary-500/10 border border-primary-500/20 mb-6">
              <div className="w-2 h-2 bg-primary-500 rounded-full mr-3 animate-pulse"></div>
              <span className="text-primary-600 dark:text-primary-400 text-sm font-semibold uppercase tracking-wider">Trusted Partners</span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6 text-gray-900 dark:text-white">
              <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">Strategic</span> Partnerships
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Pronova is backed by a powerful network of <span className="font-semibold text-primary-600 dark:text-primary-400">18 global companies</span> providing real-world utility and investment opportunities
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
                  <h3 className="text-3xl font-heading font-bold text-gray-900 dark:text-white">{category.category}</h3>
                  <div className="ml-6 flex-grow h-px bg-gradient-to-r from-primary-500/30 via-secondary-500/30 to-transparent"></div>
                </div>
              </FadeInWhenVisible>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {category.partners.map((partner, idx) => (
                  <EnhancedPartnerCard
                    key={idx}
                    name={partner.name}
                    logo={partner.logo}
                    description={partner.description}
                    delay={partner.delay}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        <FadeInWhenVisible delay={0.7}>
          <div className="mt-20 bg-gradient-to-br from-primary-500/5 via-white dark:via-dark-900 to-secondary-500/5 backdrop-blur-sm rounded-3xl border border-primary-500/10 dark:border-primary-500/20 p-12 text-center shadow-xl">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-8 bg-gradient-to-br from-primary-500 to-secondary-500 text-white shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10">
                <path fillRule="evenodd" d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813A3.75 3.75 0 007.466 7.89l.813-2.846A.75.75 0 019 4.5zM18 1.5a.75.75 0 01.728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 010 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 01-1.456 0l-.258-1.036a2.625 2.625 0 00-1.91-1.91l-1.036-.258a.75.75 0 010-1.456l1.036-.258a2.625 2.625 0 001.91-1.91l.258-1.036A.75.75 0 0118 1.5zM16.5 15a.75.75 0 01.712.513l.394 1.183c.15.447.5.799.948.948l1.183.395a.75.75 0 010 1.422l-1.183.395c-.447.15-.799.5-.948.948l-.395 1.183a.75.75 0 01-1.422 0l-.395-1.183a1.5 1.5 0 00-.948-.948l-1.183-.395a.75.75 0 010-1.422l1.183-.395c.447-.15.799-.5.948-.948l.395-1.183A.75.75 0 0116.5 15z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-3xl md:text-4xl font-heading font-bold mb-6">
              <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">Partnership Benefits</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-8">
              <div className="bg-white/80 dark:bg-dark-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-primary-600/20 shadow-lg">
                <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">🏢 Investment Opportunities</h4>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Access real estate, gold, metals, hotels, oil, bonds, and insurance investments through our partner network with exclusive advantages.
                </p>
              </div>
              
              <div className="bg-white/80 dark:bg-dark-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-primary-600/20 shadow-lg">
                <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">💰 Mutual Benefits</h4>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Customers receive up to 10% discount when paying with Pronova, while partners get cashback rewards, creating a sustainable ecosystem.
                </p>
              </div>
            </div>
            
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
              ✨ 18 Global Partners & Growing
            </div>
          </div>
        </FadeInWhenVisible>
      </div>
    </section>
  );
};

export default EnhancedPartnersSection;