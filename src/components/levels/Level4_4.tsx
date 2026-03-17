import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  CheckCircle2,
  ChevronRight,
  Code2,
  FileCode,
  Sparkles,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useProgressStore } from "@/stores/progressStore"
import { Link } from "react-router-dom"

const INITIAL_VALUE = "esphome:\n  name: "

interface Requirement {
  id: string
  label: string
  check: (text: string) => boolean
}

const requirements: Requirement[] = [
  {
    id: "esphome",
    label: "esphome: block",
    check: (t) => /esphome\s*:/.test(t),
  },
  {
    id: "esp32",
    label: "esp32: block",
    check: (t) => /esp32\s*:/.test(t),
  },
  {
    id: "wifi",
    label: "wifi: block",
    check: (t) => /wifi\s*:/.test(t),
  },
  {
    id: "sensor",
    label: "binary_sensor: or sensor:",
    check: (t) => /binary_sensor\s*:/.test(t) || /(?<!\w)sensor\s*:/.test(t),
  },
  {
    id: "output_device",
    label: "light: or switch:",
    check: (t) => /(?<!\w)light\s*:/.test(t) || /switch\s*:/.test(t),
  },
]

export function Level4_4() {
  const [code, setCode] = useState(INITIAL_VALUE)
  const [levelComplete, setLevelComplete] = useState(false)

  const { completeLevel, completedLevels } = useProgressStore()
  const isCompleted = completedLevels.includes("4.4")

  const checks = requirements.map((r) => ({ ...r, passed: r.check(code) }))
  const allPassed = checks.every((c) => c.passed)
  const passedCount = checks.filter((c) => c.passed).length

  useEffect(() => {
    if (allPassed && !levelComplete) {
      setLevelComplete(true)
      completeLevel("4.4")
    }
  }, [allPassed, levelComplete, completeLevel])

  return (
    <div className="mx-auto max-w-5xl p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="mb-4 flex items-center gap-2">
          <Badge className="bg-purple-500/20 text-purple-400">Phase 4</Badge>
          <Badge variant="outline">Level 4.4</Badge>
          {isCompleted && (
            <Badge className="bg-green-500/20 text-green-400">
              <CheckCircle2 className="mr-1 h-3 w-3" /> Completed
            </Badge>
          )}
        </div>
        <h1 className="mb-2 text-3xl font-bold">Write a Complete Config</h1>
        <p className="text-lg text-muted-foreground">
          The hardest challenge yet: write a full ESPHome config from scratch.
        </p>
      </div>

      {/* Info card */}
      <Card className="mb-6 border-purple-500/30 bg-purple-500/5">
        <CardContent className="flex items-start gap-4 py-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-500/20">
            <FileCode className="h-5 w-5 text-purple-400" />
          </div>
          <div>
            <p className="font-medium text-foreground">Build from scratch</p>
            <p className="text-sm text-muted-foreground">
              Write a complete, valid-enough ESPHome config. The checklist on the right tracks which
              required sections you've included. All 5 must be present to complete the level.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Editor */}
        <div className="lg:col-span-2">
          <Card className="border-border/50 bg-card/50 h-full">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Code2 className="h-4 w-4 text-purple-400" />
                <CardTitle className="text-lg">Your Config</CardTitle>
              </div>
              <CardDescription>
                Type a complete ESPHome YAML configuration below
              </CardDescription>
            </CardHeader>
            <CardContent>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className={cn(
                  "w-full rounded-lg border bg-gray-100 dark:bg-gray-950 p-4 font-mono text-sm resize-none outline-none focus:ring-2 transition-colors",
                  allPassed
                    ? "border-green-500/50 focus:ring-green-500/30"
                    : "border-border/50 focus:ring-ring"
                )}
                rows={28}
                spellCheck={false}
                placeholder="Continue writing your ESPHome config here..."
              />
            </CardContent>
          </Card>
        </div>

        {/* Checklist sidebar */}
        <div>
          <Card className="border-border/50 bg-card/50 sticky top-4">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-400" />
                <CardTitle className="text-sm">Requirements</CardTitle>
              </div>
              <CardDescription className="text-xs">
                All 5 must be present to complete
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {checks.map((check) => (
                <motion.div
                  key={check.id}
                  animate={{ opacity: 1 }}
                  className={cn(
                    "flex items-center gap-3 rounded-lg p-2.5 transition-colors",
                    check.passed ? "bg-green-500/5 border border-green-500/20" : "bg-muted/20 border border-transparent"
                  )}
                >
                  <div
                    className={cn(
                      "flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-colors",
                      check.passed ? "bg-green-500/20" : "bg-muted"
                    )}
                  >
                    {check.passed ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : (
                      <div className="h-2 w-2 rounded-full bg-muted-foreground/40" />
                    )}
                  </div>
                  <span
                    className={cn(
                      "text-xs font-medium font-mono",
                      check.passed ? "text-green-400" : "text-muted-foreground"
                    )}
                  >
                    {check.label}
                  </span>
                </motion.div>
              ))}

              <div className="mt-2 rounded-lg border border-border/50 bg-muted/20 p-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">
                    {passedCount} / {requirements.length}
                  </span>
                </div>
                <div className="mt-2 h-1.5 w-full rounded-full bg-border/50">
                  <motion.div
                    className="h-full rounded-full bg-purple-500"
                    animate={{ width: `${(passedCount / requirements.length) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>

              <AnimatePresence>
                {levelComplete && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-3"
                  >
                    <div className="rounded-lg border border-green-500/30 bg-green-500/5 p-3 text-center">
                      <CheckCircle2 className="h-8 w-8 text-green-500 mx-auto mb-2" />
                      <p className="text-sm font-semibold text-green-400">Phase 4 Complete!</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        You can write a full ESPHome config from scratch.
                      </p>
                    </div>
                    <Button asChild className="w-full">
                      <Link to="/app/level/5.1">
                        Continue to Phase 5
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
