"use client";

import React from "react";
import { Users, Search, Route, GraduationCap, Clock, LifeBuoy, Eye, MessageSquare, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Button, Badge, Card, Input, Avatar, Progress } from "@/components/ui";
import { DashboardShell, PageHeader } from "@/components/layout/DashboardShell";
import { cn } from "@/lib/utils";

const learners = [
  { id: "1", name: "Thabo Mokoena", email: "thabo@example.co.za", pathway: "Full Stack Developer", progress: 52, credits: "67/130", status: "on_track", remediations: 1, lastActive: "Today", province: "Gauteng" },
  { id: "2", name: "Nomsa Dlamini", email: "nomsa@example.co.za", pathway: "Data Analyst & BI", progress: 35, credits: "42/120", status: "at_risk", remediations: 2, lastActive: "2 days ago", province: "KwaZulu-Natal" },
  { id: "3", name: "Sipho Nkosi", email: "sipho@example.co.za", pathway: "Full Stack Developer", progress: 78, credits: "101/130", status: "on_track", remediations: 0, lastActive: "Today", province: "Western Cape" },
  { id: "4", name: "Lerato Molefe", email: "lerato@example.co.za", pathway: "Digital Marketing Pro", progress: 15, credits: "14/90", status: "inactive", remediations: 0, lastActive: "2 weeks ago", province: "Gauteng" },
  { id: "5", name: "Palesa Khumalo", email: "palesa@example.co.za", pathway: "Data Scientist & ML", progress: 42, credits: "67/160", status: "on_track", remediations: 1, lastActive: "Yesterday", province: "Free State" },
  { id: "6", name: "Kagiso Mthembu", email: "kagiso@example.co.za", pathway: "Full Stack Developer", progress: 90, credits: "117/130", status: "on_track", remediations: 0, lastActive: "Today", province: "Gauteng" },
];

const statusConfig: Record<string, { label: string; variant: any; color: string }> = {
  on_track: { label: "On Track", variant: "success", color: "bg-emerald-500" },
  at_risk: { label: "At Risk", variant: "warning", color: "bg-amber-500" },
  inactive: { label: "Inactive", variant: "secondary", color: "bg-slate-400" },
};

export default function AdvisorLearnersPage() {
  return (
    <DashboardShell role="mentor" userName="Dr. Zanele Mthembu" userEmail="zanele@capaciti.org.za">
      <PageHeader title="My Learners" description="View and manage all your assigned advisees." />
      <div className="px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input placeholder="Search learners..." className="pl-10" />
          </div>
          <div className="flex gap-1.5">
            {["All", "On Track", "At Risk", "Inactive"].map((f) => (
              <button key={f} className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${f === "All" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "text-slate-500 border-slate-200 hover:bg-slate-50"}`}>{f}</button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase">Learner</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase">Pathway</th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-slate-400 uppercase">Progress</th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-slate-400 uppercase">Credits</th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-slate-400 uppercase">Status</th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-slate-400 uppercase">Active</th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-slate-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {learners.map((l) => {
                const status = statusConfig[l.status];
                return (
                  <tr key={l.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <Avatar name={l.name} size="sm" />
                        <div>
                          <div className="font-medium text-slate-900">{l.name}</div>
                          <div className="text-xs text-slate-400">{l.province}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-600">{l.pathway}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <Progress value={l.progress} className="w-20 h-1.5" variant={l.status === "at_risk" ? "warning" : "default"} />
                        <span className="text-xs text-slate-500 w-8">{l.progress}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center text-slate-600">{l.credits}</td>
                    <td className="py-3 px-4 text-center">
                      <Badge variant={status.variant} className="gap-1">
                        {l.remediations > 0 && <LifeBuoy className="h-2.5 w-2.5" />}
                        {status.label}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-center text-xs text-slate-500">{l.lastActive}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8"><Eye className="h-3.5 w-3.5" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8"><MessageSquare className="h-3.5 w-3.5" /></Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardShell>
  );
}
