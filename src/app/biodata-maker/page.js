import BiodataMaker from "@/components/BiodataMaker";

export const metadata = {
  title: "Sarkari Bio-Data & Resume PDF Maker Online (Free)",
  description: "Create official 1-page Indian government job bio-data, resume, or matrimonial format in 2 minutes. Add photo, education table, and download print-ready PDF.",
  alternates: {
    canonical: "https://convertpdftojpg.in/biodata-maker",
  },
};

export default function BiodataMakerPage() {
  return (
    <div className="pt-16 pb-24 relative flex-grow flex flex-col items-center">
      {/* Background Mesh */}
      <div className="absolute inset-0 -z-10 h-[60vh] w-full bg-transparent bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:16px_16px]">
        <div className="absolute top-0 right-1/4 -z-10 w-[600px] h-[600px] bg-blue-100/50 dark:bg-blue-900/20 rounded-full blur-3xl opacity-50 -translate-y-1/3"></div>
      </div>

      <div className="max-w-5xl w-full mx-auto px-4 relative z-10">
        <BiodataMaker />
      </div>
    </div>
  );
}
