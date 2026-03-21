import type {
  AIRecommendation, SkillGapAnalysis, Profile, Module,
} from "@/types";

export interface IAIRecommendationService {
  getPathwayRecommendations(profile: Profile): Promise<AIRecommendation>;
  getModuleRecommendations(profile: Profile, currentModules: string[]): Promise<AIRecommendation>;
  getSkillGapAnalysis(profile: Profile, targetRole: string, completedModules: string[]): Promise<SkillGapAnalysis>;
  getRemediationSuggestions(moduleId: string, moduleTitle: string, score: number, attempts: number): Promise<AIRecommendation>;
  getAffordabilitySuggestions(profile: Profile, selectedModuleIds: string[]): Promise<AIRecommendation>;
  getEmployabilitySuggestions(profile: Profile, credentials: string[]): Promise<AIRecommendation>;
}

// ============================================
// Anthropic Claude AI Service
// ============================================
class AnthropicAIService implements IAIRecommendationService {
  private async callClaude(prompt: string): Promise<string> {
    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      if (!response.ok) throw new Error("AI request failed");
      const data = await response.json();
      return data.response || "";
    } catch (error) {
      console.error("Claude API error:", error);
      return "";
    }
  }

  private parseJSON(text: string): any {
    try {
      const match = text.match(/\{[\s\S]*\}/);
      if (match) return JSON.parse(match[0]);
      return null;
    } catch { return null; }
  }

  async getPathwayRecommendations(profile: Profile): Promise<AIRecommendation> {
    const prompt = `You are a South African education advisor for SkillWeave SA, a modular learning platform aligned with SAQA/NQF standards.

A learner has these details:
- Career interests: ${(profile.career_interests || []).join(", ") || "not specified"}
- Target jobs: ${(profile.target_jobs || []).join(", ") || "not specified"}
- Skills interests: ${(profile.skills_interests || []).join(", ") || "not specified"}
- Budget: ${profile.budget_preference || "flexible"}
- Prior learning: ${profile.prior_learning_summary || "none specified"}

Suggest a personalized learning pathway. Respond ONLY with a JSON object in this exact format, no other text:
{
  "title": "Recommended Pathway Name",
  "description": "2-3 sentence description of why this pathway suits them",
  "confidence": 0.85,
  "items": [
    {"id": "1", "title": "Module name", "reason": "Why this module is recommended"},
    {"id": "2", "title": "Module name", "reason": "Why this module is recommended"}
  ]
}

Include 5-8 module suggestions relevant to the South African job market.`;

    const text = await this.callClaude(prompt);
    const parsed = this.parseJSON(text);

    if (parsed) {
      return { type: "pathway", title: parsed.title, description: parsed.description, confidence: parsed.confidence || 0.8, items: parsed.items || [] };
    }
    return { type: "pathway", title: "Recommended Pathway", description: "Based on your profile, we suggest starting with foundational modules.", confidence: 0.7, items: [] };
  }

  async getModuleRecommendations(profile: Profile, currentModules: string[]): Promise<AIRecommendation> {
    const prompt = `You are a South African education advisor. A learner on SkillWeave SA has completed these modules: ${currentModules.join(", ") || "none yet"}.

Their interests: ${(profile.career_interests || []).join(", ") || "general"}.
Their target jobs: ${(profile.target_jobs || []).join(", ") || "not specified"}.

Suggest 5 next modules they should take. Respond ONLY with JSON:
{
  "title": "Recommended Next Modules",
  "description": "Brief explanation",
  "confidence": 0.8,
  "items": [
    {"id": "1", "title": "Module name", "reason": "Why recommended"}
  ]
}`;

    const text = await this.callClaude(prompt);
    const parsed = this.parseJSON(text);

    if (parsed) {
      return { type: "module", ...parsed };
    }
    return { type: "module", title: "Recommended Modules", description: "Complete more modules to get personalized recommendations.", confidence: 0.6, items: [] };
  }

  async getSkillGapAnalysis(profile: Profile, targetRole: string, completedModules: string[]): Promise<SkillGapAnalysis> {
    const prompt = `You are a South African career advisor. Analyze the skill gap for:

Target role: ${targetRole}
Completed modules: ${completedModules.join(", ") || "none"}
Current skills: ${(profile.skills_interests || []).join(", ") || "none specified"}

Respond ONLY with JSON:
{
  "target_role": "${targetRole}",
  "current_skills": ["skill1", "skill2"],
  "missing_skills": ["skill1", "skill2"],
  "recommended_modules": [
    {"module_id": "1", "title": "Module name", "priority": 1}
  ],
  "gap_percentage": 45
}

Base this on the real South African job market requirements for ${targetRole}.`;

    const text = await this.callClaude(prompt);
    const parsed = this.parseJSON(text);

    if (parsed) {
      return parsed as SkillGapAnalysis;
    }
    return { target_role: targetRole, current_skills: [], missing_skills: ["Unable to analyze"], recommended_modules: [], gap_percentage: 50 };
  }

  async getRemediationSuggestions(moduleId: string, moduleTitle: string, score: number, attempts: number): Promise<AIRecommendation> {
    const prompt = `You are a learning support advisor on SkillWeave SA, a South African learning platform.

A learner scored ${score}% on "${moduleTitle}" after ${attempts} attempt(s).

Provide specific, actionable remediation suggestions. Respond ONLY with JSON:
{
  "title": "Remediation Plan",
  "description": "Brief overview of the support plan",
  "confidence": 0.85,
  "items": [
    {"id": "1", "title": "Specific action", "reason": "Why this will help"}
  ]
}

Include 3-5 suggestions covering: concept review, practice exercises, alternative learning formats, and when to seek mentor help.`;

    const text = await this.callClaude(prompt);
    const parsed = this.parseJSON(text);

    if (parsed) {
      return { type: "remediation", ...parsed };
    }
    return { type: "remediation", title: "Remediation Support", description: `Review the core concepts and try again.`, confidence: 0.7, items: [
      { id: "1", title: "Review core concepts", reason: "Strengthen foundational understanding" },
      { id: "2", title: "Practice exercises", reason: "Build confidence through repetition" },
      { id: "3", title: "Request mentor support", reason: "Get personalized guidance" },
    ]};
  }

  async getAffordabilitySuggestions(profile: Profile, selectedModuleIds: string[]): Promise<AIRecommendation> {
    const prompt = `You are a financial advisor for learners on SkillWeave SA in South Africa.

A learner with budget preference "${profile.budget_preference || "flexible"}" has selected ${selectedModuleIds.length} modules.

Suggest ways to reduce costs. Respond ONLY with JSON:
{
  "title": "Affordability Options",
  "description": "Brief summary",
  "confidence": 0.8,
  "items": [
    {"id": "1", "title": "Suggestion", "reason": "How this saves money"}
  ]
}

Include suggestions about free alternatives, bursaries, employer-funded options, NSFAS, and Sector Education and Training Authorities (SETAs) in South Africa.`;

    const text = await this.callClaude(prompt);
    const parsed = this.parseJSON(text);

    if (parsed) {
      return { type: "affordability", ...parsed };
    }
    return { type: "affordability", title: "Affordability Options", description: "Explore free and funded alternatives.", confidence: 0.7, items: [] };
  }

  async getEmployabilitySuggestions(profile: Profile, credentials: string[]): Promise<AIRecommendation> {
    const prompt = `You are a South African career coach on SkillWeave SA.

A learner has earned these credentials: ${credentials.join(", ") || "none yet"}.
Their target jobs: ${(profile.target_jobs || []).join(", ") || "not specified"}.
Province: ${profile.province || "not specified"}.

Provide specific employability advice for the South African job market. Respond ONLY with JSON:
{
  "title": "Employability Insights",
  "description": "Brief overview",
  "confidence": 0.8,
  "items": [
    {"id": "1", "title": "Action item", "reason": "Why this improves employability"}
  ]
}

Include advice on networking, portfolio building, LinkedIn, job boards (Careers24, PNet, OfferZen), and interview preparation specific to SA.`;

    const text = await this.callClaude(prompt);
    const parsed = this.parseJSON(text);

    if (parsed) {
      return { type: "job", ...parsed };
    }
    return { type: "job", title: "Employability Insights", description: "Build your portfolio and network to improve your chances.", confidence: 0.7, items: [
      { id: "1", title: "Build a portfolio", reason: "Employers value demonstrated work" },
      { id: "2", title: "Apply for experiential projects", reason: "Real-world experience boosts your CV" },
      { id: "3", title: "Network on LinkedIn", reason: "Most SA jobs are found through connections" },
    ]};
  }
}

