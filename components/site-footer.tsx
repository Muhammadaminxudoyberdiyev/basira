"use client"

import { useTranslation } from "react-i18next"
import { cn } from "cn"
import { CONTAINER, site } from "@/lib/site"

// Footer — sahifadan bir pog'ona ajralgan blok (raised + hairline).
// AI Tafakkur alohida qatorda: uning auditoriyasi o'quvchi,
// biznes egasi emas.
export function SiteFooter() {
  const { t } = useTranslation()
  return (
    <footer className="border-t border-line bg-raised text-ink">
      <div className={cn(CONTAINER, "py-14 md:py-16")}>
        <div className="grid gap-10 md:grid-cols-[1.2fr_1fr_1fr]">
          <div>
            <p className="font-display text-lg font-semibold tracking-tight">
              {site.name}
            </p>
            <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-ink-muted">
              {t("footer.tagline")}
            </p>
          </div>
          <div className="text-[15px]">
            <p className="font-medium">{t("footer.contact")}</p>
            <ul className="mt-3 space-y-2 text-ink-muted">
              <li>
                <a
                  href={site.phoneHref}
                  className="transition-colors duration-150 hover:text-signal"
                >
                  {site.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="transition-colors duration-150 hover:text-signal"
                >
                  {site.email}
                </a>
              </li>
              <li>
                <a
                  href={site.telegram}
                  target="_blank"
                  rel="noreferrer"
                  className="transition-colors duration-150 hover:text-signal"
                >
                  Telegram
                </a>
              </li>
              <li>
                {/* Instagram hozircha o'chiq — keyin ulanadi. */}
                <span className="text-ink-muted/60">Instagram</span>
              </li>
            </ul>
          </div>
          <div className="text-[15px]">
            <p className="font-medium">{t("footer.tafakkurTitle")}</p>
            <p className="mt-3 leading-relaxed text-ink-muted">
              {t("footer.tafakkurDesc")}
            </p>
            {/* Ta'lim kanali linki keyin qo'shiladi. */}
          </div>
        </div>
        <div className="mt-12 flex flex-col gap-2 border-t border-line pt-6 text-sm text-ink-muted md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name}. {t("footer.rights")}
          </p>
        </div>
      </div>
    </footer>
  )
}
