export const SCRAPER_CONFIG = {
  // URLs to scrape
  urls: [
    "https://www.domestika.org/es/jobs/area/10-ux-ui", // UX/UI
    "https://www.domestika.org/es/jobs/area/150-diseno-digital", // Digital Design
    "https://www.domestika.org/es/jobs/area/56-diseno-web", // Web Design
    "https://www.domestika.org/es/jobs/area/223-diseno-de-producto-digital", // Product Design
  ],

  // Job titles that should be ignored (case insensitive)
  excludedTitles: [
    "graphic",
    "diseñador gráfico",
    "diseñador grafico",
    "marketing",
    "social media",
    "motion",
    "video",
    "branding",
    "animación",
    "animador",
    "motion",
    "3D",
    "seo",
    "sem",
    "aso",
    "artista",
    "artist",
    "cgi",
    "copywriter",
    "arquitectura",
    "community manager",
    "creativo",
    "creativa",
  ],

  // Required keywords in title (at least one should match, case insensitive)
  requiredKeywords: [
    "ux",
    "ui",
    "uxui",
    "uiux",
    "ux/ui",
    "ui/ux",
    "user experience",
    "user interface",
    "product designer",
    "producto",
    "digital designer",
    "digital",
    "web",
    "interaction",
    "interacción",
  ],
};
