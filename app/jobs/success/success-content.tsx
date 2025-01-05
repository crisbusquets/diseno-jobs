// app/jobs/success/success-content.tsx
"use client";

import { useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";
import JobCard from "@/components/jobs/cards/job-card";
import CopyLinkButton from "@/components/common/buttons/copy-link-button";
import { Job } from "@/types";

interface SuccessContentProps {
  job: Job;
  managementUrl: string;
  emailSent: boolean;
}

export function SuccessContent({ job, managementUrl, emailSent }: SuccessContentProps) {
  const { toast } = useToast();

  useEffect(() => {
    if (emailSent) {
      toast({
        title: "Email enviado",
        description: "Se ha enviado un email de confirmación a tu correo",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Error en el envío",
        description: "No se pudo enviar el email de confirmación, pero tu oferta está activa",
      });
    }
  }, [emailSent, toast]);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow p-6 md:p-8">
          {/* Success Icon */}
          <div className="mb-6">
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mx-auto">
              <svg
                className="h-6 w-6 text-green-600"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          {/* Success Message */}
          <h1 className="text-2xl font-semibold text-center text-gray-900 mb-2">¡Tu oferta ha sido publicada!</h1>
          <p className="text-gray-600 text-center mb-8">Tu oferta ya está disponible en DisñoJobs</p>

          {/* Job Details */}
          <div className="mb-6">
            <JobCard job={job} variant="detailed" showApplySection={false} />
          </div>

          {/* Management Link Section */}
          <div className="bg-blue-50 rounded-lg p-4 mb-4">
            <h3 className="font-medium text-blue-900 mb-2">Enlace de gestión</h3>
            <p className="text-blue-800 text-sm mb-4">Guarda este enlace para gestionar tu oferta en el futuro:</p>
            <div className="bg-white p-3 rounded border border-blue-200 break-all text-sm text-blue-600 mb-3">
              {managementUrl}
            </div>
            <div className="flex space-x-3 items-center">
              <CopyLinkButton url={managementUrl} />
              <Link href={managementUrl} className="text-sm text-blue-700 hover:text-blue-800 font-medium">
                Gestionar oferta →
              </Link>
            </div>
          </div>

          {/* Email Sent Confirmation */}
          <div className="bg-green-50 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">Email de confirmación enviado</h3>
                <p className="mt-1 text-sm text-green-600">
                  Hemos enviado un email a {job.company_email} con el enlace de gestión y los detalles de tu oferta.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <Link
              href={`/jobs/${job.id}`}
              className="block w-full py-3 px-4 text-center bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Ver mi publicación
            </Link>

            <Link
              href="/"
              className="block w-full py-3 px-4 text-center bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
            >
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
