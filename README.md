# SkillWeave SA

> South Africa's modular learning, credentialing, and experiential learning platform.

SkillWeave SA bridges the gap between education and employment by enabling learners to build personalised learning pathways, earn stackable credentials, and connect with real-world opportunities — all aligned to SAQA/NQF standards.

---

## 🚀 Features

### Core Platform
- **Drag-and-Drop Pathway Builder** — Build custom learning journeys with real-time validation
- **Module Catalogue** — 42 searchable, filterable learning modules from SA providers
- **Stackable Credentials** — Badges, certificates, milestones, and qualifications
- **QR-Verifiable Credentials** — Public verification pages for every credential
- **Adaptive Remediation** — Auto-detect learner struggles and provide targeted support
- **Experiential Marketplace** — Employer-backed projects, internships, and challenges
- **RPL Workflow** — Recognition of Prior Learning with evidence submission
- **Lifelong Record** — Transcript, portfolio, CV builder, and evidence library
- **AI Recommendations** — Abstracted AI service with mock provider for pathway, module, and remediation suggestions

### User Roles
- Learner · Employer · Provider · Mentor/Advisor · Assessor · Sponsor · Admin

### Design
- Premium, enterprise-grade UI
- White + Slate + Navy + Emerald palette
- Framer Motion animations throughout
- Fully responsive (mobile, tablet, desktop)
- DM Sans + Plus Jakarta Sans typography

---

## 📁 Project Structure

```
skillweave-sa/
├── src/
│   ├── app/                          # Next.js App Router pages
│   │   ├── page.tsx                  # Landing page
│   │   ├── about/page.tsx            # About page
│   │   ├── catalog/                  # Module catalogue + detail
│   │   ├── opportunities/            # Opportunities listing
│   │   ├── pricing/page.tsx          # Pricing page
│   │   ├── verify/[credentialId]/    # Public credential verification
│   │   ├── (auth)/                   # Login, signup
│   │   └── (dashboard)/             # Authenticated pages
│   │       ├── dashboard/            # Learner dashboard
│   │       ├── pathways/             # Pathways list + builder
│   │       ├── wallet/               # Credential wallet
│   │       ├── transcript/           # Academic transcript
│   │       ├── support/              # Remediation dashboard
│   │       ├── rpl/                  # RPL requests
│   │       └── admin/                # Admin dashboard (Recharts)
│   ├── components/
│   │   ├── ui/                       # Shared UI primitives (Button, Card, etc.)
│   │   ├── layout/                   # Navbar, Sidebar, DashboardShell, Footer
│   │   ├── modules/                  # ModuleCard
│   │   ├── credentials/              # CredentialCard
│   │   ├── opportunities/            # OpportunityCard
│   │   └── shared/                   # ProgressRing, etc.
│   ├── lib/
│   │   ├── supabase.ts              # Supabase client config
│   │   ├── store/                    # Zustand stores (auth, pathway builder, filters)
│   │   ├── services/                 # AI recommendation service (mock)
│   │   ├── validations/              # Pathway validation engine
│   │   └── utils/                    # Formatters, helpers, constants
│   ├── types/                        # TypeScript type definitions
│   └── data/                         # Seed data (42 modules, 6 opportunities, etc.)
├── supabase/
│   └── migrations/                   # PostgreSQL schema (50+ tables)
├── tailwind.config.ts
├── next.config.js
└── package.json
```

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| UI Components | Custom (shadcn/ui patterns) |
| Animation | Framer Motion |
| Drag & Drop | @dnd-kit |
| Icons | Lucide React |
| State | Zustand |
| Charts | Recharts |
| Auth & DB | Supabase (PostgreSQL) |
| Validation | Zod + custom engine |
| Notifications | Sonner |
| Deployment | Vercel-ready |

---

## 🗄 Database Schema

The schema includes 30+ tables with proper relationships, RLS policies, and triggers:

**Core:** profiles, organizations, modules, module_prerequisites, module_reviews
**Pathways:** pathways, pathway_items, pathway_templates, qualification_rules
**Learning:** enrollments, assessments, assessment_attempts
**Remediation:** remediation_resources, remediation_assignments
**Credentials:** credentials, milestones, milestone_requirements
**Experiential:** opportunities, opportunity_applications, opportunity_submissions, employer_evaluations
**Portfolio:** portfolio_items, rpl_requests
**System:** notifications, transactions, audit_logs, messages, advisor_reviews

