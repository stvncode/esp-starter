import { AnimatePresence, motion } from "framer-motion"
import { Bell, Cpu, Lightbulb, Play, Radio, Zap } from "lucide-react"
import { useEffect, useState } from "react"

export const NODE_W = 128
export const NODE_H = 58

export const DEMO_NODES = [
  { id: "btn",    x: 0,   y: 0,   label: "Button",       sub: "GPIO9",   icon: Cpu,       color: "text-blue-400",   bg: "bg-blue-500/20" },
  { id: "trig1",  x: 160, y: 0,   label: "When Pressed", sub: "Trigger", icon: Zap,       color: "text-cyan-400",   bg: "bg-cyan-500/20" },
  { id: "act1",   x: 320, y: 0,   label: "Turn On",      sub: "Action",  icon: Play,      color: "text-green-400",  bg: "bg-green-500/20" },
  { id: "rgb",    x: 480, y: 0,   label: "RGB LED",      sub: "GPIO8",   icon: Lightbulb, color: "text-amber-400",  bg: "bg-amber-500/20" },
  { id: "pir",    x: 0,   y: 100, label: "PIR Motion",   sub: "GPIO2",   icon: Radio,     color: "text-purple-400", bg: "bg-purple-500/20" },
  { id: "trig2",  x: 160, y: 100, label: "When On",      sub: "Trigger", icon: Zap,       color: "text-cyan-400",   bg: "bg-cyan-500/20" },
  { id: "delay",  x: 320, y: 100, label: "Wait 500ms",   sub: "Delay",   icon: Zap,       color: "text-orange-400", bg: "bg-orange-500/20" },
  { id: "buzzer", x: 480, y: 100, label: "Buzzer",       sub: "GPIO5",   icon: Bell,      color: "text-rose-400",   bg: "bg-rose-500/20" },
]

const DEMO_EDGES = [
  { from: 0, to: 1 }, { from: 1, to: 2 }, { from: 2, to: 3 },
  { from: 4, to: 5 }, { from: 5, to: 6 }, { from: 6, to: 7 },
]

function FlowDemoNode({ node, active, delay }: { node: typeof DEMO_NODES[0]; active: boolean; delay: number }) {
  const Icon = node.icon
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      style={{ left: node.x, top: node.y, width: NODE_W, height: NODE_H }}
      className={`absolute flex flex-col justify-center gap-1 rounded-xl border px-3 py-2 transition-all duration-500 ${
        active
          ? "border-primary/50 bg-primary/5 shadow-lg shadow-primary/10"
          : "border-border bg-card/80"
      }`}
    >
      <div className="flex items-center gap-1.5">
        <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md ${node.bg}`}>
          <Icon className={`h-3 w-3 ${node.color}`} />
        </div>
        <span className="truncate text-xs font-semibold text-foreground">{node.label}</span>
      </div>
      <span className="truncate pl-[26px] text-[10px] text-muted-foreground">{node.sub}</span>
    </motion.div>
  )
}

export function AnimatedFlowDemo() {
  const [activeNodes, setActiveNodes] = useState<Set<number>>(new Set())
  const [activeEdges, setActiveEdges] = useState<Set<number>>(new Set())

  useEffect(() => {
    const animate = () => {
      const steps = [
        () => { setActiveNodes(new Set([0])); setActiveEdges(new Set()) },
        () => { setActiveNodes(new Set([0, 1])); setActiveEdges(new Set([0])) },
        () => { setActiveNodes(new Set([0, 1, 2])); setActiveEdges(new Set([0, 1])) },
        () => { setActiveNodes(new Set([0, 1, 2, 3])); setActiveEdges(new Set([0, 1, 2])) },
        () => { setActiveNodes((p) => new Set([...p, 4])) },
        () => { setActiveNodes((p) => new Set([...p, 5])); setActiveEdges((p) => new Set([...p, 3])) },
        () => { setActiveNodes((p) => new Set([...p, 6])); setActiveEdges((p) => new Set([...p, 4])) },
        () => { setActiveNodes((p) => new Set([...p, 7])); setActiveEdges((p) => new Set([...p, 5])) },
        () => { setActiveNodes(new Set()); setActiveEdges(new Set()) },
      ]
      let i = 0
      const run = () => {
        if (i < steps.length) { steps[i](); i++ }
        if (i < steps.length) setTimeout(run, i === steps.length - 1 ? 1800 : 480)
        else setTimeout(animate, 1400)
      }
      run()
    }
    const t = setTimeout(animate, 600)
    return () => clearTimeout(t)
  }, [])

  const svgW = 480 + NODE_W + 24
  const svgH = 100 + NODE_H + 8

  return (
    <div style={{ width: svgW, height: svgH }} className="relative">
      <svg className="pointer-events-none absolute inset-0 overflow-visible" width={svgW} height={svgH}>
        <defs>
          <marker id="arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L0,6 L6,3 z" className="fill-border" />
          </marker>
          <marker id="arrow-active" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L0,6 L6,3 z" fill="#6366f1" />
          </marker>
        </defs>
        {DEMO_EDGES.map((edge, i) => {
          const from = DEMO_NODES[edge.from]
          const to = DEMO_NODES[edge.to]
          const x1 = from.x + NODE_W
          const y1 = from.y + NODE_H / 2
          const x2 = to.x
          const y2 = to.y + NODE_H / 2
          const isActive = activeEdges.has(i)
          return (
            <g key={i}>
              <line x1={x1} y1={y1} x2={x2 - 6} y2={y2} stroke="currentColor" strokeOpacity="0.2" strokeWidth="1.5" strokeDasharray="6 3" strokeLinecap="round" markerEnd="url(#arrow)" />
              <motion.line
                x1={x1} y1={y1} x2={x2 - 6} y2={y2}
                stroke="#6366f1" strokeWidth="2" strokeDasharray="6 3" strokeLinecap="round"
                animate={{ opacity: isActive ? 1 : 0 }}
                transition={{ duration: 0.25 }}
                markerEnd="url(#arrow-active)"
              />
              <AnimatePresence>
                {isActive && (
                  <motion.circle
                    key={`dot-${i}-${activeEdges.size}`}
                    r={3.5} fill="#818cf8"
                    style={{ offsetPath: `path("M ${x1} ${y1} L ${x2} ${y2}")` } as React.CSSProperties}
                    initial={{ offsetDistance: "0%" } as never}
                    animate={{ offsetDistance: "100%" } as never}
                    transition={{ duration: 0.38, ease: "easeInOut", repeat: Infinity, repeatDelay: 0.6 }}
                  />
                )}
              </AnimatePresence>
            </g>
          )
        })}
      </svg>
      {DEMO_NODES.map((node, i) => (
        <FlowDemoNode key={node.id} node={node} active={activeNodes.has(i)} delay={i * 0.08} />
      ))}
    </div>
  )
}
