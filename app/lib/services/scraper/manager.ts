// lib/services/scraper/manager.ts
import { DomestikaScraper } from "./platforms/domestika";

// Configuration for job filtering
const SCRAPER_CONFIG = {
  roles: [
    "ux",
    "ui",
    "user experience",
    "user interface",
    "product designer",
    "diseñador",
    "diseñadora",
    "experiencia de usuario",
    "interfaz",
    "producto",
  ],
  locations: ["españa", "spain", "madrid", "barcelona", "valencia", "sevilla", "bilbao", "remote", "remoto"],
  allowRemote: true,
};

// Create scraper instances
const scrapers = [
  new DomestikaScraper(SCRAPER_CONFIG),
  // Add more scrapers here as we implement them
];

export async function runScrapers() {
  console.log("🤖 Starting job scrapers...");

  const results = await Promise.allSettled(scrapers.map((scraper) => scraper.run()));

  // Log results
  const successful = results.filter((r) => r.status === "fulfilled").length;
  const failed = results.filter((r) => r.status === "rejected").length;

  console.log("\n📊 Scraping summary:");
  console.log(`✓ Successful: ${successful}`);
  console.log(`✗ Failed: ${failed}`);

  if (failed > 0) {
    const errors = results.filter((r): r is PromiseRejectedResult => r.status === "rejected").map((r) => r.reason);
    console.error("\nErrors:", errors);
  }
}
