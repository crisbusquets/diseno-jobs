// lib/services/scraper/manager.ts
import { DomestikaScraper } from "./platforms/domestika";

// Configuration for job filtering
const SCRAPER_CONFIG = {
  roles: [
    // English roles
    "ux",
    "ui",
    "user experience",
    "user interface",
    "product designer",
    "product design",
    "interaction designer",
    "interaction design",
    "ux/ui",
    "ui/ux",
    // Spanish roles
    "diseñador de producto",
    "diseñador ux",
    "diseñador ui",
    "experiencia de usuario",
    "interfaz de usuario",
    "diseño de producto",
    "diseñador de experiencia",
    "diseñador de interfaz",
    "diseñador digital",
    "diseño de aplicaciones",
    "diseño web",
  ],
  locations: [
    // Countries
    "españa",
    "spain",
    "remote",
    "remoto",
    // Cities
    "madrid",
    "barcelona",
    "valencia",
    "sevilla",
    "bilbao",
    "málaga",
    "zaragoza",
    // Work types
    "híbrido",
    "hybrid",
    "teletrabajo",
    "en remoto",
  ],
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
