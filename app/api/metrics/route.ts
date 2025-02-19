// app/api/metrics/route.ts
import { getSupabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const supabase = getSupabase();

  try {
    // Get event counts for each type
    const viewCounts = await Promise.all([
      // Homepage views
      supabase.from("job_events").select("*", { count: "exact", head: true }).eq("event_type", "homepage_view"),

      // Create job form views
      supabase.from("job_events").select("*", { count: "exact", head: true }).eq("event_type", "create_job_view"),

      // Job listing views
      supabase.from("job_events").select("*", { count: "exact", head: true }).eq("event_type", "view"),

      // Apply clicks
      supabase.from("job_events").select("*", { count: "exact", head: true }).eq("event_type", "apply_click"),

      // Jobs submitted
      supabase.from("job_events").select("*", { count: "exact", head: true }).eq("event_type", "job_submit"),

      // Active jobs
      supabase.from("job_listings").select("*", { count: "exact", head: true }).eq("is_active", true),
    ]);

    const [homepageViews, createJobViews, jobViews, appliesClicked, jobsSubmitted, activeJobs] = viewCounts;

    // Check for any errors
    if (viewCounts.some((result) => result.error)) {
      const error = viewCounts.find((result) => result.error)?.error;
      console.error("Database error:", error);
      return NextResponse.json({ success: false, error: "Database error" }, { status: 500 });
    }

    // Calculate conversion rates
    const createToSubmit = createJobViews.count ? (jobsSubmitted.count! / createJobViews.count!) * 100 : 0;
    const viewToApply = jobViews.count ? (appliesClicked.count! / jobViews.count!) * 100 : 0;

    return NextResponse.json({
      success: true,
      data: {
        totalEvents: {
          homepageViews: homepageViews.count || 0,
          createJobViews: createJobViews.count || 0,
          jobViews: jobViews.count || 0,
          appliesClicked: appliesClicked.count || 0,
          jobsSubmitted: jobsSubmitted.count || 0,
        },
        activeJobs: activeJobs.count || 0,
        conversionRates: {
          createToSubmit,
          viewToApply,
        },
      },
    });
  } catch (error) {
    console.error("Error in metrics API:", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
