import SignatureMaker from "@/components/SignatureMaker";

export const metadata = {
  title: "Online Signature Maker | Draw or Type E-Signatures",
  description: "Create your digital signature online for exam forms, banks, and documents. Draw with your mouse/touch or type in cursive fonts. Download transparent PNG or JPG.",
};

export default function SignatureMakerPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black pt-20 pb-16 px-4">
      <div className="max-w-4xl mx-auto text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-4">
          Online <span className="text-indigo-600 dark:text-indigo-500">Signature Maker</span>
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Draw or type your signature perfectly. Export as transparent PNG or white background JPG for official forms.
        </p>
      </div>
      <SignatureMaker />
    </div>
  );
}
