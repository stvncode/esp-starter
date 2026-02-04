import { useState, useCallback, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  CheckCircle2,
  ChevronRight,
  Code2,
  GripVertical,
  XCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useProgressStore } from "@/stores/progressStore"
import { Link } from "react-router-dom"

interface QuizItem {
  id: string
  yaml: string
  explanation: string
  color: string
}

const quizItems: QuizItem[] = [
  {
    id: "binary_sensor",
    yaml: "binary_sensor:",
    explanation: "A category for things that are either ON or OFF — like buttons, motion sensors, door contacts",
    color: "text-blue-400",
  },
  {
    id: "platform_gpio",
    yaml: "platform: gpio",
    explanation: "This component is connected directly to a GPIO pin on the board",
    color: "text-cyan-400",
  },
  {
    id: "pin",
    yaml: "pin: GPIO4",
    explanation: "Which physical pin on the board this component uses",
    color: "text-green-400",
  },
  {
    id: "name",
    yaml: 'name: "My Button"',
    explanation: "The friendly name you'll see in Home Assistant",
    color: "text-purple-400",
  },
  {
    id: "on_press",
    yaml: "on_press:",
    explanation: "What should happen when this button is pressed",
    color: "text-amber-400",
  },
  {
    id: "then",
    yaml: "then:",
    explanation: "Here comes the list of actions to perform",
    color: "text-orange-400",
  },
  {
    id: "light_turn_on",
    yaml: "- light.turn_on: my_light",
    explanation: "Turn on the light that has the ID 'my_light'",
    color: "text-red-400",
  },
  {
    id: "id",
    yaml: "id: my_light",
    explanation: "A short internal name so other parts of the config can reference this component",
    color: "text-pink-400",
  },
]

