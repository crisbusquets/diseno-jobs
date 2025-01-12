import { Building2 } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Job } from "@/types";
import { getJobTypeLabel } from "@/lib/utils/formatting";

interface JobHeaderProps {
  job: Job;
  variant?: "compact" | "detailed";
  className?: string;
}

export function JobHeader({ job, variant = "compact", className }: JobHeaderProps) {
  const size = variant === "compact" ? "h-12 w-12" : "h-16 w-16";
  const titleSize = variant === "compact" ? "text-lg" : "text-2xl";

  return (
    <div className={cn("flex justify-between items-start", className)}>
      <div className="flex gap-4">
        <div className={cn("rounded-lg bg-gray-100 flex items-center justify-center", size)}>
          {job.company_logo ? (
            <Image
              src={job.company_logo}
              alt={`${job.company} logo`}
              width={variant === "compact" ? 48 : 64}
              height={variant === "compact" ? 48 : 64}
              className="object-contain p-2"
            />
          ) : (
            <Building2 className={cn("text-gray-400", variant === "compact" ? "w-6 h-6" : "w-8 h-8")} />
          )}
        </div>
        <div>
          <h2 className={cn("font-semibold text-gray-900", titleSize)}>{job.title}</h2>
          <p className="text-gray-600">{job.company}</p>
        </div>
      </div>
      <Badge variant={job.job_type === "remote" ? "default" : "outline"}>{getJobTypeLabel(job.job_type)}</Badge>
    </div>
  );
}
