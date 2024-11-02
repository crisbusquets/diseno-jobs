// app/components/jobs/create-job-form.tsx
// app/components/jobs/create-job-form.tsx
"use client";

import React, { useState } from "react";
import { createJob } from "@/actions/jobs";
import { loadStripe } from "@stripe/stripe-js";
import { createPaymentSession } from "@/actions/stripe";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const BENEFITS_OPTIONS = [
  "Seguro médico",
  "Gimnasio gratuito",
  "Formación continua",
  "Horario flexible",
  "Teletrabajo",
  "Plan de pensiones",
  "Bonus anual",
  "Stock options",
];

export default function CreateJobForm() {
  const [selectedBenefits, setSelectedBenefits] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);
      formData.append("benefits", JSON.stringify(selectedBenefits));

      // Create the job
      const result = await createJob(formData);

      if (!result.success) {
        setError(result.error || "Unknown error occurred");
        return;
      }

      // Initialize Stripe
      const stripe = await stripePromise;
      if (!stripe) {
        setError("Could not initialize payment system");
        return;
      }

      // Get Stripe session
      const { sessionId, url } = await createPaymentSession(result.jobId);

      // Redirect to Stripe Checkout
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error("Error:", error);
      setError(error instanceof Error ? error.message : "Failed to process request");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="max-w-[600px] mx-auto bg-white rounded-2xl p-8">
      <h1 className="text-2xl font-normal text-gray-900 mb-8">Publicar Oferta de Diseño</h1>

      {error && <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">{error}</div>}

      <form onSubmit={onSubmit} className="space-y-6">
        {/* Company Information */}
        <div>
          <label className="block text-sm font-normal text-gray-600 mb-1">Nombre de la Empresa *</label>
          <input
            type="text"
            name="company"
            required
            placeholder="ej., Design Studio Inc."
            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-normal text-gray-600 mb-1">Email de la Empresa *</label>
          <input
            type="email"
            name="company_email"
            required
            placeholder="ej., contratacion@empresa.com"
            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Logo Upload */}
        <div>
          <label className="block text-sm font-normal text-gray-600 mb-1">Logo de la Empresa</label>
          <input
            type="file"
            name="company_logo"
            accept="image/*"
            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-400 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Job Details */}
        <div>
          <label className="block text-sm font-normal text-gray-600 mb-1">Título del Puesto *</label>
          <input
            type="text"
            name="title"
            required
            placeholder="ej., Diseñador/a Product Senior"
            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-normal text-gray-600 mb-1">Modalidad de Trabajo</label>
          <select
            name="job_type"
            defaultValue="remote"
            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:border-blue-500"
          >
            <option value="remote">Remoto</option>
            <option value="hybrid">Híbrido</option>
            <option value="onsite">Presencial</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-normal text-gray-600 mb-1">Ubicación</label>
          <input
            type="text"
            name="location"
            placeholder="ej., Madrid, Barcelona, etc."
            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Salary Range */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-normal text-gray-600 mb-1">Salario Mínimo (€)</label>
            <input
              type="number"
              name="salary_min"
              placeholder="ej., 35000"
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-normal text-gray-600 mb-1">Salario Máximo (€)</label>
            <input
              type="number"
              name="salary_max"
              placeholder="ej., 45000"
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Benefits */}
        <div>
          <label className="block text-sm font-normal text-gray-600 mb-2">Beneficios</label>
          <div className="grid grid-cols-2 gap-2">
            {BENEFITS_OPTIONS.map((benefit) => (
              <label key={benefit} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedBenefits.includes(benefit)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedBenefits([...selectedBenefits, benefit]);
                    } else {
                      setSelectedBenefits(selectedBenefits.filter((b) => b !== benefit));
                    }
                  }}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{benefit}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Job Description */}
        <div>
          <label className="block text-sm font-normal text-gray-600 mb-1">Descripción del Puesto *</label>
          <textarea
            name="description"
            required
            rows={4}
            placeholder="Describe el rol, requisitos y tu candidato/a ideal..."
            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:border-blue-500 resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 bg-[#2563EB] text-white font-normal rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Procesando..." : "Continuar al Pago"}
        </button>
      </form>
    </div>
  );
}
