// app/components/jobs/create-job-form.tsx
"use client";

import React, { useState } from "react";
import { createPaymentSession } from "@/actions/stripe";
import LogoUpload from "@/components/logo-upload";

export default function CreateJobForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [logo, setLogo] = useState("");

  const handleLogoChange = (url: string) => {
    console.log('Form received new logo URL:', url);
    setLogo(url);
  };

  return (
    <div className="max-w-[600px] mx-auto bg-white rounded-2xl p-8">
      <h1 className="text-2xl font-normal text-gray-900 mb-8">Publicar Oferta de Diseño</h1>

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setIsSubmitting(true);
          
          try {
            const formData = new FormData(e.currentTarget);
            const data = {
              title: formData.get("title"),
              company: formData.get("company"),
              email: formData.get("email"),
              description: formData.get("description"),
              job_type: formData.get("job_type"),
              salary_min: formData.get("salary_min"),
              salary_max: formData.get("salary_max"),
              company_logo: logo // Include the logo URL
            };

            console.log('Submitting data:', data);

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
        }}
        className="space-y-6"
      >
        {/* Logo Upload */}
        <div>
          <label className="block text-sm font-normal text-gray-600 mb-1">Logo de la Empresa</label>
          <LogoUpload
            value={logo}
            onChange={handleLogoChange}
          />
        </div>

        {/* Company Name */}
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

        {/* Company Email */}
        <div>
          <label className="block text-sm font-normal text-gray-600 mb-1">Email de la Empresa *</label>
          <input
            type="email"
            name="email"
            required
            placeholder="ej., contratacion@empresa.com"
            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Job Title */}
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

        {/* Job Type */}
        <div>
          <label className="block text-sm font-normal text-gray-600 mb-1">Modalidad de Trabajo</label>
          <select
            name="job_type"
            defaultValue="remote"
            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:border-blue-500 appearance-none"
          >
            <option value="remote">Remoto</option>
            <option value="hybrid">Híbrido</option>
            <option value="onsite">Presencial</option>
          </select>
        </div>

        {/* Salary Range */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-normal text-gray-600 mb-1">Salario Mínimo (€)</label>
            <input
              type="number"
              name="salary_min"
              placeholder="ej., 45000"
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-normal text-gray-600 mb-1">Salario Máximo (€)</label>
            <input
              type="number"
              name="salary_max"
              placeholder="ej., 60000"
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
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

        {/* Submit Button */}
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
