import { useState } from "react";
import { Plus, Check } from "lucide-react";
import { Benefit } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const PRESET_BENEFITS: Benefit[] = [
  { name: "Seguro médico privado", icon: "🏥" },
  { name: "Seguro dental", icon: "🦷" },
  { name: "Teletrabajo flexible", icon: "🏠" },
  { name: "Horario flexible", icon: "⏰" },
  { name: "Formación continua", icon: "📚" },
  { name: "Presupuesto para equipo", icon: "💻" },
  { name: "Plan de pensiones", icon: "💰" },
  { name: "Ticket restaurante", icon: "🍽️" },
  { name: "Gimnasio", icon: "💪" },
  { name: "Días libres extra", icon: "🌴" },
];

interface BenefitsSectionProps {
  benefits: Benefit[];
  onBenefitsChange: (benefits: Benefit[]) => void;
}

export function BenefitsSection({ benefits, onBenefitsChange }: BenefitsSectionProps) {
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customBenefit, setCustomBenefit] = useState("");

  const toggleBenefit = (benefit: Benefit) => {
    const newBenefits = benefits.some((b) => b.name === benefit.name)
      ? benefits.filter((b) => b.name !== benefit.name)
      : [...benefits, benefit];
    onBenefitsChange(newBenefits);
  };

  const handleAddCustomBenefit = () => {
    if (customBenefit.trim()) {
      onBenefitsChange([...benefits, { name: customBenefit.trim(), icon: "✨", isCustom: true }]);
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
        {PRESET_BENEFITS.map((benefit) => {
          const isSelected = benefits.some((b) => b.name === benefit.name);
          return (
            <Button
              key={benefit.name}
              type="button"
              variant={isSelected ? "secondary" : "outline"}
              onClick={() => toggleBenefit(benefit)}
              className="gap-2"
            >
              {isSelected ? <Check className="w-4 h-4" /> : benefit.icon}
              {benefit.name}
            </Button>
          );
        })}

        {benefits
          .filter((b) => b.isCustom)
          .map((benefit) => (
            <Button
              key={benefit.name}
              type="button"
              variant="secondary"
              onClick={() => toggleBenefit(benefit)}
              className="gap-2"
            >
              <Check className="w-4 h-4" />
              {benefit.name}
            </Button>
          ))}

        {!showCustomInput && (
          <Button type="button" variant="outline" onClick={() => setShowCustomInput(true)} className="gap-2">
            <Plus className="w-4 h-4" />
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
