import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { FaTwitter, FaTelegram, FaDiscord, FaGithub, FaMedium, FaLinkedin, FaReddit, FaTiktok, FaInstagram } from 'react-icons/fa';
import Button from '../ui/Button';

// Translation data
const translations = {
  en: {
    quickLinks: 'Quick Links',
    home: 'Home',
    whitepaper: 'Whitepaper',
    roadmap: 'Roadmap',
    team: 'Team & Partners',
    faq: 'FAQ',
    resources: 'Resources',
    documentation: 'Documentation',
    tokenomics: 'Tokenomics',
    presale: 'Presale',
    legal: 'Legal',
    privacyPolicy: 'Privacy Policy',
    termsOfService: 'Terms of Service',
    riskDisclosure: 'Risk Disclosure',
    contactUs: 'Contact Us',
    joinCommunity: 'Join Our Community',
    copyright: '© 2025 Pronova. All rights reserved.',
    poweredBy: 'Developed by Daamah Digital Solutions',
    disclaimer: 'Disclaimer: Cryptocurrency investments are subject to market risks. Always DYOR (Do Your Own Research).',
    subscribeTitle: 'Stay Updated',
    subscribeText: 'Get the latest news and updates about Pronova',
    emailPlaceholder: 'Your email address',
    subscribeButton: 'Subscribe',
  },
  ar: {
    quickLinks: 'روابط سريعة',
    home: 'الرئيسية',
    whitepaper: 'الورقة البيضاء',
    roadmap: 'خارطة الطريق',
    team: 'الفريق والشركاء',
    faq: 'الأسئلة الشائعة',
    resources: 'المصادر',
    documentation: 'التوثيق',
    tokenomics: 'توزيع العملة',
    presale: 'البيع التمهيدي',
    legal: 'قانوني',
    privacyPolicy: 'سياسة الخصوصية',
    termsOfService: 'شروط الخدمة',
    riskDisclosure: 'إفصاح المخاطر',
    contactUs: 'اتصل بنا',
    joinCommunity: 'انضم إلى مجتمعنا',
    copyright: '© 2025 برونوفا. جميع الحقوق محفوظة.',
    poweredBy: 'تم التطوير بواسطة حلول دعامة الرقمية',
    disclaimer: 'إخلاء المسؤولية: استثمارات العملات المشفرة عرضة لمخاطر السوق. قم دائمًا بإجراء البحث الخاص بك.',
    subscribeTitle: 'ابق على اطلاع',
    subscribeText: 'احصل على آخر الأخبار والتحديثات حول برونوفا',
    emailPlaceholder: 'عنوان بريدك الإلكتروني',
    subscribeButton: 'اشترك',
  },
};

