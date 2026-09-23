import { NextResponse } from "next/server"
import { leadSchema } from "@/lib/lead-schema"

// POST /api/leads — maslahat formasining yagona server qismi (frontend.md §5).
//
// CRMchi developer bilan kelishilishi kerak bo'lgan kontrakt:
//   - Request (JSON): { name, phone, service, comment, source, created_at }
//     service — "content" | "system" | "build" | "tafakkur" | "other"
//   - Env: CRM_API_URL (masalan https://crm.example.com/api/leads),
//     CRM_API_KEY (Authorization: Bearer <key> sifatida yuboriladi)
//   - Muvaffaqiyat: CRM 2xx qaytarsa → { ok: true }

export async function POST(req: Request) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json(
      { ok: false, error: "So'rov formati noto'g'ri." },
      { status: 400 }
    )
  }

  // Client'da zod bilan tekshirilgan bo'lsa ham — serverda qayta
  // tekshiriladi (client'ga hech qachon ishonilmaydi).
  const parsed = leadSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Ma'lumotlar to'liq emas, qayta tekshiring." },
      { status: 422 }
    )
  }

  const crmUrl = process.env.CRM_API_URL
  const crmKey = process.env.CRM_API_KEY

  if (!crmUrl || !crmKey) {
    console.error("[leads] CRM_API_URL / CRM_API_KEY sozlanmagan")
    return NextResponse.json(
      {
        ok: false,
        error:
          "Ariza hozircha qabul qilinmadi — biz bilan bevosita bog'laning.",
      },
      { status: 503 }
    )
  }

  try {
    const res = await fetch(crmUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${crmKey}`,
      },
      body: JSON.stringify({
        ...parsed.data,
        source: "mn-development-landing",
        created_at: new Date().toISOString(),
      }),
      signal: AbortSignal.timeout(10_000),
    })

    if (!res.ok) {
      console.error(`[leads] CRM xatosi: ${res.status}`)
      return NextResponse.json(
        { ok: false, error: "Yuborishda xatolik — keyinroq urinib ko'ring." },
        { status: 502 }
      )
    }
  } catch (err) {
    console.error("[leads] CRM ga ulanib bo'lmadi:", err)
    return NextResponse.json(
      { ok: false, error: "Yuborishda xatolik — keyinroq urinib ko'ring." },
      { status: 502 }
    )
  }

  return NextResponse.json({ ok: true })
}
