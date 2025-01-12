// app/components/jobs/shared/job-metadata.tsx
import { MapPin, BriefcaseIcon, Mail, Globe } from "lucide-react";
import { Job } from "@/types";
import { formatSalaryRange } from "@/lib/utils/formatting";
import { getLocationName } from "@/components/common/forms/location-selector";

import { t } from "@/lib/translations/utils";

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
            {variant === "detailed" && <h3 className="font-medium text-gray-900">{t("jobs.location.label")}</h3>}
            <p className="text-gray-600">{getLocationName(job.location)}</p>
          </div>
        </div>
      )}

      {(job.salary_min || job.salary_max) && (
        <div className="flex items-start gap-2">
          <BriefcaseIcon className={`text-gray-400 ${variant === "compact" ? "w-4 h-4" : "w-5 h-5"} mt-1`} />
          <div>
            {variant === "detailed" && <h3 className="font-medium text-gray-900">{t("jobs.salary.label")}</h3>}
            <p className="text-gray-600">{formatSalaryRange(job.salary_min, job.salary_max)}</p>
          </div>
        </div>
      )}

      <div className="flex items-start gap-2">
        {job.application_method_type === "email" ? (
          <Mail className={`text-gray-400 ${variant === "compact" ? "w-4 h-4" : "w-5 h-5"} mt-1`} />
        ) : (
          <Globe className={`text-gray-400 ${variant === "compact" ? "w-4 h-4" : "w-5 h-5"} mt-1`} />
        )}
        <div>
          {variant === "detailed" && (
            <h3 className="font-medium text-gray-900">
              {job.application_method_type === "email"
                ? t("jobs.application.email.label")
                : t("jobs.application.url.label")}
            </h3>
          )}
          <p className="text-gray-600">
            {job.application_method_type === "email" ? (
              <a href={`mailto:${job.application_method_value}`} className="hover:text-blue-600">
                {job.application_method_value}
              </a>
            ) : (
              <a
                href={job.application_method_value}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-600"
              >
                {job.application_method_value}
              </a>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