See `supabase/migrations/001_initial_schema.sql` for the full schema.

---

## 🏃 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account (or local Supabase CLI)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/skillweave-sa.git
cd skillweave-sa

# Install dependencies
npm install

# Copy environment file
cp .env.local.example .env.local
# Edit .env.local with your Supabase credentials

# Run the database migration
# (In Supabase Dashboard → SQL Editor → paste the migration file)

# Start development server
npm run dev
```

### Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 📊 Seed Data

The app includes realistic South African seed data:

- **42 modules** across digital literacy, software dev, data science, project management, entrepreneurship, marketing, communication, career readiness, and more
- **8 organisations** including WeThinkCode_, Umuzi, Explore DSAA, Standard Bank, Investec, Naspers Foundry, CAPACITI, Sasol
- **5 pathway templates** (Full Stack Dev, Data Analyst, Digital Marketing, PM/Product, Data Scientist)
- **6 experiential opportunities** from real SA employers
- **4 sample credentials** (badges, certificates, milestones, endorsements)
- All modules include NQF levels, credit values, and SA-relevant content

---

## 🧩 Key Modules Explained

### Pathway Validation Engine (`src/lib/validations/pathway-validator.ts`)
Config-driven validation that checks:
- Minimum total credits
- Core vs elective credit ratios
- Prerequisite satisfaction
- Capstone requirements
- NQF progression logic
- Duplicate detection
- Breadth/depth balance
- Affordability analysis

### AI Recommendation Service (`src/lib/services/ai-service.ts`)
Provider-abstracted with interface:
- `getPathwayRecommendations()` — Suggest pathways based on profile
- `getModuleRecommendations()` — Next module suggestions
- `getSkillGapAnalysis()` — Gap analysis for target roles
- `getRemediationSuggestions()` — Targeted support when struggling
- `getAffordabilitySuggestions()` — Free alternatives
- `getEmployabilitySuggestions()` — Job market guidance

Currently uses a mock implementation that returns realistic data based on user profile, modules, and competency matching. Designed to swap in OpenAI/Anthropic/custom ML with zero frontend changes.

### Remediation System
Detects learner struggles via:
- Low quiz scores
- Repeated failed attempts
- Inactivity
- Prerequisite gaps

Then provides:
- Targeted booster content
- Practice exercises
- AI tutor sessions
- Alternative content formats
- Mentor escalation
- Score tracking (before/after)

---

## 🎨 Design Decisions

- **DM Sans** for body text, **Plus Jakarta Sans** for headings — distinctive, professional, highly legible
- **Emerald + Navy** primary palette — trustworthy, growth-oriented, premium
- **Glass cards** with subtle shadows — depth without clutter
- **Framer Motion** for drag lift, page transitions, milestone celebrations
- **Progressive disclosure** — complex features revealed contextually
- **South African context** throughout — provinces, SARS/POPIA references, local providers, ZAR pricing

---

## 🔒 Security Architecture

- Row-Level Security (RLS) on all sensitive tables
- Role-based access control via profiles.role
- Route protection patterns for authenticated pages
- Input validation with Zod
- Audit log writes for sensitive actions
- Credential hash generation for verification
- Architected for MFA, signed credentials, and stronger attestation

---

## 🚧 Roadmap (Post-MVP)

- [ ] Full Supabase Auth integration
- [ ] Stripe payment processing
- [ ] Real AI provider integration (OpenAI/Anthropic)
- [ ] PDF certificate generation
- [ ] QR code generation for credentials
- [ ] Email notifications via Resend/SendGrid
- [ ] Rich text content authoring (TipTap)
- [ ] File upload to Supabase Storage
- [ ] Mentor messaging system
- [ ] Mobile app (React Native)
- [ ] SAQA/NLRD API integration
- [ ] Multi-language support (isiZulu, Afrikaans, etc.)

---

## 📄 License

Proprietary. Built for SkillWeave SA.

---

<p align="center">
  <strong>SkillWeave SA</strong> — Building futures through modular learning.<br/>
  Proudly South African 🇿🇦
</p>
