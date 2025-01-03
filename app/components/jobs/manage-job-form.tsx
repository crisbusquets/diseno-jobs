import { useState } from "react";
import { updateJob, deactivateJob } from "@/api/jobs/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
});

interface ManageJobFormProps {
  job: any;
  token: string;
}

export default function ManageJobForm({ job, token }: ManageJobFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: job.title,
      description: job.description,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setError(null);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append("token", token);
      formData.append("title", values.title);
      formData.append("description", values.description);

      const result = await updateJob(formData);

      if (result.success) {
        setMessage("Oferta actualizada correctamente");
        setIsEditing(false);
      } else {
        setError(result.error || "Error al actualizar la oferta");
      }
    } catch (error) {
      setError("Error al actualizar la oferta");
    }
  }

  const handleDeactivate = async () => {
    try {
      const result = await deactivateJob(token);
      if (result.success) {
        setMessage("Oferta desactivada correctamente");
      } else {
        setError(result.error || "Error al desactivar la oferta");
      }
    } catch (error) {
      setError("Error al desactivar la oferta");
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {message && (
        <Alert>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      {isEditing ? (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título del Puesto</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={4} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-4">
              <Button type="submit">Guardar Cambios</Button>
              <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                Cancelar
              </Button>
            </div>
          </form>
        </Form>
      ) : (
        <div className="space-y-6">
          <Button onClick={() => setIsEditing(true)}>Editar Oferta</Button>

          <div className="border-t pt-6">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Desactivar Oferta</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Al desactivar la oferta, dejará de ser visible en el listado
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeactivate}>Desactivar</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <p className="mt-2 text-sm text-muted-foreground">
              Al desactivar la oferta, dejará de ser visible en el listado
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
