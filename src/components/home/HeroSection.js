import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowRight, FaFileAlt, FaRocket, FaChartLine, FaShieldAlt, FaCode } from 'react-icons/fa';
import { BiCoin } from 'react-icons/bi';
import Button from '../ui/Button';
import CountdownTimer from '../ui/CountdownTimer';
import { useTheme } from '../../context/ThemeContext';

const HeroSection = () => {
  const { darkMode } = useTheme();

  // Animated code lines for tech effect
  const codeLines = [
    { icon: <FaCode size={20} />, delay: 1, offsetX: '15%', offsetY: '30%', duration: 16, className: 'text-primary-400/50 floating-coin' },
    { icon: <FaCode size={16} />, delay: 6, offsetX: '70%', offsetY: '25%', duration: 19, className: 'text-secondary-500/50 floating-coin' },
    { icon: <FaCode size={22} />, delay: 3, offsetX: '85%', offsetY: '70%', duration: 21, className: 'text-primary-500/50 floating-coin' },
  ];

  // Presale Phase 1 end date (based on whitepaper roadmap)
  const presalePhase1EndDate = new Date('2025-07-30T23:59:59');
  
  // State for animated text cycling
  const [textIndex, setTextIndex] = useState(0);
  const animatedTexts = ['Investment', 'Finance', 'Business', 'Future'];
  
  // Effect for cycling through text options
  useEffect(() => {
    const interval = setInterval(() => {
      setTextIndex((prevIndex) => (prevIndex + 1) % animatedTexts.length);
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  // Animated coin floating elements
  const floatingCoins = [
    { icon: <BiCoin size={30} />, delay: 0, offsetX: '10%', offsetY: '20%', duration: 18, className: 'text-primary-500/60 floating-coin' },
    { icon: <BiCoin size={24} />, delay: 5, offsetX: '25%', offsetY: '40%', duration: 15, className: 'text-primary-400/60 floating-coin' },
    { icon: <BiCoin size={20} />, delay: 10, offsetX: '60%', offsetY: '15%', duration: 20, className: 'text-secondary-500/60 floating-coin' },
    { icon: <BiCoin size={26} />, delay: 2, offsetX: '80%', offsetY: '60%', duration: 22, className: 'text-primary-500/60 floating-coin' },
    { icon: <BiCoin size={18} />, delay: 8, offsetX: '40%', offsetY: '80%', duration: 17, className: 'text-secondary-500/60 floating-coin' }
  ];
  
  return (
    <section className={`min-h-screen pt-32 pb-24 md:pt-0 md:pb-0 relative overflow-hidden ${
      darkMode 
        ? 'bg-gradient-to-b from-dark-900 to-primary-900/10' 
        : 'bg-gradient-to-b from-gray-50 to-primary-50/30'
    } flex items-center grid-pattern`}>
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 z-0">
        {/* Powerful top-left lighting effect - الإضاءة القوية من الشمال */}
        <motion.div
          className="absolute w-[800px] h-[600px] rounded-full z-0"
          style={{
            background: darkMode 
              ? 'radial-gradient(circle, rgba(124, 66, 255, 0.4) 0%, rgba(92, 39, 254, 0.25) 30%, rgba(124, 66, 255, 0.1) 60%, transparent 100%)'
              : 'radial-gradient(circle, rgba(124, 66, 255, 0.3) 0%, rgba(92, 39, 254, 0.2) 30%, rgba(124, 66, 255, 0.08) 60%, transparent 100%)',
            filter: 'blur(120px)',
            top: '-20%',
            left: '-25%'
          }}
          animate={{
            opacity: [0.8, 1, 0.8],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        {/* Secondary ambient light */}
        <motion.div
          className="absolute w-[500px] h-[400px] rounded-full z-0"
          style={{
            background: darkMode 
              ? 'radial-gradient(circle, rgba(222, 199, 255, 0.3) 0%, rgba(124, 66, 255, 0.15) 40%, transparent 80%)'
              : 'radial-gradient(circle, rgba(222, 199, 255, 0.25) 0%, rgba(124, 66, 255, 0.12) 40%, transparent 80%)',
            filter: 'blur(100px)',
            top: '0%',
            left: '5%'
          }}
          animate={{
            opacity: [0.6, 0.9, 0.6],
            x: [0, 40, 0],
            y: [0, 25, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
        
        {/* Bright accent light */}
        <motion.div
          className="absolute w-[300px] h-[300px] rounded-full z-0"
          style={{
            background: darkMode 
              ? 'radial-gradient(circle, rgba(147, 97, 255, 0.5) 0%, rgba(124, 66, 255, 0.2) 50%, transparent 100%)'
              : 'radial-gradient(circle, rgba(147, 97, 255, 0.4) 0%, rgba(124, 66, 255, 0.15) 50%, transparent 100%)',
            filter: 'blur(80px)',
            top: '-5%',
            left: '-10%'
          }}
          animate={{
            opacity: [0.7, 1, 0.7],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
        
        {/* Purple gradient shape - made smaller and more subtle (الشكل البنفسجي المحسن) */}
        <motion.div
          className={`absolute w-[300px] h-[300px] rounded-full ${
            darkMode 
              ? 'bg-gradient-to-r from-primary-500/12 via-primary-400/8 to-primary-300/4' 
              : 'bg-gradient-to-r from-primary-200/25 via-primary-100/15 to-primary-50/8'
          } blur-[80px] z-0`}
          animate={{
            x: ['-5%', '10%', '-5%'],
            y: ['-5%', '15%', '-5%'],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
          style={{ top: '15%', right: '25%' }}
        />
        
        {/* Enhanced shimmer light rays from top-left */}
        <motion.div
          className="absolute w-[800px] h-[4px] z-0"
          style={{
            background: darkMode 
              ? 'linear-gradient(90deg, transparent 0%, rgba(124, 66, 255, 0.6) 50%, transparent 100%)'
              : 'linear-gradient(90deg, transparent 0%, rgba(124, 66, 255, 0.4) 50%, transparent 100%)',
            filter: 'blur(2px)',
            top: '8%',
            left: '-15%',
            transform: 'rotate(38deg)'
          }}
          animate={{
            opacity: [0.5, 1, 0.5],
            scaleX: [1, 1.1, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        <motion.div
          className="absolute w-[600px] h-[3px] z-0"
          style={{
            background: darkMode 
              ? 'linear-gradient(90deg, transparent 0%, rgba(222, 199, 255, 0.5) 50%, transparent 100%)'
              : 'linear-gradient(90deg, transparent 0%, rgba(222, 199, 255, 0.35) 50%, transparent 100%)',
            filter: 'blur(2px)',
            top: '12%',
            left: '-10%',
            transform: 'rotate(32deg)'
          }}
          animate={{
            opacity: [0.4, 0.8, 0.4],
            scaleX: [1, 1.05, 1],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.5,
          }}
        />
        
        <motion.div
          className="absolute w-[700px] h-[2px] z-0"
          style={{
            background: darkMode 
              ? 'linear-gradient(90deg, transparent 0%, rgba(147, 97, 255, 0.4) 50%, transparent 100%)'
              : 'linear-gradient(90deg, transparent 0%, rgba(147, 97, 255, 0.3) 50%, transparent 100%)',
            filter: 'blur(3px)',
            top: '4%',
            left: '-18%',
            transform: 'rotate(45deg)'
          }}
          animate={{
            opacity: [0.3, 0.7, 0.3],
            scaleX: [1, 1.08, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3,
          }}
        />
        
        {/* Grid pattern overlay */}
        <div 
          className={`absolute inset-0 ${darkMode ? 'opacity-8' : 'opacity-5'}`}
          style={{ 
            backgroundImage: `linear-gradient(${darkMode ? '#5C27FE' : '#5C27FE'} 1px, transparent 1px), linear-gradient(to right, ${darkMode ? '#5C27FE' : '#5C27FE'} 1px, transparent 1px)`, 
            backgroundSize: '40px 40px' 
          }}
        />
        
        {/* Floating code symbols */}
        {codeLines.map((code, index) => (
          <motion.div
            key={`code-${index}`}
            className={`absolute z-0 ${darkMode ? code.className : 'text-primary-400/30 floating-coin'}`}
            animate={{
              y: [0, -30, 0],
              x: [0, 10, 0],
              rotate: [0, 5, 0, -5, 0],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{
              duration: code.duration,
              repeat: Infinity,
              repeatType: "reverse",
              delay: code.delay,
              ease: "easeInOut"
            }}
            style={{ 
              left: code.offsetX, 
              top: code.offsetY 
            }}
          >
            {code.icon}
          </motion.div>
        ))}
        
        {/* Floating coins animation */}
        {floatingCoins.map((coin, index) => (
          <motion.div
            key={index}
            className={`absolute z-0 ${darkMode ? coin.className : 'text-primary-500/40 floating-coin'}`}
            animate={{
              y: [0, -40, 0],
              x: [0, 15, 0],
              rotate: [0, 10, 0, -10, 0],
              opacity: [0.4, 0.7, 0.4]
            }}
            transition={{
              duration: coin.duration,
              repeat: Infinity,
              repeatType: "reverse",
              delay: coin.delay,
              ease: "easeInOut"
            }}
            style={{ 
              left: coin.offsetX, 
              top: coin.offsetY 
            }}
          >
            {coin.icon}
          </motion.div>
        ))}
      </div>

      {/* Main Content */}
      <div className="container-custom relative z-10 py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left column: Text content - 7 columns on large screens */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <div className="relative mb-6">
                <div className={`${
                  darkMode 
                    ? 'bg-gradient-to-r from-primary-600/20 to-primary-500/5 backdrop-blur-sm border border-primary-600/20' 
                    : 'bg-gradient-to-r from-primary-100/60 to-primary-50/40 backdrop-blur-sm border border-primary-200/40'
                } rounded-2xl p-1.5 inline-flex items-center`}>
                  <span className="bg-primary-600 rounded-xl text-white text-xs py-1 px-3 mr-2">NEW</span>
                  <span className={`text-sm font-medium ${
                    darkMode ? 'text-primary-400' : 'text-primary-700'
                  } pr-3`}>Revolutionary Cryptocurrency by Capimax</span>
                </div>
              </div>
              
              <h1 className={`text-4xl md:text-5xl lg:text-7xl font-heading font-bold mb-6 ${
                darkMode ? 'text-white' : 'text-gray-900'
              } leading-tight`}>
                The Future of{" "}
                <span className="relative inline-block">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={textIndex}
                      className="gradient-text absolute"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.5 }}
                    >
                      {animatedTexts[textIndex]}
                    </motion.span>
                  </AnimatePresence>
                  <span className="invisible">{animatedTexts[0]}</span>
                </span>
                <br className="md:hidden" /> is Here
              </h1>
              
              <p className={`text-lg md:text-xl ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              } mb-8 max-w-xl leading-relaxed`}>
                Pronova bridges the gap between traditional business practices 
                and cryptocurrency, revolutionizing the investment landscape with powerful
                technology and unique financial strategies.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center gap-6 mb-12">
                <Button 
                  variant="gradient"
                  size="large"
                  to="#presale"
                  className="w-full sm:w-auto group"
                >
                  Join Presale
                  <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                
                <Button 
                  variant="outline"
                  size="large"
                  to="/whitepaper"
                  className="w-full sm:w-auto"
                >
                  <FaFileAlt className="mr-2" />
                  Whitepaper
                </Button>
              </div>
              
              {/* Key metrics in pills */}
              <div className="flex flex-wrap gap-4 mt-4">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className={`${
                    darkMode 
                      ? 'bg-dark-800/60 backdrop-blur-sm border border-primary-600/20' 
                      : 'bg-white/70 backdrop-blur-sm border border-primary-200/40 shadow-sm'
                  } rounded-full py-2 px-4 flex items-center`}
                >
                  <div className="bg-primary-600/30 rounded-full p-1.5 mr-2">
                    <BiCoin size={18} className="text-primary-400" />
                  </div>
                  <span className={`font-heading font-bold ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  } mr-2`}>1B</span>
                  <span className={`text-sm ${
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>Total Supply</span>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className={`${
                    darkMode 
                      ? 'bg-dark-800/60 backdrop-blur-sm border border-primary-600/20' 
                      : 'bg-white/70 backdrop-blur-sm border border-primary-200/40 shadow-sm'
                  } rounded-full py-2 px-4 flex items-center`}
                >
                  <div className="bg-primary-600/30 rounded-full p-1.5 mr-2">
                    <FaRocket size={18} className="text-primary-400" />
                  </div>
                  <span className={`font-heading font-bold ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  } mr-2`}>ETH</span>
                  <span className={`text-sm ${
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>Blockchain</span>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className={`${
                    darkMode 
                      ? 'bg-dark-800/60 backdrop-blur-sm border border-primary-600/20' 
                      : 'bg-white/70 backdrop-blur-sm border border-primary-200/40 shadow-sm'
                  } rounded-full py-2 px-4 flex items-center`}
                >
                  <div className="bg-primary-600/30 rounded-full p-1.5 mr-2">
                    <FaShieldAlt size={18} className="text-primary-400" />
                  </div>
                  <span className={`font-heading font-bold ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  } mr-2`}>18</span>
                  <span className={`text-sm ${
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>Partners</span>
                </motion.div>
              </div>
            </motion.div>
          </div>
          
          {/* Right column: Countdown and Token Info - 5 columns on large screens */}
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="relative"
            >
              {/* Animated circle highlights */}
              <div className={`absolute inset-0 -m-4 ${
                darkMode 
                  ? 'bg-gradient-to-r from-primary-600/20 to-primary-400/10' 
                  : 'bg-gradient-to-r from-primary-200/30 to-primary-100/20'
              } rounded-3xl blur-xl opacity-80 animate-pulse-slow`}></div>
              
              {/* Main card */}
              <div className={`card relative p-6 md:p-8 ${
                darkMode 
                  ? 'border border-primary-600/30 backdrop-blur-lg shadow-neon bg-dark-900/70' 
                  : 'border border-primary-200/40 backdrop-blur-lg shadow-lg bg-white/80'
              } rounded-2xl overflow-hidden z-10 group hover:shadow-neon-strong transition-all duration-300`}>
                {/* Animated glow effect */}
                <div className={`absolute -inset-0.5 bg-gradient-to-r from-primary-600 to-primary-400 rounded-2xl blur ${
                  darkMode ? 'opacity-20 group-hover:opacity-30' : 'opacity-10 group-hover:opacity-20'
                } transition duration-1000 animate-pulse-slow -z-10`}></div>
                
                {/* Shiny edge effect */}
                <div className="absolute inset-0 overflow-hidden">
                  <motion.div 
                    className="w-1/2 h-px bg-gradient-to-r from-transparent via-primary-400 to-transparent absolute top-0"
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 3, repeat: Infinity, repeatDelay: 7 }}
                  />
                  <motion.div 
                    className="w-1/2 h-px bg-gradient-to-r from-transparent via-primary-400 to-transparent absolute bottom-0"
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 3, repeat: Infinity, repeatDelay: 7, delay: 1 }}
                  />
                  <motion.div 
                    className="h-1/2 w-px bg-gradient-to-b from-transparent via-primary-400 to-transparent absolute left-0"
                    animate={{ y: ['-100%', '200%'] }}
                    transition={{ duration: 3, repeat: Infinity, repeatDelay: 7, delay: 1.5 }}
                  />
                  <motion.div 
                    className="h-1/2 w-px bg-gradient-to-b from-transparent via-primary-400 to-transparent absolute right-0"
                    animate={{ y: ['-100%', '200%'] }}
                    transition={{ duration: 3, repeat: Infinity, repeatDelay: 7, delay: 2 }}
                  />
                </div>
                
                <div className="text-center mb-8 relative">
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                  >
                    <motion.div
                      className="inline-flex mb-6 bg-gradient-to-r from-primary-600/40 to-primary-400/20 backdrop-blur-sm rounded-full px-4 py-1.5 border border-primary-600/30"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center">
                        <FaChartLine className="text-primary-400 mr-2" />
                        <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>Presale Phase 1 Active</span>
                      </div>
                    </motion.div>
                  </motion.div>
                  
                  <h2 className="text-2xl md:text-3xl font-heading font-bold mb-2 gradient-text">
                    Pronova Token (PRN)
                  </h2>
                  <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                    Don't miss out on the opportunity to be part of the future
                  </p>
                </div>
                
                <CountdownTimer 
                  targetDate={presalePhase1EndDate} 
                  phase={1}
                  variant="gradient"
                  className="mb-8"
                />
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className={`relative group overflow-hidden ${
                    darkMode 
                      ? 'bg-primary-600/10 backdrop-blur-sm border border-primary-600/30 hover:bg-primary-600/20' 
                      : 'bg-primary-50/50 backdrop-blur-sm border border-primary-200/40 hover:bg-primary-100/60'
                  } p-4 rounded-xl transition-all duration-300 hover:border-primary-500/50`}>
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-600/0 to-primary-500/0 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Current Price</div>
                    <div className={`text-xl font-heading font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>$0.80</div>
                  </div>
                  
                  <div className={`relative group overflow-hidden ${
                    darkMode 
                      ? 'bg-primary-600/10 backdrop-blur-sm border border-primary-600/30 hover:bg-primary-600/20' 
                      : 'bg-primary-50/50 backdrop-blur-sm border border-primary-200/40 hover:bg-primary-100/60'
                  } p-4 rounded-xl transition-all duration-300 hover:border-primary-500/50`}>
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-600/0 to-primary-500/0 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Next Phase</div>
                    <div className={`text-xl font-heading font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>$1.00</div>
                  </div>
                </div>
                
                <div className="relative mb-4">
                  <div className="flex justify-between mb-2 text-sm">
                    <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Progress:</span>
                    <span className="font-medium text-primary-400">45% of target</span>
                  </div>
                  
                  <div className={`w-full ${darkMode ? 'bg-dark-800/80' : 'bg-gray-200'} rounded-full h-3 mb-4 overflow-hidden`}>
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: '45%' }}
                      transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                      className="h-full relative"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-500 rounded-full"></div>
                      <div className="absolute inset-0 bg-gradient-to-r from-primary-600/60 to-primary-400/60 rounded-full blur-sm"></div>
                    </motion.div>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>$36M raised</span>
                    <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>$80M goal</span>
                  </div>
                </div>
                
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                >
                  <Button 
                    variant="gradient"
                    size="large"
                    to="#presale"
                    fullWidth
                    className="mt-4 relative overflow-hidden group shadow-neon-strong"
                  >
                    <span className="relative z-10 flex items-center">
                      Buy PRN Tokens Now
                      <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-primary-700 to-primary-600"
                      initial={{ x: "100%" }}
                      whileHover={{ x: "0%" }}
                      transition={{ duration: 0.4 }}
                    />
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;