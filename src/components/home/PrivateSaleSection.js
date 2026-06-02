import React from 'react';
import { motion } from 'framer-motion';
import { FaLock, FaCheckCircle, FaBuilding } from 'react-icons/fa';
import { useTheme } from '../../context/ThemeContext';

/**
 * Private Sale highlight section (client request C2).
 * 60,000,000 PRN private sale — fully covered by partner companies.
 */
const PrivateSaleSection = () => {
  const { darkMode } = useTheme();

  return (
    <section className={`relative py-20 ${darkMode ? 'bg-dark-900' : 'bg-white'}`}>
      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="max-w-5xl mx-auto rounded-3xl overflow-hidden border border-primary-500/30 bg-gradient-to-br from-primary-600/10 via-transparent to-secondary-500/10"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 md:p-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-600/15 text-primary-500 text-sm font-semibold mb-5">
                <FaLock /> Private Sale
              </div>
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4 text-gray-900 dark:text-white">
                A <span className="gradient-text">60,000,000 PRN</span> Private Sale —
                Fully Covered
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                Ahead of the public presale, a dedicated allocation of <strong>60,000,000 PRN</strong> was
                offered in a private sale and has been <strong>fully subscribed by partner companies</strong> —
                a strong signal of institutional confidence in Pronova.
              </p>
              <ul className="space-y-3">
                {[
                  'Allocation: 60,000,000 PRN',
                  'Status: 100% covered by companies',
                  'Backed by institutional partners of the Capimax Group',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-gray-700 dark:text-gray-200">
                    <FaCheckCircle className="text-green-500 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex justify-center">
              <div className={`relative w-full max-w-sm rounded-2xl p-8 text-center border ${
                darkMode ? 'bg-dark-800/70 border-primary-600/20' : 'bg-gray-50 border-gray-200'
              }`}>
                <FaBuilding className="mx-auto text-primary-500 mb-4" size={40} />
                <div className="text-4xl md:text-5xl font-heading font-bold gradient-text mb-2">60M</div>
                <div className="text-gray-500 dark:text-gray-400 mb-6">PRN Private Allocation</div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/15 text-green-500 font-semibold">
                  <FaCheckCircle /> Fully Covered
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PrivateSaleSection;
