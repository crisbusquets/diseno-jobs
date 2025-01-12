"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { CheckIcon, CopyIcon } from "lucide-react";

interface CopyLinkButtonProps {
  url: string;
}

export default function CopyLinkButton({ url }: CopyLinkButtonProps) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast({
        title: "Enlace copiado",
        description: "El enlace ha sido copiado al portapapeles",
        variant: "default",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
      toast({
        title: "Error al copiar",
        description: "No se ha podido copiar el enlace al portapapeles",
        variant: "destructive",
      });
    }
  };

  return (
    <Button onClick={copyToClipboard} variant="secondary" size="sm" className="gap-2">
      {copied ? (
        <>
          <CheckIcon className="h-4 w-4" />
          ¡Copiado!
        </>
      ) : (
        <>
          <CopyIcon className="h-4 w-4" />
          Copiar enlace
        </>
      )}
    </Button>
  );
}
