// Shared catalog metadata, portal specifications, and internal linking helpers
// for programmatic SEO pages (/tool/[slug]) and the /tools directory.

export const DIRECTORY_CATEGORIES = [
  {
    id: "exams",
    title: "Sarkari Exam Photo, Signature & Age Tools",
    desc: "Exact pixel dimensions, KB limits, name/date strips, and thumb impression tools for SSC, UPSC, IBPS, NEET, JEE, and State Police portals.",
    icon: "fa-graduation-cap",
  },
  {
    id: "id-cards",
    title: "Aadhaar, PAN, Voter ID & KYC Utilities",
    desc: "Remove e-Aadhaar PDF passwords, merge front and back ID cards onto a single printable A4 sheet, and compress KYC documents.",
    icon: "fa-id-card",
  },
  {
    id: "pdf",
    title: "PDF Converters, Compressors & Organizers",
    desc: "Convert PDF pages to high-resolution JPG, shrink PDFs under 500KB or 1MB, split specific pages, and merge multiple documents.",
    icon: "fa-file-pdf",
  },
  {
    id: "images",
    title: "Image Compressors, Resizers & Vector Tools",
    desc: "Compress photos to exact KB targets, remove backgrounds offline with AI, resize pixels, and convert raster images to WEBP or SVG.",
    icon: "fa-images",
  },
  {
    id: "forms",
    title: "Bio-Data, Resume & Railway Reservation Forms",
    desc: "Generate clean single-page Sarkari/marriage bio-data PDFs and printable Indian Railway reservation & cancellation slips.",
    icon: "fa-file-lines",
  },
];

