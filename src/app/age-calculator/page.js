import AgeCalculator from "@/components/AgeCalculator";

export const metadata = {
  title: "Age Calculator for Government Exams | Check Eligibility — DesiPDF",
  description:
    "Calculate your exact age and instantly check eligibility for SSC, UPSC, IBPS, Railway, NEET, JEE, NDA and all major Indian government exams. Free tool.",
};

export default function AgeCalculatorPage() {
  return (
    <div className="pt-16 pb-24 relative flex-grow flex flex-col items-center">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      <div className="absolute inset-0 -z-10 h-[60vh] w-full bg-transparent bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:16px_16px]">
        <div className="absolute top-0 right-1/4 -z-10 w-[600px] h-[600px] bg-indigo-100/50 dark:bg-indigo-900/20 rounded-full blur-3xl opacity-50 -translate-y-1/3"></div>
      </div>
      <div className="max-w-5xl w-full mx-auto px-4 relative z-10">
        <AgeCalculator />
      </div>
    </div>
  );
}
