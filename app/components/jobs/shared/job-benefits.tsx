import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Benefit } from "@/types";
import { benefitsPresets } from "@/lib/translations/es";

interface JobBenefitsProps {
  benefits: Benefit[];
  className?: string;
}

export function JobBenefits({ benefits, className }: JobBenefitsProps) {
  if (!benefits?.length) return null;

  // Map benefits from DB to preset benefits to ensure we have IDs and correct data
  const normalizedBenefits = benefits.map((benefit) => {
    // Try to find a matching preset benefit
    const presetBenefit = Object.values(benefitsPresets).find((preset) => preset.name === benefit.name);

    // Return preset if found, otherwise use benefit with generated ID
    return (
      presetBenefit || {
        ...benefit,
        id: `custom-${benefit.name.toLowerCase().replace(/\s+/g, "-")}`,
      }
    );
  });

  // Remove duplicates based on ID
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
