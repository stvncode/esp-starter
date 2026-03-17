import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useProgressStore } from "@/stores/progressStore"
import { motion } from "framer-motion"
import { Play, Wrench } from "lucide-react"
import { Link } from "react-router-dom"
import { HomeFlowDemo } from "./HomeFlowDemo"

export function HomeHero() {
  const { completedLevels } = useProgressStore()

  return (
    <section className="grid grid-cols-1 gap-8 items-center lg:grid-cols-2 lg:gap-10">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <div className="space-y-1">
          <Badge className="mb-3 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-cyan-400 border-cyan-500/30">
            ESP32 Starter Kit Guide
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight leading-tight">
            Learn ESPHome,
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              visually.
            </span>
          </h1>
        </div>
        <p className="text-muted-foreground leading-relaxed max-w-md">
          Go from zero to flashing real hardware. Start with drag-and-drop flows, discover the
          YAML behind them, then write complete configs yourself.
        </p>
        <div className="flex gap-3">
          <Button asChild size="lg" className="gap-2">
            <Link to="/app/level/1.1">
              <Play className="h-4 w-4" />
              Start Learning
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="gap-2">
            <Link to="/app/workspace">
              <Wrench className="h-4 w-4" />
              Open Workspace
            </Link>
          </Button>
        </div>

        <div className="flex gap-6 pt-2">
          {[
            { label: "Phases", value: "6" },
            { label: "Levels", value: "25" },
            { label: "Your Progress", value: `${Math.round((completedLevels.length / 25) * 100)}%` },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="space-y-3"
      >
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="flex h-2 w-2 rounded-full bg-green-400 animate-pulse" />
          Live preview — ESP32-C6 Starter Kit
        </div>
        <div className="overflow-x-auto">
          <HomeFlowDemo />
        </div>
        <p className="text-xs text-muted-foreground text-center">
          Visual flows translate directly to ESPHome YAML — no guesswork.
        </p>
      </motion.div>
    </section>
  )
}
