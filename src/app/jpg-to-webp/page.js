import JpgToWebp from "@/components/JpgToWebp";

export const metadata = {
  title: "JPG to WEBP Converter | Free Online Image Format Converter",
  description: "Convert JPG and PNG images to next-gen WEBP format instantly. Reduce file sizes by up to 50% without losing quality for faster websites and sharing.",
};

export default function JpgToWebpPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black pt-20 pb-16 px-4">
      <div className="max-w-4xl mx-auto text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-4">
          Convert <span className="text-amber-600 dark:text-amber-500">JPG to WEBP</span>
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Make your images web-ready with up to 50% smaller file sizes and identical quality. Fast, secure, and fully offline.
        </p>
      </div>

      <JpgToWebp />

      <div className="max-w-4xl mx-auto mt-20 text-left space-y-12">
        <div className="bg-white dark:bg-[#09090b] rounded-3xl p-8 shadow-sm border border-gray-200 dark:border-gray-800">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Why convert to WEBP?</h2>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
            WEBP is a modern image format developed by Google that provides superior lossless and lossy compression for images on the web. 
            Webmasters and web developers can create smaller, richer images that make the web faster.
          </p>
          <ul className="space-y-3 text-gray-600 dark:text-gray-400">
            <li className="flex gap-3"><i className="fa-solid fa-check text-emerald-500 mt-1"></i> <span><strong>Smaller sizes:</strong> WEBP images are ~30% smaller than comparable JPGs.</span></li>
            <li className="flex gap-3"><i className="fa-solid fa-check text-emerald-500 mt-1"></i> <span><strong>Better quality:</strong> Advanced compression means less artifacts and clearer edges.</span></li>
            <li className="flex gap-3"><i className="fa-solid fa-check text-emerald-500 mt-1"></i> <span><strong>Faster loading:</strong> Smaller file sizes lead to significantly faster page load times.</span></li>
            <li className="flex gap-3"><i className="fa-solid fa-check text-emerald-500 mt-1"></i> <span><strong>Alpha transparency:</strong> Unlike JPG, WEBP supports transparent backgrounds (like PNG).</span></li>
          </ul>
        </div>
      </div>
    </div>
  );
}
