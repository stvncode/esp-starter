import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Lightbulb,
  LightbulbOff,
  CircleDot,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Thermometer,
  Fan,
  Activity,
  Bell,
  ToggleLeft,
  Zap,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useProgressStore } from "@/stores/progressStore"
import { Link } from "react-router-dom"

interface Scenario {
  id: string
  input: { icon: React.ElementType; label: string; color: string }
  output: { icon: React.ElementType; label: string; color: string }
}

const scenarios: Scenario[] = [
  {
    id: "motion-alarm",
    input: { icon: Activity, label: "Motion Sensor", color: "text-purple-400" },
    output: { icon: Bell, label: "Alarm", color: "text-red-400" },
  },
  {
    id: "temp-fan",
    input: { icon: Thermometer, label: "Temperature Sensor", color: "text-orange-400" },
    output: { icon: Fan, label: "Fan", color: "text-cyan-400" },
  },
  {
    id: "switch-relay",
    input: { icon: ToggleLeft, label: "Switch", color: "text-green-400" },
    output: { icon: Zap, label: "Relay", color: "text-yellow-400" },
  },
]

export function Level1_1() {
  const [isLightOn, setIsLightOn] = useState(false)
  const [showExplanation, setShowExplanation] = useState(false)
  const [challengeStarted, setChallengeStarted] = useState(false)
  const [answers, setAnswers] = useState<Record<string, "input" | "output" | null>>({})
  const [challengeComplete, setChallengeComplete] = useState(false)

  const { completeLevel, completedLevels } = useProgressStore()
  const isCompleted = completedLevels.includes("1.1")

  const handleButtonClick = () => {
    setIsLightOn(true)
    setTimeout(() => setShowExplanation(true), 800)
  }

  const handleAnswer = (scenarioId: string, component: "input" | "output", answer: "input" | "output") => {
    const key = `${scenarioId}-${component}`
    setAnswers((prev) => ({ ...prev, [key]: answer }))

    // Check if all answers are correct
    const newAnswers = { ...answers, [key]: answer }
    const allCorrect = scenarios.every(
      (s) => newAnswers[`${s.id}-input`] === "input" && newAnswers[`${s.id}-output`] === "output"
    )

    if (allCorrect) {
      setChallengeComplete(true)
      completeLevel("1.1")
    }
  }

  const isCorrect = (scenarioId: string, component: "input" | "output") => {
    const key = `${scenarioId}-${component}`
    return answers[key] === component
  }

  const isWrong = (scenarioId: string, component: "input" | "output") => {
    const key = `${scenarioId}-${component}`
    return answers[key] !== null && answers[key] !== component
  }

  return (
    <div className="mx-auto max-w-4xl p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="mb-4 flex items-center gap-2">
          <Badge className="bg-amber-500/20 text-amber-400">Phase 1</Badge>
          <Badge variant="outline">Level 1.1</Badge>
          {isCompleted && (
            <Badge className="bg-green-500/20 text-green-400">
              <CheckCircle2 className="mr-1 h-3 w-3" /> Completed
            </Badge>
          )}
        </div>
        <h1 className="mb-2 text-3xl font-bold">What is a Smart Device?</h1>
        <p className="text-lg text-muted-foreground">
          Understanding the fundamental pattern: inputs trigger actions, outputs respond.
        </p>
      </div>

      {/* Interactive Demo */}
      <Card className="mb-8 overflow-hidden border-border/50 bg-card/50">
        <CardHeader>
          <CardTitle className="text-lg">Interactive Demo</CardTitle>
          <CardDescription>
            Click the button to see the basic smart device pattern in action.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center gap-8 py-12">
            {/* Button (Input) */}
            <motion.button
              onClick={handleButtonClick}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group relative flex h-32 w-32 flex-col items-center justify-center rounded-2xl border-2 border-blue-500/50 bg-gradient-to-br from-blue-500/20 to-blue-600/20 transition-colors hover:border-blue-400"
            >
              <motion.div
                animate={isLightOn ? { scale: [1, 0.9, 1] } : {}}
                transition={{ duration: 0.2 }}
              >
                <CircleDot className="mb-2 h-12 w-12 text-blue-400" />
              </motion.div>
              <span className="text-sm font-medium text-blue-300">Button</span>
              <span className="absolute -bottom-6 text-xs text-muted-foreground">
                (Input)
              </span>
              {!isLightOn && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute -top-8 rounded-full bg-blue-500/20 px-3 py-1 text-xs text-blue-400"
                >
                  Click me!
                </motion.span>
              )}
            </motion.button>

            {/* Arrow / Signal */}
            <div className="flex flex-col items-center gap-2">
              <AnimatePresence>
                {isLightOn && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, x: -20 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    className="rounded-lg bg-gradient-to-r from-blue-500/20 to-amber-500/20 px-4 py-2"
                  >
                    <span className="text-sm font-medium text-foreground">Signal</span>
                  </motion.div>
                )}
              </AnimatePresence>
              <motion.div
                animate={isLightOn ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                <ArrowRight
                  className={cn(
                    "h-8 w-8 transition-colors duration-300",
                    isLightOn ? "text-amber-400" : "text-muted-foreground/30"
                  )}
                />
              </motion.div>
            </div>

            {/* Light (Output) */}
            <motion.div
              animate={isLightOn ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 0.3 }}
              className={cn(
                "relative flex h-32 w-32 flex-col items-center justify-center rounded-2xl border-2 transition-all duration-500",
                isLightOn
                  ? "border-amber-400 bg-gradient-to-br from-amber-500/30 to-yellow-500/30"
                  : "border-border/50 bg-muted/20"
              )}
            >
              {isLightOn && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 0.5, scale: 2 }}
                  className="absolute inset-0 rounded-2xl bg-amber-400 blur-2xl"
                />
              )}
              <motion.div
                animate={isLightOn ? { rotate: [0, 5, -5, 0] } : {}}
                transition={{ duration: 0.3 }}
                className="relative"
              >
                {isLightOn ? (
                  <Lightbulb className="mb-2 h-12 w-12 text-amber-400" />
                ) : (
                  <LightbulbOff className="mb-2 h-12 w-12 text-muted-foreground" />
                )}
              </motion.div>
              <span
                className={cn(
                  "text-sm font-medium transition-colors",
                  isLightOn ? "text-amber-300" : "text-muted-foreground"
                )}
              >
                Light
              </span>
              <span className="absolute -bottom-6 text-xs text-muted-foreground">
                (Output)
              </span>
            </motion.div>
          </div>

          {/* Explanation */}
          <AnimatePresence>
            {showExplanation && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mt-8 rounded-xl bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-amber-500/10 p-6"
              >
                <h3 className="mb-3 text-lg font-semibold">
                  Every smart device follows this pattern:
                </h3>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-lg bg-blue-500/10 p-4">
                    <div className="mb-2 flex items-center gap-2 text-blue-400">
                      <CircleDot className="h-5 w-5" />
                      <span className="font-semibold">Input</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Something that triggers an action — buttons, sensors, switches,
                      schedules.
                    </p>
                  </div>
                  <div className="rounded-lg bg-purple-500/10 p-4">
                    <div className="mb-2 flex items-center gap-2 text-purple-400">
                      <ArrowRight className="h-5 w-5" />
                      <span className="font-semibold">Logic</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      The "brain" that decides what happens when the input is triggered.
                    </p>
                  </div>
                  <div className="rounded-lg bg-amber-500/10 p-4">
                    <div className="mb-2 flex items-center gap-2 text-amber-400">
                      <Lightbulb className="h-5 w-5" />
                      <span className="font-semibold">Output</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Something that responds — lights, relays, buzzers, displays.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Challenge */}
      {showExplanation && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-border/50 bg-card/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500/20 text-xs font-bold text-amber-400">
                      ?
                    </span>
                    Challenge
                  </CardTitle>
                  <CardDescription>
                    Identify the input and output in each scenario.
                  </CardDescription>
                </div>
                {challengeComplete && (
                  <Badge className="bg-green-500/20 text-green-400">
                    <CheckCircle2 className="mr-1 h-3 w-3" /> Complete!
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {!challengeStarted ? (
                <Button onClick={() => setChallengeStarted(true)} className="w-full">
                  Start Challenge
                </Button>
              ) : (
                <div className="space-y-6">
                  {scenarios.map((scenario) => {
                    const InputIcon = scenario.input.icon
                    const OutputIcon = scenario.output.icon

                    return (
                      <div
                        key={scenario.id}
                        className="rounded-xl border border-border/50 bg-muted/20 p-4"
                      >
                        <div className="flex items-center justify-between gap-4">
                          {/* Input Component */}
                          <div className="flex flex-1 flex-col items-center gap-2">
                            <div
                              className={cn(
                                "flex h-16 w-16 items-center justify-center rounded-xl border-2 transition-all",
                                isCorrect(scenario.id, "input")
                                  ? "border-green-500 bg-green-500/20"
                                  : isWrong(scenario.id, "input")
                                    ? "border-red-500 bg-red-500/20"
                                    : "border-border/50 bg-muted/30"
                              )}
                            >
                              <InputIcon className={cn("h-8 w-8", scenario.input.color)} />
                            </div>
                            <span className="text-sm font-medium">
                              {scenario.input.label}
                            </span>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant={
                                  answers[`${scenario.id}-input`] === "input"
                                    ? "default"
                                    : "outline"
                                }
                                onClick={() => handleAnswer(scenario.id, "input", "input")}
                                className={cn(
                                  "text-xs",
                                  isCorrect(scenario.id, "input") &&
                                    "bg-green-500 hover:bg-green-600"
                                )}
                              >
                                Input
                              </Button>
                              <Button
                                size="sm"
                                variant={
                                  answers[`${scenario.id}-input`] === "output"
                                    ? "default"
                                    : "outline"
                                }
                                onClick={() => handleAnswer(scenario.id, "input", "output")}
                                className={cn(
                                  "text-xs",
                                  isWrong(scenario.id, "input") &&
                                    "bg-red-500 hover:bg-red-600"
                                )}
                              >
                                Output
                              </Button>
                            </div>
                          </div>

                          {/* Arrow */}
                          <ArrowRight className="h-6 w-6 text-muted-foreground" />

                          {/* Output Component */}
                          <div className="flex flex-1 flex-col items-center gap-2">
                            <div
                              className={cn(
                                "flex h-16 w-16 items-center justify-center rounded-xl border-2 transition-all",
                                isCorrect(scenario.id, "output")
                                  ? "border-green-500 bg-green-500/20"
                                  : isWrong(scenario.id, "output")
                                    ? "border-red-500 bg-red-500/20"
                                    : "border-border/50 bg-muted/30"
                              )}
                            >
                              <OutputIcon className={cn("h-8 w-8", scenario.output.color)} />
                            </div>
                            <span className="text-sm font-medium">
                              {scenario.output.label}
                            </span>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant={
                                  answers[`${scenario.id}-output`] === "input"
                                    ? "default"
                                    : "outline"
                                }
                                onClick={() => handleAnswer(scenario.id, "output", "input")}
                                className={cn(
                                  "text-xs",
                                  isWrong(scenario.id, "output") &&
                                    "bg-red-500 hover:bg-red-600"
                                )}
                              >
                                Input
                              </Button>
                              <Button
                                size="sm"
                                variant={
                                  answers[`${scenario.id}-output`] === "output"
                                    ? "default"
                                    : "outline"
                                }
                                onClick={() => handleAnswer(scenario.id, "output", "output")}
                                className={cn(
                                  "text-xs",
                                  isCorrect(scenario.id, "output") &&
                                    "bg-green-500 hover:bg-green-600"
                                )}
                              >
                                Output
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}

                  {/* Progress */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span>
                        {
                          Object.entries(answers).filter(
                            ([key, val]) =>
                              (key.endsWith("-input") && val === "input") ||
                              (key.endsWith("-output") && val === "output")
                          ).length
                        }
                        /6 correct
                      </span>
                    </div>
                    <Progress
                      value={
                        (Object.entries(answers).filter(
                          ([key, val]) =>
                            (key.endsWith("-input") && val === "input") ||
                            (key.endsWith("-output") && val === "output")
                        ).length /
                          6) *
                        100
                      }
                    />
                  </div>
                </div>
              )}

              {/* Next Level */}
              {challengeComplete && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6"
                >
                  <Button asChild className="w-full" size="lg">
                    <Link to="/level/1.2">
                      Continue to Level 1.2
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
