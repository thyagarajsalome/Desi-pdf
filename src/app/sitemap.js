export default function sitemap() {
  const baseUrl = "https://convertpdftojpg.in";

  const routes = [
    "",
    "/pdf-to-jpg",
    "/merge",
    "/compress",
    "/split",
    "/ssc-photo-compressor",
    "/thumb-impression",
    "/passport-maker",
    "/aadhaar-unlock",
    "/pan-merge",
    "/voter-id-pdf",
    "/pricing",
    "/about",
    "/privacy",
    "/terms",
    "/disclaimer",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1.0 : 0.8,
  }));
}
