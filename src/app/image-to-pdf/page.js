import ImageToPdf from "@/components/ImageToPdf";

export const metadata = {
  title: "Image to PDF Converter | Convert JPG, PNG to PDF Free — DesiPDF",
  description:
    "Convert multiple images (JPG, PNG, WEBP) into a single PDF document. Arrange pages, choose size, and download instantly. 100% free, 100% private.",
};

export default function ImageToPdfPage() {
  return (
    <div className="pt-16 pb-24 relative flex-grow flex flex-col items-center">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      <div className="absolute inset-0 -z-10 h-[60vh] w-full bg-transparent bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:16px_16px]">
        <div className="absolute top-0 right-1/4 -z-10 w-[600px] h-[600px] bg-blue-100/50 dark:bg-blue-900/20 rounded-full blur-3xl opacity-50 -translate-y-1/3"></div>
      </div>
      <div className="max-w-5xl w-full mx-auto px-4 relative z-10">
        <ImageToPdf />
      </div>
    </div>
  );
}
