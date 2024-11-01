// app/components/JobFilters.tsx
"use client";

interface JobFiltersProps {
  onSearch: (value: string) => void;
  onFilterChange: (filterType: string, value: string) => void;
}

export default function JobFilters({ onSearch, onFilterChange }: JobFiltersProps) {
  return (
    <div className="w-full space-y-4 p-4 bg-white rounded-lg shadow-sm">
      {/* Search Input */}
      <div className="space-y-2">
        <label htmlFor="search" className="text-sm font-medium text-gray-700">
          Búsqueda
        </label>
        <input
          id="search"
          type="text"
          placeholder="Buscar por título o empresa..."
          onChange={(e) => onSearch(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md 
                   focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Job Type Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Tipo de Trabajo</label>
          <select
            onChange={(e) => onFilterChange("jobType", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md 
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Todos</option>
            <option value="remote">Remoto</option>
            <option value="onsite">Presencial</option>
            <option value="hybrid">Híbrido</option>
          </select>
        </div>

        {/* Location Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Ubicación</label>
          <input
            type="text"
            placeholder="Filtrar por ubicación"
            onChange={(e) => onFilterChange("location", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md 
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
}
