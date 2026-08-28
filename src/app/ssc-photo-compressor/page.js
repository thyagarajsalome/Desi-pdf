import SscPhotoResizer from "@/components/SscPhotoResizer";

export const metadata = {
  title: "SSC & IBPS Photo/Signature Resizer Online | DesiPDF",
  description: "Automatically crop, resize, and compress your photo and signature for SSC, UPSC, and IBPS exam forms. Exact 20KB-50KB limits guaranteed.",
};

export default function SscPhotoPage() {
  return (
    <div className="pt-16 pb-24 text-center px-4 relative flex-grow flex flex-col items-center min-h-[80vh]">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      
      {/* Background Mesh */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-transparent bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:16px_16px]">
        <div className="absolute top-0 right-1/4 -z-10 w-[600px] h-[600px] bg-emerald-100/50 dark:bg-emerald-900/20 rounded-full blur-3xl opacity-50 -translate-y-1/3"></div>
      </div>

      <div className="max-w-3xl mx-auto mb-10 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-4">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-600">SSC & IBPS</span> Resizer
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 font-medium">
          Upload your raw photo. We automatically crop, resize, and compress it to pass strict Govt Exam portal limits (10KB - 50KB).
        </p>
      </div>

      <div className="max-w-4xl w-full mx-auto relative z-10">
        <SscPhotoResizer />
      </div>
    </div>
  );
}
