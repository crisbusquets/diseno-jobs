"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { updateJob, deactivateJob } from "@/api/jobs/actions";
import { Job, Benefit } from "@/types";
import { format } from "date-fns";
import { es } from "date-fns/locale";

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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { JOB_TYPES } from "@/lib/config/constants";

// Form schema
const formSchema = z.object({
  title: z.string().min(1, "El título es obligatorio"),
  company: z.string().min(1, "El nombre de la empresa es obligatorio"),
  company_email: z.string().email("Email válido requerido"),
  description: z.string().min(10, "La descripción debe tener al menos 10 caracteres"),
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
  const [activeTab, setActiveTab] = useState("preview");
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
    try {
      const formData = new FormData();
      formData.append("token", token);

      Object.entries(values).forEach(([key, value]) => {
        if (value !== undefined) {
          formData.append(key, value.toString());
        }
      });

      formData.append("company_logo", logo);
      formData.append("benefits", JSON.stringify(benefits));

      const result = await updateJob(formData);

      if (!result.success) {
        throw new Error(result.error || "Error al actualizar la oferta");
      }

      setActiveTab("preview");
    } catch (error) {
      console.error("Update error:", error);
    }
  }

  const handleDeactivate = async () => {
    try {
      const result = await deactivateJob(token);
      if (!result.success) {
        throw new Error(result.error || "Error al desactivar la oferta");
      }
    } catch (error) {
      console.error("Deactivate error:", error);
    }
  };

  return (
    <Card>
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl">Gestionar Oferta</CardTitle>
            <CardDescription>{job.is_active ? "Oferta activa" : "Oferta inactiva"}</CardDescription>
          </div>
          <Badge variant={job.is_active ? "default" : "secondary"}>{job.is_active ? "Activa" : "Inactiva"}</Badge>
        </div>
        <div className="flex flex-col gap-2 mt-4 text-sm text-muted-foreground">
          <p>Publicada el {format(new Date(job.created_at), "d 'de' MMMM, yyyy", { locale: es })}</p>
          {job.activated_at && (
            <p>Activada el {format(new Date(job.activated_at), "d 'de' MMMM, yyyy", { locale: es })}</p>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="preview">Vista previa</TabsTrigger>
            <TabsTrigger value="edit">Editar</TabsTrigger>
          </TabsList>

          <TabsContent value="preview">
            <ScrollArea className="h-[600px] rounded-md border p-4">
              <div className="space-y-6">
                {/* Company Info */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Información de la empresa</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Empresa</p>
                      <p>{job.company}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Email</p>
                      <p>{job.company_email}</p>
                    </div>
                  </div>
                  {logo && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-muted-foreground mb-2">Logo</p>
                      <img src={logo} alt="Company logo" className="h-20 object-contain" />
                    </div>
                  )}
                </div>

                <Separator />

                {/* Job Details */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Detalles del puesto</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Título</p>
                      <p>{job.title}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Modalidad</p>
                        <p>{job.job_type}</p>
                      </div>
                      {job.location && (
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Ubicación</p>
                          <p>{job.location}</p>
                        </div>
                      )}
                    </div>
                    {(job.salary_min || job.salary_max) && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Salario</p>
                        <p>
                          {job.salary_min && `${job.salary_min}€`}
                          {job.salary_min && job.salary_max && " - "}
                          {job.salary_max && `${job.salary_max}€`}
                        </p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Descripción</p>
                      <p className="whitespace-pre-wrap">{job.description}</p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Benefits & Application */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Beneficios y aplicación</h3>
                  {benefits.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm font-medium text-muted-foreground mb-2">Beneficios</p>
                      <div className="flex flex-wrap gap-2">
                        {benefits.map((benefit, index) => (
                          <Badge key={index} variant="secondary">
                            {benefit.icon} {benefit.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Método de aplicación</p>
                    <p>{applyMethod.value}</p>
                  </div>
                </div>
              </div>
            </ScrollArea>

            {/* Preview Actions */}
            <div className="flex justify-between items-center mt-4">
              <Button variant="outline" onClick={() => setActiveTab("edit")}>
                Editar información
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">Desactivar oferta</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Al desactivar la oferta, dejará de ser visible en el listado. Esta acción no se puede deshacer.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeactivate}
                      className="bg-destructive text-destructive-foreground"
                    >
                      Desactivar
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </TabsContent>

          <TabsContent value="edit">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* Company Information */}
                <div className="space-y-6">
                  <h3 className="text-lg font-medium">Información de la empresa</h3>

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

                <Separator />

                {/* Job Details */}
                <div className="space-y-6">
                  <h3 className="text-lg font-medium">Detalles del puesto</h3>

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
                              placeholder="ej., 30000"
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
                  <h3 className="text-lg font-medium">Beneficios y proceso de aplicación</h3>

                  <BenefitsSection benefits={benefits} onBenefitsChange={setBenefits} />

                  <ApplyMethodSection value={applyMethod} onChange={setApplyMethod} />
                </div>

                {/* Form Actions */}
                <div className="flex justify-between items-center pt-6">
                  <Button type="button" variant="ghost" onClick={() => setActiveTab("preview")}>
                    Cancelar
                  </Button>
                  <div className="space-x-2">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive">Desactivar oferta</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Al desactivar la oferta, dejará de ser visible en el listado. Esta acción no se puede
                            deshacer.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleDeactivate}
                            className="bg-destructive text-destructive-foreground"
                          >
                            Desactivar
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    <Button type="submit">Guardar cambios</Button>
                  </div>
                </div>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
