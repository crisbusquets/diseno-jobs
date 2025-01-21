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
import { SALARY_RANGES } from "@/lib/config/constants";

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
    <div>
      {/* Company Information - now without email */}
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">{t("jobs.create.company.title")}</h3>
          <p className="text-sm text-muted-foreground">{t("jobs.create.company.description")}</p>
        </div>

        <LogoUpload value={logo} onChange={onLogoChange} />

        <div>
          <label className="text-sm font-medium">{t("jobs.form.company")} *</label>
          <Input
            name="company"
            placeholder={t("jobs.create.company.placeholder")}
            value={formData.company || ""}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div className="space-y-6">
        {/* Title section */}
        <div>
          <label className="text-sm font-medium">{t("jobs.create.details.titleLabel")} *</label>
          <Input
            name="title"
            placeholder={t("jobs.create.details.titlePlaceholder")}
            value={formData.title || ""}
            onChange={handleInputChange}
          />
        </div>

        {/* Job type and location in 2 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        </div>

        {/* Experience and Contract type in 2 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        </div>

        {/* Salary range as a single select */}
        <div>
          <label className="text-sm font-medium">{t("jobs.form.salary.range")}</label>
          <Select
            value={formData.salary_range || ""}
            onValueChange={(value) => onFormDataChange("salary_range", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder={t("jobs.form.salary.placeholder")} />
            </SelectTrigger>
            <SelectContent>
              {SALARY_RANGES.map((range) => (
                <SelectItem key={range.id} value={range.id}>
                  {range.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground mt-1">{t("jobs.form.salary.help")}</p>
        </div>

        {/* Description takes full width */}
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
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium">{t("jobs.form.benefits.title")}</h3>
            <p className="text-sm text-muted-foreground">{t("jobs.form.benefits.description")}</p>
          </div>
          <BenefitsSection benefits={benefits} onBenefitsChange={onBenefitsChange} />
        </div>

        {/* Application method section */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium">{t("jobs.application.title")}</h3>
            <p className="text-sm text-muted-foreground">{t("jobs.application.description")}</p>
          </div>
          <ApplyMethodSection value={applyMethod} onChange={onApplyMethodChange} />
        </div>

        <Separator />
        {/* Contact Information section */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium">{t("jobs.form.contact.title")}</h3>
            <p className="text-sm text-muted-foreground">{t("jobs.form.contact.description")}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">{t("jobs.form.contact.name")} *</label>
              <Input
                name="contact_name"
                placeholder={t("jobs.form.contact.namePlaceholder")}
                value={formData.contact_name || ""}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label className="text-sm font-medium">{t("jobs.form.contact.email")} *</label>
              <Input
                name="company_email"
                type="email"
                placeholder={t("jobs.application.email.placeholder")}
                value={formData.company_email || ""}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <p className="text-sm text-muted-foreground">{t("jobs.form.contact.gdpr")}</p>
        </div>
      </div>
    </div>
  );
}

// Validation helper
export function validateJobForm(formData: Partial<JobFormData>, applyMethod: ApplicationMethod): string {
  if (!formData.title) return t("jobs.create.validation.required");
  if (!formData.company) return t("jobs.create.validation.required");
  if (!formData.company_email) return t("jobs.create.validation.required");
  if (!formData.contract_type) return t("jobs.create.validation.required");
  if (!formData.description) return t("jobs.create.validation.required");
  if (!applyMethod.value) return t("jobs.create.validation.required");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(formData.company_email)) return t("jobs.create.validation.email");
  if (applyMethod.type === "email" && !emailRegex.test(applyMethod.value))
    return t("jobs.create.validation.applyEmail");

  if (applyMethod.type === "url" && !applyMethod.value.startsWith("http")) {
    return t("jobs.create.validation.url");
  }

  return "";
}
