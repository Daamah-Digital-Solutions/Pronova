import React from 'react';
import { motion } from 'framer-motion';
import TokenomicsChart from '../ui/TokenomicsChart';
import LockedTokensChart from '../ui/LockedTokensChart';
import Button from '../ui/Button';

const TokenomicsSection = () => {
  return (
    <section id="tokenomics" className="section relative">
      {/* Background elements */}
      <motion.div
        className="shape rounded-full w-[450px] h-[450px] top-[5%] left-[-10%] shape-secondary"
        animate={{ 
          y: [0, 50, 0],
          opacity: [0.2, 0.4, 0.2],
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          duration: 20,
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
            <span className="section-title-gradient">Pronova Tokenomics</span>
          </h2>
          <p className="section-subtitle">
            Our token distribution is designed to ensure long-term sustainability, balanced participation, and controlled supply.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Token Distribution */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="card p-6 md:p-8 backdrop-blur-sm shadow-neon">
              <h3 className="text-2xl font-heading font-bold mb-6 text-center text-white">
                Token Distribution
              </h3>
              <TokenomicsChart />
              <div className="mt-6 text-center text-gray-300">
                <p className="font-medium">Total Supply: 1,000,000,000 PRN</p>
              </div>
            </div>
          </motion.div>

          {/* Locked Tokens */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="card p-6 md:p-8 backdrop-blur-sm shadow-neon">
              <h3 className="text-2xl font-heading font-bold mb-6 text-center text-white">
                Locked Tokens
              </h3>
              <LockedTokensChart />
              <div className="mt-6 text-center text-gray-300">
                <p className="font-medium">56% of tokens will be locked with a 7-year unlock schedule</p>
                <p className="text-sm mt-2">4% will unlock every 6 months</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Token Utility Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-r from-primary-600/30 to-secondary-600/30 rounded-xl border border-primary-600/20 p-8 text-white backdrop-blur-sm shadow-neon mb-16"
        >
          <h3 className="text-2xl font-heading font-bold mb-6 text-center">
            Pronova Token Utility
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-xl font-heading font-semibold mb-4">Key Utilities</h4>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="mr-2 mt-1 text-primary-400">•</span>
                  <span>Used for payments and transactions with partner merchants</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 mt-1 text-primary-400">•</span>
                  <span>Direct investment in real estate, gold, and other assets</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 mt-1 text-primary-400">•</span>
                  <span>Can be used as investment guarantee for various opportunities</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 mt-1 text-primary-400">•</span>
                  <span>Provides discounts when used for purchases with partners</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 mt-1 text-primary-400">•</span>
                  <span>Transaction fees and network operations</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-xl font-heading font-semibold mb-4">Value Mechanisms</h4>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="mr-2 mt-1 text-primary-400">•</span>
                  <span>Price increases with growing demand and adoption</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 mt-1 text-primary-400">•</span>
                  <span>Token burning to reduce supply and increase scarcity</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 mt-1 text-primary-400">•</span>
                  <span>Staking rewards for network security participation</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 mt-1 text-primary-400">•</span>
                  <span>Governance rights for future ecosystem decisions</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 mt-1 text-primary-400">•</span>
                  <span>Integration with 18 global partner companies</span>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>

        <div className="text-center">
          <Button 
            variant="gradient"
            size="large"
            to="/whitepaper#tokenomics"
          >
            Learn More About Tokenomics
          </Button>
        </div>
      </div>
    </section>
  );
};

export default TokenomicsSection;