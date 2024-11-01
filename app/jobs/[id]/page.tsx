// app/jobs/[id]/page.tsx
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function JobDetailPage({ params: { id } }: { params: { id: string } }) {
  const supabase = createServerComponentClient({ cookies });

  const { data: job } = await supabase.from("job_listings").select("*").eq("id", id).single();

  if (!job) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <Link href="/jobs" className="text-blue-600 hover:text-blue-800 mr-4">
              ← Volver a Empleos
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-6">
            {/* Header Section */}
            <div className="border-b border-gray-200 pb-6">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
                  <p className="mt-1 text-lg text-gray-600">{job.company}</p>
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

              <div className="mt-4 flex items-center text-sm text-gray-500">
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

              {(job.salary_min || job.salary_max) && (
                <div className="mt-2 text-sm text-gray-500">
                  Salario: {job.salary_min && `${job.salary_min.toLocaleString()}€`}
                  {job.salary_min && job.salary_max && " - "}
                  {job.salary_max && `${job.salary_max.toLocaleString()}€`}
                </div>
              )}
            </div>

            {/* Description Section */}
            <div className="py-6 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Descripción del Puesto</h2>
              <div className="prose max-w-none text-gray-600">
                {job.description.split("\n").map((paragraph, index) => (
                  <p key={index} className="mb-4">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {/* Requirements Section */}
            <div className="py-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Requisitos</h2>
              <ul className="list-disc pl-5 space-y-2 text-gray-600">
                {job.requirements.map((requirement: string, index: number) => (
                  <li key={index}>{requirement}</li>
                ))}
              </ul>
            </div>

            {/* Apply Section */}
            <div className="mt-6 flex justify-center">
              <button
                className="inline-flex items-center px-6 py-3 border border-transparent 
                         text-base font-medium rounded-md shadow-sm text-white 
                         bg-blue-600 hover:bg-blue-700 focus:outline-none 
                         focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Aplicar a este trabajo
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
