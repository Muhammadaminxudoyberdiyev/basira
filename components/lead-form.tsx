"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import PhoneInput, {
  isValidPhoneNumber,
  getCountryCallingCode,
  type Country,
} from "react-phone-number-input"
import "react-phone-number-input/style.css"
import {
  CheckIcon,
  ChevronDownIcon,
  CircleAlertIcon,
  Loader2Icon,
  SendIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  useFormField,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  createLeadSchema,
  serviceValues,
  type LeadFormValues,
  type ServiceValue,
} from "@/lib/lead-schema"
import { cn } from "cn"
import { CONTAINER, site } from "@/lib/site"

// Audit formasi: ism, telefon, xizmat (select), izoh (ixtiyoriy).
// Telefon — react-phone-number-input (bayroqli davlat tanlash,
// avtomatik format, E.164). Validatsiya sxemasi joriy tilga qarab
// yangidan quriladi (createLeadSchema) — xabarlar lug'atdan.
// Muvaffaqiyat → sonner toast. Xatolik → inline.

// Maydon xatosi — ikonka + matn, joyi oldindan band (min-h) shuning
// uchun xato chiqqanda inputlar sakramaydi.
function FieldError() {
  const { error, formMessageId } = useFormField()
  if (!error?.message) {
    return <span aria-hidden className="block min-h-[18px]" />
  }
  return (
    <p
      role="alert"
      id={formMessageId}
      className="flex min-h-[18px] items-center gap-1.5 text-[13px] font-medium text-destructive"
    >
      <CircleAlertIcon aria-hidden className="size-3.5 shrink-0" />
      {String(error.message)}
    </p>
  )
}

// Davlat tanlash — bayroq o'rniga kod matni (+998).
// Native select shaffof overlay'da turadi, ko'rinadigan qism — kod.
// Modul darajada (barqaror identity): inline bo'lsa har renderda
// remount bo'lib, SSR/client farqi chiqishi mumkin.
function CountryCodeSelect(selectProps: {
  value?: string
  onChange?: (value: string) => void
  options: { value?: string; label: string }[]
}) {
  const { t } = useTranslation()
  const code = selectProps.value
    ? getCountryCallingCode(selectProps.value as Country)
    : ""
  return (
    <span className="relative flex h-full shrink-0 items-center gap-1 border-r border-input pr-2.5">
      <span className="text-[15px] text-ink">{code ? `+${code}` : ""}</span>
      <ChevronDownIcon aria-hidden className="size-3.5 text-muted-foreground" />
      <select
        aria-label={t("form.countryCodeLabel")}
        value={selectProps.value ?? ""}
        onChange={(e) => selectProps.onChange?.(e.target.value)}
        className="absolute inset-0 h-full w-full cursor-none opacity-0"
      >
        {selectProps.options.map((o) => (
          <option key={o.label} value={o.value ?? ""}>
            {o.label}
          </option>
        ))}
      </select>
    </span>
  )
}

