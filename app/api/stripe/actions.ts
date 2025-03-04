"use server";

import Stripe from "stripe";
import { getSupabase } from "@/lib/supabase";
import { JobFormData, ApiResponse } from "@/types";
import { SITE_CONFIG } from "@/lib/config/constants";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

export async function createPaymentSession(
  data: JobFormData
): Promise<ApiResponse<{ sessionId: string; url: string | null }>> {
  try {
    const supabase = getSupabase();

    // Create job listing first
    const { data: job, error: dbError } = await supabase
      .from("job_listings")
      .insert({
        title: data.title,
        company: data.company,
        company_email: data.company_email,
        company_logo: data.company_logo,
        description: data.description,
        location: data.location || null,
        job_type: data.job_type,
        experience_level: data.experience_level,
        contract_type: data.contract_type || null,
        salary_min: data.salary_min || null,
        salary_max: data.salary_max || null,
        application_method_type: data.application_method_type,
        application_method_value: data.application_method_value,
        is_active: false,
        management_token: crypto.randomUUID(),
      })
      .select()
      .single();

    if (dbError) {
      console.error("Database error:", dbError);
      return {
        success: false,
        error: `Error al crear la oferta: ${dbError.message}`,
      };
    }

    // Insert benefits if provided
    if (data.benefits?.length > 0) {
      const { error: benefitsError } = await supabase.from("job_benefits").insert(
        data.benefits.map((benefit) => ({
          job_id: job.id,
          benefit_name: benefit.name,
          is_custom: benefit.isCustom || false,
        }))
      );

      if (benefitsError) {
        // Clean up the job listing if benefits insertion fails
        await supabase.from("job_listings").delete().eq("id", job.id);
        return {
          success: false,
          error: `Error al guardar los beneficios: ${benefitsError.message}`,
        };
      }
    }

    try {
      // Create Stripe session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "eur",
              product_data: {
                name: SITE_CONFIG.title,
                description: `Oferta: ${data.title} - ${data.company}`,
              },
              unit_amount: SITE_CONFIG.jobPrice,
            },
            quantity: 1,
          },
        ],
        metadata: {
          jobId: job.id,
          managementToken: job.management_token,
        },
        mode: "payment",
        success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/jobs/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/jobs/create`,
      });

      return {
        success: true,
        data: {
          sessionId: session.id,
          url: session.url,
        },
      };
    } catch (stripeError) {
      // Clean up job listing and benefits if Stripe session creation fails
      await supabase.from("job_listings").delete().eq("id", job.id);

      console.error("Stripe error:", stripeError);
      return {
        success: false,
        error: "Error al procesar el pago. Por favor, inténtalo de nuevo.",
      };
    }
  } catch (error) {
    console.error("Payment session error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error al crear la sesión de pago",
    };
  }
}
