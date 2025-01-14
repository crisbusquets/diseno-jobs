"use client";

import { useState, useEffect } from "react";
import { Job, JobFilters, DEFAULT_JOB_FILTERS } from "@/types";
import JobCard from "./job-card";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import JobFilters from "@/components/jobs/forms/job-filters";
import { benefitsPresets } from "@/lib/translations/es";
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

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Debug useEffect
  useEffect(() => {
    console.log("Filters changed:", filters);
  }, [filters]);

  const applyFilters = (currentFilters: JobFilters) => {
    console.log("Applying filters:", currentFilters);
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

    // Location
    if (currentFilters.location) {
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
    // Benefits filter
    if (currentFilters.benefits?.length) {
      console.log("Has benefits to filter:", currentFilters.benefits);
      result = result.filter((job) => {
        // If job has no benefits, exclude it
        if (!job.benefits?.length) return false;

        // For each required benefit (from filter)
        return currentFilters.benefits!.every((requiredBenefitId) => {
          // Find the preset benefit definition
          const presetBenefit = Object.values(benefitsPresets).find((preset) => preset.id === requiredBenefitId);

          if (!presetBenefit) return false;

          // Check if job has this benefit
          const match = job.benefits.some(
            (jobBenefit) => jobBenefit.name.toLowerCase() === presetBenefit.name.toLowerCase()
          );

          console.log(`Job ${job.id}: Checking for ${presetBenefit.name} - Match: ${match}`);
          return match;
        });
      });

      console.log(`Filtered down to ${result.length} jobs`);
    }

    setFilteredJobs(result);
  };

  const updateFilters = (field: keyof JobFilters, value: any) => {
    console.log("Updating filters:", field, value);
    const newFilters = { ...filters, [field]: value };
    console.log("New filters:", newFilters);
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
          availableBenefits={Object.values(benefitsPresets)}
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
