// lib/translations/utils.ts
import { translations } from "./es";

export function t(key: string, params?: Record<string, string>): string {
  const keys = key.split(".");
  let value: any = translations;
  let currentPath = "";

  for (const k of keys) {
    currentPath = currentPath ? `${currentPath}.${k}` : k;
    if (value === undefined || value[k] === undefined) {
      console.warn(`Translation key not found: ${currentPath}`);
      return key;
    }
    value = value[k];
  }

  if (typeof value !== "string") {
    console.warn(`Translation key "${key}" resolves to a non-string value`);
    return key;
  }

  if (!params) return value;

  return value.replace(/\{\{(\w+)\}\}/g, (_, key) => params[key] || `{{${key}}}`);
}
