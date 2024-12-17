// app/components/jobs/create-job-form.tsx

"use client";

import React, { useState } from "react";
import { createPaymentSession } from "@/api/stripe/actions";
import LogoUpload from "@/components/common/forms/logo-upload";
import { ApplyMethodSection } from "@/components/common/forms/apply-method-section";
import { BenefitsSection } from "@/components/common/forms/benefits-section";
import { JobType, JobFormData, ApplicationMethod, Benefit } from "@/types";
import { validateJobForm, validateApplicationMethod } from "@/lib/utils/validation";
import { JOB_TYPES, DEFAULT_BENEFITS } from "@/lib/config/constants";
import LocationSelector from "@/components/common/forms/location-selector";

export default function CreateJobForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [logo, setLogo] = useState("");
  const [benefits, setBenefits] = useState<Benefit[]>([]);
  const [applyMethod, setApplyMethod] = useState<ApplicationMethod>({
    type: "email",
    value: "",
  });

  const [locations, setLocations] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const formData = new FormData(e.currentTarget);

      // Validate form
      const validationErrors = validateJobForm(formData);
      if (validationErrors.length > 0) {
        throw new Error(validationErrors[0].message);
      }

      // Validate application method
      const applicationError = validateApplicationMethod(applyMethod.type, applyMethod.value);
      if (applicationError) {
        throw new Error(applicationError);
      }

      // Create job data object
      const jobData: JobFormData = {
        title: formData.get("title") as string,
        company: formData.get("company") as string,
        company_email: formData.get("email") as string,
        company_logo: logo,
        description: formData.get("description") as string,
        job_type: formData.get("job_type") as JobType,
        location: (formData.get("location") as string) || null,
        salary_min: formData.get("salary_min") ? Number(formData.get("salary_min")) : undefined,
        salary_max: formData.get("salary_max") ? Number(formData.get("salary_max")) : undefined,
        benefits: benefits,
        application_method_type: applyMethod.type,
        application_method_value: applyMethod.value,
      };

      const result = await createPaymentSession(jobData);

      if (!result.success) {
        throw new Error(result.error);
      }

      if (result.data?.url) {
        window.location.href = result.data.url;
      } else {
        throw new Error("No URL received from payment session");
      }
    } catch (error) {
      console.error("Error:", error);
      setError(error instanceof Error ? error.message : "Error al procesar tu solicitud");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-[600px] mx-auto bg-white rounded-2xl p-8">
      <h1 className="text-2xl font-normal text-gray-900 mb-8">Publicar Oferta de Diseño</h1>

      {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Company Info Section */}
        <div className="space-y-6">
          <LogoUpload value={logo} onChange={setLogo} />

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
              name="email"
              required
              placeholder="ej., contacto@empresa.com"
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Job Details Section */}
        <div className="space-y-6 pt-6 border-t">
          <div>
            <label className="block text-sm font-normal text-gray-600 mb-1">Título del Puesto *</label>
            <input
              type="text"
              name="title"
              required
              placeholder="ej., Diseñador/a UX Senior"
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-normal text-gray-600 mb-1">Ubicación</label>
            <LocationSelector value={locations} onChange={setLocations} />
          </div>

          <div>
            <label className="block text-sm font-normal text-gray-600 mb-1">Modalidad de Trabajo *</label>
            <select
              name="job_type"
              required
              defaultValue=""
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:border-blue-500"
            >
              <option value="" disabled>
                Selecciona una modalidad
              </option>
              <option value={JOB_TYPES.REMOTE}>Remoto</option>
              <option value={JOB_TYPES.HYBRID}>Híbrido</option>
              <option value={JOB_TYPES.ONSITE}>Presencial</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-normal text-gray-600 mb-1">Salario Mínimo (€)</label>
              <input
                type="number"
                name="salary_min"
                placeholder="ej., 45000"
                min="0"
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-normal text-gray-600 mb-1">Salario Máximo (€)</label>
              <input
                type="number"
                name="salary_max"
                placeholder="ej., 60000"
                min="0"
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-normal text-gray-600 mb-1">Descripción del Puesto *</label>
            <textarea
              name="description"
              required
              rows={6}
              placeholder="Describe el rol, responsabilidades, requisitos y cualquier otra información relevante..."
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:border-blue-500 resize-none"
            />
          </div>
        </div>

        {/* Benefits & Application Method Section */}
        <div className="space-y-6 pt-6 border-t">
          <BenefitsSection benefits={benefits} onBenefitsChange={setBenefits} defaultBenefits={DEFAULT_BENEFITS} />

          <ApplyMethodSection value={applyMethod} onChange={setApplyMethod} />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 bg-blue-600 text-white font-normal rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Procesando..." : "Continuar al Pago"}
        </button>
      </form>
    </div>
  );
}
