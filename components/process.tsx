"use client"

import { useEffect, useMemo, useRef, useState, type MouseEvent } from "react"
import { useTranslation } from "react-i18next"
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react"
import { cn } from "cn"
import { CONTAINER } from "@/lib/site"

interface ProcessStep {
  name: string
  text: string
}

// Jarayon qadamlari lug'atda (process.items) — 6 ta, har biri bir
// qisqa qatordan iborat.

// Signature moment (frontend.md §2): chapdagi chiziq scroll bilan
// "o’sadi", qadamlar yetib borilganda yonadi. Og’ir animatsiya
// kutubxonasisiz — bitta scroll listener + threshold, sakrashsiz.
// prefers-reduced-motion bo’lsa: hamma qadam darhol "yoqilgan".
export function Process() {
  const { t } = useTranslation()
  // Qadamlar lug'atdan — t til almashganda yangilanadi, memo
  // effect'ni keraksiz qayta ishga tushirmaslik uchun.
  const steps = useMemo(
    () =>
      t("process.items", {
        returnObjects: true,
      }) as unknown as ProcessStep[],
    [t]
  )
  const sectionRef = useRef<HTMLElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)
  const dotRefs = useRef<(HTMLSpanElement | null)[]>([])
  const reduceMotion = useReducedMotion()
  // 3D tilt — karta sichqoncha ortidan yumshoq og'adi.
  const tiltX = useMotionValue(0)
  const tiltY = useMotionValue(0)
  const rotateX = useSpring(tiltX, { stiffness: 200, damping: 22 })
  const rotateY = useSpring(tiltY, { stiffness: 200, damping: 22 })
  // Scroll-masshtab — seksiya viewport markazida bo'lganda karta
  // biroz kattalashadi, chekkaga chiqayotganda kichiklashadi.
  // (Alohida effect o'rniga useScroll — deps muammosiz.)
  const { scrollYProgress: sectionProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })
  const scale = useTransform(sectionProgress, [0, 0.5, 1], [1, 1.045, 1])

  const handleTilt = (e: MouseEvent<HTMLDivElement>) => {
    if (reduceMotion) return
    const rect = e.currentTarget.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width - 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5
    tiltY.set(px * 12)
    tiltX.set(-py * 12)
  }
  const resetTilt = () => {
    tiltX.set(0)
    tiltY.set(0)
  }
  const [progress, setProgress] = useState(0)
  const [reached, setReached] = useState<boolean[]>(() =>
    steps.map(() => false)
  )
  // Chiziq nuqtaga endigina yetib borganda — bir martalik pulse uchun.
  const [pulse, setPulse] = useState<number | null>(null)
  const reachedRef = useRef<boolean[]>(steps.map(() => false))
  const pulseTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (reduceMotion) {
      // Async callback ichida — effect body’da sinxron setState yo’q.
      const raf = requestAnimationFrame(() => {
        setProgress(1)
        setReached(steps.map(() => true))
      })
      return () => cancelAnimationFrame(raf)
    }

    let raf = 0
    const update = () => {
      raf = 0
      const line = lineRef.current
      if (!line) return

      // "Yetib borish" nuqtasi — viewport balandligining ~60%i.
      const anchor = window.innerHeight * 0.6

      const lineRect = line.getBoundingClientRect()
      const raw = (anchor - lineRect.top) / Math.max(lineRect.height, 1)
      setProgress(Math.min(1, Math.max(0, raw)))

      const next = dotRefs.current.map(
        (dot) => !!dot && dot.getBoundingClientRect().top <= anchor
      )
      setReached(next)

      // Yangi yetib borilgan nuqta — pulse (box-shadow taralib o'chadi).
      const fresh = next.findIndex((r, i) => r && !reachedRef.current[i])
      reachedRef.current = next
      if (fresh !== -1) {
        if (pulseTimer.current) clearTimeout(pulseTimer.current)
        setPulse(fresh)
        pulseTimer.current = setTimeout(() => setPulse(null), 700)
      }
    }

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }

    const initialRaf = requestAnimationFrame(update)
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      cancelAnimationFrame(initialRaf)
      if (pulseTimer.current) clearTimeout(pulseTimer.current)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [reduceMotion, steps])

  const activeIndex = Math.max(0, reached.lastIndexOf(true))
  const active = steps[activeIndex]

  return (
    <section id="process" ref={sectionRef} className="scroll-mt-24">
      <div className={cn(CONTAINER, "py-16 md:py-24")}>
        <h2 className="max-w-2xl font-display text-[25px] font-semibold tracking-tight text-ink md:text-[31px]">
          {t("process.title")}
        </h2>

        <div className="mt-10 grid gap-10 md:grid-cols-[1.2fr_1fr] md:gap-14">
          {/* Chap: chiziq + qadamlar */}
          <ol className="relative">
            {/* Resting chiziq */}
            <div
              ref={lineRef}
              aria-hidden
              className="absolute bottom-2 left-[7px] top-2 w-px bg-line"
            >
              {/* Scroll bilan o’sadigan signal qismi */}
              <div
                className="w-full bg-signal"
                style={{ height: `${progress * 100}%` }}
              />
            </div>

            {steps.map((step, i) => {
              const isReached = reached[i]
              return (
                <li
                  key={step.name}
                  className="relative flex gap-5 pb-12 last:pb-0 md:pb-14"
                >
                  <span
                    ref={(el) => {
                      dotRefs.current[i] = el
                    }}
                    aria-hidden
                    className={cn(
                      "relative z-10 mt-1.5 size-[15px] shrink-0 rounded-full border-2 transition-colors duration-150",
                      isReached
                        ? "border-signal bg-signal"
                        : "border-line bg-paper",
                      // Chiziq endigina yetib keldi — halqa taralib o'chadi.
                      pulse === i && "dot-pulse"
                    )}
                  />
                  <div className="pb-1">
                    <p
                      className={cn(
                        "font-display text-lg font-semibold tracking-tight transition-colors duration-150",
                        isReached ? "text-ink" : "text-ink-muted"
                      )}
                    >
                      <span className="mr-2 tabular-nums">{i + 1}.</span>
                      {step.name}
                    </p>
                    <p className="mt-1 max-w-md text-[15px] leading-relaxed text-ink-muted">
                      {step.text}
                    </p>
                  </div>
                </li>
              )
            })}
          </ol>

          {/* O’ng: faol qadam izohi (sticky, 3D tilt) */}
          <div className="hidden md:block">
            <div className="sticky top-24 [perspective:1000px]">
              <motion.div
                onMouseMove={handleTilt}
                onMouseLeave={resetTilt}
                style={{
                  rotateX,
                  rotateY,
                  scale,
                  transformStyle: "preserve-3d",
                }}
                className="rounded-xl border border-line bg-raised p-7"
              >
                <p className="font-display text-[22px] font-semibold tracking-tight text-ink">
                  {active.name}
                </p>
                <p className="mt-2 leading-relaxed text-ink-muted">
                  {active.text}
                </p>
                <div
                  aria-hidden
                  className="mt-5 h-1 w-full overflow-hidden rounded-full bg-line"
                >
                  <div
                    className="h-full rounded-full bg-signal transition-[width] duration-150"
                    style={{
                      width: `${((activeIndex + 1) / steps.length) * 100}%`,
                    }}
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
