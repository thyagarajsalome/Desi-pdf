import PdfSplitter from "@/components/PdfSplitter";

export const metadata = {
  title: "Split PDF Pages - Extract PDF Online | DesiPDF",
  description: "Split and extract specific pages from your PDF file. Visually select the pages you want to keep and generate a new PDF instantly. 100% Free and secure.",
};

export default function SplitPdfPage() {
  return (
    <div className="pt-16 pb-24 text-center px-4 relative flex-grow flex flex-col items-center min-h-[80vh]">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      
      {/* Background Mesh */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-transparent bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:16px_16px]">
        <div className="absolute top-0 right-1/4 -z-10 w-[600px] h-[600px] bg-blue-100/50 dark:bg-blue-900/20 rounded-full blur-3xl opacity-50 -translate-y-1/3"></div>
      </div>

      <div className="max-w-3xl mx-auto mb-10 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-4">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-600">Split</span> PDF
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 font-medium">
          Upload your PDF, visually select the exact pages you want to keep, and instantly extract them into a new file.
        </p>
      </div>

      <div className="max-w-5xl w-full mx-auto relative z-10">
        <PdfSplitter />
      </div>
    </div>
  );
}
