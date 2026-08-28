DROP TABLE IF EXISTS seo_pages;

CREATE TABLE seo_pages (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  slug text UNIQUE NOT NULL,
  tool_target text NOT NULL,
  meta_title text NOT NULL,
  meta_description text NOT NULL,
  h1_title text NOT NULL,
  hero_subtitle text NOT NULL,
  context_paragraph text NOT NULL,
  how_to jsonb NOT NULL,
  faqs jsonb NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE seo_pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access" 
  ON seo_pages FOR SELECT 
  USING (true);

INSERT INTO seo_pages (slug, tool_target, meta_title, meta_description, h1_title, hero_subtitle, context_paragraph, how_to, faqs)
VALUES 
  (
    'ssc-cgl-photo-compressor', 'ssc-photo', 'SSC CGL Photo Compressor Online | Exact 20KB-50KB Tool', 
    'Compress and resize your SSC CGL application photo to exact 20KB to 50KB limits. Free online tool specifically designed for Staff Selection Commission exams.', 
    'SSC CGL Photo Compressor', 'Don''t let your SSC application get rejected. Resize your image exactly to the 20KB - 50KB strict limit instantly.', 
    'The Staff Selection Commission (SSC) has strict guidelines for uploading photographs. Your image must be in JPEG format, sized between 20KB and 50KB, and should ideally be 3.5cm x 4.5cm. Our tool uses a specialized binary search algorithm to guarantee your final file hits these exact requirements without losing visual clarity.',
    array_to_json(ARRAY['Upload your raw phone selfie or scanned photo.', 'Our system will instantly convert it to the required 3.5cm x 4.5cm aspect ratio.', 'The tool analyzes the file size and compresses it to land perfectly between 20KB and 50KB.', 'Download your SSC-ready photo and upload it safely to the portal.'])::jsonb,
    jsonb_build_array(
      jsonb_build_object('q', 'What happens if my SSC photo is above 50KB?', 'a', 'The SSC upload portal will simply throw an error and reject the file, preventing you from submitting your CGL application.'), 
      jsonb_build_object('q', 'Does this tool work for SSC CHSL and MTS too?', 'a', 'Yes! All SSC exams use the exact same 20KB-50KB dimension guidelines.')
    )
  ),
  (
    'upsc-image-resizer-online', 'ssc-photo', 'UPSC Image & Signature Resizer | Fast & Free', 
    'Resize your UPSC exam photograph and signature to fit the official guidelines. Fast, secure, and runs locally on your device.', 
    'UPSC Exam Image Resizer', 'Ensure your UPSC photograph meets all strict dimensional and file size requirements in one click.', 
    'Applying for the Union Public Service Commission (UPSC) exams requires absolute precision with document uploads. Photos that are too blurry, too large, or incorrectly formatted can lead to application cancellation. Use our specialized UPSC resizer to guarantee your image passes portal validation.',
    array_to_json(ARRAY['Upload your original portrait photograph.', 'Ensure your face is clearly visible without glasses or hats.', 'Click compress and let our algorithm hit the exact KB target required by UPSC.', 'Download your perfectly formatted JPEG.'])::jsonb,
    jsonb_build_array(
      jsonb_build_object('q', 'Is it safe to upload my photo here?', 'a', '100% safe. Your photo is processed entirely within your web browser using HTML5 Canvas. It never touches our servers.'), 
      jsonb_build_object('q', 'Can I resize my signature here too?', 'a', 'Yes, you can upload your scanned signature and compress it to the required limits.')
    )
  ),
  (
    'ibps-po-signature-resizer', 'ibps-sign', 'IBPS PO Signature Resizer | 140x60 Pixels (10KB - 20KB)', 
    'Crop and compress your signature for IBPS PO and Clerk exams. Exact 140x60 dimensions and 10-20KB file size limits guaranteed.', 
    'IBPS Signature Optimizer', 'Crop and compress your handwritten signature to the strict 140x60 pixel dimensions required by IBPS banking exams.', 
    'The Institute of Banking Personnel Selection (IBPS) has notoriously strict signature requirements. It must be written with a black ink pen, scanned clearly, sized exactly to 140x60 pixels, and kept between 10KB and 20KB. Our tool handles all of this math for you instantly.',
    array_to_json(ARRAY['Sign your name on white paper using a black pen and take a clear photo.', 'Upload the image to our IBPS optimizer.', 'We will automatically crop it to the required 140x60 aspect ratio.', 'The tool compresses the ink signature to the 10KB - 20KB safe zone.'])::jsonb,
    jsonb_build_array(
      jsonb_build_object('q', 'Can I use blue ink for IBPS?', 'a', 'IBPS officially recommends using black ink for maximum clarity during the scanning process.'), 
      jsonb_build_object('q', 'Why is my signature getting rejected?', 'a', 'Usually, it is because the file size is over 20KB or the aspect ratio is not 140x60. Our tool fixes both.')
    )
  ),
  (
    'remove-eaadhaar-password-online', 'aadhaar-unlock', 'Remove e-Aadhaar PDF Password Online | Free Unlocker', 
    'Permanently unlock your e-Aadhaar PDF so you can print it or share it with banks. 100% secure, local browser processing.', 
    'Remove e-Aadhaar Password', 'Enter your 8-character Aadhaar password once, and instantly download a permanently unlocked, easy-to-print PDF.', 
    'When you download your Aadhaar card from the official UIDAI website, it is locked with a master password (usually the first 4 letters of your name in ALL CAPS + your birth year). Constantly typing this password to print or share the file is frustrating. Our unlocker permanently removes this encryption locally on your device.',
    array_to_json(ARRAY['Upload your locked e-Aadhaar PDF file.', 'Type your official UIDAI password (e.g., AMIT1990).', 'Our system instantly decrypts the PDF directly inside your browser.', 'Download your clean, unlocked PDF ready for sharing or printing.'])::jsonb,
    jsonb_build_array(
      jsonb_build_object('q', 'Do you save my Aadhaar password?', 'a', 'No. Everything runs strictly in your local browser memory. We have no servers to save your data to.'), 
      jsonb_build_object('q', 'Is this legal?', 'a', 'Yes, you are simply removing encryption from your own personal document for easier printing.')
    )
  ),
  (
    'voter-id-to-100kb-pdf', 'voter-id-pdf', 'Voter ID to 100KB PDF Converter | DesiPDF', 
    'Convert your Voter ID photo into an A4 PDF document strictly under the 100KB government portal limit.', 
    'Voter ID 100KB PDF Converter', 'Easily convert your physical Voter ID into a highly compressed, portal-ready digital PDF document.', 
    'Many Indian government and corporate KYC portals require you to upload your Voter ID as a PDF file, but strictly enforce a 100KB maximum limit. Our specialized tool takes your standard phone photo, formats it beautifully onto a digital A4 page, and compresses the final PDF to sit perfectly around 90KB.',
    array_to_json(ARRAY['Take a clear, well-lit photo of your Voter ID card.', 'Upload the image into our converter.', 'Our algorithm will generate a PDF and aggressively compress the image streams.', 'Download your guaranteed <100KB PDF file.'])::jsonb,
    jsonb_build_array(
      jsonb_build_object('q', 'Will the text still be readable?', 'a', 'Yes, we use an optimized JPEG compression ratio that reduces file size while preserving OCR-level readability.'), 
      jsonb_build_object('q', 'Can I use this for driving licenses too?', 'a', 'Absolutely. Any standard ID card can be converted to a 100KB PDF using this tool.')
    )
  ),
  (
    'pan-card-front-back-merger', 'pan-merge', 'Merge PAN Card Front & Back Online | KYC Ready', 
    'Combine the front and back of your PAN Card onto a single A4 PDF page for bank KYC and official submissions.', 
    'PAN Card Front & Back Merger', 'Stop struggling with Word documents. Instantly merge both sides of your PAN card onto a clean, printable A4 PDF.', 
    'Banks, telecom companies, and digital KYC verifications constantly ask for a "Scanned copy of PAN Card". Sending two separate images is unprofessional and often rejected by portals. Our tool lets you upload the Front and Back images separately, and automatically formats them perfectly stacked on a single PDF page.',
    array_to_json(ARRAY['Upload a photo of the FRONT of your PAN card.', 'Upload a photo of the BACK of your PAN card.', 'Our system will align and stack them neatly on a white background.', 'Download your professional KYC-ready PDF document.'])::jsonb,
    jsonb_build_array(
      jsonb_build_object('q', 'What is the best way to take the photos?', 'a', 'Place your PAN card on a dark, flat surface with good lighting to avoid glare.'), 
      jsonb_build_object('q', 'Is the final file compressed?', 'a', 'Yes, we ensure the merged PDF is heavily optimized so it uploads smoothly to banking apps.')
    )
  ),
  (
    'left-thumb-impression-optimizer', 'thumb-impression', 'Left Thumb Impression (LTI) Optimizer | Blue/Black Ink', 
    'Enhance faded ink, remove dark backgrounds, and resize your Thumb Impression for Indian exams (SSC, IBPS).', 
    'Left Thumb Impression (LTI) Optimizer', 'Turn a terrible, dark phone photo of your thumbprint into a perfectly white, highly visible scan.', 
    'The Left Thumb Impression (LTI) is a mandatory upload for almost every major Indian examination (UPSC, SSC, IBPS, RRB). Unfortunately, taking a photo of your thumbprint with a phone usually results in gray paper and faded ink. Our image processing tool wipes the paper background to pure white and enhances the fingerprint ridges to solid Blue or Black ink.',
    array_to_json(ARRAY['Stamp your left thumb on a piece of white paper and take a photo.', 'Upload the raw photo. You will see it looks dull and gray.', 'Use our Ink Thickness slider to darken the ridges and blast the background white.', 'Select your required ink color (Blue/Black) and download the optimized 20KB-50KB file.'])::jsonb,
    jsonb_build_array(
      jsonb_build_object('q', 'Does it matter if I use blue or black ink?', 'a', 'Check your specific exam notification. SSC usually accepts both, but some exams strictly mandate Blue ink.'), 
      jsonb_build_object('q', 'Will the biometric ridges remain clear?', 'a', 'Yes, our thresholding algorithm protects the unique biometric patterns while removing the shadow.')
    )
  ),
  (
    'neet-ug-photo-signature-compressor', 'ssc-photo', 'NEET UG Photo & Signature Compressor Tool', 
    'Optimize your NEET UG passport photo, postcard photo, and signature. Perfect sizing and KB limits guaranteed.', 
    'NEET Photo & Signature Compressor', 'Prepare your Passport photos and Postcard size photos strictly according to NTA NEET guidelines.', 
    'The National Testing Agency (NTA) is incredibly strict about NEET UG document uploads. You need Passport-size photos (10KB to 200KB) and Postcard-size photos (10KB to 200KB) with a white background. Our compressor ensures your photos are technically flawless so your admit card is generated without issues.',
    array_to_json(ARRAY['Upload your raw photograph featuring a white background.', 'Our system will handle the aspect ratio cropping.', 'We will compress the image safely into the NTA required KB range.', 'Download and upload straight to the NEET candidate portal.'])::jsonb,
    jsonb_build_array(
      jsonb_build_object('q', 'Do I need a white background for NEET?', 'a', 'Yes, NTA strictly mandates a pure white background for all candidate photographs.'), 
      jsonb_build_object('q', 'Does the photo need a date and name?', 'a', 'Usually yes, NEET guidelines recommend having your name and date of photo taken printed at the bottom.')
    )
  ),
  (
    'rrb-railway-photo-compressor', 'ssc-photo', 'RRB Railway Exam Photo Compressor', 
    'Format your photograph perfectly for Railway Recruitment Board (RRB) exams. Fast, free, and secure.', 
    'RRB Railway Photo Compressor', 'Get your RRB application photo exactly right on the first try. 20KB to 50KB exact targeting.', 
    'Applying for ALP, NTPC, or Group D? The Railway Recruitment Board (RRB) requires candidates to upload a recent color passport-size photograph with a light/white background, sized tightly between 20KB and 50KB. Our exact-size targeting algorithm ensures your photo fits without manual trial and error.',
    array_to_json(ARRAY['Upload your latest color passport photo.', 'Let the auto-cropper fix your dimensions.', 'Wait 1 second for our Binary Search compression to hit the 20-50KB mark.', 'Download your official RRB-ready image.'])::jsonb,
    jsonb_build_array(
      jsonb_build_object('q', 'Can I wear glasses in my RRB photo?', 'a', 'No, RRB heavily discourages wearing glasses. Photographs with glare on glasses are frequently rejected.'), 
      jsonb_build_object('q', 'Is the compression lossy?', 'a', 'It is a highly optimized JPEG compression. It reduces file size but keeps your facial features perfectly recognizable.')
    )
  ),
  (
    'unlock-aadhaar-card-pdf', 'aadhaar-unlock', 'Unlock Aadhaar Card PDF | Remove Password Free', 
    'Easily remove the password from your downloaded Aadhaar Card PDF file. Runs in your browser for absolute data security.', 
    'Unlock Aadhaar PDF Easily', 'Take the frustration out of your Aadhaar Card. Strip the password instantly and save a normal PDF.', 
    'Dealing with a locked Aadhaar PDF every time you need to share your ID with HR or a bank is incredibly annoying. Our fast PDF unlocker allows you to strip the 256-bit encryption from your document entirely locally. We use pdf.js to redraw your document into a standard, accessible file.',
    array_to_json(ARRAY['Select your locked Aadhaar PDF from your computer or phone.', 'Type the password (First 4 letters of name + Birth Year).', 'Click Unlock PDF.', 'Save the new, decrypted file to your device forever.'])::jsonb,
    jsonb_build_array(
      jsonb_build_object('q', 'Why is the Aadhaar locked in the first place?', 'a', 'UIDAI locks the file to prevent unauthorized access in case your email is hacked or your phone is stolen.'), 
      jsonb_build_object('q', 'Can I do this on my phone?', 'a', 'Yes, our unlocking algorithm works perfectly on iOS Safari and Android Chrome.')
    )
  );
