"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  GraduationCap, BookOpen, Award, Briefcase, Route, TrendingUp,
  ChevronRight, Zap, Clock, LifeBuoy, Wallet, ArrowRight, Star,
  PlusCircle, Target,
} from "lucide-react";
import { Button, Badge, Card, CardContent, StatCard, Progress } from "@/components/ui";
import { DashboardShell, PageHeader } from "@/components/layout/DashboardShell";
import { ProgressRing } from "@/components/shared/ProgressRing";
import { CredentialCard } from "@/components/credentials/CredentialCard";
import { createSupabaseBrowser } from "@/lib/supabase-browser";
import { cn, formatCurrency } from "@/lib/utils";
import { useAuth } from "@/lib/hooks";
import type { Module, Credential, Opportunity, Enrollment } from "@/types";

const supabase = createSupabaseBrowser();

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.35 },
  }),
};

export default function LearnerDashboard() {
  const { profile } = useAuth();
  const displayName = profile?.full_name && profile.full_name.trim() !== "" ? profile.full_name : profile?.email?.split("@")[0] || "Learner";

  const [stats, setStats] = useState({ credits_earned: 0, credits_target: 120, modules_completed: 0, modules_in_progress: 0, credentials_count: 0, remediations_active: 0 });
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [recommended, setRecommended] = useState<Module[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile?.user_id) { setLoading(false); return; }

    const fetchAll = async () => {
      // Fetch enrollments with module data
      const { data: enrData } = await supabase.from("enrollments").select("*, modules(*)").eq("user_id", profile.user_id).order("updated_at", { ascending: false });
      const enrs = enrData || [];
      setEnrollments(enrs);

      const completed = enrs.filter((e: any) => e.status === "completed");
      const inProgress = enrs.filter((e: any) => e.status === "in_progress" || e.status === "enrolled");
      const creditsEarned = completed.reduce((sum: number, e: any) => sum + (e.modules?.credits || 0), 0);

      // Fetch credentials
      const { data: credData } = await supabase.from("credentials").select("*").eq("user_id", profile.user_id).order("issued_at", { ascending: false }).limit(5);
      setCredentials((credData || []) as Credential[]);

      // Fetch pathway target credits
      const { data: pathData } = await supabase.from("pathways").select("total_credits").eq("user_id", profile.user_id).in("status", ["draft", "active"]).limit(1);
      const targetCredits = pathData?.[0]?.total_credits || 120;

      // Fetch remediation count
      const { count: remCount } = await supabase.from("remediation_assignments").select("*", { count: "exact", head: true }).eq("user_id", profile.user_id).in("status", ["recommended", "enrolled", "in_progress"]);

      setStats({
        credits_earned: creditsEarned,
        credits_target: targetCredits,
        modules_completed: completed.length,
        modules_in_progress: inProgress.length,
        credentials_count: (credData || []).length,
        remediations_active: remCount || 0,
      });

      // Fetch recommended modules (top rated not enrolled)
      const enrolledModuleIds = enrs.map((e: any) => e.module_id);
      let recQuery = supabase.from("modules").select("*").eq("is_published", true).order("rating", { ascending: false }).limit(4);
      if (enrolledModuleIds.length > 0) {
        // Supabase doesn't support NOT IN easily, so filter client-side
      }
      const { data: recData } = await recQuery;
      const filtered = (recData || []).filter((m: any) => !enrolledModuleIds.includes(m.id));
      setRecommended(filtered.slice(0, 4) as Module[]);

      // Fetch opportunity count
      const { data: oppData } = await supabase.from("opportunities").select("*").eq("is_active", true).limit(10);
      setOpportunities((oppData || []) as Opportunity[]);

      setLoading(false);
    };

    fetchAll();
  }, [profile?.user_id]);

  const progressPercent = stats.credits_target > 0 ? Math.round((stats.credits_earned / stats.credits_target) * 100) : 0;

  if (loading) {
    return (
      <DashboardShell userName={displayName} userEmail={profile?.email || ""}>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="h-8 w-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm text-slate-500">Loading dashboard...</p>
          </div>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell userName={displayName} userEmail={profile?.email || ""}>
      <PageHeader
        title={`Welcome, ${displayName.split(" ")[0]}`}
        description="Track your progress, manage your pathway, and discover new opportunities."
        actions={<Link href="/pathways/new"><Button><PlusCircle className="h-4 w-4 mr-2" />New Pathway</Button></Link>}
      />

      <div className="px-6 lg:px-8 py-8">
        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Credits Earned", value: `${stats.credits_earned}/${stats.credits_target}`, icon: <GraduationCap className="h-5 w-5" /> },
            { label: "Modules Completed", value: stats.modules_completed, icon: <BookOpen className="h-5 w-5" /> },
            { label: "Credentials Earned", value: stats.credentials_count, icon: <Award className="h-5 w-5" /> },
            { label: "Opportunities", value: opportunities.length, icon: <Briefcase className="h-5 w-5" /> },
          ].map((stat, i) => (
            <motion.div key={stat.label} custom={i} initial="hidden" animate="visible" variants={fadeUp}>
              <StatCard {...stat} />
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Pathway Progress */}
            <motion.div custom={4} initial="hidden" animate="visible" variants={fadeUp}>
              <Card>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-base font-semibold font-display text-slate-900">Learning Progress</h2>
                      <p className="text-sm text-slate-500 mt-0.5">{stats.credits_earned} of {stats.credits_target} credits earned</p>
                    </div>
                    <Link href="/pathways"><Button variant="ghost" size="sm">View Pathways<ChevronRight className="h-4 w-4 ml-1" /></Button></Link>
                  </div>
                  <div className="flex items-center gap-6 mb-6">
                    <ProgressRing value={progressPercent} size={100} strokeWidth={8} label={`${progressPercent}%`} sublabel="complete" />
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2 text-sm"><div className="h-3 w-3 rounded-full bg-emerald-500" /><span className="text-slate-600">Completed: {stats.modules_completed} modules</span></div>
                      <div className="flex items-center gap-2 text-sm"><div className="h-3 w-3 rounded-full bg-blue-500" /><span className="text-slate-600">In progress: {stats.modules_in_progress} modules</span></div>
                      {stats.remediations_active > 0 && <div className="flex items-center gap-2 text-sm"><div className="h-3 w-3 rounded-full bg-amber-500" /><span className="text-slate-600">Remediations active: {stats.remediations_active}</span></div>}
                    </div>
                  </div>

                  {/* Enrollment progress list */}
                  {enrollments.length > 0 ? (
                    <div className="space-y-3">
                      {enrollments.slice(0, 7).map((enr: any) => (
                        <div key={enr.id} className="flex items-center gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium text-slate-700 truncate">{enr.modules?.title || "Module"}</span>
                              <span className="text-xs text-slate-400 ml-2 shrink-0">{enr.modules?.credits || 0} cr · {enr.progress_percent || 0}%</span>
                            </div>
                            <Progress value={enr.progress_percent || 0} variant={enr.status === "completed" ? "success" : "default"} />
                          </div>
                          {enr.status === "completed" && <div className="h-5 w-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0"><span className="text-emerald-600 text-xs">✓</span></div>}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <BookOpen className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                      <p className="text-sm text-slate-500">No modules enrolled yet.</p>
                      <Link href="/catalog"><Button variant="outline" size="sm" className="mt-3">Browse Catalogue</Button></Link>
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>

            {/* Remediation Alert */}
            {stats.remediations_active > 0 && (
              <motion.div custom={5} initial="hidden" animate="visible" variants={fadeUp}>
                <Card className="border-amber-200 bg-amber-50/30">
                  <div className="p-5">
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0"><LifeBuoy className="h-5 w-5 text-amber-600" /></div>
                      <div className="flex-1">
                        <h3 className="text-sm font-semibold text-amber-800 mb-1">Remediation Support Available</h3>
                        <p className="text-sm text-amber-700 mb-3">You have {stats.remediations_active} active remediation{stats.remediations_active > 1 ? "s" : ""}. Targeted support is ready to help you succeed.</p>
                        <Link href="/support"><Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white">View Support<ArrowRight className="h-3.5 w-3.5 ml-1.5" /></Button></Link>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}

            {/* Recommended Modules */}
            {recommended.length > 0 && (
              <motion.div custom={6} initial="hidden" animate="visible" variants={fadeUp}>
                <Card>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-base font-semibold font-display text-slate-900">Recommended Next</h2>
                      <Link href="/catalog"><Button variant="ghost" size="sm">Browse All<ChevronRight className="h-4 w-4 ml-1" /></Button></Link>
                    </div>
                    <div className="space-y-2">
                      {recommended.map((mod) => (
                        <Link key={mod.id} href={`/catalog/${mod.slug}`}>
                          <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors group">
                            <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 group-hover:bg-emerald-50"><BookOpen className="h-4 w-4 text-slate-400 group-hover:text-emerald-500" /></div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-slate-900 truncate">{mod.title}</div>
                              <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                                <span>{mod.credits} credits</span><span>·</span><span>{mod.difficulty}</span><span>·</span><Star className="h-3 w-3 text-amber-400 fill-amber-400" /><span>{mod.rating}</span>
                              </div>
                            </div>
                            <Badge variant={mod.pricing_model === "free" ? "free" : "secondary"} className="shrink-0">{mod.pricing_model === "free" ? "Free" : formatCurrency(mod.cost_cents)}</Badge>
                            <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-emerald-500" />
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Credentials */}
            <motion.div custom={5} initial="hidden" animate="visible" variants={fadeUp}>
              <Card>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-base font-semibold font-display text-slate-900">Credentials</h2>
                    <Link href="/wallet"><Button variant="ghost" size="sm"><Wallet className="h-4 w-4 mr-1" />Wallet</Button></Link>
                  </div>
                  {credentials.length > 0 ? (
                    <div className="space-y-2">{credentials.slice(0, 3).map((cred) => <CredentialCard key={cred.id} credential={cred} variant="compact" />)}</div>
                  ) : (
                    <div className="text-center py-4"><Award className="h-6 w-6 text-slate-300 mx-auto mb-2" /><p className="text-xs text-slate-500">Complete modules to earn credentials</p></div>
                  )}
                </div>
              </Card>
            </motion.div>

            {/* Quick Actions */}
            <motion.div custom={7} initial="hidden" animate="visible" variants={fadeUp}>
              <Card>
                <div className="p-5">
                  <h2 className="text-base font-semibold font-display text-slate-900 mb-3">Quick Actions</h2>
                  <div className="space-y-1">
                    {[
                      { label: "Build CV", href: "/cv", icon: Target },
                      { label: "View Portfolio", href: "/portfolio", icon: Briefcase },
                      { label: "Download Transcript", href: "/transcript", icon: GraduationCap },
                      { label: "Browse Opportunities", href: "/opportunities", icon: Briefcase },
                      { label: "Apply for RPL", href: "/rpl", icon: Award },
                    ].map((action) => (
                      <Link key={action.href} href={action.href}>
                        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-50 transition-colors group">
                          <action.icon className="h-4 w-4 text-slate-400 group-hover:text-emerald-500" />
                          <span className="text-sm text-slate-600 group-hover:text-slate-900">{action.label}</span>
                          <ChevronRight className="h-4 w-4 text-slate-300 ml-auto" />
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
