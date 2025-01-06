// app/api/webhook/stripe/route.ts

import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { getSupabase } from "@/lib/supabase";
import { sendJobConfirmationEmail } from "@/lib/email";
import { ApiResponse } from "@/types";
import { SITE_CONFIG } from "@/lib/config/constants";

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

  // Update job status
  const { data: job, error: updateError } = await supabase
    .from("job_listings")
    .update({
      is_active: true,
      stripe_payment_id: session.id,
      activated_at: new Date().toISOString(),
    })
    .eq("id", jobId)
    .select() // Make sure we're getting all fields
    .single();

  // For debugging, add this:
  console.log("Job data in webhook:", JSON.stringify(job, null, 2));

  if (updateError) {
    throw new Error(`Failed to update job: ${updateError.message}`);
  }

  if (!job) {
    throw new Error("Job not found after update");
  }

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
    experience_level: job.experience_level,
    location: job.location,
    salaryMin: job.salary_min,
    salaryMax: job.salary_max,
    description: job.description,
    benefits: job.benefits,
    applicationMethod: {
      type: job.application_method_type,
      value: job.application_method_value,
    },
  });

  console.log(`Job ${jobId} activated and confirmation email sent`);
}
