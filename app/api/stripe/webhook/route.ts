// app/api/webhook/stripe/route.ts

import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { getSupabase } from "@/lib/supabase";
import { sendJobConfirmationEmail } from "@/lib/email";
import { ApiResponse } from "@/types";
import { SITE_CONFIG } from "@/lib/config/constants";
import { trackJobEvent } from "@/api/jobs/actions";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

export async function POST(req: Request): Promise<NextResponse<ApiResponse<{ received: boolean }>>> {
  const body = await req.text();
  const signature = headers().get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ success: false, error: "No signature provided" }, { status: 400 });
  }

  try {
    const event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);

    if (event.type === "checkout.session.completed") {
      await handleCheckoutComplete(event.data.object as Stripe.Checkout.Session);
    }

    return NextResponse.json({ success: true, data: { received: true } });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Webhook handler failed",
      },
      { status: 400 }
    );
  }
}

async function handleCheckoutComplete(session: Stripe.Checkout.Session) {
  const jobId = session.metadata?.jobId;
  if (!jobId) {
    throw new Error("No job ID found in session metadata");
  }

  const supabase = getSupabase();

  try {
    // Track successful job submission
    await trackJobEvent(parseInt(jobId), "job_submit");

    // First get the current job data
    const { data: currentJob, error: fetchError } = await supabase
      .from("job_listings")
      .select("*")
      .eq("id", jobId)
      .single();

    if (fetchError || !currentJob) {
      throw new Error(`Failed to fetch job: ${fetchError?.message}`);
    }

    // Then update while preserving all fields
    const { data: job, error: updateError } = await supabase
      .from("job_listings")
      .update({
        ...currentJob, // Keep all existing data
        is_active: true,
        stripe_payment_id: session.id,
        activated_at: new Date().toISOString(),
      })
      .eq("id", jobId)
      .select()
      .single();

    if (updateError) {
      throw new Error(`Failed to update job: ${updateError.message}`);
    }

    if (!job) {
      throw new Error("Job not found after update");
    }

    // Get the benefits for the email
    const { data: jobBenefits, error: benefitsError } = await supabase
      .from("job_benefits")
      .select("benefit_name, is_custom")
      .eq("job_id", jobId);

    if (benefitsError) {
      console.error("Error fetching benefits:", benefitsError);
    }

    // Transform benefits to the format expected by email
    const benefits =
      jobBenefits?.map((benefit) => ({
        name: benefit.benefit_name,
        isCustom: benefit.is_custom,
      })) || [];

    // Send confirmation email
    const managementUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/jobs/manage/${job.management_token}`;

    await sendJobConfirmationEmail({
      to: job.company_email,
      jobTitle: job.title,
      companyName: job.company,
      companyEmail: job.company_email,
      companyLogo: job.company_logo,
      managementUrl,
      jobType: job.job_type,
      experienceLevel: job.experience_level,
      contractType: job.contract_type,
      location: job.location,
      salaryMin: job.salary_min,
      salaryMax: job.salary_max,
      description: job.description,
      benefits: benefits,
      applicationMethod: {
        type: job.application_method_type,
        value: job.application_method_value,
      },
    });
  } catch (error) {
    console.error("Error in checkout completion:", error);
    throw error;
  }
}
