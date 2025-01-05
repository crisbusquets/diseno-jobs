"use client";

import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";

export default function SuccessPageError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("Payment success page error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <Card>
          <CardContent className="p-6">
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>Error al procesar el pago</AlertDescription>
            </Alert>

            <div className="text-center">
              <h2 className="text-xl font-semibold mb-4">Ha ocurrido un error</h2>
              <p className="text-gray-600 mb-6">
                Hubo un problema al procesar tu pago o activar tu oferta. No te preocupes, no se ha realizado ningún
                cargo.
              </p>
              <div className="space-y-4">
                <Button onClick={reset} className="w-full">
                  Intentar de nuevo
                </Button>
                <Link href="/jobs/create" className="block">
                  <Button variant="outline" className="w-full">
                    Volver al formulario
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
