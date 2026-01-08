import React from 'react';
import { motion } from 'framer-motion';
import { FaPercent, FaChartLine, FaArrowUp, FaBuilding } from 'react-icons/fa';

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

const HolderBenefitsSection = () => {
  const benefits = [
    {
      icon: <FaPercent size={32} />,
      title: "Direct Benefits",
      subtitle: "Discounts & Exemptions",
      description: "Enjoy fee exemptions (up to 4%) and purchase discounts (up to 5%) when using Pronova for payments and investments with partner companies.",
      highlight: "Up to 9% savings",
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-500/10 dark:bg-green-500/20",
      delay: 0.1
    },
    {
      icon: <FaChartLine size={32} />,
      title: "Investment Returns",
      subtitle: "Profit from Opportunities",
      description: "Benefit from investment returns across 30+ sectors including real estate, gold, metals, hotels, bonds, and insurance through our partner network.",
      highlight: "30+ investment sectors",
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-500/10 dark:bg-blue-500/20",
      delay: 0.2
    },
    {
      icon: <FaArrowUp size={32} />,
      title: "Price Appreciation",
      subtitle: "Market Value Growth",
      description: "When Pronova's market value rises, you can exit directly and realize additional profits from the token's appreciation.",
      highlight: "Capital gains potential",
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-500/10 dark:bg-purple-500/20",
      delay: 0.3
    },
    {
      icon: <FaBuilding size={32} />,
      title: "Institutional Stability",
      subtitle: "Protected Exit Mechanism",
      description: "Managed by specialized blockchain and fintech companies. Exit mechanism: If price rises, exit with same token count. If it falls, exit at original USD value.",
      highlight: "Risk-mitigated exits",
      color: "from-orange-500 to-red-500",
      bgColor: "bg-orange-500/10 dark:bg-orange-500/20",
      delay: 0.4
    }
  ];

  return (
    <section className="relative py-24 bg-white dark:bg-dark-900">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute top-20 left-10 w-96 h-96 bg-primary-500/5 dark:bg-primary-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-secondary-500/5 dark:bg-secondary-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container-custom relative z-10">
        <FadeInWhenVisible>
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-6 py-2 rounded-full bg-gradient-to-r from-primary-500/10 to-secondary-500/10 border border-primary-500/20 mb-6">
              <span className="text-primary-600 dark:text-primary-400 text-sm font-semibold uppercase tracking-wider">Token Holder Benefits</span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6 text-gray-900 dark:text-white">
              <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">Four Ways</span> to Profit
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Pronova token holders enjoy multiple profit avenues - from direct discounts to investment returns and price appreciation.
            </p>
          </div>
        </FadeInWhenVisible>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {benefits.map((benefit, index) => (
            <FadeInWhenVisible key={index} delay={benefit.delay}>
              <motion.div
                whileHover={{ scale: 1.02, y: -5 }}
                className="group bg-gray-50 dark:bg-dark-800/80 backdrop-blur-sm rounded-3xl p-8 border border-gray-200 dark:border-primary-600/20 hover:border-primary-500/50 dark:hover:border-primary-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary-500/10 h-full"
              >
                <div className="flex items-start mb-6">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${benefit.color} flex items-center justify-center text-white mr-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    {benefit.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-1">
                      {benefit.title}
                    </h3>
                    <p className="text-sm text-primary-600 dark:text-primary-400 font-medium">
                      {benefit.subtitle}
                    </p>
                  </div>
                </div>

                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                  {benefit.description}
                </p>

                <div className={`${benefit.bgColor} rounded-xl px-4 py-3 inline-block`}>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {benefit.highlight}
                  </span>
                </div>
              </motion.div>
            </FadeInWhenVisible>
          ))}
        </div>

        {/* Disclaimer */}
        <FadeInWhenVisible delay={0.5}>
          <div className="mt-12 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-3xl mx-auto">
              <strong>Disclaimer:</strong> The benefits described represent potential opportunities and are not guaranteed returns. Cryptocurrency investments carry inherent risks. Please review our whitepaper and conduct your own research before investing.
            </p>
          </div>
        </FadeInWhenVisible>
      </div>
    </section>
  );
};

export default HolderBenefitsSection;
