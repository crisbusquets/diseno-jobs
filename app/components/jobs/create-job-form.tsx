'use client';

import React, { useState } from "react";
import { createPaymentSession } from "@/actions/stripe";
import LogoUpload from "@/components/logo-upload";
import { ApplyMethodSection } from "@/components/apply-method-section";
import { BenefitsSection } from "@/components/benefits-section";

interface Benefit {
  name: string;
  icon?: string;
  isCustom?: boolean;
}

export default function CreateJobForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [logo, setLogo] = useState("");
  const [benefits, setBenefits] = useState<Benefit[]>([]);
  const [applyMethod, setApplyMethod] = useState({
    type: 'email' as const,
    value: ''
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const formData = new FormData(e.currentTarget);
      
      // Validate required fields
      const requiredFields = ['title', 'company', 'email', 'job_type', 'description'];
      for (const field of requiredFields) {
        if (!formData.get(field)) {
          throw new Error(`El campo ${field} es obligatorio`);
        }
      }

      // Create the job data object with all fields
      const data = {
        title: formData.get("title") as string,
        company: formData.get("company") as string,
        company_email: formData.get("email") as string,
        company_logo: logo,
        description: formData.get("description") as string,
        job_type: formData.get("job_type") as string,
        location: formData.get("location") as string || null,
        salary_min: formData.get("salary_min") ? Number(formData.get("salary_min")) : null,
        salary_max: formData.get("salary_max") ? Number(formData.get("salary_max")) : null,
        benefits: benefits,
        application_method_type: applyMethod.type,
        application_method_value: applyMethod.value
      };

      console.log('Submitting job data:', data); // Debug log

      const { url } = await createPaymentSession(data);
      if (url) {
        window.location.href = url;
      } else {
        throw new Error('No URL received from payment session');
      }
    } catch (error) {
      console.error("Error:", error);
      alert('Hubo un error al procesar tu solicitud. Por favor, inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-[600px] mx-auto bg-white rounded-2xl p-8">
      <h1 className="text-2xl font-normal text-gray-900 mb-8">Publicar Oferta de Diseño</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Company Info Section */}
        <div className="space-y-6">
          <LogoUpload value={logo} onChange={setLogo} />

          <div>
            <label className="block text-sm font-normal text-gray-600 mb-1">
              Nombre de la Empresa *
            </label>
            <input
              type="text"
              name="company"
              required
              placeholder="ej., Design Studio Inc."
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-normal text-gray-600 mb-1">
              Email de la Empresa *
            </label>
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
            <label className="block text-sm font-normal text-gray-600 mb-1">
              Título del Puesto *
            </label>
            <input
              type="text"
              name="title"
              required
              placeholder="ej., Diseñador/a UX Senior"
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-normal text-gray-600 mb-1">
              Ubicación
            </label>
            <input
              type="text"
              name="location"
              placeholder="ej., Madrid, España"
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-normal text-gray-600 mb-1">
              Modalidad de Trabajo *
            </label>
            <select
              name="job_type"
              required
              defaultValue=""
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:border-blue-500"
            >
              <option value="" disabled>Selecciona una modalidad</option>
              <option value="remote">Remoto</option>
              <option value="hybrid">Híbrido</option>
              <option value="onsite">Presencial</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-normal text-gray-600 mb-1">
                Salario Mínimo (€)
              </label>
              <input
                type="number"
                name="salary_min"
                placeholder="ej., 45000"
                min="0"
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-normal text-gray-600 mb-1">
                Salario Máximo (€)
              </label>
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
            <label className="block text-sm font-normal text-gray-600 mb-1">
              Descripción del Puesto *
            </label>
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
          <BenefitsSection 
            benefits={benefits}
            onBenefitsChange={setBenefits}
          />

          <ApplyMethodSection 
            value={applyMethod}
            onChange={setApplyMethod}
          />
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
