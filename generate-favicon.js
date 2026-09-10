const fs = require('fs');
const path = require('path');

// 1. High-Res Scalable SVG Icon for DesiPDF
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#2563EB" />
      <stop offset="100%" stop-color="#4338CA" />
    </linearGradient>
    <linearGradient id="foldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#E2E8F0" />
      <stop offset="100%" stop-color="#CBD5E1" />
    </linearGradient>
    <linearGradient id="badgeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#DC2626" />
      <stop offset="100%" stop-color="#EA580C" />
    </linearGradient>
  </defs>

  <!-- Background Squircle -->
  <rect width="64" height="64" rx="16" fill="url(#bgGrad)" />

  <!-- Saffron & Green subtle Indian Accent Dots -->
  <circle cx="12" cy="12" r="3.5" fill="#FF9933" />
  <circle cx="52" cy="52" r="3.5" fill="#138808" />

  <!-- Document Sheet -->
  <path d="M19 12 C17.895 12 17 12.895 17 14 L17 50 C17 51.105 17.895 52 19 52 L45 52 C46.105 52 47 51.105 47 50 L47 22 L37 12 Z" fill="#FFFFFF" />

  <!-- Folded Corner -->
  <path d="M37 12 L37 21 C37 21.552 37.448 22 38 22 L47 22 Z" fill="url(#foldGrad)" />

  <!-- Document Accent Lines -->
  <rect x="22" y="21" width="11" height="2.5" rx="1.25" fill="#94A3B8" />
  <rect x="22" y="27" width="20" height="2.5" rx="1.25" fill="#CBD5E1" />

  <!-- Red "PDF" Badge -->
  <rect x="13" y="33" width="38" height="15" rx="4" fill="url(#badgeGrad)" />
  <text x="32" y="44.5" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif" font-weight="900" font-size="9.5" fill="#FFFFFF" text-anchor="middle" letter-spacing="0.5">PDF</text>
