"use client";

import React from "react";
import { Award, Search, Eye, CheckCircle2, ExternalLink } from "lucide-react";
import { Button, Badge, Card, Input } from "@/components/ui";
import { DashboardShell, PageHeader } from "@/components/layout/DashboardShell";
import { formatDate } from "@/lib/utils";

const mockCreds = [
  { id: "c1", title: "Digital Literacy Certified", type: "badge", recipient: "Thabo Mokoena", issuer: "SkillWeave SA", issued: "2024-03-15", hash: "SW-abc123", verified: true },
  { id: "c2", title: "Python Programming Certificate", type: "certificate", recipient: "Thabo Mokoena", issuer: "WeThinkCode_", issued: "2024-07-15", hash: "SW-def456", verified: true },
  { id: "c3", title: "Foundation Skills Milestone", type: "milestone", recipient: "Thabo Mokoena", issuer: "SkillWeave SA", issued: "2024-05-28", hash: "SW-ghi789", verified: true },
  { id: "c4", title: "Standard Bank Endorsement", type: "endorsement", recipient: "Nomsa Dlamini", issuer: "Standard Bank", issued: "2024-11-01", hash: "SW-jkl012", verified: true },
  { id: "c5", title: "Data Analytics Badge", type: "badge", recipient: "Sipho Nkosi", issuer: "SkillWeave SA", issued: "2024-10-20", hash: "SW-mno345", verified: true },
  { id: "c6", title: "Core Developer Milestone", type: "milestone", recipient: "Kagiso Mthembu", issuer: "SkillWeave SA", issued: "2025-01-15", hash: "SW-pqr678", verified: true },
];

export default function AdminCredentialsPage() {
  return (
    <DashboardShell role="admin" userName="Admin User" userEmail="admin@skillweave.co.za">
      <PageHeader title="Credential Management" description={`${mockCreds.length} credentials issued platform-wide.`} />
      <div className="px-6 lg:px-8 py-8">
        <div className="relative max-w-md mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input placeholder="Search credentials or recipients..." className="pl-10" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase">Credential</th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-slate-400 uppercase">Type</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase">Recipient</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase">Issuer</th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-slate-400 uppercase">Issued</th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-slate-400 uppercase">Verified</th>
                <th className="text-right py-3 px-4"></th>
              </tr>
            </thead>
            <tbody>
              {mockCreds.map((c) => (
                <tr key={c.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                  <td className="py-3 px-4">
                    <div className="font-medium text-slate-900">{c.title}</div>
                    <code className="text-[10px] text-slate-400 font-mono">{c.hash}</code>
                  </td>
                  <td className="py-3 px-4 text-center"><Badge variant="outline" className="capitalize text-[10px]">{c.type}</Badge></td>
                  <td className="py-3 px-4 text-slate-600">{c.recipient}</td>
                  <td className="py-3 px-4 text-slate-600">{c.issuer}</td>
                  <td className="py-3 px-4 text-center text-slate-500">{formatDate(c.issued)}</td>
                  <td className="py-3 px-4 text-center">{c.verified && <CheckCircle2 className="h-4 w-4 text-emerald-500 mx-auto" />}</td>
                  <td className="py-3 px-4 text-right"><Button variant="ghost" size="icon" className="h-8 w-8"><ExternalLink className="h-3.5 w-3.5" /></Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardShell>
  );
}
