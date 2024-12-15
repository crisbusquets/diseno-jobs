// app/lib/utils/formatting.ts

/**
 * Format currency in EUR with Spanish locale
 */
export function formatCurrency(amount: number): string {
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
  return "No especificado";
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
 * Get job type label in Spanish
 */
export function getJobTypeLabel(type: "remote" | "hybrid" | "onsite"): string {
  const types = {
    remote: "Remoto",
    hybrid: "Híbrido",
    onsite: "Presencial",
  };
  return types[type] || "No especificado";
}

/**
 * Get job type color classes for Tailwind
 */
export function getJobTypeColor(type: "remote" | "hybrid" | "onsite"): string {
  const colors = {
    remote: "text-green-700 bg-green-50 border-green-100",
    hybrid: "text-amber-700 bg-amber-50 border-amber-100",
    onsite: "text-blue-700 bg-blue-50 border-blue-100",
  };
  return colors[type] || "";
}