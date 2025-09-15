import React from 'react';
import { motion } from 'framer-motion';
import Button from '../ui/Button';
import CountdownTimer from '../ui/CountdownTimer';
import { FaEthereum, FaBitcoin, FaDollarSign, FaArrowRight } from 'react-icons/fa';
import { SiTether } from 'react-icons/si';
import { useTheme } from '../../context/ThemeContext';

const PresaleSection = () => {
  const { darkMode } = useTheme();
  
  // Presale phase end dates (based on whitepaper roadmap)
  const presalePhase1EndDate = new Date('2025-07-30T23:59:59');
  const presalePhase2EndDate = new Date('2025-08-29T23:59:59');
  const presalePhase3EndDate = new Date('2025-09-28T23:59:59');
  
  // Presale phases data from whitepaper
  const presalePhases = [
    {
      phase: 1,
      tokenAmount: "100,000,000",
      price: "$0.80",
      totalRaised: "$80,000,000",
      duration: "30 days",
      status: "active", // active, upcoming, completed
      progress: 45,
      endDate: presalePhase1EndDate,
      delay: 0.1
    },
    {
      phase: 2,
      tokenAmount: "75,000,000",
      price: "$1.00",
      totalRaised: "$75,000,000",
      duration: "30 days",
      status: "upcoming",
      progress: 0,
      endDate: presalePhase2EndDate,
      delay: 0.2
    },
    {
      phase: 3,
      tokenAmount: "75,000,000",
      price: "$1.50",
      totalRaised: "$112,500,000",
      duration: "30 days",
      status: "upcoming",
      progress: 0,
      endDate: presalePhase3EndDate,
      delay: 0.3
    }
  ];

  return (
    <section id="presale" className={`section relative ${
      darkMode 
        ? 'bg-gradient-to-b from-dark-900 to-primary-900/5' 
        : 'bg-gradient-to-b from-gray-50 to-primary-50/20'
    }`}>
      {/* Background elements - Purple shape only (no black shape) */}
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

      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="section-title">
            <span className="section-title-gradient">Token Sale</span>
          </h2>
          <p className={`section-subtitle ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Join the Pronova revolution early and secure your tokens at the best possible price
          </p>
        </motion.div>

        {/* Presale Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className={`backdrop-blur-sm p-8 mb-16 grid grid-cols-2 md:grid-cols-4 gap-6 rounded-xl border ${
            darkMode 
              ? 'shadow-neon bg-dark-800/60 border-primary-600/20' 
              : 'shadow-lg bg-white/70 border-primary-200/30'
          }`}
        >
          <div className="text-center">
            <div className={`text-sm mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Token Supply</div>
            <div className={`text-2xl font-heading font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>1,000,000,000</div>
            <div className="text-primary-400 text-sm mt-1">PRN</div>
          </div>
          
          <div className="text-center">
            <div className={`text-sm mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Tokens for Presale</div>
            <div className={`text-2xl font-heading font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>250,000,000</div>
            <div className="text-primary-400 text-sm mt-1">25% of Supply</div>
          </div>
          
          <div className="text-center">
            <div className={`text-sm mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Expected Listing Price</div>
            <div className={`text-2xl font-heading font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>$1.70 - $2.50</div>
            <div className="text-green-500 text-sm mt-1">+112.5% from Phase 1</div>
          </div>
          
          <div className="text-center">
            <div className={`text-sm mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Raise Goal</div>
            <div className={`text-2xl font-heading font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>$267,500,000</div>
            <div className="text-primary-400 text-sm mt-1">Across 3 Phases</div>
          </div>
        </motion.div>

        {/* Presale Phases */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {presalePhases.map((phase, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: phase.delay }}
              className={`rounded-xl overflow-hidden border transition-all duration-300 ${
                darkMode 
                  ? (phase.status === 'active' 
                      ? 'border-primary-500 shadow-neon-strong bg-dark-800/60' 
                      : 'shadow-neon bg-dark-800/60 border-primary-600/20') 
                  : (phase.status === 'active' 
                      ? 'border-primary-500 shadow-lg bg-white/80' 
                      : 'shadow-lg bg-white/70 border-primary-200/30')
              }`}
            >
              <div className={`py-3 px-6 text-white text-center font-heading ${
                phase.status === 'active' 
                  ? 'bg-primary-600' 
                  : phase.status === 'completed' 
                    ? 'bg-green-600' 
                    : 'bg-primary-600/40'
              }`}>
                <h3 className="font-bold">Phase {phase.phase}</h3>
              </div>
              
              <div className="p-6">
                <div className="mb-6">
                  <div className="flex justify-between mb-2">
                    <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Token Price:</span>
                    <span className={`font-heading font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{phase.price}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Token Amount:</span>
                    <span className={`font-heading font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{phase.tokenAmount}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Total Raised:</span>
                    <span className={`font-heading font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{phase.totalRaised}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Duration:</span>
                    <span className={`font-heading font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{phase.duration}</span>
                  </div>
                </div>
                
                {phase.status === 'active' && (
                  <>
                    <div className={`w-full ${darkMode ? 'bg-dark-800' : 'bg-gray-200'} rounded-full h-2.5 mb-4 overflow-hidden`}>
                      <div 
                        className="bg-gradient-to-r from-primary-600 to-primary-500 h-2.5 rounded-full"
                        style={{ width: `${phase.progress}%` }}
                      ></div>
                    </div>
                    
                    <div className="flex justify-between text-sm mb-6">
                      <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>{phase.progress}% completed</span>
                      <span className="text-primary-400">{phase.progress > 0 ? `${Math.round(phase.tokenAmount * phase.progress / 100 / 1000000)}M tokens sold` : 'Sales starting soon'}</span>
                    </div>
                    
                    <CountdownTimer 
                      targetDate={phase.endDate} 
                      phase={phase.phase} 
                      variant="compact"
                      showTitle={false}
                      className="mb-6"
                    />
                    
                    <Button 
                      variant="gradient"
                      fullWidth
                      to="/dashboard"
                    >
                      Buy Tokens Now
                    </Button>
                  </>
                )}
                
                {phase.status === 'upcoming' && (
                  <div className="text-center py-4">
                    <div className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Coming soon after Phase {phase.phase - 1}</div>
                    <Button 
                      variant="outline"
                      to="#"
                      disabled
                    >
                      Not Active Yet
                    </Button>
                  </div>
                )}
                
                {phase.status === 'completed' && (
                  <div className="text-center py-4">
                    <div className="text-green-500 mb-4">Sold Out!</div>
                    <Button 
                      variant="success"
                      to="#"
                      disabled
                    >
                      Completed
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* How to Buy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className={`p-8 mb-16 rounded-xl border backdrop-blur-sm ${
            darkMode 
              ? 'shadow-neon bg-dark-800/60 border-primary-600/20' 
              : 'shadow-lg bg-white/70 border-primary-200/30'
          }`}
        >
          <h3 className="text-2xl font-heading font-bold mb-6 text-center gradient-text">
            How to Buy Pronova Tokens
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border ${
                darkMode 
                  ? 'bg-primary-600/20 border-primary-600/30 shadow-neon' 
                  : 'bg-primary-100/50 border-primary-200/40 shadow-md'
              }`}>
                <span className="text-primary-400 font-heading font-bold text-2xl">1</span>
              </div>
              <h4 className={`text-lg font-heading font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Connect Your Wallet</h4>
              <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                Connect your MetaMask or WalletConnect compatible wallet to our platform.
              </p>
            </div>
            
            <div className="text-center">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border ${
                darkMode 
                  ? 'bg-primary-600/20 border-primary-600/30 shadow-neon' 
                  : 'bg-primary-100/50 border-primary-200/40 shadow-md'
              }`}>
                <span className="text-primary-400 font-heading font-bold text-2xl">2</span>
              </div>
              <h4 className={`text-lg font-heading font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Choose Amount</h4>
              <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                Select the amount of Pronova tokens you wish to purchase.
              </p>
            </div>
            
            <div className="text-center">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border ${
                darkMode 
                  ? 'bg-primary-600/20 border-primary-600/30 shadow-neon' 
                  : 'bg-primary-100/50 border-primary-200/40 shadow-md'
              }`}>
                <span className="text-primary-400 font-heading font-bold text-2xl">3</span>
              </div>
              <h4 className={`text-lg font-heading font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Complete Purchase</h4>
              <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                Pay with ETH, BNB, USDT, or USD to receive your tokens instantly.
              </p>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <div className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              We accept the following payment methods:
            </div>
            <div className="flex justify-center space-x-6">
              <div className={`flex items-center ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <FaEthereum size={24} className="mr-2 text-primary-400" />
                <span>ETH</span>
              </div>
              <div className={`flex items-center ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <SiTether size={24} className="mr-2 text-primary-400" />
                <span>USDT</span>
              </div>
              <div className={`flex items-center ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <FaDollarSign size={24} className="mr-2 text-primary-400" />
                <span>USD</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA - Presale Opportunity */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className={`text-center p-8 md:p-12 rounded-2xl backdrop-blur-sm border ${
            darkMode 
              ? 'bg-gradient-to-r from-primary-600/40 to-secondary-600/40 border-primary-600/30 shadow-neon' 
              : 'bg-gradient-to-r from-primary-100/60 to-secondary-100/40 border-primary-200/40 shadow-lg'
          }`}
        >
          <h3 className={`text-2xl md:text-3xl font-heading font-bold mb-4 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Presale Opportunity
          </h3>
          <p className={`text-lg mb-8 max-w-2xl mx-auto ${
            darkMode ? 'text-gray-200' : 'text-gray-700'
          }`}>
            Join the Pronova presale now and be part of the revolutionary cryptocurrency backed by 18 global companies.
          </p>
          <Button 
            size="large"
            variant="gradient"
            to="/dashboard"
          >
            Buy PRN Tokens
            <FaArrowRight />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default PresaleSection;