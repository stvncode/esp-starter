import { AnimatePresence, motion } from "framer-motion"
import { Cpu, Lightbulb, Play, Zap } from "lucide-react"
import { useEffect, useState } from "react"

const FLOW_NODES = [
  {
    id: "btn",
    x: 24,
    y: 52,
    label: "Button",
    sub: "GPIO9",
    icon: Cpu,
    color: "text-blue-400",
    bg: "bg-blue-500/20",
    borderActive: "border-blue-400/60",
  },
  {
    id: "trig",
    x: 172,
    y: 52,
    label: "When Pressed",
    sub: "Trigger",
    icon: Zap,
    color: "text-cyan-400",
    bg: "bg-cyan-500/20",
    borderActive: "border-cyan-400/60",
  },
  {
    id: "act",
    x: 320,
    y: 52,
    label: "Turn On",
    sub: "Action",
    icon: Play,
    color: "text-green-400",
    bg: "bg-green-500/20",
    borderActive: "border-green-400/60",
  },
  {
    id: "light",
    x: 468,
    y: 52,
    label: "RGB LED",
    sub: "GPIO8",
    icon: Lightbulb,
    color: "text-amber-400",
    bg: "bg-amber-500/20",
    borderActive: "border-amber-400/60",
  },
]

const EDGES = [
  { from: 0, to: 1 },
  { from: 1, to: 2 },
  { from: 2, to: 3 },
]

const NW = 116
const NH = 52
const CY = NH / 2

function FlowNode({ node, active }: { node: (typeof FLOW_NODES)[0]; active: boolean }) {
  const Icon = node.icon
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: FLOW_NODES.indexOf(node) * 0.12 }}
      style={{ left: node.x, top: node.y, width: NW }}
      className={`absolute flex flex-col gap-1 rounded-xl border bg-card/80 px-3 py-2 shadow-sm backdrop-blur-sm transition-all duration-500 ${
        active ? `${node.borderActive} shadow-lg` : "border-border/50"
      }`}
    >
      <div className="flex items-center gap-1.5">
        <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md ${node.bg}`}>
          <Icon className={`h-3 w-3 ${node.color}`} />
        </div>
        <span className="truncate text-xs font-semibold">{node.label}</span>
      </div>
      <span className="truncate pl-[26px] text-[10px] text-muted-foreground">{node.sub}</span>
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`absolute inset-0 rounded-xl ${node.bg} blur-sm -z-10`}
          />
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export function HomeFlowDemo() {
  const [activeStep, setActiveStep] = useState(-1)

  useEffect(() => {
    const run = () => {
      let step = 0
      const interval = setInterval(() => {
        setActiveStep(step)
        step++
        if (step > FLOW_NODES.length) {
          clearInterval(interval)
          setActiveStep(-1)
          setTimeout(run, 1400)
        }
      }, 420)
    }
    const t = setTimeout(run, 800)
    return () => clearTimeout(t)
  }, [])

  // content spans x: 24 → 468+116=584, y: 52 → 52+52=104
  const CONTENT_W = 584
  const CONTENT_H = NH + 52 * 2 // give equal vertical padding around the nodes

  return (
    <div className="relative h-[132px] w-full overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm">
      {/* Full-width background grid */}
      <svg className="absolute inset-0 h-full w-full opacity-[0.04]">
        <defs>
          <pattern id="grid-home" width="24" height="24" patternUnits="userSpaceOnUse">
            <path d="M 24 0 L 0 0 0 24" fill="none" stroke="currentColor" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid-home)" />
      </svg>

      {/* Centered content block */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative" style={{ width: CONTENT_W, height: CONTENT_H }}>
      <svg className="absolute inset-0 overflow-visible" width={CONTENT_W} height={CONTENT_H}>
        {EDGES.map((edge, i) => {
          const from = FLOW_NODES[edge.from]
          const to = FLOW_NODES[edge.to]
          const x1 = from.x + NW
          const y1 = from.y + CY
          const x2 = to.x
          const y2 = to.y + CY
          const active = activeStep > edge.from
          return (
            <g key={i}>
              <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#334155" strokeWidth="1.5" />
              <motion.line
                x1={x1} y1={y1} x2={x2} y2={y2}
                stroke="#6366f1" strokeWidth="2"
                animate={{ opacity: active ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              />
              {activeStep === edge.from + 1 && (
                <motion.circle
                  r="4"
                  fill="#6366f1"
                  initial={{ offsetDistance: "0%" } as never}
                  animate={{ offsetDistance: "100%" } as never}
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                  style={{ offsetPath: `path("M ${x1} ${y1} L ${x2} ${y2}")`, offsetRotate: "0deg" } as React.CSSProperties}
                />
              )}
              <polygon
                points={`${x2},${y2} ${x2 - 6},${y2 - 4} ${x2 - 6},${y2 + 4}`}
                fill={active ? "#6366f1" : "#334155"}
                className="transition-colors duration-300"
              />
            </g>
          )
        })}
      </svg>

      {FLOW_NODES.map((node, i) => (
        <FlowNode key={node.id} node={node} active={activeStep >= i} />
      ))}
        </div>
      </div>
    </div>
  )
}
