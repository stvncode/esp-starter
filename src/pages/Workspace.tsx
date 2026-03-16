import { useState, useCallback, useMemo, useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  CircleDot,
  Lightbulb,
  Clock,
  Power,
  Zap,
  RotateCcw,
  Download,
  Save,
  FolderOpen,
  Trash2,
  Copy,
  Check,
  Thermometer,
  Radio,
  Play,
  Square,
  Wifi,
  Cpu,
  MapPin,
  Plus,
  X,
  Settings,
  Boxes,
  GitBranch,
  Code2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { FlowCanvas, type ConnectionDroppedParams } from "@/components/flow"
import type { Node, Edge, NodeMouseHandler, EdgeMouseHandler } from "@xyflow/react"
import { toast } from "sonner"

// ─── Types ────────────────────────────────────────────────────────────────────

interface ComponentItem {
  id: string
  type: string
  label: string
  icon: React.ElementType
  color: string
  bgColor: string
  category: string
  data: Record<string, unknown>
}

interface Automation {
  id: string
  sourceNodeId: string
  trigger: string
  action: string
  targetNodeId: string
}

interface SavedProject {
  name: string
  deviceName: string
  wifiSsid: string
  wifiPassword: string
  area: string
  nodes: Node[]
  edges: Edge[]
  automations: Automation[]
  createdAt: string
}

interface ConnectMenu {
  screenX: number
  screenY: number
  flowX: number
  flowY: number
  sourceNodeId: string
}

// ─── Hardware components (what lives in the Components panel) ─────────────────

const hardwareComponents: ComponentItem[] = [
  { id: "button", type: "button", label: "Button", icon: CircleDot, color: "text-blue-400", bgColor: "bg-blue-500/20", category: "Input", data: { label: "Button", pin: "GPIO4" } },
  { id: "motion", type: "button", label: "Motion Sensor", icon: Radio, color: "text-purple-400", bgColor: "bg-purple-500/20", category: "Input", data: { label: "Motion", pin: "GPIO14" } },
  { id: "temp", type: "button", label: "Temp Sensor", icon: Thermometer, color: "text-cyan-400", bgColor: "bg-cyan-500/20", category: "Input", data: { label: "Temperature", pin: "GPIO27" } },
  { id: "light", type: "light", label: "Light", icon: Lightbulb, color: "text-amber-400", bgColor: "bg-amber-500/20", category: "Output", data: { label: "Light", pin: "GPIO5", isOn: false } },
  { id: "led", type: "light", label: "Status LED", icon: Lightbulb, color: "text-green-400", bgColor: "bg-green-500/20", category: "Output", data: { label: "Status LED", pin: "GPIO2", isOn: false } },
]

// ─── Contextual node options shown when dragging from a handle ────────────────

const contextualNodes: Record<string, ComponentItem[]> = {
  button: [
    { id: "when_pressed", type: "trigger", label: "When Pressed", icon: Zap, color: "text-cyan-400", bgColor: "bg-cyan-500/20", category: "Trigger", data: { label: "When Pressed", triggerType: "on_press" } },
    { id: "when_released", type: "trigger", label: "When Released", icon: Zap, color: "text-cyan-400", bgColor: "bg-cyan-500/20", category: "Trigger", data: { label: "When Released", triggerType: "on_release" } },
    { id: "when_on", type: "trigger", label: "When On", icon: Zap, color: "text-green-400", bgColor: "bg-green-500/20", category: "Trigger", data: { label: "When On", triggerType: "on_turn_on" } },
    { id: "when_off", type: "trigger", label: "When Off", icon: Zap, color: "text-red-400", bgColor: "bg-red-500/20", category: "Trigger", data: { label: "When Off", triggerType: "on_turn_off" } },
  ],
  trigger: [
    { id: "turn_on", type: "action", label: "Turn On", icon: Power, color: "text-green-400", bgColor: "bg-green-500/20", category: "Action", data: { label: "Turn On", actionType: "turn_on" } },
    { id: "turn_off", type: "action", label: "Turn Off", icon: Power, color: "text-red-400", bgColor: "bg-red-500/20", category: "Action", data: { label: "Turn Off", actionType: "turn_off" } },
    { id: "toggle", type: "action", label: "Toggle", icon: Power, color: "text-amber-400", bgColor: "bg-amber-500/20", category: "Action", data: { label: "Toggle", actionType: "toggle" } },
    { id: "delay_1s", type: "delay", label: "Wait 1s", icon: Clock, color: "text-orange-400", bgColor: "bg-orange-500/20", category: "Timing", data: { label: "Wait", duration: "1s" } },
    { id: "delay_5s", type: "delay", label: "Wait 5s", icon: Clock, color: "text-orange-400", bgColor: "bg-orange-500/20", category: "Timing", data: { label: "Wait", duration: "5s" } },
    { id: "delay_10s", type: "delay", label: "Wait 10s", icon: Clock, color: "text-orange-400", bgColor: "bg-orange-500/20", category: "Timing", data: { label: "Wait", duration: "10s" } },
    { id: "light_ctx", type: "light", label: "Light", icon: Lightbulb, color: "text-amber-400", bgColor: "bg-amber-500/20", category: "Output", data: { label: "Light", pin: "GPIO5", isOn: false } },
  ],
  action: [
    { id: "turn_on_2", type: "action", label: "Turn On", icon: Power, color: "text-green-400", bgColor: "bg-green-500/20", category: "Action", data: { label: "Turn On", actionType: "turn_on" } },
    { id: "turn_off_2", type: "action", label: "Turn Off", icon: Power, color: "text-red-400", bgColor: "bg-red-500/20", category: "Action", data: { label: "Turn Off", actionType: "turn_off" } },
    { id: "toggle_2", type: "action", label: "Toggle", icon: Power, color: "text-amber-400", bgColor: "bg-amber-500/20", category: "Action", data: { label: "Toggle", actionType: "toggle" } },
    { id: "delay_1s_2", type: "delay", label: "Wait 1s", icon: Clock, color: "text-orange-400", bgColor: "bg-orange-500/20", category: "Timing", data: { label: "Wait", duration: "1s" } },
    { id: "delay_5s_2", type: "delay", label: "Wait 5s", icon: Clock, color: "text-orange-400", bgColor: "bg-orange-500/20", category: "Timing", data: { label: "Wait", duration: "5s" } },
    { id: "light_ctx2", type: "light", label: "Light", icon: Lightbulb, color: "text-amber-400", bgColor: "bg-amber-500/20", category: "Output", data: { label: "Light", pin: "GPIO5", isOn: false } },
  ],
  delay: [
    { id: "turn_on_d", type: "action", label: "Turn On", icon: Power, color: "text-green-400", bgColor: "bg-green-500/20", category: "Action", data: { label: "Turn On", actionType: "turn_on" } },
    { id: "turn_off_d", type: "action", label: "Turn Off", icon: Power, color: "text-red-400", bgColor: "bg-red-500/20", category: "Action", data: { label: "Turn Off", actionType: "turn_off" } },
    { id: "toggle_d", type: "action", label: "Toggle", icon: Power, color: "text-amber-400", bgColor: "bg-amber-500/20", category: "Action", data: { label: "Toggle", actionType: "toggle" } },
    { id: "light_ctx_d", type: "light", label: "Light", icon: Lightbulb, color: "text-amber-400", bgColor: "bg-amber-500/20", category: "Output", data: { label: "Light", pin: "GPIO5", isOn: false } },
  ],
}

// Group labels for the context menu sections
const contextMenuGroups: Record<string, string[]> = {
  button: ["Trigger"],
  trigger: ["Action", "Timing", "Output"],
  action: ["Action", "Timing", "Output"],
  delay: ["Action", "Output"],
}

const TRIGGER_OPTIONS = [
  { value: "on_press", label: "When Pressed" },
  { value: "on_release", label: "When Released" },
  { value: "on_turn_on", label: "When On" },
  { value: "on_turn_off", label: "When Off" },
]

const ACTION_OPTIONS = [
  { value: "turn_on", label: "Turn On" },
  { value: "turn_off", label: "Turn Off" },
  { value: "toggle", label: "Toggle" },
]

interface NodeMenu {
  screenX: number
  screenY: number
  nodeId: string
}

// ─── Component ────────────────────────────────────────────────────────────────

export function Workspace() {
  const [nodes, setNodes] = useState<Node[]>([])
  const [edges, setEdges] = useState<Edge[]>([])
  const [deviceName, setDeviceName] = useState("my-device")
  const [wifiSsid, setWifiSsid] = useState("")
  const [wifiPassword, setWifiPassword] = useState("")
  const [area, setArea] = useState("")
  const [automations, setAutomations] = useState<Automation[]>([])

  const [savedProjects, setSavedProjects] = useState<SavedProject[]>(() => {
    try {
      const saved = localStorage.getItem("workspace-projects")
      return saved ? JSON.parse(saved) : []
    } catch { return [] }
  })
  const [copied, setCopied] = useState(false)
  const [loadDialogOpen, setLoadDialogOpen] = useState(false)
  const [isSimulating, setIsSimulating] = useState(false)
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("generic")
  const [showYaml, setShowYaml] = useState(false)
  const [connectMenu, setConnectMenu] = useState<ConnectMenu | null>(null)
  const connectMenuRef = useRef<HTMLDivElement>(null)

  const [nodeMenu, setNodeMenu] = useState<NodeMenu | null>(null)
  const nodeMenuRef = useRef<HTMLDivElement>(null)

  const [newAuto, setNewAuto] = useState({ sourceNodeId: "", trigger: "", action: "", targetNodeId: "" })

  const selectedNode = useMemo(() => nodes.find((n) => n.id === selectedNodeId) ?? null, [nodes, selectedNodeId])
  const selectedEdge = useMemo(() => edges.find((e) => e.id === selectedEdgeId) ?? null, [edges, selectedEdgeId])
  const outputNodes = useMemo(() => nodes.filter((n) => n.type === "light"), [nodes])

  // Close connect menu on outside click
  useEffect(() => {
    if (!connectMenu) return
    const handleClick = (e: MouseEvent) => {
      if (connectMenuRef.current && !connectMenuRef.current.contains(e.target as globalThis.Node)) {
        setConnectMenu(null)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [connectMenu])

  // Close node menu on outside click
  useEffect(() => {
    if (!nodeMenu) return
    const handleClick = (e: MouseEvent) => {
      if (nodeMenuRef.current && !nodeMenuRef.current.contains(e.target as globalThis.Node)) {
        setNodeMenu(null)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [nodeMenu])

  // ── YAML ──────────────────────────────────────────────────────────────────
  const yaml = useMemo(() => {
    const buttons = nodes.filter((n) => n.type === "button")
    const lights = nodes.filter((n) => n.type === "light")
    let out = `esphome:\n  name: ${(deviceName || "my-device").toLowerCase().replace(/\s+/g, "-")}\n`
    if (area) out += `  area: "${area}"\n`
    out += `\nesp32:\n  board: esp32dev\n\nwifi:\n  ssid: "${wifiSsid || "YourNetwork"}"\n  password: "${wifiPassword || "YourPassword"}"\n\napi:\n\nlogger:\n\n`
    if (buttons.length > 0) {
      out += `binary_sensor:\n`
      buttons.forEach((btn) => { out += `  - platform: gpio\n    pin: ${btn.data.pin}\n    name: "${btn.data.label}"\n` })
      out += "\n"
    }
    if (lights.length > 0) {
      out += `light:\n`
      lights.forEach((light, i) => { out += `  - platform: binary\n    name: "${light.data.label}"\n    id: light_${i}\n    output: output_${i}\n` })
      out += "\n"
      out += `output:\n`
      lights.forEach((light, i) => { out += `  - platform: gpio\n    pin: ${light.data.pin}\n    id: output_${i}\n` })
      out += "\n"
    }
    if (automations.length > 0) {
      out += `automation:\n`
      automations.forEach((auto) => {
        const srcNode = nodes.find((n) => n.id === auto.sourceNodeId)
        const tgtNode = nodes.find((n) => n.id === auto.targetNodeId)
        out += `  - alias: "${srcNode ? srcNode.data.label : "?"} → ${auto.action} ${tgtNode ? tgtNode.data.label : "?"}"\n`
        out += `    trigger:\n      - platform: ${auto.trigger}\n`
        out += `    action:\n      - service: light.${auto.action}\n        target:\n          entity_id: light_${lights.findIndex((l) => l.id === auto.targetNodeId)}\n`
      })
    }
    return out
  }, [nodes, deviceName, area, wifiSsid, wifiPassword, automations])

  // ── Canvas handlers ────────────────────────────────────────────────────────
  const handleNodeClick = useCallback<NodeMouseHandler>((event, node) => {
    setSelectedNodeId(node.id)
    setSelectedEdgeId(null)
    setConnectMenu(null)
    setNodeMenu({
      screenX: event.clientX,
      screenY: event.clientY,
      nodeId: node.id,
    })
  }, [])

  const handleEdgeClick = useCallback<EdgeMouseHandler>((_e, edge) => {
    setSelectedEdgeId(edge.id)
    setSelectedNodeId(null)
    setConnectMenu(null)
  }, [])

  const handlePaneClick = useCallback(() => {
    setSelectedNodeId(null)
    setSelectedEdgeId(null)
    setConnectMenu(null)
    setNodeMenu(null)
  }, [])

  // ── Connection dropped → show context menu ────────────────────────────────
  const handleConnectionDropped = useCallback((params: ConnectionDroppedParams) => {
    const sourceNode = nodes.find((n) => n.id === params.sourceNodeId)
    if (!sourceNode || !contextualNodes[sourceNode.type ?? ""]) return
    setConnectMenu(params)
  }, [nodes])

  const handleAddContextualNode = useCallback((option: ComponentItem) => {
    if (!connectMenu) return
    const newNode: Node = {
      id: `${option.id}-${Date.now()}`,
      type: option.type,
      position: { x: connectMenu.flowX, y: connectMenu.flowY },
      data: { ...option.data },
    }
    setNodes((prev) => [...prev, newNode])
    setEdges((prev) => [
      ...prev,
      {
        id: `e-${connectMenu.sourceNodeId}-${newNode.id}`,
        source: connectMenu.sourceNodeId,
        target: newNode.id,
        animated: true,
        style: { stroke: "#6366f1", strokeWidth: 2 },
      },
    ])
    setConnectMenu(null)
    toast.success(`Added "${option.label}"`)
  }, [connectMenu])

  const handleAddContextualNodeFromNodeMenu = useCallback((option: ComponentItem) => {
    if (!nodeMenu) return
    const sourceNode = nodes.find((n) => n.id === nodeMenu.nodeId)
    if (!sourceNode) return

    const newNode: Node = {
      id: `${option.id}-${Date.now()}`,
      type: option.type,
      position: {
        x: sourceNode.position.x + 180,
        y: sourceNode.position.y,
      },
      data: { ...option.data },
    }

    setNodes((prev) => [...prev, newNode])
    setEdges((prev) => [
      ...prev,
      {
        id: `e-${sourceNode.id}-${newNode.id}`,
        source: sourceNode.id,
        target: newNode.id,
        animated: true,
        style: { stroke: "#6366f1", strokeWidth: 2 },
      },
    ])

    setNodeMenu(null)
    toast.success(`Added "${option.label}"`)
  }, [nodeMenu, nodes])

  // ── Node operations ────────────────────────────────────────────────────────
  const handleAddNode = useCallback((component: ComponentItem) => {
    const newNode: Node = {
      id: `${component.id}-${Date.now()}`,
      type: component.type,
      position: { x: 150 + Math.random() * 300, y: 100 + Math.random() * 200 },
      data: { ...component.data },
    }
    setNodes((prev) => [...prev, newNode])
  }, [])

  const handleUpdateNodeData = useCallback((field: string, value: string) => {
    if (!selectedNodeId) return
    setNodes((prev) => prev.map((n) => n.id === selectedNodeId ? { ...n, data: { ...n.data, [field]: value } } : n))
  }, [selectedNodeId])

  const handleDuplicateNode = useCallback(() => {
    if (!selectedNode) return
    const dup: Node = {
      id: `${selectedNode.type}-${Date.now()}`,
      type: selectedNode.type,
      position: { x: selectedNode.position.x + 40, y: selectedNode.position.y + 40 },
      data: { ...selectedNode.data },
    }
    setNodes((prev) => [...prev, dup])
    toast.success("Node duplicated")
  }, [selectedNode])

  const handleDeleteNode = useCallback(() => {
    if (!selectedNodeId) return
    setEdges((prev) => prev.filter((e) => e.source !== selectedNodeId && e.target !== selectedNodeId))
    setNodes((prev) => prev.filter((n) => n.id !== selectedNodeId))
    setSelectedNodeId(null)
    setNodeMenu(null)
    toast.success("Node removed")
  }, [selectedNodeId])

  const handleDeleteEdge = useCallback(() => {
    if (!selectedEdgeId) return
    setEdges((prev) => prev.filter((e) => e.id !== selectedEdgeId))
    setSelectedEdgeId(null)
    toast.success("Connection removed")
  }, [selectedEdgeId])

  const resetCanvas = useCallback(() => {
    setNodes([]); setEdges([])
    setSelectedNodeId(null); setSelectedEdgeId(null)
  }, [])

  // ── Simulation ─────────────────────────────────────────────────────────────
  const getConnectedNodes = useCallback(
    (sourceId: string) => edges.filter((e) => e.source === sourceId).map((e) => e.target),
    [edges]
  )

  const runSimulation = useCallback(() => {
    if (nodes.length === 0) { toast.error("Add some nodes first!"); return }
    const inputNodes = nodes.filter((n) => n.type === "button")
    if (inputNodes.length === 0) { toast.error("Add an input node to start simulation"); return }
    setIsSimulating(true)
    const visited = new Set<string>()
    const queue: { nodeId: string; delay: number }[] = []
    inputNodes.forEach((node) => queue.push({ nodeId: node.id, delay: 0 }))
    let currentDelay = 0
    const processQueue = () => {
      const toProcess = [...queue]; queue.length = 0
      toProcess.forEach(({ nodeId, delay }) => {
        if (visited.has(nodeId)) return
        visited.add(nodeId)
        const node = nodes.find((n) => n.id === nodeId); if (!node) return
        setTimeout(() => {
          setNodes((prev) => prev.map((n) => {
            if (n.id !== nodeId) return n
            if (n.type === "button") return { ...n, data: { ...n.data, isActive: true } }
            if (n.type === "light") return { ...n, data: { ...n.data, isOn: true } }
            return { ...n, data: { ...n.data, isActive: true } }
          }))
          const connected = getConnectedNodes(nodeId)
          connected.forEach((id) => { if (!visited.has(id)) queue.push({ nodeId: id, delay: 0 }) })
          if (queue.length > 0) processQueue()
        }, delay + currentDelay)
        currentDelay += 500
      })
    }
    processQueue()
    setTimeout(() => {
      setIsSimulating(false)
      setNodes((prev) => prev.map((n) => ({ ...n, data: { ...n.data, isActive: false, isOn: n.type === "light" ? false : undefined } })))
      toast.success("Simulation complete!")
    }, nodes.length * 600 + 1000)
  }, [nodes, getConnectedNodes])

  const stopSimulation = useCallback(() => {
    setIsSimulating(false)
    setNodes((prev) => prev.map((n) => ({ ...n, data: { ...n.data, isActive: false, isOn: n.type === "light" ? false : undefined } })))
  }, [])

  // ── YAML export ────────────────────────────────────────────────────────────
  const copyYaml = useCallback(() => {
    navigator.clipboard.writeText(yaml)
    setCopied(true); toast.success("YAML copied!")
    setTimeout(() => setCopied(false), 2000)
  }, [yaml])

  const downloadYaml = useCallback(() => {
    const blob = new Blob([yaml], { type: "text/yaml" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url; a.download = `${(deviceName || "my-device").toLowerCase().replace(/\s+/g, "-")}.yaml`
    a.click(); URL.revokeObjectURL(url)
    toast.success("YAML downloaded!")
  }, [yaml, deviceName])

  // ── Save / Load ────────────────────────────────────────────────────────────
  const saveProject = useCallback(() => {
    const project: SavedProject = { name: deviceName, deviceName, wifiSsid, wifiPassword, area, nodes, edges, automations, createdAt: new Date().toISOString() }
    const updated = [...savedProjects.filter((p) => p.name !== deviceName), project]
    setSavedProjects(updated); localStorage.setItem("workspace-projects", JSON.stringify(updated))
    toast.success("Project saved!")
  }, [deviceName, wifiSsid, wifiPassword, area, nodes, edges, automations, savedProjects])

  const loadProject = useCallback((project: SavedProject) => {
    setDeviceName(project.deviceName ?? project.name)
    setWifiSsid(project.wifiSsid ?? ""); setWifiPassword(project.wifiPassword ?? ""); setArea(project.area ?? "")
    setNodes(project.nodes); setEdges(project.edges); setAutomations(project.automations ?? [])
    setLoadDialogOpen(false); toast.success(`Loaded "${project.name}"`)
  }, [])

  const deleteProject = useCallback((name: string) => {
    const updated = savedProjects.filter((p) => p.name !== name)
    setSavedProjects(updated); localStorage.setItem("workspace-projects", JSON.stringify(updated))
    toast.success("Project deleted")
  }, [savedProjects])

  // ── Automations ────────────────────────────────────────────────────────────
  const addAutomation = useCallback(() => {
    if (!newAuto.sourceNodeId || !newAuto.trigger || !newAuto.action || !newAuto.targetNodeId) {
      toast.error("Fill in all automation fields"); return
    }
    setAutomations((prev) => [...prev, { ...newAuto, id: `auto-${Date.now()}` }])
    setNewAuto({ sourceNodeId: "", trigger: "", action: "", targetNodeId: "" })
    toast.success("Automation added")
  }, [newAuto])

  const removeAutomation = useCallback((id: string) => {
    setAutomations((prev) => prev.filter((a) => a.id !== id))
  }, [])

  // ── Context menu options for current source node ───────────────────────────
  const connectMenuOptions = useMemo(() => {
    if (!connectMenu) return []
    const sourceNode = nodes.find((n) => n.id === connectMenu.sourceNodeId)
    return contextualNodes[sourceNode?.type ?? ""] ?? []
  }, [connectMenu, nodes])

  const connectMenuSourceType = useMemo(() => {
    if (!connectMenu) return ""
    return nodes.find((n) => n.id === connectMenu.sourceNodeId)?.type ?? ""
  }, [connectMenu, nodes])

  // Options for the regular node click menu (same catalog, but independent of drag)
  const nodeMenuOptions = useMemo(() => {
    if (!nodeMenu) return []
    const node = nodes.find((n) => n.id === nodeMenu.nodeId)
    return contextualNodes[node?.type ?? ""] ?? []
  }, [nodeMenu, nodes])

  const nodeMenuSourceType = useMemo(() => {
    if (!nodeMenu) return ""
    const node = nodes.find((n) => n.id === nodeMenu.nodeId)
    return node?.type ?? ""
  }, [nodeMenu, nodes])

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="flex h-[calc(100svh-4rem)] flex-col p-6">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Badge className="shrink-0 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-400">
            Workspace
          </Badge>
          <Input
            value={deviceName}
            onChange={(e) => setDeviceName(e.target.value)}
            className="h-8 w-48 border-none bg-transparent p-0 text-xl font-bold focus-visible:ring-0"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={resetCanvas} disabled={isSimulating}>
            <RotateCcw className="mr-2 h-4 w-4" />Clear
          </Button>
          {isSimulating ? (
            <Button size="sm" variant="destructive" onClick={stopSimulation}>
              <Square className="mr-2 h-4 w-4" />Stop
            </Button>
          ) : (
            <Button size="sm" onClick={runSimulation} disabled={nodes.length === 0}>
              <Play className="mr-2 h-4 w-4" />Simulate
            </Button>
          )}
          <Dialog open={loadDialogOpen} onOpenChange={setLoadDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm"><FolderOpen className="mr-2 h-4 w-4" />Load</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Load Project</DialogTitle>
                <DialogDescription>Select a saved workspace project to load</DialogDescription>
              </DialogHeader>
              <div className="space-y-2 py-4">
                {savedProjects.length === 0 ? (
                  <p className="text-center text-sm text-muted-foreground">No saved projects yet</p>
                ) : (
                  savedProjects.map((project) => (
                    <div key={project.name} className="flex items-center justify-between rounded-lg border border-border/50 p-3">
                      <div>
                        <p className="font-medium">{project.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(project.createdAt).toLocaleDateString()} • {project.nodes.length} nodes
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost" onClick={() => deleteProject(project.name)}>
                          <Trash2 className="h-4 w-4 text-red-400" />
                        </Button>
                        <Button size="sm" onClick={() => loadProject(project)}>Load</Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </DialogContent>
          </Dialog>
          <Button variant="outline" size="sm" onClick={saveProject}>
            <Save className="mr-2 h-4 w-4" />Save
          </Button>
          <Button size="sm" onClick={copyYaml}>
            {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
            Copy YAML
          </Button>
          <Button size="sm" variant="secondary" onClick={downloadYaml}>
            <Download className="mr-2 h-4 w-4" />Export
          </Button>
          <Button size="sm" variant={showYaml ? "default" : "outline"} onClick={() => setShowYaml((v) => !v)}>
            <Code2 className="mr-2 h-4 w-4" />YAML
          </Button>
        </div>
      </div>

      {/* Main area */}
      <div className="flex min-h-0 flex-1 gap-6 overflow-hidden">
        {/* Canvas column */}
        <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-3 overflow-hidden">
          <div className="min-h-0 flex-1">
            <FlowCanvas
              nodes={nodes}
              edges={edges}
              onNodesChange={setNodes}
              onEdgesChange={setEdges}
              onNodeClick={handleNodeClick}
              onEdgeClick={handleEdgeClick}
              onPaneClick={handlePaneClick}
              onConnectionDropped={handleConnectionDropped}
              showControls
              showMinimap
            />
          </div>

          {/* YAML preview */}
          <AnimatePresence>
            {showYaml && (
              <motion.div
                key="yaml-panel"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 224, opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="shrink-0 overflow-hidden rounded-xl border border-border/50"
              >
                <div className="flex h-full flex-col bg-gray-950">
                  <div className="flex shrink-0 items-center justify-between border-b border-border/30 px-3 py-1.5">
                    <span className="text-xs font-medium text-green-400">YAML Preview</span>
                    <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => setShowYaml(false)}>
                      <X className="h-3.5 w-3.5 text-muted-foreground" />
                    </Button>
                  </div>
                  <pre className="flex-1 overflow-auto p-3 font-mono text-xs leading-relaxed text-green-400">
                    {yaml}
                  </pre>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right panel — scrolls as a whole, no height-chain complexity */}
        <div className="flex w-80 flex-col gap-3 overflow-y-auto">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="flex flex-col"
          >
            <TabsList className="w-full shrink-0 justify-between">
              <TabsTrigger value="generic" className="flex-1 gap-1">
                <Settings className="h-3.5 w-3.5" />
                Generic
              </TabsTrigger>
              <TabsTrigger value="components" className="flex-1 gap-1">
                <Boxes className="h-3.5 w-3.5" />
                Components
              </TabsTrigger>
              <TabsTrigger value="automations" className="flex-1 gap-1">
                <GitBranch className="h-3.5 w-3.5" />
                Automations
              </TabsTrigger>
            </TabsList>

            {/* Generic tab */}
            <TabsContent value="generic">
              <Card className="border-border/50 bg-card/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Device Settings</CardTitle>
                  <CardDescription className="text-xs">Basic ESPHome configuration</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1.5">
                    <p className="flex items-center gap-1.5 text-xs font-medium">
                      <Cpu className="h-3.5 w-3.5 text-muted-foreground" />Device Name
                    </p>
                    <Input value={deviceName} onChange={(e) => setDeviceName(e.target.value)} placeholder="my-device" className="h-8 text-sm" />
                    <p className="text-[11px] text-muted-foreground">Used as the ESPHome hostname</p>
                  </div>
                  <div className="space-y-1.5">
                    <p className="flex items-center gap-1.5 text-xs font-medium">
                      <MapPin className="h-3.5 w-3.5 text-muted-foreground" />Area
                    </p>
                    <Input value={area} onChange={(e) => setArea(e.target.value)} placeholder="Living Room" className="h-8 text-sm" />
                    <p className="text-[11px] text-muted-foreground">Shown in Home Assistant</p>
                  </div>
                  <div className="space-y-3 rounded-lg border border-border/50 p-3">
                    <div className="flex items-center gap-1.5 text-xs font-medium">
                      <Wifi className="h-3.5 w-3.5 text-muted-foreground" />Wi-Fi
                    </div>
                    <div className="space-y-1.5">
                      <p className="text-xs font-medium text-muted-foreground">SSID</p>
                      <Input value={wifiSsid} onChange={(e) => setWifiSsid(e.target.value)} placeholder="Network name" className="h-8 text-sm" />
                    </div>
                    <div className="space-y-1.5">
                      <p className="text-xs font-medium text-muted-foreground">Password</p>
                      <Input type="password" value={wifiPassword} onChange={(e) => setWifiPassword(e.target.value)} placeholder="••••••••" className="h-8 text-sm" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Components tab — only hardware nodes */}
            <TabsContent value="components">
              <Card className="border-border/50 bg-card/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Components</CardTitle>
                  <CardDescription className="text-xs">
                    Hardware nodes — click to add. Drag a handle to chain logic.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {["Input", "Output"].map((category) => (
                    <div key={category}>
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{category}</p>
                      <div className="space-y-1.5">
                        {hardwareComponents.filter((c) => c.category === category).map((comp) => {
                          const Icon = comp.icon
                          return (
                            <motion.button
                              key={comp.id}
                              onClick={() => handleAddNode(comp)}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className="flex w-full items-center gap-2 rounded-lg border border-border/50 bg-muted/20 p-2 text-left transition-colors hover:border-border hover:bg-muted/40"
                            >
                              <div className={cn("flex h-7 w-7 items-center justify-center rounded-md", comp.bgColor)}>
                                <Icon className={cn("h-3.5 w-3.5", comp.color)} />
                              </div>
                              <span className="text-xs">{comp.label}</span>
                            </motion.button>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                  {/* Hint */}
                  <div className="rounded-lg border border-dashed border-border/40 p-3">
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      <span className="font-semibold text-foreground/60">Tip:</span> Drag from a node's handle (the dot on its edge) to add a trigger, action, or timing node inline.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Automations tab */}
            <TabsContent value="automations" className="flex flex-col gap-3">
              <Card className="shrink-0 border-border/50 bg-card/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Add Automation</CardTitle>
                  <CardDescription className="text-xs">Connect nodes into an automation rule</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-1.5">
                    <p className="text-xs font-medium text-muted-foreground">Source Node</p>
                    <Select value={newAuto.sourceNodeId} onValueChange={(v) => setNewAuto((p) => ({ ...p, sourceNodeId: v }))}>
                      <SelectTrigger className="h-8 w-full text-xs"><SelectValue placeholder="Select node…" /></SelectTrigger>
                      <SelectContent>
                        {nodes.length === 0 ? (
                          <SelectItem value="__none__" disabled>No nodes on canvas</SelectItem>
                        ) : (
                          nodes.map((n) => <SelectItem key={n.id} value={n.id}>{String(n.data.label ?? n.id)}</SelectItem>)
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-xs font-medium text-muted-foreground">Trigger</p>
                    <Select value={newAuto.trigger} onValueChange={(v) => setNewAuto((p) => ({ ...p, trigger: v }))}>
                      <SelectTrigger className="h-8 w-full text-xs"><SelectValue placeholder="Select trigger…" /></SelectTrigger>
                      <SelectContent>
                        {TRIGGER_OPTIONS.map((opt) => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-xs font-medium text-muted-foreground">Action</p>
                    <Select value={newAuto.action} onValueChange={(v) => setNewAuto((p) => ({ ...p, action: v }))}>
                      <SelectTrigger className="h-8 w-full text-xs"><SelectValue placeholder="Select action…" /></SelectTrigger>
                      <SelectContent>
                        {ACTION_OPTIONS.map((opt) => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-xs font-medium text-muted-foreground">Target Node</p>
                    <Select value={newAuto.targetNodeId} onValueChange={(v) => setNewAuto((p) => ({ ...p, targetNodeId: v }))}>
                      <SelectTrigger className="h-8 w-full text-xs"><SelectValue placeholder="Select output…" /></SelectTrigger>
                      <SelectContent>
                        {outputNodes.length === 0 ? (
                          <SelectItem value="__none__" disabled>No output nodes</SelectItem>
                        ) : (
                          outputNodes.map((n) => <SelectItem key={n.id} value={n.id}>{String(n.data.label ?? n.id)}</SelectItem>)
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button size="sm" className="w-full" onClick={addAutomation}>
                    <Plus className="mr-2 h-4 w-4" />Add Automation
                  </Button>
                </CardContent>
              </Card>

              <div className="space-y-2">
                {automations.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-border/50 py-8 text-center">
                    <GitBranch className="mx-auto mb-2 h-6 w-6 text-muted-foreground/50" />
                    <p className="text-xs text-muted-foreground">No automations yet</p>
                  </div>
                ) : (
                  automations.map((auto) => {
                    const srcNode = nodes.find((n) => n.id === auto.sourceNodeId)
                    const tgtNode = nodes.find((n) => n.id === auto.targetNodeId)
                    const triggerLabel = TRIGGER_OPTIONS.find((o) => o.value === auto.trigger)?.label ?? auto.trigger
                    const actionLabel = ACTION_OPTIONS.find((o) => o.value === auto.action)?.label ?? auto.action
                    return (
                      <div key={auto.id} className="flex items-start justify-between gap-2 rounded-lg border border-border/50 bg-card/50 p-3">
                        <div className="min-w-0 flex-1 space-y-0.5">
                          <p className="truncate text-xs font-medium">
                            {srcNode ? String(srcNode.data.label) : "?"} → {tgtNode ? String(tgtNode.data.label) : "?"}
                          </p>
                          <p className="font-mono text-[10px] text-muted-foreground">{triggerLabel} → {actionLabel}</p>
                        </div>
                        <Button size="sm" variant="ghost" className="h-7 w-7 shrink-0 p-0" onClick={() => removeAutomation(auto.id)}>
                          <X className="h-3.5 w-3.5 text-muted-foreground" />
                        </Button>
                      </div>
                    )
                  })
                )}
              </div>
            </TabsContent>
          </Tabs>

          {/* Node / edge properties panel */}
          <AnimatePresence>
            {(selectedNode || selectedEdge) && (
              <motion.div
                key="properties-panel"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className="shrink-0"
              >
                <Card className="border-border/50 bg-card/50">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xs capitalize">
                        {selectedNode ? `${selectedNode.type} node` : "Connection"}
                      </CardTitle>
                      <Button size="sm" variant="ghost" className="h-6 w-6 p-0"
                        onClick={() => { setSelectedNodeId(null); setSelectedEdgeId(null) }}>
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2 pb-3">
                    {selectedNode && (
                      <>
                        <div className="space-y-1">
                          <p className="text-[11px] font-medium text-muted-foreground">Label</p>
                          <Input value={String(selectedNode.data.label ?? "")} onChange={(e) => handleUpdateNodeData("label", e.target.value)} className="h-7 text-xs" />
                        </div>
                        {selectedNode.data.pin !== undefined && (
                          <div className="space-y-1">
                            <p className="text-[11px] font-medium text-muted-foreground">GPIO Pin</p>
                            <Input value={String(selectedNode.data.pin ?? "")} onChange={(e) => handleUpdateNodeData("pin", e.target.value)} className="h-7 font-mono text-xs" placeholder="GPIO4" />
                          </div>
                        )}
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="h-7 flex-1 text-xs" onClick={handleDuplicateNode}>
                            <Copy className="mr-1.5 h-3 w-3" />Duplicate
                          </Button>
                          <Button size="sm" variant="destructive" className="h-7 flex-1 text-xs" onClick={handleDeleteNode}>
                            <Trash2 className="mr-1.5 h-3 w-3" />Delete
                          </Button>
                        </div>
                      </>
                    )}
                    {selectedEdge && (
                      <Button size="sm" variant="destructive" className="h-7 w-full text-xs" onClick={handleDeleteEdge}>
                        <Trash2 className="mr-1.5 h-3 w-3" />Delete Connection
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Stats */}
          {!selectedNode && !selectedEdge && (
            <Card className="shrink-0 border-border/50 bg-card/50">
              <CardContent className="py-3">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div><p className="text-2xl font-bold">{nodes.length}</p><p className="text-xs text-muted-foreground">Nodes</p></div>
                  <div><p className="text-2xl font-bold">{edges.length}</p><p className="text-xs text-muted-foreground">Connections</p></div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Context menu — portalled to body to escape all overflow/transform clipping */}
      {createPortal(
        <AnimatePresence>
          <>
            {connectMenu && connectMenuOptions.length > 0 && (
              <motion.div
                ref={connectMenuRef}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.1 }}
                style={{ top: connectMenu.screenY, left: connectMenu.screenX }}
                className="fixed z-[9999] min-w-[200px] overflow-hidden rounded-xl border border-border/60 bg-card shadow-2xl shadow-black/30"
              >
                <div className="border-b border-border/40 px-3 py-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Add node
                  </p>
                </div>
                <div className="p-1.5">
                  {(contextMenuGroups[connectMenuSourceType] ?? []).map((group) => {
                    const groupItems = connectMenuOptions.filter((o) => o.category === group)
                    if (groupItems.length === 0) return null
                    return (
                      <div key={group}>
                        <p className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
                          {group}
                        </p>
                        {groupItems.map((opt) => {
                          const Icon = opt.icon
                          return (
                            <button
                              key={opt.id}
                              onClick={() => handleAddContextualNode(opt)}
                              className="flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-left text-sm transition-colors hover:bg-accent"
                            >
                              <div className={cn("flex h-6 w-6 shrink-0 items-center justify-center rounded-md", opt.bgColor)}>
                                <Icon className={cn("h-3.5 w-3.5", opt.color)} />
                              </div>
                              <span className="text-xs font-medium">{opt.label}</span>
                            </button>
                          )
                        })}
                      </div>
                    )
                  })}
                </div>
              </motion.div>
            )}

            {nodeMenu && selectedNode && (
              <motion.div
                ref={nodeMenuRef}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.1 }}
                style={{ top: nodeMenu.screenY, left: nodeMenu.screenX }}
                className="fixed z-[9999] min-w-[220px] overflow-hidden rounded-xl border border-border/60 bg-card shadow-2xl shadow-black/30"
              >
                <div className="border-b border-border/40 px-3 py-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Node options
                  </p>
                  <p className="mt-0.5 truncate text-[11px] text-foreground/80">
                    {String(selectedNode.data.label ?? selectedNode.type)}
                  </p>
                </div>
                <div className="p-1.5">
                  {(contextMenuGroups[nodeMenuSourceType] ?? []).map((group) => {
                    const groupItems = nodeMenuOptions.filter((o) => o.category === group)
                    if (groupItems.length === 0) return null
                    return (
                      <div key={group}>
                        <p className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
                          {group}
                        </p>
                        {groupItems.map((opt) => {
                          const Icon = opt.icon
                          return (
                            <button
                              key={opt.id}
                              onClick={() => handleAddContextualNodeFromNodeMenu(opt)}
                              className="flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left text-xs transition-colors hover:bg-accent"
                            >
                              <div className={cn("flex h-6 w-6 shrink-0 items-center justify-center rounded-md", opt.bgColor)}>
                                <Icon className={cn("h-3.5 w-3.5", opt.color)} />
                              </div>
                              <span className="text-xs font-medium">{opt.label}</span>
                            </button>
                          )
                        })}
                      </div>
                    )
                  })}

                  <div className="mt-1 border-t border-border/40 pt-1.5">
                    <button
                      className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-xs transition-colors hover:bg-accent"
                      onClick={() => {
                        handleDuplicateNode()
                        setNodeMenu(null)
                      }}
                    >
                      <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                      Duplicate node
                    </button>
                    <button
                      className="mt-0.5 flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-xs text-red-400 transition-colors hover:bg-destructive/10"
                      onClick={() => {
                        handleDeleteNode()
                      }}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Delete node
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </>
        </AnimatePresence>,
        document.body
      )}
    </div>
  )
}
