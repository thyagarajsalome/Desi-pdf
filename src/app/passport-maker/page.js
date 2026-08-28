import PassportMaker from "@/components/PassportMaker";

export const metadata = {
  title: "Passport Photo Maker Online | DesiPDF",
  description: "Create standard Indian passport size photos (3.5cm x 4.5cm) from your mobile photos. Instantly crops and compresses to 20KB-50KB for govt applications.",
};

export default function PassportMakerPage() {
  return (
    <div className="pt-16 pb-24 text-center px-4 relative flex-grow flex flex-col items-center min-h-[80vh]">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      
      {/* Background Mesh */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-transparent bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:16px_16px]">
        <div className="absolute top-0 right-1/4 -z-10 w-[600px] h-[600px] bg-emerald-100/50 dark:bg-emerald-900/20 rounded-full blur-3xl opacity-50 -translate-y-1/3"></div>
      </div>

      <div className="max-w-3xl mx-auto mb-10 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-4">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-600">Passport</span> Photo Maker
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 font-medium">
          Upload any selfie or portrait. Frame your face using our guides, and we will export a perfect 3.5cm x 4.5cm passport photo compressed to 20-50KB.
        </p>
      </div>

      <div className="max-w-5xl w-full mx-auto relative z-10">
        <PassportMaker />
      </div>
    </div>
  );
}
