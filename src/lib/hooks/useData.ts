"use client";

import { useEffect, useState, useCallback } from "react";
import { createSupabaseBrowser } from "@/lib/supabase-browser";
import { useAuth } from "@/lib/hooks/useAuth";
import type {
  Module, Pathway, PathwayItem, Enrollment, Credential,
  Opportunity, Organization, RPLRequest, PortfolioItem,
  Notification, RemediationAssignment, LearnerDashboardStats,
} from "@/types";

const supabase = createSupabaseBrowser();

// ============================================
// MODULES
// ============================================
export function useModules(filters?: {
  search?: string;
  pricing?: string[];
  difficulty?: string[];
  mode?: string[];
  accredited?: boolean | null;
  hasRemediation?: boolean | null;
  limit?: number;
}) {
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(0);

  const fetch = useCallback(async () => {
    setLoading(true);
    let query = supabase
      .from("modules")
      .select("*", { count: "exact" })
      .eq("is_published", true)
      .order("rating", { ascending: false });

    if (filters?.search) {
      query = query.or(
        `title.ilike.%${filters.search}%,description.ilike.%${filters.search}%,short_summary.ilike.%${filters.search}%`
      );
    }
    if (filters?.pricing?.length) query = query.in("pricing_model", filters.pricing);
    if (filters?.difficulty?.length) query = query.in("difficulty", filters.difficulty);
    if (filters?.mode?.length) query = query.in("mode", filters.mode);
    if (filters?.accredited === true) query = query.eq("is_accredited", true);
    if (filters?.hasRemediation === true) query = query.eq("has_remediation", true);
    if (filters?.limit) query = query.limit(filters.limit);

    const { data, error, count: c } = await query;
    if (!error && data) {
      setModules(data as Module[]);
      setCount(c || 0);
    }
    setLoading(false);
  }, [filters?.search, filters?.pricing?.join(","), filters?.difficulty?.join(","), filters?.mode?.join(","), filters?.accredited, filters?.hasRemediation, filters?.limit]);

  useEffect(() => { fetch(); }, [fetch]);

  return { modules, loading, count, refetch: fetch };
}

export function useModule(slug: string) {
  const [module, setModule] = useState<Module | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    supabase
      .from("modules")
      .select("*")
      .eq("slug", slug)
      .single()
      .then(({ data, error }) => {
        if (!error && data) setModule(data as Module);
        setLoading(false);
      });
  }, [slug]);

  return { module, loading };
}

export function useRelatedModules(moduleId: string, competencyTags: string[], limit = 4) {
  const [modules, setModules] = useState<Module[]>([]);

  useEffect(() => {
    if (!moduleId || !competencyTags.length) return;
    supabase
      .from("modules")
      .select("*")
      .eq("is_published", true)
      .neq("id", moduleId)
      .overlaps("competency_tags", competencyTags)
      .limit(limit)
      .then(({ data }) => {
        if (data) setModules(data as Module[]);
      });
  }, [moduleId]);

  return modules;
}

// ============================================
// OPPORTUNITIES
// ============================================
export function useOpportunities(filters?: { type?: string | null; search?: string }) {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    let query = supabase
      .from("opportunities")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (filters?.type) query = query.eq("type", filters.type);
    if (filters?.search) {
      query = query.or(
        `title.ilike.%${filters.search}%,description.ilike.%${filters.search}%,organization_name.ilike.%${filters.search}%`
      );
    }

    query.then(({ data, error }) => {
      if (!error && data) setOpportunities(data as Opportunity[]);
      setLoading(false);
    });
  }, [filters?.type, filters?.search]);

  return { opportunities, loading };
}

export function useOpportunity(slug: string) {
  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    supabase
      .from("opportunities")
      .select("*")
      .eq("slug", slug)
      .single()
      .then(({ data, error }) => {
        if (!error && data) setOpportunity(data as Opportunity);
        setLoading(false);
      });
  }, [slug]);

  return { opportunity, loading };
}

// ============================================
// ORGANIZATIONS / PROVIDERS
// ============================================
export function useOrganizations() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("organizations")
      .select("*")
      .eq("verified", true)
      .order("name")
      .then(({ data, error }) => {
        if (!error && data) setOrganizations(data as Organization[]);
        setLoading(false);
      });
  }, []);

  return { organizations, loading };
}

export function useOrganization(slug: string) {
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    supabase
      .from("organizations")
      .select("*")
      .eq("slug", slug)
      .single()
      .then(({ data, error }) => {
        if (!error && data) setOrganization(data as Organization);
        setLoading(false);
      });
  }, [slug]);

  return { organization, loading };
}

export function useOrgModules(providerName: string) {
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!providerName) return;
    supabase
      .from("modules")
      .select("*")
      .eq("provider_name", providerName)
      .eq("is_published", true)
      .order("rating", { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) setModules(data as Module[]);
        setLoading(false);
      });
  }, [providerName]);

  return { modules, loading };
}

// ============================================
// CREDENTIALS
// ============================================
export function useCredentials() {
  const { profile } = useAuth();
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile?.user_id) { setLoading(false); return; }
    supabase
      .from("credentials")
      .select("*")
      .eq("user_id", profile.user_id)
      .order("issued_at", { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) setCredentials(data as Credential[]);
        setLoading(false);
      });
  }, [profile?.user_id]);

  return { credentials, loading };
}

