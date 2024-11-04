// app/page.tsx
import { getSupabase } from "@/lib/supabase";
import JobListingsClient from "@/components/job-listings-client";
import { unstable_noStore as noStore } from "next/cache";

export default async function HomePage() {
  noStore();
  const supabase = getSupabase();

  const { data: jobListings } = await supabase
    .from("job_listings")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  // Get current time for debugging
  const now = new Date().toLocaleTimeString();

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Debug timestamp */}
        <div className="px-4 sm:px-0 flex justify-between items-center">
          <p className="text-gray-600">{jobListings?.length || 0} trabajos disponibles</p>
          <p className="text-sm text-gray-400">Última actualización: {now}</p>
        </div>

        {/* Job Listings with Filters */}
        <div className="mt-6">
          {jobListings?.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay trabajos publicados</h3>
              <p className="text-gray-500">Sé el primero en publicar una oferta de trabajo</p>
            </div>
          ) : (
            <JobListingsClient initialJobs={jobListings || []} />
          )}
        </div>
      </div>
    </main>
  );
}
