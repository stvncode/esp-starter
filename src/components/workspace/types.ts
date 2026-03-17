import type { Edge, Node } from "@xyflow/react"
import type React from "react"

export interface ComponentItem {
  id: string
  type: string
  label: string
  icon: React.ElementType
  color: string
  bgColor: string
  category: string
  data: Record<string, unknown>
}

export interface Automation {
  id: string
  sourceNodeId: string
  trigger: string
  action: string
  targetNodeId: string
}

export interface SavedProject {
  name: string
  deviceName: string
  board: string
  wifiSsid: string
  wifiPassword: string
  area: string
  nodes: Node[]
  edges: Edge[]
  automations: Automation[]
  createdAt: string
}

export interface ConnectMenu {
  screenX: number
  screenY: number
  flowX: number
  flowY: number
  sourceNodeId: string
  menuType: "connect" | "canvas"
}

export interface NodeMenu {
  screenX: number
  screenY: number
  nodeId: string
}
