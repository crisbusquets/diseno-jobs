// lib/services/scraper/platforms/domestika.ts
import { BaseJobScraper, ScrapedJob } from "../base";
import { JSDOM } from "jsdom";
import { JobType, ExperienceLevel, ContractType } from "@/types";

export class DomestikaScraper extends BaseJobScraper {
  protected name = "Domestika";
  protected baseUrl = "https://www.domestika.org/es/jobs";

  // Helper to determine job type from location text
  private determineJobType(locationText: string): JobType {
    const lower = locationText.toLowerCase();
    if (lower.includes("remoto") || lower.includes("remote")) return "remote";
    if (lower.includes("híbrido") || lower.includes("hybrid")) return "hybrid";
    return "onsite";
  }

  // Helper to determine experience level from title and description
  private determineExperienceLevel(title: string, description: string): ExperienceLevel {
    const text = `${title} ${description}`.toLowerCase();

    if (text.includes("senior") || text.includes("sr.")) return "senior";
    if (text.includes("junior") || text.includes("jr.")) return "junior";
    if (text.includes("lead") || text.includes("manager")) return "lead";
    return "mid"; // Default to mid-level
  }

  protected getJobListings(dom: JSDOM): Element[] {
    return Array.from(dom.window.document.querySelectorAll(".job-item"));
  }

  protected async extractJobData(element: Element): Promise<Partial<ScrapedJob>> {
    try {
      // Get basic elements
      const titleEl = element.querySelector(".job-item__title");
      const companyEl = element.querySelector(".job-item__company");
      const locationEl = element.querySelector(".job-item__location");
      const applyUrl = element.querySelector("a.job-item__title")?.getAttribute("href");
      const logoEl = element.querySelector(".job-item__logo img");

      // If we don't have required fields, skip
      if (!titleEl || !companyEl || !applyUrl) {
        throw new Error("Missing required fields");
      }

      // Get job details page for full description
      const jobPage = await this.fetchPage(applyUrl);
      const description = jobPage.window.document.querySelector(".job-description")?.textContent?.trim() || "";

      // Extract salary if present
      const salaryText = jobPage.window.document.querySelector(".job-salary")?.textContent?.trim();

      // Extract benefits
      const benefits = Array.from(jobPage.window.document.querySelectorAll(".job-benefits li"))
        .map((b) => b.textContent?.trim())
        .filter((b): b is string => !!b);

      return {
        title: titleEl.textContent?.trim() || "",
        company: companyEl.textContent?.trim() || "",
        location: locationEl?.textContent?.trim(),
        description,
        salary_range: salaryText || undefined,
        company_logo: logoEl?.getAttribute("src"),
        job_type: this.determineJobType(locationEl?.textContent || ""),
        experience_level: this.determineExperienceLevel(titleEl.textContent || "", description),
        contract_type: "fulltime", // Default to fulltime as Domestika rarely specifies
        application_url: applyUrl,
        benefits,
        source_platform: this.name,
        source_url: applyUrl,
      };
    } catch (error) {
      console.error("Error extracting job data:", error);
      return {};
    }
  }

  async scrapeJobs(): Promise<ScrapedJob[]> {
    const jobs: ScrapedJob[] = [];

    try {
      // Scrape first 2 pages for MVP
      for (let page = 1; page <= 2; page++) {
        const url = `${this.baseUrl}?page=${page}&category=design-ux`;
        console.log(`\nScraping ${url}`);

        const dom = await this.fetchPage(url);
        const listings = this.getJobListings(dom);

        for (const listing of listings) {
          const jobData = await this.extractJobData(listing);
          if (this.validateJob(jobData)) {
            jobs.push(jobData as ScrapedJob);
          }
          // Respect rate limits
          await new Promise((r) => setTimeout(r, 1000));
        }

        // Delay between pages
        await new Promise((r) => setTimeout(r, this.pageDelay));
      }
    } catch (error) {
      console.error("Error scraping Domestika:", error);
    }

    return jobs;
  }
}
