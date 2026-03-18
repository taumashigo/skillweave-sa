"use client";

import React from "react";
import { Package, Star, Users, Eye, Edit, Shield, CheckCircle2, Search } from "lucide-react";
import { Button, Badge, Card, Input, Progress } from "@/components/ui";
import { DashboardShell, PageHeader } from "@/components/layout/DashboardShell";
import { formatCurrency } from "@/lib/utils";
import { SEED_MODULES } from "@/data/seed";
import type { Module } from "@/types";

export default function AdminModulesPage() {
  const modules = (SEED_MODULES as Module[]).slice(0, 15);

  return (
    <DashboardShell role="admin" userName="Admin User" userEmail="admin@skillweave.co.za">
      <PageHeader title="Module Management" description={`${SEED_MODULES.length} modules across all providers.`} />
      <div className="px-6 lg:px-8 py-8">
        <div className="relative max-w-md mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input placeholder="Search modules..." className="pl-10" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-3 text-xs font-semibold text-slate-400 uppercase">Module</th>
                <th className="text-left py-3 px-3 text-xs font-semibold text-slate-400 uppercase">Provider</th>
                <th className="text-center py-3 px-3 text-xs font-semibold text-slate-400 uppercase">NQF</th>
                <th className="text-center py-3 px-3 text-xs font-semibold text-slate-400 uppercase">Credits</th>
                <th className="text-center py-3 px-3 text-xs font-semibold text-slate-400 uppercase">Enrolled</th>
                <th className="text-center py-3 px-3 text-xs font-semibold text-slate-400 uppercase">Rating</th>
                <th className="text-center py-3 px-3 text-xs font-semibold text-slate-400 uppercase">Pricing</th>
                <th className="text-center py-3 px-3 text-xs font-semibold text-slate-400 uppercase">Flags</th>
                <th className="text-right py-3 px-3 text-xs font-semibold text-slate-400 uppercase"></th>
              </tr>
            </thead>
            <tbody>
              {modules.map((m) => (
                <tr key={m.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                  <td className="py-2.5 px-3 font-medium text-slate-900 max-w-[200px] truncate">{m.title}</td>
                  <td className="py-2.5 px-3 text-slate-500 text-xs">{m.provider_name}</td>
                  <td className="py-2.5 px-3 text-center text-slate-600">{m.nqf_level}</td>
                  <td className="py-2.5 px-3 text-center text-slate-600">{m.credits}</td>
                  <td className="py-2.5 px-3 text-center font-medium">{m.enrollment_count.toLocaleString()}</td>
                  <td className="py-2.5 px-3 text-center"><span className="inline-flex items-center gap-0.5"><Star className="h-3 w-3 text-amber-400 fill-amber-400" />{m.rating}</span></td>
                  <td className="py-2.5 px-3 text-center"><Badge variant={m.pricing_model === "free" ? "free" : "secondary"} className="text-[9px]">{m.pricing_model === "free" ? "Free" : formatCurrency(m.cost_cents)}</Badge></td>
                  <td className="py-2.5 px-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      {m.is_accredited && <Shield className="h-3 w-3 text-blue-500" title="Accredited" />}
                      {m.employer_endorsed && <CheckCircle2 className="h-3 w-3 text-emerald-500" title="Endorsed" />}
                    </div>
                  </td>
                  <td className="py-2.5 px-3 text-right"><Button variant="ghost" size="icon" className="h-7 w-7"><Eye className="h-3.5 w-3.5" /></Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardShell>
  );
}
