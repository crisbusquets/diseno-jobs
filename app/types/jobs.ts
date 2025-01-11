// app/types/jobs.ts

export type JobType = "remote" | "hybrid" | "onsite";

export type ExperienceLevel = "entry" | "junior" | "mid" | "senior" | "manager" | "lead";

export type ContractType = "fulltime" | "parttime" | "internship" | "freelance";

export type ApplicationMethod = {
  type: "email" | "url";
  value: string;
};

export type Benefit = {
  name: string;
  icon?: string;
  isCustom?: boolean;
};

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
  is_active: boolean;
  management_token?: string;
  benefits?: Benefit[];
  application_method_type: "email" | "url";
  application_method_value: string;
}

export interface JobFormData extends Omit<Job, "id" | "created_at" | "is_active" | "management_token"> {
  benefits: Benefit[];
}

export interface JobFilters {
  search: string;
  jobType: string;
  ExperienceLevel: string;
  ContractType: string;
  location: string;
  minSalary?: number;
  benefits?: string[];
}

export const DEFAULT_JOB_FILTERS: JobFilters = {
  search: "",
  jobType: "all",
  ExperienceLevel: "",
  ContractType: "",
  location: "",
  minSalary: undefined,
  benefits: [],
};
