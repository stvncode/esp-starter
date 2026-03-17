import { Level1_1 } from "@/components/levels/Level1_1"
import { Level1_2 } from "@/components/levels/Level1_2"
import { Level1_3 } from "@/components/levels/Level1_3"
import { Level1_4 } from "@/components/levels/Level1_4"
import { Level2_1 } from "@/components/levels/Level2_1"
import { Level2_2 } from "@/components/levels/Level2_2"
import { Level2_3 } from "@/components/levels/Level2_3"
import { Level2_4 } from "@/components/levels/Level2_4"
import { Level3_1 } from "@/components/levels/Level3_1"
import { Level3_2 } from "@/components/levels/Level3_2"
import { Level3_3 } from "@/components/levels/Level3_3"
import { Level3_4 } from "@/components/levels/Level3_4"
import { Level3_5 } from "@/components/levels/Level3_5"
import { Level4_1 } from "@/components/levels/Level4_1"
import { Level4_2 } from "@/components/levels/Level4_2"
import { Level4_3 } from "@/components/levels/Level4_3"
import { Level4_4 } from "@/components/levels/Level4_4"
import { Level5_1 } from "@/components/levels/Level5_1"
import { Level5_2 } from "@/components/levels/Level5_2"
import { Level5_3 } from "@/components/levels/Level5_3"
import { Level5_4 } from "@/components/levels/Level5_4"
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
