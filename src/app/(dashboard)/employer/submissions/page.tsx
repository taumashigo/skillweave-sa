"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ClipboardCheck, Eye, Download, CheckCircle2, XCircle, Star, MessageSquare, ChevronRight, FileText } from "lucide-react";
import { Button, Badge, Card, Avatar, Textarea, EmptyState, Separator } from "@/components/ui";
import { DashboardShell, PageHeader } from "@/components/layout/DashboardShell";
import { formatDate } from "@/lib/utils";

const mockSubmissions = [
  { id: "s1", learner: "Thabo Mokoena", opportunity: "Dashboard Redesign", submitted: "2025-03-10", files: ["dashboard-prototype.fig", "user-research.pdf"], status: "pending", score: null },
  { id: "s2", learner: "Nomsa Dlamini", opportunity: "Dashboard Redesign", submitted: "2025-03-08", files: ["wireframes-v2.fig", "usability-report.pdf"], status: "reviewed", score: 85 },
  { id: "s3", learner: "Sipho Nkosi", opportunity: "Threat Analysis Sim", submitted: "2025-03-12", files: ["threat-report.pdf", "incident-response.docx"], status: "pending", score: null },
];

export default function EmployerSubmissionsPage() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <DashboardShell role="employer" userName="Standard Bank" userEmail="hr@standardbank.co.za">
      <PageHeader title="Submissions" description="Review learner submissions and provide evaluations." />
      <div className="px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* List */}
          <div className="lg:col-span-2 space-y-3">
            {mockSubmissions.map((sub) => (
              <Card
                key={sub.id}
                className={`p-4 cursor-pointer transition-all ${selected === sub.id ? "border-emerald-300 bg-emerald-50/20" : "hover:border-slate-300"}`}
                onClick={() => setSelected(sub.id)}
              >
                <div className="flex items-center gap-3">
                  <Avatar name={sub.learner} size="md" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm font-medium text-slate-900">{sub.learner}</span>
                      <Badge variant={sub.status === "reviewed" ? "success" : "warning"}>{sub.status === "reviewed" ? "Reviewed" : "Pending"}</Badge>
                    </div>
                    <div className="text-xs text-slate-500">{sub.opportunity} · Submitted {formatDate(sub.submitted)}</div>
                  </div>
                  {sub.score !== null && <div className="text-lg font-bold text-emerald-600">{sub.score}%</div>}
                  <ChevronRight className="h-4 w-4 text-slate-300" />
                </div>
                <div className="flex gap-2 mt-2 ml-13">
                  {sub.files.map((f) => (
                    <span key={f} className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full">
                      <FileText className="h-2.5 w-2.5" />{f}
                    </span>
                  ))}
                </div>
              </Card>
            ))}
          </div>

          {/* Evaluation Panel */}
          <div>
            {selected ? (
              <Card className="p-5 sticky top-24">
                <h3 className="text-base font-semibold font-display text-slate-900 mb-4">Evaluate Submission</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Score (0-100)</label>
                    <input type="number" min={0} max={100} className="mt-1.5 w-full h-10 rounded-lg border border-slate-200 px-3 text-sm" placeholder="e.g., 85" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Feedback</label>
                    <Textarea className="mt-1.5" rows={4} placeholder="Provide constructive feedback..." />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Competencies Demonstrated</label>
                    <input className="mt-1.5 w-full h-10 rounded-lg border border-slate-200 px-3 text-sm" placeholder="e.g., UX Design, User Research" />
                  </div>
                  <label className="flex items-center gap-2 text-sm text-slate-600">
                    <input type="checkbox" className="rounded border-slate-300" />
                    Endorse this learner
                  </label>
                  <Separator />
                  <div className="flex gap-2">
                    <Button className="flex-1"><CheckCircle2 className="h-4 w-4 mr-1.5" />Submit Evaluation</Button>
                  </div>
                </div>
              </Card>
            ) : (
              <Card className="p-8 text-center">
                <ClipboardCheck className="h-8 w-8 text-slate-300 mx-auto mb-3" />
                <p className="text-sm text-slate-500">Select a submission to review</p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
