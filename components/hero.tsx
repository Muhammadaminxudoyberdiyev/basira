"use client"

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { cn } from "cn"
import { buttonVariants } from "@/components/ui/button"
import { CONTAINER } from "@/lib/site"

// SSR'da warning chiqmasligi uchun isomorphic layout effect.
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect

// Aylanuvchi so'zlar — 2.6 soniyada almashadi, pastdan yuqoriga
// sirg'alib kiradi. prefers-reduced-motion bo'lsa statik turadi.
const words = [
  "AI tizimlar",
  "avtomatlashtirish",
  "kuchli kontent",
  "aqilli agentlar",
]
const ROTATE_MS = 2600

// Hero — markaziy variant: sarlavha, izoh va CTA o'rtada.
// Vercel uslubi: qora fon, yuqoridan nozik oq glow, pastda hairline.
// Yagona oq element — CTA tugma (ikonkasiz).
export function Hero() {
  const [index, setIndex] = useState(0)
  const reduceMotion = useReducedMotion()

  // Sahna eni faol so'zga silliq moslashadi — oraliq doim bitta
  // probel, qator markazda qoladi.
  const measureRef = useRef<HTMLSpanElement>(null)
  const [stageW, setStageW] = useState<number | undefined>(undefined)
  const measure = useCallback(() => {
    const w = measureRef.current?.offsetWidth
    if (w) setStageW(w)
  }, [])
  useIsomorphicLayoutEffect(measure, [index, measure])

  useEffect(() => {
    if (reduceMotion) return
    const id = setInterval(
      () => setIndex((i) => (i + 1) % words.length),
      ROTATE_MS
    )
    return () => clearInterval(id)
  }, [reduceMotion])

  // Shrift yuklanganda / oyna o'zgarganda enni qayta o'lchash.
  useEffect(() => {
    measure()
    let alive = true
    document.fonts?.ready
      .then(() => {
        if (alive) measure()
      })
      .catch(() => {})
    window.addEventListener("resize", measure)
    return () => {
      alive = false
      window.removeEventListener("resize", measure)
    }
  }, [measure])

  return (
    <section className="relative overflow-hidden border-b border-line">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_0%,rgba(255,255,255,0.12),transparent_70%)]"
      />
      <div
        className={cn(
          CONTAINER,
          // fixed header (56px) hero ustida — kontent uning tagidan
          // boshlanadi, lekin fon (glow) tepagacha cho'ziladi.
          "relative flex flex-col items-center pb-28 pt-32 text-center md:pb-40 md:pt-48"
        )}
      >
        <h1 className="max-w-3xl font-display text-[34px] font-semibold leading-[1.15] tracking-tight text-ink md:text-[49px] md:leading-[1.1]">
          <span className="sr-only">
            Biznesingizni AI tizimlar orqali o’ssin.
          </span>
          <span aria-hidden className="block">
            Biznesingizni{" "}
            <motion.span
              initial={false}
              animate={{ width: stageW ?? "auto" }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="relative inline-block h-[1lh] overflow-hidden align-bottom"
            >
              {/* Ko'rinmas o'lchagich — joriy so'z enini beradi. */}
              <span
                ref={measureRef}
                className="invisible absolute top-0 left-0 font-accent font-normal tracking-normal whitespace-nowrap italic"
              >
                {words[index]}
              </span>
              <AnimatePresence initial={false}>
                <motion.span
                  key={words[index]}
                  initial={{ y: "100%", opacity: 0 }}
                  animate={{ y: "0%", opacity: 1 }}
                  exit={{ y: "-100%", opacity: 0 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute top-0 left-0 font-accent font-normal tracking-normal whitespace-nowrap italic"
                >
                  {words[index]}
                </motion.span>
              </AnimatePresence>
            </motion.span>
          </span>
          <span aria-hidden className="block">
            orqali o’ssin.
          </span>
        </h1>
        <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-ink-muted md:text-lg">
          Content, AI tizimlar va sifatli veb-yechimlar — bittasi emas, barchasi
          bitta tizim ichida.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-x-6 gap-y-4">
          <a
            href="#maslahat"
            className={cn(
              buttonVariants({ size: "lg" }),
              "h-12 bg-signal px-7 text-[15px] font-medium text-black transition-colors duration-150 hover:bg-signal/85"
            )}
          >
            Bepul maslahat olish
          </a>
          <a
            href="#process"
            className={cn(
              buttonVariants({ size: "lg", variant: "outline" }),
              "h-12 px-7 text-[15px]"
            )}
          >
            Ish jarayoni qanday
          </a>
        </div>
      </div>
    </section>
  )
}
