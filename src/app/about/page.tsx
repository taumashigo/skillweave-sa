"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight, BookOpen, Route, Award, Briefcase, Shield, Zap,
  Users, Heart, Globe, GraduationCap, CheckCircle2, Sparkles,
} from "lucide-react";
import { Button, Badge, Card } from "@/components/ui";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="pt-16">
        {/* Hero */}
        <section className="bg-gradient-to-b from-slate-50 to-white py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <Badge variant="outline" className="mb-6 px-4 py-1.5">About SkillWeave SA</Badge>
            <h1 className="text-4xl sm:text-5xl font-bold font-display text-slate-900 leading-tight mb-6">
              Bridging the gap between{" "}
              <span className="gradient-text">learning and employment</span>
            </h1>
            <p className="text-lg text-slate-500 leading-relaxed max-w-2xl mx-auto">
              South Africa faces a structural mismatch between traditional qualifications and what the labour market actually needs. SkillWeave SA is built to close that gap through modular, flexible, and recognised learning pathways.
            </p>
          </div>
        </section>

        {/* Problem/Solution */}
        <section className="py-20 max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl font-bold font-display text-slate-900 mb-4">The challenge</h2>
              <div className="space-y-4 text-slate-600">
                <p>Traditional education often requires years of study before earning a single qualification — with no recognition along the way.</p>
                <p>Meanwhile, employers need specific, verifiable skills. The result is millions of qualified people who aren&apos;t employable, and employers who can&apos;t find the right talent.</p>
                <p>Especially in South Africa, where youth unemployment exceeds 60%, we need learning systems that are flexible, affordable, modular, and employment-oriented.</p>
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold font-display text-slate-900 mb-4">Our approach</h2>
              <div className="space-y-3">
                {[
                  "Modular learning: earn credits for every module you complete",
                  "Stackable credentials: badges, certificates, milestones, qualifications",
                  "Real-world experience: employer-backed projects, not just theory",
                  "Adaptive support: automated remediation when you struggle",
                  "Verifiable records: QR-verified digital credentials",
                  "Affordable: free, sponsored, and bursary-funded options",
                  "NQF-aligned: follows SAQA/NQF qualification framework concepts",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-600">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Stakeholders */}
        <section className="py-20 bg-slate-50/50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl font-bold font-display text-slate-900 text-center mb-12">Built for everyone in the ecosystem</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: GraduationCap, title: "Learners", desc: "Build personalised pathways, earn credentials, and connect with real opportunities." },
                { icon: Briefcase, title: "Employers", desc: "Post projects, evaluate talent, and endorse skills you can trust." },
                { icon: BookOpen, title: "Content Providers", desc: "Publish modules, reach learners, and contribute to a marketplace of learning." },
                { icon: Users, title: "Mentors & Advisors", desc: "Guide learners, review pathways, and provide personalised support." },
              ].map((item) => (
                <Card key={item.title} className="p-6 text-center">
                  <div className="h-12 w-12 rounded-xl bg-emerald-100 flex items-center justify-center mx-auto mb-3">
                    <item.icon className="h-6 w-6 text-emerald-600" />
                  </div>
                  <h3 className="text-base font-semibold font-display text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-500">{item.desc}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl font-bold font-display text-slate-900 mb-4">
            Ready to get started?
          </h2>
          <p className="text-lg text-slate-500 mb-8 max-w-xl mx-auto">
            Join South Africa&apos;s modular learning platform. Build your future one module at a time.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/signup"><Button size="lg">Get Started Free <ArrowRight className="ml-2 h-4 w-4" /></Button></Link>
            <Link href="/catalog"><Button variant="outline" size="lg">Browse Catalogue</Button></Link>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}
