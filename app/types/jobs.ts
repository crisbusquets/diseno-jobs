// types/jobs.ts

export const JOB_TYPES = {
  REMOTE: "remote",
  HYBRID: "hybrid",
  ONSITE: "onsite",
} as const;

export const EXPERIENCE_LEVELS = {
  ENTRY: "entry",
  JUNIOR: "junior",
  MID: "mid",
  SENIOR: "senior",
  MANAGER: "manager",
  LEAD: "lead",
} as const;

export const CONTRACT_TYPES = {
  FULLTIME: "fulltime",
  PARTTIME: "parttime",
  INTERNSHIP: "internship",
  FREELANCE: "freelance",
} as const;

// Derive types from constants
export type JobType = (typeof JOB_TYPES)[keyof typeof JOB_TYPES];
export type ExperienceLevel = (typeof EXPERIENCE_LEVELS)[keyof typeof EXPERIENCE_LEVELS];
export type ContractType = (typeof CONTRACT_TYPES)[keyof typeof CONTRACT_TYPES];

export type ApplicationMethod = {
  type: "email" | "url";
  value: string;
};

export type Benefit = {
  id: string;
  name: string;
  icon?: string;
  isCustom?: boolean;
};

// Base job interface
export interface Job {
  id: number;
  title: string;
  company: string;
  company_email: string;
  company_logo?: string;
  description: string;
  job_type: JobType;
  experience_level: ExperienceLevel;
  contract_type: ContractType;
  location?: string;
  salary_min?: number;
  salary_max?: number;
  created_at: string;
  activated_at?: string;
  is_active: boolean;
  management_token?: string;
  benefits?: Benefit[];
  application_method_type: "email" | "url";
  application_method_value: string;
}

// Derive form data type from Job
export type JobFormData = Omit<Job, "id" | "created_at" | "is_active" | "management_token" | "activated_at">;

export interface JobFilters {
  search: string;
  jobType: JobType | "all";
  location: string;
  minSalary?: number;
  benefits?: string[];
  remoteOnly: boolean;
}

export const DEFAULT_JOB_FILTERS: JobFilters = {
  search: "",
  jobType: "all",
  location: "all",
  remoteOnly: false,
};