export const TOOL_CATEGORY_META = {
  "ssc-photo": {
    categoryId: "exams",
    categoryLabel: "Exam Photo & Signature",
    parentRoute: "/ssc-photo-compressor",
    parentTitle: "SSC Photo & Signature Compressor",
    specs: [
      { label: "Standard Target Size", value: "20 KB – 50 KB (Photo) / 10 KB – 20 KB (Sign)" },
      { label: "Supported Formats", value: "JPG / JPEG / PNG input → Portal-ready JPG" },
      { label: "Processing Mode", value: "100% Client-Side Canvas (Zero Server Upload)" },
      { label: "Recommended Ratio", value: "3.5 cm × 4.5 cm (Approx. 132 × 170 px)" },
    ],
    extraFaqs: [
      {
        q: "How does this tool achieve exact 20KB to 50KB output without blurring my face?",
        a: "It uses adaptive JPEG quality stepping combined with target pixel scaling inside your browser, keeping facial features and text sharp while staying safely inside exam portal limits.",
      },
      {
        q: "Are my exam photos or admit card documents uploaded to any server?",
        a: "No. All resizing and compression run locally in your browser memory using HTML5 Canvas, so your personal photos never leave your phone or computer.",
      },
    ],
  },
  "ibps-sign": {
    categoryId: "exams",
    categoryLabel: "Exam Photo & Signature",
    parentRoute: "/signature-maker",
    parentTitle: "Bank & Exam Signature Maker",
    specs: [
      { label: "Standard Sign Dimensions", value: "140 × 60 Pixels (IBPS / SBI / RBI)" },
      { label: "File Size Limit", value: "10 KB – 20 KB (.JPG / .JPEG)" },
      { label: "Ink & Background", value: "Black or Blue Ink on Clean White Paper" },
      { label: "Privacy", value: "Processed Locally in Browser" },
    ],
    extraFaqs: [
      {
        q: "Why do banking portals reject signature uploads?",
        a: "Portals like IBPS and SBI reject signatures if the file exceeds 20KB, is in PNG format instead of JPG, uses ALL CAPS block letters, or misses the 140×60 pixel aspect ratio.",
      },
      {
        q: "Does it work on mobile phones?",
        a: "Yes. You can upload a photo of your signature taken on your phone camera and resize it directly in Chrome or Safari without installing any app.",
      },
    ],
  },
  "passport-maker": {
    categoryId: "exams",
    categoryLabel: "Exam Photo & Signature",
    parentRoute: "/passport-maker",
    parentTitle: "Passport Photo & Name/Date Maker",
    specs: [
      { label: "Output Options", value: "Single Passport Photo or 4×6 Printable Sheet" },
      { label: "Exam Strip Support", value: "Optional Name & Date of Photo (DOP) Strip" },
      { label: "Standard Photo Size", value: "3.5 × 4.5 cm or 2 × 2 inch (Postcard 4×6 available)" },
      { label: "Privacy", value: "100% Client-Side Generation" },
    ],
    extraFaqs: [
      {
        q: "Can I add my Name and Date of Photo (DOP) for SSC and NEET forms?",
        a: "Yes. Enter your full name and the date the photo was taken, and the tool automatically renders a clean white bottom strip complying with NTA and SSC guidelines.",
      },
      {
        q: "How can I print the 4×6 photo sheet cheaply?",
        a: "Download the 4×6 inch sheet layout containing multiple passport photos and print it on glossy 4R photo paper at any local photo lab.",
      },
    ],
  },
  "thumb-impression": {
    categoryId: "exams",
    categoryLabel: "Exam Photo & Signature",
    parentRoute: "/thumb-impression",
    parentTitle: "Thumb Impression Optimizer",
    specs: [
      { label: "Standard Size Limit", value: "20 KB – 50 KB (240 × 240 px typical)" },
      { label: "Ink Enhancement", value: "Auto-contrast cleanup for blue/black stamp ink" },
      { label: "Output Format", value: "Clean JPG on White Background" },
      { label: "Privacy", value: "Offline Browser Processing" },
    ],
    extraFaqs: [
      {
        q: "Which thumb should I scan for IBPS and SSC forms?",
        a: "Most Indian recruitment portals require your Left Thumb Impression (LTI) stamped clearly on white unruled paper using blue or black ink.",
      },
      {
        q: "What if my camera photo of the thumbprint looks too grey or shadowy?",
        a: "Use the contrast and background cleanup controls inside the optimizer to whiten the paper background while preserving crisp fingerprint ridges.",
      },
    ],
  },
  "signature-maker": {
    categoryId: "exams",
    categoryLabel: "Exam Photo & Signature",
    parentRoute: "/signature-maker",
    parentTitle: "Online Signature Maker",
    specs: [
      { label: "Creation Modes", value: "Freehand Draw Pad or Styled Font Generator" },
      { label: "Background Support", value: "Transparent PNG or Solid White JPG" },
      { label: "Ink Colors", value: "Black, Royal Blue, or Dark Ink" },
      { label: "Privacy", value: "Zero Server Storage" },
    ],
    extraFaqs: [
      {
        q: "When should I download a Transparent PNG vs White JPG signature?",
        a: "Choose Transparent PNG when placing your signature onto PDFs, invoices, or Word documents; choose White JPG when uploading to government exam forms.",
      },
      {
        q: "Can I draw smoothly using a mobile touchscreen?",
        a: "Yes, the signature pad supports smooth touch pressure and finger/stylus drawing on Android and iOS browsers.",
      },
    ],
  },
  "age-calculator": {
    categoryId: "exams",
    categoryLabel: "Exam Eligibility Tools",
    parentRoute: "/age-calculator",
    parentTitle: "Exact Age Calculator for Exams",
    specs: [
      { label: "Precision", value: "Exact Years, Months, and Days Breakdown" },
      { label: "Cut-off Date Support", value: "Calculate age as of any official notification date" },
      { label: "Use Cases", value: "UPSC, SSC, Banking, Defence & State PSC Eligibility" },
      { label: "Speed", value: "Instant Browser Calculation" },
    ],
    extraFaqs: [
      {
        q: "How do government exams count age eligibility?",
        a: "Notifications specify a strict cut-off date (such as 1st January or 1st August of the exam year). Set that reference date as the 'Age as of' date to verify exact eligibility.",
      },
      {
        q: "Does this account for leap years?",
        a: "Yes, the calculator computes exact calendar day counts including February 29 in leap years.",
      },
    ],
  },
  "aadhaar-unlock": {
    categoryId: "id-cards",
    categoryLabel: "Aadhaar & PDF Security",
    parentRoute: "/aadhaar-unlock",
    parentTitle: "e-Aadhaar & PDF Password Unlocker",
    specs: [
      { label: "e-Aadhaar Formula", value: "First 4 Letters of Name (CAPS) + Birth Year (YYYY)" },
      { label: "Output", value: "Permanently Unlocked Printable PDF" },
      { label: "Security", value: "100% Client-Side Decryption (Never Uploaded)" },
      { label: "Compatibility", value: "Works on e-Aadhaar, Bank Statements & EPFO PDFs" },
    ],
    extraFaqs: [
      {
        q: "Why is it risky to unlock my Aadhaar PDF on unknown online servers?",
        a: "Server-based PDF unlockers upload your identity file and password to external computers. DesiPDF unlocks the PDF entirely inside your browser's local memory so your Aadhaar never leaves your device.",
      },
      {
        q: "What if my name has fewer than 4 letters on the Aadhaar card?",
        a: "Enter all letters of your name before any space/dot (including initials if printed first) followed by your 4-digit year of birth, e.g., RIY1999 or A.K.1995.",
      },
    ],
  },
  "pan-merge": {
    categoryId: "id-cards",
    categoryLabel: "ID Card & KYC Tools",
    parentRoute: "/pan-merge",
    parentTitle: "PAN & ID Front/Back Merger",
    specs: [
      { label: "Page Layout", value: "Official CR80 ID Card Aspect Ratio on A4 Sheet" },
      { label: "Output Format", value: "Print-Ready High-DPI PDF" },
      { label: "Supported Inputs", value: "JPG, PNG, WEBP Photos of Front & Back" },
      { label: "Privacy", value: "Local Browser Assembly Only" },
    ],
    extraFaqs: [
      {
        q: "Does merging front and back onto one A4 page reduce printing cost?",
        a: "Yes, placing both sides cleanly aligned on one A4 sheet saves paper and matches standard bank KYC and cyber-cafe print formats.",
      },
      {
        q: "Can I use photos clicked from my phone camera?",
        a: "Yes, upload the front and back pictures directly from your gallery and download a crisp aligned PDF.",
      },
    ],
  },
  "id-card-merger": {
    categoryId: "id-cards",
    categoryLabel: "ID Card & KYC Tools",
    parentRoute: "/id-card-merger",
    parentTitle: "Aadhaar / PAN / Voter ID Merger",
    specs: [
      { label: "Page Format", value: "Standard A4 Printable PDF Layout" },
      { label: "Input Support", value: "Front & Back Images (JPG / PNG / WEBP)" },
      { label: "Alignment", value: "Auto-scaled side-by-side or stacked card view" },
      { label: "Privacy", value: "100% Offline in Browser" },
    ],
    extraFaqs: [
      {
        q: "Can I merge Aadhaar, PAN, or Driving License with this tool?",
        a: "Yes, it works for any standard Indian ID card including Aadhaar, PAN, Voter ID, Driving License, and Ayushman/ABHA cards.",
      },
      {
        q: "Are my ID card scans stored anywhere?",
        a: "No. Everything is drawn and exported into a PDF directly inside your device's browser.",
      },
    ],
  },
  "voter-id-pdf": {
    categoryId: "id-cards",
    categoryLabel: "ID Card & KYC Tools",
    parentRoute: "/voter-id-pdf",
    parentTitle: "Voter ID & Card to PDF Converter",
    specs: [
      { label: "File Size Target", value: "Under 100 KB – 200 KB Portal Ready PDF" },
      { label: "Input Support", value: "Mobile Scans / JPG / PNG" },
      { label: "Print Quality", value: "Readable Text & QR Code Clarity" },
      { label: "Privacy", value: "Local Browser Processing" },
    ],
    extraFaqs: [
      {
        q: "Does the output PDF work for DigiLocker or government portal uploads?",
        a: "Yes, the exported PDF is clean, watermark-free, and optimized to stay within typical 100KB–500KB KYC upload limits.",
      },
      {
        q: "Can I combine front and back sides into one PDF?",
        a: "Yes, select both front and back images to bundle them cleanly into a single document.",
      },
    ],
  },
  "pdf-to-jpg": {
    categoryId: "pdf",
    categoryLabel: "PDF Conversion Tools",
    parentRoute: "/pdf-to-jpg",
    parentTitle: "PDF to JPG High-Quality Converter",
    specs: [
      { label: "Resolution Scale", value: "High-DPI Crisp Rendering (up to 3x Scale)" },
      { label: "Output Formats", value: "JPG, Lossless PNG, or WEBP + Bulk ZIP" },
      { label: "Page Control", value: "Rotate Individual Pages & Selective Download" },
      { label: "Privacy", value: "Rendered Client-Side via PDF.js" },
    ],
    extraFaqs: [
      {
        q: "Can I convert only selected pages of a large PDF into JPG?",
        a: "Yes. After loading the PDF, use the checkboxes on each page preview to download only the exact pages you need or bundle them into a ZIP.",
      },
      {
        q: "Does text stay sharp when converting marksheets or certificates?",
        a: "Yes, choosing high-quality scaling preserves fine fonts, seals, and tables cleanly for printing or uploads.",
      },
    ],
  },
  "pdf-compress": {
    categoryId: "pdf",
    categoryLabel: "PDF Compression Tools",
    parentRoute: "/compress",
    parentTitle: "Compress PDF Size Online",
    specs: [
      { label: "Compression Targets", value: "Under 100KB, 200KB, 500KB, or 1MB" },
      { label: "Page Support", value: "Multi-page Certificates, Marksheets & Forms" },
      { label: "Watermark", value: "None — 100% Clean Output" },
      { label: "Privacy", value: "Browser-Side Processing Only" },
    ],
    extraFaqs: [
      {
        q: "How much can a scanned PDF be compressed?",
        a: "Scanned PDFs typically shrink by 50% to 85% depending on image DPI and compression strength, easily fitting under 500KB or 1MB government portal caps.",
      },
      {
        q: "Does this add any watermark to my official certificates?",
        a: "No. Your compressed PDF is completely clean and free of watermarks.",
      },
    ],
  },
  "pdf-merge": {
    categoryId: "pdf",
    categoryLabel: "PDF Organization Tools",
    parentRoute: "/merge",
    parentTitle: "Merge Multiple PDF Files",
    specs: [
      { label: "File Limit", value: "Combine Multiple PDFs in Custom Order" },
      { label: "Ordering", value: "Drag or Move Pages Before Merging" },
      { label: "Quality", value: "Original Vector Text & Resolution Preserved" },
      { label: "Privacy", value: "100% Local Merging via pdf-lib" },
    ],
    extraFaqs: [
      {
        q: "Will merging PDFs reduce the clarity of my marksheets?",
        a: "No. Pages are merged natively without re-encoding your text or high-resolution images.",
      },
      {
        q: "Can I reorder files before downloading the combined PDF?",
        a: "Yes, arrange the uploaded files in exact sequence (for example, Application Form → Marksheet → Caste Certificate) before generating the final PDF.",
      },
    ],
  },
  "pdf-split": {
    categoryId: "pdf",
    categoryLabel: "PDF Organization Tools",
    parentRoute: "/split",
    parentTitle: "Split & Extract PDF Pages",
    specs: [
      { label: "Extraction Modes", value: "Extract Custom Page Ranges or Individual Pages" },
      { label: "Visual Preview", value: "See Page Thumbnails Before Splitting" },
      { label: "Output", value: "Clean Instant PDF Download" },
      { label: "Privacy", value: "Zero Server File Upload" },
    ],
    extraFaqs: [
      {
        q: "Can I extract just one page from a 20-page PDF?",
        a: "Yes, select the single page or custom range you need and download it immediately as a standalone PDF.",
      },
      {
        q: "Is there a daily limit on how many PDFs I can split?",
        a: "No, all browser-based splitting is free and unlimited.",
      },
    ],
  },
  "image-to-pdf": {
    categoryId: "pdf",
    categoryLabel: "Image to PDF Tools",
    parentRoute: "/image-to-pdf",
    parentTitle: "Image to PDF Converter",
    specs: [
      { label: "Supported Images", value: "JPG, JPEG, PNG, WEBP" },
      { label: "Page Fitting", value: "Auto A4 Margin & Orientation Fitting" },
      { label: "Multi-Page", value: "Combine Multiple Photos into 1 PDF" },
      { label: "Privacy", value: "Client-Side PDF Generation" },
    ],
    extraFaqs: [
      {
        q: "Can I combine multiple mobile photos of marksheets into one PDF?",
        a: "Yes, select multiple images at once, arrange them in order, and export them as a single clean A4 PDF file.",
      },
      {
        q: "Does this tool work offline after loading?",
        a: "Yes, PDF creation runs entirely inside your browser without uploading photos over your mobile data.",
      },
    ],
  },
  "image-compressor": {
    categoryId: "images",
    categoryLabel: "Image Compression Tools",
    parentRoute: "/image-compressor",
    parentTitle: "Exact KB Image Compressor",
    specs: [
      { label: "Target Presets", value: "20 KB, 50 KB, 100 KB, 200 KB or Custom KB" },
      { label: "Supported Formats", value: "JPG, PNG, WEBP" },
      { label: "Quality Control", value: "Live Preview & Final File Size Readout" },
      { label: "Privacy", value: "100% Local Browser Compression" },
    ],
    extraFaqs: [
      {
        q: "Can I hit a strict 20KB or 50KB cap for online forms?",
        a: "Yes, choose the target KB preset or slide quality until the preview indicator shows the exact KB range accepted by your form.",
      },
      {
        q: "Why does PNG stay large even after compression?",
        a: "PNG is lossless and much heavier for photos. Converting the output to JPG reduces photo size dramatically for Indian portals.",
      },
    ],
  },
  "image-resizer": {
    categoryId: "images",
    categoryLabel: "Image Resizing Tools",
    parentRoute: "/image-resizer",
    parentTitle: "Exact Pixel Image Resizer",
    specs: [
      { label: "Pixel Control", value: "Exact Width × Height in Pixels, CM, or Inches" },
      { label: "Aspect Ratio", value: "Toggle Lock / Unlock for Exam Portal Rules" },
      { label: "Exam Presets", value: "SSC, UPSC, IBPS, Railway & Passport Sizes" },
      { label: "Privacy", value: "Browser Canvas Processing" },
    ],
    extraFaqs: [
      {
        q: "How do I resize a photo to exact pixels like 132×170 or 350×350?",
        a: "Upload your photo, unlock aspect ratio if needed (or crop to ratio first), enter the exact width and height values, and download immediately.",
      },
      {
        q: "Will resizing change my image format?",
        a: "You can export directly as clean JPG/JPEG accepted by all competitive exam portals.",
      },
    ],
  },
  "background-remover": {
    categoryId: "images",
    categoryLabel: "AI Image Editing Tools",
    parentRoute: "/background-remover",
    parentTitle: "AI Background Remover & White BG",
    specs: [
      { label: "AI Engine", value: "On-Device Neural Segmentation Model" },
      { label: "Background Colors", value: "Transparent PNG, Pure White, Light Blue & Custom" },
      { label: "Ideal Use", value: "Passport Photos, ID Cards & Product Images" },
      { label: "Privacy", value: "Runs Inside Browser Memory" },
    ],
    extraFaqs: [
      {
        q: "Can I replace a messy room background with plain white for passport photos?",
        a: "Yes. After removing the original background, select Pure White (#FFFFFF) and download a clean passport-ready JPG or PNG.",
      },
      {
        q: "Is there a watermark or sign-up wall?",
        a: "No sign-up is required and downloads contain zero watermarks.",
      },
    ],
  },
  "jpg-to-webp": {
    categoryId: "images",
    categoryLabel: "Web & Format Converters",
    parentRoute: "/jpg-to-webp",
    parentTitle: "Bulk JPG/PNG to WEBP Converter",
    specs: [
      { label: "Size Savings", value: "30% – 55% Smaller Than Standard JPG" },
      { label: "Batch Support", value: "Convert Multiple Images + ZIP Export" },
      { label: "SEO Benefit", value: "Improves Core Web Vitals & LCP Speed" },
      { label: "Privacy", value: "Client-Side Canvas Encoding" },
    ],
    extraFaqs: [
      {
        q: "Why does Google recommend WEBP format for websites?",
        a: "WEBP delivers superior lossless and lossy compression compared to JPEG and PNG, making webpages load faster and improving SEO speed scores.",
      },
      {
        q: "Does WEBP preserve transparency from PNGs?",
        a: "Yes, alpha transparency is preserved when converting transparent PNG files to WEBP.",
      },
    ],
  },
  "biodata-maker": {
    categoryId: "forms",
    categoryLabel: "Bio-Data & Resume Makers",
    parentRoute: "/biodata-maker",
    parentTitle: "Sarkari & Marriage Bio-Data Maker",
    specs: [
      { label: "Templates", value: "Job Bio-Data, Fresher Resume & Marriage Formats" },
      { label: "Languages", value: "Supports English & Hindi Unicode Typing" },
      { label: "Output", value: "1-Page Print-Ready A4 PDF" },
      { label: "Privacy", value: "All Personal Data Stays in Your Browser" },
    ],
    extraFaqs: [
      {
        q: "Can I include my passport photo inside the bio-data PDF?",
        a: "Yes, upload your photo and it will be positioned neatly in the top corner of the generated A4 PDF.",
      },
      {
        q: "Is my phone number or family details saved to any database?",
        a: "No. Everything is compiled into a PDF right on your device and discarded once you close the tab.",
      },
    ],
  },
  "railway-form": {
    categoryId: "forms",
    categoryLabel: "Railway & Travel Forms",
    parentRoute: "/railway-reservation-form",
    parentTitle: "Indian Railway Reservation Form Maker",
    specs: [
      { label: "Form Types", value: "Ticket Reservation, Cancellation & Tatkal Slips" },
      { label: "Passenger Slots", value: "Up to 6 Passengers with Age, Gender & Berth Pref." },
      { label: "Format", value: "Official IRCTC PRS Counter A4 Layout PDF" },
      { label: "Privacy", value: "Zero Server Logging of Passenger Details" },
    ],
    extraFaqs: [
      {
        q: "Is this form accepted at Indian Railway PRS booking counters?",
        a: "Yes, it follows the official reservation/cancellation requisition slip layout so you can print it pre-filled and hand it over directly at the counter.",
      },
      {
        q: "Can I type Tatkal or senior citizen concession details?",
        a: "Yes, select quota, train number/name, class, and passenger berth choices before generating the printable PDF.",
      },
    ],
  },
};

