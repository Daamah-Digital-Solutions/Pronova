import React from 'react';
import { motion } from 'framer-motion';
import FeatureCard from '../ui/FeatureCard';
import { 
  FaHandHoldingUsd, 
  FaMoneyBillWave, 
  FaExchangeAlt, 
  FaLock, 
  FaShieldAlt, 
  FaGlobe 
} from 'react-icons/fa';

const FeaturesSection = () => {
  const features = [
    {
      icon: <FaHandHoldingUsd size={28} />,
      title: "Investment Discount",
      description: "Holders and users benefit from discounts up to 10% when using Pronova for payments and investments with partner companies.",
      delay: 0.1
    },
    {
      icon: <FaMoneyBillWave size={28} />,
      title: "Corporate Cashback",
      description: "Companies accepting Pronova as payment receive cashback, creating a win-win ecosystem for both users and businesses.",
      delay: 0.2
    },
    {
      icon: <FaExchangeAlt size={28} />,
      title: "Direct Investment Integration",
      description: "Use Pronova to invest in real estate, gold, stocks, insurance, bonds, and more through our extensive network of 18 global companies.",
      delay: 0.3
    },
    {
      icon: <FaLock size={28} />,
      title: "Token Locking Mechanism",
      description: "56% of tokens are locked with a 7-year unlock schedule (4% every 6 months), ensuring long-term stability and controlling supply.",
      delay: 0.4
    },
    {
      icon: <FaShieldAlt size={28} />,
      title: "Risk Insurance",
      description: "Partnerships with insurance companies provide protection against data breaches, cyber attacks, and other digital risks.",
      delay: 0.5
    },
    {
      icon: <FaGlobe size={28} />,
      title: "Global Partnership Network",
      description: "Access to a network of 18 international companies across real estate, gold, metals, hotels, oil, bonds, insurance, and more.",
      delay: 0.6
    }
  ];

  return (
    <section id="features" className="section relative bg-banner-bg-2 bg-cover bg-no-repeat">
      {/* Background elements */}
      <motion.div
        className="shape rounded-full w-[400px] h-[400px] bottom-[10%] right-[5%] shape-primary"
        animate={{ 
          y: [0, -40, 0],
          opacity: [0.3, 0.5, 0.3],
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          duration: 18,
          repeat: Infinity,
          repeatType: "reverse" 
        }}
      />

      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="section-title">
            <span className="section-title-gradient">Why Choose Pronova?</span>
          </h2>
          <p className="section-subtitle">
            Pronova bridges the gap between traditional finance and blockchain technology, offering unique advantages for investors and businesses.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={feature.delay}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;