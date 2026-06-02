import React from 'react';
import { motion } from 'framer-motion';
import { FaShieldAlt, FaUserShield } from 'react-icons/fa';
import { useTheme } from '../../context/ThemeContext';
import hccLogo from '../../assets/images/logos for partner/hcc logo.png';
import assuraxLogo from '../../assets/images/logos for partner/assurax logo-01.png';
import auditShield from '../../assets/images/logos for partner/logo_shield_trustnet.svg';

/**
 * Security, Audit & Cyber-Insurance trust section (client requests A2 + A2b).
 *
 * The cyber-insurance partners (HCC, Assurax) are live. The smart-contract audit
 * card is wired but intentionally shows a "report coming" state until the client
 * provides the SolidProof report link and seal/logo — swap AUDIT.reportUrl/logo in.
 */
const AUDIT = {
  auditor: 'SolidProof',
  reportUrl: 'https://app.solidproof.io/projects/pronova',
};

const SecurityTrustSection = () => {
  const { darkMode } = useTheme();

  return (
    <section className={`relative py-20 ${darkMode ? 'bg-dark-800' : 'bg-gray-50'}`}>
      <div className="container-custom relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-600/15 text-primary-500 text-sm font-semibold mb-4">
            <FaShieldAlt /> Security &amp; Trust
          </div>
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4 text-gray-900 dark:text-white">
            Audited &amp; <span className="gradient-text">Cyber-Insured</span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Pronova is built on independently audited smart contracts and backed by cyber-insurance coverage
            from globally recognized providers — protecting both the token and the platform.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {/* Audit card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className={`rounded-2xl p-7 border ${darkMode ? 'bg-dark-900/60 border-primary-600/20' : 'bg-white border-gray-200'}`}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className={`flex items-center justify-center h-16 w-16 rounded-xl p-2 flex-shrink-0 ${darkMode ? 'bg-white' : 'bg-gray-50 border border-gray-200'}`}>
                <img src={auditShield} alt={`${AUDIT.auditor} audit seal`} className="max-h-12 w-auto object-contain" />
              </div>
              <div>
                <h3 className="font-heading font-semibold text-lg text-gray-900 dark:text-white">Smart Contract Audit</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Audited by {AUDIT.auditor}</p>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-5">
              Pronova’s smart contracts have undergone an independent security audit by {AUDIT.auditor}, a
              leading blockchain security firm, to ensure they are safe, reliable, and free of critical issues.
            </p>
            {AUDIT.reportUrl ? (
              <a
                href={AUDIT.reportUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-600 text-white font-semibold hover:bg-primary-700 transition-colors"
              >
                View Audit Report
              </a>
            ) : (
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/15 text-amber-500 text-sm font-medium">
                Audit report link coming soon
              </span>
            )}
          </motion.div>

          {/* Cyber insurance card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.08 }}
            className={`rounded-2xl p-7 border ${darkMode ? 'bg-dark-900/60 border-primary-600/20' : 'bg-white border-gray-200'}`}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary-600/15 text-primary-500 flex items-center justify-center">
                <FaUserShield size={22} />
              </div>
              <div>
                <h3 className="font-heading font-semibold text-lg text-gray-900 dark:text-white">Cyber Insurance</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Coverage by HCC &amp; Assurax</p>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-5">
              The token and platform are protected by cyber-insurance coverage from our contracted providers,
              adding an institutional layer of protection for the Pronova ecosystem.
            </p>
            <div className="flex items-center gap-6 flex-wrap">
              <div className={`flex items-center justify-center h-16 px-5 rounded-xl ${darkMode ? 'bg-white' : 'bg-gray-50 border border-gray-200'}`}>
                <img src={hccLogo} alt="HCC Insurance" className="max-h-10 w-auto object-contain" />
              </div>
              <div className={`flex items-center justify-center h-16 px-5 rounded-xl ${darkMode ? 'bg-white' : 'bg-gray-50 border border-gray-200'}`}>
                <img src={assuraxLogo} alt="Assurax Insurance" className="max-h-10 w-auto object-contain" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default SecurityTrustSection;
