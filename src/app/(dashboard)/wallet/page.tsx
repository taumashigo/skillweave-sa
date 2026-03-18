"use client";

import React from "react";
import { motion } from "framer-motion";
import { Award, Download, Share2, QrCode, Shield, Filter } from "lucide-react";
import { Button, Badge, Card, EmptyState } from "@/components/ui";
import { DashboardShell, PageHeader } from "@/components/layout/DashboardShell";
import { CredentialCard } from "@/components/credentials/CredentialCard";
import { SEED_CREDENTIALS } from "@/data/seed";
import type { Credential } from "@/types";

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.35 },
  }),
};

export default function WalletPage() {
  const credentials = SEED_CREDENTIALS as Credential[];

  return (
    <DashboardShell>
      <PageHeader
        title="Credential Wallet"
        description="Your verified digital credentials. Share, download, or verify any credential with a QR code."
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-1.5" />
              Export All
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-1.5" />
              Share Profile
            </Button>
          </div>
        }
      />

      <div className="px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Credentials", value: credentials.length, icon: Award },
            { label: "Badges", value: credentials.filter(c => c.type === "badge").length, icon: Shield },
            { label: "Certificates", value: credentials.filter(c => c.type === "certificate").length, icon: Award },
            { label: "Endorsements", value: credentials.filter(c => c.type === "endorsement").length, icon: Shield },
          ].map((stat, i) => (
            <motion.div key={stat.label} custom={i} initial="hidden" animate="visible" variants={fadeUp}>
              <Card className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-400">{stat.label}</span>
                  <stat.icon className="h-4 w-4 text-slate-300" />
                </div>
                <div className="text-2xl font-bold font-display text-slate-900">{stat.value}</div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Credentials Grid */}
        {credentials.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {credentials.map((cred, i) => (
              <motion.div key={cred.id} custom={i + 4} initial="hidden" animate="visible" variants={fadeUp}>
                <CredentialCard credential={cred} variant="wallet" />
              </motion.div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<Award className="h-8 w-8" />}
            title="No credentials yet"
            description="Complete modules and milestones to earn verifiable digital credentials."
            action={<Button>Browse Modules</Button>}
          />
        )}
      </div>
    </DashboardShell>
  );
}
