"use client";

import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft, Clock, Star, Users, BookOpen, Award, Shield, Briefcase,
  Zap, CheckCircle2, LifeBuoy, Play, Globe, GraduationCap,
  ExternalLink, PlusCircle, ChevronRight,
} from "lucide-react";
import { Button, Badge, Card, CardContent, Progress } from "@/components/ui";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SEED_MODULES } from "@/data/seed";
import { cn, formatCurrency, formatDuration, getDifficultyColor } from "@/lib/utils";
import type { Module } from "@/types";

export default function ModuleDetailPage({ params }: { params: { slug: string } }) {
  const module = (SEED_MODULES as Module[]).find((m) => m.slug === params.slug);

  if (!module) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="pt-16">
        {/* Header */}
        <div className="bg-gradient-to-b from-slate-50 to-white border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Link
              href="/catalog"
              className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-6 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Catalogue
            </Link>

            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  {module.pricing_model === "free" ? (
                    <Badge variant="free">Free</Badge>
                  ) : module.pricing_model === "sponsored" ? (
                    <Badge variant="sponsored">Sponsored</Badge>
                  ) : (
                    <Badge variant="secondary">{formatCurrency(module.cost_cents)}</Badge>
                  )}
                  {module.is_accredited && (
                    <Badge variant="info" className="gap-1">
                      <Shield className="h-3 w-3" />
                      SAQA Accredited
                    </Badge>
                  )}
                  {module.employer_endorsed && (
                    <Badge variant="navy" className="gap-1">
                      <Briefcase className="h-3 w-3" />
                      Employer Endorsed
                    </Badge>
                  )}
                  {module.nqf_level && (
                    <Badge variant="outline">NQF Level {module.nqf_level}</Badge>
                  )}
                </div>

                <h1 className="text-2xl sm:text-3xl font-bold font-display text-slate-900 mb-3">
                  {module.title}
                </h1>

                <p className="text-emerald-600 font-medium mb-2">{module.provider_name}</p>

                <p className="text-base text-slate-500 leading-relaxed mb-6">
                  {module.description}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                    <span className="font-semibold text-slate-900">{module.rating}</span>
                    <span>({module.review_count} reviews)</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Users className="h-4 w-4" />
                    {module.enrollment_count.toLocaleString()} enrolled
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" />
                    {formatDuration(module.duration_hours)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Zap className="h-4 w-4" />
                    {module.credits} credits
                  </span>
                </div>
              </div>

              {/* Enrollment Card */}
              <div>
                <Card className="card-premium sticky top-24">
                  <CardContent className="p-6">
                    <div className="text-center mb-4">
                      {module.pricing_model === "free" ? (
                        <div className="text-3xl font-bold font-display text-emerald-600">Free</div>
                      ) : (
                        <div className="text-3xl font-bold font-display text-slate-900">
                          {formatCurrency(module.cost_cents)}
                        </div>
                      )}
                      <p className="text-xs text-slate-400 mt-1">{module.credits} credits · {formatDuration(module.duration_hours)}</p>
                    </div>

                    <Button className="w-full mb-3" size="lg">
                      <Play className="h-4 w-4 mr-2" />
                      {module.pricing_model === "free" ? "Enrol Free" : "Enrol Now"}
                    </Button>
                    <Button variant="outline" className="w-full" size="lg">
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Add to Pathway
                    </Button>

                    <div className="mt-6 space-y-3">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Globe className="h-4 w-4 text-slate-400" />
                        <span className="capitalize">{module.mode}</span> delivery
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <BookOpen className="h-4 w-4 text-slate-400" />
                        <span className="capitalize">{module.content_type.replace(/_/g, " ")}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <span className={cn("inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border", getDifficultyColor(module.difficulty))}>
                          {module.difficulty}
                        </span>
                      </div>
                      {module.has_remediation && (
                        <div className="flex items-center gap-2 text-sm text-purple-600">
                          <LifeBuoy className="h-4 w-4" />
                          Remediation support available
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Globe className="h-4 w-4 text-slate-400" />
                        {module.language}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* Outcomes */}
              <section>
                <h2 className="text-xl font-bold font-display text-slate-900 mb-4">
                  What you&apos;ll learn
                </h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {module.outcomes.map((outcome) => (
                    <div key={outcome} className="flex items-start gap-2.5">
                      <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                      <span className="text-sm text-slate-600">{outcome}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Competencies */}
              <section>
                <h2 className="text-xl font-bold font-display text-slate-900 mb-4">
                  Skills & Competencies
                </h2>
                <div className="flex flex-wrap gap-2">
                  {module.competency_tags.map((tag) => (
                    <Badge key={tag} variant="secondary">{tag}</Badge>
                  ))}
                </div>
              </section>

              {/* Industries & Job Roles */}
              <section className="grid sm:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-base font-semibold font-display text-slate-900 mb-3">
                    Relevant Industries
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {module.industry_tags.map((tag) => (
                      <Badge key={tag} variant="outline">{tag}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-base font-semibold font-display text-slate-900 mb-3">
                    Target Job Roles
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {module.job_role_tags.map((tag) => (
                      <Badge key={tag} variant="outline">{tag}</Badge>
                    ))}
                  </div>
                </div>
              </section>
            </div>

            {/* Related sidebar */}
            <div>
              <h3 className="text-base font-semibold font-display text-slate-900 mb-4">
                Related Modules
              </h3>
              <div className="space-y-3">
                {(SEED_MODULES as Module[])
                  .filter(
                    (m) =>
                      m.id !== module.id &&
                      m.competency_tags.some((t) =>
                        module.competency_tags.includes(t)
                      )
                  )
                  .slice(0, 4)
                  .map((related) => (
                    <Link key={related.id} href={`/catalog/${related.slug}`}>
                      <div className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/30 transition-all">
                        <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                          <BookOpen className="h-4 w-4 text-slate-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-slate-900 truncate">{related.title}</div>
                          <div className="text-xs text-slate-400">{related.credits} credits · {related.rating}★</div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-slate-300" />
                      </div>
                    </Link>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
