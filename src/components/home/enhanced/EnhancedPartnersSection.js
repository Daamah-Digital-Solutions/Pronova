import React from 'react';
import { motion } from 'framer-motion';
import { FaBuilding, FaHandshake, FaStar, FaUsers } from 'react-icons/fa';

// Import partner logos (v2 corporate structure)
import hccLogo from '../../../assets/images/logos for partner/hcc logo.png';
import assuraxLogo from '../../../assets/images/logos for partner/assurax logo-01.png';
import cimLogo from '../../../assets/images/logos for partner/cim logo.png';
import primeinnLogo from '../../../assets/images/logos for partner/primeinn logo.png';
import elitGatePropertiesLogo from '../../../assets/images/logos for partner/elitgate properties.png';
import capiMaxVirtualAssetLogo from '../../../assets/images/logos for partner/capi max  Virtual Asset uk dark .png';
import capiMaxFintechBlockchainLogo from '../../../assets/images/logos for partner/capi max  Fintech and Blockchain uk dark  copy.png';
import novaDigitalFinanceLogo from '../../../assets/images/logos for partner/novadf-logo.png';
import capimaxGroupLogo from '../../../assets/images/logos for partner/capimax-group-logo.png';
import capiMaxTokenizationLogo from '../../../assets/images/logos for partner/capimax logos png/dark/capi max all versions logos-tokenization dark.png';

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

// Main Featured Partner Card Component (Larger and more prominent)
const FeaturedPartnerCard = ({ name, logo, description, delay = 0 }) => {
  return (
    <FadeInWhenVisible delay={delay}>
      <div className="group relative overflow-hidden bg-gradient-to-br from-white via-white to-primary-50/30 dark:from-dark-900 dark:via-dark-900 dark:to-primary-900/20 backdrop-blur-sm rounded-3xl p-8 transition-all duration-700 hover:shadow-2xl hover:shadow-primary-500/25 hover:scale-[1.02] border-2 border-primary-200/30 dark:border-primary-600/30 hover:border-primary-400/60 dark:hover:border-primary-500/60">

        {/* Decorative Background Elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full blur-3xl transform translate-x-16 -translate-y-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-secondary-500 to-primary-500 rounded-full blur-2xl transform -translate-x-12 translate-y-12"></div>
        </div>

        {/* Logo Container - Larger for featured partners */}
        <div className="relative mb-8 bg-white dark:bg-gray-50 rounded-2xl shadow-inner p-8 flex items-center justify-center h-32 group-hover:shadow-lg transition-all duration-500 border border-gray-100 dark:border-gray-200">
          <img
            src={logo}
            alt={`${name} logo`}
            className="max-w-full max-h-full object-contain filter drop-shadow-lg group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Company Info */}
        <div className="relative text-center">
          <h3 className="text-2xl font-heading font-bold mb-4 text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300">
            {name}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed mb-6">
            {description}
          </p>

          {/* Call to Action */}
          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-500/10 to-secondary-500/10 hover:from-primary-500/20 hover:to-secondary-500/20 border border-primary-300/30 dark:border-primary-500/30 text-primary-700 dark:text-primary-300 rounded-full font-semibold text-sm transition-all duration-300 group-hover:scale-105">
            <FaHandshake className="w-4 h-4 mr-2" />
            Strategic Partner
          </div>
        </div>

        {/* Enhanced Hover Effect */}
        <div className="mt-8 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-16 h-1 bg-gradient-to-r from-primary-500 via-secondary-500 to-primary-500 rounded-full"></div>
        </div>
      </div>
    </FadeInWhenVisible>
  );
};

// Supporting Partner Card Component (Smaller and more compact)
const SupportingPartnerCard = ({ name, logo, description, delay = 0 }) => {
  return (
    <FadeInWhenVisible delay={delay}>
      <div className="group bg-white/80 dark:bg-dark-900/80 backdrop-blur-sm rounded-xl p-4 transition-all duration-300 hover:shadow-lg hover:scale-105 border border-gray-200/50 dark:border-primary-600/20 hover:border-primary-300/60 dark:hover:border-primary-500/40">
        {/* Logo Container - Compact */}
        <div className={`mb-4 rounded-lg shadow-inner p-3 flex items-center justify-center h-16 group-hover:shadow-md transition-all duration-300 ${
          logo ? 'bg-white dark:bg-gray-100' : 'bg-gradient-to-br from-primary-500 to-secondary-500'
        }`}>
          {logo ? (
            <img
              src={logo}
              alt={`${name} logo`}
              className="max-w-full max-h-full object-contain filter drop-shadow-sm"
            />
          ) : (
            <span className="text-lg font-heading font-bold text-white tracking-wide">
              {name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase()}
            </span>
          )}
        </div>

        {/* Company Info - Compact */}
        <div className="text-center">
          <h4 className="text-sm font-heading font-bold mb-2 text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300 line-clamp-2">
            {name}
          </h4>
          <p className="text-gray-600 dark:text-gray-300 text-xs leading-relaxed line-clamp-2">
            {description}
          </p>
        </div>

        {/* Subtle Hover Effect */}
        <div className="mt-3 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-6 h-0.5 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full"></div>
        </div>
      </div>
    </FadeInWhenVisible>
  );
};

