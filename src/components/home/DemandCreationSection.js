import React from 'react';
import { motion } from 'framer-motion';
import { FaUsers, FaStore, FaHandshake, FaChartLine, FaBalanceScale, FaArrowRight } from 'react-icons/fa';

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

const DemandCreationSection = () => {
  const demandSources = [
    {
      icon: <FaUsers size={28} />,
      title: "Traders & Speculators",
      description: "Cryptocurrency traders seeking quick profit opportunities through market movements.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <FaStore size={28} />,
      title: "Platform Clients",
      description: "Investment platform users benefiting from fee exemptions and purchase discounts.",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: <FaHandshake size={28} />,
      title: "Corporate Clients",
      description: "Companies and businesses using Pronova as a payment method for services and products.",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: <FaChartLine size={28} />,
      title: "Direct Investors",
      description: "Investors seeking direct returns through our institutional investment opportunities.",
      color: "from-green-500 to-emerald-500"
    }
  ];

  return (
    <section className="relative py-24 bg-gray-50 dark:bg-dark-800">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute top-10 right-20 w-80 h-80 bg-secondary-500/5 dark:bg-secondary-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-primary-500/5 dark:bg-primary-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container-custom relative z-10">
        <FadeInWhenVisible>
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-6 py-2 rounded-full bg-gradient-to-r from-primary-500/10 to-secondary-500/10 border border-primary-500/20 mb-6">
              <span className="text-primary-600 dark:text-primary-400 text-sm font-semibold uppercase tracking-wider">Market Dynamics</span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6 text-gray-900 dark:text-white">
              Creating <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">Strong Demand</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Pronova's demand comes from multiple sources, creating sustained interest and value growth.
            </p>
          </div>
        </FadeInWhenVisible>

        {/* Demand Sources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {demandSources.map((source, index) => (
            <FadeInWhenVisible key={index} delay={0.1 * (index + 1)}>
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                className="group bg-white dark:bg-dark-900/90 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 dark:border-primary-600/30 hover:border-primary-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary-500/10 h-full text-center"
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${source.color} flex items-center justify-center text-white mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  {source.icon}
                </div>
                <h3 className="text-lg font-heading font-bold text-gray-900 dark:text-white mb-2">
                  {source.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {source.description}
                </p>
              </motion.div>
            </FadeInWhenVisible>
          ))}
        </div>

        {/* Supply vs Demand Balance */}
        <FadeInWhenVisible delay={0.5}>
          <div className="bg-gradient-to-br from-primary-600 to-secondary-600 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="w-full h-full" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
              }} />
            </div>

            <div className="relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                {/* High Demand */}
                <div className="text-center lg:text-left">
                  <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto lg:mx-0 mb-4">
                    <FaUsers size={32} />
                  </div>
                  <h3 className="text-2xl font-heading font-bold mb-2">High Demand</h3>
                  <p className="text-white/80">
                    Multiple user segments driving consistent market demand
                  </p>
                </div>

                {/* Balance Icon */}
                <div className="text-center">
                  <div className="flex items-center justify-center">
                    <FaArrowRight className="text-white/50 text-2xl mx-4 hidden lg:block" />
                    <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <FaBalanceScale size={48} />
                    </div>
                    <FaArrowRight className="text-white/50 text-2xl mx-4 hidden lg:block transform rotate-180" />
                  </div>
                  <p className="mt-4 text-lg font-semibold">Balanced Growth</p>
                </div>

                {/* Limited Supply */}
                <div className="text-center lg:text-right">
                  <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto lg:ml-auto lg:mr-0 mb-4">
                    <FaChartLine size={32} />
                  </div>
                  <h3 className="text-2xl font-heading font-bold mb-2">Limited Supply</h3>
                  <p className="text-white/80">
                    Gradual release schedule creating intentional scarcity
                  </p>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-white/20 text-center">
                <p className="text-lg text-white/90 max-w-3xl mx-auto">
                  This <strong>high demand</strong> meets a <strong>limited supply</strong> due to gradual token release, creating a state of <strong>balance and continuous growth</strong>.
                </p>
              </div>
            </div>
          </div>
        </FadeInWhenVisible>
      </div>
    </section>
  );
};

export default DemandCreationSection;
