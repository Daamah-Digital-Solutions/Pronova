import React from 'react';
import { motion } from 'framer-motion';
import { FaLayerGroup, FaPiggyBank, FaChartLine, FaComments } from 'react-icons/fa';
import { useTheme } from '../../context/ThemeContext';

/**
 * Investor Staking section (client request C1).
 *
 * Presented as "coming soon" with the three capabilities the client specified:
 * store (stake), follow/track, and contact. Reward rates / lock periods can be
 * filled in once the client confirms them.
 */
const FEATURES = [
  { icon: FaPiggyBank, title: 'Stake & Store', desc: 'Lock your PRN to support the ecosystem and earn rewards.' },
  { icon: FaChartLine, title: 'Track & Follow', desc: 'Monitor your staked balance and rewards in real time.' },
  { icon: FaComments, title: 'Stay Connected', desc: 'Get direct updates and support for your staking position.' },
];

const StakingSection = () => {
  const { darkMode } = useTheme();

  return (
    <section className={`relative py-20 ${darkMode ? 'bg-dark-900' : 'bg-white'}`}>
      <div className="container-custom relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-600/15 text-primary-500 text-sm font-semibold mb-4">
              <FaLayerGroup /> Staking
            </div>
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4 text-gray-900 dark:text-white">
              PRN <span className="gradient-text">Staking</span> for Investors
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              A dedicated staking program for PRN holders — store your tokens, track your rewards, and stay
              connected. <span className="font-semibold text-primary-500">Launching soon.</span>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: i * 0.06 }}
                  className={`rounded-2xl p-6 text-center border ${
                    darkMode ? 'bg-dark-800/60 border-primary-600/20' : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-primary-600/15 text-primary-500 flex items-center justify-center mb-4">
                    <Icon size={24} />
                  </div>
                  <h3 className="font-heading font-semibold text-lg text-gray-900 dark:text-white mb-2">{f.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{f.desc}</p>
                </motion.div>
              );
            })}
          </div>

          <div className="text-center mt-10">
            <span className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary-600/10 text-primary-500 font-semibold border border-primary-600/30">
              <FaLayerGroup /> Staking dashboard — Coming Soon
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StakingSection;
