"use client";

import React from "react";

export default function CreateJobForm() {
  return (
    <div className="max-w-[600px] mx-auto bg-white rounded-2xl p-8">
      <h1 className="text-2xl font-normal text-gray-900 mb-8">Publicar Oferta de Diseño</h1>

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          const data = Object.fromEntries(formData);
          console.log("Formulario enviado:", data);
        }}
        className="space-y-6"
      >
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
            placeholder="ej., contratacion@empresa.com"
            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:border-blue-500"
          />
        </div>

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
            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:border-blue-500 appearance-none"
          >
            <option value="remote">Remoto</option>
            <option value="hybrid">Híbrido</option>
            <option value="onsite">Presencial</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-normal text-gray-600 mb-1">Rango Salarial</label>
          <input
            type="text"
            name="salary_range"
            placeholder="ej., 45K-60K €/año"
            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:border-blue-500"
          />
        </div>

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
          className="w-full py-3 bg-[#2563EB] text-white font-normal rounded-lg hover:bg-blue-600 transition-colors"
        >
          Continuar al Pago
        </button>
      </form>
    </div>
  );
}
