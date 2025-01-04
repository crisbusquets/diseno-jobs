"use client";

import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { createPaymentSession } from "@/api/stripe/actions";
import { JOB_TYPES, SITE_CONFIG } from "@/lib/config/constants";
import { JobType, JobFormData, ApplicationMethod, Benefit } from "@/types";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";

import LogoUpload from "@/components/common/forms/logo-upload";
import { ApplyMethodSection } from "@/components/common/forms/apply-method-section";
import { BenefitsSection } from "@/components/common/forms/benefits-section";
import LocationSelector from "@/components/common/forms/location-selector";

// Form schema with proper validation
const formSchema = z.object({
  title: z.string().min(1, "El título es obligatorio"),
  company: z.string().min(1, "El nombre de la empresa es obligatorio"),
  company_email: z.string().email("Email válido requerido"),
  company_logo: z.string().optional(),
  description: z.string().min(10, "La descripción debe tener al menos 10 caracteres"),
  job_type: z.enum(["remote", "hybrid", "onsite"] as const),
  location: z.string().optional(),
  salary_min: z.number().optional(),
  salary_max: z.number().optional(),
  benefits: z
    .array(
      z.object({
        name: z.string(),
        icon: z.string().optional(),
        isCustom: z.boolean().optional(),
      })
    )
    .optional(),
  application_method_type: z.enum(["email", "url"]),
  application_method_value: z.string(),
});

export default function CreateJobForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [logo, setLogo] = useState("");
  const [benefits, setBenefits] = useState<Benefit[]>([]);
  const [applyMethod, setApplyMethod] = useState<ApplicationMethod>({
    type: "email",
    value: "",
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      company: "",
      company_email: "",
      description: "",
      job_type: "remote" as JobType,
    },
  });

  // Form submission handler

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);

    try {
      const jobData: JobFormData = {
        ...values,
        company_logo: logo,
        benefits: benefits,
        application_method_type: applyMethod.type,
        application_method_value: applyMethod.value,
      };

      const result = await createPaymentSession(jobData);

      if (!result.success) {
        throw new Error(result.error);
      }

      if (result.data?.url) {
        window.location.href = result.data.url;
      }
    } catch (error) {
      form.setError("root", {
        message: error instanceof Error ? error.message : "Error procesando la solicitud",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Publicar Oferta de Diseño</CardTitle>
        <div className="mt-4 flex items-center justify-between rounded-lg border bg-muted/50 p-4">
          <div>
            <p className="text-base font-medium">Publicación por 30 días</p>
            <p className="text-sm text-muted-foreground">Visible para toda la comunidad de diseño</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-medium">{SITE_CONFIG.jobPrice / 100}€</p>
            <p className="text-sm text-muted-foreground">Pago único</p>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {form.formState.errors.root && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{form.formState.errors.root.message}</AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Company Information Section */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium">Información de la empresa</h3>
                <p className="text-sm text-muted-foreground">Datos sobre tu empresa y cómo contactarte</p>
              </div>

              <LogoUpload value={logo} onChange={setLogo} />

              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre de la Empresa</FormLabel>
                    <FormControl>
                      <Input placeholder="ej., Design Studio Inc." {...field} />
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
                      <Input type="email" placeholder="ej., contacto@empresa.com" {...field} />
                    </FormControl>
                    <FormDescription>Se usará para gestionar la oferta y recibir notificaciones</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            {/* Job Details Section */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium">Detalles del puesto</h3>
                <p className="text-sm text-muted-foreground">Información sobre la posición y requisitos</p>
              </div>

              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título del Puesto</FormLabel>
                    <FormControl>
                      <Input placeholder="ej., Diseñador/a UX Senior" {...field} />
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
                          placeholder="ej., 45000"
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
                          placeholder="ej., 60000"
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
                      <Textarea
                        placeholder="Describe el rol, responsabilidades, requisitos..."
                        className="min-h-[200px] resize-y"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            {/* Benefits & Application Section */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium">Beneficios y proceso de aplicación</h3>
                <p className="text-sm text-muted-foreground">Beneficios de la empresa y cómo aplicar al puesto</p>
              </div>

              <BenefitsSection benefits={benefits} onBenefitsChange={setBenefits} />

              <ApplyMethodSection value={applyMethod} onChange={setApplyMethod} />
            </div>
          </form>
        </Form>
      </CardContent>

      <CardFooter className="flex flex-col space-y-2">
        <Button onClick={form.handleSubmit(onSubmit)} className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Procesando..." : "Continuar al Pago"}
        </Button>
        <p className="text-sm text-muted-foreground text-center">
          Al continuar, aceptas nuestros términos y condiciones
        </p>
      </CardFooter>
    </Card>
  );
}
