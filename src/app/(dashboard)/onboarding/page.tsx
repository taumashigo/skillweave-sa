"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight, ArrowLeft, Sparkles, Target, Briefcase, Wallet,
  BookOpen, GraduationCap, CheckCircle2, Upload, Globe, Zap,
} from "lucide-react";
import { Button, Badge, Card, Input, Label, Textarea } from "@/components/ui";
import { cn, INDUSTRIES, CAREER_INTERESTS, SA_PROVINCES } from "@/lib/utils";

const steps = [
  { id: 1, title: "Career Interests", icon: Target },
  { id: 2, title: "Target Roles", icon: Briefcase },
  { id: 3, title: "Budget & Mode", icon: Wallet },
  { id: 4, title: "Prior Learning", icon: GraduationCap },
  { id: 5, title: "Your Pathway", icon: Sparkles },
];

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [budget, setBudget] = useState("flexible");
  const [mode, setMode] = useState("online");
  const [pathwayType, setPathwayType] = useState("mixed");

  const toggleItem = (arr: string[], item: string, setter: (v: string[]) => void) => {
    setter(arr.includes(item) ? arr.filter(i => i !== item) : [...arr, item]);
  };

  const next = () => setStep(Math.min(step + 1, 5));
  const prev = () => setStep(Math.max(step - 1, 1));

  const jobRoles = [
    "Software Developer", "Frontend Developer", "Backend Developer", "Full Stack Developer",
    "Data Analyst", "Data Scientist", "ML Engineer", "BI Analyst",
    "Digital Marketer", "Content Creator", "Social Media Manager",
    "Project Manager", "Product Manager", "Scrum Master",
    "UX Designer", "UI Designer", "Business Analyst",
    "DevOps Engineer", "Cloud Engineer", "Cybersecurity Analyst",
    "Entrepreneur", "Freelancer",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold font-display text-slate-900">SkillWeave SA</span>
          </div>
          <h1 className="text-2xl font-bold font-display text-slate-900 mb-1">
            Let&apos;s personalise your journey
          </h1>
          <p className="text-sm text-slate-500">
            Tell us about your goals so we can recommend the right pathways.
          </p>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-center gap-1 mb-8">
          {steps.map((s) => (
            <React.Fragment key={s.id}>
              <div className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all",
                s.id === step
                  ? "bg-emerald-100 text-emerald-700"
                  : s.id < step
                  ? "bg-emerald-500 text-white"
                  : "bg-slate-100 text-slate-400"
              )}>
                {s.id < step ? <CheckCircle2 className="h-3.5 w-3.5" /> : <s.icon className="h-3.5 w-3.5" />}
                <span className="hidden sm:inline">{s.title}</span>
              </div>
              {s.id < 5 && <div className={cn("h-0.5 w-6 rounded", s.id < step ? "bg-emerald-300" : "bg-slate-200")} />}
            </React.Fragment>
          ))}
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            <Card className="p-6 sm:p-8">
              {step === 1 && (
                <div>
                  <h2 className="text-lg font-semibold font-display text-slate-900 mb-1">
                    What are you interested in learning?
                  </h2>
                  <p className="text-sm text-slate-500 mb-6">Select all that apply. We&apos;ll use these to recommend modules and pathways.</p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {CAREER_INTERESTS.map((interest) => (
                      <button
                        key={interest}
                        onClick={() => toggleItem(selectedInterests, interest, setSelectedInterests)}
                        className={cn(
                          "px-3 py-1.5 rounded-full text-sm font-medium border transition-all",
                          selectedInterests.includes(interest)
                            ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                            : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                        )}
                      >
                        {interest}
                      </button>
                    ))}
                  </div>
                  <h3 className="text-sm font-semibold text-slate-700 mb-3">Which industries interest you?</h3>
                  <div className="flex flex-wrap gap-2">
                    {INDUSTRIES.map((ind) => (
                      <button
                        key={ind}
                        onClick={() => toggleItem(selectedIndustries, ind, setSelectedIndustries)}
                        className={cn(
                          "px-3 py-1.5 rounded-full text-sm font-medium border transition-all",
                          selectedIndustries.includes(ind)
                            ? "bg-blue-50 text-blue-700 border-blue-300"
                            : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                        )}
                      >
                        {ind}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div>
                  <h2 className="text-lg font-semibold font-display text-slate-900 mb-1">
                    What roles are you targeting?
                  </h2>
                  <p className="text-sm text-slate-500 mb-6">We&apos;ll match you with pathways that lead to these careers.</p>
                  <div className="flex flex-wrap gap-2">
                    {jobRoles.map((role) => (
                      <button
                        key={role}
                        onClick={() => toggleItem(selectedRoles, role, setSelectedRoles)}
                        className={cn(
                          "px-3 py-1.5 rounded-full text-sm font-medium border transition-all",
                          selectedRoles.includes(role)
                            ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                            : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                        )}
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 3 && (
                <div>
                  <h2 className="text-lg font-semibold font-display text-slate-900 mb-1">
                    Budget & Delivery Preference
                  </h2>
                  <p className="text-sm text-slate-500 mb-6">Help us tailor affordable, accessible options for you.</p>

                  <div className="space-y-6">
                    <div>
                      <Label className="mb-3 block">Budget preference</Label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {[
                          { value: "free_only", label: "Free only" },
                          { value: "low", label: "Under R500/mo" },
                          { value: "medium", label: "R500–R2,000/mo" },
                          { value: "high", label: "R2,000+/mo" },
                          { value: "flexible", label: "Flexible" },
                        ].map((opt) => (
                          <button
                            key={opt.value}
                            onClick={() => setBudget(opt.value)}
                            className={cn(
                              "px-3 py-2.5 rounded-lg text-sm font-medium border text-center transition-all",
                              budget === opt.value
                                ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                                : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                            )}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label className="mb-3 block">Preferred delivery mode</Label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {[
                          { value: "online", label: "Online" },
                          { value: "blended", label: "Blended" },
                          { value: "in-person", label: "In-Person" },
                          { value: "any", label: "Any" },
                        ].map((opt) => (
                          <button
                            key={opt.value}
                            onClick={() => setMode(opt.value)}
                            className={cn(
                              "px-3 py-2.5 rounded-lg text-sm font-medium border text-center transition-all",
                              mode === opt.value
                                ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                                : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                            )}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label className="mb-3 block">What kind of pathway do you want?</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { value: "accredited", label: "Accredited qualifications" },
                          { value: "short", label: "Short courses" },
                          { value: "job_focused", label: "Job-focused skills" },
                          { value: "mixed", label: "Mix of everything" },
                        ].map((opt) => (
                          <button
                            key={opt.value}
                            onClick={() => setPathwayType(opt.value)}
                            className={cn(
                              "px-3 py-2.5 rounded-lg text-sm font-medium border text-center transition-all",
                              pathwayType === opt.value
                                ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                                : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                            )}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div>
                  <h2 className="text-lg font-semibold font-display text-slate-900 mb-1">
                    Prior Learning & Experience
                  </h2>
                  <p className="text-sm text-slate-500 mb-6">Tell us about any existing qualifications or experience. This helps us avoid redundant content and enables RPL.</p>

                  <div className="space-y-4">
                    <div>
                      <Label>Highest qualification (optional)</Label>
                      <select className="mt-1.5 w-full h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm">
                        <option>Select...</option>
                        <option>No formal qualification</option>
                        <option>Matric / Grade 12</option>
                        <option>NQF 5 - Higher Certificate</option>
                        <option>NQF 6 - Diploma</option>
                        <option>NQF 7 - Degree</option>
                        <option>NQF 8+ - Postgraduate</option>
                      </select>
                    </div>
                    <div>
                      <Label>Relevant work experience (optional)</Label>
                      <Textarea
                        className="mt-1.5"
                        rows={3}
                        placeholder="e.g., 2 years as a junior developer at a startup, managed social media for a local business..."
                      />
                    </div>
                    <div>
                      <Label>Upload CV (optional)</Label>
                      <div className="mt-1.5 border-2 border-dashed border-slate-200 rounded-lg p-4 text-center hover:border-emerald-300 transition-colors cursor-pointer">
                        <Upload className="h-6 w-6 text-slate-300 mx-auto mb-1" />
                        <p className="text-xs text-slate-500">PDF, DOC up to 5MB</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {step === 5 && (
                <div className="text-center py-4">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-emerald-100 mb-4"
                  >
                    <Sparkles className="h-8 w-8 text-emerald-600" />
                  </motion.div>
                  <h2 className="text-xl font-bold font-display text-slate-900 mb-2">
                    You&apos;re all set!
                  </h2>
                  <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
                    Based on your interests in {selectedInterests.slice(0, 3).join(", ")} and target roles like {selectedRoles.slice(0, 2).join(" and ")}, we&apos;ve prepared personalised recommendations for you.
                  </p>

                  <div className="grid sm:grid-cols-3 gap-3 mb-6 text-left">
                    {[
                      { icon: BookOpen, title: "8 Recommended Modules", desc: "Matched to your interests" },
                      { icon: Target, title: "2 Pathway Templates", desc: "Curated for your goals" },
                      { icon: Briefcase, title: "4 Opportunities", desc: "Available right now" },
                    ].map((item) => (
                      <div key={item.title} className="flex items-start gap-2.5 p-3 rounded-lg bg-emerald-50/50 border border-emerald-100">
                        <item.icon className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <div className="text-sm font-medium text-slate-900">{item.title}</div>
                          <div className="text-xs text-slate-500">{item.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Button
                    size="lg"
                    onClick={() => window.location.href = "/dashboard"}
                  >
                    Go to Dashboard
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              )}
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6">
          {step > 1 ? (
            <Button variant="outline" onClick={prev}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          ) : (
            <div />
          )}
          {step < 5 && (
            <Button onClick={next}>
              Continue
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
