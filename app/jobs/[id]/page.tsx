// app/jobs/[id]/page.tsx
import { getSupabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import JobCard from "@/components/job-card";

export default async function JobPage({ params }: { params: { id: string } }) {
  const supabase = getSupabase();

  const { data: job } = await supabase
    .from("job_listings")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!job) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <JobCard job={job} variant="detailed" />
      </div>
    </div>
  );
}
