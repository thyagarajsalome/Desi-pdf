import ImageToSvg from "@/components/ImageToSvg";

export const metadata = {
  title: "Free Image to SVG Converter Online | Convert PNG, JPG to Vector SVG",
  description: "Convert any image (PNG, JPG, WEBP) to scalable vector graphics (SVG) online for free. Trace logos, signatures, drawings, and CAD shapes with smooth Bézier curves. 100% private & client-side.",
  alternates: {
    canonical: "https://www.convertpdftojpg.in/image-to-svg",
  },
  keywords: [
    "image to svg converter",
    "convert png to svg",
    "jpg to svg converter free",
    "image to vector online",
    "bitmap to svg tracer",
    "png to vector svg",
    "signature to svg converter",
    "cad vector maker online",
    "raster to vector free",
    "vectorizer online free"
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

export default function ImageToSvgPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "DesiPDF Image to Vector (SVG) Converter",
    "operatingSystem": "All (Web Browser)",
    "applicationCategory": "DesignApplication",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "INR"
    },
    "description": "Convert raster images (PNG, JPG, WEBP) into mathematical vector SVG curves. Adjust threshold, smoothing, and color layers with instant SVG download."
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black pt-16 pb-24 px-4 relative flex-grow flex flex-col items-center">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-6xl w-full mx-auto px-4 relative z-10">
        <ImageToSvg />
      </div>
    </div>
  );
}
