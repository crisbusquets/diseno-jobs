"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { JobListing } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function CreateJobListing() {
  const [jobData, setJobData] = useState<Partial<JobListing>>({
    title: "",
    description: "",
    company: "",
    location: "",
    job_type: "remote",
    requirements: [],
  });
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("Debes iniciar sesión");
      }

      const { data, error } = await supabase
        .from("job_listings")
        .insert({
          ...jobData,
          employer_id: user.id,
          posted_at: new Date().toISOString(),
          is_active: true,
        })
        .select();

      if (error) throw error;

      router.push("/jobs");
    } catch (error: any) {
      console.error("Error creating job listing", error);
      alert(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-6">
      <input
        type="text"
        value={jobData.title}
        onChange={(e) => setJobData({ ...jobData, title: e.target.value })}
        placeholder="Título del trabajo"
        required
        className="w-full p-2 border rounded mb-4"
      />
      <textarea
        value={jobData.description}
        onChange={(e) => setJobData({ ...jobData, description: e.target.value })}
        placeholder="Descripción del trabajo"
        required
        className="w-full p-2 border rounded mb-4 h-32"
      />
      <select
        value={jobData.job_type}
        onChange={(e) => setJobData({ ...jobData, job_type: e.target.value as any })}
        className="w-full p-2 border rounded mb-4"
      >
        <option value="remote">Remoto</option>
        <option value="onsite">Presencial</option>
        <option value="hybrid">Híbrido</option>
      </select>
      <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
        Publicar Trabajo
      </button>
    </form>
  );
}
