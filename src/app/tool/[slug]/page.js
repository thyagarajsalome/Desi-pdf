import { supabase } from "@/lib/supabaseClient";
import { notFound } from "next/navigation";
import Link from "next/link";
import SscPhotoResizer from "@/components/SscPhotoResizer";
import AadhaarUnlocker from "@/components/AadhaarUnlocker";
import PanMerger from "@/components/PanMerger";
import VoterIdPdf from "@/components/VoterIdPdf";
import ThumbOptimizer from "@/components/ThumbOptimizer";
import PassportMaker from "@/components/PassportMaker";
import PdfCompressor from "@/components/PdfCompressor";
import PdfConverter from "@/components/PdfConverter";
import PdfMerger from "@/components/PdfMerger";
import PdfSplitter from "@/components/PdfSplitter";
import ImageToPdf from "@/components/ImageToPdf";
import ImageCompressor from "@/components/ImageCompressor";
import ImageResizer from "@/components/ImageResizer";
import BackgroundRemover from "@/components/BackgroundRemover";
import SignatureMaker from "@/components/SignatureMaker";
import AgeCalculator from "@/components/AgeCalculator";
import JpgToWebp from "@/components/JpgToWebp";
import IdCardMerger from "@/components/IdCardMerger";
import BiodataMaker from "@/components/BiodataMaker";
import RailwayFormMaker from "@/components/RailwayFormMaker";
import { TOOL_CATEGORY_META, STANDALONE_TOOLS } from "@/lib/toolCatalog";

// Next.js static generation (SSG) revalidation time (24 hours)
export const revalidate = 86400;

export async function generateStaticParams() {
  const { data: pages } = await supabase.from("seo_pages").select("slug");
  return pages?.map((page) => ({ slug: page.slug })) || [];
}

