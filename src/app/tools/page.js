import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import {
  DIRECTORY_CATEGORIES,
  TOOL_CATEGORY_META,
  STANDALONE_TOOLS,
} from "@/lib/toolCatalog";

export const revalidate = 86400;

export const metadata = {
  title: "All PDF, Image & Sarkari Exam Tools Directory | DesiPDF",
  description:
    "Browse 125+ free browser-based PDF, image, Aadhaar, PAN, passport photo, signature, and Sarkari exam form tools for SSC, UPSC, IBPS, NEET, and Railway portals.",
  alternates: {
    canonical: "https://www.convertpdftojpg.in/tools",
  },
  openGraph: {
    title: "All PDF, Image & Sarkari Exam Tools Directory | DesiPDF",
    description:
      "Complete directory of 125+ private client-side PDF, image, Aadhaar, and government exam preparation utilities.",
    url: "https://www.convertpdftojpg.in/tools",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default async function ToolsDirectoryPage() {
  const { data: seoPages } = await supabase
    .from("seo_pages")
    .select("slug, h1_title, hero_subtitle, tool_target")
    .order("id", { ascending: true });

  const pages = seoPages || [];

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "DesiPDF Complete Tools Directory",
    url: "https://www.convertpdftojpg.in/tools",
    description:
      "Categorized index of all free client-side PDF, image, and Indian government exam document tools.",
    numberOfItems: pages.length + STANDALONE_TOOLS.length,
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.convertpdftojpg.in/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "All Tools Directory",
        item: "https://www.convertpdftojpg.in/tools",
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#09090b] pt-12 pb-24 px-4">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="max-w-7xl mx-auto space-y-12">
        {/* Breadcrumb + Header */}
        <div className="space-y-4 text-center max-w-3xl mx-auto">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center justify-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400"
          >
            <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition">
              Home
            </Link>
            <span>/</span>
            <span className="text-gray-900 dark:text-gray-200 font-semibold">
              All Tools Directory
            </span>
          </nav>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Complete PDF, Image &amp; Exam Tools Directory
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
            Explore all {STANDALONE_TOOLS.length + pages.length}+ specialized utilities. Every tool runs 100% locally in your browser with zero file uploads and no watermarks.
          </p>

          {/* Category Jump Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            {DIRECTORY_CATEGORIES.map((cat) => (
              <a
                key={cat.id}
                href={`#${cat.id}`}
                className="px-3.5 py-2 rounded-xl bg-white dark:bg-[#121217] border border-gray-200 dark:border-gray-800 hover:border-blue-500 text-xs font-bold text-gray-700 dark:text-gray-300 transition flex items-center gap-2"
              >
                <i className={`fa-solid ${cat.icon} text-blue-600 dark:text-blue-400`}></i>
                <span>{cat.title.split(",")[0]}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Categorized Sections */}
        {DIRECTORY_CATEGORIES.map((category) => {
          const coreInCategory = STANDALONE_TOOLS.filter(
            (t) => t.categoryId === category.id
          );
          const pseoInCategory = pages.filter((p) => {
            const meta = TOOL_CATEGORY_META[p.tool_target];
            return (meta?.categoryId || "images") === category.id;
          });

          return (
            <section
              key={category.id}
              id={category.id}
              className="bg-white dark:bg-[#111116] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 scroll-mt-20"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 dark:border-gray-800 pb-5">
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <span className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                      <i className={`fa-solid ${category.icon}`}></i>
                    </span>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white">
                      {category.title}
                    </h2>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 pl-11">
                    {category.desc}
                  </p>
                </div>
                <span className="self-start sm:self-center text-xs font-bold px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 shrink-0">
                  {coreInCategory.length + pseoInCategory.length} Tools
                </span>
              </div>

              {/* Core Standalone Tools */}
              {coreInCategory.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                    Primary Tools
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {coreInCategory.map((tool) => (
                      <Link
                        key={tool.route}
                        href={tool.route}
                        className="p-4 rounded-2xl bg-gray-50 dark:bg-[#18181f] border border-gray-200/80 dark:border-gray-800 hover:border-blue-500 dark:hover:border-blue-500 transition group flex items-center justify-between gap-3"
                      >
                        <div className="min-w-0">
                          <div className="font-bold text-sm text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate">
                            {tool.title}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                            {tool.desc}
                          </div>
                        </div>
                        <i className="fa-solid fa-arrow-right text-xs text-gray-400 group-hover:text-blue-500 shrink-0"></i>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Programmatic Specialized Tools & Guides */}
              {pseoInCategory.length > 0 && (
                <div className="space-y-3 pt-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                    Specialized Portal Guides &amp; Presets
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                    {pseoInCategory.map((p) => (
                      <Link
                        key={p.slug}
                        href={`/tool/${p.slug}`}
                        className="px-4 py-3 rounded-xl bg-white dark:bg-[#09090b] border border-gray-200/70 dark:border-gray-800 hover:border-blue-500 dark:hover:border-blue-500 transition group flex items-center justify-between gap-2"
                      >
                        <span className="text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate">
                          {p.h1_title}
                        </span>
                        <span className="text-[10px] text-gray-400 group-hover:text-blue-500 shrink-0">
                          Open &rarr;
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
