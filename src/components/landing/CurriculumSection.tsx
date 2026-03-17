import { motion } from "framer-motion"
import { Code2, Hammer, Lightbulb, Pencil, Sparkles, Wifi } from "lucide-react"

const PHASES = [
  { id: 1, title: "Visual Understanding",   icon: Lightbulb, color: "from-amber-500 to-orange-500",  levels: 4 },
  { id: 2, title: "Revealing the Code",     icon: Code2,     color: "from-blue-500 to-cyan-500",     levels: 4 },
  { id: 3, title: "Guided Editing",         icon: Pencil,    color: "from-green-500 to-emerald-500", levels: 5 },
  { id: 4, title: "Building from Scratch",  icon: Hammer,    color: "from-purple-500 to-pink-500",   levels: 4 },
  { id: 5, title: "Real Hardware",          icon: Wifi,      color: "from-cyan-500 to-teal-500",     levels: 4 },
  { id: 6, title: "Advanced Topics",        icon: Sparkles,  color: "from-pink-500 to-rose-500",     levels: 3 },
]

export function CurriculumSection() {
  return (
    <section id="curriculum" className="border-t border-border bg-muted/20 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <p className="mb-2 text-sm font-medium text-primary">Curriculum</p>
            <h2 className="text-3xl font-bold text-foreground">6 phases. 25 levels.</h2>
          </div>
          <span className="text-sm text-muted-foreground">From first click to advanced config</span>
        </motion.div>

        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {PHASES.map((phase, i) => (
            <motion.div
              key={phase.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              className="group flex items-center gap-4 rounded-xl border border-border bg-card/50 p-4 transition-all hover:border-border/80 hover:bg-card"
            >
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${phase.color}`}>
                <phase.icon className="h-5 w-5 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{phase.title}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{phase.levels} levels</p>
              </div>
              <span className="font-mono text-xs text-muted-foreground/60">0{phase.id}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
