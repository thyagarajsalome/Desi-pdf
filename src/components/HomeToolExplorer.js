"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

const CATEGORIES = [
  {
    id: "govt",
    title: "Govt Exams & Forms 🇮🇳",
    shortTitle: "Govt Exams",
    icon: "fa-graduation-cap",
    color: "emerald",
    badge: "Popular",
    description:
      "Dedicated resizing, photo strip, and bio-data tools for SSC, UPSC, Railway, and State Exam portals.",
    tools: [
      {
        id: "biodata-maker",
        title: "Sarkari Bio-Data Maker",
        desc: "1-Page Job & Matrimonial PDF in 60s",
        icon: "fa-file-lines",
        route: "/biodata-maker",
        badge: "New",
        featured: true,
        keywords: ["resume", "cv", "job", "marriage", "shaadi", "sarkari", "biodata", "biodata format", "pdf maker"],
      },
      {
        id: "railway-form",
        title: "Railway Reservation Slip",
        desc: "Official PRS Counter Ticket Form A4 PDF",
        icon: "fa-train",
        route: "/railway-reservation-form",
        badge: "IRCTC / PRS",
        featured: true,
        keywords: ["railway", "train", "reservation", "cancellation", "prs", "counter", "tatkal", "ticket", "form", "irctc"],
      },
      {
        id: "ssc-photo",
        title: "SSC & IBPS Photo Resizer",
        desc: "Exact 132x170 px & 20-50KB photo & sign",
        icon: "fa-crop",
        route: "/ssc-photo-compressor",
        badge: "20-50 KB",
        featured: true,
        keywords: ["ssc", "ibps", "cgl", "chsl", "gd", "mts", "photo", "signature", "compress", "resize"],
      },
      {
        id: "passport-maker",
        title: "SSC / NEET Photo Maker",
        desc: "Add Candidate Name & Date strip",
        icon: "fa-camera-retro",
        route: "/passport-maker",
        badge: "Name + Date",
        featured: false,
        keywords: ["neet", "ssc", "date", "name", "postcard", "upsc", "passport", "photo with date"],
      },
      {
        id: "id-card-merger",
        title: "Aadhaar / PAN Merger",
        desc: "Front & Back combined on single A4 PDF",
        icon: "fa-id-card",
        route: "/id-card-merger",
        badge: "Print Ready",
        featured: true,
        keywords: ["aadhaar", "pan", "both sides", "front back", "a4", "print", "id merge"],
      },
      {
        id: "thumb-impression",
        title: "Thumb Impression Tool",
        desc: "Enhance left thumb scan to 10-20KB",
        icon: "fa-fingerprint",
        route: "/thumb-impression",
        badge: "10-20 KB",
        featured: false,
        keywords: ["thumb", "impression", "biometric", "angutha", "left thumb"],
      },
      {
        id: "age-calculator",
        title: "Exam Age Calculator",
        desc: "Check SSC, UPSC, IBPS age eligibility",
        icon: "fa-calculator",
        route: "/age-calculator",
        badge: "Cutoff",
        featured: false,
        keywords: ["age", "calculator", "eligibility", "ssc", "upsc", "dob", "birth date"],
      },
    ],
  },
  {
    id: "id-utils",
    title: "Official ID Utilities",
    shortTitle: "ID Utilities",
    icon: "fa-id-badge",
    color: "indigo",
    description:
      "Fast, client-side tools for government ID cards, bank statements, and certificates.",
    tools: [
      {
        id: "aadhaar-unlock",
        title: "Aadhaar Password Remover",
        desc: "Permanently unlock e-Aadhaar PDF",
        icon: "fa-unlock-keyhole",
        route: "/aadhaar-unlock",
        badge: "100% Private",
        featured: true,
        keywords: ["aadhaar", "password", "unlock", "remove", "eaadhaar", "bank statement", "uidai"],
      },
      {
        id: "pan-merge",
        title: "PAN Card Dono Side",
        desc: "Merge both sides on single page",
        icon: "fa-address-card",
        route: "/pan-merge",
        badge: "Fast",
        featured: false,
        keywords: ["pan", "card", "merge", "front", "back", "nsdl", "uti", "pan print"],
      },
      {
        id: "voter-id",
        title: "Voter ID Format",
        desc: "Convert EPIC card to 100KB PDF",
        icon: "fa-box-archive",
        route: "/voter-id-pdf",
        badge: "100 KB",
        featured: false,
        keywords: ["voter", "epic", "election", "eci", "voter card"],
      },
    ],
  },
  {
    id: "pdf",
    title: "PDF Tools",
    shortTitle: "PDF Tools",
    icon: "fa-file-pdf",
    color: "blue",
    description:
      "Essential PDF utilities that run completely in your browser without server uploads.",
    tools: [
      {
        id: "merge",
        title: "Merge PDF",
        desc: "Combine multiple files in custom order",
        icon: "fa-object-group",
        route: "/merge",
        badge: "Multi-file",
        featured: false,
        keywords: ["merge", "combine", "join", "pdf", "multiple pdf"],
      },
      {
        id: "compress",
        title: "Compress PDF",
        desc: "Reduce file size below 100KB / 200KB",
        icon: "fa-minimize",
        route: "/compress",
        badge: "Low KB",
        featured: false,
        keywords: ["compress", "reduce", "size", "shrink", "pdf compress"],
      },
      {
        id: "pdf-to-jpg",
        title: "PDF to JPG",
        desc: "Extract high quality images from PDF",
        icon: "fa-image",
        route: "/pdf-to-jpg",
        featured: false,
        keywords: ["pdf to jpg", "extract", "images", "convert", "jpeg"],
      },
      {
        id: "split",
        title: "Split PDF",
        desc: "Extract specific pages or page ranges",
        icon: "fa-scissors",
        route: "/split",
        featured: false,
        keywords: ["split", "extract", "pages", "separate", "cut pdf"],
      },
    ],
  },
  {
    id: "image",
    title: "Image Tools",
    shortTitle: "Image Tools",
    icon: "fa-wand-magic-sparkles",
    color: "amber",
    description:
      "Compress, resize, remove background, and convert photos without quality loss.",
    tools: [
      {
        id: "image-to-pdf",
        title: "Image to PDF",
        desc: "Convert JPG/PNG photos to clean PDF",
        icon: "fa-file-image",
        route: "/image-to-pdf",
        badge: "A4 / Multi",
        featured: false,
        keywords: ["image to pdf", "jpg to pdf", "png to pdf", "photo to pdf"],
      },
      {
        id: "image-compressor",
        title: "Image Compressor",
        desc: "Target exact KB size (20KB, 50KB, 100KB)",
        icon: "fa-compress",
        route: "/image-compressor",
        badge: "Exact KB",
        featured: false,
        keywords: ["compress image", "kb", "resize size", "image size", "reduce mb to kb"],
      },
      {
        id: "image-resizer",
        title: "Exact Image Resizer",
        desc: "Resize exact px/cm with aspect lock",
        icon: "fa-expand",
        route: "/image-resizer",
        badge: "Pixels / CM",
        featured: false,
        keywords: ["resize", "dimensions", "pixels", "cm", "aspect ratio"],
      },
      {
        id: "background-remover",
        title: "Background Remover",
        desc: "AI background removal locally on device",
        icon: "fa-wand-magic-sparkles",
        route: "/background-remover",
        badge: "AI Powered",
        featured: false,
        keywords: ["background", "remove", "transparent", "white bg", "passport bg"],
      },
      {
        id: "signature-maker",
        title: "Signature Maker",
        desc: "Draw or Type official cursive E-Sign",
        icon: "fa-pen-nib",
        route: "/signature-maker",
        badge: "Draw / Type",
        featured: false,
        keywords: ["signature", "sign", "draw", "e-sign", "hasthakshar", "digital sign"],
      },
      {
        id: "jpg-to-webp",
        title: "JPG to WEBP",
        desc: "Convert images to lightweight modern WEBP",
        icon: "fa-file-export",
        route: "/jpg-to-webp",
        featured: false,
        keywords: ["webp", "jpg to webp", "convert", "compress webp"],
      },
      {
        id: "image-to-svg",
        title: "Image to Vector (SVG)",
        desc: "Trace PNG, JPG & WEBP into scalable SVG vector paths",
        icon: "fa-bezier-curve",
        route: "/image-to-svg",
        badge: "Vectorize",
        featured: true,
        keywords: ["svg", "vector", "png to svg", "vectorizer", "trace", "image to svg", "convert vector", "bitmap to svg"],
      },
    ],
  },
];