</svg>`;

// Write SVG icons
fs.writeFileSync('src/app/icon.svg', svgContent, 'utf8');
fs.writeFileSync('public/icon.svg', svgContent, 'utf8');
fs.writeFileSync('public/favicon.svg', svgContent, 'utf8');
console.log('✅ Generated src/app/icon.svg & public/icon.svg');

// 2. Generate standard Windows 32x32 32-bit BGRA ICO file
function createIco(size) {
  const width = size;
  const height = size;
  
  // 32-bit BGRA pixels (height rows, bottom-to-top)
  const pixelData = Buffer.alloc(width * height * 4);
  
  const blue = [235, 99, 37, 255]; // #2563EB in BGRA
  const darkBlue = [202, 56, 67, 255]; // #4338CA
  const white = [255, 255, 255, 255];
  const red = [38, 38, 220, 255]; // #DC2626
  const saffron = [51, 153, 255, 255]; // #FF9933
  const green = [8, 136, 19, 255]; // #138808
  const transparent = [0, 0, 0, 0];
  
  // Helper to set pixel (x, y) where y is standard top-to-bottom (0 at top, 31 at bottom)
  function setPixel(x, y, color) {
    if (x < 0 || x >= width || y < 0 || y >= height) return;
    // BMP stores rows bottom-to-top, so row 0 in BMP is y = height - 1
    const bmpY = (height - 1) - y;
    const offset = (bmpY * width + x) * 4;
    pixelData[offset] = color[0];     // B
    pixelData[offset + 1] = color[1]; // G
    pixelData[offset + 2] = color[2]; // R
    pixelData[offset + 3] = color[3]; // A
  }

  // Draw icon on 32x32 grid
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      // Rounded squircle background
      const r = 5;
      const insideSquircle = 
        (x >= r && x < width - r) || 
        (y >= r && y < height - r) ||
        (Math.hypot(x - r, y - r) < r) ||
        (Math.hypot(x - (width - 1 - r), y - r) < r) ||
        (Math.hypot(x - r, y - (height - 1 - r)) < r) ||
        (Math.hypot(x - (width - 1 - r), y - (height - 1 - r)) < r);

      if (insideSquircle) {
        // Gradient from top to bottom
        const t = y / height;
        const col = [
          Math.round(blue[0] * (1 - t) + darkBlue[0] * t),
          Math.round(blue[1] * (1 - t) + darkBlue[1] * t),
          Math.round(blue[2] * (1 - t) + darkBlue[2] * t),
          255
        ];
        setPixel(x, y, col);
      } else {
        setPixel(x, y, transparent);
      }
    }
  }

  // Draw Saffron and Green corner dots
  setPixel(4, 4, saffron);
  setPixel(5, 4, saffron);
  setPixel(4, 5, saffron);
  setPixel(5, 5, saffron);

  setPixel(26, 26, green);
  setPixel(27, 26, green);
  setPixel(26, 27, green);
  setPixel(27, 27, green);

  // Draw White Paper
  for (let y = 6; y <= 25; y++) {
    for (let x = 8; x <= 23; x++) {
      // Folded corner cutout at top right
      if (x >= 18 && y <= 11 && (x - 18) + (y - 6) >= 6) {
        continue;
      }
      setPixel(x, y, white);
    }
  }

  // Draw fold shade
  setPixel(18, 7, [200, 200, 200, 255]);
  setPixel(18, 8, [210, 210, 210, 255]);
  setPixel(18, 9, [210, 210, 210, 255]);
  setPixel(18, 10, [210, 210, 210, 255]);
  setPixel(18, 11, [210, 210, 210, 255]);
  setPixel(19, 11, [210, 210, 210, 255]);
  setPixel(20, 11, [210, 210, 210, 255]);
  setPixel(21, 11, [210, 210, 210, 255]);
  setPixel(22, 11, [210, 210, 210, 255]);

  // Red "PDF" Badge bar
  for (let y = 16; y <= 23; y++) {
    for (let x = 5; x <= 26; x++) {
      setPixel(x, y, red);
    }
  }

  // Draw white "PDF" text on badge
  // P
  const pPixels = [
    [7,18], [7,19], [7,20], [7,21],
    [8,18], [9,18],
    [9,19], [8,19]
  ];
  pPixels.forEach(([px, py]) => setPixel(px, py, white));

  // D
  const dPixels = [
    [12,18], [12,19], [12,20], [12,21],
    [13,18], [14,18],
    [15,19], [15,20],
    [13,21], [14,21]
  ];
  dPixels.forEach(([px, py]) => setPixel(px, py, white));

  // F
  const fPixels = [
    [18,18], [18,19], [18,20], [18,21],
    [19,18], [20,18],
    [19,19]
  ];
  fPixels.forEach(([px, py]) => setPixel(px, py, white));

  // 1 bit per pixel AND mask (height * width / 8 bytes, padded)
  const andMaskRowBytes = Math.ceil(width / 32) * 4;
  const andMask = Buffer.alloc(andMaskRowBytes * height, 0);

  // BITMAPINFOHEADER (40 bytes)
  const bih = Buffer.alloc(40);
  bih.writeUInt32LE(40, 0);             // biSize
  bih.writeInt32LE(width, 4);            // biWidth
  bih.writeInt32LE(height * 2, 8);       // biHeight (x2 for XOR + AND)
  bih.writeUInt16LE(1, 12);              // biPlanes
  bih.writeUInt16LE(32, 14);             // biBitCount (32bpp)
  bih.writeUInt32LE(0, 16);              // biCompression (BI_RGB)
  bih.writeUInt32LE(pixelData.length + andMask.length, 20); // biSizeImage

  const imageBuffer = Buffer.concat([bih, pixelData, andMask]);

  // ICONDIR (6 bytes)
  const iconDir = Buffer.alloc(6);
  iconDir.writeUInt16LE(0, 0); // Reserved
  iconDir.writeUInt16LE(1, 2); // ICO type
  iconDir.writeUInt16LE(1, 4); // 1 image

  // ICONDIRENTRY (16 bytes)
  const iconEntry = Buffer.alloc(16);
  iconEntry.writeUInt8(width === 256 ? 0 : width, 0);
  iconEntry.writeUInt8(height === 256 ? 0 : height, 1);
  iconEntry.writeUInt8(0, 2); // color count
  iconEntry.writeUInt8(0, 3); // reserved
  iconEntry.writeUInt16LE(1, 4); // color planes
  iconEntry.writeUInt16LE(32, 6); // bpp
  iconEntry.writeUInt32LE(imageBuffer.length, 8); // image size
  iconEntry.writeUInt32LE(6 + 16, 12); // image offset

  return Buffer.concat([iconDir, iconEntry, imageBuffer]);
}

const icoBuffer = createIco(32);
fs.writeFileSync('src/app/favicon.ico', icoBuffer);
fs.writeFileSync('public/favicon.ico', icoBuffer);
console.log('✅ Generated 32x32 DesiPDF favicon.ico in src/app and public/');
