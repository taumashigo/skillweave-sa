"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Heart, Users, BookOpen, Banknote, TrendingUp, ChevronRight,
  GraduationCap, Award, Eye, PlusCircle,
} from "lucide-react";
import { Button, Badge, Card, StatCard, Progress, Avatar } from "@/components/ui";
import { DashboardShell, PageHeader } from "@/components/layout/DashboardShell";
import { useAuth } from "@/lib/hooks";
import { formatCurrency } from "@/lib/utils";

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.35 } }),
};

const sponsoredLearners = [
  { name: "Thabo Mokoena", pathway: "Full Stack Developer", progress: 52, credits: "67/130", status: "on_track" },
  { name: "Nomsa Dlamini", pathway: "Data Analyst & BI", progress: 35, credits: "42/120", status: "on_track" },
  { name: "Lerato Molefe", pathway: "Digital Marketing", progress: 15, credits: "14/90", status: "at_risk" },
];

const sponsoredModules = [
  { title: "Digital Literacy Foundations", learners: 342, cost: 0, type: "Fully Sponsored" },
  { title: "Career Readiness & Job Search", learners: 512, cost: 0, type: "Fully Sponsored" },
  { title: "Entrepreneurship & Startup Foundations", learners: 201, cost: 0, type: "Fully Sponsored" },
];

export default function SponsorDashboard() {
  const { profile } = useAuth();
  const displayName = profile?.full_name && profile.full_name.trim() !== "" ? profile.full_name : profile?.email?.split("@")[0] || "Sponsor";

  return (
    <DashboardShell role="sponsor" userName={displayName} userEmail={profile?.email || ""}>
      <PageHeader
        title={`Welcome, ${displayName.split(" ")[0]}`}
        description="Track your sponsored learners, funded modules, and social impact."
        actions={
          <Button>
            <PlusCircle className="h-4 w-4 mr-2" />
            Fund a Bursary
          </Button>
        }
      />

      <div className="px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Learners Sponsored", value: "3", icon: <Users className="h-5 w-5" />, trend: { value: 2, positive: true } },
            { label: "Modules Funded", value: "3", icon: <BookOpen className="h-5 w-5" /> },
            { label: "Total Investment", value: formatCurrency(15000000), icon: <Banknote className="h-5 w-5" /> },
            { label: "Credentials Earned", value: "7", icon: <Award className="h-5 w-5" />, trend: { value: 3, positive: true } },
          ].map((stat, i) => (
            <motion.div key={stat.label} custom={i} initial="hidden" animate="visible" variants={fadeUp}>
              <StatCard {...stat} />
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Sponsored Learners */}
            <motion.div custom={4} initial="hidden" animate="visible" variants={fadeUp}>
              <Card>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-base font-semibold font-display text-slate-900">Sponsored Learners</h2>
                    <Button variant="ghost" size="sm">View All <ChevronRight className="h-4 w-4 ml-1" /></Button>
                  </div>
                  <div className="space-y-3">
                    {sponsoredLearners.map((learner) => (
                      <div key={learner.name} className="flex items-center gap-4 p-3 rounded-lg border border-slate-200">
                        <Avatar name={learner.name} size="md" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-sm font-medium text-slate-900">{learner.name}</span>
                            <Badge variant={learner.status === "on_track" ? "success" : "warning"}>
                              {learner.status === "on_track" ? "On Track" : "At Risk"}
                            </Badge>
                          </div>
                          <div className="text-xs text-slate-500">{learner.pathway} · {learner.credits}</div>
                          <Progress value={learner.progress} className="mt-2 h-1.5" />
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-lg font-bold font-display text-slate-900">{learner.progress}%</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Funded Modules */}
            <motion.div custom={5} initial="hidden" animate="visible" variants={fadeUp}>
              <Card>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-base font-semibold font-display text-slate-900">Funded Modules</h2>
                    <Button variant="ghost" size="sm">Browse Catalogue <ChevronRight className="h-4 w-4 ml-1" /></Button>
                  </div>
                  <div className="space-y-3">
                    {sponsoredModules.map((mod) => (
                      <div key={mod.title} className="flex items-center gap-3 p-3 rounded-lg border border-slate-200">
                        <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center shrink-0">
                          <Heart className="h-5 w-5 text-purple-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-slate-900">{mod.title}</div>
                          <div className="text-xs text-slate-500">{mod.learners} learners benefiting · {mod.type}</div>
                        </div>
                        <Badge variant="sponsored">Sponsored</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Impact Summary */}
            <motion.div custom={4} initial="hidden" animate="visible" variants={fadeUp}>
              <Card className="p-5 bg-gradient-to-br from-purple-50 to-white border-purple-200">
                <h2 className="text-base font-semibold font-display text-purple-900 mb-3 flex items-center gap-2">
                  <Heart className="h-5 w-5 text-purple-600" />
                  Your Impact
                </h2>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between"><span className="text-purple-700">Learners supported</span><span className="font-bold text-purple-900">3</span></div>
                  <div className="flex justify-between"><span className="text-purple-700">Modules completed</span><span className="font-bold text-purple-900">7</span></div>
                  <div className="flex justify-between"><span className="text-purple-700">Credentials earned</span><span className="font-bold text-purple-900">7</span></div>
                  <div className="flex justify-between"><span className="text-purple-700">Employment outcomes</span><span className="font-bold text-purple-900">1</span></div>
                </div>
                <div className="mt-4 pt-3 border-t border-purple-200">
                  <p className="text-xs text-purple-600">Your funding has helped 3 young South Africans progress toward employment.</p>
                </div>
              </Card>
            </motion.div>

            {/* Quick Actions */}
            <motion.div custom={5} initial="hidden" animate="visible" variants={fadeUp}>
              <Card className="p-5">
                <h2 className="text-base font-semibold font-display text-slate-900 mb-3">Actions</h2>
                <div className="space-y-1">
                  {[
                    { label: "Fund a New Bursary", icon: Banknote },
                    { label: "Sponsor a Module", icon: BookOpen },
                    { label: "View Learner Reports", icon: TrendingUp },
                    { label: "Verify Credentials", icon: Eye },
                  ].map((action) => (
                    <button key={action.label} className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg hover:bg-slate-50 transition-colors group text-left">
                      <action.icon className="h-4 w-4 text-slate-400 group-hover:text-emerald-500" />
                      <span className="text-sm text-slate-600 group-hover:text-slate-900">{action.label}</span>
                      <ChevronRight className="h-4 w-4 text-slate-300 ml-auto" />
                    </button>
                  ))}
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}