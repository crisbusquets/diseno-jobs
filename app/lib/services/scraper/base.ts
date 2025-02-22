// lib/services/scraper/base.ts
import { Job, JobType, ExperienceLevel, ContractType } from "@/types";
import { getSupabase } from "@/lib/supabase";
import { JSDOM } from "jsdom";
import axios from "axios";
import crypto from "crypto";

// Common interface for scraped jobs
export interface ScrapedJob {
  title: string;
  company: string;
  description: string;
  job_type: JobType;
  location?: string;
  salary_range?: string;
  company_logo?: string;
  experience_level: ExperienceLevel;
  contract_type: ContractType;
  application_url: string;
  benefits?: string[];
  source_platform: string;
  source_url: string;
}

// Base scraper class with common functionality
export abstract class BaseJobScraper {
  protected abstract name: string;
  protected abstract baseUrl: string;
  protected abstract getCurrentCategory(): string;
  protected pageDelay = 2000; // Delay between pages in ms

  constructor(
    protected readonly filterConfig: {
      roles: string[];
      locations: string[];
      allowRemote: boolean;
    }
  ) {}

  // Common HTTP fetching with rate limiting and retries
  protected async fetchPage(url: string): Promise<JSDOM> {
    try {
      const response = await axios.get(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; DisnoJobs/1.0; +https://disnojobs.com)",
          "Accept-Language": "es-ES,es;q=0.9,en;q=0.8",
        },
        timeout: 10000,
      });
      return new JSDOM(response.data);
    } catch (error) {
      console.error(`Error fetching ${url}:`, error);
      throw error;
    }
  }

  // Abstract methods that must be implemented by each platform
  protected abstract extractJobData(element: Element): Promise<Partial<ScrapedJob>>;
  protected abstract getJobListings(dom: JSDOM): Element[];
  abstract scrapeJobs(): Promise<ScrapedJob[]>;

  // Common validation for job listings
  protected validateJob(job: Partial<ScrapedJob>): boolean {
    // Required fields check
    if (!job.title || !job.company || !job.description || !job.application_url) {
      console.log("Missing required fields");
      return false;
    }

    // Description length check
    if (job.description.length < 100) {
      console.log("Description too short");
      return false;
    }

    // Check if job title matches our target roles
    const titleLower = job.title.toLowerCase();
    const matchesRole = this.filterConfig.roles.some((role) => titleLower.includes(role.toLowerCase()));

    if (!matchesRole) {
      console.log("Job title doesn't match target roles");
      return false;
    }

    // Location check
    if (job.location) {
      const locationLower = job.location.toLowerCase();
      const matchesLocation =
        (this.filterConfig.allowRemote && (locationLower.includes("remote") || locationLower.includes("remoto"))) ||
        this.filterConfig.locations.some((loc) => locationLower.includes(loc.toLowerCase()));

      if (!matchesLocation) {
        console.log("Location doesn't match filters");
        return false;
      }
    }

    return true;
  }

  // Save jobs to database
  protected async saveJobs(jobs: ScrapedJob[]): Promise<ScrapedJob[]> {
    const supabase = getSupabase();
    const savedJobs: ScrapedJob[] = [];

    // Deduplicate jobs before saving
    const uniqueJobs = jobs.filter(
      (job, index, self) => index === self.findIndex((j) => j.source_url === job.source_url)
    );

    console.log(`\nSaving ${uniqueJobs.length} unique jobs (filtered from ${jobs.length} total)`);

    for (const job of uniqueJobs) {
      try {
        // Check for existing job
        const { data: existingJob } = await supabase
          .from("job_listings")
          .select("id")
          .eq("source_url", job.source_url)
          .single();

        if (existingJob) {
          console.log(`Job already exists: ${job.title}`);
          continue;
        }

        // Insert new job
        const { data: newJob, error: jobError } = await supabase
          .from("job_listings")
          .insert({
            title: job.title,
            company: job.company,
            company_email: `scraper+${this.name.toLowerCase()}@disnojobs.com`,
            description: job.description,
            job_type: job.job_type,
            location: job.location,
            experience_level: job.experience_level,
            contract_type: job.contract_type,
            salary_range: job.salary_range,
            company_logo: job.company_logo,
            application_method_type: "url",
            application_method_value: job.application_url,
            source_url: job.source_url,
            source_platform: job.source_platform,
            is_active: true,
            management_token: crypto.randomUUID(),
            activated_at: new Date().toISOString(),
          })
          .select()
          .single();

        if (jobError) throw jobError;
        console.log(`✓ Saved new job: ${job.title} from ${job.company}`);
        savedJobs.push(job);
      } catch (error) {
        console.error(`Error saving job ${job.title}:`, error);
      }
    }

    return savedJobs;
  }

  // Log scraper run results
  protected async logScraperRun(results: { category: string; jobsFound: number; jobsSaved: number; errors: number }) {
    const supabase = getSupabase();

    try {
      console.log("\n=== Logging Scraper Run ===");
      const logData = {
        source_platform: this.name,
        category: results.category,
        jobs_found: results.jobsFound,
        jobs_saved: results.jobsSaved,
        errors: results.errors,
        // created_at will be set by default
      };

      console.log("Attempting to log:", logData);

      const { data, error } = await supabase.from("scraper_logs").insert(logData).select();

      if (error) {
        console.error("Database error logging scraper run:", error);
        // Log the full error details
        console.error("Full error:", {
          message: error.message,
          details: error.details,
          hint: error.hint,
        });
      } else {
        console.log("✓ Successfully logged to database. Response:", data);
      }
    } catch (error) {
      console.error("Error in logScraperRun:", error);
      if (error instanceof Error) {
        console.error("Error details:", error.message);
        console.error("Stack:", error.stack);
      }
    }
  }

  // Main execution method
  async run(): Promise<void> {
    console.log("Testing Supabase before anything...");
    console.log(getSupabase());
    console.log(this.name);
    console.log("\n=== Starting Base Run ===");
    const results = {
      category: "",
      jobsFound: 0,
      jobsSaved: 0,
      errors: 0,
    };

    try {
      console.log(`\n🔍 Starting ${this.name} scraper...`);
      const jobs = await this.scrapeJobs();
      console.log("\nGot jobs from scraper:", jobs.length); // Debug

      const validJobs = jobs.filter((job) => this.validateJob(job));
      console.log("Valid jobs:", validJobs.length); // Debug

      results.jobsFound = jobs.length;

      // Save jobs and count successes
      const savedJobs = await this.saveJobs(validJobs);
      console.log("Saved jobs:", savedJobs.length); // Debug

      results.jobsSaved = savedJobs.length;
      results.errors = jobs.length - savedJobs.length;

      console.log("\nFinal results to log:", results); // Debug
      await this.logScraperRun(results);

      console.log(`\n✅ ${this.name} scraper finished successfully\n`);
    } catch (error) {
      console.error(`\n❌ Error in ${this.name || "Unknown"} scraper:`, error);
      console.error("Error type:", error instanceof Error ? error.message : error);
      console.error("Current environment variables:", process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
      results.errors++;
      await this.logScraperRun(results);
    }
  }
}
