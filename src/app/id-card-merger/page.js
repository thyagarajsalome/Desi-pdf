import IdCardMerger from "@/components/IdCardMerger";

export const metadata = {
  title: "Aadhaar & PAN Card Front and Back Merger | A4 PDF Maker",
  description: "Merge the front and back photos of your Aadhaar, PAN, or Voter ID card onto a single A4 size PDF instantly. Free online tool for KYC document uploads.",
};

export default function IdCardMergerPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black pt-20 pb-16 px-4">
      <div className="max-w-4xl mx-auto text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-4">
          ID Card <span className="text-indigo-600 dark:text-indigo-500">PDF Merger</span>
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Upload the front and back of your Aadhaar or PAN card. We will perfectly align them onto a single A4 PDF for easy printing and KYC uploads.
        </p>
      </div>
      <IdCardMerger />
    </div>
  );
}
