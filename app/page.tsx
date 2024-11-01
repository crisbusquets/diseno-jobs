// app/page.tsx
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import JobListingsClient from "./components/JobListingsClient";

export default async function HomePage() {
  const supabase = createServerComponentClient({ cookies });

  const { data: jobListings } = await supabase
    .from("job_listings")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Job Count */}
        <div className="px-4 sm:px-0">
          <p className="text-gray-600">{jobListings?.length || 0} trabajos disponibles</p>
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
