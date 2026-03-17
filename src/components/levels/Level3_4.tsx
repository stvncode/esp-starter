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
  Timer,
  Plus,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useProgressStore } from "@/stores/progressStore"
import { Link } from "react-router-dom"

const buildYaml = (extraLines: string) => {
  const lines = extraLines.trim() ? `        - light.turn_on: my_light\n${extraLines.split("\n").map(l => `        ${l}`).join("\n")}\n        - light.turn_off: my_light` : `        - light.turn_on: my_light\n        - light.turn_off: my_light`
  return `binary_sensor:
  - platform: gpio
    pin: GPIO4
    name: "My Button"
    on_press:
      then:
${lines}

light:
  - platform: binary
    name: "My Light"
    id: my_light
    output: light_output

output:
  - platform: gpio
    pin: GPIO5
    id: light_output`
}

export function Level3_4() {
  const [insertedLine, setInsertedLine] = useState("")
  const [yaml, setYaml] = useState(buildYaml(""))
  const [hasDelay, setHasDelay] = useState(false)
  const [hasTurnOff, setHasTurnOff] = useState(true)
  const [challengeComplete, setChallengeComplete] = useState(false)

  const { completeLevel, completedLevels } = useProgressStore()
  const isCompleted = completedLevels.includes("3.4")

  useEffect(() => {
    const trimmed = insertedLine.trim()
    const delayPresent = trimmed === "delay: 5s" || trimmed === "- delay: 5s"
    setHasDelay(delayPresent)
    setHasTurnOff(true) // always present in our template
    setYaml(buildYaml(trimmed ? `- ${trimmed.replace(/^-\s*/, "")}` : ""))

    if (delayPresent && !challengeComplete) {
      setChallengeComplete(true)
      completeLevel("3.4")
    }
  }, [insertedLine, challengeComplete, completeLevel])

  const getLineHighlight = (lineIndex: number) => {
    // The inserted delay line is line index 8 (0-based) when present
    if (lineIndex === 7 && hasDelay) return "bg-green-500/10"
    if (lineIndex === 7 && insertedLine.trim() && !hasDelay) return "bg-amber-500/10"
    return ""
  }

  return (
    <div className="mx-auto max-w-5xl p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="mb-4 flex items-center gap-2">
          <Badge className="bg-green-500/20 text-green-400">Phase 3</Badge>
          <Badge variant="outline">Level 3.4</Badge>
          {isCompleted && (
            <Badge className="bg-green-500/20 text-green-400">
              <CheckCircle2 className="mr-1 h-3 w-3" /> Completed
            </Badge>
          )}
        </div>
        <h1 className="mb-2 text-3xl font-bold">Add a Delay</h1>
        <p className="text-lg text-muted-foreground">
          Make the light auto-turn-off 5 seconds after turning on.
        </p>
      </div>

      {/* Explanation */}
      <Card className="mb-6 border-green-500/30 bg-green-500/5">
        <CardContent className="flex items-start gap-4 py-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-500/20">
            <Timer className="h-5 w-5 text-green-400" />
          </div>
          <div>
            <p className="font-medium text-foreground">How delay works</p>
            <p className="text-sm text-muted-foreground">
              ESPHome actions run in sequence. By inserting{" "}
              <code className="rounded bg-muted px-1 font-mono text-xs">delay: 5s</code>{" "}
              between <code className="rounded bg-muted px-1 font-mono text-xs">light.turn_on</code> and{" "}
              <code className="rounded bg-muted px-1 font-mono text-xs">light.turn_off</code>, the device
              waits 5 seconds before executing the turn_off action.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Task */}
      <Card className="mb-6 border-amber-500/30 bg-amber-500/5">
        <CardContent className="py-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />
            <div>
              <p className="font-medium">Your task:</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Insert a <code className="rounded bg-muted px-1 font-mono text-xs">delay: 5s</code>{" "}
                action between <code className="rounded bg-muted px-1 font-mono text-xs">light.turn_on</code>{" "}
                and <code className="rounded bg-muted px-1 font-mono text-xs">light.turn_off</code>.
              </p>
              <div className="mt-3 space-y-1 text-xs">
                <div className={cn("flex items-center gap-2", hasDelay && "text-green-400")}>
                  {hasDelay ? <CheckCircle2 className="h-3.5 w-3.5 text-green-500" /> : <Plus className="h-3.5 w-3.5 text-muted-foreground" />}
                  <span>Add <code className="font-mono">delay: 5s</code></span>
                </div>
                <div className={cn("flex items-center gap-2", hasTurnOff && "text-green-400")}>
                  {hasTurnOff ? <CheckCircle2 className="h-3.5 w-3.5 text-green-500" /> : <Plus className="h-3.5 w-3.5 text-muted-foreground" />}
                  <span><code className="font-mono">light.turn_off</code> present after delay</span>
                </div>
              </div>
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
              <CardTitle className="text-lg">Insert the Delay</CardTitle>
            </div>
            <CardDescription>
              Type the line to insert between turn_on and turn_off
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Visual sequence */}
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Automation sequence</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 rounded-lg border border-green-500/30 bg-green-500/5 p-3">
                  <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                  <code className="font-mono text-sm text-red-400">- light.turn_on: my_light</code>
                </div>

                <div className="ml-4 flex items-center gap-2">
                  <div className="h-4 w-px bg-border" />
                  <div
                    className={cn(
                      "flex flex-1 items-center gap-2 rounded-lg border-2 border-dashed p-2 transition-colors",
                      hasDelay
                        ? "border-green-500/50 bg-green-500/5"
                        : "border-border/50 bg-muted/10"
                    )}
                  >
                    <span className="text-xs text-muted-foreground">insert here →</span>
                    <input
                      value={insertedLine}
                      onChange={(e) => setInsertedLine(e.target.value)}
                      placeholder="delay: 5s"
                      className={cn(
                        "flex-1 rounded border bg-background px-2 py-1 font-mono text-sm outline-none focus:ring-2",
                        hasDelay
                          ? "border-green-500/50 focus:ring-green-500/30"
                          : insertedLine && !hasDelay
                            ? "border-amber-500/50 focus:ring-amber-500/30"
                            : "border-input focus:ring-ring"
                      )}
                    />
                    {hasDelay && <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />}
                  </div>
                </div>

                <div className="flex items-center gap-2 rounded-lg border border-green-500/30 bg-green-500/5 p-3">
                  <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                  <code className="font-mono text-sm text-red-400">- light.turn_off: my_light</code>
                </div>
              </div>
            </div>

            {!hasDelay && insertedLine.trim() && (
              <p className="flex items-center gap-1 text-xs text-amber-500">
                <AlertCircle className="h-3 w-3" />
                Try <code className="font-mono">delay: 5s</code>
              </p>
            )}

            {/* Hint */}
            <Card className="border-blue-500/30 bg-blue-500/5">
              <CardContent className="flex items-start gap-3 py-3">
                <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-blue-400" />
                <p className="text-xs text-muted-foreground">
                  The value after <code className="font-mono">delay:</code> is a duration — <code className="font-mono">5s</code> means 5 seconds,
                  <code className="font-mono">500ms</code> would be half a second.
                </p>
              </CardContent>
            </Card>

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
                Insert <code className="font-mono">delay: 5s</code> between turn_on and turn_off
              </p>
            </div>

            <AnimatePresence>
              {challengeComplete && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Button asChild className="w-full">
                    <Link to="/app/level/3.5">
                      Continue to Level 3.5
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
              See the delay appear in the automation sequence
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
                        line.includes("light.turn_") && "text-red-400",
                        line.includes("delay:") && "text-amber-400",
                        line.includes("id:") && "text-pink-400"
                      )}
                    >
                      {line}
                    </span>
                  </div>
                ))}
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
