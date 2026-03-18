-- ============================================
-- SkillWeave SA — Database Schema
-- Supabase / PostgreSQL
-- ============================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- ENUMS
-- ============================================
CREATE TYPE user_role AS ENUM ('learner','employer','provider','mentor','assessor','sponsor','admin');
CREATE TYPE nqf_level AS ENUM ('1','2','3','4','5','6','7','8','9','10');
CREATE TYPE module_mode AS ENUM ('synchronous','asynchronous','blended','in-person','online');
CREATE TYPE content_type AS ENUM ('video','reading','assessment','simulation','project','live_session','podcast','lab','case_study','ai_tutoring','workshop');
CREATE TYPE pricing_model AS ENUM ('free','paid_once','subscription','sponsored','employer_funded','bursary_funded');
CREATE TYPE difficulty AS ENUM ('beginner','intermediate','advanced','expert');
CREATE TYPE pathway_status AS ENUM ('draft','active','completed','paused','archived');
CREATE TYPE pathway_item_type AS ENUM ('core','elective','specialization','capstone','milestone');
CREATE TYPE enrollment_status AS ENUM ('enrolled','in_progress','completed','failed','withdrawn');
CREATE TYPE opportunity_type AS ENUM ('project','internship','assignment','simulation','mentorship','challenge');
CREATE TYPE opportunity_compensation AS ENUM ('paid','unpaid','stipend','sponsored','credit_bearing');
CREATE TYPE application_status AS ENUM ('pending','accepted','rejected','withdrawn','completed');
CREATE TYPE rpl_status AS ENUM ('submitted','under_review','approved','rejected','more_info_needed');
CREATE TYPE credential_type AS ENUM ('badge','certificate','milestone','qualification','endorsement');
CREATE TYPE remediation_trigger AS ENUM ('low_quiz_score','repeated_failure','inactivity','slow_progress','low_confidence','prerequisite_gap');
CREATE TYPE remediation_status AS ENUM ('recommended','enrolled','in_progress','completed','skipped');
CREATE TYPE transaction_type AS ENUM ('payment','refund','sponsorship','bursary','voucher');
CREATE TYPE transaction_status AS ENUM ('pending','completed','failed','refunded');

-- ============================================
-- PROFILES (extends Supabase auth.users)
-- ============================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL,
  mobile_number TEXT,
  avatar_url TEXT,
  province TEXT,
  country TEXT DEFAULT 'South Africa',
  role user_role NOT NULL DEFAULT 'learner',
  career_interests TEXT[] DEFAULT '{}',
  skills_interests TEXT[] DEFAULT '{}',
  target_jobs TEXT[] DEFAULT '{}',
  budget_preference TEXT DEFAULT 'flexible',
  preferred_learning_mode module_mode DEFAULT 'online',
  accessibility_preferences TEXT[] DEFAULT '{}',
  prior_learning_summary TEXT,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  bio TEXT,
  linkedin_url TEXT,
  portfolio_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_profiles_user_id ON profiles(user_id);
CREATE INDEX idx_profiles_role ON profiles(role);

-- ============================================
-- ORGANIZATIONS
-- ============================================
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT DEFAULT '',
  logo_url TEXT,
  website TEXT,
  industry TEXT NOT NULL DEFAULT 'General',
  type TEXT NOT NULL DEFAULT 'employer',
  verified BOOLEAN DEFAULT FALSE,
  province TEXT,
  country TEXT DEFAULT 'South Africa',
  contact_email TEXT NOT NULL,
  owner_id UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_organizations_slug ON organizations(slug);

