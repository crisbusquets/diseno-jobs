"use client";

import { useState } from "react";
import { updateJob, deactivateJob } from "@/api/jobs/actions";
import { Job, Benefit } from "@/types";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useToast } from "@/components/ui/use-toast";

import LogoUpload from "@/components/common/forms/logo-upload";
import { ApplyMethodSection } from "@/components/common/forms/apply-method-section";
import { BenefitsSection } from "@/components/common/forms/benefits-section";
import LocationSelector from "@/components/common/forms/location-selector";
import { getLocationName } from "@/components/common/forms/location-selector";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { JOB_TYPES, EXPERIENCE_LEVEL, CONTRACT_TYPE } from "@/lib/config/constants";

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
  const [logo, setLogo] = useState(job.company_logo || "");
  const [benefits, setBenefits] = useState<Benefit[]>(job.benefits || []);
  const [applyMethod, setApplyMethod] = useState({
    type: job.application_method_type,
    value: job.application_method_value,
  });

  // Form fields state
  const [formData, setFormData] = useState({
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.title) return t("jobs.create.validation.required");
    if (!formData.company) return t("jobs.create.validation.required");
    if (!formData.company_email) return t("jobs.create.validation.required");
    if (!formData.description) return t("jobs.create.validation.required");
    if (!applyMethod.value) return t("jobs.create.validation.required");

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.company_email)) return t("jobs.create.validation.email");
    if (applyMethod.type === "email" && !emailRegex.test(applyMethod.value))
      return t("jobs.create.validation.applyEmail");

    // URL validation
    if (applyMethod.type === "url" && !applyMethod.value.startsWith("http")) {
      return t("jobs.create.validation.url");
    }

    // Salary validation
    if (formData.salary_min && formData.salary_max) {
      if (Number(formData.salary_min) > Number(formData.salary_max)) {
        return t("jobs.create.validation.salary");
      }
    }

    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    const error = validateForm();
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
      setFormError(error.message || "Error al guardar los cambios");
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || t("jobs.toasts.saveChanges.error"),
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
      console.error("Deactivate error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || t("jobs.toasts.deactivateOfferError"),
      });
    }
  };

  return (
    <Card>
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl">{t("jobs.manage.title")}</CardTitle>
            <CardDescription>
              {job.is_active ? t("jobs.manage.status.active") : t("jobs.manage.status.inactive")}
            </CardDescription>
          </div>
          <Badge variant={job.is_active ? "default" : "secondary"}>{job.is_active ? "Activa" : "Inactiva"}</Badge>
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
                date: format(new Date(job.created_at), "d 'de' MMMM, yyyy", { locale: es }),
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
            <ScrollArea className="h-[600px] rounded-md border p-4">
              <div className="space-y-6">
                {/* Company Info */}
                <div>
                  <h3 className="text-lg font-medium mb-4">{t("jobs.create.company.title")}</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{t("jobs.create.company.titleLabel")}</p>
                      <p>{formData.company}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{t("jobs.create.company.emailLabel")}</p>
                      <p>{formData.company_email}</p>
                    </div>
                  </div>
                  {logo && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-muted-foreground mb-2">{t("jobs.create.company.logo")}</p>
                      <img src={logo} alt="Company logo" className="h-20 object-contain" />
                    </div>
                  )}
                </div>

                <Separator />

                {/* Job Details */}
                <div>
                  <h3 className="text-lg font-medium mb-4">{t("jobs.create.details.title")}</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{t("jobs.create.details.titleLabel")}</p>
                      <p>{formData.title}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{t("jobs.form.experience.label")}</p>
                      <p>{formData.experience_level}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{t("jobs.form.contract.label")}</p>
                      <p>{formData.contract_type}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">{t("jobs.form.workMode.label")}</p>
                        <p>{formData.job_type}</p>
                      </div>
                      {formData.location && (
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">{t("jobs.form.location.label")}</p>
                          <p>{getLocationName(formData.location)}</p>
                        </div>
                      )}
                    </div>
                    {(formData.salary_min || formData.salary_max) && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">{t("jobs.salary.label")}</p>
                        <p>
                          {formData.salary_min && `${formData.salary_min}€`}
                          {formData.salary_min && formData.salary_max && " - "}
                          {formData.salary_max && `${formData.salary_max}€`}
                        </p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{t("jobs.form.description.label")}</p>
                      <p className="whitespace-pre-wrap">{formData.description}</p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Benefits & Application */}
                <div>
                  <h3 className="text-lg font-medium mb-4">{t("jobs.form.benefit.title")}</h3>
                  {benefits.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm font-medium text-muted-foreground mb-2">{t("jobs.benefits.label")}</p>
                      <div className="flex flex-wrap gap-2">
                        {benefits.map((benefit, index) => (
                          <Badge key={index} variant="secondary">
                            {benefit.icon} {benefit.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{t("jobs.application.title")}</p>
                    <p>{applyMethod.value}</p>
                  </div>
                </div>
              </div>
            </ScrollArea>

            {/* Preview Actions */}
            <div className="flex justify-between items-center mt-4">
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
                    <AlertDialogDescription>{t("jobs.manage.deactivate.confirm.description")}</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>{t("jobs.manage.deactivate.confirm.cancel")}</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeactivate}
                      className="bg-destructive text-destructive-foreground"
                    >
                      {t("jobs.manage.deactivate.confirm.confirm")}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </TabsContent>

          <TabsContent value="edit">
            {formError && (
              <Alert variant="destructive" className="mb-6">
                <AlertDescription>{formError}</AlertDescription>
              </Alert>
            )}

            <form className="space-y-8">
              {/* Company Information */}
              <div className="space-y-6">
                <h3 className="text-lg font-medium">{t("jobs.create.company.title")}</h3>

                <LogoUpload value={logo} onChange={setLogo} />

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">{t("jobs.form.company")} *</label>
                    <Input name="company" value={formData.company} onChange={handleInputChange} />
                  </div>

                  <div>
                    <label className="text-sm font-medium">{t("jobs.form.email")} *</label>
                    <Input
                      name="company_email"
                      type="email"
                      value={formData.company_email}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Job Details */}
              <div className="space-y-6">
                <h3 className="text-lg font-medium">{t("jobs.form.details.title")}</h3>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">{t("jobs.create.details.titleLabel")} *</label>
                    <Input name="title" value={formData.title} onChange={handleInputChange} />
                  </div>

                  <div>
                    <label className="text-sm font-medium">{t("jobs.form.workMode.label")} *</label>
                    <Select
                      value={formData.job_type}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, job_type: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t("jobs.form.workMode.placeholder")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={JOB_TYPES.REMOTE}>{t("jobs.form.workMode.remote")}</SelectItem>
                        <SelectItem value={JOB_TYPES.HYBRID}>{t("jobs.form.workMode.hybrid")}</SelectItem>
                        <SelectItem value={JOB_TYPES.ONSITE}>{t("jobs.form.workMode.onsite")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium">{t("jobs.location.label")}</label>
                    <LocationSelector
                      value={formData.location}
                      onChange={(value) => setFormData((prev) => ({ ...prev, location: value }))}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">{t("jobs.form.experience.label")} *</label>
                    <Select
                      value={formData.experience_level}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, experience_level: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un nivel" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={EXPERIENCE_LEVEL.ENTRY}>{t("jobs.form.experience.entry")}</SelectItem>
                        <SelectItem value={EXPERIENCE_LEVEL.JUNIOR}>{t("jobs.form.experience.junior")}</SelectItem>
                        <SelectItem value={EXPERIENCE_LEVEL.MID}>{t("jobs.form.experience.mid")}</SelectItem>
                        <SelectItem value={EXPERIENCE_LEVEL.SENIOR}>{t("jobs.form.experience.senior")}</SelectItem>
                        <SelectItem value={EXPERIENCE_LEVEL.MANAGER}>{t("jobs.form.experience.manager")}</SelectItem>
                        <SelectItem value={EXPERIENCE_LEVEL.LEAD}>{t("jobs.form.experience.lead")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium">{t("jobs.form.contract.label")} *</label>
                    <Select
                      value={formData.contract_type}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, contract_type: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una opción" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={CONTRACT_TYPE.FULLTIME}>{t("jobs.form.contract.fulltime")}</SelectItem>
                        <SelectItem value={CONTRACT_TYPE.PARTTIME}>{t("jobs.form.contract.parttime")}</SelectItem>
                        <SelectItem value={CONTRACT_TYPE.INTERNSHIP}>{t("jobs.form.contract.internship")}</SelectItem>
                        <SelectItem value={CONTRACT_TYPE.FREELANCE}>{t("jobs.form.contract.freelance")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">{t("jobs.form.salary.min")}</label>
                      <Input
                        name="salary_min"
                        type="number"
                        value={formData.salary_min}
                        onChange={handleInputChange}
                        placeholder={t("jobs.form.salary.placeholder.min")}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">{t("jobs.form.salary.max")}</label>
                      <Input
                        name="salary_max"
                        type="number"
                        value={formData.salary_max}
                        onChange={handleInputChange}
                        placeholder={t("jobs.form.salary.placeholder.max")}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium">{t("jobs.form.description.label")} *</label>
                    <Textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder={t("jobs.form.description.placeholder")}
                      className="min-h-[200px] resize-y"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Benefits & Application Section */}
              <div className="space-y-6">
                <h3 className="text-lg font-medium">{t("jobs.form.benefits.title")}</h3>

                <BenefitsSection benefits={benefits} onBenefitsChange={setBenefits} />

                <ApplyMethodSection value={applyMethod} onChange={setApplyMethod} />
              </div>

              {/* Form Actions */}
              <div className="flex justify-between items-center pt-6">
                <Button type="button" variant="ghost" onClick={() => setActiveTab("preview")}>
                  {t("jobs.deactivate.confirm.cancel")}
                </Button>
                <div className="space-x-2">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive">{t("jobs.deactivate.button")}</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>{t("jobs.deactivate.confirm.title")}</AlertDialogTitle>
                        <AlertDialogDescription>{t("jobs.deactivate.confirm.description")}</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDeactivate}
                          className="bg-destructive text-destructive-foreground"
                        >
                          {t("jobs.deactivate.confirm.confirm")}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  <Button onClick={handleSubmit} disabled={isSubmitting}>
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
}
