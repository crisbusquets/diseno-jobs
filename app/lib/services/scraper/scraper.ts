// app/lib/services/scraper/scraper.ts
import { createClient } from "@supabase/supabase-js";
import axios from "axios";
import { JSDOM } from "jsdom";
import type { Job } from "@/types";
import crypto from "crypto";
import { SCRAPER_CONFIG } from "./config";

// Function to get company logo
async function getCompanyLogo(logoUrl: string | null): Promise<string | null> {
  if (!logoUrl) return null;

  try {
    // Build Cloudinary upload URL
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = "disnojobs_company_logos";

    // Download image
    const response = await axios.get(logoUrl, {
      responseType: "arraybuffer",
    });

    // Convert to base64
    const base64Image = Buffer.from(response.data).toString("base64");

    // Upload to Cloudinary
    const formData = new FormData();
    formData.append("file", `data:image/png;base64,${base64Image}`);
    formData.append("upload_preset", uploadPreset);
    formData.append("folder", "company_logos");

    const uploadResponse = await axios.post(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, formData);

    return uploadResponse.data.secure_url;
  } catch (error) {
    console.error("Error handling logo:", error);
    return null;
  }
}

export async function scrapeJobs() {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    auth: {
      persistSession: false,
    },
  });

  const allJobs: Partial<Job>[] = [];
  let totalFound = 0;

  for (const url of SCRAPER_CONFIG.urls) {
    try {
      console.log("\nFetching URL:", url);
      const response = await axios.get(url);
      const dom = new JSDOM(response.data);

      const listings = dom.window.document.querySelectorAll(".job-item");
      console.log(`Found ${listings.length} listings`);
      totalFound += listings.length;

      for (const listing of listings) {
        try {
          // Log the entire listing HTML to inspect its structure
          console.log("Listing HTML:", listing.outerHTML);
          // Extract basic job data
          const titleEl = listing.querySelector(".job-item__title a");
          const title = titleEl?.textContent?.trim();
          const applyUrl = titleEl?.getAttribute("href");
          const company = listing.querySelector(".job-item__company")?.textContent?.trim();
          const location = listing.querySelector(".job-item__city")?.textContent?.trim();

          // Get company logo
          // Get company logo
          const logoImg = listing.querySelector("a.job-item__logo picture img");
          const logoUrl = logoImg?.getAttribute("data-src") || logoImg?.getAttribute("src");

          // Log the extracted logo URL
          console.log("Company logo URL:", logoUrl);

          if (!logoUrl) {
            console.log("No logo URL found.");
          }

          if (!title || !company || !applyUrl) {
            console.log("❌ Skipping - Missing required fields");
            continue;
          }

          // Title validation checks (excluded titles and required keywords)
          const titleLower = title.toLowerCase();
          if (SCRAPER_CONFIG.excludedTitles.some((excluded) => titleLower.includes(excluded))) {
            console.log(`❌ Skipping - Excluded title: ${title}`);
            continue;
          }

          const hasRequiredKeyword = SCRAPER_CONFIG.requiredKeywords.some((keyword) =>
            titleLower.includes(keyword.toLowerCase())
          );
          if (!hasRequiredKeyword) {
            console.log(`❌ Skipping - No required keywords in title: ${title}`);
            continue;
          }

          // Fetch full job description
          console.log("Fetching full description for:", title);
          const fullJobUrl = new URL(applyUrl, "https://www.domestika.org").toString();
          const jobResponse = await axios.get(fullJobUrl);
          const jobDom = new JSDOM(jobResponse.data);

          const descriptionEl =
            jobDom.window.document.querySelector(".job-detail__description") ||
            jobDom.window.document.querySelector(".job-description");

          if (!descriptionEl) {
            console.log("❌ Skipping - No description found");
            continue;
          }

          // Format description
          const description = descriptionEl.innerHTML;
          console.log("Scraped description HTML:", description);

          // Upload logo if available
          const companyLogo = await getCompanyLogo(logoUrl);
          if (companyLogo) {
            console.log("✓ Company logo uploaded:", companyLogo);
          } else {
            console.log("No company logo uploaded.");
          }

          // Create job data
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

          // Check for existing job
          const { data: existingJob } = await supabase
            .from("job_listings")
            .select("id")
            .eq("application_method_value", fullJobUrl)
            .single();

          if (existingJob) {
            console.log("❌ Skipping - Job already exists");
            continue;
          }

          // Insert new job
          const { error: insertError } = await supabase.from("job_listings").insert(jobData);

          if (insertError) {
            console.error("❌ Error inserting job:", insertError);
            continue;
          }

          allJobs.push(jobData);
          console.log("✅ Successfully added job:", title);

          // Rate limiting between job detail requests
          await new Promise((r) => setTimeout(r, 2000));
        } catch (error) {
          console.error("Error processing job:", error);
          continue;
        }
      }
    } catch (error) {
      console.error(`Error scraping ${url}:`, error);
      continue;
    }
  }

  return {
    success: true,
    jobsAdded: allJobs.length,
    jobsFound: totalFound,
  };
}
