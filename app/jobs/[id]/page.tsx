// app/jobs/[id]/page.tsx
import { Suspense } from "react";
import { getSupabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import JobCard from "@/components/jobs/cards/job-card";
import { formatDate } from "@/lib/utils/formatting";
import JobLoading from "./loading";
import { ViewTracker } from "@/components/jobs/tracking/view-tracker";

async function JobContent({ params }: { params: { id: string } }) {
  const supabase = getSupabase();

  try {
    // Get the job listing
    const { data: job, error: jobError } = await supabase.from("job_listings").select("*").eq("id", params.id).single();

    if (jobError) throw new Error(`Error al cargar la oferta: ${jobError.message}`);
    if (!job) notFound();

    // Get the benefits
    const { data: jobBenefits, error: benefitsError } = await supabase
      .from("job_benefits")
      .select("benefit_name, is_custom")
      .eq("job_id", job.id);

    if (benefitsError) throw new Error(`Error al cargar los beneficios: ${benefitsError.message}`);

    // Transform benefits to the format expected by components
    const benefits =
      jobBenefits?.map((benefit) => ({
        name: benefit.benefit_name,
        isCustom: benefit.is_custom,
      })) || [];

    // Combine job data with benefits
    const jobWithBenefits = {
      ...job,
      benefits,
    };

    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto px-4">
          <ViewTracker jobId={params.id} />
          <JobCard job={jobWithBenefits} variant="detailed" />
          <div className="mt-4 text-sm text-center text-gray-500">
            <p>Publicado el {formatDate(job.created_at)}</p>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error loading job:", error);
    throw error;
  }
}

export default function JobPage({ params }: { params: { id: string } }) {
  return (
    <Suspense fallback={<JobLoading />}>
      <JobContent params={params} />
    </Suspense>
  );
}
