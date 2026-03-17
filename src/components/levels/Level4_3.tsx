import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  CheckCircle2,
  ChevronRight,
  Code2,
  Zap,
  Lightbulb,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useProgressStore } from "@/stores/progressStore"
import { Link } from "react-router-dom"

const BASE_YAML = `esphome:
  name: my-esp-device

esp32:
  board: esp32dev

wifi:
  ssid: "MyNetwork"
  password: "secret"

binary_sensor:
  - platform: gpio
    pin: GPIO4
    name: "My Button"
    # automation goes here

light:
  - platform: binary
    name: "My Light"
    id: my_light
    output: light_output

output:
  - platform: gpio
    pin: GPIO5
    id: light_output`

const getLineColor = (line: string) => {
  if (line.startsWith("  #")) return "text-gray-500 italic"
  if (line.startsWith("esphome:") || line.startsWith("binary_sensor:")) return "text-blue-400"
  if (line.includes("name:")) return "text-purple-400"
  if (line.includes("esp32:") || line.includes("board:") || line.includes("wifi:") || line.includes("ssid:") || line.includes("password:")) return "text-cyan-400"
  if (line.includes("platform:")) return "text-cyan-400"
  if (line.includes("pin:")) return "text-green-400"
  if (line.includes("on_press:") || line.includes("on_release:") || line.includes("then:")) return "text-orange-400"
  if (line.includes("light.turn_") || line.includes("light.toggle")) return "text-red-400"
  if (line.startsWith("light:") || (line.includes("light:") && !line.includes("light."))) return "text-amber-400"
  if (line.includes("output:")) return "text-green-400"
  if (line.includes("id:")) return "text-pink-400"
  return "text-foreground"
}

