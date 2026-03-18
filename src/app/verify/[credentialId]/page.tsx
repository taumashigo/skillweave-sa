"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  CheckCircle2, Shield, Award, Calendar, Building2, User,
  ExternalLink, Download, Sparkles, QrCode,
} from "lucide-react";
import { Button, Badge, Card, Separator } from "@/components/ui";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SEED_CREDENTIALS } from "@/data/seed";
import { formatDate } from "@/lib/utils";
import type { Credential } from "@/types";

export default function VerifyCredentialPage({
  params,
}: {
  params: { credentialId: string };
}) {
  // Mock: find credential by ID or show demo
  const credential = (SEED_CREDENTIALS as Credential[])[0] || {
    id: params.credentialId,
    type: "certificate",
    title: "Python Programming Certificate",
    description: "Completed the Introduction to Programming with Python module with distinction. Demonstrated proficiency in variables, data structures, functions, and object-oriented programming.",
    issuer: "WeThinkCode_ via SkillWeave SA",
    issued_at: "2024-11-15T00:00:00Z",
    credential_hash: `SW-${params.credentialId}`,
    is_verified: true,
    metadata: {
      learner_name: "Thabo Mokoena",
      module_title: "Introduction to Programming with Python",
      credits: 20,
      nqf_level: "5",
      score: "87%",
    },
  };

  const meta = (credential.metadata || {}) as Record<string, unknown>;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="pt-16 pb-24">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-12">
          {/* Verification Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
              className="inline-flex items-center justify-center h-20 w-20 rounded-2xl bg-emerald-100 mb-4"
            >
              <CheckCircle2 className="h-10 w-10 text-emerald-600" />
            </motion.div>
            <h1 className="text-2xl font-bold font-display text-slate-900 mb-2">
              Verified Credential
            </h1>
            <p className="text-sm text-slate-500">
              This credential has been verified on the SkillWeave SA platform.
            </p>
          </motion.div>

          {/* Credential Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="credential-verified overflow-hidden">
              {/* Top banner */}
              <div className="bg-gradient-to-r from-emerald-500 to-emerald-700 -mx-8 -mt-8 px-8 py-6 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
                      <Award className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <Badge className="bg-white/20 text-white border-white/30 text-xs mb-1">
                        {credential.type.charAt(0).toUpperCase() + credential.type.slice(1)}
                      </Badge>
                      <h2 className="text-lg font-bold font-display text-white">
                        {credential.title}
                      </h2>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur rounded-full px-3 py-1.5">
                    <CheckCircle2 className="h-4 w-4 text-white" />
                    <span className="text-xs font-semibold text-white">Verified</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                {credential.description}
              </p>

              {/* Details */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-slate-100 flex items-center justify-center">
                    <User className="h-4 w-4 text-slate-500" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">Recipient</div>
                    <div className="text-sm font-medium text-slate-900">
                      {(meta.learner_name as string) || "Thabo Mokoena"}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-slate-100 flex items-center justify-center">
                    <Building2 className="h-4 w-4 text-slate-500" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">Issued by</div>
                    <div className="text-sm font-medium text-slate-900">{credential.issuer}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-slate-100 flex items-center justify-center">
                    <Calendar className="h-4 w-4 text-slate-500" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">Date issued</div>
                    <div className="text-sm font-medium text-slate-900">
                      {formatDate(credential.issued_at)}
                    </div>
                  </div>
                </div>
                {meta.credits && (
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-slate-100 flex items-center justify-center">
                      <Shield className="h-4 w-4 text-slate-500" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-400">Credits (NQF {meta.nqf_level as string})</div>
                      <div className="text-sm font-medium text-slate-900">{meta.credits as number} credits</div>
                    </div>
                  </div>
                )}
              </div>

              <Separator className="my-4" />

              {/* Hash & verification */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-400 mb-0.5">Credential ID</div>
                  <code className="text-xs font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                    {credential.credential_hash}
                  </code>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="h-3.5 w-3.5 mr-1.5" />
                    PDF
                  </Button>
                  <Button variant="outline" size="sm">
                    <QrCode className="h-3.5 w-3.5 mr-1.5" />
                    QR Code
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Platform info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-8 text-center"
          >
            <div className="flex items-center justify-center gap-2 mb-3">
              <Sparkles className="h-4 w-4 text-emerald-500" />
              <span className="text-sm font-semibold text-slate-900">Powered by SkillWeave SA</span>
            </div>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              SkillWeave SA is South Africa&apos;s modular learning and credentialing platform. All credentials are digitally verifiable and aligned with SAQA/NQF standards.
            </p>
            <Link href="/" className="inline-flex items-center gap-1 text-xs text-emerald-600 font-medium mt-2 hover:underline">
              Learn more about SkillWeave <ExternalLink className="h-3 w-3" />
            </Link>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
