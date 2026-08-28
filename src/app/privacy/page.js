export default function Page() {
  return (
    <div className="pt-24 pb-24 px-4 relative flex-grow">
      <div className="max-w-4xl mx-auto bg-white dark:bg-[#09090b] p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
        <div className="prose dark:prose-invert max-w-none">
          <h1>Privacy Policy</h1>
<p>Last updated: August 2026</p>
<h2>1. Local Processing (Zero-Server Architecture)</h2>
<p>Your privacy is our highest priority. Unlike other PDF websites, <strong>we do not upload your files to our servers</strong>. Tools like the Aadhaar Unlocker, Photo Resizer, and PDF splitters run entirely locally inside your web browser. Your data never leaves your device.</p>
<h2>2. Data Collection</h2>
<p>If you create an account, we store only your Email Address or Phone Number, and your subscription status via Firebase Auth. We do not store your passwords (managed by Google/Firebase).</p>
<h2>3. Cookies and Analytics</h2>
<p>We use minimal cookies necessary for authentication and basic anonymous analytics to improve our tools.</p>
        </div>
      </div>
    </div>
  );
}
