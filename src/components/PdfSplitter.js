"use client";

import { useState, useRef, useEffect } from "react";
import { PDFDocument } from "pdf-lib";
import { Loader2 } from "lucide-react";
import { auth } from "@/lib/firebase";

export default function PdfSplitter() {
  const [file, setFile] = useState(null);
  const [pdfjsLib, setPdfjsLib] = useState(null);
  const [pages, setPages] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState("");
  const [premiumAlert, setPremiumAlert] = useState({ show: false, message: "" });
  const [resultUrl, setResultUrl] = useState(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (window.pdfjsLib) {
      setPdfjsLib(window.pdfjsLib);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
    script.async = true;
    script.onload = () => {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
      setPdfjsLib(window.pdfjsLib);
    };
    document.body.appendChild(script);
  }, []);

  const formatBytes = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024, dm = 2, sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  };

  const handleFile = async (selectedFile) => {
    if (!selectedFile || selectedFile.type !== "application/pdf") {
      alert("Please upload a valid PDF file.");
      return;
    }
    setFile(selectedFile);
    setPages([]);
    setResultUrl(null);
    setIsProcessing(true);
    setProgress("Loading pages...");

    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const loadedPdf = await pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) }).promise;
      const numPages = loadedPdf.numPages;

      // --- PREMIUM CHECK ---
      const isAdmin = auth.currentUser?.email === "thyagarajsalome@gmail.com";
      if (numPages > 20 && !isAdmin) {
        setPremiumAlert({
          show: true,
          message: `This PDF has ${numPages} pages. The Free Plan allows splitting up to 20 pages. Upgrade to Pro for unlimited splitting!`
        });
        setIsProcessing(false);
        setFile(null);
        return;
      }

      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      const newPages = [];

      for (let i = 1; i <= numPages; i++) {
        setProgress(`Rendering preview ${i} of ${numPages}...`);
        const page = await loadedPdf.getPage(i);
        const viewport = page.getViewport({ scale: 0.5 }); // Low res just for preview
        
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        await page.render({ canvasContext: context, viewport }).promise;
        
        newPages.push({
          pageNum: i,
          dataUrl: canvas.toDataURL("image/jpeg", 0.6),
          selected: true // default all selected
        });
      }
      setPages(newPages);
    } catch (error) {
      console.error(error);
      alert("Error reading PDF.");
      setFile(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const togglePageSelect = (pageNum) => {
    setPages(pages.map(p => p.pageNum === pageNum ? { ...p, selected: !p.selected } : p));
  };

  const toggleSelectAll = (select) => {
    setPages(pages.map(p => ({ ...p, selected: select })));
  };

  const handleExtract = async () => {
    const selectedPages = pages.filter(p => p.selected);
    if (selectedPages.length === 0) {
      alert("Please select at least one page to extract.");
      return;
    }
    
    setIsProcessing(true);
    setProgress("Extracting vector pages...");

    try {
      const arrayBuffer = await file.arrayBuffer();
      // Load the ORIGINAL pdf using pdf-lib (keeps vectors, text, links intact!)
      const originalPdf = await PDFDocument.load(arrayBuffer);
      const newPdf = await PDFDocument.create();

      // pdf-lib page indices are 0-based
      const pageIndicesToCopy = selectedPages.map(p => p.pageNum - 1);
      
      const copiedPages = await newPdf.copyPages(originalPdf, pageIndicesToCopy);
      copiedPages.forEach(page => newPdf.addPage(page));

      setProgress("Finalizing new PDF...");
      const pdfBytes = await newPdf.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      
      setResultUrl(URL.createObjectURL(blob));
    } catch (error) {
      console.error(error);
      alert("Failed to extract pages.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white dark:bg-[#09090b] rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-gray-100 dark:border-gray-800 p-8 w-full transition-colors duration-300">
      <canvas ref={canvasRef} style={{ display: "none" }} />

      {!file ? (
        <div 
          className="border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-blue-500 bg-gray-50 dark:bg-gray-900 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-2xl p-16 text-center cursor-pointer transition duration-300"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => { e.preventDefault(); handleFile(e.dataTransfer.files[0]); }}
          onClick={() => document.getElementById("pdf-upload").click()}
        >
          <div className="text-blue-500 text-6xl mb-4"><i className="fa-solid fa-scissors"></i></div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Select PDF to Split</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">Extract the exact pages you need.</p>
          
          <input type="file" id="pdf-upload" accept=".pdf" className="hidden" onChange={(e) => handleFile(e.target.files[0])} />
        </div>
      ) : !resultUrl ? (
        <div className="animate-in fade-in zoom-in-95 duration-300">
          <div className="flex items-center justify-between bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50 p-4 rounded-xl mb-8">
            <div className="flex items-center gap-4">
              <div className="text-red-500 text-3xl"><i className="fa-solid fa-file-pdf"></i></div>
              <div>
                <div className="font-bold text-gray-900 dark:text-gray-100">{file.name}</div>
                <div className="text-sm text-gray-500">{formatBytes(file.size)}</div>
              </div>
            </div>
            <button className="text-gray-400 hover:text-red-500 p-2" onClick={() => setFile(null)}><i className="fa-solid fa-xmark text-xl"></i></button>
          </div>

          {pages.length > 0 && (
            <>
              <div className="flex justify-between items-end mb-6">
                <div>
                  <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">Select Pages</h2>
                  <p className="text-gray-500 text-sm mt-1">Click the pages you want to keep in the new PDF.</p>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => toggleSelectAll(false)} className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition">Deselect All</button>
                  <button onClick={() => toggleSelectAll(true)} className="px-4 py-2 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 rounded-lg text-sm font-bold hover:bg-blue-200 dark:hover:bg-blue-900/60 transition">Select All</button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8 overflow-y-auto max-h-[500px] p-2">
                {pages.map(page => (
                  <div key={page.pageNum} onClick={() => togglePageSelect(page.pageNum)} className={`relative bg-white dark:bg-gray-900 border-2 rounded-xl overflow-hidden transition-all duration-200 cursor-pointer ${page.selected ? 'border-blue-500 shadow-md scale-100' : 'border-gray-200 dark:border-gray-800 opacity-60 scale-95 hover:opacity-100'}`}>
                    <div className="absolute top-2 left-2 z-10">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition ${page.selected ? 'bg-blue-500 border-blue-500 text-white' : 'bg-white/80 border-gray-400 text-transparent'}`}>
                        <i className="fa-solid fa-check text-xs"></i>
                      </div>
                    </div>
                    <div className="aspect-[3/4] bg-gray-50 dark:bg-gray-950 p-2 flex flex-col">
                      <img src={page.dataUrl} alt={`Page ${page.pageNum}`} className="w-full h-full object-contain shadow-sm border border-gray-100 dark:border-gray-800" />
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-900 py-2 text-center text-xs font-bold text-gray-600 dark:text-gray-400">
                      Page {page.pageNum}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center bg-gray-50 dark:bg-[#09090b] border-t border-gray-200 dark:border-gray-800 pt-6">
                <div className="text-gray-600 dark:text-gray-400 font-bold">
                  {pages.filter(p => p.selected).length} out of {pages.length} pages selected
                </div>
                <button 
                  onClick={handleExtract}
                  disabled={isProcessing || pages.filter(p => p.selected).length === 0}
                  className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-8 py-3 rounded-xl font-extrabold flex items-center gap-3 transition-all shadow-md"
                >
                  {isProcessing ? <><Loader2 className="animate-spin h-5 w-5" /> {progress}</> : <><i className="fa-solid fa-scissors"></i> Extract Pages</>}
                </button>
              </div>
            </>
          )}

          {isProcessing && pages.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-blue-500">
              <Loader2 className="animate-spin h-10 w-10 mb-4" />
              <p className="font-bold">{progress}</p>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center animate-in fade-in zoom-in duration-500 py-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-500 rounded-full mb-6 shadow-sm border border-emerald-200 dark:border-emerald-800">
            <i className="fa-solid fa-file-circle-check text-4xl"></i>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">Split Successful!</h2>
          <p className="text-gray-500 font-medium mb-8">Your new PDF containing {pages.filter(p => p.selected).length} pages is ready.</p>

          <div className="flex justify-center gap-4">
            <button onClick={() => {setFile(null); setResultUrl(null); setPages([]);}} className="px-6 py-4 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-bold transition">Split Another</button>
            <a href={resultUrl} download={`split_${file.name}`} className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/30 rounded-xl font-extrabold transition flex items-center gap-3 hover:-translate-y-1">
              <i className="fa-solid fa-download"></i> Download New PDF
            </a>
          </div>
        </div>
      )}

      {/* Premium Alert */}
      {premiumAlert.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#09090b] max-w-md rounded-[2rem] p-8 relative shadow-2xl animate-in zoom-in">
            <button onClick={() => setPremiumAlert({ show: false, message: "" })} className="absolute top-6 right-6 text-gray-400 hover:text-gray-700"><i className="fa-solid fa-xmark text-xl"></i></button>
            <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center text-white text-3xl mb-6"><i className="fa-solid fa-crown"></i></div>
            <h3 className="text-2xl font-extrabold mb-3">Pro Feature Locked</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8 font-medium">{premiumAlert.message}</p>
            <a href="/pricing" className="block w-full text-center py-4 bg-blue-600 text-white rounded-xl font-bold shadow-md hover:bg-blue-700">Upgrade to Pro (₹49)</a>
          </div>
        </div>
      )}
    </div>
  );
}
