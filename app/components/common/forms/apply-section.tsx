// app/components/common/forms/apply-section.tsx

"use client";

import React from "react";
import { ArrowRight, Mail, Globe } from "lucide-react";
import { ApplicationMethod } from "@/types";

interface ApplySectionProps {
  method: ApplicationMethod;
}

export function ApplySection({ method }: ApplySectionProps) {
  const handleApply = () => {
    if (!method.value) return;

    if (method.type === "email") {
      window.location.href = `mailto:${method.value}`;
    } else {
      // Ensure URL has protocol
      let url = method.value;
      if (!url.startsWith("http://") && !url.startsWith("https://")) {
        url = `https://${url}`;
      }
      window.open(url, "_blank");
    }
  };

  return (
    <div className="mt-8 pt-8 border-t border-gray-200">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-xl font-semibold text-gray-900">¿Te interesa esta posición?</h2>

        <button
          onClick={handleApply}
          className="mt-6 w-full md:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {method.type === "email" ? (
            <>
              <Mail className="w-5 h-5" />
              Enviar email
            </>
          ) : (
            <>
              <Globe className="w-5 h-5" />
              Aplicar ahora
            </>
          )}
          <ArrowRight className="w-4 h-4" />
        </button>

        <p className="mt-4 text-sm text-gray-500">
          {method.type === "email"
            ? "Se abrirá tu cliente de email para enviar tu aplicación"
            : "Serás redirigido al formulario de aplicación"}
        </p>
      </div>
    </div>
  );
}
