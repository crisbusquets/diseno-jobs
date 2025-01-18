// app/lib/utils/formatting.ts
import { t } from "@/lib/translations/utils";
import { JobType } from "@/types";
import { REGIONS, COUNTRIES } from "@/lib/translations/es";

/**
 * Format currency in EUR with Spanish locale
 */
export function formatCurrency(amount: number): string {
  // Remove the division by 100 since amounts are stored in euros
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format salary range
 */
export function formatSalaryRange(min?: number, max?: number): string {
  if (min && max) {
    return `${formatCurrency(min)} - ${formatCurrency(max)}`;
  }
  if (min) {
    return `Desde ${formatCurrency(min)}`;
  }
  if (max) {
    return `Hasta ${formatCurrency(max)}`;
  }
  return t("jobs.salary.notSpecified");
}

/**
 * Format date in Spanish locale
 */
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Get job type label using translation system
 */
export function getJobTypeLabel(type: JobType | null | undefined | "all"): string {
  if (!type || type === "all") return t("jobs.type.all");
  return t(`jobs.form.workMode.${type}`);
}

/**
 * Get job type color classes for Tailwind
 */
export function getJobTypeColor(type: JobType): string {
  const colors = {
    remote: "text-green-700 bg-green-50 border-green-100",
    hybrid: "text-amber-700 bg-amber-50 border-amber-100",
    onsite: "text-blue-700 bg-blue-50 border-blue-100",
  };
  return colors[type] || "";
}

/**
 * Job location types
 */
export function getLocationName(value: string): string {
  const regions = Object.values(REGIONS);
  const countries = Object.values(COUNTRIES);
  const item = [...regions, ...countries].find((item) => item.id === value);
  return item?.name || value;
}
