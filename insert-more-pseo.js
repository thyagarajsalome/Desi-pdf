const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://bhaeratksbosmlghtdix.supabase.co';
const supabaseAnonKey = 'sb_publishable_S5nN_QXFiRBS0VWdtvvZNA_O-8djtqn';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const pages = [
  {
    slug: 'photo-ka-size-20kb-kaise-kare',
    tool_target: 'image-compressor',
    meta_title: 'Photo Ka Size 20KB Kaise Kare - Online Image Compressor',
    meta_description: 'Sarkari form ke liye apni photo ya signature ka size 20KB tak kam kare. Bina quality kharab kiye image compress kare bilkul free.',
    h1_title: 'Photo Ka Size 20KB Kaise Kare',
    hero_subtitle: "Online forms (SSC, IBPS, Railway) me photo ka size max 20KB manga jata hai. Yaha 2 click me size kam kare.",
    context_paragraph: "Mobile se kheenchi gayi photo MBs me hoti hai. Is tool se aap asani se kisi bhi photo ko exact 20KB ke niche la sakte hain.",
    how_to: JSON.stringify([
      "Upload image box me apni photo select kare.",
      "Target size me '20KB' type kare ya select kare.",
      "Compress button dabaye aur download kare."
    ]),
    faqs: JSON.stringify([
      { "q": "Kya photo blur ho jayegi?", "a": "Nahi, hamara tool smart compression use karta hai jisse chehra clear rehta hai." },
      { "q": "Kya yeh mobile par chalega?", "a": "Haan, yeh 100% mobile friendly hai." }
    ])
  },
  {
    slug: 'photo-ka-size-50kb-kaise-kare',
    tool_target: 'image-compressor',
    meta_title: 'Photo Ka Size 50KB Kaise Kare - Image Compressor Online',
    meta_description: 'SSC, UPSC, aur state exam forms ke liye photo ka size 50KB tak set kare. Online free image compressor tool.',
    h1_title: 'Photo Ka Size 50KB Kaise Kare',
    hero_subtitle: "UPSC aur SSC me passport photo ka max size 50KB allow hota hai. Apna image size turant set kare.",
    context_paragraph: "Agar aapka form 'File too large' error de raha hai, toh yaha photo upload kare aur 50KB preset select kare.",
    how_to: JSON.stringify([
      "Apni photo upload kare.",
      "50KB preset button par click kare.",
      "Compress daba kar nayi photo save kare."
    ]),
    faqs: JSON.stringify([
      { "q": "Konse format support hote hain?", "a": "Aap JPG, JPEG aur PNG formats upload kar sakte hain." }
    ])
  },
  {
    slug: 'mobile-se-pdf-kaise-banaye',
    tool_target: 'image-to-pdf',
    meta_title: 'Mobile Se PDF Kaise Banaye - JPG to PDF Free Tool',
    meta_description: 'Apne mobile ki photos (JPG/PNG) ko jod kar ek PDF file banaye. Assignment, notes aur documents ke liye best tool.',
    h1_title: 'Mobile Se PDF Kaise Banaye (Bina App Ke)',
    hero_subtitle: "College assignments ya ID proofs ki photos ko ek PDF me convert karna ab bahut asan hai.",
    context_paragraph: "Kisi bhi 3rd party Chinese app ko install karne ki zaroorat nahi. Seedha browser me photos upload kare aur PDF banaye.",
    how_to: JSON.stringify([
      "Select Images par click karke apni gallery se photos chune.",
      "Photos ko drag karke sahi order me lagaye.",
      "'Convert to PDF' daba kar file download kare."
    ]),
    faqs: JSON.stringify([
      { "q": "Kitni photos ek baar me PDF ban sakti hain?", "a": "Free user ek baar me 5 photos ki PDF bana sakte hain. Pro version me unlimited hai." },
      { "q": "Kya photos server par upload hoti hain?", "a": "Nahi, PDF aapke mobile ke browser me banti hai. 100% safe aur private." }
    ])
  },
  {
    slug: 'pdf-ka-size-kaise-kam-kare',
    tool_target: 'pdf-compress',
    meta_title: 'PDF Ka Size Kaise Kam Kare - Free PDF Compressor',
    meta_description: 'Badi PDF files ka size (MB se KB) kam kare online. Email attachments aur form uploads ke liye PDF shrink kare.',
    h1_title: 'PDF Ka Size Kaise Kam Kare',
    hero_subtitle: "Agar PDF file email me attach nahi ho rahi ya portal par upload nahi ho rahi, toh yaha size compress kare.",
    context_paragraph: "Sarkari portal jaise EPFO, Income Tax, aur e-Tender me 2MB se badi PDF upload nahi hoti. Ye tool aapki PDF compress kar dega.",
    how_to: JSON.stringify([
      "Apni badi PDF file upload kare.",
      "Compression level choose kare (Extreme, Recommended, Low).",
      "Compress button par click kare."
    ]),
    faqs: JSON.stringify([
      { "q": "Kya text blur ho jayega?", "a": "Recommended compression me text bilkul clear rehta hai, sirf pichli images compress hoti hain." }
    ])
  },
  {
    slug: 'do-pdf-ko-ek-kaise-kare',
    tool_target: 'pdf-merge',
    meta_title: 'Do PDF Ko Ek Kaise Kare - Merge PDF Files Online',
    meta_description: '2 ya usse zyada PDF files ko jod kar ek single PDF banaye. Aadhaar, PAN ya assignments combine karne ka asan tarika.',
    h1_title: 'Do PDF Ko Ek Kaise Kare (Merge PDF)',
    hero_subtitle: "Alag-alag PDF files ko jod kar ek file me combine kare. Fast aur secure.",
    context_paragraph: "Jab aapko multiple documents (Jaise Aadhaar card, PAN card, aur Bank statement) ek hi file me bhejna ho, toh is tool ka use kare.",
    how_to: JSON.stringify([
      "Apni dono/sabhi PDF files ko upload kare.",
      "Unko drag karke upar-neeche sahi kram (order) me lagaye.",
      "Merge PDF button dabaye aur download kare."
    ]),
    faqs: JSON.stringify([
      { "q": "Free version me kitni file merge kar sakte hain?", "a": "Aap free me 3 PDF files ek sath merge kar sakte hain." }
    ])
  },
  {
    slug: 'pdf-ko-photo-me-kaise-badle',
    tool_target: 'pdf-to-jpg',
    meta_title: 'PDF Ko Photo Me Kaise Badle (PDF to JPG)',
    meta_description: 'PDF documents ko HD Quality JPG ya PNG images me badle. Har page ki alag photo banaye online aur free.',
    h1_title: 'PDF Ko Photo (JPG) Me Kaise Badle',
    hero_subtitle: "Agar aapko PDF ka koi page WhatsApp par bhejna hai, toh use JPG photo me convert kare.",
    context_paragraph: "Ye tool aapki PDF ke har ek page ko scan karke uski ek High-Definition photo (JPG) bana deta hai.",
    how_to: JSON.stringify([
      "Apni PDF file upload kare.",
      "Resolution/Quality select kare.",
      "Convert daba kar Zip file ya alag-alag photos download kare."
    ]),
    faqs: JSON.stringify([
      { "q": "Kya main password wali PDF convert kar sakta hu?", "a": "Nahi, pehle aapko password remove karna padega." }
    ])
  },
  {
    slug: 'pan-card-photo-size-213x213',
    tool_target: 'image-resizer',
    meta_title: 'PAN Card Photo Size 213x213 Pixels Maker Online',
    meta_description: 'NSDL PAN Card online application ke liye photo aur signature ko exact 213x213 pixels aur 300 DPI me resize kare.',
    h1_title: 'PAN Card Photo Size Resizer (213x213 px)',
    hero_subtitle: "PAN Card apply/update karte waqt photo exactly 213x213 pixels aur 30KB se kam honi chahiye. Yaha free banaye.",
    context_paragraph: "NSDL / UTIITSL portal par galat size ki photo upload karne se form turant reject ho jata hai. Ye tool exact pixel output deta hai.",
    how_to: JSON.stringify([
      "Apni photo upload kare.",
      "Width me 213 aur Height me 213 dale.",
      "Aspect ratio lock ko disable rakhe aur download kare."
    ]),
    faqs: JSON.stringify([
      { "q": "PAN card signature ka size kya hota hai?", "a": "Signature bhi 213x213 pixels aur 30KB se kam hona chahiye." },
      { "q": "Agar file size 30KB se zyada ho toh?", "a": "Aap pehle resize kare, uske baad hamare Image Compressor me dal kar 30KB set kar de." }
    ])
  },
  {
    slug: 'neet-passport-size-photo-maker',
    tool_target: 'passport-maker',
    meta_title: 'NEET Passport & Postcard Size Photo Maker',
    meta_description: 'NTA NEET UG exam form ke liye official Passport size aur Postcard size (4x6) photo banaye white background ke sath.',
    h1_title: 'NEET Exam Passport & Postcard Photo Maker',
    hero_subtitle: "NEET form ke liye NTA guidelines ke mutabiq name aur date ke sath passport photo banaye.",
    context_paragraph: "NEET exam me strictly white background aur chehre par bina mask ke 80% face coverage wali photo maangi jati hai.",
    how_to: JSON.stringify([
      "Gallery se apni photo chune.",
      "Crop box ko face par align kare.",
      "Save karke download kare aur compress kare agar zaroorat ho."
    ]),
    faqs: JSON.stringify([
      { "q": "NEET me Postcard photo ka size kya hota hai?", "a": "Postcard photo ka size 4x6 inches (10x15 cm) hota hai, aur file size 10KB se 200KB ke beech hona chahiye." }
    ])
  },
  {
    slug: 'rrb-railway-photo-signature-resizer',
    tool_target: 'image-resizer',
    meta_title: 'RRB Railway Exam Photo & Signature Resizer',
    meta_description: 'Railway RRB ALP, NTPC, Group D exams ke liye photo 35x45mm aur signature 50x20mm me crop/resize kare.',
    h1_title: 'RRB Railway Exam Photo & Signature Resizer',
    hero_subtitle: "Railway forms me specific pixel aur dimensions (320x240 px) ki zaroorat hoti hai. Ek click me set kare.",
    context_paragraph: "Railway Recruitment Board (RRB) ka software strict hai. Thoda sa bhi dimension upar neeche hua toh form reject ho sakta hai.",
    how_to: JSON.stringify([
      "Upload image par click kare.",
      "Exact width aur height manually dale jo notification me di gayi ho.",
      "Image download karke form me upload kare."
    ]),
    faqs: JSON.stringify([
      { "q": "RRB signature ka color kya hona chahiye?", "a": "Blue ya Black ink se white paper par. Capital letters me signature na kare, reject ho jayega." }
    ])
  },
  {
    slug: 'pdf-se-page-kaise-delete-kare',
    tool_target: 'pdf-split',
    meta_title: 'PDF Se Page Kaise Delete Kare (Split PDF)',
    meta_description: 'Kisi bhi PDF file se bekar ya kharab pages ko asani se delete kare aur nayi PDF banaye. Free online PDF page remover.',
    h1_title: 'PDF Se Page Kaise Delete/Remove Kare',
    hero_subtitle: "Aapki badi PDF me se extra pages hataye. Sirf wahi pages bacha kar download kare jo zaroori hain.",
    context_paragraph: "Kayi baar hum scan karte waqt extra blank page scan kar lete hain. Is tool se aap PDF ke pages ko visually dekh kar hata sakte hain.",
    how_to: JSON.stringify([
      "Apni PDF file upload kare.",
      "Har page ka ek chota preview (thumbnail) dikhega.",
      "Jo page nahi chahiye, usko unselect/delete kare aur nayi PDF export kare."
    ]),
    faqs: JSON.stringify([
      { "q": "Kya original file delete ho jayegi?", "a": "Nahi, original file waisi hi rahegi, aapko ek nayi PDF download karne ko milegi." }
    ])
  }
];

async function insertPages() {
  console.log(`Inserting ${pages.length} MORE Hinglish pSEO pages...`);
  
  const { data, error } = await supabase
    .from('seo_pages')
    .upsert(pages, { onConflict: 'slug' });
    
  if (error) {
    console.error('Error inserting pages:', error);
  } else {
    console.log('Successfully inserted all new pages!');
  }
}

insertPages();
