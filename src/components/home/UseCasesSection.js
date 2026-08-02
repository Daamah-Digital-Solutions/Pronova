import React from 'react';
import { motion } from 'framer-motion';
import { FaExternalLinkAlt, FaBuilding, FaCubes, FaChartPie, FaCoins, FaCheckCircle } from 'react-icons/fa';
import { useTheme } from '../../context/ThemeContext';
import { CAPIMAX_ECOSYSTEM } from '../../config/partners';
import capimaxEcosystemLogo from '../../assets/images/logos for partner/capimax-group-logo.png';

/**
 * "Where you can use PRN" / Use-Cases section (client requests A2 + final-edits).
 *
 * Order (client): Capimax Ecosystem (capimax.io) is featured first, then the
 * licensed platforms strongest-first with the tokenization exchange (BRX) first
 * and RT after ProShare. Every platform shows a "Visit Platform" action and a
 * green "Accepts PRN" badge (its natural home — this is where PRN is used).
 */
const PLATFORMS = [
  {
    name: 'Capimax BRX',
    desc: 'Blockchain real estate exchange & tokenization — institutional-grade access to digitized property.',
    url: 'https://capimaxbrx.com/',
    icon: FaBuilding,
  },
  {
    name: 'Capimax ProShare',
    desc: 'Fractional property ownership marketplace — stake acquisition & yield receipt in PRN.',
    url: 'https://capimaxpropshare.com/',
    icon: FaChartPie,
  },
  {
    name: 'Capimax RT',
    desc: 'Tokenized real estate trading & digital real estate asset marketplace.',
    url: 'https://capimaxrt.com/',
    icon: FaCubes,
  },
  {
    name: 'Capimax ASseT',
    desc: 'Digital asset & RWA management — connecting capital to property investment.',
    url: 'https://capimaxasset.com/',
    icon: FaCoins,
  },
];

const UseCasesSection = () => {
  const { darkMode } = useTheme();

  return (
    <section className={`relative py-20 ${darkMode ? 'bg-dark-900' : 'bg-white'}`}>
      <div className="container-custom relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-600/15 text-primary-500 text-sm font-semibold mb-4">
            Real Utility
          </div>
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4 text-gray-900 dark:text-white">
            Where You Can <span className="gradient-text">Use PRN</span> Today
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            PRN is an official payment method across Capimax’s licensed global platforms. Pay, buy, and invest
            instantly — with up to a 5% discount when paying with PRN.
          </p>
        </div>

        {/* Capimax Ecosystem — featured first (client request) */}
        <motion.a
          href={CAPIMAX_ECOSYSTEM.url}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className={`group block max-w-5xl mx-auto mb-8 rounded-2xl p-7 border transition-all duration-300 ${
            darkMode
              ? 'bg-gradient-to-br from-dark-800/80 to-primary-900/20 border-primary-600/30 hover:border-primary-500/60'
              : 'bg-gradient-to-br from-primary-50/60 to-white border-primary-200/60 hover:border-primary-400/70 hover:shadow-lg'
          }`}
        >
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className={`flex items-center justify-center h-20 w-20 rounded-2xl p-3 flex-shrink-0 ${darkMode ? 'bg-white' : 'bg-white border border-gray-200'}`}>
              <img src={capimaxEcosystemLogo} alt="Capimax Ecosystem logo" className="max-h-full w-auto object-contain" />
            </div>
            <div className="flex-grow text-center sm:text-left">
              <h3 className="font-heading font-bold text-2xl text-gray-900 dark:text-white mb-1">{CAPIMAX_ECOSYSTEM.name}</h3>
              <p className="text-gray-600 dark:text-gray-300 text-base">{CAPIMAX_ECOSYSTEM.description}</p>
            </div>
            <span className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary-600 text-white font-semibold group-hover:bg-primary-700 transition-colors flex-shrink-0">
              Visit <FaExternalLinkAlt size={13} />
            </span>
          </div>
        </motion.a>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {PLATFORMS.map((p, i) => {
            const Icon = p.icon;
            return (
              <motion.a
                key={p.name}
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.05 }}
                className={`group flex flex-col h-full rounded-2xl p-6 border transition-all duration-300 ${
                  darkMode
                    ? 'bg-dark-800/60 border-primary-600/20 hover:border-primary-500/50'
                    : 'bg-gray-50 border-gray-200 hover:border-primary-400/60 hover:shadow-lg'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary-600/15 text-primary-500 flex items-center justify-center">
                    <Icon size={22} />
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-green-500/15 text-green-600 dark:text-green-400">
                    <FaCheckCircle size={11} /> Accepts PRN
                  </span>
                </div>
                <h3 className="font-heading font-bold text-xl text-gray-900 dark:text-white mb-2">{p.name}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm flex-grow">{p.desc}</p>
                <span className="inline-flex items-center gap-2 mt-4 text-sm font-semibold text-primary-500 group-hover:gap-3 transition-all">
                  Visit Platform <FaExternalLinkAlt size={12} />
                </span>
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default UseCasesSection;
