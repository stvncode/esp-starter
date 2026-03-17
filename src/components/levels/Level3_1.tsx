import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  CheckCircle2,
  ChevronRight,
  Code2,
  Pencil,
  Sparkles,
  AlertCircle,
  Lightbulb,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useProgressStore } from "@/stores/progressStore"
import { Link } from "react-router-dom"

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

export function Level3_1() {
  const [yaml, setYaml] = useState(initialYaml)
  const [buttonName, setButtonName] = useState("My Button")
  const [lightName, setLightName] = useState("My Light")
  const [buttonNameValid, setButtonNameValid] = useState(false)
  const [lightNameValid, setLightNameValid] = useState(false)
  const [showHint, setShowHint] = useState<string | null>(null)
  const [challengeComplete, setChallengeComplete] = useState(false)

  const { completeLevel, completedLevels } = useProgressStore()
  const isCompleted = completedLevels.includes("3.1")

  // Validate names
  useEffect(() => {
    const buttonValid = buttonName.length >= 3 && buttonName !== "My Button"
    const lightValid = lightName.length >= 3 && lightName !== "My Light"
    setButtonNameValid(buttonValid)
    setLightNameValid(lightValid)

    if (buttonValid && lightValid && !challengeComplete) {
      setChallengeComplete(true)
      completeLevel("3.1")
    }
  }, [buttonName, lightName, challengeComplete, completeLevel])

  // Update YAML when names change
  useEffect(() => {
    let newYaml = initialYaml
    newYaml = newYaml.replace('name: "My Button"', `name: "${buttonName}"`)
    newYaml = newYaml.replace('name: "My Light"', `name: "${lightName}"`)
    setYaml(newYaml)
  }, [buttonName, lightName])

  const getLineHighlight = (lineIndex: number) => {
    if (lineIndex === 3) return buttonNameValid ? "bg-green-500/10" : "bg-blue-500/10"
    if (lineIndex === 10) return lightNameValid ? "bg-green-500/10" : "bg-amber-500/10"
    return ""
  }

  return (
    <div className="mx-auto max-w-5xl p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="mb-4 flex items-center gap-2">
          <Badge className="bg-green-500/20 text-green-400">Phase 3</Badge>
          <Badge variant="outline">Level 3.1</Badge>
          {isCompleted && (
            <Badge className="bg-green-500/20 text-green-400">
              <CheckCircle2 className="mr-1 h-3 w-3" /> Completed
            </Badge>
          )}
        </div>
        <h1 className="mb-2 text-3xl font-bold">Change the Names</h1>
        <p className="text-lg text-muted-foreground">
          Your first edit! Change the default names to something meaningful.
        </p>
      </div>

      {/* Tip */}
      <Card className="mb-6 border-blue-500/30 bg-blue-500/5">
        <CardContent className="flex items-start gap-4 py-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-500/20">
            <Lightbulb className="h-5 w-5 text-blue-400" />
          </div>
          <div>
            <p className="font-medium text-foreground">Safe to change</p>
            <p className="text-sm text-muted-foreground">
              Names are just labels for humans — they can be anything you want! They show up in Home Assistant 
              and help you identify your devices.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Editor Panel */}
        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Pencil className="h-4 w-4 text-green-400" />
              <CardTitle className="text-lg">Edit Names</CardTitle>
            </div>
            <CardDescription>
              Change these default names to something descriptive
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Button Name Input */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Button Name</label>
                {buttonNameValid ? (
                  <Badge className="bg-green-500/20 text-green-400">
                    <CheckCircle2 className="mr-1 h-3 w-3" /> Valid
                  </Badge>
                ) : (
                  <button
                    onClick={() => setShowHint(showHint === "button" ? null : "button")}
                    className="text-xs text-muted-foreground hover:text-foreground"
                  >
                    Need a hint?
                  </button>
                )}
              </div>
              <Input
                value={buttonName}
                onChange={(e) => setButtonName(e.target.value)}
                placeholder="Enter a name for your button"
                className={cn(
                  "font-mono",
                  buttonNameValid
                    ? "border-green-500/50 focus-visible:ring-green-500"
                    : buttonName === "My Button"
                      ? ""
                      : "border-amber-500/50"
                )}
              />
              <AnimatePresence>
                {showHint === "button" && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-xs text-muted-foreground"
                  >
                    Try something like "Front Door Button" or "Desk Button"
                  </motion.p>
                )}
              </AnimatePresence>
              {buttonName.length > 0 && buttonName.length < 3 && (
                <p className="flex items-center gap-1 text-xs text-amber-500">
                  <AlertCircle className="h-3 w-3" />
                  Name must be at least 3 characters
                </p>
              )}
            </div>

            {/* Light Name Input */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Light Name</label>
                {lightNameValid ? (
                  <Badge className="bg-green-500/20 text-green-400">
                    <CheckCircle2 className="mr-1 h-3 w-3" /> Valid
                  </Badge>
                ) : (
                  <button
                    onClick={() => setShowHint(showHint === "light" ? null : "light")}
                    className="text-xs text-muted-foreground hover:text-foreground"
                  >
                    Need a hint?
                  </button>
                )}
              </div>
              <Input
                value={lightName}
                onChange={(e) => setLightName(e.target.value)}
                placeholder="Enter a name for your light"
                className={cn(
                  "font-mono",
                  lightNameValid
                    ? "border-green-500/50 focus-visible:ring-green-500"
                    : lightName === "My Light"
                      ? ""
                      : "border-amber-500/50"
                )}
              />
              <AnimatePresence>
                {showHint === "light" && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-xs text-muted-foreground"
                  >
                    Try something like "Living Room Light" or "Status LED"
                  </motion.p>
                )}
              </AnimatePresence>
              {lightName.length > 0 && lightName.length < 3 && (
                <p className="flex items-center gap-1 text-xs text-amber-500">
                  <AlertCircle className="h-3 w-3" />
                  Name must be at least 3 characters
                </p>
              )}
            </div>

            {/* Challenge Status */}
            <div className="rounded-lg border border-border/50 bg-muted/20 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-amber-400" />
                  <span className="text-sm font-medium">Challenge</span>
                </div>
                {challengeComplete && (
                  <Badge className="bg-green-500/20 text-green-400">
                    Complete!
                  </Badge>
                )}
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Rename both the button and the light to something meaningful
                (at least 3 characters, different from defaults)
              </p>
            </div>

            {challengeComplete && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Button asChild className="w-full">
                  <Link to="/app/level/3.2">
                    Continue to Level 3.2
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </motion.div>
            )}
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
              Watch your changes update in real-time
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
                        line.includes("light:") && "text-amber-400",
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

            {/* Legend */}
            <div className="mt-4 flex flex-wrap gap-3 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full bg-blue-400" />
                <span className="text-muted-foreground">Highlighted = editable</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full bg-green-400" />
                <span className="text-muted-foreground">Green = valid change</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
