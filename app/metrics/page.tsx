"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RefreshCcw, TrendingUp, ArrowRight, Target, CheckCircle, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

interface Metrics {
  overview: {
    totalHomepageViews: number;
    totalJobViews: number;
    totalApplyClicks: number;
    totalJobsPosted: number;
    activeJobs: number;
  };
  weeklyMetrics: {
    homepageViews: number;
    jobViews: number;
    jobsPosted: number;
  };
  monthlyMetrics: {
    homepageViews: number;
    jobViews: number;
    jobsPosted: number;
  };
  conversionRates: {
    viewToApply: number;
    postingCompletion: number;
  };
  growth: {
    weeklyJobGrowth: number;
    monthlyJobGrowth: number;
  };
}

export default function MetricsPage() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchMetrics() {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/metrics");
      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.error || "Failed to fetch metrics");
      }

      if (json.success) {
        setMetrics(json.data);
      } else {
        setError(json.error || "Failed to fetch metrics");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error loading metrics");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMetrics();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <div className="animate-spin">
              <RefreshCcw className="h-5 w-5" />
            </div>
            <p>Loading metrics...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <Button onClick={fetchMetrics} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <Alert>
            <AlertDescription>No metrics available</AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Header with time selection */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Growth Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-1">Platform metrics and trends</p>
          </div>
          <Button variant="outline" size="sm" onClick={fetchMetrics}>
            <RefreshCcw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* New Key Insights section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Key Insights</CardTitle>
            <CardDescription>Quick summary of platform health</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Platform Growth */}
              <div className="flex items-start gap-2">
                <div
                  className={cn(
                    "p-2 rounded-full",
                    metrics.growth.monthlyJobGrowth > 0 ? "bg-green-100" : "bg-yellow-100"
                  )}
                >
                  {metrics.growth.monthlyJobGrowth > 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  ) : (
                    <ArrowRight className="h-4 w-4 text-yellow-600" />
                  )}
                </div>
                <div>
                  <h3 className="font-medium">Platform Growth</h3>
                  <p className="text-sm text-muted-foreground">
                    {metrics.growth.monthlyJobGrowth > 0
                      ? `Growing ${metrics.growth.monthlyJobGrowth.toFixed(1)}% this month with ${
                          metrics.monthlyMetrics.jobsPosted
                        } new jobs`
                      : "Steady this month - focus on attracting more job postings"}
                  </p>
                </div>
              </div>

              {/* Job Effectiveness */}
              <div className="flex items-start gap-2">
                <div
                  className={cn(
                    "p-2 rounded-full",
                    metrics.conversionRates.viewToApply > 10 ? "bg-green-100" : "bg-yellow-100"
                  )}
                >
                  <Target className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <h3 className="font-medium">Job Effectiveness</h3>
                  <p className="text-sm text-muted-foreground">
                    {`${metrics.conversionRates.viewToApply.toFixed(1)}% of job views result in applications`}
                    {metrics.conversionRates.viewToApply > 10 ? " - performing well" : " - might need improvement"}
                  </p>
                </div>
              </div>

              {/* Posting Process */}
              <div className="flex items-start gap-2">
                <div
                  className={cn(
                    "p-2 rounded-full",
                    metrics.conversionRates.postingCompletion > 80 ? "bg-green-100" : "bg-yellow-100"
                  )}
                >
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <h3 className="font-medium">Posting Process</h3>
                  <p className="text-sm text-muted-foreground">
                    {`${metrics.conversionRates.postingCompletion.toFixed(1)}% completion rate`}
                    {metrics.conversionRates.postingCompletion > 80
                      ? " - process working smoothly"
                      : " - might need to simplify the process"}
                  </p>
                </div>
              </div>

              {/* Weekly Activity */}
              <div className="flex items-start gap-2">
                <div className="p-2 rounded-full bg-blue-100">
                  <Activity className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium">Weekly Activity</h3>
                  <p className="text-sm text-muted-foreground">
                    {`${metrics.weeklyMetrics.jobViews} job views and ${metrics.weeklyMetrics.jobsPosted} new jobs this week`}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick overview cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Active Jobs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.overview.activeJobs}</div>
              <p className="text-sm text-muted-foreground">
                {metrics.growth.monthlyJobGrowth > 0 && (
                  <span className="text-green-600">+{metrics.growth.monthlyJobGrowth.toFixed(1)}% this month</span>
                )}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Monthly Job Views</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.monthlyMetrics.jobViews}</div>
              <p className="text-sm text-muted-foreground">{metrics.weeklyMetrics.jobViews} this week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Apply Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.conversionRates.viewToApply.toFixed(1)}%</div>
              <p className="text-sm text-muted-foreground">Of job views convert to applies</p>
            </CardContent>
          </Card>
        </div>

        {/* Growth metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-2">
                <div className="flex justify-between">
                  <dt>Homepage Views</dt>
                  <dd className="font-medium">{metrics.monthlyMetrics.homepageViews}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>Job Views</dt>
                  <dd className="font-medium">{metrics.monthlyMetrics.jobViews}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>New Jobs Posted</dt>
                  <dd className="font-medium">{metrics.monthlyMetrics.jobsPosted}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Key Conversions</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-2">
                <div className="flex justify-between">
                  <dt>View to Apply Rate</dt>
                  <dd className="font-medium">{metrics.conversionRates.viewToApply.toFixed(1)}%</dd>
                </div>
                <div className="flex justify-between">
                  <dt>Posting Completion Rate</dt>
                  <dd className="font-medium">{metrics.conversionRates.postingCompletion.toFixed(1)}%</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </div>

        {/* Totals section */}
        <Card>
          <CardHeader>
            <CardTitle>All-Time Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <dt className="text-sm text-muted-foreground">Total Jobs Posted</dt>
                <dd className="text-2xl font-bold">{metrics.overview.totalJobsPosted}</dd>
              </div>
              <div className="space-y-1">
                <dt className="text-sm text-muted-foreground">Total Job Views</dt>
                <dd className="text-2xl font-bold">{metrics.overview.totalJobViews}</dd>
              </div>
              <div className="space-y-1">
                <dt className="text-sm text-muted-foreground">Total Apply Clicks</dt>
                <dd className="text-2xl font-bold">{metrics.overview.totalApplyClicks}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
