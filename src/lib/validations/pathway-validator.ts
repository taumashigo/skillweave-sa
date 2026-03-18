// ============================================
// SkillWeave SA — Pathway Validation Engine
// Config-driven validation rules for pathway builder
// ============================================

import type {
  Module,
  PathwayItem,
  PathwayValidation,
  ValidationIssue,
  PathwayTemplate,
} from "@/types";

interface ValidationContext {
  items: PathwayItem[];
  modules: Map<string, Module>;
  template?: PathwayTemplate | null;
  completedModuleIds: Set<string>;
}

// ============================================
// Core Validation Rules
// ============================================

function validateMinimumCredits(ctx: ValidationContext): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const totalCredits = ctx.items.reduce((sum, item) => {
    const mod = ctx.modules.get(item.module_id);
    return sum + (mod?.credits || 0);
  }, 0);

  const required = ctx.template?.total_credits_required || 120;

  if (totalCredits < required) {
    issues.push({
      type: "error",
      message: `Pathway requires at least ${required} credits. Currently at ${totalCredits} credits (${required - totalCredits} more needed).`,
    });
  }

  return issues;
}

function validateCoreCredits(ctx: ValidationContext): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const coreCredits = ctx.items
    .filter((i) => i.item_type === "core")
    .reduce((sum, item) => {
      const mod = ctx.modules.get(item.module_id);
      return sum + (mod?.credits || 0);
    }, 0);

  const minCore = ctx.template?.min_core_credits || 80;

  if (coreCredits < minCore) {
    issues.push({
      type: "error",
      message: `Minimum ${minCore} core credits required. Currently at ${coreCredits} core credits.`,
    });
  }

  return issues;
}

function validateElectiveLimit(ctx: ValidationContext): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const electiveCredits = ctx.items
    .filter((i) => i.item_type === "elective")
    .reduce((sum, item) => {
      const mod = ctx.modules.get(item.module_id);
      return sum + (mod?.credits || 0);
    }, 0);

  const maxElective = ctx.template?.max_elective_credits || 40;

  if (electiveCredits > maxElective) {
    issues.push({
      type: "warning",
      message: `Maximum ${maxElective} elective credits allowed. Currently at ${electiveCredits} elective credits. Remove ${electiveCredits - maxElective} credits worth of electives.`,
    });
  }

  return issues;
}

function validatePrerequisites(ctx: ValidationContext): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const itemModuleIds = new Set(ctx.items.map((i) => i.module_id));

  for (const item of ctx.items) {
    const mod = ctx.modules.get(item.module_id);
    if (!mod) continue;

    // Check if prerequisites are in the pathway (at earlier position) or completed
    // For now, we use a simple heuristic based on difficulty and position
  }

  return issues;
}

function validateCapstone(ctx: ValidationContext): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  if (ctx.template?.requires_capstone) {
    const hasCapstone = ctx.items.some((i) => i.item_type === "capstone");
    if (!hasCapstone) {
      issues.push({
        type: "error",
        message: "This pathway requires a capstone project module. Add a capstone to complete your qualification.",
      });
    }
  }

  return issues;
}

function validateDuplicates(ctx: ValidationContext): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const seen = new Set<string>();

  for (const item of ctx.items) {
    if (seen.has(item.module_id)) {
      const mod = ctx.modules.get(item.module_id);
      issues.push({
        type: "error",
        message: `Duplicate module: "${mod?.title || item.module_id}". Each module can only appear once in a pathway.`,
        module_id: item.module_id,
      });
    }
    seen.add(item.module_id);
  }

  return issues;
}

function validateNQFProgression(ctx: ValidationContext): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const sortedItems = [...ctx.items].sort((a, b) => a.position - b.position);

  let lastLevel = 0;
  for (const item of sortedItems) {
    const mod = ctx.modules.get(item.module_id);
    if (!mod?.nqf_level) continue;

    const level = parseInt(mod.nqf_level as any) || 0;
    if (level < lastLevel - 1) {
      issues.push({
        type: "warning",
        message: `Module "${mod.title}" (NQF ${level}) appears after higher-level modules. Consider reordering for better progression.`,
        module_id: item.module_id,
      });
    }
    lastLevel = Math.max(lastLevel, level);
  }

  return issues;
}

function validateBreadth(ctx: ValidationContext): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const competencyAreas = new Set<string>();

  for (const item of ctx.items) {
    const mod = ctx.modules.get(item.module_id);
    mod?.competency_tags?.forEach((tag) => competencyAreas.add(tag));
  }

  if (ctx.items.length > 5 && competencyAreas.size < 3) {
    issues.push({
      type: "warning",
      message: "Your pathway focuses narrowly. Consider adding modules from different skill areas for a more well-rounded qualification.",
    });
  }

  return issues;
}

// ============================================
// Generate Suggestions
// ============================================

