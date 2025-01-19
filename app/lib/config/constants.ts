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
  { value: 10000, label: "10.000€" },
  { value: 20000, label: "20.000€" },
  { value: 30000, label: "30.000€" },
  { value: 40000, label: "40.000€" },
  { value: 50000, label: "50.000€" },
  { value: 60000, label: "60.000€" },
  { value: 70000, label: "70.000€" },
  { value: 80000, label: "80.000€" },
  { value: 90000, label: "90.000€" },
  { value: 100000, label: "100.000€" },
] as const;

export const SITE_CONFIG = {
  title: "DisñoJobs - Trabajos de Diseño de Producto",
  description: "Portal de empleo para diseñadores de producto en España",
  jobPrice: 2900, // 29€ in cents
} as const;
