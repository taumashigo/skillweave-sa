"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FileCheck, Upload, PlusCircle, Clock, CheckCircle2,
  AlertCircle, MessageSquare, ChevronRight, BookOpen,
} from "lucide-react";
import { Button, Badge, Card, Input, Textarea, Label, EmptyState, Separator } from "@/components/ui";
import { DashboardShell, PageHeader } from "@/components/layout/DashboardShell";
import { cn, formatDate } from "@/lib/utils";

const mockRequests = [
  {
    id: "rpl-1",
    module: "Professional Communication & Business Writing",
    status: "approved",
    credits_awarded: 12,
    submitted: "2024-02-10",
    evidence_summary: "5 years experience as communications officer at Vodacom. Attached portfolio of published internal communications, training materials, and presentations.",
    assessor_notes: "Evidence demonstrates competence across all unit standards. Full credit awarded.",
  },
  {
    id: "rpl-2",
    module: "Project Management Essentials",
    status: "under_review",
    credits_awarded: 0,
    submitted: "2024-08-05",
    evidence_summary: "3 years managing projects at a fintech startup. Submitted project plans, Jira boards, retrospective notes, and client feedback.",
    assessor_notes: null,
  },
  {
    id: "rpl-3",
    module: "Digital Marketing Fundamentals",
    status: "more_info_needed",
    credits_awarded: 0,
    submitted: "2024-09-01",
    evidence_summary: "Ran social media campaigns for small business. Screenshots of analytics dashboards and campaign results.",
    assessor_notes: "Please provide more evidence of SEO work and content strategy documents. Campaign results alone are insufficient.",
  },
];

const statusConfig: Record<string, { label: string; variant: any; icon: React.ElementType }> = {
  submitted: { label: "Submitted", variant: "secondary", icon: Clock },
  under_review: { label: "Under Review", variant: "info", icon: Clock },
  approved: { label: "Approved", variant: "success", icon: CheckCircle2 },
  rejected: { label: "Rejected", variant: "destructive", icon: AlertCircle },
  more_info_needed: { label: "More Info Needed", variant: "warning", icon: MessageSquare },
};

export default function RPLPage() {
  const [showNew, setShowNew] = useState(false);

  return (
    <DashboardShell>
      <PageHeader
        title="Recognition of Prior Learning"
        description="Submit evidence of prior learning or work experience to earn credit exemptions."
        actions={
          <Button onClick={() => setShowNew(!showNew)}>
            <PlusCircle className="h-4 w-4 mr-2" />
            New RPL Request
          </Button>
        }
      />

      <div className="px-6 lg:px-8 py-8 max-w-4xl">
        {/* New RPL Form */}
        {showNew && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mb-8"
          >
            <Card className="p-6">
              <h2 className="text-base font-semibold font-display text-slate-900 mb-4">
                Submit RPL Request
              </h2>
              <div className="space-y-4">
                <div>
                  <Label>Module to claim credit for</Label>
                  <select className="mt-1.5 w-full h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm">
                    <option>Select a module...</option>
                    <option>Project Management Essentials</option>
                    <option>Leadership & Team Management</option>
                    <option>Business Analysis & Requirements</option>
                  </select>
                </div>
                <div>
                  <Label>Evidence Summary</Label>
                  <Textarea
                    className="mt-1.5"
                    rows={4}
                    placeholder="Describe your prior learning, work experience, or qualifications that relate to this module..."
                  />
                </div>
                <div>
                  <Label>Competencies Claimed</Label>
                  <Input className="mt-1.5" placeholder="e.g. Project Planning, Risk Management, Agile" />
                </div>
                <div>
                  <Label>Supporting Documents</Label>
                  <div className="mt-1.5 border-2 border-dashed border-slate-200 rounded-lg p-6 text-center hover:border-emerald-300 transition-colors cursor-pointer">
                    <Upload className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-sm text-slate-500">Click to upload or drag files here</p>
                    <p className="text-xs text-slate-400 mt-1">PDF, images, or documents up to 10MB</p>
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <Button variant="outline" onClick={() => setShowNew(false)}>Cancel</Button>
                  <Button>Submit RPL Request</Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Requests */}
        {mockRequests.length > 0 ? (
          <div className="space-y-4">
            {mockRequests.map((req, i) => {
              const config = statusConfig[req.status];
              return (
                <motion.div
                  key={req.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <Card className={cn(
                    "p-5",
                    req.status === "more_info_needed" && "border-amber-200",
                    req.status === "approved" && "border-emerald-200"
                  )}>
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-sm font-semibold text-slate-900">{req.module}</h3>
                          <Badge variant={config.variant}>{config.label}</Badge>
                        </div>
                        <p className="text-xs text-slate-400">Submitted: {formatDate(req.submitted)}</p>
                      </div>
                      {req.credits_awarded > 0 && (
                        <Badge variant="success" className="text-xs gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          {req.credits_awarded} credits awarded
                        </Badge>
                      )}
                    </div>

                    <p className="text-sm text-slate-600 mb-3">{req.evidence_summary}</p>

                    {req.assessor_notes && (
                      <div className={cn(
                        "p-3 rounded-lg text-sm",
                        req.status === "approved" ? "bg-emerald-50 text-emerald-700" :
                        req.status === "more_info_needed" ? "bg-amber-50 text-amber-700" :
                        "bg-slate-50 text-slate-600"
                      )}>
                        <div className="text-xs font-semibold mb-1">Assessor Feedback:</div>
                        {req.assessor_notes}
                      </div>
                    )}

                    {req.status === "more_info_needed" && (
                      <div className="mt-3 pt-3 border-t border-slate-100">
                        <Button size="sm">
                          <Upload className="h-3.5 w-3.5 mr-1.5" />
                          Upload Additional Evidence
                        </Button>
                      </div>
                    )}
                  </Card>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <EmptyState
            icon={<FileCheck className="h-8 w-8" />}
            title="No RPL requests"
            description="If you have prior learning or work experience, submit an RPL request to earn credits."
            action={<Button onClick={() => setShowNew(true)}><PlusCircle className="h-4 w-4 mr-2" /> New Request</Button>}
          />
        )}
      </div>
    </DashboardShell>
  );
}
