// app/jobs/create/page.tsx
import CreateJobForm from "@/components/jobs/create-job-form";

export default function CreateJobPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <CreateJobForm />
    </main>
  );
}
