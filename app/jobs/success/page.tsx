// app/jobs/success/page.tsx
import { getSupabase } from "@/lib/supabase";
import { redirect } from "next/navigation";
import Link from "next/link";
import CopyLinkButton from "@/components/copy-link-button";

export default async function SuccessPage({ searchParams }: { searchParams: { session_id: string } }) {
  if (!searchParams.session_id) {
    redirect("/");
  }

  const supabase = getSupabase();

  // Get the job that was just posted
  const { data: jobs } = await supabase
    .from("job_listings")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(1);

  const job = jobs?.[0];

  if (!job) {
    redirect("/");
  }

  const managementUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/jobs/manage/${job.management_token}`;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-xl mx-auto px-4">
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
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h2 className="font-medium text-gray-900 mb-2">{job.title}</h2>
            <p className="text-gray-600 text-sm mb-2">{job.company}</p>
            <div className="text-sm text-gray-500">
              {job.job_type === "remote" ? "Remoto" : job.job_type === "hybrid" ? "Híbrido" : "Presencial"}
            </div>
          </div>

          {/* Management Link Section */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
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
