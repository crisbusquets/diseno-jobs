// app/jobs/create/page.tsx
import CreateJobForm from "@/components/jobs/create-job-form";
import { PageTracker } from "@/components/tracking/page-tracker";

export default function CreateJobPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <PageTracker type="create_job_view" />
      <CreateJobForm />
    </main>
  );
}
