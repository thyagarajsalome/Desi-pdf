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

// Next.js static generation (SSG) revalidation time (e.g., 24 hours)
export const revalidate = 86400;

export async function generateStaticParams() {
  const { data: pages } = await supabase.from('seo_pages').select('slug');
  return pages?.map((page) => ({ slug: page.slug })) || [];
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const { data: page } = await supabase
    .from('seo_pages')
    .select('meta_title, meta_description')
    .eq('slug', slug)
    .single();

  if (!page) return { title: "Not Found" };

  return {
    title: page.meta_title,
    description: page.meta_description,
  };
}

export default async function PseoToolPage({ params }) {
  const { slug } = await params;
  const { data: pageData } = await supabase
    .from('seo_pages')
    .select('*')
    .eq('slug', slug)
    .single();
  
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
  }[pageData.tool_target];

  return (
    <div className="pt-16 pb-24 relative flex-grow flex flex-col items-center">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      
      {/* Background Mesh */}
      <div className="absolute inset-0 -z-10 h-[60vh] w-full bg-transparent bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:16px_16px]">
        <div className="absolute top-0 right-1/4 -z-10 w-[600px] h-[600px] bg-blue-100/50 dark:bg-blue-900/20 rounded-full blur-3xl opacity-50 -translate-y-1/3"></div>
      </div>

      {/* SEO Hero Section */}
      <div className="max-w-4xl mx-auto px-4 text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-4 leading-tight">
          {pageData.h1_title}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 font-medium max-w-2xl mx-auto">
          {pageData.hero_subtitle}
        </p>
      </div>

      {/* The Actual Interactive Tool */}
      <div className="max-w-5xl w-full mx-auto px-4 relative z-10 mb-20">
        {ToolComponent ? <ToolComponent /> : <div className="text-center p-10 text-red-500">Tool component not found.</div>}
      </div>

      {/* SEO Content & Article Section (The "Meat" for Google) */}
      <div className="max-w-4xl w-full mx-auto px-4">
        
        {/* Context Paragraph */}
        <div className="bg-white dark:bg-[#09090b] rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 dark:border-gray-800 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Why use our {pageData.h1_title}?</h2>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg mb-8">
            {pageData.context_paragraph}
          </p>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">How to use this tool:</h2>
          <div className="space-y-4">
            {(typeof pageData.how_to === 'string' ? JSON.parse(pageData.how_to) : pageData.how_to).map((step, idx) => (
              <div key={idx} className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                  {idx + 1}
                </div>
                <p className="text-gray-700 dark:text-gray-300 pt-1">{step}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQs */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">Frequently Asked Questions</h2>
        </div>
        
        <div className="space-y-6">
          {(typeof pageData.faqs === 'string' ? JSON.parse(pageData.faqs) : pageData.faqs).map((faq, idx) => (
            <div key={idx} className="bg-white dark:bg-[#09090b] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 hover:shadow-md transition">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-start gap-3">
                <i className="fa-solid fa-circle-question text-blue-500 mt-1"></i> {faq.q}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed pl-8">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
        {/* Related Tools Inter-Linking Section */}
        {(() => {
          const relatedMap = {
            "ssc-photo": [
              { title: "Signature Maker", desc: "Draw or type exam signature", route: "/signature-maker", icon: "fa-signature" },
              { title: "Image Compressor", desc: "Compress image to exact KB", route: "/image-compressor", icon: "fa-compress" },
              { title: "Exam Photo Maker", desc: "Add Name & Date strip", route: "/passport-maker", icon: "fa-camera-retro" },
            ],
            "passport-maker": [
              { title: "SSC Photo Resizer", desc: "Resize to 132x170 px", route: "/tool/ssc-photo-size-132x170-pixel", icon: "fa-crop" },
              { title: "Background Remover", desc: "Change photo to white background", route: "/background-remover", icon: "fa-wand-magic-sparkles" },
              { title: "Image Compressor", desc: "Compress to 20KB - 50KB", route: "/image-compressor", icon: "fa-compress" },
            ],
            "id-card-merger": [
              { title: "Aadhaar PDF Unlocker", desc: "Remove PDF password", route: "/aadhaar-unlock", icon: "fa-unlock-keyhole" },
              { title: "PDF Compressor", desc: "Reduce PDF size under 1MB", route: "/compress", icon: "fa-file-zipper" },
              { title: "PDF to JPG", desc: "Convert PDF pages into images", route: "/pdf-to-jpg", icon: "fa-file-image" },
            ],
            "aadhaar-unlock": [
              { title: "Aadhaar/PAN Merger", desc: "Merge front & back on A4 PDF", route: "/id-card-merger", icon: "fa-id-card" },
              { title: "PDF Compressor", desc: "Shrink document size for portals", route: "/compress", icon: "fa-file-zipper" },
              { title: "Merge PDFs", desc: "Combine multiple docs into one", route: "/merge", icon: "fa-layer-group" },
            ],
            "image-resizer": [
              { title: "Image Compressor", desc: "Compress to 20KB or 50KB", route: "/image-compressor", icon: "fa-compress" },
              { title: "Signature Maker", desc: "Create 140x60 bank signature", route: "/signature-maker", icon: "fa-signature" },
              { title: "Background Remover", desc: "Make background white or transparent", route: "/background-remover", icon: "fa-wand-magic-sparkles" },
            ],
            "background-remover": [
              { title: "Image Resizer", desc: "Set exact passport pixels", route: "/image-resizer", icon: "fa-crop-simple" },
              { title: "Exam Photo Maker", desc: "Add Name & Date stamp", route: "/passport-maker", icon: "fa-camera-retro" },
              { title: "JPG to WEBP", desc: "Convert to modern web format", route: "/jpg-to-webp", icon: "fa-file-image" },
            ],
            "signature-maker": [
              { title: "Image Resizer", desc: "Resize signature to 140x60 px", route: "/image-resizer", icon: "fa-crop-simple" },
              { title: "Thumb Impression", desc: "Enhance ink impression scan", route: "/thumb-impression", icon: "fa-fingerprint" },
              { title: "Image to PDF", desc: "Combine signs & IDs to PDF", route: "/image-to-pdf", icon: "fa-images" },
            ],
          };

          const defaultRelated = [
            { title: "Image Compressor", desc: "Reduce image file size", route: "/image-compressor", icon: "fa-compress" },
            { title: "PDF Merger", desc: "Combine documents into one PDF", route: "/merge", icon: "fa-layer-group" },
            { title: "Aadhaar/PAN Merger", desc: "Front & back onto single A4", route: "/id-card-merger", icon: "fa-id-card" },
          ];

          const items = relatedMap[pageData.tool_target] || defaultRelated;

          return (
            <div className="mt-16 pt-12 border-t border-gray-200 dark:border-gray-800">
              <div className="text-center mb-8">
                <span className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full">
                  Recommended For You
                </span>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-3">
                  Other Helpful Tools for Indian Forms
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {items.map((item, i) => (
                  <Link
                    key={i}
                    href={item.route}
                    className="p-5 rounded-2xl bg-white dark:bg-[#09090b] border border-gray-200 dark:border-gray-800 hover:border-blue-500 dark:hover:border-blue-500 shadow-sm hover:shadow-md transition-all group flex flex-col items-start"
                  >
                    <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <i className={`fa-solid ${item.icon}`}></i>
                    </div>
                    <h4 className="font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {item.desc}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          );
        })()}

      </div>
    </div>
  );
}
