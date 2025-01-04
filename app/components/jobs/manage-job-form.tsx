"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { updateJob, deactivateJob } from "@/api/jobs/actions";
import { Job, Benefit } from "@/types";
import LogoUpload from "@/components/common/forms/logo-upload";
import { ApplyMethodSection } from "@/components/common/forms/apply-method-section";
import { BenefitsSection } from "@/components/common/forms/benefits-section";
import LocationSelector from "@/components/common/forms/location-selector";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { JOB_TYPES } from "@/lib/config/constants";
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

const formSchema = z.object({
  title: z.string().min(1, "Job title is required"),
  company: z.string().min(1, "Company name is required"),
  company_email: z.string().email("Valid email is required"),
  company_logo: z.string().optional(),
  description: z.string().min(10, "Please provide a detailed description"),
  job_type: z.enum(["remote", "hybrid", "onsite"]),
  location: z.string().optional(),
  salary_min: z.number().optional(),
  salary_max: z.number().optional(),
  application_method_type: z.enum(["email", "url"]),
  application_method_value: z.string(),
});

interface ManageJobFormProps {
  job: Job;
  token: string;
}

export default function ManageJobForm({ job, token }: ManageJobFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [logo, setLogo] = useState(job.company_logo || "");
  const [benefits, setBenefits] = useState<Benefit[]>(job.benefits || []);
  const [applyMethod, setApplyMethod] = useState({
    type: job.application_method_type,
    value: job.application_method_value,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: job.title,
      company: job.company,
      company_email: job.company_email,
      description: job.description,
      job_type: job.job_type,
      location: job.location,
      salary_min: job.salary_min,
      salary_max: job.salary_max,
      application_method_type: job.application_method_type,
      application_method_value: job.application_method_value,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setError(null);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append("token", token);

      // Append all form fields
      Object.entries(values).forEach(([key, value]) => {
        if (value !== undefined) {
          formData.append(key, value.toString());
        }
      });

      // Append additional data
      formData.append("company_logo", logo);
      formData.append("benefits", JSON.stringify(benefits));

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
            <div className="space-y-6">
              <LogoUpload value={logo} onChange={setLogo} />

              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre de la Empresa</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="company_email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email de la Empresa</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-6 pt-6 border-t">
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
                name="job_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Modalidad de Trabajo</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona una modalidad" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={JOB_TYPES.REMOTE}>Remoto</SelectItem>
                        <SelectItem value={JOB_TYPES.HYBRID}>Híbrido</SelectItem>
                        <SelectItem value={JOB_TYPES.ONSITE}>Presencial</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ubicación</FormLabel>
                    <FormControl>
                      <LocationSelector value={field.value || ""} onChange={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="salary_min"
                  render={({ field: { value, onChange, ...field } }) => (
                    <FormItem>
                      <FormLabel>Salario Mínimo (€)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          value={value || ""}
                          onChange={(e) => onChange(e.target.valueAsNumber)}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="salary_max"
                  render={({ field: { value, onChange, ...field } }) => (
                    <FormItem>
                      <FormLabel>Salario Máximo (€)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          value={value || ""}
                          onChange={(e) => onChange(e.target.valueAsNumber)}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descripción del Puesto</FormLabel>
                    <FormControl>
                      <Textarea className="h-32" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-6 pt-6 border-t">
              <BenefitsSection benefits={benefits} onBenefitsChange={setBenefits} />
              <ApplyMethodSection value={applyMethod} onChange={setApplyMethod} />
            </div>

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
