"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Route, PlusCircle, ChevronRight, Clock, Zap, GraduationCap,
  MoreHorizontal, Play, Pause, Archive,
} from "lucide-react";
import { Button, Badge, Card, Progress, EmptyState } from "@/components/ui";
import { DashboardShell, PageHeader } from "@/components/layout/DashboardShell";
import { ProgressRing } from "@/components/shared/ProgressRing";
import { cn, formatCurrency } from "@/lib/utils";

const mockPathways = [
  {
    id: "pw-1",
    title: "Full Stack Software Developer",
    status: "active" as const,
    template: "Full Stack Developer",
    total_credits: 130,
    earned_credits: 67,
    modules_count: 7,
    completed_count: 5,
    estimated_cost: 42980000,
    estimated_months: 12,
    milestones: { earned: 2, total: 4 },
  },
  {
    id: "pw-2",
    title: "Data Analytics Foundations",
    status: "draft" as const,
    template: "Data Analyst & Business Intelligence",
    total_credits: 120,
    earned_credits: 0,
    modules_count: 3,
    completed_count: 0,
    estimated_cost: 23490000,
    estimated_months: 10,
    milestones: { earned: 0, total: 3 },
  },
];

const statusConfig = {
  draft: { label: "Draft", variant: "secondary" as const, icon: MoreHorizontal },
  active: { label: "Active", variant: "success" as const, icon: Play },
  paused: { label: "Paused", variant: "warning" as const, icon: Pause },
  completed: { label: "Completed", variant: "default" as const, icon: GraduationCap },
  archived: { label: "Archived", variant: "secondary" as const, icon: Archive },
};

export default function PathwaysPage() {
  return (
    <DashboardShell>
      <PageHeader
        title="My Pathways"
        description="Manage your learning pathways. Build new ones or continue existing journeys."
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
        {mockPathways.length > 0 ? (
          <div className="space-y-4">
            {mockPathways.map((pathway, i) => {
              const progress = pathway.total_credits > 0
                ? Math.round((pathway.earned_credits / pathway.total_credits) * 100)
                : 0;
              const config = statusConfig[pathway.status];

              return (
                <motion.div
                  key={pathway.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <Card className="card-premium overflow-hidden">
                    <div className="p-6">
                      <div className="flex items-start gap-4">
                        <ProgressRing
                          value={progress}
                          size={72}
                          strokeWidth={6}
                          className="shrink-0 hidden sm:block"
                        />

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-base font-semibold font-display text-slate-900">
                              {pathway.title}
                            </h3>
                            <Badge variant={config.variant}>
                              {config.label}
                            </Badge>
                          </div>
                          <p className="text-sm text-slate-500 mb-3">
                            Based on: {pathway.template}
                          </p>

                          {/* Progress bar - mobile */}
                          <div className="sm:hidden mb-3">
                            <Progress value={progress} />
                            <div className="text-xs text-slate-400 mt-1">{progress}% complete</div>
                          </div>

                          {/* Stats */}
                          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                            <span className="flex items-center gap-1.5">
                              <GraduationCap className="h-4 w-4 text-slate-400" />
                              {pathway.earned_credits}/{pathway.total_credits} credits
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Zap className="h-4 w-4 text-slate-400" />
                              {pathway.completed_count}/{pathway.modules_count} modules
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Clock className="h-4 w-4 text-slate-400" />
                              ~{pathway.estimated_months} months
                            </span>
                            <span className="text-slate-400">
                              Est. cost: {formatCurrency(pathway.estimated_cost)}
                            </span>
                          </div>

                          {/* Milestones */}
                          <div className="flex items-center gap-1.5 mt-3">
                            {Array.from({ length: pathway.milestones.total }).map((_, j) => (
                              <div
                                key={j}
                                className={cn(
                                  "h-2 flex-1 rounded-full transition-colors",
                                  j < pathway.milestones.earned
                                    ? "bg-emerald-500"
                                    : "bg-slate-200"
                                )}
                              />
                            ))}
                            <span className="text-xs text-slate-400 ml-1.5 shrink-0">
                              {pathway.milestones.earned}/{pathway.milestones.total} milestones
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2 shrink-0">
                          <Link href={`/pathways/new`}>
                            <Button size="sm">
                              {pathway.status === "draft" ? "Edit" : "Continue"}
                              <ChevronRight className="h-4 w-4 ml-1" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <EmptyState
            icon={<Route className="h-10 w-10" />}
            title="No pathways yet"
            description="Create your first personalised learning pathway by dragging and dropping modules."
            action={
              <Link href="/pathways/new">
                <Button>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Create Pathway
                </Button>
              </Link>
            }
          />
        )}

        {/* Templates Section */}
        <div className="mt-12">
          <h2 className="text-lg font-semibold font-display text-slate-900 mb-4">
            Pathway Templates
          </h2>
          <p className="text-sm text-slate-500 mb-6">
            Start from a curated template or build from scratch.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { title: "Full Stack Developer", jobs: "Frontend, Backend, Full Stack", credits: 130, level: "NQF 6" },
              { title: "Data Analyst & BI", jobs: "Data Analyst, BI Analyst", credits: 120, level: "NQF 6" },
              { title: "Digital Marketing Pro", jobs: "Digital Marketer, Content Strategist", credits: 90, level: "NQF 5" },
              { title: "Project & Product Manager", jobs: "PM, Product Manager, Scrum Master", credits: 100, level: "NQF 6" },
              { title: "Data Scientist & ML", jobs: "Data Scientist, ML Engineer", credits: 160, level: "NQF 7" },
              { title: "Custom Pathway", jobs: "Build your own from scratch", credits: 0, level: "Any" },
            ].map((tmpl) => (
              <Link key={tmpl.title} href="/pathways/new">
                <Card className="p-4 hover:border-emerald-300 hover:bg-emerald-50/20 transition-all cursor-pointer group h-full">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-9 w-9 rounded-lg bg-slate-100 group-hover:bg-emerald-100 flex items-center justify-center transition-colors">
                      <Route className="h-4 w-4 text-slate-400 group-hover:text-emerald-600 transition-colors" />
                    </div>
                    <Badge variant="outline" className="text-[10px]">{tmpl.level}</Badge>
                  </div>
                  <h3 className="text-sm font-semibold text-slate-900 mb-1 group-hover:text-emerald-700 transition-colors">
                    {tmpl.title}
                  </h3>
                  <p className="text-xs text-slate-500">{tmpl.jobs}</p>
                  {tmpl.credits > 0 && (
                    <p className="text-xs text-slate-400 mt-2">{tmpl.credits} credits required</p>
                  )}
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
