// ============================================
// SkillWeave SA — Database Service Layer
// CRUD operations for all major entities
// ============================================

import { createSupabaseBrowser } from "@/lib/supabase-browser";
import type {
  Module, Pathway, PathwayItem, Enrollment, Credential,
  Opportunity, OpportunityApplication, RPLRequest, PortfolioItem,
  Notification, RemediationAssignment, Profile, Organization,
} from "@/types";

const supabase = createSupabaseBrowser();

// ============================================
// PROFILES
// ============================================
export const profileService = {
  async getByUserId(userId: string) {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", userId)
      .single();
    return { data: data as Profile | null, error };
  },

  async update(userId: string, updates: Partial<Profile>) {
    const { data, error } = await supabase
      .from("profiles")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("user_id", userId)
      .select()
      .single();
    return { data: data as Profile | null, error };
  },

  async getPublicProfile(userId: string) {
    const { data, error } = await supabase
      .from("profiles")
      .select("full_name, avatar_url, bio, career_interests, skills_interests, linkedin_url, role")
      .eq("user_id", userId)
      .eq("portfolio_public", true)
      .single();
    return { data, error };
  },
};

// ============================================
// MODULES
// ============================================
export const moduleService = {
  async getAll(filters?: {
    search?: string;
    pricing?: string[];
    difficulty?: string[];
    mode?: string[];
    accredited?: boolean;
    hasRemediation?: boolean;
    limit?: number;
    offset?: number;
  }) {
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
    if (filters?.pricing?.length) {
      query = query.in("pricing_model", filters.pricing);
    }
    if (filters?.difficulty?.length) {
      query = query.in("difficulty", filters.difficulty);
    }
    if (filters?.mode?.length) {
      query = query.in("mode", filters.mode);
    }
    if (filters?.accredited !== undefined) {
      query = query.eq("is_accredited", filters.accredited);
    }
    if (filters?.hasRemediation !== undefined) {
      query = query.eq("has_remediation", filters.hasRemediation);
    }
    if (filters?.limit) {
      query = query.limit(filters.limit);
    }
    if (filters?.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 20) - 1);
    }

    const { data, error, count } = await query;
    return { data: (data || []) as Module[], error, count };
  },

  async getBySlug(slug: string) {
    const { data, error } = await supabase
      .from("modules")
      .select("*")
      .eq("slug", slug)
      .single();
    return { data: data as Module | null, error };
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from("modules")
      .select("*")
      .eq("id", id)
      .single();
    return { data: data as Module | null, error };
  },

  async getByIds(ids: string[]) {
    const { data, error } = await supabase
      .from("modules")
      .select("*")
      .in("id", ids);
    return { data: (data || []) as Module[], error };
  },

  async getReviews(moduleId: string) {
    const { data, error } = await supabase
      .from("module_reviews")
      .select("*")
      .eq("module_id", moduleId)
      .order("created_at", { ascending: false });
    return { data: data || [], error };
  },

  async createReview(moduleId: string, userId: string, userName: string, rating: number, comment: string) {
    const { data, error } = await supabase
      .from("module_reviews")
      .insert({ module_id: moduleId, user_id: userId, user_name: userName, rating, comment })
      .select()
      .single();
    return { data, error };
  },

  // Provider-facing
  async create(module: Partial<Module>) {
    const { data, error } = await supabase
      .from("modules")
      .insert(module)
      .select()
      .single();
    return { data: data as Module | null, error };
  },

  async update(id: string, updates: Partial<Module>) {
    const { data, error } = await supabase
      .from("modules")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();
    return { data: data as Module | null, error };
  },
};

// ============================================
// PATHWAYS
// ============================================
export const pathwayService = {
  async getByUser(userId: string) {
    const { data, error } = await supabase
      .from("pathways")
      .select("*")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false });
    return { data: (data || []) as Pathway[], error };
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from("pathways")
      .select("*")
      .eq("id", id)
      .single();
    return { data: data as Pathway | null, error };
  },

  async create(pathway: Partial<Pathway>) {
    const { data, error } = await supabase
      .from("pathways")
      .insert(pathway)
      .select()
      .single();
    return { data: data as Pathway | null, error };
  },

  async update(id: string, updates: Partial<Pathway>) {
    const { data, error } = await supabase
      .from("pathways")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();
    return { data: data as Pathway | null, error };
  },

  async delete(id: string) {
    const { error } = await supabase.from("pathways").delete().eq("id", id);
    return { error };
  },

  // Pathway items
  async getItems(pathwayId: string) {
    const { data, error } = await supabase
      .from("pathway_items")
      .select("*, modules(*)")
      .eq("pathway_id", pathwayId)
      .order("position", { ascending: true });
    return { data: (data || []) as (PathwayItem & { modules: Module })[], error };
  },

  async saveItems(pathwayId: string, items: Partial<PathwayItem>[]) {
    // Delete existing items
    await supabase.from("pathway_items").delete().eq("pathway_id", pathwayId);
    // Insert new items
    const toInsert = items.map((item, idx) => ({
      ...item,
      pathway_id: pathwayId,
      position: idx,
    }));
    const { data, error } = await supabase
      .from("pathway_items")
      .insert(toInsert)
      .select();
    return { data, error };
  },

  // Templates
  async getTemplates() {
    const { data, error } = await supabase
      .from("pathway_templates")
      .select("*")
      .eq("is_published", true);
    return { data: data || [], error };
  },
};

