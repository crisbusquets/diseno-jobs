// app/jobs/success/page.tsx
import { redirect } from "next/navigation";
import Link from "next/link";
import Stripe from "stripe";
import { getSupabase } from "@/lib/supabase";
import { sendJobConfirmationEmail } from "@/lib/email";
import JobCard from "@/components/jobs/cards/job-card";
import CopyLinkButton from "@/components/common/buttons/copy-link-button";

interface PageProps {
  searchParams: { session_id?: string };
}

export default async function SuccessPage({ searchParams }: PageProps) {
  const { session_id: sessionId } = await searchParams;

  if (!sessionId) {
    redirect("/");
  }

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2023-10-16",
    });

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const jobId = session.metadata?.jobId;

    if (!jobId) {
      throw new Error("No job ID found in session metadata");
    }

    const supabase = getSupabase();

    // First update and get the job
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
      console.error("Failed to update job status:", updateError);
      throw new Error("Failed to update job status");
    }

    // Then get the benefits separately
    const { data: jobBenefits, error: benefitsError } = await supabase
      .from("job_benefits")
      .select("benefit_name, is_custom")
      .eq("job_id", jobId);

    if (benefitsError) {
      console.error("Failed to fetch benefits:", benefitsError);
      // Don't throw error here, continue with empty benefits
    }

    // Transform benefits
    const benefits =
      jobBenefits?.map((benefit) => ({
        name: benefit.benefit_name,
        isCustom: benefit.is_custom,
      })) || [];

    const managementUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/jobs/manage/${job.management_token}`;

    try {
      // Send confirmation email
      await sendJobConfirmationEmail({
        to: job.company_email,
        jobTitle: job.title,
        companyName: job.company,
        companyEmail: job.company_email,
        companyLogo: job.company_logo,
        managementUrl,
        jobType: job.job_type,
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

      console.log("Confirmation email sent successfully");
    } catch (emailError) {
      console.error("Failed to send confirmation email:", emailError);
      // Continue execution even if email fails
    }

    // Create a job object that includes the transformed benefits
    const jobWithBenefits = {
      ...job,
      benefits,
    };

    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow p-6 md:p-8">
            {/* Success Icon */}
            <div className="mb-6">
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                <svg
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>

            {/* Success Message */}
            <h1 className="text-2xl font-semibold text-center text-gray-900 mb-2">¡Tu oferta ha sido publicada!</h1>
            <p className="text-gray-600 text-center mb-8">Tu oferta ya está disponible en DisñoJobs</p>

            {/* Job Details */}
            <div className="mb-6">
              <JobCard job={jobWithBenefits} variant="detailed" showApplySection={false} />
            </div>

            {/* Management Link Section */}
            <div className="bg-blue-50 rounded-lg p-4 mb-4">
              <h3 className="font-medium text-blue-900 mb-2">Enlace de gestión</h3>
              <p className="text-blue-800 text-sm mb-4">Guarda este enlace para gestionar tu oferta en el futuro:</p>
              <div className="bg-white p-3 rounded border border-blue-200 break-all text-sm text-blue-600 mb-3">
                {managementUrl}
              </div>
              <div className="flex space-x-3 items-center">
                <CopyLinkButton url={managementUrl} />
                <Link href={managementUrl} className="text-sm text-blue-700 hover:text-blue-800 font-medium">
                  Gestionar oferta →
                </Link>
              </div>
            </div>

            {/* Email Sent Confirmation */}
            <div className="bg-green-50 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">Email de confirmación enviado</h3>
                  <p className="mt-1 text-sm text-green-600">
                    Hemos enviado un email a {job.company_email} con el enlace de gestión y los detalles de tu oferta.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <Link
                href={`/jobs/${job.id}`}
                className="block w-full py-3 px-4 text-center bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Ver mi publicación
              </Link>

              <Link
                href="/"
                className="block w-full py-3 px-4 text-center bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
              >
                Volver al inicio
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error in success page:", error);
    redirect("/");
  }
}
