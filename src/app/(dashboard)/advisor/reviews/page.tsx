"use client";

import React from "react";
import { ClipboardCheck, CheckCircle2, AlertTriangle, Eye, Route } from "lucide-react";
import { Button, Badge, Card, Avatar } from "@/components/ui";
import { DashboardShell, PageHeader } from "@/components/layout/DashboardShell";

const mockReviews = [
  { id: "1", learner: "Nomsa Dlamini", type: "Unusual pathway", details: "Added Marketing modules to Data Analyst pathway", status: "pending" },
  { id: "2", learner: "Thabo Mokoena", type: "RPL evidence review", details: "Claiming credit for Project Management Essentials", status: "pending" },
  { id: "3", learner: "Sipho Nkosi", type: "Capstone approval", details: "Ready to begin Software Development Capstone", status: "approved" },
];

export default function AdvisorReviewsPage() {
  return (
    <DashboardShell role="mentor" userName="Dr. Zanele Mthembu" userEmail="zanele@capaciti.org.za">
      <PageHeader title="Pathway Reviews" description="Review and approve learner pathway changes and RPL requests." />
      <div className="px-6 lg:px-8 py-8 max-w-4xl">
        <div className="space-y-4">
          {mockReviews.map((review) => (
            <Card key={review.id} className={`p-5 ${review.status === "pending" ? "border-amber-200" : ""}`}>
              <div className="flex items-start gap-3">
                <Avatar name={review.learner} size="md" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-slate-900">{review.learner}</span>
                    <Badge variant={review.status === "pending" ? "warning" : "success"} className="capitalize">{review.status}</Badge>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-2">
                    <AlertTriangle className="h-3 w-3 text-amber-500" />
                    {review.type}: {review.details}
                  </div>
                  {review.status === "pending" && (
                    <div className="flex gap-2">
                      <Button size="sm" className="text-xs">Approve</Button>
                      <Button size="sm" variant="outline" className="text-xs">Request Changes</Button>
                      <Button size="sm" variant="ghost" className="text-xs"><Eye className="h-3 w-3 mr-1" />View Pathway</Button>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}