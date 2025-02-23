import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Job } from "@/types";
import { JobHeader } from "../shared/job-header";
import { JobMetadata } from "../shared/job-metadata";
import { JobBenefits } from "../shared/job-benefits";
import { ApplySection } from "@/components/jobs/shared/apply-section";

interface JobCardProps {
  job: Job;
  variant?: "list" | "detailed";
  showApplySection?: boolean;
  className?: string;
}

// components/jobs/cards/job-card.tsx
export default function JobCard({ job, variant = "list", showApplySection = true, className }: JobCardProps) {
  return (
    <div className="space-y-6">
      <Card className={cn("transition-shadow hover:shadow-md", className)}>
        <CardHeader className="space-y-0">
          <JobHeader job={job} variant={variant === "detailed" ? "detailed" : "compact"} />
        </CardHeader>

        <CardContent className="space-y-4">
          <JobMetadata job={job} variant={variant === "detailed" ? "detailed" : "compact"} />

          <div className="prose max-w-none text-muted-foreground [&>p]:mb-4 [&>p:last-child]:mb-0">
            {variant === "detailed" ? (
              <div dangerouslySetInnerHTML={{ __html: job.description }} />
            ) : (
              <div dangerouslySetInnerHTML={{ __html: job.description }} className="line-clamp-2" />
            )}
          </div>
        </CardContent>

        {job.benefits?.length > 0 && (
          <CardFooter>
            <JobBenefits benefits={job.benefits} />
          </CardFooter>
        )}
      </Card>

      {variant === "detailed" && showApplySection && (
        <ApplySection
          method={{
            type: job.application_method_type,
            value: job.application_method_value,
          }}
          jobId={job.id}
        />
      )}
    </div>
  );
}
