import { MapPin, BriefcaseIcon } from "lucide-react";
import { Job } from "@/types";
import { formatSalaryRange } from "@/lib/utils/formatting";

interface JobMetadataProps {
  job: Job;
  variant?: "compact" | "detailed";
}

export function JobMetadata({ job, variant = "compact" }: JobMetadataProps) {
  return (
    <div className={`grid ${variant === "detailed" ? "grid-cols-2" : "grid-cols-1"} gap-4`}>
      {job.location && (
        <div className="flex items-start gap-2">
          <MapPin className={`text-gray-400 ${variant === "compact" ? "w-4 h-4" : "w-5 h-5"} mt-1`} />
          <div>
            {variant === "detailed" && <h3 className="font-medium text-gray-900">Ubicación</h3>}
            <p className="text-gray-600">{job.location}</p>
          </div>
        </div>
      )}

      {(job.salary_min || job.salary_max) && (
        <div className="flex items-start gap-2">
          <BriefcaseIcon className={`text-gray-400 ${variant === "compact" ? "w-4 h-4" : "w-5 h-5"} mt-1`} />
          <div>
            {variant === "detailed" && <h3 className="font-medium text-gray-900">Salario</h3>}
            <p className="text-gray-600">{formatSalaryRange(job.salary_min, job.salary_max)}</p>
          </div>
        </div>
      )}
    </div>
  );
}
