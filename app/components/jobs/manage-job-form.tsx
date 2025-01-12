"use client";

import { useState } from "react";
import { updateJob, deactivateJob } from "@/api/jobs/actions";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Job, JobFormData } from "@/types";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import JobCard from "./cards/job-card";
import { JobFormFields, validateJobForm } from "@/components/jobs/forms/job-form-fields";
import { t } from "@/lib/translations/utils";

interface ManageJobFormProps {
  job: Job;
  token: string;
}

export default function ManageJobForm({ job, token }: ManageJobFormProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("preview");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  // Form state
  const [formData, setFormData] = useState<Partial<JobFormData>>({
    title: job.title,
    company: job.company,
    company_email: job.company_email,
    description: job.description,
    job_type: job.job_type,
    experience_level: job.experience_level,
    contract_type: job.contract_type,
    location: job.location || "",
    salary_min: job.salary_min?.toString() || "",
    salary_max: job.salary_max?.toString() || "",
  });
  const [logo, setLogo] = useState(job.company_logo || "");
  const [benefits, setBenefits] = useState(job.benefits || []);
  const [applyMethod, setApplyMethod] = useState({
    type: job.application_method_type,
    value: job.application_method_value,
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
      const formDataToSubmit = new FormData();
      formDataToSubmit.append("token", token);

      // Append form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined && value !== "") {
          formDataToSubmit.append(key, value.toString());
        }
      });

      formDataToSubmit.append("company_logo", logo);
      formDataToSubmit.append("benefits", JSON.stringify(benefits));
      formDataToSubmit.append("application_method_type", applyMethod.type);
      formDataToSubmit.append("application_method_value", applyMethod.value);

      const result = await updateJob(formDataToSubmit);
      if (!result.success) {
        throw new Error(result.error);
      }

      toast({
        title: t("jobs.toasts.saveChanges.title"),
        description: t("jobs.toasts.saveChanges.description"),
      });

      setActiveTab("preview");
    } catch (error) {
      console.error("Update error:", error);
      setFormError(error instanceof Error ? error.message : "Error al guardar los cambios");
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : t("jobs.toasts.saveChanges.error"),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeactivate = async () => {
    try {
      const result = await deactivateJob(token);
      if (!result.success) {
        throw new Error(result.error);
      }

      toast({
        title: t("jobs.toasts.deactivateOfferSuccess.title"),
        description: t("jobs.toasts.deactivateOfferSuccess.description"),
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : t("jobs.toasts.deactivateOfferError"),
      });
    }
  };

  const handleFormChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const currentJobWithUpdates = {
    ...job,
    ...formData,
    benefits,
    company_logo: logo,
    application_method_type: applyMethod.type,
    application_method_value: applyMethod.value,
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl">{t("jobs.manage.title")}</CardTitle>
            <p className="text-muted-foreground">
              {job.is_active ? t("jobs.manage.status.active") : t("jobs.manage.status.inactive")}
            </p>
          </div>
          <Badge variant={job.is_active ? "default" : "secondary"}>
            {job.is_active ? "Activa" : "Inactiva"}
          </Badge>
        </div>
        <div className="flex flex-col gap-2 mt-4 text-sm text-muted-foreground">
          <p>
            {t("jobs.manage.dates.published", {
              date: format(new Date(job.created_at), "d 'de' MMMM, yyyy", { locale: es }),
            })}
          </p>
          {job.activated_at && (
            <p>
              {t("jobs.manage.dates.activated", {
                date: format(new Date(job.activated_at), "d 'de' MMMM, yyyy", { locale: es }),
              })}
            </p>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="preview">{t("jobs.manage.preview.tab")}</TabsTrigger>
            <TabsTrigger value="edit">{t("jobs.manage.edit.tab")}</TabsTrigger>
          </TabsList>

          <TabsContent value="preview">
            <JobCard job={currentJobWithUpdates} variant="detailed" showApplySection={false} />
            
            <div className="flex justify-between items-center mt-6">
              <Button variant="outline" onClick={() => setActiveTab("edit")}>
                {t("jobs.manage.preview.button")}
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">{t("jobs.manage.deactivate.button")}</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>{t("jobs.manage.deactivate.confirm.title")}</AlertDialogTitle>
                    <AlertDialogDescription>
                      {t("jobs.manage.deactivate.confirm.description")}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>{t("jobs.manage.deactivate.confirm.cancel")}</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeactivate} className="bg-destructive text-destructive-foreground">
                      {t("jobs.manage.deactivate.confirm.confirm")}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </TabsContent>

          <TabsContent value="edit">
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

              <div className="flex justify-between items-center mt-6">
                <Button type="button" variant="ghost" onClick={() => setActiveTab("preview")}>
                  {t("jobs.manage.deactivate.confirm.cancel")}
                </Button>

                <div className="space-x-2">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive">{t("jobs.manage.deactivate.button")}</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>{t("jobs.manage.deactivate.confirm.title")}</AlertDialogTitle>
                        <AlertDialogDescription>
                          {t("jobs.manage.deactivate.confirm.description")}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDeactivate}
                          className="bg-destructive text-destructive-foreground"
                        >
                          {t("jobs.manage.deactivate.confirm.confirm")}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? t("common.saving") : t("common.save")}
                  </Button>
                </div>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );