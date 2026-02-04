import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Trophy, Flame, Sun, Moon } from "lucide-react"
import { useProgressStore } from "@/stores/progressStore"
import { useTheme } from "next-themes"

export function Header() {
  const { completedLevels, streak, achievements } = useProgressStore()
  const { theme, setTheme } = useTheme()
  const totalLevels = 25 // Total levels in the curriculum
  const progressPercent = (completedLevels.length / totalLevels) * 100

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border/50 bg-background/80 px-6 backdrop-blur-sm">
      {/* Progress Section */}
      <div className="flex items-center gap-6">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Your Progress</span>
            <Badge variant="secondary" className="text-xs">
              {completedLevels.length}/{totalLevels} levels
            </Badge>
          </div>
          <Progress value={progressPercent} className="h-2 w-48" />
        </div>
      </div>

      {/* Stats & Actions */}
      <div className="flex items-center gap-4">
        {/* Streak */}
        <div className="flex items-center gap-2 rounded-lg bg-orange-500/10 px-3 py-1.5">
          <Flame className="h-4 w-4 text-orange-500" />
          <span className="text-sm font-semibold text-orange-500">{streak}</span>
          <span className="text-xs text-muted-foreground">day streak</span>
        </div>

        {/* Achievements */}
        <div className="flex items-center gap-2 rounded-lg bg-amber-500/10 px-3 py-1.5">
          <Trophy className="h-4 w-4 text-amber-500" />
          <span className="text-sm font-semibold text-amber-500">
            {achievements.length}
          </span>
          <span className="text-xs text-muted-foreground">achievements</span>
        </div>

        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9"
          onClick={toggleTheme}
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>
    </header>
  )
}
