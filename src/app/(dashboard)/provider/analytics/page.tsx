"use client";

import React from "react";
import { BarChart3, TrendingUp, Users, Star, Clock, Award, LifeBuoy } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Card, StatCard, Badge } from "@/components/ui";
import { DashboardShell, PageHeader } from "@/components/layout/DashboardShell";
import { formatCurrency } from "@/lib/utils";

const monthlyData = [
  { month: "Sep", enrollments: 95, completions: 42, revenue: 850000 },
  { month: "Oct", enrollments: 120, completions: 58, revenue: 1100000 },
  { month: "Nov", enrollments: 180, completions: 75, revenue: 1650000 },
  { month: "Dec", enrollments: 150, completions: 88, revenue: 1380000 },
  { month: "Jan", enrollments: 220, completions: 102, revenue: 2020000 },
  { month: "Feb", enrollments: 310, completions: 135, revenue: 2850000 },
  { month: "Mar", enrollments: 280, completions: 148, revenue: 2570000 },
];

const difficultyBreakdown = [
  { name: "Beginner", value: 1, color: "#34d399" },
  { name: "Intermediate", value: 3, color: "#60a5fa" },
  { name: "Advanced", value: 1, color: "#f59e0b" },
];

const remediationData = [
  { module: "Python", assigned: 120, completed: 98, avg_improvement: 34 },
  { module: "React/JS", assigned: 85, completed: 62, avg_improvement: 28 },
  { module: "Node.js", assigned: 45, completed: 30, avg_improvement: 31 },
];

export default function ProviderAnalyticsPage() {
  return (
    <DashboardShell role="provider" userName="WeThinkCode_" userEmail="admin@wethinkcode.co.za">
      <PageHeader title="Analytics" description="Deep insights into your module performance and learner outcomes." />
      <div className="px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Revenue" value={formatCurrency(5527030000)} icon={<TrendingUp className="h-5 w-5" />} trend={{ value: 18, positive: true }} />
          <StatCard label="Avg. Completion" value="62%" icon={<Award className="h-5 w-5" />} trend={{ value: 5, positive: true }} />
          <StatCard label="Avg. Time to Complete" value="6.2 weeks" icon={<Clock className="h-5 w-5" />} />
          <StatCard label="Remediation Success" value="81%" icon={<LifeBuoy className="h-5 w-5" />} trend={{ value: 8, positive: true }} />
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* Enrollments & Completions */}
          <Card className="p-6">
            <h3 className="text-base font-semibold font-display text-slate-900 mb-4">Enrollments vs Completions</h3>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94a3b8" }} />
                <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} />
                <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "13px" }} />
                <Bar dataKey="enrollments" fill="#059669" radius={[4, 4, 0, 0]} barSize={16} name="Enrollments" />
                <Bar dataKey="completions" fill="#1e3a5f" radius={[4, 4, 0, 0]} barSize={16} name="Completions" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Revenue Trend */}
          <Card className="p-6">
            <h3 className="text-base font-semibold font-display text-slate-900 mb-4">Monthly Revenue (ZAR)</h3>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94a3b8" }} />
                <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} tickFormatter={(v) => `R${(v/100).toFixed(0)}`} />
                <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "13px" }} formatter={(v: number) => formatCurrency(v)} />
                <Line type="monotone" dataKey="revenue" stroke="#059669" strokeWidth={2.5} dot={{ r: 4, fill: "#059669" }} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Difficulty Distribution */}
          <Card className="p-6">
            <h3 className="text-base font-semibold font-display text-slate-900 mb-4">Module Difficulty</h3>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={difficultyBreakdown} cx="50%" cy="50%" innerRadius={40} outerRadius={70} dataKey="value" stroke="none">
                  {difficultyBreakdown.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-1.5 mt-2">
              {difficultyBreakdown.map((d) => (
                <div key={d.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2"><div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: d.color }} /><span className="text-slate-600">{d.name}</span></div>
                  <span className="font-medium text-slate-900">{d.value} modules</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Remediation Effectiveness */}
          <Card className="p-6 lg:col-span-2">
            <h3 className="text-base font-semibold font-display text-slate-900 mb-4">Remediation Effectiveness</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-2 text-xs font-semibold text-slate-400 uppercase">Module</th>
                  <th className="text-center py-2 text-xs font-semibold text-slate-400 uppercase">Assigned</th>
                  <th className="text-center py-2 text-xs font-semibold text-slate-400 uppercase">Completed</th>
                  <th className="text-center py-2 text-xs font-semibold text-slate-400 uppercase">Completion Rate</th>
                  <th className="text-center py-2 text-xs font-semibold text-slate-400 uppercase">Avg. Improvement</th>
                </tr>
              </thead>
              <tbody>
                {remediationData.map((r) => (
                  <tr key={r.module} className="border-b border-slate-100">
                    <td className="py-3 font-medium text-slate-900">{r.module}</td>
                    <td className="py-3 text-center text-slate-600">{r.assigned}</td>
                    <td className="py-3 text-center text-slate-600">{r.completed}</td>
                    <td className="py-3 text-center text-slate-600">{Math.round((r.completed / r.assigned) * 100)}%</td>
                    <td className="py-3 text-center"><Badge variant="success">+{r.avg_improvement}%</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      </div>
    </DashboardShell>
  );
}
