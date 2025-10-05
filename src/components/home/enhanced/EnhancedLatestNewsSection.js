import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../../context/ThemeContext';
import { useLanguage } from '../../../context/LanguageContext';
import { FaArrowRight, FaCoins, FaHandHoldingUsd, FaNewspaper, FaClock } from 'react-icons/fa';

// Translation data
const translations = {
  en: {
    sectionTitle: 'Latest News & Updates',
    sectionSubtitle: 'Stay informed about our latest developments and exciting new utilities',
    readMore: 'Read More',
    new: 'NEW',
    tokenization: {
      headline: 'Unlock New Value: Asset Tokenization is Here',
      description: 'Announcing a powerful new utility for your Pronova. In partnership with Capimax Tokenization, you can now use your holdings to tokenize real-world assets.',
      cta: 'Explore Tokenization',
      category: 'Utility Launch'
    },
    loans: {
      headline: 'Amplify Your Strategy: Borrow Pronova for Investment',
      description: 'We\'re excited to announce that you can now borrow Pronova through our partner, Nova Digital Finance. Use this loan to access and invest in new opportunities.',
      cta: 'Learn About Loans',
      category: 'Financial Service'
    }
  },
  ar: {
    sectionTitle: 'آخر الأخبار والتحديثات',
    sectionSubtitle: 'ابق على اطلاع بآخر التطورات والخدمات الجديدة المثيرة',
    readMore: 'اقرأ المزيد',
    new: 'جديد',
    tokenization: {
      headline: 'اكتشف قيمة جديدة: توكين الأصول متاح الآن',
      description: 'نعلن عن خدمة جديدة قوية لعملة برونوفا. بالشراكة مع كابيماكس للتوكين، يمكنك الآن استخدام عملاتك لتوكين الأصول الحقيقية.',
      cta: 'استكشف التوكين',
      category: 'إطلاق خدمة'
    },
    loans: {
      headline: 'عزز استراتيجيتك: اقترض برونوفا للاستثمار',
      description: 'يسعدنا الإعلان أنه يمكنك الآن اقتراض برونوفا من خلال شريكنا نوفا للتمويل الرقمي. استخدم هذا القرض للوصول إلى فرص استثمارية جديدة.',
      cta: 'تعرف على القروض',
      category: 'خدمة مالية'
    }
  }
};

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
        y: direction === 'up' ? 50 : direction === 'down' ? -50 : 30,
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

