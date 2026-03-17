import { Button } from "@/components/ui/button"
import { AnimatedFlowDemo } from "./AnimatedFlowDemo"
import { ArrowRight, Code2, Cpu, Droplets, Wrench } from "lucide-react"
import { motion, MotionValue } from "framer-motion"
import { Link } from "react-router-dom"

interface HeroSectionProps {
  opacity: MotionValue<number>
  y: MotionValue<number>
}

export function HeroSection({ opacity, y }: HeroSectionProps) {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden pt-16">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,oklch(0.488_0.243_264.376_/_0.12),transparent)]" />
        <svg className="absolute inset-0 h-full w-full opacity-[0.04]">
          <defs>
            <pattern id="dots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="1" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots)" />
        </svg>
        <div className="absolute left-1/4 top-1/3 h-96 w-96 -translate-x-1/2 rounded-full bg-blue-500/8 blur-3xl" />
        <div className="absolute right-1/4 top-1/2 h-80 w-80 rounded-full bg-indigo-500/8 blur-3xl" />
      </div>

      <motion.div style={{ opacity, y }} className="relative mx-auto w-full max-w-6xl px-6 py-16 md:py-24">
        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2 md:gap-16">
          {/* Left: copy */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/40 px-4 py-1.5 text-sm text-muted-foreground">
              <span className="flex h-2 w-2 rounded-full bg-green-400 animate-pulse" />
              ESP32-C6 Starter Kit
            </div>

            <div className="space-y-4">
              <h1 className="text-3xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-4xl md:text-5xl">
                Build smart devices.{" "}
                <span className="bg-gradient-to-r from-blue-500 via-cyan-500 to-indigo-500 bg-clip-text text-transparent">
                  Without the guesswork.
                </span>
              </h1>
              <p className="max-w-md text-lg leading-relaxed text-muted-foreground">
                Learn ESPHome through 25 guided levels. Start by dragging visual flows, watch the
                YAML generate live, then flash real hardware. All in one place.
              </p>
            </div>

            <div className="flex gap-3">
              <Button asChild size="lg" className="h-12 gap-2 px-6">
                <Link to="/signup">
                  Get started free
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 gap-2 px-6">
                <Link to="/signin">Sign in</Link>
              </Button>
            </div>

            <div className="flex gap-8 border-t border-border pt-6">
              {[
                { value: "25", label: "Guided levels" },
                { value: "6", label: "Phases" },
                { value: "Workspace", label: "Builder + YAML editor" },
              ].map((s) => (
                <div key={s.label}>
                  <p className="text-2xl font-bold text-foreground">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: app mockup */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative mx-4 sm:mx-0"
          >
            <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-2xl shadow-black/20">
              {/* Browser chrome */}
              <div className="flex items-center gap-2 border-b border-border bg-muted/50 px-4 py-3">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-400/70" />
                  <div className="h-3 w-3 rounded-full bg-yellow-400/70" />
                  <div className="h-3 w-3 rounded-full bg-green-400/70" />
                </div>
                <div className="mx-auto flex items-center gap-2 rounded-md bg-background/60 px-4 py-1 text-xs text-muted-foreground">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-400" />
                  app.esphome.learn / workspace / builder
                </div>
              </div>

              {/* App toolbar */}
              <div className="flex items-center justify-between border-b border-border bg-muted/30 px-4 py-2">
                <div className="flex items-center gap-2">
                  <div className="h-5 w-16 rounded bg-emerald-500/20" />
                  <div className="h-5 w-24 rounded bg-border/50" />
                </div>
                <div className="flex h-7 overflow-hidden rounded border border-border">
                  <div className="flex items-center gap-1.5 bg-accent px-3 text-[10px] text-accent-foreground">
                    <Wrench className="h-3 w-3" /> Builder
                  </div>
                  <div className="w-px bg-border" />
                  <div className="flex items-center gap-1.5 px-3 text-[10px] text-muted-foreground">
                    <Code2 className="h-3 w-3" /> YAML
                  </div>
                </div>
              </div>

              {/* Canvas */}
              <div className="relative bg-muted/20 p-4 sm:p-6" style={{ minHeight: 220 }}>
                <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.06]">
                  <defs>
                    <pattern id="grid-hero" width="20" height="20" patternUnits="userSpaceOnUse">
                      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid-hero)" />
                </svg>
                <div className="overflow-x-auto">
                  <div className="flex items-center justify-center" style={{ minWidth: "fit-content" }}>
                    <AnimatedFlowDemo />
                  </div>
                </div>
              </div>
            </div>

            {/* Floating badges */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="absolute -bottom-4 -left-4 hidden sm:flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 shadow-lg"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500/15">
                <Droplets className="h-4 w-4 text-green-500" />
              </div>
              <div>
                <p className="text-xs font-medium text-foreground">AHT20 Sensor</p>
                <p className="text-[10px] text-muted-foreground">Temperature · Humidity</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="absolute -right-4 -top-4 hidden sm:flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 shadow-lg"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/15">
                <Cpu className="h-4 w-4 text-blue-500" />
              </div>
              <div>
                <p className="text-xs font-medium text-foreground">ESP32-C6</p>
                <p className="text-[10px] text-muted-foreground">Ready to flash</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}
