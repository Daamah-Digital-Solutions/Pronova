import React from 'react';
import { motion } from 'framer-motion';
import { FaHandHoldingUsd, FaMoneyBillWave, FaHome, FaExchangeAlt, FaExternalLinkAlt } from 'react-icons/fa';
import { useTheme } from '../../context/ThemeContext';

/**
 * Nova Digital Finance section (client request v2).
 *
 * Highlights Nova Digital Finance — the UK-incorporated platform that finances
 * the ecosystem and is one of the first platforms globally to provide lending
 * using PRN itself as the financial instrument.
 */
const ROLES = [
  { icon: FaHandHoldingUsd, title: 'PRN-Collateralized Lending', desc: 'Use your PRN as collateral to access liquidity without selling your tokens.' },
  { icon: FaHome, title: 'Real Estate Financing', desc: 'PRN-denominated mortgage structures to finance property acquisitions.' },
  { icon: FaMoneyBillWave, title: 'Ecosystem Financing', desc: 'Obtain financing in PRN and deploy it directly across ecosystem platforms.' },
  { icon: FaExchangeAlt, title: 'Cross-Border Payments', desc: 'Near-instant PRN settlement at a fraction of traditional banking costs.' },
];

const NovaDigitalFinanceSection = () => {
  const { darkMode } = useTheme();

  return (
    <section className={`relative py-20 ${darkMode ? 'bg-dark-800' : 'bg-gray-50'}`}>
      <div className="container-custom relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-600/15 text-primary-500 text-sm font-semibold mb-4">
              <FaHandHoldingUsd /> Financing
            </div>
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4 text-gray-900 dark:text-white">
              Powered by <span className="gradient-text">Nova Digital Finance</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Nova Digital Finance is the UK-incorporated engine that finances the Pronova ecosystem — one of the
              first platforms globally designed to provide financing and lending using{' '}
              <span className="font-semibold text-primary-500">PRN itself</span> as the financial instrument.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {ROLES.map((r, i) => {
              const Icon = r.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className={`p-6 rounded-2xl border h-full ${
                    darkMode
                      ? 'bg-dark-900/70 border-primary-600/20'
                      : 'bg-white border-gray-200/60 shadow-sm'
                  }`}
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 text-white mb-4">
                    <Icon size={20} />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">{r.title}</h3>
                  <p className={`text-sm leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {r.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>

          <div className="text-center">
            <a
              href="https://novadf.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              Finance with PRN at novadf.com <FaExternalLinkAlt size={14} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NovaDigitalFinanceSection;
