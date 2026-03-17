import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  CheckCircle2,
  ChevronRight,
  CircleDot,
  Lightbulb,
  MousePointerClick,
  Power,
  PowerOff,
  ToggleLeft,
  Play,
  RotateCcw,
  Sparkles,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useProgressStore } from "@/stores/progressStore"
import { Link } from "react-router-dom"
import { FlowCanvas } from "@/components/flow"
import type { Node, Edge } from "@xyflow/react"

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
  {
    id: "button",
    type: "button",
    label: "Button",
    icon: CircleDot,
    color: "text-blue-400",
    bgColor: "bg-blue-500/20",
    category: "Input",
    data: { label: "Button", pin: "GPIO4" },
  },
  {
    id: "light",
    type: "light",
    label: "Light",
    icon: Lightbulb,
    color: "text-amber-400",
    bgColor: "bg-amber-500/20",
    category: "Output",
    data: { label: "Light", pin: "GPIO5", isOn: false },
  },
  {
    id: "on_press",
    type: "trigger",
    label: "When Pressed",
    icon: MousePointerClick,
    color: "text-cyan-400",
    bgColor: "bg-cyan-500/20",
    category: "Trigger",
    data: { label: "When Pressed", triggerType: "on_press" },
  },
  {
    id: "on_release",
    type: "trigger",
    label: "When Released",
    icon: MousePointerClick,
    color: "text-teal-400",
    bgColor: "bg-teal-500/20",
    category: "Trigger",
    data: { label: "When Released", triggerType: "on_release" },
  },
  {
    id: "turn_on",
    type: "action",
    label: "Turn On",
    icon: Power,
    color: "text-green-400",
    bgColor: "bg-green-500/20",
    category: "Action",
    data: { label: "Turn On", actionType: "turn_on" },
  },
  {
    id: "turn_off",
    type: "action",
    label: "Turn Off",
    icon: PowerOff,
    color: "text-red-400",
    bgColor: "bg-red-500/20",
    category: "Action",
    data: { label: "Turn Off", actionType: "turn_off" },
  },
  {
    id: "toggle",
    type: "action",
    label: "Toggle",
    icon: ToggleLeft,
    color: "text-purple-400",
    bgColor: "bg-purple-500/20",
    category: "Action",
    data: { label: "Toggle", actionType: "toggle" },
  },
]

const initialNodes: Node[] = []
const initialEdges: Edge[] = []

