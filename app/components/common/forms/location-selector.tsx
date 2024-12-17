import React, { useState } from "react";
import { X, Search, ChevronUp, ChevronDown, Check } from "lucide-react";

// Types for our component
type Region = {
  name: string;
  emoji: string;
};

type Country = {
  name: string;
  emoji: string;
  region: string;
};

type SelectedLocation = {
  name: string;
  emoji: string;
};

const REGIONS: Region[] = [
  { name: "Worldwide", emoji: "🌍" },
  { name: "Africa", emoji: "🦁" },
  { name: "Asia", emoji: "⛩️" },
  { name: "Europe", emoji: "🇪🇺" },
  { name: "Latin America", emoji: "💃" },
  { name: "Middle East", emoji: "🕌" },
  { name: "Oceania", emoji: "🏖️" },
];

const COUNTRIES: Country[] = [
  { name: "Spain", emoji: "🇪🇸", region: "Europe" },
  { name: "France", emoji: "🇫🇷", region: "Europe" },
  { name: "Germany", emoji: "🇩🇪", region: "Europe" },
  { name: "United Kingdom", emoji: "🇬🇧", region: "Europe" },
  { name: "Portugal", emoji: "🇵🇹", region: "Europe" },
];

interface LocationSelectorProps {
  value: SelectedLocation[];
  onChange: (locations: SelectedLocation[]) => void;
}

const LocationSelector = ({ value, onChange }: LocationSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedLocations, setSelectedLocations] = useState<SelectedLocation[]>(value || []);

  const handleSelect = (event: React.MouseEvent, location: Region | Country) => {
    event.preventDefault();
    // If Worldwide is selected, clear other selections
    if (location.name === "Worldwide") {
      const newLocations = [{ name: "Worldwide", emoji: "🌍" }];
      setSelectedLocations(newLocations);
      onChange(newLocations);
      return;
    }

    // If adding a new location and Worldwide is currently selected, remove it
    let newLocations = selectedLocations.filter((loc) => loc.name !== "Worldwide");

    // Toggle the selected location
    if (newLocations.some((loc) => loc.name === location.name)) {
      newLocations = newLocations.filter((loc) => loc.name !== location.name);
    } else {
      newLocations = [...newLocations, { name: location.name, emoji: location.emoji }];
    }

    setSelectedLocations(newLocations);
    onChange(newLocations);
  };

  const removeLocation = (locationName: string) => {
    const newLocations = selectedLocations.filter((loc) => loc.name !== locationName);
    setSelectedLocations(newLocations);
    onChange(newLocations);
  };

  const filteredRegions = REGIONS.filter((region) => region.name.toLowerCase().includes(search.toLowerCase()));

  const filteredCountries = COUNTRIES.filter((country) => country.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="relative w-full">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:border-blue-500 cursor-pointer"
      >
        <div className="flex flex-wrap gap-2 min-h-[28px]">
          {selectedLocations.length > 0 ? (
            selectedLocations.map((location) => (
              <span
                key={location.name}
                className="inline-flex items-center gap-2 px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
              >
                {location.emoji} {location.name}
                <div
                  role="button"
                  tabIndex={0}
                  onClick={(e) => {
                    e.stopPropagation();
                    removeLocation(location.name);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.stopPropagation();
                      removeLocation(location.name);
                    }
                  }}
                  className="hover:bg-blue-100 rounded-full p-0.5 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </div>
              </span>
            ))
          ) : (
            <span className="text-gray-500">Select locations...</span>
          )}
        </div>
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          {isOpen ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg">
          <div className="p-3 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search locations..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="max-h-[300px] overflow-y-auto">
            <div className="p-2">
              <h3 className="px-3 py-2 text-sm font-semibold text-gray-500">REGIONS</h3>
              {filteredRegions.map((region) => (
                <div
                  key={region.name}
                  onClick={(e) => handleSelect(e, region)}
                  className={`w-full px-3 py-2 text-left rounded-md flex items-center gap-2 cursor-pointer
                    ${
                      selectedLocations.some((loc) => loc.name === region.name)
                        ? "bg-blue-50 text-blue-700"
                        : "hover:bg-gray-50"
                    }`}
                >
                  <span>{region.emoji}</span>
                  <span>{region.name}</span>
                  {selectedLocations.some((loc) => loc.name === region.name) && (
                    <span className="ml-auto">
                      <Check className="w-4 h-4" />
                    </span>
                  )}
                </div>
              ))}
            </div>

            <div className="p-2 border-t">
              <h3 className="px-3 py-2 text-sm font-semibold text-gray-500">COUNTRIES</h3>
              {filteredCountries.map((country) => (
                <div
                  key={country.name}
                  onClick={(e) => handleSelect(e, country)}
                  className={`w-full px-3 py-2 text-left rounded-md flex items-center gap-2 cursor-pointer
                    ${
                      selectedLocations.some((loc) => loc.name === country.name)
                        ? "bg-blue-50 text-blue-700"
                        : "hover:bg-gray-50"
                    }`}
                >
                  <span>{country.emoji}</span>
                  <span>{country.name}</span>
                  {selectedLocations.some((loc) => loc.name === country.name) && (
                    <span className="ml-auto">
                      <Check className="w-4 h-4" />
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationSelector;