const Footer = () => {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <footer className="pt-16 pb-8 relative overflow-hidden bg-gray-50 dark:bg-dark-900">
      {/* Background elements */}
      <div className="absolute inset-0 z-0"></div>
      
      {/* Background shapes and effects */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-600 to-secondary-500 z-1"></div>
      <div className="absolute -top-[200px] -left-[100px] w-[500px] h-[500px] rounded-full bg-primary-600/5 dark:bg-primary-600/10 blur-[120px] z-0"></div>
      <div className="absolute -bottom-[100px] -right-[100px] w-[400px] h-[400px] rounded-full bg-secondary-500/5 dark:bg-secondary-500/10 blur-[120px] z-0"></div>

      <div className="container-custom relative z-10">
        {/* Newsletter Subscription */}
        <div className="mb-16 bg-white dark:bg-dark-900/90 backdrop-blur-sm rounded-2xl p-8 border border-gray-200 dark:border-primary-600/30 shadow-lg">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
            <div className="lg:col-span-1">
              <h3 className="text-xl font-heading font-bold text-gray-900 dark:text-white mb-2">{t.subscribeTitle}</h3>
              <p className="text-gray-600 dark:text-gray-300">{t.subscribeText}</p>
            </div>
            <div className="lg:col-span-2">
              <form className="flex flex-col sm:flex-row gap-3">
                <input 
                  type="email" 
                  placeholder={t.emailPlaceholder} 
                  className="flex-grow px-4 py-3 rounded-full bg-gray-50 dark:bg-dark-800 border border-gray-300 dark:border-primary-600/20 focus:border-primary-500 text-gray-900 dark:text-white outline-none transition-colors duration-300"
                />
                <Button 
                  variant="gradient"
                  size="medium"
                  type="submit"
                >
                  {t.subscribeButton}
                </Button>
              </form>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Column 1: Logo & Info */}
          <div>
            <div className="mb-4">
              <span className="text-2xl font-heading font-bold gradient-text">
                Pronova
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {language === 'en' 
                ? 'Revolutionary cryptocurrency developed by Capimax Holding, bridging traditional finance with blockchain technology.'
                : 'عملة مشفرة ثورية طورتها Capimax القابضة، تجمع بين التمويل التقليدي وتقنية البلوكتشين.'}
            </p>
            <div className="flex flex-wrap gap-3 mt-6">
              <a 
                href="https://x.com/pronovacryptocu" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-500 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors p-2 bg-gray-100 dark:bg-dark-800/50 rounded-full border border-gray-200 dark:border-primary-600/10 hover:border-primary-500/30 dark:hover:border-primary-600/30"
                title="Follow us on X (Twitter)"
              >
                <FaTwitter size={18} />
              </a>
              <a 
                href="https://t.me/+g5RtC5kjAfYwODA0" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-500 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors p-2 bg-gray-100 dark:bg-dark-800/50 rounded-full border border-gray-200 dark:border-primary-600/10 hover:border-primary-500/30 dark:hover:border-primary-600/30"
                title="Join our Telegram"
              >
                <FaTelegram size={18} />
              </a>
              <a 
                href="https://discord.gg/DN8tusJw8C" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-500 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors p-2 bg-gray-100 dark:bg-dark-800/50 rounded-full border border-gray-200 dark:border-primary-600/10 hover:border-primary-500/30 dark:hover:border-primary-600/30"
                title="Join our Discord"
              >
                <FaDiscord size={18} />
              </a>
              <a 
                href="https://www.reddit.com/user/pronovacryptocurrenc/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-500 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors p-2 bg-gray-100 dark:bg-dark-800/50 rounded-full border border-gray-200 dark:border-primary-600/10 hover:border-primary-500/30 dark:hover:border-primary-600/30"
                title="Follow us on Reddit"
              >
                <FaReddit size={18} />
              </a>
              <a 
                href="https://www.tiktok.com/@pronova.crypto.cu" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-500 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors p-2 bg-gray-100 dark:bg-dark-800/50 rounded-full border border-gray-200 dark:border-primary-600/10 hover:border-primary-500/30 dark:hover:border-primary-600/30"
                title="Follow us on TikTok"
              >
                <FaTiktok size={18} />
              </a>
              <a 
                href="https://github.com/pronovacryptocurrency/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-500 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors p-2 bg-gray-100 dark:bg-dark-800/50 rounded-full border border-gray-200 dark:border-primary-600/10 hover:border-primary-500/30 dark:hover:border-primary-600/30"
                title="View our GitHub"
              >
                <FaGithub size={18} />
              </a>
              <a 
                href="https://www.instagram.com/pronovacryptocurrency/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-500 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors p-2 bg-gray-100 dark:bg-dark-800/50 rounded-full border border-gray-200 dark:border-primary-600/10 hover:border-primary-500/30 dark:hover:border-primary-600/30"
                title="Follow us on Instagram"
              >
                <FaInstagram size={18} />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-lg font-heading font-semibold mb-4 text-gray-900 dark:text-white">{t.quickLinks}</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  {t.home}
                </Link>
              </li>
              <li>
                <Link to="/whitepaper" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  {t.whitepaper}
                </Link>
              </li>
              <li>
                <Link to="/roadmap" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  {t.roadmap}
                </Link>
              </li>
              <li>
                <Link to="/team" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  {t.team}
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  {t.faq}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div>
            <h3 className="text-lg font-heading font-semibold mb-4 text-gray-900 dark:text-white">{t.resources}</h3>
            <ul className="space-y-3">
              <li>
                <a href="#documentation" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  {t.documentation}
                </a>
              </li>
              <li>
                <a href="#tokenomics" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  {t.tokenomics}
                </a>
              </li>
              <li>
                <a href="#presale" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  {t.presale}
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Legal */}
          <div>
            <h3 className="text-lg font-heading font-semibold mb-4 text-gray-900 dark:text-white">{t.legal}</h3>
            <ul className="space-y-3">
              <li>
                <a href="#privacy" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  {t.privacyPolicy}
                </a>
              </li>
              <li>
                <a href="#terms" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  {t.termsOfService}
                </a>
              </li>
              <li>
                <a href="#risk" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  {t.riskDisclosure}
                </a>
              </li>
              <li>
                <a href="#contact" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  {t.contactUs}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-300 dark:border-primary-600/20 pt-8">
          <div className="flex flex-col md:flex-row md:justify-between items-center">
            <div className="mb-4 md:mb-0 text-gray-500 dark:text-gray-400 text-sm">
              {t.copyright}
            </div>
            <div className="text-gray-500 dark:text-gray-400 text-sm">
              <a href="https://daamah.net" target="_blank" rel="noopener noreferrer" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                {t.poweredBy}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;