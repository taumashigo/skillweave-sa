"use client";

import React from "react";
import { Route, Users, GraduationCap, Clock, Eye, Search } from "lucide-react";
import { Button, Badge, Card, Input, Progress } from "@/components/ui";
import { DashboardShell, PageHeader } from "@/components/layout/DashboardShell";

const mockPathways = [
  { id: "1", user: "Thabo Mokoena", template: "Full Stack Developer", status: "active", progress: 52, credits: "67/130", modules: 7 },
  { id: "2", user: "Nomsa Dlamini", template: "Data Analyst & BI", status: "active", progress: 35, credits: "42/120", modules: 5 },
  { id: "3", user: "Sipho Nkosi", template: "Full Stack Developer", status: "active", progress: 78, credits: "101/130", modules: 9 },
  { id: "4", user: "Kagiso Mthembu", template: "Full Stack Developer", status: "active", progress: 90, credits: "117/130", modules: 10 },
  { id: "5", user: "Palesa Khumalo", template: "Data Scientist & ML", status: "active", progress: 42, credits: "67/160", modules: 6 },
  { id: "6", user: "Lerato Molefe", template: "Digital Marketing Pro", status: "paused", progress: 15, credits: "14/90", modules: 2 },
];

export default function AdminPathwaysPage() {
  return (
    <DashboardShell role="admin" userName="Admin User" userEmail="admin@skillweave.co.za">
      <PageHeader title="Pathway Management" description={`${mockPathways.length} active pathways across all learners.`} />
      <div className="px-6 lg:px-8 py-8">
        <div className="relative max-w-md mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input placeholder="Search pathways..." className="pl-10" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase">Learner</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase">Template</th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-slate-400 uppercase">Status</th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-slate-400 uppercase">Progress</th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-slate-400 uppercase">Credits</th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-slate-400 uppercase">Modules</th>
                <th className="text-right py-3 px-4"></th>
              </tr>
            </thead>
            <tbody>
              {mockPathways.map((p) => (
                <tr key={p.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                  <td className="py-3 px-4 font-medium text-slate-900">{p.user}</td>
                  <td className="py-3 px-4 text-slate-600">{p.template}</td>
                  <td className="py-3 px-4 text-center"><Badge variant={p.status === "active" ? "success" : "secondary"} className="capitalize">{p.status}</Badge></td>
                  <td className="py-3 px-4"><div className="flex items-center justify-center gap-2"><Progress value={p.progress} className="w-20 h-1.5" /><span className="text-xs text-slate-400">{p.progress}%</span></div></td>
                  <td className="py-3 px-4 text-center text-slate-600">{p.credits}</td>
                  <td className="py-3 px-4 text-center text-slate-600">{p.modules}</td>
                  <td className="py-3 px-4 text-right"><Button variant="ghost" size="icon" className="h-8 w-8"><Eye className="h-3.5 w-3.5" /></Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardShell>
  );
}
