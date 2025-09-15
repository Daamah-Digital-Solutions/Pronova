import React from 'react';
import { motion } from 'framer-motion';
import { FaCheck, FaClock } from 'react-icons/fa';
import Button from '../../ui/Button';

// Animation for section elements when they come into view
const FadeInWhenVisible = ({ children, delay = 0, direction = null }) => {
  const [ref, inView] = React.useState([null, false]);

  React.useEffect(() => {
    if (ref && ref.current) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            inView[1](true);
            observer.disconnect();
          }
        },
        { threshold: 0.1 }
      );
      observer.observe(ref.current);
      return () => observer.disconnect();
    }
  }, [ref]);

  return (
    <motion.div
      ref={elem => {
        ref[0] = elem;
        return elem;
      }}
      initial={{ 
        opacity: 0,
        y: direction === 'up' ? 50 : direction === 'down' ? -50 : 0,
        x: direction === 'left' ? 50 : direction === 'right' ? -50 : 0,
      }}
      animate={inView ? 
        { opacity: 1, y: 0, x: 0 } :
        { opacity: 0 }
      }
      transition={{ 
        duration: 0.8, 
        ease: [0.22, 1, 0.36, 1],
        delay
      }}
    >
      {children}
    </motion.div>
  );
};

// Animated background shape component
const AnimatedShape = ({ className, delay = 0, duration = 20 }) => (
  <motion.div
    className={`shape ${className}`}
    animate={{ 
      y: [0, -30, 0],
      opacity: [0.3, 0.5, 0.3],
      scale: [1, 1.05, 1]
    }}
    transition={{ 
      duration,
      delay,
      repeat: Infinity,
      repeatType: "reverse" 
    }}
  />
);

// Enhanced Roadmap Item Component
const EnhancedRoadmapItem = ({ 
  title, 
  date, 
  milestones, 
  isActive, 
  isCompleted, 
  progress, 
  delay = 0
}) => {
  return (
    <FadeInWhenVisible delay={delay}>
      <div className={`relative p-6 md:p-8 rounded-2xl backdrop-blur-sm h-full transition-all duration-500 border shadow-lg
        ${isActive 
          ? 'bg-white dark:bg-dark-900/90 border-primary-500 dark:border-primary-400 shadow-primary-500/20 dark:shadow-primary-500/40' 
          : isCompleted 
            ? 'bg-white dark:bg-dark-900/90 border-green-500 dark:border-green-400 shadow-green-500/20 dark:shadow-green-500/40' 
            : 'bg-white dark:bg-dark-900/90 border-gray-200 dark:border-primary-600/30 hover:border-primary-500/50 dark:hover:border-primary-500/50'}`
      }>
        {isActive && (
          <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2 bg-primary-600 text-white text-xs font-bold py-1 px-2 rounded-full">
            Active
          </div>
        )}
        
        <div className="mb-4">
          <span className="text-sm text-gray-600 dark:text-gray-400 block mb-1">{date}</span>
          <h3 className="text-xl font-heading font-bold text-gray-900 dark:text-white">{title}</h3>
        </div>
        
        <div className="space-y-3 mb-5">
          {milestones.map((milestone, idx) => (
            <div key={idx} className="flex items-start">
              <div className={`flex-shrink-0 w-5 h-5 rounded-full mr-3 flex items-center justify-center text-xs
              ${milestone.completed 
              ? 'bg-green-500 text-white' 
              : isActive 
              ? 'bg-primary-500/20 dark:bg-primary-500/30 text-primary-600 dark:text-primary-400' 
              : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}`
              }>
                {milestone.completed ? <FaCheck size={10} /> : ''}
              </div>
              <span className={milestone.completed ? 'text-gray-900 dark:text-white font-medium' : 'text-gray-600 dark:text-gray-400'}>
              {milestone.text}
              </span>
            </div>
          ))}
        </div>
        
        {progress > 0 && (
          <>
            <div className="w-full bg-gray-200 dark:bg-dark-700 rounded-full h-2 mb-2 overflow-hidden">
              <div 
                className={`h-2 rounded-full transition-all duration-1000 ease-out ${isCompleted ? 'bg-green-500' : 'bg-gradient-to-r from-primary-500 to-secondary-500'}`}
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="text-right text-sm">
              <span className={isCompleted ? 'text-green-500 dark:text-green-400' : 'text-primary-500 dark:text-primary-400'}>
                {progress}% complete
              </span>
            </div>
          </>
        )}
      </div>
    </FadeInWhenVisible>
  );
};

