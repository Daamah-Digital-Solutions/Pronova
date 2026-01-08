import React from 'react';
import { motion } from 'framer-motion';
import { FaExchangeAlt, FaWallet, FaShieldAlt, FaChartLine, FaCheck } from 'react-icons/fa';

// Animation for section elements when they come into view
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

const DualNatureSection = () => {
  const tradingFeatures = [
    "Tradeable on global cryptocurrency markets",
    "Price speculation opportunities",
    "24/7 market availability",
    "Liquidity through exchanges"
  ];

  const utilityFeatures = [
    "Digital payment method with partner companies",
    "Investment vehicle across 30+ sectors",
    "Fee discounts and exemptions",
    "Institutional protection & stability"
  ];

  return (
    <section className="relative py-24 bg-gray-50 dark:bg-dark-800">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute top-10 left-20 w-80 h-80 bg-primary-500/5 dark:bg-primary-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary-500/5 dark:bg-secondary-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container-custom relative z-10">
        <FadeInWhenVisible>
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-6 py-2 rounded-full bg-gradient-to-r from-primary-500/10 to-secondary-500/10 border border-primary-500/20 mb-6">
              <span className="text-primary-600 dark:text-primary-400 text-sm font-semibold uppercase tracking-wider">Unique Design</span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6 text-gray-900 dark:text-white">
              The <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">Dual Nature</span> of Pronova
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Like any cryptocurrency, Pronova can be traded. But its founders added an <strong className="text-primary-600 dark:text-primary-400">institutional investment dimension</strong> to protect the currency and ensure stability.
            </p>
          </div>
        </FadeInWhenVisible>

        {/* Dual Nature Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Trading Nature */}
          <FadeInWhenVisible direction="left" delay={0.1}>
            <div className="group bg-white dark:bg-dark-900/90 backdrop-blur-sm rounded-3xl p-8 border border-gray-200 dark:border-primary-600/30 hover:border-primary-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary-500/10 h-full">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white mr-4 shadow-lg">
                  <FaExchangeAlt size={28} />
                </div>
                <div>
                  <h3 className="text-2xl font-heading font-bold text-gray-900 dark:text-white">
                    Trading & Speculation
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Like any cryptocurrency</p>
                </div>
              </div>

              <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                Pronova operates like any digital cryptocurrency in global markets - available for trading, speculation, and holding as a digital asset.
              </p>

              <ul className="space-y-3">
                {tradingFeatures.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-500/20 dark:bg-blue-500/30 flex items-center justify-center mr-3 mt-0.5">
                      <FaCheck className="text-blue-500 text-xs" />
                    </span>
                    <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </FadeInWhenVisible>

          {/* Utility & Investment Nature */}
          <FadeInWhenVisible direction="right" delay={0.2}>
            <div className="group bg-gradient-to-br from-primary-600 to-secondary-600 rounded-3xl p-8 text-white hover:shadow-2xl hover:shadow-primary-500/30 transition-all duration-300 h-full relative overflow-hidden">
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="w-full h-full" style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                }} />
              </div>

              <div className="relative z-10">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mr-4 shadow-lg">
                    <FaWallet size={28} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-heading font-bold">
                      Utility & Investment
                    </h3>
                    <p className="text-sm text-white/70">Institutional backing</p>
                  </div>
                </div>

                <p className="text-white/90 mb-6 leading-relaxed">
                  The founders and partners added an institutional investment dimension to protect the currency, preserve its value, and ensure stability over time.
                </p>

                <ul className="space-y-3">
                  {utilityFeatures.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-white/20 flex items-center justify-center mr-3 mt-0.5">
                        <FaCheck className="text-white text-xs" />
                      </span>
                      <span className="text-white/90">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </FadeInWhenVisible>
        </div>

        {/* Bottom message */}
        <FadeInWhenVisible delay={0.3}>
          <div className="bg-white dark:bg-dark-900/90 backdrop-blur-sm rounded-2xl p-8 border border-gray-200 dark:border-primary-600/30 text-center">
            <div className="flex items-center justify-center mb-4">
              <FaShieldAlt className="text-primary-600 dark:text-primary-400 text-3xl mr-3" />
              <FaChartLine className="text-secondary-600 dark:text-secondary-400 text-3xl" />
            </div>
            <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              This dual nature doesn't close the door on free use - rather, it makes using Pronova for <strong className="text-primary-600 dark:text-primary-400">investments and payments</strong> a means to achieve <strong className="text-gray-900 dark:text-white">security, stability, and value protection</strong>, alongside price appreciation.
            </p>
          </div>
        </FadeInWhenVisible>
      </div>
    </section>
  );
};

export default DualNatureSection;
