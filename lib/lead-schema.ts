import { z } from "zod"

// Maslahat formasining yagona validatsiya sxemasi — client (react-hook-form)
// va server (Route Handler) ikkalasi ham shundan foydalanadi.
// Label'lar oddiy odam tushunadigan tilda — value'lar (CRM kontrakti)
// o'zgarmaydi, faqat ko'rinadigan matn o'zbekcha.
export const serviceOptions = [
  { value: "content", label: "Kontent yuritish (SMM)" },
  { value: "system", label: "AI yordamchi (avto-javoblar)" },
  { value: "build", label: "Sayt yoki dastur" },
  { value: "tafakkur", label: "AI Tafakkur (ta’lim)" },
  { value: "other", label: "Hali bilmayman — maslahat kerak" },
] as const

export type ServiceValue = (typeof serviceOptions)[number]["value"]

export const leadSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Ismingizni kiriting")
    .max(80, "Ism juda uzun"),
  phone: z
    .string()
    .trim()
    .min(7, "Telefon raqamni to'liq kiriting")
    .max(20, "Telefon raqam noto'g'ri")
    .regex(
      /^[+()\-.\s\d]+$/,
      "Telefon raqamda faqat raqam va + ( ) - belgilar bo'lishi mumkin"
    ),
  service: z.enum(
    ["content", "system", "build", "tafakkur", "other"] as const,
    { message: "Xizmatni tanlang" }
  ),
  comment: z
    .string()
    .trim()
    .max(500, "Izoh 500 belgidan oshmasligi kerak")
    .optional()
    .default(""),
})

export type LeadInput = z.infer<typeof leadSchema>

// Forma ichidagi qiymatlar tipi (input) — react-hook-form shuni ishlatadi.
// Submit'da leadSchema.parse() orqali LeadInput'ga aylantiriladi.
export type LeadFormValues = z.input<typeof leadSchema>
