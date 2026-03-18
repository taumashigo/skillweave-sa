"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight, BookOpen, Route, Award, Briefcase, Shield, Zap,
  Users, Star, ChevronRight, Sparkles, BarChart3, GraduationCap,
  CheckCircle2, Globe, Heart,
} from "lucide-react";
import { Button, Badge, Card } from "@/components/ui";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SEED_MODULES, SEED_OPPORTUNITIES } from "@/data/seed";
import { ModuleCard } from "@/components/modules/ModuleCard";
import type { Module } from "@/types";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" },
  }),
};

const stats = [
  { value: "40+", label: "Learning Modules" },
  { value: "5", label: "Pathway Templates" },
  { value: "6", label: "SA Employers" },
  { value: "NQF", label: "Aligned" },
];

const features = [
  {
    icon: Route,
    title: "Drag & Drop Pathways",
    description: "Build personalised learning journeys by dragging modules into your pathway canvas. Smart validation ensures every combination makes sense.",
    color: "from-emerald-500 to-emerald-700",
  },
  {
    icon: Award,
    title: "Stackable Credentials",
    description: "Earn badges, certificates, and milestones as you progress. Every achievement is digitally verifiable with QR codes.",
    color: "from-blue-500 to-blue-700",
  },
  {
    icon: Briefcase,
    title: "Real-World Experience",
    description: "Apply for employer-backed projects, internships, and challenges. Build your portfolio with endorsed real-world work.",
    color: "from-purple-500 to-purple-700",
  },
  {
    icon: Zap,
    title: "Adaptive Remediation",
    description: "Struggling? Our platform detects when you need help and surfaces targeted remediation content automatically.",
    color: "from-amber-500 to-orange-600",
  },
  {
    icon: Shield,
    title: "SAQA/NQF Aligned",
    description: "Modules carry NQF-level metadata and credit values. Pathways follow qualification rules for meaningful credentials.",
    color: "from-slate-600 to-slate-800",
  },
  {
    icon: Heart,
    title: "Affordable & Accessible",
    description: "Free modules, bursary-funded options, and employer-sponsored content. Your budget should never block your future.",
    color: "from-pink-500 to-rose-600",
  },
];

