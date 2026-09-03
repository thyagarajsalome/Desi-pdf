const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://bhaeratksbosmlghtdix.supabase.co';
const supabaseAnonKey = 'sb_publishable_S5nN_QXFiRBS0VWdtvvZNA_O-8djtqn';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const pages = [
  {
    slug: 'photo-ka-background-kaise-hataye',
    tool_target: 'background-remover',
    meta_title: 'Photo Ka Background Kaise Hataye - Free AI Tool | DesiPDF',
    meta_description: '1 click me kisi bhi photo ka background hataye. AI ka use karke transparent (PNG) background banaye bilkul free. Koi app install karne ki zaroorat nahi.',
    h1_title: 'Photo Ka Background Kaise Hataye (Free AI)',
    hero_subtitle: "Bina kisi app ke apne mobile se photo ka background 2 second me remove kare. 100% Free aur private.",
    context_paragraph: "Background hatana ab bahut asan hai. Hamara AI tool aapki photo ka pichla hissa hata kar usko ek dum transparent bana deta hai.",
    how_to: JSON.stringify([
      "Upload Image box me apni photo select kare.",
      "AI automatic aapki photo ka background remove kar dega.",
      "Transparent PNG ya White background ke sath download kare."
    ]),
    faqs: JSON.stringify([
      { "q": "Kya is tool ke liye paise lagte hain?", "a": "Nahi, background removal bilkul free hai." },
      { "q": "Kaunse photo formats support hote hain?", "a": "Aap JPG, PNG ya WEBP photos upload kar sakte hain." },
      { "q": "Kya meri photo server par save hoti hai?", "a": "Nahi! Yeh tool 100% offline aur private hai, photo aapke phone me hi process hoti hai." }
    ])
  },
  {
    slug: 'white-background-photo-kaise-banaye',
    tool_target: 'background-remover',
    meta_title: 'Photo Me White Background Kaise Lagaye | DesiPDF',
    meta_description: 'Sarkari form ke liye photo ka background white karna hai? Is AI tool se purana background hatakar white background wali photo download kare.',
    h1_title: 'Photo Ka Background White Kaise Kare',
    hero_subtitle: "Government exams (SSC, UPSC, Bank) me white background photo mangte hain. Yaha free me banaye.",
    context_paragraph: "Kabhi kabhi purana background form ke mutabiq nahi hota. Is AI background remover ki madad se aap apni photo me white background ek click me laga sakte hain.",
    how_to: JSON.stringify([
      "Apni normal photo upload kare.",
      "AI tool automatic pichla background hata dega.",
      "'Download as JPG (White Background)' button par click kare."
    ]),
    faqs: JSON.stringify([
      { "q": "Sarkari form me kaisa background chahiye?", "a": "Zyadatar SSC, UPSC aur Railway form me white ya light blue background wali passport photo lagti hai." },
      { "q": "Kya photo ki quality kam hogi?", "a": "Nahi, hamara AI tool original HD quality maintain karta hai." }
    ])
  },
  {
    slug: 'ssc-photo-size-132x170-pixel',
    tool_target: 'image-resizer',
    meta_title: 'SSC Photo Size 132x170 Pixels Me Kaise Banaye | DesiPDF',
    meta_description: 'SSC CGL, CHSL, MTS form ke liye photo ko exact 132x170 pixels (3.5x4.5 cm) me resize kare. Aspect ratio lock hatakar exact width-height set kare.',
    h1_title: 'SSC Photo Size 132x170 Pixel Resizer',
    hero_subtitle: "SSC exams ke liye official photo dimensions me image resize kare.",
    context_paragraph: "SSC form reject hone ka sabse bada karan galat photo dimensions hote hain. Yaha se aap perfectly resize kar sakte hain.",
    how_to: JSON.stringify([
      "Apni passport photo upload kare.",
      "'SSC Photo' preset button par click kare (Width 132px, Height 170px).",
      "Download button par click karke save kare."
    ]),
    faqs: JSON.stringify([
      { "q": "SSC Photo ka official size kya hai?", "a": "SSC notification ke mutabiq photo 3.5 cm (width) x 4.5 cm (height) honi chahiye, jo digital pixel me approx 132x170 hoti hai." },
      { "q": "Agar photo stretch ho rahi ho toh kya kare?", "a": "Pehle photo ko 3.5x4.5 ratio me crop kare (Passport Photo maker tool use kare), phir resize kare." }
    ])
  },
  {
    slug: 'photo-ka-pixel-kaise-change-kare',
    tool_target: 'image-resizer',
    meta_title: 'Photo Ka Pixel Kaise Change Kare (Width & Height) | DesiPDF',
    meta_description: 'Kisi bhi photo ya signature ka exact width aur height pixel badle. Online image dimension changer free tool.',
    h1_title: 'Photo Ka Pixel (Width & Height) Change Kare',
    hero_subtitle: "Online forms me specifically pixels mangte hain. Apni photo ke exact pixels set kare bina quality lose kiye.",
    context_paragraph: "Har online application ki alag image requirements hoti hain. Ye resizer kisi bhi pixel resolution ke hisab se image set kar sakta hai.",
    how_to: JSON.stringify([
      "Photo select kare.",
      "Lock Aspect Ratio ko band (unlock) kare.",
      "Form me maangi gayi exact Width aur Height (px) enter kare aur download kare."
    ]),
    faqs: JSON.stringify([
      { "q": "Lock Aspect Ratio kya hota hai?", "a": "Agar lock on hai, toh width badalne par height automatically set hogi taaki photo fati hui na dikhe. Form ke liye ise unlock karna padta hai." },
      { "q": "Kya pixel change karne se KB kam hoga?", "a": "Pixel kam karne se KB zaroor kam hota hai. Agar aur kam karna hai toh hamara Image Compressor tool use kare." }
    ])
  },
  {
    slug: 'bank-exam-signature-140x60-resize',
    tool_target: 'image-resizer',
    meta_title: 'IBPS Bank Signature Size 140x60 Pixel Kaise Banaye',
    meta_description: 'IBPS PO, Clerk, SBI exam ke liye apne signature ko 140x60 pixels me perfectly resize kare. Mobile se online free.',
    h1_title: 'Bank Exam Signature Resizer (140x60 Pixels)',
    hero_subtitle: "IBPS aur SBI form me signature strict dimensions me chahiye hote hain. Yaha click me resize kare.",
    context_paragraph: "Bank exams ki online registration me 140x60 px wale signature upload karna zaroori hai nahi toh upload fail ho jata hai.",
    how_to: JSON.stringify([
      "Apne signature ki photo upload kare.",
      "'Bank Signature (140x60)' preset par click kare.",
      "Download button dabaye aur form upload kare."
    ]),
    faqs: JSON.stringify([
      { "q": "IBPS Signature guidelines kya hain?", "a": "Signature white paper par black ink se hona chahiye, 140x60 pixels dimension, aur size 10KB se 20KB ke beech." }
    ])
  },
  {
    slug: 'online-signature-kaise-banaye',
    tool_target: 'signature-maker',
    meta_title: 'Online Signature Kaise Banaye - E-Signature Maker | DesiPDF',
    meta_description: 'Apne mobile ya computer se online signature banaye. Apne haath se draw kare ya name type karke stylish signature banaye.',
    h1_title: 'Online Signature Kaise Banaye (Draw & Type)',
    hero_subtitle: "Apne form, CV, aur documents ke liye digital signature banaye. Transparent PNG support ke sath.",
    context_paragraph: "Digital documents aur form ke liye ab white paper aur pen dhoondhne ki zaroorat nahi, yaha draw karke digital signature generate kare.",
    how_to: JSON.stringify([
      "Canvas par apni ungli ya mouse se signature draw kare.",
      "Ya phir 'Type Signature' par click karke apna naam likhe.",
      "Transparent PNG ya White background JPG download kare."
    ]),
    faqs: JSON.stringify([
      { "q": "Kaunsa color use karna chahiye?", "a": "Sarkari aur bank forms ke liye hamesha Black ya Blue ink (color) choose kare." },
      { "q": "Transparent signature ka kya fayda hai?", "a": "Transparent (PNG) signature kisi bhi document ya PDF par fit ho jata hai bina piche ka safed dabba dikhaye." }
    ])
  },
  {
    slug: 'digital-signature-transparent-background',
    tool_target: 'signature-maker',
    meta_title: 'Digital Signature Maker with Transparent Background (PNG)',
    meta_description: 'Create handwritten digital signatures with transparent backgrounds for Word, PDF, and online forms. 100% Free.',
    h1_title: 'Transparent Digital Signature Maker (PNG)',
    hero_subtitle: "Apne hath ka signature digitize kare aur bina white background (transparent) ke download kare.",
    context_paragraph: "Transparent signature ka fayda ye hai ki aap ise MS Word ya PDF documents par stamp ki tarah laga sakte hain.",
    how_to: JSON.stringify([
      "White canvas par apna original signature kare.",
      "Pen ki thickness aur color (Blue/Black) adjust kare.",
      "'Download as Transparent PNG' button dabaye."
    ]),
    faqs: JSON.stringify([
      { "q": "Kya main typed signature use kar sakta hu?", "a": "Haa, agar aap draw nahi kar paa rahe, toh 'Type Signature' tab use karke cursive font me download kar sakte hain." }
    ])
  },
  {
    slug: 'jpg-ko-webp-me-convert-kare',
    tool_target: 'jpg-to-webp',
    meta_title: 'JPG Ko WEBP Me Kaise Convert Kare (Free Tool)',
    meta_description: 'Apni JPG ya PNG photo ko Next-Gen WEBP format me badle aur image ka size 50% tak kam kare quality loose kiye bina.',
    h1_title: 'JPG to WEBP Converter Online',
    hero_subtitle: "Website aur blog speed badhane ke liye WEBP format sabse best hai. 2 second me image format convert kare.",
    context_paragraph: "Google ka WEBP format same image quality ko 30-50% chote file size me store karta hai.",
    how_to: JSON.stringify([
      "Apni JPG ya PNG image choose kare.",
      "Quality slider se size control kare.",
      "Convert dabaye aur WEBP format me image download kare."
    ]),
    faqs: JSON.stringify([
      { "q": "WEBP format kya hota hai?", "a": "WEBP Google dwara banaya gaya modern image format hai jo same quality me 30% chhota size deta hai." },
      { "q": "Kya isse photo fat-ti hai?", "a": "Nahi, WEBP advanced compression use karta hai jisse edges clear rehti hain." }
    ])
  }
];

async function insertPages() {
  console.log(`Inserting ${pages.length} Hinglish pSEO pages...`);
  
  const { data, error } = await supabase
    .from('seo_pages')
    .upsert(pages, { onConflict: 'slug' });
    
  if (error) {
    console.error('Error inserting pages:', error);
  } else {
    console.log('Successfully inserted all pages!');
  }
}

insertPages();
