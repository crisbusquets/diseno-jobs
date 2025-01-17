// components/jobs/forms/job-filters.tsx
import { Search, EuroIcon } from "lucide-react";
import { useCallback } from "react";
import { JobFilters, JobType, Benefit, JOB_TYPES } from "@/types";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import LocationSelector from "./location-selector";
import { t } from "@/lib/translations/utils";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SALARY_RANGES } from "@/lib/config/constants";

interface JobFiltersProps {
  onFilterChange: (filterType: keyof JobFilters, value: any) => void;
  initialFilters: JobFilters;
  availableBenefits?: Benefit[];
}

export default function JobFilters({ onFilterChange, initialFilters, availableBenefits = [] }: JobFiltersProps) {
  const handleBenefitToggle = useCallback(
    (benefitId: string) => {
      const currentBenefits = initialFilters.benefits || [];

      const newBenefits = currentBenefits.includes(benefitId)
        ? currentBenefits.filter((b) => b !== benefitId)
        : [...currentBenefits, benefitId];

      onFilterChange("benefits", newBenefits);
    },
    [initialFilters.benefits, onFilterChange]
  );

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="space-y-2">
        <label className="text-sm font-medium">{t("jobs.search.label")}</label>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder={t("jobs.search.placeholder")}
            value={initialFilters.search}
            onChange={(e) => onFilterChange("search", e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Job Type */}
      <div className="space-y-2">
        <label className="text-sm font-medium">{t("jobs.type.label")}</label>
        <Select value={initialFilters.jobType} onValueChange={(value) => onFilterChange("jobType", value)}>
          <SelectTrigger>
            <SelectValue placeholder={t("jobs.type.all")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("jobs.type.all")}</SelectItem>
            {Object.values(JOB_TYPES).map((type) => (
              <SelectItem key={type} value={type}>
                {t(`jobs.form.workMode.${type}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Location */}
      <div className="space-y-2">
        <label className="text-sm font-medium">{t("jobs.location.label")}</label>
        <LocationSelector value={initialFilters.location} onChange={(value) => onFilterChange("location", value)} />
      </div>

      {/* Remote Only Toggle */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Switch
            checked={initialFilters.remoteOnly}
            onCheckedChange={(checked) => onFilterChange("remoteOnly", checked)}
          />
          <label className="text-sm text-muted-foreground">{t("jobs.filters.remote")}</label>
        </div>
      </div>

      {/* Minimum Salary */}

      <div className="space-y-2">
        <label className="text-sm font-medium">{t("jobs.salary.minimum")}</label>
        <Select
          value={initialFilters.minSalary?.toString() || "all"}
          onValueChange={(value) => onFilterChange("minSalary", value === "all" ? undefined : parseInt(value))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Salario mínimo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("jobs.salary.all")}</SelectItem>
            {SALARY_RANGES.map((range) => (
              <SelectItem key={range.value} value={range.value.toString()}>
                {range.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Benefits */}
      {availableBenefits.map((benefit) => (
        <label key={benefit.id} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-md cursor-pointer">
          <input
            type="checkbox"
            checked={initialFilters.benefits?.includes(benefit.id) || false}
            onChange={() => handleBenefitToggle(benefit.id)}
            className="rounded border-gray-300"
          />
          <span>
            {benefit.icon} {benefit.name}
          </span>
        </label>
      ))}

      {/* Selected Benefits Tags */}
      {(initialFilters.benefits?.length || 0) > 0 && (
        <div className="flex flex-wrap gap-2">
          {initialFilters.benefits?.map((benefitName) => (
            <Badge
              key={benefitName}
              variant="secondary"
              className="cursor-pointer"
              onClick={() => handleBenefitToggle(benefitName)}
            >
              {benefitName}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleBenefitToggle(benefitName);
                }}
                className="ml-2 hover:text-destructive"
              >
                ×
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
