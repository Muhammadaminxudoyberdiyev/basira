import { cn } from "cn"
import { CONTAINER } from "@/lib/site"

// 4 engine — ataylab asimmetrik: bir xil SaaS-kartalar to’ri emas
// (frontend.md §1). Har birida faqat kichik rangli belgi.
// Hover'da sokin mikro-interaksiya (fon + masshtab + nuqta) —
// scroll-animatsiyasiz, sodda.
const engines = [
  {
    name: "AI Content",
    problem:
      "Ijtimoiy tarmoqlar va kontentni tizimli boshqarish — tasodifiy post emas, oylik reja bilan.",
    dot: "bg-engine-content",
    span: "md:col-span-6 lg:col-span-7",
  },
  {
    name: "AI System",
    problem:
      "Mijozlar bilan muloqotni, savol-javobni avtomatlashtiruvchi AI tizimlar.",
    dot: "bg-engine-system",
    span: "md:col-span-6 lg:col-span-5",
  },
  {
    name: "Digital Build",
    problem:
      "Sayt va dasturlar — aniq texnik topshiriq asosida, boshidan oxirigacha nazorat bilan.",
    dot: "bg-engine-build",
    span: "md:col-span-6 lg:col-span-5",
  },
  {
    name: "AI Tafakkur",
    problem:
      "AI va dasturlashni o’rgatuvchi ta’lim yo’nalishi — amaliy, guruh shaklida.",
    dot: "bg-engine-tafakkur",
    span: "md:col-span-6 lg:col-span-7",
  },
]

export function Engines() {
  return (
    <section id="engines" className="scroll-mt-24">
      <div className={cn(CONTAINER, "py-16 md:py-24")}>
        <h2 className="max-w-2xl font-display text-[25px] font-semibold tracking-tight text-ink md:text-[31px]">
          To’rtta yo’nalish — bitta tizim
        </h2>
        <div className="mt-10 grid gap-px overflow-hidden rounded-xl border border-line bg-line md:grid-cols-6 lg:grid-cols-12">
          {engines.map((engine) => (
            <article
              key={engine.name}
              className={cn(
                "group flex flex-col bg-paper p-7 transition-all duration-200 hover:scale-[1.02] hover:bg-raised md:p-8",
                // Birinchi qator 7+5, ikkinchi qator 5+7 — bir xil
                // katakchalar taassurotini buzadi (frontend.md §1).
                engine.span
              )}
            >
              <p className="flex items-center gap-2.5 font-display text-xl font-semibold tracking-tight text-ink">
                <span
                  aria-hidden
                  className={cn(
                    "inline-block size-2 rounded-full transition-transform duration-200 group-hover:scale-125",
                    engine.dot
                  )}
                />
                {engine.name}
              </p>
              <p className="mt-3 max-w-md text-[15px] leading-relaxed text-ink-muted">
                {engine.problem}
              </p>
              <a
                href="#maslahat"
                className="mt-6 inline-flex text-[15px] font-medium text-signal-ink transition-colors duration-150 hover:text-ink"
              >
                Batafsil
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
