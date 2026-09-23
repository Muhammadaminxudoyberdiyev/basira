import { cn } from "cn"
import { CONTAINER, site } from "@/lib/site"

// Footer — sahifadan bir pog'ona ajralgan blok (raised + hairline).
// AI Tafakkur alohida qatorda: uning auditoriyasi o'quvchi,
// biznes egasi emas (frontend.md §3).
export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-raised text-ink">
      <div className={cn(CONTAINER, "py-14 md:py-16")}>
        <div className="grid gap-10 md:grid-cols-[1.2fr_1fr_1fr]">
          <div>
            <p className="font-display text-lg font-semibold tracking-tight">
              {site.name}
            </p>
            <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-ink-muted">
              Texnologiya orqali qulaylik. Tizim orqali xotirjamlik.
            </p>
          </div>
          <div className="text-[15px]">
            <p className="font-medium">Aloqa</p>
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
                <a
                  href={site.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="transition-colors duration-150 hover:text-signal"
                >
                  Instagram
                </a>
              </li>
            </ul>
          </div>
          <div className="text-[15px]">
            <p className="font-medium">AI Tafakkur</p>
            <p className="mt-3 leading-relaxed text-ink-muted">
              AI va dasturlashni amaliy o’rganmoqchi bo’lganlar uchun — guruh
              shaklida ta’lim yo’nalishi.
            </p>
            <a
              href={site.tafakkurTelegram}
              target="_blank"
              rel="noreferrer"
              className="group/link mt-3 inline-block font-medium text-ink transition-colors duration-150 hover:text-signal"
            >
              Ta’lim kanali{" "}
              <span
                aria-hidden
                className="inline-block transition-transform duration-200 group-hover/link:translate-x-1"
              >
                →
              </span>
            </a>
          </div>
        </div>
        <div className="mt-12 flex flex-col gap-2 border-t border-line pt-6 text-sm text-ink-muted md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name}. Barcha huquqlar
            himoyalangan.
          </p>
        </div>
      </div>
    </footer>
  )
}
