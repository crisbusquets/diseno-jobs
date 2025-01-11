// app/components/jobs/cards/job-card.tsx
"use client";

import { Building2, MapPin, EuroIcon } from "lucide-react";
import { getLocationName } from "@/components/common/forms/location-selector";
import { CONTRACT_TYPE_LABELS } from "@/lib/config/constants";
import { Job } from "@/types";
import { formatSalaryRange, getJobTypeLabel } from "@/lib/utils/formatting";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface JobCardProps {
  job: Job;
  variant?: "list" | "detailed";
  showApplySection?: boolean;
  className?: string;
}

export default function JobCard({ job, variant = "list", showApplySection = true, className }: JobCardProps) {
  const isDetailed = variant === "detailed";

  return (
    <Card className={cn("transition-shadow hover:shadow-md", !isDetailed && "cursor-pointer", className)}>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex gap-4">
            <div
              className={cn(
                "rounded-lg bg-gray-100 flex items-center justify-center",
                isDetailed ? "h-16 w-16" : "h-12 w-12"
              )}
            >
              {job.company_logo ? (
                <img src={job.company_logo} alt={`${job.company} logo`} className="h-full w-full object-contain p-2" />
              ) : (
                <Building2 className={cn("text-gray-400", isDetailed ? "h-8 w-8" : "h-6 w-6")} />
              )}
            </div>
            <div>
              <CardTitle className={cn(isDetailed ? "text-2xl" : "text-lg")}>{job.title}</CardTitle>
              <CardDescription className={cn(isDetailed ? "text-lg" : "text-base")}>{job.company}</CardDescription>
            </div>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline">{job.experience_level}</Badge>
            {job.contract_type && <Badge variant="outline">{CONTRACT_TYPE_LABELS[job.contract_type]}</Badge>}
            <Badge
              variant={job.job_type === "remote" ? "default" : job.job_type === "hybrid" ? "secondary" : "outline"}
            >
              {getJobTypeLabel(job.job_type)}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            {job.location && (
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                {getLocationName(job.location)}
              </div>
            )}
            {(job.salary_min || job.salary_max) && (
              <div className="flex items-center">
                <EuroIcon className="h-4 w-4 mr-1" />
                {formatSalaryRange(job.salary_min, job.salary_max)}
              </div>
            )}
          </div>

          {isDetailed ? (
            <div className="prose max-w-none text-muted-foreground">{job.description}</div>
          ) : (
            <p className="line-clamp-2 text-muted-foreground">{job.description}</p>
          )}
        </div>
      </CardContent>

      {job.benefits && job.benefits.length > 0 && (
        <CardFooter>
          <div className="flex flex-wrap gap-2">
            {job.benefits.map((benefit, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {benefit.icon} {benefit.name}
              </Badge>
            ))}
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
