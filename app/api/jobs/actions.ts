// app/api/jobs/actions.ts
"use server";

import { getSupabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { JobFormData, ApiResponse } from "@/types";

export async function updateJob(formData: FormData): Promise<ApiResponse<void>> {
  const supabase = getSupabase();
  const token = formData.get("token");

  if (!token) {
    return {
      success: false,
      error: "Token de gestión no válido",
    };
  }

  try {
    // First get the current job data
    const { data: currentJob, error: fetchError } = await supabase
      .from("job_listings")
      .select("*")
      .eq("management_token", token)
      .single();

    if (fetchError || !currentJob) {
      return {
        success: false,
        error: "Oferta no encontrada",
      };
    }

    const benefitsString = formData.get("benefits") as string;
    const benefits = benefitsString ? JSON.parse(benefitsString) : [];

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
      salary_min: formData.get("salary_min") ? Number(formData.get("salary_min")) : null,
      salary_max: formData.get("salary_max") ? Number(formData.get("salary_max")) : null,
      application_method_type: formData.get("application_method_type"),
      application_method_value: formData.get("application_method_value"),
    };

    // Update job listing
    const { error: updateError } = await supabase.from("job_listings").update(updates).eq("management_token", token);

    if (updateError) {
      return {
        success: false,
        error: `Error al actualizar la oferta: ${updateError.message}`,
      };
    }

    // Update benefits
    if (benefits.length > 0) {
      // Delete existing benefits
      const { error: deleteError } = await supabase.from("job_benefits").delete().eq("job_id", currentJob.id);

      if (deleteError) {
        return {
          success: false,
          error: `Error al actualizar los beneficios: ${deleteError.message}`,
        };
      }

      // Insert new benefits
      const { error: benefitsError } = await supabase.from("job_benefits").insert(
        benefits.map((benefit: any) => ({
          job_id: currentJob.id,
          benefit_name: benefit.name,
          is_custom: benefit.isCustom || false,
        }))
      );

      if (benefitsError) {
        return {
          success: false,
          error: `Error al guardar los beneficios: ${benefitsError.message}`,
        };
      }
    }

    revalidatePath("/jobs");

    return { success: true };
  } catch (error) {
    console.error("Update error:", error);
    return {
      success: false,
      error: "Error al actualizar la oferta",
    };
  }
}

export async function deactivateJob(token: string): Promise<ApiResponse<void>> {
  const supabase = getSupabase();

  if (!token) {
    return {
      success: false,
      error: "Token de gestión no válido",
    };
  }

  try {
    const { error } = await supabase.from("job_listings").update({ is_active: false }).eq("management_token", token);

    if (error) {
      return {
        success: false,
        error: `Error al desactivar la oferta: ${error.message}`,
      };
    }

    revalidatePath("/jobs");
    return { success: true };
  } catch (error) {
    console.error("Deactivate error:", error);
    return {
      success: false,
      error: "Error al desactivar la oferta",
    };
  }
}

export async function trackJobEvent(jobId: number, eventType: "view" | "apply_click", source?: string) {
  const supabase = getSupabase();

  try {
    const { error } = await supabase.from("job_events").insert({
      job_id: jobId,
      event_type: eventType,
      source: source || "direct",
    });

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error("Tracking error:", error);
    return { success: false };
  }
}
