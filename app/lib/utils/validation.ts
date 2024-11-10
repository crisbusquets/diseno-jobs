// app/lib/utils/validation.ts

interface ValidationError {
  field: string;
  message: string;
}

export function validateJobForm(formData: FormData): ValidationError[] {
  const errors: ValidationError[] = [];

  // Required fields
  const requiredFields = [
    { field: "title", label: "Título del puesto" },
    { field: "company", label: "Nombre de la empresa" },
    { field: "email", label: "Email" },
    { field: "description", label: "Descripción" },
  ];

  requiredFields.forEach(({ field, label }) => {
    if (!formData.get(field)) {
      errors.push({
        field,
        message: `${label} es obligatorio`,
      });
    }
  });

  // Email validation
  const email = formData.get("email") as string;
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push({
      field: "email",
      message: "Email no válido",
    });
  }

  // Salary validation
  const salaryMin = Number(formData.get("salary_min"));
  const salaryMax = Number(formData.get("salary_max"));

  if (salaryMin && salaryMax && salaryMin > salaryMax) {
    errors.push({
      field: "salary_min",
      message: "El salario mínimo no puede ser mayor que el máximo",
    });
  }

  return errors;
}

export function validateApplicationMethod(type: string, value: string): string | null {
  if (!type || !value) {
    return "El método de aplicación es obligatorio";
  }

  if (type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    return "Email no válido";
  }

  if (type === "url" && !/^https?:\/\/.+/.test(value)) {
    return "URL no válida";
  }

  return null;
}
