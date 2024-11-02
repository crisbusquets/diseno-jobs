// app/jobs/manage/[token]/page.tsx
import { getSupabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import ManageJobForm from "@/components/jobs/manage-job-form";

export default async function ManageJobPage({ params }: { params: { token: string } }) {
  const supabase = getSupabase();

  // Get job by management token
  const { data: job } = await supabase.from("job_listings").select("*").eq("management_token", params.token).single();

  if (!job) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow p-6 md:p-8">
          <h1 className="text-2xl font-semibold mb-6">Gestionar Oferta de Empleo</h1>

          <div className="mb-8">
            <div className="bg-blue-50 rounded-lg p-4">
              <h2 className="font-medium text-blue-800 mb-2">{job.title}</h2>
              <p className="text-blue-600 text-sm">{job.company}</p>
            </div>
          </div>

          <ManageJobForm job={job} token={params.token} />
        </div>
      </div>
    </div>
  );
}
