// lib/services/scraper/platforms/domestika.ts
import { BaseJobScraper, ScrapedJob } from "../base";
import { JSDOM } from "jsdom";

export class DomestikaScraper extends BaseJobScraper {
  protected name = "Domestika";
  protected baseUrl = "https://www.domestika.org/es/jobs/area";

  // List of categories (can be expanded dynamically)
  private categories = [
    { id: "223", name: "Diseño de Producto Digital" },
    { id: "10", name: "UX/UI" },
    { id: "56", name: "Diseño Web" },
  ];

  // Helper to determine job type from location text
  private determineJobType(locationText: string): "remote" | "hybrid" | "onsite" {
    const lower = locationText.toLowerCase();
    if (lower.includes("remoto") || lower.includes("remote")) return "remote";
    if (lower.includes("híbrido") || lower.includes("hybrid")) return "hybrid";
    return "onsite";
  }

  // Helper to determine experience level from title and description
  private determineExperienceLevel(title: string, description: string) {
    const text = `${title} ${description}`.toLowerCase();

    if (text.includes("senior") || text.includes("sr.")) return "senior";
    if (text.includes("junior") || text.includes("jr.")) return "junior";
    if (text.includes("lead") || text.includes("manager")) return "lead";
    return "mid"; // Default to mid-level
  }

  // Get job listings from the page
  protected getJobListings(dom: JSDOM): Element[] {
    return Array.from(dom.window.document.querySelectorAll(".job-item"));
  }

  // Extract job data from a job listing element
  protected async extractJobData(element: Element): Promise<Partial<ScrapedJob>> {
    console.log("Raw job listing HTML:", element.outerHTML);
    try {
      // Get basic elements
      const titleEl = element.querySelector(".job-item__title");
      const companyEl = element.querySelector(".job-item__company");
      const locationEl = element.querySelector(".job-item__city");
      const applyUrl = element.querySelector(".job-title")?.getAttribute("href");
      const logoEl =
        element.querySelector(".job-item__logo img")?.getAttribute("data-src") ||
        element.querySelector(".job-item__logo img")?.getAttribute("src");

      // If we don't have required fields, skip
      if (!titleEl || !companyEl || !applyUrl) {
        console.log("Missing fields:", {
          title: titleEl?.textContent?.trim(),
          company: companyEl?.textContent?.trim(),
          applyUrl,
        });
        throw new Error("Missing required fields");
      }

      // Get job details page for full description
      const jobPage = await this.fetchPage(applyUrl);
      const description = jobPage.window.document.querySelector(".job-description")?.textContent?.trim() || "";

      return {
        title: titleEl.textContent?.trim() || "",
        company: companyEl.textContent?.trim() || "",
        location: locationEl?.textContent?.trim(),
        description,
        company_logo: logoEl,
        job_type: this.determineJobType(locationEl?.textContent || ""),
        experience_level: this.determineExperienceLevel(titleEl.textContent || "", description),
        contract_type: "fulltime",
        application_url: applyUrl,
        source_platform: this.name,
        source_url: applyUrl,
      };
    } catch (error) {
      console.error("Error extracting job data:", error);
      return {};
    }
  }

  // Scrape jobs for a specific category
  async scrapeJobsForCategory(categoryId: string): Promise<ScrapedJob[]> {
    const jobs: ScrapedJob[] = [];

    try {
      // Scrape first 2 pages for each category
      for (let page = 1; page <= 2; page++) {
        const url = `${this.baseUrl}/${categoryId}?page=${page}`;
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

  // Scrape jobs across multiple categories
  async scrapeJobs(): Promise<ScrapedJob[]> {
    const allJobs: ScrapedJob[] = [];

    for (const category of this.categories) {
      console.log(`\nScraping category: ${category.name}`);
      const jobs = await this.scrapeJobsForCategory(category.id);
      allJobs.push(...jobs);
    }

    return allJobs;
  }
}
