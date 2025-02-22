// lib/services/scraper/platforms/domestika.ts
import { BaseJobScraper, ScrapedJob } from "../base";
import { JSDOM } from "jsdom";
import { ContractType } from "@/types";

export class DomestikaScraper extends BaseJobScraper {
  protected name = "Domestika";
  protected baseUrl = "https://www.domestika.org/es/jobs/area";
  protected currentCategory = "";

  private categories = [
    { id: "223", name: "Diseño de Producto Digital" },
    { id: "10", name: "UX/UI" },
    { id: "56", name: "Diseño Web" },
  ];

  protected getCurrentCategory(): string {
    return this.currentCategory;
  }

  private determineJobType(locationText: string): "remote" | "hybrid" | "onsite" {
    const lower = locationText.toLowerCase();
    if (lower.includes("remoto") || lower.includes("remote")) return "remote";
    if (lower.includes("híbrido") || lower.includes("hybrid")) return "hybrid";
    return "onsite";
  }

  private determineExperienceLevel(title: string, description: string) {
    const text = `${title} ${description}`.toLowerCase();

    if (text.includes("senior") || text.includes("sr.")) return "senior";
    if (text.includes("junior") || text.includes("jr.")) return "junior";
    if (text.includes("lead") || text.includes("manager")) return "lead";
    return "mid";
  }

  protected async extractJobData(element: Element): Promise<Partial<ScrapedJob>> {
    try {
      const titleLink = element.querySelector(".job-item__title .job-title");
      const title = titleLink?.textContent?.trim();
      const jobUrl = titleLink?.getAttribute("href");
      const company = element.querySelector(".job-item__company")?.textContent?.trim();
      const location = element.querySelector(".job-item__city")?.textContent?.trim();
      const contractBadge = element.querySelector(".circle-badge")?.textContent?.trim();

      const logoImg = element.querySelector(".job-item__logo img");
      let logoUrl = logoImg?.getAttribute("data-src") || logoImg?.getAttribute("src");

      if (logoUrl && logoUrl.includes("data-srcset")) {
        const srcset = logoImg?.getAttribute("data-srcset");
        if (srcset) {
          const urls = srcset.split(",").map((s) => s.trim().split(" ")[0]);
          logoUrl = urls[urls.length - 1];
        }
      }

      if (logoUrl) {
        logoUrl = logoUrl.split("?")[0];
        if (!logoUrl.match(/\.(jpg|jpeg|png|gif)$/i)) {
          logoUrl = null;
        }
      }

      if (!title || !company || !jobUrl) {
        console.log("Missing required fields:", { title, company, jobUrl });
        return {};
      }

      let description = "";
      try {
        console.log(`Fetching details for: ${title}`);
        const jobPage = await this.fetchPage(jobUrl);

        const descriptionEl =
          jobPage.window.document.querySelector(".job-detail__description") ||
          jobPage.window.document.querySelector(".job-description") ||
          jobPage.window.document.querySelector("[data-target='job.description']");

        if (descriptionEl) {
          description = descriptionEl.textContent || "";
          description = description
            .trim()
            .replace(/\s+/g, " ")
            .replace(/\n\s*\n/g, "\n\n");

          console.log(`Found description (${description.length} chars)`);
        } else {
          console.log("No description found in detail page");
          description = element.querySelector(".job-item__excerpt")?.textContent?.trim() || "";
        }
      } catch (error) {
        console.error(`Error fetching job details for ${title}:`, error);
        description = element.querySelector(".job-item__excerpt")?.textContent?.trim() || "";
      }

      if (description.length < 50) {
        console.log("Description too short, skipping job");
        return {};
      }

      let contractType: ContractType = "fulltime";
      if (contractBadge) {
        const badge = contractBadge.toLowerCase();
        if (badge.includes("parcial")) contractType = "parttime";
        if (badge.includes("prácticas")) contractType = "internship";
        if (badge.includes("freelance")) contractType = "freelance";
      }

      const jobData: Partial<ScrapedJob> = {
        title,
        company,
        location,
        description,
        company_logo: logoUrl,
        job_type: this.determineJobType(location || ""),
        experience_level: this.determineExperienceLevel(title, description),
        contract_type: contractType,
        application_url: jobUrl,
        source_platform: this.name,
        source_url: jobUrl,
      };

      console.log(`✓ Extracted job: ${title} at ${company} (${description.length} chars)`);
      return jobData;
    } catch (error) {
      console.error("Error extracting job data:", error);
      return {};
    }
  }

  protected getJobListings(dom: JSDOM): Element[] {
    return Array.from(dom.window.document.querySelectorAll(".job-item"));
  }

  async scrapeJobsForCategory(
    categoryId: string,
    categoryName: string
  ): Promise<{
    jobs: ScrapedJob[];
    category: string;
    stats: {
      jobsFound: number;
      jobsSaved: number;
      errors: number;
    };
  }> {
    const jobs: ScrapedJob[] = [];
    const maxPages = 2;
    let totalFound = 0;
    let validJobs = 0;
    let errors = 0;

    try {
      for (let page = 1; page <= maxPages; page++) {
        const url = `${this.baseUrl}/${categoryId}?page=${page}`;
        console.log(`\nScraping page ${page} for category ${categoryName}`);

        const dom = await this.fetchPage(url);
        const listings = Array.from(dom.window.document.querySelectorAll(".job-item"));

        if (!listings.length) {
          console.log("No more listings found");
          break;
        }

        totalFound += listings.length;
        console.log(`Found ${listings.length} listings on page ${page}`);

        for (const listing of listings) {
          try {
            const jobData = await this.extractJobData(listing);

            if (this.validateJob(jobData)) {
              jobs.push(jobData as ScrapedJob);
              validJobs++;
              console.log(`✓ Added new job: ${jobData.title}`);
            }

            await new Promise((r) => setTimeout(r, 3000));
          } catch (error) {
            console.error("Error processing job listing:", error);
            errors++;
            continue;
          }
        }

        await new Promise((r) => setTimeout(r, this.pageDelay));
      }

      return {
        jobs,
        category: categoryName,
        stats: {
          jobsFound: totalFound,
          jobsSaved: validJobs,
          errors: errors,
        },
      };
    } catch (error) {
      console.error(`Error scraping category ${categoryId}:`, error);
      return {
        jobs: [],
        category: categoryName,
        stats: {
          jobsFound: totalFound,
          jobsSaved: 0,
          errors: errors + 1,
        },
      };
    }
  }

  async scrapeJobs(): Promise<ScrapedJob[]> {
    const allJobs: ScrapedJob[] = [];
    let lastCategory = "";

    console.log("\n=== Starting scrapeJobs ===");

    for (const category of this.categories) {
      console.log(`\nProcessing category: ${category.name}`);

      const result = await this.scrapeJobsForCategory(category.id, category.name);
      console.log("\nCategory results:", {
        category: result.category,
        jobsFound: result.stats.jobsFound,
        saved: result.stats.jobsSaved,
        errors: result.stats.errors,
      });

      allJobs.push(...result.jobs);
      lastCategory = result.category;

      // Try to log each category separately
      await this.logScraperRun({
        category: result.category,
        jobsFound: result.stats.jobsFound,
        jobsSaved: result.stats.jobsSaved,
        errors: result.stats.errors,
      });
    }

    console.log("\nAll categories processed. Total jobs:", allJobs.length);
    return allJobs;
  }
}
