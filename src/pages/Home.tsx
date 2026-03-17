import { HomeHero } from "@/components/home/HomeHero"
import { HomeLearningPath } from "@/components/home/HomeLearningPath"

export function Home() {
  return (
    <div className="px-4 py-8 space-y-14 md:px-8 md:py-10">
      <HomeHero />
      <HomeLearningPath />
    </div>
  )
}
