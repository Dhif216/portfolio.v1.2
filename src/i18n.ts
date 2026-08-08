import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import enTranslation from "./locales/en/translation.json";
import fiTranslation from "./locales/fi/translation.json";

i18next.use(initReactI18next).init({
  resources: {
    en: { translation: enTranslation },
    fi: { translation: fiTranslation },
  },
  lng: localStorage.getItem("language") || "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18next;
