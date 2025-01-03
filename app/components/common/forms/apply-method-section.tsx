import React from "react";
import { Mail, Globe } from "lucide-react";
import { ApplicationMethod } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ApplyMethodProps {
  value: ApplicationMethod;
  onChange: (value: ApplicationMethod) => void;
}

export function ApplyMethodSection({ value, onChange }: ApplyMethodProps) {
  const handleTypeChange = (type: ApplicationMethod["type"]) => {
    onChange({ type, value: "" });
  };

  return (
    <div className="space-y-4">
      <Label>Método de aplicación *</Label>

      <div className="flex gap-4 p-1 bg-gray-50 rounded-lg w-fit">
        <Button
          type="button"
          variant={value.type === "email" ? "secondary" : "ghost"}
          onClick={() => handleTypeChange("email")}
          className="gap-2"
        >
          <Mail className="w-4 h-4" />
          Email
        </Button>
        <Button
          type="button"
          variant={value.type === "url" ? "secondary" : "ghost"}
          onClick={() => handleTypeChange("url")}
          className="gap-2"
        >
          <Globe className="w-4 h-4" />
          URL
        </Button>
      </div>

      <div>
        <Input
          type={value.type === "email" ? "email" : "url"}
          value={value.value}
          onChange={(e) => onChange({ type: value.type, value: e.target.value })}
          placeholder={value.type === "email" ? "jobs@company.com" : "https://company.com/apply"}
          required
        />
        <p className="mt-2 text-sm text-gray-500">
          {value.type === "email"
            ? "Los candidatos recibirán un botón para enviar email directamente"
            : "Los candidatos serán redirigidos a esta URL para aplicar"}
        </p>
      </div>
    </div>
  );
}
