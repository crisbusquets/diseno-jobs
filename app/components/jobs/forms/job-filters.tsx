// app/components/jobs/forms/job-filters.tsx

"use client";

import { JobFilters as JobFiltersType, JobType } from "@/types";
import { JOB_TYPES, DEFAULT_JOB_FILTERS } from "@/lib/config/constants";
import { getJobTypeLabel } from "@/lib/utils/formatting";

interface JobFiltersProps {
  onSearch: (value: string) => void;
  onFilterChange: (filterType: keyof JobFiltersType, value: string) => void;
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
            className="w-full px-3 py-2 pl-9 border border-gray-300 rounded-md 
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <SearchIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Job Type Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Tipo de Trabajo</label>
          <select
            defaultValue={initialFilters.jobType}
            onChange={(e) => onFilterChange("jobType", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md 
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          <div className="relative">
            <input
              type="text"
              placeholder="Filtrar por ubicación"
              defaultValue={initialFilters.location}
              onChange={(e) => onFilterChange("location", e.target.value)}
              className="w-full px-3 py-2 pl-9 border border-gray-300 rounded-md 
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <LocationIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Internal components for icons
function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
  );
}

function LocationIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
      />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}
