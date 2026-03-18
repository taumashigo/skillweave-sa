"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Package, Users, Star, TrendingUp, PlusCircle, ChevronRight,
  BarChart3, CheckCircle2, LifeBuoy, Eye,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Button, Badge, Card, StatCard, Progress } from "@/components/ui";
import { DashboardShell, PageHeader } from "@/components/layout/DashboardShell";
import { cn, formatCurrency } from "@/lib/utils";

const enrollmentData = [
  { month: "Oct", enrollments: 120 },
  { month: "Nov", enrollments: 180 },
  { month: "Dec", enrollments: 150 },
  { month: "Jan", enrollments: 220 },
  { month: "Feb", enrollments: 310 },
  { month: "Mar", enrollments: 280 },
];

const mockModules = [
  { title: "Intro to Programming with Python", enrollments: 3200, rating: 4.8, completion: 78, revenue: 0 },
  { title: "Web Dev with JavaScript & React", enrollments: 2750, rating: 4.9, completion: 65, revenue: 24697500 },
  { title: "Backend Development with Node.js", enrollments: 1890, rating: 4.7, completion: 58, revenue: 18881100 },
  { title: "DevOps & Cloud Infrastructure", enrollments: 780, rating: 4.5, completion: 42, revenue: 11692200 },
  { title: "Software Dev Capstone", enrollments: 520, rating: 4.9, completion: 35, revenue: 0 },
];

const fadeUp = { hidden: { opacity: 0, y: 12 }, visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06 } }) };

export default function ProviderDashboard() {
  return (
    <DashboardShell role="provider" userName="WeThinkCode_" userEmail="admin@wethinkcode.co.za">
      <PageHeader
        title="Provider Dashboard"
        description="Manage your published modules, track enrollments, and monitor learner success."
        actions={
          <Link href="/provider/modules/new">
            <Button><PlusCircle className="h-4 w-4 mr-2" />New Module</Button>
          </Link>
        }
      />

      <div className="px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Published Modules", value: "5", icon: <Package className="h-5 w-5" /> },
            { label: "Total Enrollments", value: "9,140", icon: <Users className="h-5 w-5" />, trend: { value: 22, positive: true } },
            { label: "Avg. Rating", value: "4.76", icon: <Star className="h-5 w-5" /> },
            { label: "Completion Rate", value: "62%", icon: <CheckCircle2 className="h-5 w-5" /> },
          ].map((s, i) => (
            <motion.div key={s.label} custom={i} initial="hidden" animate="visible" variants={fadeUp}>
              <StatCard {...s} />
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Enrollment Chart */}
            <Card className="p-6">
              <h3 className="text-base font-semibold font-display text-slate-900 mb-4">Monthly Enrollments</h3>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={enrollmentData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94a3b8" }} />
                  <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} />
                  <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "13px" }} />
                  <Bar dataKey="enrollments" fill="#059669" radius={[4, 4, 0, 0]} barSize={32} />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            {/* Module Performance Table */}
            <Card className="p-6">
              <h3 className="text-base font-semibold font-display text-slate-900 mb-4">Module Performance</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-2 text-xs font-semibold text-slate-400 uppercase">Module</th>
                      <th className="text-center py-2 text-xs font-semibold text-slate-400 uppercase">Enrolled</th>
                      <th className="text-center py-2 text-xs font-semibold text-slate-400 uppercase">Rating</th>
                      <th className="text-center py-2 text-xs font-semibold text-slate-400 uppercase">Completion</th>
                      <th className="text-right py-2 text-xs font-semibold text-slate-400 uppercase">Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockModules.map((m) => (
                      <tr key={m.title} className="border-b border-slate-100 last:border-0">
                        <td className="py-3 font-medium text-slate-900">{m.title}</td>
                        <td className="py-3 text-center text-slate-600">{m.enrollments.toLocaleString()}</td>
                        <td className="py-3 text-center">
                          <span className="inline-flex items-center gap-1">
                            <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                            {m.rating}
                          </span>
                        </td>
                        <td className="py-3">
                          <div className="flex items-center justify-center gap-2">
                            <Progress value={m.completion} className="w-16 h-1.5" />
                            <span className="text-xs text-slate-400">{m.completion}%</span>
                          </div>
                        </td>
                        <td className="py-3 text-right text-slate-600">
                          {m.revenue > 0 ? formatCurrency(m.revenue) : <span className="text-slate-400">Free</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="p-5">
              <h2 className="text-base font-semibold font-display text-slate-900 mb-3">Quick Actions</h2>
              <div className="space-y-2">
                {[
                  { label: "Create New Module", href: "/provider/modules/new", icon: PlusCircle },
                  { label: "View All Modules", href: "/provider/modules", icon: Package },
                  { label: "See Reviews", href: "/provider/reviews", icon: Star },
                  { label: "Analytics", href: "/provider/analytics", icon: BarChart3 },
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
              <h2 className="text-base font-semibold font-display text-slate-900 mb-3">Remediation Metrics</h2>
              <div className="space-y-2 text-sm text-slate-600">
                <div className="flex justify-between"><span>Modules with remediation</span><span className="font-semibold text-slate-900">3/5</span></div>
                <div className="flex justify-between"><span>Active remediations</span><span className="font-semibold text-slate-900">48</span></div>
                <div className="flex justify-between"><span>Avg. score improvement</span><span className="font-semibold text-emerald-600">+34%</span></div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
