import { Search } from "lucide-react";
import LocationSelector from "@/components/common/forms/location-selector";
import { JobFilters as JobFiltersType, JobType } from "@/types";
import { JOB_TYPES } from "@/lib/config/constants";
import { getJobTypeLabel } from "@/lib/utils/formatting";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface JobFiltersProps {
  onSearch: (value: string) => void;
  onFilterChange: (filterType: keyof JobFiltersType, value: any) => void;
  initialFilters: JobFiltersType;
}

export default function JobFilters({ onSearch, onFilterChange, initialFilters }: JobFiltersProps) {
  return (
    <div className="w-full space-y-4 p-4 bg-white rounded-lg shadow-sm">
      {/* Search Input */}
      <div className="space-y-2">
        <label htmlFor="search" className="text-sm font-medium text-gray-700">
          Búsqueda
        </label>
        <div className="relative">
          <Input
            id="search"
            type="text"
            placeholder="Buscar por título o empresa..."
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
          <label className="text-sm font-medium text-gray-700">Tipo de Trabajo</label>
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
          <label className="text-sm font-medium text-gray-700">Ubicación</label>
          <LocationSelector value={initialFilters.location} onChange={(value) => onFilterChange("location", value)} />
        </div>
      </div>
    </div>
  );
}
