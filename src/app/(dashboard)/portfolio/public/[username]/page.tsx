"use client";

import React from "react";
import Link from "next/link";
import {
  User, Briefcase, Award, GraduationCap, MapPin, Globe, Mail,
  ExternalLink, CheckCircle2, BookOpen, Star,
} from "lucide-react";
import { Badge, Card, Button, Avatar, Separator } from "@/components/ui";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { formatDate } from "@/lib/utils";
import { createSupabaseBrowser } from "@/lib/supabase-browser";
import type { Credential } from "@/types";

// Mock public profile data
const profile = {
  name: "Thabo Mokoena",
  bio: "Aspiring full-stack developer with a strong foundation in Python, JavaScript, and React. Passionate about building technology solutions for South African challenges.",
  province: "Gauteng",
  role: "Learner",
  skills: ["Python", "JavaScript", "React", "Node.js", "SQL", "Git", "Figma", "Agile"],
  career_interests: ["Software Development", "Full Stack", "AI & Machine Learning"],
  credentials: [] as Credential[],
  portfolio: [
    { title: "E-Commerce Dashboard Redesign", type: "project", tags: ["React", "Figma", "UX Design"], url: "https://github.com/thabo/ecommerce" },
    { title: "Python Data Pipeline", type: "project", tags: ["Python", "Pandas"], url: "" },
    { title: "Standard Bank Endorsement", type: "endorsement", tags: ["Employer Endorsed"], url: "" },
  ],
  stats: { modules_completed: 5, credits_earned: 67, credentials: 4 },
};

export default function PublicPortfolioPage({ params }: { params: { username: string } }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="pt-16 pb-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-8">
          {/* Profile Header */}
          <Card className="overflow-hidden mb-6">
            <div className="bg-gradient-to-r from-emerald-600 to-navy-700 h-28" />
            <div className="px-6 pb-6 -mt-10">
              <div className="flex items-end gap-4 mb-4">
                <Avatar name={profile.name} size="lg" className="border-4 border-white shadow-md h-20 w-20 text-xl" />
                <div className="pb-1">
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl font-bold font-display text-slate-900">{profile.name}</h1>
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-500">
                    <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{profile.province}</span>
                    <Badge variant="outline" className="text-[10px]">{profile.role}</Badge>
                  </div>
                </div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">{profile.bio}</p>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((s) => (
                  <span key={s} className="text-xs font-medium px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full">{s}</span>
                ))}
              </div>
            </div>
          </Card>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold font-display text-slate-900">{profile.stats.modules_completed}</div>
              <div className="text-xs text-slate-400">Modules Completed</div>
            </Card>
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold font-display text-slate-900">{profile.stats.credits_earned}</div>
              <div className="text-xs text-slate-400">Credits Earned</div>
            </Card>
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold font-display text-slate-900">{profile.stats.credentials}</div>
              <div className="text-xs text-slate-400">Credentials</div>
            </Card>
          </div>

          {/* Credentials */}
          <Card className="p-6 mb-6">
            <h2 className="text-base font-semibold font-display text-slate-900 mb-4 flex items-center gap-2">
              <Award className="h-5 w-5 text-emerald-600" />Verified Credentials
            </h2>
            <div className="space-y-3">
              {profile.credentials.map((cred) => (
                <div key={cred.id} className="flex items-center gap-3 p-3 rounded-lg border border-slate-200">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shrink-0">
                    <Award className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-slate-900">{cred.title}</div>
                    <div className="text-xs text-slate-400">{cred.issuer} · {formatDate(cred.issued_at)}</div>
                  </div>
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                </div>
              ))}
            </div>
          </Card>

          {/* Portfolio */}
          <Card className="p-6">
            <h2 className="text-base font-semibold font-display text-slate-900 mb-4 flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-blue-600" />Portfolio
            </h2>
            <div className="space-y-3">
              {profile.portfolio.map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg border border-slate-200">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-slate-900">{item.title}</span>
                      <Badge variant="secondary" className="text-[10px] capitalize">{item.type}</Badge>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {item.tags.map((t) => (
                        <span key={t} className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full">{t}</span>
                      ))}
                    </div>
                  </div>
                  {item.url && (
                    <a href={item.url} target="_blank" rel="noreferrer" className="text-emerald-600 hover:text-emerald-700">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </Card>

          <p className="text-center text-xs text-slate-400 mt-8">
            Verified on SkillWeave SA · <Link href="/" className="text-emerald-600 hover:underline">Learn more</Link>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
