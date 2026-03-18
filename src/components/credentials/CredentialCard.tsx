"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Award, Shield, CheckCircle2, ExternalLink, Download, QrCode,
} from "lucide-react";
import { Badge, Card, Button } from "@/components/ui";
import { cn, formatDate } from "@/lib/utils";
import type { Credential } from "@/types";

interface CredentialCardProps {
  credential: Credential;
  variant?: "default" | "compact" | "wallet";
  className?: string;
}

const typeConfig = {
  badge: { icon: Award, color: "from-amber-400 to-orange-500", label: "Badge" },
  certificate: { icon: Shield, color: "from-emerald-400 to-emerald-600", label: "Certificate" },
  milestone: { icon: CheckCircle2, color: "from-blue-400 to-blue-600", label: "Milestone" },
  qualification: { icon: Award, color: "from-purple-400 to-purple-600", label: "Qualification" },
  endorsement: { icon: CheckCircle2, color: "from-navy-400 to-navy-700", label: "Endorsement" },
};

export function CredentialCard({
  credential,
  variant = "default",
  className,
}: CredentialCardProps) {
  const config = typeConfig[credential.type] || typeConfig.badge;
  const Icon = config.icon;

  if (variant === "compact") {
    return (
      <div className={cn("flex items-center gap-3 px-3 py-3 rounded-lg border border-slate-200 bg-white", className)}>
        <div className={cn("h-10 w-10 rounded-lg bg-gradient-to-br flex items-center justify-center shrink-0", config.color)}>
          <Icon className="h-5 w-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-slate-900 truncate">{credential.title}</div>
          <div className="text-xs text-slate-400">{credential.issuer} · {formatDate(credential.issued_at)}</div>
        </div>
        {credential.is_verified && (
          <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
        )}
      </div>
    );
  }

  if (variant === "wallet") {
    return (
      <motion.div
        whileHover={{ y: -4, scale: 1.01 }}
        className={cn("group", className)}
      >
        <Card className="overflow-hidden card-premium">
          <div className={cn("h-24 bg-gradient-to-br relative overflow-hidden", config.color)}>
            <div className="absolute inset-0 opacity-10">
              <div className="absolute -top-8 -right-8 h-32 w-32 rounded-full bg-white/20" />
              <div className="absolute -bottom-4 -left-4 h-24 w-24 rounded-full bg-white/10" />
            </div>
            <div className="absolute top-4 left-4">
              <Icon className="h-8 w-8 text-white/90" />
            </div>
            {credential.is_verified && (
              <div className="absolute top-4 right-4 flex items-center gap-1 bg-white/20 backdrop-blur px-2 py-1 rounded-full">
                <CheckCircle2 className="h-3 w-3 text-white" />
                <span className="text-[10px] font-semibold text-white">Verified</span>
              </div>
            )}
          </div>
          <div className="p-4">
            <Badge variant="secondary" className="mb-2">{config.label}</Badge>
            <h3 className="text-sm font-semibold font-display text-slate-900 mb-1">
              {credential.title}
            </h3>
            <p className="text-xs text-slate-500 line-clamp-2 mb-3">
              {credential.description}
            </p>
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>{credential.issuer}</span>
              <span>{formatDate(credential.issued_at)}</span>
            </div>
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100">
              <Button variant="outline" size="sm" className="flex-1 text-xs">
                <QrCode className="h-3 w-3 mr-1" />
                Verify
              </Button>
              <Button variant="outline" size="sm" className="flex-1 text-xs">
                <Download className="h-3 w-3 mr-1" />
                PDF
              </Button>
              <Button variant="outline" size="sm" className="flex-1 text-xs">
                <ExternalLink className="h-3 w-3 mr-1" />
                Share
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    );
  }

  // Default
  return (
    <motion.div whileHover={{ y: -2 }} className={cn("group", className)}>
      <Card className="overflow-hidden card-premium p-4">
        <div className="flex items-start gap-3">
          <div className={cn("h-12 w-12 rounded-xl bg-gradient-to-br flex items-center justify-center shrink-0", config.color)}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-sm font-semibold text-slate-900 truncate">{credential.title}</h3>
              {credential.is_verified && (
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
              )}
            </div>
            <p className="text-xs text-slate-500 line-clamp-2 mb-2">{credential.description}</p>
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span>{credential.issuer}</span>
              <span>·</span>
              <span>{formatDate(credential.issued_at)}</span>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
