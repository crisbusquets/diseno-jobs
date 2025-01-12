// components/jobs/forms/job-filters.tsx
import { Search, EuroIcon } from "lucide-react";
import { useState } from "react";
import LocationSelector from "@/components/jobs/forms/location-selector";
import { JobFilters as JobFiltersType, JobType, Benefit } from "@/types";
import { JOB_TYPES, DEFAULT_BENEFITS } from "@/lib/config/constants";
import { getJobTypeLabel } from "@/lib/utils/formatting";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

import { t } from "@/lib/translations/utils";

interface JobFiltersProps {
  onSearch: (value: string) => void;
  onFilterChange: (filterType: keyof JobFiltersType, value: any) => void;
  initialFilters: JobFiltersType;
  availableBenefits?: Benefit[];
}

export default function JobFilters({
  onSearch,
  onFilterChange,
  initialFilters,
  availableBenefits = [],
}: JobFiltersProps) {
  const [selectedBenefits, setSelectedBenefits] = useState<string[]>(initialFilters.benefits || []);
  const [minSalary, setMinSalary] = useState<string>(initialFilters.minSalary?.toString() || "");

  // Use available benefits if we have them, otherwise fall back to defaults
  const benefitsToShow = availableBenefits.length > 0 ? availableBenefits : DEFAULT_BENEFITS;

  const handleBenefitToggle = (benefitName: string) => {
    const newBenefits = selectedBenefits.includes(benefitName)
      ? selectedBenefits.filter((b) => b !== benefitName)
      : [...selectedBenefits, benefitName];

    setSelectedBenefits(newBenefits);
    onFilterChange("benefits", newBenefits);
  };

  const handleSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMinSalary(value);
    const numberValue = value ? Number(value) : undefined;
    onFilterChange("minSalary", numberValue);
  };

  return (
    <div className="w-full space-y-4 p-4 bg-white rounded-lg shadow-sm">
      {/* Search Input */}
      <div className="space-y-2">
        <label htmlFor="search" className="text-sm font-medium text-gray-700">
          {t("jobs.search.label")}
        </label>
        <div className="relative">
          <Input
            id="search"
            type="text"
            placeholder={t("jobs.search.placeholder")}
            defaultValue={initialFilters.search}
            onChange={(e) => onSearch(e.target.value)}
            className="pl-9"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Job Type Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">{t("jobs.form.workMode.placeholder")}</label>
          <Select defaultValue={initialFilters.jobType} onValueChange={(value) => onFilterChange("jobType", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {Object.values(JOB_TYPES).map((type) => (
                <SelectItem key={type} value={type}>
                  {getJobTypeLabel(type as JobType)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Location Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">{t("jobs.location.label")}</label>
          <LocationSelector value={initialFilters.location} onChange={(value) => onFilterChange("location", value)} />
        </div>

        {/* Minimum Salary Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">{t("jobs.form.salary.min")}</label>
          <div className="relative">
            <Input
              type="number"
              placeholder={t("jobs.form.salary.placeholder.min")}
              value={minSalary}
              onChange={handleSalaryChange}
              className="pl-9"
            />
            <EuroIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>

        {/* Benefits Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">{t("jobs.form.benefit.title")}</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start">
                {selectedBenefits.length ? `${selectedBenefits.length} seleccionados` : "Seleccionar beneficios"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="start">
              <div className="space-y-2 p-2">
                {benefitsToShow.map((benefit) => (
                  <div
                    key={benefit.name}
                    className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md cursor-pointer"
                    onClick={() => handleBenefitToggle(benefit.name)}
                  >
                    <div className="flex-1">
                      {benefit.icon} {benefit.name}
                    </div>
                    {selectedBenefits.includes(benefit.name) && <Badge variant="secondary">Seleccionado</Badge>}
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Selected Benefits Tags */}
      {selectedBenefits.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-2">
          {selectedBenefits.map((benefit) => (
            <Badge
              key={benefit}
              variant="secondary"
              className="cursor-pointer"
              onClick={() => handleBenefitToggle(benefit)}
            >
              {benefit}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleBenefitToggle(benefit);
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