const SEARCH_SUGGESTIONS = [
  { label: "Railway Reservation Slip", query: "railway" },
  { label: "Sarkari Bio-Data", query: "biodata" },
  { label: "Aadhaar Password", query: "aadhaar" },
  { label: "SSC Photo 20-50KB", query: "ssc" },
  { label: "Merge Front & Back", query: "merge" },
  { label: "Compress Image", query: "compress" },
];

const getColorClasses = (color) => {
  const maps = {
    blue: "from-blue-50/50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/20 text-blue-600 dark:text-blue-400 border-blue-200/60 dark:border-blue-800/60 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-[0_10px_25px_rgba(37,99,235,0.12)]",
    amber: "from-amber-50/50 to-amber-100/50 dark:from-amber-900/20 dark:to-amber-800/20 text-amber-600 dark:text-amber-400 border-amber-200/60 dark:border-amber-800/60 hover:border-amber-500 dark:hover:border-amber-500 hover:shadow-[0_10px_25px_rgba(245,158,11,0.12)]",
    emerald: "from-emerald-50/50 to-emerald-100/50 dark:from-emerald-900/20 dark:to-emerald-800/20 text-emerald-600 dark:text-emerald-400 border-emerald-200/60 dark:border-emerald-800/60 hover:border-emerald-500 dark:hover:border-emerald-500 hover:shadow-[0_10px_25px_rgba(16,185,129,0.12)]",
    indigo: "from-indigo-50/50 to-indigo-100/50 dark:from-indigo-900/20 dark:to-indigo-800/20 text-indigo-600 dark:text-indigo-400 border-indigo-200/60 dark:border-indigo-800/60 hover:border-indigo-500 dark:hover:border-indigo-500 hover:shadow-[0_10px_25px_rgba(79,70,229,0.12)]",
  };
  return maps[color] || maps.blue;
};

