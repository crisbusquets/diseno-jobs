// app/jobs/create/page.tsx
"use client";

import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";

interface JobFormData {
  title: string;
  company: string;
  location: string;
  job_type: "remote" | "onsite" | "hybrid";
  description: string;
  requirements: string;
  salary_min: string;
  salary_max: string;
}

export default function CreateJobPage() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<JobFormData>({
    title: "",
    company: "",
    location: "",
    job_type: "remote",
    description: "",
    requirements: "",
    salary_min: "",
    salary_max: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("Por favor inicia sesión para publicar un trabajo");

      // Convert requirements string to array
      const requirementsArray = formData.requirements
        .split("\n")
        .map((req) => req.trim())
        .filter((req) => req.length > 0);

      const { error: submitError } = await supabase.from("job_listings").insert({
        title: formData.title,
        company: formData.company,
        location: formData.location,
        job_type: formData.job_type,
        description: formData.description,
        requirements: requirementsArray,
        salary_min: parseInt(formData.salary_min) || null,
        salary_max: parseInt(formData.salary_max) || null,
        employer_id: user.id,
        is_active: true,
      });

      if (submitError) throw submitError;

      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Publicar Nuevo Trabajo</h1>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {error && <div className="bg-red-50 text-red-700 p-4 rounded-md">{error}</div>}

            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Título del Puesto *
              </label>
              <input
                type="text"
                name="title"
                id="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md 
                         shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="ej. Diseñador UX Senior"
              />
            </div>

            {/* Company */}
            <div>
              <label htmlFor="company" className="block text-sm font-medium text-gray-700">
                Empresa *
              </label>
              <input
                type="text"
                name="company"
                id="company"
                required
                value={formData.company}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md 
                         shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="ej. Tu Empresa S.A."
              />
            </div>

            {/* Location and Job Type */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                  Ubicación
                </label>
                <input
                  type="text"
                  name="location"
                  id="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md 
                           shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="ej. Madrid, España"
                />
              </div>

              <div>
                <label htmlFor="job_type" className="block text-sm font-medium text-gray-700">
                  Tipo de Trabajo *
                </label>
                <select
                  name="job_type"
                  id="job_type"
                  required
                  value={formData.job_type}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md 
                           shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="remote">Remoto</option>
                  <option value="onsite">Presencial</option>
                  <option value="hybrid">Híbrido</option>
                </select>
              </div>
            </div>

            {/* Salary Range */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="salary_min" className="block text-sm font-medium text-gray-700">
                  Salario Mínimo (€)
                </label>
                <input
                  type="number"
                  name="salary_min"
                  id="salary_min"
                  value={formData.salary_min}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md 
                           shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="ej. 30000"
                />
              </div>

              <div>
                <label htmlFor="salary_max" className="block text-sm font-medium text-gray-700">
                  Salario Máximo (€)
                </label>
                <input
                  type="number"
                  name="salary_max"
                  id="salary_max"
                  value={formData.salary_max}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md 
                           shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="ej. 45000"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Descripción del Puesto *
              </label>
              <textarea
                name="description"
                id="description"
                required
                rows={6}
                value={formData.description}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md 
                         shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Describe el puesto, responsabilidades, y lo que buscas en el candidato ideal..."
              />
            </div>

            {/* Requirements */}
            <div>
              <label htmlFor="requirements" className="block text-sm font-medium text-gray-700">
                Requisitos (uno por línea) *
              </label>
              <textarea
                name="requirements"
                id="requirements"
                required
                rows={4}
                value={formData.requirements}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md 
                         shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="3+ años de experiencia en diseño de producto&#10;Experiencia con Figma&#10;Portfolio con casos de estudio"
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className={`inline-flex items-center px-4 py-2 border border-transparent 
                         text-sm font-medium rounded-md shadow-sm text-white 
                         ${loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
              >
                {loading ? "Publicando..." : "Publicar Trabajo"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
