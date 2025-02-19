"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RefreshCcw, TrendingUp, ArrowRight, Target, CheckCircle, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { t } from "@/lib/translations/utils";

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
        throw new Error(json.error || t("dashboard.error.fetch"));
      }

      if (json.success) {
        setMetrics(json.data);
      } else {
        setError(json.error || t("dashboard.error.fetch"));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t("dashboard.error.load"));
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
            <p>{t("common.loading")}</p>
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
            {t("common.retry")}
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
            <AlertDescription>{t("dashboard.error.noData")}</AlertDescription>
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
            <h1 className="text-3xl font-bold">{t("dashboard.headings.main")}</h1>
            <p className="text-sm text-muted-foreground mt-1">{t("dashboard.headings.description")}</p>
          </div>
          <Button variant="outline" size="sm" onClick={fetchMetrics}>
            <RefreshCcw className="h-4 w-4 mr-2" />
            {t("common.retry")}
          </Button>
        </div>

        {/* New Key Insights section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{t("dashboard.keyInsights.heading")}</CardTitle>
            <CardDescription>{t("dashboard.keyInsights.description")}</CardDescription>
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
                  <h3 className="font-medium">{t("dashboard.keyInsights.growth")}</h3>
                  <p className="text-sm text-muted-foreground">
                    {metrics.growth.monthlyJobGrowth > 0
                      ? `Creciendo ${metrics.growth.monthlyJobGrowth.toFixed(1)}% este mes con ${
                          metrics.monthlyMetrics.jobsPosted
                        } nuevas ofertas`
                      : "Estable este mes - enfócate en atraer más ofertas"}
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
                  <h3 className="font-medium">{t("dashboard.keyInsights.effectiveness")}</h3>
                  <p className="text-sm text-muted-foreground">
                    {`${metrics.conversionRates.viewToApply.toFixed(1)}% de las vistas acaban en postulación`}
                    {metrics.conversionRates.viewToApply > 10 ? " - progresa bien" : " - necesita mejora"}
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
                  <h3 className="font-medium">{t("dashboard.keyInsights.posting")}</h3>
                  <p className="text-sm text-muted-foreground">
                    {`${metrics.conversionRates.postingCompletion.toFixed(1)}% tasa de finalización`}
                    {metrics.conversionRates.postingCompletion > 80
                      ? " - el flujo funciona adecuadamente"
                      : " - quizás hay que simplificar el flujo"}
                  </p>
                </div>
              </div>

              {/* Weekly Activity */}
              <div className="flex items-start gap-2">
                <div className="p-2 rounded-full bg-blue-100">
                  <Activity className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium">{t("dashboard.keyInsights.weekly")}</h3>
                  <p className="text-sm text-muted-foreground">
                    {`${metrics.weeklyMetrics.jobViews} vistas de ofertas y ${metrics.weeklyMetrics.jobsPosted} nuevas ofertas esta semana`}
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
              <CardTitle>{t("dashboard.activeJobs")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.overview.activeJobs}</div>
              <p className="text-sm text-muted-foreground">
                {metrics.growth.monthlyJobGrowth > 0 && (
                  <span className="text-green-600">+{metrics.growth.monthlyJobGrowth.toFixed(1)}% este mes</span>
                )}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("dashboard.jobViews")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.monthlyMetrics.jobViews}</div>
              <p className="text-sm text-muted-foreground">{metrics.weeklyMetrics.jobViews} esta semana</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("dashboard.applyRate")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.conversionRates.viewToApply.toFixed(1)}%</div>
              <p className="text-sm text-muted-foreground">Ofertas vistas → Solicitud</p>
            </CardContent>
          </Card>
        </div>

        {/* Growth metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>{t("dashboard.monthlyData.heading")}</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-2">
                <div className="flex justify-between">
                  <dt>{t("dashboard.monthlyData.homepage")}</dt>
                  <dd className="font-medium">{metrics.monthlyMetrics.homepageViews}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>{t("dashboard.monthlyData.jobs")}</dt>
                  <dd className="font-medium">{metrics.monthlyMetrics.jobViews}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>{t("dashboard.monthlyData.post")}</dt>
                  <dd className="font-medium">{metrics.monthlyMetrics.jobsPosted}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("dashboard.keyCR.heading")}</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-2">
                <div className="flex justify-between">
                  <dt>{t("dashboard.keyCR.viewApply")}</dt>
                  <dd className="font-medium">{metrics.conversionRates.viewToApply.toFixed(1)}%</dd>
                </div>
                <div className="flex justify-between">
                  <dt>{t("dashboard.keyCR.postForm")}</dt>
                  <dd className="font-medium">{metrics.conversionRates.postingCompletion.toFixed(1)}%</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{t("dashboard.roleAnalysis.heading")}</CardTitle>
            <CardDescription>{t("dashboard.roleAnalysis.description")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-sm font-medium mb-4">{t("dashboard.roleAnalysis.type")}</h3>
                <dl className="space-y-3">
                  <div className="flex items-center justify-between">
                    <dt>UX Design</dt>
                    <dd className="font-medium">
                      {metrics.jobInsights.designRoles.ux} ofertas
                      <span className="text-sm text-muted-foreground ml-2">
                        ({Math.round((metrics.jobInsights.designRoles.ux / metrics.overview.activeJobs) * 100)}%)
                      </span>
                    </dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt>UI Design</dt>
                    <dd className="font-medium">
                      {metrics.jobInsights.designRoles.ui} ofertas
                      <span className="text-sm text-muted-foreground ml-2">
                        ({Math.round((metrics.jobInsights.designRoles.ui / metrics.overview.activeJobs) * 100)}%)
                      </span>
                    </dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt>Product Design</dt>
                    <dd className="font-medium">
                      {metrics.jobInsights.designRoles.product} ofertas
                      <span className="text-sm text-muted-foreground ml-2">
                        ({Math.round((metrics.jobInsights.designRoles.product / metrics.overview.activeJobs) * 100)}%)
                      </span>
                    </dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt>UX Research</dt>
                    <dd className="font-medium">
                      {metrics.jobInsights.designRoles.research} ofertas
                      <span className="text-sm text-muted-foreground ml-2">
                        ({Math.round((metrics.jobInsights.designRoles.research / metrics.overview.activeJobs) * 100)}%)
                      </span>
                    </dd>
                  </div>
                </dl>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-4">{t("dashboard.roleAnalysis.experience")}</h3>
                <dl className="space-y-3">
                  <div className="flex items-center justify-between">
                    <dt>Junior</dt>
                    <dd className="font-medium">
                      {metrics.jobInsights.experienceBreakdown.junior} ofertas
                      <span className="text-sm text-muted-foreground ml-2">
                        (
                        {Math.round(
                          (metrics.jobInsights.experienceBreakdown.junior / metrics.overview.activeJobs) * 100
                        )}
                        %)
                      </span>
                    </dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt>Mid-Level</dt>
                    <dd className="font-medium">
                      {metrics.jobInsights.experienceBreakdown.mid} ofertas
                      <span className="text-sm text-muted-foreground ml-2">
                        ({Math.round((metrics.jobInsights.experienceBreakdown.mid / metrics.overview.activeJobs) * 100)}
                        %)
                      </span>
                    </dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt>Senior</dt>
                    <dd className="font-medium">
                      {metrics.jobInsights.experienceBreakdown.senior} ofertas
                      <span className="text-sm text-muted-foreground ml-2">
                        (
                        {Math.round(
                          (metrics.jobInsights.experienceBreakdown.senior / metrics.overview.activeJobs) * 100
                        )}
                        %)
                      </span>
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Totals section */}
        <Card>
          <CardHeader>
            <CardTitle>{t("dashboard.allTime.heading")}</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <dt className="text-sm text-muted-foreground">{t("dashboard.allTime.totalPostings")}</dt>
                <dd className="text-2xl font-bold">{metrics.overview.totalJobsPosted}</dd>
              </div>
              <div className="space-y-1">
                <dt className="text-sm text-muted-foreground">{t("dashboard.allTime.totalViews")}</dt>
                <dd className="text-2xl font-bold">{metrics.overview.totalJobViews}</dd>
              </div>
              <div className="space-y-1">
                <dt className="text-sm text-muted-foreground">{t("dashboard.allTime.totalApply")}</dt>
                <dd className="text-2xl font-bold">{metrics.overview.totalApplyClicks}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
