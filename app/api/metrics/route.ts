// app/api/metrics/route.ts
import { getSupabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const supabase = getSupabase();
  const now = new Date();
  const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const lastMonth = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  try {
    const [homepageViews, jobViews, applyClicks, jobsSubmitted, activeJobs, weeklyJobs, monthlyJobs] =
      await Promise.all([
        // Total counts
        supabase.from("job_events").select("*", { count: "exact", head: true }).eq("event_type", "homepage_view"),
        supabase.from("job_events").select("*", { count: "exact", head: true }).eq("event_type", "view"),
        supabase.from("job_events").select("*", { count: "exact", head: true }).eq("event_type", "apply_click"),
        supabase.from("job_events").select("*", { count: "exact", head: true }).eq("event_type", "job_submit"),
        supabase.from("job_listings").select("*", { count: "exact", head: true }).eq("is_active", true),
        // Weekly jobs
        supabase
          .from("job_listings")
          .select("*", { count: "exact", head: true })
          .gte("created_at", lastWeek.toISOString()),
        // Monthly jobs
        supabase
          .from("job_listings")
          .select("*", { count: "exact", head: true })
          .gte("created_at", lastMonth.toISOString()),
      ]);

    // Calculate growth and rates
    const monthlyJobGrowth = activeJobs.count ? ((monthlyJobs.count || 0) / activeJobs.count) * 100 : 0;
    const weeklyJobGrowth = activeJobs.count ? ((weeklyJobs.count || 0) / activeJobs.count) * 100 : 0;
    const viewToApply = jobViews.count ? ((applyClicks.count || 0) / jobViews.count) * 100 : 0;
    const postingCompletion = jobsSubmitted.count ? ((activeJobs.count || 0) / jobsSubmitted.count) * 100 : 0;

    return NextResponse.json({
      success: true,
      data: {
        overview: {
          totalHomepageViews: homepageViews.count || 0,
          totalJobViews: jobViews.count || 0,
          totalApplyClicks: applyClicks.count || 0,
          totalJobsPosted: jobsSubmitted.count || 0,
          activeJobs: activeJobs.count || 0,
        },
        weeklyMetrics: {
          homepageViews: weeklyJobs.count || 0,
          jobViews: jobViews.count || 0,
          jobsPosted: weeklyJobs.count || 0,
        },
        monthlyMetrics: {
          homepageViews: monthlyJobs.count || 0,
          jobViews: jobViews.count || 0,
          jobsPosted: monthlyJobs.count || 0,
        },
        conversionRates: {
          viewToApply,
          postingCompletion,
        },
        growth: {
          weeklyJobGrowth,
          monthlyJobGrowth,
        },
      },
    });
  } catch (error) {
    console.error("Error in metrics API:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Server error",
      },
      { status: 500 }
    );
  }
}
