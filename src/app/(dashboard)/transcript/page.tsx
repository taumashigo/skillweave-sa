"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Download, FileText, CheckCircle2, Clock, Star, Shield,
  GraduationCap, Award,
} from "lucide-react";
import { Button, Badge, Card, Separator } from "@/components/ui";
import { DashboardShell, PageHeader } from "@/components/layout/DashboardShell";
import { cn, formatDate } from "@/lib/utils";

const transcriptData = {
  learner: "Thabo Mokoena",
  studentId: "SW-2024-00142",
  dateGenerated: new Date().toISOString(),
  pathway: "Full Stack Software Developer",
  totalCredits: 67,
  targetCredits: 130,
  modules: [
    { title: "Digital Literacy Foundations", credits: 12, nqf: "2", grade: "Distinction", date: "2024-03-15", status: "completed", provider: "CAPACITI" },
    { title: "Professional Communication & Business Writing", credits: 12, nqf: "4", grade: "Merit", date: "2024-04-20", status: "completed", provider: "CAPACITI" },
    { title: "Career Readiness & Job Search Skills", credits: 10, nqf: "4", grade: "Pass", date: "2024-05-10", status: "completed", provider: "CAPACITI" },
    { title: "Workplace Professionalism & Ethics", credits: 10, nqf: "4", grade: "Merit", date: "2024-05-28", status: "completed", provider: "CAPACITI" },
    { title: "Introduction to Programming with Python", credits: 20, nqf: "5", grade: "Distinction", date: "2024-07-15", status: "completed", provider: "WeThinkCode_" },
    { title: "Web Development with JavaScript & React", credits: 25, nqf: "5", grade: "—", date: "—", status: "in_progress", provider: "WeThinkCode_" },
    { title: "Version Control with Git & GitHub", credits: 8, nqf: "5", grade: "—", date: "—", status: "in_progress", provider: "WeThinkCode_" },
  ],
  credentials: [
    { title: "Digital Literacy Certified", type: "Badge", date: "2024-03-15" },
    { title: "Python Programming Certificate", type: "Certificate", date: "2024-07-15" },
    { title: "Foundation Skills Milestone", type: "Milestone", date: "2024-05-28" },
    { title: "Core Developer Milestone", type: "Milestone", date: "2024-07-15" },
  ],
};

const gradeColors: Record<string, string> = {
  Distinction: "text-emerald-700 bg-emerald-50",
  Merit: "text-blue-700 bg-blue-50",
  Pass: "text-slate-700 bg-slate-100",
};

export default function TranscriptPage() {
  return (
    <DashboardShell>
      <PageHeader
        title="Academic Transcript"
        description="Your complete learning record on SkillWeave SA."
        actions={
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
        }
      />

      <div className="px-6 lg:px-8 py-8 max-w-4xl">
        <Card className="overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-navy-700 to-navy-900 p-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <GraduationCap className="h-5 w-5 text-emerald-300" />
                  <span className="text-xs font-semibold text-emerald-300 uppercase tracking-wider">
                    Official Transcript
                  </span>
                </div>
                <h2 className="text-xl font-bold font-display">{transcriptData.learner}</h2>
                <p className="text-sm text-slate-300 mt-0.5">Student ID: {transcriptData.studentId}</p>
              </div>
              <div className="text-right">
                <div className="text-sm text-slate-300">Active Pathway</div>
                <div className="text-base font-semibold">{transcriptData.pathway}</div>
                <div className="text-sm text-emerald-300 mt-1">
                  {transcriptData.totalCredits}/{transcriptData.targetCredits} credits earned
                </div>
              </div>
            </div>
          </div>

          {/* Modules Table */}
          <div className="p-6">
            <h3 className="text-sm font-semibold font-display text-slate-900 mb-4">
              Module Record
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-2 px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Module</th>
                    <th className="text-left py-2 px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Provider</th>
                    <th className="text-center py-2 px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">NQF</th>
                    <th className="text-center py-2 px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Credits</th>
                    <th className="text-center py-2 px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Grade</th>
                    <th className="text-center py-2 px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Date</th>
                    <th className="text-center py-2 px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {transcriptData.modules.map((mod, i) => (
                    <tr key={i} className="border-b border-slate-100 last:border-0">
                      <td className="py-3 px-3 font-medium text-slate-900">{mod.title}</td>
                      <td className="py-3 px-3 text-slate-500">{mod.provider}</td>
                      <td className="py-3 px-3 text-center text-slate-500">{mod.nqf}</td>
                      <td className="py-3 px-3 text-center font-medium text-slate-700">{mod.credits}</td>
                      <td className="py-3 px-3 text-center">
                        {mod.grade !== "—" ? (
                          <span className={cn("inline-flex px-2 py-0.5 rounded text-xs font-medium", gradeColors[mod.grade] || "text-slate-500")}>
                            {mod.grade}
                          </span>
                        ) : (
                          <span className="text-xs text-slate-400">—</span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-center text-slate-500 text-xs">
                        {mod.date !== "—" ? formatDate(mod.date) : "—"}
                      </td>
                      <td className="py-3 px-3 text-center">
                        {mod.status === "completed" ? (
                          <Badge variant="success" className="text-[10px]">Completed</Badge>
                        ) : (
                          <Badge variant="info" className="text-[10px]">In Progress</Badge>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Separator className="my-6" />

            {/* Credentials */}
            <h3 className="text-sm font-semibold font-display text-slate-900 mb-4">
              Credentials Earned
            </h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {transcriptData.credentials.map((cred, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg border border-slate-200">
                  <div className="h-8 w-8 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
                    <Award className="h-4 w-4 text-emerald-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-slate-900 truncate">{cred.title}</div>
                    <div className="text-xs text-slate-400">{cred.type} · {formatDate(cred.date)}</div>
                  </div>
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                </div>
              ))}
            </div>

            <Separator className="my-6" />

            {/* Footer */}
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Generated: {formatDate(transcriptData.dateGenerated)}</span>
              <span>SkillWeave SA · Verified Digital Transcript</span>
            </div>
          </div>
        </Card>
      </div>
    </DashboardShell>
  );
}
