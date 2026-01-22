import React from 'react';
import { motion } from 'framer-motion';
import { FaArrowRight, FaCoins, FaWallet, FaExchangeAlt, FaShieldAlt } from 'react-icons/fa';
import { useTheme } from '../../../context/ThemeContext';
import Button from '../../ui/Button';

// Animation for section elements when they come into view
const FadeInWhenVisible = ({ children, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
    >
      {children}
    </motion.div>
  );
};

// Animated background shape component - improved for light/dark mode
const AnimatedShape = ({ darkMode }) => (
  <motion.div
    className={`absolute rounded-full w-[300px] h-[300px] bottom-[5%] right-[-5%] ${
      darkMode
        ? 'bg-gradient-to-r from-primary-500/12 via-primary-400/8 to-primary-300/4'
        : 'bg-gradient-to-r from-primary-200/20 via-primary-100/12 to-primary-50/6'
    } blur-[90px] pointer-events-none`}
    animate={{
      y: [0, -30, 0],
      opacity: [0.4, 0.6, 0.4],
      scale: [1, 1.03, 1]
    }}
    transition={{
      duration: 18,
      repeat: Infinity,
      repeatType: "reverse"
    }}
  />
);

const EnhancedPresaleSection = () => {
  const { darkMode } = useTheme();

  // Static marketing data - no dynamic/countdown elements
  const features = [
    {
      icon: <FaCoins size={24} />,
      title: "1 Billion Supply",
      description: "Fixed total supply ensuring scarcity and value"
    },
    {
      icon: <FaWallet size={24} />,
      title: "Multi-Phase Sale",
      description: "Early investors get the best prices"
    },
    {
      icon: <FaExchangeAlt size={24} />,
      title: "Easy Purchase",
      description: "Buy with ETH, USDT, or credit card"
    },
    {
      icon: <FaShieldAlt size={24} />,
      title: "Secure & Audited",
      description: "Smart contracts verified and secure"
    }
  ];

  return (
    <section id="presale" className={`relative py-24 ${
      darkMode
        ? 'bg-gradient-to-b from-dark-800 to-primary-900/5'
        : 'bg-gray-50'
    }`}>
      <AnimatedShape darkMode={darkMode} />

      <div className="container-custom">
        <FadeInWhenVisible>
          <div className="text-center mb-16">
            <div className={`inline-block backdrop-blur-sm border px-4 py-1.5 rounded-full text-sm font-medium mb-4 ${
              darkMode
                ? 'bg-primary-600/20 border-primary-600/20 text-primary-400'
                : 'bg-primary-100/60 border-primary-200/40 text-primary-700'
            }`}>
              Token Sale
            </div>
            <h2 className={`text-4xl md:text-5xl font-heading font-bold mb-4 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              <span className="gradient-text">Presale</span> Opportunity
            </h2>
            <p className={`text-xl max-w-3xl mx-auto ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Join the Pronova revolution early and secure your tokens at the best possible price
            </p>
          </div>
        </FadeInWhenVisible>

        {/* Feature Grid */}
        <FadeInWhenVisible delay={0.1}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`text-center p-6 rounded-xl border backdrop-blur-sm transition-all duration-300 hover:scale-105 ${
                  darkMode
                    ? 'bg-dark-800/60 border-primary-600/20 hover:border-primary-500/40'
                    : 'bg-white/70 border-primary-200/30 hover:border-primary-300/50'
                }`}
              >
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-full mb-4 ${
                  darkMode
                    ? 'bg-primary-600/20 text-primary-400'
                    : 'bg-primary-100/60 text-primary-600'
                }`}>
                  {feature.icon}
                </div>
                <h3 className={`text-lg font-heading font-bold mb-2 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {feature.title}
                </h3>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </FadeInWhenVisible>

        {/* CTA Section */}
        <FadeInWhenVisible delay={0.2}>
          <div className={`text-center backdrop-blur-sm border p-8 md:p-12 rounded-2xl ${
            darkMode
              ? 'bg-gradient-to-r from-primary-600/40 to-secondary-600/40 border-primary-600/30 shadow-neon text-white'
              : 'bg-gradient-to-r from-primary-100/60 to-secondary-100/40 border-primary-200/40 shadow-lg text-gray-900'
          }`}>
            <div className={`inline-flex items-center px-4 py-1.5 rounded-full border mb-6 ${
              darkMode
                ? 'bg-green-500/20 border-green-500/30'
                : 'bg-green-100/60 border-green-200/40'
            }`}>
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              <span className={`text-sm font-medium ${
                darkMode ? 'text-green-300' : 'text-green-700'
              }`}>Presale Now Live</span>
            </div>

            <h3 className={`text-3xl md:text-4xl font-heading font-bold mb-4 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Don't Miss This Opportunity
            </h3>
            <p className={`text-lg mb-8 max-w-2xl mx-auto ${
              darkMode ? 'text-gray-200' : 'text-gray-700'
            }`}>
              Join the Pronova presale now and be part of the revolutionary cryptocurrency backed by 18 global companies. View real-time presale data and purchase tokens on the presale page.
            </p>
            <Button
              size="large"
              variant="gradient"
              to="/presale"
              className="text-lg px-8"
            >
              <span>View Presale Details</span>
              <FaArrowRight className="ml-2" />
            </Button>
          </div>
        </FadeInWhenVisible>
      </div>
    </section>
  );
};

export default EnhancedPresaleSection;
