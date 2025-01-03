import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckIcon, CopyIcon } from "lucide-react";

interface CopyLinkButtonProps {
  url: string;
}

export default function CopyLinkButton({ url }: CopyLinkButtonProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
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
