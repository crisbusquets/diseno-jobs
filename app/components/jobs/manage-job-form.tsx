// app/components/jobs/manage-job-form.tsx
"use client";

import { useState } from "react";
import { updateJob, deactivateJob } from "@/actions/jobs";

interface ManageJobFormProps {
  job: any; // We'll define proper types later
  token: string;
}

export default function ManageJobForm({ job, token }: ManageJobFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    try {
      const formData = new FormData(e.currentTarget);
      formData.append("token", token);

      const result = await updateJob(formData);

      if (result.success) {
        setMessage("Oferta actualizada correctamente");
        setIsEditing(false);
      } else {
        setError(result.error || "Error al actualizar la oferta");
      }
    } catch (error) {
      setError("Error al actualizar la oferta");
    }
  };

  const handleDeactivate = async () => {
    if (!confirm("¿Estás seguro de que quieres desactivar esta oferta?")) {
      return;
    }

    try {
      const result = await deactivateJob(token);
      if (result.success) {
        setMessage("Oferta desactivada correctamente");
      } else {
        setError(result.error || "Error al desactivar la oferta");
      }
    } catch (error) {
      setError("Error al desactivar la oferta");
    }
  };

  return (
    <div>
      {error && <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">{error}</div>}

      {message && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-600 rounded-lg">{message}</div>
      )}

      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Título del Puesto</label>
            <input
              type="text"
              name="title"
              defaultValue={job.title}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <textarea
              name="description"
              defaultValue={job.description}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
            />
          </div>

          <div className="flex space-x-4">
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Guardar Cambios
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              Cancelar
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-6">
          <div>
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Editar Oferta
            </button>
          </div>

          <div className="border-t pt-6">
            <button onClick={handleDeactivate} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
              Desactivar Oferta
            </button>
            <p className="mt-2 text-sm text-gray-500">Al desactivar la oferta, dejará de ser visible en el listado</p>
          </div>
        </div>
      )}
    </div>
  );
}
