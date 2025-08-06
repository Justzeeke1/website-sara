import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import it from '../locales/it.json';
import en from '../locales/en.json';

const resources = {
  it: {
    translation: it,
  },
  en: {
    translation: en,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'it', // Italian as default
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['navigator', 'localStorage', 'cookie'],
      lookupLocalStorage: 'i18nextLng',
      lookupCookie: 'i18nextLng',
      caches: ['localStorage', 'cookie'],
    },
  });

export default i18n;