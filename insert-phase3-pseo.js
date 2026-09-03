const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://bhaeratksbosmlghtdix.supabase.co';
const supabaseAnonKey = 'sb_publishable_S5nN_QXFiRBS0VWdtvvZNA_O-8djtqn';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const pages = [
  // ------------------ AADHAAR / PAN MERGER ------------------
  {
    slug: 'aadhaar-card-front-and-back-pdf-maker',
    tool_target: 'id-card-merger',
    meta_title: 'Aadhaar Card Front and Back PDF Maker Online (A4 Size)',
    meta_description: 'Aadhaar card ki front aur back photo upload kare aur ek perfect A4 size PDF banaye. KYC, Bank, aur Sarkari form upload ke liye best free tool.',
    h1_title: 'Aadhaar Card Front & Back PDF Maker',
    hero_subtitle: "Dono side ki photo upload kare aur ek single page par align karke PDF banaye.",
    context_paragraph: "Bank account kholne ya loan form bharne me hamesha ek hi PDF file upload karne ko kaha jata hai jisme Aadhaar ka front aur back dono ho. Ye tool aapki do alag photos ko ek A4 page par bilkul sahi size me set kar deta hai.",
    how_to: [
      "Front Side wale box me Aadhaar ka samne ka hissa upload kare.",
      "Back Side wale box me piche ka hissa upload kare.",
      "'Download as PDF' button par click kare. File ready ho jayegi."
    ],
    faqs: [
      { "q": "Kya meri photos safe hain?", "a": "Haan, aapki ID ki photos aapke hi phone/computer me process hoti hain aur kisi server par save nahi hoti." },
      { "q": "Kya main is PDF ka print nikal sakta hu?", "a": "Bilkul, ye PDF perfect A4 size ki hoti hai jiska direct print nikala ja sakta hai." }
    ]
  },
  {
    slug: 'pan-card-dono-side-ek-page-par-print',
    tool_target: 'id-card-merger',
    meta_title: 'PAN Card Dono Side Ek Page Par Print Kare (PDF Maker)',
    meta_description: 'PAN card ki dono side ki photos ko jod kar ek PDF banaye. Document verification aur KYC portals ke liye 100% free A4 PDF creator.',
    h1_title: 'PAN Card Dono Side Ek Page Par Jode',
    hero_subtitle: "Apne PAN Card ki dono side ko ek single document me merge kare.",
    context_paragraph: "Mutual funds, stock broking apps aur loans me PAN card upload karte waqt log pareshan hote hain ki dono side ek page par kaise laye. Is tool se aap 5 second me ye kaam kar sakte hain.",
    how_to: [
      "Pehle box me PAN card ka front upload kare.",
      "Dusre box me PAN card ka back upload kare.",
      "PDF Download kare aur apne form me attach kare."
    ],
    faqs: [
      { "q": "Kya file size 1MB ke niche aayega?", "a": "Haan, tool automatically file ko optimize karta hai taaki wo asani se upload ho jaye." }
    ]
  },
  
  // ------------------ PDF UNLOCKER ------------------
  {
    slug: 'eaadhaar-pdf-password-remover-online',
    tool_target: 'aadhaar-unlock',
    meta_title: 'e-Aadhaar PDF Password Remover | Unlock Aadhaar Card Online',
    meta_description: 'Apne download kiye hue e-Aadhaar PDF ka password hamesha ke liye hataye. EPFO, PF withdrawal aur CA ko bhejne ke liye bina password wali file banaye.',
    h1_title: 'e-Aadhaar PDF Password Remover',
    hero_subtitle: "Government sites (jaise EPFO) par password wali PDF upload nahi hoti. Yaha se password remove kare.",
    context_paragraph: "Jab aap UIDAI se apna Aadhaar download karte hain toh wo encrypted hota hai. Agar aapko ye file PF nikalne ya bank KYC ke liye deni hai, toh pehle uska password hatana zaroori hai. Ye tool aapke Aadhaar ko 'flat' aur unlocked PDF me badal deta hai.",
    how_to: [
      "Apni locked e-Aadhaar PDF file upload kare.",
      "Password dale (Aapke naam ke pehle 4 letter CAPITAL me aur birth year. Example: AMIT1990).",
      "Unlock PDF button dabaye aur nayi file save kare."
    ],
    faqs: [
      { "q": "Kya Aadhaar password hatana safe hai?", "a": "Hamara tool 100% browser me kaam karta hai. Aapka data aur password kabhi internet par upload nahi hota." }
    ]
  },
  {
    slug: 'sbi-hdfc-bank-statement-password-unlocker',
    tool_target: 'aadhaar-unlock',
    meta_title: 'Bank Statement Password Unlocker (SBI, HDFC, ICICI) PDF',
    meta_description: 'ITR filing ya Loan application ke liye apne bank statement ki PDF ka password remove kare. Client-side secure unlocker.',
    h1_title: 'Bank Statement Password Unlocker',
    hero_subtitle: "CA ya Loan App ko bank statement bhejne se pehle uska password hamesha ke liye hataye.",
    context_paragraph: "SBI, HDFC, aur ICICI bank jab statement email karte hain toh wo password protected hota hai (usually customer id ya account number). Loan portals aise locked documents reject kar dete hain. Yaha apni file ko safely unlock kare.",
    how_to: [
      "Apna encrypted Bank Statement PDF upload kare.",
      "Bank dwara diya gaya password type kare.",
      "Unlock kare aur nayi PDF download karke apne CA ya portal par submit kare."
    ],
    faqs: [
      { "q": "Mera HDFC bank ka password kya hai?", "a": "HDFC me aam taur par Customer ID password hota hai. SBI me account number password ho sakta hai." },
      { "q": "Kya ye tool mera bank data padh sakta hai?", "a": "Nahi, sab kuch aapke mobile/laptop ke andar process hota hai. No server uploads." }
    ]
  },
  {
    slug: 'pdf-se-password-kaise-hataye',
    tool_target: 'aadhaar-unlock',
    meta_title: 'PDF Se Password Kaise Hataye - Free PDF Unlocker',
    meta_description: 'Kisi bhi PDF file se password hamesha ke liye remove kare. Bina kisi software ke mobile me PDF ko unlock kare.',
    h1_title: 'PDF Se Password Kaise Hataye',
    hero_subtitle: "Baar-baar password dalne ki jhanjhat khatam kare. File ko ek baar me unlock karke hamesha ke liye save kare.",
    context_paragraph: "Kayi baar humein apni khud ki pay-slips ya official documents baar-baar kholne padte hain aur har baar lamba password dalna irritation karta hai. Is tool ki madad se ek unlocked copy save kar le.",
    how_to: [
      "PDF upload kare jisme lock laga hai.",
      "Ek baar sahi password type kare.",
      "Download button dabaye. Nayi file hamesha ke liye bina password ke khulegi."
    ],
    faqs: [
      { "q": "Kya main password bhul gaya hu toh unlock kar sakta hu?", "a": "Nahi, file ko unlock karne ke liye aapko original password ek baar dalna hi padega." }
    ]
  },

  // ------------------ PASSPORT MAKER (NAME & DATE) ------------------
  {
    slug: 'photo-par-name-aur-date-kaise-likhe',
    tool_target: 'passport-maker',
    meta_title: 'Photo Par Name Aur Date Kaise Likhe - SSC/NTA Form Tool',
    meta_description: 'Sarkari form ke liye apni passport size photo par apna naam (name) aur photo khichne ki tarikh (date) white patti me likhe online.',
    h1_title: 'Photo Par Name Aur Date Kaise Likhe',
    hero_subtitle: "SSC aur dusre exams ki requirement ke mutabiq photo ke niche white strip par name aur date add kare.",
    context_paragraph: "Sarkari exam forms me strictly likha hota hai ki photo par naam aur date of capture printed hona chahiye. Cyber cafe jaane ki zaroorat nahi, ye tool automatic aapki photo par sahi font aur format me text add kar dega.",
    how_to: [
      "Apni normal photo gallery se upload kare.",
      "Apna poora naam (Capital letters me) aur aaj ki Date select kare.",
      "Live preview check kare aur download button dabaye."
    ],
    faqs: [
      { "q": "Date format kaisa hona chahiye?", "a": "Tool automatic DD-MM-YYYY format me date print karta hai jo sabhi forms me accept hoti hai." },
      { "q": "Kya text black color me hoga?", "a": "Haan, white background ke upar clear black bold letters me text aata hai." }
    ]
  },
  {
    slug: 'ssc-chsl-cgl-photo-with-date-maker',
    tool_target: 'passport-maker',
    meta_title: 'SSC CGL / CHSL Photo with Name and Date Maker',
    meta_description: 'Staff Selection Commission (SSC) exams ke liye exactly 3.5x4.5 cm ki photo banaye jisme niche date aur name likha ho.',
    h1_title: 'SSC Photo Maker (With Name & Date)',
    hero_subtitle: "SSC CGL, CHSL, GD, aur MTS form ke liye official size ki photo banaye.",
    context_paragraph: "SSC ka niyam bahut kadak hai. Agar photo 3 mahine se purani dikhi ya us par date printed nahi hui, toh form reject ho sakta hai. Is tool se aap apni latest selfie ko ek professional SSC passport photo me badal sakte hain.",
    how_to: [
      "Photo upload kare.",
      "SSC/UPSC (3.5x4.5 cm) preset select kare.",
      "Name aur Date field bhare. Photo auto-generate ho jayegi."
    ],
    faqs: [
      { "q": "Kya main chashma pehan kar photo laga sakta hu?", "a": "SSC guidelines ke mutabiq, aapki photo me chashma (spectacles) aur cap nahi honi chahiye." }
    ]
  },
  {
    slug: 'neet-ug-postcard-size-photo-generator',
    tool_target: 'passport-maker',
    meta_title: 'NEET UG Postcard Size Photo Maker (4x6) With Name',
    meta_description: 'NTA NEET UG exam ke admit card aur proforma ke liye 4x6 inch (Postcard Size) photo banaye white strip ke sath.',
    h1_title: 'NEET UG Postcard Size Photo (4x6) Maker',
    hero_subtitle: "NEET form me lagne wali badi Postcard size photo banaye jisme niche Name aur Date likha ho.",
    context_paragraph: "NEET candidates ko ek standard passport photo ke sath ek Postcard Size (4x6 inch) photo bhi upload karni padti hai. Is tool me 'NEET Postcard' preset select karke aap turant official guidelines wali photo bana sakte hain.",
    how_to: [
      "Photo upload kare (preferably white background ke sath).",
      "Size preset me 'NEET Postcard (4x6 inch)' chune.",
      "Details bhare aur HD quality image download kare."
    ],
    faqs: [
      { "q": "Background kaisa hona chahiye?", "a": "NEET ke liye photo ka background white hona compulsory hai." },
      { "q": "Kitna area face ka hona chahiye?", "a": "Koshish kare ki aapka face photo ka 80% area cover kare (kaan saaf dikhne chahiye)." }
    ]
  },
  {
    slug: 'upsc-passport-size-photo-maker-online',
    tool_target: 'passport-maker',
    meta_title: 'UPSC IAS Exam Passport Size Photo Maker',
    meta_description: 'UPSC CSE aur NDA/CDS exams ke liye 350x350 pixels ya 3.5x4.5 cm ki photo banaye apna naam add karke.',
    h1_title: 'UPSC Exam Passport Size Photo Maker',
    hero_subtitle: "UPSC CSE Pre/Mains (DAF) forms ke liye notification ke hisaab se sahi format me photo taiyar kare.",
    context_paragraph: "UPSC ne haal hi me photo upload rules strict kar diye hain. Photo par naam aur tarikh zaruri ho sakti hai (notification ke mutabiq). Ye tool dimensions aur text dono handle karta hai.",
    how_to: [
      "Apni portrait picture select kare.",
      "Name box me apna Pura Naam dale.",
      "Date of photo capture set karke export dabaye."
    ],
    faqs: [
      { "q": "UPSC ke liye file size kya hota hai?", "a": "UPSC portal me generally file size 20KB se 300KB ke beech maanga jata hai. Agar file badi ho, toh hamara Image Compressor tool use kare." }
    ]
  }
];

async function insertPages() {
  console.log(`Inserting ${pages.length} MORE pSEO pages for Phase 3 Tools...`);
  
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
