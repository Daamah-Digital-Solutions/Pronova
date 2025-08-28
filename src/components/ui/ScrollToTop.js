import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { darkMode } = useTheme();

  // Show button when user scrolls down 300px
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          whileHover={{ 
            scale: 1.05,
            y: -2,
          }}
          whileTap={{ scale: 0.95 }}
          onClick={scrollToTop}
          className={`fixed bottom-8 right-8 z-50 p-4 bg-gradient-to-br from-primary-600 to-primary-500 text-white rounded-2xl shadow-2xl hover:shadow-neon transition-all duration-300 group backdrop-blur-sm border ${
            darkMode 
              ? 'border-primary-500/30 hover:border-primary-400/50' 
              : 'border-primary-400/20 hover:border-primary-500/40'
          }`}
          aria-label="Scroll to top"
        >
          {/* Simple, clean chevron up icon */}
          <motion.svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
            initial={{ y: 0 }}
            animate={{ y: [0, -2, 0] }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2.5} 
              d="M7 14l5-5 5 5" 
            />
          </motion.svg>
          
          {/* Enhanced glowing background effect */}
          <motion.div 
            className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary-600/40 to-primary-500/40 blur-lg -z-10"
            animate={{
              opacity: [0.3, 0.6, 0.3],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          {/* Subtle inner glow */}
          <div className="absolute inset-0.5 rounded-2xl bg-gradient-to-br from-white/20 to-transparent opacity-30"></div>
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default ScrollToTop;