-- ============================================
-- MODULES
-- ============================================
CREATE TABLE modules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  short_summary TEXT DEFAULT '',
  provider_id UUID REFERENCES organizations(id),
  provider_name TEXT DEFAULT '',
  is_accredited BOOLEAN DEFAULT FALSE,
  nqf_level TEXT DEFAULT '5',
  saqa_id TEXT,
  credits INTEGER NOT NULL DEFAULT 10,
  cost_cents INTEGER DEFAULT 0,
  pricing_model pricing_model DEFAULT 'free',
  mode module_mode DEFAULT 'online',
  content_type content_type DEFAULT 'video',
  duration_hours NUMERIC(6,1) DEFAULT 10,
  difficulty difficulty DEFAULT 'beginner',
  outcomes TEXT[] DEFAULT '{}',
  competency_tags TEXT[] DEFAULT '{}',
  industry_tags TEXT[] DEFAULT '{}',
  job_role_tags TEXT[] DEFAULT '{}',
  language TEXT DEFAULT 'English',
  rating NUMERIC(3,2) DEFAULT 0.00,
  review_count INTEGER DEFAULT 0,
  employer_endorsed BOOLEAN DEFAULT FALSE,
  has_remediation BOOLEAN DEFAULT FALSE,
  thumbnail_url TEXT,
  cover_image_url TEXT,
  is_published BOOLEAN DEFAULT TRUE,
  enrollment_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_modules_slug ON modules(slug);
CREATE INDEX idx_modules_provider ON modules(provider_id);
CREATE INDEX idx_modules_difficulty ON modules(difficulty);
CREATE INDEX idx_modules_pricing ON modules(pricing_model);
CREATE INDEX idx_modules_published ON modules(is_published);

-- ============================================
-- MODULE PREREQUISITES
-- ============================================
CREATE TABLE module_prerequisites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  module_id UUID NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
  prerequisite_module_id UUID NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- MODULE REVIEWS
-- ============================================
CREATE TABLE module_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  module_id UUID NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  user_name TEXT DEFAULT '',
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PATHWAY TEMPLATES
-- ============================================
CREATE TABLE pathway_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  target_job_roles TEXT[] DEFAULT '{}',
  industry TEXT DEFAULT '',
  nqf_level TEXT DEFAULT '5',
  total_credits_required INTEGER DEFAULT 120,
  min_core_credits INTEGER DEFAULT 80,
  max_elective_credits INTEGER DEFAULT 40,
  requires_capstone BOOLEAN DEFAULT TRUE,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE pathway_template_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  template_id UUID NOT NULL REFERENCES pathway_templates(id) ON DELETE CASCADE,
  module_id UUID NOT NULL REFERENCES modules(id),
  item_type pathway_item_type DEFAULT 'core',
  is_required BOOLEAN DEFAULT FALSE,
  position INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PATHWAYS (User-built)
