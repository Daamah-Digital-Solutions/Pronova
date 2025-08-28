import React from 'react';
import { motion } from 'framer-motion';
import { 
  FaHandHoldingUsd, 
  FaMoneyBillWave, 
  FaExchangeAlt, 
  FaLock, 
  FaShieldAlt, 
  FaGlobe 
} from 'react-icons/fa';
import Button from '../../ui/Button';

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

const EnhancedFeaturesSection = () => {
  const features = [
    {
      icon: <FaHandHoldingUsd size={28} />,
      title: "Investment Discount",
      description: "Up to 10% discount when using Pronova for payments and investments with our partner companies.",
      delay: 0.1
    },
    {
      icon: <FaMoneyBillWave size={28} />,
      title: "Corporate Cashback",
      description: "Companies accepting Pronova receive cashback, creating a win-win ecosystem for users and businesses.",
      delay: 0.2
    },
    {
      icon: <FaExchangeAlt size={28} />,
      title: "Direct Investment Integration",
      description: "Invest in real estate, gold, stocks, insurance through our network of 18 global companies.",
      delay: 0.3
    },
    {
      icon: <FaLock size={28} />,
      title: "Token Locking Mechanism",
      description: "56% of tokens locked with a 7-year unlock schedule, ensuring long-term stability.",
      delay: 0.2
    },
    {
      icon: <FaShieldAlt size={28} />,
      title: "Risk Insurance",
      description: "Protection against data breaches, cyber attacks, and other digital risks.",
      delay: 0.3
    },
    {
      icon: <FaGlobe size={28} />,
      title: "Global Partnership Network",
      description: "Access to 18 international companies across real estate, gold, hotels, bonds, and more.",
      delay: 0.4
    }
  ];
  
  return (
    <section id="features" className="relative py-24 bg-gray-50 dark:bg-dark-800">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary-500/5 dark:bg-primary-500/10 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container-custom">
        <FadeInWhenVisible>
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-6 py-2 rounded-full bg-gradient-to-r from-primary-500/10 to-secondary-500/10 border border-primary-500/20 mb-6">
              <span className="text-primary-600 dark:text-primary-400 text-sm font-semibold uppercase tracking-wider">Why Choose Pronova?</span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6 text-gray-900 dark:text-white">
              <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">Revolutionary</span> Features
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Bridging traditional finance and blockchain technology with <span className="font-semibold text-primary-600 dark:text-primary-400">real-world utility</span>
            </p>
          </div>
        </FadeInWhenVisible>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FadeInWhenVisible key={index} delay={feature.delay}>
              <div className="group bg-white dark:bg-dark-900/90 backdrop-blur-sm rounded-2xl p-8 transition-all duration-500 hover:shadow-2xl hover:scale-105 border border-gray-200 dark:border-primary-600/30 shadow-lg hover:shadow-primary-500/20 dark:hover:shadow-primary-500/40 h-full">
                <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-primary-500/10 to-secondary-500/10 dark:from-primary-500/20 dark:to-secondary-500/20 text-primary-600 dark:text-primary-400 group-hover:from-primary-500 group-hover:to-secondary-500 group-hover:text-white transition-all duration-300">
                  {feature.icon}
                </div>
                
                <h3 className="text-xl font-heading font-bold mb-4 text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </FadeInWhenVisible>
          ))}
        </div>
        
        <FadeInWhenVisible delay={0.5}>
          <div className="text-center mt-16">
            <Button 
              variant="gradient"
              size="large"
              to="/whitepaper#features"
              className="px-8 py-4 text-lg font-semibold"
            >
              📄 Learn More About Features
            </Button>
          </div>
        </FadeInWhenVisible>
      </div>
    </section>
  );
};

export default EnhancedFeaturesSection;