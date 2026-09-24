import type { Metadata } from "next"
import { Space_Grotesk, IBM_Plex_Sans, Fraunces } from "next/font/google"
import { Toaster } from "@/components/ui/sonner"
import { Cursor } from "@/components/cursor"
import { LanguageProvider } from "@/components/language-provider"
import "./globals.css"

// Display/headings — Space Grotesk (frontend.md §1)
const display = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
})

// Body — IBM Plex Sans (frontend.md §1)
const body = IBM_Plex_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
})

// Aksent (aylanuvchi so'z) — Fraunces italic, display
// shrift bilan kontrast uchun.
const accent = Fraunces({
  variable: "--font-accent",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
})

export const metadata: Metadata = {
  title: "MN Development — Biznesingiz uchun texnologiya",
  description:
    "Content, AI tizimlar va sifatli veb-yechimlar — bittasi emas, barchasi bitta tizim ichida.",
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="uz"
      // "dark" — shadcn komponentlari (input, select, popover) dark
      // variantga o'tishi uchun. Sahifa o'zi baribir to'liq dark.
      className={`dark ${display.variable} ${body.variable} ${accent.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-paper text-ink">
        <LanguageProvider>
          {children}
          <Cursor />
          <Toaster position="bottom-center" />
        </LanguageProvider>
      </body>
    </html>
  )
}
