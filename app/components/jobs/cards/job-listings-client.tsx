"use client";

import { useState } from "react";
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

  // Extract all unique benefits from jobs
  const availableBenefits = Array.from(
    new Set(
      initialJobs
        .flatMap((job) => job.benefits || [])
        .map((benefit) => JSON.stringify({ name: benefit.name, icon: benefit.icon }))
    )
  ).map((benefitString) => JSON.parse(benefitString));

  console.log("Initial jobs:", initialJobs); // Debug log
  console.log("Available benefits:", availableBenefits); // Debug log

  const handleSearch = (value: string) => {
    setFilters((prev) => ({ ...prev, search: value }));
    applyFilters({ ...filters, search: value });
  };

  const handleFilterChange = (filterType: keyof JobFiltersType, value: any) => {
    console.log("Filter change:", filterType, value); // Debug log
    const newFilters = { ...filters, [filterType]: value };
    setFilters(newFilters);
    applyFilters(newFilters);
  };

  const applyFilters = (currentFilters: JobFiltersType) => {
    console.log("Applying filters:", currentFilters); // Debug log
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

    // Apply location filter
    if (currentFilters.location) {
      result = result.filter((job) => {
        if (!job.location) return false;
        return job.location.toLowerCase().includes(currentFilters.location.toLowerCase());
      });
    }

    // Apply minimum salary filter
    if (currentFilters.minSalary) {
      result = result.filter((job) => {
        if (job.salary_min) {
          return job.salary_min >= currentFilters.minSalary;
        }
        if (job.salary_max) {
          return job.salary_max >= currentFilters.minSalary;
        }
        return false;
      });
    }

    // Apply benefits filter
    if (currentFilters.benefits && currentFilters.benefits.length > 0) {
      result = result.filter((job) => {
        // If job has no benefits, it doesn't match
        if (!job.benefits || !Array.isArray(job.benefits) || job.benefits.length === 0) {
          console.log("Job has no benefits:", job.title); // Debug log
          return false;
        }

        // Check if job has all selected benefits
        const hasAllBenefits = currentFilters.benefits.every((requiredBenefit) => {
          const found = job.benefits.some((jobBenefit) => {
            const match = jobBenefit.name.toLowerCase() === requiredBenefit.toLowerCase();
            console.log("Comparing benefit:", jobBenefit.name, "with", requiredBenefit, "Match:", match); // Debug log
            return match;
          });
          return found;
        });

        console.log("Job:", job.title, "Has all benefits:", hasAllBenefits); // Debug log
        return hasAllBenefits;
      });
    }

    console.log("Filtered results:", result); // Debug log
    setFilteredJobs(result);
  };

  return (
    <div className="space-y-6">
      <JobFilters
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
        initialFilters={filters}
        availableBenefits={availableBenefits}
      />

      {filteredJobs.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron ofertas</h3>
          <p className="text-gray-500">Prueba a cambiar los filtros de búsqueda</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredJobs.map((job) => (
            <div
              key={job.id}
              className="group cursor-pointer"
              onClick={() => (window.location.href = `/jobs/${job.id}`)}
            >
              <JobCard job={job} variant="list" showApplySection={false} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
