import { supabase } from "@/lib/supabaseClient";

export default async function sitemap() {
  const baseUrl = "https://www.convertpdftojpg.in";

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
    "/icon-generator",
    "/image-to-svg",
    "/pricing",
    "/about",
    "/privacy",
    "/terms",
    "/disclaimer",
  ];

  const staticMap = staticRoutes.map((route) => {
    let priority = 0.8;
    let changeFrequency = "weekly";

    if (route === "") {
      priority = 1.0;
      changeFrequency = "daily";
    } else if (
      route === "/icon-generator" ||
      route === "/image-to-svg" ||
      route === "/pdf-to-jpg" ||
      route === "/image-to-pdf" ||
      route === "/image-compressor" ||
      route === "/image-resizer"
    ) {
      priority = 0.9;
      changeFrequency = "daily";
    } else if (
      route === "/about" ||
      route === "/privacy" ||
      route === "/terms" ||
      route === "/disclaimer"
    ) {
      priority = 0.5;
      changeFrequency = "monthly";
    }

    return {
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
      changeFrequency,
      priority,
    };
  });

  const { data: seoPages } = await supabase.from('seo_pages').select('slug');

  const dynamicMap = (seoPages || []).map((page) => ({
    url: `${baseUrl}/tool/${page.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  return [...staticMap, ...dynamicMap];
}
