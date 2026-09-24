import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import uz from "./locales/uz.json"
import ru from "./locales/ru.json"
import en from "./locales/en.json"

// Sayt tillari: o'zbek (default), rus, ingliz. Lug'atlar
// ./locales/*.json da — tarjima qo'shish/o'zgartirish faqat o'sha
// fayllarda bo'ladi, komponent kodi tegilmaydi.
export const locales = ["uz", "ru", "en"] as const
export type Locale = (typeof locales)[number]
export const DEFAULT_LOCALE: Locale = "uz"

export function isLocale(value: unknown): value is Locale {
  return (
    typeof value === "string" && (locales as readonly string[]).includes(value)
  )
}

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources: {
      uz: { translation: uz },
      ru: { translation: ru },
      en: { translation: en },
    },
    lng: DEFAULT_LOCALE,
    fallbackLng: DEFAULT_LOCALE,
    interpolation: { escapeValue: false },
  })
}

export default i18n
