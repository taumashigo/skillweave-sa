"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  MapPin, Users, Clock, Briefcase, Banknote, GraduationCap, ChevronRight,
} from "lucide-react";
import { Badge, Card, Button } from "@/components/ui";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import type { Opportunity } from "@/types";

interface OpportunityCardProps {
  opportunity: Opportunity;
  className?: string;
}

const typeColors: Record<string, string> = {
  project: "bg-blue-50 text-blue-700 border-blue-200",
  internship: "bg-emerald-50 text-emerald-700 border-emerald-200",
  assignment: "bg-purple-50 text-purple-700 border-purple-200",
  simulation: "bg-amber-50 text-amber-700 border-amber-200",
  mentorship: "bg-pink-50 text-pink-700 border-pink-200",
  challenge: "bg-red-50 text-red-700 border-red-200",
};

const compensationLabels: Record<string, string> = {
  paid: "Paid",
  unpaid: "Volunteer",
  stipend: "Stipend",
  sponsored: "Sponsored",
  credit_bearing: "Credit Bearing",
};

export function OpportunityCard({ opportunity, className }: OpportunityCardProps) {
  return (
    <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.2 }}>
      <Link href={`/opportunities/${opportunity.slug}`}>
        <Card className={cn("overflow-hidden card-premium p-5 group", className)}>
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <Badge className={cn(typeColors[opportunity.type] || "bg-slate-50 text-slate-700 border-slate-200")}>
                {opportunity.type.charAt(0).toUpperCase() + opportunity.type.slice(1)}
              </Badge>
              {opportunity.compensation === "paid" || opportunity.compensation === "stipend" ? (
                <Badge variant="success" className="gap-1">
                  <Banknote className="h-3 w-3" />
                  {opportunity.stipend_amount_cents
                    ? formatCurrency(opportunity.stipend_amount_cents)
                    : compensationLabels[opportunity.compensation]}
                </Badge>
              ) : (
                <Badge variant="secondary">
                  {compensationLabels[opportunity.compensation]}
                </Badge>
              )}
            </div>
            {opportunity.credits_awarded && opportunity.credits_awarded > 0 && (
              <Badge variant="info" className="gap-1">
                <GraduationCap className="h-3 w-3" />
                {opportunity.credits_awarded} credits
              </Badge>
            )}
          </div>

          <h3 className="text-base font-semibold font-display text-slate-900 mb-1 group-hover:text-emerald-700 transition-colors">
            {opportunity.title}
          </h3>
          <p className="text-sm text-emerald-600 font-medium mb-2">
            {opportunity.organization_name}
          </p>
          <p className="text-sm text-slate-500 line-clamp-2 mb-4">
            {opportunity.description}
          </p>

          {/* Skills */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {opportunity.skill_requirements.slice(0, 4).map((skill) => (
              <span
                key={skill}
                className="text-[10px] font-medium px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full"
              >
                {skill}
              </span>
            ))}
            {opportunity.skill_requirements.length > 4 && (
              <span className="text-[10px] font-medium px-2 py-0.5 bg-slate-100 text-slate-400 rounded-full">
                +{opportunity.skill_requirements.length - 4} more
              </span>
            )}
          </div>

          {/* Meta */}
          <div className="flex items-center gap-4 text-xs text-slate-400 pt-3 border-t border-slate-100">
            {opportunity.location && (
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {opportunity.location}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              Team of {opportunity.team_size}
            </span>
            <span className="flex items-center gap-1">
              <Briefcase className="h-3 w-3" />
              {opportunity.application_count} applied
            </span>
            {opportunity.due_date && (
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Due {formatDate(opportunity.due_date)}
              </span>
            )}
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}
