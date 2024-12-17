// app/components/jobs/forms/job-filters.tsx

import { Search } from "lucide-react";
import LocationSelector from "@/components/common/forms/location-selector";
import { JobFilters as JobFiltersType, JobType } from "@/types";
import { JOB_TYPES } from "@/lib/config/constants";
import { getJobTypeLabel } from "@/lib/utils/formatting";

interface JobFiltersProps {
  onSearch: (value: string) => void;
  onFilterChange: (filterType: keyof JobFiltersType, value: any) => void;
  initialFilters?: JobFiltersType;
}

export default function JobFilters({
  onSearch,
  onFilterChange,
  initialFilters = DEFAULT_JOB_FILTERS,
}: JobFiltersProps) {
  return (
    <div className="w-full space-y-4 p-4 bg-white rounded-lg shadow-sm">
      {/* Search Input */}
      <div className="space-y-2">
        <label htmlFor="search" className="text-sm font-medium text-gray-700">
          Búsqueda
        </label>
        <div className="relative">
          <input
            id="search"
            type="text"
            placeholder="Buscar por título o empresa..."
            defaultValue={initialFilters.search}
            onChange={(e) => onSearch(e.target.value)}
            className="w-full px-3 py-2 pl-9 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Job Type Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Tipo de Trabajo</label>
          <select
            defaultValue={initialFilters.jobType}
            onChange={(e) => onFilterChange("jobType", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Todos</option>
            {Object.values(JOB_TYPES).map((type) => (
              <option key={type} value={type}>
                {getJobTypeLabel(type as JobType)}
              </option>
            ))}
          </select>
        </div>

        {/* Location Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Ubicación</label>
          <LocationSelector
            value={initialFilters.locations}
            onChange={(locations) => onFilterChange("locations", locations)}
          />
        </div>
      </div>
    </div>
  );
}