export function Level4_3() {
  const [trigger, setTrigger] = useState<string>("")
  const [action, setAction] = useState<string>("")
  const [generated, setGenerated] = useState(false)

  const { completeLevel, completedLevels } = useProgressStore()
  const isCompleted = completedLevels.includes("4.3")

  const canGenerate = trigger !== "" && action !== ""

  const handleGenerate = () => {
    if (!canGenerate) return
    setGenerated(true)
    completeLevel("4.3")
  }

  const automationLines = trigger && action
    ? [
        `    ${trigger}:`,
        `      then:`,
        `        - ${action}: my_light`,
      ]
    : []

  const fullYaml = BASE_YAML.replace(
    "    # automation goes here",
    automationLines.length > 0 ? automationLines.join("\n") : "    # automation goes here"
  )

  return (
    <div className="mx-auto max-w-5xl p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="mb-4 flex items-center gap-2">
          <Badge className="bg-purple-500/20 text-purple-400">Phase 4</Badge>
          <Badge variant="outline">Level 4.3</Badge>
          {isCompleted && (
            <Badge className="bg-green-500/20 text-green-400">
              <CheckCircle2 className="mr-1 h-3 w-3" /> Completed
            </Badge>
          )}
        </div>
        <h1 className="mb-2 text-3xl font-bold">Create an Automation</h1>
        <p className="text-lg text-muted-foreground">
          A button and a light are defined — now connect them with an automation.
        </p>
      </div>

      {/* Info card */}
      <Card className="mb-6 border-purple-500/30 bg-purple-500/5">
        <CardContent className="flex items-start gap-4 py-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-500/20">
            <Zap className="h-5 w-5 text-purple-400" />
          </div>
          <div>
            <p className="font-medium text-foreground">Building automations</p>
            <p className="text-sm text-muted-foreground">
              An automation has two parts: a <strong>trigger</strong> (what event starts it) and an{" "}
              <strong>action</strong> (what happens). Pick both below to generate the YAML.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Builder panel */}
        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-purple-400" />
              <CardTitle className="text-lg">Automation Builder</CardTitle>
            </div>
            <CardDescription>Pick a trigger and action, then generate</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Step 1 */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className={cn(
                  "flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold",
                  trigger ? "bg-purple-500/20 text-purple-400" : "bg-muted text-muted-foreground"
                )}>
                  1
                </div>
                <p className="text-sm font-medium">Pick a trigger</p>
                {trigger && <CheckCircle2 className="h-4 w-4 text-green-500" />}
              </div>
              <div className="grid grid-cols-2 gap-2">
                {["on_press", "on_release"].map((t) => (
                  <button
                    key={t}
                    onClick={() => setTrigger(t)}
                    disabled={generated}
                    className={cn(
                      "rounded-lg border-2 p-3 text-left transition-all",
                      trigger === t
                        ? "border-purple-500 bg-purple-500/10 text-purple-300"
                        : "border-border/50 hover:border-border hover:bg-muted/50 text-sm"
                    )}
                  >
                    <code className="font-mono text-xs">{t}</code>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {t === "on_press" ? "Fires when button is pressed down" : "Fires when button is released"}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2 */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className={cn(
                  "flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold",
                  action ? "bg-purple-500/20 text-purple-400" : "bg-muted text-muted-foreground"
                )}>
                  2
                </div>
                <p className="text-sm font-medium">Pick an action</p>
                {action && <CheckCircle2 className="h-4 w-4 text-green-500" />}
              </div>
              <div className="space-y-2">
                {[
                  { value: "light.turn_on", label: "Turn on the light" },
                  { value: "light.toggle", label: "Toggle (on if off, off if on)" },
                  { value: "light.turn_off", label: "Turn off the light" },
                ].map((a) => (
                  <button
                    key={a.value}
                    onClick={() => setAction(a.value)}
                    disabled={generated}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg border-2 p-3 text-left transition-all",
                      action === a.value
                        ? "border-purple-500 bg-purple-500/10"
                        : "border-border/50 hover:border-border hover:bg-muted/50"
                    )}
                  >
                    <code className="font-mono text-xs text-red-400 w-32 shrink-0">{a.value}</code>
                    <span className="text-xs text-muted-foreground">{a.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3 */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className={cn(
                  "flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold",
                  generated ? "bg-green-500/20 text-green-400" : "bg-muted text-muted-foreground"
                )}>
                  3
                </div>
                <p className="text-sm font-medium">Generate</p>
                {generated && <CheckCircle2 className="h-4 w-4 text-green-500" />}
              </div>
              {!generated && (
                <Button
                  onClick={handleGenerate}
                  disabled={!canGenerate}
                  className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-40"
                >
                  <Zap className="mr-2 h-4 w-4" />
                  Generate Automation
                </Button>
              )}
            </div>

            <AnimatePresence>
              {generated && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3"
                >
                  <div className="rounded-lg border border-green-500/30 bg-green-500/5 p-4 flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-green-400">Automation created!</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        The button now triggers <code className="font-mono">{action}</code> on{" "}
                        <code className="font-mono">{trigger}</code>.
                      </p>
                    </div>
                  </div>
                  <Button asChild className="w-full">
                    <Link to="/app/level/4.4">
                      Continue to Level 4.4
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>

        {/* YAML Preview */}
        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Code2 className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-lg">Live Preview</CardTitle>
            </div>
            <CardDescription>
              The automation YAML updates as you make selections
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-border/50 bg-gray-100 dark:bg-gray-950 p-4 overflow-auto max-h-[520px]">
              <pre className="font-mono text-sm">
                {fullYaml.split("\n").map((line, index) => {
                  const isAutomationLine =
                    line.includes("on_press:") ||
                    line.includes("on_release:") ||
                    (line.includes("then:") && !line.includes("#")) ||
                    (line.includes("- light.") && !line.includes("#"))
                  return (
                    <div
                      key={index}
                      className={cn(
                        "px-2 -mx-2 rounded leading-6 transition-colors",
                        isAutomationLine && trigger && action && "bg-purple-500/10"
                      )}
                    >
                      <span className="mr-4 inline-block w-6 text-right text-muted-foreground/50">
                        {index + 1}
                      </span>
                      <span className={getLineColor(line)}>{line || "\u00A0"}</span>
                    </div>
                  )
                })}
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
