// ============================================
// SkillWeave SA — Core Type Definitions
// ============================================

// --- Base Types ---
export type UUID = string;
export type Timestamp = string;
export type Currency = number; // stored in cents (ZAR)

export interface BaseEntity {
  id: UUID;
  created_at: Timestamp;
  updated_at: Timestamp;
}

// --- Enums ---
export type UserRole =
  | "learner"
  | "employer"
  | "provider"
  | "mentor"
  | "assessor"
  | "sponsor"
  | "admin";

export type NQFLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10";

export type ModuleMode =
  | "synchronous"
  | "asynchronous"
  | "blended"
  | "in-person"
  | "online";

export type ContentType =
  | "video"
  | "reading"
  | "assessment"
  | "simulation"
  | "project"
  | "live_session"
  | "podcast"
  | "lab"
  | "case_study"
  | "ai_tutoring"
  | "workshop";

export type PricingModel =
  | "free"
  | "paid_once"
  | "subscription"
  | "sponsored"
  | "employer_funded"
  | "bursary_funded";

export type Difficulty = "beginner" | "intermediate" | "advanced" | "expert";

export type PathwayStatus =
  | "draft"
  | "active"
  | "completed"
  | "paused"
  | "archived";

export type PathwayItemType =
  | "core"
  | "elective"
  | "specialization"
  | "capstone"
  | "milestone";

export type ValidationStatus = "valid" | "warning" | "invalid";

export type EnrollmentStatus =
  | "enrolled"
  | "in_progress"
  | "completed"
  | "failed"
  | "withdrawn";

export type OpportunityType =
  | "project"
  | "internship"
  | "assignment"
  | "simulation"
  | "mentorship"
  | "challenge";

export type OpportunityCompensation =
  | "paid"
  | "unpaid"
  | "stipend"
  | "sponsored"
  | "credit_bearing";

export type ApplicationStatus =
  | "pending"
  | "accepted"
  | "rejected"
  | "withdrawn"
  | "completed";

export type RPLStatus =
  | "submitted"
  | "under_review"
  | "approved"
  | "rejected"
  | "more_info_needed";

export type CredentialType =
  | "badge"
  | "certificate"
  | "milestone"
  | "qualification"
  | "endorsement";

export type RemediationTrigger =
  | "low_quiz_score"
  | "repeated_failure"
  | "inactivity"
  | "slow_progress"
  | "low_confidence"
  | "prerequisite_gap";

export type RemediationStatus =
  | "recommended"
  | "enrolled"
  | "in_progress"
  | "completed"
  | "skipped";

export type Province =
  | "Eastern Cape"
  | "Free State"
  | "Gauteng"
  | "KwaZulu-Natal"
  | "Limpopo"
  | "Mpumalanga"
  | "Northern Cape"
  | "North West"
  | "Western Cape";

// --- User & Profile ---
export interface User extends BaseEntity {
  email: string;
  role: UserRole;
  is_active: boolean;
  email_verified: boolean;
}

export interface Profile extends BaseEntity {
  user_id: UUID;
  full_name: string;
  email: string;
  mobile_number?: string;
  avatar_url?: string;
  province?: Province;
  country: string;
  role: UserRole;
  career_interests: string[];
  skills_interests: string[];
  target_jobs: string[];
  budget_preference?: "free_only" | "low" | "medium" | "high" | "flexible";
  preferred_learning_mode?: ModuleMode;
  accessibility_preferences?: string[];
  prior_learning_summary?: string;
  onboarding_completed: boolean;
  bio?: string;
  linkedin_url?: string;
  portfolio_public: boolean;
}

// --- Organization ---
export interface Organization extends BaseEntity {
  name: string;
  slug: string;
  description: string;
  logo_url?: string;
  website?: string;
  industry: string;
  type: "employer" | "provider" | "sponsor" | "ngo";
  verified: boolean;
  province?: Province;
  country: string;
  contact_email: string;
  owner_id: UUID;
}

// --- Module ---
export interface Module extends BaseEntity {
  title: string;
  slug: string;
  description: string;
  short_summary: string;
  provider_id: UUID;
  provider_name?: string;
  is_accredited: boolean;
  nqf_level?: NQFLevel;
  saqa_id?: string;
  credits: number;
  cost_cents: Currency;
  pricing_model: PricingModel;
  mode: ModuleMode;
  content_type: ContentType;
  duration_hours: number;
  difficulty: Difficulty;
  outcomes: string[];
  competency_tags: string[];
  industry_tags: string[];
  job_role_tags: string[];
  language: string;
  rating: number;
  review_count: number;
  employer_endorsed: boolean;
  has_remediation: boolean;
  thumbnail_url?: string;
  cover_image_url?: string;
  is_published: boolean;
  enrollment_count: number;
}

