"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  LifeBuoy, Zap, BookOpen, Play, MessageSquare, AlertTriangle,
  CheckCircle2, Clock, ArrowRight, Brain, Repeat, TrendingUp,
} from "lucide-react";
import { Button, Badge, Card, CardContent, Progress, EmptyState } from "@/components/ui";
import { DashboardShell, PageHeader } from "@/components/layout/DashboardShell";
import { cn } from "@/lib/utils";

const mockRemediations = [
  {
    id: "rem-1",
    module: "Web Dev with JavaScript & React",
    trigger: "Low quiz score",
    trigger_detail: "React State Management quiz: 38%",
    status: "in_progress",
    score_before: 38,
    resources: [
      { title: "React State & Props - Booster Lesson", type: "video", duration: "15 min", status: "completed" },
      { title: "Interactive useState Exercises", type: "assessment", duration: "20 min", status: "in_progress" },
      { title: "AI Tutor: Component Lifecycle", type: "ai_tutoring", duration: "10 min", status: "not_started" },
    ],
  },
  {
    id: "rem-2",
    module: "Introduction to Statistics",
    trigger: "Prerequisite gap",
    trigger_detail: "Probability fundamentals need strengthening",
    status: "recommended",
    score_before: 45,
    resources: [
      { title: "Probability Refresher", type: "video", duration: "12 min", status: "not_started" },
      { title: "Worked Examples: Conditional Probability", type: "reading", duration: "15 min", status: "not_started" },
      { title: "Practice Quiz: Probability Basics", type: "assessment", duration: "10 min", status: "not_started" },
    ],
  },
];

const mockCompleted = [
  {
    module: "Digital Literacy Foundations",
    trigger: "Low initial assessment",
    score_before: 42,
    score_after: 89,
    improvement: 47,
  },
];

const statusColors: Record<string, string> = {
  completed: "text-emerald-600 bg-emerald-50",
  in_progress: "text-blue-600 bg-blue-50",
  not_started: "text-slate-400 bg-slate-50",
};

const typeIcons: Record<string, React.ElementType> = {
  video: Play,
  assessment: Brain,
  ai_tutoring: Zap,
  reading: BookOpen,
};

export default function SupportPage() {
  return (
    <DashboardShell>
      <PageHeader
        title="Learning Support"
        description="Personalised remediation and support to help you succeed. We detect when you're struggling and provide targeted help."
      />

      <div className="px-6 lg:px-8 py-8 space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Active Remediations", value: "2", icon: LifeBuoy, color: "text-amber-600 bg-amber-50" },
            { label: "Completed", value: "1", icon: CheckCircle2, color: "text-emerald-600 bg-emerald-50" },
            { label: "Avg. Improvement", value: "+47%", icon: TrendingUp, color: "text-blue-600 bg-blue-50" },
            { label: "Resources Available", value: "6", icon: BookOpen, color: "text-purple-600 bg-purple-50" },
          ].map((stat) => (
            <Card key={stat.label} className="p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-400">{stat.label}</span>
                <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center", stat.color)}>
                  <stat.icon className="h-4 w-4" />
                </div>
              </div>
              <div className="text-2xl font-bold font-display text-slate-900">{stat.value}</div>
            </Card>
          ))}
        </div>

        {/* Active Remediations */}
        <div>
          <h2 className="text-lg font-semibold font-display text-slate-900 mb-4">
            Active Remediation Plans
          </h2>
          <div className="space-y-4">
            {mockRemediations.map((rem, i) => (
              <motion.div
                key={rem.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className={cn(
                  "overflow-hidden",
                  rem.status === "recommended" && "border-amber-200"
                )}>
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-sm font-semibold text-slate-900">{rem.module}</h3>
                          <Badge variant={rem.status === "in_progress" ? "info" : "warning"}>
                            {rem.status === "in_progress" ? "In Progress" : "Recommended"}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <AlertTriangle className="h-3 w-3 text-amber-500" />
                          <span>Trigger: {rem.trigger_detail}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-slate-400">Score before</div>
                        <div className="text-lg font-bold text-red-500">{rem.score_before}%</div>
                      </div>
                    </div>

                    {/* Resources */}
                    <div className="space-y-2 mt-4">
                      {rem.resources.map((res, j) => {
                        const Icon = typeIcons[res.type] || BookOpen;
                        return (
                          <div
                            key={j}
                            className={cn(
                              "flex items-center gap-3 p-3 rounded-lg border transition-all",
                              res.status === "completed"
                                ? "border-emerald-200 bg-emerald-50/50"
                                : res.status === "in_progress"
                                ? "border-blue-200 bg-blue-50/30"
                                : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                            )}
                          >
                            <div className={cn(
                              "h-9 w-9 rounded-lg flex items-center justify-center",
                              statusColors[res.status]
                            )}>
                              <Icon className="h-4 w-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-slate-900">{res.title}</div>
                              <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                                <span className="capitalize">{res.type.replace(/_/g, " ")}</span>
                                <span>·</span>
                                <Clock className="h-3 w-3" />
                                <span>{res.duration}</span>
                              </div>
                            </div>
                            {res.status === "completed" ? (
                              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                            ) : res.status === "in_progress" ? (
                              <Button size="sm" variant="outline" className="text-xs">
                                Continue
                              </Button>
                            ) : (
                              <Button size="sm" className="text-xs">
                                Start
                                <ArrowRight className="h-3 w-3 ml-1" />
                              </Button>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Escalation */}
                    <div className="flex items-center gap-3 mt-4 pt-4 border-t border-slate-100">
                      <Button variant="ghost" size="sm" className="text-xs text-slate-500">
                        <MessageSquare className="h-3.5 w-3.5 mr-1" />
                        Request Mentor Help
                      </Button>
                      <Button variant="ghost" size="sm" className="text-xs text-slate-500">
                        <Repeat className="h-3.5 w-3.5 mr-1" />
                        Try Alternative Content
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Completed Remediations */}
        {mockCompleted.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold font-display text-slate-900 mb-4">
              Completed Remediations
            </h2>
            <div className="space-y-3">
              {mockCompleted.map((item, i) => (
                <Card key={i} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                        <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-slate-900">{item.module}</div>
                        <div className="text-xs text-slate-400">Trigger: {item.trigger}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="text-center">
                        <div className="text-xs text-slate-400">Before</div>
                        <div className="font-bold text-red-500">{item.score_before}%</div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-slate-300" />
                      <div className="text-center">
                        <div className="text-xs text-slate-400">After</div>
                        <div className="font-bold text-emerald-600">{item.score_after}%</div>
                      </div>
                      <Badge variant="success" className="ml-2">+{item.improvement}%</Badge>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
