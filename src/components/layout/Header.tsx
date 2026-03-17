import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useProgressStore } from "@/stores/progressStore"
import { ChevronRight, Flame, Home, Moon, Sun, Trophy } from "lucide-react"
import { useTheme } from "next-themes"
import { Link, useLocation, useParams } from "react-router-dom"

const PHASE_META: Record<number, { color: string }> = {
  1: { color: "text-amber-400" },
  2: { color: "text-blue-400" },
  3: { color: "text-green-400" },
  4: { color: "text-purple-400" },
  5: { color: "text-cyan-400" },
  6: { color: "text-pink-400" },
}

const LEVEL_TITLES: Record<string, string> = {
  "1.1": "What is a smart device?", "1.2": "Meet your board",
  "1.3": "Your first flow", "1.4": "Adding timing",
  "2.1": "The YAML behind the magic", "2.2": "Understanding the structure",
  "2.3": "Spot the difference", "2.4": "Reading a complete config",
  "3.1": "Change the names", "3.2": "Change the pins",
  "3.3": "Change the behavior", "3.4": "Add a delay", "3.5": "Conditions",
  "4.1": "Fill in the blanks", "4.2": "Add a component",
  "4.3": "Create an automation", "4.4": "Write a complete config",
  "5.1": "Flash your first device", "5.2": "Debug with logs",
  "5.3": "OTA updates", "5.4": "Integration with Home Assistant",
  "6.1": "Lambdas", "6.2": "Custom components", "6.3": "I2C and SPI devices",
}

function Breadcrumb() {
  const location = useLocation()
  const params = useParams<{ levelId?: string }>()
  const path = location.pathname

  type Crumb = { label: string; to?: string; color?: string }
  const crumbs: Crumb[] = [{ label: "Home", to: "/app" }]

  if (path === "/app/workspace") {
    crumbs.push({ label: "Workspace" })
  } else if (path.startsWith("/app/workspace/builder")) {
    crumbs.push({ label: "Workspace", to: "/app/workspace" })
    crumbs.push({ label: "Builder" })
  } else if (params.levelId) {
    const phaseNum = parseInt(params.levelId.split(".")[0])
    const phase = PHASE_META[phaseNum]
    crumbs.push({ label: `Phase ${phaseNum}`, color: phase?.color })
    crumbs.push({ label: LEVEL_TITLES[params.levelId] ?? params.levelId })
  }

  if (crumbs.length <= 1) return null

  return (
    <nav className="flex items-center gap-1 text-sm">
      {crumbs.map((crumb, i) => {
        const isLast = i === crumbs.length - 1
        const isFirst = i === 0
        return (
          <span key={i} className="flex items-center gap-1">
            {i > 0 && <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground/50" />}
            {crumb.to ? (
              <Link
                to={crumb.to}
                className={
                  isFirst
                    ? "text-muted-foreground hover:text-foreground transition-colors"
                    : `font-medium transition-colors hover:text-foreground ${crumb.color ?? "text-muted-foreground"}`
                }
              >
                {isFirst ? <Home className="h-3.5 w-3.5" /> : crumb.label}
              </Link>
            ) : (
              <span className={`font-medium ${isLast ? "text-foreground" : (crumb.color ?? "text-muted-foreground")}`}>
                {crumb.label}
              </span>
            )}
          </span>
        )
      })}
    </nav>
  )
}

export function Header() {
  const { completedLevels, streak, achievements } = useProgressStore()
  const { theme, setTheme } = useTheme()
  const totalLevels = 25
  const progressPercent = (completedLevels.length / totalLevels) * 100

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border/50 bg-background/80 px-6 backdrop-blur-sm">
      <div><Breadcrumb /></div>

      <div className="flex items-center gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Your Progress</span>
            <Badge variant="secondary" className="text-xs">
              {completedLevels.length}/{totalLevels} levels
            </Badge>
          </div>
          <Progress value={progressPercent} className="h-2 w-36" />
        </div>

        <div className="flex items-center gap-2 rounded-lg bg-orange-500/10 px-3 py-1.5">
          <Flame className="h-4 w-4 text-orange-500" />
          <span className="text-sm font-semibold text-orange-500">{streak}</span>
          <span className="text-xs text-muted-foreground">day streak</span>
        </div>

        <div className="flex items-center gap-2 rounded-lg bg-amber-500/10 px-3 py-1.5">
          <Trophy className="h-4 w-4 text-amber-500" />
          <span className="text-sm font-semibold text-amber-500">{achievements.length}</span>
          <span className="text-xs text-muted-foreground">achievements</span>
        </div>

        <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>
    </header>
  )
}
