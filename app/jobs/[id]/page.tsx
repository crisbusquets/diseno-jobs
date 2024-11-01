"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useParams } from "next/navigation";

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  job_type: "remote" | "onsite" | "hybrid";
  description: string;
  requirements: string[];
  salary_min?: number;
  salary_max?: number;
  created_at: string;
}

export default function JobDetailsPage() {
  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const params = useParams();
  const supabase = createClientComponentClient();

  useEffect(() => {
    const fetchJob = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase.from("job_listings").select("*").eq("id", params.id).single();

        if (error) throw error;
        setJob(data);
      } catch (error) {
        console.error("Error fetching job:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchJob();
    }
  }, [params.id, supabase]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center py-12">Cargando...</div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center py-12 text-red-600">No se encontró el empleo solicitado.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-gray-100">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{job.title}</h1>

            <div className="flex flex-wrap items-center gap-2 text-gray-600">
              <span className="font-medium text-gray-900">{job.company}</span>
              <span className="text-gray-300">•</span>
              <span>{job.location}</span>
              <span className="text-gray-300">•</span>
              <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                {job.job_type === "remote" ? "Remoto" : job.job_type === "onsite" ? "Presencial" : "Híbrido"}
              </span>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Salary Range */}
            {(job.salary_min || job.salary_max) && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Rango Salarial</h2>
                <div className="text-gray-900 font-medium">
                  {job.salary_min && job.salary_max
                    ? `€${job.salary_min.toLocaleString()} - €${job.salary_max.toLocaleString()}`
                    : job.salary_min
                    ? `Desde €${job.salary_min.toLocaleString()}`
                    : `Hasta €${job.salary_max?.toLocaleString()}`}
                </div>
              </div>
            )}

            {/* Description */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Descripción</h2>
              <div className="text-gray-700 prose max-w-none">{job.description}</div>
            </div>

            {/* Requirements */}
            {job.requirements && job.requirements.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Requisitos</h2>
                <ul className="space-y-2">
                  {job.requirements.map((req, index) => (
                    <li key={index} className="flex items-start">
                      <span className="mr-2">•</span>
                      <span className="text-gray-700">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Published Date */}
            <div className="pt-4 mt-6 border-t border-gray-100">
              <div className="text-sm text-gray-500">
                Publicado el{" "}
                {new Date(job.created_at).toLocaleDateString("es-ES", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
