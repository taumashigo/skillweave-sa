"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft, Save, Eye, Briefcase, Plus, X,
} from "lucide-react";
import { Button, Card, Input, Textarea, Label, Badge, Separator } from "@/components/ui";
import { DashboardShell, PageHeader } from "@/components/layout/DashboardShell";
import { cn, INDUSTRIES } from "@/lib/utils";
import { toast } from "sonner";

export default function NewOpportunityPage() {
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [criteria, setCriteria] = useState<string[]>([]);
  const [criteriaInput, setCriteriaInput] = useState("");

  const addSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput("");
    }
  };

  const addCriteria = () => {
    if (criteriaInput.trim()) {
      setCriteria([...criteria, criteriaInput.trim()]);
      setCriteriaInput("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Opportunity created successfully!");
  };

  return (
    <DashboardShell role="employer" userName="Standard Bank" userEmail="hr@standardbank.co.za">
      <PageHeader
        title="Post New Opportunity"
        description="Create a project, internship, or challenge for learners."
        breadcrumbs={[
          { label: "Opportunities", href: "/employer/opportunities" },
          { label: "New" },
        ]}
      />

      <div className="px-6 lg:px-8 py-8 max-w-3xl">
        <form onSubmit={handleSubmit}>
          <Card className="p-6 space-y-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <h2 className="text-base font-semibold font-display text-slate-900">Basic Information</h2>
              <div>
                <Label>Title *</Label>
                <Input className="mt-1.5" placeholder="e.g., Mobile App Redesign Challenge" required />
              </div>
              <div>
                <Label>Description *</Label>
                <Textarea className="mt-1.5" rows={4} placeholder="Describe the opportunity, what the learner will work on, and what they'll gain..." required />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label>Type *</Label>
                  <select className="mt-1.5 w-full h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm" required>
                    <option value="">Select...</option>
                    <option value="project">Project</option>
                    <option value="internship">Internship</option>
                    <option value="assignment">Assignment</option>
                    <option value="simulation">Simulation</option>
                    <option value="mentorship">Mentorship</option>
                    <option value="challenge">Challenge</option>
                  </select>
                </div>
                <div>
                  <Label>Industry</Label>
                  <select className="mt-1.5 w-full h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm">
                    {INDUSTRIES.map((ind) => <option key={ind} value={ind}>{ind}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <Separator />

            {/* Compensation */}
            <div className="space-y-4">
              <h2 className="text-base font-semibold font-display text-slate-900">Compensation & Credits</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label>Compensation Type *</Label>
                  <select className="mt-1.5 w-full h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm" required>
                    <option value="unpaid">Unpaid / Volunteer</option>
                    <option value="paid">Paid</option>
                    <option value="stipend">Stipend</option>
                    <option value="sponsored">Sponsored</option>
                    <option value="credit_bearing">Credit Bearing Only</option>
                  </select>
                </div>
                <div>
                  <Label>Amount (ZAR, if applicable)</Label>
                  <Input className="mt-1.5" type="number" placeholder="e.g., 15000" />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label>Credits Awarded</Label>
                  <Input className="mt-1.5" type="number" placeholder="e.g., 15" />
                </div>
                <div>
                  <Label>Team Size</Label>
                  <Input className="mt-1.5" type="number" defaultValue={1} min={1} />
                </div>
              </div>
            </div>

            <Separator />

            {/* Requirements */}
            <div className="space-y-4">
              <h2 className="text-base font-semibold font-display text-slate-900">Requirements</h2>
              <div>
                <Label>Skill Requirements</Label>
                <div className="flex gap-2 mt-1.5">
                  <Input
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    placeholder="Add a skill..."
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                  />
                  <Button type="button" variant="outline" onClick={addSkill}><Plus className="h-4 w-4" /></Button>
                </div>
                {skills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {skills.map((s) => (
                      <Badge key={s} variant="secondary" className="gap-1">
                        {s}
                        <button type="button" onClick={() => setSkills(skills.filter((x) => x !== s))}>
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <Label>Evaluation Criteria</Label>
                <div className="flex gap-2 mt-1.5">
                  <Input
                    value={criteriaInput}
                    onChange={(e) => setCriteriaInput(e.target.value)}
                    placeholder="Add criteria..."
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCriteria())}
                  />
                  <Button type="button" variant="outline" onClick={addCriteria}><Plus className="h-4 w-4" /></Button>
                </div>
                {criteria.length > 0 && (
                  <div className="space-y-1 mt-2">
                    {criteria.map((c, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-slate-600">
                        <span className="text-emerald-500">•</span>{c}
                        <button type="button" onClick={() => setCriteria(criteria.filter((_, j) => j !== i))} className="text-slate-300 hover:text-red-500 ml-auto">
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label>Delivery Mode</Label>
                  <select className="mt-1.5 w-full h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm">
                    <option value="online">Online</option>
                    <option value="blended">Blended</option>
                    <option value="in-person">In-Person</option>
                  </select>
                </div>
                <div>
                  <Label>Location (if in-person)</Label>
                  <Input className="mt-1.5" placeholder="e.g., Johannesburg, Gauteng" />
                </div>
              </div>
              <div>
                <Label>Due Date (optional)</Label>
                <Input className="mt-1.5" type="date" />
              </div>
            </div>

            <Separator />

            {/* Submit */}
            <div className="flex items-center gap-3">
              <Button type="submit"><Save className="h-4 w-4 mr-2" />Publish Opportunity</Button>
              <Button type="button" variant="outline"><Eye className="h-4 w-4 mr-2" />Save as Draft</Button>
            </div>
          </Card>
        </form>
      </div>
    </DashboardShell>
  );
}
