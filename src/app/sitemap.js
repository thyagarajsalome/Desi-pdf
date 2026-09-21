import { QUALITY_EXAM_SLUGS } from "@/lib/qualityPages";

export default async function sitemap() {
  const baseUrl = "https://convertpdftojpg.in";

  const staticRoutes = [
    "",
    "/pdf-to-jpg",
    "/merge",
    "/compress",
    "/split",
    "/image-to-pdf",
    "/image-compressor",
    "/image-resizer",
    "/background-remover",
    "/signature-maker",
    "/age-calculator",
    "/ssc-photo-compressor",
    "/thumb-impression",
    "/passport-maker",
    "/aadhaar-unlock",
    "/pan-merge",
    "/voter-id-pdf",
    "/jpg-to-webp",
    "/id-card-merger",
    "/biodata-maker",
    "/railway-reservation-form",
    "/pricing",
    "/about",
    "/privacy",
    "/terms",
    "/disclaimer",
  ];

  const staticMap = staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1.0 : 0.8,
  }));

  // Only include curated, authoritative exam hubs in the sitemap
  const dynamicMap = QUALITY_EXAM_SLUGS.map((slug) => ({
    url: `${baseUrl}/tool/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  return [...staticMap, ...dynamicMap];
}
