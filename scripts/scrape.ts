// scripts/scrape.ts
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { scrapeJobs } from "../app/lib/services/scraper/scraper";

async function main() {
  try {
    const result = await scrapeJobs();
    console.log("\nScraping completed:", result);
  } catch (error) {
    console.error("Failed to scrape:", error);
  }
}

main();
