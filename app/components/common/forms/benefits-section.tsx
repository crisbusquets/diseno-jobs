// app/components/common/forms/benefits-section.tsx

"use client";

import React, { useState } from "react";
import { Plus, Check } from "lucide-react";
import { Benefit } from "@/types";

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
  { name: "Bonus anual", icon: "💸" },
  { name: "Plan de stock options", icon: "📈" },
];

interface BenefitsSectionProps {
  benefits: Benefit[];
  onBenefitsChange: (benefits: Benefit[]) => void;
}

export function BenefitsSection({ benefits, onBenefitsChange }: BenefitsSectionProps) {
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customBenefit, setCustomBenefit] = useState("");

  const toggleBenefit = (benefit: Benefit) => {
    if (benefits.some((b) => b.name === benefit.name)) {
      onBenefitsChange(benefits.filter((b) => b.name !== benefit.name));
    } else {
      onBenefitsChange([...benefits, benefit]);
    }
  };

  const handleAddCustomBenefit = () => {
    if (customBenefit.trim()) {
      onBenefitsChange([
        ...benefits,
        {
          name: customBenefit.trim(),
          isCustom: true,
          icon: "✨",
        },
      ]);
      setCustomBenefit("");
      setShowCustomInput(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-baseline">
        <label className="block text-sm font-medium text-gray-700">Beneficios de la empresa</label>
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
            <button
              key={benefit.name}
              type="button"
              onClick={() => toggleBenefit(benefit)}
              className={`
                inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm
                transition-all duration-150 hover:bg-gray-50
                ${
                  isSelected
                    ? "bg-blue-50 text-blue-600 hover:bg-blue-100"
                    : "bg-white text-gray-700 border border-gray-200"
                }
              `}
            >
              {isSelected ? <Check className="w-4 h-4" /> : <span className="text-base">{benefit.icon}</span>}
              {benefit.name}
            </button>
          );
        })}

        {/* Show selected custom benefits */}
        {benefits
          .filter((b) => b.isCustom)
          .map((benefit) => (
            <button
              key={benefit.name}
              type="button"
              onClick={() => toggleBenefit(benefit)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm bg-blue-50 text-blue-600 hover:bg-blue-100"
            >
              <Check className="w-4 h-4" />
              {benefit.name}
            </button>
          ))}

        {!showCustomInput && (
          <button
            type="button"
            onClick={() => setShowCustomInput(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
          >
            <Plus className="w-4 h-4" />
            Añadir otro
          </button>
        )}
      </div>

      {showCustomInput && (
        <div className="flex gap-2">
          <input
            type="text"
            value={customBenefit}
            onChange={(e) => setCustomBenefit(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleAddCustomBenefit()}
            placeholder="ej., Clases de inglés"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            autoFocus
          />
          <button
            type="button"
            onClick={handleAddCustomBenefit}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Añadir
          </button>
          <button
            type="button"
            onClick={() => {
              setShowCustomInput(false);
              setCustomBenefit("");
            }}
            className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancelar
          </button>
        </div>
      )}
    </div>
  );
}
