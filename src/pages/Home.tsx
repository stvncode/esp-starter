import { HomeHero } from "@/components/home/HomeHero"
import { HomeLearningPath } from "@/components/home/HomeLearningPath"

export function Home() {
  return (
    <div className="px-8 py-10 space-y-14">
      <HomeHero />
      <HomeLearningPath />
    </div>
  )
}
