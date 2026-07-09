import { CallToAction } from "@/components/shared/landing/cta"
import { FaqsSection } from "@/components/shared/landing/faqs-section"
import Hero01 from "@/components/shared/landing/hero-01"


export default function Page() {
  return (
    <div>
      <Hero01/>
      <div className="mb-32">
      <CallToAction/>
      </div>
      <FaqsSection/>
    </div>
  )
}
