import BackgroundRemover from "@/components/BackgroundRemover";

export const metadata = {
  title: "AI Background Remover | Remove Image Backgrounds Free",
  description: "Remove the background from any photo instantly using our free offline AI tool. 100% private, runs directly in your browser. Download as transparent PNG.",
};

export default function BackgroundRemoverPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black pt-20 pb-16 px-4">
      <div className="max-w-4xl mx-auto text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-4">
          AI <span className="text-purple-600 dark:text-purple-500">Background Remover</span>
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Make image backgrounds transparent instantly. 100% private — your photos never leave your device.
        </p>
      </div>
      <BackgroundRemover />
    </div>
  );
}
