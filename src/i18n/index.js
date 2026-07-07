/**
 * i18n foundation (react-i18next)
 *
 * Professional translation infrastructure for Pronova.
 *
 * NOTE: This file only wires up the i18n SYSTEM. The actual translation of all
 * page/component content is performed incrementally in a later phase. The
 * existing flat-key resource sets in `src/utils/translations/{en,ar}.js` are
 * loaded here so any component can immediately call:
 *
 *     import { useTranslation } from 'react-i18next';
 *     const { t } = useTranslation();
 *     t('nav.home');
 *
 * Keys are FLAT strings that contain literal dots (e.g. 'nav.home'), so
 * `keySeparator` and `nsSeparator` are disabled to prevent i18next from
 * treating them as nested paths.
 */
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from '../utils/translations/en';

// Arabic has been temporarily removed from the live site (the previous AR content
// was incomplete). The multi-language infrastructure below is intentionally kept
// generic: to add a language later, import its resource bundle, register it in
// `resources`, and add its code to `SUPPORTED_LANGUAGES` — no other changes needed.
export const SUPPORTED_LANGUAGES = ['en'];
export const DEFAULT_LANGUAGE = 'en';

// Read persisted language (falls back to default) without an extra dependency.
const getInitialLanguage = () => {
  try {
    const saved = localStorage.getItem('language');
    if (saved && SUPPORTED_LANGUAGES.includes(saved)) return saved;
  } catch (e) {
    /* localStorage unavailable (SSR/private mode) — ignore */
  }
  return DEFAULT_LANGUAGE;
};

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
  },
  lng: getInitialLanguage(),
  fallbackLng: DEFAULT_LANGUAGE,
  supportedLngs: SUPPORTED_LANGUAGES,
  // Our resource keys are flat strings containing dots, not nested objects.
  keySeparator: false,
  nsSeparator: false,
  interpolation: {
    escapeValue: false, // React already escapes
  },
  returnEmptyString: false,
  react: {
    useSuspense: false,
  },
});

export default i18n;
