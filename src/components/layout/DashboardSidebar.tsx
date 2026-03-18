"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  BookOpen,
  Route,
  GraduationCap,
  Award,
  Wallet,
  FolderOpen,
  FileText,
  Briefcase,
  Send,
  LifeBuoy,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Users,
  BarChart3,
  Package,
  Star,
  Shield,
  ClipboardList,
  MessageSquare,
  Sparkles,
  FileCheck,
  Bell,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui";
import type { UserRole } from "@/types";

interface SidebarLink {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
}

const learnerLinks: SidebarLink[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "My Pathways", href: "/pathways", icon: Route },
  { label: "Learning", href: "/learning", icon: BookOpen },
  { label: "Catalogue", href: "/catalog", icon: Package },
  { label: "Credentials", href: "/credentials", icon: Award },
  { label: "Wallet", href: "/wallet", icon: Wallet },
  { label: "Portfolio", href: "/portfolio", icon: FolderOpen },
  { label: "CV Builder", href: "/cv", icon: FileText },
  { label: "Transcript", href: "/transcript", icon: ClipboardList },
  { label: "Opportunities", href: "/opportunities", icon: Briefcase },
  { label: "Applications", href: "/applications", icon: Send },
  { label: "RPL", href: "/rpl", icon: FileCheck },
  { label: "Support", href: "/support", icon: LifeBuoy },
];

const employerLinks: SidebarLink[] = [
  { label: "Dashboard", href: "/employer/dashboard", icon: LayoutDashboard },
  { label: "Opportunities", href: "/employer/opportunities", icon: Briefcase },
  { label: "Submissions", href: "/employer/submissions", icon: ClipboardList },
  { label: "Analytics", href: "/employer/analytics", icon: BarChart3 },
];

const providerLinks: SidebarLink[] = [
  { label: "Dashboard", href: "/provider/dashboard", icon: LayoutDashboard },
  { label: "Modules", href: "/provider/modules", icon: Package },
  { label: "Reviews", href: "/provider/reviews", icon: Star },
  { label: "Analytics", href: "/provider/analytics", icon: BarChart3 },
];

const advisorLinks: SidebarLink[] = [
  { label: "Dashboard", href: "/advisor/dashboard", icon: LayoutDashboard },
  { label: "Learners", href: "/advisor/learners", icon: Users },
  { label: "Reviews", href: "/advisor/reviews", icon: ClipboardList },
  { label: "Messages", href: "/advisor/messages", icon: MessageSquare },
];

const adminLinks: SidebarLink[] = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Modules", href: "/admin/modules", icon: Package },
  { label: "Pathways", href: "/admin/pathways", icon: Route },
  { label: "Credentials", href: "/admin/credentials", icon: Award },
  { label: "Reports", href: "/admin/reports", icon: BarChart3 },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

function getLinksForRole(role: UserRole): SidebarLink[] {
  switch (role) {
    case "employer": return employerLinks;
    case "provider": return providerLinks;
    case "mentor":
    case "assessor": return advisorLinks;
    case "admin": return adminLinks;
    default: return learnerLinks;
  }
}

interface DashboardSidebarProps {
  role?: UserRole;
  userName?: string;
  userEmail?: string;
  userAvatar?: string | null;
}

export function DashboardSidebar({
  role = "learner",
  userName = "Demo User",
  userEmail = "demo@skillweave.co.za",
  userAvatar,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const links = getLinksForRole(role);

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={cn("flex items-center px-4 h-16 border-b border-slate-100 shrink-0", collapsed && "justify-center px-2")}>
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-sm shrink-0">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          {!collapsed && (
            <span className="text-sm font-bold font-display text-slate-900">
              SkillWeave
            </span>
          )}
        </Link>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
        {links.map((link) => {
          const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "sidebar-link",
                isActive && "active",
                collapsed && "justify-center px-2"
              )}
              title={collapsed ? link.label : undefined}
            >
              <link.icon className={cn("h-[18px] w-[18px] shrink-0", isActive ? "text-emerald-600" : "text-slate-400")} />
              {!collapsed && (
                <span className={cn(isActive ? "text-emerald-700" : "text-slate-600")}>
                  {link.label}
                </span>
              )}
              {!collapsed && link.badge && (
                <span className="ml-auto text-[10px] font-bold bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full">
                  {link.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className={cn("border-t border-slate-100 p-3", collapsed && "px-2")}>
        <Link
          href="/settings"
          className={cn(
            "flex items-center gap-3 px-2 py-2.5 rounded-lg hover:bg-slate-50 transition-colors",
            collapsed && "justify-center px-0"
          )}
        >
          <Avatar name={userName} src={userAvatar} size="sm" />
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-slate-900 truncate">{userName}</div>
              <div className="text-xs text-slate-400 truncate">{userEmail}</div>
            </div>
          )}
        </Link>
        {!collapsed && (
          <div className="mt-2 flex gap-1">
            <Link
              href="/settings"
              className="flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-md text-xs text-slate-500 hover:bg-slate-50 transition-colors"
            >
              <Settings className="h-3.5 w-3.5" />
              Settings
            </Link>
            <button className="flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-md text-xs text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors">
              <LogOut className="h-3.5 w-3.5" />
              Log out
            </button>
          </div>
        )}
      </div>

      {/* Collapse Toggle — Desktop */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="hidden lg:flex items-center justify-center h-10 border-t border-slate-100 text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"
      >
        {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </button>
    </div>
  );

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-slate-200 h-14 flex items-center px-4 gap-3">
        <button
          onClick={() => setMobileOpen(true)}
          className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <Menu className="h-5 w-5 text-slate-700" />
        </button>
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center">
            <Sparkles className="h-3.5 w-3.5 text-white" />
          </div>
          <span className="text-sm font-bold font-display text-slate-900">SkillWeave</span>
        </Link>
        <div className="ml-auto flex items-center gap-2">
          <button className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors relative">
            <Bell className="h-5 w-5 text-slate-500" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-emerald-500 rounded-full" />
          </button>
          <Avatar name={userName} src={userAvatar} size="sm" />
        </div>
      </div>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-black/30 z-40"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 w-[280px] bg-white z-50 shadow-xl"
            >
              <div className="absolute top-3 right-3">
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-slate-100"
                >
                  <X className="h-5 w-5 text-slate-500" />
                </button>
              </div>
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden lg:flex flex-col fixed left-0 top-0 bottom-0 bg-white border-r border-slate-200 z-30 transition-all duration-300",
          collapsed ? "w-[68px]" : "w-[260px]"
        )}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
