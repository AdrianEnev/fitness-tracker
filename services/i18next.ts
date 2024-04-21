import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import en from "../locales/en.json";
import bg from "../locales/bg.json";

const languageResources = {
    en: {
        translation: en,
    },
    bg: {
        translation: bg,
    },
};

i18next
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v3',
    lng: "bg",
    fallbackLng: "en",
    resources: languageResources,
  });


export default i18next;