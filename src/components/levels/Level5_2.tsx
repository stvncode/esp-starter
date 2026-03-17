import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  CheckCircle2,
  ChevronRight,
  Play,
  AlertTriangle,
  Info,
  XCircle,
  Terminal,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useProgressStore } from "@/stores/progressStore"
import { Link } from "react-router-dom"

interface LogLine {
  level: "I" | "W" | "E"
  tag: string
  line: string
  message: string
}

const LOG_LINES: LogLine[] = [
  { level: "I", tag: "app:029", line: "29", message: "ESPHome version 2024.1.0" },
  { level: "I", tag: "wifi:103", line: "103", message: "Connecting to WiFi..." },
  { level: "I", tag: "wifi:104", line: "104", message: "Connected! IP: 192.168.1.42" },
  { level: "I", tag: "binary_sensor:013", line: "013", message: "'My Button': Sending state ON" },
  { level: "W", tag: "component:214", line: "214", message: "Component gpio has a call chain longer than 10" },
  { level: "E", tag: "gpio:102", line: "102", message: "Pin GPIO34 is input-only! Cannot use as output" },
  { level: "I", tag: "light:036", line: "036", message: "'My Light': Setting brightness: 100%" },
]

const LOG_DELAY_MS = 600

interface RadioOption {
  id: string
  text: string
  correct: boolean
}

const radioOptions: RadioOption[] = [
  {
    id: "a",
    text: "WiFi failed to connect to the network",
    correct: false,
  },
  {
    id: "b",
    text: "GPIO34 is input-only and can't be used as output",
    correct: true,
  },
  {
    id: "c",
    text: "The light brightness was set too high",
    correct: false,
  },
]

const logLevelIcon = (level: "I" | "W" | "E") => {
  if (level === "E") return <XCircle className="h-3.5 w-3.5 text-red-500 shrink-0" />
  if (level === "W") return <AlertTriangle className="h-3.5 w-3.5 text-yellow-500 shrink-0" />
  return <Info className="h-3.5 w-3.5 text-blue-400 shrink-0" />
}

const logLevelColor = (level: "I" | "W" | "E") => {
  if (level === "E") return "text-red-400"
  if (level === "W") return "text-yellow-400"
  return "text-muted-foreground"
}

