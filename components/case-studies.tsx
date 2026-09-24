"use client"

import { useRef } from "react"
import { useTranslation } from "react-i18next"
import { ArrowRight, History, Send, Sparkles } from "lucide-react"
import { motion, MotionConfig, useScroll, useTransform } from "motion/react"
import { cn } from "cn"
import { CONTAINER } from "@/lib/site"
import { buttonVariants } from "@/components/ui/button"

// Loyiha meta'si (tilga bog'liq emas) + matnlar lug'atda
// (cases.items — id bo'yicha). Har biri alohida karta.
const projects = [
  {
    id: "tezqur",
    handle: "@tezqurbot",
    url: "https://t.me/tezqurbot",
    dot: "bg-engine-build",
  },
  {
    id: "keto",
    handle: "@ketoshopbot",
    url: "https://t.me/ketoshopbot",
    dot: "bg-engine-system",
  },
  {
    id: "kans",
    handle: "@kansshopbot",
    url: "https://t.me/kansshopbot",
    dot: "bg-engine-content",
  },
] as const

interface CaseContent {
  name: string
  service: string
  before: string
  after: string
}

// Bitta keys-karta: scroll'da pastdan kirib keladi + viewport
// markazida sezilarli kattalashadi, chekkaga chiqayotganda kichiklashadi.
function CaseCard({ projectId }: { projectId: string }) {
  const { t } = useTranslation()
  const contents = t("cases.items", {
    returnObjects: true,
  }) as unknown as Record<string, CaseContent>
  const project = projects.find((p) => p.id === projectId) ?? projects[0]
  const c = contents[project.id]

  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1.03, 0.95])

  return (
    <motion.article
      ref={ref}
      style={{ scale }}
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-2xl border border-line bg-paper p-7 shadow-[0_30px_80px_-30px_rgba(255,255,255,0.14)] md:p-9"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="flex items-center gap-3">
            <span
              aria-hidden
              className={cn("inline-block size-2 rounded-full", project.dot)}
            />
            <span className="font-display text-2xl font-semibold tracking-tight text-ink">
              {c.name}
            </span>
          </p>
          <p className="mt-3 flex flex-wrap items-center gap-2 text-sm text-ink-muted">
            {t("cases.serviceLabel")}
            <span className="rounded-full border border-line px-3 py-1 text-[13px] font-medium text-signal-ink">
              {c.service}
            </span>
          </p>
        </div>
        <a
          href={project.url}
          target="_blank"
          rel="noreferrer"
          className={cn(buttonVariants({ size: "sm", variant: "outline" }))}
        >
          <Send aria-hidden />
          {project.handle}
        </a>
      </div>

      <div className="mt-7 grid gap-4 md:grid-cols-[1fr_auto_1fr] md:items-center">
        <div className="rounded-xl border border-line p-5 md:p-6">
          <p className="flex items-center gap-2 text-xs font-semibold tracking-[0.08em] text-ink-muted uppercase">
            <History aria-hidden className="size-3.5" />
            {t("cases.beforeLabel")}
          </p>
          <p className="mt-3 text-base leading-relaxed text-ink-muted">
            {c.before}
          </p>
        </div>
        <span
          aria-hidden
          className="mx-auto flex size-10 rotate-90 items-center justify-center rounded-full border border-line bg-raised md:rotate-0"
        >
          <ArrowRight className="size-4 text-signal-ink" />
        </span>
        <div className="rounded-xl border border-signal/30 bg-raised p-5 md:p-6">
          <p className="flex items-center gap-2 text-xs font-semibold tracking-[0.08em] text-signal-ink uppercase">
            <Sparkles aria-hidden className="size-3.5" />
            {t("cases.afterLabel")}
          </p>
          <p className="mt-3 text-base leading-relaxed text-ink">{c.after}</p>
        </div>
      </div>
    </motion.article>
  )
}

export function CaseStudies() {
  const { t } = useTranslation()
  return (
    <section id="cases" className="scroll-mt-24 border-y border-line">
      <MotionConfig reducedMotion="user">
        <div className={cn(CONTAINER, "py-16 md:py-24")}>
          <h2 className="max-w-2xl font-display text-[25px] font-semibold tracking-tight text-ink md:text-[31px]">
            {t("cases.title")}
          </h2>
          <p className="mt-3 max-w-2xl leading-relaxed text-ink-muted">
            {t("cases.sub")}
          </p>
          <div className="mt-10 grid gap-6">
            {projects.map((p) => (
              <CaseCard key={p.id} projectId={p.id} />
            ))}
          </div>
        </div>
      </MotionConfig>
    </section>
  )
}
