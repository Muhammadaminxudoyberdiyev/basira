import { cn } from "cn"
import { CONTAINER } from "@/lib/site"

// Keyslar — keng qatorlar: bitta asosiy raqam + bir gap kontekst.
// TODO(vaqtincha): quyidagi raqam va tavsiflar TAXMINIY — mijoz real
// ko'rsatkichlarni bergach almashtiriladi. Hozircha struktura va
// ko'rinishni ko'rsatish uchun turibdi.
const cases = [
  {
    name: "KANS Shop",
    meta: "Kiyim do'koni • 3 oy",
    result: "+42% takroriy xaridor",
    context:
      "Instagram uchun oylik kontent rejasi va Telegram buyurtma boti — mijozlar endi izohlarda adashmaydi, buyurtma bir yozishmada yopiladi.",
  },
  {
    name: "Keto Shop",
    meta: "Sog'lom ovqatlanish • 2 oy",
    result: "2.1x ko'proq ariza",
    context:
      "Mahsulot sahifalari qayta yozildi va savollarga javob beruvchi AI yordamchi ulandi — tungi arizalar ham ertalabgacha kutmaydi.",
  },
]

export function CaseStudies() {
  return (
    <section id="cases" className="scroll-mt-24 border-y border-line">
      <div className={cn(CONTAINER, "py-16 md:py-24")}>
        <h2 className="max-w-2xl font-display text-[25px] font-semibold tracking-tight text-ink md:text-[31px]">
          Natijalar gapiradi
        </h2>
        <div className="mt-10">
          {cases.map((c) => (
            <article
              key={c.name}
              className="group -mx-4 grid gap-2 rounded-xl border-t border-line px-4 py-8 transition-colors duration-200 last:border-b hover:bg-raised md:-mx-6 md:grid-cols-[1fr_1.4fr] md:gap-8 md:px-6"
            >
              <div>
                <p className="font-display text-lg font-semibold text-ink">
                  {c.name}
                </p>
                <p className="mt-1 text-sm text-ink-muted">{c.meta}</p>
                <p className="mt-2 font-display text-[31px] font-semibold tracking-tight text-signal-ink">
                  {c.result}
                </p>
              </div>
              <p className="max-w-xl self-center leading-relaxed text-ink-muted">
                {c.context}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
