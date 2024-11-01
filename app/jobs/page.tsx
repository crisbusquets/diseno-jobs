// app/jobs/page.tsx
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Link from "next/link";

export default async function JobListingsPage() {
  const supabase = createServerComponentClient({ cookies });

  const { data: jobListings } = await supabase
    .from("job_listings")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Trabajos de Diseño de Producto</h1>
            <Link
              href="/jobs/create"
              className="inline-flex items-center px-4 py-2 border border-transparent 
                       text-sm font-medium rounded-md text-white bg-blue-600 
                       hover:bg-blue-700"
            >
              Publicar Trabajo
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Job Count */}
        <div className="px-4 sm:px-0">
          <p className="text-gray-600">{jobListings?.length || 0} trabajos disponibles</p>
        </div>

        {/* Job Listings */}
        <div className="mt-6 space-y-6 px-4 sm:px-0">
          {jobListings?.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay trabajos publicados</h3>
              <p className="text-gray-500">Sé el primero en publicar una oferta de trabajo</p>
            </div>
          ) : (
            jobListings?.map((job) => (
              <div key={job.id} className="bg-white shadow rounded-lg overflow-hidden hover:shadow-md transition">
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">{job.title}</h2>
                      <p className="mt-1 text-base text-gray-600">{job.company}</p>
                    </div>
                    <span
                      className={`
                      px-3 py-1 rounded-full text-sm font-medium
                      ${
                        job.job_type === "remote"
                          ? "bg-green-100 text-green-800"
                          : job.job_type === "hybrid"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-blue-100 text-blue-800"
                      }
                    `}
                    >
                      {job.job_type === "remote" ? "Remoto" : job.job_type === "hybrid" ? "Híbrido" : "Presencial"}
                    </span>
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <svg
                        className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      {job.location || "Ubicación no especificada"}
                    </div>
                  </div>

                  {(job.salary_min || job.salary_max) && (
                    <div className="mt-2 text-sm text-gray-500">
                      Salario: {job.salary_min && `${job.salary_min.toLocaleString()}€`}
                      {job.salary_min && job.salary_max && " - "}
                      {job.salary_max && `${job.salary_max.toLocaleString()}€`}
                    </div>
                  )}

                  <div className="mt-4">
                    <p className="text-gray-600 line-clamp-3">{job.description}</p>
                  </div>

                  <div className="mt-6">
                    <Link
                      href={`/jobs/${job.id}`}
                      className="inline-flex items-center px-4 py-2 border border-transparent 
                               text-sm font-medium rounded-md text-white bg-blue-600 
                               hover:bg-blue-700"
                    >
                      Ver Detalles
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
