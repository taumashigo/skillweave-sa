import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(cents: number, currency = "ZAR"): string {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
  }).format(cents / 100);
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("en-ZA", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}

export function formatDuration(hours: number): string {
  if (hours < 1) return `${Math.round(hours * 60)} min`;
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 8);
  return days === 1 ? "1 day" : `${days} days`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function generateCredentialHash(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "SW-";
  for (let i = 0; i < 24; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + "...";
}

export function getDifficultyColor(difficulty: string): string {
  switch (difficulty) {
    case "beginner": return "text-emerald-600 bg-emerald-50 border-emerald-200";
    case "intermediate": return "text-blue-600 bg-blue-50 border-blue-200";
    case "advanced": return "text-orange-600 bg-orange-50 border-orange-200";
    case "expert": return "text-red-600 bg-red-50 border-red-200";
    default: return "text-slate-600 bg-slate-50 border-slate-200";
  }
}

export function getPricingColor(model: string): string {
  switch (model) {
    case "free": return "text-emerald-700 bg-emerald-50 border-emerald-200";
    case "sponsored": return "text-purple-700 bg-purple-50 border-purple-200";
    case "bursary_funded": return "text-amber-700 bg-amber-50 border-amber-200";
    case "employer_funded": return "text-navy-700 bg-navy-50 border-navy-200";
    default: return "text-slate-700 bg-slate-50 border-slate-200";
  }
}

export function getValidationColor(status: string): string {
  switch (status) {
    case "valid": return "text-emerald-600";
    case "warning": return "text-amber-600";
    case "invalid": return "text-red-600";
    default: return "text-slate-600";
  }
}

export const SA_PROVINCES = [
  "Eastern Cape", "Free State", "Gauteng", "KwaZulu-Natal",
  "Limpopo", "Mpumalanga", "Northern Cape", "North West", "Western Cape",
] as const;

export const INDUSTRIES = [
  "Technology", "Finance & Banking", "Healthcare", "Education",
  "Manufacturing", "Retail", "Mining", "Agriculture", "Tourism & Hospitality",
  "Construction", "Telecommunications", "Energy", "Government",
  "Media & Entertainment", "Transport & Logistics", "Legal",
] as const;

export const CAREER_INTERESTS = [
  "Software Development", "Data Science", "Digital Marketing", "Project Management",
  "Cybersecurity", "UX/UI Design", "Cloud Computing", "AI & Machine Learning",
  "Business Analysis", "Financial Analysis", "Entrepreneurship",
  "Human Resources", "Supply Chain Management", "Content Creation",
  "Network Engineering", "Mobile Development", "DevOps",
] as const;

export const NQF_LEVELS = [
  { value: "1", label: "NQF 1 - General Certificate" },
  { value: "2", label: "NQF 2 - Elementary Certificate" },
  { value: "3", label: "NQF 3 - Intermediate Certificate" },
  { value: "4", label: "NQF 4 - National Certificate" },
  { value: "5", label: "NQF 5 - Higher Certificate" },
  { value: "6", label: "NQF 6 - Diploma / Adv Certificate" },
  { value: "7", label: "NQF 7 - Bachelor's Degree" },
  { value: "8", label: "NQF 8 - Honours / Postgrad Diploma" },
  { value: "9", label: "NQF 9 - Master's Degree" },
  { value: "10", label: "NQF 10 - Doctoral Degree" },
] as const;
