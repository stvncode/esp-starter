import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  CircleDot,
  Lightbulb,
  CheckCircle2,
  ChevronRight,
  Cpu,
  Wifi,
  Usb,
  Zap,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useProgressStore } from "@/stores/progressStore"
import { Link } from "react-router-dom"

interface Pin {
  id: string
  label: string
  x: number
  y: number
  side: "left" | "right"
  type: "gpio" | "power" | "gnd"
  gpioNum?: number
}

interface Component {
  id: string
  type: "button" | "led"
  label: string
  icon: React.ElementType
  color: string
  bgColor: string
  requiredPin?: string
}

const leftPins: Pin[] = [
  { id: "3v3-l", label: "3V3", x: 0, y: 0, side: "left", type: "power" },
  { id: "en", label: "EN", x: 0, y: 1, side: "left", type: "gpio" },
  { id: "gpio36", label: "36", x: 0, y: 2, side: "left", type: "gpio", gpioNum: 36 },
  { id: "gpio39", label: "39", x: 0, y: 3, side: "left", type: "gpio", gpioNum: 39 },
  { id: "gpio34", label: "34", x: 0, y: 4, side: "left", type: "gpio", gpioNum: 34 },
  { id: "gpio35", label: "35", x: 0, y: 5, side: "left", type: "gpio", gpioNum: 35 },
  { id: "gpio32", label: "32", x: 0, y: 6, side: "left", type: "gpio", gpioNum: 32 },
  { id: "gpio33", label: "33", x: 0, y: 7, side: "left", type: "gpio", gpioNum: 33 },
  { id: "gpio25", label: "25", x: 0, y: 8, side: "left", type: "gpio", gpioNum: 25 },
  { id: "gpio26", label: "26", x: 0, y: 9, side: "left", type: "gpio", gpioNum: 26 },
  { id: "gpio27", label: "27", x: 0, y: 10, side: "left", type: "gpio", gpioNum: 27 },
  { id: "gpio14", label: "14", x: 0, y: 11, side: "left", type: "gpio", gpioNum: 14 },
  { id: "gpio12", label: "12", x: 0, y: 12, side: "left", type: "gpio", gpioNum: 12 },
  { id: "gnd-l", label: "GND", x: 0, y: 13, side: "left", type: "gnd" },
  { id: "gpio13", label: "13", x: 0, y: 14, side: "left", type: "gpio", gpioNum: 13 },
]

const rightPins: Pin[] = [
  { id: "vin", label: "VIN", x: 1, y: 0, side: "right", type: "power" },
  { id: "gnd-r", label: "GND", x: 1, y: 1, side: "right", type: "gnd" },
  { id: "gpio23", label: "23", x: 1, y: 2, side: "right", type: "gpio", gpioNum: 23 },
  { id: "gpio22", label: "22", x: 1, y: 3, side: "right", type: "gpio", gpioNum: 22 },
  { id: "gpio1", label: "TX", x: 1, y: 4, side: "right", type: "gpio", gpioNum: 1 },
  { id: "gpio3", label: "RX", x: 1, y: 5, side: "right", type: "gpio", gpioNum: 3 },
  { id: "gpio21", label: "21", x: 1, y: 6, side: "right", type: "gpio", gpioNum: 21 },
  { id: "gnd-r2", label: "GND", x: 1, y: 7, side: "right", type: "gnd" },
  { id: "gpio19", label: "19", x: 1, y: 8, side: "right", type: "gpio", gpioNum: 19 },
  { id: "gpio18", label: "18", x: 1, y: 9, side: "right", type: "gpio", gpioNum: 18 },
  { id: "gpio5", label: "5", x: 1, y: 10, side: "right", type: "gpio", gpioNum: 5 },
  { id: "gpio17", label: "17", x: 1, y: 11, side: "right", type: "gpio", gpioNum: 17 },
  { id: "gpio16", label: "16", x: 1, y: 12, side: "right", type: "gpio", gpioNum: 16 },
  { id: "gpio4", label: "4", x: 1, y: 13, side: "right", type: "gpio", gpioNum: 4 },
  { id: "gpio2", label: "2", x: 1, y: 14, side: "right", type: "gpio", gpioNum: 2 },
]

const allPins = [...leftPins, ...rightPins]

const components: Component[] = [
  {
    id: "button",
    type: "button",
    label: "Button",
    icon: CircleDot,
    color: "text-blue-400",
    bgColor: "bg-blue-500/20",
  },
  {
    id: "led",
    type: "led",
    label: "LED",
    icon: Lightbulb,
    color: "text-amber-400",
    bgColor: "bg-amber-500/20",
  },
]

