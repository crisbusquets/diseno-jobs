// app/metrics/page.tsx
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCcw, TrendingUp, TrendingDown } from "lucide-react";

interface Metrics {
  totalEvents: {
    homepageViews: number;
    createJobViews: number;
    jobViews: number;
    appliesClicked: number;
    jobsSubmitted: number;
  };
  activeJobs: number;
  conversionRates: {
    createToSubmit: number;
    viewToApply: number;
  };
  dailyTrends: any[];
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
      if (json.success) {
        setMetrics(json.data);
      } else {
        setError(json.error);
      }
    } catch (error) {
      setError("Error loading metrics");
      console.error("Error fetching metrics:", error);
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
    return <div className="min-h-screen bg-gray-50 p-8">No metrics available</div>;
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Metrics Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-1">Platform analytics and insights</p>
          </div>
          <Button variant="outline" size="sm" onClick={fetchMetrics}>
            <RefreshCcw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Overview Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Homepage Views</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.totalEvents.homepageViews}</div>
              <p className="text-xs text-muted-foreground">Total homepage visits</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Job Views</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.totalEvents.jobViews}</div>
              <p className="text-xs text-muted-foreground">Total job listing views</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Apply Clicks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.totalEvents.appliesClicked}</div>
              <p className="text-xs text-muted-foreground">Total apply button clicks</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.activeJobs}</div>
              <p className="text-xs text-muted-foreground">Currently listed jobs</p>
            </CardContent>
          </Card>
        </div>

        {/* Conversion Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Create Form Views</CardTitle>
              <CardDescription>Job creation form visits</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.totalEvents.createJobViews}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Jobs Posted</CardTitle>
              <CardDescription>Successfully posted jobs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.totalEvents.jobsSubmitted}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Conversion Rate</CardTitle>
              <CardDescription>Form views to posts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div className="text-2xl font-bold">{metrics.conversionRates.createToSubmit.toFixed(1)}%</div>
                {metrics.conversionRates.createToSubmit > 10 ? (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Job Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Job Performance</CardTitle>
            <CardDescription>View to application conversion</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <div className="flex items-center gap-2">
                  <div className="text-2xl font-bold">
                    {(metrics.totalEvents.jobViews / metrics.activeJobs || 0).toFixed(1)}
                  </div>
                  <span className="text-sm text-muted-foreground">views per job</span>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <div className="text-2xl font-bold">{metrics.conversionRates.viewToApply.toFixed(1)}%</div>
                  <span className="text-sm text-muted-foreground">view to apply rate</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-sm text-muted-foreground text-center mt-8">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>
    </main>
  );
}
