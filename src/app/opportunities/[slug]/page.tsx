"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft, MapPin, Users, Clock, Briefcase, Banknote, GraduationCap,
  CheckCircle2, Globe, Send, Upload, Building2, Star, Shield,
} from "lucide-react";
import { Button, Badge, Card, CardContent, Textarea, Label, Input, Separator } from "@/components/ui";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SEED_OPPORTUNITIES } from "@/data/seed";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import type { Opportunity } from "@/types";

export default function OpportunityDetailPage({ params }: { params: { slug: string } }) {
  const opp = (SEED_OPPORTUNITIES as Opportunity[]).find((o) => o.slug === params.slug);
  const [showApply, setShowApply] = useState(false);
  const [applied, setApplied] = useState(false);

  if (!opp) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="pt-32 text-center">
          <h1 className="text-2xl font-bold text-slate-900">Opportunity not found</h1>
          <Link href="/opportunities"><Button variant="outline" className="mt-4">Browse Opportunities</Button></Link>
        </div>
      </div>
    );
  }

  const compensationLabels: Record<string, string> = {
    paid: "Paid", unpaid: "Volunteer", stipend: "Stipend", sponsored: "Sponsored", credit_bearing: "Credit Bearing",
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="pt-16">
        <div className="bg-gradient-to-b from-slate-50 to-white border-b border-slate-100">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Link href="/opportunities" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-6">
              <ArrowLeft className="h-4 w-4" />Back to Opportunities
            </Link>

            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <Badge className="capitalize bg-blue-50 text-blue-700 border-blue-200">{opp.type}</Badge>
                  {(opp.compensation === "paid" || opp.compensation === "stipend") && opp.stipend_amount_cents ? (
                    <Badge variant="success" className="gap-1"><Banknote className="h-3 w-3" />{formatCurrency(opp.stipend_amount_cents)}</Badge>
                  ) : (
                    <Badge variant="secondary">{compensationLabels[opp.compensation]}</Badge>
                  )}
                  {opp.credits_awarded && opp.credits_awarded > 0 && (
                    <Badge variant="info" className="gap-1"><GraduationCap className="h-3 w-3" />{opp.credits_awarded} credits</Badge>
                  )}
                </div>

                <h1 className="text-2xl sm:text-3xl font-bold font-display text-slate-900 mb-2">{opp.title}</h1>
                <div className="flex items-center gap-2 mb-4">
                  <Building2 className="h-4 w-4 text-emerald-600" />
                  <span className="text-base font-medium text-emerald-600">{opp.organization_name}</span>
                </div>
                <p className="text-base text-slate-500 leading-relaxed mb-6">{opp.description}</p>

                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                  {opp.location && <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" />{opp.location}</span>}
                  <span className="flex items-center gap-1.5"><Users className="h-4 w-4" />Team of {opp.team_size}</span>
                  <span className="flex items-center gap-1.5"><Globe className="h-4 w-4 capitalize" />{opp.mode}</span>
                  <span className="flex items-center gap-1.5"><Briefcase className="h-4 w-4" />{opp.application_count} applied</span>
                  {opp.due_date && <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" />Due {formatDate(opp.due_date)}</span>}
                </div>
              </div>

              {/* Apply Card */}
              <div>
                <Card className="card-premium sticky top-24">
                  <CardContent className="p-6">
                    {applied ? (
                      <div className="text-center py-4">
                        <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-3">
                          <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                        </div>
                        <h3 className="text-base font-semibold text-slate-900 mb-1">Application Submitted!</h3>
                        <p className="text-sm text-slate-500">You&apos;ll hear back from {opp.organization_name} soon.</p>
                      </div>
                    ) : showApply ? (
                      <div>
                        <h3 className="text-base font-semibold text-slate-900 mb-4">Apply Now</h3>
                        <div className="space-y-3">
                          <div>
                            <Label>Cover Letter</Label>
                            <Textarea className="mt-1.5" rows={4} placeholder="Why are you interested in this opportunity?" />
                          </div>
                          <div>
                            <Label>Portfolio / GitHub URL (optional)</Label>
                            <Input className="mt-1.5" placeholder="https://..." />
                          </div>
                          <div>
                            <Label>Resume (optional)</Label>
                            <div className="mt-1.5 border-2 border-dashed border-slate-200 rounded-lg p-3 text-center hover:border-emerald-300 cursor-pointer">
                              <Upload className="h-5 w-5 text-slate-300 mx-auto mb-1" />
                              <p className="text-xs text-slate-400">Upload PDF</p>
                            </div>
                          </div>
                          <div className="flex gap-2 pt-2">
                            <Button variant="outline" onClick={() => setShowApply(false)} className="flex-1">Cancel</Button>
                            <Button onClick={() => setApplied(true)} className="flex-1">
                              <Send className="h-4 w-4 mr-1.5" />Submit
                            </Button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <Button className="w-full mb-3" size="lg" onClick={() => setShowApply(true)}>
                          <Send className="h-4 w-4 mr-2" />Apply Now
                        </Button>
                        <p className="text-xs text-slate-400 text-center">
                          {opp.application_count} people have already applied
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <section>
                <h2 className="text-xl font-bold font-display text-slate-900 mb-4">Skill Requirements</h2>
                <div className="flex flex-wrap gap-2">
                  {opp.skill_requirements.map((skill) => (
                    <Badge key={skill} variant="secondary">{skill}</Badge>
                  ))}
                </div>
              </section>

              {opp.evaluation_criteria.length > 0 && (
                <section>
                  <h2 className="text-xl font-bold font-display text-slate-900 mb-4">Evaluation Criteria</h2>
                  <div className="space-y-2">
                    {opp.evaluation_criteria.map((c) => (
                      <div key={c} className="flex items-center gap-2.5">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                        <span className="text-sm text-slate-600">{c}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            <div className="space-y-4">
              <Card className="p-5">
                <h3 className="text-sm font-semibold text-slate-900 mb-3">Opportunity Details</h3>
                <div className="space-y-2.5 text-sm">
                  <div className="flex justify-between"><span className="text-slate-500">Type</span><span className="font-medium text-slate-900 capitalize">{opp.type}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Compensation</span><span className="font-medium text-slate-900 capitalize">{compensationLabels[opp.compensation]}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Team Size</span><span className="font-medium text-slate-900">{opp.team_size}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Mode</span><span className="font-medium text-slate-900 capitalize">{opp.mode}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Industry</span><span className="font-medium text-slate-900">{opp.industry}</span></div>
                  {opp.credits_awarded && <div className="flex justify-between"><span className="text-slate-500">Credits</span><span className="font-medium text-slate-900">{opp.credits_awarded}</span></div>}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