// ============================================
// Mock fallback (same as before, simplified)
// ============================================
class MockAIService implements IAIRecommendationService {
  async getPathwayRecommendations(profile: Profile): Promise<AIRecommendation> {
    await new Promise(r => setTimeout(r, 300));
    return { type: "pathway", title: "Recommended Pathway", description: "Based on your interests, start with foundational modules.", confidence: 0.7, items: [
      { id: "1", title: "Digital Literacy Foundations", reason: "Essential starting point" },
      { id: "2", title: "Professional Communication", reason: "Required for all careers" },
      { id: "3", title: "Career Readiness", reason: "Job search preparation" },
    ]};
  }
  async getModuleRecommendations(): Promise<AIRecommendation> {
    return { type: "module", title: "Next Steps", description: "Continue building your skills.", confidence: 0.7, items: [] };
  }
  async getSkillGapAnalysis(_p: Profile, targetRole: string): Promise<SkillGapAnalysis> {
    return { target_role: targetRole, current_skills: [], missing_skills: ["Analysis unavailable in mock mode"], recommended_modules: [], gap_percentage: 50 };
  }
  async getRemediationSuggestions(): Promise<AIRecommendation> {
    return { type: "remediation", title: "Support", description: "Review and try again.", confidence: 0.7, items: [{ id: "1", title: "Review material", reason: "Strengthen understanding" }] };
  }
  async getAffordabilitySuggestions(): Promise<AIRecommendation> {
    return { type: "affordability", title: "Options", description: "Look for free alternatives.", confidence: 0.7, items: [] };
  }
  async getEmployabilitySuggestions(): Promise<AIRecommendation> {
    return { type: "job", title: "Tips", description: "Build your portfolio.", confidence: 0.7, items: [] };
  }
}

// ============================================
// Factory
// ============================================
let _instance: IAIRecommendationService | null = null;

export function getAIService(): IAIRecommendationService {
  if (!_instance) {
    const provider = typeof window !== "undefined" ? "anthropic" : (process.env.AI_PROVIDER || "mock");
    _instance = provider === "anthropic" ? new AnthropicAIService() : new MockAIService();
  }
  return _instance;
}
