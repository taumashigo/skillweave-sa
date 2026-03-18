// ============================================
// SkillWeave SA — AI Recommendation Service
// Provider-abstracted with mock implementation
// ============================================

import type {
  AIRecommendation,
  SkillGapAnalysis,
  Profile,
  Module,
  Enrollment,
} from "@/types";
import { SEED_MODULES } from "@/data/seed";

// ============================================
// Service Interface
// ============================================

export interface IAIRecommendationService {
  getPathwayRecommendations(profile: Profile): Promise<AIRecommendation>;
  getModuleRecommendations(
    profile: Profile,
    currentModules: string[]
  ): Promise<AIRecommendation>;
  getSkillGapAnalysis(
    profile: Profile,
    targetRole: string,
    completedModules: string[]
  ): Promise<SkillGapAnalysis>;
  getRemediationSuggestions(
    moduleId: string,
    score: number,
    attempts: number
  ): Promise<AIRecommendation>;
  getAffordabilitySuggestions(
    profile: Profile,
    selectedModuleIds: string[]
  ): Promise<AIRecommendation>;
  getEmployabilitySuggestions(
    profile: Profile,
    credentials: string[]
  ): Promise<AIRecommendation>;
}

// ============================================
// Mock AI Service
// ============================================

export class MockAIRecommendationService implements IAIRecommendationService {
  private modules = SEED_MODULES;

  async getPathwayRecommendations(
    profile: Profile
  ): Promise<AIRecommendation> {
    // Simulate API delay
    await new Promise((r) => setTimeout(r, 500));

    const interests = profile.career_interests || [];
    const targetJobs = profile.target_jobs || [];

    // Simple matching logic
    const relevantModules = this.modules
      .filter((m) => {
        const tags = [
          ...(m.competency_tags || []),
          ...(m.industry_tags || []),
          ...(m.job_role_tags || []),
        ].map((t) => t.toLowerCase());
        return (
          interests.some((i) =>
            tags.some((t) => t.includes(i.toLowerCase()))
          ) ||
          targetJobs.some((j) =>
            tags.some((t) => t.includes(j.toLowerCase()))
          )
        );
      })
      .slice(0, 8);

    return {
      type: "pathway",
      title: "Recommended Pathway",
      description: `Based on your interests in ${interests.slice(0, 3).join(", ")} and target roles in ${targetJobs.slice(0, 2).join(", ")}, we suggest this curated learning path.`,
      confidence: 0.85,
      items: relevantModules.map((m) => ({
        id: m.id!,
        title: m.title!,
        reason: `Aligns with your interest in ${interests[0] || "tech"}`,
      })),
    };
  }

  async getModuleRecommendations(
    profile: Profile,
    currentModules: string[]
  ): Promise<AIRecommendation> {
    await new Promise((r) => setTimeout(r, 300));

    const notEnrolled = this.modules.filter(
      (m) => !currentModules.includes(m.id!)
    );

    const suggestions = notEnrolled
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 5);

