import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import {
  Cpu,
  Home,
  Lightbulb,
  Code2,
  Pencil,
  Hammer,
  Wifi,
  Sparkles,
  Wrench,
} from "lucide-react"
import { NavLink, useLocation } from "react-router-dom"
import { ScrollArea } from "@/components/ui/scroll-area"

const phases = [
  {
    id: 1,
    title: "Visual Understanding",
    icon: Lightbulb,
    color: "text-amber-400",
    bgColor: "bg-amber-400/10",
    levels: [
      { id: "1.1", title: "What is a smart device?" },
      { id: "1.2", title: "Meet your board" },
      { id: "1.3", title: "Your first flow" },
      { id: "1.4", title: "Adding timing" },
    ],
  },
  {
    id: 2,
    title: "Revealing the Code",
    icon: Code2,
    color: "text-blue-400",
    bgColor: "bg-blue-400/10",
    levels: [
      { id: "2.1", title: "The YAML behind the magic" },
      { id: "2.2", title: "Understanding the structure" },
      { id: "2.3", title: "Spot the difference" },
      { id: "2.4", title: "Reading a complete config" },
    ],
  },
  {
    id: 3,
    title: "Guided Editing",
    icon: Pencil,
    color: "text-green-400",
    bgColor: "bg-green-400/10",
    levels: [
      { id: "3.1", title: "Change the names" },
      { id: "3.2", title: "Change the pins" },
      { id: "3.3", title: "Change the behavior" },
      { id: "3.4", title: "Add a delay" },
      { id: "3.5", title: "Conditions" },
    ],
  },
  {
    id: 4,
    title: "Building from Scratch",
    icon: Hammer,
    color: "text-purple-400",
    bgColor: "bg-purple-400/10",
    levels: [
      { id: "4.1", title: "Fill in the blanks" },
      { id: "4.2", title: "Add a component" },
      { id: "4.3", title: "Create an automation" },
      { id: "4.4", title: "Write a complete config" },
    ],
  },
  {
    id: 5,
    title: "Real Hardware",
    icon: Wifi,
    color: "text-cyan-400",
    bgColor: "bg-cyan-400/10",
    levels: [
      { id: "5.1", title: "Flash your first device" },
      { id: "5.2", title: "Debug with logs" },
      { id: "5.3", title: "OTA updates" },
      { id: "5.4", title: "Integration with Home Assistant" },
    ],
  },
  {
    id: 6,
    title: "Advanced Topics",
    icon: Sparkles,
    color: "text-pink-400",
    bgColor: "bg-pink-400/10",
    levels: [
      { id: "6.1", title: "Lambdas" },
      { id: "6.2", title: "Custom components" },
      { id: "6.3", title: "I2C and SPI devices" },
    ],
  },
]

export function Sidebar() {
  const location = useLocation()

  return (
    <aside className="fixed left-0 top-0 z-30 flex h-svh w-64 flex-col border-r border-border/50 bg-sidebar min-h-0">
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center gap-3 border-b border-border/50 px-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400">
          <Cpu className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="font-semibold tracking-tight">ESPHome Learn</h1>
          <p className="text-xs text-muted-foreground">Starter Kit Guide</p>
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 min-h-0 [&>div>div]:!block">
        <div className="px-2 py-4 overflow-hidden">
        {/* Home Link */}
        <NavLink
          to="/app"
          className={({ isActive }) =>
            cn(
              "mb-2 flex items-center gap-3 rounded-lg px-2 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
            )
          }
        >
          <Home className="h-4 w-4" />
          Dashboard
        </NavLink>

        {/* Workspace Link */}
        <NavLink
          to="/app/workspace"
          end={false}
          className={({ isActive }) =>
            cn(
              "mb-4 flex items-center gap-3 rounded-lg px-2 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-400"
                : "text-muted-foreground hover:bg-gradient-to-r hover:from-emerald-500/10 hover:to-teal-500/10 hover:text-emerald-400"
            )
          }
        >
          <Wrench className="h-4 w-4" />
          Workspace
        </NavLink>

        {/* Phase Groups */}
        <div className="space-y-4">
          {phases.map((phase) => (
            <PhaseGroup key={phase.id} phase={phase} currentPath={location.pathname} />
          ))}
        </div>
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="shrink-0 border-t border-border/50 p-4">
        <div className="rounded-lg bg-gradient-to-r from-blue-500/10 to-cyan-500/10 p-3">
          <p className="text-xs font-medium text-foreground">Need help?</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Check the ESPHome docs or join our community.
          </p>
        </div>
      </div>
    </aside>
  )
}

interface PhaseGroupProps {
  phase: (typeof phases)[0]
  currentPath: string
}

function PhaseGroup({ phase, currentPath }: PhaseGroupProps) {
  const Icon = phase.icon

  return (
    <div className="space-y-1 overflow-hidden">
      <div
        className={cn(
          "flex items-center gap-2 py-2 text-xs font-semibold uppercase tracking-wider",
          phase.color
        )}
      >
        <div className={cn("shrink-0 rounded-md p-1", phase.bgColor)}>
          <Icon className="h-3.5 w-3.5" />
        </div>
        <span className="min-w-0 truncate flex-1">Phase {phase.id}</span>
      </div>
      <div className="space-y-0.5 overflow-hidden">
        {phase.levels.map((level) => {
          const isActive = currentPath === `/app/level/${level.id}`
          return (
            <NavLink
              key={level.id}
              to={`/app/level/${level.id}`}
              className={cn(
                "group relative flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-all overflow-hidden",
                isActive
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="activeLevel"
                  className="absolute inset-0 rounded-md bg-accent"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                />
              )}
              <span className="relative flex min-w-0 flex-1 items-center gap-2">
                <span className="shrink-0 font-mono text-xs opacity-60">{level.id}</span>
                <span className="truncate">{level.title}</span>
              </span>
            </NavLink>
          )
        })}
      </div>
    </div>
  )
}
