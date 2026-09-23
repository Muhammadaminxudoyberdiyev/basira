import { cn } from "cn"
import { buttonVariants } from "@/components/ui/button"
import { CONTAINER } from "@/lib/site"

// Narxlar — matn-birinchi ro'yxat, SaaS pricing-card'larisiz.
// Har qatorda: xizmat + bir qator izoh, o'ngda katta narx.
// TODO(vaqtincha): narx va qamrov tavsiflari taxminiy — tasdiqlangach yangilanadi.
const prices = [
  {
    service: "Content",
    desc: "Oylik kontent reja, postlar va sahifa yuritish",
    price: "$800",
    per: "oyiga",
  },
  {
    service: "Sayt / dastur",
    desc: "Dizayn, ishlab chiqish va joylashtirish",
    price: "$1,500",
    per: "dan",
  },
  {
    service: "AI tizim",
    desc: "Chatbot, CRM bog'lanish va avtomatlashtirish",
    price: "$2,000",
    per: "dan",
  },
]

export function Pricing() {
  return (
    <section id="pricing" className="scroll-mt-24">
      <div className={cn(CONTAINER, "py-16 md:py-24")}>
        <h2 className="max-w-2xl font-display text-[25px] font-semibold tracking-tight text-ink md:text-[31px]">
          Boshlang’ich narxlar
        </h2>
        <p className="mt-4 max-w-xl leading-relaxed text-ink-muted">
          Har loyiha har xil — pastdagilar mo’ljal. Aniq hisob-kitob bepul
          maslahatdan keyin chiqadi.
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
            <span className="font-medium text-ink">
              Aniq narx — maslahatdan keyin.
            </span>{" "}
            15 daqiqalik suhbatda loyihangizni eshitamiz va aniq taklif beramiz.
          </p>
          <a
            href="#maslahat"
            className={cn(
              buttonVariants({ size: "lg" }),
              "shrink-0 bg-signal font-medium text-black transition-colors duration-150 hover:bg-signal/85"
            )}
          >
            Bepul maslahat olish
          </a>
        </div>
      </div>
    </section>
  )
}
