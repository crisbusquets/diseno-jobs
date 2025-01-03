"use client";

import { Building2 } from "lucide-react";
import { Job } from "@/types";
import { getJobTypeLabel, getJobTypeColor } from "@/lib/utils/formatting";

interface JobHeaderProps {
  job: Job;
  variant?: "compact" | "detailed";
}

export function JobHeader({ job, variant = "compact" }: JobHeaderProps) {
  return (
    <div className="flex justify-between items-start">
      <div className="flex gap-4">
        <div
          className={`flex-shrink-0 rounded-lg bg-gray-100 flex items-center justify-center
          ${variant === "compact" ? "w-12 h-12" : "w-16 h-16"}`}
        >
          {job.company_logo ? (
            <img
              src={job.company_logo}
              alt={`${job.company} logo`}
              className={`object-contain ${variant === "compact" ? "w-10 h-10" : "w-14 h-14"}`}
            />
          ) : (
            <Building2 className={`text-gray-400 ${variant === "compact" ? "w-6 h-6" : "w-8 h-8"}`} />
          )}
        </div>
        <div>
          <h1 className={`text-gray-900 ${variant === "compact" ? "text-lg" : "text-2xl"} font-semibold`}>
            {job.title}
          </h1>
          <p className={`text-gray-600 ${variant === "compact" ? "text-base" : "text-lg"} mt-1`}>{job.company}</p>
        </div>
      </div>
      <span className={`px-3 py-1 rounded-full text-sm ${getJobTypeColor(job.job_type)}`}>
        {getJobTypeLabel(job.job_type)}
      </span>
    </div>
  );
}
