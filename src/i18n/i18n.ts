import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from 'i18next-browser-languagedetector';
import enJSON from './en.json'
import zhJSON from './zh.json'

i18n
  .use(LanguageDetector)  // Add language detection
  .use(initReactI18next)
  .init({
    resources: {
      en: { ...enJSON },
      zh: { ...zhJSON },
    },
    fallbackLng: "en",
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    },
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });


export default i18n;