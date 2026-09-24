"use client"

import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { ChevronDownIcon } from "lucide-react"
import { cn } from "cn"
import { buttonVariants } from "@/components/ui/button"
import { CONTAINER, site } from "@/lib/site"
import { locales } from "@/lib/i18n/config"

// Sticky header ikki holatda yashaydi:
// - Tepada (scroll 0): sahifaga yopishgan, shaffof, chegarasiz.
// - Pastga tushganda: tepada suzuvchi "xira shisha" panel —
//   yumaloq, hairline border, blur fon. Hammasi 300ms transition'da.
// fixed — hero foni (glow) viewport tepasigacha cho'zilib, header
// orqasidan ko'rinadi. Shaffof holatda ham qora polosa qolmaydi.
// Til select'i — native, matnli kodlar bilan (bayroqsiz).
export function SiteHeader() {
  const { t, i18n } = useTranslation()
  const [scrolled, setScrolled] = useState(false)
  // Birinchi sinxronizatsiyadan keyin transition yoqiladi — refresh'da
  // sahifa o'rtasida ochilganda shaffofdan oynaga "suzib" o'tmaydi,
  // darhol to'g'ri holatda turadi. (Boshlang'ich state har doim
  // false bo'lishi shart — aks holda hydration mismatch chiqadi.)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let raf = 0
    const update = () => {
      raf = 0
      setScrolled(window.scrollY > 12)
      setReady(true)
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    const initialRaf = requestAnimationFrame(update)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
      cancelAnimationFrame(initialRaf)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  useEffect(() => {
    let raf = 0
    const update = () => {
      raf = 0
      setScrolled(window.scrollY > 12)
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    const initialRaf = requestAnimationFrame(update)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
      cancelAnimationFrame(initialRaf)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <header className="fixed inset-x-0 top-0 z-40">
      <div
        className={cn(
          CONTAINER,
          ready && "transition-all duration-300",
          scrolled ? "pt-3" : "pt-0"
        )}
      >
        <div
          className={cn(
            "flex h-14 items-center justify-between gap-3",
            ready && "transition-all duration-300",
            scrolled
              ? "rounded-2xl border border-white/10 bg-white/[0.06] px-4 shadow-lg shadow-black/20 backdrop-blur-xl md:px-5"
              : "border border-transparent bg-transparent"
          )}
        >
          <a href="#top" className="flex shrink-0 items-center gap-2">
            <span
              aria-hidden
              className="inline-block size-2.5 rounded-full bg-signal"
            />
            <span className="font-display text-[17px] font-semibold tracking-tight text-ink">
              {site.name}
            </span>
          </a>
          <nav className="hidden items-center gap-7 text-sm text-ink-muted md:flex">
            <a href="#engines" className="transition-colors hover:text-ink">
              {t("header.nav.services")}
            </a>
            <a href="#process" className="transition-colors hover:text-ink">
              {t("header.nav.process")}
            </a>
            <a href="#cases" className="transition-colors hover:text-ink">
              {t("header.nav.cases")}
            </a>
            <a href="#pricing" className="transition-colors hover:text-ink">
              {t("header.nav.pricing")}
            </a>
          </nav>
          <div className="flex shrink-0 items-center gap-2">
            <div className="relative">
              <select
                aria-label={t("header.langLabel")}
                value={i18n.language}
                onChange={(e) => void i18n.changeLanguage(e.target.value)}
                className="h-8 appearance-none rounded-lg border border-line bg-transparent pr-7 pl-2.5 text-[13px] font-medium tracking-wide text-ink-muted uppercase outline-none transition-colors hover:text-ink focus-visible:border-ring"
              >
                {locales.map((lng) => (
                  <option key={lng} value={lng}>
                    {lng.toUpperCase()}
                  </option>
                ))}
              </select>
              <ChevronDownIcon
                aria-hidden
                className="pointer-events-none absolute top-1/2 right-2 size-3.5 -translate-y-1/2 text-ink-muted"
              />
            </div>
            <a
              href="#maslahat"
              className={cn(buttonVariants({ size: "sm", variant: "outline" }))}
            >
              <span className="hidden sm:inline">{t("header.cta")}</span>
              <span className="sm:hidden">{t("header.ctaShort")}</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  )
}
