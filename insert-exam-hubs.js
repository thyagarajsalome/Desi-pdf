const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://bhaeratksbosmlghtdix.supabase.co';
const supabaseAnonKey = 'sb_publishable_S5nN_QXFiRBS0VWdtvvZNA_O-8djtqn';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const examPages = [
  // --- SSC EXAMS ---
  {
    slug: 'ssc-cgl-photo-signature-resize-online',
    tool_target: 'image-resizer',
    meta_title: 'SSC CGL Photo & Signature Resizer Online (3.5x4.5 cm / 140x60 px)',
    meta_description: 'Resize and compress photo (20-50KB) and signature (10-20KB) for SSC CGL 2026 application form. Free tool meeting official SSC specifications.',
    h1_title: 'SSC CGL Photo & Signature Resizer',
    hero_subtitle: 'Official dimensions: Photo 3.5cm x 4.5cm (20-50 KB), Signature 140x60 px (10-20 KB). 100% compliant with SSC guidelines.',
    context_paragraph: 'Staff Selection Commission (SSC) immediately rejects forms with mismatched photo dimensions or blurry signatures. This tool formats your photo to exactly 132x170 pixels (or 3.5x4.5 cm) and your signature to 140x60 pixels under 20KB.',
    how_to: [
      'Upload your passport photo or cropped signature image.',
      'Select the SSC preset or enter 132x170 px for photo / 140x60 px for signature.',
      'Click Resize & Download. File will be under the official 50KB/20KB limit.'
    ],
    faqs: [
      { q: 'What is the exact photo size for SSC CGL?', a: 'Width 3.5 cm, Height 4.5 cm (approx 132 x 170 pixels) with file size strictly between 20KB and 50KB in JPEG format.' },
      { q: 'Are spectacles allowed in SSC photos?', a: 'No, SSC strictly prohibits spectacles, caps, and masks. Both ears must be clearly visible.' }
    ]
  },
  {
    slug: 'ssc-chsl-photo-and-signature-resizer',
    tool_target: 'image-resizer',
    meta_title: 'SSC CHSL Photo and Signature Resizer | 20KB-50KB Online Tool',
    meta_description: 'Format passport photo (3.5x4.5 cm) and signature (140x60 px) for SSC CHSL application form. Compress to 20-50KB instantly.',
    h1_title: 'SSC CHSL Photo & Signature Resizer',
    hero_subtitle: 'Prepare your 10+2 CHSL application images in seconds with exact pixel compliance.',
    context_paragraph: 'Thousands of SSC CHSL applicants face form rejection due to incorrect dimensions. Our browser-based resizer ensures exact dimensions without needing Photoshop.',
    how_to: [
      'Upload your passport image.',
      'Click on the SSC preset to apply 132x170 px automatically.',
      'Download and upload directly to the SSC application portal.'
    ],
    faqs: [
      { q: 'What should be the background color?', a: 'White or very light grey background is recommended for SSC forms.' },
      { q: 'What is the signature file size limit?', a: 'Between 10KB and 20KB in JPG/JPEG format.' }
    ]
  },
  {
    slug: 'ssc-gd-constable-photo-size-resizer',
    tool_target: 'image-resizer',
    meta_title: 'SSC GD Constable Photo & Signature Resizer Online 2026',
    meta_description: 'Resize your photo and signature for SSC GD Constable recruitment form. Free online 132x170 px image optimizer.',
    h1_title: 'SSC GD Constable Photo & Signature Resizer',
    hero_subtitle: 'Easily resize your photo to 20-50KB and signature to 10-20KB for SSC GD recruitment.',
    context_paragraph: 'GD Constable aspirants often struggle to shrink photo sizes on mobile phones. This tool runs directly in your phone browser and outputs exact files.',
    how_to: [
      'Choose your photo from your gallery.',
      'Apply the preset for SSC dimensions.',
      'Download the resized image.'
    ],
    faqs: [
      { q: 'Can I do this on an Android smartphone?', a: 'Yes, this tool works 100% in mobile Chrome and Safari browsers.' }
    ]
  },
  {
    slug: 'ssc-mts-photo-resizer-online',
    tool_target: 'image-resizer',
    meta_title: 'SSC MTS Photo & Signature Resizer Tool (Free)',
    meta_description: 'Resize passport photo to 3.5x4.5 cm and signature to 140x60 px for SSC Multi-Tasking Staff (MTS) online application.',
    h1_title: 'SSC MTS Photo & Signature Resizer',
    hero_subtitle: 'Official size converter for SSC MTS & Havaldar examination forms.',
    context_paragraph: 'Avoid the ₹50 cyber cafe fee! Resize and compress your photo for SSC MTS in 5 seconds for free.',
    how_to: [
      'Upload your MTS photo.',
      'Check preview and click resize.',
      'Download your form-ready file.'
    ],
    faqs: [
      { q: 'What format does SSC MTS accept?', a: 'Only JPG / JPEG formats are accepted by the SSC portal.' }
    ]
  },

  // --- RAILWAY EXAMS ---
  {
    slug: 'rrb-ntpc-photo-and-signature-resizer',
    tool_target: 'image-resizer',
    meta_title: 'RRB NTPC Photo & Signature Resizer Online (320x240 px)',
    meta_description: 'Official Railway RRB NTPC photo resizer (320x240 px, 20-50KB) and signature optimizer (10-40KB). Instant free tool.',
    h1_title: 'RRB NTPC Photo & Signature Resizer',
    hero_subtitle: 'Meet Railway Recruitment Board (RRB) online application photo and signature requirements.',
    context_paragraph: 'Railway exams have strict aspect ratio filters. If the photo aspect ratio is skewed, the automated scrutiny software flags the application.',
    how_to: [
      'Upload your passport photo.',
      'Enter 320 px width and 240 px height or custom RRB dimensions.',
      'Download and upload to your RRB portal.'
    ],
    faqs: [
      { q: 'What is the signature requirement for RRB NTPC?', a: 'Must be signed on white paper with black or blue ink, between 10KB and 40KB.' }
    ]
  },
  {
    slug: 'rrb-alp-technician-photo-resizer',
    tool_target: 'image-resizer',
    meta_title: 'RRB ALP & Technician Photo Resizer Online (Free)',
    meta_description: 'Format passport photo (35mm x 45mm) and signature for Assistant Loco Pilot (ALP) & Technician exams online.',
    h1_title: 'RRB ALP & Technician Photo Resizer',
    hero_subtitle: 'Fast and free photo formatting tool for Railway ALP recruitment.',
    context_paragraph: 'Prepare your passport photo for the Railway Assistant Loco Pilot (ALP) recruitment portal with zero image degradation.',
    how_to: [
      'Select your image file.',
      'Ensure clear frontal face visibility.',
      'Click Resize and save.'
    ],
    faqs: [
      { q: 'Can I upload selfie for ALP?', a: 'No, selfies are rejected. Upload a straight-facing passport picture with clear neutral expression.' }
    ]
  },

  // --- BANKING EXAMS ---
  {
    slug: 'ibps-po-clerk-photo-signature-resizer',
    tool_target: 'image-resizer',
    meta_title: 'IBPS PO & Clerk Photo, Signature & Thumb Impression Resizer',
    meta_description: 'Resize photo (200x230 px), signature (140x60 px), and left thumb impression for IBPS PO, Clerk, and RRB banking exams.',
    h1_title: 'IBPS PO & Clerk Document Resizer',
    hero_subtitle: 'Official specifications: Photo 200x230 px (20-50KB), Signature 140x60 px (10-20KB), Thumb 240x240 px (20-50KB).',
    context_paragraph: 'IBPS is notorious for strict file validations. Every single parameter (pixels and KB size) must match the official brochure exactly.',
    how_to: [
      'Upload your image.',
      'Enter the IBPS specified width & height.',
      'Download your compliant file.'
    ],
    faqs: [
      { q: 'What are the exact dimensions for IBPS photo?', a: '200 x 230 pixels, file size 20KB to 50KB in JPG format.' },
      { q: 'Can signature be in capital letters for IBPS?', a: 'No! Signatures in CAPITAL LETTERS are strictly rejected by IBPS.' }
    ]
  },
  {
    slug: 'sbi-po-clerk-photo-signature-resizer',
    tool_target: 'image-resizer',
    meta_title: 'SBI PO & Clerk Photo and Signature Resizer Online',
    meta_description: 'Format passport photo (200x230 px, 20-50KB) and signature (140x60 px, 10-20KB) for State Bank of India online application.',
    h1_title: 'SBI PO & Clerk Photo & Signature Resizer',
    hero_subtitle: 'Fast online photo and signature preparation for SBI recruitment examinations.',
    context_paragraph: 'State Bank of India online recruitment portals mandate specific pixel ratios. This tool aligns your photos to SBI standards automatically.',
    how_to: [
      'Upload your passport photo or signature.',
      'Choose the matching bank preset.',
      'Download the resized file.'
    ],
    faqs: [
      { q: 'What color ink should be used for SBI signature?', a: 'Black ink is preferred and recommended on white paper.' }
    ]
  },

  // --- POLICE & DEFENCE EXAMS ---
  {
    slug: 'up-police-constable-photo-signature-resizer',
    tool_target: 'image-resizer',
    meta_title: 'UP Police Constable Photo & Signature Resizer (35x45 mm)',
    meta_description: 'UP Police recruitment photo (20-50KB) and signature (5-20KB) resizer. Resize online for UPPBPB application form.',
    h1_title: 'UP Police Constable Photo & Signature Resizer',
    hero_subtitle: 'Official dimensions: 35mm x 45mm, plain background, face covering 70% of photo.',
    context_paragraph: 'Millions of candidates apply for UP Police Constable vacancies. Make sure your application form is not rejected due to incorrect photo specifications.',
    how_to: [
      'Upload your candidate picture.',
      'Set dimensions to 35x45 mm.',
      'Export and attach to your UP Police form.'
    ],
    faqs: [
      { q: 'What is the signature size for UP Police?', a: 'Between 5KB and 20KB with width approx 3.5cm and height 1.5cm.' }
    ]
  },
  {
    slug: 'nda-cds-upsc-photo-resizer',
    tool_target: 'image-resizer',
    meta_title: 'UPSC NDA & CDS Photo and Signature Resizer (350x350 px)',
    meta_description: 'Resize passport photo (350x350 px, 20-300KB) and signature for UPSC NDA, NA, and CDS defence examination forms.',
    h1_title: 'UPSC NDA & CDS Photo & Signature Resizer',
    hero_subtitle: 'Official UPSC square aspect ratio formatting: 350x350 to 1000x1000 pixels.',
    context_paragraph: 'Union Public Service Commission (UPSC) requires photos with minimum 350x350 pixels and maximum 1000x1000 pixels. Our resizer guarantees the exact square ratio.',
    how_to: [
      'Upload your photo or signature.',
      'Set width and height to 350 px each.',
      'Save the image.'
    ],
    faqs: [
      { q: 'What is the file size range for UPSC NDA?', a: 'Between 20 KB and 300 KB for both photograph and signature.' }
    ]
  },

  // --- MEDICAL & TEACHING ---
  {
    slug: 'ctet-photo-and-signature-resizer',
    tool_target: 'image-resizer',
    meta_title: 'CTET Photo & Signature Resizer Online (CBSE Guidelines)',
    meta_description: 'Resize photo (3.5x4.5 cm, 10-100KB) and signature (3.5x1.5 cm, 3-30KB) for Central Teacher Eligibility Test (CTET).',
    h1_title: 'CTET Photo & Signature Resizer',
    hero_subtitle: 'Official CBSE CTET application specifications tool.',
    context_paragraph: 'CBSE CTET examination requires passport photographs between 10KB and 100KB and signatures between 3KB and 30KB. Easily adjust in 1 click.',
    how_to: [
      'Upload your image.',
      'Select CTET preset dimensions.',
      'Download the compressed file.'
    ],
    faqs: [
      { q: 'Is date required on CTET photo?', a: 'CBSE does not strictly mandate date, but a recent photo taken within 3 months is required.' }
    ]
  },
  {
    slug: 'jee-main-photo-and-signature-resizer',
    tool_target: 'image-resizer',
    meta_title: 'JEE Main Photo & Signature Resizer (NTA Official Guidelines)',
    meta_description: 'Resize passport photo (10-200KB) and signature (4-30KB) for NTA JEE Main online registration form. Free online tool.',
    h1_title: 'JEE Main Photo & Signature Resizer',
    hero_subtitle: 'National Testing Agency (NTA) compliant image preparation tool.',
    context_paragraph: 'NTA applications reject photographs with red-eye, shaded faces, or improper margins. Use this tool to crop and size your image perfectly.',
    how_to: [
      'Upload your JEE Main candidate photo.',
      'Resize to standard 3.5x4.5 cm.',
      'Download and upload to NTA portal.'
    ],
    faqs: [
      { q: 'Should the background be white for JEE Main?', a: 'Yes, 80% face coverage with white background without mask is required.' }
    ]
  }
];

async function insertExamPages() {
  console.log(`Inserting ${examPages.length} Dedicated Exam Hub SEO pages...`);
  
  const { data, error } = await supabase
    .from('seo_pages')
    .upsert(examPages, { onConflict: 'slug' });
    
  if (error) {
    console.error('Error inserting exam pages:', error);
  } else {
    console.log('Successfully inserted all Exam Hub pages!');
  }
}

insertExamPages();