export async function generateMetadata({ params }) {
  const { slug } = await params;

  const { data: page } = await supabase
    .from("seo_pages")
    .select("meta_title, meta_description, h1_title")
    .eq("slug", slug)
    .maybeSingle();

  if (!page) {
    return {
      title: "Tool Not Found | DesiPDF",
      robots: { index: false, follow: false },
    };
  }

  const canonicalUrl = `https://www.convertpdftojpg.in/tool/${slug}`;

  return {
    title: page.meta_title,
    description: page.meta_description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: page.meta_title,
      description: page.meta_description,
      url: canonicalUrl,
      siteName: "DesiPDF",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: page.meta_title,
      description: page.meta_description,
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
}

export default async function PseoToolPage({ params }) {
  const { slug } = await params;

  const [{ data: pageData }, { data: allSeoPages }] = await Promise.all([
    supabase.from("seo_pages").select("*").eq("slug", slug).maybeSingle(),
    supabase
      .from("seo_pages")
      .select("slug, h1_title, hero_subtitle, tool_target")
      .neq("slug", slug)
      .order("id", { ascending: true }),
  ]);

  if (!pageData) {
    notFound();
  }

  // Map the tool_target from the database to the actual React component
  const ToolComponent = {
    "ssc-photo": SscPhotoResizer,
    "ibps-sign": SscPhotoResizer,
    "aadhaar-unlock": AadhaarUnlocker,
    "pan-merge": PanMerger,
    "id-card-merger": IdCardMerger,
    "voter-id-pdf": VoterIdPdf,
    "thumb-impression": ThumbOptimizer,
    "passport-maker": PassportMaker,
    "pdf-compress": PdfCompressor,
    "pdf-to-jpg": PdfConverter,
    "pdf-merge": PdfMerger,
    "pdf-split": PdfSplitter,
    "image-to-pdf": ImageToPdf,
    "image-compressor": ImageCompressor,
    "image-resizer": ImageResizer,
    "background-remover": BackgroundRemover,
    "signature-maker": SignatureMaker,
    "age-calculator": AgeCalculator,
    "jpg-to-webp": JpgToWebp,
    "biodata-maker": BiodataMaker,
    "railway-form": RailwayFormMaker,
  }[pageData.tool_target];

  const categoryMeta =
    TOOL_CATEGORY_META[pageData.tool_target] ||
    TOOL_CATEGORY_META["image-resizer"];

  const dbFaqs =
    (typeof pageData.faqs === "string"
      ? JSON.parse(pageData.faqs)
      : pageData.faqs) || [];
  const parsedHowTo =
    (typeof pageData.how_to === "string"
      ? JSON.parse(pageData.how_to)
      : pageData.how_to) || [];

  // Ensure every programmatic page has rich FAQ depth (at least 3 FAQs) without duplicating DB entries
  const existingQuestions = new Set(dbFaqs.map((f) => f.q?.toLowerCase().trim()));
  const mergedFaqs = [...dbFaqs];
  if (mergedFaqs.length < 3 && categoryMeta.extraFaqs) {
    for (const extra of categoryMeta.extraFaqs) {
      if (mergedFaqs.length >= 3) break;
      if (!existingQuestions.has(extra.q.toLowerCase().trim())) {
        mergedFaqs.push(extra);
      }
    }
  }

  // Select 6 sibling pSEO tools dynamically (same tool_target first, then same categoryId)
  const others = allSeoPages || [];
  const sameTarget = others.filter((p) => p.tool_target === pageData.tool_target);
  const sameCategory = others.filter((p) => {
    if (p.tool_target === pageData.tool_target) return false;
    return (
      TOOL_CATEGORY_META[p.tool_target]?.categoryId === categoryMeta.categoryId
    );
  });
  const fallbackPool = others.filter(
    (p) =>
      p.tool_target !== pageData.tool_target &&
      TOOL_CATEGORY_META[p.tool_target]?.categoryId !== categoryMeta.categoryId
  );

  // Rotate starting offset deterministically by slug hash so every page distributes links evenly across all 106 slugs
  const hash = slug.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  const rotateSlice = (arr, count) => {
    if (arr.length <= count) return arr;
    const start = hash % arr.length;
    const doubled = [...arr, ...arr];
    return doubled.slice(start, start + count);
  };

  const siblingPages = [
    ...rotateSlice(sameTarget, 4),
    ...rotateSlice(sameCategory, 4),
    ...rotateSlice(fallbackPool, 4),
  ]
    .filter(
      (item, idx, self) =>
        idx === self.findIndex((t) => t.slug === item.slug)
    )
    .slice(0, 6);

  // Core standalone tools in same category
  const relatedCoreTools = STANDALONE_TOOLS.filter(
    (t) =>
      t.categoryId === categoryMeta.categoryId &&
      t.route !== categoryMeta.parentRoute
  ).slice(0, 3);

  const canonicalUrl = `https://www.convertpdftojpg.in/tool/${slug}`;

  // 1. SoftwareApplication Schema
  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: pageData.h1_title || "DesiPDF Online Tool",
    url: canonicalUrl,
    operatingSystem: "All (Web Browser)",
    applicationCategory: "UtilitiesApplication",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "INR",
    },
    description: pageData.meta_description || pageData.hero_subtitle,
  };

  // 2. BreadcrumbList Schema
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
      {
        "@type": "ListItem",
        position: 3,
        name: categoryMeta.categoryLabel,
        item: `https://www.convertpdftojpg.in/tools#${categoryMeta.categoryId}`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: pageData.h1_title,
        item: canonicalUrl,
      },
    ],
  };

  // 3. FAQPage Schema
  const faqSchema =
    mergedFaqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: mergedFaqs.map((faq) => ({
            "@type": "Question",
            name: faq.q,
            acceptedAnswer: {
              "@type": "Answer",
              text: faq.a,
            },
          })),
        }
      : null;

  // 4. HowTo Schema
  const howToSchema =
    parsedHowTo.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "HowTo",
          name: `How to use ${pageData.h1_title}`,
          step: parsedHowTo.map((step, idx) => ({
            "@type": "HowToStep",
            position: idx + 1,
            text: step,
          })),
        }
      : null;

  return (
    <div className="pt-10 pb-24 relative flex-grow flex flex-col items-center">
      {/* Google Rich Structured Data Schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      {howToSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
        />
      )}

      {/* Visible Breadcrumb + SEO Hero Section */}
      <div className="max-w-4xl mx-auto px-4 text-center mb-10">
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center justify-center gap-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 mb-4"
        >
          <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition">
            Home
          </Link>
          <span>/</span>
          <Link href="/tools" className="hover:text-blue-600 dark:hover:text-blue-400 transition">
            All Tools
          </Link>
          <span>/</span>
          <Link
            href={`/tools#${categoryMeta.categoryId}`}
            className="hover:text-blue-600 dark:hover:text-blue-400 transition"
          >
            {categoryMeta.categoryLabel}
          </Link>
          <span>/</span>
          <span className="text-gray-900 dark:text-gray-200 font-semibold truncate max-w-[240px] sm:max-w-none">
            {pageData.h1_title}
          </span>
        </nav>

        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-4 leading-tight">
          {pageData.h1_title}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 font-medium max-w-2xl mx-auto">
          {pageData.hero_subtitle}
        </p>
      </div>

      {/* The Actual Interactive Tool */}
      <div className="max-w-5xl w-full mx-auto px-4 relative z-10 mb-16">
        {ToolComponent ? (
          <ToolComponent />
        ) : (
          <div className="text-center p-10 text-red-500">
            Tool component not found.
          </div>
        )}
      </div>

      {/* Rich Technical SEO Content Section */}
      <div className="max-w-4xl w-full mx-auto px-4 space-y-10">
        {/* Official Format Specifications & Privacy Architecture Card */}
        <div className="bg-white dark:bg-[#09090b] rounded-3xl p-6 md:p-10 shadow-sm border border-gray-200 dark:border-gray-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 pb-4 border-b border-gray-100 dark:border-gray-800">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Technical Specifications &amp; Portal Guidelines
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Standard compliance checklist for {pageData.h1_title}
              </p>
            </div>
            <Link
              href={categoryMeta.parentRoute}
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline shrink-0"
            >
              Main {categoryMeta.parentTitle} &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {categoryMeta.specs.map((spec, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-gray-50 dark:bg-[#121217] border border-gray-100 dark:border-gray-800"
              >
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block">
                  {spec.label}
                </span>
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 mt-1 block">
                  {spec.value}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-5 p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200/70 dark:border-emerald-900/40 flex items-start gap-3 text-xs text-emerald-900 dark:text-emerald-200">
            <i className="fa-solid fa-shield-halved text-emerald-600 dark:text-emerald-400 text-base mt-0.5"></i>
            <p className="leading-relaxed">
              <strong>100% Private Browser Processing:</strong> Unlike cloud websites that upload your personal photos, signatures, or Aadhaar/PAN cards to remote servers, DesiPDF processes everything directly inside your browser memory. Zero data leaves your device.
            </p>
          </div>
        </div>

        {/* Context Paragraph & How-To Steps */}
        <div className="bg-white dark:bg-[#09090b] rounded-3xl p-8 md:p-12 shadow-sm border border-gray-200 dark:border-gray-800">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Why use our {pageData.h1_title}?
          </h2>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-base sm:text-lg mb-8">
            {pageData.context_paragraph}
          </p>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Step-by-Step Instructions:
          </h2>
          <div className="space-y-4">
            {parsedHowTo.map((step, idx) => (
              <div key={idx} className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-sm">
                  {idx + 1}
                </div>
                <p className="text-gray-700 dark:text-gray-300 pt-1 text-sm sm:text-base">
                  {step}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQs */}
        <div>
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {mergedFaqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-[#09090b] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 hover:shadow-sm transition"
              >
                <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-2 flex items-start gap-3">
                  <i className="fa-solid fa-circle-question text-blue-500 mt-1 text-sm"></i>{" "}
                  <span>{faq.q}</span>
                </h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed pl-7">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic Related Sibling Programmatic Pages (Eliminates Orphan Pages) */}
        {siblingPages.length > 0 && (
          <div className="pt-8 border-t border-gray-200 dark:border-gray-800 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">
                  Related Guides &amp; Exam Presets
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  Similar {categoryMeta.categoryLabel} Tools
                </h3>
              </div>
              <Link
                href="/tools"
                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline shrink-0"
              >
                View All 125+ Tools &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {siblingPages.map((sib) => (
                <Link
                  key={sib.slug}
                  href={`/tool/${sib.slug}`}
                  className="p-4 rounded-2xl bg-white dark:bg-[#09090b] border border-gray-200 dark:border-gray-800 hover:border-blue-500 dark:hover:border-blue-500 transition-all group flex flex-col justify-between"
                >
                  <div>
                    <h4 className="font-bold text-sm text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                      {sib.h1_title}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                      {sib.hero_subtitle}
                    </p>
                  </div>
                  <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 mt-3 inline-flex items-center gap-1">
                    Open Tool &rarr;
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Core Standalone Tools Inter-Linking Section */}
        <div className="pt-8 border-t border-gray-200 dark:border-gray-800">
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Other Essential DesiPDF Utilities
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                title: categoryMeta.parentTitle,
                desc: "Open the main full-screen utility",
                route: categoryMeta.parentRoute,
              },
              ...relatedCoreTools.slice(0, 2),
            ].map((item, i) => (
              <Link
                key={i}
                href={item.route}
                className="p-5 rounded-2xl bg-white dark:bg-[#09090b] border border-gray-200 dark:border-gray-800 hover:border-blue-500 dark:hover:border-blue-500 shadow-xs transition-all group flex flex-col items-start"
              >
                <h4 className="font-bold text-sm text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {item.title}
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {item.desc}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
