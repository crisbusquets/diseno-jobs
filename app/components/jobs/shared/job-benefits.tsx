import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Benefit } from "@/types";

interface JobBenefitsProps {
  benefits: Benefit[];
  className?: string;
}

export function JobBenefits({ benefits, className }: JobBenefitsProps) {
  if (!benefits?.length) return null;

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {benefits.map((benefit, index) => (
        <Badge key={index} variant="secondary">
          {benefit.icon} {benefit.name}
        </Badge>
      ))}
    </div>
  );
}
