import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  CheckCircle2,
  ChevronRight,
  ChevronDown,
  Code2,
  Wifi,
  CircleDot,
  Lightbulb,
  Zap,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useProgressStore } from "@/stores/progressStore"
import { Link } from "react-router-dom"

interface ConfigSection {
  id: string
  title: string
  description: string
  icon: React.ElementType
  iconColor: string
  iconBg: string
  yaml: string[]
}

const configSections: ConfigSection[] = [
  {
    id: "device",
    title: "Device Name",
    description: "Identifies your device on the network",
    icon: Code2,
    iconColor: "text-blue-400",
    iconBg: "bg-blue-500/20",
    yaml: [
      "esphome:",
      '  name: "my-esp-device"',
      '  friendly_name: "My ESP Device"',
    ],
  },
  {
    id: "wifi",
    title: "WiFi",
    description: "Network credentials so the device can connect",
    icon: Wifi,
    iconColor: "text-cyan-400",
    iconBg: "bg-cyan-500/20",
    yaml: [
      "wifi:",
      '  ssid: "MyHomeNetwork"',
      '  password: "supersecret"',
      "  ap:",
      '    ssid: "Fallback Hotspot"',
    ],
  },
  {
    id: "button",
    title: "Button",
    description: "A physical push button connected to GPIO4",
    icon: CircleDot,
    iconColor: "text-purple-400",
    iconBg: "bg-purple-500/20",
    yaml: [
      "binary_sensor:",
      "  - platform: gpio",
      "    pin: GPIO4",
      '    name: "My Button"',
      "    on_press:",
      "      then:",
      "        - light.turn_on: my_light",
    ],
  },
  {
    id: "light",
    title: "Light & Automation",
    description: "An LED output and the automation that controls it",
    icon: Lightbulb,
    iconColor: "text-amber-400",
    iconBg: "bg-amber-500/20",
    yaml: [
      "light:",
      "  - platform: binary",
      '    name: "My Light"',
      "    id: my_light",
      "    output: light_output",
      "",
      "output:",
      "  - platform: gpio",
      "    pin: GPIO5",
      "    id: light_output",
    ],
  },
  {
    id: "automation",
    title: "Advanced Automation",
    description: "Toggle behavior with a 5-second auto-off",
    icon: Zap,
    iconColor: "text-green-400",
    iconBg: "bg-green-500/20",
    yaml: [
      "# on_press automation (inside binary_sensor):",
      "    on_press:",
      "      then:",
      "        - light.toggle: my_light",
      "        - delay: 5s",
      "        - light.turn_off: my_light",
    ],
  },
]

const getLineColor = (line: string) => {
  if (line.startsWith("#")) return "text-gray-500 italic"
  if (line.includes("esphome:") || line.includes("wifi:") || line.includes("binary_sensor:") || line.includes("light:") || line.includes("output:")) return "text-blue-400"
  if (line.includes("name:") || line.includes("friendly_name:")) return "text-purple-400"
  if (line.includes("ssid:") || line.includes("password:") || line.includes("ap:")) return "text-cyan-400"
  if (line.includes("platform:")) return "text-cyan-400"
  if (line.includes("pin:")) return "text-green-400"
  if (line.includes("on_press:") || line.includes("then:")) return "text-orange-400"
  if (line.includes("light.turn_") || line.includes("light.toggle")) return "text-red-400"
  if (line.includes("delay:")) return "text-amber-400"
  if (line.includes("id:") || line.includes("output:")) return "text-pink-400"
  return "text-foreground"
}

