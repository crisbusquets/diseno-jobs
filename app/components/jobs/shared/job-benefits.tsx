import { Benefit } from "@/types";
import { t } from "@/lib/translations/utils";

interface JobBenefitsProps {
  benefits?: Benefit[];
}

export function JobBenefits({ benefits }: JobBenefitsProps) {
  if (!benefits?.length) return null;

  return (
    <div className="mt-6">
      <h3 className="text-lg font-medium text-gray-900">{t("jobs.benefits.label")}</h3>
      <div className="mt-4 flex flex-wrap gap-2">
        {benefits.map((benefit, index) => (
          <span
            key={index}
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-50 text-gray-700 rounded-full text-sm"
          >
            {benefit.icon && <span>{benefit.icon}</span>}
            {benefit.name}
          </span>
        ))}
      </div>
    </div>
  );
}
