import PdfMerger from "@/components/PdfMerger";

export const metadata = {
  title: "Merge PDF Online - Combine Multiple PDFs for Free | DesiPDF",
  description: "Merge and combine multiple PDF files into one instantly. 100% Free, secure, and processes entirely on your device with no uploads.",
};

export default function MergePage() {
  return (
    <div className="pt-16 pb-24 text-center px-4 relative flex-grow flex flex-col items-center min-h-[80vh]">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      
      {/* Background Mesh */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-transparent bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:16px_16px]">
        <div className="absolute top-0 right-0 -z-10 w-[600px] h-[600px] bg-indigo-100/50 dark:bg-indigo-900/20 rounded-full blur-3xl opacity-50 mix-blend-multiply dark:mix-blend-normal translate-x-1/3 -translate-y-1/3"></div>
      </div>

      <div className="max-w-3xl mx-auto mb-10 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-4">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-blue-500">Merge</span> PDF
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 font-medium">
          Combine multiple PDFs into a single document instantly. Total privacy, no server uploads required.
        </p>
      </div>

      <div className="max-w-4xl w-full mx-auto relative z-10">
        <PdfMerger />
      </div>
    </div>
  );
}
