// Curated list of high-quality, high-demand exam & official document hubs.
// Each of these represents an official government recruitment board with distinct photo/signature rules.
export const QUALITY_EXAM_SLUGS = [
  "ssc-cgl-photo-signature-resize-online",
  "ssc-chsl-photo-and-signature-resizer",
  "upsc-image-resizer-online",
  "ibps-po-signature-resizer",
  "sbi-po-clerk-photo-signature-resizer",
  "neet-ug-postcard-size-photo-generator",
  "rrb-ntpc-photo-and-signature-resizer",
  "up-police-constable-photo-signature-resizer",
  "ctet-photo-and-signature-resizer",
  "jee-main-photo-and-signature-resizer",
  "pan-card-front-back-merger",
  "left-thumb-impression-optimizer",
  "passport-photo-4x6-maker",
  "sarkari-job-biodata-format-pdf-download",
  "marriage-biodata-maker-online-free-pdf",
  "railway-reservation-form-pdf-download-print",
];

// Specific redirects from duplicate exam slugs to the best master hub
export const SPECIFIC_SLUG_REDIRECTS = {
  "ssc-cgl-photo-compressor": "/tool/ssc-cgl-photo-signature-resize-online",
  "ssc-chsl-photo-resizer": "/tool/ssc-chsl-photo-and-signature-resizer",
  "rrb-railway-photo-compressor": "/tool/rrb-ntpc-photo-and-signature-resizer",
  "rrb-alp-technician-photo-resizer": "/tool/rrb-ntpc-photo-and-signature-resizer",
  "neet-ug-photo-signature-compressor": "/tool/neet-ug-postcard-size-photo-generator",
  "neet-passport-size-photo-maker": "/tool/neet-ug-postcard-size-photo-generator",
  "ibps-po-clerk-photo-signature-resizer": "/tool/ibps-po-signature-resizer",
  "ibps-clerk-photo-compressor": "/tool/ibps-po-signature-resizer",
  "ssc-mts-photo-resizer-online": "/tool/ssc-cgl-photo-signature-resize-online",
  "ssc-mts-photo-signature-upload": "/tool/ssc-cgl-photo-signature-resize-online",
  "ssc-gd-constable-photo-size-resizer": "/tool/ssc-cgl-photo-signature-resize-online",
  "nda-cds-upsc-photo-resizer": "/tool/upsc-image-resizer-online",
  "upsc-passport-size-photo-maker-online": "/tool/upsc-image-resizer-online",
};

// Canonical core tool routes for all other doorway/thin variations
export const TOOL_CANONICAL_MAP = {
  "ssc-photo": "/ssc-photo-compressor",
  "ibps-sign": "/signature-maker",
  "aadhaar-unlock": "/aadhaar-unlock",
  "pan-merge": "/pan-merge",
  "id-card-merger": "/id-card-merger",
  "voter-id-pdf": "/voter-id-pdf",
  "thumb-impression": "/thumb-impression",
  "passport-maker": "/passport-maker",
  "pdf-compress": "/compress",
  "pdf-to-jpg": "/pdf-to-jpg",
  "pdf-merge": "/merge",
  "pdf-split": "/split",
  "image-to-pdf": "/image-to-pdf",
  "image-compressor": "/image-compressor",
  "image-resizer": "/image-resizer",
  "background-remover": "/background-remover",
  "signature-maker": "/signature-maker",
  "age-calculator": "/age-calculator",
  "jpg-to-webp": "/jpg-to-webp",
  "biodata-maker": "/biodata-maker",
  "railway-form": "/railway-reservation-form",
};
