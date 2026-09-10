import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Імпортуємо наші словники (лише по одному разу)
import uk from './uk.json';
import en from './en.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      uk: { translation: uk }
    },
    lng: 'uk', // Мова за замовчуванням
    fallbackLng: 'en', // Якщо якогось слова немає в uk, покаже en
    interpolation: {
      escapeValue: false // React вже захищає від XSS
    }
  });

export default i18n;