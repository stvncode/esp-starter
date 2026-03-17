import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  CheckCircle2,
  ChevronRight,
  Code2,
  XCircle,
  Wifi,
  Usb,
  Radio,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useProgressStore } from "@/stores/progressStore"
import { Link } from "react-router-dom"

const otaYaml = `ota:
  - platform: esphome
    password: "my-ota-password"

wifi:
  ssid: "MyNetwork"
  password: "secret"`

const getLineColor = (line: string) => {
  if (line.startsWith("ota:") || line.startsWith("wifi:")) return "text-blue-400"
  if (line.includes("platform:")) return "text-cyan-400"
  if (line.includes("password:") || line.includes("ssid:")) return "text-green-400"
  return "text-foreground"
}

interface Question {
  id: string
  question: string
  answers: { id: string; text: string }[]
  correctId: string
  explanation: string
}

const questions: Question[] = [
  {
    id: "q1",
    question: "What does OTA stand for in ESPHome?",
    answers: [
      { id: "a", text: "Over The Air" },
      { id: "b", text: "Online Transfer Agent" },
      { id: "c", text: "Output Toggle Action" },
      { id: "d", text: "Open Telemetry API" },
    ],
    correctId: "a",
    explanation:
      "OTA stands for Over The Air — meaning firmware updates are sent wirelessly over WiFi, without needing a USB cable.",
  },
  {
    id: "q2",
    question: "After the first USB flash, how do you update the firmware?",
    answers: [
      { id: "a", text: "You must always use USB for every update" },
      { id: "b", text: "Run esphome run config.yaml — ESPHome detects the device on WiFi and updates it wirelessly" },
      { id: "c", text: "You need to manually download the binary and copy it to the device" },
      { id: "d", text: "Updates only happen through Home Assistant" },
    ],
    correctId: "b",
    explanation:
      "Once the ota: block is in your config and the device is on WiFi, running esphome run config.yaml again will upload the new firmware wirelessly. No USB needed.",
  },
]