export function LeadForm() {
  const { t } = useTranslation()
  const [serverError, setServerError] = useState<string | null>(null)

  // Validatsiya sxemasi har renderda joriy tildan quriladi —
  // arzon operatsiya, til almashganda xabarlar darhol yangilanadi.
  // Telefon kutubxonaning aniq tekshiruvi bilan (davlat kodiga qarab).
  const schema = createLeadSchema(
    {
      nameMin: t("validation.nameMin"),
      nameMax: t("validation.nameMax"),
      phoneMin: t("validation.phoneMin"),
      phoneMax: t("validation.phoneMax"),
      phoneInvalid: t("validation.phoneInvalid"),
      serviceRequired: t("validation.serviceRequired"),
      commentMax: t("validation.commentMax"),
    },
    isValidPhoneNumber
  )

  const form = useForm<LeadFormValues>({
    defaultValues: { name: "", phone: "", service: undefined, comment: "" },
  })

  const { isSubmitting } = form.formState
  // Yaxlit telefon inputining chegarasi xatoda qizarishi uchun.
  const phoneError = !!form.formState.errors.phone

  async function onSubmit(values: LeadFormValues) {
    setServerError(null)
    form.clearErrors()
    // PhoneInput allaqachon E.164 formatda beradi (+998901234567).
    const parsed = schema.safeParse(values)
    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        const name = issue.path[0] as keyof LeadFormValues | undefined
        if (name) form.setError(name, { message: issue.message })
      }
      return
    }
    const payload = parsed.data
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const data = (await res.json()) as {
        ok: boolean
        code?: string
        error?: string
      }
      if (!res.ok || !data.ok) {
        setServerError(
          (data.code && t(`apiErrors.${data.code}`)) ||
            data.error ||
            t("apiErrors.CRM_ERROR")
        )
        return
      }
      form.reset()
      toast.success(t("form.toastTitle"), {
        description: t("form.toastDesc"),
      })
    } catch {
      setServerError(t("apiErrors.NETWORK"))
    }
  }

  const serviceOptions: { value: ServiceValue; label: string }[] =
    serviceValues.map((value) => ({
      value,
      label: t(`form.services.${value}`),
    }))

  return (
    <section id="maslahat" className="scroll-mt-24 border-t border-line">
      <div className={cn(CONTAINER, "py-16 md:py-24")}>
        <div className="grid gap-10 md:grid-cols-[1fr_1.25fr] md:gap-14">
          <div>
            <h2 className="font-display text-[25px] font-semibold tracking-tight text-ink md:text-[31px]">
              {t("form.title")}
            </h2>
            <p className="mt-4 max-w-md leading-relaxed text-ink-muted">
              {t("form.desc")}
            </p>
            <ul className="mt-6 space-y-3">
              {(
                t("form.perks", { returnObjects: true }) as unknown as string[]
              ).map((perk) => (
                <li
                  key={perk}
                  className="flex items-center gap-2.5 text-[15px] text-signal-ink"
                >
                  <span className="flex size-5 items-center justify-center rounded-full border border-line bg-raised">
                    <CheckIcon aria-hidden className="size-3" />
                  </span>
                  {perk}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-[15px] text-ink-muted">
              {t("form.direct")}{" "}
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
              noValidate
              className="rounded-2xl border border-line bg-raised/60 p-6 shadow-[0_30px_80px_-40px_rgba(255,255,255,0.12)] md:p-8"
            >
              <div className="grid gap-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("form.nameLabel")}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t("form.namePlaceholder")}
                            autoComplete="name"
                            className="h-12 rounded-xl px-4 text-[15px]"
                            {...field}
                          />
                        </FormControl>
                        <FieldError />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("form.phoneLabel")}</FormLabel>
                        <FormControl>
                          <PhoneInput
                            defaultCountry="UZ"
                            countryCallingCodeEditable={false}
                            countrySelectComponent={CountryCodeSelect}
                            value={field.value}
                            onChange={(value) => field.onChange(value ?? "")}
                            onBlur={field.onBlur}
                            name={field.name}
                            placeholder={t("form.phonePlaceholder")}
                            className={cn(
                              // flex/min-w lib CSS'idan qat'i nazar o'zimizda —
                              // aks holda stillar yuklanmasa qator buziladi.
                              "lead-phone flex h-12 w-full min-w-0 items-center rounded-xl border bg-transparent px-3 text-[15px] outline-none transition-colors dark:bg-input/30",
                              phoneError
                                ? "border-destructive focus-within:border-destructive focus-within:ring-3 focus-within:ring-destructive/20 dark:focus-within:ring-destructive/40"
                                : "border-input focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50"
                            )}
                          />
                        </FormControl>
                        <FieldError />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="service"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("form.serviceLabel")}</FormLabel>
                      {/* Ataylab native select: Base UI popup'i ba'zi qurilmalarda
                          buzilib ko'ringan. Native — telefonda sistemaning o'z
                          tanlash oynasini ochadi, ishonchli va tez. */}
                      <div className="relative">
                        <FormControl>
                          <select
                            {...field}
                            value={field.value ?? ""}
                            className={cn(
                              "h-12 w-full appearance-none rounded-xl border border-input bg-transparent pr-10 pl-4 text-[15px] outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:bg-input/30 dark:aria-invalid:ring-destructive/40",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            <option value="" disabled>
                              {t("form.servicePlaceholder")}
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
                          className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-muted-foreground"
                        />
                      </div>
                      <FieldError />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="comment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("form.commentLabel")}{" "}
                        <span className="font-normal text-ink-muted">
                          {t("form.commentOptional")}
                        </span>
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={t("form.commentPlaceholder")}
                          rows={4}
                          className="min-h-28 rounded-xl px-4 py-3 text-[15px]"
                          {...field}
                        />
                      </FormControl>
                      <FieldError />
                    </FormItem>
                  )}
                />

                {serverError && (
                  <p
                    role="alert"
                    className="rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive"
                  >
                    {serverError}
                  </p>
                )}

                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  className="h-12 w-full bg-signal text-[15px] font-medium text-black shadow-[0_10px_45px_-10px_rgba(255,255,255,0.4)] transition-all duration-300 hover:bg-signal/85"
                >
                  {isSubmitting ? (
                    <Loader2Icon className="size-4 animate-spin" />
                  ) : (
                    <SendIcon aria-hidden className="size-4" />
                  )}
                  {isSubmitting ? t("form.submitting") : t("form.submit")}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </section>
  )
}
