// app/actions/jobs.ts
"use server";

import { getSupabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function createJob(formData: FormData) {
  const supabase = getSupabase();

  const benefitsString = formData.get("benefits") as string;
  const benefits = benefitsString ? JSON.parse(benefitsString) : [];

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
    management_token: crypto.randomUUID(),
  };

  try {
    const { data, error } = await supabase
      .from("job_listings")
      .insert(jobData)
      .select()
      .single();

    if (error) {
      return {
        success: false,
        error: `Database error: ${error.message}`,
      };
    }

    revalidatePath("/jobs");

    return {
      success: true,
      jobId: data.id,
      managementToken: data.management_token,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create job posting",
    };
  }
}

export async function updateJob(formData: FormData) {
  const supabase = getSupabase();
  const token = formData.get("token");

  const updates = {
    title: formData.get("title"),
    description: formData.get("description"),
  };

  try {
    const { error } = await supabase
      .from("job_listings")
      .update(updates)
      .eq("management_token", token);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: "Failed to update job posting",
    };
  }
}

export async function deactivateJob(token: string) {
  const supabase = getSupabase();

  try {
    const { error } = await supabase
      .from("job_listings")
      .update({ is_active: false })
      .eq("management_token", token);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: "Failed to deactivate job posting",
    };
  }
}
