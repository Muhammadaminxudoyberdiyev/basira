import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Hero } from "@/components/hero"
import { Engines } from "@/components/engines"
import { Process } from "@/components/process"
import { CaseStudies } from "@/components/case-studies"
import { Pricing } from "@/components/pricing"
import { LeadForm } from "@/components/lead-form"

export default function Home() {
  return (
    <div id="top" className="flex min-h-full flex-1 flex-col">
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <Engines />
        <Process />
        <CaseStudies />
        <Pricing />
        <LeadForm />
      </main>
      <SiteFooter />
    </div>
  )
}
