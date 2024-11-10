// app/components/common/forms/apply-method-section.tsx

"use client";

import React, { useState } from "react";
import { Mail, Globe } from "lucide-react";
import { ApplicationMethod } from "@/types";

interface ApplyMethodProps {
  value: ApplicationMethod;
  onChange: (value: ApplicationMethod) => void;
}

export function ApplyMethodSection({ value, onChange }: ApplyMethodProps) {
  const [methodType, setMethodType] = useState<ApplicationMethod["type"]>(value?.type || "email");

  const handleTypeChange = (type: ApplicationMethod["type"]) => {
    setMethodType(type);
    onChange({ type, value: "" });
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">Método de aplicación *</label>

      <div className="flex gap-4 p-1 bg-gray-50 rounded-lg w-fit">
        <button
          type="button"
          onClick={() => handleTypeChange("email")}
          className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
            methodType === "email" ? "bg-white shadow-sm text-blue-600" : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <Mail className="w-4 h-4" />
          Email
        </button>
        <button
          type="button"
          onClick={() => handleTypeChange("url")}
          className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
            methodType === "url" ? "bg-white shadow-sm text-blue-600" : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <Globe className="w-4 h-4" />
          URL
        </button>
      </div>

      <div>
        <input
          type={methodType === "email" ? "email" : "url"}
          value={value.value}
          onChange={(e) => onChange({ type: methodType, value: e.target.value })}
          placeholder={methodType === "email" ? "jobs@company.com" : "https://company.com/apply"}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
        <p className="mt-2 text-sm text-gray-500">
          {methodType === "email"
            ? "Los candidatos recibirán un botón para enviar email directamente"
            : "Los candidatos serán redirigidos a esta URL para aplicar"}
        </p>
      </div>
    </div>
  );
}
