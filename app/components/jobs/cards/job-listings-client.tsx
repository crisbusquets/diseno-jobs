// components/jobs/cards/job-listings-client.tsx
"use client";

import { useState, useEffect } from "react";
import { Job, JobFilters, DEFAULT_JOB_FILTERS } from "@/types";
import JobCard from "./job-card";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import JobFilters from "@/components/jobs/forms/job-filters";
import { BENEFITS_PRESETS } from "@/lib/translations/es";
import { t } from "@/lib/translations/utils";

interface JobListingsClientProps {
  initialJobs: Job[];
}

const JobCardSkeleton = () => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Skeleton className="h-12 w-12 rounded-lg" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-5 w-1/3" />
            <Skeleton className="h-4 w-1/4" />
          </div>
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
        <div className="mt-4 space-y-3">
          <div className="flex gap-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </CardContent>
    </Card>
  );
};

export default function JobListingsClient({ initialJobs }: JobListingsClientProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>(initialJobs);
  const [filters, setFilters] = useState<JobFilters>(DEFAULT_JOB_FILTERS);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const applyFilters = (currentFilters: JobFilters) => {
    let result = initialJobs;

    // Text search
    if (currentFilters.search) {
      const searchTerm = currentFilters.search.toLowerCase();
      result = result.filter(
        (job) =>
          job.title.toLowerCase().includes(searchTerm) ||
          job.company.toLowerCase().includes(searchTerm) ||
          job.description.toLowerCase().includes(searchTerm)
      );
    }

    // Job type
    if (currentFilters.jobType !== "all") {
      result = result.filter((job) => job.job_type === currentFilters.jobType);
    }

    // Remote only filter
    if (currentFilters.remoteOnly) {
      result = result.filter((job) => job.job_type === "remote");
    }

    // Location
    if (currentFilters.location && currentFilters.location !== "worldwide") {
      result = result.filter((job) => {
        if (!job.location) return false;
        return job.location.toLowerCase().includes(currentFilters.location.toLowerCase());
      });
    }

    // Minimum salary
    if (currentFilters.minSalary) {
      result = result.filter((job) => {
        if (job.salary_min) return job.salary_min >= currentFilters.minSalary!;
        if (job.salary_max) return job.salary_max >= currentFilters.minSalary!;
        return false;
      });
    }

    // Benefits filter
    if (currentFilters.benefits?.length) {
      result = result.filter((job) => {
        if (!job.benefits?.length) return false;

        return currentFilters.benefits!.every((requiredBenefitId) => {
          const presetBenefit = Object.values(BENEFITS_PRESETS).find((preset) => preset.id === requiredBenefitId);

          if (!presetBenefit) return false;

          return job.benefits.some((jobBenefit) => jobBenefit.name.toLowerCase() === presetBenefit.name.toLowerCase());
        });
      });
    }

    setFilteredJobs(result);
  };

  const updateFilters = (field: keyof JobFilters, value: any) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    applyFilters(newFilters);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-1 h-fit">
          <CardContent className="p-6">
            <div className="space-y-4">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          </CardContent>
        </Card>
        <div className="lg:col-span-3 space-y-4">
          <JobCardSkeleton />
          <JobCardSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-1">
        <JobFilters
          onFilterChange={updateFilters}
          initialFilters={filters}
          availableBenefits={Object.values(BENEFITS_PRESETS)}
        />
      </div>

      <div className="lg:col-span-3 space-y-4">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => (
            <div key={job.id} onClick={() => (window.location.href = `/jobs/${job.id}`)}>
              <JobCard job={job} variant="list" showApplySection={false} />
            </div>
          ))
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">{t("jobs.results.empty.title")}</h3>
              <p className="text-gray-500">{t("jobs.results.empty.description")}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
