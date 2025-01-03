"use client";

import { Job } from "@/types";
import { JobHeader } from "@/components/jobs/shared/job-header";
import { JobMetadata } from "@/components/jobs/shared/job-metadata";
import { JobBenefits } from "@/components/jobs/shared/job-benefits";
import { ApplySection } from "@/components/common/forms/apply-section";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface JobCardProps {
  job: Job;
  variant?: "list" | "detailed";
}

const JobCard = ({ job, variant = "list" }: JobCardProps) => {
  const isDetailed = variant === "detailed";

  return (
    <Card className={isDetailed ? "p-6" : "p-4"}>
      <CardHeader className="p-0">
        <JobHeader job={job} variant={isDetailed ? "detailed" : "compact"} />
      </CardHeader>
      <CardContent className="p-0 mt-4">
        <JobMetadata job={job} variant={isDetailed ? "detailed" : "compact"} />

        {isDetailed ? (
          <>
            <div className="mt-8 pt-8 border-t">
              <h2 className="text-lg font-medium">Descripción del puesto</h2>
              <div className="mt-4 prose max-w-none text-muted-foreground">{job.description}</div>
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
          <p className="mt-4 text-muted-foreground line-clamp-3">{job.description}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default JobCard;
