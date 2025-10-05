import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { motion } from 'framer-motion';
import { FaSun, FaMoon, FaBars, FaTimes, FaWallet } from 'react-icons/fa';
import { BiGlobe } from 'react-icons/bi';
import Button from '../ui/Button';
import pronovaLogo from '../../assets/images/logos for partner/pronova coin.png';

// Translation data
const translations = {
  en: {
    home: 'Home',
    invest: 'Invest',
    whitepaper: 'Whitepaper',
    roadmap: 'Roadmap',
    team: 'Team & Partners',
    faq: 'FAQ',
    contact: 'Contact Us',
    presale: 'Presale',
    connectWallet: 'Connect Wallet',
    login: 'Login',
    joinPresale: 'Join Presale',
  },
  ar: {
    home: 'الرئيسية',
    invest: 'استثمر',
    whitepaper: 'الورقة البيضاء',
    roadmap: 'خارطة الطريق',
    team: 'الفريق والشركاء',
    faq: 'الأسئلة الشائعة',
    contact: 'تواصل معنا',
    presale: 'البيع التمهيدي',
    connectWallet: 'ربط المحفظة',
    login: 'تسجيل الدخول',
    joinPresale: 'انضم للبيع التمهيدي',
  },
};

const Navbar = () => {
  const { darkMode, toggleDarkMode } = useTheme();
  const { language, toggleLanguage } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Check if window is scrolled
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const t = translations[language];

  return (
    <nav 
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled || isMenuOpen
          ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="container-custom py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <img 
              src={pronovaLogo} 
              alt="Pronova" 
              className="w-8 h-8 md:w-10 md:h-10 transition-transform duration-300 group-hover:scale-110"
            />
            <span className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-secondary-600">
              Pronova
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <div className="flex items-center space-x-6">
              <Link to="/" className={`nav-link ${location.pathname === '/' ? 'text-primary-600 font-semibold' : 'text-gray-700 dark:text-gray-300'}`}>
                {t.home}
              </Link>
              <Link to="/invest" className={`nav-link ${location.pathname === '/invest' ? 'text-primary-600 font-semibold' : 'text-gray-700 dark:text-gray-300'}`}>
                {t.invest}
              </Link>
              <div className="relative">
                <Link to="/presale" className={`nav-link ${location.pathname === '/presale' ? 'text-primary-600 font-semibold' : 'text-gray-700 dark:text-gray-300'}`}>
                  {t.presale}
                </Link>
                <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse font-medium shadow-lg">
                  🔥
                </span>
              </div>
              <Link to="/whitepaper" className={`nav-link ${location.pathname === '/whitepaper' ? 'text-primary-600 font-semibold' : 'text-gray-700 dark:text-gray-300'}`}>
                {t.whitepaper}
              </Link>
              <Link to="/roadmap" className={`nav-link ${location.pathname === '/roadmap' ? 'text-primary-600 font-semibold' : 'text-gray-700 dark:text-gray-300'}`}>
                {t.roadmap}
              </Link>
              <Link to="/team" className={`nav-link ${location.pathname === '/team' ? 'text-primary-600 font-semibold' : 'text-gray-700 dark:text-gray-300'}`}>
                {t.team}
              </Link>
              <Link to="/faq" className={`nav-link ${location.pathname === '/faq' ? 'text-primary-600 font-semibold' : 'text-gray-700 dark:text-gray-300'}`}>
                {t.faq}
              </Link>
              <Link to="/contact" className={`nav-link ${location.pathname === '/contact' ? 'text-primary-600 font-semibold' : 'text-gray-700 dark:text-gray-300'}`}>
                {t.contact}
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              {/* Theme Toggle */}
              <button 
                onClick={toggleDarkMode} 
                className="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
                aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {darkMode ? <FaSun size={18} /> : <FaMoon size={18} />}
              </button>

              {/* Language Toggle */}
              <button 
                onClick={toggleLanguage} 
                className="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
                aria-label={language === 'en' ? 'Switch to Arabic' : 'Switch to English'}
              >
                <BiGlobe size={20} />
                <span className="ml-1 text-sm">{language === 'en' ? 'AR' : 'EN'}</span>
              </button>

              {/* Connect Wallet Button */}
              <Button 
                to="/presale" 
                variant="primary"
                size="small"
                className="relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative z-10 flex items-center gap-2">
                  <FaWallet />
                  {t.joinPresale}
                </div>
              </Button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg transition-colors"
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden mt-4 py-4 border-t border-gray-200 dark:border-gray-700"
          >
            <div className="flex flex-col space-y-4">
              <Link to="/" className={`nav-link ${location.pathname === '/' ? 'text-primary-600 font-semibold' : 'text-gray-700 dark:text-gray-300'}`}>
                {t.home}
              </Link>
              <Link to="/invest" className={`nav-link ${location.pathname === '/invest' ? 'text-primary-600 font-semibold' : 'text-gray-700 dark:text-gray-300'}`}>
                {t.invest}
              </Link>
              <div className="flex items-center gap-2">
                <Link to="/presale" className={`nav-link ${location.pathname === '/presale' ? 'text-primary-600 font-semibold' : 'text-gray-700 dark:text-gray-300'}`}>
                  {t.presale}
                </Link>
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse font-medium">
                  🔥 Live
                </span>
              </div>
              <Link to="/whitepaper" className={`nav-link ${location.pathname === '/whitepaper' ? 'text-primary-600 font-semibold' : 'text-gray-700 dark:text-gray-300'}`}>
                {t.whitepaper}
              </Link>
              <Link to="/roadmap" className={`nav-link ${location.pathname === '/roadmap' ? 'text-primary-600 font-semibold' : 'text-gray-700 dark:text-gray-300'}`}>
                {t.roadmap}
              </Link>
              <Link to="/team" className={`nav-link ${location.pathname === '/team' ? 'text-primary-600 font-semibold' : 'text-gray-700 dark:text-gray-300'}`}>
                {t.team}
              </Link>
              <Link to="/faq" className={`nav-link ${location.pathname === '/faq' ? 'text-primary-600 font-semibold' : 'text-gray-700 dark:text-gray-300'}`}>
                {t.faq}
              </Link>
              <Link to="/contact" className={`nav-link ${location.pathname === '/contact' ? 'text-primary-600 font-semibold' : 'text-gray-700 dark:text-gray-300'}`}>
                {t.contact}
              </Link>
              <div className="flex space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button 
                  onClick={toggleDarkMode} 
                  className="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
                >
                  {darkMode ? <FaSun size={18} /> : <FaMoon size={18} />}
                </button>
                <button 
                  onClick={toggleLanguage} 
                  className="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
                >
                  <BiGlobe size={20} />
                  <span className="ml-1 text-sm">{language === 'en' ? 'AR' : 'EN'}</span>
                </button>
              </div>
              <Button 
                to="/presale" 
                variant="primary"
                size="small"
                fullWidth
                className="mt-4 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative z-10 flex items-center justify-center gap-2">
                  <FaWallet />
                  {t.joinPresale}
                </div>
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;