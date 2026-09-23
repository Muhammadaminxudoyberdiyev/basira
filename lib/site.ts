// Sayt bo'ylab ishlatiladigan umumiy konstantalar.
// TODO: ishga tushirishdan oldin real kontaktlarni yozib chiqing.
export const site = {
  name: "MN Development",
  phone: "+998 90 123 45 67",
  phoneHref: "tel:+998901234567",
  email: "hello@mndevelopment.uz",
  telegram: "https://t.me/mndevelopment",
  instagram: "https://instagram.com/mndevelopment",
  tafakkurTelegram: "https://t.me/ai_tafakkur",
} as const

// Har bir seksiya shu konteynerni ishlatadi — sahifa bitta
// uzluksiz "trek" bo'lib o'qilishi uchun chap chekka bir xil
// (frontend.md §1 — Layout concept).
export const CONTAINER = "mx-auto w-full max-w-6xl px-6 md:px-10"
