# SkillWeave SA — Deployment Guide

Step-by-step guide to get SkillWeave SA live in production.

---

## Phase 1: Supabase Setup (30 minutes)

### 1.1 Create Supabase Project
1. Go to [supabase.com](https://supabase.com) and create a new project
2. Choose a region close to South Africa (e.g., `eu-west-1` or `af-south-1` if available)
3. Set a strong database password — save it securely
4. Wait for the project to finish provisioning (~2 minutes)

### 1.2 Run Database Migration
1. In the Supabase dashboard, go to **SQL Editor**
2. Click **New Query**
3. Copy and paste the entire contents of `supabase/migrations/001_initial_schema.sql`
4. Click **Run** — this creates all 30+ tables, indexes, RLS policies, and triggers
5. Create another query and paste `supabase/migrations/002_functions.sql`
6. Click **Run** — this creates the helper functions, auto-remediation triggers, and milestone issuance

### 1.3 Seed Sample Data
1. In SQL Editor, create another query
2. Paste the contents of `supabase/seed/seed.sql`
3. Click **Run**
4. **Note:** The seed script uses a placeholder owner_id (`00000000-0000-0000-0000-000000000099`). After creating your first admin user, update the `organizations.owner_id` to match.

### 1.4 Get API Keys
1. Go to **Settings → API**
2. Copy:
   - `Project URL` → this is your `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → this is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → this is your `SUPABASE_SERVICE_ROLE_KEY` (keep secret!)

### 1.5 Configure Auth Providers
1. Go to **Authentication → Providers**
2. **Email:** Already enabled by default. Optionally configure:
   - Enable "Confirm email" for production
   - Set site URL to your production domain
3. **Google OAuth** (recommended):
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create OAuth 2.0 credentials
   - Set redirect URI: `https://YOUR_PROJECT.supabase.co/auth/v1/callback`
   - Copy Client ID and Secret into Supabase
4. **GitHub OAuth** (optional):
   - Go to GitHub → Settings → Developer settings → OAuth Apps
   - Set callback URL: `https://YOUR_PROJECT.supabase.co/auth/v1/callback`
   - Copy Client ID and Secret into Supabase

### 1.6 Configure Auth Settings
1. Go to **Authentication → URL Configuration**
2. Set **Site URL**: `https://your-domain.com` (or `http://localhost:3000` for dev)
3. Add **Redirect URLs**:
   - `http://localhost:3000/auth/callback`
   - `https://your-domain.com/auth/callback`
   - `http://localhost:3000/dashboard`
   - `https://your-domain.com/dashboard`

---

## Phase 2: Local Development (15 minutes)

### 2.1 Install Dependencies
```bash
cd skillweave-sa
npm install
```

### 2.2 Configure Environment
```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your Supabase keys:
```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...your_anon_key
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...your_service_role_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=SkillWeave SA

# Leave these empty for mock mode, or add Stripe test keys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=

# AI Provider - "mock" uses built-in recommendations
AI_PROVIDER=mock
```

### 2.3 Start Development Server
```bash
npm run dev
```

Visit `http://localhost:3000` — you should see the landing page.

### 2.4 Create Your First Account
1. Go to `http://localhost:3000/signup`
2. Choose "Learner" role
3. Enter your details and sign up
4. Check email for confirmation (or disable confirmation in Supabase for dev)
5. Log in and complete the onboarding wizard

### 2.5 Create an Admin User
1. Sign up a second user
2. In Supabase dashboard → Table Editor → `profiles`
3. Find your user and change `role` to `admin`
4. Log in again — you'll be redirected to the admin dashboard

---

## Phase 3: Vercel Deployment (10 minutes)

### 3.1 Push to GitHub
```bash
git init
git add .
git commit -m "Initial SkillWeave SA deployment"
git branch -M main
git remote add origin https://github.com/YOUR_ORG/skillweave-sa.git
git push -u origin main
```

### 3.2 Deploy to Vercel
1. Go to [vercel.com](https://vercel.com) and click **New Project**
2. Import your GitHub repository
3. Vercel auto-detects Next.js — accept the defaults
4. Add **Environment Variables** (same as `.env.local`):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_APP_URL` → set to your Vercel domain (e.g., `https://skillweave-sa.vercel.app`)
   - `NEXT_PUBLIC_APP_NAME` → `SkillWeave SA`
   - `AI_PROVIDER` → `mock`
5. Click **Deploy**
6. Wait ~2 minutes for the build

### 3.3 Update Supabase Auth URLs
After deploying, update your Supabase project:
1. Go to **Authentication → URL Configuration**
2. Update **Site URL** to your Vercel domain
3. Add your Vercel domain to **Redirect URLs**:
   - `https://skillweave-sa.vercel.app/auth/callback`
   - `https://skillweave-sa.vercel.app/dashboard`

### 3.4 Custom Domain (optional)
1. In Vercel → Settings → Domains
2. Add your custom domain (e.g., `skillweave.co.za`)
3. Update DNS records as instructed
4. Update `NEXT_PUBLIC_APP_URL` and Supabase auth URLs to match

---

## Phase 4: Stripe Payments (optional, 20 minutes)

### 4.1 Create Stripe Account
1. Go to [stripe.com](https://stripe.com) and sign up
2. Start in **Test mode**

### 4.2 Get API Keys
1. Go to **Developers → API keys**
2. Copy:
   - Publishable key → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - Secret key → `STRIPE_SECRET_KEY`
3. Add both to your Vercel environment variables
4. Redeploy

### 4.3 Test Payments
- The app auto-detects Stripe keys and switches from mock to real checkout
- Use test card: `4242 4242 4242 4242`, any future date, any CVC
- Test the checkout flow from any paid module's detail page

### 4.4 Go Live with Stripe
1. Complete Stripe's onboarding verification
2. Switch to live API keys
3. Set up a webhook endpoint: `https://your-domain.com/api/payments/webhook`
4. Update environment variables with live keys

---

## Phase 5: Production Hardening

### 5.1 Enable Email Confirmations
In Supabase → Authentication → Settings:
- Enable **Confirm email**
- Configure SMTP (Supabase includes a built-in SMTP or connect your own like Resend/SendGrid)
- Customize email templates with SkillWeave branding

### 5.2 Supabase Storage (for file uploads)
1. In Supabase → Storage → Create bucket: `uploads`
2. Set policy: authenticated users can upload to their own folder
3. Create bucket: `certificates` for generated PDFs
4. Create bucket: `avatars` for profile photos

### 5.3 Set Up Monitoring
- Vercel has built-in analytics and logging
- Consider adding [Sentry](https://sentry.io) for error tracking:
  ```bash
  npm install @sentry/nextjs
  npx @sentry/wizard@latest -i nextjs
  ```

### 5.4 Performance
- Vercel edge caching handles most optimization
- Images: consider adding a CDN or Cloudinary for module thumbnails
- Database: add indexes on any slow queries (most are already indexed)

### 5.5 Security Checklist
- [x] Row-Level Security enabled on all sensitive tables
- [x] Middleware protects authenticated routes
- [x] Role-based access control in middleware
- [x] Input validation with Zod schemas
- [x] Service role key only used server-side
- [ ] Enable MFA in Supabase Auth settings
- [ ] Set up rate limiting (Vercel provides basic rate limits)
- [ ] Configure CORS in Supabase if needed
- [ ] Set up database backups in Supabase (auto-enabled on Pro plan)

---

## Quick Reference: Environment Variables

| Variable | Where to get it | Required |
|----------|----------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Settings → API | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Settings → API | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Settings → API | Yes |
| `NEXT_PUBLIC_APP_URL` | Your domain | Yes |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe → Developers → API keys | No (mock mode) |
| `STRIPE_SECRET_KEY` | Stripe → Developers → API keys | No (mock mode) |
| `AI_PROVIDER` | Set to `mock` | Yes |

---

## Troubleshooting

**"Invalid API key" errors:**
- Double-check your Supabase URL and anon key in `.env.local`
- Make sure there are no trailing spaces

**OAuth redirects fail:**
- Verify redirect URLs in Supabase match exactly (including trailing slashes)
- Check Site URL matches your actual domain

**Middleware redirect loops:**
- Clear browser cookies for the site
- Check that the profile exists in the `profiles` table for the user

**Build errors on Vercel:**
- Check build logs for TypeScript errors
- Ensure all env vars are set in Vercel dashboard

**Mock data showing instead of real data:**
- The dashboard pages currently import from `@/data/seed` for demo purposes
- To use real Supabase data, replace seed imports with `db-service.ts` calls
- The service layer (`src/lib/services/db-service.ts`) is ready to use

---

**Estimated total deployment time:** ~1 hour for a fully working production deployment.