export default function HomePage() {
  const featuredModules = (SEED_MODULES as Module[]).slice(0, 6);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* ===================== HERO ===================== */}
      <section className="relative pt-16 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-white to-white" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-br from-emerald-100/40 via-transparent to-transparent rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 lg:pt-32 lg:pb-24">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Badge variant="outline" className="mb-6 px-4 py-1.5 text-sm gap-2">
                <Sparkles className="h-3.5 w-3.5 text-emerald-500" />
                Built for South Africa&apos;s future workforce
              </Badge>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold font-display text-slate-900 leading-[1.1] mb-6"
            >
              Build your future,{" "}
              <span className="gradient-text">one module at a time</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg sm:text-xl text-slate-500 max-w-2xl mx-auto mb-8 leading-relaxed"
            >
              SkillWeave SA lets you create personalised learning pathways, earn stackable credentials, and connect with real employers — all aligned to SAQA/NQF standards.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex items-center justify-center gap-4 flex-wrap"
            >
              <Link href="/signup">
                <Button size="lg" className="text-base px-8">
                  Start Building Your Pathway
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/catalog">
                <Button variant="outline" size="lg" className="text-base px-8">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Browse Catalogue
                </Button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex items-center justify-center gap-8 sm:gap-12 mt-16"
            >
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold font-display text-slate-900">
                    {stat.value}
                  </div>
                  <div className="text-xs sm:text-sm text-slate-400 mt-0.5">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-16 max-w-5xl mx-auto"
          >
            <div className="rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-200/50 overflow-hidden">
              <div className="flex items-center gap-1.5 px-4 py-3 bg-slate-50 border-b border-slate-100">
                <div className="h-3 w-3 rounded-full bg-red-300" />
                <div className="h-3 w-3 rounded-full bg-amber-300" />
                <div className="h-3 w-3 rounded-full bg-emerald-300" />
                <span className="ml-3 text-xs text-slate-400 font-mono">skillweave.co.za/dashboard</span>
              </div>
              <div className="p-6 bg-gradient-to-br from-slate-50 to-white min-h-[300px]">
                {/* Mock dashboard */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                  {[
                    { label: "Credits Earned", value: "65/120", icon: GraduationCap },
                    { label: "Modules Done", value: "8", icon: BookOpen },
                    { label: "Milestones", value: "3", icon: Award },
                    { label: "Opportunities", value: "12", icon: Briefcase },
                  ].map((stat) => (
                    <div key={stat.label} className="bg-white rounded-xl border border-slate-200 p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-slate-400">{stat.label}</span>
                        <stat.icon className="h-4 w-4 text-slate-300" />
                      </div>
                      <div className="text-xl font-bold font-display text-slate-900">{stat.value}</div>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2 bg-white rounded-xl border border-slate-200 p-4 h-40">
                    <div className="text-xs font-medium text-slate-400 mb-3">Active Pathway Progress</div>
                    <div className="space-y-3">
                      {["Digital Literacy", "Python Programming", "Web Dev React"].map((mod, i) => (
                        <div key={mod} className="flex items-center gap-3">
                          <div className="flex-1">
                            <div className="text-xs font-medium text-slate-700 mb-1">{mod}</div>
                            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-emerald-500 rounded-full"
                                style={{ width: `${[100, 75, 30][i]}%` }}
                              />
                            </div>
                          </div>
                          <span className="text-xs text-slate-400 w-8">{[100, 75, 30][i]}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-white rounded-xl border border-slate-200 p-4 h-40">
                    <div className="text-xs font-medium text-slate-400 mb-3">Recent Credentials</div>
                    <div className="space-y-2">
                      {[
                        { title: "Digital Literacy", type: "Badge" },
                        { title: "Python Cert", type: "Certificate" },
                        { title: "Core Milestone", type: "Milestone" },
                      ].map((cred) => (
                        <div key={cred.title} className="flex items-center gap-2">
                          <div className="h-6 w-6 rounded bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                            <Award className="h-3 w-3 text-white" />
                          </div>
                          <div>
                            <div className="text-xs font-medium text-slate-700">{cred.title}</div>
                            <div className="text-[10px] text-slate-400">{cred.type}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===================== FEATURES ===================== */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 px-3 py-1">
              Why SkillWeave
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold font-display text-slate-900 mb-4">
              Learning that leads to employment
            </h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
              We bridge the gap between education and employability with modular, flexible, and recognised learning pathways.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={fadeUp}
              >
                <Card className="p-6 h-full card-premium group">
                  <div className={cn("h-12 w-12 rounded-xl bg-gradient-to-br flex items-center justify-center mb-4 group-hover:scale-110 transition-transform", feature.color)}>
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-base font-semibold font-display text-slate-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== HOW IT WORKS ===================== */}
      <section className="py-24 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 px-3 py-1">
              How It Works
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold font-display text-slate-900 mb-4">
              Four steps to a verified qualification
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: "01", title: "Set Your Goals", desc: "Choose career interests, target jobs, and budget. We personalise your journey from day one.", icon: Globe },
              { step: "02", title: "Build Your Pathway", desc: "Drag and drop modules into your learning canvas. Our engine validates every combination.", icon: Route },
              { step: "03", title: "Learn & Earn Credits", desc: "Complete modules, earn badges, and hit milestones. Get remediation help when you need it.", icon: GraduationCap },
              { step: "04", title: "Prove & Apply", desc: "Build your portfolio, download verifiable credentials, and apply for real-world opportunities.", icon: Briefcase },
            ].map((step, i) => (
              <motion.div
                key={step.step}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
              >
                <div className="text-center">
                  <div className="relative inline-flex items-center justify-center mb-4">
                    <div className="h-16 w-16 rounded-2xl bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                      <step.icon className="h-7 w-7 text-emerald-600" />
                    </div>
                    <span className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center">
                      {step.step}
                    </span>
                  </div>
                  <h3 className="text-base font-semibold font-display text-slate-900 mb-2">{step.title}</h3>
                  <p className="text-sm text-slate-500">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== FEATURED MODULES ===================== */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <Badge variant="outline" className="mb-4 px-3 py-1">
                Featured Modules
              </Badge>
              <h2 className="text-3xl font-bold font-display text-slate-900">
                Start learning today
              </h2>
            </div>
            <Link href="/catalog">
              <Button variant="outline">
                View All Modules
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredModules.map((module) => (
              <ModuleCard key={module.id} module={module as Module} />
            ))}
          </div>
        </div>
      </section>

      {/* ===================== CTA ===================== */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-navy-800 p-12 sm:p-16 overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 h-80 w-80 rounded-full bg-white/20 blur-3xl" />
              <div className="absolute bottom-0 left-0 h-60 w-60 rounded-full bg-white/10 blur-2xl" />
            </div>
            <div className="relative text-center max-w-2xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold font-display text-white mb-4">
                Ready to weave your skills into a career?
              </h2>
              <p className="text-lg text-emerald-100 mb-8">
                Join thousands of South African learners building their futures through modular learning and real-world experience.
              </p>
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <Link href="/signup">
                  <Button size="lg" className="bg-white text-emerald-700 hover:bg-emerald-50 text-base px-8 shadow-lg">
                    Get Started Free
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/about">
                  <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10 text-base px-8">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
