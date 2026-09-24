"use client"

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { useTranslation } from "react-i18next"
import { ArrowRight } from "lucide-react"
import { cn } from "cn"
import { buttonVariants } from "@/components/ui/button"
import { CONTAINER } from "@/lib/site"

// SSR'da warning chiqmasligi uchun isomorphic layout effect.
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect

// Aylanuvchi so'zlar lug'atdan (hero.words) — 2.6 soniyada almashadi,
// pastdan yuqoriga sirg'alib kiradi. prefers-reduced-motion bo'lsa
// statik turadi.
const ROTATE_MS = 2600

// Hero — markaziy variant: sarlavha, izoh va CTA o'rtada.
// Vercel uslubi: qora fon, yuqoridan nozik oq glow, pastda hairline.
export function Hero() {
  const { t, i18n } = useTranslation()
  const words = t("hero.words", { returnObjects: true }) as unknown as string[]
  const [index, setIndex] = useState(0)
  const reduceMotion = useReducedMotion()
  // Joriy so'z — indeks har doim diapazonda (til almashganda ham).
  const word = words[index % words.length]
  // So'zlar soni lug'atdan keladi — interval har doim joriy qiymatni oladi.
  const countRef = useRef(words.length)
  useEffect(() => {
    countRef.current = words.length
  }, [words.length])

  // Sahna eni faol so'zga silliq moslashadi — oraliq doim bitta
  // probel, qator markazda qoladi.
  const measureRef = useRef<HTMLSpanElement>(null)
  const [stageW, setStageW] = useState<number | undefined>(undefined)
  const measure = useCallback(() => {
    const w = measureRef.current?.offsetWidth
    if (w) setStageW(w)
  }, [])
  useIsomorphicLayoutEffect(measure, [index, i18n.language, measure])

  useEffect(() => {
    if (reduceMotion) return
    const id = setInterval(
      () => setIndex((i) => (i + 1) % countRef.current),
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

  // Shablon tilga qarab: UZ'da so'z gap o'rtasida (2-qatorda davom bor),
  // EN/RU'da so'z oxirida (alohida 2-qatorda turadi).
  // Kesilish muammosi: sahna overflow-hidden bilan kesar, Fraunces
  // italic dumi ('g') esa chiziq qutisidan pastga chiqadi. Yechim —
  // sahnada clip yo'q (overflow ko'rinadigan), niqob so'zning o'zida
  // va u bilan birga harakatlanadi: pastda 0.14em zaxira bilan dumi
  // hech qachon kesilmaydi, yonlarda italic chiqishlari uchun joy bor.
  // Baseline asl holatidayoq to'g'ri (top-0, bir xil leading).
  const pre = t("hero.pre")
  const post = t("hero.post")
  const hasPost = post.trim().length > 0
  const stage = (
    <motion.span
      initial={false}
      animate={{ width: stageW ?? "auto" }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="relative inline-block h-[1lh] align-bottom"
    >
      {/* Ko'rinmas o'lchagich — joriy so'z enini beradi. */}
      <span
        ref={measureRef}
        className="invisible absolute top-0 left-0 font-accent font-normal tracking-normal whitespace-nowrap italic"
      >
        {word}
      </span>
      <AnimatePresence initial={false}>
        <motion.span
          key={word}
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="absolute top-0 left-0 font-accent font-normal tracking-normal whitespace-nowrap italic [clip-path:inset(-20%_-10%_-0.14em_-10%)]"
        >
          {word}
        </motion.span>
      </AnimatePresence>
    </motion.span>
  )

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
            {[t("hero.pre"), words[0], t("hero.post")]
              .filter((s) => s.trim())
              .join(" ")}
          </span>
          <span aria-hidden className="block">
            {pre}
            {hasPost && <> {stage}</>}
          </span>
          <span aria-hidden className="block">
            {hasPost ? post : stage}
          </span>
        </h1>
        <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-ink-muted md:text-lg">
          {t("hero.desc")}
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-x-6 gap-y-4">
          <a
            href="#maslahat"
            className={cn(
              buttonVariants({ size: "lg" }),
              "group h-12 bg-signal px-7 text-[15px] font-medium text-black shadow-[0_10px_45px_-10px_rgba(255,255,255,0.45)] transition-all duration-300 hover:bg-signal/85 hover:shadow-[0_10px_55px_-8px_rgba(255,255,255,0.55)]"
            )}
          >
            {t("hero.cta1")}
            <ArrowRight
              aria-hidden
              className="transition-transform duration-200 group-hover:translate-x-1"
            />
          </a>
          <a
            href="#process"
            className={cn(
              buttonVariants({ size: "lg", variant: "outline" }),
              "h-12 px-7 text-[15px] text-ink-muted transition-colors duration-200 hover:border-ink-muted/60 hover:text-ink"
            )}
          >
            {t("hero.cta2")}
          </a>
        </div>
      </div>
    </section>
  )
}
