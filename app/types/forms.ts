// types/forms.ts

export interface FormStatus {
  isSubmitting: boolean;
  error: string | null;
  success: boolean;
}

export interface FormFieldProps {
  label: string;
  name: string;
  required?: boolean;
  error?: string;
}
