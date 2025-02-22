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
    // Basic required fields
    if (!job.title || !job.company || !job.description || !job.application_url) {
      return false;
    }

    // Check if job title matches our target roles
    const titleLower = job.title.toLowerCase();
    const matchesRole = this.filterConfig.roles.some((role) => titleLower.includes(role.toLowerCase()));

    if (!matchesRole) {
      return false;
    }

    // Location validation
    if (job.location) {
      const locationLower = job.location.toLowerCase();
      const matchesLocation = this.filterConfig.locations.some((loc) => locationLower.includes(loc.toLowerCase()));

      // If it's not remote and doesn't match our locations, skip it
      if (!matchesLocation && job.job_type !== "remote") {
        return false;
      }
    }

    return true;
  }

  // Save jobs to database
  protected async saveJobs(jobs: ScrapedJob[]): Promise<void> {
    const supabase = getSupabase();

    for (const job of jobs) {
      try {
        // Check for duplicates
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

        // Insert benefits if any
        if (job.benefits?.length) {
          const { error: benefitsError } = await supabase.from("job_benefits").insert(
            job.benefits.map((benefit) => ({
              job_id: newJob.id,
              benefit_name: benefit,
              is_custom: true,
            }))
          );

          if (benefitsError) throw benefitsError;
        }

        console.log(`✓ Saved job: ${job.title} from ${job.company}`);
      } catch (error) {
        console.error(`Error saving job ${job.title}:`, error);
      }
    }
  }

  // Main execution method
  async run(): Promise<void> {
    try {
      console.log(`\n🔍 Starting ${this.name} scraper...`);
      const jobs = await this.scrapeJobs();
      const validJobs = jobs.filter((job) => this.validateJob(job));
      console.log(`\n📊 Found ${jobs.length} jobs, ${validJobs.length} valid`);
      await this.saveJobs(validJobs);
      console.log(`\n✅ ${this.name} scraper finished successfully\n`);
    } catch (error) {
      console.error(`\n❌ Error in ${this.name} scraper:`, error);
    }
  }
}
