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
  Clock,
  Power,
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
    icon: Power,
    color: "text-red-400",
    bgColor: "bg-red-500/20",
    category: "Action",
    data: { label: "Turn Off", actionType: "turn_off" },
  },
  {
    id: "delay_5s",
    type: "delay",
    label: "Wait 5s",
    icon: Clock,
    color: "text-orange-400",
    bgColor: "bg-orange-500/20",
    category: "Timing",
    data: { label: "Wait", duration: "5s" },
  },
  {
    id: "delay_1s",
    type: "delay",
    label: "Wait 1s",
    icon: Clock,
    color: "text-orange-400",
    bgColor: "bg-orange-500/20",
    category: "Timing",
    data: { label: "Wait", duration: "1s" },
  },
]

export function Level1_4() {
  const [nodes, setNodes] = useState<Node[]>([])
  const [edges, setEdges] = useState<Edge[]>([])
  const [isSimulating, setIsSimulating] = useState(false)
  const [simulationStep, setSimulationStep] = useState(0)
  const [challengeComplete, setChallengeComplete] = useState(false)
  const [showConcept, setShowConcept] = useState(true)

  const { completeLevel, completedLevels } = useProgressStore()
  const isCompleted = completedLevels.includes("1.4")

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

  const checkChallenge = useCallback(() => {
    // Need: button -> turn_on -> light AND turn_on -> delay -> turn_off -> light
    const hasButton = nodes.some((n) => n.type === "button")
    const hasLight = nodes.some((n) => n.type === "light")
    const hasTurnOn = nodes.some((n) => n.type === "action" && n.data.actionType === "turn_on")
    const hasTurnOff = nodes.some((n) => n.type === "action" && n.data.actionType === "turn_off")
    const hasDelay = nodes.some((n) => n.type === "delay")

    const hasCorrectFlow = hasButton && hasLight && hasTurnOn && hasTurnOff && hasDelay && edges.length >= 5

    if (hasCorrectFlow) {
      setChallengeComplete(true)
      completeLevel("1.4")
    }

    return hasCorrectFlow
  }, [nodes, edges, completeLevel])

  const runSimulation = useCallback(() => {
    setIsSimulating(true)
    setSimulationStep(0)

    const buttonNode = nodes.find((n) => n.type === "button")
    const lightNode = nodes.find((n) => n.type === "light")
    const delayNode = nodes.find((n) => n.type === "delay")

    if (!buttonNode || !lightNode) {
      setIsSimulating(false)
      return
    }

    // Step 1: Button pressed
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
    }, 1000)

    // Step 3: Delay starts (if present)
    if (delayNode) {
      setTimeout(() => {
        setNodes((prev) =>
          prev.map((n) =>
            n.id === delayNode.id ? { ...n, data: { ...n.data, isActive: true } } : n
          )
        )
        setSimulationStep(3)
      }, 1500)

      // Step 4: Delay ends
      setTimeout(() => {
        setNodes((prev) =>
          prev.map((n) =>
            n.id === delayNode.id ? { ...n, data: { ...n.data, isActive: false } } : n
          )
        )
        setSimulationStep(4)
      }, 4000)

      // Step 5: Light turns off
      setTimeout(() => {
        setNodes((prev) =>
          prev.map((n) => {
            if (n.id === lightNode.id) return { ...n, data: { ...n.data, isOn: false } }
            if (n.id === buttonNode.id) return { ...n, data: { ...n.data, isActive: false } }
            return n
          })
        )
        setSimulationStep(5)
      }, 4500)

      // End simulation
      setTimeout(() => {
        setIsSimulating(false)
        setSimulationStep(0)
        checkChallenge()
      }, 5500)
    } else {
      // No delay - end early
      setTimeout(() => {
        setNodes((prev) =>
          prev.map((n) =>
            n.id === buttonNode.id ? { ...n, data: { ...n.data, isActive: false } } : n
          )
        )
        setIsSimulating(false)
        setSimulationStep(0)
      }, 2500)
    }
  }, [nodes, checkChallenge])

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
            <Badge variant="outline">Level 1.4</Badge>
            {isCompleted && (
              <Badge className="bg-green-500/20 text-green-400">
                <CheckCircle2 className="mr-1 h-3 w-3" /> Completed
              </Badge>
            )}
          </div>
          <h1 className="text-2xl font-bold">Adding Timing</h1>
          <p className="text-muted-foreground">
            Learn how delays and durations work in automations.
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
          {/* Concept Explanation */}
          <AnimatePresence>
            {showConcept && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                <Card className="border-orange-500/30 bg-orange-500/5">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2 text-sm text-orange-400">
                        <Clock className="h-4 w-4" />
                        Timing Concept
                      </CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 text-muted-foreground"
                        onClick={() => setShowConcept(false)}
                      >
                        ×
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    <p className="mb-3">
                      Sometimes you want actions to happen after a delay, or for a specific duration.
                    </p>
                    <div className="rounded-lg bg-background/50 p-3">
                      <p className="mb-2 font-medium text-foreground">Example: Timed Light</p>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="rounded bg-blue-500/20 px-2 py-1 text-blue-400">Press</span>
                        <span>→</span>
                        <span className="rounded bg-green-500/20 px-2 py-1 text-green-400">On</span>
                        <span>→</span>
                        <span className="rounded bg-orange-500/20 px-2 py-1 text-orange-400">5s</span>
                        <span>→</span>
                        <span className="rounded bg-red-500/20 px-2 py-1 text-red-400">Off</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Components Panel */}
          <Card className="border-border/50 bg-card/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Components</CardTitle>
              <CardDescription className="text-xs">
                Click to add to canvas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {["Input", "Action", "Timing", "Output"].map((category) => (
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
          <Card className="border-border/50 bg-card/50 shrink-0">
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
                Create a timed light: button press turns on, waits 5 seconds, then turns off automatically.
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
                    nodes.some((n) => n.type === "action" && n.data.actionType === "turn_on")
                      ? "border-green-500/50 bg-green-500/10 text-green-400"
                      : "border-border/50 text-muted-foreground"
                  )}
                >
                  {nodes.some((n) => n.type === "action" && n.data.actionType === "turn_on") ? (
                    <CheckCircle2 className="h-3 w-3" />
                  ) : (
                    <CircleDot className="h-3 w-3" />
                  )}
                  Add Turn On action
                </div>
                <div
                  className={cn(
                    "flex items-center gap-2 rounded-lg border p-2",
                    nodes.some((n) => n.type === "delay")
                      ? "border-green-500/50 bg-green-500/10 text-green-400"
                      : "border-border/50 text-muted-foreground"
                  )}
                >
                  {nodes.some((n) => n.type === "delay") ? (
                    <CheckCircle2 className="h-3 w-3" />
                  ) : (
                    <CircleDot className="h-3 w-3" />
                  )}
                  Add a Wait block
                </div>
                <div
                  className={cn(
                    "flex items-center gap-2 rounded-lg border p-2",
                    nodes.some((n) => n.type === "action" && n.data.actionType === "turn_off")
                      ? "border-green-500/50 bg-green-500/10 text-green-400"
                      : "border-border/50 text-muted-foreground"
                  )}
                >
                  {nodes.some((n) => n.type === "action" && n.data.actionType === "turn_off") ? (
                    <CheckCircle2 className="h-3 w-3" />
                  ) : (
                    <CircleDot className="h-3 w-3" />
                  )}
                  Add Turn Off action
                </div>
                <div
                  className={cn(
                    "flex items-center gap-2 rounded-lg border p-2",
                    edges.length >= 5
                      ? "border-green-500/50 bg-green-500/10 text-green-400"
                      : "border-border/50 text-muted-foreground"
                  )}
                >
                  {edges.length >= 5 ? (
                    <CheckCircle2 className="h-3 w-3" />
                  ) : (
                    <CircleDot className="h-3 w-3" />
                  )}
                  Connect all nodes ({edges.length}/5)
                </div>
              </div>

              {challengeComplete && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Button asChild className="w-full" size="sm">
                    <Link to="/app/level/2.1">
                      Continue to Phase 2
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
                <Card className="border-orange-500/30 bg-orange-500/5">
                  <CardContent className="py-4">
                    <p className="mb-2 text-sm font-medium text-orange-400">
                      Simulating timed sequence...
                    </p>
                    <div className="space-y-1 text-xs text-muted-foreground">
                      <p className={cn(simulationStep >= 1 && "text-blue-400 font-medium")}>
                        1. Button pressed
                      </p>
                      <p className={cn(simulationStep >= 2 && "text-green-400 font-medium")}>
                        2. Light turns on
                      </p>
                      <p className={cn(simulationStep >= 3 && "text-orange-400 font-medium")}>
                        3. Waiting 5 seconds...
                      </p>
                      <p className={cn(simulationStep >= 4 && "text-orange-400 font-medium")}>
                        4. Wait complete
                      </p>
                      <p className={cn(simulationStep >= 5 && "text-red-400 font-medium")}>
                        5. Light turns off
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