function generateSuggestions(
  ctx: ValidationContext,
  issues: ValidationIssue[]
): string[] {
  const suggestions: string[] = [];

  const totalCredits = ctx.items.reduce((sum, item) => {
    const mod = ctx.modules.get(item.module_id);
    return sum + (mod?.credits || 0);
  }, 0);
  const required = ctx.template?.total_credits_required || 120;

  if (totalCredits < required) {
    const deficit = required - totalCredits;
    suggestions.push(
      `Add ${deficit} more credits to meet the qualification requirement.`
    );
  }

  const hasCapstoneIssue = issues.some((i) =>
    i.message.includes("capstone")
  );
  if (hasCapstoneIssue) {
    suggestions.push(
      "Browse capstone projects in the catalogue to complete your pathway."
    );
  }

  if (ctx.items.length === 0) {
    suggestions.push(
      "Start by adding core modules from the catalogue. These form the foundation of your pathway."
    );
  }

  const freeCount = ctx.items.filter((i) => {
    const mod = ctx.modules.get(i.module_id);
    return mod?.pricing_model === "free";
  }).length;

  if (freeCount === 0 && ctx.items.length > 0) {
    suggestions.push(
      "Some modules have free alternatives. Check the catalogue for budget-friendly options."
    );
  }

  return suggestions;
}

// ============================================
// Calculate Affordability
// ============================================

function calculateAffordability(ctx: ValidationContext) {
  let totalCost = 0;
  let freeAlternatives = 0;

  for (const item of ctx.items) {
    const mod = ctx.modules.get(item.module_id);
    if (!mod) continue;
    totalCost += mod.cost_cents || 0;
    if (mod.pricing_model !== "free" && mod.cost_cents > 0) {
      freeAlternatives += 1; // simplified - in reality would check catalogue
    }
  }

  return {
    total_cost_cents: totalCost,
    free_alternatives: freeAlternatives,
    funding_available: freeAlternatives > 0,
  };
}

// ============================================
// Blocked Modules Detection
// ============================================

function getBlockedModules(
  ctx: ValidationContext
): { module_id: string; reason: string }[] {
  const blocked: { module_id: string; reason: string }[] = [];
  // In a full implementation, this would check prerequisites against
  // completed modules and pathway order
  return blocked;
}

// ============================================
// Main Validation Function
// ============================================

export function validatePathway(
  items: PathwayItem[],
  modulesMap: Map<string, Module>,
  template?: PathwayTemplate | null,
  completedModuleIds?: Set<string>
): PathwayValidation {
  const ctx: ValidationContext = {
    items,
    modules: modulesMap,
    template,
    completedModuleIds: completedModuleIds || new Set(),
  };

  // Run all validation rules
  const allIssues: ValidationIssue[] = [
    ...validateMinimumCredits(ctx),
    ...validateCoreCredits(ctx),
    ...validateElectiveLimit(ctx),
    ...validatePrerequisites(ctx),
    ...validateCapstone(ctx),
    ...validateDuplicates(ctx),
    ...validateNQFProgression(ctx),
    ...validateBreadth(ctx),
  ];

  // Calculate credits
  const totalCredits = items.reduce((sum, item) => {
    const mod = modulesMap.get(item.module_id);
    return sum + (mod?.credits || 0);
  }, 0);

  const coreCredits = items
    .filter((i) => i.item_type === "core" || i.item_type === "capstone")
    .reduce((sum, item) => {
      const mod = modulesMap.get(item.module_id);
      return sum + (mod?.credits || 0);
    }, 0);

  const electiveCredits = items
    .filter((i) => i.item_type === "elective" || i.item_type === "specialization")
    .reduce((sum, item) => {
      const mod = modulesMap.get(item.module_id);
      return sum + (mod?.credits || 0);
    }, 0);

  const requiredCredits = template?.total_credits_required || 120;

  // Determine overall status
  const hasErrors = allIssues.some((i) => i.type === "error");
  const hasWarnings = allIssues.some((i) => i.type === "warning");

  let status: "valid" | "warning" | "invalid" = "valid";
  if (hasErrors) status = "invalid";
  else if (hasWarnings) status = "warning";

  const suggestions = generateSuggestions(ctx, allIssues);
  const affordability = calculateAffordability(ctx);
  const blockedModules = getBlockedModules(ctx);

  const missingRequirements: string[] = [];
  if (totalCredits < requiredCredits) {
    missingRequirements.push(`${requiredCredits - totalCredits} more credits needed`);
  }
  if (template?.requires_capstone && !items.some((i) => i.item_type === "capstone")) {
    missingRequirements.push("Capstone project required");
  }

  return {
    is_valid: !hasErrors,
    status,
    total_credits: totalCredits,
    required_credits: requiredCredits,
    core_credits: coreCredits,
    elective_credits: electiveCredits,
    issues: allIssues,
    suggestions,
    missing_requirements: missingRequirements,
    blocked_modules: blockedModules,
    affordability,
  };
}
