import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { FaShieldAlt } from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import legalSections, { LEGAL_META } from '../data/legalContent';

const Legal = () => {
  const { language } = useLanguage();
  const { darkMode } = useTheme();
  const lang = language === 'ar' ? 'ar' : 'en';
  const isAr = lang === 'ar';
  const meta = LEGAL_META[lang];

  const renderBlock = (block, idx) => {
    if (block.type === 'ul') {
      return (
        <ul key={idx} className={`mb-4 space-y-2 ${isAr ? 'pr-5' : 'pl-5'} list-disc text-gray-600 dark:text-gray-300`}>
          {block.items.map((item, i) => (
            <li key={i} className="leading-relaxed">{item}</li>
          ))}
        </ul>
      );
    }
    return (
      <p key={idx} className="mb-4 leading-relaxed text-gray-600 dark:text-gray-300">{block.text}</p>
    );
  };

  return (
    <div className={`min-h-screen pt-28 pb-20 ${darkMode ? 'bg-dark-900' : 'bg-gray-50'}`}>
      <Helmet>
        <title>{`Pronova (PRN) — ${meta.pageTitle}`}</title>
        <meta
          name="description"
          content="Pronova (PRN) legal and regulatory documentation: disclaimers, risk disclosure, token classification, and compliance notices."
        />
      </Helmet>

      <div className="container-custom" dir={isAr ? 'rtl' : 'ltr'}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-600/10 text-primary-500 mb-5">
            <FaShieldAlt size={28} />
          </div>
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 dark:text-white mb-2">
            Pronova (PRN)
          </h1>
          <h2 className="text-xl md:text-2xl font-heading font-semibold gradient-text mb-4">
            {meta.pageTitle}
          </h2>
          <p className="max-w-3xl mx-auto text-gray-600 dark:text-gray-300 leading-relaxed">
            {meta.intro}
          </p>
        </motion.div>

        {/* Table of contents */}
        <div className="max-w-4xl mx-auto mb-10 bg-white dark:bg-dark-800/60 rounded-2xl p-6 border border-gray-200 dark:border-primary-600/20">
          <ol className={`grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 ${isAr ? 'pr-5' : 'pl-5'} list-decimal text-sm`}>
            {legalSections.map((section) => (
              <li key={section.id} className="text-gray-600 dark:text-gray-300">
                <a href={`#${section.id}`} className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  {section[lang].title}
                </a>
              </li>
            ))}
          </ol>
        </div>

        {/* Sections */}
        <div className="max-w-4xl mx-auto space-y-8">
          {legalSections.map((section, index) => (
            <motion.section
              key={section.id}
              id={section.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.4 }}
              className="scroll-mt-28 bg-white dark:bg-dark-800/60 rounded-2xl p-6 md:p-8 border border-gray-200 dark:border-primary-600/20"
            >
              <h3 className="text-lg md:text-xl font-heading font-bold text-gray-900 dark:text-white mb-4">
                <span className="text-primary-500 mx-1">{index + 1}.</span>
                {section[lang].title}
              </h3>
              {section[lang].blocks.map(renderBlock)}
            </motion.section>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Legal;
