// app/components/JobListingsClient.tsx
"use client";
import { useState } from "react";
import Link from "next/link";
import JobFilters from "@/components/job-filters";

export default function JobListingsClient({ initialJobs }) {
  const [filteredJobs, setFilteredJobs] = useState(initialJobs);
  const [filters, setFilters] = useState({
    search: "",
    jobType: "all",
    location: "",
  });

  const handleSearch = (value) => {
    setFilters((prev) => ({ ...prev, search: value }));
    applyFilters({ ...filters, search: value });
  };

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({ ...prev, [filterType]: value }));
    applyFilters({ ...filters, [filterType]: value });
  };

  const applyFilters = (currentFilters) => {
    let result = initialJobs;

    // Apply search filter
    if (currentFilters.search) {
      result = result.filter(
        (job) =>
          job.title.toLowerCase().includes(currentFilters.search.toLowerCase()) ||
          job.company.toLowerCase().includes(currentFilters.search.toLowerCase())
      );
    }

    // Apply job type filter
    if (currentFilters.jobType !== "all") {
      result = result.filter((job) => job.job_type === currentFilters.jobType);
    }

    // Apply location filter
    if (currentFilters.location) {
      result = result.filter((job) => job.location?.toLowerCase().includes(currentFilters.location.toLowerCase()));
    }

    setFilteredJobs(result);
  };

  return (
    <div className="space-y-6">
      <JobFilters onSearch={handleSearch} onFilterChange={handleFilterChange} />

      <div className="space-y-6">
        {filteredJobs.map((job) => (
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
                  Salario: {job.salary_min && `${job.salary_min.toLocaleString('es-ES')}€`}
                  {job.salary_min && job.salary_max && " - "}
                  {job.salary_max && `${job.salary_min.toLocaleString('es-ES')}€`}
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
        ))}
      </div>
    </div>
  );
}
