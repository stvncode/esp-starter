import { motion } from "framer-motion"
import { Code2, Wifi, Wrench } from "lucide-react"

const FEATURES = [
  {
    icon: Wrench,
    title: "Visual Builder",
    desc: "Drag components onto the canvas, connect them with flows. No code needed to start — just intuition.",
    gradient: "from-blue-500/10 to-cyan-500/10",
    iconColor: "text-blue-500",
    border: "border-blue-500/20",
  },
  {
    icon: Code2,
    title: "Live YAML",
    desc: "Every node and connection you create instantly generates valid ESPHome YAML. Watch it build as you design.",
    gradient: "from-indigo-500/10 to-purple-500/10",
    iconColor: "text-indigo-500",
    border: "border-indigo-500/20",
  },
  {
    icon: Wifi,
    title: "Real Hardware",
    desc: "Export your config, flash your ESP32, and it shows up in Home Assistant. From learning to production in minutes.",
    gradient: "from-green-500/10 to-emerald-500/10",
    iconColor: "text-green-500",
    border: "border-green-500/20",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="border-t border-border bg-muted/20 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <p className="mb-3 text-sm font-medium text-primary">Why ESPHome Learn</p>
          <h2 className="text-3xl font-bold text-foreground">Everything you need, in one place</h2>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div className={`h-full space-y-4 rounded-2xl border ${f.border} bg-gradient-to-br ${f.gradient} p-6`}>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-background/60">
                  <f.icon className={`h-5 w-5 ${f.iconColor}`} />
                </div>
                <h3 className="text-lg font-semibold text-foreground">{f.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
