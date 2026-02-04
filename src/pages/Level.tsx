import { Level1_1 } from "@/components/levels/Level1_1"
import { Level1_2 } from "@/components/levels/Level1_2"
import { Level1_3 } from "@/components/levels/Level1_3"
import { Level1_4 } from "@/components/levels/Level1_4"
import { Level2_1 } from "@/components/levels/Level2_1"
import { Level2_2 } from "@/components/levels/Level2_2"
import { Level3_1 } from "@/components/levels/Level3_1"
import { Navigate, useParams } from "react-router-dom"

const levelComponents: Record<string, React.ComponentType> = {
  "1.1": Level1_1,
  "1.2": Level1_2,
  "1.3": Level1_3,
  "1.4": Level1_4,
  "2.1": Level2_1,
  "2.2": Level2_2,
  "3.1": Level3_1,
}

export function Level() {
  const { levelId } = useParams<{ levelId: string }>()

  if (!levelId) {
    return <Navigate to="/" replace />
  }

  const LevelComponent = levelComponents[levelId]

  if (!LevelComponent) {
    return (
      <div className="flex h-[calc(100svh-4rem)] items-center justify-center">
        <div className="text-center">
          <h2 className="mb-2 text-2xl font-semibold">Level {levelId}</h2>
          <p className="text-muted-foreground">Coming soon...</p>
        </div>
      </div>
    )
  }

  return <LevelComponent />
}
