import { useState, useCallback } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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
} from "lucide-react"
import { cn } from "@/lib/utils"
import { FlowCanvas } from "@/components/flow"
import type { Node, Edge } from "@xyflow/react"
import { toast } from "sonner"

interface DraggableComponent {
  id: string
  type: string
  label: string
  icon: React.ElementType
  color: string
  bgColor: string
  category: string
  data: Record<string, unknown>
}

const availableComponents: DraggableComponent[] = [
  { id: "button", type: "button", label: "Button", icon: CircleDot, color: "text-blue-400", bgColor: "bg-blue-500/20", category: "Input", data: { label: "Button", pin: "GPIO4" } },
  { id: "motion", type: "button", label: "Motion Sensor", icon: Radio, color: "text-purple-400", bgColor: "bg-purple-500/20", category: "Input", data: { label: "Motion", pin: "GPIO14" } },
  { id: "temp", type: "button", label: "Temp Sensor", icon: Thermometer, color: "text-cyan-400", bgColor: "bg-cyan-500/20", category: "Input", data: { label: "Temperature", pin: "GPIO27" } },
  { id: "when_pressed", type: "trigger", label: "When Pressed", icon: Zap, color: "text-cyan-400", bgColor: "bg-cyan-500/20", category: "Trigger", data: { label: "When Pressed", triggerType: "on_press" } },
  { id: "when_released", type: "trigger", label: "When Released", icon: Zap, color: "text-cyan-400", bgColor: "bg-cyan-500/20", category: "Trigger", data: { label: "When Released", triggerType: "on_release" } },
  { id: "when_on", type: "trigger", label: "When On", icon: Zap, color: "text-green-400", bgColor: "bg-green-500/20", category: "Trigger", data: { label: "When On", triggerType: "on_turn_on" } },
  { id: "when_off", type: "trigger", label: "When Off", icon: Zap, color: "text-red-400", bgColor: "bg-red-500/20", category: "Trigger", data: { label: "When Off", triggerType: "on_turn_off" } },
  { id: "turn_on", type: "action", label: "Turn On", icon: Power, color: "text-green-400", bgColor: "bg-green-500/20", category: "Action", data: { label: "Turn On", actionType: "turn_on" } },
  { id: "turn_off", type: "action", label: "Turn Off", icon: Power, color: "text-red-400", bgColor: "bg-red-500/20", category: "Action", data: { label: "Turn Off", actionType: "turn_off" } },
  { id: "toggle", type: "action", label: "Toggle", icon: Power, color: "text-amber-400", bgColor: "bg-amber-500/20", category: "Action", data: { label: "Toggle", actionType: "toggle" } },
  { id: "delay_1s", type: "delay", label: "Wait 1s", icon: Clock, color: "text-orange-400", bgColor: "bg-orange-500/20", category: "Timing", data: { label: "Wait", duration: "1s" } },
  { id: "delay_5s", type: "delay", label: "Wait 5s", icon: Clock, color: "text-orange-400", bgColor: "bg-orange-500/20", category: "Timing", data: { label: "Wait", duration: "5s" } },
  { id: "delay_10s", type: "delay", label: "Wait 10s", icon: Clock, color: "text-orange-400", bgColor: "bg-orange-500/20", category: "Timing", data: { label: "Wait", duration: "10s" } },
  { id: "light", type: "light", label: "Light", icon: Lightbulb, color: "text-amber-400", bgColor: "bg-amber-500/20", category: "Output", data: { label: "Light", pin: "GPIO5", isOn: false } },
  { id: "led", type: "light", label: "Status LED", icon: Lightbulb, color: "text-green-400", bgColor: "bg-green-500/20", category: "Output", data: { label: "Status LED", pin: "GPIO2", isOn: false } },
]

interface SavedProject {
  name: string
  nodes: Node[]
  edges: Edge[]
  createdAt: string
}

