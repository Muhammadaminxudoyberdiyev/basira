import { z } from "zod"

// Xizmat turlari — value'lar (CRM kontrakti) tillar bo'yicha
// o'zgarmaydi, ko'rinadigan label'lar lug'atda (form.services).
export const serviceValues = [
  "content",
  "system",
  "build",
  "tafakkur",
  "other",
] as const

export type ServiceValue = (typeof serviceValues)[number]

// Validatsiya xabarlari lug'atdan keladi (validation.*) —
// sxema har til uchun shu funksiya orqali quriladi.
export interface LeadMessages {
  nameMin: string
  nameMax: string
  phoneMin: string
  phoneMax: string
  phoneInvalid: string
  serviceRequired: string
  commentMax: string
}

export function createLeadSchema(
  m: LeadMessages,
  // Telefon haqiqiyligini tekshirish: client kutubxonaning
  // isValidPhoneNumber'ini beradi (davlat kodiga qarab aniq),
  // serverda default E.164 regex ishlaydi (bundle'ga lib kirmaydi).
  isValidPhone: (value: string) => boolean = (v) => /^\+\d{7,15}$/.test(v)
) {
  return z.object({
    name: z.string().trim().min(2, m.nameMin).max(80, m.nameMax),
    phone: z
      .string()
      .trim()
      .min(1, m.phoneMin)
      .max(20, m.phoneMax)
      .refine(isValidPhone, m.phoneInvalid),
    service: z.enum(serviceValues, { message: m.serviceRequired }),
    comment: z.string().trim().max(500, m.commentMax).optional().default(""),
  })
}

export type LeadInput = z.infer<ReturnType<typeof createLeadSchema>>

// Forma ichidagi qiymatlar tipi (input) — react-hook-form shuni ishlatadi.
export type LeadFormValues = z.input<ReturnType<typeof createLeadSchema>>
