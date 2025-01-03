"use client";

import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { createPaymentSession } from "@/api/stripe/actions";
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
import { JobType, JobFormData, ApplicationMethod, Benefit } from "@/types";
import { JOB_TYPES } from "@/lib/config/constants";

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
  const [location, setLocation] = useState("");
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
      company_logo: "",
      description: "",
      job_type: "remote" as JobType,
      benefits: [],
      application_method_type: "email",
      application_method_value: "",
    },
  });

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
        message: error instanceof Error ? error.message : "Error processing request",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="max-w-[600px] mx-auto bg-white rounded-2xl p-8">
      <h1 className="text-2xl font-normal text-gray-900 mb-8">Publicar Oferta de Diseño</h1>

      {form.formState.errors.root && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{form.formState.errors.root.message}</AlertDescription>
        </Alert>
      )}

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

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="salary_min"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Salario Mínimo (€)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="ej., 45000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="salary_max"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Salario Máximo (€)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="ej., 60000" {...field} />
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
                      className="h-32"
                      {...field}
                    />
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

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Procesando..." : "Continuar al Pago"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
