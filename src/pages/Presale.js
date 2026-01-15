import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaRocket,
  FaWallet,
  FaShieldAlt,
  FaCalculator,
  FaCreditCard,
  FaEthereum,
  FaBitcoin,
  FaDollarSign,
  FaChartPie,
  FaClock,
  FaUsers,
  FaGift,
  FaLock,
  FaCheckCircle,
  FaExclamationTriangle,
  FaArrowRight,
  FaFire,
  FaStar,
  FaLightbulb,
  FaHandshake,
  FaGlobe,
  FaChevronDown
} from 'react-icons/fa';
import Button from '../components/ui/Button';
import SimpleWalletConnector from '../components/ui/SimpleWalletConnector';
import PresalePurchase from '../components/ui/PresalePurchase';
import PriceDisplay from '../components/ui/PriceDisplay';
import PresaleStats from '../components/ui/PresaleStats';
import { useWeb3 } from '../context/Web3Context';
import { useSimpleWallet } from '../context/SimpleWalletContext';
import { useNavigate } from 'react-router-dom';
import web3Service from '../services/web3Service';
import { getCurrentPhaseConfig, calculateTimeRemaining } from '../config/presaleConfig';

const Presale = () => {
  const navigate = useNavigate();
  const { 
    account: simpleAccount, 
    connectWallet: simpleConnectWallet,
    formatAddress: simpleFormatAddress
  } = useSimpleWallet();
  const {
    account,
    chainId,
    isConnected,
    isCorrectNetwork,
    balances,
    presaleInfo,
    formatAddress,
    formatBalance,
    loadPresaleInfo
  } = useWeb3();

  // Countdown timer state - calculated from on-chain phase end time
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Investment calculator state
  const [investment, setInvestment] = useState({
    amount: '',
    currency: 'USD',
    phase: 1
  });

  // Real presale data from contracts
  const [presaleData, setPresaleData] = useState(null);
  const [phaseInfo, setPhaseInfo] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Presale statistics (fallback/default values)
  const [presaleStats, setPresaleStats] = useState({
    totalRaised: 45750000, // $45.75M
    targetRaise: 267500000, // $267.5M
    participantsCount: 12847,
    currentPhase: 1
  });

  const [selectedPayment, setSelectedPayment] = useState('ETH');
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [mockAccount, setMockAccount] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [purchaseAmount, setPurchaseAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Use simpleAccount for wallet connection (real account or mock)
  const activeAccount = simpleAccount || mockAccount;
  const isActuallyConnected = !!activeAccount;

  // Load real presale data from contracts
  useEffect(() => {
    if (account && chainId && isCorrectNetwork) {
      // Web3Service is automatically initialized by Web3Context
      // Load presale data from smart contracts
      loadPresaleInfo();
    }
  }, [account, chainId, isCorrectNetwork, loadPresaleInfo]);

  // Update presale stats when presaleInfo changes (from Web3Context)
  useEffect(() => {
    if (presaleInfo && presaleInfo.totalRaised) {
      setPresaleStats(prev => ({
        ...prev,
        totalRaised: parseFloat(presaleInfo.totalRaised) || prev.totalRaised,
        currentPhase: presaleInfo.currentPhase || prev.currentPhase
      }));
    }
  }, [presaleInfo]);

  // Frontend phase config (UI/marketing only - does NOT affect buying logic)
  const [phaseConfig, setPhaseConfig] = useState(getCurrentPhaseConfig());

  // Update phase config periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setPhaseConfig(getCurrentPhaseConfig());
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  // Update countdown timer from frontend config (UI/marketing only)
  useEffect(() => {
    // Initial calculation
    setTimeLeft(calculateTimeRemaining(phaseConfig.endDate));

    // Update every second
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeRemaining(phaseConfig.endDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [phaseConfig.endDate]);

  // Presale phases data
  const presalePhases = [
    {
      phase: 1,
      title: 'Early Bird Phase',
      price: '$0.80',
      tokens: '100,000,000',
      duration: '30 days',
      bonus: '+15%',
      status: 'active',
      raised: '$45.75M',
      target: '$80M',
      progress: 57,
      features: ['Lowest price', 'Maximum bonus', 'Priority access', 'VIP support']
    },
    {
      phase: 2,
      title: 'Growth Phase',
      price: '$1.00',
      tokens: '75,000,000',
      duration: '30 days',
      bonus: '+10%',
      status: 'upcoming',
      raised: '$0M',
      target: '$75M',
      progress: 0,
      features: ['Standard pricing', 'Good bonus', 'Standard access', 'Regular support']
    },
    {
      phase: 3,
      title: 'Final Phase',
      price: '$1.50',
      tokens: '75,000,000',
      duration: '30 days',
      bonus: '+5%',
      status: 'upcoming',
      raised: '$0M',
      target: '$112.5M',
      progress: 0,
      features: ['Pre-launch price', 'Limited bonus', 'Final opportunity', 'Launch preparation']
    }
  ];

  // Payment methods
  const paymentMethods = [
    {
      id: 'ETH',
      name: 'Ethereum',
      symbol: 'ETH',
      icon: FaEthereum,
      color: 'text-blue-500',
      rate: '0.0003125', // ETH per PRN at $0.80
      popular: true
    },
    {
      id: 'BNB',
      name: 'Binance Coin',
      symbol: 'BNB',
      icon: FaBitcoin,
      color: 'text-yellow-500',
      rate: '0.002667', // BNB per PRN at $0.80
      popular: false
    },
    {
      id: 'USDT',
      name: 'Tether USD',
      symbol: 'USDT',
      icon: FaDollarSign,
      color: 'text-green-500',
      rate: '0.80', // USDT per PRN
      popular: true
    },
    {
      id: 'USD',
      name: 'US Dollar',
      symbol: 'USD',
      icon: FaCreditCard,
      color: 'text-gray-600',
      rate: '0.80', // USD per PRN
      popular: false
    }
  ];

  // Calculate investment returns
  const calculateReturns = () => {
    if (!investment.amount || isNaN(investment.amount)) return null;
    
    const currentPhase = presalePhases[investment.phase - 1];
    const pricePerToken = parseFloat(currentPhase.price.substring(1));
    const tokensReceived = parseFloat(investment.amount) / pricePerToken;
    const bonusPercentage = parseInt(currentPhase.bonus.substring(1));
    const bonusTokens = (tokensReceived * bonusPercentage) / 100;
    const totalTokens = tokensReceived + bonusTokens;
    
    const listingPrice = 2.0; // Expected listing at $2.00
    const potentialValue = totalTokens * listingPrice;
    const potentialGain = potentialValue - parseFloat(investment.amount);
    const potentialGainPercentage = (potentialGain / parseFloat(investment.amount)) * 100;

    return {
      tokensReceived: tokensReceived.toLocaleString(),
      bonusTokens: bonusTokens.toLocaleString(),
      totalTokens: totalTokens.toLocaleString(),
      potentialValue: potentialValue.toLocaleString(),
      potentialGain: potentialGain.toLocaleString(),
      potentialGainPercentage: potentialGainPercentage.toFixed(1)
    };
  };

  const returns = calculateReturns();

  // Steps to participate with actions
  const participationSteps = [
    {
      step: 1,
      title: 'Connect Wallet',
      description: 'Connect your MetaMask, Trust Wallet, or any compatible Web3 wallet',
      icon: FaWallet,
      color: 'from-blue-500 to-cyan-500',
      action: () => {
        if (!activeAccount) {
          document.getElementById('wallet-section')?.scrollIntoView({ behavior: 'smooth' });
        } else {
          setCurrentStep(2);
        }
      },
      isComplete: !!activeAccount
    },
    {
      step: 2,
      title: 'Choose Amount',
      description: 'Select your investment amount and preferred payment method',
      icon: FaCalculator,
      color: 'from-purple-500 to-pink-500',
      action: () => {
        if (activeAccount) {
          document.getElementById('purchase-section')?.scrollIntoView({ behavior: 'smooth' });
          setCurrentStep(2);
        } else {
          alert('Please connect your wallet first!');
        }
      },
      isComplete: currentStep > 2
    },
    {
      step: 3,
      title: 'Complete KYC',
      description: 'Quick verification process for purchases over $10,000',
      icon: FaShieldAlt,
      color: 'from-green-500 to-emerald-500',
      action: () => {
        if (activeAccount) {
          setCurrentStep(3);
          // KYC is automatic for demo
          setTimeout(() => setCurrentStep(4), 1000);
        } else {
          alert('Please connect your wallet first!');
        }
      },
      isComplete: currentStep > 3
    },
    {
      step: 4,
      title: 'Confirm Purchase',
      description: 'Review details and confirm your PRN token purchase',
      icon: FaCheckCircle,
      color: 'from-orange-500 to-red-500',
      action: () => {
        if (activeAccount && purchaseAmount) {
          document.getElementById('purchase-section')?.scrollIntoView({ behavior: 'smooth' });
        } else {
          alert('Please complete previous steps first!');
        }
      },
      isComplete: false
    }
  ];

  // Features and benefits
  const presaleFeatures = [
    {
      icon: FaFire,
      title: 'Lowest Price Guaranteed',
      description: 'Get PRN tokens at the best price before public launch',
      color: 'text-red-500'
    },
    {
      icon: FaGift,
      title: 'Bonus Tokens',
      description: 'Receive up to 15% bonus tokens during early phases',
      color: 'text-green-500'
    },
    {
      icon: FaLock,
      title: 'No Vesting Period',
      description: 'All presale tokens are immediately available at TGE',
      color: 'text-blue-500'
    },
    {
      icon: FaUsers,
      title: 'VIP Community Access',
      description: 'Exclusive access to private channels and early updates',
      color: 'text-purple-500'
    },
    {
      icon: FaStar,
      title: 'Priority Investment Access',
      description: 'First access to investment opportunities on the platform',
      color: 'text-yellow-500'
    },
    {
      icon: FaHandshake,
      title: 'Partnership Benefits',
      description: 'Special discounts with all 18 partner companies',
      color: 'text-indigo-500'
    }
  ];

  return (
    <>
      {/* Hero Section with Countdown */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-dark-900 dark:via-dark-800 dark:to-dark-900 overflow-hidden">
        {/* Background shapes */}
        <div className="absolute inset-0">
          <div className="shape shape-primary w-96 h-96 top-10 -left-20 opacity-20"></div>
          <div className="shape shape-secondary w-72 h-72 top-20 -right-16 opacity-20"></div>
        </div>
        
        <div className="container-custom relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-5xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-3 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 px-6 py-3 rounded-full mb-6 font-medium"
            >
              <FaRocket className="text-xl animate-pulse" />
              <span>Phase {phaseConfig.phaseNumber} Now Live - Limited Time Only</span>
            </motion.div>
            
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold mb-6 text-gray-900 dark:text-white">
              Pronova{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-secondary-600">Presale</span>
            </h1>
            
            <p className="text-xl md:text-2xl mb-8 text-gray-700 dark:text-gray-300 leading-relaxed max-w-4xl mx-auto">
              Join the revolutionary cryptocurrency presale with <strong>guaranteed discounts</strong>, 
              <strong> bonus tokens</strong>, and <strong>immediate utility</strong> across 18 partner companies.
            </p>

            {/* Countdown Timer */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white dark:bg-dark-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 md:p-8 mb-8 max-w-2xl mx-auto shadow-xl"
            >
              <h3 className="text-lg md:text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                Phase {phaseConfig.phaseNumber} Ends In:
              </h3>
              <div className="grid grid-cols-4 gap-2 md:gap-4">
                {[
                  { label: 'Days', value: timeLeft.days },
                  { label: 'Hours', value: timeLeft.hours },
                  { label: 'Minutes', value: timeLeft.minutes },
                  { label: 'Seconds', value: timeLeft.seconds }
                ].map((item, index) => (
                  <div key={index} className="text-center">
                    <div className="bg-primary-100 dark:bg-primary-900/30 rounded-xl p-3 md:p-4 border border-primary-200 dark:border-primary-700">
                      <div className="text-2xl md:text-3xl font-bold text-primary-600 dark:text-primary-400">
                        {item.value.toString().padStart(2, '0')}
                      </div>
                    </div>
                    <div className="text-sm mt-2 text-gray-600 dark:text-gray-400">
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="flex flex-col sm:flex-row justify-center gap-4 max-w-md mx-auto"
            >
              <Button 
                variant="primary" 
                size="large" 
                onClick={() => {
                  const element = document.getElementById('presale-form');
                  element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className="group cursor-pointer"
              >
                <FaRocket className="group-hover:rotate-12 transition-transform" />
                Buy PRN Now
              </Button>
              <Button 
                variant="outline" 
                size="large" 
                onClick={() => {
                  const element = document.getElementById('calculator');
                  element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className="group cursor-pointer"
              >
                <FaCalculator />
                Calculate Returns
              </Button>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 max-w-3xl mx-auto"
            >
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold mb-1 text-primary-600 dark:text-primary-400">
                  ${(presaleStats.totalRaised / 1000000).toFixed(1)}M
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Raised</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold mb-1 text-primary-600 dark:text-primary-400">
                  {presaleStats.participantsCount.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Participants</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold mb-1 text-primary-600 dark:text-primary-400">
                  {phaseConfig.displayPrice}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Current Price</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold mb-1 text-primary-600 dark:text-primary-400">
                  {phaseConfig.bonus}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Bonus Tokens</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Presale Phases */}
      <section className="py-16 md:py-24 bg-gray-50 dark:bg-dark-800">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              Presale <span className="text-gradient-enhanced">Phases</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Three carefully structured phases designed to reward early supporters 
              with the best prices and maximum bonuses.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {presalePhases.map((phase, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group"
              >
                <div className={`relative bg-white dark:bg-dark-900 rounded-2xl shadow-xl border-2 overflow-hidden transition-all duration-300 h-full ${
                  phase.status === 'active' 
                    ? 'border-primary-500 shadow-primary-500/20 scale-105' 
                    : phase.status === 'upcoming'
                    ? 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600'
                    : 'border-gray-300 dark:border-gray-600 opacity-75'
                }`}>
                  {/* Status Badge */}
                  {phase.status === 'active' && (
                    <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      🔥 Live Now
                    </div>
                  )}
                  {phase.status === 'upcoming' && (
                    <div className="absolute top-4 right-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      ⏳ Soon
                    </div>
                  )}

                  <div className="p-8">
                    {/* Phase Header */}
                    <div className="text-center mb-6">
                      <div className="text-sm text-primary-600 dark:text-primary-400 font-medium mb-2">
                        Phase {phase.phase}
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        {phase.title}
                      </h3>
                      <div className="text-4xl font-bold text-primary-600 dark:text-primary-400">
                        {phase.price}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        per PRN token
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-6">
                      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                        <span>Progress</span>
                        <span>{phase.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                        <div 
                          className="bg-gradient-to-r from-primary-600 to-secondary-500 h-3 rounded-full transition-all duration-1000"
                          style={{ width: `${phase.progress}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-sm text-gray-500 dark:text-gray-500 mt-2">
                        <span>{phase.raised}</span>
                        <span>{phase.target}</span>
                      </div>
                    </div>

                    {/* Phase Details */}
                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Tokens Available:</span>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {phase.tokens}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Duration:</span>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {phase.duration}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Bonus:</span>
                        <span className="font-semibold text-green-600 dark:text-green-400">
                          {phase.bonus}
                        </span>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                        Phase Benefits:
                      </h4>
                      <ul className="space-y-2">
                        {phase.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                            <FaCheckCircle className="text-green-500 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Action Button */}
                    <Button
                      variant={phase.status === 'active' ? 'primary' : 'outline'}
                      fullWidth
                      disabled={phase.status === 'completed'}
                      href={phase.status === 'active' ? '#presale-form' : undefined}
                      className={phase.status === 'active' ? 'animate-pulse' : ''}
                    >
                      {phase.status === 'active' && (
                        <>
                          <FaRocket />
                          Buy Now
                        </>
                      )}
                      {phase.status === 'upcoming' && (
                        <>
                          <FaClock />
                          Coming Soon
                        </>
                      )}
                      {phase.status === 'completed' && (
                        <>
                          <FaCheckCircle />
                          Completed
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Web3 Purchase Section */}
      <section id="purchase" className="py-16 md:py-24 bg-white dark:bg-dark-900">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Purchase Component */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              {/* Wallet Connection */}
              <div className="mb-8 text-center">
                <SimpleWalletConnector className="inline-block" />
              </div>

              {/* Purchase Component */}
              <PresalePurchase />
            </motion.div>

            {/* Real-time Data & Features */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              {/* Price Display */}
              <PriceDisplay />
              
              {/* Presale Stats */}
              <PresaleStats />
              
              <div>
                <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
                  Why Join the <span className="text-gradient-enhanced">Presale?</span>
                </h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Get exclusive access to PRN tokens at the lowest prices with guaranteed bonuses 
                  and immediate utility across our partner ecosystem.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {presaleFeatures.map((feature, index) => {
                  const IconComponent = feature.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      className="bg-white dark:bg-dark-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 group"
                    >
                      <IconComponent className={`text-3xl ${feature.color} mb-3 group-hover:scale-110 transition-transform`} />
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {feature.description}
                      </p>
                    </motion.div>
                  );
                })}
              </div>

              {/* Risk Warning */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-xl p-6"
              >
                <div className="flex items-start gap-3">
                  <FaExclamationTriangle className="text-yellow-600 dark:text-yellow-400 text-xl flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-yellow-800 dark:text-yellow-300 mb-2">
                      Investment Risk Warning
                    </h3>
                    <p className="text-sm text-yellow-700 dark:text-yellow-400 leading-relaxed">
                      Cryptocurrency investments carry inherent risks. While Pronova offers real-world utility 
                      and strong partnerships, past performance doesn't guarantee future results. Please invest 
                      responsibly and only what you can afford to lose.
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Payment Methods & Purchase Process */}
      <section id="presale-form" className="py-16 md:py-24 bg-gray-50 dark:bg-dark-800">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              How to <span className="text-gradient-enhanced">Participate</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Follow these simple steps to secure your PRN tokens and join the Pronova ecosystem
            </p>
          </motion.div>

          {/* Steps */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {participationSteps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  onClick={step.action}
                  className="text-center group cursor-pointer"
                >
                  <div className={`w-20 h-20 bg-gradient-to-r ${step.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform relative`}>
                    <IconComponent className="text-3xl text-white" />
                    {step.isComplete && (
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <FaCheckCircle className="text-white text-sm" />
                      </div>
                    )}
                  </div>
                  <div className={`bg-white dark:bg-dark-900 p-6 rounded-xl shadow-lg border-2 h-full transition-all ${
                    step.isComplete 
                      ? 'border-green-500' 
                      : currentStep === step.step 
                        ? 'border-primary-500 shadow-primary-200' 
                        : 'border-gray-200 dark:border-gray-700'
                  }`}>
                    <div className="text-lg font-bold text-primary-600 dark:text-primary-400 mb-2">
                      Step {step.step} {step.isComplete && '✓'}
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                      {step.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {step.description}
                    </p>
                    {currentStep === step.step && !step.isComplete && (
                      <div className="mt-3">
                        <span className="text-xs text-primary-600 font-medium">Click to continue →</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Payment Methods */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-white dark:bg-dark-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="bg-gradient-to-r from-primary-600 to-secondary-500 p-6 text-white text-center">
                <h3 className="text-2xl font-bold mb-2">Join the Presale Now</h3>
                <p className="text-white/90">Choose your preferred payment method and secure your PRN tokens</p>
              </div>

              <div className="p-8">
                {/* Payment Method Selection */}
                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                    Payment Method
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {paymentMethods.map((method) => {
                      const IconComponent = method.icon;
                      return (
                        <button
                          key={method.id}
                          onClick={() => setSelectedPayment(method.id)}
                          className={`relative p-4 rounded-xl border-2 transition-all duration-300 ${
                            selectedPayment === method.id
                              ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                              : 'border-gray-200 dark:border-gray-700 hover:border-primary-300'
                          }`}
                        >
                          {method.popular && (
                            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                              <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                                Popular
                              </span>
                            </div>
                          )}
                          <IconComponent className={`text-2xl ${method.color} mx-auto mb-2`} />
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {method.symbol}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {method.name}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Wallet Connection */}
                <div className="text-center mb-8" id="wallet-section">
                  {!activeAccount ? (
                    <div className="space-y-4">
                      <Button
                        variant="primary"
                        size="large"
                        onClick={simpleConnectWallet}
                        className="group"
                      >
                        <FaWallet className="group-hover:scale-110 transition-transform" />
                        Connect Wallet
                      </Button>
                      
                      {/* Mock wallet for testing */}
                      {process.env.NODE_ENV === 'development' && (
                        <div>
                          <p className="text-xs text-gray-500 mb-2">Or for testing:</p>
                          <Button
                            variant="outline"
                            size="medium"
                            onClick={() => {
                              const mockAddr = '0xMOCK1234567890abcdef1234567890abcdef1234';
                              setMockAccount(mockAddr);
                              localStorage.setItem('mockAccount', mockAddr);
                              setCurrentStep(2);
                            }}
                          >
                            Use Mock Wallet
                          </Button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-xl p-4">
                      <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400">
                        <FaCheckCircle />
                        <span className="font-medium">Wallet Connected</span>
                      </div>
                      <div className="text-sm text-green-500 dark:text-green-500 mt-1">
                        {simpleFormatAddress(activeAccount)}
                      </div>
                      {mockAccount && (
                        <button
                          onClick={() => {
                            setMockAccount(null);
                            localStorage.removeItem('mockAccount');
                            setCurrentStep(1);
                          }}
                          className="text-xs text-red-500 hover:underline mt-2"
                        >
                          Disconnect Mock Wallet
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Purchase Form */}
                {activeAccount && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                    id="purchase-section"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Amount to Invest (USD)
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                          <input
                            type="number"
                            placeholder="100"
                            value={purchaseAmount}
                            onChange={(e) => {
                              setPurchaseAmount(e.target.value);
                              if (e.target.value >= 100) {
                                setCurrentStep(3);
                              }
                            }}
                            className="w-full pl-8 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-700 text-gray-900 dark:text-white"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          PRN Tokens to Receive
                        </label>
                        <input
                          type="text"
                          value={purchaseAmount ? `${(parseFloat(purchaseAmount) / 0.05).toFixed(0)} PRN` : '0 PRN'}
                          readOnly
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-dark-800 p-4 rounded-xl">
                      <div className="flex justify-between items-center text-sm mb-2">
                        <span className="text-gray-600 dark:text-gray-400">Current Phase:</span>
                        <span className="font-medium text-gray-900 dark:text-white">Phase 1 ($0.05)</span>
                      </div>
                      <div className="flex justify-between items-center text-sm mb-2">
                        <span className="text-gray-600 dark:text-gray-400">Payment Method:</span>
                        <span className="font-medium text-gray-900 dark:text-white">{selectedPayment}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Minimum Purchase:</span>
                        <span className="font-medium text-gray-900 dark:text-white">$100</span>
                      </div>
                    </div>

                    <Button
                      variant="primary"
                      size="large"
                      fullWidth
                      className="group"
                      disabled={!purchaseAmount || parseFloat(purchaseAmount) < 100 || isProcessing}
                      onClick={async () => {
                        if (parseFloat(purchaseAmount) < 100) {
                          alert('Minimum purchase amount is $100');
                          return;
                        }
                        
                        setIsProcessing(true);
                        
                        // Simulate purchase process
                        await new Promise(resolve => setTimeout(resolve, 2000));
                        
                        // Create purchase data
                        const purchaseData = {
                          amount: parseFloat(purchaseAmount),
                          tokens: parseFloat(purchaseAmount) / 0.05,
                          paymentMethod: selectedPayment,
                          hash: '0x' + Math.random().toString(16).substr(2, 64),
                          date: new Date().toISOString(),
                          account: activeAccount,
                          currency: 'USD',
                          referralBonus: 0
                        };
                        
                        // Save to localStorage
                        const existingPurchases = localStorage.getItem(`purchases_${activeAccount}`) || '{"totalTokens":"0","totalPaid":"0","referralRewards":"0"}';
                        const purchases = JSON.parse(existingPurchases);
                        purchases.totalTokens = (parseFloat(purchases.totalTokens) + purchaseData.tokens).toString();
                        purchases.totalPaid = (parseFloat(purchases.totalPaid) + purchaseData.amount).toString();
                        localStorage.setItem(`purchases_${activeAccount}`, JSON.stringify(purchases));
                        
                        // Save transaction
                        const transactions = JSON.parse(localStorage.getItem(`transactions_${activeAccount}`) || '[]');
                        transactions.unshift({
                          ...purchaseData,
                          type: 'Token Purchase',
                          status: 'Completed',
                          cryptoAmount: 0
                        });
                        localStorage.setItem(`transactions_${activeAccount}`, JSON.stringify(transactions));
                        
                        // Navigate to congratulations
                        navigate('/congratulations', {
                          state: { purchaseData }
                        });
                      }}
                    >
                      {isProcessing ? (
                        <>
                          <FaRocket className="animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <FaRocket className="group-hover:rotate-12 transition-transform" />
                          Buy PRN Tokens
                        </>
                      )}
                    </Button>

                    <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                      By purchasing, you agree to our Terms of Service and acknowledge the risks involved
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24 bg-white dark:bg-dark-900">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              Presale <span className="text-gradient-enhanced">FAQ</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Common questions about the Pronova presale process and token purchase
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto space-y-4">
            {[
              {
                question: "What is the minimum investment amount?",
                answer: "The minimum investment is $100 USD equivalent, making it accessible for retail investors while ensuring serious participation."
              },
              {
                question: "When will I receive my PRN tokens?",
                answer: "PRN tokens are distributed immediately after purchase confirmation. There's no vesting period for presale participants."
              },
              {
                question: "Can I buy with credit card?",
                answer: "Yes, we accept major credit cards (Visa, Mastercard) for fiat purchases, as well as popular cryptocurrencies like ETH, BNB, and USDT."
              },
              {
                question: "What happens if the presale doesn't reach its target?",
                answer: "The presale is structured with achievable targets. If any phase doesn't reach its goal, remaining tokens will be available in the next phase."
              },
              {
                question: "Are there any lock-up periods?",
                answer: "No, all presale tokens are immediately tradeable at Token Generation Event (TGE). Only team and founder tokens have vesting schedules."
              },
              {
                question: "What's the expected listing price?",
                answer: "Based on current projections and market conditions, we expect PRN to list between $1.70-$2.50, providing significant upside for early participants."
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gray-50 dark:bg-dark-800 border border-gray-200 dark:border-gray-700 rounded-xl"
              >
                <details className="group">
                  <summary className="flex items-center justify-between p-6 cursor-pointer">
                    <h3 className="font-semibold text-gray-900 dark:text-white pr-4">
                      {faq.question}
                    </h3>
                    <FaChevronDown className="text-gray-400 group-open:rotate-180 transition-transform" />
                  </summary>
                  <div className="px-6 pb-6">
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </details>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mt-12"
          >
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Have more questions about the presale?
            </p>
            <Button variant="outline" to="/faq" className="group">
              <FaLightbulb className="group-hover:scale-110 transition-transform" />
              View All FAQ
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="shape w-96 h-96 bg-white/5 -top-20 -left-20"></div>
          <div className="shape w-72 h-72 bg-white/5 -bottom-10 -right-16"></div>
        </div>
        
        <div className="container-custom relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center text-white max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <FaFire className="text-4xl animate-pulse" />
            </motion.div>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Don't Miss the{' '}
              <span className="text-secondary-200">Early Bird Phase</span>
            </h2>
            
            <p className="text-xl md:text-2xl mb-8 text-white/90 leading-relaxed">
              Join thousands of investors who are already part of the Pronova revolution. 
              Phase 1 pricing won't last forever.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-lg mx-auto mb-8">
              <Button 
                size="large"
                variant="white"
                href="#presale-form"
                className="bg-white text-primary-700 hover:bg-gray-100 font-bold group"
              >
                <FaRocket className="group-hover:rotate-12 transition-transform" />
                Join Presale Now
              </Button>
              <Button 
                size="large"
                variant="ghost"
                to="/whitepaper"
                className="text-white border-white/30 hover:bg-white/10 font-bold"
              >
                <FaLightbulb />
                Read Whitepaper
              </Button>
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-white/70"
            >
              <p>🔥 Limited Time • 🎁 15% Bonus • 🚀 Immediate Utility • 🛡️ Fully Insured</p>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Presale;