"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowLeft, Building2, MapPin, Globe, CheckCircle2, BookOpen, Star, Users,
} from "lucide-react";
import { Badge, Card, Button } from "@/components/ui";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ModuleCard } from "@/components/modules/ModuleCard";
import { SEED_ORGANIZATIONS, SEED_MODULES } from "@/data/seed";
import type { Organization, Module } from "@/types";

export default function ProviderDetailPage({ params }: { params: { slug: string } }) {
  const org = (SEED_ORGANIZATIONS as Partial<Organization>[]).find((o) => o.slug === params.slug);
  const modules = org ? (SEED_MODULES as Module[]).filter((m) => m.provider_name === org.name) : [];

  if (!org) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="pt-32 text-center">
          <h1 className="text-2xl font-bold text-slate-900">Provider not found</h1>
          <Link href="/providers"><Button variant="outline" className="mt-4">Browse Providers</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="pt-16">
        <div className="bg-gradient-to-b from-slate-50 to-white border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Link href="/providers" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-6">
              <ArrowLeft className="h-4 w-4" />Back to Providers
            </Link>

            <div className="flex items-start gap-4">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center border border-slate-200 shrink-0">
                <Building2 className="h-8 w-8 text-slate-400" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl font-bold font-display text-slate-900">{org.name}</h1>
                  {org.verified && <CheckCircle2 className="h-5 w-5 text-emerald-500" />}
                </div>
                <p className="text-base text-slate-500 max-w-2xl mb-3">{org.description}</p>
                <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
                  <Badge variant="outline" className="capitalize">{org.type}</Badge>
                  <Badge variant="secondary">{org.industry}</Badge>
                  {org.province && <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{org.province}</span>}
                  <span className="flex items-center gap-1"><BookOpen className="h-3.5 w-3.5" />{modules.length} modules</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h2 className="text-lg font-semibold font-display text-slate-900 mb-6">
            Modules by {org.name}
          </h2>
          {modules.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {modules.map((mod) => (
                <ModuleCard key={mod.id} module={mod} showProvider={false} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">No modules published yet.</p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
