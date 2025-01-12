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

export const SITE_CONFIG = {
  title: "DisñoJobs - Trabajos de Diseño de Producto",
  description: "Portal de empleo para diseñadores de producto en España",
  jobPrice: 2900, // 29€ in cents
} as const;