// ============================================
// ENROLLMENTS
// ============================================
export const enrollmentService = {
  async getByUser(userId: string) {
    const { data, error } = await supabase
      .from("enrollments")
      .select("*, modules(*)")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false });
    return { data: (data || []) as (Enrollment & { modules: Module })[], error };
  },

  async enroll(userId: string, moduleId: string) {
    const { data, error } = await supabase
      .from("enrollments")
      .upsert(
        { user_id: userId, module_id: moduleId, status: "enrolled", started_at: new Date().toISOString() },
        { onConflict: "user_id,module_id" }
      )
      .select()
      .single();

    // Increment enrollment count
    if (!error) {
      await supabase.rpc("increment_enrollment_count", { mod_id: moduleId });
    }

    return { data: data as Enrollment | null, error };
  },

  async updateProgress(userId: string, moduleId: string, progress: number, score?: number) {
    const updates: Record<string, unknown> = {
      progress_percent: progress,
      status: progress >= 100 ? "completed" : "in_progress",
      updated_at: new Date().toISOString(),
    };
    if (progress >= 100) {
      updates.completed_at = new Date().toISOString();
    }
    if (score !== undefined) {
      updates.score = score;
    }

    const { data, error } = await supabase
      .from("enrollments")
      .update(updates)
      .eq("user_id", userId)
      .eq("module_id", moduleId)
      .select()
      .single();
    return { data: data as Enrollment | null, error };
  },

  async getByModuleAndUser(userId: string, moduleId: string) {
    const { data, error } = await supabase
      .from("enrollments")
      .select("*")
      .eq("user_id", userId)
      .eq("module_id", moduleId)
      .single();
    return { data: data as Enrollment | null, error };
  },
};

// ============================================
// CREDENTIALS
// ============================================
export const credentialService = {
  async getByUser(userId: string) {
    const { data, error } = await supabase
      .from("credentials")
      .select("*")
      .eq("user_id", userId)
      .order("issued_at", { ascending: false });
    return { data: (data || []) as Credential[], error };
  },

  async getByHash(hash: string) {
    const { data, error } = await supabase
      .from("credentials")
      .select("*")
      .eq("credential_hash", hash)
      .single();
    return { data: data as Credential | null, error };
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from("credentials")
      .select("*")
      .eq("id", id)
      .single();
    return { data: data as Credential | null, error };
  },

  async issue(credential: Partial<Credential>) {
    const { data, error } = await supabase
      .from("credentials")
      .insert(credential)
      .select()
      .single();
    return { data: data as Credential | null, error };
  },
};

// ============================================
// OPPORTUNITIES
// ============================================
export const opportunityService = {
  async getAll(filters?: { type?: string; search?: string; limit?: number }) {
    let query = supabase
      .from("opportunities")
      .select("*", { count: "exact" })
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (filters?.type) {
      query = query.eq("type", filters.type);
    }
    if (filters?.search) {
      query = query.or(
        `title.ilike.%${filters.search}%,description.ilike.%${filters.search}%,organization_name.ilike.%${filters.search}%`
      );
    }
    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    const { data, error, count } = await query;
    return { data: (data || []) as Opportunity[], error, count };
  },

  async getBySlug(slug: string) {
    const { data, error } = await supabase
      .from("opportunities")
      .select("*")
      .eq("slug", slug)
      .single();
    return { data: data as Opportunity | null, error };
  },

  async getByOrganization(orgId: string) {
    const { data, error } = await supabase
      .from("opportunities")
      .select("*")
      .eq("organization_id", orgId)
      .order("created_at", { ascending: false });
    return { data: (data || []) as Opportunity[], error };
  },

  async create(opportunity: Partial<Opportunity>) {
    const { data, error } = await supabase
      .from("opportunities")
      .insert(opportunity)
      .select()
      .single();
    return { data: data as Opportunity | null, error };
  },

  async apply(opportunityId: string, userId: string, application: Partial<OpportunityApplication>) {
    const { data, error } = await supabase
      .from("opportunity_applications")
      .insert({ ...application, opportunity_id: opportunityId, user_id: userId })
      .select()
      .single();
    return { data, error };
  },

  async getApplicationsByUser(userId: string) {
    const { data, error } = await supabase
      .from("opportunity_applications")
      .select("*, opportunities(*)")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    return { data: data || [], error };
  },

  async getApplicationsByOpportunity(opportunityId: string) {
    const { data, error } = await supabase
      .from("opportunity_applications")
      .select("*, profiles!user_id(*)")
      .eq("opportunity_id", opportunityId)
      .order("created_at", { ascending: false });
    return { data: data || [], error };
  },
};

