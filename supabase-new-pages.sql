INSERT INTO seo_pages (slug, tool_target, meta_title, meta_description, h1_title, hero_subtitle, context_paragraph, how_to, faqs)
VALUES
  (
    'ssc-chsl-photo-resizer', 'ssc-photo', 'SSC CHSL Photo Resizer Online | 20KB-50KB Guaranteed',
    'Resize your SSC CHSL application photo to exact 20KB-50KB format. Free tool built for Combined Higher Secondary Level exam applicants.',
    'SSC CHSL Photo Resizer', 'Preparing for SSC CHSL? Get your application photo perfectly sized in seconds.',
    'The Combined Higher Secondary Level (CHSL) examination conducted by SSC requires candidates to upload a JPEG photograph between 20KB and 50KB with dimensions of 3.5cm x 4.5cm. Many aspirants waste hours trying to manually resize photos using generic editors. Our purpose-built tool uses intelligent compression to hit the exact size window on the first attempt.',
    array_to_json(ARRAY['Take a passport-size photo against a white background.', 'Upload it to our CHSL photo resizer.', 'The tool automatically crops to 3.5cm x 4.5cm and targets 20KB-50KB.', 'Download and upload directly to the SSC CHSL application portal.'])::jsonb,
    jsonb_build_array(
      jsonb_build_object('q', 'Is the SSC CHSL photo size different from CGL?', 'a', 'No, both SSC CGL and CHSL require the exact same 20KB to 50KB JPEG format with identical dimensions.'),
      jsonb_build_object('q', 'Can I use a phone selfie for SSC CHSL?', 'a', 'Yes, as long as your face is clearly visible, centered, and taken against a plain white or light background.'),
      jsonb_build_object('q', 'What if my photo is below 20KB after compression?', 'a', 'Our algorithm ensures the output always falls within the 20KB-50KB range. It will never compress below the minimum threshold.')
    )
  ),
  (
    'ssc-mts-photo-signature-upload', 'ssc-photo', 'SSC MTS Photo & Signature Upload Tool | Free Online',
    'Prepare your SSC MTS application photo and signature with exact pixel dimensions and file size. Works on mobile and desktop.',
    'SSC MTS Photo & Signature Tool', 'Multi-Tasking Staff exam requires precise uploads. Get both photo and signature right here.',
    'The SSC Multi-Tasking Staff (MTS) exam has identical photo requirements to other SSC exams but many first-time government job applicants from rural areas struggle with the technical specifications. Our tool is designed to be simple enough for anyone to use on any device, including budget smartphones. Just upload your photo and we handle the rest.',
    array_to_json(ARRAY['Upload your recent passport photo taken with any camera.', 'We auto-detect face position and crop to official dimensions.', 'The smart compressor targets the 20KB-50KB sweet spot.', 'Download the optimized file and paste it into the SSC MTS form.'])::jsonb,
    jsonb_build_array(
      jsonb_build_object('q', 'Does this work on Jio phones?', 'a', 'Yes, our tool runs entirely in the web browser and works on any device with a modern browser including JioPhone and basic Android phones.'),
      jsonb_build_object('q', 'Can I prepare my signature here too?', 'a', 'Yes, upload a photo of your signature on white paper and we will compress it to the required specifications.')
    )
  ),
  (
    'ibps-clerk-photo-compressor', 'ssc-photo', 'IBPS Clerk Photo Compressor | 20KB-50KB Online Tool',
    'Compress your IBPS Clerk application photo to the required 20KB-50KB JPEG format. Instant processing, no signup needed.',
    'IBPS Clerk Photo Compressor', 'Banking exam aspirants: get your IBPS Clerk photo compressed to the exact portal requirement.',
    'The Institute of Banking Personnel Selection (IBPS) Clerk recruitment attracts over 30 lakh applicants annually. Every single one needs to upload a photograph meeting strict size guidelines. Our compressor is specifically calibrated for IBPS requirements: JPEG format, 200x230 pixels, file size between 20KB and 50KB.',
    array_to_json(ARRAY['Click a clear headshot with white background.', 'Upload the image to our IBPS Clerk compressor.', 'We resize to 200x230 pixels and compress to 20KB-50KB.', 'Download and upload to the IBPS online application.'])::jsonb,
    jsonb_build_array(
      jsonb_build_object('q', 'What is the difference between IBPS PO and Clerk photo requirements?', 'a', 'Both IBPS PO and Clerk exams require the same photo specifications: 200x230 pixels, 20KB-50KB JPEG format.'),
      jsonb_build_object('q', 'My IBPS photo keeps getting rejected. Why?', 'a', 'The most common reasons are file size exceeding 50KB, wrong aspect ratio, or a colored background instead of white. Our tool fixes all three automatically.')
    )
  ),
  (
    'aadhaar-pdf-size-reducer', 'aadhaar-unlock', 'Reduce Aadhaar PDF Size Online | Under 500KB Free',
    'Shrink your Aadhaar card PDF to under 500KB for easy upload to government portals and bank KYC forms.',
    'Aadhaar PDF Size Reducer', 'Your e-Aadhaar PDF is too large? Shrink it instantly without losing print quality.',
    'The official e-Aadhaar downloaded from UIDAI is typically 1-3MB in size. Many government portals and corporate KYC forms enforce a strict 500KB or even 200KB upload limit. Our tool decrypts your locked Aadhaar, strips unnecessary metadata, and recompresses the internal images to produce a dramatically smaller file that still prints perfectly.',
    array_to_json(ARRAY['Upload your e-Aadhaar PDF (locked or unlocked).', 'Enter the password if the file is locked.', 'Our engine removes encryption and recompresses internal images.', 'Download your lightweight Aadhaar PDF ready for any portal.'])::jsonb,
    jsonb_build_array(
      jsonb_build_object('q', 'Will the QR code on my Aadhaar still work after compression?', 'a', 'Yes, our compression targets only the photo and background graphics. The QR code data remains intact and scannable.'),
      jsonb_build_object('q', 'Is this different from just unlocking the PDF?', 'a', 'Yes. Unlocking only removes the password. Our size reducer also compresses the internal images to make the file dramatically smaller for easier uploading.')
    )
  ),
  (
    'driving-license-to-pdf', 'voter-id-pdf', 'Driving License to PDF Converter | Under 100KB',
    'Convert your driving license photo into a compressed PDF document under 100KB for KYC and government portal submissions.',
    'Driving License to PDF Converter', 'Turn your physical DL into a clean, compressed digital PDF for instant KYC submissions.',
    'Banks, insurance companies, and government portals frequently ask for a scanned copy of your Driving License in PDF format. Most phone photos of a DL card result in 2-5MB files that get rejected by upload forms. Our converter places your DL image onto a professional A4 layout and compresses it to sit well under the 100KB limit.',
    array_to_json(ARRAY['Take a clear photo of your Driving License on a flat surface.', 'Upload the image to our converter.', 'We format it onto an A4 page with a clean white border.', 'Download the compressed PDF guaranteed to be under 100KB.'])::jsonb,
    jsonb_build_array(
      jsonb_build_object('q', 'Should I photograph the front and back of my DL?', 'a', 'Most KYC forms only require the front side. If both sides are needed, use our PAN Card Merger tool which supports any two-sided ID card.'),
      jsonb_build_object('q', 'What resolution should my DL photo be?', 'a', 'Any modern smartphone camera is sufficient. Just ensure good lighting and avoid shadows or glare on the card.')
    )
  ),
  (
    'passport-photo-4x6-maker', 'passport-maker', 'Passport Photo 4x6 Maker Online | Print Ready',
    'Create print-ready 4x6 inch passport photo sheets at home. Arrange multiple photos on a single sheet to save money.',
    'Passport Photo 4x6 Sheet Maker', 'Why pay Rs 200 at a studio? Create your own passport photo print sheet at home for free.',
    'Professional photo studios charge Rs 100-300 for a set of passport photos that cost them practically nothing to print. Our tool lets you upload a single passport photo, automatically arranges 8 copies on a standard 4x6 inch photo paper layout, and gives you a high-resolution file ready to print at any photo kiosk for just Rs 5-10.',
    array_to_json(ARRAY['Upload a single passport-size photo with white background.', 'Our system arranges 8 copies on a 4x6 inch print layout.', 'Download the high-resolution print-ready image.', 'Print at any nearby photo shop or home printer for Rs 5-10.'])::jsonb,
    jsonb_build_array(
      jsonb_build_object('q', 'How many photos fit on a 4x6 sheet?', 'a', 'We arrange 8 standard passport-size photos (3.5cm x 4.5cm) on a single 4x6 inch sheet, which is the standard size accepted by all photo printing kiosks in India.'),
      jsonb_build_object('q', 'Can I use this for visa application photos?', 'a', 'Yes, the output is high-resolution enough for visa applications. Just ensure your original photo meets the specific visa photo guidelines of the country you are applying to.')
    )
  ),
  (
    'compress-pdf-under-1mb', 'pdf-compress', 'Compress PDF Under 1MB Online | Free PDF Reducer',
    'Reduce any PDF file size to under 1MB instantly. Perfect for email attachments and government portal uploads.',
    'Compress PDF Under 1MB', 'Need to email a large PDF? Compress it to under 1MB in seconds without losing readability.',
    'Email services like Gmail limit attachments to 25MB, and many government and corporate portals enforce even stricter limits of 1MB, 2MB, or 5MB. Our PDF compressor uses advanced image downsampling and stream optimization to dramatically reduce file size while maintaining text sharpness and image clarity.',
    array_to_json(ARRAY['Upload your large PDF file.', 'Select your target quality level.', 'Our engine recompresses images and strips unused metadata.', 'Download your compressed PDF, guaranteed to be dramatically smaller.'])::jsonb,
    jsonb_build_array(
      jsonb_build_object('q', 'Will compression affect the text quality?', 'a', 'No. Text in PDFs is vector-based and remains perfectly sharp. Only embedded images are recompressed, and we use a high-quality algorithm that preserves readability.'),
      jsonb_build_object('q', 'Can I compress a scanned document?', 'a', 'Yes, scanned documents are primarily images, so our compressor is especially effective on them. Expect 50-80% file size reduction.')
    )
  ),
  (
    'compress-pdf-under-500kb', 'pdf-compress', 'Compress PDF to 500KB | Free Online Tool',
    'Shrink PDF files to under 500KB for strict government portal upload limits. Secure, fast, and runs locally.',
    'Compress PDF to 500KB', 'Government portal rejecting your PDF? Compress it to under 500KB while keeping it readable.',
    'Many Indian government portals like DigiLocker, UMANG, and state employment exchanges enforce a strict 500KB limit on PDF uploads. Our aggressive compression mode targets this exact threshold. The tool processes everything locally in your browser so your sensitive documents like marksheets and certificates never leave your device.',
    array_to_json(ARRAY['Upload the PDF that exceeds the 500KB limit.', 'Our tool automatically detects the optimal compression ratio.', 'Internal images are aggressively optimized while text stays sharp.', 'Download your sub-500KB PDF and upload it to any portal.'])::jsonb,
    jsonb_build_array(
      jsonb_build_object('q', 'Is there a minimum quality I can expect?', 'a', 'Yes, we never compress below a readable threshold. All text remains crisp and images remain identifiable even at maximum compression.'),
      jsonb_build_object('q', 'Does this work for marksheets and certificates?', 'a', 'Absolutely. Scanned marksheets and certificates are the most common use case. Our tool handles them perfectly.')
    )
  ),
  (
    'merge-aadhaar-front-back-pdf', 'pan-merge', 'Merge Aadhaar Front & Back into One PDF | Free',
    'Combine front and back sides of your Aadhaar card into a single A4 PDF page. Perfect for bank KYC and account opening.',
    'Merge Aadhaar Front & Back PDF', 'Banks asking for both sides of Aadhaar on one page? Merge them instantly.',
    'Many banks and financial institutions require you to submit both sides of your physical Aadhaar card as a single document for KYC verification. Instead of awkwardly pasting two images into a Word document, our merger tool professionally stacks both sides on a clean A4 page with proper alignment and borders.',
    array_to_json(ARRAY['Photograph the FRONT of your Aadhaar card clearly.', 'Photograph the BACK of your Aadhaar card.', 'Upload both images to our merger tool.', 'Download a single professional A4 PDF with both sides.'])::jsonb,
    jsonb_build_array(
      jsonb_build_object('q', 'Can I use this for the new PVC Aadhaar card?', 'a', 'Yes, our tool works with photos of any format of Aadhaar card including the paper letter, the PVC card, and the e-Aadhaar printout.'),
      jsonb_build_object('q', 'What if my photos are slightly tilted?', 'a', 'Minor tilting is fine. Our tool places the images as-is onto the PDF. For best results, photograph the card flat on a dark surface.')
    )
  ),
  (
    'pdf-to-jpg-high-quality', 'pdf-to-jpg', 'Convert PDF to JPG High Quality | Free Online',
    'Extract high-resolution JPG images from any PDF file. Perfect for saving individual pages as photos.',
    'PDF to JPG High Quality Converter', 'Need to share a PDF page as an image? Convert any PDF to crystal-clear JPG photos.',
    'Sometimes you need to share a specific page from a PDF as an image on WhatsApp, Instagram, or in a presentation. Our converter renders each PDF page at high resolution (300 DPI) and exports it as a clean JPG file. Unlike screenshot tools, this produces print-quality images without any browser chrome or UI elements.',
    array_to_json(ARRAY['Upload any PDF file from your device.', 'Each page is rendered at 300 DPI resolution.', 'Select which pages you want to download as JPG.', 'Save high-quality JPG images to your device.'])::jsonb,
    jsonb_build_array(
      jsonb_build_object('q', 'What resolution are the JPG images?', 'a', 'We render at 300 DPI which is print quality. The resulting images are sharp enough for professional printing and presentations.'),
      jsonb_build_object('q', 'Can I convert a 100-page PDF?', 'a', 'Yes, but since processing happens in your browser, very large PDFs may take a few minutes. We recommend converting in smaller batches for the best experience.')
    )
  ),
  (
    'split-pdf-pages-online', 'pdf-split', 'Split PDF Pages Online | Extract Specific Pages Free',
    'Extract specific pages from any PDF file. Split large documents into smaller files instantly.',
    'Split PDF Pages Online', 'Only need page 3 and 7 from a 50-page PDF? Extract exactly the pages you need.',
    'Government offices often give you a single large PDF containing multiple documents. You might only need your marksheet from page 5, or your character certificate from page 12. Our splitter lets you select exactly which pages to extract and creates a new, clean PDF containing only those pages.',
    array_to_json(ARRAY['Upload the PDF file you want to split.', 'Preview all pages and select the ones you need.', 'Click split to extract your selected pages.', 'Download a new PDF containing only your chosen pages.'])::jsonb,
    jsonb_build_array(
      jsonb_build_object('q', 'Can I rearrange the page order?', 'a', 'Currently, pages are extracted in their original order. We are working on a drag-and-drop reorder feature for a future update.'),
      jsonb_build_object('q', 'Is there a page limit?', 'a', 'No hard limit. Since processing happens in your browser, documents up to 200 pages work smoothly on most devices.')
    )
  ),
  (
    'merge-multiple-pdf-files', 'pdf-merge', 'Merge Multiple PDF Files Online | Combine PDFs Free',
    'Combine 2 or more PDF files into a single document. Perfect for merging marksheets, certificates, and ID proofs.',
    'Merge Multiple PDF Files', 'Combine all your documents into one clean PDF for college admissions and job applications.',
    'College admissions, scholarship applications, and government job submissions often require you to upload all your documents as a single PDF file. Our merger lets you combine marksheets, certificates, ID proofs, and photos into one professional document in the exact order you want.',
    array_to_json(ARRAY['Upload all the PDF files you want to merge.', 'Drag and drop to arrange them in your preferred order.', 'Click merge to combine them into a single document.', 'Download your combined PDF ready for submission.'])::jsonb,
    jsonb_build_array(
      jsonb_build_object('q', 'Is there a limit on how many PDFs I can merge?', 'a', 'You can merge up to 20 PDF files at once. For larger batches, simply merge in groups and then merge the results.'),
      jsonb_build_object('q', 'Will the file size be too large after merging?', 'a', 'The merged file size is roughly the sum of individual files. If needed, use our PDF compressor afterward to reduce the size.')
    )
  ),
  (
    'ration-card-to-pdf', 'voter-id-pdf', 'Ration Card to PDF Converter | Under 100KB',
    'Convert your ration card photo into a clean PDF document under 100KB for government portal submissions.',
    'Ration Card to PDF Converter', 'Digitize your ration card into a professional PDF for government scheme applications.',
    'Applying for Ayushman Bharat, PM Kisan Samman Nidhi, or state welfare schemes often requires uploading your ration card as a PDF. Our converter takes a simple phone photo of your ration card, places it on a clean A4 layout, and compresses it to under 100KB so it passes any portal upload restriction.',
    array_to_json(ARRAY['Take a clear photo of your ration card page.', 'Upload it to our converter tool.', 'We format it professionally on an A4 page.', 'Download your compressed PDF under 100KB.'])::jsonb,
    jsonb_build_array(
      jsonb_build_object('q', 'My ration card has multiple pages. Can I convert all of them?', 'a', 'Upload each page separately and then use our PDF merger tool to combine them into a single document.'),
      jsonb_build_object('q', 'Will the details be readable after compression?', 'a', 'Yes, our compression algorithm preserves text readability. All names, numbers, and details remain clearly visible.')
    )
  ),
  (
    'jee-main-photo-signature-resizer', 'ssc-photo', 'JEE Main Photo & Signature Resizer | NTA Guidelines',
    'Resize your JEE Main application photo and signature to exact NTA specifications. JPG format, 10KB-200KB.',
    'JEE Main Photo & Signature Resizer', 'Engineering aspirants: do not let a rejected photo delay your JEE Main application.',
    'The National Testing Agency (NTA) requires JEE Main candidates to upload a passport-size photograph (10KB to 200KB in JPG) and a signature scan (4KB to 30KB in JPG). The photo must have a white background with 80% face coverage. Our tool is specifically tuned for these NTA JEE specifications.',
    array_to_json(ARRAY['Upload your passport-size photo with white background.', 'We verify face coverage and crop to the required ratio.', 'Smart compression targets the 10KB-200KB NTA range.', 'Download and upload directly to the JEE Main application form.'])::jsonb,
    jsonb_build_array(
      jsonb_build_object('q', 'Are JEE Main and JEE Advanced photo requirements the same?', 'a', 'JEE Advanced has slightly different specifications. However, a photo prepared for JEE Main typically works for Advanced as well since the size ranges overlap.'),
      jsonb_build_object('q', 'Can I wear spectacles in my JEE photo?', 'a', 'NTA recommends avoiding spectacles to prevent glare. If you must wear them, ensure there is no reflection on the lenses.')
    )
  ),
  (
    'gate-exam-photo-compressor', 'ssc-photo', 'GATE Exam Photo Compressor | IIT Upload Ready',
    'Compress your GATE exam application photo to meet IIT GOAPS portal requirements. Free and instant.',
    'GATE Exam Photo Compressor', 'Applying for GATE? Ensure your photo meets GOAPS portal specifications perfectly.',
    'The Graduate Aptitude Test in Engineering (GATE) is conducted by different IITs each year and uses the GOAPS (GATE Online Application Processing System) portal. The photo must be a recent passport-size photograph in JPEG format with file size between 5KB and 200KB. Our compressor is calibrated for these exact limits.',
    array_to_json(ARRAY['Upload a recent passport-size photo with light background.', 'Our algorithm auto-adjusts dimensions for GOAPS requirements.', 'File size is compressed to the 5KB-200KB GATE specification.', 'Download and upload to the GOAPS portal instantly.'])::jsonb,
    jsonb_build_array(
      jsonb_build_object('q', 'Does GATE accept digital photos or only scanned prints?', 'a', 'GATE accepts both. A clear digital photo taken with a smartphone against a white wall works perfectly when processed through our tool.'),
      jsonb_build_object('q', 'I am applying for multiple GATE papers. Do I need separate photos?', 'a', 'No, the same photo works for all GATE papers. Prepare it once using our tool and reuse it across applications.')
    )
  );
