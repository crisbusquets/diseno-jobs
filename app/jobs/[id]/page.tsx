// app/jobs/[id]/page.tsx
import { getSupabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import JobDetails from "@/components/jobs/job-details";

export default async function JobPage({ params }: { params: { id: string } }) {
  const supabase = getSupabase();

  const { data: job } = await supabase.from("job_listings").select("*").eq("id", params.id).single();

  if (!job) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <JobDetails job={job} variant="full" />
      </div>
    </div>
  );
}
