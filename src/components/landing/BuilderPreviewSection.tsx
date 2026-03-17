import { motion } from "framer-motion"
import { Bell, Code2, Cpu, Lightbulb, Play, Radio, Settings, Zap } from "lucide-react"
import { AnimatedFlowDemo } from "./AnimatedFlowDemo"

const YAML_LINES = [
  { indent: 0, text: "esphome:", color: "text-blue-400" },
  { indent: 1, text: "name: my-esp32-c6", color: "text-green-300" },
  { indent: 0, text: "esp32:", color: "text-blue-400" },
  { indent: 1, text: "board: esp32-c6-devkitc-1", color: "text-green-300" },
  { indent: 0, text: "binary_sensor:", color: "text-blue-400" },
  { indent: 1, text: "- platform: gpio", color: "text-muted-foreground" },
  { indent: 2, text: "pin: GPIO9", color: "text-green-300" },
  { indent: 2, text: "name: Button", color: "text-green-300" },
  { indent: 0, text: "light:", color: "text-blue-400" },
  { indent: 1, text: "- platform: esp32_rmt_led_strip", color: "text-muted-foreground" },
  { indent: 2, text: "pin: GPIO8", color: "text-green-300" },
  { indent: 2, text: "name: RGB LED", color: "text-green-300" },
]

const PANEL_TABS = ["Properties", "YAML", "Logs"]

const NODES_PREVIEW = [
  { label: "Button",       sub: "GPIO9",  icon: Cpu,      bg: "bg-blue-500/20",   color: "text-blue-400" },
  { label: "When Pressed", sub: "Trigger",icon: Zap,      bg: "bg-cyan-500/20",   color: "text-cyan-400" },
  { label: "Turn On",      sub: "Action", icon: Play,     bg: "bg-green-500/20",  color: "text-green-400" },
  { label: "RGB LED",      sub: "GPIO8",  icon: Lightbulb,bg: "bg-amber-500/20",  color: "text-amber-400" },
]

