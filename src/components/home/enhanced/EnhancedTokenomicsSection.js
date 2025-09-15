import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaCoins, FaLock, FaChartPie, FaRocket, FaShieldAlt, FaGem } from 'react-icons/fa';
import { useTheme } from '../../../context/ThemeContext';
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

const EnhancedTokenomicsSection = () => {
  const { darkMode } = useTheme();
  const [activeTab, setActiveTab] = useState('distribution');
  const [hoveredItem, setHoveredItem] = useState(null);
  
  // Color mapping for Tailwind colors to hex
  const colorMap = {
    'blue-500': '#3b82f6',
    'blue-600': '#2563eb',
    'green-500': '#10b981',
    'green-600': '#059669',
    'purple-500': '#8b5cf6',
    'purple-600': '#7c3aed',
    'yellow-500': '#eab308',
    'yellow-600': '#ca8a04',
    'red-500': '#ef4444',
    'red-600': '#dc2626',
    'indigo-500': '#6366f1',
    'indigo-600': '#4f46e5',
    'pink-500': '#ec4899',
    'pink-600': '#db2777',
    'teal-500': '#14b8a6',
    'teal-600': '#0d9488'
  };
  
  const getHexColor = (tailwindColor) => {
    return colorMap[tailwindColor] || '#3b82f6'; // default to blue if not found
  };
  
  // Token distribution data from whitepaper
  const tokenDistribution = [
    { label: 'Presale', percentage: 40, amount: '400M', color: 'from-blue-500 to-blue-600' },
    { label: 'Partnerships', percentage: 15, amount: '150M', color: 'from-green-500 to-green-600' },
    { label: 'Marketing & Development', percentage: 12, amount: '120M', color: 'from-purple-500 to-purple-600' },
    { label: 'Liquidity', percentage: 12, amount: '120M', color: 'from-yellow-500 to-yellow-600' },
    { label: 'Founders', percentage: 7.5, amount: '75M', color: 'from-red-500 to-red-600' },
    { label: 'Strategic Reserves', percentage: 6, amount: '60M', color: 'from-indigo-500 to-indigo-600' },
    { label: 'Community', percentage: 5, amount: '50M', color: 'from-pink-500 to-pink-600' },
    { label: 'Team', percentage: 2.5, amount: '25M', color: 'from-teal-500 to-teal-600' }
  ];
  
  // Locked tokens data
  const lockedTokens = [
    { category: 'Founders', locked: 93.3, amount: '70M' },
    { category: 'Partnerships', locked: 100, amount: '150M' },
    { category: 'Team', locked: 80, amount: '20M' },
    { category: 'Community', locked: 100, amount: '50M' },
    { category: 'Strategic Reserves', locked: 100, amount: '60M' },
    { category: 'Marketing', locked: 83.3, amount: '100M' }
  ];
  
  const TabButton = ({ id, label, icon, isActive, onClick }) => (
    <motion.button
      onClick={() => onClick(id)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`flex items-center px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
        isActive 
          ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg' 
          : darkMode
            ? 'bg-dark-800 text-gray-300 hover:bg-dark-700 hover:shadow-md border border-primary-600/30'
            : 'bg-white text-gray-700 hover:bg-gray-50 hover:shadow-md border border-gray-200'
      }`}
    >
      <span className="mr-2">{icon}</span>
      {label}
    </motion.button>
  );
  
  return (
    <section id="tokenomics" className={`relative py-24 ${
      darkMode ? 'bg-dark-900' : 'bg-gray-50'
    }`}>
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className={`absolute top-32 right-20 w-96 h-96 rounded-full blur-3xl ${
          darkMode ? 'bg-primary-500/10' : 'bg-primary-500/5'
        }`}></div>
        <div className={`absolute bottom-32 left-20 w-80 h-80 rounded-full blur-3xl ${
          darkMode ? 'bg-secondary-500/10' : 'bg-secondary-500/5'
        }`}></div>
      </div>
      
      <div className="container-custom relative z-10">
        <FadeInWhenVisible>
          <div className="text-center mb-16">
            <div className={`inline-flex items-center px-6 py-2 rounded-full border mb-6 ${
              darkMode 
                ? 'bg-gradient-to-r from-primary-500/10 to-secondary-500/10 border-primary-500/20' 
                : 'bg-gradient-to-r from-primary-100/60 to-secondary-100/60 border-primary-200/40'
            }`}>
              <FaChartPie className={`mr-2 ${darkMode ? 'text-primary-400' : 'text-primary-600'}`} />
              <span className={`text-sm font-semibold uppercase tracking-wider ${
                darkMode ? 'text-primary-400' : 'text-primary-600'
              }`}>Token Economics</span>
            </div>
            <h2 className={`text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">Pronova</span> Tokenomics
            </h2>
            <p className={`text-xl max-w-4xl mx-auto leading-relaxed ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Our carefully designed token economics ensure <span className={`font-semibold ${
                darkMode ? 'text-primary-400' : 'text-primary-600'
              }`}>long-term sustainability</span> and controlled supply with transparent distribution
            </p>
          </div>
        </FadeInWhenVisible>

        {/* Token Overview Cards */}
        <FadeInWhenVisible>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
            <motion.div 
              className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl p-6 text-white shadow-xl"
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <FaCoins className="text-3xl mb-3 opacity-80" />
              <div className="text-3xl font-bold mb-1">1B</div>
              <div className="text-primary-100 text-sm">Total Supply</div>
            </motion.div>
            
            <motion.div 
              className="bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-2xl p-6 text-white shadow-xl"
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <FaLock className="text-3xl mb-3 opacity-80" />
              <div className="text-3xl font-bold mb-1">45%</div>
              <div className="text-secondary-100 text-sm">Tokens Locked</div>
            </motion.div>
            
            <motion.div 
              className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-xl"
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <FaRocket className="text-3xl mb-3 opacity-80" />
              <div className="text-3xl font-bold mb-1">40%</div>
              <div className="text-green-100 text-sm">Presale Allocation</div>
            </motion.div>
            
            <motion.div 
              className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl"
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <FaShieldAlt className="text-3xl mb-3 opacity-80" />
              <div className="text-3xl font-bold mb-1">9Y</div>
              <div className="text-purple-100 text-sm">Unlock Schedule</div>
            </motion.div>
          </div>
        </FadeInWhenVisible>

        {/* Interactive Tabs */}
        <FadeInWhenVisible>
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <TabButton 
              id="distribution" 
              label="Distribution" 
              icon={<FaChartPie />} 
              isActive={activeTab === 'distribution'} 
              onClick={setActiveTab} 
            />
            <TabButton 
              id="locked" 
              label="Locked Tokens" 
              icon={<FaLock />} 
              isActive={activeTab === 'locked'} 
              onClick={setActiveTab} 
            />
            <TabButton 
              id="utility" 
              label="Token Utility" 
              icon={<FaGem />} 
              isActive={activeTab === 'utility'} 
              onClick={setActiveTab} 
            />
          </div>
        </FadeInWhenVisible>

        {/* Tab Content */}
        <div className={`backdrop-blur-sm rounded-3xl border shadow-2xl p-8 md:p-12 mb-16 ${
          darkMode 
            ? 'bg-dark-900/80 border-primary-600/20' 
            : 'bg-white/80 border-gray-200/50'
        }`}>
          {activeTab === 'distribution' && (
            <FadeInWhenVisible>
              <div>
                <h3 className={`text-3xl font-heading font-bold mb-8 text-center ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Token Distribution Breakdown
                </h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  {/* Visual Chart */}
                  <div className="flex items-center justify-center">
                    <div className="relative w-80 h-80">
                      {/* Pie Chart */}
                      <svg className="w-full h-full" viewBox="0 0 200 200">
                        {tokenDistribution.map((item, index) => {
                          const radius = 80;
                          const circumference = 2 * Math.PI * radius;
                          const strokeLength = (item.percentage / 100) * circumference;
                          const strokeOffset = tokenDistribution.slice(0, index).reduce((acc, curr) => acc + (curr.percentage / 100) * circumference, 0);
                          
                          return (
                            <motion.circle
                              key={index}
                              cx="100"
                              cy="100"
                              r={radius}
                              fill="none"
                              stroke={`url(#gradient-${index})`}
                              strokeWidth={hoveredItem === index ? "20" : "16"}
                              strokeDasharray={`${strokeLength} ${circumference}`}
                              strokeDashoffset={-strokeOffset}
                              className="transition-all duration-300 cursor-pointer"
                              onMouseEnter={() => setHoveredItem(index)}
                              onMouseLeave={() => setHoveredItem(null)}
                              whileHover={{ scale: 1.05 }}
                            />
                          );
                        })}
                        
                        {/* Gradient definitions */}
                        <defs>
                          {tokenDistribution.map((item, index) => {
                            const colors = item.color.split(' ');
                            const startColorName = colors[0] ? colors[0].replace('from-', '') : 'blue-500';
                            const endColorName = colors[1] ? colors[1].replace('to-', '') : 'blue-600';
                            const startColor = getHexColor(startColorName);
                            const endColor = getHexColor(endColorName);
                            
                            return (
                              <linearGradient key={index} id={`gradient-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor={startColor} />
                                <stop offset="100%" stopColor={endColor} />
                              </linearGradient>
                            );
                          })}
                        </defs>
                      </svg>
                      
                      {/* Center label */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>1B</div>
                          <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total PRN</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Legend */}
                  <div className="space-y-4">
                    {tokenDistribution.map((item, index) => (
                      <motion.div 
                        key={index} 
                        className={`flex items-center justify-between p-4 rounded-xl transition-all duration-300 cursor-pointer ${
                          darkMode 
                            ? 'bg-dark-800/60 hover:bg-dark-700/60' 
                            : 'bg-gray-50/80 hover:bg-gray-100/80'
                        } ${hoveredItem === index ? 'scale-105 shadow-lg' : ''}`}
                        onMouseEnter={() => setHoveredItem(index)}
                        onMouseLeave={() => setHoveredItem(null)}
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="flex items-center">
                          <motion.div 
                            className={`w-4 h-4 rounded-full bg-gradient-to-r ${item.color} mr-3`}
                            animate={{ scale: hoveredItem === index ? 1.2 : 1 }}
                            transition={{ duration: 0.2 }}
                          ></motion.div>
                          <span className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>{item.label}</span>
                        </div>
                        <div className="text-right">
                          <div className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{item.percentage}%</div>
                          <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{item.amount}</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </FadeInWhenVisible>
          )}
          
          {activeTab === 'locked' && (
            <FadeInWhenVisible>
              <div>
                <h3 className={`text-3xl font-heading font-bold mb-8 text-center ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Locked Tokens Schedule
                </h3>
                
                <div className="space-y-6">
                  {lockedTokens.map((item, index) => (
                    <motion.div 
                      key={index} 
                      className={`rounded-xl p-6 ${
                        darkMode ? 'bg-dark-800/60' : 'bg-gray-50/80'
                      }`}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex justify-between items-center mb-3">
                        <span className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>{item.category}</span>
                        <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{item.amount} locked</span>
                      </div>
                      <div className={`w-full rounded-full h-3 ${
                        darkMode ? 'bg-dark-700' : 'bg-gray-200'
                      }`}>
                        <motion.div 
                          className="bg-gradient-to-r from-primary-500 to-secondary-500 h-3 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${item.locked}%` }}
                          transition={{ duration: 1, delay: index * 0.1 }}
                        ></motion.div>
                      </div>
                      <div className={`mt-2 text-right text-sm ${
                        darkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {item.locked}% locked
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                <div className={`mt-8 p-6 rounded-xl border ${
                  darkMode 
                    ? 'bg-gradient-to-r from-primary-500/10 to-secondary-500/10 border-primary-500/20' 
                    : 'bg-gradient-to-r from-primary-100/60 to-secondary-100/60 border-primary-200/40'
                }`}>
                  <h4 className={`font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>🔒 Unlock Schedule</h4>
                  <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                    45% of total tokens are locked with a 9-year vesting schedule. 2.5% will unlock every 6 months to ensure market stability.
                  </p>
                </div>
              </div>
            </FadeInWhenVisible>
          )}
          
          {activeTab === 'utility' && (
            <FadeInWhenVisible>
              <div>
                <h3 className={`text-3xl font-heading font-bold mb-8 text-center ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  PRN Token Utility & Benefits
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <motion.div 
                      className={`rounded-xl p-6 border ${
                        darkMode 
                          ? 'bg-gradient-to-br from-blue-900/30 to-blue-800/30 border-blue-600/30' 
                          : 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200/50'
                      }`}
                      whileHover={{ scale: 1.02 }}
                    >
                      <h4 className={`text-xl font-semibold mb-3 flex items-center ${
                        darkMode ? 'text-blue-200' : 'text-blue-900'
                      }`}>
                        💳 <span className="ml-2">Payment & Transactions</span>
                      </h4>
                      <p className={darkMode ? 'text-blue-300' : 'text-blue-800'}>
                        Use PRN for payments with 18 partner companies and receive up to 10% discounts on purchases.
                      </p>
                    </motion.div>
                    
                    <motion.div 
                      className={`rounded-xl p-6 border ${
                        darkMode 
                          ? 'bg-gradient-to-br from-green-900/30 to-green-800/30 border-green-600/30' 
                          : 'bg-gradient-to-br from-green-50 to-green-100 border-green-200/50'
                      }`}
                      whileHover={{ scale: 1.02 }}
                    >
                      <h4 className={`text-xl font-semibold mb-3 flex items-center ${
                        darkMode ? 'text-green-200' : 'text-green-900'
                      }`}>
                        🏠 <span className="ml-2">Investment Access</span>
                      </h4>
                      <p className={darkMode ? 'text-green-300' : 'text-green-800'}>
                        Direct investment opportunities in real estate, gold, metals, and other assets through partner network.
                      </p>
                    </motion.div>
                    
                    <motion.div 
                      className={`rounded-xl p-6 border ${
                        darkMode 
                          ? 'bg-gradient-to-br from-purple-900/30 to-purple-800/30 border-purple-600/30' 
                          : 'bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200/50'
                      }`}
                      whileHover={{ scale: 1.02 }}
                    >
                      <h4 className={`text-xl font-semibold mb-3 flex items-center ${
                        darkMode ? 'text-purple-200' : 'text-purple-900'
                      }`}>
                        🛡️ <span className="ml-2">Investment Guarantee</span>
                      </h4>
                      <p className={darkMode ? 'text-purple-300' : 'text-purple-800'}>
                        PRN can be used as collateral and guarantee for various investment opportunities, providing security.
                      </p>
                    </motion.div>
                  </div>
                  
                  <div className="space-y-6">
                    <motion.div 
                      className={`rounded-xl p-6 border ${
                        darkMode 
                          ? 'bg-gradient-to-br from-yellow-900/30 to-yellow-800/30 border-yellow-600/30' 
                          : 'bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200/50'
                      }`}
                      whileHover={{ scale: 1.02 }}
                    >
                      <h4 className={`text-xl font-semibold mb-3 flex items-center ${
                        darkMode ? 'text-yellow-200' : 'text-yellow-900'
                      }`}>
                        🚀 <span className="ml-2">Value Appreciation</span>
                      </h4>
                      <p className={darkMode ? 'text-yellow-300' : 'text-yellow-800'}>
                        Token value increases with demand and adoption. Deflationary mechanisms through burning reduce supply.
                      </p>
                    </motion.div>
                    
                    <motion.div 
                      className={`rounded-xl p-6 border ${
                        darkMode 
                          ? 'bg-gradient-to-br from-red-900/30 to-red-800/30 border-red-600/30' 
                          : 'bg-gradient-to-br from-red-50 to-red-100 border-red-200/50'
                      }`}
                      whileHover={{ scale: 1.02 }}
                    >
                      <h4 className={`text-xl font-semibold mb-3 flex items-center ${
                        darkMode ? 'text-red-200' : 'text-red-900'
                      }`}>
                        💰 <span className="ml-2">Staking Rewards</span>
                      </h4>
                      <p className={darkMode ? 'text-red-300' : 'text-red-800'}>
                        Earn rewards by staking PRN tokens and participating in network security and governance.
                      </p>
                    </motion.div>
                    
                    <motion.div 
                      className={`rounded-xl p-6 border ${
                        darkMode 
                          ? 'bg-gradient-to-br from-indigo-900/30 to-indigo-800/30 border-indigo-600/30' 
                          : 'bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200/50'
                      }`}
                      whileHover={{ scale: 1.02 }}
                    >
                      <h4 className={`text-xl font-semibold mb-3 flex items-center ${
                        darkMode ? 'text-indigo-200' : 'text-indigo-900'
                      }`}>
                        🌐 <span className="ml-2">Global Ecosystem</span>
                      </h4>
                      <p className={darkMode ? 'text-indigo-300' : 'text-indigo-800'}>
                        Integration with 18 global companies across finance, real estate, insurance, and trading sectors.
                      </p>
                    </motion.div>
                  </div>
                </div>
              </div>
            </FadeInWhenVisible>
          )}
        </div>

        {/* CTA Section */}
        <FadeInWhenVisible>
          <div className={`text-center rounded-3xl p-12 border ${
            darkMode 
              ? 'bg-gradient-to-r from-primary-500/10 via-secondary-500/10 to-primary-500/10 border-primary-500/20' 
              : 'bg-gradient-to-r from-primary-100/60 via-secondary-100/60 to-primary-100/60 border-primary-200/40'
          }`}>
            <h3 className={`text-3xl font-heading font-bold mb-4 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Ready to Join the Pronova Ecosystem?
            </h3>
            <p className={`text-xl mb-8 max-w-3xl mx-auto ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Get your PRN tokens now and be part of the revolutionary cryptocurrency with real-world utility
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="gradient"
                size="large"
                to="#presale"
                className="px-8 py-4 text-lg font-semibold"
              >
                🚀 Buy PRN Tokens
              </Button>
              <Button 
                variant="outline"
                size="large"
                to="/whitepaper#tokenomics"
                className="px-8 py-4 text-lg font-semibold"
              >
                📄 Full Tokenomics
              </Button>
            </div>
          </div>
        </FadeInWhenVisible>
      </div>
    </section>
  );
};

export default EnhancedTokenomicsSection;