export interface ModulePrerequisite {
  module_id: UUID;
  prerequisite_module_id: UUID;
}

export interface ModuleReview extends BaseEntity {
  module_id: UUID;
  user_id: UUID;
  user_name: string;
  rating: number;
  comment: string;
}

// --- Pathway ---
export interface Pathway extends BaseEntity {
  user_id: UUID;
  title: string;
  description?: string;
  status: PathwayStatus;
  template_id?: UUID;
  total_credits: number;
  earned_credits: number;
  target_qualification?: string;
  nqf_target_level?: NQFLevel;
  estimated_cost_cents: Currency;
  estimated_duration_months: number;
}

export interface PathwayItem extends BaseEntity {
  pathway_id: UUID;
  module_id: UUID;
  module?: Module;
  item_type: PathwayItemType;
  position: number;
  semester?: number;
  is_completed: boolean;
  is_locked: boolean;
  lock_reason?: string;
}

export interface PathwayTemplate extends BaseEntity {
  title: string;
  description: string;
  target_job_roles: string[];
  industry: string;
  nqf_level: NQFLevel;
  total_credits_required: number;
  min_core_credits: number;
  max_elective_credits: number;
  requires_capstone: boolean;
  items: PathwayTemplateItem[];
}

export interface PathwayTemplateItem {
  module_id: UUID;
  item_type: PathwayItemType;
  is_required: boolean;
  position: number;
}

// --- Qualification Rules ---
export interface QualificationRule extends BaseEntity {
  pathway_template_id?: UUID;
  rule_type:
    | "min_total_credits"
    | "min_core_credits"
    | "max_elective_credits"
    | "prerequisite"
    | "capstone_required"
    | "specialization_min"
    | "nqf_progression"
    | "breadth_requirement";
  rule_config: Record<string, unknown>;
  description: string;
  severity: "error" | "warning" | "info";
}

// --- Validation Result ---
export interface PathwayValidation {
  is_valid: boolean;
  status: ValidationStatus;
  total_credits: number;
  required_credits: number;
  core_credits: number;
  elective_credits: number;
  issues: ValidationIssue[];
  suggestions: string[];
  missing_requirements: string[];
  blocked_modules: { module_id: UUID; reason: string }[];
  affordability: {
    total_cost_cents: Currency;
    free_alternatives: number;
    funding_available: boolean;
  };
}

export interface ValidationIssue {
  type: "error" | "warning" | "info";
  message: string;
  module_id?: UUID;
  rule_id?: UUID;
}

// --- Milestone ---
export interface Milestone extends BaseEntity {
  title: string;
  description: string;
  pathway_template_id?: UUID;
  credits_required: number;
  requirements: MilestoneRequirement[];
  badge_image_url?: string;
  credential_type: CredentialType;
}

export interface MilestoneRequirement {
  milestone_id: UUID;
  type: "module_completion" | "credit_threshold" | "competency" | "assessment";
  config: Record<string, unknown>;
}

// --- Enrollment & Progress ---
export interface Enrollment extends BaseEntity {
  user_id: UUID;
  module_id: UUID;
  module?: Module;
  status: EnrollmentStatus;
  progress_percent: number;
  started_at?: Timestamp;
  completed_at?: Timestamp;
  score?: number;
  attempts: number;
}

export interface Assessment extends BaseEntity {
  module_id: UUID;
  title: string;
  type: "quiz" | "assignment" | "project" | "exam" | "practical";
  max_score: number;
  pass_score: number;
  time_limit_minutes?: number;
}

export interface AssessmentAttempt extends BaseEntity {
  assessment_id: UUID;
  user_id: UUID;
  score: number;
  passed: boolean;
  time_taken_seconds: number;
  feedback?: string;
}

// --- Remediation ---
export interface RemediationResource extends BaseEntity {
  module_id: UUID;
  title: string;
  description: string;
  content_type: ContentType;
  content_url?: string;
  duration_minutes: number;
  difficulty: Difficulty;
  targets_trigger: RemediationTrigger;
}

export interface RemediationAssignment extends BaseEntity {
  user_id: UUID;
  module_id: UUID;
  resource_id: UUID;
  resource?: RemediationResource;
  trigger: RemediationTrigger;
  status: RemediationStatus;
  score_before?: number;
  score_after?: number;
  assigned_at: Timestamp;
  completed_at?: Timestamp;
}