export function BuilderPreviewSection() {
  return (
    <section id="builder" className="border-t border-border py-24">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <p className="mb-3 text-sm font-medium text-primary">Builder</p>
          <h2 className="text-3xl font-bold text-foreground">Visual flows. Real YAML. One workspace.</h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto text-sm leading-relaxed">
            Connect nodes visually and watch valid ESPHome configuration generate in real time. Switch to YAML view anytime to see the code behind your design.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="overflow-hidden rounded-2xl border border-border bg-card shadow-2xl shadow-black/10"
        >
          {/* App top bar */}
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

          {/* Inner layout: sidebar + canvas + right panel */}
          <div className="flex" style={{ minHeight: 400 }}>
            {/* Left sidebar */}
            <div className="hidden w-48 shrink-0 flex-col border-r border-border bg-muted/20 p-3 md:flex">
              <p className="mb-3 px-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Components</p>
              <div className="space-y-1">
                {[
                  { icon: Cpu,      label: "ESP32-C6",  color: "text-blue-400",   bg: "bg-blue-500/15" },
                  { icon: Zap,      label: "Trigger",   color: "text-cyan-400",   bg: "bg-cyan-500/15" },
                  { icon: Play,     label: "Action",    color: "text-green-400",  bg: "bg-green-500/15" },
                  { icon: Lightbulb,label: "RGB LED",   color: "text-amber-400",  bg: "bg-amber-500/15" },
                  { icon: Radio,    label: "PIR Motion",color: "text-purple-400", bg: "bg-purple-500/15" },
                  { icon: Bell,     label: "Buzzer",    color: "text-rose-400",   bg: "bg-rose-500/15" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex cursor-default items-center gap-2 rounded-lg px-2 py-1.5 text-xs text-foreground hover:bg-accent"
                  >
                    <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md ${item.bg}`}>
                      <item.icon className={`h-3 w-3 ${item.color}`} />
                    </div>
                    {item.label}
                  </div>
                ))}
              </div>
            </div>

            {/* Canvas area */}
            <div className="relative min-w-0 flex-1 bg-muted/10">
              {/* Toolbar */}
              <div className="flex items-center justify-between border-b border-border bg-background/50 px-4 py-2">
                <div className="flex items-center gap-2">
                  <div className="h-5 w-20 rounded bg-emerald-500/20" />
                  <div className="h-5 w-28 rounded bg-border/40" />
                </div>
                <div className="flex h-7 overflow-hidden rounded border border-border text-[10px]">
                  <div className="flex items-center gap-1.5 bg-accent px-3 text-accent-foreground font-medium">
                    <Settings className="h-3 w-3" /> Builder
                  </div>
                  <div className="w-px bg-border" />
                  <div className="flex items-center gap-1.5 px-3 text-muted-foreground">
                    <Code2 className="h-3 w-3" /> YAML
                  </div>
                </div>
              </div>

              {/* Grid background + animated demo */}
              <div className="relative overflow-x-auto p-4 md:p-8">
                <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.04]">
                  <defs>
                    <pattern id="grid-builder" width="20" height="20" patternUnits="userSpaceOnUse">
                      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid-builder)" />
                </svg>
                <div className="flex items-start justify-center overflow-x-auto">
                  <AnimatedFlowDemo />
                </div>
              </div>
            </div>

            {/* Right panel */}
            <div className="hidden w-56 shrink-0 flex-col border-l border-border bg-muted/20 xl:flex">
              {/* Panel tabs */}
              <div className="flex border-b border-border">
                {PANEL_TABS.map((tab, i) => (
                  <button
                    key={tab}
                    className={`flex-1 py-2 text-[10px] font-medium transition-colors ${
                      i === 0
                        ? "border-b-2 border-primary text-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Properties panel */}
              <div className="flex-1 p-3 space-y-3">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Selected Node</p>
                <div className="space-y-2">
                  {[
                    { label: "Name", value: "button_1" },
                    { label: "Platform", value: "gpio" },
                    { label: "Pin", value: "GPIO9" },
                    { label: "Mode", value: "INPUT_PULLUP" },
                  ].map((field) => (
                    <div key={field.label}>
                      <p className="text-[9px] text-muted-foreground mb-0.5">{field.label}</p>
                      <div className="rounded-md border border-border bg-background px-2 py-1 text-[10px] text-foreground">
                        {field.value}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border pt-3">
                  <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Flow</p>
                  <div className="space-y-1.5">
                    {NODES_PREVIEW.map((n) => (
                      <div key={n.label} className="flex items-center gap-1.5 rounded-md bg-card/60 px-2 py-1">
                        <div className={`flex h-4 w-4 shrink-0 items-center justify-center rounded ${n.bg}`}>
                          <n.icon className={`h-2.5 w-2.5 ${n.color}`} />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-[9px] font-medium text-foreground">{n.label}</p>
                          <p className="truncate text-[8px] text-muted-foreground">{n.sub}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* YAML preview strip */}
              <div className="border-t border-border bg-gray-950/80 p-3">
                <p className="mb-2 text-[9px] font-semibold uppercase tracking-wider text-green-500/70">Live YAML</p>
                <div className="space-y-0.5 font-mono text-[8px] leading-relaxed">
                  {YAML_LINES.slice(0, 8).map((line, i) => (
                    <div key={i} style={{ paddingLeft: line.indent * 10 }} className={line.color}>
                      {line.text}
                    </div>
                  ))}
                  <div className="text-muted-foreground/40">···</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Feature callouts below the mockup */}
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {[
            { title: "Drag & drop nodes", desc: "Components, triggers, actions — drag them onto the canvas and wire them up." },
            { title: "Instant YAML output", desc: "Every connection you make generates valid ESPHome YAML in real time." },
            { title: "Switch views anytime", desc: "Toggle between Builder and YAML views without losing your work." },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="rounded-xl border border-border bg-card/50 p-4"
            >
              <p className="mb-1 text-sm font-semibold text-foreground">{item.title}</p>
              <p className="text-xs leading-relaxed text-muted-foreground">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