// ============================================
// RPL
// ============================================
export const rplService = {
  async getByUser(userId: string) {
    const { data, error } = await supabase
      .from("rpl_requests")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    return { data: (data || []) as RPLRequest[], error };
  },

  async create(request: Partial<RPLRequest>) {
    const { data, error } = await supabase
      .from("rpl_requests")
      .insert(request)
      .select()
      .single();
    return { data: data as RPLRequest | null, error };
  },

  async update(id: string, updates: Partial<RPLRequest>) {
    const { data, error } = await supabase
      .from("rpl_requests")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();
    return { data, error };
  },

  // Assessor-facing
  async getPending() {
    const { data, error } = await supabase
      .from("rpl_requests")
      .select("*, profiles!user_id(full_name, email)")
      .in("status", ["submitted", "under_review"])
      .order("created_at", { ascending: true });
    return { data: data || [], error };
  },
};

// ============================================
// PORTFOLIO
// ============================================
export const portfolioService = {
  async getByUser(userId: string) {
    const { data, error } = await supabase
      .from("portfolio_items")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    return { data: (data || []) as PortfolioItem[], error };
  },

  async create(item: Partial<PortfolioItem>) {
    const { data, error } = await supabase
      .from("portfolio_items")
      .insert(item)
      .select()
      .single();
    return { data: data as PortfolioItem | null, error };
  },

  async update(id: string, updates: Partial<PortfolioItem>) {
    const { data, error } = await supabase
      .from("portfolio_items")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();
    return { data, error };
  },

  async delete(id: string) {
    const { error } = await supabase.from("portfolio_items").delete().eq("id", id);
    return { error };
  },

  async getPublicItems(userId: string) {
    const { data, error } = await supabase
      .from("portfolio_items")
      .select("*")
      .eq("user_id", userId)
      .eq("is_public", true)
      .order("created_at", { ascending: false });
    return { data: (data || []) as PortfolioItem[], error };
  },
};

// ============================================
// NOTIFICATIONS
// ============================================
export const notificationService = {
  async getByUser(userId: string, limit = 20) {
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit);
    return { data: (data || []) as Notification[], error };
  },

  async markRead(id: string) {
    const { error } = await supabase
      .from("notifications")
      .update({ read: true })
      .eq("id", id);
    return { error };
  },

  async markAllRead(userId: string) {
    const { error } = await supabase
      .from("notifications")
      .update({ read: true })
      .eq("user_id", userId)
      .eq("read", false);
    return { error };
  },

  async getUnreadCount(userId: string) {
    const { count, error } = await supabase
      .from("notifications")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("read", false);
    return { count: count || 0, error };
  },
};

// ============================================
// REMEDIATION
// ============================================
export const remediationService = {
  async getByUser(userId: string) {
    const { data, error } = await supabase
      .from("remediation_assignments")
      .select("*, remediation_resources(*)")
      .eq("user_id", userId)
      .order("assigned_at", { ascending: false });
    return { data: (data || []) as RemediationAssignment[], error };
  },

  async getResourcesForModule(moduleId: string) {
    const { data, error } = await supabase
      .from("remediation_resources")
      .select("*")
      .eq("module_id", moduleId);
    return { data: data || [], error };
  },

  async assign(userId: string, moduleId: string, resourceId: string, trigger: string) {
    const { data, error } = await supabase
      .from("remediation_assignments")
      .insert({
        user_id: userId,
        module_id: moduleId,
        resource_id: resourceId,
        trigger,
        status: "recommended",
      })
      .select()
      .single();
    return { data, error };
  },

  async updateStatus(id: string, status: string, scoreAfter?: number) {
    const updates: Record<string, unknown> = { status, updated_at: new Date().toISOString() };
    if (status === "completed") {
      updates.completed_at = new Date().toISOString();
    }
    if (scoreAfter !== undefined) {
      updates.score_after = scoreAfter;
    }
    const { data, error } = await supabase
      .from("remediation_assignments")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    return { data, error };
  },
};

// ============================================
// AUDIT LOG
// ============================================
export const auditService = {
  async log(userId: string | null, action: string, entityType?: string, entityId?: string, details?: Record<string, unknown>) {
    const { error } = await supabase.from("audit_logs").insert({
      user_id: userId,
      action,
      entity_type: entityType,
      entity_id: entityId,
      details: details || {},
    });
    return { error };
  },
};

// ============================================
// ORGANIZATIONS
// ============================================
export const organizationService = {
  async getByOwner(userId: string) {
    const { data, error } = await supabase
      .from("organizations")
      .select("*")
      .eq("owner_id", userId)
      .single();
    return { data: data as Organization | null, error };
  },

  async getBySlug(slug: string) {
    const { data, error } = await supabase
      .from("organizations")
      .select("*")
      .eq("slug", slug)
      .single();
    return { data: data as Organization | null, error };
  },

  async create(org: Partial<Organization>) {
    const { data, error } = await supabase
      .from("organizations")
      .insert(org)
      .select()
      .single();
    return { data: data as Organization | null, error };
  },

  async update(id: string, updates: Partial<Organization>) {
    const { data, error } = await supabase
      .from("organizations")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();
    return { data, error };
  },
};