    return {
      type: "module",
      title: "Recommended Next Modules",
      description:
        "Based on your progress and interests, these modules would strengthen your pathway.",
      confidence: 0.78,
      items: suggestions.map((m) => ({
        id: m.id!,
        title: m.title!,
        reason: `Highly rated (${m.rating}★) with ${m.enrollment_count} enrolled learners`,
      })),
    };
  }

  async getSkillGapAnalysis(
    profile: Profile,
    targetRole: string,
    completedModules: string[]
  ): Promise<SkillGapAnalysis> {
    await new Promise((r) => setTimeout(r, 600));

    // Mock skill gap based on role
    const roleSkillMap: Record<string, string[]> = {
      "Full Stack Developer": [
        "JavaScript", "React", "Node.js", "PostgreSQL", "Git",
        "API Design", "Testing", "DevOps", "Agile",
      ],
      "Data Scientist": [
        "Python", "Statistics", "Machine Learning", "SQL",
        "Data Visualization", "Pandas", "NumPy",
      ],
      "Digital Marketer": [
        "SEO", "Social Media", "Content Marketing", "Google Ads",
        "Analytics", "Email Marketing",
      ],
      "Project Manager": [
        "Agile", "Scrum", "Risk Management", "Stakeholder Management",
        "Leadership", "Communication",
      ],
    };

    const requiredSkills = roleSkillMap[targetRole] || [
      "Communication", "Problem Solving", "Teamwork",
    ];

    const completedSkills = completedModules
      .map((id) => this.modules.find((m) => m.id === id))
      .filter(Boolean)
      .flatMap((m) => m!.competency_tags || []);

    const currentSkills = [...new Set(completedSkills)];
    const missingSkills = requiredSkills.filter(
      (s) => !currentSkills.some((cs) => cs.toLowerCase().includes(s.toLowerCase()))
    );

    const gapPercentage =
      requiredSkills.length > 0
        ? Math.round((missingSkills.length / requiredSkills.length) * 100)
        : 0;

    const recommendedModules = missingSkills
      .map((skill) => {
        const mod = this.modules.find((m) =>
          m.competency_tags?.some((t) =>
            t.toLowerCase().includes(skill.toLowerCase())
          )
        );
        return mod
          ? { module_id: mod.id!, title: mod.title!, priority: 1 }
          : null;
      })
      .filter(Boolean) as { module_id: string; title: string; priority: number }[];

    return {
      target_role: targetRole,
      current_skills: currentSkills,
      missing_skills: missingSkills,
      recommended_modules: recommendedModules,
      gap_percentage: gapPercentage,
    };
  }

  async getRemediationSuggestions(
    moduleId: string,
    score: number,
    attempts: number
  ): Promise<AIRecommendation> {
    await new Promise((r) => setTimeout(r, 300));

    const mod = this.modules.find((m) => m.id === moduleId);

    const items = [];
    if (score < 40) {
      items.push({
        id: "rem-review",
        title: "Review Core Concepts",
        reason: "Your score suggests foundational concepts need reinforcement",
      });
    }
    if (attempts > 2) {
      items.push({
        id: "rem-practice",
        title: "Additional Practice Exercises",
        reason: "Multiple attempts indicate more practice would help",
      });
    }
    items.push({
      id: "rem-tutor",
      title: "AI Tutor Session",
      reason: "Get personalized guidance on challenging topics",
    });
    if (mod?.has_remediation) {
      items.push({
        id: "rem-booster",
        title: `${mod.title} - Booster Lesson`,
        reason: "Provider-created supplementary content available",
      });
    }

    return {
      type: "remediation",
      title: "Remediation Suggestions",
      description: `Based on your performance (${score}% across ${attempts} attempts), here are ways to strengthen your understanding.`,
      confidence: 0.82,
      items,
    };
  }

  async getAffordabilitySuggestions(
    profile: Profile,
    selectedModuleIds: string[]
  ): Promise<AIRecommendation> {
    await new Promise((r) => setTimeout(r, 300));

    const selectedModules = selectedModuleIds
      .map((id) => this.modules.find((m) => m.id === id))
      .filter(Boolean);

    const totalCost = selectedModules.reduce(
      (sum, m) => sum + (m!.cost_cents || 0),
      0
    );

    const freeAlternatives = this.modules.filter(
      (m) =>
        m.pricing_model === "free" &&
        !selectedModuleIds.includes(m.id!) &&
        selectedModules.some((sm) =>
          sm!.competency_tags?.some((t) =>
            m.competency_tags?.includes(t)
          )
        )
    );

    return {
      type: "affordability",
      title: "Affordability Options",
      description: `Your current pathway costs R${(totalCost / 100).toFixed(0)}. Here are ways to reduce costs.`,
      confidence: 0.9,
      items: freeAlternatives.slice(0, 5).map((m) => ({
        id: m.id!,
        title: m.title!,
        reason: `Free alternative covering similar skills`,
      })),
    };
  }

  async getEmployabilitySuggestions(
    profile: Profile,
    credentials: string[]
  ): Promise<AIRecommendation> {
    await new Promise((r) => setTimeout(r, 400));

    return {
      type: "job",
      title: "Employability Insights",
      description:
        "Based on your credentials and the current SA job market, here are ways to improve your employability.",
      confidence: 0.75,
      items: [
        {
          id: "emp-portfolio",
          title: "Build Your Portfolio",
          reason: "Employers value demonstrated work over certificates alone",
        },
        {
          id: "emp-experience",
          title: "Apply for Experiential Projects",
          reason: "Real-world experience significantly boosts your CV",
        },
        {
          id: "emp-network",
          title: "Attend Industry Events",
          reason: "Networking is the #1 way people find jobs in SA",
        },
      ],
    };
  }
}

// ============================================
// Service Factory
// ============================================

let _instance: IAIRecommendationService | null = null;

export function getAIService(): IAIRecommendationService {
  if (!_instance) {
    const provider = process.env.AI_PROVIDER || "mock";
    switch (provider) {
      case "mock":
      default:
        _instance = new MockAIRecommendationService();
    }
  }
  return _instance;
}
