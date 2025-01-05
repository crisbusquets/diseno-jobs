// lib/utils/notifications.ts
import { useToast } from "@/components/ui/use-toast";

export const useNotifications = () => {
  const { toast } = useToast();

  const showSuccess = (title: string, description?: string) => {
    toast({
      title,
      description,
      variant: "default",
    });
  };

  const showError = (title: string, description?: string) => {
    toast({
      title,
      description,
      variant: "destructive",
    });
  };

  // Predefined success messages
  const notifications = {
    jobCreated: () => showSuccess("Oferta creada con éxito", "Tu oferta ha sido creada y está pendiente de pago."),
    jobUpdated: () => showSuccess("Cambios guardados", "La oferta se ha actualizado correctamente."),
    jobDeactivated: () => showSuccess("Oferta desactivada", "La oferta ya no será visible en el listado."),
  };

  // Form validation messages
  const validationMessages = {
    required: (field: string) => `${field} es obligatorio`,
    email: "Introduce un email válido",
    url: "Introduce una URL válida",
    minLength: (field: string, length: number) => `${field} debe tener al menos ${length} caracteres`,
    salary: "El salario máximo debe ser mayor que el mínimo",
    fileSize: "El archivo debe ser menor de 2MB",
    fileType: "Formato de archivo no soportado",
  };

  return {
    showSuccess,
    showError,
    notifications,
    validationMessages,
  };
};
