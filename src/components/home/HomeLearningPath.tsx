import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useProgressStore } from "@/stores/progressStore"
import { motion } from "framer-motion"
import { Code2, Hammer, Lightbulb, Pencil, Sparkles, Wifi } from "lucide-react"
import { Link } from "react-router-dom"

const PHASES = [
  {
    id: 1,
    title: "Visual Understanding",
    description: "Learn the mental model of smart devices",
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
    levels: 3,
    firstLevel: "6.1",
  },
]

export function HomeLearningPath() {
  const { completedLevels } = useProgressStore()

  const getPhaseProgress = (phaseId: number) => {
    const done = completedLevels.filter((l) => l.startsWith(`${phaseId}.`)).length
    const total = PHASES.find((p) => p.id === phaseId)?.levels ?? 1
    return (done / total) * 100
  }

  return (
    <section className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h2 className="text-2xl font-semibold">Learning Path</h2>
          <p className="text-sm text-muted-foreground mt-1">Six phases, each building on the last.</p>
        </div>
        <Badge variant="outline" className="text-muted-foreground">
          6 Phases · 25 Levels
        </Badge>
      </motion.div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {PHASES.map((phase, i) => {
          const Icon = phase.icon
          const progress = getPhaseProgress(phase.id)
          return (
            <motion.div
              key={phase.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
            >
              <Card className="group relative overflow-hidden border-border/50 bg-card/50 transition-all hover:border-border h-full">
                <div className={`absolute inset-0 ${phase.bgGlow} opacity-0 blur-3xl transition-opacity group-hover:opacity-100`} />
                <CardHeader className="relative pb-3">
                  <div className="mb-2 flex items-center justify-between">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br ${phase.color}`}>
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                    <Badge variant="secondary" className="font-mono text-xs">
                      Phase {phase.id}
                    </Badge>
                  </div>
                  <CardTitle className="text-base">{phase.title}</CardTitle>
                  <CardDescription className="text-xs">{phase.description}</CardDescription>
                </CardHeader>
                <CardContent className="relative pt-0 space-y-3">
                  <div>
                    <div className="mb-1 flex justify-between text-xs">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="h-1.5" />
                  </div>
                  <Button asChild className="w-full h-8 text-sm" variant={progress > 0 ? "default" : "outline"}>
                    <Link to={`/app/level/${phase.firstLevel}`}>
                      {progress > 0 ? "Continue" : "Start Phase"}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
