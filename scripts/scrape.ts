// scripts/scrape.ts
import * as dotenv from "dotenv";
import ora from "ora";
dotenv.config({ path: ".env.local" });

import { scrapeJobs } from "../app/lib/services/scraper/scraper";

async function main() {
  const spinner = ora("Scraping jobs...").start();

  try {
    const result = await scrapeJobs();
    spinner.succeed(`Scraping completed: ${result.jobsAdded} jobs added out of ${result.jobsFound} found`);
  } catch (error) {
    spinner.fail(`Failed to scrape: ${error}`);
  }
}

main();