export function Level1_3() {
  const [nodes, setNodes] = useState<Node[]>(initialNodes)
  const [edges, setEdges] = useState<Edge[]>(initialEdges)
  const [isSimulating, setIsSimulating] = useState(false)
  const [simulationStep, setSimulationStep] = useState(0)
  const [challengeComplete, setChallengeComplete] = useState(false)
  const [showInstructions, setShowInstructions] = useState(true)

  const { completeLevel, completedLevels } = useProgressStore()
  const isCompleted = completedLevels.includes("1.3")

  // Add node to canvas
  const handleAddNode = useCallback((component: DraggableComponent) => {
    const newNode: Node = {
      id: `${component.id}-${Date.now()}`,
      type: component.type,
      position: {
        x: 100 + Math.random() * 200,
        y: 100 + Math.random() * 150,
      },
      data: { ...component.data },
    }
    setNodes((prev) => [...prev, newNode])
  }, [])

  // Check if the challenge is complete
  const checkChallenge = useCallback(() => {
    // Need: button -> on_press -> turn_on -> light
    // AND: button -> on_release -> turn_off -> light
    const hasButton = nodes.some((n) => n.type === "button")
    const hasLight = nodes.some((n) => n.type === "light")
    const hasOnPress = nodes.some(
      (n) => n.type === "trigger" && n.data.triggerType === "on_press"
    )
    const hasOnRelease = nodes.some(
      (n) => n.type === "trigger" && n.data.triggerType === "on_release"
    )
    const hasTurnOn = nodes.some(
      (n) => n.type === "action" && n.data.actionType === "turn_on"
    )
    const hasTurnOff = nodes.some(
      (n) => n.type === "action" && n.data.actionType === "turn_off"
    )

    // Check connections exist
    const hasCorrectFlow =
      hasButton &&
      hasLight &&
      hasOnPress &&
      hasOnRelease &&
      hasTurnOn &&
      hasTurnOff &&
      edges.length >= 6

    if (hasCorrectFlow) {
      setChallengeComplete(true)
      completeLevel("1.3")
    }

    return hasCorrectFlow
  }, [nodes, edges, completeLevel])

  // Simulate the flow
  const runSimulation = useCallback(() => {
    setIsSimulating(true)
    setSimulationStep(0)

    const buttonNode = nodes.find((n) => n.type === "button")
    const lightNode = nodes.find((n) => n.type === "light")

    if (!buttonNode || !lightNode) {
      setIsSimulating(false)
      return
    }

    // Step 1: Activate button
    setTimeout(() => {
      setNodes((prev) =>
        prev.map((n) =>
          n.id === buttonNode.id ? { ...n, data: { ...n.data, isActive: true } } : n
        )
      )
      setSimulationStep(1)
    }, 500)

    // Step 2: Light turns on
    setTimeout(() => {
      setNodes((prev) =>
        prev.map((n) =>
          n.id === lightNode.id ? { ...n, data: { ...n.data, isOn: true } } : n
        )
      )
      setSimulationStep(2)
    }, 1200)

    // Step 3: Deactivate button
    setTimeout(() => {
      setNodes((prev) =>
        prev.map((n) =>
          n.id === buttonNode.id ? { ...n, data: { ...n.data, isActive: false } } : n
        )
      )
      setSimulationStep(3)
    }, 2000)

    // Step 4: Light turns off
    setTimeout(() => {
      setNodes((prev) =>
        prev.map((n) =>
          n.id === lightNode.id ? { ...n, data: { ...n.data, isOn: false } } : n
        )
      )
      setSimulationStep(4)
    }, 2700)

    // End simulation
    setTimeout(() => {
      setIsSimulating(false)
      setSimulationStep(0)
      checkChallenge()
    }, 3500)
  }, [nodes, checkChallenge])

  // Reset canvas
  const resetCanvas = useCallback(() => {
    setNodes([])
    setEdges([])
    setChallengeComplete(false)
    setIsSimulating(false)
    setSimulationStep(0)
  }, [])

  return (
    <div className="flex h-[calc(100svh-4rem)] flex-col p-6">
      {/* Header */}
      <div className="mb-4 flex items-start justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <Badge className="bg-amber-500/20 text-amber-400">Phase 1</Badge>
            <Badge variant="outline">Level 1.3</Badge>
            {isCompleted && (
              <Badge className="bg-green-500/20 text-green-400">
                <CheckCircle2 className="mr-1 h-3 w-3" /> Completed
              </Badge>
            )}
          </div>
          <h1 className="text-2xl font-bold">Your First Flow</h1>
          <p className="text-muted-foreground">
            Build visual logic by connecting nodes together.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={resetCanvas}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset
          </Button>
          <Button
            size="sm"
            onClick={runSimulation}
            disabled={isSimulating || nodes.length < 2}
          >
            <Play className="mr-2 h-4 w-4" />
            {isSimulating ? "Simulating..." : "Simulate"}
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 gap-6 overflow-hidden">
        {/* Flow Canvas */}
        <div className="flex-1">
          <FlowCanvas
            nodes={nodes}
            edges={edges}
            onNodesChange={setNodes}
            onEdgesChange={setEdges}
            showControls
          />
        </div>

        {/* Right Panel */}
        <div className="flex w-80 flex-col gap-4 overflow-auto">
          {/* Instructions */}
          <AnimatePresence>
            {showInstructions && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                <Card className="border-blue-500/30 bg-blue-500/5">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm text-blue-400">
                        How it works
                      </CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 text-muted-foreground"
                        onClick={() => setShowInstructions(false)}
                      >
                        ×
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    <ol className="list-inside list-decimal space-y-1">
                      <li>Click components below to add them to the canvas</li>
                      <li>Drag nodes to position them</li>
                      <li>Connect nodes by dragging from one handle to another</li>
                      <li>Click a line to select it, then press <kbd className="rounded bg-muted px-1 py-0.5 text-xs">Delete</kbd> to remove</li>
                      <li>Click "Simulate" to see your flow in action</li>
                    </ol>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Components Panel */}
          <Card className="flex-1 border-border/50 bg-card/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Components</CardTitle>
              <CardDescription className="text-xs">
                Click to add to canvas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {["Input", "Trigger", "Action", "Output"].map((category) => (
                <div key={category}>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {category}
                  </p>
                  <div className="space-y-2">
                    {availableComponents
                      .filter((c) => c.category === category)
                      .map((comp) => {
                        const Icon = comp.icon
                        return (
                          <motion.button
                            key={comp.id}
                            onClick={() => handleAddNode(comp)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex w-full items-center gap-3 rounded-lg border border-border/50 bg-muted/20 p-2 text-left transition-colors hover:border-border hover:bg-muted/40"
                          >
                            <div
                              className={cn(
                                "flex h-8 w-8 items-center justify-center rounded-md",
                                comp.bgColor
                              )}
                            >
                              <Icon className={cn("h-4 w-4", comp.color)} />
                            </div>
                            <span className="text-sm">{comp.label}</span>
                          </motion.button>
                        )
                      })}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Challenge */}
          <Card className="border-border/50 bg-card/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Sparkles className="h-4 w-4 text-amber-400" />
                  Challenge
                </CardTitle>
                {challengeComplete && (
                  <Badge className="bg-green-500/20 text-green-400">
                    <CheckCircle2 className="mr-1 h-3 w-3" /> Complete!
                  </Badge>
                )}
              </div>
              <CardDescription className="text-xs">
                Create a flow where pressing the button turns the light on, and
                releasing it turns the light off.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4 space-y-2 text-xs">
                <div
                  className={cn(
                    "flex items-center gap-2 rounded-lg border p-2",
                    nodes.some((n) => n.type === "button")
                      ? "border-green-500/50 bg-green-500/10 text-green-400"
                      : "border-border/50 text-muted-foreground"
                  )}
                >
                  {nodes.some((n) => n.type === "button") ? (
                    <CheckCircle2 className="h-3 w-3" />
                  ) : (
                    <CircleDot className="h-3 w-3" />
                  )}
                  Add a Button
                </div>
                <div
                  className={cn(
                    "flex items-center gap-2 rounded-lg border p-2",
                    nodes.some((n) => n.type === "light")
                      ? "border-green-500/50 bg-green-500/10 text-green-400"
                      : "border-border/50 text-muted-foreground"
                  )}
                >
                  {nodes.some((n) => n.type === "light") ? (
                    <CheckCircle2 className="h-3 w-3" />
                  ) : (
                    <CircleDot className="h-3 w-3" />
                  )}
                  Add a Light
                </div>
                <div
                  className={cn(
                    "flex items-center gap-2 rounded-lg border p-2",
                    nodes.some(
                      (n) => n.type === "trigger" && n.data.triggerType === "on_press"
                    ) &&
                      nodes.some(
                        (n) => n.type === "action" && n.data.actionType === "turn_on"
                      )
                      ? "border-green-500/50 bg-green-500/10 text-green-400"
                      : "border-border/50 text-muted-foreground"
                  )}
                >
                  {nodes.some(
                    (n) => n.type === "trigger" && n.data.triggerType === "on_press"
                  ) &&
                  nodes.some(
                    (n) => n.type === "action" && n.data.actionType === "turn_on"
                  ) ? (
                    <CheckCircle2 className="h-3 w-3" />
                  ) : (
                    <CircleDot className="h-3 w-3" />
                  )}
                  When Pressed → Turn On
                </div>
                <div
                  className={cn(
                    "flex items-center gap-2 rounded-lg border p-2",
                    nodes.some(
                      (n) => n.type === "trigger" && n.data.triggerType === "on_release"
                    ) &&
                      nodes.some(
                        (n) => n.type === "action" && n.data.actionType === "turn_off"
                      )
                      ? "border-green-500/50 bg-green-500/10 text-green-400"
                      : "border-border/50 text-muted-foreground"
                  )}
                >
                  {nodes.some(
                    (n) => n.type === "trigger" && n.data.triggerType === "on_release"
                  ) &&
                  nodes.some(
                    (n) => n.type === "action" && n.data.actionType === "turn_off"
                  ) ? (
                    <CheckCircle2 className="h-3 w-3" />
                  ) : (
                    <CircleDot className="h-3 w-3" />
                  )}
                  When Released → Turn Off
                </div>
                <div
                  className={cn(
                    "flex items-center gap-2 rounded-lg border p-2",
                    edges.length >= 6
                      ? "border-green-500/50 bg-green-500/10 text-green-400"
                      : "border-border/50 text-muted-foreground"
                  )}
                >
                  {edges.length >= 6 ? (
                    <CheckCircle2 className="h-3 w-3" />
                  ) : (
                    <CircleDot className="h-3 w-3" />
                  )}
                  Connect all nodes ({edges.length}/6)
                </div>
              </div>

              {challengeComplete && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Button asChild className="w-full" size="sm">
                    <Link to="/app/level/1.4">
                      Continue to Level 1.4
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </motion.div>
              )}
            </CardContent>
          </Card>

          {/* Simulation Status */}
          <AnimatePresence>
            {isSimulating && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
              >
                <Card className="border-purple-500/30 bg-purple-500/5">
                  <CardContent className="py-4">
                    <p className="mb-2 text-sm font-medium text-purple-400">
                      Simulating...
                    </p>
                    <div className="space-y-1 text-xs text-muted-foreground">
                      <p
                        className={cn(
                          simulationStep >= 1 && "text-blue-400 font-medium"
                        )}
                      >
                        1. Button pressed
                      </p>
                      <p
                        className={cn(
                          simulationStep >= 2 && "text-amber-400 font-medium"
                        )}
                      >
                        2. Light turns on
                      </p>
                      <p
                        className={cn(
                          simulationStep >= 3 && "text-blue-400 font-medium"
                        )}
                      >
                        3. Button released
                      </p>
                      <p
                        className={cn(
                          simulationStep >= 4 && "text-gray-400 font-medium"
                        )}
                      >
                        4. Light turns off
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
