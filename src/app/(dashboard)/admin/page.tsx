"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Users, BookOpen, Route, Award, TrendingUp, BarChart3,
  AlertTriangle, Activity, ArrowUpRight, ArrowDownRight,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell,
} from "recharts";
import { Card, StatCard, Badge } from "@/components/ui";
import { DashboardShell, PageHeader } from "@/components/layout/DashboardShell";

const userGrowth = [
  { month: "Aug", users: 340 }, { month: "Sep", users: 520 },
  { month: "Oct", users: 780 }, { month: "Nov", users: 1050 },
  { month: "Dec", users: 1320 }, { month: "Jan", users: 1680 },
  { month: "Feb", users: 2100 }, { month: "Mar", users: 2580 },
];

const moduleCategories = [
  { name: "Technology", value: 18, color: "#059669" },
  { name: "Business", value: 8, color: "#1e3a5f" },
  { name: "Communication", value: 5, color: "#7c3aed" },
  { name: "Career Skills", value: 5, color: "#d97706" },
  { name: "Data Science", value: 6, color: "#2563eb" },
];

const topModules = [
  { title: "Career Readiness & Job Search", enrollments: 5200 },
  { title: "Financial Literacy for Young Professionals", enrollments: 4200 },
  { title: "AI & Prompt Engineering", enrollments: 3800 },
  { title: "Workplace Professionalism", enrollments: 3800 },
  { title: "Professional Communication", enrollments: 3400 },
];

const recentActivity = [
  { action: "New user registered", detail: "Nomsa Dlamini (Learner)", time: "2 min ago" },
  { action: "Module completed", detail: "Python Programming - Sipho Nkosi", time: "8 min ago" },
  { action: "Credential issued", detail: "Digital Literacy Badge - Lerato Molefe", time: "15 min ago" },
  { action: "RPL submitted", detail: "Project Management - Thandi Zulu", time: "32 min ago" },
  { action: "Opportunity posted", detail: "Standard Bank - Dashboard Redesign", time: "1 hr ago" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06 } }),
};

export default function AdminDashboard() {
  return (
    <DashboardShell role="admin" userName="Admin User" userEmail="admin@skillweave.co.za">
      <PageHeader
        title="Platform Dashboard"
        description="Overview of SkillWeave SA platform metrics and activity."
      />

      <div className="px-6 lg:px-8 py-8">
        {/* Key Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Users", value: "2,580", icon: <Users className="h-5 w-5" />, trend: { value: 23, positive: true } },
            { label: "Active Modules", value: "42", icon: <BookOpen className="h-5 w-5" />, trend: { value: 5, positive: true } },
            { label: "Active Pathways", value: "1,240", icon: <Route className="h-5 w-5" />, trend: { value: 18, positive: true } },
            { label: "Credentials Issued", value: "3,670", icon: <Award className="h-5 w-5" />, trend: { value: 32, positive: true } },
          ].map((stat, i) => (
            <motion.div key={stat.label} custom={i} initial="hidden" animate="visible" variants={fadeUp}>
              <StatCard {...stat} />
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* User Growth Chart */}
          <motion.div custom={4} initial="hidden" animate="visible" variants={fadeUp} className="lg:col-span-2">
            <Card className="p-6">
              <h3 className="text-base font-semibold font-display text-slate-900 mb-4">
                User Growth
              </h3>
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={userGrowth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94a3b8" }} />
                  <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} />
                  <Tooltip
                    contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "13px" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="users"
                    stroke="#059669"
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: "#059669" }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>

          {/* Module Categories Pie */}
          <motion.div custom={5} initial="hidden" animate="visible" variants={fadeUp}>
            <Card className="p-6">
              <h3 className="text-base font-semibold font-display text-slate-900 mb-4">
                Module Categories
              </h3>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={moduleCategories}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={75}
                    dataKey="value"
                    stroke="none"
                  >
                    {moduleCategories.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-1.5 mt-2">
                {moduleCategories.map((cat) => (
                  <div key={cat.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                      <span className="text-slate-600">{cat.name}</span>
                    </div>
                    <span className="font-medium text-slate-900">{cat.value}</span>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Top Modules */}
          <motion.div custom={6} initial="hidden" animate="visible" variants={fadeUp} className="lg:col-span-2">
            <Card className="p-6">
              <h3 className="text-base font-semibold font-display text-slate-900 mb-4">
                Top Modules by Enrollment
              </h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={topModules} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 12, fill: "#94a3b8" }} />
                  <YAxis
                    dataKey="title"
                    type="category"
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    width={200}
                  />
                  <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "13px" }} />
                  <Bar dataKey="enrollments" fill="#059669" radius={[0, 4, 4, 0]} barSize={18} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>

          {/* Recent Activity */}
          <motion.div custom={7} initial="hidden" animate="visible" variants={fadeUp}>
            <Card className="p-6">
              <h3 className="text-base font-semibold font-display text-slate-900 mb-4">
                Recent Activity
              </h3>
              <div className="space-y-3">
                {recentActivity.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 mt-2 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-slate-900">{item.action}</div>
                      <div className="text-xs text-slate-500">{item.detail}</div>
                    </div>
                    <span className="text-xs text-slate-400 shrink-0">{item.time}</span>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </DashboardShell>
  );
}
