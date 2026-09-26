"use client"

import { useTranslation } from "react-i18next"
import { CheckIcon, SendIcon } from "lucide-react"
import { cn } from "cn"
import { buttonVariants } from "@/components/ui/button"
import { CONTAINER, site } from "@/lib/site"

// Maslahat bo'limi: chapda ma'lumot, o'ngda Telegram CTA kartasi.
// Ariza formasi (<LeadFormCard />, components/lead-form-card.tsx)
// hozircha o'chiq — CRM ulanganda shu yerga qaytariladi.
export function LeadForm() {
  const { t } = useTranslation()
  const handle = site.telegram.replace("https://t.me/", "@")

  return (
    <section id="maslahat" className="scroll-mt-24 border-t border-line">
      <div className={cn(CONTAINER, "py-16 md:py-24")}>
        <div className="grid gap-10 md:grid-cols-[1fr_1.25fr] md:gap-14">
          <div>
            <h2 className="font-display text-[25px] font-semibold tracking-tight text-ink md:text-[31px]">
              {t("form.title")}
            </h2>
            <p className="mt-4 max-w-md leading-relaxed text-ink-muted">
              {t("form.desc")}
            </p>
            <ul className="mt-6 space-y-3">
              {(
                t("form.perks", { returnObjects: true }) as unknown as string[]
              ).map((perk) => (
                <li
                  key={perk}
                  className="flex items-center gap-2.5 text-[15px] text-signal-ink"
                >
                  <span className="flex size-5 items-center justify-center rounded-full border border-line bg-raised">
                    <CheckIcon aria-hidden className="size-3" />
                  </span>
                  {perk}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-[15px] text-ink-muted">
              {t("form.direct")}{" "}
              <a
                href={site.phoneHref}
                className="font-medium text-signal-ink transition-colors duration-150 hover:text-ink"
              >
                {site.phone}
              </a>
            </p>
          </div>

          <div className="flex flex-col items-center justify-center gap-5 rounded-2xl border border-line bg-raised/60 p-8 text-center shadow-[0_30px_80px_-40px_rgba(255,255,255,0.12)] md:p-12">
            <span
              aria-hidden
              className="flex size-14 items-center justify-center rounded-2xl border border-line bg-paper"
            >
              <SendIcon className="size-6 text-signal-ink" />
            </span>
            <div>
              <p className="font-display text-2xl font-semibold tracking-tight text-ink">
                {t("form.telegramTitle")}
              </p>
              <p className="mt-2 max-w-sm leading-relaxed text-ink-muted">
                {t("form.telegramDesc")}
              </p>
            </div>
            <a
              href={site.telegram}
              target="_blank"
              rel="noreferrer"
              className={cn(
                buttonVariants({ size: "lg" }),
                "h-12 bg-signal px-7 text-[15px] font-medium text-black shadow-[0_10px_45px_-10px_rgba(255,255,255,0.4)] transition-all duration-300 hover:bg-signal/85"
              )}
            >
              <SendIcon aria-hidden />
              {t("form.telegramBtn")}
            </a>
            <p className="text-sm text-ink-muted">{handle}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
