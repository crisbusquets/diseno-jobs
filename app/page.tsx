// app/page.tsx
import { getSupabase } from "@/lib/supabase";
import JobListingsClient from "@/components/jobs/cards/job-listings-client";
import { unstable_noStore as noStore } from "next/cache";
import { PageTracker } from "@/components/tracking/page-tracker";

export default async function HomePage() {
  noStore();
  const supabase = getSupabase();

  // First get all active job listings
  const { data: jobListings } = await supabase
    .from("job_listings")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  // Then get all benefits for these jobs
  let jobsWithBenefits = [];

  if (jobListings) {
    // Get all job IDs
    const jobIds = jobListings.map((job) => job.id);

    // Fetch benefits for all jobs in a single query
    const { data: allBenefits } = await supabase.from("job_benefits").select("*").in("job_id", jobIds);

    // Map benefits to their respective jobs
    jobsWithBenefits = jobListings.map((job) => ({
      ...job,
      benefits:
        allBenefits
          ?.filter((benefit) => benefit.job_id === job.id)
          .map((benefit) => ({
            name: benefit.benefit_name,
            icon: "✨", // You might want to map this based on the benefit name
            isCustom: benefit.is_custom,
          })) || [],
    }));
  }

  // Get current time for debugging
  const now = new Date().toLocaleTimeString();

  return (
    <main className="min-h-screen bg-gray-50">
      <PageTracker type="homepage_view" />
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Debug timestamp */}
        <div className="px-4 sm:px-0 flex justify-between">
          <p className="text-sm text-gray-400">{jobsWithBenefits?.length || 0} trabajos disponibles</p>
          <p className="text-sm text-gray-400">Última actualización: {now}</p>
        </div>

        {/* Job Listings with Filters */}
        <div className="mt-6">
          {jobsWithBenefits?.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay trabajos publicados</h3>
              <p className="text-gray-500">Sé el primero en publicar una oferta de trabajo</p>
            </div>
          ) : (
            <JobListingsClient initialJobs={jobsWithBenefits} />
          )}
        </div>
      </div>
    </main>
  );
}
