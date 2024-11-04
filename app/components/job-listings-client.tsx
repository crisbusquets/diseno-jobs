'use client';

import { useState } from "react";
import Link from "next/link";
import JobCard from "@/components/job-card";
import JobFilters from "@/components/job-filters";

// Define the Job type
interface Job {
  id: number;
  title: string;
  company: string;
  company_logo?: string;
  description: string;
  job_type: 'remote' | 'hybrid' | 'onsite';
  location?: string;
  salary_min?: number;
  salary_max?: number;
  created_at: string;
}

// Define props interface
interface JobListingsClientProps {
  initialJobs: Job[];
}

export default function JobListingsClient({ initialJobs }: JobListingsClientProps) {
  const [filteredJobs, setFilteredJobs] = useState(initialJobs);
  const [filters, setFilters] = useState({
    search: "",
    jobType: "all",
    location: "",
  });

  const handleSearch = (value: string) => {
    setFilters((prev) => ({ ...prev, search: value }));
    applyFilters({ ...filters, search: value });
  };

  const handleFilterChange = (filterType: string, value: string) => {
    setFilters((prev) => ({ ...prev, [filterType]: value }));
    applyFilters({ ...filters, [filterType]: value });
  };

  const applyFilters = (currentFilters: typeof filters) => {
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
      result = result.filter((job) => 
        job.location?.toLowerCase().includes(currentFilters.location.toLowerCase())
      );
    }

    setFilteredJobs(result);
  };

  return (
    <div className="space-y-6">
      <JobFilters onSearch={handleSearch} onFilterChange={handleFilterChange} />

      <div className="space-y-4">
        {filteredJobs.map((job) => (
          <Link key={job.id} href={`/jobs/${job.id}`}>
            <JobCard job={job} variant="list" />
          </Link>
        ))}
      </div>
    </div>
  );
}
