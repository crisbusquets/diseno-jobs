"use client";

import { ArrowRight, Mail, Globe } from "lucide-react";
import { ApplicationMethod } from "@/types";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { t } from "@/lib/translations/utils";

interface ApplySectionProps {
  method: ApplicationMethod;
}

export function ApplySection({ method }: ApplySectionProps) {
  const { toast } = useToast();
  const handleApply = () => {
    if (!method.value) return;

    try {
      if (method.type === "email") {
        window.location.href = `mailto:${method.value}`;
        toast({
          title: t("jobs.toasts.email.title"),
          description: t("jobs.toasts.email.description"),
        });
      } else {
        let url = method.value;
        if (!url.startsWith("http://") && !url.startsWith("https://")) {
          url = `https://${url}`;
        }
        window.open(url, "_blank");
      }
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: method.type === "email" ? t("jobs.apply.errors.email") : t("jobs.apply.errors.url"),
      });
    }
  };

  return (
    <Card className="mt-8">
      <CardHeader className="text-center">
        <CardTitle>{t("jobs.apply.title")}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <Button onClick={handleApply} size="lg" className="gap-2">
          {method.type === "email" ? (
            <>
              <Mail className="h-5 w-5" />
              {t("jobs.apply.email.button")}
            </>
          ) : (
            <>
              <Globe className="h-5 w-5" />
              {t("jobs.apply.url.button")}
            </>
          )}
          <ArrowRight className="h-4 w-4" />
        </Button>

        <p className="mt-4 text-sm text-muted-foreground">
          {method.type === "email" ? t("jobs.apply.email.description") : t("jobs.apply.url.description")}
        </p>
      </CardContent>
    </Card>
  );
}