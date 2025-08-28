import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const CountdownTimer = ({ 
  targetDate, 
  phase = 1, 
  variant = 'default',
  showTitle = true,
  onComplete = () => {},
  className = ''
}) => {
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

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });

  // Styling variants
  const variants = {
    default: {
      container: "bg-transparent",
      timeContainer: "countdown-container",
      timeBox: "countdown-item",
      number: "countdown-value",
      label: "countdown-label",
      title: "text-xl font-heading font-semibold text-center mb-6"
    },
    compact: {
      container: "bg-transparent",
      timeContainer: "flex justify-center space-x-3",
      timeBox: "bg-primary-600/10 backdrop-blur-sm border border-primary-600/20 rounded-md p-2 w-16 text-center",
      number: "text-xl font-heading font-bold text-white",
      label: "text-xs text-gray-400 mt-1",
      title: "text-lg font-heading font-medium text-center mb-4 text-white"
    },
    gradient: {
      container: "relative",
      timeContainer: "grid grid-cols-4 gap-2",
      timeBox: "bg-primary-600/20 backdrop-blur-sm border border-primary-600/30 rounded-xl p-3 text-center relative overflow-hidden group hover:border-primary-500/50 transition-all duration-300",
      number: "text-2xl lg:text-3xl font-heading font-bold text-white relative z-10",
      label: "text-xs uppercase tracking-wide text-gray-400 mt-1 relative z-10",
      title: "text-xl font-heading font-semibold text-center mb-6 text-white"
    }
  };

  const style = variants[variant];

  const title = () => {
    if (phase === 0) {
      return "Presale Starts In:";
    } else if (Object.keys(timeLeft).length === 0) {
      return "This presale phase has ended!";
    } else {
      return `Presale Phase ${phase} Ends In:`;
    }
  };

  return (
    <div className={`${style.container} ${className}`}>
      {showTitle && (
        <div className={style.title}>
          {title()}
        </div>
      )}

      {Object.keys(timeLeft).length === 0 ? (
        <div className="text-center py-4 text-lg font-medium text-primary-400">
          This presale phase has ended!
        </div>
      ) : (
        <div className={style.timeContainer}>
          <motion.div 
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.03, 1] }}
            transition={{ duration: 2, repeat: Infinity, repeatType: "loop" }}
            className={style.timeBox}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary-600/0 to-primary-500/0 group-hover:from-primary-600/10 group-hover:to-primary-500/20 transition-all duration-300"></div>
            <div className={style.number}>{timeLeft.days}</div>
            <div className={style.label}>Days</div>
          </motion.div>
          
          <motion.div 
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.03, 1] }}
            transition={{ duration: 2, delay: 0.25, repeat: Infinity, repeatType: "loop" }}
            className={style.timeBox}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary-600/0 to-primary-500/0 group-hover:from-primary-600/10 group-hover:to-primary-500/20 transition-all duration-300"></div>
            <div className={style.number}>{timeLeft.hours}</div>
            <div className={style.label}>Hours</div>
          </motion.div>
          
          <motion.div 
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.03, 1] }}
            transition={{ duration: 2, delay: 0.5, repeat: Infinity, repeatType: "loop" }}
            className={style.timeBox}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary-600/0 to-primary-500/0 group-hover:from-primary-600/10 group-hover:to-primary-500/20 transition-all duration-300"></div>
            <div className={style.number}>{timeLeft.minutes}</div>
            <div className={style.label}>Minutes</div>
          </motion.div>
          
          <motion.div 
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.03, 1] }}
            transition={{ duration: 2, delay: 0.75, repeat: Infinity, repeatType: "loop" }}
            className={style.timeBox}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary-600/0 to-primary-500/0 group-hover:from-primary-600/10 group-hover:to-primary-500/20 transition-all duration-300"></div>
            <div className={style.number}>{timeLeft.seconds}</div>
            <div className={style.label}>Seconds</div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default CountdownTimer;