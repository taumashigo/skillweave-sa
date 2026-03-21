"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks";
import LearnerDashboard from "./LearnerDashboard";

export default function DashboardRouter() {
  const { profile, isLoading } = useAuth();
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (isLoading) return;
    if (!profile) return;

    const role = profile.role;
    if (role === "employer") { router.replace("/employer/dashboard"); return; }
    if (role === "provider") { router.replace("/provider/dashboard"); return; }
    if (role === "mentor" || role === "assessor") { router.replace("/advisor/dashboard"); return; }
    if (role === "sponsor") { router.replace("/sponsor/dashboard"); return; }
    if (role === "admin") { router.replace("/admin"); return; }

    setReady(true);
  }, [profile, isLoading, router]);

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="h-8 w-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-slate-500">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return <LearnerDashboard />;
}
