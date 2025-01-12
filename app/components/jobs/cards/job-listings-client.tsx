// app/components/jobs/cards/job-listings-client.tsx
"use client";

import { useState, useEffect } from "react";
import { Search, EuroIcon } from "lucide-react";
import { Job, JobFilters } from "@/types";
import { DEFAULT_JOB_FILTERS } from "@/lib/config/constants";
import { getJobTypeLabel } from "@/lib/utils/formatting";
import JobCard from "./job-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import LocationSelector from "@/components/common/forms/location-selector";
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
  const [formData, setFormData] = useState({
    location: "",
  });

  // Simulate loading state and initialize data
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Extract all unique benefits from jobs
  const availableBenefits = Array.from(
    new Set(
      initialJobs
        .flatMap((job) => job.benefits || [])
        .map((benefit) => JSON.stringify({ name: benefit.name, icon: benefit.icon }))
    )
  ).map((benefitString) => JSON.parse(benefitString));

  const applyFilters = (currentFilters: JobFilters) => {
    let result = initialJobs;

    if (currentFilters.search) {
      const searchTerm = currentFilters.search.toLowerCase();
      result = result.filter(
        (job) =>
          job.title.toLowerCase().includes(searchTerm) ||
          job.company.toLowerCase().includes(searchTerm) ||
          job.description.toLowerCase().includes(searchTerm)
      );
    }

    if (currentFilters.jobType !== "all") {
      result = result.filter((job) => job.job_type === currentFilters.jobType);
    }

    if (currentFilters.location) {
      result = result.filter((job) => {
        if (!job.location) return false;
        return job.location.toLowerCase().includes(currentFilters.location.toLowerCase());
      });
    }

    if (currentFilters.minSalary) {
      result = result.filter((job) => {
        if (job.salary_min) return job.salary_min >= currentFilters.minSalary!;
        if (job.salary_max) return job.salary_max >= currentFilters.minSalary!;
        return false;
      });
    }

    if (currentFilters.benefits?.length) {
      result = result.filter((job) => {
        if (!job.benefits?.length) return false;
        return currentFilters.benefits!.every((requiredBenefit) =>
          job.benefits!.some((jobBenefit) => jobBenefit.name.toLowerCase() === requiredBenefit.toLowerCase())
        );
      });
    }

    setFilteredJobs(result);
  };

  const updateFilters = (updates: Partial<JobFilters>) => {
    const newFilters = { ...filters, ...updates };
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
              <Skeleton className="h-8 w-full" />
            </div>
          </CardContent>
        </Card>
        <div className="lg:col-span-3 space-y-4">
          <JobCardSkeleton />
          <JobCardSkeleton />
          <JobCardSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Filters Section */}
      <Card className="lg:col-span-1 h-fit">
        <CardContent className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">{t("jobs.search.label")}</label>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder={t("jobs.search.placeholder")}
                value={filters.search}
                onChange={(e) => updateFilters({ search: e.target.value })}
                className="pl-9"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">{t("jobs.type.label")}</label>
            <Select value={filters.jobType} onValueChange={(value) => updateFilters({ jobType: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("jobs.type.all")}</SelectItem>
                <SelectItem value="remote">{getJobTypeLabel("remote")}</SelectItem>
                <SelectItem value="hybrid">{getJobTypeLabel("hybrid")}</SelectItem>
                <SelectItem value="onsite">{getJobTypeLabel("onsite")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">{t("jobs.location.label")}</label>
            <LocationSelector value={filters.location} onChange={(value) => updateFilters({ location: value })} />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">{t("jobs.salary.minimum")}</label>
            <div className="relative">
              <EuroIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                type="number"
                placeholder={t("jobs.salary.placeholder")}
                className="pl-9"
                value={filters.minSalary || ""}
                onChange={(e) =>
                  updateFilters({
                    minSalary: e.target.value ? Number(e.target.value) : undefined,
                  })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">{t("jobs.benefits.label")}</label>
            <ScrollArea className="h-[200px] rounded-md border p-4">
              <div className="space-y-2">
                {availableBenefits.map((benefit) => (
                  <div key={benefit.name} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={benefit.name}
                      checked={filters.benefits?.includes(benefit.name)}
                      onChange={(e) => {
                        const newBenefits = e.target.checked
                          ? [...(filters.benefits || []), benefit.name]
                          : (filters.benefits || []).filter((b) => b !== benefit.name);
                        updateFilters({ benefits: newBenefits });
                      }}
                    />
                    <label htmlFor={benefit.name} className="text-sm">
                      {benefit.icon} {benefit.name}
                    </label>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          {(filters.jobType !== "all" ||
            filters.location ||
            filters.minSalary ||
            filters.benefits?.length ||
            filters.search) && (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                setFilters(DEFAULT_JOB_FILTERS);
                applyFilters(DEFAULT_JOB_FILTERS);
              }}
            >
              {t("jobs.filters.clear")}
            </Button>
          )}

          <div className="pt-2 border-t">
            <p className="text-sm text-muted-foreground">
              {t("jobs.results.count", {
                count: filteredJobs.length.toString(),
                plural: filteredJobs.length === 1 ? "" : "s",
              })}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Jobs List Section */}
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
