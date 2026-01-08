import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  FaShieldAlt, FaChartLine, FaLock, FaBalanceScale, FaCoins,
  FaArrowUp, FaArrowDown, FaExchangeAlt, FaBuilding, FaUsers,
  FaCheck, FaClock, FaHandshake, FaGlobe
} from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';
import { Helmet } from 'react-helmet';

// Animation Hook
const FadeInWhenVisible = ({ children, delay = 0, direction = null }) => {
  const [ref, setRef] = React.useState(null);
  const [inView, setInView] = React.useState(false);

  React.useEffect(() => {
    if (ref) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setInView(true);
            observer.disconnect();
          }
        },
        { threshold: 0.1 }
      );
      observer.observe(ref);
      return () => observer.disconnect();
    }
  }, [ref]);

  return (
    <motion.div
      ref={setRef}
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

// Stability Pillar Card Component
const StabilityPillarCard = ({ pillar, darkMode, delay = 0 }) => {
  return (
    <FadeInWhenVisible delay={delay}>
      <motion.div
        whileHover={{ scale: 1.02, y: -5 }}
        className={`group relative overflow-hidden rounded-2xl backdrop-blur-sm border transition-all duration-300 h-full ${
          darkMode
            ? 'bg-dark-900/80 border-primary-600/20 hover:border-primary-500/50 hover:shadow-lg hover:shadow-primary-500/20'
            : 'bg-white/90 border-gray-200/50 hover:border-primary-300/70 hover:shadow-xl hover:shadow-primary-300/20'
        }`}
      >
        <div className="p-8">
          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${pillar.color} flex items-center justify-center text-white mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
            {pillar.icon}
          </div>
          <h3 className={`text-xl font-heading font-bold mb-3 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            {pillar.title}
          </h3>
          <p className={`text-sm leading-relaxed mb-4 ${
            darkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {pillar.description}
          </p>
          <ul className="space-y-2">
            {pillar.features.map((feature, idx) => (
              <li key={idx} className="flex items-start">
                <FaCheck className={`mt-1 mr-2 flex-shrink-0 ${
                  darkMode ? 'text-green-400' : 'text-green-600'
                }`} size={12} />
                <span className={`text-sm ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    </FadeInWhenVisible>
  );
};

const Stability = () => {
  const { darkMode } = useTheme();

  // Five pillars of Pronova's stability plan
  const stabilityPillars = [
    {
      icon: <FaClock size={28} />,
      title: "Gradual Token Release",
      description: "Tokens are not released all at once. A strategic, gradual release schedule prevents market flooding and maintains scarcity.",
      color: "from-blue-500 to-cyan-500",
      features: [
        "Phased release schedule over time",
        "Prevents sudden supply increases",
        "Creates intentional scarcity",
        "Supports healthy price discovery"
      ]
    },
    {
      icon: <FaCoins size={28} />,
      title: "Buy-Back Mechanism",
      description: "The founding institutions commit to buying back tokens to support price stability and prevent sharp declines.",
      color: "from-purple-500 to-pink-500",
      features: [
        "Institutional buy-back commitments",
        "Price floor protection",
        "Market confidence building",
        "Reduces panic selling pressure"
      ]
    },
    {
      icon: <FaBuilding size={28} />,
      title: "Institutional Backing",
      description: "Managed by Capimax Blockchain & FinTech and Capimax Virtual Assets, subsidiaries of Capimax Holding UK with 7+ years experience.",
      color: "from-green-500 to-emerald-500",
      features: [
        "Professional management team",
        "18+ partner companies",
        "Regulatory compliance focus",
        "Transparent operations"
      ]
    },
    {
      icon: <FaShieldAlt size={28} />,
      title: "Exit Protection",
      description: "Unique exit mechanism protects investors: if price rises, exit with same tokens. If it falls, exit at original USD value.",
      color: "from-orange-500 to-red-500",
      features: [
        "Principal protection option",
        "Flexible exit timing",
        "Risk-mitigated returns",
        "Investor confidence boost"
      ]
    },
    {
      icon: <FaLock size={28} />,
      title: "Anti-Dump Safeguards",
      description: "Strategic controls prevent large-scale dumping that could destabilize the token's market value.",
      color: "from-indigo-500 to-violet-500",
      features: [
        "Vesting schedules for large holders",
        "Gradual unlock periods",
        "Market manipulation prevention",
        "Long-term holder incentives"
      ]
    }
  ];

  // How the exit mechanism works
  const exitMechanismSteps = [
    {
      scenario: "Price Goes Up",
      icon: <FaArrowUp size={24} />,
      color: "from-green-500 to-emerald-500",
      description: "If Pronova's market value increases, you can exit and receive your original token count. You profit from the price appreciation.",
      example: "Bought 1000 PRN at $0.10 = $100. Price rises to $0.20. Exit with 1000 PRN worth $200."
    },
    {
      scenario: "Price Goes Down",
      icon: <FaArrowDown size={24} />,
      color: "from-orange-500 to-red-500",
      description: "If the market value decreases, you have the option to exit at your original USD investment value, protecting your principal.",
      example: "Bought 1000 PRN at $0.10 = $100. Price drops to $0.05. Exit at original $100 value."
    }
  ];

  return (
    <>
      <Helmet>
        <title>Stability Plan - How Pronova Protects Your Investment | PRN</title>
        <meta name="description" content="Learn about Pronova's 5-pillar stability plan: gradual release, buy-back mechanism, institutional backing, exit protection, and anti-dump safeguards." />
      </Helmet>

      {/* Hero Section */}
      <section className={`relative min-h-[60vh] flex items-center pt-32 pb-20 overflow-hidden ${
        darkMode
          ? 'bg-gradient-to-b from-dark-900 via-dark-900/95 to-dark-800'
          : 'bg-gradient-to-b from-white via-gray-50 to-white'
      }`}>
        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute top-20 right-10 w-96 h-96 bg-primary-500/5 dark:bg-primary-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-10 w-80 h-80 bg-secondary-500/5 dark:bg-secondary-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="container-custom relative z-10">
          <FadeInWhenVisible>
            <div className="text-center max-w-5xl mx-auto">
              {/* Badge */}
              <div className={`inline-flex items-center py-2 px-6 rounded-full backdrop-blur-sm border mb-8 ${
                darkMode
                  ? 'bg-primary-600/20 border-primary-600/30'
                  : 'bg-primary-100/60 border-primary-200/40'
              }`}>
                <FaShieldAlt className="mr-2 text-primary-600 dark:text-primary-400" />
                <span className={`text-sm font-medium ${
                  darkMode ? 'text-primary-400' : 'text-primary-700'
                }`}>5-Pillar Protection System</span>
              </div>

              {/* Main Heading */}
              <h1 className={`text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-8 leading-tight ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Our <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">Stability</span><br className="hidden sm:block" />
                <span className="bg-gradient-to-r from-secondary-600 to-primary-600 bg-clip-text text-transparent">Plan</span>
              </h1>

              {/* Subtitle */}
              <p className={`text-lg md:text-xl mb-12 max-w-3xl mx-auto leading-relaxed ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Pronova is designed with <span className="font-semibold text-primary-600 dark:text-primary-400">institutional-grade protection</span> to ensure
                <span className="font-semibold text-secondary-600 dark:text-secondary-400"> long-term stability</span> and protect your investment value.
              </p>

              {/* Key Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
                {[
                  { number: "5", label: "Protection Pillars" },
                  { number: "18+", label: "Backing Companies" },
                  { number: "7+", label: "Years Experience" },
                  { number: "100%", label: "Exit Protection" }
                ].map((stat, index) => (
                  <div key={index} className={`p-4 rounded-xl backdrop-blur-sm border ${
                    darkMode
                      ? 'bg-dark-900/60 border-primary-600/20'
                      : 'bg-white/60 border-gray-200/40'
                  }`}>
                    <div className={`text-2xl md:text-3xl font-bold ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>{stat.number}</div>
                    <div className={`text-sm ${
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </FadeInWhenVisible>
        </div>
      </section>

      {/* Overview Section */}
      <section className={`relative py-20 ${
        darkMode ? 'bg-dark-800' : 'bg-gray-50'
      }`}>
        <div className="container-custom">
          <FadeInWhenVisible>
            <div className={`backdrop-blur-sm border rounded-3xl p-8 md:p-12 ${
              darkMode
                ? 'bg-dark-900/60 border-primary-600/20'
                : 'bg-white/80 border-gray-200/40'
            }`}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className={`text-3xl md:text-4xl font-heading font-bold mb-6 ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Why <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">Stability Matters</span>
                  </h2>
                  <div className={`space-y-4 text-lg leading-relaxed ${
                    darkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    <p>
                      Unlike speculative cryptocurrencies that rely solely on market sentiment, Pronova was designed from the ground up with <strong className={darkMode ? 'text-white' : 'text-gray-900'}>institutional-grade stability mechanisms</strong>.
                    </p>
                    <p>
                      Our founding institutions - Capimax Blockchain & FinTech and Capimax Virtual Assets - added an <strong className={darkMode ? 'text-primary-400' : 'text-primary-600'}>institutional investment dimension</strong> to protect the currency, preserve its value, and ensure long-term stability.
                    </p>
                    <p>
                      This unique approach creates a balance between <strong className={darkMode ? 'text-white' : 'text-gray-900'}>free market trading</strong> and <strong className={darkMode ? 'text-secondary-400' : 'text-secondary-600'}>institutional protection</strong>, offering the best of both worlds.
                    </p>
                  </div>
                </div>
                <div className="flex justify-center">
                  <div className={`relative p-8 rounded-3xl ${
                    darkMode
                      ? 'bg-gradient-to-br from-primary-600/20 to-secondary-600/20 border border-primary-500/30'
                      : 'bg-gradient-to-br from-primary-100 to-secondary-100 border border-primary-200'
                  }`}>
                    <div className="grid grid-cols-2 gap-4">
                      <div className={`p-6 rounded-2xl text-center ${
                        darkMode ? 'bg-dark-800/80' : 'bg-white'
                      }`}>
                        <FaBalanceScale className={`mx-auto mb-3 ${
                          darkMode ? 'text-primary-400' : 'text-primary-600'
                        }`} size={40} />
                        <p className={`font-semibold ${
                          darkMode ? 'text-white' : 'text-gray-900'
                        }`}>Supply & Demand</p>
                        <p className={`text-sm ${
                          darkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>Balanced</p>
                      </div>
                      <div className={`p-6 rounded-2xl text-center ${
                        darkMode ? 'bg-dark-800/80' : 'bg-white'
                      }`}>
                        <FaChartLine className={`mx-auto mb-3 ${
                          darkMode ? 'text-green-400' : 'text-green-600'
                        }`} size={40} />
                        <p className={`font-semibold ${
                          darkMode ? 'text-white' : 'text-gray-900'
                        }`}>Growth</p>
                        <p className={`text-sm ${
                          darkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>Sustainable</p>
                      </div>
                      <div className={`p-6 rounded-2xl text-center ${
                        darkMode ? 'bg-dark-800/80' : 'bg-white'
                      }`}>
                        <FaShieldAlt className={`mx-auto mb-3 ${
                          darkMode ? 'text-secondary-400' : 'text-secondary-600'
                        }`} size={40} />
                        <p className={`font-semibold ${
                          darkMode ? 'text-white' : 'text-gray-900'
                        }`}>Protection</p>
                        <p className={`text-sm ${
                          darkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>Institutional</p>
                      </div>
                      <div className={`p-6 rounded-2xl text-center ${
                        darkMode ? 'bg-dark-800/80' : 'bg-white'
                      }`}>
                        <FaGlobe className={`mx-auto mb-3 ${
                          darkMode ? 'text-blue-400' : 'text-blue-600'
                        }`} size={40} />
                        <p className={`font-semibold ${
                          darkMode ? 'text-white' : 'text-gray-900'
                        }`}>Utility</p>
                        <p className={`text-sm ${
                          darkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>Real-World</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </FadeInWhenVisible>
        </div>
      </section>

      {/* Five Pillars Section */}
      <section className={`relative py-24 ${
        darkMode ? 'bg-dark-900' : 'bg-white'
      }`}>
        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500/5 dark:bg-primary-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary-500/5 dark:bg-secondary-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="container-custom relative z-10">
          <FadeInWhenVisible>
            <div className="text-center mb-16">
              <div className={`inline-flex items-center px-6 py-2 rounded-full border mb-6 ${
                darkMode
                  ? 'bg-primary-600/20 border-primary-600/30'
                  : 'bg-primary-100/60 border-primary-200/40'
              }`}>
                <span className={`text-sm font-medium uppercase tracking-wider ${
                  darkMode ? 'text-primary-400' : 'text-primary-700'
                }`}>Protection Framework</span>
              </div>
              <h2 className={`text-4xl md:text-5xl font-heading font-bold mb-6 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                The <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">Five Pillars</span> of Stability
              </h2>
              <p className={`text-xl max-w-3xl mx-auto ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Our comprehensive approach to protecting your investment through multiple safeguards
              </p>
            </div>
          </FadeInWhenVisible>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {stabilityPillars.map((pillar, index) => (
              <StabilityPillarCard
                key={index}
                pillar={pillar}
                darkMode={darkMode}
                delay={0.1 * (index + 1)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Exit Protection Mechanism */}
      <section className={`relative py-24 ${
        darkMode ? 'bg-dark-800' : 'bg-gray-50'
      }`}>
        <div className="container-custom">
          <FadeInWhenVisible>
            <div className="text-center mb-16">
              <div className={`inline-flex items-center px-6 py-2 rounded-full border mb-6 ${
                darkMode
                  ? 'bg-primary-600/20 border-primary-600/30'
                  : 'bg-primary-100/60 border-primary-200/40'
              }`}>
                <FaExchangeAlt className="w-4 h-4 mr-2 text-primary-600 dark:text-primary-400" />
                <span className={`text-sm font-medium ${
                  darkMode ? 'text-primary-400' : 'text-primary-700'
                }`}>Exit Mechanism</span>
              </div>
              <h2 className={`text-4xl md:text-5xl font-heading font-bold mb-6 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Protected <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">Exit Options</span>
              </h2>
              <p className={`text-xl max-w-3xl mx-auto ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Our unique exit mechanism provides flexibility and protection regardless of market conditions
              </p>
            </div>
          </FadeInWhenVisible>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {exitMechanismSteps.map((step, index) => (
              <FadeInWhenVisible key={index} delay={0.1 * (index + 1)}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className={`relative overflow-hidden rounded-3xl p-8 h-full ${
                    darkMode
                      ? 'bg-dark-900/80 border border-primary-600/20'
                      : 'bg-white/90 border border-gray-200/50'
                  }`}
                >
                  {/* Header */}
                  <div className="flex items-center mb-6">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center text-white mr-4 shadow-lg`}>
                      {step.icon}
                    </div>
                    <h3 className={`text-2xl font-heading font-bold ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {step.scenario}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className={`text-lg mb-6 leading-relaxed ${
                    darkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {step.description}
                  </p>

                  {/* Example */}
                  <div className={`p-4 rounded-xl ${
                    darkMode
                      ? 'bg-dark-800/60 border border-primary-600/10'
                      : 'bg-gray-50 border border-gray-200'
                  }`}>
                    <p className={`text-sm font-medium mb-1 ${
                      darkMode ? 'text-primary-400' : 'text-primary-600'
                    }`}>Example:</p>
                    <p className={`text-sm ${
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {step.example}
                    </p>
                  </div>
                </motion.div>
              </FadeInWhenVisible>
            ))}
          </div>

          {/* Disclaimer */}
          <FadeInWhenVisible delay={0.3}>
            <div className="mt-12 text-center">
              <p className={`text-sm max-w-3xl mx-auto ${
                darkMode ? 'text-gray-500' : 'text-gray-500'
              }`}>
                <strong>Disclaimer:</strong> Exit protection options are subject to terms and conditions. Please refer to our whitepaper for complete details on exit mechanisms and eligibility requirements.
              </p>
            </div>
          </FadeInWhenVisible>
        </div>
      </section>

      {/* Demand vs Supply Balance */}
      <section className={`relative py-24 ${
        darkMode ? 'bg-dark-900' : 'bg-white'
      }`}>
        <div className="container-custom">
          <FadeInWhenVisible>
            <div className="bg-gradient-to-br from-primary-600 to-secondary-600 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden">
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="w-full h-full" style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                }} />
              </div>

              <div className="relative z-10">
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
                    The Balance Principle
                  </h2>
                  <p className="text-lg text-white/80 max-w-3xl mx-auto">
                    Pronova's demand comes from multiple sources, while supply is carefully controlled through gradual release
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                  {/* High Demand */}
                  <div className="text-center lg:text-left">
                    <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto lg:mx-0 mb-4">
                      <FaUsers size={32} />
                    </div>
                    <h3 className="text-2xl font-heading font-bold mb-3">High Demand</h3>
                    <ul className="space-y-2 text-white/80">
                      <li>Traders & speculators</li>
                      <li>Platform clients (discounts)</li>
                      <li>Corporate clients (payments)</li>
                      <li>Direct investors</li>
                    </ul>
                  </div>

                  {/* Balance */}
                  <div className="text-center">
                    <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-4">
                      <FaBalanceScale size={48} />
                    </div>
                    <h3 className="text-2xl font-heading font-bold">Balanced Growth</h3>
                    <p className="text-white/80 mt-2">Sustainable equilibrium</p>
                  </div>

                  {/* Limited Supply */}
                  <div className="text-center lg:text-right">
                    <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto lg:ml-auto lg:mr-0 mb-4">
                      <FaLock size={32} />
                    </div>
                    <h3 className="text-2xl font-heading font-bold mb-3">Limited Supply</h3>
                    <ul className="space-y-2 text-white/80">
                      <li>Gradual release schedule</li>
                      <li>Vesting periods</li>
                      <li>Anti-dump measures</li>
                      <li>Institutional holdings</li>
                    </ul>
                  </div>
                </div>

                <div className="mt-12 pt-8 border-t border-white/20 text-center">
                  <p className="text-lg text-white/90 max-w-3xl mx-auto">
                    This <strong>high demand</strong> meets a <strong>limited supply</strong> due to gradual token release,
                    creating a state of <strong>balance and continuous growth</strong>.
                  </p>
                </div>
              </div>
            </div>
          </FadeInWhenVisible>
        </div>
      </section>

      {/* Institutional Structure */}
      <section className={`relative py-20 ${
        darkMode ? 'bg-dark-800' : 'bg-gray-50'
      }`}>
        <div className="container-custom">
          <FadeInWhenVisible>
            <div className="text-center mb-12">
              <h2 className={`text-3xl md:text-4xl font-heading font-bold mb-4 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">Institutional</span> Management
              </h2>
              <p className={`text-lg max-w-3xl mx-auto ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Pronova is managed by established companies with distributed responsibilities and controls
              </p>
            </div>
          </FadeInWhenVisible>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <FaShieldAlt size={24} />,
                title: "Supervisory Board",
                description: "Composed of Capimax Financial, HCC Insurance, CIM Financial, and Assurax Risk, overseeing strategic decisions and risk management."
              },
              {
                icon: <FaUsers size={24} />,
                title: "Advisory Board",
                description: "Expert guidance from HCC Insurance, CAPIMax Risk Management, and CIM Finance for strategic planning and compliance."
              },
              {
                icon: <FaBuilding size={24} />,
                title: "Management Team",
                description: "Led by CAPIMAX Holdings UK with support from international branches including CAPIMAX Investments USA and UAE."
              }
            ].map((board, index) => (
              <FadeInWhenVisible key={index} delay={0.1 * (index + 1)}>
                <div className={`p-8 rounded-2xl backdrop-blur-sm border text-center h-full ${
                  darkMode
                    ? 'bg-dark-900/60 border-primary-600/20'
                    : 'bg-white/80 border-gray-200/40'
                }`}>
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white mx-auto mb-4`}>
                    {board.icon}
                  </div>
                  <h4 className={`text-xl font-bold mb-3 ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {board.title}
                  </h4>
                  <p className={`text-sm leading-relaxed ${
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {board.description}
                  </p>
                </div>
              </FadeInWhenVisible>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={`relative py-20 ${
        darkMode ? 'bg-dark-900' : 'bg-white'
      }`}>
        <div className="container-custom">
          <FadeInWhenVisible>
            <div className="relative p-8 md:p-12 rounded-3xl bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600 text-white text-center overflow-hidden shadow-2xl">
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="w-full h-full" style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                }} />
              </div>

              <div className="relative z-10">
                <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
                  Invest with Confidence
                </h2>
                <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
                  Join the presale and benefit from Pronova's institutional-grade stability mechanisms designed to protect your investment.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link
                      to="/presale"
                      className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary-700 font-semibold rounded-xl hover:bg-gray-100 transition-all duration-300"
                    >
                      Join Presale
                    </Link>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link
                      to="/whitepaper"
                      className="inline-flex items-center justify-center px-8 py-4 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border border-white/30 font-semibold rounded-xl transition-all duration-300"
                    >
                      Read Whitepaper
                    </Link>
                  </motion.div>
                </div>
              </div>
            </div>
          </FadeInWhenVisible>
        </div>
      </section>
    </>
  );
};

export default Stability;