export function Level2_4() {
  const [openSections, setOpenSections] = useState<Set<string>>(new Set())
  const [levelComplete, setLevelComplete] = useState(false)

  const { completeLevel, completedLevels } = useProgressStore()
  const isCompleted = completedLevels.includes("2.4")

  const toggleSection = (id: string) => {
    const next = new Set(openSections)
    if (next.has(id)) {
      next.delete(id)
    } else {
      next.add(id)
    }
    setOpenSections(next)

    if (!levelComplete && next.size === configSections.length) {
      setLevelComplete(true)
      completeLevel("2.4")
    }
  }

  const allOpen = openSections.size === configSections.length

  return (
    <div className="mx-auto max-w-5xl p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="mb-4 flex items-center gap-2">
          <Badge className="bg-blue-500/20 text-blue-400">Phase 2</Badge>
          <Badge variant="outline">Level 2.4</Badge>
          {isCompleted && (
            <Badge className="bg-green-500/20 text-green-400">
              <CheckCircle2 className="mr-1 h-3 w-3" /> Completed
            </Badge>
          )}
        </div>
        <h1 className="mb-2 text-3xl font-bold">Reading a Complete Config</h1>
        <p className="text-lg text-muted-foreground">
          Explore a full ESPHome configuration section by section.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Sections accordion */}
        <div className="lg:col-span-2 space-y-3">
          {configSections.map((section) => {
            const Icon = section.icon
            const isOpen = openSections.has(section.id)
            const isRead = openSections.has(section.id)

            return (
              <Card
                key={section.id}
                className={cn(
                  "border-border/50 bg-card/50 transition-colors overflow-hidden",
                  isRead && "border-green-500/30"
                )}
              >
                <button
                  onClick={() => toggleSection(section.id)}
                  className="flex w-full items-center gap-4 p-4 text-left"
                >
                  <div
                    className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                      section.iconBg
                    )}
                  >
                    <Icon className={cn("h-5 w-5", section.iconColor)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{section.title}</span>
                      {isRead && (
                        <Badge className="bg-green-500/20 text-green-400 text-xs">
                          <CheckCircle2 className="mr-1 h-2.5 w-2.5" /> Read
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {section.description}
                    </p>
                  </div>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="border-t border-border/50 bg-gray-100 dark:bg-gray-950 px-4 py-3">
                        <pre className="font-mono text-sm">
                          {section.yaml.map((line, i) => (
                            <div key={i} className="leading-6">
                              <span className="mr-4 inline-block w-5 text-right text-muted-foreground/40 text-xs">
                                {i + 1}
                              </span>
                              <span className={getLineColor(line)}>
                                {line || "\u00A0"}
                              </span>
                            </div>
                          ))}
                        </pre>
                      </div>
                      <div className="px-4 pb-4 pt-3">
                        <p className="text-xs text-muted-foreground">
                          {section.description}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            )
          })}
        </div>

        {/* Checklist sidebar */}
        <div className="space-y-4">
          <Card className="border-border/50 bg-card/50 sticky top-4">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Reading Checklist</CardTitle>
              <CardDescription className="text-xs">
                Open every section to complete the level
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {configSections.map((section) => {
                const Icon = section.icon
                const isRead = openSections.has(section.id)
                return (
                  <div
                    key={section.id}
                    className={cn(
                      "flex items-center gap-3 rounded-lg p-2 transition-colors",
                      isRead ? "bg-green-500/5" : "bg-muted/20"
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-7 w-7 shrink-0 items-center justify-center rounded-md",
                        isRead ? "bg-green-500/20" : section.iconBg
                      )}
                    >
                      {isRead ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      ) : (
                        <Icon className={cn("h-3.5 w-3.5", section.iconColor)} />
                      )}
                    </div>
                    <span
                      className={cn(
                        "text-xs font-medium",
                        isRead ? "text-green-400" : "text-muted-foreground"
                      )}
                    >
                      {section.title}
                    </span>
                  </div>
                )
              })}

              <div className="mt-4 rounded-lg border border-border/50 bg-muted/20 p-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">
                    {openSections.size} / {configSections.length}
                  </span>
                </div>
                <div className="mt-2 h-1.5 w-full rounded-full bg-border/50">
                  <motion.div
                    className="h-full rounded-full bg-green-500"
                    animate={{ width: `${(openSections.size / configSections.length) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>

              <AnimatePresence>
                {allOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Button asChild className="w-full">
                      <Link to="/app/level/3.1">
                        Continue to Phase 3
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
