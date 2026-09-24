"use client"

import { useEffect, type ReactNode } from "react"
import { I18nextProvider } from "react-i18next"
import i18n, { isLocale } from "@/lib/i18n/config"

const STORAGE_KEY = "mn-locale"

// Til provayderi: saqlangan tilni tiklaydi, almashganda
// localStorage + <html lang> ni sinxronlaydi.
export function LanguageProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const apply = (lng: string) => {
      document.documentElement.lang = lng
      try {
        localStorage.setItem(STORAGE_KEY, lng)
      } catch {
        // private mode va sh.k. — til baribir ishlaydi, saqlanmaydi.
      }
    }
    let saved: string | null = null
    try {
      saved = localStorage.getItem(STORAGE_KEY)
    } catch {
      // o'qib bo'lmasa default til qoladi.
    }
    if (isLocale(saved) && saved !== i18n.language) {
      void i18n.changeLanguage(saved).then(() => apply(saved as string))
    } else {
      apply(i18n.language)
    }
    const onChange = (lng: string) => apply(lng)
    i18n.on("languageChanged", onChange)
    return () => {
      i18n.off("languageChanged", onChange)
    }
  }, [])

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
}