const EnhancedLatestNewsSection = () => {
  const { darkMode } = useTheme();
  const { language } = useLanguage();
  const t = translations[language];

  const newsItems = [
    {
      id: 1,
      category: t.tokenization.category,
      headline: t.tokenization.headline,
      description: t.tokenization.description,
      cta: t.tokenization.cta,
      link: '#',
      icon: <FaCoins className="w-6 h-6" />,
      gradient: 'from-purple-600 to-indigo-600',
      bgGradient: 'from-purple-50 to-indigo-50',
      darkBgGradient: 'from-purple-900/20 to-indigo-900/20',
      date: '2 days ago'
    },
    {
      id: 2,
      category: t.loans.category,
      headline: t.loans.headline,
      description: t.loans.description,
      cta: t.loans.cta,
      link: '#',
      icon: <FaHandHoldingUsd className="w-6 h-6" />,
      gradient: 'from-emerald-600 to-teal-600',
      bgGradient: 'from-emerald-50 to-teal-50',
      darkBgGradient: 'from-emerald-900/20 to-teal-900/20',
      date: '5 days ago'
    }
  ];

  return (
    <section className={`relative py-24 overflow-hidden ${
      darkMode
        ? 'bg-gradient-to-b from-dark-900 via-dark-800 to-dark-900'
        : 'bg-gradient-to-b from-gray-50 via-white to-gray-50'
    }`}>
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-primary-500/5 dark:bg-primary-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-secondary-500/5 dark:bg-secondary-500/10 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}} />
        <div className={`absolute inset-0 opacity-30 bg-grid-pattern`} />
      </div>

      <div className="container-custom relative z-10">
        {/* Section Header */}
        <FadeInWhenVisible>
          <div className="text-center mb-16">
            {/* Badge */}
            <div className={`inline-flex items-center px-6 py-3 rounded-full border mb-8 ${
              darkMode
                ? 'bg-primary-600/20 border-primary-600/30 backdrop-blur-sm'
                : 'bg-primary-100/60 border-primary-200/40 backdrop-blur-sm'
            }`}>
              <FaNewspaper className={`w-5 h-5 mr-3 ${
                darkMode ? 'text-primary-400' : 'text-primary-600'
              }`} />
              <span className={`text-sm font-medium uppercase tracking-wider ${
                darkMode ? 'text-primary-400' : 'text-primary-700'
              }`}>
                {t.new} - Latest Updates
              </span>
              <div className="w-2 h-2 bg-red-500 rounded-full ml-3 animate-pulse" />
            </div>

            {/* Title */}
            <h2 className={`text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6 leading-tight ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {t.sectionTitle.split(' ').slice(0, 2).join(' ')} <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                {t.sectionTitle.split(' ').slice(2).join(' ')}
              </span>
            </h2>

            {/* Subtitle */}
            <p className={`text-xl max-w-4xl mx-auto leading-relaxed ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              {t.sectionSubtitle}
            </p>
          </div>
        </FadeInWhenVisible>

        {/* News Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {newsItems.map((item, index) => (
            <FadeInWhenVisible key={item.id} delay={index * 0.2} direction={index === 0 ? 'left' : 'right'}>
              <div className={`group relative overflow-hidden rounded-3xl backdrop-blur-sm border transition-all duration-700 hover:scale-105 hover:shadow-2xl ${
                darkMode
                  ? 'bg-dark-900/60 border-primary-600/20 hover:border-primary-500/40 hover:shadow-primary-500/20'
                  : 'bg-white/60 border-gray-200/40 hover:border-primary-300/60 hover:shadow-primary-300/20'
              }`}>
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${
                  darkMode ? item.darkBgGradient : item.bgGradient
                } opacity-50 group-hover:opacity-70 transition-opacity duration-500`} />

                {/* Content */}
                <div className="relative p-8">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    {/* Category Badge */}
                    <div className={`inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r ${item.gradient} text-white shadow-lg`}>
                      {item.icon}
                      <span className="ml-2 text-sm font-medium">{item.category}</span>
                    </div>

                    {/* Date */}
                    <div className={`flex items-center text-sm ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      <FaClock className="w-4 h-4 mr-2" />
                      {item.date}
                    </div>
                  </div>

                  {/* Headline */}
                  <h3 className={`text-2xl md:text-3xl font-heading font-bold mb-4 leading-tight group-hover:text-primary-600 transition-colors duration-300 ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {item.headline}
                  </h3>

                  {/* Description */}
                  <p className={`text-lg leading-relaxed mb-8 ${
                    darkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {item.description}
                  </p>

                  {/* CTA Button */}
                  <motion.a
                    href={item.link}
                    className={`inline-flex items-center px-6 py-3 bg-gradient-to-r ${item.gradient} text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="mr-2">{item.cta}</span>
                    <FaArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </motion.a>

                  {/* Decorative Elements */}
                  <div className={`absolute top-4 right-4 w-20 h-20 bg-gradient-to-r ${item.gradient} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity duration-500`} />
                  <div className={`absolute bottom-4 left-4 w-16 h-16 bg-gradient-to-r ${item.gradient} opacity-10 rounded-full blur-xl group-hover:opacity-20 transition-opacity duration-500`} />
                </div>

                {/* Hover Effect Border */}
                <div className={`absolute inset-0 border-2 border-transparent group-hover:border-gradient-to-r ${item.gradient} rounded-3xl opacity-0 group-hover:opacity-50 transition-opacity duration-300`} />
              </div>
            </FadeInWhenVisible>
          ))}
        </div>

        {/* Bottom Call-to-Action */}
        <FadeInWhenVisible delay={0.6}>
          <div className="text-center mt-16">
            <div className={`inline-flex items-center px-8 py-4 rounded-2xl backdrop-blur-sm border ${
              darkMode
                ? 'bg-dark-900/40 border-primary-600/30'
                : 'bg-white/40 border-gray-200/40'
            }`}>
              <span className={`text-lg font-medium ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Stay updated with more exciting announcements
              </span>
              <div className="ml-4 flex space-x-2">
                <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" />
                <div className="w-2 h-2 bg-secondary-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}} />
                <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" style={{animationDelay: '0.4s'}} />
              </div>
            </div>
          </div>
        </FadeInWhenVisible>
      </div>
    </section>
  );
};

export default EnhancedLatestNewsSection;