// --- Credentials ---
export interface Credential extends BaseEntity {
  user_id: UUID;
  type: CredentialType;
  title: string;
  description: string;
  issuer: string;
  issued_at: Timestamp;
  expires_at?: Timestamp;
  credential_hash: string;
  metadata: Record<string, unknown>;
  is_verified: boolean;
  public_url?: string;
  badge_image_url?: string;
  qr_code_url?: string;
  module_id?: UUID;
  milestone_id?: UUID;
  pathway_id?: UUID;
}

// --- Experiential ---
export interface Opportunity extends BaseEntity {
  organization_id: UUID;
  organization_name?: string;
  title: string;
  slug: string;
  description: string;
  type: OpportunityType;
  compensation: OpportunityCompensation;
  stipend_amount_cents?: Currency;
  skill_requirements: string[];
  eligible_modules: UUID[];
  eligible_nqf_levels: NQFLevel[];
  due_date?: Timestamp;
  team_size: number;
  mode: ModuleMode;
  evaluation_criteria: string[];
  industry: string;
  location?: string;
  is_active: boolean;
  application_count: number;
  credits_awarded?: number;
}

export interface OpportunityApplication extends BaseEntity {
  opportunity_id: UUID;
  user_id: UUID;
  status: ApplicationStatus;
  cover_letter?: string;
  resume_url?: string;
  portfolio_url?: string;
}

export interface OpportunitySubmission extends BaseEntity {
  application_id: UUID;
  user_id: UUID;
  title: string;
  description: string;
  files: { name: string; url: string }[];
  links: string[];
  submitted_at: Timestamp;
}

export interface EmployerEvaluation extends BaseEntity {
  submission_id: UUID;
  evaluator_id: UUID;
  score: number;
  feedback: string;
  competencies_demonstrated: string[];
  endorsed: boolean;
}

// --- Portfolio ---
export interface PortfolioItem extends BaseEntity {
  user_id: UUID;
  title: string;
  description: string;
  type:
    | "project"
    | "certificate"
    | "endorsement"
    | "evidence"
    | "reflection"
    | "work_sample";
  url?: string;
  file_url?: string;
  tags: string[];
  is_public: boolean;
}

// --- RPL ---
export interface RPLRequest extends BaseEntity {
  user_id: UUID;
  module_id: UUID;
  module_title?: string;
  status: RPLStatus;
  evidence_summary: string;
  evidence_files: { name: string; url: string }[];
  competencies_claimed: string[];
  assessor_id?: UUID;
  assessor_notes?: string;
  credits_awarded?: number;
}

// --- Notifications ---
export interface Notification extends BaseEntity {
  user_id: UUID;
  title: string;
  message: string;
  type:
    | "info"
    | "success"
    | "warning"
    | "error"
    | "milestone"
    | "remediation"
    | "opportunity";
  read: boolean;
  action_url?: string;
}

// --- Transactions ---
export interface Transaction extends BaseEntity {
  user_id: UUID;
  module_id?: UUID;
  amount_cents: Currency;
  currency: string;
  type: "payment" | "refund" | "sponsorship" | "bursary" | "voucher";
  status: "pending" | "completed" | "failed" | "refunded";
  stripe_payment_id?: string;
  description: string;
}

// --- AI Service Interfaces ---
export interface AIRecommendation {
  type: "pathway" | "module" | "job" | "remediation" | "affordability";
  title: string;
  description: string;
  confidence: number;
  items: { id: UUID; title: string; reason: string }[];
}

export interface SkillGapAnalysis {
  target_role: string;
  current_skills: string[];
  missing_skills: string[];
  recommended_modules: { module_id: UUID; title: string; priority: number }[];
  gap_percentage: number;
}

// --- Dashboard Stats ---
export interface LearnerDashboardStats {
  active_pathways: number;
  total_credits_earned: number;
  target_credits: number;
  modules_completed: number;
  modules_in_progress: number;
  milestones_earned: number;
  credentials_count: number;
  remediation_active: number;
  opportunities_available: number;
  next_recommended_modules: Module[];
  recent_achievements: Credential[];
  affordability_summary: {
    total_spent_cents: Currency;
    remaining_cost_cents: Currency;
    free_alternatives: number;
  };
}

export interface EmployerDashboardStats {
  active_opportunities: number;
  total_applications: number;
  pending_reviews: number;
  completed_evaluations: number;
}

export interface ProviderDashboardStats {
  published_modules: number;
  total_enrollments: number;
  average_rating: number;
  completion_rate: number;
  revenue_cents: Currency;
}

export interface AdminDashboardStats {
  total_users: number;
  total_modules: number;
  total_pathways: number;
  total_credentials: number;
  active_learners: number;
  user_growth: { month: string; count: number }[];
  module_categories: { category: string; count: number }[];
  top_modules: { title: string; enrollments: number }[];
}
