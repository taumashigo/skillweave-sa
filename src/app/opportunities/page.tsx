"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Briefcase } from "lucide-react";
import { Input, EmptyState, Button } from "@/components/ui";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { OpportunityCard } from "@/components/opportunities/OpportunityCard";
import { LoadingCards } from "@/components/shared/Loading";
import { createSupabaseBrowser } from "@/lib/supabase-browser";
import type { Opportunity } from "@/types";

const supabase = createSupabaseBrowser();
const types = ["project", "internship", "assignment", "simulation", "mentorship", "challenge"];

export default function OpportunitiesPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      let query = supabase.from("opportunities").select("*").eq("is_active", true).order("created_at", { ascending: false });
      if (typeFilter) query = query.eq("type", typeFilter);
      if (search) query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,organization_name.ilike.%${search}%`);
      const { data } = await query;
      if (data) setOpportunities(data as Opportunity[]);
      setLoading(false);
    };
    fetch();
  }, [search, typeFilter]);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="pt-16">
        <div className="bg-gradient-to-b from-slate-50 to-white border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl font-bold font-display text-slate-900 mb-2">Experiential Opportunities</h1>
            <p className="text-base text-slate-500 mb-6 max-w-2xl">Real-world projects, internships, and challenges from top South African employers.</p>
            <div className="relative max-w-2xl">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input placeholder="Search opportunities, skills, or companies..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 h-12 text-base" />
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              <button onClick={() => setTypeFilter(null)} className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${!typeFilter ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "text-slate-500 border-slate-200 hover:bg-slate-50"}`}>All</button>
              {types.map((t) => <button key={t} onClick={() => setTypeFilter(typeFilter === t ? null : t)} className={`text-xs px-3 py-1.5 rounded-full border capitalize transition-colors ${typeFilter === t ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "text-slate-500 border-slate-200 hover:bg-slate-50"}`}>{t}</button>)}
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-sm text-slate-500 mb-6"><span className="font-semibold text-slate-900">{opportunities.length}</span> opportunities available</p>
          {loading ? <LoadingCards count={4} /> : opportunities.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-5">
              {opportunities.map((opp, i) => <motion.div key={opp.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i * 0.08, 0.3) }}><OpportunityCard opportunity={opp} /></motion.div>)}
            </div>
          ) : <EmptyState icon={<Briefcase className="h-8 w-8" />} title="No opportunities found" description="Try adjusting your search or filters." action={<Button variant="outline" onClick={() => { setSearch(""); setTypeFilter(null); }}>Clear Filters</Button>} />}
        </div>
      </div>
      <Footer />
    </div>
  );
}
