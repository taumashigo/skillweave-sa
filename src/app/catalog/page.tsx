"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, X, BookOpen, Filter } from "lucide-react";
import { Button, Badge, Input, EmptyState } from "@/components/ui";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ModuleCard } from "@/components/modules/ModuleCard";
import { LoadingCards } from "@/components/shared/Loading";
import { createSupabaseBrowser } from "@/lib/supabase-browser";
import { cn } from "@/lib/utils";
import type { Module } from "@/types";

const supabase = createSupabaseBrowser();

const FILTER_SECTIONS = [
  { key: "pricing", label: "Price", options: [
    { value: "free", label: "Free" }, { value: "paid_once", label: "Paid" },
    { value: "sponsored", label: "Sponsored" }, { value: "employer_funded", label: "Employer Funded" },
    { value: "bursary_funded", label: "Bursary" },
  ]},
  { key: "difficulty", label: "Difficulty", options: [
    { value: "beginner", label: "Beginner" }, { value: "intermediate", label: "Intermediate" },
    { value: "advanced", label: "Advanced" }, { value: "expert", label: "Expert" },
  ]},
  { key: "mode", label: "Delivery Mode", options: [
    { value: "online", label: "Online" }, { value: "blended", label: "Blended" },
    { value: "in-person", label: "In-Person" }, { value: "synchronous", label: "Live" },
  ]},
];

const SORT_OPTIONS = [
  { value: "rating", label: "Highest Rated" }, { value: "newest", label: "Newest" },
  { value: "price_low", label: "Price: Low to High" }, { value: "price_high", label: "Price: High to Low" },
  { value: "popular", label: "Most Popular" },
];

