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
              <li><Link href="/jpg-to-webp" className="hover:text-amber-600 transition">JPG to WEBP</Link></li>
              <li><Link href="/passport-maker" className="hover:text-amber-600 transition">Passport Photo Maker</Link></li>
              <li><Link href="/age-calculator" className="hover:text-amber-600 transition">Age Calculator</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-4 uppercase tracking-wider text-sm">Govt & ID Tools</h4>
            <ul className="space-y-3 text-sm text-gray-500 dark:text-gray-400">
              <li><Link href="/aadhaar-unlock" className="hover:text-indigo-600 transition">Aadhaar Unlocker</Link></li>
              <li><Link href="/ssc-photo-compressor" className="hover:text-emerald-600 transition">SSC & IBPS Photo Resizer</Link></li>
              <li><Link href="/pan-merge" className="hover:text-indigo-600 transition">PAN Card Merger</Link></li>
              <li><Link href="/thumb-impression" className="hover:text-emerald-600 transition">Thumb Impression Optimizer</Link></li>
              <li><Link href="/voter-id-pdf" className="hover:text-indigo-600 transition">Voter ID to PDF</Link></li>
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
