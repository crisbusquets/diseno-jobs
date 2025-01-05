"use client";

import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Log any errors to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <Card>
          <CardContent className="p-6">
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error.message || "Ha ocurrido un error"}</AlertDescription>
            </Alert>

            <div className="text-center">
              <h2 className="text-xl font-semibold mb-4">Algo salió mal</h2>
              <p className="text-gray-600 mb-6">No pudimos completar tu solicitud. Por favor, inténtalo de nuevo.</p>
              <Button onClick={reset}>Intentar de nuevo</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
