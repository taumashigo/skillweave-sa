"use client";

import React, { useState } from "react";
import {
  Save, Eye, Package, Plus, X, Upload,
} from "lucide-react";
import { Button, Card, Input, Textarea, Label, Badge, Separator } from "@/components/ui";
import { DashboardShell, PageHeader } from "@/components/layout/DashboardShell";
import { INDUSTRIES, NQF_LEVELS } from "@/lib/utils";
import { toast } from "sonner";

export default function NewModulePage() {
  const [competencies, setCompetencies] = useState<string[]>([]);
  const [compInput, setCompInput] = useState("");
  const [outcomes, setOutcomes] = useState<string[]>([]);
  const [outcomeInput, setOutcomeInput] = useState("");

  const addTag = (arr: string[], val: string, setter: (v: string[]) => void, inputSetter: (v: string) => void) => {
    if (val.trim() && !arr.includes(val.trim())) {
      setter([...arr, val.trim()]);
      inputSetter("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Module created successfully!");
  };

  return (
    <DashboardShell role="provider" userName="WeThinkCode_" userEmail="admin@wethinkcode.co.za">
      <PageHeader
        title="Create New Module"
        description="Publish a learning module to the SkillWeave catalogue."
        breadcrumbs={[{ label: "Modules", href: "/provider/modules" }, { label: "New" }]}
      />

      <div className="px-6 lg:px-8 py-8 max-w-3xl">
        <form onSubmit={handleSubmit}>
          <Card className="p-6 space-y-6">
            {/* Basic */}
            <div className="space-y-4">
              <h2 className="text-base font-semibold font-display text-slate-900">Module Details</h2>
              <div>
                <Label>Title *</Label>
                <Input className="mt-1.5" placeholder="e.g., Introduction to Cloud Computing" required />
              </div>
              <div>
                <Label>Short Summary *</Label>
                <Input className="mt-1.5" placeholder="One-line description for cards and previews" required />
              </div>
              <div>
                <Label>Full Description *</Label>
                <Textarea className="mt-1.5" rows={5} placeholder="Detailed module description..." required />
              </div>
              <div>
                <Label>Cover Image</Label>
                <div className="mt-1.5 border-2 border-dashed border-slate-200 rounded-lg p-6 text-center hover:border-emerald-300 cursor-pointer">
                  <Upload className="h-6 w-6 text-slate-300 mx-auto mb-1" />
                  <p className="text-xs text-slate-500">Upload a cover image (recommended 16:9)</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Classification */}
            <div className="space-y-4">
              <h2 className="text-base font-semibold font-display text-slate-900">Classification & Accreditation</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label>NQF Level</Label>
                  <select className="mt-1.5 w-full h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm">
                    {NQF_LEVELS.map((l) => <option key={l.value} value={l.value}>{l.label}</option>)}
                  </select>
                </div>
                <div>
                  <Label>Credits *</Label>
                  <Input className="mt-1.5" type="number" placeholder="e.g., 20" required min={1} />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label>SAQA ID (optional)</Label>
                  <Input className="mt-1.5" placeholder="e.g., 120372" />
                </div>
                <div>
                  <Label>Difficulty *</Label>
                  <select className="mt-1.5 w-full h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm" required>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                    <option value="expert">Expert</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-sm text-slate-600">
                  <input type="checkbox" className="rounded border-slate-300" />Is SAQA Accredited
                </label>
                <label className="flex items-center gap-2 text-sm text-slate-600">
                  <input type="checkbox" className="rounded border-slate-300" />Employer Endorsed
                </label>
                <label className="flex items-center gap-2 text-sm text-slate-600">
                  <input type="checkbox" className="rounded border-slate-300" />Has Remediation
                </label>
              </div>
            </div>

            <Separator />

            {/* Delivery & Pricing */}
            <div className="space-y-4">
              <h2 className="text-base font-semibold font-display text-slate-900">Delivery & Pricing</h2>
              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <Label>Content Type *</Label>
                  <select className="mt-1.5 w-full h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm" required>
                    <option value="video">Video</option>
                    <option value="reading">Reading</option>
                    <option value="assessment">Assessment</option>
                    <option value="project">Project</option>
                    <option value="workshop">Workshop</option>
                    <option value="lab">Lab</option>
                    <option value="case_study">Case Study</option>
                    <option value="simulation">Simulation</option>
                    <option value="live_session">Live Session</option>
                    <option value="ai_tutoring">AI Tutoring</option>
                    <option value="podcast">Podcast</option>
                  </select>
                </div>
                <div>
                  <Label>Delivery Mode *</Label>
                  <select className="mt-1.5 w-full h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm" required>
                    <option value="online">Online</option>
                    <option value="blended">Blended</option>
                    <option value="in-person">In-Person</option>
                    <option value="synchronous">Synchronous</option>
                    <option value="asynchronous">Asynchronous</option>
                  </select>
                </div>
                <div>
                  <Label>Duration (hours) *</Label>
                  <Input className="mt-1.5" type="number" placeholder="e.g., 40" required min={1} />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label>Pricing Model *</Label>
                  <select className="mt-1.5 w-full h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm" required>
                    <option value="free">Free</option>
                    <option value="paid_once">Paid (once-off)</option>
                    <option value="subscription">Subscription</option>
                    <option value="sponsored">Sponsored</option>
                    <option value="employer_funded">Employer Funded</option>
                    <option value="bursary_funded">Bursary Funded</option>
                  </select>
                </div>
                <div>
                  <Label>Price (ZAR cents, if paid)</Label>
                  <Input className="mt-1.5" type="number" placeholder="e.g., 89900 for R899" />
                </div>
              </div>
              <div>
                <Label>Language</Label>
                <select className="mt-1.5 w-full h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm max-w-xs">
                  <option value="English">English</option>
                  <option value="isiZulu">isiZulu</option>
                  <option value="Afrikaans">Afrikaans</option>
                  <option value="isiXhosa">isiXhosa</option>
                </select>
              </div>
            </div>

            <Separator />

            {/* Outcomes & Competencies */}
            <div className="space-y-4">
              <h2 className="text-base font-semibold font-display text-slate-900">Outcomes & Competencies</h2>
              <div>
                <Label>Learning Outcomes</Label>
                <div className="flex gap-2 mt-1.5">
                  <Input value={outcomeInput} onChange={(e) => setOutcomeInput(e.target.value)} placeholder="Add an outcome..." onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag(outcomes, outcomeInput, setOutcomes, setOutcomeInput))} />
                  <Button type="button" variant="outline" onClick={() => addTag(outcomes, outcomeInput, setOutcomes, setOutcomeInput)}><Plus className="h-4 w-4" /></Button>
                </div>
                {outcomes.length > 0 && (
                  <div className="space-y-1 mt-2">
                    {outcomes.map((o, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg">
                        <span className="text-emerald-500">✓</span>{o}
                        <button type="button" onClick={() => setOutcomes(outcomes.filter((_, j) => j !== i))} className="ml-auto text-slate-300 hover:text-red-500"><X className="h-3 w-3" /></button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <Label>Competency Tags</Label>
                <div className="flex gap-2 mt-1.5">
                  <Input value={compInput} onChange={(e) => setCompInput(e.target.value)} placeholder="Add a competency tag..." onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag(competencies, compInput, setCompetencies, setCompInput))} />
                  <Button type="button" variant="outline" onClick={() => addTag(competencies, compInput, setCompetencies, setCompInput)}><Plus className="h-4 w-4" /></Button>
                </div>
                {competencies.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {competencies.map((c) => (
                      <Badge key={c} variant="secondary" className="gap-1">
                        {c}
                        <button type="button" onClick={() => setCompetencies(competencies.filter((x) => x !== c))}><X className="h-3 w-3" /></button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <Separator />

            <div className="flex items-center gap-3">
              <Button type="submit"><Save className="h-4 w-4 mr-2" />Publish Module</Button>
              <Button type="button" variant="outline"><Eye className="h-4 w-4 mr-2" />Save as Draft</Button>
            </div>
          </Card>
        </form>
      </div>
    </DashboardShell>
  );
}
