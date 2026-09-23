"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { Loader2Icon, ChevronDownIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  leadSchema,
  serviceOptions,
  type LeadFormValues,
} from "@/lib/lead-schema"
import { cn } from "cn"
import { CONTAINER, site } from "@/lib/site"

// Audit formasi: ism, telefon, xizmat (select), izoh (ixtiyoriy).
// Muvaffaqiyat → sonner toast. Xatolik → inline (frontend.md §5).
export function LeadForm() {
  const [serverError, setServerError] = useState<string | null>(null)

  const form = useForm<LeadFormValues>({
    resolver: zodResolver(leadSchema),
    defaultValues: { name: "", phone: "", service: undefined, comment: "" },
  })

  const { isSubmitting } = form.formState

  async function onSubmit(values: LeadFormValues) {
    setServerError(null)
    // Resolver allaqachon tekshirgan — payload tipi kafolatlanadi.
    const payload = leadSchema.parse(values)
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const data = (await res.json()) as { ok: boolean; error?: string }
      if (!res.ok || !data.ok) {
        setServerError(
          data.error ?? "Yuborishda xatolik — keyinroq urinib ko’ring."
        )
        return
      }
      form.reset()
      toast.success("So’rovingiz yuborildi", {
        description: "Tez orada bog’lanamiz.",
      })
    } catch {
      setServerError("Yuborishda xatolik — keyinroq urinib ko’ring.")
    }
  }

  return (
    <section id="maslahat" className="scroll-mt-24 border-t border-line">
      <div className={cn(CONTAINER, "py-16 md:py-24")}>
        <div className="grid gap-10 md:grid-cols-[1fr_1.2fr] md:gap-14">
          <div>
            <h2 className="font-display text-[25px] font-semibold tracking-tight text-ink md:text-[31px]">
              Bepul maslahat olish
            </h2>
            <p className="mt-4 max-w-md leading-relaxed text-ink-muted">
              Formani to’ldiring — biznesingizga qaysi yo’nalish mosligini
              aniqlab, xulosa va keyingi qadamlarni yuboramiz. Bu bepul va hech
              narsaga majburlamaydi.
            </p>
            <p className="mt-6 text-[15px] text-ink-muted">
              Yoki bevosita:{" "}
              <a
                href={site.phoneHref}
                className="font-medium text-signal-ink transition-colors duration-150 hover:text-ink"
              >
                {site.phone}
              </a>
            </p>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-5"
              noValidate
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ismingiz</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Masalan: Jasur Karimov"
                        autoComplete="name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefon</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="+998 90 123 45 67"
                        autoComplete="tel"
                        inputMode="tel"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="service"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Qanday yordam kerak?</FormLabel>
                    {/* Ataylab native select: Base UI popup'i ba'zi qurilmalarda
                        buzilib ko'ringan. Native — telefonda sistemaning o'z
                        tanlash oynasini ochadi, ishonchli va tez. (SKILL.md §0
                        istisno: shadcn ekvivalenti buzilgani uchun.) */}
                    <div className="relative">
                      <FormControl>
                        <select
                          {...field}
                          value={field.value ?? ""}
                          className={cn(
                            "h-9 w-full appearance-none rounded-lg border border-input bg-transparent pr-9 pl-3 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:bg-input/30 dark:aria-invalid:ring-destructive/40",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <option value="" disabled>
                            Tanlang
                          </option>
                          {serviceOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </FormControl>
                      <ChevronDownIcon
                        aria-hidden
                        className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground"
                      />
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="comment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Qisqa izoh{" "}
                      <span className="font-normal text-ink-muted">
                        (ixtiyoriy)
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Biznesingiz haqida yozing"
                        rows={4}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {serverError && (
                <p role="alert" className="text-sm text-destructive">
                  {serverError}
                </p>
              )}

              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting}
                className="bg-signal font-medium text-black transition-colors duration-150 hover:bg-signal/85"
              >
                {isSubmitting && (
                  <Loader2Icon className="size-4 animate-spin" />
                )}
                {isSubmitting ? "Yuborilmoqda..." : "So’rov yuborish"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </section>
  )
}
