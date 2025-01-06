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

  if (!token) {
    return { success: false, error: "Token no válido" };
  }

  try {
    // Parse benefits
    const benefitsString = formData.get("benefits") as string;
    const benefits = benefitsString ? JSON.parse(benefitsString) : [];

    // Prepare job updates
    const updates = {
      title: formData.get("title"),
      company: formData.get("company"),
      company_email: formData.get("company_email"),
      company_logo: formData.get("company_logo"),
      description: formData.get("description"),
      location: formData.get("location") || null,
      job_type: formData.get("job_type"),
      salary_min: formData.get("salary_min") ? Number(formData.get("salary_min")) : null,
      salary_max: formData.get("salary_max") ? Number(formData.get("salary_max")) : null,
      application_method_type: formData.get("application_method_type"),
      application_method_value: formData.get("application_method_value"),
    };

    // Update job
    const { data: job, error: jobError } = await supabase
      .from("job_listings")
      .update(updates)
      .eq("management_token", token)
      .select()
      .single();

    if (jobError) {
      return { success: false, error: jobError.message };
    }

    if (!job) {
      return { success: false, error: "No se encontró la oferta" };
    }

    // First, let's check what benefits already exist
    const { data: existingBenefits, error: checkError } = await supabase
      .from("job_benefits")
      .select("*")
      .eq("job_id", job.id);

    console.log("Existing benefits:", existingBenefits);

    // Delete old benefits
    const { error: deleteError } = await supabase.from("job_benefits").delete().eq("job_id", job.id);

    console.log("Delete result:", deleteError || "success");

    if (deleteError) {
      return { success: false, error: "Error al eliminar beneficios existentes" };
    }

    // Only try to insert if we have benefits
    if (benefits && benefits.length > 0) {
      const benefitsToInsert = benefits.map((benefit) => {
        // Only include fields we know are in the table
        const insertData = {
          job_id: job.id,
          benefit_name: benefit.name,
          is_custom: Boolean(benefit.isCustom),
        };

        console.log("Preparing to insert benefit:", insertData);
        return insertData;
      });

      // Try inserting benefits one by one to identify problem records
      for (const benefit of benefitsToInsert) {
        const { error: insertError } = await supabase.from("job_benefits").insert(benefit);

        if (insertError) {
          console.error("Error inserting benefit:", benefit, insertError);
          return {
            success: false,
            error: `Error al guardar el beneficio "${benefit.benefit_name}": ${insertError.message}`,
          };
        }
      }
    }

    revalidatePath("/jobs");
    return { success: true };
  } catch (error) {
    console.error("Error en updateJob:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error inesperado al actualizar la oferta",
    };
  }
}

export async function deactivateJob(token: string) {
  const supabase = getSupabase();

  try {
    const { error } = await supabase.from("job_listings").update({ is_active: false }).eq("management_token", token);

    if (error) throw error;

    revalidatePath("/jobs");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to deactivate job posting",
    };
  }
}
