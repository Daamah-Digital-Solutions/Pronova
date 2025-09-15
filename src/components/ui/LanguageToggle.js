import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { motion } from 'framer-motion';

const LanguageToggle = () => {
  const { language, toggleLanguage } = useLanguage();

  return (
    <motion.button
      onClick={toggleLanguage}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="px-3 py-1 text-sm rounded-full bg-primary-600/10 backdrop-blur-sm text-primary-400 hover:bg-primary-600/20 border border-primary-600/30 transition-colors flex items-center space-x-1 font-medium shadow-neon"
      aria-label="Toggle Language"
    >
      {language === 'en' ? (
        <>
          <span>EN</span>
          <span className="mx-1">|</span>
          <span className="opacity-60">عربي</span>
        </>
      ) : (
        <>
          <span className="opacity-60">EN</span>
          <span className="mx-1">|</span>
          <span>عربي</span>
        </>
      )}
    </motion.button>
  );
};

export default LanguageToggle;