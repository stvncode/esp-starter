import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  CheckCircle2,
  ChevronRight,
  ChevronDown,
  XCircle,
  Terminal,
  Usb,
  Wifi,
  FileCode,
  Cpu,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useProgressStore } from "@/stores/progressStore"
import { Link } from "react-router-dom"

interface Step {
  id: string
  number: number
  title: string
  icon: React.ElementType
  iconColor: string
  iconBg: string
  explanation: string
}

const steps: Step[] = [
  {
    id: "write",
    number: 1,
    title: "Write your config",
    icon: FileCode,
    iconColor: "text-cyan-400",
    iconBg: "bg-cyan-500/20",
    explanation:
      "Create a YAML file (e.g. my-device.yaml) with your ESPHome configuration. This defines the device name, WiFi credentials, and all your components like buttons and lights.",
  },
  {
    id: "connect",
    number: 2,
    title: "Connect device via USB",
    icon: Usb,
    iconColor: "text-cyan-400",
    iconBg: "bg-cyan-500/20",
    explanation:
      "Plug your ESP32 into your computer using a USB data cable (not a charge-only cable). Your OS will assign it a serial port like /dev/ttyUSB0 (Linux/Mac) or COM3 (Windows).",
  },
  {
    id: "flash",
    number: 3,
    title: "Run esphome run config.yaml",
    icon: Terminal,
    iconColor: "text-cyan-400",
    iconBg: "bg-cyan-500/20",
    explanation:
      "ESPHome compiles your YAML into firmware, then uploads it to the device over USB using the esptool. The first flash always requires USB — subsequent updates can be done over WiFi (OTA).",
  },
  {
    id: "wifi",
    number: 4,
    title: "Device connects to WiFi",
    icon: Wifi,
    iconColor: "text-cyan-400",
    iconBg: "bg-cyan-500/20",
    explanation:
      "After flashing, the device boots and connects to your WiFi network using the credentials in the config. You'll see its IP address in the logs. From here it can be controlled over the network.",
  },
]

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
    question: "What command do you run to flash an ESPHome device for the first time?",
    answers: [
      { id: "a", text: "esphome flash config.yaml" },
      { id: "b", text: "esphome run config.yaml" },
      { id: "c", text: "esphome upload config.yaml" },
      { id: "d", text: "esphome build config.yaml" },
    ],
    correctId: "b",
    explanation:
      "esphome run config.yaml compiles the firmware and immediately flashes it to the connected device. esphome compile only builds without flashing.",
  },
  {
    id: "q2",
    question: "What does ESPHome do after the device is successfully flashed?",
    answers: [
      { id: "a", text: "It powers off and waits for manual reboot" },
      { id: "b", text: "It reboots the device and it connects to WiFi" },
      { id: "c", text: "It asks you to re-enter WiFi credentials" },
      { id: "d", text: "It opens a browser window to configure the device" },
    ],
    correctId: "b",
    explanation:
      "After flashing, the device automatically reboots. It then runs the newly flashed firmware and connects to the WiFi network specified in the config.",
  },
]

export function Level5_1() {
  const [openSteps, setOpenSteps] = useState<Set<string>>(new Set())
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState<Record<string, boolean>>({})
  const [levelComplete, setLevelComplete] = useState(false)

  const { completeLevel, completedLevels } = useProgressStore()
  const isCompleted = completedLevels.includes("5.1")

  const allStepsRead = openSteps.size === steps.length

  const toggleStep = (id: string) => {
    const next = new Set(openSteps)
    if (next.has(id)) {
      next.delete(id)
    } else {
      next.add(id)
    }
    setOpenSteps(next)
  }

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
        completeLevel("5.1")
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
          <Badge variant="outline">Level 5.1</Badge>
          {isCompleted && (
            <Badge className="bg-green-500/20 text-green-400">
              <CheckCircle2 className="mr-1 h-3 w-3" /> Completed
            </Badge>
          )}
        </div>
        <h1 className="mb-2 text-3xl font-bold">Flash Your First Device</h1>
        <p className="text-lg text-muted-foreground">
          Learn the ESPHome flashing process step by step, then answer a quick quiz.
        </p>
      </div>

      {/* Timeline */}
      <div className="mb-8 space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-4">
          The Flashing Process — click each step to learn more
        </h2>
        {steps.map((step, idx) => {
          const Icon = step.icon
          const isOpen = openSteps.has(step.id)
          const isRead = openSteps.has(step.id)
          return (
            <div key={step.id} className="flex gap-4">
              {/* Timeline connector */}
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-colors",
                    isRead ? "bg-green-500/20 text-green-400" : "bg-muted text-muted-foreground"
                  )}
                >
                  {isRead ? <CheckCircle2 className="h-4 w-4" /> : step.number}
                </div>
                {idx < steps.length - 1 && (
                  <div className={cn("mt-1 w-px flex-1 min-h-[1.5rem]", isRead ? "bg-green-500/30" : "bg-border/50")} />
                )}
              </div>

              {/* Step card */}
              <Card
                className={cn(
                  "mb-2 flex-1 border-border/50 bg-card/50 overflow-hidden transition-colors",
                  isRead && "border-cyan-500/30"
                )}
              >
                <button
                  onClick={() => toggleStep(step.id)}
                  className="flex w-full items-center gap-4 p-4 text-left"
                >
                  <div
                    className={cn(
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                      step.iconBg
                    )}
                  >
                    <Icon className={cn("h-4 w-4", step.iconColor)} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{step.title}</p>
                  </div>
                  <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="border-t border-border/50 px-4 py-3">
                        <p className="text-sm text-muted-foreground">{step.explanation}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </div>
          )
        })}
      </div>

      {/* Progress notice */}
      {!allStepsRead && (
        <div className="mb-6 rounded-lg border border-cyan-500/30 bg-cyan-500/5 p-4 text-sm text-cyan-300 text-center">
          Read all {steps.length} steps to unlock the quiz ({openSteps.size}/{steps.length} read)
        </div>
      )}

      {/* Quiz */}
      <AnimatePresence>
        {allStepsRead && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3">
              <Cpu className="h-5 w-5 text-cyan-400" />
              <h2 className="text-lg font-semibold">Quiz — answer both correctly to complete</h2>
            </div>

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

            <AnimatePresence>
              {allAnswered && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <Card
                    className={cn(
                      "border",
                      allCorrect
                        ? "border-green-500/30 bg-green-500/5"
                        : "border-amber-500/30 bg-amber-500/5"
                    )}
                  >
                    <CardContent className="py-6 text-center">
                      {allCorrect ? (
                        <>
                          <CheckCircle2 className="h-10 w-10 text-green-500 mx-auto mb-3" />
                          <h3 className="mb-2 text-xl font-bold">Perfect!</h3>
                          <p className="mb-6 text-sm text-muted-foreground">
                            You understand the flashing process. On to debugging!
                          </p>
                          <Button asChild>
                            <Link to="/app/level/5.2">
                              Continue to Level 5.2
                              <ChevronRight className="ml-2 h-4 w-4" />
                            </Link>
                          </Button>
                        </>
                      ) : (
                        <>
                          <p className="mb-4 text-sm text-muted-foreground">
                            Review the explanations and try the quiz again.
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