export function useCredentialById(id: string) {
  const [credential, setCredential] = useState<Credential | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    supabase
      .from("credentials")
      .select("*")
      .eq("id", id)
      .single()
      .then(({ data, error }) => {
        if (!error && data) setCredential(data as Credential);
        setLoading(false);
      });
  }, [id]);

  return { credential, loading };
}

// ============================================
// ENROLLMENTS
// ============================================
export function useEnrollments() {
  const { profile } = useAuth();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile?.user_id) { setLoading(false); return; }
    supabase
      .from("enrollments")
      .select("*, modules(*)")
      .eq("user_id", profile.user_id)
      .order("updated_at", { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) setEnrollments(data as Enrollment[]);
        setLoading(false);
      });
  }, [profile?.user_id]);

  return { enrollments, loading };
}

// ============================================
// PATHWAYS
// ============================================
export function usePathways() {
  const { profile } = useAuth();
  const [pathways, setPathways] = useState<Pathway[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile?.user_id) { setLoading(false); return; }
    supabase
      .from("pathways")
      .select("*")
      .eq("user_id", profile.user_id)
      .order("updated_at", { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) setPathways(data as Pathway[]);
        setLoading(false);
      });
  }, [profile?.user_id]);

  return { pathways, loading };
}

export function usePathwayTemplates() {
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("pathway_templates")
      .select("*")
      .eq("is_published", true)
      .then(({ data, error }) => {
        if (!error && data) setTemplates(data);
        setLoading(false);
      });
  }, []);

  return { templates, loading };
}

// ============================================
// RPL
// ============================================
export function useRPLRequests() {
  const { profile } = useAuth();
  const [requests, setRequests] = useState<RPLRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile?.user_id) { setLoading(false); return; }
    supabase
      .from("rpl_requests")
      .select("*")
      .eq("user_id", profile.user_id)
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) setRequests(data as RPLRequest[]);
        setLoading(false);
      });
  }, [profile?.user_id]);

  return { requests, loading };
}

// ============================================
// PORTFOLIO
// ============================================
export function usePortfolio() {
  const { profile } = useAuth();
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile?.user_id) { setLoading(false); return; }
    supabase
      .from("portfolio_items")
      .select("*")
      .eq("user_id", profile.user_id)
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) setItems(data as PortfolioItem[]);
        setLoading(false);
      });
  }, [profile?.user_id]);

  return { items, loading };
}

// ============================================
// NOTIFICATIONS
// ============================================
export function useNotifications() {
  const { profile } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!profile?.user_id) return;
    supabase
      .from("notifications")
      .select("*")
      .eq("user_id", profile.user_id)
      .order("created_at", { ascending: false })
      .limit(20)
      .then(({ data }) => {
        if (data) {
          setNotifications(data as Notification[]);
          setUnreadCount(data.filter((n: any) => !n.read).length);
        }
      });
  }, [profile?.user_id]);

  const markRead = async (id: string) => {
    await supabase.from("notifications").update({ read: true }).eq("id", id);
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  return { notifications, unreadCount, markRead };
}

// ============================================
// DASHBOARD STATS
// ============================================
export function useLearnerStats() {
  const { profile } = useAuth();
  const [stats, setStats] = useState({
    credits_earned: 0,
    credits_target: 120,
    modules_completed: 0,
    modules_in_progress: 0,
    credentials_count: 0,
    pathways_count: 0,
    remediations_active: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile?.user_id) { setLoading(false); return; }

    Promise.all([
      supabase.from("enrollments").select("status, modules(credits)").eq("user_id", profile.user_id),
      supabase.from("credentials").select("id").eq("user_id", profile.user_id),
      supabase.from("pathways").select("id, total_credits").eq("user_id", profile.user_id).in("status", ["draft", "active"]),
      supabase.from("remediation_assignments").select("id").eq("user_id", profile.user_id).in("status", ["recommended", "enrolled", "in_progress"]),
    ]).then(([enrollRes, credRes, pathRes, remRes]) => {
      const enrollments = enrollRes.data || [];
      const completed = enrollments.filter((e: any) => e.status === "completed");
      const inProgress = enrollments.filter((e: any) => e.status === "in_progress");
      const creditsEarned = completed.reduce((sum: number, e: any) => sum + (e.modules?.credits || 0), 0);
      const targetCredits = (pathRes.data || [])[0]?.total_credits || 120;

      setStats({
        credits_earned: creditsEarned,
        credits_target: targetCredits,
        modules_completed: completed.length,
        modules_in_progress: inProgress.length,
        credentials_count: (credRes.data || []).length,
        pathways_count: (pathRes.data || []).length,
        remediations_active: (remRes.data || []).length,
      });
      setLoading(false);
    });
  }, [profile?.user_id]);

  return { stats, loading };
}

// ============================================
// ADMIN STATS
// ============================================
export function useAdminStats() {
  const [stats, setStats] = useState({
    total_users: 0,
    total_modules: 0,
    total_pathways: 0,
    total_credentials: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      supabase.from("profiles").select("*", { count: "exact", head: true }),
      supabase.from("modules").select("*", { count: "exact", head: true }).eq("is_published", true),
      supabase.from("pathways").select("*", { count: "exact", head: true }),
      supabase.from("credentials").select("*", { count: "exact", head: true }),
    ]).then(([users, modules, pathways, credentials]) => {
      setStats({
        total_users: users.count || 0,
        total_modules: modules.count || 0,
        total_pathways: pathways.count || 0,
        total_credentials: credentials.count || 0,
      });
      setLoading(false);
    });
  }, []);

  return { stats, loading };
}
