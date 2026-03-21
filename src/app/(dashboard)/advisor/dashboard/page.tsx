"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Users, Route, MessageSquare, ClipboardCheck, ChevronRight,
  AlertTriangle, CheckCircle2, Clock, Eye, LifeBuoy, GraduationCap,
} from "lucide-react";
import { Button, Badge, Card, StatCard, Progress, Avatar } from "@/components/ui";
import { DashboardShell, PageHeader } from "@/components/layout/DashboardShell";
import { cn } from "@/lib/utils";

const mockLearners = [
  { name: "Thabo Mokoena", pathway: "Full Stack Developer", progress: 52, credits: "67/130", status: "on_track", remediations: 1, lastActive: "Today" },
  { name: "Nomsa Dlamini", pathway: "Data Analyst & BI", progress: 35, credits: "42/120", status: "at_risk", remediations: 2, lastActive: "2 days ago" },
  { name: "Sipho Nkosi", pathway: "Full Stack Developer", progress: 78, credits: "101/130", status: "on_track", remediations: 0, lastActive: "Today" },
  { name: "Lerato Molefe", pathway: "Digital Marketing Pro", progress: 15, credits: "14/90", status: "inactive", remediations: 0, lastActive: "2 weeks ago" },
  { name: "Palesa Khumalo", pathway: "Data Scientist & ML", progress: 42, credits: "67/160", status: "on_track", remediations: 1, lastActive: "Yesterday" },
];

const pendingReviews = [
  { learner: "Nomsa Dlamini", type: "Unusual pathway combination", details: "Added Marketing modules to Data Analyst pathway" },
  { learner: "Thabo Mokoena", type: "RPL evidence review", details: "Claiming credit for Project Management Essentials" },
];

const statusConfig: Record<string, { label: string; variant: any; color: string }> = {
  on_track: { label: "On Track", variant: "success", color: "text-emerald-600" },
  at_risk: { label: "At Risk", variant: "warning", color: "text-amber-600" },
  inactive: { label: "Inactive", variant: "secondary", color: "text-slate-400" },
};

const fadeUp = { hidden: { opacity: 0, y: 12 }, visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06 } }) };

export default function AdvisorDashboard() {
  return (
    <DashboardShell role="mentor" userName="Dr. Zanele Mthembu" userEmail="zanele@capaciti.org.za">
      <PageHeader
        title="Advisor Dashboard"
        description="Guide your learners, review pathways, and provide targeted support."
      />

      <div className="px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Active Advisees", value: "5", icon: <Users className="h-5 w-5" /> },
            { label: "At Risk", value: "1", icon: <AlertTriangle className="h-5 w-5" /> },
            { label: "Pending Reviews", value: "2", icon: <ClipboardCheck className="h-5 w-5" /> },
            { label: "Active Remediations", value: "4", icon: <LifeBuoy className="h-5 w-5" /> },
          ].map((s, i) => (
            <motion.div key={s.label} custom={i} initial="hidden" animate="visible" variants={fadeUp}>
              <StatCard {...s} />
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Learner List */}
            <Card>
              <div className="p-6">
                <h2 className="text-base font-semibold font-display text-slate-900 mb-4">My Learners</h2>
                <div className="space-y-3">
                  {mockLearners.map((learner, i) => {
                    const status = statusConfig[learner.status];
                    return (
                      <motion.div
                        key={learner.name}
                        custom={i + 4}
                        initial="hidden"
                        animate="visible"
                        variants={fadeUp}
                        className="flex items-center gap-4 p-3 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors"
                      >
                        <Avatar name={learner.name} size="md" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-sm font-medium text-slate-900">{learner.name}</span>
                            <Badge variant={status.variant} className="text-[10px]">{status.label}</Badge>
                            {learner.remediations > 0 && (
                              <Badge variant="warning" className="text-[10px] gap-0.5">
                                <LifeBuoy className="h-2.5 w-2.5" />{learner.remediations}
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-3 text-xs text-slate-400">
                            <span><Route className="h-3 w-3 inline mr-0.5" />{learner.pathway}</span>
                            <span><GraduationCap className="h-3 w-3 inline mr-0.5" />{learner.credits}</span>
                            <span><Clock className="h-3 w-3 inline mr-0.5" />{learner.lastActive}</span>
                          </div>
                          <Progress value={learner.progress} className="mt-2 h-1.5" variant={learner.status === "at_risk" ? "warning" : "default"} />
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-lg font-bold font-display text-slate-900">{learner.progress}%</div>
                          <Button variant="ghost" size="sm" className="text-xs mt-1">
                            <Eye className="h-3 w-3 mr-1" />View
                          </Button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Pending Reviews */}
            <Card>
              <div className="p-5">
                <h2 className="text-base font-semibold font-display text-slate-900 mb-4">Pending Reviews</h2>
                {pendingReviews.length > 0 ? (
                  <div className="space-y-3">
                    {pendingReviews.map((review, i) => (
                      <div key={i} className="p-3 rounded-lg border border-amber-200 bg-amber-50/50">
                        <div className="flex items-center gap-2 mb-1">
                          <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                          <span className="text-xs font-semibold text-amber-800">{review.type}</span>
                        </div>
                        <p className="text-xs text-amber-700 mb-2">{review.learner}: {review.details}</p>
                        <div className="flex gap-2">
                          <Button size="sm" className="text-xs h-7 bg-amber-600 hover:bg-amber-700">Review</Button>
                          <Button size="sm" variant="outline" className="text-xs h-7">Dismiss</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500">No pending reviews.</p>
                )}
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="p-5">
              <h2 className="text-base font-semibold font-display text-slate-900 mb-3">Actions</h2>
              <div className="space-y-2">
                {[
                  { label: "Send Message", icon: MessageSquare },
                  { label: "Schedule Check-in", icon: Clock },
                  { label: "Recommend Remediation", icon: LifeBuoy },
                  { label: "Review Pathway", icon: Route },
                ].map((a) => (
                  <button key={a.label} className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg hover:bg-slate-50 transition-colors group text-left">
                    <a.icon className="h-4 w-4 text-slate-400 group-hover:text-emerald-500" />
                    <span className="text-sm text-slate-600 group-hover:text-slate-900">{a.label}</span>
                  </button>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
