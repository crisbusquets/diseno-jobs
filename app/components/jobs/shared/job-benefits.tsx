import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Benefit } from "@/types";
import { BENEFITS_PRESETS } from "@/lib/translations/es";

interface JobBenefitsProps {
  benefits: Benefit[];
  className?: string;
}

export function JobBenefits({ benefits, className }: JobBenefitsProps) {
  if (!benefits?.length) return null;

  const normalizedBenefits = benefits.map((benefit) => {
    const presetBenefit = Object.values(BENEFITS_PRESETS).find((preset) => preset.name === benefit.name);

    return (
      presetBenefit || {
        ...benefit,
        id: `custom-${benefit.name.toLowerCase().replace(/\s+/g, "-")}`,
      }
    );
  });

  const uniqueBenefits = Array.from(new Map(normalizedBenefits.map((item) => [item.id, item]))).map(
    ([_, item]) => item
  );

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {uniqueBenefits.map((benefit) => (
        <Badge key={benefit.id} variant="secondary">
          {benefit.icon} {benefit.name}
        </Badge>
      ))}
    </div>
  );
}
