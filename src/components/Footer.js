import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-[#09090b] border-t border-gray-200 dark:border-gray-800 pt-16 pb-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-12 mb-12">
          
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="bg-blue-600 text-white p-2 rounded-lg">
                <i className="fa-solid fa-file-pdf text-xl"></i>
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-gray-900 dark:text-white">DesiPDF</span>
            </Link>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
              The ultimate toolkit for Indian citizens, students, and professionals. Secure, fast, and processed entirely on your device.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-4 uppercase tracking-wider text-sm">PDF Tools</h4>
            <ul className="space-y-3 text-sm text-gray-500 dark:text-gray-400">
              <li><Link href="/pdf-to-jpg" className="hover:text-blue-600 transition">PDF to JPG</Link></li>
              <li><Link href="/merge" className="hover:text-blue-600 transition">Merge PDF</Link></li>
              <li><Link href="/compress" className="hover:text-blue-600 transition">Compress PDF</Link></li>
              <li><Link href="/split" className="hover:text-blue-600 transition">Split PDF</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-4 uppercase tracking-wider text-sm">Image & Utility</h4>
            <ul className="space-y-3 text-sm text-gray-500 dark:text-gray-400">
              <li><Link href="/image-to-pdf" className="hover:text-amber-600 transition">Image to PDF</Link></li>
              <li><Link href="/image-compressor" className="hover:text-amber-600 transition">Image Compressor</Link></li>
              <li><Link href="/image-resizer" className="hover:text-amber-600 transition">Image Resizer</Link></li>
              <li><Link href="/background-remover" className="hover:text-amber-600 transition">Background Remover</Link></li>
              <li><Link href="/signature-maker" className="hover:text-amber-600 transition">Signature Maker</Link></li>
              <li><Link href="/jpg-to-webp" className="hover:text-amber-600 transition">JPG to WEBP</Link></li>
              <li><Link href="/passport-maker" className="hover:text-amber-600 transition">Passport Photo Maker</Link></li>
              <li><Link href="/age-calculator" className="hover:text-amber-600 transition">Age Calculator</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-4 uppercase tracking-wider text-sm">Govt Forms</h4>
            <ul className="space-y-3 text-sm text-gray-500 dark:text-gray-400">
              <li><Link href="/railway-reservation-form" className="hover:text-emerald-600 font-semibold transition">Railway Reservation Slip</Link></li>
              <li><Link href="/biodata-maker" className="hover:text-emerald-600 font-semibold transition">Sarkari Bio-Data Maker</Link></li>
              <li><Link href="/id-card-merger" className="hover:text-emerald-600 transition">Aadhaar/PAN Merger</Link></li>
              <li><Link href="/tool/ssc-cgl-photo-signature-resize-online" className="hover:text-emerald-600 transition">SSC CGL Photo &amp; Sign</Link></li>
              <li><Link href="/tool/rrb-ntpc-photo-and-signature-resizer" className="hover:text-emerald-600 transition">Railway RRB Resizer</Link></li>
              <li><Link href="/tool/eaadhaar-pdf-password-remover-online" className="hover:text-emerald-600 transition">e-Aadhaar Unlocker</Link></li>
              <li><Link href="/tool/photo-ka-size-20kb-kaise-kare-hindi" className="hover:text-emerald-600 transition">फोटो साइज 20KB करें</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-4 uppercase tracking-wider text-sm">Legal & Company</h4>
            <ul className="space-y-3 text-sm text-gray-500 dark:text-gray-400">
              <li><Link href="/about" className="hover:text-gray-900 dark:hover:text-white transition">About Us</Link></li>
              <li><Link href="/privacy" className="hover:text-gray-900 dark:hover:text-white transition">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-gray-900 dark:hover:text-white transition">Terms of Service</Link></li>
              <li><Link href="/disclaimer" className="hover:text-gray-900 dark:hover:text-white transition">Legal Disclaimer</Link></li>
            </ul>
          </div>

        </div>

        <div className="border-t border-gray-200 dark:border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} convertpdftojpg.in. All rights reserved.
          </p>
          <div className="flex gap-4 text-gray-400">
            <a href="#" className="hover:text-gray-900 dark:hover:text-white transition"><i className="fa-brands fa-twitter text-xl"></i></a>
            <a href="#" className="hover:text-gray-900 dark:hover:text-white transition"><i className="fa-brands fa-facebook text-xl"></i></a>
            <a href="#" className="hover:text-gray-900 dark:hover:text-white transition"><i className="fa-brands fa-instagram text-xl"></i></a>
          </div>
        </div>
      </div>
    </footer>
  );
}
