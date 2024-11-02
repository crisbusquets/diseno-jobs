// app/actions/jobs.ts
"use server";

import { getSupabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function createJob(formData: FormData) {
  const supabase = getSupabase();

  // Parse the benefits array from JSON string
  const benefitsString = formData.get("benefits") as string;
  const benefits = benefitsString ? JSON.parse(benefitsString) : [];

  // Get salary values and convert to numbers
  const salaryMin = formData.get("salary_min") ? Number(formData.get("salary_min")) : null;
  const salaryMax = formData.get("salary_max") ? Number(formData.get("salary_max")) : null;

  const jobData = {
    title: formData.get("title"),
    company: formData.get("company"),
    company_email: formData.get("company_email"),
    description: formData.get("description"),
    location: formData.get("location") || null,
    job_type: formData.get("job_type"),
    salary_min: salaryMin,
    salary_max: salaryMax,
    benefits: benefits,
    is_active: false,
  };

  console.log("Attempting to insert job data:", jobData);

  try {
    const { data, error } = await supabase.from("job_listings").insert(jobData).select().single();

    if (error) {
      console.error("Supabase error:", error);
      return {
        success: false,
        error: `Database error: ${error.message}`,
        details: error,
      };
    }

    revalidatePath("/jobs");

    return {
      success: true,
      jobId: data.id,
      managementToken: data.management_token,
    };
  } catch (error) {
    console.error("Detailed error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create job posting",
      details: error,
    };
  }
}