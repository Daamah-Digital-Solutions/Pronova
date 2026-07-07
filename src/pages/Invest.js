import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import {
  FaExternalLinkAlt, FaRocket, FaHome, FaExchangeAlt, FaChartPie,
  FaCubes, FaHandHoldingUsd, FaMoneyBillWave, FaCoins, FaLock, FaBuilding
} from 'react-icons/fa';

// Animation component for elements when they come into view
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
      animate={inView ? { opacity: 1, y: 0, x: 0 } : { opacity: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
};

// Platforms that currently use / accept PRN (Capimax ecosystem)
const PLATFORMS = [
  {
    name: 'Capimax RT',
    tag: 'Tokenized Real Estate',
    url: 'https://capimaxrt.com/',
    desc: 'Tokenized real estate trading and digital real estate asset marketplace — PRN accepted for property token acquisition and trading.',
    icon: FaCubes,
  },
  {
    name: 'Capimax BRX',
    tag: 'Blockchain Real Estate Exchange',
    url: 'https://capimaxbrx.com/',
    desc: 'Blockchain real estate exchange providing institutional-grade access to digitized property assets and ownership.',
    icon: FaExchangeAlt,
  },
  {
    name: 'Capimax ProShare',
    tag: 'Fractional Ownership',
    url: 'https://capimaxpropshare.com/',
    desc: 'Fractional property ownership marketplace — PRN used for fractional stake acquisition and yield receipt.',
    icon: FaChartPie,
  },
  {
    name: 'Capimax ASseT',
    tag: 'Digital Asset & RWA Management',
    url: 'https://capimaxasset.com/',
    desc: 'Digital asset and real-world asset (RWA) management platform connecting blockchain capital to property investment.',
    icon: FaBuilding,
  },
];

// Companies that publicly accept / support PRN
const COMPANIES = [
  { name: 'Capimax Group', country: 'USA & UK', url: 'https://capimaxgroup.com/' },
  { name: 'Westoria Capital', country: 'United States', url: 'https://westoriacapital.com/' },
  { name: 'Crestmark Global', country: 'United Kingdom', url: 'https://crestmarkglobal.com/' },
  { name: 'Valora Estates', country: 'Spain', url: 'https://valoraestatesglobal.com/' },
  { name: 'Aethera Development', country: 'Greece', url: 'https://aetheradevelopment.com/' },
  { name: 'Verdea Estates', country: 'Georgia', url: 'https://verdeaestates.com/' },
  { name: 'Elite Gate Properties', country: 'United Kingdom', url: 'https://elitegateproperties.com/' },
  { name: 'Prime Inn Hotels', country: 'USA & Europe', url: 'https://priminnhotels.com/' },
];

// The five operational pathways for using PRN
const PATHWAYS = [
  { icon: FaHome, title: 'Real Estate', desc: 'Fractional property acquisition, full property purchase, tokenized investment pools, and rental yield receipt.' },
  { icon: FaChartPie, title: 'Investment', desc: 'Institutional investment structures, AI-optimized allocation, and diversified RWA exposure.' },
  { icon: FaHandHoldingUsd, title: 'Financing', desc: 'PRN as loan collateral, real estate mortgage, and Nova Digital Finance lending facilities.' },
  { icon: FaMoneyBillWave, title: 'Payments', desc: 'Fee payments across ecosystem platforms and commercial transactions with partner companies.' },
  { icon: FaCoins, title: 'Staking', desc: 'Earn yield, participate in governance, and unlock premium features and fee discounts.' },
];

const Invest = () => {
  const { darkMode } = useTheme();

  return (
    <>
      <Helmet>
        <title>Use PRN — Real, Instant Utility | Pronova</title>
        <meta name="description" content="Use PRN today across live platforms, financing, and partner companies — real utility before exchange listing. Real estate, tokenized RWA, lending, and payments." />
      </Helmet>

      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-primary-500/5 dark:bg-primary-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary-500/5 dark:bg-secondary-500/10 rounded-full blur-3xl" />
      </div>

      {/* Hero */}
      <section className={`relative min-h-[70vh] flex items-center pt-32 pb-20 overflow-hidden ${
        darkMode ? 'bg-gradient-to-b from-dark-900 via-dark-900/95 to-dark-800' : 'bg-gradient-to-b from-white via-gray-50 to-white'
      }`}>
        <div className="container-custom relative z-10">
          <FadeInWhenVisible>
            <div className="max-w-4xl mx-auto text-center">
              <div className={`inline-flex items-center px-6 py-2 rounded-full backdrop-blur-sm border mb-8 ${
                darkMode ? 'bg-primary-600/20 border-primary-600/30 text-primary-400' : 'bg-primary-100/60 border-primary-200/40 text-primary-700'
              }`}>
                <span className="w-2 h-2 bg-green-500 rounded-full mr-3 animate-pulse" />
                <span className="text-sm font-medium uppercase tracking-wider">Utility Before Listing</span>
              </div>

              <h1 className={`text-4xl md:text-6xl font-heading font-bold mb-6 leading-tight ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                <span className="block">Use </span>
                <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">PRN</span>
                <span className="block">Right Now</span>
              </h1>

              <p className={`text-lg md:text-xl mb-8 leading-relaxed max-w-3xl mx-auto ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                PRN is not a token you simply hold and wait on. As a holder, you can <strong>use it today</strong> —
                across live platforms, financing services, and partner companies. Every payment made in PRN across
                these platforms channels liquidity into the ecosystem, supporting the token's stability and demand.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/presale"
                  className="group inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-2xl bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <span className="mr-2">Buy PRN in the Pre-Sale</span>
                  <FaRocket className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <a
                  href="https://novadf.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-2xl border-2 transition-all duration-300 ${
                    darkMode ? 'border-slate-600 text-slate-200 hover:bg-slate-800/50' : 'border-gray-300 text-gray-700 hover:bg-white'
                  }`}
                >
                  <span className="mr-2">Finance with PRN</span>
                  <FaExternalLinkAlt className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
          </FadeInWhenVisible>
        </div>
      </section>

      {/* 1. Platforms that use PRN */}
      <section className={`relative py-24 ${darkMode ? 'bg-dark-900' : 'bg-white'}`}>
        <div className="container-custom relative z-10">
          <FadeInWhenVisible>
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="inline-block px-4 py-1.5 rounded-full bg-primary-600/15 text-primary-500 text-sm font-semibold mb-4">Live Platforms</span>
              <h2 className={`text-3xl md:text-4xl font-heading font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Platforms That <span className="gradient-text">Use PRN</span>
              </h2>
              <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Four dedicated Capimax platforms already accept and integrate PRN as part of their operational
                infrastructure — a present reality, not a future promise.
              </p>
            </div>
          </FadeInWhenVisible>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {PLATFORMS.map((p, i) => {
              const Icon = p.icon;
              return (
                <FadeInWhenVisible key={i} delay={i * 0.1}>
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group block h-full p-8 rounded-2xl border transition-all duration-300 hover:scale-[1.02] ${
                      darkMode ? 'bg-dark-800/70 border-primary-600/20 hover:border-primary-500/50' : 'bg-gray-50 border-gray-200/60 hover:border-primary-300/70 hover:shadow-xl'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 text-white">
                        <Icon size={22} />
                      </div>
                      <FaExternalLinkAlt className={`w-4 h-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'} group-hover:text-primary-500 transition-colors`} />
                    </div>
                    <h3 className={`text-xl font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{p.name}</h3>
                    <div className="text-sm font-medium text-primary-500 mb-3">{p.tag}</div>
                    <p className={`text-sm leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{p.desc}</p>
                  </a>
                </FadeInWhenVisible>
              );
            })}
          </div>
        </div>
      </section>

      {/* 2. Financing via Nova Digital Finance */}
      <section className={`relative py-24 ${darkMode ? 'bg-dark-800' : 'bg-gray-50'}`}>
        <div className="container-custom relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <FadeInWhenVisible direction="left">
              <div>
                <span className="inline-block px-4 py-1.5 rounded-full bg-primary-600/15 text-primary-500 text-sm font-semibold mb-4">Financing</span>
                <h2 className={`text-3xl md:text-4xl font-heading font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Financing via <span className="gradient-text">Nova Digital Finance</span>
                </h2>
                <p className={`text-lg mb-6 leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Nova Digital Finance is one of the first platforms globally designed to provide financing and
                  lending using PRN itself as the financial instrument — collateralized lending, real estate
                  mortgages, and cross-border settlement.
                </p>
                <div className={`p-5 rounded-2xl border mb-8 ${darkMode ? 'bg-primary-500/10 border-primary-500/30' : 'bg-indigo-50 border-indigo-200'}`}>
                  <div className="flex items-start gap-3">
                    <FaLock className="text-primary-500 mt-1 flex-shrink-0" />
                    <p className={`text-sm leading-relaxed ${darkMode ? 'text-slate-200' : 'text-gray-700'}`}>
                      When PRN is used to finance and acquire real-world assets across the ecosystem, a growing
                      portion of liquidity becomes anchored to those assets — supporting the token's stability and
                      protecting long-term value.
                    </p>
                  </div>
                </div>
                <a
                  href="https://novadf.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  Visit novadf.com <FaExternalLinkAlt size={14} />
                </a>
              </div>
            </FadeInWhenVisible>

            <FadeInWhenVisible direction="right" delay={0.2}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { icon: FaHandHoldingUsd, t: 'PRN-Collateralized Lending' },
                  { icon: FaHome, t: 'Real Estate Mortgages' },
                  { icon: FaExchangeAlt, t: 'Cross-Border Payments' },
                  { icon: FaChartPie, t: 'Partial Property Financing' },
                ].map((x, i) => {
                  const Icon = x.icon;
                  return (
                    <div key={i} className={`p-6 rounded-2xl border ${darkMode ? 'bg-dark-900/70 border-primary-600/20' : 'bg-white border-gray-200/60 shadow-sm'}`}>
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 text-white mb-3">
                        <Icon size={18} />
                      </div>
                      <div className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{x.t}</div>
                    </div>
                  );
                })}
              </div>
            </FadeInWhenVisible>
          </div>
        </div>
      </section>

      {/* 3. Companies that accept PRN */}
      <section className={`relative py-24 ${darkMode ? 'bg-dark-900' : 'bg-white'}`}>
        <div className="container-custom relative z-10">
          <FadeInWhenVisible>
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="inline-block px-4 py-1.5 rounded-full bg-primary-600/15 text-primary-500 text-sm font-semibold mb-4">Verifiable Partners</span>
              <h2 className={`text-3xl md:text-4xl font-heading font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Companies That <span className="gradient-text">Accept PRN</span>
              </h2>
              <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                International real estate and investment companies that publicly announce PRN acceptance on their
                official websites — independently verifiable by anyone.
              </p>
            </div>
          </FadeInWhenVisible>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
            {COMPANIES.map((c, i) => (
              <FadeInWhenVisible key={i} delay={(i % 4) * 0.08}>
                <a
                  href={c.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group flex items-center justify-between p-5 rounded-xl border transition-all duration-300 hover:scale-[1.03] ${
                    darkMode ? 'bg-dark-800/70 border-primary-600/20 hover:border-primary-500/50' : 'bg-gray-50 border-gray-200/60 hover:border-primary-300/70 hover:shadow-lg'
                  }`}
                >
                  <div>
                    <div className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{c.name}</div>
                    <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{c.country}</div>
                  </div>
                  <FaExternalLinkAlt className={`w-4 h-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'} group-hover:text-primary-500 transition-colors`} />
                </a>
              </FadeInWhenVisible>
            ))}
          </div>

          <FadeInWhenVisible delay={0.3}>
            <div className="text-center mt-10">
              <Link to="/partners" className="inline-flex items-center gap-2 text-primary-500 font-semibold hover:underline">
                View all partners <FaExternalLinkAlt size={12} />
              </Link>
            </div>
          </FadeInWhenVisible>
        </div>
      </section>

      {/* 4. Sectors / operational pathways */}
      <section className={`relative py-24 ${darkMode ? 'bg-dark-800' : 'bg-gray-50'}`}>
        <div className="container-custom relative z-10">
          <FadeInWhenVisible>
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="inline-block px-4 py-1.5 rounded-full bg-primary-600/15 text-primary-500 text-sm font-semibold mb-4">Use Cases</span>
              <h2 className={`text-3xl md:text-4xl font-heading font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Five Ways to <span className="gradient-text">Use PRN</span>
              </h2>
              <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Each pathway generates independent, real-world demand for PRN — diversified utility beyond speculation.
              </p>
            </div>
          </FadeInWhenVisible>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 max-w-6xl mx-auto">
            {PATHWAYS.map((p, i) => {
              const Icon = p.icon;
              return (
                <FadeInWhenVisible key={i} delay={i * 0.08}>
                  <div className={`h-full p-6 rounded-2xl border text-center ${darkMode ? 'bg-dark-900/70 border-primary-600/20' : 'bg-white border-gray-200/60 shadow-sm'}`}>
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 text-white mb-4">
                      <Icon size={22} />
                    </div>
                    <h3 className={`text-lg font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{p.title}</h3>
                    <p className={`text-sm leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{p.desc}</p>
                  </div>
                </FadeInWhenVisible>
              );
            })}
          </div>

          <FadeInWhenVisible delay={0.3}>
            <div className="text-center mt-14">
              <Link
                to="/presale"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-primary-600 to-secondary-600 text-white font-semibold shadow-xl hover:scale-105 transition-all duration-300"
              >
                Get PRN in the Pre-Sale <FaRocket size={16} />
              </Link>
            </div>
          </FadeInWhenVisible>
        </div>
      </section>
    </>
  );
};

export default Invest;
