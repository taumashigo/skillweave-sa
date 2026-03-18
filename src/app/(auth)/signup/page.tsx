"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Sparkles, Mail, Lock, User, ArrowRight, Eye, EyeOff,
  BookOpen, Briefcase, GraduationCap, Users, Heart,
} from "lucide-react";
import { Button, Input, Label, Separator, Badge } from "@/components/ui";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/hooks";
import { toast } from "sonner";
import type { UserRole } from "@/types";

const roles: { value: UserRole; label: string; icon: React.ElementType; desc: string }[] = [
  { value: "learner", label: "Learner", icon: GraduationCap, desc: "Build pathways and earn credentials" },
  { value: "employer", label: "Employer", icon: Briefcase, desc: "Post opportunities and find talent" },
  { value: "provider", label: "Content Provider", icon: BookOpen, desc: "Publish learning modules" },
  { value: "mentor", label: "Mentor / Advisor", icon: Users, desc: "Guide learners on their journeys" },
  { value: "sponsor", label: "Sponsor / Funder", icon: Heart, desc: "Fund bursaries and content" },
];

export default function SignUpPage() {
  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState<UserRole>("learner");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
      return;
    }
    setLoading(true);

    const { data, error } = await signUp(email, password, fullName, selectedRole);

    if (error) {
      toast.error(error.message || "Failed to create account");
      setLoading(false);
      return;
    }

    toast.success("Account created successfully!");

    if (selectedRole === "employer") router.push("/employer/dashboard");
    else if (selectedRole === "provider") router.push("/provider/dashboard");
    else if (selectedRole === "mentor" || selectedRole === "assessor") router.push("/advisor/dashboard");
    else if (selectedRole === "sponsor") router.push("/sponsor/dashboard");
    else if (selectedRole === "admin") router.push("/admin");
    else router.push("/onboarding");
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-[45%] bg-gradient-to-br from-navy-700 via-navy-800 to-navy-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20 h-72 w-72 rounded-full bg-emerald-400/20 blur-3xl" />
          <div className="absolute bottom-40 left-10 h-52 w-52 rounded-full bg-emerald-300/10 blur-2xl" />
        </div>
        <div className="relative flex flex-col justify-center px-16">
          <Link href="/" className="flex items-center gap-3 mb-12">
            <div className="h-11 w-11 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-emerald-400" />
            </div>
            <div>
              <div className="text-xl font-bold font-display text-white">SkillWeave</div>
              <div className="text-[10px] font-semibold text-emerald-300 tracking-widest uppercase">South Africa</div>
            </div>
          </Link>
          <h1 className="text-3xl font-bold font-display text-white leading-tight mb-4">Your journey starts here.</h1>
          <p className="text-base text-slate-300 max-w-sm mb-8">Create your account, choose your role, and start building personalised learning pathways that lead to real employment.</p>
          <div className="space-y-3">
            {["NQF-aligned modular learning", "Drag-and-drop pathway builder", "QR-verifiable digital credentials", "Real employer-backed projects"].map((item) => (
              <div key={item} className="flex items-center gap-2.5">
                <div className="h-5 w-5 rounded-full bg-emerald-500/20 flex items-center justify-center"><span className="text-emerald-400 text-xs">✓</span></div>
                <span className="text-sm text-slate-300">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-white">
        <motion.div key={step} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }} className="w-full max-w-[440px]">
          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center"><Sparkles className="h-5 w-5 text-white" /></div>
            <span className="text-lg font-bold font-display text-slate-900">SkillWeave SA</span>
          </div>
          <div className="flex items-center gap-2 mb-6">
            {[1, 2].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div className={cn("h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold", s === step ? "bg-emerald-600 text-white" : s < step ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-400")}>{s < step ? "✓" : s}</div>
                {s < 2 && <div className={cn("h-0.5 w-8 rounded-full", s < step ? "bg-emerald-200" : "bg-slate-200")} />}
              </div>
            ))}
          </div>
          {step === 1 ? (
            <>
              <h2 className="text-2xl font-bold font-display text-slate-900 mb-1">Choose your role</h2>
              <p className="text-sm text-slate-500 mb-6">This determines your dashboard and available features.</p>
              <div className="space-y-2 mb-6">
                {roles.map((role) => (
                  <button key={role.value} onClick={() => setSelectedRole(role.value)} className={cn("w-full flex items-center gap-3 p-3.5 rounded-xl border-2 text-left transition-all", selectedRole === role.value ? "border-emerald-500 bg-emerald-50/50" : "border-slate-200 hover:border-slate-300 hover:bg-slate-50")}>
                    <div className={cn("h-10 w-10 rounded-lg flex items-center justify-center shrink-0", selectedRole === role.value ? "bg-emerald-100" : "bg-slate-100")}><role.icon className={cn("h-5 w-5", selectedRole === role.value ? "text-emerald-600" : "text-slate-400")} /></div>
                    <div><div className="text-sm font-semibold text-slate-900">{role.label}</div><div className="text-xs text-slate-500">{role.desc}</div></div>
                  </button>
                ))}
              </div>
              <Button className="w-full h-11" onClick={() => setStep(2)}>Continue <ArrowRight className="h-4 w-4 ml-2" /></Button>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold font-display text-slate-900 mb-1">Create your account</h2>
              <p className="text-sm text-slate-500 mb-6">Already have an account?{" "}<Link href="/login" className="text-emerald-600 font-medium hover:underline">Sign in</Link></p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div><Label htmlFor="name">Full Name</Label><div className="relative mt-1.5"><User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" /><Input id="name" placeholder="Thabo Mokoena" className="pl-10" required value={fullName} onChange={(e) => setFullName(e.target.value)} /></div></div>
                <div><Label htmlFor="email">Email</Label><div className="relative mt-1.5"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" /><Input id="email" type="email" placeholder="thabo@example.co.za" className="pl-10" required value={email} onChange={(e) => setEmail(e.target.value)} /></div></div>
                <div><Label htmlFor="password">Password</Label><div className="relative mt-1.5"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" /><Input id="password" type={showPassword ? "text" : "password"} placeholder="Min 8 characters" className="pl-10 pr-10" required value={password} onChange={(e) => setPassword(e.target.value)} /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button></div></div>
                <div className="flex items-start gap-2 pt-1"><input type="checkbox" className="mt-1 rounded border-slate-300" required /><span className="text-xs text-slate-500">I agree to the <Link href="/about" className="text-emerald-600 hover:underline">Terms of Service</Link> and <Link href="/about" className="text-emerald-600 hover:underline">Privacy Policy</Link></span></div>
                <div className="flex gap-3 pt-2"><Button variant="outline" type="button" onClick={() => setStep(1)} className="w-24">Back</Button><Button type="submit" className="flex-1 h-11" isLoading={loading}>Create Account <ArrowRight className="h-4 w-4 ml-2" /></Button></div>
              </form>
            </>
          )}
          <p className="text-center text-xs text-slate-400 mt-8">By signing up, you join {">"}5,000 South African learners building their futures.</p>
        </motion.div>
      </div>
    </div>
  );
}