export function Level5_2() {
  const [playing, setPlaying] = useState(false)
  const [visibleCount, setVisibleCount] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [levelComplete, setLevelComplete] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const { completeLevel, completedLevels } = useProgressStore()
  const isCompleted = completedLevels.includes("5.2")

  const logsFinished = visibleCount >= LOG_LINES.length

  const handlePlay = () => {
    if (playing || logsFinished) return
    setPlaying(true)
  }

  useEffect(() => {
    if (!playing) return
    if (visibleCount >= LOG_LINES.length) {
      setPlaying(false)
      return
    }
    intervalRef.current = setInterval(() => {
      setVisibleCount((prev) => {
        if (prev >= LOG_LINES.length) {
          clearInterval(intervalRef.current!)
          setPlaying(false)
          return prev
        }
        return prev + 1
      })
    }, LOG_DELAY_MS)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [playing])

  const handleSubmit = () => {
    if (!selectedAnswer) return
    setSubmitted(true)
    const correct = radioOptions.find((o) => o.id === selectedAnswer)?.correct ?? false
    if (correct && !levelComplete) {
      setLevelComplete(true)
      completeLevel("5.2")
    }
  }

  const correctOption = radioOptions.find((o) => o.correct)

  return (
    <div className="mx-auto max-w-4xl p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="mb-4 flex items-center gap-2">
          <Badge className="bg-cyan-500/20 text-cyan-400">Phase 5</Badge>
          <Badge variant="outline">Level 5.2</Badge>
          {isCompleted && (
            <Badge className="bg-green-500/20 text-green-400">
              <CheckCircle2 className="mr-1 h-3 w-3" /> Completed
            </Badge>
          )}
        </div>
        <h1 className="mb-2 text-3xl font-bold">Debug with Logs</h1>
        <p className="text-lg text-muted-foreground">
          Read a simulated ESPHome log and identify what went wrong.
        </p>
      </div>

      {/* Info card */}
      <Card className="mb-6 border-cyan-500/30 bg-cyan-500/5">
        <CardContent className="flex items-start gap-4 py-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-cyan-500/20">
            <Terminal className="h-5 w-5 text-cyan-400" />
          </div>
          <div>
            <p className="font-medium text-foreground">Reading ESPHome logs</p>
            <p className="text-sm text-muted-foreground">
              Logs have three levels:{" "}
              <span className="text-blue-400 font-mono">[I]</span> INFO — normal operation,{" "}
              <span className="text-yellow-400 font-mono">[W]</span> WARNING — something may be wrong,{" "}
              <span className="text-red-400 font-mono">[E]</span> ERROR — something failed.
              Errors are the first place to look when a device isn't working.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Log viewer */}
      <Card className="mb-8 border-border/50 bg-card/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-sm">Simulated Log Output</CardTitle>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={handlePlay}
              disabled={playing || logsFinished}
            >
              <Play className="mr-2 h-3 w-3" />
              {logsFinished ? "Log complete" : playing ? "Playing…" : "Play logs"}
            </Button>
          </div>
          <CardDescription className="text-xs">
            Watch the log stream in real time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-border/50 bg-gray-950 p-4 min-h-[240px] font-mono text-xs space-y-1">
            {LOG_LINES.slice(0, visibleCount).map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
                className={cn(
                  "flex items-start gap-2",
                  line.level === "E" && "bg-red-500/10 -mx-4 px-4 py-0.5 rounded"
                )}
              >
                {logLevelIcon(line.level)}
                <span className={cn("font-mono", logLevelColor(line.level))}>
                  [{line.level}][{line.tag}]: {line.message}
                </span>
              </motion.div>
            ))}
            {visibleCount === 0 && (
              <p className="text-muted-foreground/40 text-center pt-8">
                Press "Play logs" to start the simulation
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quiz — shown after logs finish */}
      <AnimatePresence>
        {logsFinished && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="border-border/50 bg-card/50">
              <CardHeader>
                <CardTitle className="text-base">What went wrong?</CardTitle>
                <CardDescription>
                  Based on the ERROR line in the log above, select the correct diagnosis.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {radioOptions.map((option) => {
                  const isSelected = selectedAnswer === option.id
                  const showResult = submitted
                  const showCorrect = showResult && option.correct
                  const showWrong = showResult && isSelected && !option.correct

                  return (
                    <motion.button
                      key={option.id}
                      onClick={() => !submitted && setSelectedAnswer(option.id)}
                      disabled={submitted}
                      whileHover={!submitted ? { scale: 1.01 } : {}}
                      whileTap={!submitted ? { scale: 0.99 } : {}}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-lg border-2 p-3 text-left text-sm transition-all",
                        showCorrect
                          ? "border-green-500 bg-green-500/10 text-green-400"
                          : showWrong
                          ? "border-red-500 bg-red-500/10 text-red-400"
                          : isSelected
                          ? "border-primary bg-primary/5"
                          : "border-border/50 hover:border-border hover:bg-muted/50"
                      )}
                    >
                      <div
                        className={cn(
                          "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                          showCorrect
                            ? "border-green-500 bg-green-500/20"
                            : showWrong
                            ? "border-red-500 bg-red-500/20"
                            : isSelected
                            ? "border-primary bg-primary/20"
                            : "border-muted-foreground/40"
                        )}
                      >
                        {showCorrect && <CheckCircle2 className="h-3 w-3 text-green-500" />}
                        {showWrong && <XCircle className="h-3 w-3 text-red-500" />}
                      </div>
                      {option.text}
                    </motion.button>
                  )
                })}

                {!submitted && (
                  <Button
                    onClick={handleSubmit}
                    disabled={!selectedAnswer}
                    className="w-full mt-2"
                  >
                    Submit Answer
                  </Button>
                )}

                <AnimatePresence>
                  {submitted && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="space-y-4 overflow-hidden"
                    >
                      <div
                        className={cn(
                          "rounded-lg p-4 text-sm",
                          levelComplete
                            ? "border border-green-500/30 bg-green-500/5 text-green-300"
                            : "border border-red-500/30 bg-red-500/5 text-red-300"
                        )}
                      >
                        {levelComplete ? (
                          <>
                            <p className="font-medium mb-1">Correct!</p>
                            <p className="text-xs text-muted-foreground">
                              The ERROR line{" "}
                              <code className="font-mono">[E][gpio:102]: Pin GPIO34 is input-only!</code>{" "}
                              means you tried to use GPIO34 as an output pin, but it only supports input.
                              Use a different GPIO pin for your light.
                            </p>
                          </>
                        ) : (
                          <>
                            <p className="font-medium mb-1">Not quite.</p>
                            <p className="text-xs">
                              Look at the red ERROR line in the log. The correct answer is:{" "}
                              <span className="font-medium">{correctOption?.text}</span>
                            </p>
                          </>
                        )}
                      </div>

                      {levelComplete && (
                        <Button asChild className="w-full">
                          <Link to="/app/level/5.3">
                            Continue to Level 5.3
                            <ChevronRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
