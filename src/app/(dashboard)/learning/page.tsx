"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, CheckCircle2, ChevronRight, ChevronLeft, BookOpen, Video, FileText, Brain, Clock, ArrowRight, RotateCcw, LifeBuoy, Lock, Volume2 } from "lucide-react";
import { Button, Badge, Card, Progress } from "@/components/ui";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { ProgressRing } from "@/components/shared/ProgressRing";
import { LoadingScreen } from "@/components/shared/Loading";
import { createSupabaseBrowser } from "@/lib/supabase-browser";
import { useAuth } from "@/lib/hooks";
import { cn } from "@/lib/utils";

const supabase = createSupabaseBrowser();
const typeIcons: Record<string, React.ElementType> = { video: Video, reading: FileText, assessment: Brain, project: BookOpen };

export default function LearningPage() {
  const { profile } = useAuth();
  const [lessons, setLessons] = useState<any[]>([]);
  const [quizQuestions, setQuizQuestions] = useState<any[]>([]);
  const [currentLesson, setCurrentLesson] = useState(0);
  const [view, setView] = useState<"lesson" | "quiz" | "result">("lesson");
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [moduleName, setModuleName] = useState("Learning Module");

  useEffect(() => {
    const fetchLessons = async () => {
      // Get first enrolled module's lessons
      if (!profile?.user_id) { setLoading(false); return; }

      const { data: enrollments } = await supabase.from("enrollments").select("module_id, modules(title)").eq("user_id", profile.user_id).in("status", ["enrolled", "in_progress"]).limit(1);

      if (!enrollments?.length) {
        // Fallback: get any module with lessons
        const { data: anyLessons } = await supabase.from("lessons").select("*, modules(title)").eq("is_published", true).order("position").limit(20);
        if (anyLessons?.length) {
          setLessons(anyLessons);
          setModuleName((anyLessons[0] as any).modules?.title || "Module");
        }
        setLoading(false);
        return;
      }

      const moduleId = enrollments[0].module_id;
      setModuleName((enrollments[0] as any).modules?.title || "Module");

      const { data: lessonData } = await supabase.from("lessons").select("*").eq("module_id", moduleId).eq("is_published", true).order("position");
      if (lessonData) setLessons(lessonData);

      // Get completed lessons
      const { data: progressData } = await supabase.from("lesson_progress").select("lesson_id").eq("user_id", profile.user_id).eq("completed", true);
      if (progressData) setCompletedLessons(new Set(progressData.map((p: any) => p.lesson_id)));

      setLoading(false);
    };
    fetchLessons();
  }, [profile?.user_id]);

  // Load quiz questions when switching to an assessment lesson
  useEffect(() => {
    if (!lessons.length) return;
    const lesson = lessons[currentLesson];
    if (lesson?.type === "assessment") {
      supabase.from("quiz_questions").select("*").eq("lesson_id", lesson.id).order("position").then(({ data }) => {
        if (data) setQuizQuestions(data);
      });
    }
  }, [currentLesson, lessons]);

  const lesson = lessons[currentLesson];
  const completedCount = lessons.filter(l => completedLessons.has(l.id)).length;
  const progressPercent = lessons.length > 0 ? Math.round((completedCount / lessons.length) * 100) : 0;

  const score = quizSubmitted ? quizQuestions.filter(q => quizAnswers[q.id] === q.correct_index).length : 0;
  const passed = quizQuestions.length > 0 && score >= Math.ceil(quizQuestions.length * 0.6);

  const markComplete = async () => {
    if (!profile?.user_id || !lesson) return;
    await supabase.from("lesson_progress").upsert({ user_id: profile.user_id, lesson_id: lesson.id, completed: true, completed_at: new Date().toISOString() }, { onConflict: "user_id,lesson_id" });
    setCompletedLessons(prev => new Set([...prev, lesson.id]));
    if (currentLesson < lessons.length - 1) { setCurrentLesson(currentLesson + 1); setView("lesson"); setQuizAnswers({}); setQuizSubmitted(false); }
  };

  const goNext = () => { if (currentLesson < lessons.length - 1) { setCurrentLesson(currentLesson + 1); setView("lesson"); setQuizAnswers({}); setQuizSubmitted(false); } };
  const goPrev = () => { if (currentLesson > 0) { setCurrentLesson(currentLesson - 1); setView("lesson"); setQuizAnswers({}); setQuizSubmitted(false); } };

  if (loading) return <DashboardShell><LoadingScreen message="Loading lessons..." /></DashboardShell>;
  if (!lessons.length) return <DashboardShell><div className="flex items-center justify-center min-h-screen"><div className="text-center"><BookOpen className="h-10 w-10 text-slate-300 mx-auto mb-3" /><h2 className="text-lg font-semibold text-slate-900 mb-1">No lessons available</h2><p className="text-sm text-slate-500">Enrol in a module to start learning.</p></div></div></DashboardShell>;

  return (
    <DashboardShell>
      <div className="flex h-[calc(100vh-56px)] lg:h-screen overflow-hidden">
        {/* Sidebar */}
        <aside className="bg-white border-r border-slate-200 flex flex-col w-[300px] shrink-0 hidden lg:flex">
          <div className="p-4 border-b border-slate-100">
            <h2 className="text-sm font-semibold font-display text-slate-900 mb-1">{moduleName}</h2>
            <div className="flex items-center gap-2 text-xs text-slate-500"><span>{completedCount}/{lessons.length} lessons</span><span>·</span><span>{progressPercent}% complete</span></div>
            <Progress value={progressPercent} className="mt-2 h-1.5" />
          </div>
          <nav className="flex-1 overflow-y-auto py-2">
            {lessons.map((l, i) => {
              const Icon = typeIcons[l.type] || BookOpen;
              const isCurrent = i === currentLesson;
              const isDone = completedLessons.has(l.id);
              return (
                <button key={l.id} onClick={() => { setCurrentLesson(i); setView("lesson"); setQuizAnswers({}); setQuizSubmitted(false); }} className={cn("w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors", isCurrent && "bg-emerald-50 border-r-2 border-emerald-500", !isCurrent && "hover:bg-slate-50")}>
                  <div className={cn("h-7 w-7 rounded-md flex items-center justify-center shrink-0 text-xs font-bold", isDone ? "bg-emerald-100 text-emerald-600" : isCurrent ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-400")}>
                    {isDone ? <CheckCircle2 className="h-4 w-4" /> : <Icon className="h-3.5 w-3.5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={cn("text-xs font-medium truncate", isCurrent ? "text-emerald-700" : "text-slate-700")}>{l.title}</div>
                    <div className="text-[10px] text-slate-400 flex items-center gap-1.5 mt-0.5"><span className="capitalize">{l.type}</span><span>·</span><Clock className="h-2.5 w-2.5" /><span>{l.duration_minutes} min</span></div>
                  </div>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-hidden bg-slate-50/50">
          <div className="flex items-center justify-between px-6 py-3 bg-white border-b border-slate-200">
            <div className="flex items-center gap-3">
              <button onClick={goPrev} disabled={currentLesson === 0} className="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-30"><ChevronLeft className="h-4 w-4 text-slate-500" /></button>
              <div><div className="text-sm font-medium text-slate-900">{lesson?.title}</div><div className="text-xs text-slate-400 capitalize">{lesson?.type} · {lesson?.duration_minutes} min</div></div>
            </div>
            <div className="flex items-center gap-2">
              {view === "lesson" && lesson?.type === "assessment" && <Button size="sm" onClick={() => setView("quiz")}><Brain className="h-4 w-4 mr-1.5" />Start Quiz</Button>}
              <button onClick={goNext} disabled={currentLesson >= lessons.length - 1} className="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-30"><ChevronRight className="h-4 w-4 text-slate-500" /></button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <AnimatePresence mode="wait">
              {view === "lesson" && (
                <motion.div key="lesson" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-3xl mx-auto">
                  {lesson?.type === "video" ? (
                    <div>
                      <div className="aspect-video bg-slate-900 rounded-xl overflow-hidden flex items-center justify-center relative mb-6">
                        <button className="relative h-16 w-16 rounded-full bg-white/20 backdrop-blur flex items-center justify-center hover:bg-white/30"><Play className="h-7 w-7 text-white ml-1" /></button>
                      </div>
                      <h2 className="text-xl font-bold font-display text-slate-900 mb-3">{lesson.title}</h2>
                      {lesson.content_html && <div className="prose prose-sm prose-slate max-w-none" dangerouslySetInnerHTML={{ __html: lesson.content_html }} />}
                    </div>
                  ) : lesson?.type === "reading" ? (
                    <div>
                      <h2 className="text-xl font-bold font-display text-slate-900 mb-4">{lesson.title}</h2>
                      <Card className="p-6">{lesson.content_html ? <div className="prose prose-sm prose-slate max-w-none" dangerouslySetInnerHTML={{ __html: lesson.content_html }} /> : <p className="text-sm text-slate-500">Content loading...</p>}</Card>
                    </div>
                  ) : lesson?.type === "assessment" ? (
                    <div className="text-center py-12">
                      <Brain className="h-16 w-16 text-emerald-100 mx-auto mb-4" />
                      <h2 className="text-xl font-bold font-display text-slate-900 mb-2">{lesson.title}</h2>
                      <p className="text-sm text-slate-500 mb-6">Test your understanding. You need 60% to pass.</p>
                      <Button size="lg" onClick={() => setView("quiz")}><Brain className="h-4 w-4 mr-2" />Start Quiz</Button>
                    </div>
                  ) : (
                    <div className="text-center py-12"><h2 className="text-xl font-bold text-slate-900">{lesson?.title}</h2></div>
                  )}
                  {lesson?.type !== "assessment" && (
                    <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-200">
                      <Button variant="outline" onClick={goPrev} disabled={currentLesson === 0}><ChevronLeft className="h-4 w-4 mr-1" />Previous</Button>
                      <Button onClick={markComplete}>{completedLessons.has(lesson?.id) ? "Next Lesson" : "Mark Complete & Continue"}<ChevronRight className="h-4 w-4 ml-1" /></Button>
                    </div>
                  )}
                </motion.div>
              )}

              {view === "quiz" && (
                <motion.div key="quiz" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-2xl mx-auto">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold font-display text-slate-900">{lesson?.title}</h2>
                    <Badge variant="outline">{Object.keys(quizAnswers).length}/{quizQuestions.length} answered</Badge>
                  </div>
                  <div className="space-y-6">
                    {quizQuestions.map((q, qi) => {
                      const options = typeof q.options === "string" ? JSON.parse(q.options) : q.options;
                      return (
                        <Card key={q.id} className="p-5">
                          <div className="text-sm font-medium text-slate-900 mb-3"><span className="text-emerald-600 mr-2">Q{qi + 1}.</span>{q.question}</div>
                          <div className="space-y-2">
                            {options.map((opt: string, oi: number) => (
                              <button key={oi} onClick={() => !quizSubmitted && setQuizAnswers(prev => ({ ...prev, [q.id]: oi }))} className={cn("w-full text-left px-4 py-2.5 rounded-lg border text-sm transition-all", quizAnswers[q.id] === oi ? "border-emerald-400 bg-emerald-50 text-emerald-700 font-medium" : "border-slate-200 hover:border-slate-300 text-slate-600")}>
                                <span className="font-mono text-xs text-slate-400 mr-2">{String.fromCharCode(65 + oi)}.</span>{opt}
                              </button>
                            ))}
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                  <div className="flex justify-end mt-6">
                    <Button size="lg" onClick={() => { setQuizSubmitted(true); setView("result"); }} disabled={Object.keys(quizAnswers).length < quizQuestions.length}>Submit Quiz<ArrowRight className="h-4 w-4 ml-2" /></Button>
                  </div>
                </motion.div>
              )}

              {view === "result" && (
                <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-lg mx-auto text-center py-8">
                  <ProgressRing value={quizQuestions.length > 0 ? (score / quizQuestions.length) * 100 : 0} size={140} strokeWidth={10} color={passed ? "#059669" : "#dc2626"} label={`${score}/${quizQuestions.length}`} sublabel={passed ? "Passed!" : "Not passed"} className="mx-auto mb-6" />
                  <h2 className="text-xl font-bold font-display text-slate-900 mb-2">{passed ? "Well done! 🎉" : "Keep going! 💪"}</h2>
                  <p className="text-sm text-slate-500 mb-6">{passed ? `You scored ${quizQuestions.length > 0 ? Math.round((score / quizQuestions.length) * 100) : 0}%. This lesson is complete.` : "Review the material and try again."}</p>
                  <div className="text-left space-y-3 mb-6">
                    {quizQuestions.map((q, qi) => {
                      const isCorrect = quizAnswers[q.id] === q.correct_index;
                      const options = typeof q.options === "string" ? JSON.parse(q.options) : q.options;
                      return (
                        <div key={q.id} className={cn("p-3 rounded-lg border text-sm", isCorrect ? "border-emerald-200 bg-emerald-50" : "border-red-200 bg-red-50")}>
                          <div className="flex items-center gap-2 mb-1">{isCorrect ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <span className="text-red-500 font-bold">✗</span>}<span className="font-medium">Q{qi + 1}: {isCorrect ? "Correct" : "Incorrect"}</span></div>
                          {!isCorrect && <div className="text-xs text-slate-600 ml-6">Correct: {options[q.correct_index]}</div>}
                          {q.explanation && <div className="text-xs text-slate-500 ml-6 mt-1">{q.explanation}</div>}
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex items-center justify-center gap-3">
                    {!passed && <><Button variant="outline" onClick={() => { setQuizAnswers({}); setQuizSubmitted(false); setView("quiz"); }}><RotateCcw className="h-4 w-4 mr-1.5" />Retry</Button><Button variant="outline"><LifeBuoy className="h-4 w-4 mr-1.5" />Get Help</Button></>}
                    {passed && <Button onClick={() => { markComplete(); }}>Continue<ChevronRight className="h-4 w-4 ml-1" /></Button>}
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
