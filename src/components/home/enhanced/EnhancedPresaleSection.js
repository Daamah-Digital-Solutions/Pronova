import React from 'react';
import { motion } from 'framer-motion';
import { FaEthereum, FaArrowRight, FaCoins, FaWallet, FaExchangeAlt } from 'react-icons/fa';
import { SiTether } from 'react-icons/si';
import { useTheme } from '../../../context/ThemeContext';
import Button from '../../ui/Button';
import EnhancedCountdownTimer from '../../ui/EnhancedCountdownTimer';

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

// Animated background shape component - improved for light/dark mode
const AnimatedShape = ({ className, delay = 0, duration = 20, darkMode }) => (
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
      duration,
      delay,
      repeat: Infinity,
      repeatType: "reverse" 
    }}
  />
);

// Enhanced Phase Card Component
const EnhancedPhaseCard = ({ phase, status, price, totalRaised, tokenAmount, progress, endDate, darkMode }) => {
  // Status color styles
  const statusStyles = {
    active: "bg-primary-600 text-white",
    upcoming: "bg-primary-600/40 text-gray-200",
    completed: "bg-green-600 text-white"
  };
  
  // Using FaCoins as replacement for missing icons
  const FaHourglass = FaCoins;
  const FaCheck = FaCoins;
  
  return (
    <FadeInWhenVisible delay={0.1 * phase}>
      <div className={`rounded-xl overflow-hidden backdrop-blur-lg border transition-all duration-500
        ${darkMode 
          ? (status === 'active' 
              ? 'bg-dark-900/60 border-primary-500 shadow-neon-strong' 
              : status === 'completed' 
                ? 'bg-dark-900/60 border-green-500/50' 
                : 'bg-dark-900/60 border-primary-600/20')
          : (status === 'active' 
              ? 'bg-white/80 border-primary-500 shadow-lg' 
              : status === 'completed' 
                ? 'bg-white/80 border-green-500/50' 
                : 'bg-white/70 border-primary-200/30')
        }`
      }>
        <div className={`py-3 px-6 text-center font-heading ${statusStyles[status]}`}>
          <h3 className="font-bold">Phase {phase}</h3>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className={`border rounded-lg p-3 text-center ${
              darkMode 
                ? 'bg-dark-800/60 border-primary-600/10' 
                : 'bg-primary-50/50 border-primary-200/20'
            }`}>
              <div className={`text-xs mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Token Price</div>
              <div className={`text-xl font-heading font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{price}</div>
            </div>
            <div className={`border rounded-lg p-3 text-center ${
              darkMode 
                ? 'bg-dark-800/60 border-primary-600/10' 
                : 'bg-primary-50/50 border-primary-200/20'
            }`}>
              <div className={`text-xs mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Token Amount</div>
              <div className={`text-md font-heading font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{tokenAmount}</div>
            </div>
          </div>
          
          {status === 'active' && (
            <>
              <div className={`w-full rounded-full h-2 mb-2 overflow-hidden ${
                darkMode ? 'bg-dark-800' : 'bg-gray-200'
              }`}>
                <div 
                  className="bg-gradient-to-r from-primary-600 to-secondary-500 h-2 rounded-full"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              
              <div className="flex justify-between text-xs mb-5">
                <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>{progress}% completed</span>
                <span className="text-primary-400">${totalRaised * progress / 100}M raised</span>
              </div>
              
              <div className="mb-6">
                <EnhancedCountdownTimer 
                  targetDate={endDate} 
                  phase={phase} 
                  showTitle={false}
                  className="mt-2"
                />
              </div>
              
              <Button 
                variant="gradient"
                size="large"
                to="/dashboard"
                fullWidth
              >
                Buy Tokens Now
              </Button>
            </>
          )}
          
          {status === 'upcoming' && (
            <div className="py-4 text-center">
              <div className={`flex items-center justify-center mb-4 ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                <FaHourglass className="mr-2 text-primary-400" />
                <span>Coming soon after Phase {phase - 1}</span>
              </div>
              <Button 
                variant="outline"
                to="#"
                disabled
                size="large"
              >
                Not Active Yet
              </Button>
            </div>
          )}
          
          {status === 'completed' && (
            <div className="py-4 text-center">
              <div className="flex items-center justify-center mb-4 text-green-500">
                <FaCheck className="mr-2" />
                <span>Sold Out!</span>
              </div>
              <Button 
                variant="outline"
                className="bg-green-600/10 border-green-500/30 text-green-400"
                to="#"
                disabled
                size="large"
              >
                Completed
              </Button>
            </div>
          )}
        </div>
      </div>
    </FadeInWhenVisible>
  );
};

const EnhancedPresaleSection = () => {
  const { darkMode } = useTheme();
  
  // Presale phase end dates (based on whitepaper roadmap)
  const presalePhase1EndDate = new Date('2025-06-30T23:59:59');
  const presalePhase2EndDate = new Date('2025-07-30T23:59:59');
  const presalePhase3EndDate = new Date('2025-08-30T23:59:59');
  
  // Presale phases data from whitepaper
  const presalePhases = [
    {
      phase: 1,
      tokenAmount: "100M",
      price: "$0.80",
      totalRaised: 80,
      status: "active", // active, upcoming, completed
      progress: 45,
      endDate: presalePhase1EndDate
    },
    {
      phase: 2,
      tokenAmount: "75M",
      price: "$1.00",
      totalRaised: 75,
      status: "upcoming",
      progress: 0,
      endDate: presalePhase2EndDate
    },
    {
      phase: 3,
      tokenAmount: "75M",
      price: "$1.50",
      totalRaised: 112.5,
      status: "upcoming",
      progress: 0,
      endDate: presalePhase3EndDate
    }
  ];

  return (
    <section id="presale" className={`relative py-24 ${
      darkMode 
        ? 'bg-gradient-to-b from-dark-800 to-primary-900/5' 
        : 'bg-gray-50'
    }`}>
      <AnimatedShape 
        className="shape"
        darkMode={darkMode}
        duration={18}
      />
      
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

        {/* Presale Statistics */}
        <FadeInWhenVisible>
          <div className={`backdrop-blur-lg p-8 mb-16 grid grid-cols-2 md:grid-cols-4 gap-6 rounded-xl border ${
            darkMode 
              ? 'bg-dark-800/60 shadow-neon border-primary-600/20' 
              : 'bg-white/70 shadow-lg border-primary-200/30'
          }`}>
            <div className="text-center">
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-3 ${
                darkMode 
                  ? 'bg-primary-600/10 text-primary-400' 
                  : 'bg-primary-100/50 text-primary-600'
              }`}>
                <FaCoins size={20} />
              </div>
              <div className={`text-xs mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Token Supply</div>
              <div className={`text-xl font-heading font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>1,000,000,000</div>
              <div className="text-primary-400 text-xs">PRN</div>
            </div>
            
            <div className="text-center">
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-3 ${
                darkMode 
                  ? 'bg-primary-600/10 text-primary-400' 
                  : 'bg-primary-100/50 text-primary-600'
              }`}>
                <FaWallet size={20} />
              </div>
              <div className={`text-xs mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Tokens for Presale</div>
              <div className={`text-xl font-heading font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>250,000,000</div>
              <div className="text-primary-400 text-xs">25% of Supply</div>
            </div>
            
            <div className="text-center">
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-3 ${
                darkMode 
                  ? 'bg-primary-600/10 text-primary-400' 
                  : 'bg-primary-100/50 text-primary-600'
              }`}>
                <FaExchangeAlt size={20} />
              </div>
              <div className={`text-xs mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Expected Listing Price</div>
              <div className={`text-xl font-heading font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>$1.70 - $2.50</div>
              <div className="text-green-500 text-xs">+112.5% from Phase 1</div>
            </div>
            
            <div className="text-center">
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-3 ${
                darkMode 
                  ? 'bg-primary-600/10 text-primary-400' 
                  : 'bg-primary-100/50 text-primary-600'
              }`}>
                <FaArrowRight size={20} />
              </div>
              <div className={`text-xs mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Raise Goal</div>
              <div className={`text-xl font-heading font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>$267.5M</div>
              <div className="text-primary-400 text-xs">Across 3 Phases</div>
            </div>
          </div>
        </FadeInWhenVisible>

        {/* Presale Phases */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {presalePhases.map((phase) => (
            <EnhancedPhaseCard
              key={phase.phase}
              phase={phase.phase}
              tokenAmount={phase.tokenAmount}
              price={phase.price}
              totalRaised={phase.totalRaised}
              status={phase.status}
              progress={phase.progress}
              endDate={phase.endDate}
              darkMode={darkMode}
            />
          ))}
        </div>

        {/* How to Buy */}
        <FadeInWhenVisible>
          <div className={`p-8 mb-16 border backdrop-blur-lg rounded-xl ${
            darkMode 
              ? 'bg-dark-800/60 border-primary-600/20 shadow-neon' 
              : 'bg-white/70 border-primary-200/30 shadow-lg'
          }`}>
            <h3 className="text-2xl font-heading font-bold mb-10 text-center gradient-text">
              How to Buy Pronova Tokens
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-12">
              <div className="text-center relative">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 border ${
                  darkMode 
                    ? 'bg-primary-600/20 text-primary-400 border-primary-600/30' 
                    : 'bg-primary-100/50 text-primary-600 border-primary-200/40'
                }`}>
                  <span className="text-2xl font-heading font-bold">1</span>
                </div>
                
                {/* Connecting arrow for desktop */}
                <div className="hidden md:block absolute top-8 -right-4 w-8 h-1 bg-gradient-to-r from-primary-600 to-transparent"></div>
                
                <h4 className={`text-lg font-heading font-semibold mb-3 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>Connect Your Wallet</h4>
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Connect your MetaMask or WalletConnect compatible wallet to our platform.
                </p>
              </div>
              
              <div className="text-center relative">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 border ${
                  darkMode 
                    ? 'bg-primary-600/20 text-primary-400 border-primary-600/30' 
                    : 'bg-primary-100/50 text-primary-600 border-primary-200/40'
                }`}>
                  <span className="text-2xl font-heading font-bold">2</span>
                </div>
                
                {/* Connecting arrow for desktop */}
                <div className="hidden md:block absolute top-8 -right-4 w-8 h-1 bg-gradient-to-r from-primary-600 to-transparent"></div>
                
                <h4 className={`text-lg font-heading font-semibold mb-3 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>Choose Amount</h4>
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Select the amount of Pronova tokens you wish to purchase.
                </p>
              </div>
              
              <div className="text-center">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 border ${
                  darkMode 
                    ? 'bg-primary-600/20 text-primary-400 border-primary-600/30' 
                    : 'bg-primary-100/50 text-primary-600 border-primary-200/40'
                }`}>
                  <span className="text-2xl font-heading font-bold">3</span>
                </div>
                <h4 className={`text-lg font-heading font-semibold mb-3 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>Complete Purchase</h4>
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Pay with ETH, USDT, or fiat to receive your tokens instantly.
                </p>
              </div>
            </div>
            
            <div className={`mt-12 pt-8 border-t flex flex-col md:flex-row items-center justify-between ${
              darkMode ? 'border-primary-600/10' : 'border-primary-200/20'
            }`}>
              <div className="mb-6 md:mb-0">
                <div className={`mb-4 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  We accept the following payment methods:
                </div>
                <div className="flex space-x-6">
                  <div className={`flex items-center rounded-lg py-2 px-4 border ${
                    darkMode 
                      ? 'bg-dark-900/80 border-primary-600/10' 
                      : 'bg-white/80 border-primary-200/20'
                  }`}>
                    <FaEthereum size={18} className="mr-2 text-primary-400" />
                    <span className={darkMode ? 'text-white' : 'text-gray-900'}>ETH</span>
                  </div>
                  <div className={`flex items-center rounded-lg py-2 px-4 border ${
                    darkMode 
                      ? 'bg-dark-900/80 border-primary-600/10' 
                      : 'bg-white/80 border-primary-200/20'
                  }`}>
                    <SiTether size={18} className="mr-2 text-primary-400" />
                    <span className={darkMode ? 'text-white' : 'text-gray-900'}>USDT</span>
                  </div>
                  <div className={`flex items-center rounded-lg py-2 px-4 border ${
                    darkMode 
                      ? 'bg-dark-900/80 border-primary-600/10' 
                      : 'bg-white/80 border-primary-200/20'
                  }`}>
                    <FaCoins size={18} className="mr-2 text-primary-400" />
                    <span className={darkMode ? 'text-white' : 'text-gray-900'}>Credit Card</span>
                  </div>
                </div>
              </div>
              <div>
                <Button 
                  variant="gradient"
                  size="large"
                  to="/dashboard"
                >
                  Buy PRN Tokens Now
                </Button>
              </div>
            </div>
          </div>
        </FadeInWhenVisible>

        {/* CTA */}
        <FadeInWhenVisible>
          <div className={`text-center backdrop-blur-sm border p-8 md:p-12 rounded-2xl ${
            darkMode 
              ? 'bg-gradient-to-r from-primary-600/40 to-secondary-600/40 border-primary-600/30 shadow-neon text-white' 
              : 'bg-gradient-to-r from-primary-100/60 to-secondary-100/40 border-primary-200/40 shadow-lg text-gray-900'
          }`}>
            <h3 className={`text-3xl md:text-4xl font-heading font-bold mb-4 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Don't Miss This Opportunity
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
              <span>Buy PRN Tokens</span>
              <FaArrowRight className="ml-2" />
            </Button>
          </div>
        </FadeInWhenVisible>
      </div>
    </section>
  );
};

export default EnhancedPresaleSection;