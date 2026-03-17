import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  CheckCircle2,
  ChevronRight,
  Code2,
  Eye,
  XCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useProgressStore } from "@/stores/progressStore"
import { Link } from "react-router-dom"

interface DiffLine {
  lineNum: number
  leftContent: string
  rightContent: string
  isDifferent: boolean
  diffId: string | null
  explanation: string
}

const diffLines: DiffLine[] = [
  {
    lineNum: 1,
    leftContent: "binary_sensor:",
    rightContent: "binary_sensor:",
    isDifferent: false,
    diffId: null,
    explanation: "",
  },
  {
    lineNum: 2,
    leftContent: "  - platform: gpio",
    rightContent: "  - platform: gpio",
    isDifferent: false,
    diffId: null,
    explanation: "",
  },
  {
    lineNum: 3,
    leftContent: "    pin: GPIO4",
    rightContent: "    pin: GPIO14",
    isDifferent: true,
    diffId: "pin",
    explanation: "Different pin number — GPIO4 vs GPIO14",
  },
  {
    lineNum: 4,
    leftContent: '    name: "My Button"',
    rightContent: '    name: "Door Button"',
    isDifferent: true,
    diffId: "name",
    explanation: "Different name — \"My Button\" vs \"Door Button\"",
  },
  {
    lineNum: 5,
    leftContent: "    on_press:",
    rightContent: "    on_press:",
    isDifferent: false,
    diffId: null,
    explanation: "",
  },
  {
    lineNum: 6,
    leftContent: "      then:",
    rightContent: "      then:",
    isDifferent: false,
    diffId: null,
    explanation: "",
  },
  {
    lineNum: 7,
    leftContent: "        - light.turn_on: my_light",
    rightContent: "        - light.turn_on: my_light",
    isDifferent: false,
    diffId: null,
    explanation: "",
  },
  {
    lineNum: 8,
    leftContent: "        - light.turn_off: my_light",
    rightContent: "",
    isDifferent: true,
    diffId: "missing_handler",
    explanation: "Missing line — the turn_off action is absent in Config B",
  },
  {
    lineNum: 9,
    leftContent: "",
    rightContent: "",
    isDifferent: false,
    diffId: null,
    explanation: "",
  },
  {
    lineNum: 10,
    leftContent: "light:",
    rightContent: "light:",
    isDifferent: false,
    diffId: null,
    explanation: "",
  },
  {
    lineNum: 11,
    leftContent: "  - platform: binary",
    rightContent: "  - platform: binary",
    isDifferent: false,
    diffId: null,
    explanation: "",
  },
  {
    lineNum: 12,
    leftContent: '    name: "My Light"',
    rightContent: '    name: "My Light"',
    isDifferent: false,
    diffId: null,
    explanation: "",
  },
  {
    lineNum: 13,
    leftContent: "    id: my_light",
    rightContent: "    id: my_light",
    isDifferent: false,
    diffId: null,
    explanation: "",
  },
]

const TOTAL_DIFFS = 3

