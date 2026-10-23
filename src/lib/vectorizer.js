// Client-side image vectorization engine powered by ImageTracer
export async function vectorizeImage(imageSource, options = {}) {
  if (typeof window === "undefined") {
    throw new Error("vectorizeImage can only execute in the browser environment");
  }

  // Dynamically load imagetracerjs
  const imageTracerModule = await import("imagetracerjs");
  const ImageTracer = imageTracerModule.default || imageTracerModule;

  // 1. Resolve image to an HTMLImageElement
  let imgElement;
  if (imageSource instanceof HTMLImageElement) {
    imgElement = imageSource;
  } else if (typeof imageSource === "string") {
    imgElement = await new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = (e) => reject(new Error("Failed to load image for vectorization"));
      img.src = imageSource;
    });
  } else {
    throw new Error("Invalid imageSource provided to vectorizeImage");
  }

  // 2. Scale down if oversized to keep vectorization fast and memory safe
  const maxDim = options.maxDimension || 1200;
  let w = imgElement.naturalWidth || imgElement.width || 400;
  let h = imgElement.naturalHeight || imgElement.height || 400;

  if (w > maxDim || h > maxDim) {
    if (w > h) {
      h = Math.round((h * maxDim) / w);
      w = maxDim;
    } else {
      w = Math.round((w * maxDim) / h);
      h = maxDim;
    }
  }

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(imgElement, 0, 0, w, h);

  const mode = options.mode || "monochrome";

  // 3. Monochrome / CAD Silhouette Mode
  if (mode === "monochrome") {
    const imgData = ctx.getImageData(0, 0, w, h);
    const data = imgData.data;
    const threshold = options.threshold !== undefined ? options.threshold : 128;
    const invert = !!options.invert;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];

      // Luminance
      const lum = 0.299 * r + 0.587 * g + 0.114 * b;
      // If pixel is semi-transparent, treat as white
      const effectiveLum = a < 100 ? 255 : lum;

      let isDark = effectiveLum < threshold;
      if (invert) isDark = !isDark;

      if (isDark) {
        data[i] = 0;
        data[i + 1] = 0;
        data[i + 2] = 0;
        data[i + 3] = 255;
      } else {
        data[i] = 255;
        data[i + 1] = 255;
        data[i + 2] = 255;
        data[i + 3] = 0; // Transparent background
      }
    }

    ctx.putImageData(imgData, 0, 0);

    const traceOptions = {
      ...ImageTracer.optionpresets.default,
      numberofcolors: 2,
      colorsampling: 0,
      colorquantcycles: 1,
      mincolorratio: 0,
      pathomit: options.pathOmit !== undefined ? options.pathOmit : 4,
      ltres: options.ltres !== undefined ? options.ltres : 1,
      qtres: options.qtres !== undefined ? options.qtres : 1,
      viewbox: true,
      scale: 1,
      desc: false,
      strokewidth: 0,
      roundcoords: 1,
    };

    const processedImgData = ctx.getImageData(0, 0, w, h);
    let svgString = ImageTracer.imagedataToSVG(processedImgData, traceOptions);

    // Clean up unnecessary metadata comments if any
    svgString = svgString.replace(/desc="[^"]*"/g, "");

    // Count path tags
    const pathMatches = svgString.match(/<path/g);
    const pathCount = pathMatches ? pathMatches.length : 0;

    return {
      svgString,
      width: w,
      height: h,
      pathCount,
    };
  }

  // 4. Color Posterized / Illustration Vector Mode
  const imgData = ctx.getImageData(0, 0, w, h);
  const numberOfColors = Math.max(2, Math.min(32, options.numberOfColors || 8));

  const traceOptions = {
    ...ImageTracer.optionpresets.default,
    numberofcolors: numberOfColors,
    colorsampling: 2,
    colorquantcycles: 3,
    pathomit: options.pathOmit !== undefined ? options.pathOmit : 4,
    ltres: options.ltres !== undefined ? options.ltres : 1,
    qtres: options.qtres !== undefined ? options.qtres : 1,
    viewbox: true,
    scale: 1,
    desc: false,
    strokewidth: 0,
    roundcoords: 1,
  };

  let svgString = ImageTracer.imagedataToSVG(imgData, traceOptions);
  svgString = svgString.replace(/desc="[^"]*"/g, "");
  const pathMatches = svgString.match(/<path/g);
  const pathCount = pathMatches ? pathMatches.length : 0;

  return {
    svgString,
    width: w,
    height: h,
    pathCount,
  };
}
