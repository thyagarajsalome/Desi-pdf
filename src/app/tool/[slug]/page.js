import { supabase } from "@/lib/supabaseClient";
import { notFound } from "next/navigation";
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
import AgeCalculator from "@/components/AgeCalculator";

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
    "voter-id-pdf": VoterIdPdf,
    "thumb-impression": ThumbOptimizer,
    "passport-maker": PassportMaker,
    "pdf-compress": PdfCompressor,
    "pdf-to-jpg": PdfConverter,
    "pdf-merge": PdfMerger,
    "pdf-split": PdfSplitter,
    "image-to-pdf": ImageToPdf,
    "image-compressor": ImageCompressor,
    "age-calculator": AgeCalculator,
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
            {pageData.how_to.map((step, idx) => (
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
          {pageData.faqs.map((faq, idx) => (
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

      </div>
    </div>
  );
}
