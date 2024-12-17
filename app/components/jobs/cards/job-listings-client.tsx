// app/components/jobs/cards/job-listings-client.tsx

"use client";

import { useState } from "react";
import Link from "next/link";
import JobCard from "./job-card";
import JobFilters from "@/components/jobs/forms/job-filters";
import { Job, JobFilters as JobFiltersType } from "@/types";
import { DEFAULT_JOB_FILTERS } from "@/lib/config/constants";

interface JobListingsClientProps {
  initialJobs: Job[];
}

export default function JobListingsClient({ initialJobs }: JobListingsClientProps) {
  const [filteredJobs, setFilteredJobs] = useState<Job[]>(initialJobs);
  const [filters, setFilters] = useState<JobFiltersType>(DEFAULT_JOB_FILTERS);

  const handleSearch = (value: string) => {
    setFilters((prev) => ({ ...prev, search: value }));
    applyFilters({ ...filters, search: value });
  };

  const handleFilterChange = (filterType: keyof JobFiltersType, value: any) => {
    setFilters((prev) => ({ ...prev, [filterType]: value }));
    applyFilters({ ...filters, [filterType]: value });
  };

  const applyFilters = (currentFilters: JobFiltersType) => {
    let result = initialJobs;

    // Apply search filter
    if (currentFilters.search) {
      const searchTerm = currentFilters.search.toLowerCase();
      result = result.filter(
        (job) =>
          job.title.toLowerCase().includes(searchTerm) ||
          job.company.toLowerCase().includes(searchTerm) ||
          job.description.toLowerCase().includes(searchTerm)
      );
    }

    // Apply job type filter
    if (currentFilters.jobType !== "all") {
      result = result.filter((job) => job.job_type === currentFilters.jobType);
    }

    // Apply location filters
    if (currentFilters.locations.length > 0) {
      result = result.filter((job) => {
        // If job has no location, don't include it in location-filtered results
        if (!job.location) return false;

        // Check if any of the selected locations match the job location
        return currentFilters.locations.some((location) =>
          job.location?.toLowerCase().includes(location.name.toLowerCase())
        );
      });
    }

    setFilteredJobs(result);
  };

  return (
    <div className="space-y-6">
      <JobFilters onSearch={handleSearch} onFilterChange={handleFilterChange} initialFilters={filters} />

      {filteredJobs.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron ofertas</h3>
          <p className="text-gray-500">Prueba a cambiar los filtros de búsqueda</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredJobs.map((job) => (
            <Link key={job.id} href={`/jobs/${job.id}`}>
              <JobCard job={job} variant="list" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
