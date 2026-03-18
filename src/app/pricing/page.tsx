"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight, Sparkles, Zap, Shield, Heart } from "lucide-react";
import { Button, Badge, Card } from "@/components/ui";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Free Explorer",
    price: "R0",
    period: "forever",
    description: "Start learning with free modules and build your first pathway.",
    highlight: false,
    features: [
      "Access to all free modules",
      "Build 1 learning pathway",
      "Basic credential wallet",
      "Public portfolio page",
      "CV builder",
      "Browse opportunities",
    ],
  },
  {
    name: "Learner Pro",
    price: "R199",
    period: "/month",
    description: "Unlock the full platform with unlimited pathways and premium features.",
    highlight: true,
    features: [
      "Everything in Free Explorer",
      "Unlimited pathways",
      "AI-powered recommendations",
      "Priority remediation support",
      "Advanced analytics",
      "PDF credential downloads",
      "Apply to all opportunities",
      "Mentor matching",
      "RPL submissions",
      "Priority support",
    ],
  },
  {
    name: "Team / Employer",
    price: "R1,499",
    period: "/month",
    description: "For organisations posting opportunities and sponsoring learners.",
    highlight: false,
    features: [
      "Post unlimited opportunities",
      "Talent pool access",
      "Credential verification API",
      "Team dashboard",
      "Evaluation workflows",
      "Branded endorsements",
      "Analytics & reporting",
      "Dedicated support",
    ],
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="pt-16">
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <Badge variant="outline" className="mb-4 px-4 py-1.5">Pricing</Badge>
              <h1 className="text-3xl sm:text-4xl font-bold font-display text-slate-900 mb-4">
                Invest in your future
              </h1>
              <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                Many modules are completely free. Upgrade for unlimited pathways, AI recommendations, and premium features.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 items-start">
              {plans.map((plan, i) => (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className={cn(
                    "p-6 h-full flex flex-col",
                    plan.highlight && "border-emerald-300 shadow-lg shadow-emerald-100/50 relative"
                  )}>
                    {plan.highlight && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <Badge className="bg-emerald-600 text-white border-0 px-3 py-1 gap-1">
                          <Sparkles className="h-3 w-3" />
                          Most Popular
                        </Badge>
                      </div>
                    )}

                    <div className="mb-4 mt-2">
                      <h3 className="text-base font-semibold font-display text-slate-900">{plan.name}</h3>
                      <div className="flex items-baseline gap-1 mt-2">
                        <span className="text-3xl font-bold font-display text-slate-900">{plan.price}</span>
                        <span className="text-sm text-slate-400">{plan.period}</span>
                      </div>
                      <p className="text-sm text-slate-500 mt-2">{plan.description}</p>
                    </div>

                    <div className="flex-1">
                      <div className="space-y-2.5 mb-6">
                        {plan.features.map((feature) => (
                          <div key={feature} className="flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                            <span className="text-sm text-slate-600">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Link href="/signup">
                      <Button
                        className="w-full"
                        variant={plan.highlight ? "default" : "outline"}
                        size="lg"
                      >
                        Get Started
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Funding notice */}
            <div className="mt-16 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 border border-purple-200">
                <Heart className="h-4 w-4 text-purple-500" />
                <span className="text-sm text-purple-700 font-medium">
                  Many modules are free, sponsored, or bursary-funded. Cost should never stop you from learning.
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}
