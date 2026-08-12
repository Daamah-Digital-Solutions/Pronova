import React from 'react';
import { motion } from 'framer-motion';
import { FaShieldAlt, FaExternalLinkAlt, FaCheckCircle } from 'react-icons/fa';
import { useTheme } from '../../context/ThemeContext';
import { INSTITUTIONAL_PARTNERS } from '../../config/partners';
import covertechCert from '../../assets/images/certificates/covertech-cert.jpg';
import cimCert from '../../assets/images/certificates/cim-cert.jpg';
import proofanchorCert from '../../assets/images/certificates/proofanchor-cert.jpg';
import solidproofPage from '../../assets/images/certificates/solidproof-page.jpg';

/**
 * Security, Audit, Insurance, Financial & Legal trust section (client requests
 * A3 / WP hero). Every institutional partner the client listed — SolidProof &
 * Proof Anchor (audit), CIM Global Financial (financial), CoverTech /
 * Assurax (insurance), and LexCrest Legal — is rendered as a linked card with
 * its official website (and Proof Anchor's on-chain verification link).
 *
 * Certificate / partnership-page screenshots will be added beside each card
 * once the client supplies them; logos default to a styled initials badge.
 */
const categoryStyles = {
  'Smart Contract Audit': 'bg-primary-500/15 text-primary-500',
  'Financial Partner': 'bg-blue-500/15 text-blue-500',
  'Insurance Partner': 'bg-emerald-500/15 text-emerald-500',
  'Legal Partner': 'bg-amber-500/15 text-amber-500',
};

const initials = (name) =>
  name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

// Verifiable certificates & pages (real screenshots) — click to open full size.
const CERTS = [
  { title: 'CoverTech Insurance', label: 'Strategic Partnership Certificate', img: covertechCert },
  { title: 'CIM Global Financial', label: 'Strategic Partnership Certificate', img: cimCert },
  { title: 'Proof Anchor', label: 'Smart Contract Audit Certificate', img: proofanchorCert },
  { title: 'SolidProof', label: 'TrustNet Audit Listing', img: solidproofPage },
];

const SecurityTrustSection = () => {
  const { darkMode } = useTheme();

  return (
    <section className={`relative py-20 ${darkMode ? 'bg-dark-800' : 'bg-gray-50'}`}>
      <div className="container-custom relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-600/15 text-primary-500 text-sm font-semibold mb-4">
            <FaShieldAlt /> Security, Audit &amp; Compliance
          </div>
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4 text-gray-900 dark:text-white">
            Audited, Insured &amp; <span className="gradient-text">Institutionally Backed</span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Pronova is built on independently audited smart contracts and backed by cyber-insurance, financial oversight,
            and legal counsel from recognized institutional partners — verifiable, not merely promised.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {INSTITUTIONAL_PARTNERS.map((p, i) => (
            <motion.a
              key={p.name}
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.05 }}
              className={`group flex flex-col rounded-2xl p-6 border transition-all duration-300 ${
                darkMode
                  ? 'bg-dark-900/60 border-primary-600/20 hover:border-primary-500/50'
                  : 'bg-white border-gray-200 hover:border-primary-400/60 hover:shadow-lg'
              }`}
            >
              <div className="flex items-center gap-4 mb-4">
                <div
                  className={`flex items-center justify-center h-16 w-16 rounded-xl p-2 flex-shrink-0 ${
                    p.logo
                      ? darkMode
                        ? 'bg-white'
                        : 'bg-gray-50 border border-gray-200'
                      : 'bg-gradient-to-br from-primary-500 to-secondary-500'
                  }`}
                >
                  {p.logo ? (
                    <img src={p.logo} alt={`${p.name} logo`} className="max-h-12 w-auto object-contain" />
                  ) : (
                    <span className="text-lg font-heading font-bold text-white tracking-wide">{initials(p.name)}</span>
                  )}
                </div>
                <div className="min-w-0">
                  <h3 className="font-heading font-semibold text-lg text-gray-900 dark:text-white leading-tight">{p.name}</h3>
                  <span
                    className={`inline-block mt-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
                      categoryStyles[p.category] || 'bg-primary-500/15 text-primary-500'
                    }`}
                  >
                    {p.category}
                  </span>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4 flex-grow">{p.description}</p>
              <div className="flex items-center gap-4 flex-wrap">
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary-500 group-hover:gap-3 transition-all">
                  Visit official site <FaExternalLinkAlt size={11} />
                </span>
                {p.verifyUrl && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-500">
                    <FaCheckCircle size={12} /> On-chain verified
                  </span>
                )}
              </div>
            </motion.a>
          ))}
        </div>

        {/* Verifiable certificates & pages (real screenshots) */}
        <div className="max-w-6xl mx-auto mt-14">
          <div className="text-center mb-6">
            <h3 className="text-xl font-heading font-bold text-gray-900 dark:text-white">Verification &amp; Certificates</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Official partnership and audit documents — click any to view the full page.</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {CERTS.map((c) => (
              <a
                key={c.title}
                href={c.img}
                target="_blank"
                rel="noopener noreferrer"
                className={`group block rounded-xl overflow-hidden border transition-all duration-300 ${
                  darkMode ? 'bg-dark-900/60 border-primary-600/20 hover:border-primary-500/50' : 'bg-white border-gray-200 hover:border-primary-400/60 hover:shadow-lg'
                }`}
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-dark-900">
                  <img src={c.img} alt={`${c.title} — ${c.label}`} className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-3">
                  <div className="text-sm font-semibold text-gray-900 dark:text-white leading-tight">{c.title}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{c.label}</div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SecurityTrustSection;
