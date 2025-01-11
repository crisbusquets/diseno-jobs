// app/actions.ts
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
    experience_level: formData.get("experience_level"),
    contract_type: formData.get("contract_type") || null,
    salary_min: salaryMin,
    salary_max: salaryMax,
    benefits: benefits,
    is_active: false,
    management_token: crypto.randomUUID(),
  };

  try {
    const { data, error } = await supabase.from("job_listings").insert(jobData).select().single();

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

  const benefitsString = formData.get("benefits") as string;
  const benefits = benefitsString ? JSON.parse(benefitsString) : [];

  const salaryMin = formData.get("salary_min") ? Number(formData.get("salary_min")) : null;
  const salaryMax = formData.get("salary_max") ? Number(formData.get("salary_max")) : null;

  const updates = {
    title: formData.get("title"),
    company: formData.get("company"),
    company_email: formData.get("company_email"),
    company_logo: formData.get("company_logo"),
    description: formData.get("description"),
    location: formData.get("location") || null,
    job_type: formData.get("job_type"),
    experience_level: formData.get("experience_level"),
    contract_type: formData.get("contract_type"),
    salary_min: salaryMin,
    salary_max: salaryMax,
    application_method_type: formData.get("application_method_type"),
    application_method_value: formData.get("application_method_value"),
  };

  try {
    // First update the job listing
    const { data: job, error: jobError } = await supabase
      .from("job_listings")
      .update(updates)
      .eq("management_token", token)
      .select()
      .single();

    if (jobError) throw jobError;

    // Then update benefits if we have the job
    if (benefits.length > 0 && job) {
      // First, delete existing benefits
      const { error: deleteError } = await supabase.from("job_benefits").delete().eq("job_id", job.id);

      if (deleteError) throw deleteError;

      // Then insert new benefits
      const { error: benefitsError } = await supabase.from("job_benefits").insert(
        benefits.map((benefit: any) => ({
          job_id: job.id,
          benefit_name: benefit.name,
          is_custom: benefit.isCustom || false,
        }))
      );

      if (benefitsError) throw benefitsError;
    }

    revalidatePath("/jobs");

    return { success: true };
  } catch (error) {
    console.error("Update error:", error);
    return {
      success: false,
      error: "Failed to update job posting",
    };
  }
}

export async function deactivateJob(token: string) {
  const supabase = getSupabase();

  try {
    const { error } = await supabase.from("job_listings").update({ is_active: false }).eq("management_token", token);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: "Failed to deactivate job posting",
    };
  }
}
