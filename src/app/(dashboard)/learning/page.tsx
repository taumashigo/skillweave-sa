"use client";

import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play, Pause, CheckCircle2, ChevronRight, ChevronLeft, BookOpen,
  Video, FileText, Brain, Award, Clock, BarChart3, ArrowRight,
  RotateCcw, Flag, MessageSquare, LifeBuoy, Star, ThumbsUp,
  Lock, Volume2,
} from "lucide-react";
import { Button, Badge, Card, Progress, Separator, Input, Label } from "@/components/ui";
import { DashboardShell, PageHeader } from "@/components/layout/DashboardShell";
import { ProgressRing } from "@/components/shared/ProgressRing";
import { cn } from "@/lib/utils";

// Mock lesson content for a module
const mockLessons = [
  { id: "l1", title: "Welcome & Course Overview", type: "video", duration: 8, completed: true },
  { id: "l2", title: "Variables and Data Types", type: "video", duration: 15, completed: true },
  { id: "l3", title: "Practice: Variables", type: "assessment", duration: 10, completed: true },
  { id: "l4", title: "Control Flow: If/Else", type: "video", duration: 18, completed: true },
  { id: "l5", title: "Loops and Iteration", type: "video", duration: 20, completed: true },
  { id: "l6", title: "Practice: Loops", type: "assessment", duration: 15, completed: false },
  { id: "l7", title: "Functions & Scope", type: "reading", duration: 12, completed: false },
  { id: "l8", title: "Data Structures: Lists & Dicts", type: "video", duration: 22, completed: false },
  { id: "l9", title: "Practice: Data Structures", type: "assessment", duration: 15, completed: false },
  { id: "l10", title: "Object-Oriented Programming", type: "video", duration: 25, completed: false },
  { id: "l11", title: "Final Project", type: "project", duration: 60, completed: false },
  { id: "l12", title: "Final Assessment", type: "assessment", duration: 30, completed: false },
];

const mockQuiz = {
  title: "Practice: Loops",
  questions: [
    {
      id: "q1",
      question: "What will this code print?\n\nfor i in range(3):\n    print(i)",
      options: ["1 2 3", "0 1 2", "0 1 2 3", "1 2"],
      correct: 1,
    },
    {
      id: "q2",
      question: "Which loop is best when you don't know how many times to iterate?",
      options: ["for loop", "while loop", "do-while loop", "foreach loop"],
      correct: 1,
    },
    {
      id: "q3",
      question: "What does the 'break' statement do inside a loop?",
      options: ["Skips current iteration", "Exits the loop entirely", "Restarts the loop", "Pauses execution"],
      correct: 1,
    },
    {
      id: "q4",
      question: "How do you loop through a dictionary's keys and values?",
      options: ["for k, v in dict.items()", "for k in dict.keys()", "for v in dict.values()", "for i in range(len(dict))"],
      correct: 0,
    },
    {
      id: "q5",
      question: "What is a list comprehension?",
      options: [
        "A way to understand lists better",
        "A compact way to create lists from iterables",
        "A function that lists all variables",
        "A debugging tool for lists",
      ],
      correct: 1,
    },
  ],
};

const typeIcons: Record<string, React.ElementType> = {
  video: Video,
  reading: FileText,
  assessment: Brain,
  project: Flag,
};

