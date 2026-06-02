import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import i18n, { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from '../i18n';

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

/**
 * LanguageProvider
 *
 * Thin React bridge over the i18next instance. It keeps the existing
 * `useLanguage()` API (`language`, `toggleLanguage`, `changeLanguage`) so all
 * current consumers keep working, while delegating the actual language state to
 * i18next. This is the single source of truth for the active language and for
 * document direction (LTR/RTL).
 */
export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(i18n.language || DEFAULT_LANGUAGE);

  // Apply persistence + document direction whenever the language changes.
  useEffect(() => {
    try {
      localStorage.setItem('language', language);
    } catch (e) {
      /* ignore unavailable storage */
    }
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  // Keep React state in sync with i18next (covers programmatic changes too).
  useEffect(() => {
    const handleChange = (lng) => setLanguageState(lng);
    i18n.on('languageChanged', handleChange);
    return () => i18n.off('languageChanged', handleChange);
  }, []);

  const changeLanguage = useCallback((lang) => {
    if (SUPPORTED_LANGUAGES.includes(lang)) {
      i18n.changeLanguage(lang);
    }
  }, []);

  const toggleLanguage = useCallback(() => {
    i18n.changeLanguage(i18n.language === 'en' ? 'ar' : 'en');
  }, []);

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
