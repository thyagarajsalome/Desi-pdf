import VoterIdPdf from "@/components/VoterIdPdf";

export const metadata = {
  title: "Convert Voter ID to 100KB PDF Online | DesiPDF",
  description: "Instantly convert your Voter ID photo into a single-page PDF guaranteed to be under the strict 100KB government portal limit.",
};

export default function VoterIdPdfPage() {
  return (
    <div className="pt-16 pb-24 text-center px-4 relative flex-grow flex flex-col items-center min-h-[80vh]">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      
      {/* Background Mesh */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-transparent bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:16px_16px]">
        <div className="absolute top-0 right-1/4 -z-10 w-[600px] h-[600px] bg-indigo-100/50 dark:bg-indigo-900/20 rounded-full blur-3xl opacity-50 -translate-y-1/3"></div>
      </div>

      <div className="max-w-3xl mx-auto mb-10 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-4">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-blue-600">Voter ID</span> 100KB PDF
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 font-medium">
          Upload a photo of your Voter ID or Govt document. We will convert it to an A4 PDF and guarantee it stays perfectly under the 100KB upload limit.
        </p>
      </div>

      <div className="max-w-4xl w-full mx-auto relative z-10">
        <VoterIdPdf />
      </div>
    </div>
  );
}
