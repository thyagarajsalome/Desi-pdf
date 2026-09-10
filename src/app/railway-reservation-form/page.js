import RailwayFormMaker from "@/components/RailwayFormMaker";

export const metadata = {
  title: "Railway Reservation Form PDF Download & Print Online | Indian Railways PRS Slip",
  description: "Fill and download the official Indian Railways (PRS) Ticket Reservation and Cancellation Requisition Form in clean A4 PDF format. Ready to print and submit at any railway station counter in India.",
  keywords: [
    "railway reservation form pdf",
    "railway ticket booking form pdf download",
    "indian railways prs form fill online",
    "railway cancellation form format",
    "tatkal ticket reservation form print",
    "train reservation slip pdf",
    "railway reservation form hindi english"
  ],
  alternates: {
    canonical: "https://convertpdftojpg.in/railway-reservation-form",
  },
};

export default function RailwayReservationPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black pt-20 pb-20 px-4">
      <div className="max-w-4xl mx-auto text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300 text-xs font-semibold mb-4">
          <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
          Official Indian Railways (PRS) Format • 100% Free &amp; Private
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-4">
          Railway <span className="text-blue-600 dark:text-blue-400">Reservation Form</span> PDF
        </h1>
        <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Fill your train details, passenger names, and berth preferences online. Download a clean, ready-to-print official A4 PDF slip to submit directly at the railway ticket counter.
        </p>
      </div>

      <RailwayFormMaker />
    </div>
  );
}
