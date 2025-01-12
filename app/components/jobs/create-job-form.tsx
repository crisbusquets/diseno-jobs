"use client";

import { useState } from "react";
import { createPaymentSession } from "@/api/stripe/actions";
import { JobFormData } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { JobFormFields, validateJobForm } from "@/components/jobs/forms/job-form-fields";
import { SITE_CONFIG } from "@/lib/config/constants";
import { t } from "@/lib/translations/utils";

export default function CreateJobForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  // Form state
  const [formData, setFormData] = useState<Partial<JobFormData>>({});
  const [logo, setLogo] = useState("");
  const [benefits, setBenefits] = useState([]);
  const [applyMethod, setApplyMethod] = useState({
    type: "email",
    value: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    const error = validateJobForm(formData, applyMethod);
    if (error) {
      setFormError(error);
      toast({
        variant: "destructive",
        title: t("jobs.toasts.validationError"),
        description: error,
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const jobData: JobFormData = {
        ...formData,
        salary_min: formData.salary_min ? Number(formData.salary_min) : undefined,
        salary_max: formData.salary_max ? Number(formData.salary_max) : undefined,
        company_logo: logo,
        benefits: benefits,
        application_method_type: applyMethod.type,
        application_method_value: applyMethod.value,
      } as JobFormData;

      const result = await createPaymentSession(jobData);
      if (!result.success) {
        throw new Error(result.error);
      }

      if (result.data?.url) {
        window.location.href = result.data.url;
      }
    } catch (error) {
      console.error("Submit error:", error);
      setFormError(error instanceof Error ? error.message : "Error al procesar la solicitud");
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : t("jobs.toasts.submitError"),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">{t("jobs.create.title")}</CardTitle>
        <div className="mt-4 flex items-center justify-between rounded-lg border bg-muted/50 p-4">
          <div>
            <p className="text-base font-medium">{t("jobs.create.duration")}</p>
            <p className="text-sm text-muted-foreground">{t("jobs.create.visibility")}</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-medium">{SITE_CONFIG.jobPrice / 100}€</p>
            <p className="text-sm text-muted-foreground">{t("jobs.create.pricingNote")}</p>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit}>
          {formError && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{formError}</AlertDescription>
            </Alert>
          )}

          <JobFormFields
            formData={formData}
            logo={logo}
            benefits={benefits}
            applyMethod={applyMethod}
            onFormDataChange={handleFormChange}
            onLogoChange={setLogo}
            onBenefitsChange={setBenefits}
            onApplyMethodChange={setApplyMethod}
          />

          <div className="mt-8 space-y-4">
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? t("jobs.create.buttons.processing") : t("jobs.create.buttons.continue")}
            </Button>
            <p className="text-sm text-muted-foreground text-center">{t("jobs.create.terms")}</p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
