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
  ToggleLeft,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useProgressStore } from "@/stores/progressStore"
import { Link } from "react-router-dom"

const ORIGINAL_ACTION = "light.turn_on"
const TARGET_ACTION = "light.toggle"

const buildYaml = (action: string) => `binary_sensor:
  - platform: gpio
    pin: GPIO4
    name: "My Button"
    on_press:
      then:
        - ${action}: my_light

light:
  - platform: binary
    name: "My Light"
    id: my_light
    output: light_output

output:
  - platform: gpio
    pin: GPIO5
    id: light_output`

export function Level3_3() {
  const [actionValue, setActionValue] = useState(ORIGINAL_ACTION)
  const [yaml, setYaml] = useState(buildYaml(ORIGINAL_ACTION))
  const [isValid, setIsValid] = useState(false)
  const [challengeComplete, setChallengeComplete] = useState(false)

  const { completeLevel, completedLevels } = useProgressStore()
  const isCompleted = completedLevels.includes("3.3")

  useEffect(() => {
    const trimmed = actionValue.trim()
    const valid = trimmed === TARGET_ACTION
    setIsValid(valid)
    setYaml(buildYaml(trimmed || ORIGINAL_ACTION))

    if (valid && !challengeComplete) {
      setChallengeComplete(true)
      completeLevel("3.3")
    }
  }, [actionValue, challengeComplete, completeLevel])

  const getLineHighlight = (lineIndex: number) => {
    if (lineIndex === 6) {
      if (isValid) return "bg-green-500/10"
      if (actionValue !== ORIGINAL_ACTION) return "bg-amber-500/10"
      return "bg-blue-500/10"
    }
    return ""
  }

  return (
    <div className="mx-auto max-w-5xl p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="mb-4 flex items-center gap-2">
          <Badge className="bg-green-500/20 text-green-400">Phase 3</Badge>
          <Badge variant="outline">Level 3.3</Badge>
          {isCompleted && (
            <Badge className="bg-green-500/20 text-green-400">
              <CheckCircle2 className="mr-1 h-3 w-3" /> Completed
            </Badge>
          )}
        </div>
        <h1 className="mb-2 text-3xl font-bold">Change the Behavior</h1>
        <p className="text-lg text-muted-foreground">
          Switch from always-on to toggle — press once to turn on, press again to turn off.
        </p>
      </div>

      {/* Explanation */}
      <Card className="mb-6 border-green-500/30 bg-green-500/5">
        <CardContent className="flex items-start gap-4 py-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-500/20">
            <ToggleLeft className="h-5 w-5 text-green-400" />
          </div>
          <div>
            <p className="font-medium text-foreground">Toggle vs Turn On</p>
            <p className="text-sm text-muted-foreground">
              <code className="rounded bg-muted px-1 font-mono text-xs">light.turn_on</code> always turns the light on regardless of its current state.{" "}
              <code className="rounded bg-muted px-1 font-mono text-xs">light.toggle</code> flips the state — if it's on, it turns off; if it's off, it turns on.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Hint tip */}
      <Card className="mb-6 border-blue-500/30 bg-blue-500/5">
        <CardContent className="flex items-start gap-4 py-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-500/20">
            <Lightbulb className="h-5 w-5 text-blue-400" />
          </div>
          <div>
            <p className="font-medium text-foreground">Your task</p>
            <p className="text-sm text-muted-foreground">
              Change the action from{" "}
              <code className="rounded bg-muted px-1 font-mono text-xs">light.turn_on</code>{" "}
              to{" "}
              <code className="rounded bg-muted px-1 font-mono text-xs">light.toggle</code>{" "}
              in the editor below.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Edit Panel */}
        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Pencil className="h-4 w-4 text-green-400" />
              <CardTitle className="text-lg">Edit Action</CardTitle>
            </div>
            <CardDescription>
              Change what happens when the button is pressed
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Action input */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Action (inside on_press → then)</label>
                {isValid ? (
                  <Badge className="bg-green-500/20 text-green-400">
                    <CheckCircle2 className="mr-1 h-3 w-3" /> Correct
                  </Badge>
                ) : (
                  <span className="text-xs text-muted-foreground">
                    Target: <code className="font-mono">light.toggle</code>
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 rounded-lg border border-border/50 bg-gray-100 dark:bg-gray-950 p-3 font-mono text-sm">
                <span className="text-muted-foreground">{"- "}</span>
                <input
                  value={actionValue}
                  onChange={(e) => setActionValue(e.target.value)}
                  className={cn(
                    "flex-1 rounded border bg-background px-2 py-1 font-mono text-sm outline-none focus:ring-2",
                    isValid
                      ? "border-green-500/50 focus:ring-green-500/30"
                      : actionValue !== ORIGINAL_ACTION && actionValue !== ""
                        ? "border-amber-500/50 focus:ring-amber-500/30"
                        : "border-input focus:ring-ring"
                  )}
                />
                <span className="text-pink-400">{": my_light"}</span>
              </div>

              {!isValid && actionValue !== ORIGINAL_ACTION && actionValue.length > 0 && (
                <p className="flex items-center gap-1 text-xs text-amber-500">
                  <AlertCircle className="h-3 w-3" />
                  Not quite — try <code className="font-mono">light.toggle</code>
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
                Replace <code className="font-mono">light.turn_on</code> with <code className="font-mono">light.toggle</code>
              </p>
            </div>

            <AnimatePresence>
              {challengeComplete && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Button asChild className="w-full">
                    <Link to="/app/level/3.4">
                      Continue to Level 3.4
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
              See the action update in real-time
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
                        (line.includes("light:") && !line.includes("light.")) && "text-amber-400",
                        line.includes("output:") && "text-green-400",
                        line.includes("platform:") && "text-cyan-400",
                        line.includes("pin:") && "text-green-400",
                        line.includes("on_press:") && "text-orange-400",
                        line.includes("then:") && "text-orange-400",
                        (line.includes("light.turn_on") || line.includes("light.toggle")) && "text-red-400",
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
                <span className="text-muted-foreground">Blue = line being changed</span>
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
