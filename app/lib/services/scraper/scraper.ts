// app/lib/services/scraper/scraper.ts
import { createClient } from "@supabase/supabase-js";
import axios from "axios";
import { JSDOM } from "jsdom";
import type { Job } from "@/types";
import crypto from "crypto";
import { SCRAPER_CONFIG } from "./config";

async function getCompanyLogo(logoUrl: string | null): Promise<string | null> {
  if (!logoUrl) return null;

  try {
    const response = await axios.get(logoUrl, { responseType: "arraybuffer" });
    const base64Image = Buffer.from(response.data).toString("base64");
    const formData = new FormData();

    formData.append("file", `data:image/png;base64,${base64Image}`);
    formData.append("upload_preset", "disnojobs_company_logos");
    formData.append("folder", "company_logos");

    const uploadResponse = await axios.post(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      formData
    );

    return uploadResponse.data.secure_url;
  } catch (error) {
    return null;
  }
}

export async function scrapeJobs() {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    auth: { persistSession: false },
  });

  const allJobs: Partial<Job>[] = [];
  let totalFound = 0;

  for (const url of SCRAPER_CONFIG.urls) {
    try {
      const response = await axios.get(url);
      const dom = new JSDOM(response.data);
      const listings = dom.window.document.querySelectorAll(".job-item");
      totalFound += listings.length;

      for (const listing of listings) {
        try {
          const titleEl = listing.querySelector(".job-item__title a");
          const title = titleEl?.textContent?.trim();
          const applyUrl = titleEl?.getAttribute("href");
          const company = listing.querySelector(".job-item__company")?.textContent?.trim();
          const location = listing.querySelector(".job-item__city")?.textContent?.trim();
          const logoImg = listing.querySelector("a.job-item__logo picture img");
          const logoUrl = logoImg?.getAttribute("data-src") || logoImg?.getAttribute("src");

          if (!title || !company || !applyUrl) continue;

          const titleLower = title.toLowerCase();
          if (SCRAPER_CONFIG.excludedTitles.some((excluded) => titleLower.includes(excluded))) continue;
          if (!SCRAPER_CONFIG.requiredKeywords.some((keyword) => titleLower.includes(keyword.toLowerCase()))) continue;

          const fullJobUrl = new URL(applyUrl, "https://www.domestika.org").toString();
          const jobResponse = await axios.get(fullJobUrl);
          const jobDom = new JSDOM(jobResponse.data);

          const descriptionEl =
            jobDom.window.document.querySelector(".job-detail__description") ||
            jobDom.window.document.querySelector(".job-description");

          if (!descriptionEl) continue;

          const description = descriptionEl.innerHTML.trim();
          if (!description) continue;

          const companyLogo = await getCompanyLogo(logoUrl);

          const { data: existingJob } = await supabase
            .from("job_listings")
            .select("id")
            .eq("application_method_value", fullJobUrl)
            .single();

          if (existingJob) continue;

          const jobData: Partial<Job> = {
            title,
            company,
            company_email: "scraper@disnojobs.com",
            company_logo: companyLogo,
            description,
            location: location || "Remote",
            job_type: location?.toLowerCase().includes("remoto") ? "remote" : "onsite",
            experience_level: titleLower.includes("senior")
              ? "senior"
              : titleLower.includes("junior")
              ? "junior"
              : "mid",
            contract_type: titleLower.includes("freelance")
              ? "freelance"
              : titleLower.includes("prácticas")
              ? "internship"
              : "fulltime",
            application_method_type: "url",
            application_method_value: fullJobUrl,
            is_active: true,
            management_token: crypto.randomUUID(),
            activated_at: new Date().toISOString(),
          };

          await supabase.from("job_listings").insert(jobData);
          allJobs.push(jobData);

          // Rate limiting
          await new Promise((r) => setTimeout(r, 2000));
        } catch (error) {
          continue;
        }
      }
    } catch (error) {
      continue;
    }
  }

  return {
    success: true,
    jobsAdded: allJobs.length,
    jobsFound: totalFound,
  };
}
