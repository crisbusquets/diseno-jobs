// app/lib/utils/validation.ts

export interface ValidationError {
  field: string;
  message: string;
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validateUrl(url: string): boolean {
  return url.startsWith("http://") || url.startsWith("https://");
}

export function validateJobForm(formData: any): ValidationError[] {
  const errors: ValidationError[] = [];

  // Required fields validation
  const requiredFields = [
    { name: "title", label: "Título del puesto" },
    { name: "company", label: "Nombre de la empresa" },
    { name: "company_email", label: "Email" },
    { name: "description", label: "Descripción" },
  ];

  requiredFields.forEach(({ name, label }) => {
    if (!formData[name]?.trim()) {
      errors.push({
        field: name,
        message: `${label} es obligatorio`,
      });
    }
  });

  // Email validation
  if (formData.company_email && !validateEmail(formData.company_email)) {
    errors.push({
      field: "company_email",
      message: "Email no válido",
    });
  }

  // Salary validation
  if (formData.salary_min && formData.salary_max) {
    const minSalary = Number(formData.salary_min);
    const maxSalary = Number(formData.salary_max);
    if (minSalary > maxSalary) {
      errors.push({
        field: "salary_min",
        message: "El salario mínimo no puede ser mayor que el máximo",
      });
    }
  }

  // Application method validation
  if (formData.application_method_type === "email" && !validateEmail(formData.application_method_value)) {
    errors.push({
      field: "application_method_value",
      message: "Email de aplicación no válido",
    });
  }

  if (formData.application_method_type === "url" && !validateUrl(formData.application_method_value)) {
    errors.push({
      field: "application_method_value",
      message: "La URL debe comenzar con http:// o https://",
    });
  }

  return errors;
}

export function validateApplicationMethod(type: string, value: string): string | null {
  if (!type || !value) {
    return "El método de aplicación es obligatorio";
  }

  if (type === "email" && !validateEmail(value)) {
    return "Email no válido";
  }

  if (type === "url" && !validateUrl(value)) {
    return "URL no válida";
  }

  return null;
}
