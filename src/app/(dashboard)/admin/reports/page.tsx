"use client";

import React from "react";
import { BarChart3, Download, TrendingUp, Users, BookOpen, Award, Briefcase, AlertTriangle, LifeBuoy } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Button, Card, StatCard, Badge } from "@/components/ui";
import { DashboardShell, PageHeader } from "@/components/layout/DashboardShell";

const completionTrend = [
  { month: "Sep", rate: 52 }, { month: "Oct", rate: 55 }, { month: "Nov", rate: 58 },
  { month: "Dec", rate: 54 }, { month: "Jan", rate: 61 }, { month: "Feb", rate: 64 }, { month: "Mar", rate: 67 },
];

const enrollmentByProvider = [
  { provider: "CAPACITI", enrollments: 14230 },
  { provider: "WeThinkCode_", enrollments: 9140 },
  { provider: "Explore DSAA", enrollments: 7890 },
  { provider: "Umuzi", enrollments: 5460 },
];

const qualityFlags = [
  { module: "Social Media Management", issue: "Low completion rate (28%)", severity: "warning" },
  { module: "Networking & Linux", issue: "Below average rating (4.4)", severity: "info" },
  { module: "Software Testing & QA", issue: "High drop-off in week 2", severity: "warning" },
];

export default function AdminReportsPage() {
  return (
    <DashboardShell role="admin" userName="Admin User" userEmail="admin@skillweave.co.za">
      <PageHeader
        title="Platform Reports"
        description="Analytics and quality indicators across the platform."
        actions={<Button variant="outline"><Download className="h-4 w-4 mr-2" />Export Report</Button>}
      />
      <div className="px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Platform Completion Rate" value="67%" icon={<TrendingUp className="h-5 w-5" />} trend={{ value: 6, positive: true }} />
          <StatCard label="Avg. Time to Milestone" value="4.2 months" icon={<Award className="h-5 w-5" />} />
          <StatCard label="Remediation Success" value="81%" icon={<LifeBuoy className="h-5 w-5" />} trend={{ value: 8, positive: true }} />
          <StatCard label="Quality Flags" value="3" icon={<AlertTriangle className="h-5 w-5" />} />
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          <Card className="p-6">
            <h3 className="text-base font-semibold font-display text-slate-900 mb-4">Completion Rate Trend</h3>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={completionTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94a3b8" }} />
                <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} domain={[40, 80]} />
                <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0" }} />
                <Line type="monotone" dataKey="rate" stroke="#059669" strokeWidth={2.5} dot={{ r: 4, fill: "#059669" }} />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6">
            <h3 className="text-base font-semibold font-display text-slate-900 mb-4">Enrollments by Provider</h3>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={enrollmentByProvider}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="provider" tick={{ fontSize: 11, fill: "#94a3b8" }} />
                <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} />
                <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0" }} />
                <Bar dataKey="enrollments" fill="#1e3a5f" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        <Card className="p-6">
          <h3 className="text-base font-semibold font-display text-slate-900 mb-4">Quality Flags</h3>
          <div className="space-y-3">
            {qualityFlags.map((flag, i) => (
              <div key={i} className={`flex items-center gap-3 p-3 rounded-lg border ${flag.severity === "warning" ? "border-amber-200 bg-amber-50/50" : "border-blue-200 bg-blue-50/50"}`}>
                <AlertTriangle className={`h-4 w-4 shrink-0 ${flag.severity === "warning" ? "text-amber-500" : "text-blue-500"}`} />
                <div className="flex-1">
                  <span className="text-sm font-medium text-slate-900">{flag.module}</span>
                  <span className="text-sm text-slate-500 ml-2">{flag.issue}</span>
                </div>
                <Button variant="outline" size="sm" className="text-xs">Investigate</Button>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </DashboardShell>
  );
}
