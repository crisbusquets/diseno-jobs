// app/page.tsx
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Link from "next/link";

export default async function HomePage() {
  const supabase = createServerComponentClient({ cookies });

  const { data: jobListings } = await supabase
    .from("job_listings")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">DisñoJobs</h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              La mejor plataforma de empleos para diseñadores de producto en español
            </p>
            <div className="mt-5 max-w-md mx-auto flex justify-center gap-3">
              <Link
                href="/jobs"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Ver Empleos
              </Link>
              <Link
                href="/jobs/create"
                className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Publicar Empleo
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Jobs Section */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">Empleos Destacados</h2>
          <p className="mt-3 text-xl text-gray-500">Las últimas oportunidades para diseñadores de producto</p>
        </div>

        {/* Job Listings */}
        <div className="mt-12 space-y-6">
          {jobListings?.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay trabajos publicados aún</h3>
              <p className="text-gray-500 mb-6">Sé el primero en publicar una oferta de trabajo</p>
              <Link
                href="/jobs/create"
                className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Publicar Empleo
              </Link>
            </div>
          ) : (
            jobListings?.slice(0, 5).map((job) => (
              <div key={job.id} className="bg-white shadow rounded-lg overflow-hidden hover:shadow-md transition">
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        <Link href={`/jobs/${job.id}`} className="hover:text-blue-600">
                          {job.title}
                        </Link>
                      </h3>
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
                    <p className="text-gray-600 line-clamp-2">{job.description}</p>
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

          {jobListings && jobListings.length > 5 && (
            <div className="text-center mt-8">
              <Link
                href="/jobs"
                className="inline-flex items-center px-6 py-3 border border-gray-300 
                         text-base font-medium rounded-md text-gray-700 bg-white 
                         hover:bg-gray-50"
              >
                Ver Todos los Empleos
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
