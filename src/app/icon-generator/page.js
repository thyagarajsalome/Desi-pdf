import IconGenerator from "@/components/IconGenerator";

export const metadata = {
  title: "Free Image to Icon Converter & CAD App Icon Studio Online",
  description: "Convert any image (PNG, JPG, WEBP, SVG) into multi-size app icons and favicon .ico files. Customize shapes, padding, colors, or choose from 35+ precision 24x24 CAD vector icons. 100% Free & private.",
  alternates: {
    canonical: "https://www.convertpdftojpg.in/icon-generator",
  },
  keywords: [
    "image to icon converter",
    "convert png to icon",
    "jpg to ico converter",
    "convert image to favicon",
    "app icon generator online",
    "image to app icon pack",
    "svg icon generator",
    "cad icons svg",
    "autocad icons svg download",
    "architecture symbols svg",
    "free icon maker online",
    "custom svg icon builder",
    "mobile app icon pack generator",
    "desktop app icon ico maker",
    "favicon generator online"
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function IconGeneratorPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "DesiPDF Image to Icon Converter & CAD App Studio",
    "operatingSystem": "All (Web Browser)",
    "applicationCategory": "DesignApplication",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "INR"
    },
    "description": "Convert any image (PNG, JPG, WEBP, SVG) into multi-resolution app icons and favicon .ico files. Customize shapes, padding, colors, and export for Android, iOS, Windows, and Web."
  };

  return (
    <div className="pt-16 pb-24 relative flex-grow flex flex-col items-center">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Subtle Blueprint Grid Background Mesh */}
      <div className="absolute inset-0 -z-10 h-[60vh] w-full bg-transparent bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:16px_16px]">
        <div className="absolute top-0 right-1/4 -z-10 w-[600px] h-[600px] bg-blue-100/50 dark:bg-blue-900/20 rounded-full blur-3xl opacity-50 -translate-y-1/3"></div>
      </div>

      <div className="max-w-6xl w-full mx-auto px-4 relative z-10">
        <IconGenerator />
      </div>
    </div>
  );
}
