import React, { useMemo, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Check, X, RefreshCcw, BookOpen, GraduationCap } from "lucide-react"

// ---------- Quiz Content ----------
const quizQuestions = [
  {
    id: 1,
    question: "What does LLM stand for, and what is its core job?",
    options: [
      "Large Language Model; to translate text to multiple languages",
      "Large Language Model; to predict the next token in a sequence",
      "Large Linear Model; to store training data",
      "Long Linguistic Memory; to recall past conversations",
    ],
    answerIndex: 1,
    expl: "An LLM is trained to predict the next token. Chaining predictions yields coherent text/code.",
  },
  {
    id: 2,
    question: "In LLMs, what are tokens?",
    options: [
      "Cryptographic keys used for security",
      "Small chunks of text (e.g., 'dog', 'un', 'able') that the model processes",
      "Training parameters in the neural network",
      "Special commands that trigger API calls",
    ],
    answerIndex: 1,
    expl: "Models operate on tokens—subword units or words—rather than raw strings.",
  },
  {
    id: 3,
    question: "What is the attention mechanism in transformers?",
    options: [
      "A way for the model to focus on the most relevant parts of the input sequence",
      "A memory system that stores all past interactions permanently",
      "A GPU optimization to speed up training",
      "A process to remove hallucinations",
    ],
    answerIndex: 0,
    expl: "Attention scores relationships among tokens, letting the model focus contextually.",
  },
  {
    id: 4,
    question: "Which of the following is a weakness of LLMs?",
    options: [
      "They are always up-to-date with new information",
      "They never hallucinate",
      "They have limited memory due to context windows",
      "They cannot generate text",
    ],
    answerIndex: 2,
    expl: "Context windows bound how much text a model can consider at once.",
  },
  {
    id: 5,
    question: "Why do techniques like RAG or MCP exist if LLMs are powerful on their own?",
    options: [
      "To make them slower and more secure",
      "To extend them with external knowledge and tools, addressing cutoff & hallucinations",
      "To reduce their number of tokens",
      "To stop them from predicting the next token",
    ],
    answerIndex: 1,
    expl: "RAG provides fresh knowledge; MCP provides safe tool access—both augment core LLMs.",
  },
]

// ---------- Flashcards ----------
const flashcards = [
  {
    front: "LLM (what it does)",
    back: "Predicts the next token; transformer + attention enable contextual generation.",
  },
  {
    front: "Token",
    back: "A chunk of text (word/subword). Models operate over sequences of tokens.",
  },
  { front: "Attention", back: "Scores relevance between tokens so the model focuses on important context." },
  { front: "Context Window", back: "The max number of tokens the model can consider at once." },
  { front: "RAG vs MCP", back: "RAG = knowledge grounding. MCP = tool/action standardization. Complementary." },
]

// ---------- Fill-in-the-blank ----------
const fillBlanks = [
  { id: "fb1", sentence: "An LLM is trained to predict the next ____ in a sequence.", answer: "token" },
  { id: "fb2", sentence: "Transformers rely on the ________ mechanism to focus on relevant context.", answer: "attention" },
  { id: "fb3", sentence: "The ________ window limits how much text the model can consider at once.", answer: "context" },
]

// ---------- Helpers ----------
const normalize = (s: string) => s.trim().toLowerCase()

