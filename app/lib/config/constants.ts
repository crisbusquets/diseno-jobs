// app/lib/config/constants.ts

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
  ENTRY: "Entry level",
  JUNIOR: "Junior",
  MID: "Mid",
  SENIOR: "Senior",
  MANAGER: "Manager",
  LEAD: "Lead",
} as const;

export const CONTRACT_TYPE = {
  FULLTIME: "fulltime",
  PARTTIME: "parttime",
  INTERNSHIP: "internship",
  FREELANCE: "freelance",
} as const;

export const CONTRACT_TYPE_LABELS = {
  fulltime: "Tiempo completo",
  parttime: "Tiempo parcial",
  internship: "Prácticas",
  freelance: "Freelance",
} as const;

export const CLOUDINARY_UPLOAD_PRESET = "company_logos";

export const DEFAULT_BENEFITS = [
  { name: "Seguro médico", icon: "🏥" },
  { name: "Trabajo remoto", icon: "🏠" },
  { name: "Horario flexible", icon: "⏰" },
  { name: "Formación continua", icon: "📚" },
  { name: "Días libres extra", icon: "📅" },
];

export const SITE_CONFIG = {
  title: "DisñoJobs - Trabajos de Diseño de Producto",
  description: "Portal de empleo para diseñadores de producto en España",
  jobPrice: 2900, // 29€ in cents
};
