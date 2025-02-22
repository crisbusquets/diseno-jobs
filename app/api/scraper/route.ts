// app/api/scraper/route.ts
import { NextResponse } from "next/server";
import { runScrapers } from "@/lib/services/scraper/manager";

export async function POST(req: Request) {
  try {
    // Basic API key authentication
    const apiKey = req.headers.get("x-api-key");
    if (apiKey !== process.env.SCRAPER_API_KEY) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Run scrapers
    await runScrapers();

    return NextResponse.json({
      success: true,
      message: "Scraping completed",
    });
  } catch (error) {
    console.error("Scraper API error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