export function Level5_3() {
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState<Record<string, boolean>>({})
  const [levelComplete, setLevelComplete] = useState(false)

  const { completeLevel, completedLevels } = useProgressStore()
  const isCompleted = completedLevels.includes("5.3")

  const handleAnswer = (questionId: string, answerId: string) => {
    if (submitted[questionId]) return
    const newAnswers = { ...answers, [questionId]: answerId }
    const newSubmitted = { ...submitted, [questionId]: true }
    setAnswers(newAnswers)
    setSubmitted(newSubmitted)

    if (Object.keys(newSubmitted).length === questions.length) {
      const allCorrect = questions.every((q) => newAnswers[q.id] === q.correctId)
      if (allCorrect && !levelComplete) {
        setLevelComplete(true)
        completeLevel("5.3")
      }
    }
  }

  const allAnswered = Object.keys(submitted).length === questions.length
  const allCorrect = questions.every((q) => answers[q.id] === q.correctId)

  const reset = () => {
    setAnswers({})
    setSubmitted({})
    setLevelComplete(false)
  }

  return (
    <div className="mx-auto max-w-4xl p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="mb-4 flex items-center gap-2">
          <Badge className="bg-cyan-500/20 text-cyan-400">Phase 5</Badge>
          <Badge variant="outline">Level 5.3</Badge>
          {isCompleted && (
            <Badge className="bg-green-500/20 text-green-400">
              <CheckCircle2 className="mr-1 h-3 w-3" /> Completed
            </Badge>
          )}
        </div>
        <h1 className="mb-2 text-3xl font-bold">OTA Updates</h1>
        <p className="text-lg text-muted-foreground">
          Learn how to update ESPHome devices wirelessly — no USB cable needed after the first flash.
        </p>
      </div>

      {/* Explanation */}
      <Card className="mb-6 border-cyan-500/30 bg-cyan-500/5">
        <CardContent className="flex items-start gap-4 py-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-cyan-500/20">
            <Radio className="h-5 w-5 text-cyan-400" />
          </div>
          <div>
            <p className="font-medium text-foreground">What is OTA?</p>
            <p className="text-sm text-muted-foreground">
              OTA (Over The Air) updates let you push new firmware to your ESP device over WiFi. Once you've
              done the initial USB flash with an <code className="rounded bg-muted px-1 font-mono text-xs">ota:</code>{" "}
              block in your config, all future updates are wireless — just run the same{" "}
              <code className="rounded bg-muted px-1 font-mono text-xs">esphome run</code> command.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Before / After comparison */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2">
        <Card className="border-border/50 bg-card/50">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Usb className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-sm">First Flash (USB)</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-amber-400 shrink-0" />
                <span>Requires a USB data cable</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-amber-400 shrink-0" />
                <span>Device must be plugged into your computer</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-amber-400 shrink-0" />
                <span>Sets up WiFi & OTA for the first time</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-400 shrink-0" />
                <span>Only needed once</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-cyan-500/30 bg-cyan-500/5">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Wifi className="h-4 w-4 text-cyan-400" />
              <CardTitle className="text-sm text-cyan-400">Subsequent Updates (OTA)</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-green-500 shrink-0" />
                <span>No USB cable needed</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-green-500 shrink-0" />
                <span>Device just needs to be on WiFi</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-green-500 shrink-0" />
                <span>Same <code className="font-mono text-xs">esphome run</code> command</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-green-500 shrink-0" />
                <span>Device can be mounted anywhere</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* OTA YAML snippet */}
      <Card className="mb-8 border-border/50 bg-card/50">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Code2 className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-sm">OTA Config Block</CardTitle>
          </div>
          <CardDescription className="text-xs">
            Add this to your YAML to enable wireless updates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-border/50 bg-gray-100 dark:bg-gray-950 p-4">
            <pre className="font-mono text-sm">
              {otaYaml.split("\n").map((line, i) => (
                <div key={i} className="leading-6">
                  <span className="mr-4 inline-block w-5 text-right text-xs text-muted-foreground/40">
                    {i + 1}
                  </span>
                  <span className={getLineColor(line)}>{line || "\u00A0"}</span>
                </div>
              ))}
            </pre>
          </div>
          <div className="mt-3 rounded-lg border border-cyan-500/30 bg-cyan-500/5 p-3 text-xs text-muted-foreground">
            <span className="text-cyan-400 font-medium">Note:</span> The OTA password protects against
            unauthorized firmware updates. Keep it secret — treat it like a WiFi password.
          </div>
        </CardContent>
      </Card>

      {/* Quiz */}
      <div className="space-y-6">
        <h2 className="text-lg font-semibold">Quiz — answer both correctly to complete</h2>

        {questions.map((q, qi) => {
          const userAnswer = answers[q.id]
          const isSubmitted = submitted[q.id]

          return (
            <Card
              key={q.id}
              className={cn(
                "border-border/50 bg-card/50",
                isSubmitted && userAnswer === q.correctId && "border-green-500/30",
                isSubmitted && userAnswer !== q.correctId && "border-red-500/30"
              )}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start gap-3">
                  <div
                    className={cn(
                      "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                      isSubmitted && userAnswer === q.correctId
                        ? "bg-green-500/20 text-green-400"
                        : isSubmitted && userAnswer !== q.correctId
                        ? "bg-red-500/20 text-red-400"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {qi + 1}
                  </div>
                  <CardTitle className="text-sm leading-relaxed">{q.question}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {q.answers.map((answer) => {
                    const isSelected = userAnswer === answer.id
                    const isCorrect = answer.id === q.correctId
                    const showCorrect = isSubmitted && isCorrect
                    const showWrong = isSubmitted && isSelected && !isCorrect

                    return (
                      <motion.button
                        key={answer.id}
                        onClick={() => handleAnswer(q.id, answer.id)}
                        disabled={isSubmitted}
                        whileHover={!isSubmitted ? { scale: 1.01 } : {}}
                        whileTap={!isSubmitted ? { scale: 0.99 } : {}}
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
                            "flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-xs font-bold",
                            showCorrect ? "bg-green-500/20" : showWrong ? "bg-red-500/20" : "bg-muted"
                          )}
                        >
                          {showCorrect ? (
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                          ) : showWrong ? (
                            <XCircle className="h-4 w-4 text-red-500" />
                          ) : (
                            answer.id.toUpperCase()
                          )}
                        </div>
                        {answer.text}
                      </motion.button>
                    )
                  })}
                </div>

                <AnimatePresence>
                  {isSubmitted && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mt-3 overflow-hidden"
                    >
                      <div
                        className={cn(
                          "rounded-lg p-3 text-xs",
                          userAnswer === q.correctId
                            ? "border border-green-500/30 bg-green-500/5 text-green-300"
                            : "border border-red-500/30 bg-red-500/5 text-red-300"
                        )}
                      >
                        <span className="font-medium">
                          {userAnswer === q.correctId ? "Correct! " : "Not quite — "}
                        </span>
                        {q.explanation}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Results */}
      <AnimatePresence>
        {allAnswered && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8"
          >
            <Card
              className={cn(
                "border",
                allCorrect
                  ? "border-green-500/30 bg-green-500/5"
                  : "border-red-500/30 bg-red-500/5"
              )}
            >
              <CardContent className="py-6 text-center">
                {allCorrect ? (
                  <>
                    <CheckCircle2 className="h-10 w-10 text-green-500 mx-auto mb-3" />
                    <h3 className="mb-2 text-xl font-bold">OTA unlocked!</h3>
                    <p className="mb-6 text-sm text-muted-foreground">
                      You understand wireless firmware updates. One more level to go!
                    </p>
                    <Button asChild>
                      <Link to="/app/level/5.4">
                        Continue to Level 5.4
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </>
                ) : (
                  <>
                    <p className="mb-4 text-sm text-muted-foreground">
                      Review the explanations above and try again.
                    </p>
                    <Button variant="outline" onClick={reset}>
                      Try Again
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
