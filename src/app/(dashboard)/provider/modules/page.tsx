"use client";

import React from "react";
import Link from "next/link";
import { PlusCircle, Package, Star, Users, Eye, Edit, MoreHorizontal } from "lucide-react";
import { Button, Badge, Card, Progress } from "@/components/ui";
import { DashboardShell, PageHeader } from "@/components/layout/DashboardShell";
import { formatCurrency } from "@/lib/utils";

const mockModules = [
  { id: "1", title: "Introduction to Programming with Python", status: "published", enrollments: 3200, rating: 4.8, completion: 78, revenue: 0, pricing: "free", credits: 20, nqf: "5" },
  { id: "2", title: "Web Development with JavaScript & React", status: "published", enrollments: 2750, rating: 4.9, completion: 65, revenue: 24697500, pricing: "paid_once", credits: 25, nqf: "5" },
  { id: "3", title: "Backend Development with Node.js", status: "published", enrollments: 1890, rating: 4.7, completion: 58, revenue: 18881100, pricing: "paid_once", credits: 25, nqf: "6" },
  { id: "4", title: "DevOps & Cloud Infrastructure", status: "published", enrollments: 780, rating: 4.5, completion: 42, revenue: 11692200, pricing: "paid_once", credits: 20, nqf: "6" },
  { id: "5", title: "Software Development Capstone", status: "published", enrollments: 520, rating: 4.9, completion: 35, revenue: 0, pricing: "employer_funded", credits: 30, nqf: "6" },
  { id: "6", title: "TypeScript for React Developers", status: "draft", enrollments: 0, rating: 0, completion: 0, revenue: 0, pricing: "paid_once", credits: 15, nqf: "6" },
];

const pricingLabels: Record<string, string> = { free: "Free", paid_once: "Paid", employer_funded: "Employer Funded", sponsored: "Sponsored" };

export default function ProviderModulesPage() {
  return (
    <DashboardShell role="provider" userName="WeThinkCode_" userEmail="admin@wethinkcode.co.za">
      <PageHeader
        title="My Modules"
        description="Manage your published and draft learning modules."
        actions={<Link href="/provider/modules/new"><Button><PlusCircle className="h-4 w-4 mr-2" />New Module</Button></Link>}
      />
      <div className="px-6 lg:px-8 py-8">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase">Module</th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-slate-400 uppercase">Status</th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-slate-400 uppercase">NQF / Credits</th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-slate-400 uppercase">Enrolled</th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-slate-400 uppercase">Rating</th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-slate-400 uppercase">Completion</th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-slate-400 uppercase">Pricing</th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-slate-400 uppercase">Revenue</th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-slate-400 uppercase"></th>
              </tr>
            </thead>
            <tbody>
              {mockModules.map((mod) => (
                <tr key={mod.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                  <td className="py-3 px-4 font-medium text-slate-900 max-w-[250px] truncate">{mod.title}</td>
                  <td className="py-3 px-4 text-center"><Badge variant={mod.status === "published" ? "success" : "secondary"} className="capitalize">{mod.status}</Badge></td>
                  <td className="py-3 px-4 text-center text-slate-600">NQF {mod.nqf} · {mod.credits}cr</td>
                  <td className="py-3 px-4 text-center font-medium text-slate-700">{mod.enrollments.toLocaleString()}</td>
                  <td className="py-3 px-4 text-center">{mod.rating > 0 ? <span className="inline-flex items-center gap-1"><Star className="h-3 w-3 text-amber-400 fill-amber-400" />{mod.rating}</span> : <span className="text-slate-300">—</span>}</td>
                  <td className="py-3 px-4"><div className="flex items-center justify-center gap-2"><Progress value={mod.completion} className="w-16 h-1.5" /><span className="text-xs text-slate-400">{mod.completion}%</span></div></td>
                  <td className="py-3 px-4 text-center"><Badge variant={mod.pricing === "free" ? "free" : "secondary"} className="text-[10px]">{pricingLabels[mod.pricing]}</Badge></td>
                  <td className="py-3 px-4 text-right text-slate-600">{mod.revenue > 0 ? formatCurrency(mod.revenue) : "—"}</td>
                  <td className="py-3 px-4 text-right"><Button variant="ghost" size="icon" className="h-8 w-8"><Edit className="h-3.5 w-3.5" /></Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardShell>
  );
}
