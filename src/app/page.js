import Link from "next/link";
import HomeToolExplorer from "@/components/HomeToolExplorer";

export const metadata = {
  alternates: {
    canonical: "https://www.convertpdftojpg.in",
  },
};

export default function Home() {
  const popularLinks = [
    { label: "Railway Reservation Slip", url: "/railway-reservation-form" },
    { label: "रेलवे फॉर्म कैसे भरें PDF", url: "/tool/railway-reservation-form-kaise-bhare-hindi" },
    { label: "Railway Cancellation Slip", url: "/tool/railway-ticket-cancellation-form-pdf" },
    { label: "Tatkal Form PDF Maker", url: "/tool/tatkal-reservation-form-pdf-download" },
    { label: "नौकरी बायोडाटा फॉर्मेट", url: "/tool/naukri-ke-liye-biodata-format-hindi-pdf" },
    { label: "विवाह बायोडाटा फॉर्मेट", url: "/tool/shaadi-ke-liye-biodata-format-in-hindi-pdf" },
    { label: "Bulk JPG to WEBP", url: "/tool/bulk-jpg-to-webp-converter-online" },
    { label: "फोटो WEBP में बदलें", url: "/tool/photo-ko-webp-me-kaise-badle-hindi" },
    { label: "SSC CGL Photo & Sign", url: "/tool/ssc-cgl-photo-signature-resize-online" },
    { label: "SSC CHSL Photo Resizer", url: "/tool/ssc-chsl-photo-and-signature-resizer" },
    { label: "SSC GD Constable Size", url: "/tool/ssc-gd-constable-photo-size-resizer" },
    { label: "SSC MTS Photo 20-50KB", url: "/tool/ssc-mts-photo-resizer-online" },
    { label: "RRB NTPC Photo 320x240", url: "/tool/rrb-ntpc-photo-and-signature-resizer" },
    { label: "RRB ALP Document Tool", url: "/tool/rrb-alp-technician-photo-resizer" },
    { label: "IBPS PO/Clerk Resizer", url: "/tool/ibps-po-clerk-photo-signature-resizer" },
    { label: "SBI PO/Clerk Sign Crop", url: "/tool/sbi-po-clerk-photo-signature-resizer" },
    { label: "UP Police Photo Format", url: "/tool/up-police-constable-photo-signature-resizer" },
    { label: "UPSC NDA/CDS 350x350", url: "/tool/nda-cds-upsc-photo-resizer" },
    { label: "CTET Photo Resizer 2026", url: "/tool/ctet-photo-and-signature-resizer" },
    { label: "JEE Main NTA Format", url: "/tool/jee-main-photo-and-signature-resizer" },
    { label: "Aadhaar Front & Back PDF", url: "/tool/aadhaar-card-front-and-back-pdf-maker" },
    { label: "PAN Card Dono Side PDF", url: "/tool/pan-card-dono-side-ek-page-par-print" },
    { label: "e-Aadhaar Password Remover", url: "/tool/eaadhaar-pdf-password-remover-online" },
    { label: "Bank Statement Unlocker", url: "/tool/sbi-hdfc-bank-statement-password-unlocker" },
    { label: "Photo Par Name & Date", url: "/tool/photo-par-name-aur-date-kaise-likhe" },
    { label: "SSC CGL Photo with Date", url: "/tool/ssc-chsl-cgl-photo-with-date-maker" },
    { label: "NEET Postcard 4x6 Maker", url: "/tool/neet-ug-postcard-size-photo-generator" },
    { label: "फोटो साइज 20KB कैसे करें", url: "/tool/photo-ka-size-20kb-kaise-kare-hindi" },
    { label: "आधार कार्ड आगे-पीछे PDF", url: "/tool/aadhaar-card-aage-piche-ek-page-par-kare" },
    { label: "PDF का पासवर्ड हटाएं", url: "/tool/pdf-ka-password-kaise-hataye-hindi" },
    { label: "हस्ताक्षर साइज 10-20KB", url: "/tool/signature-ka-size-kaise-kam-kare" },
    { label: "फोटो पर नाम-तारीख लिखें", url: "/tool/photo-par-naam-aur-tarikh-kaise-dale" },
  ];

  return (
    <>
      {/* Background Mesh */}
      <div className="absolute inset-0 -z-10 h-[60vh] w-full bg-transparent bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:16px_16px]">
        <div className="absolute top-0 left-1/2 -z-10 w-[800px] h-[400px] bg-gradient-to-r from-blue-100/50 via-indigo-50/50 to-purple-100/50 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20 rounded-full blur-3xl opacity-50 -translate-x-1/2"></div>
      </div>

      {/* Hero Section (Server-Rendered Instant HTML for LCP) */}
      <section className="pt-20 pb-8 text-center px-4 relative">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold mb-6">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            100% Free &amp; Private &bull; Browser-Based Processing &bull; No Uploads to Cloud
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-5 leading-tight">
            Every PDF &amp; Image Tool, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400">
              Built Specially for India 🇮🇳
            </span>
          </h1>
          <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-medium leading-relaxed">
            From unlocking Aadhaar cards and generating Sarkari bio-data to resizing SSC/UPSC exam photos to exact KB limits.
          </p>
        </div>
      </section>

      {/* Interactive Search & Tool Grid Island */}
      <HomeToolExplorer />

      {/* Popular Sarkari Exam & Quick Tools Directory (Server-Rendered Internal Linking Hub) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-gradient-to-br from-blue-50/70 to-indigo-50/50 dark:from-[#111116] dark:to-[#0c0c10] border border-blue-100 dark:border-gray-800 rounded-3xl p-6 sm:p-10 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div className="max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 bg-blue-100/60 dark:bg-blue-900/40 px-3 py-1 rounded-full">
                Popular Form Tools &amp; Guides
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mt-3">
                Direct Application Tools for Indian Aspirants
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Instant size converters, signature crops, and document unblockers matching official notification specifications.
              </p>
            </div>
            <Link
              href="/tools"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-sm transition shrink-0 self-start sm:self-end"
            >
              <span>Browse All 125+ Tools Directory</span>
              <i className="fa-solid fa-arrow-right text-xs"></i>
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {popularLinks.map((link, idx) => (
              <Link
                key={idx}
                href={link.url}
                className="text-xs sm:text-sm font-medium px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#16161a] hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 border border-gray-200/80 dark:border-gray-800 transition-all text-gray-700 dark:text-gray-300 truncate shadow-2xs hover:shadow-sm"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* SEO FAQ Section (Server-Rendered Static HTML) */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Everything you need to know about our secure PDF &amp; image tools.
          </p>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-[#09090b] border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <i className="fa-solid fa-shield-halved text-blue-500"></i> Is it safe to upload my Aadhaar or PAN card?
            </h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Yes, absolutely. We engineered our tools to process your highly sensitive documents <strong>locally in your web browser</strong>. Your PDF files, Aadhaar passwords, and ID photos are <em>never</em> uploaded to our servers. They stay entirely on your device.
            </p>
          </div>

          <div className="bg-white dark:bg-[#09090b] border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <i className="fa-solid fa-compress text-emerald-500"></i> How do I compress my photo for SSC and UPSC exams?
            </h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Government exam portals (like SSC, IBPS, and UPSC) have strict rules requiring photos and signatures to be between <strong>20KB to 50KB</strong>. Simply use our{" "}
              <Link href="/ssc-photo-compressor" className="text-blue-600 hover:underline">
                SSC Photo Resizer tool
              </Link>
              , upload your photo, and we will automatically crop it to 3.5cm x 4.5cm and compress it to the exact required file size.
            </p>
          </div>

          <div className="bg-white dark:bg-[#09090b] border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <i className="fa-solid fa-unlock-keyhole text-indigo-500"></i> How do I remove the password from my e-Aadhaar?
            </h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              When you download your e-Aadhaar from the UIDAI portal, it is locked with a password (usually the first 4 letters of your name in capitals + your birth year). Use our{" "}
              <Link href="/aadhaar-unlock" className="text-blue-600 hover:underline">
                Aadhaar Unlocker
              </Link>{" "}
              to securely enter the password once, and we will generate a permanently unlocked PDF that you can easily print or share with banks.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