const EnhancedRoadmapSection = () => {
  // Roadmap data from whitepaper
  const roadmapItems = [
    {
      title: "Q2 2025 - Development & Initial Launch",
      date: "April - June 2025",
      milestones: [
        { text: "Website Development", completed: true },
        { text: "Smart Contract Deployment on Ethereum", completed: true },
        { text: "Community Building & Social Media Presence", completed: true },
        { text: "Private Sale & Early Investor Round", completed: false }
      ],
      isActive: true,
      isCompleted: false,
      progress: 75,
      delay: 0.1
    },
    {
      title: "Q3 2025 - Token Sale & DEX Listing",
      date: "July - September 2025",
      milestones: [
        { text: "Initial Smart Contract Audit", completed: false },
        { text: "Beginning of Pre-Sale (ICO/IDO/IEO)", completed: false },
        { text: "DEX Listing on Uniswap, Pancake Swap", completed: false },
        { text: "CEX Negotiations with Kucoin, bitget, Gate.io", completed: false }
      ],
      isActive: false,
      isCompleted: false,
      progress: 0,
      delay: 0.2
    },
    {
      title: "Q4 2025 - Ecosystem Expansion & Adoption",
      date: "October - December 2025",
      milestones: [
        { text: "Pronova Wallet Launch (Beta Version)", completed: false },
        { text: "Payment Gateway Integration", completed: false },
        { text: "Pronova Rewards Program", completed: false }
      ],
      isActive: false,
      isCompleted: false,
      progress: 0,
      delay: 0.3
    },
    {
      title: "Q1 2026 - Utility & Real-World Use Cases",
      date: "January - March 2026",
      milestones: [
        { text: "Integration with E-commerce Platforms", completed: false },
        { text: "Real Estate & Gold Investment Use Cases", completed: false },
        { text: "Expansion into More Exchanges", completed: false }
      ],
      isActive: false,
      isCompleted: false,
      progress: 0,
      delay: 0.4
    }
  ];

  return (
    <section id="roadmap" className="relative py-24 bg-gray-50 dark:bg-dark-900">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary-500/5 dark:bg-secondary-500/10 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container-custom">
        <FadeInWhenVisible>
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-6 py-2 rounded-full bg-gradient-to-r from-primary-500/10 to-secondary-500/10 border border-primary-500/20 mb-6">
              <span className="text-primary-600 dark:text-primary-400 text-sm font-semibold uppercase tracking-wider">Development Timeline</span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6 text-gray-900 dark:text-white">
              <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">Pronova</span> Roadmap
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Our strategic plan for <span className="font-semibold text-primary-600 dark:text-primary-400">development and growth</span> over the coming years
            </p>
          </div>
        </FadeInWhenVisible>

        {/* Current Progress Highlight */}
        <FadeInWhenVisible>
          <div className="mb-16 flex flex-col md:flex-row items-center justify-center p-8 bg-gradient-to-r from-primary-500/10 via-white dark:via-dark-900 to-secondary-500/10 border border-primary-500/20 rounded-2xl backdrop-blur-sm shadow-lg">
            <div className="mb-6 md:mb-0 md:mr-8 w-24 h-24 rounded-full flex items-center justify-center bg-gradient-to-br from-primary-500 to-secondary-500 shadow-lg">
              <div className="text-center text-white">
                <span className="block text-3xl font-bold">75%</span>
                <span className="text-xs opacity-90">Phase 1</span>
              </div>
            </div>
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-heading font-bold mb-2 text-gray-900 dark:text-white">
                Currently in Development Phase
              </h3>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl leading-relaxed">
                We're currently in the first phase of our roadmap, with website development, 
                smart contract deployment, and community building already completed. 
                Join us as we prepare for the private sale and early investor round!
              </p>
            </div>
          </div>
        </FadeInWhenVisible>

        {/* Roadmap Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {roadmapItems.map((item, index) => (
            <EnhancedRoadmapItem
              key={index}
              title={item.title}
              date={item.date}
              milestones={item.milestones}
              isActive={item.isActive}
              isCompleted={item.isCompleted}
              progress={item.progress}
              delay={item.delay}
            />
          ))}
        </div>

        <div className="text-center">
          <FadeInWhenVisible delay={0.5}>
            <Button 
              variant="gradient"
              size="large"
              to="/roadmap"
              className="px-8 py-4 text-lg font-semibold"
            >
              🗺️ View Full Roadmap
            </Button>
          </FadeInWhenVisible>
        </div>
      </div>
    </section>
  );
};

export default EnhancedRoadmapSection;