import { motion } from "framer-motion"
import { Code2, Cpu, Lightbulb } from "lucide-react"

const STEPS = [
  {
    n: "01",
    icon: Lightbulb,
    title: "Understand visually",
    desc: "Learn how smart devices work using drag-and-drop blocks. No prior knowledge required.",
  },
  {
    n: "02",
    icon: Code2,
    title: "Reveal the code",
    desc: "See how every visual block maps to real ESPHome YAML. Bridge the gap between concept and code.",
  },
  {
    n: "03",
    icon: Cpu,
    title: "Flash & automate",
    desc: "Export your config and flash your ESP32. Your device shows up in Home Assistant, ready to automate.",
  },
]

export function HowItWorksSection() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <p className="mb-3 text-sm font-medium text-primary">The path</p>
          <h2 className="text-3xl font-bold text-foreground">From zero to flashed — step by step</h2>
        </motion.div>

        <div className="relative grid gap-8 md:grid-cols-3">
          <div className="absolute inset-x-[16%] top-5 hidden h-px bg-gradient-to-r from-transparent via-border to-transparent md:block" />
          {STEPS.map((step, i) => (
            <motion.div
              key={step.n}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="relative flex flex-col items-center text-center"
            >
              <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-muted font-mono text-sm font-bold text-muted-foreground">
                {step.n}
              </div>
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20">
                <step.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">{step.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
