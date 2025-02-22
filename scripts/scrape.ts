// scripts/scrape.ts
import { runScrapers } from "../app/lib/services/scraper/manager";

async function main() {
  console.log("🤖 Starting local scraper...\n");

  try {
    await runScrapers();
    console.log("\n✅ Scraping completed successfully");
  } catch (error) {
    console.error("\n❌ Scraping failed:", error);
    process.exit(1);
  }
}

main().catch(console.error);
