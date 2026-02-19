import type { MetadataRoute } from "next";

const BASE_URL = "https://www.gidan.store";

// Public-facing pages (exclude auth/account/checkout private pages)
const STATIC_ROUTES: { url: string; priority: number; changeFreq: MetadataRoute.Sitemap[0]["changeFrequency"] }[] = [
  { url: "/", priority: 1.0, changeFreq: "daily" },
  { url: "/bestseller", priority: 0.9, changeFreq: "daily" },
  { url: "/latest", priority: 0.9, changeFreq: "daily" },
  { url: "/featured", priority: 0.8, changeFreq: "weekly" },
  { url: "/feature", priority: 0.8, changeFreq: "weekly" },
  { url: "/dealofweek", priority: 0.9, changeFreq: "daily" },
  { url: "/combooffer", priority: 0.8, changeFreq: "weekly" },
  { url: "/flower", priority: 0.8, changeFreq: "weekly" },
  { url: "/birthday", priority: 0.7, changeFreq: "weekly" },
  { url: "/anniversary", priority: 0.7, changeFreq: "weekly" },
  { url: "/housewarming", priority: 0.7, changeFreq: "weekly" },
  { url: "/gifts", priority: 0.7, changeFreq: "weekly" },
  { url: "/giftcard", priority: 0.7, changeFreq: "monthly" },
  { url: "/corporate", priority: 0.7, changeFreq: "monthly" },
  { url: "/seasonal", priority: 0.8, changeFreq: "weekly" },
  { url: "/outdoor", priority: 0.7, changeFreq: "weekly" },
  { url: "/rakshabhandan", priority: 0.7, changeFreq: "monthly" },
  { url: "/trending", priority: 0.8, changeFreq: "daily" },
  { url: "/stores", priority: 0.7, changeFreq: "monthly" },
  { url: "/blogcomponent", priority: 0.8, changeFreq: "daily" },
  { url: "/ourwork", priority: 0.6, changeFreq: "monthly" },
  { url: "/services", priority: 0.7, changeFreq: "monthly" },
  { url: "/services/single", priority: 0.6, changeFreq: "monthly" },
  { url: "/services/single/Terracegardening", priority: 0.6, changeFreq: "monthly" },
  { url: "/services/single/Verticalgarden", priority: 0.6, changeFreq: "monthly" },
  { url: "/services/single/dripirrigation", priority: 0.6, changeFreq: "monthly" },
  { url: "/services/single/garden", priority: 0.6, changeFreq: "monthly" },
  { url: "/services/single/landscapingpage", priority: 0.6, changeFreq: "monthly" },
  { url: "/franchise-enquiry", priority: 0.7, changeFreq: "monthly" },
  { url: "/careers", priority: 0.6, changeFreq: "monthly" },
  { url: "/about-us", priority: 0.6, changeFreq: "monthly" },
  { url: "/contact-us", priority: 0.6, changeFreq: "monthly" },
  { url: "/faq", priority: 0.6, changeFreq: "monthly" },
  { url: "/search", priority: 0.5, changeFreq: "weekly" },
  { url: "/privacy-policy", priority: 0.3, changeFreq: "yearly" },
  { url: "/terms", priority: 0.3, changeFreq: "yearly" },
  { url: "/shipping", priority: 0.4, changeFreq: "yearly" },
  { url: "/return", priority: 0.4, changeFreq: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const today = new Date().toISOString();

  return STATIC_ROUTES.map((route) => ({
    url: `${BASE_URL}${route.url}`,
    lastModified: today,
    changeFrequency: route.changeFreq,
    priority: route.priority,
  }));
}
