import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Region = {
  name: string;
  emoji: string;
};

const REGIONS: Region[] = [
  { name: "Worldwide", emoji: "🌍" },
  { name: "Europe", emoji: "🇪🇺" },
  { name: "Spain", emoji: "🇪🇸" },
  { name: "France", emoji: "🇫🇷" },
  { name: "Germany", emoji: "🇩🇪" },
  { name: "United Kingdom", emoji: "🇬🇧" },
  { name: "Portugal", emoji: "🇵🇹" },
];

interface LocationSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function LocationSelector({ value, onChange }: LocationSelectorProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select location" />
      </SelectTrigger>
      <SelectContent>
        {REGIONS.map((location) => (
          <SelectItem key={location.name} value={location.name}>
            <span className="flex items-center gap-2">
              {location.emoji} {location.name}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