const getIconBg = (color) => {
  const maps = {
    blue: "bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400",
    amber: "bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400",
    emerald: "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400",
    indigo: "bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400",
  };
  return maps[color] || maps.blue;
};

export default function HomeToolExplorer() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const allTools = useMemo(() => {
    return CATEGORIES.flatMap((cat) =>
      cat.tools.map((tool) => ({
        ...tool,
        categoryTitle: cat.title,
        categoryColor: cat.color,
        categoryId: cat.id,
      }))
    );
  }, []);

  const filteredSearchTools = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const q = searchQuery.toLowerCase().trim();
    return allTools.filter(
      (tool) =>
        tool.title.toLowerCase().includes(q) ||
        tool.desc.toLowerCase().includes(q) ||
        tool.categoryTitle.toLowerCase().includes(q) ||
        tool.keywords?.some((k) => k.toLowerCase().includes(q))
    );
  }, [searchQuery, allTools]);

  const featuredTools = useMemo(() => allTools.filter((t) => t.featured), [allTools]);

  const getActiveTabClass = (tabId) => {
    if (activeCategory !== tabId) {
      return "bg-white dark:bg-[#121217] text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-800 hover:border-gray-400 dark:hover:border-gray-700 hover:text-gray-900 dark:hover:text-white";
    }
    const activeStyles = {
      all: "bg-gray-900 text-white dark:bg-white dark:text-gray-900 border-gray-900 dark:border-white shadow-md",
      govt: "bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-500/20",
      "id-utils": "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/20",
      pdf: "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20",
      image: "bg-amber-600 text-white border-amber-600 shadow-md shadow-amber-500/20",
    };
    return activeStyles[tabId] || activeStyles.all;
  };

  return (
    <>
      {/* Interactive Live Search Bar */}
      <div className="max-w-2xl mx-auto px-4 mb-10">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-gray-400 dark:text-gray-500 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition">
            <i className="fa-solid fa-magnifying-glass text-lg"></i>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white dark:bg-[#0d0d12] border-2 border-gray-200 dark:border-gray-800 focus:border-blue-500 dark:focus:border-blue-500 rounded-2xl py-4 sm:py-5 pl-13 pr-12 text-base sm:text-lg font-medium text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 outline-none transition shadow-sm focus:shadow-[0_8px_30px_rgba(37,99,235,0.12)]"
            placeholder="Search tools... (e.g. 'Aadhaar', 'Bio-Data', 'SSC Photo', 'Compress')"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition"
              title="Clear search"
            >
              <i className="fa-solid fa-circle-xmark text-lg"></i>
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs">
          <span className="text-gray-400 font-medium">Quick find:</span>
          {SEARCH_SUGGESTIONS.map((item, i) => (
            <button
              key={i}
              onClick={() => setSearchQuery(item.query)}
              className="px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-800/70 hover:bg-blue-50 dark:hover:bg-blue-900/40 hover:text-blue-600 dark:hover:text-blue-400 text-gray-600 dark:text-gray-400 border border-gray-200/60 dark:border-gray-700/60 transition"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Category Pills Bar */}
      {!filteredSearchTools && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <div className="flex items-center justify-start sm:justify-center overflow-x-auto no-scrollbar py-2 gap-2 sm:gap-3">
            <button
              onClick={() => setActiveCategory("all")}
              className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold border whitespace-nowrap transition-all duration-200 ${getActiveTabClass("all")}`}
            >
              <i className="fa-solid fa-grip"></i>
              <span>All Tools</span>
              <span className="ml-1 text-[11px] px-1.5 py-0.5 rounded-full bg-black/10 dark:bg-white/10 font-semibold">
                {allTools.length}
              </span>
            </button>

            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold border whitespace-nowrap transition-all duration-200 ${getActiveTabClass(cat.id)}`}
              >
                <i className={`fa-solid ${cat.icon}`}></i>
                <span>{cat.shortTitle || cat.title}</span>
                <span className="ml-1 text-[11px] px-1.5 py-0.5 rounded-full bg-black/10 dark:bg-white/10 font-semibold">
                  {cat.tools.length}
                </span>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Main Tools Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {filteredSearchTools && (
          <div className="mb-16">
            <div className="flex items-center justify-between mb-6 border-b border-gray-200 dark:border-gray-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <i className="fa-solid fa-magnifying-glass"></i>
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                    Search Results ({filteredSearchTools.length})
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                    Matching &quot;{searchQuery}&quot;
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSearchQuery("")}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
              >
                Clear Search
              </button>
            </div>

            {filteredSearchTools.length === 0 ? (
              <div className="text-center py-16 bg-white dark:bg-[#0d0d12] border border-gray-200 dark:border-gray-800 rounded-3xl p-8">
                <div className="h-16 w-16 mx-auto rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400 text-2xl mb-4">
                  <i className="fa-solid fa-file-circle-question"></i>
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  No matching tools found
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
                  We couldn&apos;t find any tool matching &quot;{searchQuery}&quot;. Try searching for &quot;Aadhaar&quot;, &quot;Bio-Data&quot;, &quot;SSC&quot;, or &quot;Compress&quot;.
                </p>
                <button
                  onClick={() => setSearchQuery("")}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition"
                >
                  View All Tools
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
                {filteredSearchTools.map((tool) => (
                  <Link
                    key={tool.id}
                    href={tool.route}
                    className={`group block w-full bg-white dark:bg-[#0d0d12] border-2 rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 ${getColorClasses(tool.categoryColor)}`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className={`h-12 w-12 rounded-xl flex items-center justify-center text-xl transition-colors duration-300 ${getIconBg(tool.categoryColor)}`}>
                        <i className={`fa-solid ${tool.icon}`}></i>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {tool.badge && (
                          <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                            {tool.badge}
                          </span>
                        )}
                        <div className="text-gray-300 dark:text-gray-700 group-hover:text-current transition-colors">
                          <i className="fa-solid fa-arrow-right -rotate-45 text-sm"></i>
                        </div>
                      </div>
                    </div>
                    <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-1 group-hover:text-current transition-colors">
                      {tool.title}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium line-clamp-2">
                      {tool.desc}
                    </p>
                    <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800/60 flex items-center justify-between text-[11px] text-gray-400">
                      <span>{tool.categoryTitle}</span>
                      <span className="text-blue-600 dark:text-blue-400 font-semibold group-hover:underline">
                        Open Tool &rarr;
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {!filteredSearchTools && activeCategory === "all" && (
          <div className="space-y-12 sm:space-y-16">
            <div className="bg-gradient-to-br from-amber-500/5 via-blue-500/5 to-purple-500/5 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-1">
                    <i className="fa-solid fa-bolt text-amber-500"></i>
                    <span>Top Indian Aspirant Utilities</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white">
                    Most Popular Quick Access
                  </h2>
                </div>
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  Instant processing &bull; 0 Wait time
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {featuredTools.map((tool) => (
                  <Link
                    key={tool.id}
                    href={tool.route}
                    className={`group relative block bg-white dark:bg-[#0d0d12] border-2 rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg ${getColorClasses(tool.categoryColor)}`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className={`h-12 w-12 rounded-xl flex items-center justify-center text-xl ${getIconBg(tool.categoryColor)}`}>
                        <i className={`fa-solid ${tool.icon}`}></i>
                      </div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                        {tool.badge || "Featured"}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-1.5 group-hover:text-current transition-colors">
                      {tool.title}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                      {tool.desc}
                    </p>
                    <div className="mt-4 flex items-center justify-between text-xs font-bold text-blue-600 dark:text-blue-400">
                      <span>Launch</span>
                      <i className="fa-solid fa-arrow-right -rotate-45 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"></i>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {CATEGORIES.map((cat) => (
              <div key={cat.id} className="relative">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 border-b border-gray-200 dark:border-gray-800 pb-4">
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center text-lg ${getIconBg(cat.color)}`}>
                      <i className={`fa-solid ${cat.icon}`}></i>
                    </div>
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                        {cat.title}
                      </h2>
                      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                        {cat.description}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveCategory(cat.id)}
                    className="self-start sm:self-auto text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                  >
                    <span>View only {cat.shortTitle}</span>
                    <i className="fa-solid fa-arrow-right text-[10px]"></i>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
                  {cat.tools.map((tool) => (
                    <Link
                      key={tool.id}
                      href={tool.route}
                      className={`group block w-full bg-white dark:bg-[#0d0d12] border-2 rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 ${getColorClasses(cat.color)}`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className={`h-11 w-11 rounded-xl flex items-center justify-center text-lg transition-colors duration-300 ${getIconBg(cat.color)}`}>
                          <i className={`fa-solid ${tool.icon}`}></i>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {tool.badge && (
                            <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
                              {tool.badge}
                            </span>
                          )}
                          <div className="text-gray-300 dark:text-gray-700 group-hover:text-current transition-colors">
                            <i className="fa-solid fa-arrow-right -rotate-45 text-sm"></i>
                          </div>
                        </div>
                      </div>
                      <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-1 group-hover:text-current transition-colors">
                        {tool.title}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                        {tool.desc}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {!filteredSearchTools && activeCategory !== "all" && (
          <div>
            {(() => {
              const currentCat = CATEGORIES.find((c) => c.id === activeCategory);
              if (!currentCat) return null;
              return (
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 bg-gray-50 dark:bg-[#0d0d12] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 sm:p-8">
                    <div className="flex items-center gap-4">
                      <div className={`h-14 w-14 rounded-2xl flex items-center justify-center text-2xl ${getIconBg(currentCat.color)}`}>
                        <i className={`fa-solid ${currentCat.icon}`}></i>
                      </div>
                      <div>
                        <span className="text-xs font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                          Category View &bull; {currentCat.tools.length} Tools
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white mt-0.5">
                          {currentCat.title}
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 max-w-xl">
                          {currentCat.description}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveCategory("all")}
                      className="self-start sm:self-auto px-4 py-2 rounded-xl bg-white dark:bg-[#16161c] hover:bg-gray-100 dark:hover:bg-gray-800 text-xs font-bold text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 transition"
                    >
                      <i className="fa-solid fa-arrow-left mr-1.5"></i>
                      Show All Categories
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                    {currentCat.tools.map((tool) => (
                      <Link
                        key={tool.id}
                        href={tool.route}
                        className={`group block w-full bg-white dark:bg-[#0d0d12] border-2 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 ${getColorClasses(currentCat.color)}`}
                      >
                        <div className="flex items-start justify-between mb-5">
                          <div className={`h-12 w-12 rounded-xl flex items-center justify-center text-xl transition-colors duration-300 ${getIconBg(currentCat.color)}`}>
                            <i className={`fa-solid ${tool.icon}`}></i>
                          </div>
                          <div className="flex items-center gap-1.5">
                            {tool.badge && (
                              <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                                {tool.badge}
                              </span>
                            )}
                            <div className="text-gray-300 dark:text-gray-700 group-hover:text-current transition-colors">
                              <i className="fa-solid fa-arrow-right -rotate-45 text-sm"></i>
                            </div>
                          </div>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1.5 group-hover:text-current transition-colors">
                          {tool.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium">
                          {tool.desc}
                        </p>
                        <div className="mt-5 pt-4 border-t border-gray-100 dark:border-gray-800/60 flex items-center justify-between text-xs font-semibold text-blue-600 dark:text-blue-400">
                          <span>Use Tool</span>
                          <i className="fa-solid fa-arrow-right -rotate-45"></i>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </div>
    </>
  );
}
