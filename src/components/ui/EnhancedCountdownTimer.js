import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

const EnhancedCountdownTimer = ({ 
  targetDate, 
  phase = 1, 
  showTitle = true,
  onComplete = () => {},
  className = ''
}) => {
  const { darkMode } = useTheme();
  const calculateTimeLeft = () => {
    const difference = +new Date(targetDate) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    } else {
      onComplete();
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  const [previousSeconds, setPreviousSeconds] = useState(timeLeft.seconds);

  useEffect(() => {
    const timer = setTimeout(() => {
      const newTimeLeft = calculateTimeLeft();
      setPreviousSeconds(timeLeft.seconds);
      setTimeLeft(newTimeLeft);
    }, 1000);

    return () => clearTimeout(timer);
  });

  const animateNumber = (value, unit) => {
    const valueStr = value !== undefined ? String(value).padStart(2, '0') : '00';
    
    return (
      <div className="text-center">
        <div className={`relative rounded-xl p-3 sm:p-4 shadow-lg hover:shadow-xl transition-all duration-300 ${
          darkMode 
            ? 'bg-gradient-to-br from-dark-800 to-dark-900 border border-primary-500/30' 
            : 'bg-gradient-to-br from-white to-gray-50 border border-primary-300/40'
        }`}>
          {/* Background glow */}
          <div className={`absolute inset-0 rounded-xl ${
            darkMode 
              ? 'bg-gradient-to-br from-primary-500/10 to-secondary-500/10' 
              : 'bg-gradient-to-br from-primary-200/20 to-secondary-200/20'
          }`}></div>
          
          {/* Number display */}
          <div className="relative">
            <AnimatePresence mode="popLayout">
              <motion.div
                key={value}
                initial={{ y: -30, opacity: 0, scale: 0.8 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: 30, opacity: 0, scale: 0.8 }}
                transition={{ 
                  duration: 0.5, 
                  ease: "backOut",
                  type: "spring",
                  damping: 15,
                  stiffness: 200
                }}
                className={`text-2xl sm:text-3xl lg:text-4xl font-bold font-mono ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}
              >
                {valueStr}
              </motion.div>
            </AnimatePresence>
            
            {/* Pulse effect for seconds */}
            {unit === 'seconds' && (
              <motion.div 
                className="absolute inset-0 bg-primary-500/20 rounded-xl"
                animate={{ 
                  opacity: previousSeconds !== timeLeft.seconds ? [0, 0.5, 0] : 0,
                  scale: previousSeconds !== timeLeft.seconds ? [1, 1.1, 1] : 1
                }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
            )}
          </div>
        </div>
        
        {/* Unit label */}
        <div className={`mt-2 text-xs sm:text-sm font-medium uppercase tracking-wider ${
          darkMode ? 'text-gray-400' : 'text-gray-600'
        }`}>
          {unit}
        </div>
      </div>
    );
  };

  const title = () => {
    if (phase === 0) {
      return "⏰ Presale Starts In:";
    } else if (Object.keys(timeLeft).length === 0) {
      return "🎉 This presale phase has ended!";
    } else {
      return `⏰ Presale Phase ${phase} Ends In:`;
    }
  };

  return (
    <div className={`${className}`}>
      {showTitle && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-4"
        >
          <h3 className={`text-lg font-semibold ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>{title()}</h3>
        </motion.div>
      )}

      {Object.keys(timeLeft).length === 0 ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className={`text-center py-6 text-lg font-medium text-primary-400 rounded-lg border ${
            darkMode 
              ? 'bg-dark-800/50 border-primary-500/20' 
              : 'bg-primary-50/50 border-primary-300/30'
          }`}
        >
          🎉 This presale phase has ended!
        </motion.div>
      ) : (
        <div className="grid grid-cols-4 gap-2 sm:gap-4">
          {animateNumber(timeLeft.days, 'days')}
          {animateNumber(timeLeft.hours, 'hours')}
          {animateNumber(timeLeft.minutes, 'minutes')}
          {animateNumber(timeLeft.seconds, 'seconds')}
        </div>
      )}
    </div>
  );
};

export default EnhancedCountdownTimer;