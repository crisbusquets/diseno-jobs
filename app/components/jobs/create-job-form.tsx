"use client";

import React, { useState } from "react";
import { createPaymentSession } from "@/api/stripe/actions";
import { JOB_TYPES, SITE_CONFIG, EXPERIENCE_LEVEL, CONTRACT_TYPE } from "@/lib/config/constants";
import { JobType, JobFormData, ExperienceLevel, ContractType } from "@/types";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";

import LogoUpload from "@/components/common/forms/logo-upload";
import { ApplyMethodSection } from "@/components/common/forms/apply-method-section";
import { BenefitsSection } from "@/components/common/forms/benefits-section";
import LocationSelector from "@/components/common/forms/location-selector";

export default function CreateJobForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [logo, setLogo] = useState("");
  const [benefits, setBenefits] = useState([]);
  const [applyMethod, setApplyMethod] = useState({
    type: "email",
    value: "",
  });

  // Form fields state
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    company_email: "",
    description: "",
    job_type: "remote" as JobType,
    experience_level: "" as ExperienceLevel,
    contract_type: "" as ContractType,
    location: "",
    salary_min: "",
    salary_max: "",
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
      const jobData: JobFormData = {
        ...formData,
        salary_min: formData.salary_min ? Number(formData.salary_min) : undefined,
        salary_max: formData.salary_max ? Number(formData.salary_max) : undefined,
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
      console.error("Submit error:", error);
      setFormError(error.message || "Error al procesar la solicitud");
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Error al procesar la solicitud",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
        {formError && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{formError}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Company Information Section */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium">Información de la empresa</h3>
              <p className="text-sm text-muted-foreground">Datos sobre tu empresa y cómo contactarte</p>
            </div>

            <LogoUpload value={logo} onChange={setLogo} />

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Nombre de la Empresa *</label>
                <Input
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  placeholder="ej., Design Studio Inc."
                />
              </div>

              <div>
                <label className="text-sm font-medium">Email de la Empresa *</label>
                <Input
                  name="company_email"
                  type="email"
                  value={formData.company_email}
                  onChange={handleInputChange}
                  placeholder="ej., contacto@empresa.com"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Se usará para gestionar la oferta y recibir notificaciones
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Job Details Section */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium">Detalles del puesto</h3>
              <p className="text-sm text-muted-foreground">Información sobre la posición y requisitos</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Título del Puesto *</label>
                <Input
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="ej., Diseñador/a UX Senior"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
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
            <div>
              <h3 className="text-lg font-medium">Beneficios y proceso de aplicación</h3>
              <p className="text-sm text-muted-foreground">Beneficios de la empresa y cómo aplicar al puesto</p>
            </div>

            <BenefitsSection benefits={benefits} onBenefitsChange={setBenefits} />

            <ApplyMethodSection value={applyMethod} onChange={setApplyMethod} />
          </div>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col space-y-2">
        <Button onClick={handleSubmit} className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Procesando..." : "Continuar al Pago"}
        </Button>
        <p className="text-sm text-muted-foreground text-center">
          Al continuar, aceptas nuestros términos y condiciones
        </p>
      </CardFooter>
    </Card>
  );
}
