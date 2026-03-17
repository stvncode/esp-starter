import { AnimatePresence, motion } from "framer-motion"
import type React from "react"
import { useEffect, useState } from "react"
import { DEMO_EDGES, DEMO_NODES, NODE_H, NODE_W } from "./landing-data"

function FlowDemoNode({
  node,
  active,
  delay,
}: {
  node: (typeof DEMO_NODES)[number]
  active: boolean
  delay: number
}) {
  const Icon = node.icon
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      style={{ left: node.x, top: node.y, width: NODE_W, height: NODE_H }}
      className={`absolute flex flex-col justify-between gap-2 rounded-2xl border px-4 py-3 transition-all duration-500 shadow-sm ${
        active
          ? "border-primary/60 bg-background shadow-lg shadow-primary/10"
          : "border-border/60 bg-card"
      }`}
    >
      <div className="flex items-center justify-between">
        <span
          className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wide ${
            node.role === "INPUT"
              ? "bg-blue-500/10 text-blue-500"
              : "bg-amber-500/10 text-amber-500"
          }`}
        >
          {node.role}
        </span>
        <div
          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${node.bg}`}
        >
          <Icon className={`h-3.5 w-3.5 ${node.color}`} />
        </div>
      </div>
      <div>
        <p className="truncate text-sm font-semibold text-foreground">{node.label}</p>
        <p className="truncate text-[11px] text-muted-foreground">{node.sub}</p>
      </div>
    </motion.div>
  )
}

export function AnimatedFlowDemo() {
  const [activeNodes, setActiveNodes] = useState<Set<number>>(new Set())
  const [activeEdges, setActiveEdges] = useState<Set<number>>(new Set())

  useEffect(() => {
    const animate = () => {
      const steps = [
        () => {
          setActiveNodes(new Set([0]))
          setActiveEdges(new Set())
        },
        () => {
          setActiveNodes(new Set([0, 2]))
          setActiveEdges(new Set([0]))
        },
        () => {
          setActiveNodes(new Set([0, 1, 2]))
          setActiveEdges(new Set([0]))
        },
        () => {
          setActiveNodes(new Set([0, 1, 2, 3]))
          setActiveEdges(new Set([0, 1]))
        },
        () => {
          setActiveNodes(new Set())
          setActiveEdges(new Set())
        },
      ]
      let i = 0
      const run = () => {
        if (i < steps.length) {
          steps[i]()
          i++
        }
        if (i < steps.length) setTimeout(run, i === steps.length - 1 ? 1800 : 480)
        else setTimeout(animate, 1400)
      }
      run()
    }
    const t = setTimeout(animate, 600)
    return () => clearTimeout(t)
  }, [])

  const svgW = 260 + NODE_W + 32
  const svgH = 148 + NODE_H + 32

  return (
    <div style={{ width: svgW, height: svgH }} className="relative">
      <svg
        className="pointer-events-none absolute inset-0 overflow-visible"
        width={svgW}
        height={svgH}
      >
        <defs>
          <marker id="arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L0,6 L6,3 z" className="fill-border" />
          </marker>
          <marker
            id="arrow-active"
            markerWidth="6"
            markerHeight="6"
            refX="5"
            refY="3"
            orient="auto"
          >
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
          const mx = (x1 + x2) / 2
          const d = `M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`
          const isActive = activeEdges.has(i)
          return (
            <g key={i}>
              <path
                d={d}
                stroke="currentColor"
                strokeOpacity="0.2"
                strokeWidth="1.5"
                strokeDasharray="6 3"
                strokeLinecap="round"
                fill="none"
                markerEnd="url(#arrow)"
              />
              <motion.path
                d={d}
                stroke="#6366f1"
                strokeWidth="2"
                strokeDasharray="6 3"
                strokeLinecap="round"
                fill="none"
                animate={{ opacity: isActive ? 1 : 0 }}
                transition={{ duration: 0.25 }}
                markerEnd="url(#arrow-active)"
              />
              <AnimatePresence>
                {isActive && (
                  <motion.circle
                    key={`dot-${i}-${activeEdges.size}`}
                    r={3.5}
                    fill="#818cf8"
                    style={{ offsetPath: `path("${d}")` } as React.CSSProperties}
                    initial={{ offsetDistance: "0%" } as never}
                    animate={{ offsetDistance: "100%" } as never}
                    transition={{
                      duration: 0.38,
                      ease: "easeInOut",
                      repeat: Infinity,
                      repeatDelay: 0.6,
                    }}
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
