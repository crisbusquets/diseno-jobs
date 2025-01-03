"use client";

import { ArrowRight, Mail, Globe } from "lucide-react";
import { ApplicationMethod } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ApplySectionProps {
  method: ApplicationMethod;
}

export function ApplySection({ method }: ApplySectionProps) {
  const handleApply = () => {
    if (!method.value) return;

    if (method.type === "email") {
      window.location.href = `mailto:${method.value}`;
    } else {
      let url = method.value;
      if (!url.startsWith("http://") && !url.startsWith("https://")) {
        url = `https://${url}`;
      }
      window.open(url, "_blank");
    }
  };

  return (
    <Card className="mt-8">
      <CardHeader className="text-center">
        <CardTitle>¿Te interesa esta posición?</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <Button onClick={handleApply} size="lg" className="gap-2">
          {method.type === "email" ? (
            <>
              <Mail className="h-5 w-5" />
              Enviar email
            </>
          ) : (
            <>
              <Globe className="h-5 w-5" />
              Aplicar ahora
            </>
          )}
          <ArrowRight className="h-4 w-4" />
        </Button>

        <p className="mt-4 text-sm text-muted-foreground">
          {method.type === "email"
            ? "Se abrirá tu cliente de email para enviar tu aplicación"
            : "Serás redirigido al formulario de aplicación"}
        </p>
      </CardContent>
    </Card>
  );
}
