// components/tracking/page-tracker.tsx
"use client";

import { useEffect } from "react";
import { trackJobEvent } from "@/api/jobs/actions";

export function PageTracker({ type }: { type: "homepage_view" | "create_job_view" | "job_submit" }) {
  useEffect(() => {
    trackJobEvent(null, type).catch(console.error);
  }, [type]);
  return null;
}
