// app/types/forms.ts

export interface FormStatus {
  isSubmitting: boolean;
  error: string | null;
  success: boolean;
}

export interface FormProps {
  onSubmit: (data: any) => Promise<void>;
  initialData?: any;
  status?: FormStatus;
}

export interface FormFieldProps {
  label: string;
  name: string;
  required?: boolean;
  error?: string;
}

export interface SelectOption {
  value: string;
  label: string;
}
