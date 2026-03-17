import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  CheckCircle2,
  ChevronRight,
  Code2,
  Pencil,
  AlertCircle,
  Lightbulb,
  Sparkles,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useProgressStore } from "@/stores/progressStore"
import { Link } from "react-router-dom"

const TARGET_BUTTON_PIN = "GPIO14"
const TARGET_LIGHT_PIN = "GPIO2"

const initialYaml = `binary_sensor:
  - platform: gpio
    pin: GPIO4
    name: "My Button"
    on_press:
      then:
        - light.turn_on: my_light

light:
  - platform: binary
    name: "My Light"
    id: my_light
    output: light_output

output:
  - platform: gpio
    pin: GPIO5
    id: light_output`

type EditField = "button_pin" | "light_pin"

export function Level3_2() {
  const [buttonPin, setButtonPin] = useState("GPIO4")
  const [lightPin, setLightPin] = useState("GPIO5")
  const [yaml, setYaml] = useState(initialYaml)
  const [editingField, setEditingField] = useState<EditField | null>(null)
  const [buttonPinValid, setButtonPinValid] = useState(false)
  const [lightPinValid, setLightPinValid] = useState(false)
  const [challengeComplete, setChallengeComplete] = useState(false)

  const { completeLevel, completedLevels } = useProgressStore()
  const isCompleted = completedLevels.includes("3.2")

  useEffect(() => {
    const bValid = buttonPin === TARGET_BUTTON_PIN
    const lValid = lightPin === TARGET_LIGHT_PIN
    setButtonPinValid(bValid)
    setLightPinValid(lValid)

    if (bValid && lValid && !challengeComplete) {
      setChallengeComplete(true)
      completeLevel("3.2")
    }
  }, [buttonPin, lightPin, challengeComplete, completeLevel])

  useEffect(() => {
    let newYaml = initialYaml
    newYaml = newYaml.replace("    pin: GPIO4\n", `    pin: ${buttonPin}\n`)
    newYaml = newYaml.replace("    pin: GPIO5\n", `    pin: ${lightPin}\n`)
    setYaml(newYaml)
  }, [buttonPin, lightPin])

  const getLineHighlight = (lineIndex: number) => {
    if (lineIndex === 2) return buttonPinValid ? "bg-green-500/10" : editingField === "button_pin" ? "bg-blue-500/10" : ""
    if (lineIndex === 16) return lightPinValid ? "bg-green-500/10" : editingField === "light_pin" ? "bg-blue-500/10" : ""
    return ""
  }

  return (
    <div className="mx-auto max-w-5xl p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="mb-4 flex items-center gap-2">
          <Badge className="bg-green-500/20 text-green-400">Phase 3</Badge>
          <Badge variant="outline">Level 3.2</Badge>
          {isCompleted && (
            <Badge className="bg-green-500/20 text-green-400">
              <CheckCircle2 className="mr-1 h-3 w-3" /> Completed
            </Badge>
          )}
        </div>
        <h1 className="mb-2 text-3xl font-bold">Change the Pins</h1>
        <p className="text-lg text-muted-foreground">
          Reassign the hardware connections by updating the GPIO pin numbers.
        </p>
      </div>

      {/* Tip */}
      <Card className="mb-6 border-green-500/30 bg-green-500/5">
        <CardContent className="flex items-start gap-4 py-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-500/20">
            <Lightbulb className="h-5 w-5 text-green-400" />
          </div>
          <div>
            <p className="font-medium text-foreground">What are GPIO pins?</p>
            <p className="text-sm text-muted-foreground">
              GPIO (General Purpose Input/Output) pins are the physical connectors on your ESP board.
              Changing the pin number in the config tells ESPHome to use a different physical connection.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Task card */}
      <Card className="mb-6 border-amber-500/30 bg-amber-500/5">
        <CardContent className="py-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />
            <div>
              <p className="font-medium">Your task:</p>
              <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                <li className={cn("flex items-center gap-2", buttonPinValid && "line-through text-green-400")}>
                  {buttonPinValid ? <CheckCircle2 className="h-3.5 w-3.5 text-green-500" /> : <span className="h-3.5 w-3.5" />}
                  Change the button pin from GPIO4 to <code className="rounded bg-muted px-1 font-mono text-xs">GPIO14</code>
                </li>
                <li className={cn("flex items-center gap-2", lightPinValid && "line-through text-green-400")}>
                  {lightPinValid ? <CheckCircle2 className="h-3.5 w-3.5 text-green-500" /> : <span className="h-3.5 w-3.5" />}
                  Change the light output pin from GPIO5 to <code className="rounded bg-muted px-1 font-mono text-xs">GPIO2</code>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Edit Panel */}
        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Pencil className="h-4 w-4 text-green-400" />
              <CardTitle className="text-lg">Edit Pins</CardTitle>
            </div>
            <CardDescription>
              Update the pin assignments below
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Button Pin */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Button Pin</label>
                {buttonPinValid ? (
                  <Badge className="bg-green-500/20 text-green-400">
                    <CheckCircle2 className="mr-1 h-3 w-3" /> Correct
                  </Badge>
                ) : (
                  <span className="text-xs text-muted-foreground">
                    Target: <code className="font-mono">GPIO14</code>
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm text-muted-foreground">pin:</span>
                <input
                  value={buttonPin}
                  onChange={(e) => setButtonPin(e.target.value.trim())}
                  onFocus={() => setEditingField("button_pin")}
                  onBlur={() => setEditingField(null)}
                  placeholder="GPIO4"
                  className={cn(
                    "flex-1 rounded-md border bg-background px-3 py-2 font-mono text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    buttonPinValid
                      ? "border-green-500/50 focus-visible:ring-green-500"
                      : buttonPin !== "GPIO4" && buttonPin !== ""
                        ? "border-amber-500/50"
                        : "border-input"
                  )}
                />
              </div>
              {!buttonPinValid && buttonPin !== "GPIO4" && buttonPin !== "" && (
                <p className="flex items-center gap-1 text-xs text-amber-500">
                  <AlertCircle className="h-3 w-3" />
                  Not quite — the target is GPIO14
                </p>
              )}
            </div>

            {/* Light Pin */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Light Output Pin</label>
                {lightPinValid ? (
                  <Badge className="bg-green-500/20 text-green-400">
                    <CheckCircle2 className="mr-1 h-3 w-3" /> Correct
                  </Badge>
                ) : (
                  <span className="text-xs text-muted-foreground">
                    Target: <code className="font-mono">GPIO2</code>
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm text-muted-foreground">pin:</span>
                <input
                  value={lightPin}
                  onChange={(e) => setLightPin(e.target.value.trim())}
                  onFocus={() => setEditingField("light_pin")}
                  onBlur={() => setEditingField(null)}
                  placeholder="GPIO5"
                  className={cn(
                    "flex-1 rounded-md border bg-background px-3 py-2 font-mono text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    lightPinValid
                      ? "border-green-500/50 focus-visible:ring-green-500"
                      : lightPin !== "GPIO5" && lightPin !== ""
                        ? "border-amber-500/50"
                        : "border-input"
                  )}
                />
              </div>
              {!lightPinValid && lightPin !== "GPIO5" && lightPin !== "" && (
                <p className="flex items-center gap-1 text-xs text-amber-500">
                  <AlertCircle className="h-3 w-3" />
                  Not quite — the target is GPIO2
                </p>
              )}
            </div>

            {/* Status */}
            <div className="rounded-lg border border-border/50 bg-muted/20 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-amber-400" />
                  <span className="text-sm font-medium">Challenge</span>
                </div>
                {challengeComplete && (
                  <Badge className="bg-green-500/20 text-green-400">Complete!</Badge>
                )}
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Set button to GPIO14 and light output to GPIO2
              </p>
            </div>

            <AnimatePresence>
              {challengeComplete && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Button asChild className="w-full">
                    <Link to="/app/level/3.3">
                      Continue to Level 3.3
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
              Watch pin changes update in real-time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-border/50 bg-gray-100 dark:bg-gray-950 p-4 overflow-auto max-h-[500px]">
              <pre className="font-mono text-sm">
                {yaml.split("\n").map((line, index) => (
                  <div
                    key={index}
                    className={cn(
                      "px-2 -mx-2 rounded transition-colors",
                      getLineHighlight(index)
                    )}
                  >
                    <span className="mr-4 inline-block w-6 text-right text-muted-foreground/50">
                      {index + 1}
                    </span>
                    <span
                      className={cn(
                        line.includes("name:") && "text-purple-400",
                        line.includes("binary_sensor:") && "text-blue-400",
                        line.includes("light:") && !line.includes("light.") && "text-amber-400",
                        line.includes("output:") && "text-green-400",
                        line.includes("platform:") && "text-cyan-400",
                        line.includes("pin:") && "text-green-400",
                        line.includes("on_press:") && "text-orange-400",
                        line.includes("then:") && "text-orange-400",
                        line.includes("light.turn_on") && "text-red-400",
                        line.includes("id:") && "text-pink-400"
                      )}
                    >
                      {line}
                    </span>
                  </div>
                ))}
              </pre>
            </div>
            <div className="mt-4 flex flex-wrap gap-3 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full bg-blue-400" />
                <span className="text-muted-foreground">Blue = currently editing</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full bg-green-400" />
                <span className="text-muted-foreground">Green = correct value</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
