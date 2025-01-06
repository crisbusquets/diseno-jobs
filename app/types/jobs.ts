// app/types/jobs.ts

export type JobType = "remote" | "hybrid" | "onsite";

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
  experience_level: string;
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
  location: string;
  minSalary?: number;
  benefits?: string[];
}

export const DEFAULT_JOB_FILTERS: JobFilters = {
  search: "",
  jobType: "all",
  location: "",
  minSalary: undefined,
  benefits: [],
};
