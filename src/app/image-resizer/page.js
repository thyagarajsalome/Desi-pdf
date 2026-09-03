import ImageResizer from "@/components/ImageResizer";

export const metadata = {
  title: "Image Resizer | Resize Photos for SSC, UPSC, Bank Exams in Exact Pixels",
  description: "Free tool to resize your passport photos and signatures to exact pixel dimensions (e.g. 132x170 px) required for Indian government, SSC, UPSC, and Bank exams.",
};

export default function ImageResizerPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black pt-20 pb-16 px-4">
      <div className="max-w-4xl mx-auto text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-4">
          Exact Pixel <span className="text-amber-600 dark:text-amber-500">Image Resizer</span>
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Resize your photos and signatures to exact width and height in pixels for Sarkari forms and exams.
        </p>
      </div>
      <ImageResizer />
    </div>
  );
}
