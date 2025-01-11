"use client";

import { useState } from "react";
import { updateJob, deactivateJob } from "@/api/jobs/actions";
import { Job, Benefit } from "@/types";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useToast } from "@/components/ui/use-toast";

import LogoUpload from "@/components/common/forms/logo-upload";
import { ApplyMethodSection } from "@/components/common/forms/apply-method-section";
import { BenefitsSection } from "@/components/common/forms/benefits-section";
import LocationSelector from "@/components/common/forms/location-selector";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { JOB_TYPES, EXPERIENCE_LEVEL, CONTRACT_TYPE } from "@/lib/config/constants";

interface ManageJobFormProps {
  job: Job;
  token: string;
}

export default function ManageJobForm({ job, token }: ManageJobFormProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("preview");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [logo, setLogo] = useState(job.company_logo || "");
  const [benefits, setBenefits] = useState<Benefit[]>(job.benefits || []);
  const [applyMethod, setApplyMethod] = useState({
    type: job.application_method_type,
    value: job.application_method_value,
  });

  // Form fields state
  const [formData, setFormData] = useState({
    title: job.title,
    company: job.company,
    company_email: job.company_email,
    description: job.description,
    job_type: job.job_type,
    experience_level: job.experience_level,
    contract_type: job.contract_type,
    location: job.location || "",
    salary_min: job.salary_min?.toString() || "",
    salary_max: job.salary_max?.toString() || "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.title) return "El título es obligatorio";
    if (!formData.company) return "El nombre de la empresa es obligatorio";
    if (!formData.company_email) return "El email es obligatorio";
    if (!formData.description) return "La descripción es obligatoria";
    if (!applyMethod.value) return "El método de aplicación es obligatorio";

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.company_email)) return "Email no válido";
    if (applyMethod.type === "email" && !emailRegex.test(applyMethod.value)) return "Email de aplicación no válido";

    // URL validation
    if (applyMethod.type === "url" && !applyMethod.value.startsWith("http")) {
      return "La URL debe comenzar con http:// o https://";
    }

    // Salary validation
    if (formData.salary_min && formData.salary_max) {
      if (Number(formData.salary_min) > Number(formData.salary_max)) {
        return "El salario mínimo no puede ser mayor que el máximo";
      }
    }

    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    const error = validateForm();
    if (error) {
      setFormError(error);
      toast({
        variant: "destructive",
        title: "Error de validación",
        description: error,
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const formDataToSubmit = new FormData();
      formDataToSubmit.append("token", token);

      // Append form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined && value !== "") {
          formDataToSubmit.append(key, value.toString());
        }
      });

      formDataToSubmit.append("company_logo", logo);
      formDataToSubmit.append("benefits", JSON.stringify(benefits));
      formDataToSubmit.append("application_method_type", applyMethod.type);
      formDataToSubmit.append("application_method_value", applyMethod.value);

      const result = await updateJob(formDataToSubmit);

      if (!result.success) {
        throw new Error(result.error);
      }

      toast({
        title: "Cambios guardados",
        description: "La oferta se ha actualizado correctamente",
      });

      setActiveTab("preview");
    } catch (error) {
      console.error("Update error:", error);
      setFormError(error.message || "Error al guardar los cambios");
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Error al guardar los cambios",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeactivate = async () => {
    try {
      const result = await deactivateJob(token);

      if (!result.success) {
        throw new Error(result.error);
      }

      toast({
        title: "Oferta desactivada",
        description: "La oferta ya no será visible en el listado",
      });
    } catch (error) {
      console.error("Deactivate error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Error al desactivar la oferta",
      });
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
                      <p>{formData.company}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Email</p>
                      <p>{formData.company_email}</p>
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
                      <p>{formData.title}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Experiencia</p>
                      <p>{formData.experience_level}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Contrato</p>
                      <p>{formData.contract_type}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Modalidad</p>
                        <p>{formData.job_type}</p>
                      </div>
                      {formData.location && (
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Ubicación</p>
                          <p>{formData.location}</p>
                        </div>
                      )}
                    </div>
                    {(formData.salary_min || formData.salary_max) && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Salario</p>
                        <p>
                          {formData.salary_min && `${formData.salary_min}€`}
                          {formData.salary_min && formData.salary_max && " - "}
                          {formData.salary_max && `${formData.salary_max}€`}
                        </p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Descripción</p>
                      <p className="whitespace-pre-wrap">{formData.description}</p>
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
            {formError && (
              <Alert variant="destructive" className="mb-6">
                <AlertDescription>{formError}</AlertDescription>
              </Alert>
            )}

            <form className="space-y-8">
              {/* Company Information */}
              <div className="space-y-6">
                <h3 className="text-lg font-medium">Información de la empresa</h3>

                <LogoUpload value={logo} onChange={setLogo} />

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Nombre de la Empresa *</label>
                    <Input name="company" value={formData.company} onChange={handleInputChange} />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Email de la Empresa *</label>
                    <Input
                      name="company_email"
                      type="email"
                      value={formData.company_email}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Job Details */}
              <div className="space-y-6">
                <h3 className="text-lg font-medium">Detalles del puesto</h3>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Título del Puesto *</label>
                    <Input name="title" value={formData.title} onChange={handleInputChange} />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Modalidad de Trabajo *</label>
                    <Select
                      value={formData.job_type}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, job_type: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una modalidad" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={JOB_TYPES.REMOTE}>Remoto</SelectItem>
                        <SelectItem value={JOB_TYPES.HYBRID}>Híbrido</SelectItem>
                        <SelectItem value={JOB_TYPES.ONSITE}>Presencial</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Ubicación</label>
                    <LocationSelector
                      value={formData.location}
                      onChange={(value) => setFormData((prev) => ({ ...prev, location: value }))}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Nivel de Experiencia *</label>
                    <Select
                      value={formData.experience_level}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, experience_level: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un nivel" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={EXPERIENCE_LEVEL.ENTRY}>Entry level</SelectItem>
                        <SelectItem value={EXPERIENCE_LEVEL.JUNIOR}>Junior</SelectItem>
                        <SelectItem value={EXPERIENCE_LEVEL.MID}>Mid</SelectItem>
                        <SelectItem value={EXPERIENCE_LEVEL.SENIOR}>Senior</SelectItem>
                        <SelectItem value={EXPERIENCE_LEVEL.MANAGER}>Manager</SelectItem>
                        <SelectItem value={EXPERIENCE_LEVEL.LEAD}>Lead</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Tipo de contrato *</label>
                    <Select
                      value={formData.contract_type}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, contract_type: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una opción" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={CONTRACT_TYPE.FULLTIME}>Tiempo completo</SelectItem>
                        <SelectItem value={CONTRACT_TYPE.PARTTIME}>Tiempo parcial</SelectItem>
                        <SelectItem value={CONTRACT_TYPE.INTERNSHIP}>Prácticas</SelectItem>
                        <SelectItem value={CONTRACT_TYPE.FREELANCE}>Freelance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Salario Mínimo (€)</label>
                      <Input
                        name="salary_min"
                        type="number"
                        value={formData.salary_min}
                        onChange={handleInputChange}
                        placeholder="ej., 45000"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">Salario Máximo (€)</label>
                      <Input
                        name="salary_max"
                        type="number"
                        value={formData.salary_max}
                        onChange={handleInputChange}
                        placeholder="ej., 60000"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Descripción del Puesto *</label>
                    <Textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Describe el rol, responsabilidades, requisitos..."
                      className="min-h-[200px] resize-y"
                    />
                  </div>
                </div>
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
                  <Button onClick={handleSubmit} disabled={isSubmitting}>
                    {isSubmitting ? "Guardando..." : "Guardar cambios"}
                  </Button>
                </div>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
