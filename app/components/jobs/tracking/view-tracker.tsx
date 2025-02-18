"use client";

import { useEffect } from "react";
import { trackJobEvent } from "@/api/jobs/actions";

export function ViewTracker({ jobId }: { jobId: string }) {
  useEffect(() => {
    trackJobEvent(parseInt(jobId), "view").catch(console.error);
  }, [jobId]);

  return null;
}
