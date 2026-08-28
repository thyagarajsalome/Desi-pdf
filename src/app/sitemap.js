import { supabase } from "@/lib/supabaseClient";

export default async function sitemap() {
  const baseUrl = "https://convertpdftojpg.in";

  const staticRoutes = [
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

  const staticMap = staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1.0 : 0.8,
  }));

  const { data: seoPages } = await supabase.from('seo_pages').select('slug');

  const dynamicMap = (seoPages || []).map((page) => ({
    url: `${baseUrl}/tool/${page.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticMap, ...dynamicMap];
}