-- ============================================
CREATE TABLE pathways (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  status pathway_status DEFAULT 'draft',
  template_id UUID REFERENCES pathway_templates(id),
  total_credits INTEGER DEFAULT 0,
  earned_credits INTEGER DEFAULT 0,
  target_qualification TEXT,
  nqf_target_level TEXT,
  estimated_cost_cents INTEGER DEFAULT 0,
  estimated_duration_months INTEGER DEFAULT 12,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_pathways_user ON pathways(user_id);

CREATE TABLE pathway_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pathway_id UUID NOT NULL REFERENCES pathways(id) ON DELETE CASCADE,
  module_id UUID NOT NULL REFERENCES modules(id),
  item_type pathway_item_type DEFAULT 'core',
  position INTEGER DEFAULT 0,
  semester INTEGER DEFAULT 1,
  is_completed BOOLEAN DEFAULT FALSE,
  is_locked BOOLEAN DEFAULT FALSE,
  lock_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_pathway_items_pathway ON pathway_items(pathway_id);

-- ============================================
-- QUALIFICATION RULES
-- ============================================
CREATE TABLE qualification_rules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pathway_template_id UUID REFERENCES pathway_templates(id),
  rule_type TEXT NOT NULL,
  rule_config JSONB DEFAULT '{}',
  description TEXT DEFAULT '',
  severity TEXT DEFAULT 'error',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- MILESTONES
-- ============================================
CREATE TABLE milestones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  pathway_template_id UUID REFERENCES pathway_templates(id),
  credits_required INTEGER DEFAULT 30,
  badge_image_url TEXT,
  credential_type credential_type DEFAULT 'milestone',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE milestone_requirements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  milestone_id UUID NOT NULL REFERENCES milestones(id) ON DELETE CASCADE,
  type TEXT NOT NULL DEFAULT 'credit_threshold',
  config JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ENROLLMENTS & PROGRESS
-- ============================================
CREATE TABLE enrollments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  module_id UUID NOT NULL REFERENCES modules(id),
  status enrollment_status DEFAULT 'enrolled',
  progress_percent INTEGER DEFAULT 0,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  score NUMERIC(5,2),
  attempts INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_enrollments_user ON enrollments(user_id);
CREATE UNIQUE INDEX idx_enrollments_user_module ON enrollments(user_id, module_id);

-- ============================================
-- ASSESSMENTS
-- ============================================
CREATE TABLE assessments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  module_id UUID NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  type TEXT DEFAULT 'quiz',
  max_score INTEGER DEFAULT 100,
  pass_score INTEGER DEFAULT 50,
  time_limit_minutes INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE assessment_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  assessment_id UUID NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  score INTEGER NOT NULL DEFAULT 0,
  passed BOOLEAN DEFAULT FALSE,
  time_taken_seconds INTEGER DEFAULT 0,
  feedback TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- REMEDIATION
-- ============================================
CREATE TABLE remediation_resources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  module_id UUID NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  content_type content_type DEFAULT 'video',
  content_url TEXT,
  duration_minutes INTEGER DEFAULT 15,
  difficulty difficulty DEFAULT 'beginner',
  targets_trigger remediation_trigger DEFAULT 'low_quiz_score',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE remediation_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  module_id UUID NOT NULL REFERENCES modules(id),
  resource_id UUID NOT NULL REFERENCES remediation_resources(id),
  trigger remediation_trigger DEFAULT 'low_quiz_score',
  status remediation_status DEFAULT 'recommended',
  score_before NUMERIC(5,2),
  score_after NUMERIC(5,2),
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_remediation_assignments_user ON remediation_assignments(user_id);

-- ============================================
-- CREDENTIALS
-- ============================================
CREATE TABLE credentials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type credential_type DEFAULT 'badge',
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  issuer TEXT DEFAULT 'SkillWeave SA',
  issued_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  credential_hash TEXT NOT NULL DEFAULT '',
  metadata JSONB DEFAULT '{}',
  is_verified BOOLEAN DEFAULT TRUE,
  public_url TEXT,
  badge_image_url TEXT,
  qr_code_url TEXT,
  module_id UUID REFERENCES modules(id),
  milestone_id UUID REFERENCES milestones(id),
  pathway_id UUID REFERENCES pathways(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_credentials_user ON credentials(user_id);
CREATE INDEX idx_credentials_hash ON credentials(credential_hash);

-- ============================================
-- EXPERIENTIAL OPPORTUNITIES
-- ============================================
CREATE TABLE opportunities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  organization_name TEXT DEFAULT '',
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  type opportunity_type DEFAULT 'project',
  compensation opportunity_compensation DEFAULT 'unpaid',
  stipend_amount_cents INTEGER DEFAULT 0,
  skill_requirements TEXT[] DEFAULT '{}',
  eligible_modules UUID[] DEFAULT '{}',
  eligible_nqf_levels TEXT[] DEFAULT '{}',
  due_date TIMESTAMPTZ,
  team_size INTEGER DEFAULT 1,
  mode module_mode DEFAULT 'online',
  evaluation_criteria TEXT[] DEFAULT '{}',
  industry TEXT DEFAULT '',
  location TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  application_count INTEGER DEFAULT 0,
  credits_awarded INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_opportunities_org ON opportunities(organization_id);
CREATE INDEX idx_opportunities_slug ON opportunities(slug);

CREATE TABLE opportunity_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  opportunity_id UUID NOT NULL REFERENCES opportunities(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  status application_status DEFAULT 'pending',
  cover_letter TEXT,
  resume_url TEXT,
  portfolio_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE opportunity_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id UUID NOT NULL REFERENCES opportunity_applications(id),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  files JSONB DEFAULT '[]',
  links TEXT[] DEFAULT '{}',
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE employer_evaluations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  submission_id UUID NOT NULL REFERENCES opportunity_submissions(id),
  evaluator_id UUID NOT NULL REFERENCES auth.users(id),
  score INTEGER DEFAULT 0,
  feedback TEXT DEFAULT '',
  competencies_demonstrated TEXT[] DEFAULT '{}',
  endorsed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PORTFOLIO
-- ============================================
CREATE TABLE portfolio_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  type TEXT DEFAULT 'project',
  url TEXT,
  file_url TEXT,
  tags TEXT[] DEFAULT '{}',
  is_public BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_portfolio_user ON portfolio_items(user_id);

-- ============================================
-- RPL
-- ============================================
CREATE TABLE rpl_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  module_id UUID NOT NULL REFERENCES modules(id),
  module_title TEXT DEFAULT '',
  status rpl_status DEFAULT 'submitted',
  evidence_summary TEXT DEFAULT '',
  evidence_files JSONB DEFAULT '[]',
  competencies_claimed TEXT[] DEFAULT '{}',
  assessor_id UUID REFERENCES auth.users(id),
  assessor_notes TEXT,
  credits_awarded INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_rpl_user ON rpl_requests(user_id);

-- ============================================
-- MESSAGES
-- ============================================
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id UUID NOT NULL REFERENCES auth.users(id),
  recipient_id UUID NOT NULL REFERENCES auth.users(id),
  subject TEXT DEFAULT '',
  body TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- NOTIFICATIONS
-- ============================================
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL DEFAULT '',
  type TEXT DEFAULT 'info',
  read BOOLEAN DEFAULT FALSE,
  action_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id);

-- ============================================
-- TRANSACTIONS
-- ============================================
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  module_id UUID REFERENCES modules(id),
  amount_cents INTEGER NOT NULL DEFAULT 0,
  currency TEXT DEFAULT 'ZAR',
  type transaction_type DEFAULT 'payment',
  status transaction_status DEFAULT 'pending',
  stripe_payment_id TEXT,
  description TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- AUDIT LOGS
-- ============================================
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id UUID,
  details JSONB DEFAULT '{}',
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);

-- ============================================
-- ADVISOR REVIEWS
-- ============================================
CREATE TABLE advisor_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  advisor_id UUID NOT NULL REFERENCES auth.users(id),
  learner_id UUID NOT NULL REFERENCES auth.users(id),
  pathway_id UUID REFERENCES pathways(id),
  notes TEXT DEFAULT '',
  approved BOOLEAN,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE pathways ENABLE ROW LEVEL SECURITY;
ALTER TABLE pathway_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE credentials ENABLE ROW LEVEL SECURITY;
ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE rpl_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Profile policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Profiles visible to authenticated" ON profiles FOR SELECT USING (auth.role() = 'authenticated');

-- Module policies - public read
CREATE POLICY "Modules are publicly viewable" ON modules FOR SELECT USING (is_published = true);
CREATE POLICY "Providers can manage own modules" ON modules FOR ALL USING (
  provider_id IN (SELECT id FROM organizations WHERE owner_id = auth.uid())
);

-- Pathway policies
CREATE POLICY "Users can view own pathways" ON pathways FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own pathways" ON pathways FOR ALL USING (auth.uid() = user_id);

-- Enrollment policies
CREATE POLICY "Users can view own enrollments" ON enrollments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own enrollments" ON enrollments FOR ALL USING (auth.uid() = user_id);

-- Credential policies
CREATE POLICY "Users can view own credentials" ON credentials FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Public credentials are viewable" ON credentials FOR SELECT USING (public_url IS NOT NULL);

-- Notification policies
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);

-- Opportunities are publicly viewable
CREATE POLICY "Opportunities are publicly viewable" ON opportunities FOR SELECT USING (is_active = true);

-- Portfolio policies
CREATE POLICY "Public portfolios viewable" ON portfolio_items FOR SELECT USING (is_public = true);
CREATE POLICY "Users manage own portfolio" ON portfolio_items FOR ALL USING (auth.uid() = user_id);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_modules_updated_at BEFORE UPDATE ON modules FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_pathways_updated_at BEFORE UPDATE ON pathways FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_enrollments_updated_at BEFORE UPDATE ON enrollments FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (user_id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION handle_new_user();