export function Level2_2() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [shuffledAnswers, setShuffledAnswers] = useState<QuizItem[]>([])
  const [quizComplete, setQuizComplete] = useState(false)

  const { completeLevel, completedLevels } = useProgressStore()
  const isCompleted = completedLevels.includes("2.2")

  const currentItem = quizItems[currentQuestion]

  // Start quiz
  const startQuiz = useCallback(() => {
    setCurrentQuestion(0)
    setScore(0)
    setQuizComplete(false)
    const otherItems = quizItems.filter((_, i) => i !== 0)
    const shuffled = [...otherItems].sort(() => Math.random() - 0.5).slice(0, 3)
    shuffled.push(quizItems[0])
    setShuffledAnswers(shuffled.sort(() => Math.random() - 0.5))
  }, [])

  // Initialize answers when question changes
  useEffect(() => {
    const otherItems = quizItems.filter((_, i) => i !== currentQuestion)
    const shuffled = [...otherItems].sort(() => Math.random() - 0.5).slice(0, 3)
    shuffled.push(quizItems[currentQuestion])
    setShuffledAnswers(shuffled.sort(() => Math.random() - 0.5))
  }, [currentQuestion])

  const handleAnswer = useCallback(
    (answerId: string) => {
      if (showResult) return
      setSelectedAnswer(answerId)
      setShowResult(true)

      if (answerId === currentItem.id) {
        setScore((prev) => prev + 1)
      }
    },
    [currentItem, showResult]
  )

  const nextQuestion = useCallback(() => {
    if (currentQuestion < quizItems.length - 1) {
      const nextQ = currentQuestion + 1
      setCurrentQuestion(nextQ)
      const otherItems = quizItems.filter((_, i) => i !== nextQ)
      const shuffled = [...otherItems].sort(() => Math.random() - 0.5).slice(0, 3)
      shuffled.push(quizItems[nextQ])
      setShuffledAnswers(shuffled.sort(() => Math.random() - 0.5))
      setSelectedAnswer(null)
      setShowResult(false)
    } else {
      setQuizComplete(true)
      if (score >= 6) {
        completeLevel("2.2")
      }
    }
  }, [currentQuestion, score, completeLevel])

  return (
    <div className="mx-auto max-w-4xl p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="mb-4 flex items-center gap-2">
          <Badge className="bg-blue-500/20 text-blue-400">Phase 2</Badge>
          <Badge variant="outline">Level 2.2</Badge>
          {isCompleted && (
            <Badge className="bg-green-500/20 text-green-400">
              <CheckCircle2 className="mr-1 h-3 w-3" /> Completed
            </Badge>
          )}
        </div>
        <h1 className="mb-2 text-3xl font-bold">Understanding the Structure</h1>
        <p className="text-lg text-muted-foreground">
          Learn the vocabulary of ESPHome YAML by matching code to its meaning.
        </p>
      </div>

      {/* Quiz Card */}
      <Card className="border-border/50 bg-card/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Code2 className="h-5 w-5 text-blue-400" />
              <CardTitle>YAML Vocabulary Quiz</CardTitle>
            </div>
            {!quizComplete && (
              <Badge variant="secondary">
                Question {currentQuestion + 1} of {quizItems.length}
              </Badge>
            )}
          </div>
          {!quizComplete && (
            <div className="mt-4">
              <div className="mb-2 flex justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">
                  {score} correct
                </span>
              </div>
              <Progress value={(currentQuestion / quizItems.length) * 100} />
            </div>
          )}
        </CardHeader>

        <CardContent>
          {!quizComplete ? (
            <>
              {/* Question */}
              <div className="mb-8">
                <p className="mb-4 text-sm text-muted-foreground">
                  What does this YAML mean?
                </p>
                <div className="rounded-xl border border-border/50 bg-gray-100 dark:bg-gray-900 p-6">
                  <pre className={cn("font-mono text-lg", currentItem.color)}>
                    {currentItem.yaml}
                  </pre>
                </div>
              </div>

              {/* Answers */}
              <div className="space-y-3">
                {shuffledAnswers.map((answer) => {
                  const isSelected = selectedAnswer === answer.id
                  const isCorrect = answer.id === currentItem.id
                  const showCorrect = showResult && isCorrect
                  const showWrong = showResult && isSelected && !isCorrect

                  return (
                    <motion.button
                      key={answer.id}
                      onClick={() => handleAnswer(answer.id)}
                      disabled={showResult}
                      whileHover={!showResult ? { scale: 1.01 } : {}}
                      whileTap={!showResult ? { scale: 0.99 } : {}}
                      className={cn(
                        "flex w-full items-center gap-4 rounded-xl border-2 p-4 text-left transition-all",
                        showCorrect
                          ? "border-green-500 bg-green-500/10"
                          : showWrong
                            ? "border-red-500 bg-red-500/10"
                            : isSelected
                              ? "border-primary bg-primary/5"
                              : "border-border/50 hover:border-border hover:bg-muted/50"
                      )}
                    >
                      <div
                        className={cn(
                          "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                          showCorrect
                            ? "bg-green-500/20"
                            : showWrong
                              ? "bg-red-500/20"
                              : "bg-muted"
                        )}
                      >
                        {showCorrect ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        ) : showWrong ? (
                          <XCircle className="h-5 w-5 text-red-500" />
                        ) : (
                          <GripVertical className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                      <p
                        className={cn(
                          "text-sm",
                          showCorrect
                            ? "text-green-400"
                            : showWrong
                              ? "text-red-400"
                              : "text-foreground"
                        )}
                      >
                        {answer.explanation}
                      </p>
                    </motion.button>
                  )
                })}
              </div>

              {/* Next button */}
              <AnimatePresence>
                {showResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6"
                  >
                    <Button onClick={nextQuestion} className="w-full">
                      {currentQuestion < quizItems.length - 1
                        ? "Next Question"
                        : "See Results"}
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          ) : (
            /* Results */
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <div
                className={cn(
                  "mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full",
                  score >= 6 ? "bg-green-500/20" : "bg-amber-500/20"
                )}
              >
                <span className="text-4xl font-bold">
                  {score}/{quizItems.length}
                </span>
              </div>

              <h3 className="mb-2 text-2xl font-bold">
                {score >= 6 ? "Great job!" : "Keep practicing!"}
              </h3>
              <p className="mb-6 text-muted-foreground">
                {score >= 6
                  ? "You've got a solid grasp of YAML vocabulary!"
                  : "Try again to get at least 6 correct answers."}
              </p>

              <div className="flex gap-4 justify-center">
                {score < 6 && (
                  <Button variant="outline" onClick={startQuiz}>
                    Try Again
                  </Button>
                )}
                {score >= 6 && (
                  <Button asChild>
                    <Link to="/level/3.1">
                      Continue to Phase 3
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                )}
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
