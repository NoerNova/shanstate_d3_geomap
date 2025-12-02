import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '@/locales/en.json';
import my from '@/locales/my-MM.json';
import shn from '@/locales/shn-MM.json';

const resources = {
  en: { translation: en },
  'my-MM': { translation: my },
  'shn-MM': { translation: shn },
};

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
    returnNull: false,
  });
}

export default i18n;