const EnhancedPartnersSection = () => {
  // Main Featured Partners (core strategic entities)
  const featuredPartners = [
    {
      name: "Capimax Virtual Asset",
      logo: capiMaxVirtualAssetLogo,
      description: "UK-registered virtual asset service provider enabling European market access and FCA-framework compliance positioning within the Pronova ecosystem.",
      delay: 0.1
    },
    {
      name: "Capimax Blockchain",
      logo: capiMaxFintechBlockchainLogo,
      description: "Financial technology and blockchain systems development — technical infrastructure management and protocol governance for the ecosystem.",
      delay: 0.2
    },
    {
      name: "Nova Digital Finance",
      logo: novaDigitalFinanceLogo,
      description: "One of the first platforms globally to provide financing and lending using PRN itself — the digital finance engine of the ecosystem.",
      delay: 0.3
    }
  ];

  // Supporting Companies organized by category (v2)
  const supportingCompanies = [
    {
      category: "Capimax Ecosystem",
      icon: <FaBuilding size={20} />,
      companies: [
        {
          name: "Capimax Group",
          logo: capimaxGroupLogo,
          description: "Strategic holding group of 12 companies — the operational backbone of the ecosystem",
          delay: 0.38
        },
        {
          name: "Capimax Real Estate Technologies",
          logo: capiMaxTokenizationLogo,
          description: "Real estate tokenization and property technology arm",
          delay: 0.42
        },
        {
          name: "Capimax Asset Structure",
          logo: null,
          description: "Asset structuring and digital asset management",
          delay: 0.46
        }
      ]
    },
    {
      category: "Real Estate Partners",
      icon: <FaHandshake size={20} />,
      companies: [
        {
          name: "Westoria Capital",
          logo: null,
          description: "US capital and institutional investment platform accepting PRN",
          delay: 0.5
        },
        {
          name: "Crestmark Global",
          logo: null,
          description: "UK global real estate and investment management",
          delay: 0.54
        },
        {
          name: "Valora Estates",
          logo: null,
          description: "Spanish real estate platform accepting PRN",
          delay: 0.58
        },
        {
          name: "Aethera Development",
          logo: null,
          description: "Greek property development accepting PRN",
          delay: 0.62
        },
        {
          name: "Verdea Estates",
          logo: null,
          description: "Eastern European real estate accepting PRN",
          delay: 0.66
        },
        {
          name: "Elite Gate Properties",
          logo: elitGatePropertiesLogo,
          description: "UK luxury and premium real estate agency accepting PRN",
          delay: 0.7
        },
        {
          name: "Prime Inn Hotels",
          logo: primeinnLogo,
          description: "International hospitality and hotel investment accepting PRN",
          delay: 0.74
        }
      ]
    },
    {
      category: "Supporting Entities",
      icon: <FaStar size={20} />,
      companies: [
        {
          name: "CIM Financial Group",
          logo: cimLogo,
          description: "Compliance, intelligence & risk monitoring — institutional oversight",
          delay: 0.78
        },
        {
          name: "HCC",
          logo: hccLogo,
          description: "Technology & digital asset insurance infrastructure",
          delay: 0.82
        },
        {
          name: "Assurax Insurance",
          logo: assuraxLogo,
          description: "Cyber insurance and digital asset protection",
          delay: 0.86
        }
      ]
    }
  ];

  return (
    <section id="partners" className="relative py-24 bg-gray-50 dark:bg-dark-800 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-20 left-10 w-96 h-96 bg-primary-500/5 dark:bg-primary-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-secondary-500/5 dark:bg-secondary-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-primary-500/3 dark:from-primary-500/5 to-transparent rounded-full"></div>
      </div>

      <div className="container-custom relative z-10">
        {/* Main Section Header */}
        <FadeInWhenVisible>
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-primary-500/15 to-secondary-500/15 border border-primary-500/30 mb-8">
              <FaStar className="w-4 h-4 text-primary-600 dark:text-primary-400 mr-3 animate-pulse" />
              <span className="text-primary-700 dark:text-primary-300 text-sm font-bold uppercase tracking-wider">Featured Strategic Partners</span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6 text-gray-900 dark:text-white">
              Our <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">Strongest</span><br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-secondary-600 to-primary-600 bg-clip-text text-transparent">Partners</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Meet our <span className="font-semibold text-primary-600 dark:text-primary-400">three flagship partners</span> that provide the core strength and strategic foundation for Pronova's revolutionary ecosystem
            </p>
          </div>
        </FadeInWhenVisible>

        {/* Featured Partners Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-24">
          {featuredPartners.map((partner, index) => (
            <FeaturedPartnerCard
              key={index}
              name={partner.name}
              logo={partner.logo}
              description={partner.description}
              delay={partner.delay}
            />
          ))}
        </div>

        {/* Supporting Companies Section */}
        <FadeInWhenVisible delay={0.4}>
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-6 py-2 rounded-full bg-gradient-to-r from-gray-500/10 to-gray-600/10 border border-gray-400/20 mb-6">
              <FaUsers className="w-4 h-4 text-gray-600 dark:text-gray-400 mr-3" />
              <span className="text-gray-700 dark:text-gray-300 text-sm font-semibold uppercase tracking-wider">Supporting Network</span>
            </div>
            <h3 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-6 text-gray-900 dark:text-white">
              Our <span className="bg-gradient-to-r from-gray-600 to-gray-700 bg-clip-text text-transparent">Extended</span> Network
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              <span className="font-semibold text-gray-700 dark:text-gray-300">The Capimax ecosystem, real estate partners, and supporting entities</span> providing comprehensive support and real-world PRN utility across multiple sectors
            </p>
          </div>
        </FadeInWhenVisible>

        {/* Supporting Companies Grid */}
        <div className="space-y-12">
          {supportingCompanies.map((category, index) => (
            <div key={index} className="mb-8">
              <FadeInWhenVisible delay={0.5 + (0.1 * index)}>
                <div className="flex items-center mb-8">
                  <div className="p-3 bg-gradient-to-br from-gray-500 to-gray-600 text-white rounded-lg mr-4 shadow-md">
                    {category.icon}
                  </div>
                  <h4 className="text-2xl font-heading font-bold text-gray-800 dark:text-gray-200">{category.category}</h4>
                  <div className="ml-6 flex-grow h-px bg-gradient-to-r from-gray-400/40 via-gray-500/30 to-transparent"></div>
                </div>
              </FadeInWhenVisible>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {category.companies.map((company, idx) => (
                  <SupportingPartnerCard
                    key={idx}
                    name={company.name}
                    logo={company.logo}
                    description={company.description}
                    delay={company.delay}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Partnership Benefits Section */}
        <FadeInWhenVisible delay={0.8}>
          <div className="mt-20 bg-gradient-to-br from-primary-500/5 via-white dark:via-dark-900 to-secondary-500/5 backdrop-blur-sm rounded-3xl border border-primary-500/10 dark:border-primary-500/20 p-12 text-center shadow-xl">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-8 bg-gradient-to-br from-primary-500 to-secondary-500 text-white shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10">
                <path fillRule="evenodd" d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813A3.75 3.75 0 007.466 7.89l.813-2.846A.75.75 0 019 4.5zM18 1.5a.75.75 0 01.728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 010 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 01-1.456 0l-.258-1.036a2.625 2.625 0 00-1.91-1.91l-1.036-.258a.75.75 0 010-1.456l1.036-.258a2.625 2.625 0 001.91-1.91l.258-1.036A.75.75 0 0118 1.5zM16.5 15a.75.75 0 01.712.513l.394 1.183c.15.447.5.799.948.948l1.183.395a.75.75 0 010 1.422l-1.183.395c-.447.15-.799.5-.948.948l-.395 1.183a.75.75 0 01-1.422 0l-.395-1.183a1.5 1.5 0 00-.948-.948l-1.183-.395a.75.75 0 010-1.422l1.183-.395c.447-.15.799-.5.948-.948l.395-1.183A.75.75 0 0116.5 15z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-3xl md:text-4xl font-heading font-bold mb-6">
              <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">Partnership Ecosystem</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-8">
              <div className="bg-white/80 dark:bg-dark-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-primary-600/20 shadow-lg">
                <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">🚀 Featured Partners</h4>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Our three flagship partners provide core virtual asset management, fintech innovation, and digital finance solutions with cutting-edge technology.
                </p>
              </div>

              <div className="bg-white/80 dark:bg-dark-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-primary-600/20 shadow-lg">
                <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">🤝 Supporting Network</h4>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  International real estate partners plus insurance and oversight entities (CIM, HCC, Assurax) provide comprehensive ecosystem support and verifiable, real-world PRN utility.
                </p>
              </div>
            </div>

            <div className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300">
              ✨ 18+ Global Partners & Growing
            </div>
          </div>
        </FadeInWhenVisible>
      </div>
    </section>
  );
};

export default EnhancedPartnersSection;