import { BuilderPreviewSection } from "@/components/landing/BuilderPreviewSection"
import { CtaFooter } from "@/components/landing/CtaFooter"
import { CurriculumSection } from "@/components/landing/CurriculumSection"
import { FeaturesSection } from "@/components/landing/FeaturesSection"
import { HeroSection } from "@/components/landing/HeroSection"
import { HowItWorksSection } from "@/components/landing/HowItWorksSection"
import { LandingHeader } from "@/components/landing/LandingHeader"
import { useScroll, useTransform } from "framer-motion"
import { useRef } from "react"

export function Landing() {
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] })
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])
  const heroY = useTransform(scrollYProgress, [0, 0.6], [0, 60])

  return (
    <div ref={heroRef} className="min-h-screen bg-background text-foreground">
      <LandingHeader />
      <HeroSection opacity={heroOpacity} y={heroY} />
      <FeaturesSection />
      <HowItWorksSection />
      <BuilderPreviewSection />
      <CurriculumSection />
      <CtaFooter />
    </div>
  )
}
