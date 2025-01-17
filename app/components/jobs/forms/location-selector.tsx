import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Region = {
  id: string; // Value that gets stored in database
  name: string; // Display text in Spanish
  emoji: string;
};

const REGIONS: Region[] = [
  { id: "all", name: "Cualquier ubicación", emoji: "🌎" },
  { id: "anywhere", name: "Sin restricción geográfica", emoji: "🌍" },
  { id: "europe", name: "Europa", emoji: "🇪🇺" },
  { id: "spain", name: "España", emoji: "🇪🇸" },
  { id: "france", name: "Francia", emoji: "🇫🇷" },
  { id: "germany", name: "Alemania", emoji: "🇩🇪" },
  { id: "uk", name: "Reino Unido", emoji: "🇬🇧" },
  { id: "portugal", name: "Portugal", emoji: "🇵🇹" },
];

interface LocationSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function LocationSelector({ value, onChange }: LocationSelectorProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select location">{value && REGIONS.find((r) => r.id === value)?.name}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        {REGIONS.map((location) => (
          <SelectItem key={location.id} value={location.id}>
            <span className="flex items-center gap-2">
              {location.emoji} {location.name}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

// Helper function to get display name from ID
export function getLocationName(id: string): string {
  return REGIONS.find((r) => r.id === id)?.name || id;
}
