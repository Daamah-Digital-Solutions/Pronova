import React from 'react';
import { motion } from 'framer-motion';
import { FaBuilding, FaShieldAlt, FaGlobe, FaChartLine } from 'react-icons/fa';

// Animation for section elements when they come into view
const FadeInWhenVisible = ({ children, delay = 0, direction = null }) => {
  const [ref, setRef] = React.useState(null);
  const [inView, setInView] = React.useState(false);

  React.useEffect(() => {
    if (ref) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setInView(true);
            observer.disconnect();
          }
        },
        { threshold: 0.1 }
      );
      observer.observe(ref);
      return () => observer.disconnect();
    }
  }, [ref]);

  return (
    <motion.div
      ref={setRef}
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

const WhatIsPronovaSection = () => {
  const keyPoints = [
    {
      icon: <FaBuilding size={24} />,
      title: "Institutional Foundation",
      description: "Developed by Capimax Blockchain & FinTech and Capimax Virtual Assets, subsidiaries of the global Capimax Holding UK group."
    },
    {
      icon: <FaShieldAlt size={24} />,
      title: "Security & Stability",
      description: "Designed to be secure, stable, and valuable, combining daily cryptocurrency utility with institutional protection."
    },
    {
      icon: <FaGlobe size={24} />,
      title: "Global Reach",
      description: "Backed by 18+ international companies across UK, USA, and UAE, providing real-world investment opportunities."
    },
    {
      icon: <FaChartLine size={24} />,
      title: "7+ Years Experience",
      description: "Built on extensive experience in blockchain, fintech, and virtual assets management."
    }
  ];

  return (
    <section className="relative py-24 bg-white dark:bg-dark-900">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute top-20 right-10 w-72 h-72 bg-primary-500/5 dark:bg-primary-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-secondary-500/5 dark:bg-secondary-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left side - Text content */}
          <FadeInWhenVisible direction="left">
            <div>
              <div className="inline-flex items-center px-6 py-2 rounded-full bg-gradient-to-r from-primary-500/10 to-secondary-500/10 border border-primary-500/20 mb-6">
                <span className="text-primary-600 dark:text-primary-400 text-sm font-semibold uppercase tracking-wider">About Pronova</span>
              </div>

              <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6 text-gray-900 dark:text-white">
                What is <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">Pronova</span>?
              </h2>

              <div className="space-y-6 text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                <p>
                  <strong className="text-gray-900 dark:text-white">Pronova (PRN)</strong> is a digital cryptocurrency founded and developed by a British-American global group of companies through <strong className="text-primary-600 dark:text-primary-400">Capimax Blockchain & FinTech</strong> and <strong className="text-primary-600 dark:text-primary-400">Capimax Virtual Assets</strong>, both subsidiaries of Capimax Holding UK.
                </p>

                <p>
                  Unlike speculative tokens, Pronova was developed to be a <strong className="text-gray-900 dark:text-white">secure, stable, and valuable currency</strong> that combines everyday cryptocurrency utility with institutional protection that sets it apart from others.
                </p>

                <p>
                  With over <strong className="text-primary-600 dark:text-primary-400">7 years of experience</strong> in blockchain, fintech, and virtual assets, our group has created a currency designed for <strong className="text-gray-900 dark:text-white">real-world utility</strong> and <strong className="text-gray-900 dark:text-white">institutional stability</strong>.
                </p>
              </div>
            </div>
          </FadeInWhenVisible>

          {/* Right side - Key points grid */}
          <FadeInWhenVisible direction="right" delay={0.2}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {keyPoints.map((point, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.03, y: -5 }}
                  className="group bg-gray-50 dark:bg-dark-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 dark:border-primary-600/20 hover:border-primary-500/50 dark:hover:border-primary-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary-500/10"
                >
                  <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500/10 to-secondary-500/10 dark:from-primary-500/20 dark:to-secondary-500/20 text-primary-600 dark:text-primary-400 group-hover:from-primary-500 group-hover:to-secondary-500 group-hover:text-white transition-all duration-300">
                    {point.icon}
                  </div>
                  <h3 className="text-lg font-heading font-bold mb-2 text-gray-900 dark:text-white">
                    {point.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {point.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </FadeInWhenVisible>
        </div>
      </div>
    </section>
  );
};

export default WhatIsPronovaSection;
