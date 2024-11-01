// app/actions/jobs.ts
"use server";

import { createClient } from "../lib/supabase";
import { cookies } from "next/headers";

export async function searchJobs(filters: { search?: string; jobType?: string; location?: string }) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  let query = supabase.from("job_listings").select("*").eq("is_active", true);

  if (filters.search) {
    query = query.or(`title.ilike.%${filters.search}%,company.ilike.%${filters.search}%`);
  }

  if (filters.jobType && filters.jobType !== "all") {
    query = query.eq("job_type", filters.jobType);
  }

  if (filters.location) {
    query = query.ilike("location", `%${filters.location}%`);
  }

  const { data, error } = await query.order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}
