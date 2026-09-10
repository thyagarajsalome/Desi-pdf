const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://bhaeratksbosmlghtdix.supabase.co';
const supabaseAnonKey = 'sb_publishable_S5nN_QXFiRBS0VWdtvvZNA_O-8djtqn';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const newPages = [
  // ==========================================
  // 1. RAILWAY RESERVATION & CANCELLATION FORMS (ENGLISH & HINDI)
  // ==========================================
  {
    slug: 'railway-reservation-form-pdf-download-print',
    tool_target: 'railway-form',
    meta_title: 'Railway Reservation Form PDF Download & Print Online (Official PRS Slip)',
    meta_description: 'Fill and download the official Indian Railways (PRS) ticket reservation form in printable A4 PDF format. Ready to print and submit at any railway station counter in India.',
    h1_title: 'Railway Reservation Form PDF Download & Print Online',
    hero_subtitle: 'Enter your train number, passenger details, and berth choices to generate a clean, official Indian Railways counter requisition slip PDF.',
    context_paragraph: 'When booking train tickets offline at an Indian Railways PRS (Passenger Reservation System) station counter, passengers must submit a filled reservation requisition slip. Finding paper slips in crowded stations or getting xerox copies from cyber cafes often wastes valuable booking time, especially during Tatkal hours. Our free tool lets you enter your travel details and passenger list to generate an authentic, print-ready Indian Railways reservation form in A4 PDF format immediately.',
    how_to: [
      'Enter your Train Number, Train Name, Travel Date, and Class (SL, 3A, 2A, 1A, CC).',
      'Fill From Station, To Station, and Boarding Station names.',
      'Add up to 6 passengers with Name, Gender, Age, and Berth Preference (Lower, Middle, Upper, Side Lower).',
      'Enter the Applicant Name and Mobile Number.',
      'Click "Download Printable Official Form (PDF)" and print the generated A4 sheet.'
    ],
    faqs: [
      { q: 'Is this form accepted at all Indian Railways PRS counters?', a: 'Yes. This slip strictly follows the standardized Indian Railways bilingual (Hindi/English) layout used across all Zonal Railways (Northern, Western, Southern, Central, Eastern, etc.).' },
      { q: 'How many passengers can be booked on a single form?', a: 'Indian Railways allows a maximum of 6 passengers per requisition slip for general booking, and a maximum of 4 passengers for Tatkal quota bookings.' },
      { q: 'Can I use this form for Tatkal ticket booking?', a: 'Yes! Fill your train and passenger details beforehand and arrive at the PRS counter before 10:00 AM (for AC classes) or 11:00 AM (for Non-AC sleeper) with valid original government photo IDs.' },
      { q: 'Do I need to pay anything to download this PDF?', a: 'No, DesiPDF provides this form 100% free with zero watermarks or subscription charges.' }
    ]
  },
  {
    slug: 'railway-reservation-form-kaise-bhare-hindi',
    tool_target: 'railway-form',
    meta_title: 'रेलवे रिजर्वेशन फॉर्म कैसे भरें PDF Download - ट्रेन टिकट आरक्षण पर्ची',
    meta_description: 'रेलवे स्टेशन काउंटर से टिकट बुक करने के लिए आरक्षण मांग पत्र ऑनलाइन भरें और A4 PDF डाउनलोड करें। गाड़ी संख्या, यात्री नाम और बर्थ का चुनाव आसानी से करें।',
    h1_title: 'रेलवे रिजर्वेशन फॉर्म ऑनलाइन भरें और PDF डाउनलोड करें',
    hero_subtitle: 'भारतीय रेल आरक्षण मांग पत्र (PRS Requisition Slip) हिंदी व अंग्रेजी में भरें और सीधे स्टेशन काउंटर पर जमा करने हेतु A4 प्रिंट निकालें।',
    context_paragraph: 'रेलवे स्टेशन के टिकट काउंटर (PRS Counter) से ट्रेन टिकट बुक करवाने के लिए यात्रियों को आरक्षण फॉर्म भरना अनिवार्य होता है। कई बार स्टेशन पर फॉर्म उपलब्ध नहीं होते या साइबर कैफे वाले फोटोकॉपी के ₹10-₹20 वसूलते हैं। DesiPDF पर आप घर बैठे मोबाइल से अपनी ट्रेन संख्या, यात्रा तिथि और यात्रियों के नाम भरकर आधिकारिक भारतीय रेल आरक्षण पर्ची का A4 PDF डाउनलोड कर सकते हैं।',
    how_to: [
      'गाड़ी संख्या (Train No.) और यात्रा की तारीख चुनें।',
      'श्रेणी (Class) चुनें जैसे स्लीपर (SL), थर्ड एसी (3A) या सेकंड एसी (2A)।',
      'यात्रियों के नाम, लिंग, उम्र और बर्थ पसंद (लोअर, मिडिल, अपर) दर्ज करें।',
      'आवेदक का नाम और मोबाइल नंबर भरें।',
      '"Download Printable Official Form" पर क्लिक करके A4 साइज का प्रिंट निकालें।'
    ],
    faqs: [
      { q: 'क्या यह फॉर्म सभी रेलवे स्टेशनों पर मान्य है?', a: 'हाँ, यह भारतीय रेल के आधिकारिक प्रारूप (Bilingual Format) के अनुसार तैयार किया गया है और भारत के किसी भी PRS रिजर्वेशन काउंटर पर 100% स्वीकार्य है।' },
      { q: 'एक फॉर्म में कितने यात्रियों का नाम भर सकते हैं?', a: 'सामान्य बुकिंग में एक पर्ची पर अधिकतम 6 यात्रियों का नाम दर्ज किया जा सकता है। तत्काल टिकट के लिए अधिकतम 4 यात्रियों की अनुमति होती है।' },
      { q: 'वरिष्ठ नागरिक (Senior Citizen) रियायत के लिए क्या नियम है?', a: 'सीनियर सिटीजन विकल्प चुनने पर यात्रा के समय सरकारी पहचान पत्र (आधार कार्ड, वोटर आईडी) साथ रखना अनिवार्य होता है।' }
    ]
  },
  {
    slug: 'railway-ticket-cancellation-form-pdf',
    tool_target: 'railway-form',
    meta_title: 'Railway Ticket Cancellation Form PDF Download Online | PRS Counter Slip',
    meta_description: 'Download and fill official Indian Railways Ticket Cancellation Requisition Slip in clean A4 PDF format for PRS station counter ticket refund and cancellation.',
    h1_title: 'Railway Ticket Cancellation Form PDF Maker',
    hero_subtitle: 'Fill your PNR number, train details, and passenger names to get the official Indian Railways cancellation requisition slip in PDF.',
    context_paragraph: 'Tickets purchased directly at railway station PRS counters cannot be cancelled online through IRCTC unless surrendered at the counter within the prescribed time limits before train departure. To claim a refund, passengers must fill out the official cancellation requisition form with the 10-digit PNR number. Use this tool to generate a neat, error-free cancellation slip ready for counter submission.',
    how_to: [
      'Switch the form type above to "रद्दीकरण / Cancellation".',
      'Enter your 10-digit PNR Number and Train details.',
      'Enter the names and details of passengers whose tickets are to be cancelled.',
      'Provide applicant contact details and click Download PDF.'
    ],
    faqs: [
      { q: 'Can counter tickets be cancelled using this form?', a: 'Yes. Take this printed cancellation slip along with your original printed railway ticket to the PRS counter to receive your cash refund.' },
      { q: 'What is the time limit for cancelling a counter ticket?', a: 'Confirmed tickets must be cancelled at least 4 hours before scheduled train departure. RAC or waitlisted tickets can be cancelled up to 30 minutes before departure.' }
    ]
  },
  {
    slug: 'tatkal-reservation-form-pdf-download',
    tool_target: 'railway-form',
    meta_title: 'Tatkal Ticket Reservation Form PDF Maker Online (Ready-to-Print A4)',
    meta_description: 'Fill and print Tatkal train reservation form PDF online for PRS station counters. Exact official format with 4-passenger limit and fast printout.',
    h1_title: 'Tatkal Ticket Reservation Form PDF Maker',
    hero_subtitle: 'Be prepared for 10:00 AM & 11:00 AM Tatkal counter rush. Fill and print your official booking form in advance to avoid last-second delays.',
    context_paragraph: 'Tatkal tickets at railway station counters are booked on a first-come, first-served basis within minutes of the counter opening at 10:00 AM for AC classes and 11:00 AM for Non-AC classes. Hand-writing forms at the ticket window often results in missing your Tatkal quota. Prepare and print your official Tatkal reservation slip in advance with all passenger names, train number, and mobile number neatly printed.',
    how_to: [
      'Enter your Train Number, travel date, and class (3A, 2A, or SL).',
      'Add up to 4 passengers (maximum allowed under Tatkal rules).',
      'Enter the applicant name matching the government ID of one of the passengers.',
      'Print the generated A4 PDF and submit it at the counter right when Tatkal booking opens.'
    ],
    faqs: [
      { q: 'How many passengers are allowed on a Tatkal form?', a: 'Indian Railways strictly limits Tatkal bookings to a maximum of 4 passengers per requisition form.' },
      { q: 'What time does Tatkal booking start at the counter?', a: 'Tatkal counter booking opens at 10:00 AM for AC classes (1A, 2A, 3A, CC, 3E) and at 11:00 AM for Non-AC classes (Sleeper) one day prior to the train departure date.' }
    ]
  },

  // ==========================================
  // 2. SARKARI BIO-DATA & RESUME IN HINDI & REGIONAL QUERIES
  // ==========================================
  {
    slug: 'naukri-ke-liye-biodata-format-hindi-pdf',
    tool_target: 'biodata-maker',
    meta_title: 'नौकरी के लिए बायोडाटा फॉर्मेट PDF Download - 1 Page Job Resume Format',
    meta_description: 'सरकारी व प्राइवेट नौकरी के लिए 1 पेज का सरल और सुंदर बायोडाटा ऑनलाइन बनाएं। शैक्षणिक योग्यता, व्यक्तिगत विवरण भरें और तुरंत A4 PDF डाउनलोड करें।',
    h1_title: 'नौकरी के लिए बायोडाटा फॉर्मेट ऑनलाइन बनाएं (PDF)',
    hero_subtitle: 'सरकारी संविदा भर्ती, क्लर्क, पुलिस रैली और प्राइवेट जॉब के लिए मानक 1-पेज बायोडाटा 2 मिनट में तैयार करें।',
    context_paragraph: 'भारतीय सरकारी विभागों (जैसे संविदा भर्ती, आंगनवाड़ी, चपरासी, क्लर्क, सुरक्षा गार्ड) और निजी कंपनियों में इंटरव्यू के लिए एक साफ-सुथरे 1-पेज बायोडाटा की आवश्यकता होती है। साइबर कैफे में ₹50-₹100 खर्च करने के बजाय, आप अपने मोबाइल से नाम, पिता का नाम, जन्मतिथि, 10वीं/12वीं/ग्रेजुएशन के अंक और फोटो जोड़कर आधिकारिक बायोडाटा PDF मुफ्त डाउनलोड कर सकते हैं।',
    how_to: [
      'ऊपर दिए गए टूल में अपना पूरा नाम, पिता का नाम, जन्मतिथि और पता दर्ज करें।',
      'अपनी शैक्षणिक योग्यता (10वीं, 12वीं, डिग्री) और प्रतिशत भरें।',
      'अपनी फोटो अपलोड करें (वैकल्पिक)।',
      '"Download 1-Page Bio-Data PDF" बटन दबाएं और प्रिंट निकालें।'
    ],
    faqs: [
      { q: 'क्या यह बायोडाटा सरकारी नौकरियों के इंटरव्यू में मान्य है?', a: 'हाँ, इसमें सरकारी भर्ती बोर्ड द्वारा मांगे जाने वाले सभी मानक कॉलम (व्यक्तिगत विवरण, शैक्षणिक योग्यता तालिका, घोषणा पत्र और हस्ताक्षर स्थान) शामिल हैं।' },
      { q: 'क्या मैं इसे अपने मोबाइल से डाउनलोड कर सकता हूँ?', a: 'हाँ, यह टूल बिना किसी ऐप को इंस्टॉल किए किसी भी मोबाइल ब्राउज़र में पूरी तरह काम करता है।' }
    ]
  },
  {
    slug: 'shaadi-ke-liye-biodata-format-in-hindi-pdf',
    tool_target: 'biodata-maker',
    meta_title: 'शादी के लिए बायोडाटा कैसे बनाएं PDF - विवाह बायोडाटा फॉर्मेट हिंदी में',
    meta_description: 'विवाह प्रस्ताव के लिए सुंदर और आकर्षक बायोडाटा ऑनलाइन बनाएं। नाम, गोत्र, राशि, कद, शिक्षा, पारिवारिक विवरण और फोटो जोड़कर A4 PDF डाउनलोड करें।',
    h1_title: 'शादी के लिए विवाह बायोडाटा फॉर्मेट ऑनलाइन बनाएं',
    hero_subtitle: 'व्हाट्सएप पर सादा मैसेज भेजने के बजाय सुंदर और पेशेवर A4 विवाह बायोडाटा PDF बनाएं और सीधे शेयर करें।',
    context_paragraph: 'रिश्ते की बात आगे बढ़ाने के लिए एक सुंदर और विस्तृत विवाह बायोडाटा होना बहुत जरूरी है। व्हाट्सएप पर बिखरी हुई जानकारी भेजने के बजाय एक सुव्यवस्थित A4 साइज का रंगीन बायोडाटा बहुत अच्छा प्रभाव छोड़ता है। इसमें आप अपनी फोटो, कद, रंग, जाति, गोत्र, मांगलिक स्थिति, पढ़ाई, नौकरी और पारिवारिक पृष्ठभूमि को गरिमापूर्ण तरीके से दर्शा सकते हैं।',
    how_to: [
      '"Matrimonial / Marriage Bio-Data" विकल्प को चुनें।',
      'अपना नाम, जन्म समय, जन्म स्थान, कद और गोत्र दर्ज करें।',
      'शिक्षा और वर्तमान कार्य/मासिक आय की जानकारी भरें।',
      'पारिवारिक पृष्ठभूमि (माता-पिता का व्यवसाय, भाई-बहन) जोड़ें और साफ फोटो लगाकर PDF डाउनलोड करें।'
    ],
    faqs: [
      { q: 'क्या विवाह बायोडाटा को व्हाट्सएप पर आसानी से भेज सकते हैं?', a: 'हाँ! डाउनलोड किया गया PDF बहुत हल्का और उच्च गुणवत्ता वाला होता है, जिसे सीधे व्हाट्सएप पर शेयर किया जा सकता है।' },
      { q: 'क्या मेरी निजी जानकारी या फोटो इंटरनेट पर सुरक्षित है?', a: 'पूरी तरह सुरक्षित है। DesiPDF पर बायोडाटा सीधे आपके मोबाइल/कंप्यूटर ब्राउज़र में प्रोसेस होता है और किसी सर्वर पर स्टोर नहीं किया जाता।' }
    ]
  },

  // ==========================================
  // 3. BULK JPG TO WEBP & IMAGE COMPRESSION (ENGLISH & HINDI)
  // ==========================================
  {
    slug: 'bulk-jpg-to-webp-converter-online',
    tool_target: 'jpg-to-webp',
    meta_title: 'Bulk JPG to WEBP Converter Online (Batch Convert Images to WEBP)',
    meta_description: 'Convert multiple JPG, PNG, and JPEG images to Google next-gen WEBP format simultaneously. Reduce file size up to 50% with 1-click ZIP download.',
    h1_title: 'Bulk JPG to WEBP Converter Online',
    hero_subtitle: 'Batch convert dozens of images to lightweight, next-gen WEBP format in seconds. 100% private, browser-based, and fast.',
    context_paragraph: 'Converting images one by one is exhausting for web developers, blog owners, and graphic designers. WEBP provides superior lossless and lossy compression, shrinking images by 30% to 50% compared to JPG without visible quality drop. Our bulk conversion tool allows you to drag-and-drop multiple images simultaneously, adjust quality in real time, and download the entire converted batch in a single ZIP file.',
    how_to: [
      'Drag and drop multiple JPG or PNG images into the upload area above.',
      'Adjust the WEBP quality slider (80% recommended for optimal balance).',
      'Click "Convert All to WEBP" to process all images in parallel.',
      'Click "Download All as ZIP" to get all converted WEBP files instantly.'
    ],
    faqs: [
      { q: 'Why should I convert my JPG images to WEBP?', a: 'WEBP images load up to 2x faster on websites, improving your Google PageSpeed scores, Core Web Vitals, and mobile user experience while saving server bandwidth.' },
      { q: 'How many images can I convert at once?', a: 'Free accounts can convert single images with zero limits, while Pro accounts can batch convert dozens of images simultaneously and download them in 1-click ZIP format.' }
    ]
  },
  {
    slug: 'photo-ko-webp-me-kaise-badle-hindi',
    tool_target: 'jpg-to-webp',
    meta_title: 'फोटो को WEBP में कैसे बदलें - JPG से WEBP कनवर्टर ऑनलाइन फ्री',
    meta_description: 'JPG और PNG फोटो को आधुनिक WEBP फॉर्मेट में मुफ्त बदलें। फोटो की साइज 50% तक कम करें बिना किसी क्वालिटी नुकसान के। तेज और सुरक्षित कनवर्टर।',
    h1_title: 'फोटो को WEBP फॉर्मेट में ऑनलाइन बदलें',
    hero_subtitle: 'JPG या PNG फोटो को तुरंत आधुनिक Google WEBP फॉर्मेट में कनवर्ट करें। वेबसाइट और मोबाइल में सुपरफास्ट लोड होगी फोटो।',
    context_paragraph: 'WEBP गूगल द्वारा विकसित एक आधुनिक इमेज फॉर्मेट है जो सामान्य JPG फोटो की तुलना में 30% से 50% कम मेमोरी लेता है जबकि फोटो की स्पष्टता बिल्कुल वैसी ही रहती है। यदि आप अपनी वेबसाइट की स्पीड बढ़ाना चाहते हैं या फोटो का साइज घटाना चाहते हैं, तो DesiPDF के इस मुफ्त ऑनलाइन टूल से किसी भी फोटो को सेकंडों में WEBP में बदल सकते हैं।',
    how_to: [
      'अपनी JPG या PNG फोटो को अपलोड करें।',
      'क्वालिटी स्लाइडर से कम्प्रेशन सेट करें (80% सबसे उत्तम है)।',
      '"Convert to WEBP" बटन पर क्लिक करें।',
      'कनवर्ट की गई WEBP फोटो को तुरंत डाउनलोड करें।'
    ],
    faqs: [
      { q: 'क्या WEBP फोटो सभी मोबाइल और कंप्यूटर में खुलती है?', a: 'हाँ, आज के सभी आधुनिक ब्राउज़र (Google Chrome, Safari, Edge, Firefox, Android, iOS) WEBP फॉर्मेट को पूरी तरह सपोर्ट करते हैं।' },
      { q: 'क्या फोटो को WEBP में बदलने से क्वालिटी खराब होती है?', a: 'नहीं! WEBP का एडवांस कम्प्रेशन एल्गोरिदम बिना किसी दिखाई देने वाले नुकसान के फोटो की साइज को आधा कर देता है।' }
    ]
  }
];

async function insertPages() {
  console.log(`Inserting ${newPages.length} high-value SEO pages...`);

  const { data, error } = await supabase
    .from('seo_pages')
    .upsert(newPages, { onConflict: 'slug' });

  if (error) {
    console.error('Error inserting SEO pages:', error);
  } else {
    console.log('✅ Successfully inserted all 8 high-value SEO pages into Supabase!');
  }
}

insertPages();
