"use client"

import { useTranslation } from "react-i18next"
import { cn } from "cn"
import { buttonVariants } from "@/components/ui/button"
import { CONTAINER } from "@/lib/site"

// Narxlar — matn-birinchi ro'yxat, SaaS pricing-card'larisiz.
// Har qatorda: xizmat + bir qator izoh, o'ngda katta narx.
// Qiymatlar lug'atda (pricing.items).
interface PriceItem {
  service: string
  desc: string
  price: string
  per: string
}

export function Pricing() {
  const { t } = useTranslation()
  const prices = t("pricing.items", {
    returnObjects: true,
  }) as unknown as PriceItem[]

  return (
    <section id="pricing" className="scroll-mt-24">
      <div className={cn(CONTAINER, "py-16 md:py-24")}>
        <h2 className="max-w-2xl font-display text-[25px] font-semibold tracking-tight text-ink md:text-[31px]">
          {t("pricing.title")}
        </h2>
        <p className="mt-4 max-w-xl leading-relaxed text-ink-muted">
          {t("pricing.sub")}
        </p>

        <div className="mt-10">
          {prices.map((p) => (
            <div
              key={p.service}
              className="group -mx-4 grid gap-1 rounded-xl border-t border-line px-4 py-7 transition-colors duration-200 last:border-b hover:bg-raised sm:grid-cols-[1fr_auto] sm:items-baseline sm:gap-6 md:-mx-6 md:px-6"
            >
              <div>
                <p className="font-display text-lg font-semibold text-ink">
                  {p.service}
                </p>
                <p className="mt-1 text-[15px] text-ink-muted">{p.desc}</p>
              </div>
              <p className="flex items-baseline gap-2">
                <span className="font-display text-[28px] font-semibold tracking-tight text-ink transition-transform duration-200 group-hover:scale-[1.03] md:text-[31px]">
                  {p.price}
                </span>
                <span className="text-sm text-ink-muted">{p.per}</span>
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-5 rounded-2xl border border-line bg-raised p-7 sm:flex-row sm:items-center sm:justify-between md:p-8">
          <p className="max-w-md leading-relaxed text-ink-muted">
            <span className="font-medium text-ink">{t("pricing.ctaLead")}</span>{" "}
            {t("pricing.ctaRest")}
          </p>
          <a
            href="#maslahat"
            className={cn(
              buttonVariants({ size: "lg" }),
              "shrink-0 bg-signal font-medium text-black transition-colors duration-150 hover:bg-signal/85"
            )}
          >
            {t("pricing.ctaBtn")}
          </a>
        </div>
      </div>
    </section>
  )
}