// ---------- Quiz Component ----------
function Quiz() {
  const [selected, setSelected] = useState<Record<number, number | null>>(
    Object.fromEntries(quizQuestions.map((q) => [q.id, null]))
  )
  const [submitted, setSubmitted] = useState(false)

  const score = useMemo(
    () => quizQuestions.reduce((acc, q) => acc + (submitted && selected[q.id] === q.answerIndex ? 1 : 0), 0),
    [submitted, selected]
  )

  const progress = useMemo(
    () => Math.round((Object.values(selected).filter((v) => v !== null).length / quizQuestions.length) * 100),
    [selected]
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Badge className="text-sm">Day 1 • Quiz</Badge>
        <div className="flex items-center gap-3">
          <div className="w-40"><Progress value={progress} /></div>
          <span className="text-sm text-muted-foreground">{progress}%</span>
        </div>
      </div>

      {quizQuestions.map((q, idx) => {
        const isCorrect = submitted && selected[q.id] === q.answerIndex
        const isWrong = submitted && selected[q.id] !== q.answerIndex
        return (
          <Card key={q.id} className="rounded-2xl border">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-medium">
                  {idx + 1}
                </span>
                {q.question}
                {submitted && (isCorrect
                  ? <Badge variant="secondary" className="ml-2 flex items-center gap-1"><Check className="h-3 w-3" /> Correct</Badge>
                  : <Badge variant="destructive" className="ml-2 flex items-center gap-1"><X className="h-3 w-3" /> Review</Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <RadioGroup
                value={selected[q.id] !== null ? String(selected[q.id]) : undefined}
                onValueChange={(val) => setSelected((s) => ({ ...s, [q.id]: Number(val) }))}
              >
                {q.options.map((opt, i) => (
                  <Label key={i} htmlFor={`q${q.id}-opt${i}`} className="flex items-center gap-3 p-3 rounded-xl border cursor-pointer hover:bg-muted">
                    <RadioGroupItem id={`q${q.id}-opt${i}`} value={String(i)} />
                    <span>{opt}</span>
                  </Label>
                ))}
              </RadioGroup>
              <AnimatePresence>
                {submitted && (
                  <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="text-sm text-muted-foreground">
                    <span className="font-medium">Why:</span> {q.expl}
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        )
      })}

      <div className="flex justify-between pt-2">
        <div className="text-sm text-muted-foreground">
          {submitted ? `Score: ${score} / ${quizQuestions.length}` : "Choose options, then submit."}
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => window.location.reload()} className="rounded-2xl">
            <RefreshCcw className="h-4 w-4 mr-2" /> Reset
          </Button>
          <Button onClick={() => setSubmitted(true)} className="rounded-2xl">
            <GraduationCap className="h-4 w-4 mr-2" /> Submit
          </Button>
        </div>
      </div>
    </div>
  )
}

// ---------- Flashcards ----------
function Flashcards() {
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <Badge>Flashcards</Badge>
        <div className="text-sm text-muted-foreground">{index + 1} / {flashcards.length}</div>
      </div>
      <div className="grid place-items-center">
        <motion.div
          className="w-full max-w-xl"
          initial={false}
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.5 }}
          onClick={() => setFlipped((f) => !f)}
        >
          <Card className="rounded-2xl cursor-pointer min-h-[180px] [transform-style:preserve-3d]">
            <CardContent className="p-6 grid place-items-center min-h-[180px] relative">
              <div className="absolute inset-0 grid place-items-center backface-hidden">
                <div className="text-xl font-semibold">{flashcards[index].front}</div>
              </div>
              <div className="absolute inset-0 grid place-items-center rotate-y-180 backface-hidden">
                <div className="text-lg">{flashcards[index].back}</div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      <div className="flex justify-center gap-2">
        <Button variant="secondary" onClick={() => { setFlipped(false); setIndex((i) => (i - 1 + flashcards.length) % flashcards.length) }}>Prev</Button>
        <Button onClick={() => { setFlipped(false); setIndex((i) => (i + 1) % flashcards.length) }}>Next</Button>
      </div>
    </div>
  )
}

// ---------- Fill-in-the-blank ----------
function FillInTheBlank() {
  const [values, setValues] = useState<Record<string, string>>({})
  const [checked, setChecked] = useState(false)

  const correctCount = useMemo(() =>
    checked ? fillBlanks.reduce((acc, f) => acc + (normalize(values[f.id] || "") === f.answer ? 1 : 0), 0) : 0,
    [checked, values]
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <Badge variant="outline">Fill in the Blank</Badge>
        <div className="text-sm text-muted-foreground">
          {checked ? `Score: ${correctCount} / ${fillBlanks.length}` : "Type your answers, then check."}
        </div>
      </div>
      {fillBlanks.map((item) => (
        <Card key={item.id} className="rounded-2xl">
          <CardContent className="p-5">
            <div>
              {item.sentence.split("____").map((part, idx, arr) => (
                <span key={idx}>
                  {part}
                  {idx < arr.length - 1 && (
                    <Input
                      placeholder="answer"
                      className="inline-block w-40 mx-2"
                      value={values[item.id] || ""}
                      onChange={(e) => setValues((v) => ({ ...v, [item.id]: e.target.value }))}
                    />
                  )}
                </span>
              ))}
            </div>
            {checked && <div className="text-sm text-muted-foreground">Correct: <span className="font-medium">{item.answer}</span></div>}
          </CardContent>
        </Card>
      ))}
      <div className="flex justify-end gap-2">
        <Button variant="secondary" onClick={() => { setValues({}); setChecked(false) }} className="rounded-2xl">
          <RefreshCcw className="h-4 w-4 mr-2" /> Reset
        </Button>
        <Button onClick={() => setChecked(true)} className="rounded-2xl">Check Answers</Button>
      </div>
    </div>
  )
}

// ---------- Main App ----------
export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-8 px-4 sm:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <BookOpen className="h-6 w-6" />
          <h1 className="text-2xl sm:text-3xl font-bold">Day 1 — LLMs 101 Interactive</h1>
        </div>
        <p className="text-muted-foreground">
          Practice what you learned: take the quiz, flip through flashcards, and complete fill-in-the-blank prompts.
        </p>
        <Tabs defaultValue="quiz">
          <TabsList className="grid grid-cols-3 rounded-2xl">
            <TabsTrigger value="quiz">Quiz</TabsTrigger>
            <TabsTrigger value="flash">Flashcards</TabsTrigger>
            <TabsTrigger value="fill">Fill-in-the-Blank</TabsTrigger>
          </TabsList>
          <TabsContent value="quiz" className="mt-4"><Quiz /></TabsContent>
          <TabsContent value="flash" className="mt-4"><Flashcards /></TabsContent>
          <TabsContent value="fill" className="mt-4"><FillInTheBlank /></TabsContent>
        </Tabs>
        <Separator />
        <div className="text-xs text-muted-foreground">
          Tip: After you finish, try explaining “what an LLM does” out loud in one minute. Teaching locks it in.
        </div>
      </div>
    </div>
  )
}
