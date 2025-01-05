import { Suspense } from "react";
import { getSupabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import ManageJobForm from "@/components/jobs/manage-job-form";
import JobCard from "@/components/jobs/cards/job-card";
import { formatDate } from "@/lib/utils/formatting";
import ManageJobLoading from "./loading";

async function ManageContent({ params }: { params: { token: string } }) {
  const supabase = getSupabase();

  try {
    // First get the job listing
    const { data: job, error: jobError } = await supabase
      .from("job_listings")
      .select("*")
      .eq("management_token", params.token)
      .single();

    if (jobError) throw new Error(`Failed to load job: ${jobError.message}`);
    if (!job) notFound();

    // Then get the benefits
    const { data: jobBenefits, error: benefitsError } = await supabase
      .from("job_benefits")
      .select("benefit_name, is_custom")
      .eq("job_id", job.id);

    if (benefitsError) throw new Error(`Failed to load benefits: ${benefitsError.message}`);

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
          <div className="bg-white rounded-lg shadow p-6 md:p-8">
            <h1 className="text-2xl font-semibold mb-6">Gestionar Oferta de Empleo</h1>

            {/* Job Status Information */}
            <div className="mb-8 space-y-4">
              <div className="bg-blue-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="font-medium text-blue-800 mb-1">Estado de la oferta</h2>
                    <p className="text-blue-600 text-sm">
                      {job.is_active ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Activa
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Inactiva
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="text-right text-sm text-blue-600">
                    <p>Publicada el {formatDate(job.created_at)}</p>
                    {job.activated_at && <p>Activada el {formatDate(job.activated_at)}</p>}
                  </div>
                </div>
              </div>

              {/* Current Job Preview */}
              <div className="border rounded-lg p-4">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Vista previa actual</h2>
                <JobCard job={jobWithBenefits} variant="detailed" showApplySection={false} />
              </div>
            </div>

            {/* Management Form */}
            <div className="border-t pt-8">
              <h2 className="text-lg font-medium text-gray-900 mb-6">Editar información</h2>
              <ManageJobForm job={jobWithBenefits} token={params.token} />
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error:", error);
    throw error; // This will trigger the error.tsx component
  }
}

export default function ManagePage({ params }: { params: { token: string } }) {
  return (
    <Suspense fallback={<ManageJobLoading />}>
      <ManageContent params={params} />
    </Suspense>
  );
}
