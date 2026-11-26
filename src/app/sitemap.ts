import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://owner-statement-studio-lyart.vercel.app";
  const routes = [
    "",
    "/airbnb-owner-statement-template",
    "/vrbo-owner-statement-generator",
    "/airbnb-15-5-host-fee-calculator",
    "/pricing",
    "/terms",
    "/privacy",
    "/refund-policy",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : route.includes("airbnb") || route.includes("vrbo") ? 0.9 : 0.6,
  }));
}
