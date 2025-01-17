import { useState } from "react";
import { Plus, Check } from "lucide-react";
import { Benefit } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BENEFITS_PRESETS } from "@/lib/translations/es";

// Convert benefits object to array and ensure uniqueness by ID
const PRESET_BENEFITS = Object.values(BENEFITS_PRESETS);

interface BenefitsSectionProps {
  benefits: Benefit[];
  onBenefitsChange: (benefits: Benefit[]) => void;
}

export function BenefitsSection({ benefits, onBenefitsChange }: BenefitsSectionProps) {
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customBenefit, setCustomBenefit] = useState("");

  const toggleBenefit = (benefit: Benefit) => {
    const newBenefits = benefits.some((b) => b.id === benefit.id)
      ? benefits.filter((b) => b.id !== benefit.id)
      : [...benefits, benefit];
    onBenefitsChange(newBenefits);
  };

  const handleAddCustomBenefit = () => {
    if (customBenefit.trim()) {
      const newBenefit = {
        id: `custom-${customBenefit.toLowerCase().replace(/\s+/g, "-")}`,
        name: customBenefit.trim(),
        icon: "✨",
        isCustom: true,
      };
      onBenefitsChange([...benefits, newBenefit]);
      setCustomBenefit("");
      setShowCustomInput(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-baseline">
        <label className="text-sm font-medium text-gray-700">Beneficios de la empresa</label>
        {benefits.length > 0 && (
          <span className="text-sm text-gray-500">
            {benefits.length} seleccionado{benefits.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {/* Selected benefits */}
        {benefits.map((benefit) => (
          <Button key={benefit.id} variant="secondary" onClick={() => toggleBenefit(benefit)}>
            <Check className="w-4 h-4 mr-2" />
            {benefit.name}
          </Button>
        ))}

        {/* Available preset benefits */}
        {PRESET_BENEFITS.filter((benefit) => !benefits.some((b) => b.id === benefit.id)).map((benefit) => (
          <Button key={benefit.id} variant="outline" onClick={() => toggleBenefit(benefit)}>
            {benefit.icon} {benefit.name}
          </Button>
        ))}

        {!showCustomInput && (
          <Button variant="outline" onClick={() => setShowCustomInput(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Añadir otro
          </Button>
        )}
      </div>

      {showCustomInput && (
        <div className="flex gap-2">
          <Input
            value={customBenefit}
            onChange={(e) => setCustomBenefit(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleAddCustomBenefit()}
            placeholder="ej., Clases de inglés"
            className="flex-1"
            autoFocus
          />
          <Button onClick={handleAddCustomBenefit}>Añadir</Button>
          <Button
            variant="outline"
            onClick={() => {
              setShowCustomInput(false);
              setCustomBenefit("");
            }}
          >
            Cancelar
          </Button>
        </div>
      )}
    </div>
  );
}
