import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import bg from "@config/locales/bg.json";
import en from "@config/locales/en.json";
import fr from "@config/locales/fr.json";
import de from "@config/locales/de.json";
import ru from "@config/locales/ru.json";
import it from "@config/locales/it.json";
import sp from "@config/locales/sp.json";

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
    it: {
      translation: it,
    },
    sp: {
      translation: sp,
    },
};

i18next
    .use(initReactI18next)
    .init({
    compatibilityJSON: 'v3',
    lng: "en",
    fallbackLng: "bg",
    resources: languageResources,
    });

export default i18next;