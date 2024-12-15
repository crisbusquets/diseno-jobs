import { Job } from "@/types";
import { JobHeader } from "@/components/jobs/shared/job-header";
import { JobMetadata } from "@/components/jobs/shared/job-metadata";
import { JobBenefits } from "@/components/jobs/shared/job-benefits";
import { ApplySection } from "@/components/common/forms/apply-section";

interface JobCardProps {
  job: Job;
  variant?: "list" | "detailed";
}

const JobCard = ({ job, variant = "list" }: JobCardProps) => {
  const isDetailed = variant === "detailed";

  return (
    <div className={`bg-white rounded-lg border border-gray-200 ${isDetailed ? "p-8" : "p-6"}`}>
      <JobHeader job={job} variant={isDetailed ? "detailed" : "compact"} />

      <div className="mt-4">
        <JobMetadata job={job} variant={isDetailed ? "detailed" : "compact"} />
      </div>

      {isDetailed ? (
        <>
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Descripción del puesto</h2>
            <div className="mt-4 prose max-w-none text-gray-600">{job.description}</div>
          </div>
          {job.benefits && <JobBenefits benefits={job.benefits} />}
          <ApplySection
            method={{
              type: job.application_method_type,
              value: job.application_method_value,
            }}
          />
        </>
      ) : (
        <div className="mt-4">
          <p className="text-gray-700 line-clamp-3">{job.description}</p>
        </div>
      )}
    </div>
  );
};

export default JobCard;
