import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { useTheme } from '../context/ThemeContext';
import { FaChartLine, FaShieldAlt, FaGlobe, FaHandshake, FaExternalLinkAlt, FaRocket, FaGem, FaStar } from 'react-icons/fa';

// Animation component for elements when they come into view
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

const Invest = () => {
  const { darkMode } = useTheme();

  const benefits = [
    {
      icon: <FaChartLine className="w-8 h-8" />,
      title: "Diversify Your Portfolio",
      description: "Invest in assets like real estate, commodities, and innovative tech startups.",
      delay: 0.1
    },
    {
      icon: <FaStar className="w-8 h-8" />,
      title: "Exclusive Access",
      description: "Gain entry to investment opportunities typically reserved for institutional clients.",
      delay: 0.2
    },
    {
      icon: <FaGlobe className="w-8 h-8" />,
      title: "Seamless Integration",
      description: "Use your digital assets to fuel your journey into traditional investment markets.",
      delay: 0.3
    },
    {
      icon: <FaShieldAlt className="w-8 h-8" />,
      title: "Trusted Partner",
      description: "All opportunities are curated and managed by the reputable team at Capimax Investments.",
      delay: 0.4
    }
  ];

  return (
    <>
      <Helmet>
        <title>Invest by Pronova - Exclusive Investment Opportunities</title>
        <meta name="description" content="Unlock exclusive investment opportunities with Pronova. Partner with Capimax Investments to grow your portfolio beyond crypto with real-world assets." />
      </Helmet>

      {/* Advanced CSS for premium animations */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes float {
            0%, 100% {
              transform: translateY(0px) rotate(0deg);
            }
            33% {
              transform: translateY(-10px) rotate(1deg);
            }
            66% {
              transform: translateY(-20px) rotate(-1deg);
            }
          }

          @keyframes float-slow {
            0%, 100% {
              transform: translateY(0px) translateX(0px);
            }
            25% {
              transform: translateY(-15px) translateX(5px);
            }
            50% {
              transform: translateY(-30px) translateX(0px);
            }
            75% {
              transform: translateY(-15px) translateX(-5px);
            }
          }

          @keyframes pulse-glow {
            0%, 100% {
              opacity: 1;
              filter: drop-shadow(0 0 10px rgba(147, 51, 234, 0.3));
            }
            50% {
              opacity: 0.8;
              filter: drop-shadow(0 0 25px rgba(147, 51, 234, 0.6));
            }
          }

          @keyframes shimmer {
            0% {
              background-position: -200% 0;
            }
            100% {
              background-position: 200% 0;
            }
          }

          @keyframes gradient-xy {
            0%, 100% {
              background-size: 400% 400%;
              background-position: 0% 50%;
            }
            50% {
              background-size: 400% 400%;
              background-position: 100% 50%;
            }
          }

          @keyframes scale-in {
            0% {
              transform: scale(0.8) rotate(-5deg);
              opacity: 0;
            }
            50% {
              transform: scale(1.05) rotate(2deg);
              opacity: 0.7;
            }
            100% {
              transform: scale(1) rotate(0deg);
              opacity: 1;
            }
          }

          @keyframes slide-in-right {
            0% {
              transform: translateX(50px) rotateY(-15deg);
              opacity: 0;
            }
            100% {
              transform: translateX(0) rotateY(0deg);
              opacity: 1;
            }
          }

          @keyframes morph {
            0%, 100% {
              border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
            }
            50% {
              border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%;
            }
          }

          .animate-float {
            animation: float 8s ease-in-out infinite;
          }

          .animate-float-slow {
            animation: float-slow 12s ease-in-out infinite;
          }

          .animate-pulse-glow {
            animation: pulse-glow 3s ease-in-out infinite;
          }

          .animate-shimmer {
            background: linear-gradient(
              90deg,
              transparent,
              rgba(255, 255, 255, 0.4),
              transparent
            );
            background-size: 200% 100%;
            animation: shimmer 2s infinite;
          }

          .animate-gradient {
            background: linear-gradient(45deg, #6366f1, #8b5cf6, #a855f7, #c084fc);
            background-size: 400% 400%;
            animation: gradient-xy 4s ease infinite;
          }

          .animate-scale-in {
            animation: scale-in 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          }

          .animate-slide-in-right {
            animation: slide-in-right 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          }

          .animate-morph {
            animation: morph 8s ease-in-out infinite;
          }

          .glass-effect {
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          }

          .dark .glass-effect {
            background: rgba(15, 23, 42, 0.6);
            border: 1px solid rgba(148, 163, 184, 0.2);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          }

          .bg-radial-gradient {
            background: radial-gradient(circle, var(--tw-gradient-stops));
          }

          .perspective-1000 {
            perspective: 1000px;
          }

          .transform-gpu {
            transform-style: preserve-3d;
            will-change: transform;
          }
        `
      }} />

      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-primary-500/5 dark:bg-primary-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary-500/5 dark:bg-secondary-500/10 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-primary-500/3 dark:from-primary-500/5 to-transparent rounded-full" />
      </div>

      {/* Premium Hero Section */}
      <section className={`relative min-h-screen flex items-center justify-center overflow-hidden ${
        darkMode
          ? 'bg-gradient-to-br from-gray-950 via-gray-900 to-slate-950'
          : 'bg-gradient-to-br from-gray-50 via-white to-blue-50'
      }`}>
        {/* Advanced Background Grid */}
        <div className="absolute inset-0">
          <div className={`absolute inset-0 opacity-20 ${
            darkMode
              ? "bg-[linear-gradient(rgba(147,51,234,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(147,51,234,0.1)_1px,transparent_1px)] bg-[size:100px_100px]"
              : "bg-[linear-gradient(rgba(99,102,241,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.1)_1px,transparent_1px)] bg-[size:100px_100px]"
          }`} />
          {/* Radial overlay */}
          <div className={`absolute inset-0 ${
            darkMode
              ? 'bg-radial-gradient from-transparent via-gray-900/50 to-gray-950'
              : 'bg-radial-gradient from-transparent via-white/50 to-blue-50'
          }`} />
        </div>

        {/* Premium floating elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-violet-600/10 to-blue-600/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-600/10 to-pink-600/10 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}} />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-indigo-600/5 to-cyan-600/5 rounded-full blur-3xl" />
        </div>

        <div className="container-custom relative z-10 pt-20">
          {/* Corporate Badge */}
          <FadeInWhenVisible>
            <div className="flex justify-center mb-12">
              <div className={`inline-flex items-center px-8 py-3 rounded-full backdrop-blur-sm border shadow-lg ${
                darkMode
                  ? 'bg-slate-900/60 border-slate-700/50 text-slate-300'
                  : 'bg-white/60 border-gray-200/50 text-gray-700'
              }`}>
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3 animate-pulse" />
                <span className="text-sm font-medium uppercase tracking-wider">Institutional Grade Investments</span>
                <div className="w-2 h-2 bg-green-500 rounded-full ml-3 animate-pulse" />
              </div>
            </div>
          </FadeInWhenVisible>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7">
              <FadeInWhenVisible direction="left" delay={0.2}>
                <div className="text-left">
                  {/* Premium Headline */}
                  <h1 className={`text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-[0.9] mb-8 ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    <span className="block mb-2">Invest</span>
                    <span className="block bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">Beyond</span>
                    <span className="block">Crypto</span>
                  </h1>

                  {/* Elite Subtitle */}
                  <div className={`text-xl md:text-2xl lg:text-3xl mb-8 font-light leading-relaxed ${
                    darkMode ? 'text-slate-400' : 'text-gray-600'
                  }`}>
                    <p className="mb-4">Exclusive access to institutional-grade</p>
                    <p className={`${
                      darkMode ? 'text-violet-400' : 'text-indigo-600'
                    } font-semibold`}>real-world investment opportunities</p>
                  </div>

                  {/* Value Proposition */}
                  <p className={`text-lg md:text-xl mb-12 leading-relaxed max-w-2xl ${
                    darkMode ? 'text-slate-300' : 'text-gray-700'
                  }`}>
                    Partner with Capimax Investments to diversify your portfolio with premium assets typically reserved for institutional clients. Bridge digital and traditional finance with confidence.
                  </p>

                  {/* Premium CTA */}
                  <div className="flex flex-col sm:flex-row gap-6">
                    <motion.a
                      href="https://panel.capimaxinvestment.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`group inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-2xl transition-all duration-300 transform hover:scale-105 ${
                        darkMode
                          ? 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-xl shadow-violet-500/25'
                          : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-xl shadow-indigo-500/25'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="mr-2">Access Investment Portal</span>
                      <FaExternalLinkAlt className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </motion.a>

                    <motion.button
                      className={`inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-2xl border-2 backdrop-blur-sm transition-all duration-300 ${
                        darkMode
                          ? 'border-slate-600 text-slate-300 hover:bg-slate-800/50 hover:border-slate-500'
                          : 'border-gray-300 text-gray-700 hover:bg-white/50 hover:border-gray-400'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Learn More
                    </motion.button>
                  </div>
                </div>
              </FadeInWhenVisible>
            </div>

            {/* Right Visual */}
            <div className="lg:col-span-5">
              <FadeInWhenVisible direction="right" delay={0.4}>
                <div className="relative">
                  {/* Premium Stats Card */}
                  <div className={`relative p-8 rounded-3xl backdrop-blur-sm border shadow-2xl ${
                    darkMode
                      ? 'bg-slate-900/60 border-slate-700/50'
                      : 'bg-white/60 border-gray-200/50'
                  }`}>
                    {/* Partnership Badge */}
                    <div className="flex items-center justify-between mb-8">
                      <div className={`px-4 py-2 rounded-full text-sm font-medium ${
                        darkMode
                          ? 'bg-violet-600/20 text-violet-400'
                          : 'bg-indigo-100 text-indigo-700'
                      }`}>
                        Powered by Capimax
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                        <span className={`text-sm ${
                          darkMode ? 'text-slate-400' : 'text-gray-600'
                        }`}>Live</span>
                      </div>
                    </div>

                    {/* Investment Categories */}
                    <div className="space-y-6">
                      {[
                        { icon: '🏢', label: 'Real Estate', value: 'Premium Properties', growth: '+12.5%' },
                        { icon: '💎', label: 'Commodities', value: 'Gold & Silver', growth: '+8.2%' },
                        { icon: '🚀', label: 'Tech Startups', value: 'Innovation Fund', growth: '+18.7%' },
                        { icon: '📊', label: 'Market Access', value: 'Institutional', growth: 'Exclusive' }
                      ].map((item, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <span className="text-2xl">{item.icon}</span>
                            <div>
                              <p className={`font-semibold ${
                                darkMode ? 'text-white' : 'text-gray-900'
                              }`}>{item.label}</p>
                              <p className={`text-sm ${
                                darkMode ? 'text-slate-400' : 'text-gray-600'
                              }`}>{item.value}</p>
                            </div>
                          </div>
                          <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                            item.growth.includes('%')
                              ? darkMode
                                ? 'bg-green-600/20 text-green-400'
                                : 'bg-green-100 text-green-700'
                              : darkMode
                                ? 'bg-violet-600/20 text-violet-400'
                                : 'bg-indigo-100 text-indigo-700'
                          }`}>
                            {item.growth}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-r from-violet-600/20 to-indigo-600/20 rounded-full blur-xl" />
                    <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-full blur-xl" />
                  </div>

                  {/* Floating Elements */}
                  <div className="absolute -z-10 top-8 right-8 w-32 h-32 bg-gradient-to-r from-violet-600/10 to-indigo-600/10 rounded-full blur-2xl animate-float" />
                  <div className="absolute -z-10 bottom-8 left-8 w-24 h-24 bg-gradient-to-r from-purple-600/10 to-pink-600/10 rounded-full blur-2xl animate-float" style={{animationDelay: '3s'}} />
                </div>
              </FadeInWhenVisible>
            </div>
          </div>

          {/* Trust Indicators */}
          <FadeInWhenVisible delay={0.6}>
            <div className="mt-20 text-center">
              <p className={`text-sm mb-6 ${
                darkMode ? 'text-slate-500' : 'text-gray-500'
              }`}>Trusted by investors worldwide</p>
              <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
                {[
                  '🔒 Bank-Grade Security',
                  '🏆 Regulated Partner',
                  '📈 Proven Track Record',
                  '🌐 Global Access'
                ].map((item, index) => (
                  <div key={index} className={`text-sm font-medium ${
                    darkMode ? 'text-slate-400' : 'text-gray-600'
                  }`}>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </FadeInWhenVisible>
        </div>

        {/* Premium Bottom Separator */}
        <div className="absolute bottom-0 left-0 w-full">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className={`w-full h-20 ${
            darkMode ? 'text-slate-800' : 'text-gray-100'
          }`}>
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" fill="currentColor"></path>
            <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" fill="currentColor"></path>
            <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" fill="currentColor"></path>
          </svg>
        </div>
      </section>

      {/* Professional Stats/Metrics Section */}
      <section className={`relative py-20 ${
        darkMode ? 'bg-slate-800' : 'bg-gray-100'
      }`}>
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                number: '$2.5B+',
                label: 'Assets Under Management',
                icon: '📊',
                description: 'Total value managed through Capimax partnership'
              },
              {
                number: '15,000+',
                label: 'Active Investors',
                icon: '👥',
                description: 'Global community of verified investors'
              },
              {
                number: '98.7%',
                label: 'Client Satisfaction',
                icon: '⭐',
                description: 'Highest rated investment platform'
              },
              {
                number: '24/7',
                label: 'Market Access',
                icon: '🌍',
                description: 'Round-the-clock investment opportunities'
              }
            ].map((stat, index) => (
              <FadeInWhenVisible key={index} delay={index * 0.1}>
                <div className={`group text-center p-8 rounded-2xl backdrop-blur-sm border transition-all duration-500 hover:scale-105 ${
                  darkMode
                    ? 'bg-slate-900/50 border-slate-700/50 hover:bg-slate-900/70 hover:border-slate-600'
                    : 'bg-white/50 border-gray-200/50 hover:bg-white/70 hover:border-gray-300'
                }`}>
                  {/* Icon */}
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {stat.icon}
                  </div>

                  {/* Number */}
                  <div className={`text-4xl lg:text-5xl font-bold mb-2 bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent`}>
                    {stat.number}
                  </div>

                  {/* Label */}
                  <h3 className={`text-lg font-semibold mb-2 ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {stat.label}
                  </h3>

                  {/* Description */}
                  <p className={`text-sm leading-relaxed ${
                    darkMode ? 'text-slate-400' : 'text-gray-600'
                  }`}>
                    {stat.description}
                  </p>

                  {/* Hover Effect Line */}
                  <div className="mt-4 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-12 h-0.5 bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full"></div>
                  </div>
                </div>
              </FadeInWhenVisible>
            ))}
          </div>

          {/* Additional Trust Metrics */}
          <FadeInWhenVisible delay={0.5}>
            <div className="mt-16 text-center">
              <div className={`inline-flex items-center space-x-8 px-8 py-4 rounded-2xl backdrop-blur-sm border ${
                darkMode
                  ? 'bg-slate-900/40 border-slate-700/40'
                  : 'bg-white/40 border-gray-200/40'
              }`}>
                {[
                  { icon: '🔒', text: 'SEC Regulated' },
                  { icon: '🏆', text: 'Award Winning' },
                  { icon: '🛡️', text: 'Insured Deposits' },
                  { icon: '✨', text: 'Premium Access' }
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <span className="text-xl">{item.icon}</span>
                    <span className={`text-sm font-medium ${
                      darkMode ? 'text-slate-300' : 'text-gray-700'
                    }`}>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </FadeInWhenVisible>
        </div>
      </section>

      {/* Premium Benefits Section */}
      <section className={`relative py-24 ${
        darkMode ? 'bg-gradient-to-b from-slate-950 to-gray-950' : 'bg-gradient-to-b from-white to-gray-50'
      }`}>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className={`absolute inset-0 ${
            darkMode
              ? "bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent)] bg-[size:100px_100px]"
              : "bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.05),transparent)] bg-[size:100px_100px]"
          }`} />
        </div>

        <div className="container-custom relative z-10">
          <FadeInWhenVisible>
            <div className="text-center mb-20">
              {/* Premium Badge */}
              <div className={`inline-flex items-center px-8 py-3 rounded-full backdrop-blur-sm border shadow-lg mb-8 ${
                darkMode
                  ? 'bg-slate-900/60 border-slate-700/50 text-slate-300'
                  : 'bg-white/60 border-gray-200/50 text-gray-700'
              }`}>
                <FaGem className={`w-5 h-5 mr-3 ${
                  darkMode ? 'text-violet-400' : 'text-indigo-600'
                }`} />
                <span className="text-sm font-medium uppercase tracking-wider">Premium Investment Benefits</span>
                <div className="w-2 h-2 bg-green-500 rounded-full ml-3 animate-pulse" />
              </div>

              {/* Headline */}
              <h2 className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                <span className="block mb-2">Why Choose</span>
                <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">Pronova Investments</span>
              </h2>

              <p className={`text-xl max-w-4xl mx-auto leading-relaxed ${
                darkMode ? 'text-slate-400' : 'text-gray-600'
              }`}>
                Access institutional-grade opportunities with the security and innovation you deserve
              </p>
            </div>
          </FadeInWhenVisible>

          {/* Premium Benefits Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {[
              {
                icon: <FaChartLine className="w-8 h-8" />,
                title: "Diversified Portfolio Access",
                description: "Premium real estate, commodities, and innovative tech startups curated by industry experts.",
                features: ["Real Estate Portfolios", "Commodity Futures", "Tech Startup Equity", "Alternative Assets"],
                color: "from-violet-600 to-purple-600",
                delay: 0.1
              },
              {
                icon: <FaStar className="w-8 h-8" />,
                title: "Institutional-Grade Access",
                description: "Exclusive investment opportunities typically reserved for institutional clients and high-net-worth individuals.",
                features: ["Minimum Investment Barriers Removed", "Professional Fund Management", "Institutional Research", "Priority Access"],
                color: "from-indigo-600 to-blue-600",
                delay: 0.2
              },
              {
                icon: <FaGlobe className="w-8 h-8" />,
                title: "Seamless Crypto Integration",
                description: "Bridge your digital assets with traditional investments through our advanced platform infrastructure.",
                features: ["Crypto-to-Investment Bridge", "Real-time Settlement", "Multi-asset Support", "Advanced Analytics"],
                color: "from-purple-600 to-pink-600",
                delay: 0.3
              },
              {
                icon: <FaShieldAlt className="w-8 h-8" />,
                title: "Trusted Partnership",
                description: "All opportunities curated and managed by Capimax Investments' experienced team with proven track record.",
                features: ["SEC Regulated Partner", "Transparent Reporting", "Risk Management", "24/7 Support"],
                color: "from-cyan-600 to-teal-600",
                delay: 0.4
              }
            ].map((benefit, index) => (
              <FadeInWhenVisible key={index} delay={benefit.delay}>
                <div className={`group relative overflow-hidden rounded-3xl backdrop-blur-sm border transition-all duration-700 hover:scale-[1.02] ${
                  darkMode
                    ? 'bg-slate-900/60 border-slate-700/50 hover:bg-slate-900/80 hover:border-slate-600'
                    : 'bg-white/60 border-gray-200/50 hover:bg-white/80 hover:border-gray-300'
                }`}>
                  {/* Gradient Background */}
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${benefit.color} opacity-10 rounded-full blur-2xl transform translate-x-16 -translate-y-16 group-hover:scale-150 transition-transform duration-700`} />

                  <div className="relative p-8">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-6">
                      <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${benefit.color} text-white shadow-xl group-hover:shadow-2xl group-hover:scale-110 transition-all duration-500`}>
                        {benefit.icon}
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        darkMode ? 'bg-slate-800 text-slate-300' : 'bg-gray-100 text-gray-600'
                      }`}>
                        Premium
                      </div>
                    </div>

                    {/* Content */}
                    <h3 className={`text-2xl font-bold mb-4 ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {benefit.title}
                    </h3>

                    <p className={`text-base leading-relaxed mb-6 ${
                      darkMode ? 'text-slate-400' : 'text-gray-600'
                    }`}>
                      {benefit.description}
                    </p>

                    {/* Features List */}
                    <div className="space-y-2">
                      {benefit.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center space-x-3">
                          <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${benefit.color}`} />
                          <span className={`text-sm ${
                            darkMode ? 'text-slate-300' : 'text-gray-700'
                          }`}>{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* Hover Arrow */}
                    <div className="mt-6 flex items-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-0 group-hover:translate-x-2">
                      <div className={`h-px flex-1 bg-gradient-to-r ${benefit.color}`} />
                      <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${benefit.color} ml-2`} />
                    </div>
                  </div>
                </div>
              </FadeInWhenVisible>
            ))}
          </div>

          {/* Bottom Trust Bar */}
          <FadeInWhenVisible delay={0.6}>
            <div className={`p-8 rounded-3xl backdrop-blur-sm border text-center ${
              darkMode
                ? 'bg-slate-900/40 border-slate-700/40'
                : 'bg-white/40 border-gray-200/40'
            }`}>
              <p className={`text-sm mb-4 ${
                darkMode ? 'text-slate-400' : 'text-gray-600'
              }`}>Backed by industry leaders</p>
              <div className="flex flex-wrap justify-center items-center gap-8">
                {[
                  { icon: '🔒', text: 'Bank-Grade Security', desc: 'Military-level encryption' },
                  { icon: '🏆', text: 'Award Winning', desc: 'Industry recognition' },
                  { icon: '👥', text: '15,000+ Investors', desc: 'Trusted globally' },
                  { icon: '📊', text: '$2.5B+ AUM', desc: 'Assets under management' }
                ].map((item, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl mb-2">{item.icon}</div>
                    <div className={`text-sm font-semibold ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>{item.text}</div>
                    <div className={`text-xs ${
                      darkMode ? 'text-slate-400' : 'text-gray-500'
                    }`}>{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </FadeInWhenVisible>
        </div>
      </section>

      {/* Investment Opportunities Showcase */}
      <section className={`relative py-24 overflow-hidden ${
        darkMode ? 'bg-slate-900' : 'bg-white'
      }`}>
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className={`absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-violet-600/10 to-purple-600/10 rounded-full blur-3xl`} />
          <div className={`absolute bottom-0 right-1/4 w-80 h-80 bg-gradient-to-r from-indigo-600/10 to-cyan-600/10 rounded-full blur-3xl`} />
        </div>

        <div className="container-custom relative z-10">
          {/* Section Header */}
          <FadeInWhenVisible>
            <div className="text-center mb-16">
              <div className={`inline-flex items-center px-8 py-3 rounded-full backdrop-blur-sm border shadow-lg mb-8 ${
                darkMode
                  ? 'bg-slate-900/60 border-slate-700/50 text-slate-300'
                  : 'bg-white/60 border-gray-200/50 text-gray-700'
              }`}>
                <FaRocket className={`w-5 h-5 mr-3 ${
                  darkMode ? 'text-violet-400' : 'text-indigo-600'
                }`} />
                <span className="text-sm font-medium uppercase tracking-wider">Investment Opportunities</span>
              </div>

              <h2 className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-8 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                <span className="block mb-2">Explore Premium</span>
                <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">Investment Categories</span>
              </h2>

              <p className={`text-xl max-w-4xl mx-auto leading-relaxed ${
                darkMode ? 'text-slate-400' : 'text-gray-600'
              }`}>
                Discover carefully curated investment opportunities across multiple asset classes
              </p>
            </div>
          </FadeInWhenVisible>

          {/* Opportunities Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {[
              {
                category: "Real Estate Portfolio",
                title: "Premium Properties",
                description: "Diversified real estate investments across commercial, residential, and industrial properties in prime locations.",
                expectedReturn: "8-12% APY",
                minInvestment: "$1,000",
                riskLevel: "Medium",
                features: ["Prime Locations", "Professional Management", "Rental Income", "Capital Appreciation"],
                color: "from-emerald-600 to-teal-600",
                icon: "🏢",
                delay: 0.1
              },
              {
                category: "Tech Innovation Fund",
                title: "Startup Equity",
                description: "Early-stage investments in promising technology startups with high growth potential and experienced founding teams.",
                expectedReturn: "15-25% APY",
                minInvestment: "$2,500",
                riskLevel: "High",
                features: ["Early Stage Access", "Due Diligence", "Portfolio Diversification", "Exit Strategies"],
                color: "from-violet-600 to-purple-600",
                icon: "🚀",
                delay: 0.2
              },
              {
                category: "Commodities Trading",
                title: "Precious Metals",
                description: "Strategic investments in gold, silver, and other precious metals as hedge against inflation and market volatility.",
                expectedReturn: "6-10% APY",
                minInvestment: "$500",
                riskLevel: "Low-Medium",
                features: ["Inflation Hedge", "Physical Storage", "Market Liquidity", "Portfolio Stability"],
                color: "from-amber-600 to-yellow-600",
                icon: "💎",
                delay: 0.3
              }
            ].map((opportunity, index) => (
              <FadeInWhenVisible key={index} delay={opportunity.delay}>
                <div className={`group relative overflow-hidden rounded-3xl backdrop-blur-sm border transition-all duration-700 hover:scale-105 ${
                  darkMode
                    ? 'bg-slate-900/60 border-slate-700/50 hover:bg-slate-900/80 hover:border-slate-600'
                    : 'bg-white/60 border-gray-200/50 hover:bg-white/80 hover:border-gray-300'
                }`}>
                  {/* Background Gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${opportunity.color} opacity-5 group-hover:opacity-10 transition-opacity duration-500`} />

                  <div className="relative p-8">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="text-4xl">{opportunity.icon}</div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        opportunity.riskLevel === 'Low-Medium'
                          ? darkMode ? 'bg-green-600/20 text-green-400' : 'bg-green-100 text-green-700'
                          : opportunity.riskLevel === 'Medium'
                          ? darkMode ? 'bg-yellow-600/20 text-yellow-400' : 'bg-yellow-100 text-yellow-700'
                          : darkMode ? 'bg-red-600/20 text-red-400' : 'bg-red-100 text-red-700'
                      }`}>
                        {opportunity.riskLevel} Risk
                      </div>
                    </div>

                    {/* Category */}
                    <div className={`text-sm font-medium mb-2 ${
                      darkMode ? 'text-violet-400' : 'text-indigo-600'
                    }`}>
                      {opportunity.category}
                    </div>

                    {/* Title */}
                    <h3 className={`text-2xl font-bold mb-4 ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {opportunity.title}
                    </h3>

                    {/* Description */}
                    <p className={`text-base leading-relaxed mb-6 ${
                      darkMode ? 'text-slate-400' : 'text-gray-600'
                    }`}>
                      {opportunity.description}
                    </p>

                    {/* Key Metrics */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className={`p-3 rounded-xl ${
                        darkMode ? 'bg-slate-800/50' : 'bg-gray-50'
                      }`}>
                        <div className={`text-sm ${
                          darkMode ? 'text-slate-400' : 'text-gray-600'
                        }`}>Expected Return</div>
                        <div className={`font-bold ${
                          darkMode ? 'text-white' : 'text-gray-900'
                        }`}>{opportunity.expectedReturn}</div>
                      </div>
                      <div className={`p-3 rounded-xl ${
                        darkMode ? 'bg-slate-800/50' : 'bg-gray-50'
                      }`}>
                        <div className={`text-sm ${
                          darkMode ? 'text-slate-400' : 'text-gray-600'
                        }`}>Min. Investment</div>
                        <div className={`font-bold ${
                          darkMode ? 'text-white' : 'text-gray-900'
                        }`}>{opportunity.minInvestment}</div>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="space-y-2 mb-6">
                      {opportunity.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center space-x-3">
                          <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${opportunity.color}`} />
                          <span className={`text-sm ${
                            darkMode ? 'text-slate-300' : 'text-gray-700'
                          }`}>{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* Action Button */}
                    <button className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
                      darkMode
                        ? 'bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 text-white'
                        : 'bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-900'
                    } group-hover:scale-105`}>
                      Learn More
                    </button>
                  </div>
                </div>
              </FadeInWhenVisible>
            ))}
          </div>

          {/* Bottom Info */}
          <FadeInWhenVisible delay={0.5}>
            <div className={`text-center p-8 rounded-3xl backdrop-blur-sm border ${
              darkMode
                ? 'bg-slate-900/40 border-slate-700/40'
                : 'bg-white/40 border-gray-200/40'
            }`}>
              <h3 className={`text-xl font-bold mb-4 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Ready to diversify your portfolio?
              </h3>
              <p className={`text-base mb-6 ${
                darkMode ? 'text-slate-400' : 'text-gray-600'
              }`}>
                Access these exclusive opportunities through our partnership with Capimax Investments
              </p>
              <div className="flex flex-wrap justify-center gap-6">
                {[
                  '🔒 Secure & Regulated',
                  '📊 Professional Management',
                  '🌐 Global Opportunities',
                  '✨ Institutional Access'
                ].map((item, index) => (
                  <span key={index} className={`text-sm ${
                    darkMode ? 'text-slate-300' : 'text-gray-700'
                  }`}>{item}</span>
                ))}
              </div>
            </div>
          </FadeInWhenVisible>
        </div>
      </section>

      {/* Sophisticated CTA Section */}
      <section className={`relative py-32 overflow-hidden ${
        darkMode ? 'bg-gradient-to-br from-slate-950 via-gray-900 to-slate-900' : 'bg-gradient-to-br from-indigo-50 via-white to-purple-50'
      }`}>
        {/* Premium Background Elements */}
        <div className="absolute inset-0">
          {/* Animated gradient orbs */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-violet-600/20 to-purple-600/20 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-indigo-600/20 to-cyan-600/20 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}} />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-purple-600/10 to-pink-600/10 rounded-full blur-3xl" />

          {/* Grid pattern */}
          <div className={`absolute inset-0 opacity-10 ${
            darkMode
              ? "bg-[linear-gradient(rgba(147,51,234,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(147,51,234,0.2)_1px,transparent_1px)] bg-[size:50px_50px]"
              : "bg-[linear-gradient(rgba(99,102,241,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.2)_1px,transparent_1px)] bg-[size:50px_50px]"
          }`} />
        </div>

        <div className="container-custom relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7">
              <FadeInWhenVisible direction="left" delay={0.2}>
                <div className="max-w-2xl">
                  {/* Premium Badge */}
                  <div className={`inline-flex items-center px-8 py-3 rounded-full backdrop-blur-sm border shadow-lg mb-8 ${
                    darkMode
                      ? 'bg-slate-900/60 border-slate-700/50 text-slate-300'
                      : 'bg-white/60 border-gray-200/50 text-gray-700'
                  }`}>
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3 animate-pulse" />
                    <span className="text-sm font-medium uppercase tracking-wider">Ready to Invest</span>
                    <FaRocket className={`w-4 h-4 ml-3 ${
                      darkMode ? 'text-violet-400' : 'text-indigo-600'
                    }`} />
                  </div>

                  {/* Main Headline */}
                  <h2 className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    <span className="block mb-2">Start Your</span>
                    <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">Investment Journey</span>
                    <span className="block">Today</span>
                  </h2>

                  {/* Value Proposition */}
                  <p className={`text-xl mb-8 leading-relaxed ${
                    darkMode ? 'text-slate-400' : 'text-gray-600'
                  }`}>
                    Join thousands of investors accessing institutional-grade opportunities through our secure partnership with Capimax Investments.
                  </p>

                  {/* Key Points */}
                  <div className="space-y-4 mb-10">
                    {[
                      { icon: '✅', text: 'Instant account setup' },
                      { icon: '🔒', text: 'Bank-grade security' },
                      { icon: '📊', text: 'Professional portfolio management' },
                      { icon: '🌐', text: 'Global investment access' }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center space-x-4">
                        <span className="text-xl">{item.icon}</span>
                        <span className={`text-lg ${
                          darkMode ? 'text-slate-300' : 'text-gray-700'
                        }`}>{item.text}</span>
                      </div>
                    ))}
                  </div>

                  {/* Primary CTA */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <motion.a
                      href="https://panel.capimaxinvestment.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`group inline-flex items-center justify-center px-8 py-4 text-lg font-bold rounded-2xl transition-all duration-500 transform hover:scale-105 shadow-2xl ${
                        darkMode
                          ? 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-violet-500/25'
                          : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-indigo-500/25'
                      }`}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="mr-3">Access Investment Portal</span>
                      <FaExternalLinkAlt className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform" />

                      {/* Button glow effect */}
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500 -z-10" />
                    </motion.a>

                    <motion.button
                      className={`inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-2xl border-2 backdrop-blur-sm transition-all duration-300 ${
                        darkMode
                          ? 'border-slate-600 text-slate-300 hover:bg-slate-800/50 hover:border-slate-500'
                          : 'border-gray-300 text-gray-700 hover:bg-white/50 hover:border-gray-400'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Schedule Consultation
                    </motion.button>
                  </div>
                </div>
              </FadeInWhenVisible>
            </div>

            {/* Right Visual */}
            <div className="lg:col-span-5">
              <FadeInWhenVisible direction="right" delay={0.4}>
                <div className="relative">
                  {/* Main CTA Card */}
                  <div className={`relative p-8 rounded-3xl backdrop-blur-sm border shadow-2xl ${
                    darkMode
                      ? 'bg-slate-900/60 border-slate-700/50'
                      : 'bg-white/60 border-gray-200/50'
                  }`}>
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                      <div className={`px-4 py-2 rounded-full text-sm font-medium ${
                        darkMode
                          ? 'bg-green-600/20 text-green-400'
                          : 'bg-green-100 text-green-700'
                      }`}>
                        Secure & Trusted
                      </div>
                      <div className="text-2xl">🔒</div>
                    </div>

                    <h3 className={`text-2xl font-bold mb-4 ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      Investment Portal Access
                    </h3>

                    <p className={`text-base mb-6 ${
                      darkMode ? 'text-slate-400' : 'text-gray-600'
                    }`}>
                      Connect to Capimax Investments' secure platform for institutional-grade investment opportunities.
                    </p>

                    {/* Features List */}
                    <div className="space-y-4 mb-8">
                      {[
                        { title: 'Instant Access', desc: 'Connect your account immediately' },
                        { title: 'Portfolio Diversity', desc: 'Real estate, tech, commodities' },
                        { title: 'Professional Support', desc: '24/7 investment guidance' },
                        { title: 'Transparent Fees', desc: 'No hidden charges or surprises' }
                      ].map((feature, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-full mt-2" />
                          <div>
                            <div className={`font-semibold ${
                              darkMode ? 'text-white' : 'text-gray-900'
                            }`}>{feature.title}</div>
                            <div className={`text-sm ${
                              darkMode ? 'text-slate-400' : 'text-gray-600'
                            }`}>{feature.desc}</div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Trust Indicators */}
                    <div className={`p-4 rounded-xl border ${darkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-gray-50 border-gray-200'}`}>
                      <div className="flex items-center justify-between text-sm">
                        <span className={darkMode ? 'text-slate-300' : 'text-gray-700'}>Trusted by</span>
                        <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>15,000+ investors</span>
                      </div>
                      <div className="flex items-center justify-between text-sm mt-2">
                        <span className={darkMode ? 'text-slate-300' : 'text-gray-700'}>Assets managed</span>
                        <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>$2.5B+</span>
                      </div>
                    </div>
                  </div>

                  {/* Floating elements */}
                  <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-r from-violet-600/20 to-purple-600/20 rounded-full blur-xl animate-float" />
                  <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-r from-indigo-600/20 to-cyan-600/20 rounded-full blur-xl animate-float" style={{animationDelay: '3s'}} />
                </div>
              </FadeInWhenVisible>
            </div>
          </div>

          {/* Bottom Disclaimer */}
          <FadeInWhenVisible delay={0.6}>
            <div className="mt-20 text-center">
              <div className={`max-w-4xl mx-auto p-6 rounded-2xl backdrop-blur-sm border ${
                darkMode
                  ? 'bg-slate-900/40 border-slate-700/40'
                  : 'bg-white/40 border-gray-200/40'
              }`}>
                <p className={`text-sm leading-relaxed ${
                  darkMode ? 'text-slate-400' : 'text-gray-600'
                }`}>
                  <strong>Secure Redirect Notice:</strong> You will be redirected to the secure portal of our trusted partner, Capimax Investments.
                  All investments are subject to their terms and conditions. Your security and privacy are our top priorities.
                </p>

                {/* Security badges */}
                <div className="flex flex-wrap justify-center items-center gap-6 mt-4 opacity-70">
                  {[
                    '🔒 SSL Encrypted',
                    '🏆 SEC Regulated',
                    '🛡️ Insured Deposits',
                    '✨ Professional Grade'
                  ].map((badge, index) => (
                    <span key={index} className={`text-xs font-medium ${
                      darkMode ? 'text-slate-400' : 'text-gray-500'
                    }`}>{badge}</span>
                  ))}
                </div>
              </div>
            </div>
          </FadeInWhenVisible>
        </div>
      </section>

      {/* Trust Indicators & Testimonials */}
      <section className={`relative py-24 ${
        darkMode ? 'bg-slate-800' : 'bg-gray-100'
      }`}>
        <div className="container-custom">
          {/* Section Header */}
          <FadeInWhenVisible>
            <div className="text-center mb-16">
              <div className={`inline-flex items-center px-8 py-3 rounded-full backdrop-blur-sm border shadow-lg mb-8 ${
                darkMode
                  ? 'bg-slate-900/60 border-slate-700/50 text-slate-300'
                  : 'bg-white/60 border-gray-200/50 text-gray-700'
              }`}>
                <FaStar className={`w-5 h-5 mr-3 text-yellow-500`} />
                <span className="text-sm font-medium uppercase tracking-wider">Trusted by Investors</span>
              </div>

              <h2 className={`text-4xl md:text-5xl font-bold mb-8 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                <span className="block mb-2">Join Thousands of</span>
                <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">Successful Investors</span>
              </h2>
            </div>
          </FadeInWhenVisible>

          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {[
              {
                name: "Sarah Chen",
                title: "Portfolio Manager",
                location: "Singapore",
                rating: 5,
                testimonial: "The diversification opportunities through Pronova have been exceptional. Access to real estate and commodities that were previously out of reach.",
                investment: "$50K+ invested",
                avatar: "👩‍💼",
                delay: 0.1
              },
              {
                name: "Michael Rodriguez",
                title: "Tech Entrepreneur",
                location: "Austin, TX",
                rating: 5,
                testimonial: "Professional platform with institutional-grade opportunities. The Capimax partnership gives me confidence in every investment.",
                investment: "$100K+ invested",
                avatar: "👨‍💻",
                delay: 0.2
              },
              {
                name: "Emma Thompson",
                title: "Investment Advisor",
                location: "London, UK",
                rating: 5,
                testimonial: "Seamless bridge between crypto and traditional assets. My clients love the transparency and professional management.",
                investment: "$200K+ invested",
                avatar: "👩‍💼",
                delay: 0.3
              }
            ].map((testimonial, index) => (
              <FadeInWhenVisible key={index} delay={testimonial.delay}>
                <div className={`group p-8 rounded-3xl backdrop-blur-sm border transition-all duration-500 hover:scale-105 ${
                  darkMode
                    ? 'bg-slate-900/60 border-slate-700/50 hover:bg-slate-900/80 hover:border-slate-600'
                    : 'bg-white/60 border-gray-200/50 hover:bg-white/80 hover:border-gray-300'
                }`}>
                  {/* Rating */}
                  <div className="flex items-center mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <FaStar key={i} className="w-5 h-5 text-yellow-500 mr-1" />
                    ))}
                    <span className={`ml-2 text-sm font-medium ${
                      darkMode ? 'text-slate-300' : 'text-gray-700'
                    }`}>({testimonial.rating}.0)</span>
                  </div>

                  {/* Testimonial */}
                  <p className={`text-base leading-relaxed mb-8 italic ${
                    darkMode ? 'text-slate-300' : 'text-gray-700'
                  }`}>
                    "{testimonial.testimonial}"
                  </p>

                  {/* Profile */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="text-3xl">{testimonial.avatar}</div>
                      <div>
                        <div className={`font-semibold ${
                          darkMode ? 'text-white' : 'text-gray-900'
                        }`}>{testimonial.name}</div>
                        <div className={`text-sm ${
                          darkMode ? 'text-slate-400' : 'text-gray-600'
                        }`}>{testimonial.title}</div>
                        <div className={`text-xs ${
                          darkMode ? 'text-slate-500' : 'text-gray-500'
                        }`}>{testimonial.location}</div>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      darkMode ? 'bg-green-600/20 text-green-400' : 'bg-green-100 text-green-700'
                    }`}>
                      {testimonial.investment}
                    </div>
                  </div>
                </div>
              </FadeInWhenVisible>
            ))}
          </div>

          {/* Trust Metrics */}
          <FadeInWhenVisible delay={0.5}>
            <div className={`p-8 rounded-3xl backdrop-blur-sm border ${
              darkMode
                ? 'bg-slate-900/40 border-slate-700/40'
                : 'bg-white/40 border-gray-200/40'
            }`}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {[
                  { metric: '98.7%', label: 'Client Satisfaction', icon: '⭐' },
                  { metric: '15,000+', label: 'Active Investors', icon: '👥' },
                  { metric: '$2.5B+', label: 'Assets Managed', icon: '📊' },
                  { metric: '24/7', label: 'Support Available', icon: '🔄' }
                ].map((item, index) => (
                  <div key={index} className="text-center">
                    <div className="text-3xl mb-2">{item.icon}</div>
                    <div className={`text-2xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent`}>
                      {item.metric}
                    </div>
                    <div className={`text-sm ${
                      darkMode ? 'text-slate-400' : 'text-gray-600'
                    }`}>{item.label}</div>
                  </div>
                ))}
              </div>

              {/* Certifications */}
              <div className="mt-8 pt-8 border-t border-slate-700/50 dark:border-slate-600/50">
                <div className="flex flex-wrap justify-center items-center gap-8">
                  {[
                    { icon: '🔒', title: 'SEC Regulated', desc: 'Fully compliant' },
                    { icon: '🏆', title: 'Award Winning', desc: 'Industry leader' },
                    { icon: '🛡️', title: 'Insured', desc: 'Protected deposits' },
                    { icon: '✨', title: 'Premium', desc: 'Institutional grade' }
                  ].map((cert, index) => (
                    <div key={index} className="text-center">
                      <div className="text-2xl mb-1">{cert.icon}</div>
                      <div className={`text-sm font-semibold ${
                        darkMode ? 'text-white' : 'text-gray-900'
                      }`}>{cert.title}</div>
                      <div className={`text-xs ${
                        darkMode ? 'text-slate-400' : 'text-gray-500'
                      }`}>{cert.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </FadeInWhenVisible>
        </div>
      </section>

      {/* Partnership Info Section */}
      <section className={`relative py-16 border-t ${
        darkMode ? 'bg-dark-800 border-primary-600/20' : 'bg-gray-50 border-gray-200'
      }`}>
        <div className="container-custom">
          <FadeInWhenVisible delay={0.3}>
            <div className="max-w-3xl mx-auto text-center">
              <div className="flex items-center justify-center mb-6">
                <div className="p-4 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg">
                  <FaHandshake className="w-8 h-8" />
                </div>
              </div>
              <h3 className={`text-2xl md:text-3xl font-heading font-bold mb-4 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Powered by <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">Capimax Investments</span>
              </h3>
              <p className={`text-lg leading-relaxed ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Our strategic partnership with Capimax Investments brings you access to institutional-grade investment opportunities, combining the innovation of blockchain technology with the stability of traditional assets.
              </p>
            </div>
          </FadeInWhenVisible>
        </div>
      </section>
    </>
  );
};

export default Invest;