export default function LearningPage() {
  const [currentLesson, setCurrentLesson] = useState(5); // Index of current lesson (l6)
  const [view, setView] = useState<"lesson" | "quiz" | "result">("lesson");
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const lesson = mockLessons[currentLesson];
  const completedCount = mockLessons.filter((l) => l.completed).length;
  const progressPercent = Math.round((completedCount / mockLessons.length) * 100);

  const selectAnswer = (questionId: string, optionIndex: number) => {
    if (!quizSubmitted) {
      setQuizAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
    }
  };

  const submitQuiz = () => {
    setQuizSubmitted(true);
    setView("result");
  };

  const score = quizSubmitted
    ? mockQuiz.questions.filter((q) => quizAnswers[q.id] === q.correct).length
    : 0;
  const passed = score >= Math.ceil(mockQuiz.questions.length * 0.6);

  const retryQuiz = () => {
    setQuizAnswers({});
    setQuizSubmitted(false);
    setView("quiz");
  };

  const goNext = () => {
    if (currentLesson < mockLessons.length - 1) {
      setCurrentLesson(currentLesson + 1);
      setView("lesson");
      setQuizAnswers({});
      setQuizSubmitted(false);
    }
  };

  const goPrev = () => {
    if (currentLesson > 0) {
      setCurrentLesson(currentLesson - 1);
      setView("lesson");
      setQuizAnswers({});
      setQuizSubmitted(false);
    }
  };

  return (
    <DashboardShell>
      <div className="flex h-[calc(100vh-56px)] lg:h-screen overflow-hidden">
        {/* Sidebar — Lesson List */}
        <aside className={cn(
          "bg-white border-r border-slate-200 flex flex-col shrink-0 transition-all duration-300",
          sidebarOpen ? "w-[300px]" : "w-0 overflow-hidden",
          "hidden lg:flex"
        )}>
          <div className="p-4 border-b border-slate-100">
            <h2 className="text-sm font-semibold font-display text-slate-900 mb-1">
              Intro to Programming with Python
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span>{completedCount}/{mockLessons.length} lessons</span>
              <span>·</span>
              <span>{progressPercent}% complete</span>
            </div>
            <Progress value={progressPercent} className="mt-2 h-1.5" />
          </div>

          <nav className="flex-1 overflow-y-auto py-2">
            {mockLessons.map((l, i) => {
              const Icon = typeIcons[l.type] || BookOpen;
              const isCurrent = i === currentLesson;
              const isLocked = !l.completed && i > completedCount;
              return (
                <button
                  key={l.id}
                  onClick={() => {
                    if (!isLocked) {
                      setCurrentLesson(i);
                      setView("lesson");
                      setQuizAnswers({});
                      setQuizSubmitted(false);
                    }
                  }}
                  disabled={isLocked}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors",
                    isCurrent && "bg-emerald-50 border-r-2 border-emerald-500",
                    !isCurrent && !isLocked && "hover:bg-slate-50",
                    isLocked && "opacity-40 cursor-not-allowed"
                  )}
                >
                  <div className={cn(
                    "h-7 w-7 rounded-md flex items-center justify-center shrink-0 text-xs font-bold",
                    l.completed ? "bg-emerald-100 text-emerald-600" :
                    isCurrent ? "bg-emerald-500 text-white" :
                    "bg-slate-100 text-slate-400"
                  )}>
                    {l.completed ? <CheckCircle2 className="h-4 w-4" /> :
                     isLocked ? <Lock className="h-3.5 w-3.5" /> :
                     <Icon className="h-3.5 w-3.5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={cn("text-xs font-medium truncate", isCurrent ? "text-emerald-700" : "text-slate-700")}>
                      {l.title}
                    </div>
                    <div className="text-[10px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                      <span className="capitalize">{l.type}</span>
                      <span>·</span>
                      <Clock className="h-2.5 w-2.5" />
                      <span>{l.duration} min</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-hidden bg-slate-50/50">
          {/* Top Bar */}
          <div className="flex items-center justify-between px-6 py-3 bg-white border-b border-slate-200">
            <div className="flex items-center gap-3">
              <button onClick={goPrev} disabled={currentLesson === 0} className="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-30">
                <ChevronLeft className="h-4 w-4 text-slate-500" />
              </button>
              <div>
                <div className="text-sm font-medium text-slate-900">{lesson.title}</div>
                <div className="text-xs text-slate-400 capitalize">{lesson.type} · {lesson.duration} min</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {view === "lesson" && lesson.type === "assessment" && (
                <Button size="sm" onClick={() => setView("quiz")}>
                  <Brain className="h-4 w-4 mr-1.5" />Start Quiz
                </Button>
              )}
              <button onClick={goNext} disabled={currentLesson >= mockLessons.length - 1} className="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-30">
                <ChevronRight className="h-4 w-4 text-slate-500" />
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-6">
            <AnimatePresence mode="wait">
              {/* === LESSON VIEW === */}
              {view === "lesson" && (
                <motion.div key="lesson" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-3xl mx-auto">
                  {lesson.type === "video" ? (
                    <div>
                      {/* Video Player Mockup */}
                      <div className="aspect-video bg-slate-900 rounded-xl overflow-hidden flex items-center justify-center relative mb-6">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                        <button className="relative h-16 w-16 rounded-full bg-white/20 backdrop-blur flex items-center justify-center hover:bg-white/30 transition-colors">
                          <Play className="h-7 w-7 text-white ml-1" />
                        </button>
                        <div className="absolute bottom-4 left-4 right-4 flex items-center gap-3">
                          <div className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 rounded-full" style={{ width: "35%" }} />
                          </div>
                          <span className="text-xs text-white/80">5:14 / {lesson.duration}:00</span>
                          <Volume2 className="h-4 w-4 text-white/60" />
                        </div>
                      </div>
                      <h2 className="text-xl font-bold font-display text-slate-900 mb-3">{lesson.title}</h2>
                      <div className="prose prose-sm prose-slate max-w-none">
                        <p>In this lesson, we explore the fundamentals of loops and iteration in Python. You'll learn about <code>for</code> loops, <code>while</code> loops, and common patterns for iterating over data structures.</p>
                        <h3>Key Concepts</h3>
                        <ul>
                          <li>The <code>for</code> loop and <code>range()</code> function</li>
                          <li>Iterating over lists, tuples, and dictionaries</li>
                          <li>The <code>while</code> loop and when to use it</li>
                          <li><code>break</code> and <code>continue</code> statements</li>
                          <li>Nested loops</li>
                          <li>List comprehensions</li>
                        </ul>
                      </div>
                    </div>
                  ) : lesson.type === "reading" ? (
                    <div>
                      <h2 className="text-xl font-bold font-display text-slate-900 mb-4">{lesson.title}</h2>
                      <Card className="p-6">
                        <div className="prose prose-sm prose-slate max-w-none">
                          <p>Functions are one of the most important concepts in programming. They allow you to organize your code into reusable blocks, making your programs more modular and easier to maintain.</p>
                          <h3>Defining Functions</h3>
                          <p>In Python, you define a function using the <code>def</code> keyword:</p>
                          <pre className="bg-slate-900 text-emerald-400 rounded-lg p-4 text-sm font-mono">
{`def greet(name):
    """Say hello to someone."""
    return f"Hello, {name}!"

# Using the function
message = greet("Thabo")
print(message)  # Hello, Thabo!`}
                          </pre>
                          <h3>Parameters and Arguments</h3>
                          <p>Functions can accept parameters with default values, keyword arguments, and variable-length argument lists.</p>
                          <h3>Scope</h3>
                          <p>Variables defined inside a function are local to that function. Understanding scope is crucial for avoiding bugs.</p>
                        </div>
                      </Card>
                    </div>
                  ) : lesson.type === "assessment" ? (
                    <div className="text-center py-12">
                      <div className="h-16 w-16 rounded-2xl bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                        <Brain className="h-8 w-8 text-emerald-600" />
                      </div>
                      <h2 className="text-xl font-bold font-display text-slate-900 mb-2">{lesson.title}</h2>
                      <p className="text-sm text-slate-500 mb-6 max-w-md mx-auto">
                        Test your understanding with {mockQuiz.questions.length} questions. You need 60% to pass.
                      </p>
                      <Button size="lg" onClick={() => setView("quiz")}>
                        <Brain className="h-4 w-4 mr-2" />Start Quiz
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <h2 className="text-xl font-bold font-display text-slate-900 mb-2">{lesson.title}</h2>
                      <p className="text-sm text-slate-500">Project content would be displayed here.</p>
                    </div>
                  )}

                  {/* Complete & Continue */}
                  {lesson.type !== "assessment" && (
                    <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-200">
                      <Button variant="outline" onClick={goPrev} disabled={currentLesson === 0}>
                        <ChevronLeft className="h-4 w-4 mr-1" />Previous
                      </Button>
                      <Button onClick={goNext}>
                        {lesson.completed ? "Next Lesson" : "Mark Complete & Continue"}
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  )}
                </motion.div>
              )}

              {/* === QUIZ VIEW === */}
              {view === "quiz" && (
                <motion.div key="quiz" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-2xl mx-auto">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold font-display text-slate-900">{mockQuiz.title}</h2>
                    <Badge variant="outline">{Object.keys(quizAnswers).length}/{mockQuiz.questions.length} answered</Badge>
                  </div>

                  <div className="space-y-6">
                    {mockQuiz.questions.map((q, qi) => (
                      <Card key={q.id} className="p-5">
                        <div className="text-sm font-medium text-slate-900 mb-3">
                          <span className="text-emerald-600 mr-2">Q{qi + 1}.</span>
                          <span className="whitespace-pre-wrap">{q.question}</span>
                        </div>
                        <div className="space-y-2">
                          {q.options.map((opt, oi) => (
                            <button
                              key={oi}
                              onClick={() => selectAnswer(q.id, oi)}
                              className={cn(
                                "w-full text-left px-4 py-2.5 rounded-lg border text-sm transition-all",
                                quizAnswers[q.id] === oi
                                  ? "border-emerald-400 bg-emerald-50 text-emerald-700 font-medium"
                                  : "border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-600"
                              )}
                            >
                              <span className="font-mono text-xs text-slate-400 mr-2">{String.fromCharCode(65 + oi)}.</span>
                              {opt}
                            </button>
                          ))}
                        </div>
                      </Card>
                    ))}
                  </div>

                  <div className="flex justify-end mt-6">
                    <Button
                      size="lg"
                      onClick={submitQuiz}
                      disabled={Object.keys(quizAnswers).length < mockQuiz.questions.length}
                    >
                      Submit Quiz
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* === RESULT VIEW === */}
              {view === "result" && (
                <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-lg mx-auto text-center py-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                  >
                    <ProgressRing
                      value={(score / mockQuiz.questions.length) * 100}
                      size={140}
                      strokeWidth={10}
                      color={passed ? "#059669" : "#dc2626"}
                      label={`${score}/${mockQuiz.questions.length}`}
                      sublabel={passed ? "Passed!" : "Not passed"}
                      className="mx-auto mb-6"
                    />
                  </motion.div>

                  <h2 className="text-xl font-bold font-display text-slate-900 mb-2">
                    {passed ? "Well done! 🎉" : "Keep going! 💪"}
                  </h2>
                  <p className="text-sm text-slate-500 mb-6">
                    {passed
                      ? `You scored ${Math.round((score / mockQuiz.questions.length) * 100)}%. This lesson is now complete.`
                      : `You scored ${Math.round((score / mockQuiz.questions.length) * 100)}%. You need 60% to pass. Review the material and try again.`
                    }
                  </p>

                  {/* Answer Review */}
                  <div className="text-left space-y-3 mb-6">
                    {mockQuiz.questions.map((q, qi) => {
                      const userAnswer = quizAnswers[q.id];
                      const isCorrect = userAnswer === q.correct;
                      return (
                        <div key={q.id} className={cn(
                          "p-3 rounded-lg border text-sm",
                          isCorrect ? "border-emerald-200 bg-emerald-50" : "border-red-200 bg-red-50"
                        )}>
                          <div className="flex items-center gap-2 mb-1">
                            {isCorrect ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <span className="text-red-500 font-bold">✗</span>}
                            <span className="font-medium">Q{qi + 1}: {isCorrect ? "Correct" : "Incorrect"}</span>
                          </div>
                          {!isCorrect && (
                            <div className="text-xs text-slate-600 ml-6">
                              Correct answer: <span className="font-medium">{q.options[q.correct]}</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex items-center justify-center gap-3">
                    {!passed && (
                      <>
                        <Button variant="outline" onClick={retryQuiz}>
                          <RotateCcw className="h-4 w-4 mr-1.5" />Retry Quiz
                        </Button>
                        <Button variant="outline">
                          <LifeBuoy className="h-4 w-4 mr-1.5" />Get Help
                        </Button>
                      </>
                    )}
                    {passed && (
                      <Button onClick={goNext}>
                        Continue to Next Lesson
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>
    </DashboardShell>
  );
}
