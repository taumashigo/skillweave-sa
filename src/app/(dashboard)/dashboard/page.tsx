"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  GraduationCap, BookOpen, Award, Briefcase, Route, TrendingUp,
  ChevronRight, Zap, Clock, LifeBuoy, Wallet, ArrowRight, Star,
  PlusCircle, Target,
} from "lucide-react";
import { Button, Badge, Card, CardContent, StatCard, Progress } from "@/components/ui";
import { DashboardShell, PageHeader } from "@/components/layout/DashboardShell";
import { ProgressRing } from "@/components/shared/ProgressRing";
import { CredentialCard } from "@/components/credentials/CredentialCard";
import { SEED_MODULES, SEED_CREDENTIALS, SEED_OPPORTUNITIES } from "@/data/seed";
import { cn, formatCurrency } from "@/lib/utils";
import { useAuth } from "@/lib/hooks";
import type { Module, Credential, Opportunity } from "@/types";

export default function LearnerDashboard() {
  const { profile, isLoading } = useAuth();
  const displayName = profile?.full_name && profile.full_name.trim() !== "" ? profile.full_name : profile?.email?.split("@")[0] || "Learner";
  
  const mockLearnerStats = {
  credits_earned: 67,
  credits_target: 130,
  modules_completed: 5,
  modules_in_progress: 2,
  milestones_earned: 2,
  credentials_count: 4,
  remediation_active: 1,
  total_spent: 13490000,
  remaining_cost: 29490000,
};

const mockProgress = [
  { module: "Digital Literacy Foundations", progress: 100, credits: 12 },
  { module: "Intro to Programming with Python", progress: 100, credits: 20 },
  { module: "Professional Communication", progress: 100, credits: 12 },
  { module: "Web Dev with JavaScript & React", progress: 72, credits: 25 },
  { module: "Version Control with Git", progress: 45, credits: 8 },
  { module: "Career Readiness & Job Search", progress: 100, credits: 10 },
  { module: "Workplace Professionalism", progress: 100, credits: 10 },
];
const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.35 },
  }),
};
const mockRemediation = {
  module: "Web Dev with JavaScript & React",
  trigger: "Low quiz score on React State Management",
  score_before: 38,
  suggestions: [
    "Review: React State & Props - Booster Lesson",
    "Practice: Interactive Exercises on useState",
    "AI Tutor: Guided walkthrough of component lifecycle",
  ],
};
  const progressPercent = Math.round(
    (mockLearnerStats.credits_earned / mockLearnerStats.credits_target) * 100
  );

  return (
    <DashboardShell userName={displayName} userEmail={profile?.email || ""}>
      <PageHeader
        title={`Welcome back, ${displayName.split(" ")[0]}`}
        description="Track your progress, manage your pathway, and discover new opportunities."
        actions={
          <Link href="/pathways/new">
            <Button>
              <PlusCircle className="h-4 w-4 mr-2" />
              New Pathway
            </Button>
          </Link>
        }
      />

      <div className="px-6 lg:px-8 py-8">
        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Credits Earned", value: `${mockLearnerStats.credits_earned}/${mockLearnerStats.credits_target}`, icon: <GraduationCap className="h-5 w-5" />, trend: { value: 12, positive: true } },
            { label: "Modules Completed", value: mockLearnerStats.modules_completed, icon: <BookOpen className="h-5 w-5" />, trend: { value: 2, positive: true } },
            { label: "Credentials Earned", value: mockLearnerStats.credentials_count, icon: <Award className="h-5 w-5" /> },
            { label: "Opportunities Available", value: (SEED_OPPORTUNITIES as Opportunity[]).length, icon: <Briefcase className="h-5 w-5" />, trend: { value: 3, positive: true } },
          ].map((stat, i) => (
            <motion.div key={stat.label} custom={i} initial="hidden" animate="visible" variants={fadeUp}>
              <StatCard {...stat} />
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Active Pathway Progress */}
            <motion.div custom={4} initial="hidden" animate="visible" variants={fadeUp}>
              <Card>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-base font-semibold font-display text-slate-900">
                        Active Pathway: Full Stack Developer
                      </h2>
                      <p className="text-sm text-slate-500 mt-0.5">
                        {mockLearnerStats.credits_earned} of {mockLearnerStats.credits_target} credits earned
                      </p>
                    </div>
                    <Link href="/pathways">
                      <Button variant="ghost" size="sm">
                        View Pathway
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </Link>
                  </div>

                  <div className="flex items-center gap-6 mb-6">
                    <ProgressRing
                      value={progressPercent}
                      size={100}
                      strokeWidth={8}
                      label={`${progressPercent}%`}
                      sublabel="complete"
                    />
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <div className="h-3 w-3 rounded-full bg-emerald-500" />
                        <span className="text-slate-600">Core credits: 54/90</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="h-3 w-3 rounded-full bg-blue-500" />
                        <span className="text-slate-600">Elective credits: 13/40</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="h-3 w-3 rounded-full bg-slate-300" />
                        <span className="text-slate-600">Capstone: Not started</span>
                      </div>
                    </div>
                  </div>

                  {/* Module Progress List */}
                  <div className="space-y-3">
                    {mockProgress.map((item) => (
                      <div key={item.module} className="flex items-center gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-slate-700 truncate">
                              {item.module}
                            </span>
                            <span className="text-xs text-slate-400 ml-2 shrink-0">
                              {item.credits} cr · {item.progress}%
                            </span>
                          </div>
                          <Progress
                            value={item.progress}
                            variant={item.progress === 100 ? "success" : "default"}
                          />
                        </div>
                        {item.progress === 100 && (
                          <div className="h-5 w-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                            <span className="text-emerald-600 text-xs">✓</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Remediation Alert */}
            <motion.div custom={5} initial="hidden" animate="visible" variants={fadeUp}>
              <Card className="border-amber-200 bg-amber-50/30">
                <div className="p-5">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                      <LifeBuoy className="h-5 w-5 text-amber-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-amber-800 mb-1">
                        Remediation Recommended
                      </h3>
                      <p className="text-sm text-amber-700 mb-2">
                        Your score on <strong>{mockRemediation.trigger}</strong> was {mockRemediation.score_before}%. We&apos;ve prepared targeted support:
                      </p>
                      <div className="space-y-1.5 mb-3">
                        {mockRemediation.suggestions.map((s) => (
                          <div key={s} className="flex items-center gap-2 text-sm text-amber-700">
                            <Zap className="h-3 w-3 text-amber-500 shrink-0" />
                            {s}
                          </div>
                        ))}
                      </div>
                      <Link href="/support">
                        <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white">
                          Start Remediation
                          <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Recommended Modules */}
            <motion.div custom={6} initial="hidden" animate="visible" variants={fadeUp}>
              <Card>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-base font-semibold font-display text-slate-900">
                      Recommended Next
                    </h2>
                    <Link href="/catalog">
                      <Button variant="ghost" size="sm">
                        Browse All <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </Link>
                  </div>
                  <div className="space-y-2">
                    {(SEED_MODULES as Module[]).slice(4, 8).map((mod) => (
                      <Link key={mod.id} href={`/catalog/${mod.slug}`}>
                        <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors group">
                          <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 group-hover:bg-emerald-50 transition-colors">
                            <BookOpen className="h-4 w-4 text-slate-400 group-hover:text-emerald-500 transition-colors" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-slate-900 truncate">{mod.title}</div>
                            <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                              <span>{mod.credits} credits</span>
                              <span>·</span>
                              <span>{mod.difficulty}</span>
                              <span>·</span>
                              <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                              <span>{mod.rating}</span>
                            </div>
                          </div>
                          <Badge variant={mod.pricing_model === "free" ? "free" : "secondary"} className="shrink-0">
                            {mod.pricing_model === "free" ? "Free" : formatCurrency(mod.cost_cents)}
                          </Badge>
                          <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-emerald-500 transition-colors" />
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Milestones */}
            <motion.div custom={4} initial="hidden" animate="visible" variants={fadeUp}>
              <Card>
                <div className="p-5">
                  <h2 className="text-base font-semibold font-display text-slate-900 mb-4">
                    Milestones
                  </h2>
                  <div className="space-y-3">
                    {[
                      { title: "Foundation Skills", done: true, credits: "30/30" },
                      { title: "Core Developer", done: true, credits: "60/60" },
                      { title: "Advanced Developer", done: false, credits: "67/90" },
                      { title: "Capstone Ready", done: false, credits: "0/30" },
                    ].map((ms) => (
                      <div key={ms.title} className="flex items-center gap-3">
                        <div className={cn(
                          "h-8 w-8 rounded-lg flex items-center justify-center shrink-0",
                          ms.done
                            ? "bg-emerald-100"
                            : "bg-slate-100"
                        )}>
                          {ms.done ? (
                            <Award className="h-4 w-4 text-emerald-600" />
                          ) : (
                            <Target className="h-4 w-4 text-slate-400" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className={cn("text-sm font-medium", ms.done ? "text-emerald-700" : "text-slate-700")}>
                            {ms.title}
                          </div>
                          <div className="text-xs text-slate-400">{ms.credits} credits</div>
                        </div>
                        {ms.done && <Badge variant="success" className="text-[10px]">Earned</Badge>}
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Recent Credentials */}
            <motion.div custom={5} initial="hidden" animate="visible" variants={fadeUp}>
              <Card>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-base font-semibold font-display text-slate-900">
                      Recent Credentials
                    </h2>
                    <Link href="/wallet">
                      <Button variant="ghost" size="sm">
                        <Wallet className="h-4 w-4 mr-1" />
                        Wallet
                      </Button>
                    </Link>
                  </div>
                  <div className="space-y-2">
                    {(SEED_CREDENTIALS as Credential[]).slice(0, 3).map((cred) => (
                      <CredentialCard key={cred.id} credential={cred} variant="compact" />
                    ))}
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Affordability */}
            <motion.div custom={6} initial="hidden" animate="visible" variants={fadeUp}>
              <Card>
                <div className="p-5">
                  <h2 className="text-base font-semibold font-display text-slate-900 mb-3">
                    Affordability
                  </h2>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Total pathway cost</span>
                      <span className="font-semibold text-slate-900">
                        {formatCurrency(mockLearnerStats.total_spent + mockLearnerStats.remaining_cost)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Paid so far</span>
                      <span className="font-medium text-slate-700">
                        {formatCurrency(mockLearnerStats.total_spent)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Remaining</span>
                      <span className="font-medium text-slate-700">
                        {formatCurrency(mockLearnerStats.remaining_cost)}
                      </span>
                    </div>
                    <div className="pt-2 border-t border-slate-100 mt-2">
                      <div className="flex items-center gap-1.5 text-xs text-emerald-600">
                        <Zap className="h-3 w-3" />
                        3 free alternatives available in your pathway
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Quick Links */}
            <motion.div custom={7} initial="hidden" animate="visible" variants={fadeUp}>
              <Card>
                <div className="p-5">
                  <h2 className="text-base font-semibold font-display text-slate-900 mb-3">
                    Quick Actions
                  </h2>
                  <div className="space-y-1">
                    {[
                      { label: "Build CV", href: "/cv", icon: Target },
                      { label: "View Portfolio", href: "/portfolio", icon: Briefcase },
                      { label: "Download Transcript", href: "/transcript", icon: GraduationCap },
                      { label: "Apply for RPL", href: "/rpl", icon: Award },
                    ].map((action) => (
                      <Link key={action.href} href={action.href}>
                        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-50 transition-colors group">
                          <action.icon className="h-4 w-4 text-slate-400 group-hover:text-emerald-500 transition-colors" />
                          <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">{action.label}</span>
                          <ChevronRight className="h-4 w-4 text-slate-300 ml-auto" />
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
