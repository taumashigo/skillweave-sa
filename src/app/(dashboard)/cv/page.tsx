"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FileText, Download, Eye, Edit, User, GraduationCap, Briefcase,
  Award, Code, Globe, Mail, Phone, MapPin, Sparkles,
} from "lucide-react";
import { Button, Badge, Card, Input, Textarea, Label, Separator } from "@/components/ui";
import { DashboardShell, PageHeader } from "@/components/layout/DashboardShell";
import { cn } from "@/lib/utils";

const mockCV = {
  name: "Thabo Mokoena",
  email: "thabo@skillweave.co.za",
  phone: "+27 82 123 4567",
  location: "Johannesburg, Gauteng",
  bio: "Aspiring full-stack developer with a strong foundation in Python, JavaScript, and React. Passionate about building technology solutions for South African challenges. Currently completing the Full Stack Developer pathway on SkillWeave SA.",
  skills: ["Python", "JavaScript", "React", "Node.js", "SQL", "Git", "HTML/CSS", "Figma", "Agile"],
  education: [
    { title: "Full Stack Developer Pathway (In Progress)", institution: "SkillWeave SA", year: "2024–Present", details: "67/130 credits earned · NQF Level 6" },
    { title: "National Senior Certificate (Matric)", institution: "Parktown Boys' High School", year: "2020", details: "Bachelor's pass" },
  ],
  modules: [
    "Digital Literacy Foundations", "Introduction to Programming with Python",
    "Professional Communication & Business Writing", "Web Development with JavaScript & React (72%)",
    "Career Readiness & Job Search Skills", "Workplace Professionalism & Ethics", "Version Control with Git & GitHub (45%)",
  ],
  experience: [
    { title: "Digital Banking Dashboard Redesign", company: "Standard Bank (via SkillWeave)", year: "2024", details: "Redesigned mobile banking dashboard as part of a 3-person team. Earned employer endorsement." },
  ],
  credentials: [
    "Digital Literacy Certified (Badge)", "Python Programming Certificate",
    "Foundation Skills Milestone", "Core Developer Milestone",
    "Standard Bank Project Endorsement",
  ],
};

export default function CVBuilderPage() {
  const [editing, setEditing] = useState(false);

  return (
    <DashboardShell>
      <PageHeader
        title="CV Builder"
        description="Generate a professional CV from your SkillWeave record. Includes modules, credentials, and project experience."
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setEditing(!editing)}>
              <Edit className="h-4 w-4 mr-1.5" />
              {editing ? "Preview" : "Edit"}
            </Button>
            <Button size="sm">
              <Download className="h-4 w-4 mr-1.5" />
              Download PDF
            </Button>
          </div>
        }
      />

      <div className="px-6 lg:px-8 py-8 max-w-3xl">
        {/* AI suggestion */}
        <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-200 mb-6">
          <Sparkles className="h-5 w-5 text-emerald-600 shrink-0" />
          <div className="flex-1">
            <p className="text-sm text-emerald-800 font-medium">Your CV is auto-populated from your SkillWeave record.</p>
            <p className="text-xs text-emerald-600 mt-0.5">Modules, credentials, and project experience are included automatically.</p>
          </div>
        </div>

        {/* CV Preview */}
        <Card className="overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-navy-700 to-navy-900 p-8 text-white">
            <h1 className="text-2xl font-bold font-display mb-1">{mockCV.name}</h1>
            <p className="text-sm text-slate-300 mb-4">Aspiring Full Stack Developer</p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
              <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{mockCV.email}</span>
              <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{mockCV.phone}</span>
              <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{mockCV.location}</span>
            </div>
          </div>

          <div className="p-8 space-y-6">
            {/* Summary */}
            <section>
              <h2 className="text-sm font-bold font-display text-navy-700 uppercase tracking-wider mb-2 flex items-center gap-2">
                <User className="h-4 w-4" />Professional Summary
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">{mockCV.bio}</p>
            </section>

            <Separator />

            {/* Skills */}
            <section>
              <h2 className="text-sm font-bold font-display text-navy-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Code className="h-4 w-4" />Skills & Competencies
              </h2>
              <div className="flex flex-wrap gap-2">
                {mockCV.skills.map((skill) => (
                  <span key={skill} className="text-xs font-medium px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full">
                    {skill}
                  </span>
                ))}
              </div>
            </section>

            <Separator />

            {/* Education */}
            <section>
              <h2 className="text-sm font-bold font-display text-navy-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />Education & Learning
              </h2>
              <div className="space-y-3">
                {mockCV.education.map((ed) => (
                  <div key={ed.title}>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-sm font-semibold text-slate-900">{ed.title}</div>
                        <div className="text-xs text-slate-500">{ed.institution}</div>
                      </div>
                      <span className="text-xs text-slate-400 shrink-0">{ed.year}</span>
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">{ed.details}</div>
                  </div>
                ))}
              </div>

              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-4 mb-2">Completed Modules</h3>
              <div className="columns-2 gap-3 text-xs text-slate-600">
                {mockCV.modules.map((mod) => (
                  <div key={mod} className="flex items-start gap-1.5 mb-1.5 break-inside-avoid">
                    <span className="text-emerald-500 mt-0.5">•</span>
                    <span>{mod}</span>
                  </div>
                ))}
              </div>
            </section>

            <Separator />

            {/* Experience */}
            <section>
              <h2 className="text-sm font-bold font-display text-navy-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Briefcase className="h-4 w-4" />Experience & Projects
              </h2>
              <div className="space-y-3">
                {mockCV.experience.map((exp) => (
                  <div key={exp.title}>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-sm font-semibold text-slate-900">{exp.title}</div>
                        <div className="text-xs text-slate-500">{exp.company}</div>
                      </div>
                      <span className="text-xs text-slate-400">{exp.year}</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">{exp.details}</p>
                  </div>
                ))}
              </div>
            </section>

            <Separator />

            {/* Credentials */}
            <section>
              <h2 className="text-sm font-bold font-display text-navy-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Award className="h-4 w-4" />Credentials & Achievements
              </h2>
              <div className="space-y-1.5">
                {mockCV.credentials.map((cred) => (
                  <div key={cred} className="flex items-center gap-2 text-xs text-slate-600">
                    <span className="text-emerald-500">✓</span>
                    <span>{cred}</span>
                    <Badge variant="outline" className="text-[9px] ml-auto">Verified on SkillWeave</Badge>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Footer */}
          <div className="px-8 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
            <span>Generated by SkillWeave SA</span>
            <span>All credentials are digitally verifiable</span>
          </div>
        </Card>
      </div>
    </DashboardShell>
  );
}
