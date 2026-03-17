import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  XCircle,
  Code2,
  Cpu,
  Zap,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useProgressStore } from "@/stores/progressStore"
import { Link } from "react-router-dom"

interface Step {
  id: string
  number: number
  title: string
  explanation: string
  code?: string
}

const steps: Step[] = [
  {
    id: "what",
    number: 1,
    title: "What is a Lambda?",
    explanation:
      "A lambda is a block of C++ code embedded directly inside your ESPHome YAML. It lets you add custom logic that standard components can't express — conditional checks, math, multi-step reactions — without writing a full custom component.",
    code: `# Minimal lambda example
sensor:
  - platform: template
    name: "Adjusted Temp"
    lambda: 'return id(raw_temp).state - 2.5;'
    update_interval: 5s`,
  },
  {
    id: "syntax",
    number: 2,
    title: "Lambda Syntax",
    explanation:
      "Single-line lambdas use single quotes. Multi-line lambdas use the YAML block scalar |-. Inside the lambda, the variable x holds the current sensor value when used in on_value triggers. Terminate statements with semicolons — it's C++.",
    code: `binary_sensor:
  - platform: gpio
    pin: GPIO4
    on_press:
      then:
        lambda: |-
          if (id(my_light).current_values.is_on()) {
            id(my_light).turn_off();
          } else {
            id(my_light).turn_on();
          }`,
  },
  {
    id: "id",
    number: 3,
    title: "Accessing Components with id()",
    explanation:
      "You call any component defined in your config using id(component_id). From there you can read its state with .state, or call actions like .turn_on(), .turn_off(), .toggle(), and .publish_state(). The id must match the id: field of the target component.",
    code: `light:
  - platform: binary
    name: "My Light"
    id: my_light      # <-- referenced as id(my_light)
    output: out_pin

sensor:
  - platform: dht
    temperature:
      name: "Temperature"
      id: temp_sensor   # <-- read as id(temp_sensor).state`,
  },
  {
    id: "example",
    number: 4,
    title: "Practical Example — Fan on Temperature",
    explanation:
      "Here a sensor's on_value trigger fires every time a new reading arrives. The lambda checks the current value (x) and turns a fan on or off accordingly. This logic cannot be expressed in standard YAML automations alone.",
    code: `sensor:
  - platform: dht
    temperature:
      name: "Room Temp"
      id: room_temp
      on_value:
        then:
          lambda: |-
            if (x > 30.0f) {
              id(cooling_fan).turn_on();
            } else {
              id(cooling_fan).turn_off();
            }`,
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
    question: "Which syntax correctly calls a component action inside a lambda?",
    answers: [
      { id: "a", text: "component.turn_on()" },
      { id: "b", text: "id(component_id).turn_on()" },
      { id: "c", text: "esphome.call(component_id, 'turn_on')" },
      { id: "d", text: "{{ states('component_id') }}" },
    ],
    correctId: "b",
    explanation:
      "ESPHome uses id(component_id) to reference any component defined with an id: field. From there you can call actions like .turn_on() or read .state.",
  },
  {
    id: "q2",
    question: "In a lambda triggered by on_value:, what does the variable x hold?",
    answers: [
      { id: "a", text: "The component's id string" },
      { id: "b", text: "The previous sensor reading" },
      { id: "c", text: "The current sensor value" },
      { id: "d", text: "A loop counter" },
    ],
    correctId: "c",
    explanation:
      "Inside an on_value lambda, x is automatically populated with the freshly received sensor value — the same value that triggered the callback.",
  },
]

