import React from 'react';
import { motion } from 'framer-motion';
import { FaArrowRight, FaFileAlt } from 'react-icons/fa';
import { useTheme } from '../../../context/ThemeContext';
import Button from '../../ui/Button';
import EnhancedCountdownTimer from '../../ui/EnhancedCountdownTimer';
import pronovaCoinLogo from '../../../assets/images/logos for partner/pronova coin.png';

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

const EnhancedHeroSection = () => {
  const { darkMode } = useTheme();
  
  // Presale Phase 1 end date
  const presalePhase1EndDate = new Date('2025-06-30T23:59:59');
  
  return (
    <section className={`relative min-h-screen flex items-center pt-32 pb-24 overflow-hidden ${
      darkMode 
        ? 'bg-gradient-to-b from-dark-900 to-primary-900/10' 
        : 'bg-white'
    }`}>
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full z-0">
        <div className={`absolute top-0 left-0 w-full h-full opacity-30 ${
          darkMode 
            ? 'bg-gradient-to-b from-primary-900/30 to-dark-900' 
            : 'bg-gradient-to-b from-primary-50/10 to-transparent'
        }`}></div>
        
        {/* Purple gradient shape only - improved and smaller */}
        <AnimatedShape 
          className="absolute rounded-full w-[300px] h-[300px] top-[10%] right-[25%]" 
          darkMode={darkMode}
          duration={25}
        />
      </div>
      
      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 xl:gap-12 items-center">
          {/* Left column: Text content */}
          <div className="xl:col-span-7 text-center xl:text-left order-2 xl:order-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className={`inline-flex items-center py-1.5 px-4 rounded-full backdrop-blur-sm border mb-6 ${
                darkMode 
                  ? 'bg-primary-600/20 border-primary-600/30' 
                  : 'bg-primary-100/60 border-primary-200/40'
              }`}>
                <span className="w-2 h-2 bg-primary-500 rounded-full mr-2 animate-pulse"></span>
                <span className={`text-sm font-medium ${
                  darkMode ? 'text-primary-400' : 'text-primary-700'
                }`}>Presale Phase 1 Live</span>
              </div>
              
              <h1 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-heading font-bold mb-6 leading-tight ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                The <span className="gradient-text">Future</span> of <br className="hidden sm:block" />
                Financial <span className="gradient-text">Investment</span>
              </h1>
              
              <p className={`text-lg md:text-xl mb-8 max-w-xl mx-auto xl:mx-0 leading-relaxed ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Pronova bridges traditional business with cryptocurrency, offering real-world utility through 18 global partner companies.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center gap-5 mb-10">
                <Button 
                  variant="gradient"
                  size="large"
                  to="#presale"
                  className="w-full sm:w-auto"
                >
                  <span>Join Presale</span>
                  <FaArrowRight className="ml-2" />
                </Button>
                
                <Button 
                  variant="outline"
                  size="large"
                  to="/whitepaper"
                  className="w-full sm:w-auto"
                >
                  <FaFileAlt className="mr-2" />
                  <span>Whitepaper</span>
                </Button>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 border rounded-xl p-4 md:p-6 backdrop-blur-sm ${
                darkMode 
                  ? 'border-primary-600/20 bg-primary-600/5' 
                  : 'border-primary-200/40 bg-primary-50/30'
              }`}>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-heading font-bold gradient-text mb-1">1B</div>
                  <div className={`text-xs md:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Supply</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-heading font-bold gradient-text mb-1">$0.80</div>
                  <div className={`text-xs md:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Current Price</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-heading font-bold gradient-text mb-1">ETH</div>
                  <div className={`text-xs md:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Blockchain</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-heading font-bold gradient-text mb-1">18</div>
                  <div className={`text-xs md:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Partners</div>
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* Right column: Animated 3D Token and Countdown */}
          <div className="xl:col-span-5 order-1 xl:order-2">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="relative"
            >
              {/* Enhanced 3D Token Visualization */}
              <div className="relative mx-auto mb-8 max-w-sm xl:max-w-none">
                {/* Animated Rings */}
                <div className="absolute inset-0 animate-spin-slow">
                  <div className={`w-64 h-64 sm:w-72 sm:h-72 xl:w-80 xl:h-80 rounded-full border-2 mx-auto ${
                    darkMode ? 'border-primary-500/20' : 'border-primary-300/30'
                  }`}></div>
                </div>
                <div className="absolute inset-2 sm:inset-3 xl:inset-4 animate-spin-slow-reverse">
                  <div className={`w-60 h-60 sm:w-64 sm:h-64 xl:w-72 xl:h-72 rounded-full border mx-auto ${
                    darkMode ? 'border-secondary-500/30' : 'border-secondary-300/40'
                  }`}></div>
                </div>
                
                {/* Main Token Container */}
                <div className="w-48 h-48 sm:w-56 sm:h-56 xl:w-64 xl:h-64 mx-auto relative">
                  {/* Glow Effect */}
                  <div className={`absolute inset-0 rounded-full blur-xl animate-pulse-slow ${
                    darkMode 
                      ? 'bg-gradient-to-br from-primary-500/40 to-secondary-600/40' 
                      : 'bg-gradient-to-br from-primary-300/30 to-secondary-400/30'
                  }`}></div>
                  
                  {/* Token Background */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary-500 to-secondary-600 shadow-neon-strong animate-float"></div>
                  <div className={`absolute inset-2 rounded-full backdrop-blur-sm ${
                    darkMode ? 'bg-dark-900/95' : 'bg-white/95'
                  }`}></div>
                  
                  {/* Token Logo */}
                  <div className="absolute inset-0 flex items-center justify-center p-8 sm:p-10 xl:p-12">
                    <img 
                      src={pronovaCoinLogo} 
                      alt="Pronova Coin" 
                      className="w-full h-full object-contain filter drop-shadow-2xl animate-float"
                      style={{ animationDelay: '1s' }}
                    />
                  </div>
                  
                  {/* Orbiting Elements */}
                  {[...Array(6)].map((_, i) => (
                    <div 
                      key={i}
                      className="absolute w-full h-full animate-spin-slow"
                      style={{ 
                        animationDelay: `${i * 2}s`,
                        animationDuration: `${20 + i * 5}s`
                      }}
                    >
                      <div 
                        className={`absolute w-2 h-2 rounded-full shadow-lg ${
                          i % 2 === 0 ? 'bg-primary-400' : 'bg-secondary-400'
                        }`}
                        style={{
                          top: `${10 + i * 15}%`,
                          left: '50%',
                          transform: 'translateX(-50%)'
                        }}
                      ></div>
                    </div>
                  ))}
                </div>
                
                {/* Floating Particles */}
                {[...Array(8)].map((_, i) => (
                  <div
                    key={`particle-${i}`}
                    className={`absolute w-1 h-1 rounded-full opacity-60 animate-float ${
                      i % 3 === 0 ? 'bg-primary-400' : i % 3 === 1 ? 'bg-secondary-400' : darkMode ? 'bg-white' : 'bg-gray-700'
                    }`}
                    style={{
                      top: `${20 + Math.random() * 60}%`,
                      left: `${20 + Math.random() * 60}%`,
                      animationDelay: `${Math.random() * 4}s`,
                      animationDuration: `${3 + Math.random() * 4}s`
                    }}
                  ></div>
                ))}
              </div>
              
              {/* Enhanced Countdown and Presale Info */}
              <div className={`backdrop-blur-xl border rounded-2xl p-4 sm:p-6 xl:p-8 shadow-2xl max-w-md xl:max-w-none mx-auto ${
                darkMode 
                  ? 'bg-gradient-to-br from-dark-900/95 to-dark-800/95 border-primary-500/30' 
                  : 'bg-gradient-to-br from-white/95 to-gray-50/95 border-primary-300/40'
              }`}>
                <div className="text-center mb-6">
                  <div className={`inline-flex items-center px-3 py-1 rounded-full border mb-3 ${
                    darkMode 
                      ? 'bg-primary-500/20 border-primary-500/30' 
                      : 'bg-primary-100/60 border-primary-200/40'
                  }`}>
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                    <span className={`text-xs font-medium ${
                      darkMode ? 'text-primary-300' : 'text-primary-700'
                    }`}>PHASE 1 ACTIVE</span>
                  </div>
                  <h2 className="text-lg md:text-xl lg:text-2xl font-heading font-bold mb-2 gradient-text">
                    Presale Phase 1 Ending Soon
                  </h2>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Don't miss this opportunity</p>
                </div>
                
                <EnhancedCountdownTimer 
                  targetDate={presalePhase1EndDate} 
                  phase={1}
                  className="mb-8"
                />
                
                {/* Progress Section */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-3">
                    <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Progress</span>
                    <span className="text-sm font-bold text-primary-400">45%</span>
                  </div>
                  <div className={`w-full rounded-full h-3 overflow-hidden shadow-inner ${
                    darkMode ? 'bg-dark-700' : 'bg-gray-200'
                  }`}>
                    <div className="bg-gradient-to-r from-primary-500 via-primary-400 to-secondary-500 h-3 rounded-full transition-all duration-1000 ease-out shadow-lg" 
                         style={{ width: '45%' }}>
                      <div className="h-full bg-white/20 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                </div>
                
                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-6 text-center">
                  <div className={`rounded-lg p-2 sm:p-3 border ${
                    darkMode 
                      ? 'bg-dark-800/60 border-primary-600/10' 
                      : 'bg-white/60 border-primary-200/20'
                  }`}>
                    <div className={`text-sm sm:text-base xl:text-lg font-bold ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>$36M</div>
                    <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Raised</div>
                  </div>
                  <div className={`rounded-lg p-2 sm:p-3 border ${
                    darkMode 
                      ? 'bg-dark-800/60 border-primary-600/10' 
                      : 'bg-white/60 border-primary-200/20'
                  }`}>
                    <div className="text-sm sm:text-base xl:text-lg font-bold text-primary-400">$0.80</div>
                    <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Price</div>
                  </div>
                  <div className={`rounded-lg p-2 sm:p-3 border ${
                    darkMode 
                      ? 'bg-dark-800/60 border-primary-600/10' 
                      : 'bg-white/60 border-primary-200/20'
                  }`}>
                    <div className={`text-sm sm:text-base xl:text-lg font-bold ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>$80M</div>
                    <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Goal</div>
                  </div>
                </div>
                
                <Button 
                  variant="gradient"
                  size="large"
                  to="#presale"
                  fullWidth
                  className="text-lg font-semibold py-4 shadow-xl hover:shadow-2xl transition-all duration-300"
                >
                  🚀 Buy PRN Tokens Now
                </Button>
                
                <p className={`text-xs text-center mt-3 ${
                  darkMode ? 'text-gray-500' : 'text-gray-600'
                }`}>
                  Next phase starts at $1.00 per token
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Wave separator */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden line-height-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className={`w-full h-16 ${
          darkMode ? 'text-dark-800' : 'text-gray-50'
        }`}>
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.27C57.71,118.14,136.14,104.9,187.95,88.38Z" fill="currentColor"></path>
        </svg>
      </div>
    </section>
  );
};

export default EnhancedHeroSection;