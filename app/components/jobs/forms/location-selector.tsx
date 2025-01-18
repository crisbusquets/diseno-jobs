"use client";

import * as React from "react";

import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { t } from "@/lib/translations/utils";
import { REGIONS, COUNTRIES } from "@/lib/translations/es";

const regions = Object.values(REGIONS);
const countries = Object.values(COUNTRIES);

interface LocationSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function LocationSelector({ value, onChange }: LocationSelectorProps) {
  const [open, setOpen] = React.useState(false);

  const selected = React.useMemo(
    () => [...regions, ...countries].find((item) => item.id === value) || regions[0],
    [value]
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
          <span className="flex items-center gap-2">
            {selected.emoji} {selected.name}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder={t("locations.search.placeholder")} />
          <CommandList>
            <CommandEmpty>{t("locations.search.empty")}</CommandEmpty>
            <CommandGroup heading={t("locations.groups.regions")}>
              {regions.map((region) => (
                <CommandItem
                  key={region.id}
                  onSelect={() => {
                    onChange(region.id);
                    setOpen(false);
                  }}
                >
                  <Check className={cn("mr-2 h-4 w-4", value === region.id ? "opacity-100" : "opacity-0")} />
                  <span className="flex items-center gap-2 font-medium">
                    {region.emoji} {region.name}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandGroup heading={t("locations.groups.countries")}>
              {countries.map((country) => (
                <CommandItem
                  key={country.id}
                  value={country.id}
                  onSelect={() => {
                    onChange(country.id);
                    setOpen(false);
                  }}
                >
                  <Check className={cn("mr-2 h-4 w-4", value === country.id ? "opacity-100" : "opacity-0")} />
                  <span className="flex items-center gap-2">
                    {country.emoji} {country.name}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export function getLocationName(value: string): string {
  const item = [...regions, ...countries].find((item) => item.id === value);
  return item?.name || value;
}
