import React from 'react';
import { motion } from 'framer-motion';
import { FaExternalLinkAlt, FaBuilding, FaCubes, FaChartPie, FaCoins, FaMobileAlt } from 'react-icons/fa';
import { useTheme } from '../../context/ThemeContext';

/**
 * "Where you can use PRN" / Use-Cases section (client request A4).
 * Licensed Capimax platforms that accept PRN, with direct links.
 */
const PLATFORMS = [
  {
    name: 'Capimax RT',
    desc: 'Tokenized real estate trading & marketplace',
    url: 'https://capimaxrt.com/',
    icon: FaCubes,
  },
  {
    name: 'Capimax BRX',
    desc: 'Blockchain real estate exchange',
    url: 'https://capimaxbrx.com/',
    icon: FaBuilding,
  },
  {
    name: 'Capimax ProShare',
    desc: 'Fractional property ownership',
    url: 'https://capimaxpropshare.com/',
    icon: FaChartPie,
  },
  {
    name: 'Capimax ASseT',
    desc: 'Digital asset & RWA management',
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {PLATFORMS.map((p, i) => {
            const Icon = p.icon;
            const Card = (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.05 }}
                className={`group h-full rounded-2xl p-6 border transition-all duration-300 ${
                  darkMode
                    ? 'bg-dark-800/60 border-primary-600/20 hover:border-primary-500/50'
                    : 'bg-gray-50 border-gray-200 hover:border-primary-400/60 hover:shadow-lg'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary-600/15 text-primary-500 flex items-center justify-center">
                    <Icon size={22} />
                  </div>
                  {p.url && (
                    <FaExternalLinkAlt className="text-gray-400 group-hover:text-primary-500 transition-colors" size={14} />
                  )}
                </div>
                <h3 className="font-heading font-semibold text-lg text-gray-900 dark:text-white mb-1">{p.name}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{p.desc}</p>
                {!p.url && (
                  <span className="inline-block mt-3 text-xs px-2 py-1 rounded-full bg-amber-500/15 text-amber-500">
                    Coming soon
                  </span>
                )}
              </motion.div>
            );

            return p.url ? (
              <a key={p.name} href={p.url} target="_blank" rel="noopener noreferrer" className="block h-full">
                {Card}
              </a>
            ) : (
              <div key={p.name} className="h-full">{Card}</div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default UseCasesSection;
