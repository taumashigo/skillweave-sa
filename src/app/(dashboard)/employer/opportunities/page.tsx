"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { PlusCircle, Briefcase, Users, Clock, ChevronRight, Eye, Edit, Trash2, MoreHorizontal } from "lucide-react";
import { Button, Badge, Card, EmptyState } from "@/components/ui";
import { DashboardShell, PageHeader } from "@/components/layout/DashboardShell";
import { formatDate, formatCurrency } from "@/lib/utils";

const mockOpps = [
  { id: "1", title: "Digital Banking Dashboard Redesign", status: "active", type: "project", applicants: 45, reviewed: 12, due: "2025-04-30", compensation: "stipend", amount: 1200000, credits: 15, created: "2025-01-15" },
  { id: "2", title: "Cybersecurity Threat Analysis Simulation", status: "active", type: "simulation", applicants: 31, reviewed: 8, due: "2025-05-15", compensation: "stipend", amount: 800000, credits: 15, created: "2025-02-01" },
  { id: "3", title: "Mobile Customer App Prototype", status: "draft", type: "project", applicants: 0, reviewed: 0, due: "", compensation: "paid", amount: 2000000, credits: 20, created: "2025-03-10" },
  { id: "4", title: "Junior Developer Internship Q2", status: "closed", type: "internship", applicants: 89, reviewed: 89, due: "2024-12-01", compensation: "paid", amount: 5000000, credits: 25, created: "2024-09-15" },
];

const statusVariant: Record<string, any> = { active: "success", draft: "secondary", closed: "outline" };

export default function EmployerOpportunitiesPage() {
  return (
    <DashboardShell role="employer" userName="Standard Bank" userEmail="hr@standardbank.co.za">
      <PageHeader
        title="Manage Opportunities"
        description="Create, edit, and manage your posted opportunities."
        actions={<Link href="/employer/opportunities/new"><Button><PlusCircle className="h-4 w-4 mr-2" />Post New</Button></Link>}
      />
      <div className="px-6 lg:px-8 py-8">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase">Opportunity</th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-slate-400 uppercase">Status</th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-slate-400 uppercase">Type</th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-slate-400 uppercase">Applicants</th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-slate-400 uppercase">Compensation</th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-slate-400 uppercase">Due</th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-slate-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockOpps.map((opp) => (
                <tr key={opp.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-medium text-slate-900">{opp.title}</div>
                    <div className="text-xs text-slate-400">Created {formatDate(opp.created)}</div>
                  </td>
                  <td className="py-3 px-4 text-center"><Badge variant={statusVariant[opp.status]} className="capitalize">{opp.status}</Badge></td>
                  <td className="py-3 px-4 text-center capitalize text-slate-600">{opp.type}</td>
                  <td className="py-3 px-4 text-center">
                    <span className="font-medium text-slate-900">{opp.applicants}</span>
                    <span className="text-slate-400 text-xs ml-1">({opp.reviewed} reviewed)</span>
                  </td>
                  <td className="py-3 px-4 text-center text-slate-600">{formatCurrency(opp.amount)}</td>
                  <td className="py-3 px-4 text-center text-slate-500">{opp.due ? formatDate(opp.due) : "—"}</td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8"><Eye className="h-3.5 w-3.5" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8"><Edit className="h-3.5 w-3.5" /></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardShell>
  );
}