// Challenge: GPIO4 for button, GPIO5 for LED
const challengeConfig = {
  button: "gpio4",
  led: "gpio5",
}

export function Level1_2() {
  const [placedComponents, setPlacedComponents] = useState<Record<string, string>>({})
  const [draggingComponent, setDraggingComponent] = useState<string | null>(null)
  const [hoveredPin, setHoveredPin] = useState<string | null>(null)
  const [showExplanation] = useState(true)
  const [challengeComplete, setChallengeComplete] = useState(false)

  const { completeLevel, completedLevels } = useProgressStore()
  const isCompleted = completedLevels.includes("1.2")

  const handlePinClick = useCallback(
    (pinId: string) => {
      const pin = allPins.find((p) => p.id === pinId)
      if (pin?.type !== "gpio") return

      if (draggingComponent) {
        setPlacedComponents((prev) => {
          const newPlacements = { ...prev }
          // Remove from old position
          Object.keys(newPlacements).forEach((key) => {
            if (newPlacements[key] === draggingComponent) {
              delete newPlacements[key]
            }
          })
          newPlacements[pinId] = draggingComponent
          return newPlacements
        })
        setDraggingComponent(null)
      }
    },
    [draggingComponent]
  )

  const checkChallenge = useCallback(() => {
    const buttonPin = Object.entries(placedComponents).find(
      ([, comp]) => comp === "button"
    )?.[0]
    const ledPin = Object.entries(placedComponents).find(
      ([, comp]) => comp === "led"
    )?.[0]

    if (
      buttonPin === challengeConfig.button &&
      ledPin === challengeConfig.led
    ) {
      setChallengeComplete(true)
      completeLevel("1.2")
    }
  }, [placedComponents, completeLevel])

  const getComponentAtPin = (pinId: string) => {
    const componentId = placedComponents[pinId]
    if (!componentId) return null
    return components.find((c) => c.id === componentId)
  }

  const isComponentPlaced = (componentId: string) => {
    return Object.values(placedComponents).includes(componentId)
  }

  return (
    <div className="mx-auto max-w-5xl p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="mb-4 flex items-center gap-2">
          <Badge className="bg-amber-500/20 text-amber-400">Phase 1</Badge>
          <Badge variant="outline">Level 1.2</Badge>
          {isCompleted && (
            <Badge className="bg-green-500/20 text-green-400">
              <CheckCircle2 className="mr-1 h-3 w-3" /> Completed
            </Badge>
          )}
        </div>
        <h1 className="mb-2 text-3xl font-bold">Meet Your Board</h1>
        <p className="text-lg text-muted-foreground">
          The ESP32 is the brain that connects inputs to outputs. Learn its anatomy.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Board Diagram */}
        <Card className="lg:col-span-2 border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle className="text-lg">ESP32 Development Board</CardTitle>
            <CardDescription>
              Drag components from the right panel to connect them to GPIO pins.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative mx-auto w-fit">
              {/* Board body */}
              <div className="relative mx-auto w-80 rounded-xl border-2 border-green-900 bg-gradient-to-b from-green-950 to-green-900 p-4">
                {/* USB Port */}
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex flex-col items-center">
                  <div className="h-6 w-12 rounded-b-lg border-2 border-t-0 border-gray-600 bg-gray-800">
                    <Usb className="mx-auto mt-1 h-4 w-4 text-gray-500" />
                  </div>
                  <span className="mt-2 text-xs text-muted-foreground">USB</span>
                </div>

                {/* WiFi antenna area */}
                <div className="absolute -top-1 left-1/2 -translate-x-1/2">
                  <div className="flex items-center gap-1 rounded-t-lg border-2 border-b-0 border-gray-700 bg-gray-800 px-3 py-1">
                    <Wifi className="h-3 w-3 text-cyan-400" />
                    <span className="text-[10px] text-gray-400">WiFi</span>
                  </div>
                </div>

                {/* ESP32 chip */}
                <div className="mx-auto my-8 flex h-24 w-40 flex-col items-center justify-center rounded-lg border border-gray-700 bg-gray-900">
                  <Cpu className="mb-1 h-8 w-8 text-gray-500" />
                  <span className="text-xs font-mono text-gray-400">ESP32</span>
                </div>

                {/* Power indicator */}
                <div className="absolute right-4 top-8 flex items-center gap-1">
                  <div className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
                  <span className="text-[10px] text-gray-500">PWR</span>
                </div>

                {/* Pins */}
                <div className="absolute left-0 top-12 flex flex-col gap-0.5">
                  {leftPins.map((pin) => {
                    const component = getComponentAtPin(pin.id)
                    const isHovered = hoveredPin === pin.id && pin.type === "gpio"
                    const Icon = component?.icon

                    return (
                      <motion.div
                        key={pin.id}
                        className={cn(
                          "relative -left-8 flex h-5 cursor-pointer items-center",
                          draggingComponent && pin.type === "gpio" && "cursor-copy"
                        )}
                        onMouseEnter={() =>
                          draggingComponent && setHoveredPin(pin.id)
                        }
                        onMouseLeave={() => setHoveredPin(null)}
                        onClick={() => handlePinClick(pin.id)}
                      >
                        {/* Component indicator */}
                        <AnimatePresence>
                          {component && (
                            <motion.div
                              initial={{ scale: 0, x: 20 }}
                              animate={{ scale: 1, x: 0 }}
                              exit={{ scale: 0, x: 20 }}
                              className={cn(
                                "absolute -left-8 flex h-6 w-6 items-center justify-center rounded-md",
                                component.bgColor
                              )}
                            >
                              {Icon && <Icon className={cn("h-4 w-4", component.color)} />}
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Pin label */}
                        <span
                          className={cn(
                            "w-8 text-right text-[10px] font-mono",
                            pin.type === "power"
                              ? "text-red-400"
                              : pin.type === "gnd"
                                ? "text-gray-400"
                                : "text-green-300"
                          )}
                        >
                          {pin.label}
                        </span>

                        {/* Pin dot */}
                        <motion.div
                          animate={isHovered ? { scale: 1.5 } : { scale: 1 }}
                          className={cn(
                            "ml-1 h-2.5 w-2.5 rounded-full border transition-colors",
                            pin.type === "power"
                              ? "border-red-500 bg-red-500/50"
                              : pin.type === "gnd"
                                ? "border-gray-500 bg-gray-600"
                                : isHovered
                                  ? "border-green-400 bg-green-400"
                                  : component
                                    ? "border-green-400 bg-green-500"
                                    : "border-yellow-600 bg-yellow-600/50"
                          )}
                        />
                      </motion.div>
                    )
                  })}
                </div>

                <div className="absolute right-0 top-12 flex flex-col gap-0.5">
                  {rightPins.map((pin) => {
                    const component = getComponentAtPin(pin.id)
                    const isHovered = hoveredPin === pin.id && pin.type === "gpio"
                    const Icon = component?.icon

                    return (
                      <motion.div
                        key={pin.id}
                        className={cn(
                          "relative -right-8 flex h-5 cursor-pointer items-center justify-end",
                          draggingComponent && pin.type === "gpio" && "cursor-copy"
                        )}
                        onMouseEnter={() =>
                          draggingComponent && setHoveredPin(pin.id)
                        }
                        onMouseLeave={() => setHoveredPin(null)}
                        onClick={() => handlePinClick(pin.id)}
                      >
                        {/* Pin dot */}
                        <motion.div
                          animate={isHovered ? { scale: 1.5 } : { scale: 1 }}
                          className={cn(
                            "mr-1 h-2.5 w-2.5 rounded-full border transition-colors",
                            pin.type === "power"
                              ? "border-red-500 bg-red-500/50"
                              : pin.type === "gnd"
                                ? "border-gray-500 bg-gray-600"
                                : isHovered
                                  ? "border-green-400 bg-green-400"
                                  : component
                                    ? "border-green-400 bg-green-500"
                                    : "border-yellow-600 bg-yellow-600/50"
                          )}
                        />

                        {/* Pin label */}
                        <span
                          className={cn(
                            "w-8 text-left text-[10px] font-mono",
                            pin.type === "power"
                              ? "text-red-400"
                              : pin.type === "gnd"
                                ? "text-gray-400"
                                : "text-green-300"
                          )}
                        >
                          {pin.label}
                        </span>

                        {/* Component indicator */}
                        <AnimatePresence>
                          {component && (
                            <motion.div
                              initial={{ scale: 0, x: -20 }}
                              animate={{ scale: 1, x: 0 }}
                              exit={{ scale: 0, x: -20 }}
                              className={cn(
                                "absolute -right-8 flex h-6 w-6 items-center justify-center rounded-md",
                                component.bgColor
                              )}
                            >
                              {Icon && <Icon className={cn("h-4 w-4", component.color)} />}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    )
                  })}
                </div>
              </div>

              {/* Legend */}
              <div className="mt-8 flex justify-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-yellow-600/50 ring-1 ring-yellow-600" />
                  <span className="text-xs text-muted-foreground">GPIO</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-500/50 ring-1 ring-red-500" />
                  <span className="text-xs text-muted-foreground">Power</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-gray-600 ring-1 ring-gray-500" />
                  <span className="text-xs text-muted-foreground">Ground</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Components Panel & Challenge */}
        <div className="space-y-6">
          {/* Explanation */}
          {showExplanation && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="border-border/50 bg-card/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Key Parts</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-500/20">
                      <Zap className="h-4 w-4 text-red-400" />
                    </div>
                    <div>
                      <p className="font-medium">Power Pins</p>
                      <p className="text-xs text-muted-foreground">
                        3.3V and VIN provide power to the board
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-500/20">
                      <CircleDot className="h-4 w-4 text-green-400" />
                    </div>
                    <div>
                      <p className="font-medium">GPIO Pins</p>
                      <p className="text-xs text-muted-foreground">
                        General Purpose Input/Output — connect sensors and actuators here
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-500/20">
                      <Wifi className="h-4 w-4 text-cyan-400" />
                    </div>
                    <div>
                      <p className="font-medium">WiFi Antenna</p>
                      <p className="text-xs text-muted-foreground">
                        Built-in wireless connectivity
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Components to drag */}
          <Card className="border-border/50 bg-card/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Components</CardTitle>
              <CardDescription className="text-xs">
                Click a component, then click a GPIO pin to place it.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {components.map((comp) => {
                const Icon = comp.icon
                const isPlaced = isComponentPlaced(comp.id)
                const isSelected = draggingComponent === comp.id

                return (
                  <motion.button
                    key={comp.id}
                    onClick={() =>
                      setDraggingComponent(isSelected ? null : comp.id)
                    }
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg border-2 p-3 transition-all",
                      isSelected
                        ? "border-primary bg-primary/10"
                        : isPlaced
                          ? "border-green-500/50 bg-green-500/10"
                          : "border-border/50 bg-muted/20 hover:border-border"
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-lg",
                        comp.bgColor
                      )}
                    >
                      <Icon className={cn("h-5 w-5", comp.color)} />
                    </div>
                    <div className="text-left">
                      <p className="font-medium">{comp.label}</p>
                      <p className="text-xs text-muted-foreground">
                        {isPlaced
                          ? `Placed on GPIO${
                              allPins.find(
                                (p) => placedComponents[p.id] === comp.id
                              )?.gpioNum ?? ""
                            }`
                          : isSelected
                            ? "Click a GPIO pin"
                            : "Click to select"}
                      </p>
                    </div>
                    {isPlaced && (
                      <CheckCircle2 className="ml-auto h-4 w-4 text-green-500" />
                    )}
                  </motion.button>
                )
              })}
            </CardContent>
          </Card>

          {/* Challenge */}
          <Card className="border-border/50 bg-card/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500/20 text-xs font-bold text-amber-400">
                    ?
                  </span>
                  Challenge
                </CardTitle>
                {challengeComplete && (
                  <Badge className="bg-green-500/20 text-green-400">
                    <CheckCircle2 className="mr-1 h-3 w-3" /> Complete!
                  </Badge>
                )}
              </div>
              <CardDescription className="text-xs">
                Wire up a button on GPIO4 and an LED on GPIO5.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4 space-y-2">
                <div
                  className={cn(
                    "flex items-center justify-between rounded-lg border px-3 py-2 text-sm",
                    placedComponents["gpio4"] === "button"
                      ? "border-green-500/50 bg-green-500/10 text-green-400"
                      : "border-border/50 text-muted-foreground"
                  )}
                >
                  <span>Button → GPIO4</span>
                  {placedComponents["gpio4"] === "button" && (
                    <CheckCircle2 className="h-4 w-4" />
                  )}
                </div>
                <div
                  className={cn(
                    "flex items-center justify-between rounded-lg border px-3 py-2 text-sm",
                    placedComponents["gpio5"] === "led"
                      ? "border-green-500/50 bg-green-500/10 text-green-400"
                      : "border-border/50 text-muted-foreground"
                  )}
                >
                  <span>LED → GPIO5</span>
                  {placedComponents["gpio5"] === "led" && (
                    <CheckCircle2 className="h-4 w-4" />
                  )}
                </div>
              </div>

              <Button
                onClick={checkChallenge}
                disabled={
                  !Object.values(placedComponents).includes("button") ||
                  !Object.values(placedComponents).includes("led")
                }
                className="w-full"
              >
                Check Wiring
              </Button>

              {challengeComplete && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4"
                >
                  <Button asChild className="w-full" variant="outline">
                    <Link to="/level/1.3">
                      Continue to Level 1.3
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
