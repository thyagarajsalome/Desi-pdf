import { Plus_Jakarta_Sans } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/context/AuthContext";

const plusJakarta = Plus_Jakarta_Sans({ 
  subsets: ["latin"],
  variable: "--font-plus-jakarta"
});

export const metadata = {
  metadataBase: new URL("https://www.convertpdftojpg.in"),
  title: {
    default: "DesiPDF - Clean & Free PDF & Image Tools",
    template: "%s | DesiPDF",
  },
  description: "Convert, compress, and merge PDF files and resize images with absolute privacy. 100% browser-based tools.",
  alternates: {
    canonical: "./",
  },
  verification: {
    google: "eIGuoLHf4b-3BLZA7nzDjmk39z12c7ICZQcmt4RVkYU",
    other: {
      "msvalidate.01": "7BE3F5092496F607BD8EB7753CD93E8C",
    },
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico" },
    ],
    shortcut: "/favicon.ico",
    apple: "/icon.svg",
  },
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

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${plusJakarta.className} h-full antialiased`}>
      <head>
        <link rel="preconnect" href="https://cdnjs.cloudflare.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        <script dangerouslySetInnerHTML={{
          __html: `
            try {
              if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                document.documentElement.classList.add('dark');
              } else {
                document.documentElement.classList.remove('dark');
              }
            } catch (_) {}
          `
        }} />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-gray-50 dark:bg-[#09090b] text-gray-900 dark:text-gray-100 transition-colors duration-300">
        <ThemeProvider>
          <AuthProvider>
            <Navbar />
            <main className="flex-grow flex flex-col">
              {children}
            </main>
            <Footer />
          </AuthProvider>
        </ThemeProvider>
        <Script
          src="https://www.googletagmanager.com/gtm.js?id=GTM-PJK4JTL7"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-025JBB095N');
          `}
        </Script>
      </body>
    </html>
  );
}
