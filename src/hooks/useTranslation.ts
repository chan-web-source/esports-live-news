import { useTranslation as useI18nTranslation } from 'react-i18next';

interface TranslationOptions {
 [key: string]: string | number | boolean;
}

export const useTranslation = () => {
 const { t, i18n } = useI18nTranslation();

 const translate = (key: string, options?: TranslationOptions): string => {
  const result = t(key, options);
  return typeof result === 'string' ? result : '';
 };

 const translateSection = (section: string, key: string, options?: TranslationOptions): string => {
  const result = t(`${section}.${key}`, options);
  return typeof result === 'string' ? result : '';
 };

 return {
  t: translate,
  tSection: translateSection,
  i18n,
  currentLanguage: i18n.language,
 };
}; 