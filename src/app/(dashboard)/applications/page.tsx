"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Send, Clock, CheckCircle2, XCircle, ChevronRight, Briefcase,
  Eye, MessageSquare, Upload,
} from "lucide-react";
import { Button, Badge, Card, EmptyState } from "@/components/ui";
import { DashboardShell, PageHeader } from "@/components/layout/DashboardShell";
import { formatDate } from "@/lib/utils";

const mockApplications = [
  {
    id: "app-1",
    opportunity: "Digital Banking Dashboard Redesign",
    organization: "Standard Bank Group",
    type: "project",
    status: "accepted",
    applied_at: "2024-11-01",
    compensation: "Stipend: R12,000",
    credits: 15,
    next_step: "Submit your deliverables by Dec 15",
  },
  {
    id: "app-2",
    opportunity: "AI Chatbot for Customer Support",
    organization: "Naspers Foundry",
    type: "project",
    status: "pending",
    applied_at: "2024-12-10",
    compensation: "Paid: R25,000",
    credits: 20,
    next_step: "Application under review",
  },
  {
    id: "app-3",
    opportunity: "Community Impact App Development",
    organization: "CAPACITI",
    type: "project",
    status: "rejected",
    applied_at: "2024-10-05",
    compensation: "Credit Bearing",
    credits: 20,
    next_step: null,
  },
];

const statusConfig: Record<string, { label: string; variant: any; icon: React.ElementType }> = {
  pending: { label: "Pending", variant: "warning", icon: Clock },
  accepted: { label: "Accepted", variant: "success", icon: CheckCircle2 },
  rejected: { label: "Not Selected", variant: "secondary", icon: XCircle },
  withdrawn: { label: "Withdrawn", variant: "secondary", icon: XCircle },
  completed: { label: "Completed", variant: "default", icon: CheckCircle2 },
};

export default function ApplicationsPage() {
  return (
    <DashboardShell>
      <PageHeader
        title="My Applications"
        description="Track your opportunity applications and submissions."
      />

      <div className="px-6 lg:px-8 py-8 max-w-4xl">
        {/* Summary stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Total Applied", value: mockApplications.length },
            { label: "Accepted", value: mockApplications.filter(a => a.status === "accepted").length },
            { label: "Pending", value: mockApplications.filter(a => a.status === "pending").length },
          ].map((s) => (
            <Card key={s.label} className="p-4 text-center">
              <div className="text-2xl font-bold font-display text-slate-900">{s.value}</div>
              <div className="text-xs text-slate-400 mt-0.5">{s.label}</div>
            </Card>
          ))}
        </div>

        {mockApplications.length > 0 ? (
          <div className="space-y-4">
            {mockApplications.map((app, i) => {
              const config = statusConfig[app.status];
              const StatusIcon = config.icon;
              return (
                <motion.div
                  key={app.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <Card className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-sm font-semibold text-slate-900">{app.opportunity}</h3>
                          <Badge variant={config.variant} className="gap-1">
                            <StatusIcon className="h-3 w-3" />{config.label}
                          </Badge>
                        </div>
                        <p className="text-sm text-emerald-600 font-medium">{app.organization}</p>
                      </div>
                      <Badge variant="outline" className="capitalize text-xs">{app.type}</Badge>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mb-3">
                      <span>Applied: {formatDate(app.applied_at)}</span>
                      <span>·</span>
                      <span>{app.compensation}</span>
                      <span>·</span>
                      <span>{app.credits} credits</span>
                    </div>

                    {app.next_step && (
                      <div className={`flex items-center gap-2 p-2.5 rounded-lg text-xs font-medium ${
                        app.status === "accepted" ? "bg-emerald-50 text-emerald-700" : "bg-slate-50 text-slate-600"
                      }`}>
                        {app.status === "accepted" ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Clock className="h-3.5 w-3.5" />}
                        {app.next_step}
                      </div>
                    )}

                    {app.status === "accepted" && (
                      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100">
                        <Button size="sm" className="text-xs">
                          <Upload className="h-3.5 w-3.5 mr-1" />Submit Work
                        </Button>
                        <Button variant="outline" size="sm" className="text-xs">
                          <MessageSquare className="h-3.5 w-3.5 mr-1" />Message
                        </Button>
                        <Button variant="outline" size="sm" className="text-xs">
                          <Eye className="h-3.5 w-3.5 mr-1" />View Details
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
            icon={<Send className="h-8 w-8" />}
            title="No applications yet"
            description="Browse opportunities and start applying to build your experience."
            action={<Link href="/opportunities"><Button>Browse Opportunities</Button></Link>}
          />
        )}
      </div>
    </DashboardShell>
  );
}
