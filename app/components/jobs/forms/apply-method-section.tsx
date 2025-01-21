// components/common/forms/apply-method-section.tsx
import React from "react";
import { Mail, Globe } from "lucide-react";
import { ApplicationMethod } from "@/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { t } from "@/lib/translations/utils";

interface ApplyMethodProps {
  value: ApplicationMethod;
  onChange: (value: ApplicationMethod) => void;
}

export function ApplyMethodSection({ value, onChange }: ApplyMethodProps) {
  return (
    <div className="space-y-4">
      <Tabs
        value={value.type}
        onValueChange={(newType) => onChange({ type: newType as "email" | "url", value: "" })}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="email" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            {t("jobs.application.email.label")}
          </TabsTrigger>
          <TabsTrigger value="url" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            {t("jobs.application.url.label")}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="email">
          <Card>
            <CardContent className="pt-6">
              <Input
                type="email"
                value={value.type === "email" ? value.value : ""}
                onChange={(e) => onChange({ type: "email", value: e.target.value })}
                placeholder={t("jobs.application.email.placeholder")}
                className="w-full"
              />
              <p className="mt-2 text-sm text-muted-foreground">{t("jobs.application.email.help")}</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="url">
          <Card>
            <CardContent className="pt-6">
              <Input
                type="url"
                value={value.type === "url" ? value.value : ""}
                onChange={(e) => onChange({ type: "url", value: e.target.value })}
                placeholder={t("jobs.application.url.placeholder")}
                className="w-full"
              />
              <p className="mt-2 text-sm text-muted-foreground">{t("jobs.application.url.help")}</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
