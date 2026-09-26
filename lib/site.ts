// Sayt bo'ylab ishlatiladigan umumiy konstantalar.
export const site = {
  name: "Basira One",
  phone: "+998 77 071 16 61",
  phoneHref: "tel:+998770711661",
  email: "muradjanovai@gmail.com",
  telegram: "https://t.me/muradjanovvn",
  instagram: "https://instagram.com/mndevelopment",
  tafakkurTelegram: "https://t.me/ai_tafakkur",
} as const

// Har bir seksiya shu konteynerni ishlatadi — sahifa bitta
// uzluksiz "trek" bo'lib o'qilishi uchun chap chekka bir xil
// (frontend.md §1 — Layout concept).
export const CONTAINER = "mx-auto w-full max-w-6xl px-6 md:px-10"