export function Level2_3() {
  const [foundDiffs, setFoundDiffs] = useState<Set<string>>(new Set())
  const [wrongClicks, setWrongClicks] = useState<Set<number>>(new Set())
  const [levelComplete, setLevelComplete] = useState(false)

  const { completeLevel, completedLevels } = useProgressStore()
  const isCompleted = completedLevels.includes("2.3")

  const handleLineClick = (line: DiffLine) => {
    if (levelComplete) return

    if (line.isDifferent && line.diffId) {
      if (foundDiffs.has(line.diffId)) return
      const next = new Set(foundDiffs)
      next.add(line.diffId)
      setFoundDiffs(next)
      if (next.size === TOTAL_DIFFS) {
        setLevelComplete(true)
        completeLevel("2.3")
      }
    } else if (!line.isDifferent) {
      setWrongClicks((prev) => {
        const next = new Set(prev)
        next.add(line.lineNum)
        setTimeout(() => {
          setWrongClicks((p) => {
            const n = new Set(p)
            n.delete(line.lineNum)
            return n
          })
        }, 800)
        return next
      })
    }
  }

  const getLineColor = (content: string) => {
    if (content.includes("binary_sensor:")) return "text-blue-400"
    if (content.includes("platform:")) return "text-cyan-400"
    if (content.includes("pin:")) return "text-green-400"
    if (content.includes("name:")) return "text-purple-400"
    if (content.includes("on_press:") || content.includes("then:")) return "text-orange-400"
    if (content.includes("light.turn_")) return "text-red-400"
    if (content.includes("light:")) return "text-amber-400"
    if (content.includes("id:")) return "text-pink-400"
    return "text-foreground"
  }

  return (
    <div className="mx-auto max-w-5xl p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="mb-4 flex items-center gap-2">
          <Badge className="bg-blue-500/20 text-blue-400">Phase 2</Badge>
          <Badge variant="outline">Level 2.3</Badge>
          {isCompleted && (
            <Badge className="bg-green-500/20 text-green-400">
              <CheckCircle2 className="mr-1 h-3 w-3" /> Completed
            </Badge>
          )}
        </div>
        <h1 className="mb-2 text-3xl font-bold">Spot the Difference</h1>
        <p className="text-lg text-muted-foreground">
          Two configs, three differences. Click the lines that don't match.
        </p>
      </div>

      {/* Progress */}
      <div className="mb-6 flex items-center gap-3">
        <Eye className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">
          Differences found:
        </span>
        <div className="flex gap-2">
          {Array.from({ length: TOTAL_DIFFS }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-3 w-3 rounded-full border-2 transition-colors",
                i < foundDiffs.size
                  ? "border-green-500 bg-green-500"
                  : "border-border bg-transparent"
              )}
            />
          ))}
        </div>
        <span className="text-sm font-medium">
          {foundDiffs.size} / {TOTAL_DIFFS}
        </span>
      </div>

      {/* Side-by-side diff */}
      <Card className="mb-6 border-border/50 bg-card/50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Code2 className="h-5 w-5 text-blue-400" />
            <CardTitle>Config Comparison</CardTitle>
          </div>
          <CardDescription>
            Click on any line you think is different between Config A and Config B
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {/* Config A */}
            <div>
              <div className="mb-2 flex items-center gap-2">
                <Badge variant="outline" className="text-xs">Config A</Badge>
                <span className="text-xs text-muted-foreground">Original</span>
              </div>
              <div className="rounded-lg border border-border/50 bg-gray-100 dark:bg-gray-950 p-3">
                <pre className="font-mono text-sm">
                  {diffLines.map((line) => {
                    const isFound = line.diffId !== null && foundDiffs.has(line.diffId)
                    const isWrong = wrongClicks.has(line.lineNum)
                    return (
                      <motion.div
                        key={`a-${line.lineNum}`}
                        onClick={() => handleLineClick(line)}
                        whileHover={!levelComplete ? { x: 2 } : {}}
                        animate={isWrong ? { x: [-4, 4, -4, 0] } : {}}
                        transition={isWrong ? { duration: 0.3 } : {}}
                        className={cn(
                          "flex cursor-pointer rounded px-1 leading-6 transition-colors",
                          isFound && "bg-green-500/15",
                          isWrong && "bg-red-500/10",
                          !isFound && !isWrong && "hover:bg-white/5"
                        )}
                      >
                        <span className="mr-3 w-5 shrink-0 text-right text-xs text-muted-foreground/50">
                          {line.lineNum}
                        </span>
                        <span
                          className={cn(
                            getLineColor(line.leftContent),
                            isFound && "line-through opacity-60"
                          )}
                        >
                          {line.leftContent || "\u00A0"}
                        </span>
                        {isFound && (
                          <CheckCircle2 className="ml-auto h-3 w-3 shrink-0 self-center text-green-500" />
                        )}
                        {isWrong && (
                          <XCircle className="ml-auto h-3 w-3 shrink-0 self-center text-red-500" />
                        )}
                      </motion.div>
                    )
                  })}
                </pre>
              </div>
            </div>

            {/* Config B */}
            <div>
              <div className="mb-2 flex items-center gap-2">
                <Badge variant="outline" className="text-xs">Config B</Badge>
                <span className="text-xs text-muted-foreground">Modified</span>
              </div>
              <div className="rounded-lg border border-border/50 bg-gray-100 dark:bg-gray-950 p-3">
                <pre className="font-mono text-sm">
                  {diffLines.map((line) => {
                    const isFound = line.diffId !== null && foundDiffs.has(line.diffId)
                    return (
                      <div
                        key={`b-${line.lineNum}`}
                        className={cn(
                          "flex rounded px-1 leading-6",
                          isFound && "bg-green-500/15"
                        )}
                      >
                        <span className="mr-3 w-5 shrink-0 text-right text-xs text-muted-foreground/50">
                          {line.lineNum}
                        </span>
                        <span
                          className={cn(
                            getLineColor(line.rightContent),
                            isFound && "text-green-400"
                          )}
                        >
                          {line.rightContent || "\u00A0"}
                        </span>
                      </div>
                    )
                  })}
                </pre>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Found differences list */}
      <AnimatePresence>
        {foundDiffs.size > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 space-y-2"
          >
            <h3 className="text-sm font-medium text-muted-foreground">Found differences:</h3>
            {diffLines
              .filter((l) => l.diffId && foundDiffs.has(l.diffId))
              .map((l) => (
                <motion.div
                  key={l.diffId}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-start gap-3 rounded-lg border border-green-500/30 bg-green-500/5 p-3"
                >
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                  <div>
                    <p className="text-sm font-medium text-green-400">Line {l.lineNum}</p>
                    <p className="text-xs text-muted-foreground">{l.explanation}</p>
                  </div>
                </motion.div>
              ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Completion */}
      <AnimatePresence>
        {levelComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="mb-4 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20">
                <CheckCircle2 className="h-8 w-8 text-green-500" />
              </div>
            </div>
            <h3 className="mb-2 text-xl font-bold">All differences found!</h3>
            <p className="mb-6 text-muted-foreground">
              You can read YAML configs carefully enough to spot subtle changes.
            </p>
            <Button asChild>
              <Link to="/app/level/2.4">
                Continue to Level 2.4
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
