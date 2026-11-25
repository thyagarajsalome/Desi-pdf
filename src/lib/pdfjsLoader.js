// Shared singleton loader for self-hosted PDF.js (eliminates duplicate CDN fetches)
let pdfJsPromise = null;

export function loadPdfJs() {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("PDF.js can only be loaded in the browser"));
  }

  if (window.pdfjsLib) {
    window.pdfjsLib.GlobalWorkerOptions.workerSrc = "/vendor/pdfjs/pdf.worker.min.js";
    return Promise.resolve(window.pdfjsLib);
  }

  if (pdfJsPromise) {
    return pdfJsPromise;
  }

  pdfJsPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "/vendor/pdfjs/pdf.min.js";
    script.async = true;
    script.onload = () => {
      if (window.pdfjsLib) {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = "/vendor/pdfjs/pdf.worker.min.js";
        resolve(window.pdfjsLib);
      } else {
        pdfJsPromise = null;
        reject(new Error("pdfjsLib failed to initialize"));
      }
    };
    script.onerror = (err) => {
      pdfJsPromise = null;
      reject(err);
    };
    document.body.appendChild(script);
  });

  return pdfJsPromise;
}
