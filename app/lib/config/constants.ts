// app/lib/config/constants.ts
import { t } from "@/lib/translations/utils";

export const JOB_TYPES = {
  REMOTE: "remote",
  HYBRID: "hybrid",
  ONSITE: "onsite",
} as const;

export const APPLICATION_METHODS = {
  EMAIL: "email",
  URL: "url",
} as const;

export const DEFAULT_JOB_FILTERS = {
  search: "",
  jobType: "all",
  location: "",
};

export const EXPERIENCE_LEVEL = {
  ENTRY: "entry",
  JUNIOR: "junior",
  MID: "mid",
  SENIOR: "senior",
  MANAGER: "manager",
  LEAD: "lead",
} as const;

export const CONTRACT_TYPE = {
  FULLTIME: "fulltime",
  PARTTIME: "parttime",
  INTERNSHIP: "internship",
  FREELANCE: "freelance",
} as const;

export const CONTRACT_TYPE_LABELS = {
  fulltime: () => t("jobs.contract.fulltime"),
  parttime: () => t("jobs.contract.parttime"),
  internship: () => t("jobs.contract.internship"),
  freelance: () => t("jobs.contract.freelance"),
} as const;

export const DEFAULT_BENEFITS = [
  { name: t("benefits.presets.healthInsurance.name"), icon: "🏥" },
  { name: t("benefits.presets.remoteWork.name"), icon: "🏠" },
  { name: t("benefits.presets.flexibleHours.name"), icon: "⏰" },
  { name: t("benefits.presets.training.name"), icon: "📚" },
  { name: t("benefits.presets.extraHolidays.name"), icon: "📅" },
];

export const SALARY_RANGES = [
  { id: "10-20k", label: "10.000€ - 20.000€" },
  { id: "20-30k", label: "20.000€ - 30.000€" },
  { id: "30-40k", label: "30.000€ - 40.000€" },
  { id: "40-50k", label: "40.000€ - 50.000€" },
  { id: "50-60k", label: "50.000€ - 60.000€" },
  { id: "60-70k", label: "60.000€ - 70.000€" },
  { id: "70-80k", label: "70.000€ - 80.000€" },
  { id: "80-90k", label: "80.000€ - 90.000€" },
  { id: "90-100k", label: "90.000€ - 100.000€" },
  { id: "100k+", label: "Más de 100.000€" },
] as const;

export const SITE_CONFIG = {
  title: "DisñoJobs - Trabajos de Diseño de Producto",
  description: "Portal de empleo para diseñadores de producto en España",
  jobPrice: 2900, // 29€ in cents
} as const;