export function Sandbox() {
  const [nodes, setNodes] = useState<Node[]>([])
  const [edges, setEdges] = useState<Edge[]>([])
  const [projectName, setProjectName] = useState("My Project")
  const [savedProjects, setSavedProjects] = useState<SavedProject[]>(() => {
    const saved = localStorage.getItem("sandbox-projects")
    return saved ? JSON.parse(saved) : []
  })
  const [copied, setCopied] = useState(false)
  const [loadDialogOpen, setLoadDialogOpen] = useState(false)
  const [isSimulating, setIsSimulating] = useState(false)

  const handleAddNode = useCallback((component: DraggableComponent) => {
    const newNode: Node = {
      id: `${component.id}-${Date.now()}`,
      type: component.type,
      position: { x: 150 + Math.random() * 300, y: 100 + Math.random() * 200 },
      data: { ...component.data },
    }
    setNodes((prev) => [...prev, newNode])
  }, [])

  const resetCanvas = useCallback(() => {
    setNodes([])
    setEdges([])
  }, [])

  const getConnectedNodes = useCallback(
    (sourceId: string): string[] => edges.filter((e) => e.source === sourceId).map((e) => e.target),
    [edges]
  )

  const runSimulation = useCallback(() => {
    if (nodes.length === 0) { toast.error("Add some nodes first!"); return }
    const inputNodes = nodes.filter((n) => n.type === "button")
    if (inputNodes.length === 0) { toast.error("Add an input node (Button, Motion, etc.) to start simulation"); return }
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
        let nodeDelay = delay
        if (node.type === "delay") { const duration = String(node.data.duration || "1s"); nodeDelay += (parseInt(duration) || 1) * 1000 }
        setTimeout(() => {
          setNodes((prev) => prev.map((n) => {
            if (n.id === nodeId) {
              if (n.type === "button") return { ...n, data: { ...n.data, isActive: true } }
              if (n.type === "light") return { ...n, data: { ...n.data, isOn: true } }
              return { ...n, data: { ...n.data, isActive: true } }
            }
            return n
          }))
          const connected = getConnectedNodes(nodeId)
          connected.forEach((targetId) => { if (!visited.has(targetId)) queue.push({ nodeId: targetId, delay: 0 }) })
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

  const generateYaml = useCallback(() => {
    const buttons = nodes.filter((n) => n.type === "button")
    const lights = nodes.filter((n) => n.type === "light")
    let yaml = `esphome:\n  name: ${projectName.toLowerCase().replace(/\s+/g, "-")}\n\nesp32:\n  board: esp32dev\n\nwifi:\n  ssid: "YourNetwork"\n  password: "YourPassword"\n\napi:\n\nlogger:\n\n`
    if (buttons.length > 0) {
      yaml += `binary_sensor:\n`
      buttons.forEach((btn) => { yaml += `  - platform: gpio\n    pin: ${btn.data.pin}\n    name: "${btn.data.label}"\n` })
      yaml += "\n"
    }
    if (lights.length > 0) {
      yaml += `light:\n`
      lights.forEach((light, index) => { yaml += `  - platform: binary\n    name: "${light.data.label}"\n    id: light_${index}\n    output: output_${index}\n` })
      yaml += "\n"
      yaml += `output:\n`
      lights.forEach((light, index) => { yaml += `  - platform: gpio\n    pin: ${light.data.pin}\n    id: output_${index}\n` })
    }
    return yaml
  }, [nodes, projectName])

  const copyYaml = useCallback(() => {
    navigator.clipboard.writeText(generateYaml())
    setCopied(true); toast.success("YAML copied to clipboard!")
    setTimeout(() => setCopied(false), 2000)
  }, [generateYaml])

  const downloadYaml = useCallback(() => {
    const blob = new Blob([generateYaml()], { type: "text/yaml" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a"); a.href = url; a.download = `${projectName.toLowerCase().replace(/\s+/g, "-")}.yaml`; a.click(); URL.revokeObjectURL(url)
    toast.success("YAML downloaded!")
  }, [generateYaml, projectName])

  const saveProject = useCallback(() => {
    const project: SavedProject = { name: projectName, nodes, edges, createdAt: new Date().toISOString() }
    const updated = [...savedProjects.filter((p) => p.name !== projectName), project]
    setSavedProjects(updated); localStorage.setItem("sandbox-projects", JSON.stringify(updated))
    toast.success("Project saved!")
  }, [projectName, nodes, edges, savedProjects])

  const loadProject = useCallback((project: SavedProject) => {
    setProjectName(project.name); setNodes(project.nodes); setEdges(project.edges); setLoadDialogOpen(false)
    toast.success(`Loaded "${project.name}"`)
  }, [])

  const deleteProject = useCallback((name: string) => {
    const updated = savedProjects.filter((p) => p.name !== name)
    setSavedProjects(updated); localStorage.setItem("sandbox-projects", JSON.stringify(updated))
    toast.success("Project deleted")
  }, [savedProjects])

  return (
    <div className="flex h-[calc(100svh-4rem)] flex-col p-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <Badge className="bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 text-violet-400">Sandbox</Badge>
            </div>
            <Input value={projectName} onChange={(e) => setProjectName(e.target.value)} className="h-8 w-48 border-none bg-transparent p-0 text-2xl font-bold focus-visible:ring-0" />
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={resetCanvas} disabled={isSimulating}><RotateCcw className="mr-2 h-4 w-4" />Clear</Button>
          {isSimulating ? (
            <Button size="sm" variant="destructive" onClick={stopSimulation}><Square className="mr-2 h-4 w-4" />Stop</Button>
          ) : (
            <Button size="sm" onClick={runSimulation} disabled={nodes.length === 0}><Play className="mr-2 h-4 w-4" />Simulate</Button>
          )}
          <Dialog open={loadDialogOpen} onOpenChange={setLoadDialogOpen}>
            <DialogTrigger asChild><Button variant="outline" size="sm"><FolderOpen className="mr-2 h-4 w-4" />Load</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Load Project</DialogTitle><DialogDescription>Select a saved project to load</DialogDescription></DialogHeader>
              <div className="space-y-2 py-4">
                {savedProjects.length === 0 ? (
                  <p className="text-center text-sm text-muted-foreground">No saved projects yet</p>
                ) : (
                  savedProjects.map((project) => (
                    <div key={project.name} className="flex items-center justify-between rounded-lg border border-border/50 p-3">
                      <div><p className="font-medium">{project.name}</p><p className="text-xs text-muted-foreground">{new Date(project.createdAt).toLocaleDateString()} • {project.nodes.length} nodes</p></div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost" onClick={() => deleteProject(project.name)}><Trash2 className="h-4 w-4 text-red-400" /></Button>
                        <Button size="sm" onClick={() => loadProject(project)}>Load</Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </DialogContent>
          </Dialog>
          <Button variant="outline" size="sm" onClick={saveProject}><Save className="mr-2 h-4 w-4" />Save</Button>
          <Button size="sm" onClick={copyYaml}>{copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}Copy YAML</Button>
          <Button size="sm" variant="secondary" onClick={downloadYaml}><Download className="mr-2 h-4 w-4" />Export</Button>
        </div>
      </div>
      <div className="flex flex-1 gap-6 overflow-hidden">
        <div className="flex-1"><FlowCanvas nodes={nodes} edges={edges} onNodesChange={setNodes} onEdgesChange={setEdges} showControls showMinimap /></div>
        <div className="flex w-72 flex-col gap-4 overflow-hidden">
          <Card className="flex-1 border-border/50 bg-card/50 overflow-hidden flex flex-col">
            <CardHeader className="pb-3 shrink-0"><CardTitle className="text-sm">Components</CardTitle><CardDescription className="text-xs">Click to add to canvas</CardDescription></CardHeader>
            <CardContent className="flex-1 overflow-y-auto space-y-4 pr-2">
              {["Input", "Trigger", "Action", "Timing", "Output"].map((category) => (
                <div key={category}>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{category}</p>
                  <div className="space-y-1.5">
                    {availableComponents.filter((c) => c.category === category).map((comp) => {
                      const Icon = comp.icon
                      return (
                        <motion.button key={comp.id} onClick={() => handleAddNode(comp)} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex w-full items-center gap-2 rounded-lg border border-border/50 bg-muted/20 p-2 text-left transition-colors hover:border-border hover:bg-muted/40">
                          <div className={cn("flex h-7 w-7 items-center justify-center rounded-md", comp.bgColor)}><Icon className={cn("h-3.5 w-3.5", comp.color)} /></div>
                          <span className="text-xs">{comp.label}</span>
                        </motion.button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card className="border-border/50 bg-card/50 shrink-0">
            <CardContent className="py-3">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div><p className="text-2xl font-bold">{nodes.length}</p><p className="text-xs text-muted-foreground">Nodes</p></div>
                <div><p className="text-2xl font-bold">{edges.length}</p><p className="text-xs text-muted-foreground">Connections</p></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
