"use client";

import React from "react";
import { JobFormData, JOB_TYPES, EXPERIENCE_LEVELS, CONTRACT_TYPES, ApplicationMethod } from "@/types";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import LogoUpload from "./logo-upload";
import { ApplyMethodSection } from "./apply-method-section";
import { BenefitsSection } from "./benefits-section";
import LocationSelector from "./location-selector";
import { t } from "@/lib/translations/utils";

interface JobFormFieldsProps {
  formData: Partial<JobFormData>;
  logo: string;
  benefits: any[];
  applyMethod: ApplicationMethod;
  onFormDataChange: (field: string, value: any) => void;
  onLogoChange: (url: string) => void;
  onBenefitsChange: (benefits: any[]) => void;
  onApplyMethodChange: (method: ApplicationMethod) => void;
}

export function JobFormFields({
  formData,
  logo,
  benefits,
  applyMethod,
  onFormDataChange,
  onLogoChange,
  onBenefitsChange,
  onApplyMethodChange,
}: JobFormFieldsProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onFormDataChange(name, value);
  };

  return (
    <div className="space-y-8">
      {/* Company Information */}
      <div className="space-y-6">
        <h3 className="text-lg font-medium">{t("jobs.create.company.title")}</h3>
        <p className="text-sm text-muted-foreground">{t("jobs.create.company.description")}</p>

        <LogoUpload value={logo} onChange={onLogoChange} />

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">{t("jobs.form.company")} *</label>
            <Input
              name="company"
              placeholder={t("jobs.create.company.placeholder")}
              value={formData.company || ""}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label className="text-sm font-medium">{t("jobs.form.email")} *</label>
            <Input
              name="company_email"
              type="email"
              placeholder={t("jobs.application.email.placeholder")}
              value={formData.company_email || ""}
              onChange={handleInputChange}
            />
            <p className="text-sm text-muted-foreground mt-1">{t("jobs.create.company.emailHelp")}</p>
          </div>
        </div>
      </div>

      <Separator />

      {/* Job Details */}
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
              placeholder={t("jobs.create.details.titlePlaceholder")}
              value={formData.title || ""}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label className="text-sm font-medium">{t("jobs.form.workMode.label")} *</label>
            <Select value={formData.job_type || ""} onValueChange={(value) => onFormDataChange("job_type", value)}>
              <SelectTrigger>
                <SelectValue placeholder={t("jobs.form.workMode.placeholder")} />
              </SelectTrigger>
              <SelectContent>
                {Object.values(JOB_TYPES).map((type) => (
                  <SelectItem key={type} value={type}>
                    {t(`jobs.form.workMode.${type}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium">{t("jobs.location.label")}</label>
            <LocationSelector
              value={formData.location || ""}
              onChange={(value) => onFormDataChange("location", value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium">{t("jobs.form.experience.label")} *</label>
            <Select
              value={formData.experience_level || ""}
              onValueChange={(value) => onFormDataChange("experience_level", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder={t("jobs.form.experience.placeholder")} />
              </SelectTrigger>
              <SelectContent>
                {Object.values(EXPERIENCE_LEVELS).map((level) => (
                  <SelectItem key={level} value={level}>
                    {t(`jobs.form.experience.${level}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium">{t("jobs.form.contract.label")} *</label>
            <Select
              value={formData.contract_type || ""}
              onValueChange={(value) => onFormDataChange("contract_type", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder={t("jobs.form.contract.placeholder")} />
              </SelectTrigger>
              <SelectContent>
                {Object.values(CONTRACT_TYPES).map((type) => (
                  <SelectItem key={type} value={type}>
                    {t(`jobs.form.contract.${type}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">{t("jobs.form.salary.min")}</label>
              <Input
                name="salary_min"
                type="number"
                value={formData.salary_min || ""}
                onChange={handleInputChange}
                placeholder={t("jobs.form.salary.placeholder.min")}
              />
            </div>

            <div>
              <label className="text-sm font-medium">{t("jobs.form.salary.max")}</label>
              <Input
                name="salary_max"
                type="number"
                value={formData.salary_max || ""}
                onChange={handleInputChange}
                placeholder={t("jobs.form.salary.placeholder.max")}
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">{t("jobs.form.description.label")} *</label>
            <Textarea
              name="description"
              value={formData.description || ""}
              onChange={handleInputChange}
              placeholder={t("jobs.form.description.placeholder")}
              className="min-h-[200px] resize-y"
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* Benefits & Application */}
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">{t("jobs.form.benefits.title")}</h3>
          <p className="text-sm text-muted-foreground">{t("jobs.form.benefits.description")}</p>
        </div>

        <BenefitsSection benefits={benefits} onBenefitsChange={onBenefitsChange} />
        <ApplyMethodSection value={applyMethod} onChange={onApplyMethodChange} />
      </div>
    </div>
  );
}

// Validation helper
export function validateJobForm(formData: Partial<JobFormData>, applyMethod: ApplicationMethod): string {
  if (!formData.title) return t("jobs.create.validation.required");
  if (!formData.company) return t("jobs.create.validation.required");
  if (!formData.company_email) return t("jobs.create.validation.required");
  if (!formData.description) return t("jobs.create.validation.required");
  if (!applyMethod.value) return t("jobs.create.validation.required");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(formData.company_email)) return t("jobs.create.validation.email");
  if (applyMethod.type === "email" && !emailRegex.test(applyMethod.value))
    return t("jobs.create.validation.applyEmail");

  if (applyMethod.type === "url" && !applyMethod.value.startsWith("http")) {
    return t("jobs.create.validation.url");
  }

  if (formData.salary_min && formData.salary_max) {
    if (Number(formData.salary_min) > Number(formData.salary_max)) {
      return t("jobs.create.validation.salary");
    }
  }

  return "";
}
