import PdfConverter from "@/components/PdfConverter";

export const metadata = {
  title: "Convert PDF to JPG Online - 100% Free & Private | DesiPDF",
  description: "Extract high-quality images from PDF files securely in your browser. No server uploads. Perfect for confidential Indian documents.",
};

export default function PdfToJpgPage() {
  return (
    <div className="pt-16 pb-24 text-center px-4 relative flex-grow flex flex-col items-center min-h-[80vh]">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      
      {/* Background Mesh */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-transparent bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:16px_16px]">
        <div className="absolute top-0 right-0 -z-10 w-[600px] h-[600px] bg-blue-100/50 dark:bg-blue-900/20 rounded-full blur-3xl opacity-50 mix-blend-multiply dark:mix-blend-normal translate-x-1/3 -translate-y-1/3"></div>
      </div>

      <div className="max-w-3xl mx-auto mb-10 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-4">
          PDF to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">JPG/PNG</span>
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 font-medium">
          Extract high-resolution images from your PDF securely. Files are processed locally on your device.
        </p>
      </div>

      <div className="max-w-5xl w-full mx-auto relative z-10">
        <PdfConverter defaultFormat="image/jpeg" />
      </div>
    </div>
  );
}