export default function CataloguePage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filters, setFilters] = useState<Record<string, string[]>>({});
  const [sortBy, setSortBy] = useState("rating");
  const [showAccredited, setShowAccredited] = useState<boolean | null>(null);
  const [showRemediation, setShowRemediation] = useState<boolean | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    const fetchModules = async () => {
      setLoading(true);
      let query = supabase.from("modules").select("*", { count: "exact" }).eq("is_published", true);
      if (debouncedSearch) query = query.or(`title.ilike.%${debouncedSearch}%,description.ilike.%${debouncedSearch}%,short_summary.ilike.%${debouncedSearch}%`);
      if (filters.pricing?.length) query = query.in("pricing_model", filters.pricing);
      if (filters.difficulty?.length) query = query.in("difficulty", filters.difficulty);
      if (filters.mode?.length) query = query.in("mode", filters.mode);
      if (showAccredited === true) query = query.eq("is_accredited", true);
      if (showRemediation === true) query = query.eq("has_remediation", true);
      switch (sortBy) {
        case "rating": query = query.order("rating", { ascending: false }); break;
        case "newest": query = query.order("created_at", { ascending: false }); break;
        case "price_low": query = query.order("cost_cents", { ascending: true }); break;
        case "price_high": query = query.order("cost_cents", { ascending: false }); break;
        case "popular": query = query.order("enrollment_count", { ascending: false }); break;
      }
      const { data, error, count } = await query;
      if (!error && data) { setModules(data as Module[]); setTotalCount(count || 0); }
      setLoading(false);
    };
    fetchModules();
  }, [debouncedSearch, filters, sortBy, showAccredited, showRemediation]);

  const toggleFilter = (key: string, value: string) => {
    setFilters((prev) => {
      const arr = prev[key] || [];
      return { ...prev, [key]: arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value] };
    });
  };

  const activeFilterCount = Object.values(filters).flat().length + (showAccredited !== null ? 1 : 0) + (showRemediation !== null ? 1 : 0);
  const clearAll = () => { setFilters({}); setShowAccredited(null); setShowRemediation(null); setSearch(""); };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="pt-16">
        <div className="bg-gradient-to-b from-slate-50 to-white border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl font-bold font-display text-slate-900 mb-2">Module Catalogue</h1>
            <p className="text-base text-slate-500 mb-6 max-w-2xl">Browse modules from top South African providers. Filter by price, difficulty, industry, and more.</p>
            <div className="relative max-w-2xl">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input type="text" placeholder="Search modules, skills, industries, or job roles..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 h-12 text-base" />
              {search && <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"><X className="h-4 w-4" /></button>}
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex gap-8">
            <aside className="hidden lg:block w-[260px] shrink-0">
              <div className="sticky top-24 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-900">Filters</h3>
                  {activeFilterCount > 0 && <button onClick={clearAll} className="text-xs text-emerald-600 hover:underline">Clear all ({activeFilterCount})</button>}
                </div>
                {FILTER_SECTIONS.map((section) => (
                  <div key={section.key}>
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{section.label}</h4>
                    <div className="space-y-1">
                      {section.options.map((opt) => {
                        const isActive = (filters[section.key] || []).includes(opt.value);
                        return (
                          <button key={opt.value} onClick={() => toggleFilter(section.key, opt.value)} className={cn("flex items-center gap-2 w-full px-2.5 py-1.5 rounded-md text-sm transition-colors", isActive ? "bg-emerald-50 text-emerald-700 font-medium" : "text-slate-600 hover:bg-slate-50")}>
                            <div className={cn("h-4 w-4 rounded border flex items-center justify-center", isActive ? "bg-emerald-600 border-emerald-600" : "border-slate-300")}>{isActive && <span className="text-white text-[10px]">✓</span>}</div>
                            {opt.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
                <div>
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Features</h4>
                  <div className="space-y-1">
                    <button onClick={() => setShowAccredited(showAccredited === true ? null : true)} className={cn("flex items-center gap-2 w-full px-2.5 py-1.5 rounded-md text-sm", showAccredited === true ? "bg-emerald-50 text-emerald-700 font-medium" : "text-slate-600 hover:bg-slate-50")}>
                      <div className={cn("h-4 w-4 rounded border flex items-center justify-center", showAccredited === true ? "bg-emerald-600 border-emerald-600" : "border-slate-300")}>{showAccredited === true && <span className="text-white text-[10px]">✓</span>}</div>Accredited Only
                    </button>
                    <button onClick={() => setShowRemediation(showRemediation === true ? null : true)} className={cn("flex items-center gap-2 w-full px-2.5 py-1.5 rounded-md text-sm", showRemediation === true ? "bg-emerald-50 text-emerald-700 font-medium" : "text-slate-600 hover:bg-slate-50")}>
                      <div className={cn("h-4 w-4 rounded border flex items-center justify-center", showRemediation === true ? "bg-emerald-600 border-emerald-600" : "border-slate-300")}>{showRemediation === true && <span className="text-white text-[10px]">✓</span>}</div>Has Remediation
                    </button>
                  </div>
                </div>
              </div>
            </aside>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-6 gap-4">
                <p className="text-sm text-slate-500"><span className="font-semibold text-slate-900">{totalCount}</span> modules found</p>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 bg-white text-slate-600">
                  {SORT_OPTIONS.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              </div>
              {activeFilterCount > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {Object.entries(filters).flatMap(([key, values]) => values.map((v) => (
                    <button key={`${key}-${v}`} onClick={() => toggleFilter(key, v)} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-200 hover:bg-emerald-100">{v.replace(/_/g, " ")}<X className="h-3 w-3" /></button>
                  )))}
                </div>
              )}
              {loading ? <LoadingCards count={6} /> : modules.length > 0 ? (
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {modules.map((mod, i) => (
                    <motion.div key={mod.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i * 0.05, 0.3) }}>
                      <ModuleCard module={mod} />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <EmptyState icon={<BookOpen className="h-8 w-8" />} title="No modules found" description="Try adjusting your search or filters to find what you're looking for." action={<Button variant="outline" onClick={clearAll}>Clear Filters</Button>} />
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
