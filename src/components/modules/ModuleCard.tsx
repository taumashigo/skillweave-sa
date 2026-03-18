"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Clock,
  Star,
  Users,
  BookOpen,
  Award,
  Shield,
  Briefcase,
  LifeBuoy,
  Zap,
} from "lucide-react";
import { Badge, Card } from "@/components/ui";
import { cn, formatCurrency, formatDuration, getDifficultyColor } from "@/lib/utils";
import type { Module } from "@/types";

interface ModuleCardProps {
  module: Module;
  variant?: "default" | "compact" | "draggable";
  showPrice?: boolean;
  showProvider?: boolean;
  onClick?: () => void;
  className?: string;
  isDragging?: boolean;
}

export function ModuleCard({
  module,
  variant = "default",
  showPrice = true,
  showProvider = true,
  onClick,
  className,
  isDragging,
}: ModuleCardProps) {
  const pricingBadge = () => {
    switch (module.pricing_model) {
      case "free":
        return <Badge variant="free">Free</Badge>;
      case "sponsored":
        return <Badge variant="sponsored">Sponsored</Badge>;
      case "employer_funded":
        return <Badge variant="info">Employer Funded</Badge>;
      case "bursary_funded":
        return <Badge variant="warning">Bursary</Badge>;
      default:
        return <Badge variant="secondary">{formatCurrency(module.cost_cents)}</Badge>;
    }
  };

  if (variant === "compact") {
    return (
      <div
        onClick={onClick}
        className={cn(
          "flex items-center gap-3 px-3 py-2.5 rounded-lg border border-slate-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/30 transition-all cursor-pointer group",
          isDragging && "dragging",
          className
        )}
      >
        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center shrink-0">
          <BookOpen className="h-4 w-4 text-slate-400 group-hover:text-emerald-500 transition-colors" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-slate-900 truncate">{module.title}</div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs text-slate-400">{module.credits} credits</span>
            <span className="text-xs text-slate-300">·</span>
            <span className="text-xs text-slate-400">{formatDuration(module.duration_hours)}</span>
          </div>
        </div>
        <div className="shrink-0">{pricingBadge()}</div>
      </div>
    );
  }

  if (variant === "draggable") {
    return (
      <div
        onClick={onClick}
        className={cn(
          "px-3 py-2.5 rounded-lg border border-slate-200 bg-white hover:border-emerald-300 transition-all cursor-grab active:cursor-grabbing group",
          isDragging && "shadow-lg border-emerald-400 scale-105 rotate-1 opacity-90",
          className
        )}
      >
        <div className="flex items-center gap-2 mb-1">
          <div className="h-1.5 w-1.5 rounded-full bg-slate-300 group-hover:bg-emerald-400 transition" />
          <span className="text-sm font-medium text-slate-900 truncate">{module.title}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400 pl-3.5">
          <span>{module.credits} cr</span>
          <span>·</span>
          <span className={cn("capitalize", getDifficultyColor(module.difficulty).split(" ")[0])}>
            {module.difficulty}
          </span>
          {module.pricing_model === "free" && (
            <>
              <span>·</span>
              <span className="text-emerald-600 font-medium">Free</span>
            </>
          )}
        </div>
      </div>
    );
  }

  // Default variant — full card
  const Wrapper = onClick ? "div" : Link;
  const wrapperProps = onClick
    ? { onClick, role: "button", tabIndex: 0 }
    : { href: `/catalog/${module.slug}` };

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      className={cn("group", className)}
    >
      <Card className="overflow-hidden card-premium h-full flex flex-col">
        {/* Thumbnail */}
        <div className="relative h-40 bg-gradient-to-br from-slate-100 to-slate-50 overflow-hidden">
          {module.thumbnail_url ? (
            <img
              src={module.thumbnail_url}
              alt={module.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-16 w-16 rounded-2xl bg-white/80 backdrop-blur flex items-center justify-center shadow-sm">
                <BookOpen className="h-7 w-7 text-slate-300" />
              </div>
            </div>
          )}
          {/* Badges overlay */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            {showPrice && pricingBadge()}
            {module.is_accredited && (
              <Badge variant="info" className="gap-1">
                <Shield className="h-3 w-3" />
                Accredited
              </Badge>
            )}
          </div>
          {module.employer_endorsed && (
            <div className="absolute top-3 right-3">
              <Badge variant="navy" className="gap-1">
                <Briefcase className="h-3 w-3" />
                Endorsed
              </Badge>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 p-4 flex flex-col">
          {showProvider && module.provider_name && (
            <p className="text-xs font-medium text-emerald-600 mb-1">
              {module.provider_name}
            </p>
          )}
          <h3 className="text-sm font-semibold font-display text-slate-900 mb-1.5 line-clamp-2 group-hover:text-emerald-700 transition-colors">
            <Link href={`/catalog/${module.slug}`}>{module.title}</Link>
          </h3>
          <p className="text-xs text-slate-500 line-clamp-2 mb-3 flex-1">
            {module.short_summary || module.description}
          </p>

          {/* Meta row */}
          <div className="flex items-center gap-3 text-xs text-slate-400 mb-3">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatDuration(module.duration_hours)}
            </span>
            <span className="flex items-center gap-1">
              <Zap className="h-3 w-3" />
              {module.credits} credits
            </span>
            {module.nqf_level && (
              <span>NQF {module.nqf_level}</span>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <div className="flex items-center gap-1.5">
              <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
              <span className="text-sm font-medium text-slate-700">{module.rating}</span>
              <span className="text-xs text-slate-400">({module.review_count})</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Users className="h-3 w-3" />
              {module.enrollment_count.toLocaleString()} enrolled
            </div>
          </div>

          {/* Feature badges */}
          {(module.has_remediation) && (
            <div className="flex items-center gap-1.5 mt-2.5">
              {module.has_remediation && (
                <span className="inline-flex items-center gap-1 text-[10px] font-medium text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-100">
                  <LifeBuoy className="h-2.5 w-2.5" />
                  Remediation
                </span>
              )}
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
