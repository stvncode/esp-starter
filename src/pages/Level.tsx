import {
  Level1_1,
  Level1_2,
  Level1_3,
  Level1_4,
  Level2_1,
  Level2_2,
  Level2_3,
  Level2_4,
  Level3_1,
  Level3_2,
  Level3_3,
  Level3_4,
  Level3_5,
  Level4_1,
  Level4_2,
  Level4_3,
  Level4_4,
  Level5_1,
  Level5_2,
  Level5_3,
  Level5_4,
  Level6_1,
  Level6_2,
  Level6_3,
} from "@/components/levels"
import { Navigate, useParams } from "react-router-dom"

const levelComponents: Record<string, React.ComponentType> = {
  "1.1": Level1_1,
  "1.2": Level1_2,
  "1.3": Level1_3,
  "1.4": Level1_4,
  "2.1": Level2_1,
  "2.2": Level2_2,
  "2.3": Level2_3,
  "2.4": Level2_4,
  "3.1": Level3_1,
  "3.2": Level3_2,
  "3.3": Level3_3,
  "3.4": Level3_4,
  "3.5": Level3_5,
  "4.1": Level4_1,
  "4.2": Level4_2,
  "4.3": Level4_3,
  "4.4": Level4_4,
  "5.1": Level5_1,
  "5.2": Level5_2,
  "5.3": Level5_3,
  "5.4": Level5_4,
  "6.1": Level6_1,
  "6.2": Level6_2,
  "6.3": Level6_3,
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
