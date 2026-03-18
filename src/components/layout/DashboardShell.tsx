"use client";

import React from "react";
import { DashboardSidebar } from "./DashboardSidebar";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/types";

interface DashboardShellProps {
  children: React.ReactNode;
  role?: UserRole;
  userName?: string;
  userEmail?: string;
}

export function DashboardShell({
  children,
  role = "learner",
  userName = "Thabo Mokoena",
  userEmail = "thabo@skillweave.co.za",
}: DashboardShellProps) {
  return (
    <div className="min-h-screen bg-slate-50/50">
      <DashboardSidebar
        role={role}
        userName={userName}
        userEmail={userEmail}
      />
      <main className="lg:pl-[260px] pt-14 lg:pt-0">
        <div className="min-h-screen">
          {children}
        </div>
      </main>
    </div>
  );
}

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  breadcrumbs?: { label: string; href?: string }[];
  className?: string;
}

export function PageHeader({
  title,
  description,
  actions,
  breadcrumbs,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn("border-b border-slate-200 bg-white px-6 lg:px-8 py-6", className)}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex items-center gap-1.5 text-xs text-slate-400 mb-3">
          {breadcrumbs.map((crumb, i) => (
            <React.Fragment key={i}>
              {i > 0 && <span>/</span>}
              {crumb.href ? (
                <a href={crumb.href} className="hover:text-slate-600 transition-colors">
                  {crumb.label}
                </a>
              ) : (
                <span className="text-slate-600">{crumb.label}</span>
              )}
            </React.Fragment>
          ))}
        </nav>
      )}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-slate-900">
            {title}
          </h1>
          {description && (
            <p className="text-sm text-slate-500 mt-1 max-w-2xl">
              {description}
            </p>
          )}
        </div>
        {actions && <div className="flex items-center gap-3 shrink-0">{actions}</div>}
      </div>
    </div>
  );
}
