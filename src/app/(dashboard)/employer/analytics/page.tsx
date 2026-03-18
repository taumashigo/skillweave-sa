"use client";

import React from "react";
import { BarChart3, Users, Briefcase, TrendingUp } from "lucide-react";
import { Card, StatCard } from "@/components/ui";
import { DashboardShell, PageHeader } from "@/components/layout/DashboardShell";

export default function EmployerAnalyticsPage() {
  return (
    <DashboardShell role="employer" userName="Employer" userEmail="">
      <PageHeader title="Employer Analytics" description="Insights into your opportunities and talent pipeline." />
      <div className="px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Applicants" value="76" icon={<Users className="h-5 w-5" />} trend={{ value: 15, positive: true }} />
          <StatCard label="Active Opportunities" value="2" icon={<Briefcase className="h-5 w-5" />} />
          <StatCard label="Avg. Applicant Score" value="72%" icon={<TrendingUp className="h-5 w-5" />} />
          <StatCard label="Endorsements Given" value="8" icon={<BarChart3 className="h-5 w-5" />} />
        </div>
        <Card className="p-8 text-center">
          <BarChart3 className="h-10 w-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-900 mb-1">Detailed analytics coming soon</h3>
          <p className="text-sm text-slate-500">Charts and reports will appear here as more data is collected.</p>
        </Card>
      </div>
    </DashboardShell>
  );
}