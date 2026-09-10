const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://bhaeratksbosmlghtdix.supabase.co';
const supabaseAnonKey = 'sb_publishable_S5nN_QXFiRBS0VWdtvvZNA_O-8djtqn';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const biodataPages = [
  {
    slug: 'sarkari-job-biodata-format-pdf-download',
    tool_target: 'biodata-maker',
    meta_title: 'Sarkari Job Bio-Data Format PDF Maker Online (Free Download)',
    meta_description: 'Create and download official 1-page Bio-Data format for Indian government and private job applications. Clean, print-ready A4 PDF format.',
    h1_title: 'Sarkari Job Bio-Data Format PDF Maker',
    hero_subtitle: 'Fill your personal and academic details in 2 minutes and download an official 1-page Bio-Data PDF instantly.',
    context_paragraph: 'Government contract jobs, clerk interviews, and police rallies require a clean, structured 1-page Bio-Data containing personal details, academic qualifications, and career objectives. Cyber cafes often charge ₹50-₹100 for poorly formatted printouts. Our free tool lets you enter your details, upload an optional photo, and generates an official, standardized A4 PDF format immediately.',
    how_to: [
      'Enter your Full Name, Father\'s Name, Date of Birth, and Category.',
      'Add your Educational Qualifications (10th, 12th, Degree, Marks %).',
      'Upload a passport-size photo (optional).',
      'Click "Download 1-Page Bio-Data PDF" to get your print-ready document.'
    ],
    faqs: [
      { q: 'Is this Bio-Data format accepted for government jobs?', a: 'Yes! It contains all standardized fields required for official verification: Full Name, Father/Mother Name, DOB, Category, Education Table, and Declaration with Date and Place.' },
      { q: 'Can I download the PDF on my mobile phone?', a: 'Yes, this tool works 100% inside any mobile web browser without downloading any apps.' },
      { q: 'Are my personal details stored on your servers?', a: 'No. All PDF generation happens client-side inside your browser. No personal information or photos are saved on our servers.' }
    ]
  },
  {
    slug: 'marriage-biodata-maker-online-free-pdf',
    tool_target: 'biodata-maker',
    meta_title: 'Marriage Bio-Data Maker Online (Free PDF Download) | Matrimonial Format',
    meta_description: 'Create beautiful Hindu, Muslim, and General Matrimonial Bio-Data for marriage online. Add photo, height, caste, gotra, family details & download A4 PDF.',
    h1_title: 'Marriage Bio-Data Maker Online (Free PDF)',
    hero_subtitle: 'Design an elegant Matrimonial Bio-Data with photo, personal details, education, and family background in minutes.',
    context_paragraph: 'Sharing a well-designed marriage bio-data is the first step in arranged marriage proposals in India. Instead of sending raw text on WhatsApp, create an elegant, professional A4 PDF containing your photo, height, caste/gotra, education, and family details. Ready to share on WhatsApp or print.',
    how_to: [
      'Select the "Matrimonial / Marriage Bio-Data" template above.',
      'Fill in your personal information, height, caste, rashi, and gotra.',
      'Add educational qualifications and family details.',
      'Upload a clean portrait photo and download your Marriage Bio-Data PDF.'
    ],
    faqs: [
      { q: 'What details should be included in a Marriage Bio-Data?', a: 'Standard details include Full Name, DOB, Height, Caste/Gotra, Education, Occupation/Income, and Family Details (Parents\' profession and siblings).' },
      { q: 'Can I share the downloaded PDF directly on WhatsApp?', a: 'Yes! The downloaded file is an ultra-lightweight, high-resolution PDF that can be sent directly on WhatsApp with zero compression or quality loss.' }
    ]
  },
  {
    slug: 'simple-resume-format-for-freshers-pdf',
    tool_target: 'biodata-maker',
    meta_title: 'Simple Resume Format for Freshers PDF Maker (Free 1-Page)',
    meta_description: 'Fast 1-page simple resume and CV maker for college freshers and entry-level job seekers in India. Download print-ready PDF.',
    h1_title: 'Simple Resume Format for Freshers (1-Page PDF)',
    hero_subtitle: 'No complex design skills needed. Enter your degrees and skills to download an HR-approved clean fresher resume.',
    context_paragraph: 'Fresh college graduates applying for entry-level office jobs, bank apprenticeships, or teaching posts do not need complex multi-column graphic resumes. Most Indian recruiters prefer a straightforward, clean 1-page summary showing degrees, percentages, skills, and contact info. Our tool generates exactly that.',
    how_to: [
      'Enter your contact information (Phone, Email, Address).',
      'Fill your Career Objective and Key Skills.',
      'Add your 10th, 12th, and College percentage in the table.',
      'Download your ATS-friendly 1-page Resume PDF.'
    ],
    faqs: [
      { q: 'Is a 1-page resume better for freshers?', a: 'Yes, 95% of recruiters recommend a single-page resume for candidates with 0 to 2 years of work experience.' },
      { q: 'Is this resume ATS (Applicant Tracking System) friendly?', a: 'Yes, the PDF uses clean, selectable vector text with standard headings that automated resume scanners can easily parse.' }
    ]
  }
];

async function insertBiodataPages() {
  console.log(`Inserting ${biodataPages.length} Bio-Data pSEO pages into Supabase...`);
  
  const { data, error } = await supabase
    .from('seo_pages')
    .upsert(biodataPages, { onConflict: 'slug' });
    
  if (error) {
    console.error('Error inserting Bio-Data pages:', error);
  } else {
    console.log('Successfully inserted all Bio-Data pSEO pages!');
  }
}

insertBiodataPages();
