import { useContext } from 'react';
import { useLanguage } from '../context/LanguageContext';
import translations from './translations';

export const useTranslation = () => {
  const { language } = useLanguage();
  
  const t = (key) => {
    // Default to English if the key doesn't exist in the current language
    return translations[language][key] || translations['en'][key] || key;
  };
  
  return { t, language };
};

export default useTranslation;