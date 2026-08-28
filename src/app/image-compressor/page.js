import ImageCompressor from "@/components/ImageCompressor";

export const metadata = {
  title: "Image Compressor Online | Reduce Photo Size to Any KB — DesiPDF",
  description:
    "Compress any image to exact KB size (10KB, 20KB, 50KB, 100KB, 200KB). Perfect for government exam applications and portal uploads. 100% free.",
};

export default function ImageCompressorPage() {
  return (
    <div className="pt-16 pb-24 relative flex-grow flex flex-col items-center">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      <div className="absolute inset-0 -z-10 h-[60vh] w-full bg-transparent bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:16px_16px]">
        <div className="absolute top-0 right-1/4 -z-10 w-[600px] h-[600px] bg-emerald-100/50 dark:bg-emerald-900/20 rounded-full blur-3xl opacity-50 -translate-y-1/3"></div>
      </div>
      <div className="max-w-5xl w-full mx-auto px-4 relative z-10">
        <ImageCompressor />
      </div>
    </div>
  );
}
