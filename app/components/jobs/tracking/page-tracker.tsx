// components/tracking/page-tracker.tsx
"use client";

import { useEffect } from "react";
import { trackJobEvent } from "@/api/jobs/actions";

export function PageTracker({ type }: { type: "homepage_view" | "create_job_view" | "job_submit" }) {
  useEffect(() => {
    // We pass 0 as jobId since these are general events
    trackJobEvent(0, type).catch(console.error);
  }, [type]);

  return null;
}
