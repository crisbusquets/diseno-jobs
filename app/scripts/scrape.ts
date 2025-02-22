import { runScrapers } from "../lib/services/scraper/manager";

async function main() {
  try {
    console.log("Starting local scraper...");
    await runScrapers();
    console.log("Scraping completed successfully");
  } catch (error) {
    console.error("Scraping failed:", error);
    process.exit(1);
  }
}

main();
