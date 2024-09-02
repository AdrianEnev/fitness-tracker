import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import en from "../locales/en.json";
import bg from "../locales/bg.json";
import fr from "../locales/fr.json";
import de from "../locales/de.json";
import ru from "../locales/ru.json";

const languageResources = {
    en: {
        translation: en,
    },
    bg: {
        translation: bg,
    },
    fr: {
      translation: fr,
    },
    de: {
      translation: de,
    },
    ru: {
      translation: ru,
    },
};

i18next
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v3',
    lng: "en",
    fallbackLng: "en",
    resources: languageResources,
  });


export default i18next;