import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import {
  Lightbulb,
  Code2,
  Pencil,
  Hammer,
  Wifi,
  Sparkles,
  Play,
  Trophy,
  Zap,
  CheckCircle2,
} from "lucide-react"
import { Link } from "react-router-dom"
import { useProgressStore } from "@/stores/progressStore"

const phases = [
  {
    id: 1,
    title: "Visual Understanding",
    description: "Learn the mental model of smart devices through interactive diagrams",
    icon: Lightbulb,
    color: "from-amber-500 to-orange-500",
    bgGlow: "bg-amber-500/20",
    levels: 4,
    firstLevel: "1.1",
  },
  {
    id: 2,
    title: "Revealing the Code",
    description: "Discover the YAML behind every visual block",
    icon: Code2,
    color: "from-blue-500 to-cyan-500",
    bgGlow: "bg-blue-500/20",
    levels: 4,
    firstLevel: "2.1",
  },
  {
    id: 3,
    title: "Guided Editing",
    description: "Make your first changes to real configurations",
    icon: Pencil,
    color: "from-green-500 to-emerald-500",
    bgGlow: "bg-green-500/20",
    levels: 5,
    firstLevel: "3.1",
  },
  {
    id: 4,
    title: "Building from Scratch",
    description: "Write complete configs from a blank slate",
    icon: Hammer,
    color: "from-purple-500 to-pink-500",
    bgGlow: "bg-purple-500/20",
    levels: 4,
    firstLevel: "4.1",
  },
  {
    id: 5,
    title: "Real Hardware",
    description: "Flash devices and integrate with Home Assistant",
    icon: Wifi,
    color: "from-cyan-500 to-teal-500",
    bgGlow: "bg-cyan-500/20",
    levels: 4,
    firstLevel: "5.1",
  },
  {
    id: 6,
    title: "Advanced Topics",
    description: "Master lambdas, custom components, and more",
    icon: Sparkles,
    color: "from-pink-500 to-rose-500",
    bgGlow: "bg-pink-500/20",
    levels: 7,
    firstLevel: "6.1",
    locked: true,
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
}

export function Home() {
  const { completedLevels } = useProgressStore()

  const getPhaseProgress = (phaseId: number) => {
    const phaseLevels = completedLevels.filter((l) => l.startsWith(`${phaseId}.`))
    const totalLevels = phases.find((p) => p.id === phaseId)?.levels ?? 1
    return (phaseLevels.length / totalLevels) * 100
  }

  return (
    <div className="p-8">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12"
      >
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-600 p-8">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50" />
          <div className="relative z-10">
            <Badge className="mb-4 bg-white/20 text-white hover:bg-white/30">
              Starter Kit Guide
            </Badge>
            <h1 className="mb-2 text-4xl font-bold text-white">
              Welcome to ESPHome Learning
            </h1>
            <p className="mb-6 max-w-2xl text-lg text-blue-100">
              Master ESPHome from zero to hero. Start with visual concepts, progress to
              writing configurations, and finish by flashing real hardware.
            </p>
            <div className="flex gap-4">
              <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                <Link to="/level/1.1">
                  <Play className="mr-2 h-4 w-4" />
                  Start Learning
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/30 bg-white/10 text-white hover:bg-white/20"
              >
                <Link to="/sandbox">
                  <Zap className="mr-2 h-4 w-4" />
                  Sandbox Mode
                </Link>
              </Button>
            </div>
          </div>
          {/* Decorative elements */}
          <div className="absolute -right-8 -top-8 h-64 w-64 rounded-full bg-cyan-400/20 blur-3xl" />
          <div className="absolute -bottom-8 right-32 h-48 w-48 rounded-full bg-blue-400/20 blur-3xl" />
        </div>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-12 grid grid-cols-3 gap-6"
      >
        <Card className="border-border/50 bg-card/50">
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/10">
              <CheckCircle2 className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{completedLevels.length}</p>
              <p className="text-sm text-muted-foreground">Levels Completed</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/50">
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10">
              <Trophy className="h-6 w-6 text-amber-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">0</p>
              <p className="text-sm text-muted-foreground">Achievements</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/50">
          <CardContent className="flex items-center gap-4 pt-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10">
              <Zap className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {Math.round((completedLevels.length / 25) * 100)}%
              </p>
              <p className="text-sm text-muted-foreground">Course Progress</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Learning Path */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Learning Path</h2>
        <Badge variant="outline" className="text-muted-foreground">
          6 Phases • 25 Levels
        </Badge>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
      >
        {phases.map((phase) => {
          const Icon = phase.icon
          const progress = getPhaseProgress(phase.id)

          return (
            <motion.div key={phase.id} variants={itemVariants}>
              <Card
                className={`group relative overflow-hidden border-border/50 bg-card/50 transition-all hover:border-border ${phase.locked ? "opacity-60" : ""}`}
              >
                <div
                  className={`absolute inset-0 ${phase.bgGlow} opacity-0 blur-3xl transition-opacity group-hover:opacity-100`}
                />
                <CardHeader className="relative">
                  <div className="mb-2 flex items-center justify-between">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${phase.color}`}
                    >
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <Badge variant="secondary" className="font-mono">
                      Phase {phase.id}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{phase.title}</CardTitle>
                  <CardDescription>{phase.description}</CardDescription>
                </CardHeader>
                <CardContent className="relative">
                  <div className="mb-4">
                    <div className="mb-1 flex justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                  <Button
                    asChild={!phase.locked}
                    className="w-full"
                    variant={phase.locked ? "secondary" : "default"}
                    disabled={phase.locked}
                  >
                    {phase.locked ? (
                      <span>Complete Phase 5 to Unlock</span>
                    ) : (
                      <Link to={`/level/${phase.firstLevel}`}>
                        {progress > 0 ? "Continue" : "Start Phase"}
                      </Link>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </motion.div>
    </div>
  )
}
