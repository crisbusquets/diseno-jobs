"use client";

import React, { useState } from "react";
import { createPaymentSession } from "@/api/stripe/actions";
import { JOB_TYPES, SITE_CONFIG, EXPERIENCE_LEVEL, CONTRACT_TYPE } from "@/lib/config/constants";
import { JobType, JobFormData, ExperienceLevel, ContractType } from "@/types";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";

import LogoUpload from "@/components/common/forms/logo-upload";
import { ApplyMethodSection } from "@/components/common/forms/apply-method-section";
import { BenefitsSection } from "@/components/common/forms/benefits-section";
import LocationSelector from "@/components/common/forms/location-selector";

import { t } from "@/lib/translations/utils";

export default function CreateJobForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [logo, setLogo] = useState("");
  const [benefits, setBenefits] = useState([]);
  const [applyMethod, setApplyMethod] = useState({
    type: "email",
    value: "",
  });

  // Form fields state
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    company_email: "",
    description: "",
    job_type: "remote" as JobType,
    experience_level: "" as ExperienceLevel,
    contract_type: "" as ContractType,
    location: "",
    salary_min: "",
    salary_max: "",
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
      const jobData: JobFormData = {
        ...formData,
        salary_min: formData.salary_min ? Number(formData.salary_min) : undefined,
        salary_max: formData.salary_max ? Number(formData.salary_max) : undefined,
        company_logo: logo,
        benefits: benefits,
        application_method_type: applyMethod.type,
        application_method_value: applyMethod.value,
      };

      const result = await createPaymentSession(jobData);

      if (!result.success) {
        throw new Error(result.error);
      }

      if (result.data?.url) {
        window.location.href = result.data.url;
      }
    } catch (error) {
      console.error("Submit error:", error);
      setFormError(error.message || "Error al procesar la solicitud");
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || t("jobs.toasts.submitError"),
      });
    } finally {
      setIsSubmitting(false);
    }
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
        {formError && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{formError}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Company Information Section */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium">{t("jobs.create.company.title")}</h3>
              <p className="text-sm text-muted-foreground">{t("jobs.create.company.description")}</p>
            </div>

            <LogoUpload value={logo} onChange={setLogo} />

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">{t("jobs.form.company")} *</label>
                <Input
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  placeholder={t("jobs.create.company.placeholder")}
                />
              </div>

              <div>
                <label className="text-sm font-medium">{t("jobs.form.email")} *</label>
                <Input
                  name="company_email"
                  type="email"
                  value={formData.company_email}
                  onChange={handleInputChange}
                  placeholder="ej., contacto@empresa.com"
                />
                <p className="text-sm text-muted-foreground mt-1">{t("jobs.create.company.emailHelp")}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Job Details Section */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium">{t("jobs.form.details.title")}</h3>
              <p className="text-sm text-muted-foreground">{t("jobs.form.details.description")}</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">{t("jobs.create.details.titleLabel")} *</label>
                <Input
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder={t("jobs.create.details.titlePlaceholder")}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
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
              </div>
              <div>
                <label className="text-sm font-medium">{t("jobs.form.experience.label")} *</label>
                <Select
                  value={formData.experience_level}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, experience_level: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("jobs.form.experience.placeholder")} />
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
                    <SelectValue placeholder={t("jobs.form.contract.placeholder")} />
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
            <div>
              <h3 className="text-lg font-medium">{t("jobs.form.benefits.title")}</h3>
              <p className="text-sm text-muted-foreground">{t("jobs.form.benefits.description")}</p>
            </div>

            <BenefitsSection benefits={benefits} onBenefitsChange={setBenefits} />

            <ApplyMethodSection value={applyMethod} onChange={setApplyMethod} />
          </div>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col space-y-2">
        <Button onClick={handleSubmit} className="w-full" disabled={isSubmitting}>
          {isSubmitting ? t("jobs.create.buttons.processing") : t("jobs.create.buttons.continue")}
        </Button>
        <p className="text-sm text-muted-foreground text-center">{t("jobs.create.terms")}</p>
      </CardFooter>
    </Card>
  );
}