export function Level6_1() {
  const [openSteps, setOpenSteps] = useState<Set<string>>(new Set())
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState<Record<string, boolean>>({})

  const { completeLevel, completedLevels } = useProgressStore()
  const isCompleted = completedLevels.includes("6.1")
  const allStepsRead = openSteps.size === steps.length

  const toggleStep = (id: string) => {
    const next = new Set(openSteps)
    next.has(id) ? next.delete(id) : next.add(id)
    setOpenSteps(next)
  }

  const handleAnswer = (questionId: string, answerId: string) => {
    if (submitted[questionId]) return
    const newAnswers = { ...answers, [questionId]: answerId }
    const newSubmitted = { ...submitted, [questionId]: true }
    setAnswers(newAnswers)
    setSubmitted(newSubmitted)
    if (
      Object.keys(newSubmitted).length === questions.length &&
      questions.every((q) => newAnswers[q.id] === q.correctId)
    ) {
      completeLevel("6.1")
    }
  }

  const allAnswered = Object.keys(submitted).length === questions.length
  const allCorrect = questions.every((q) => answers[q.id] === q.correctId)

  const reset = () => {
    setAnswers({})
    setSubmitted({})
  }

  return (
    <div className="mx-auto max-w-4xl p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="mb-4 flex items-center gap-2">
          <Badge className="bg-pink-500/20 text-pink-400">Phase 6</Badge>
          <Badge variant="outline">Level 6.1</Badge>
          {isCompleted && (
            <Badge className="bg-green-500/20 text-green-400">
              <CheckCircle2 className="mr-1 h-3 w-3" /> Completed
            </Badge>
          )}
        </div>
        <h1 className="mb-2 text-3xl font-bold">Lambdas</h1>
        <p className="text-lg text-muted-foreground">
          Embed C++ logic directly in your YAML — the most powerful ESPHome feature.
        </p>
      </div>

      {/* Steps */}
      <div className="mb-8 space-y-3">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Core concepts — click each to expand
        </h2>
        {steps.map((step, idx) => {
          const isOpen = openSteps.has(step.id)
          return (
            <div key={step.id} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-colors",
                    isOpen ? "bg-pink-500/20 text-pink-400" : "bg-muted text-muted-foreground",
                  )}
                >
                  {isOpen ? <CheckCircle2 className="h-4 w-4" /> : step.number}
                </div>
                {idx < steps.length - 1 && (
                  <div
                    className={cn(
                      "mt-1 w-px flex-1 min-h-[1.5rem]",
                      isOpen ? "bg-pink-500/30" : "bg-border/50",
                    )}
                  />
                )}
              </div>
              <Card
                className={cn(
                  "mb-2 flex-1 overflow-hidden border-border/50 bg-card/50 transition-colors",
                  isOpen && "border-pink-500/30",
                )}
              >
                <button
                  onClick={() => toggleStep(step.id)}
                  className="flex w-full items-center gap-4 p-4 text-left"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-pink-500/20">
                    <Zap className="h-4 w-4 text-pink-400" />
                  </div>
                  <p className="flex-1 text-sm font-medium">{step.title}</p>
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
                      <div className="border-t border-border/50 px-4 py-3 space-y-3">
                        <p className="text-sm text-muted-foreground">{step.explanation}</p>
                        {step.code && (
                          <div className="rounded-lg border border-border/50 bg-gray-950 p-3">
                            <pre className="font-mono text-xs leading-relaxed text-green-400 overflow-x-auto">
                              {step.code}
                            </pre>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </div>
          )
        })}
      </div>

      {!allStepsRead && (
        <div className="mb-6 rounded-lg border border-pink-500/30 bg-pink-500/5 p-4 text-center text-sm text-pink-300">
          Read all {steps.length} concepts to unlock the quiz ({openSteps.size}/{steps.length} read)
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
              <Cpu className="h-5 w-5 text-pink-400" />
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
                    isSubmitted && userAnswer !== q.correctId && "border-red-500/30",
                  )}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start gap-3">
                      <div
                        className={cn(
                          "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                          isSubmitted && userAnswer === q.correctId
                            ? "bg-green-500/20 text-green-400"
                            : isSubmitted
                              ? "bg-red-500/20 text-red-400"
                              : "bg-muted text-muted-foreground",
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
                                    : "border-border/50 hover:border-border hover:bg-muted/50",
                            )}
                          >
                            <div
                              className={cn(
                                "flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-xs font-bold",
                                showCorrect
                                  ? "bg-green-500/20"
                                  : showWrong
                                    ? "bg-red-500/20"
                                    : "bg-muted",
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
                                : "border border-red-500/30 bg-red-500/5 text-red-300",
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
                        : "border-amber-500/30 bg-amber-500/5",
                    )}
                  >
                    <CardContent className="py-6 text-center">
                      {allCorrect ? (
                        <>
                          <Code2 className="mx-auto mb-3 h-10 w-10 text-green-500" />
                          <h3 className="mb-2 text-xl font-bold">Lambda mastered!</h3>
                          <p className="mb-6 text-sm text-muted-foreground">
                            You can now embed C++ logic directly in your configs.
                          </p>
                          <Button asChild>
                            <Link to="/app/level/6.2">
                              Continue to Level 6.2
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
