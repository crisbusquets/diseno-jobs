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
    const [
      // General metrics
      homepageViews,
      jobViews,
      applyClicks,
      jobsSubmitted,
      activeJobs,
      weeklyJobs,
      monthlyJobs,

      // Job insights
      jobLocations,
      jobTypes,
      jobTitles,
      experienceLevels,
    ] = await Promise.all([
      // Total counts
      supabase.from("job_events").select("*", { count: "exact", head: true }).eq("event_type", "homepage_view"),
      supabase.from("job_events").select("*", { count: "exact", head: true }).eq("event_type", "view"),
      supabase.from("job_events").select("*", { count: "exact", head: true }).eq("event_type", "apply_click"),
      supabase.from("job_listings").select("*", { count: "exact", head: true }).not("activated_at", "is", null),
      supabase.from("job_listings").select("*", { count: "exact", head: true }).eq("is_active", true),

      // Time-based metrics
      supabase
        .from("job_listings")
        .select("*", { count: "exact", head: true })
        .gte("created_at", lastWeek.toISOString()),
      supabase
        .from("job_listings")
        .select("*", { count: "exact", head: true })
        .gte("created_at", lastMonth.toISOString()),

      // Job insights queries
      supabase.from("job_listings").select("location").eq("is_active", true),
      supabase.from("job_listings").select("job_type").eq("is_active", true),
      supabase.from("job_listings").select("title").eq("is_active", true),
      supabase.from("job_listings").select("experience_level").eq("is_active", true),
    ]);

    // Check for any Supabase errors
    const hasError = [
      homepageViews,
      jobViews,
      applyClicks,
      jobsSubmitted,
      activeJobs,
      weeklyJobs,
      monthlyJobs,
      jobLocations,
      jobTypes,
      jobTitles,
      experienceLevels,
    ].some((result) => result.error);

    if (hasError) {
      throw new Error("Database query error");
    }

    // Calculate growth and rates
    const monthlyJobGrowth = activeJobs.count ? ((monthlyJobs.count || 0) / activeJobs.count) * 100 : 0;
    const weeklyJobGrowth = activeJobs.count ? ((weeklyJobs.count || 0) / activeJobs.count) * 100 : 0;
    const viewToApply = jobViews.count ? ((applyClicks.count || 0) / jobViews.count) * 100 : 0;
    const postingCompletion = jobsSubmitted.count ? ((activeJobs.count || 0) / jobsSubmitted.count) * 100 : 0;

    // Process locations
    const locationBreakdown = {
      remote: jobLocations.data?.filter((j) => j.location === "remote").length || 0,
      spain: jobLocations.data?.filter((j) => j.location === "spain").length || 0,
      latam: jobLocations.data?.filter((j) => j.location?.startsWith("latam")).length || 0,
      other: jobLocations.data?.filter((j) => !["remote", "spain"].includes(j.location || "")).length || 0,
    };

    // Process job types
    const jobTypeBreakdown = {
      remote: jobTypes.data?.filter((j) => j.job_type === "remote").length || 0,
      hybrid: jobTypes.data?.filter((j) => j.job_type === "hybrid").length || 0,
      onsite: jobTypes.data?.filter((j) => j.job_type === "onsite").length || 0,
    };

    // Process design roles
    const designRoles = {
      ux:
        jobTitles.data?.filter(
          (job) => job.title.toLowerCase().includes("ux") || job.title.toLowerCase().includes("user experience")
        ).length || 0,
      ui:
        jobTitles.data?.filter(
          (job) => job.title.toLowerCase().includes("ui") || job.title.toLowerCase().includes("interface")
        ).length || 0,
      product:
        jobTitles.data?.filter(
          (job) => job.title.toLowerCase().includes("product") || job.title.toLowerCase().includes("producto")
        ).length || 0,
      research:
        jobTitles.data?.filter(
          (job) => job.title.toLowerCase().includes("research") || job.title.toLowerCase().includes("investigación")
        ).length || 0,
      other: 0,
    };

    // Calculate "other" design roles
    designRoles.other =
      (jobTitles.data?.length || 0) - (designRoles.ux + designRoles.ui + designRoles.product + designRoles.research);

    // Process experience levels
    const experienceBreakdown = {
      junior: experienceLevels.data?.filter((job) => ["entry", "junior"].includes(job.experience_level)).length || 0,
      mid: experienceLevels.data?.filter((job) => job.experience_level === "mid").length || 0,
      senior: experienceLevels.data?.filter((job) => ["senior", "lead"].includes(job.experience_level)).length || 0,
    };

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
        locationBreakdown,
        jobTypeBreakdown,
        jobInsights: {
          designRoles,
          experienceBreakdown,
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
