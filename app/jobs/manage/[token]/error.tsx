"use client";

import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function ManageJobError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("Job management error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <Card>
          <CardContent className="p-6">
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>No pudimos cargar la información de gestión</AlertDescription>
            </Alert>

            <div className="text-center">
              <h2 className="text-xl font-semibold mb-4">Error de gestión</h2>
              <p className="text-gray-600 mb-6">
                Ha ocurrido un error al cargar la información de gestión de esta oferta. El enlace podría ser inválido o
                la oferta ya no estar disponible.
              </p>
              <div className="space-x-4">
                <Button onClick={reset}>Intentar de nuevo</Button>
                <Button variant="outline" onClick={() => (window.location.href = "/")}>
                  Volver al inicio
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
