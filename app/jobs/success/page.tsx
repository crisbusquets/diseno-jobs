// app/jobs/success/page.tsx
import { Suspense } from "react";
import { redirect } from "next/navigation";
import Stripe from "stripe";
import { getSupabase } from "@/lib/supabase";
import { sendJobConfirmationEmail } from "@/lib/email";
import SuccessLoading from "./loading";
import { SuccessContent } from "./success-content";

async function Success({ searchParams }: { searchParams: { session_id?: string } }) {
  const { session_id: sessionId } = searchParams;

  if (!sessionId) {
    redirect("/");
  }

  try {
    // Initialize Stripe
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2023-10-16",
    });

    // Get session
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const jobId = session.metadata?.jobId;

    if (!jobId) {
      throw new Error("No job ID found in session metadata");
    }

    const supabase = getSupabase();

    // Update and get the job
    const { data: job, error: updateError } = await supabase
      .from("job_listings")
      .update({
        is_active: true,
        stripe_payment_id: session.id,
        activated_at: new Date().toISOString(),
      })
      .eq("id", jobId)
      .select()
      .single();

    if (updateError || !job) {
      throw new Error(`Failed to update job status: ${updateError?.message || "Job not found"}`);
    }

    // Get benefits
    const { data: jobBenefits, error: benefitsError } = await supabase
      .from("job_benefits")
      .select("benefit_name, is_custom")
      .eq("job_id", jobId);

    if (benefitsError) {
      console.error("Failed to fetch benefits:", benefitsError);
    }

    // Transform benefits
    const benefits =
      jobBenefits?.map((benefit) => ({
        name: benefit.benefit_name,
        isCustom: benefit.is_custom,
      })) || [];

    const managementUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/jobs/manage/${job.management_token}`;

    // Send confirmation email
    let emailSent = true;
    try {
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
        benefits,
        applicationMethod: {
          type: job.application_method_type,
          value: job.application_method_value,
        },
      });
    } catch (emailError) {
      console.error("Failed to send confirmation email:", emailError);
      emailSent = false;
    }

    const jobWithBenefits = {
      ...job,
      benefits,
    };

    return <SuccessContent job={jobWithBenefits} managementUrl={managementUrl} emailSent={emailSent} />;
  } catch (error) {
    console.error("Error al cargar la página de confirmación:", error);
    throw error; // This will trigger the error.tsx component
  }
}

export default function SuccessPage({ searchParams }: { searchParams: { session_id?: string } }) {
  return (
    <Suspense fallback={<SuccessLoading />}>
      <Success searchParams={searchParams} />
    </Suspense>
  );
}
