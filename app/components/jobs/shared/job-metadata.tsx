import { MapPin, EuroIcon } from "lucide-react";
import { Job } from "@/types";
import { formatSalaryRange } from "@/lib/utils/formatting";
import { getLocationName } from "@/components/jobs/forms/location-selector";
import { cn } from "@/lib/utils";

interface JobMetadataProps {
  job: Job;
  variant?: "compact" | "detailed";
  className?: string;
}

export function JobMetadata({ job, variant = "compact", className }: JobMetadataProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap gap-4 text-sm text-muted-foreground",
        variant === "detailed" && "flex-col",
        className
      )}
    >
      {job.location && (
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          <span>{getLocationName(job.location)}</span>
        </div>
      )}
      {(job.salary_min || job.salary_max) && (
        <div className="flex items-center gap-2">
          <EuroIcon className="h-4 w-4" />
          <span>{formatSalaryRange(job.salary_min, job.salary_max)}</span>
        </div>
      )}
    </div>
  );
}