// Map static standalone pages for directory & cross-linking completeness
export const STANDALONE_TOOLS = [
  { title: "PDF to JPG Converter", desc: "Convert PDF pages to HD JPG, PNG, WEBP", route: "/pdf-to-jpg", categoryId: "pdf" },
  { title: "Merge PDF", desc: "Combine multiple PDFs in custom order", route: "/merge", categoryId: "pdf" },
  { title: "Compress PDF", desc: "Reduce PDF size for portal uploads", route: "/compress", categoryId: "pdf" },
  { title: "Split PDF", desc: "Extract specific pages from PDFs", route: "/split", categoryId: "pdf" },
  { title: "Image to PDF", desc: "Turn JPG/PNG scans into clean A4 PDF", route: "/image-to-pdf", categoryId: "pdf" },
  { title: "SSC Photo Compressor", desc: "Exact 20KB–50KB SSC photo & sign optimizer", route: "/ssc-photo-compressor", categoryId: "exams" },
  { title: "Passport Photo Maker", desc: "Name & date strip + 4×6 photo sheets", route: "/passport-maker", categoryId: "exams" },
  { title: "Signature Maker", desc: "Draw or type digital signatures", route: "/signature-maker", categoryId: "exams" },
  { title: "Thumb Impression Optimizer", desc: "Clean LTI scan for exam uploads", route: "/thumb-impression", categoryId: "exams" },
  { title: "Exam Age Calculator", desc: "Exact Years/Months/Days cutoff check", route: "/age-calculator", categoryId: "exams" },
  { title: "Aadhaar PDF Unlocker", desc: "Remove e-Aadhaar password locally", route: "/aadhaar-unlock", categoryId: "id-cards" },
  { title: "Aadhaar / PAN Merger", desc: "Front & back ID cards on 1 A4 PDF", route: "/id-card-merger", categoryId: "id-cards" },
  { title: "PAN Card Merger", desc: "Print-ready PAN card A4 layout", route: "/pan-merge", categoryId: "id-cards" },
  { title: "Voter ID to PDF", desc: "Compress Voter ID & docs under 100KB", route: "/voter-id-pdf", categoryId: "id-cards" },
  { title: "Image Compressor", desc: "Shrink photos to exact KB presets", route: "/image-compressor", categoryId: "images" },
  { title: "Image Resizer", desc: "Resize photos to exact pixels or cm", route: "/image-resizer", categoryId: "images" },
  { title: "AI Background Remover", desc: "Transparent or white passport backgrounds", route: "/background-remover", categoryId: "images" },
  { title: "JPG to WEBP Converter", desc: "Modern web compression in bulk", route: "/jpg-to-webp", categoryId: "images" },
  { title: "Image to Vector (SVG)", desc: "Trace PNG & JPG into scalable SVG paths", route: "/image-to-svg", categoryId: "images" },
  { title: "Sarkari Bio-Data Maker", desc: "Printable job & marriage bio-data PDF", route: "/biodata-maker", categoryId: "forms" },
  { title: "Railway Reservation Slip", desc: "Pre-filled PRS counter form PDF", route: "/railway-reservation-form", categoryId: "forms" },
];
