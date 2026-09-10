import i18n from 'i18next';

import { initReactI18next } from 'react-i18next';

import en from './en.json';
import uk from './uk.json';

// Register the React integration and initialize the application's locale resources once.
i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      uk: { translation: uk },
    },
    lng: 'uk',
    fallbackLng: 'en',
    interpolation: {
      // React escapes rendered values, so i18next escaping is disabled here.
      escapeValue: false,
    },
  });

export default i18n;