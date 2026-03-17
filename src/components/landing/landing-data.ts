import { Bell, Cpu, Lightbulb, Radio } from "lucide-react"

export const NODE_W = 192
export const NODE_H = 112

export type DemoNode = {
  id: string
  x: number
  y: number
  label: string
  sub: string
  icon: typeof Cpu
  color: string
  bg: string
  role: "INPUT" | "OUTPUT"
}

export const DEMO_NODES: DemoNode[] = [
  {
    id: "btn",
    x: 0,
    y: 0,
    label: "Button",
    sub: "GPIO9",
    icon: Cpu,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    role: "INPUT" as const,
  },
  {
    id: "aht20",
    x: 0,
    y: 148,
    label: "AHT20 Temp/Humidity",
    sub: "GPIO6",
    icon: Radio,
    color: "text-sky-500",
    bg: "bg-sky-500/10",
    role: "INPUT" as const,
  },
  {
    id: "rgb",
    x: 260,
    y: 0,
    label: "RGB LED Array",
    sub: "GPIO8",
    icon: Lightbulb,
    color: "text-amber-500",
    bg: "bg-amber-400/10",
    role: "OUTPUT" as const,
  },
  {
    id: "buzzer",
    x: 260,
    y: 148,
    label: "Buzzer",
    sub: "GPIO5",
    icon: Bell,
    color: "text-orange-500",
    bg: "bg-orange-400/10",
    role: "OUTPUT" as const,
  },
] as const

export const DEMO_EDGES = [
  { from: 0, to: 2 },
  { from: 1, to: 3 },
] as const

