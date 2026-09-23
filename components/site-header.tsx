"use client"

import { useEffect, useState } from "react"
import { cn } from "cn"
import { buttonVariants } from "@/components/ui/button"
import { CONTAINER, site } from "@/lib/site"

// Sticky header ikki holatda yashaydi:
// - Tepada (scroll 0): sahifaga yopishgan, shaffof, chegarasiz.
// - Pastga tushganda: tepada suzuvchi "xira shisha" panel —
//   yumaloq, hairline border, blur fon. Hammasi 300ms transition'da.
// fixed — hero foni (glow) viewport tepasigacha cho'zilib, header
// orqasidan ko'rinadi. Shaffof holatda ham qora polosa qolmaydi.
export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false)

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
          "transition-all duration-300",
          scrolled ? "pt-3" : "pt-0"
        )}
      >
        <div
          className={cn(
            "flex h-14 items-center justify-between transition-all duration-300",
            scrolled
              ? "rounded-2xl border border-white/10 bg-white/[0.06] px-4 shadow-lg shadow-black/20 backdrop-blur-xl md:px-5"
              : "border border-transparent bg-transparent"
          )}
        >
          <a href="#top" className="flex items-center gap-2">
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
              Yo’nalishlar
            </a>
            <a href="#process" className="transition-colors hover:text-ink">
              Jarayon
            </a>
            <a href="#cases" className="transition-colors hover:text-ink">
              Natijalar
            </a>
            <a href="#pricing" className="transition-colors hover:text-ink">
              Narxlar
            </a>
          </nav>
          <a
            href="#maslahat"
            className={cn(buttonVariants({ size: "sm", variant: "outline" }))}
          >
            Bepul maslahat
          </a>
        </div>
      </div>
    </header>
  )
}
