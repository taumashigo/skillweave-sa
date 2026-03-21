"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Building2, CheckCircle2, BookOpen, Star, Users, MapPin } from "lucide-react";
import { Badge, Card } from "@/components/ui";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { LoadingCards } from "@/components/shared/Loading";
import { createSupabaseBrowser } from "@/lib/supabase-browser";
import type { Organization } from "@/types";

const supabase = createSupabaseBrowser();

export default function ProvidersPage() {
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("organizations").select("*").eq("verified", true).order("name").then(({ data }) => {
      if (data) setOrgs(data as Organization[]);
      setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="pt-16">
        <div className="bg-gradient-to-b from-slate-50 to-white border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl font-bold font-display text-slate-900 mb-2">Learning Providers</h1>
            <p className="text-base text-slate-500 max-w-2xl">Trusted South African education providers and employers powering SkillWeave modules and opportunities.</p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {loading ? <LoadingCards count={6} /> : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {orgs.map((org, i) => (
                <motion.div key={org.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i * 0.08, 0.4) }}>
                  <Link href={`/providers/${org.slug}`}>
                    <Card className="card-premium p-6 h-full group">
                      <div className="flex items-start gap-3 mb-4">
                        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center shrink-0 border border-slate-200"><Building2 className="h-6 w-6 text-slate-400" /></div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5"><h3 className="text-base font-semibold font-display text-slate-900 truncate group-hover:text-emerald-700 transition-colors">{org.name}</h3>{org.verified && <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />}</div>
                          <Badge variant="outline" className="capitalize text-[10px]">{org.type}</Badge>
                        </div>
                      </div>
                      <p className="text-sm text-slate-500 line-clamp-2 mb-4">{org.description}</p>
                      <div className="flex items-center gap-3 text-xs text-slate-400">
                        <Badge variant="secondary">{org.industry}</Badge>
                        {org.province && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{org.province}</span>}
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
