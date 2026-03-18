"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Briefcase, Users, ClipboardCheck, PlusCircle, ChevronRight,
  Eye, Clock, CheckCircle2, XCircle, TrendingUp,
} from "lucide-react";
import { Button, Badge, Card, StatCard, Progress, EmptyState } from "@/components/ui";
import { DashboardShell, PageHeader } from "@/components/layout/DashboardShell";
import { cn, formatDate } from "@/lib/utils";

const mockOpps = [
  { id: "1", title: "Digital Banking Dashboard Redesign", status: "active", applicants: 45, reviewed: 12, due: "2025-04-30" },
  { id: "2", title: "Cybersecurity Threat Analysis Sim", status: "active", applicants: 31, reviewed: 8, due: "2025-05-15" },
  { id: "3", title: "Mobile Customer App Prototype", status: "draft", applicants: 0, reviewed: 0, due: "" },
];

const recentApplicants = [
  { name: "Thabo Mokoena", role: "Full Stack Developer", opp: "Dashboard Redesign", status: "pending", date: "2025-03-14" },
  { name: "Nomsa Dlamini", role: "UX Designer", opp: "Dashboard Redesign", status: "accepted", date: "2025-03-13" },
  { name: "Sipho Nkosi", role: "Data Analyst", opp: "Threat Analysis Sim", status: "pending", date: "2025-03-12" },
  { name: "Lerato Molefe", role: "Cybersecurity", opp: "Threat Analysis Sim", status: "rejected", date: "2025-03-10" },
];

const fadeUp = { hidden: { opacity: 0, y: 12 }, visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06 } }) };

export default function EmployerDashboard() {
  return (
    <DashboardShell role="employer" userName="Standard Bank" userEmail="hr@standardbank.co.za">
      <PageHeader
        title="Employer Dashboard"
        description="Manage your opportunities, review applicants, and endorse talent."
        actions={
          <Link href="/employer/opportunities/new">
            <Button><PlusCircle className="h-4 w-4 mr-2" />Post Opportunity</Button>
          </Link>
        }
      />

      <div className="px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Active Opportunities", value: "2", icon: <Briefcase className="h-5 w-5" /> },
            { label: "Total Applicants", value: "76", icon: <Users className="h-5 w-5" />, trend: { value: 15, positive: true } },
            { label: "Pending Reviews", value: "56", icon: <Clock className="h-5 w-5" /> },
            { label: "Evaluations Done", value: "20", icon: <ClipboardCheck className="h-5 w-5" /> },
          ].map((s, i) => (
            <motion.div key={s.label} custom={i} initial="hidden" animate="visible" variants={fadeUp}>
              <StatCard {...s} />
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Opportunities */}
            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-semibold font-display text-slate-900">Your Opportunities</h2>
                  <Link href="/employer/opportunities"><Button variant="ghost" size="sm">View All<ChevronRight className="h-4 w-4 ml-1" /></Button></Link>
                </div>
                <div className="space-y-3">
                  {mockOpps.map((opp) => (
                    <div key={opp.id} className="flex items-center gap-4 p-3 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-sm font-medium text-slate-900 truncate">{opp.title}</span>
                          <Badge variant={opp.status === "active" ? "success" : "secondary"}>
                            {opp.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate-400">
                          <span><Users className="h-3 w-3 inline mr-1" />{opp.applicants} applicants</span>
                          <span><ClipboardCheck className="h-3 w-3 inline mr-1" />{opp.reviewed} reviewed</span>
                          {opp.due && <span><Clock className="h-3 w-3 inline mr-1" />Due {formatDate(opp.due)}</span>}
                        </div>
                      </div>
                      <Button variant="outline" size="sm">Manage<ChevronRight className="h-3.5 w-3.5 ml-1" /></Button>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Recent Applicants */}
            <Card>
              <div className="p-6">
                <h2 className="text-base font-semibold font-display text-slate-900 mb-4">Recent Applicants</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="text-left py-2 text-xs font-semibold text-slate-400 uppercase">Name</th>
                        <th className="text-left py-2 text-xs font-semibold text-slate-400 uppercase">Focus</th>
                        <th className="text-left py-2 text-xs font-semibold text-slate-400 uppercase">Opportunity</th>
                        <th className="text-center py-2 text-xs font-semibold text-slate-400 uppercase">Status</th>
                        <th className="text-right py-2 text-xs font-semibold text-slate-400 uppercase">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentApplicants.map((a, i) => (
                        <tr key={i} className="border-b border-slate-100 last:border-0">
                          <td className="py-3 font-medium text-slate-900">{a.name}</td>
                          <td className="py-3 text-slate-500">{a.role}</td>
                          <td className="py-3 text-slate-500">{a.opp}</td>
                          <td className="py-3 text-center">
                            <Badge variant={a.status === "accepted" ? "success" : a.status === "rejected" ? "destructive" : "warning"}>
                              {a.status}
                            </Badge>
                          </td>
                          <td className="py-3 text-right text-slate-400">{formatDate(a.date)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="p-5">
              <h2 className="text-base font-semibold font-display text-slate-900 mb-3">Quick Actions</h2>
              <div className="space-y-2">
                {[
                  { label: "Post New Opportunity", href: "/employer/opportunities/new", icon: PlusCircle },
                  { label: "Review Submissions", href: "/employer/submissions", icon: ClipboardCheck },
                  { label: "Verify a Credential", href: "/verify/demo", icon: Eye },
                ].map((a) => (
                  <Link key={a.label} href={a.href}>
                    <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-50 transition-colors group">
                      <a.icon className="h-4 w-4 text-slate-400 group-hover:text-emerald-500" />
                      <span className="text-sm text-slate-600 group-hover:text-slate-900">{a.label}</span>
                      <ChevronRight className="h-4 w-4 text-slate-300 ml-auto" />
                    </div>
                  </Link>
                ))}
              </div>
            </Card>
            <Card className="p-5">
              <h2 className="text-base font-semibold font-display text-slate-900 mb-3">Talent Pipeline</h2>
              <div className="space-y-2 text-sm text-slate-600">
                <div className="flex justify-between"><span>Applicants this month</span><span className="font-semibold text-slate-900">23</span></div>
                <div className="flex justify-between"><span>Endorsed learners</span><span className="font-semibold text-slate-900">8</span></div>
                <div className="flex justify-between"><span>Avg. applicant NQF level</span><span className="font-semibold text-slate-900">5.2</span></div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
