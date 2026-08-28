"use client";

import { useState, useRef, useEffect } from "react";
import { jsPDF } from "jspdf";
import { auth } from "@/lib/firebase";

export default function PdfCompressor() {
  const [pdfjsLib, setPdfjsLib] = useState(null);

  useEffect(() => {
    // If not already loaded by another component
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

  const [file, setFile] = useState(null);
  const [fileSize, setFileSize] = useState("");
  const [rawSize, setRawSize] = useState(0);
  const [level, setLevel] = useState("recommended"); // extreme, recommended, low
  const [isCompressing, setIsCompressing] = useState(false);
  const [progress, setProgress] = useState({ percent: 0, text: "" });
  const [result, setResult] = useState(null);
  const [premiumAlert, setPremiumAlert] = useState({ show: false, message: "" });
  
  const canvasRef = useRef(null);

  const formatBytes = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024, dm = 2, sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  };

  const handleFile = (selectedFile) => {
    if (!selectedFile) return;
    if (selectedFile.type !== "application/pdf" && !selectedFile.name.endsWith(".pdf")) {
      alert("Invalid file format. Please upload a PDF file.");
      return;
    }
    
    // --- PREMIUM CHECK: MAX 5MB File Size ---
    const isAdmin = auth.currentUser?.email === "thyagarajsalome@gmail.com";
    if (selectedFile.size > 5 * 1024 * 1024 && !isAdmin) { // 5MB in bytes
      setPremiumAlert({
        show: true,
        message: `Your file is ${formatBytes(selectedFile.size)}. The Free Plan allows files up to 5MB. Upgrade to Pro to compress massive PDF files!`
      });
      return;
    }

    setFile(selectedFile);
    setRawSize(selectedFile.size);
    setFileSize(formatBytes(selectedFile.size));
    setResult(null);
  };

  const handleCompress = async () => {
    if (!file || !pdfjsLib) return;

    setIsCompressing(true);
    setProgress({ percent: 0, text: "Reading PDF..." });

    const reader = new FileReader();
    reader.onload = async function() {
      try {
        const typedarray = new Uint8Array(this.result);
        const loadedPdf = await pdfjsLib.getDocument({ data: typedarray }).promise;
        
        const numPages = loadedPdf.numPages;
        
        // --- PREMIUM CHECK: MAX 10 PAGES ---
        const isAdmin = auth.currentUser?.email === "thyagarajsalome@gmail.com";
        
        if (numPages > 10 && !isAdmin) {
          setPremiumAlert({
            show: true,
            message: `Your PDF has ${numPages} pages. The Free Plan allows a maximum of 10 pages for compression. Upgrade to Pro for unlimited pages!`
          });
          setIsCompressing(false);
          return;
        }

        const doc = new jsPDF({ unit: "pt", format: "a4" });
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");

        // Compression Settings
        let scaleFactor = 1.2; // default scale
        let jpegQuality = 0.6;

        if (level === "extreme") {
          scaleFactor = 0.8; // Lower resolution heavily
          jpegQuality = 0.4;
        } else if (level === "recommended") {
          scaleFactor = 1.2;
          jpegQuality = 0.6;
        } else if (level === "low") {
          scaleFactor = 1.5;
          jpegQuality = 0.8;
        }

        for (let i = 1; i <= numPages; i++) {
          setProgress({ percent: Math.round((i / numPages) * 100), text: `Compressing page ${i} of ${numPages}...` });
          const page = await loadedPdf.getPage(i);
          
          const viewport = page.getViewport({ scale: scaleFactor });
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          
          await page.render({ canvasContext: context, viewport }).promise;
          const imgData = canvas.toDataURL("image/jpeg", jpegQuality);
          
          // Original page dimensions for PDF sizing
          const pdfViewport = page.getViewport({ scale: 1.0 });
          
          if (i > 1) {
            doc.addPage([pdfViewport.width, pdfViewport.height]);
          } else {
            // First page, resize the initial A4 to match actual first page
            doc.setPage(1);
          }
          
          doc.addImage(imgData, 'JPEG', 0, 0, pdfViewport.width, pdfViewport.height, undefined, 'FAST');
        }

        setProgress({ percent: 100, text: "Finalizing file..." });
        
        // Generate blob to show savings
        let finalBlob = doc.output('blob');
        let finalSize = finalBlob.size;
        
        // Failsafe: If rasterization made it bigger (common for vector text PDFs)
        let savings = ((rawSize - finalSize) / rawSize) * 100;
        let isAlreadyOptimized = false;
        
        if (finalSize >= rawSize) {
          finalBlob = file; // Fallback to original file
          finalSize = rawSize;
          savings = 0;
          isAlreadyOptimized = true;
        }

        setResult({
          blob: finalBlob,
          size: formatBytes(finalSize),
          savings: isAlreadyOptimized ? "0%" : `${savings.toFixed(1)}%`,
          isAlreadyOptimized: isAlreadyOptimized,
          url: URL.createObjectURL(finalBlob),
          filename: `compressed_${file.name}`
        });

      } catch (error) {
        console.error(error);
        alert("Error compressing PDF.");
      } finally {
        setIsCompressing(false);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="bg-white dark:bg-[#09090b] rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-gray-100 dark:border-gray-800 p-8 w-full transition-colors duration-300">
      <canvas ref={canvasRef} style={{ display: "none" }} />
      
      {!file ? (
        <div 
          className="border-2 border-dashed border-emerald-300 dark:border-emerald-700/50 hover:border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/10 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-2xl p-16 text-center cursor-pointer transition duration-300 group"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => { e.preventDefault(); handleFile(e.dataTransfer.files[0]); }}
          onClick={() => document.getElementById("pdf-upload").click()}
        >
          <div className="text-emerald-500 text-6xl mb-4 group-hover:scale-110 transition duration-300"><i className="fa-solid fa-file-arrow-down"></i></div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Select PDF file</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">or drop PDF here</p>
          
          {/* Transparent Limits Note */}
          <div className="inline-flex items-center gap-2 bg-white dark:bg-[#09090b] border border-gray-200 dark:border-gray-700 shadow-sm text-gray-600 dark:text-gray-400 text-xs font-semibold px-4 py-2 rounded-full transition-colors group-hover:border-emerald-200 dark:group-hover:border-emerald-800">
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">Free:</span> Max 5MB & 10 Pages
            <span className="mx-2 text-gray-300 dark:text-gray-600">|</span>
            <i className="fa-solid fa-crown text-amber-500"></i> <span className="text-amber-600 dark:text-amber-500 font-bold">Pro:</span> Unlimited
          </div>
          
          <input type="file" id="pdf-upload" accept=".pdf" className="hidden" onChange={(e) => handleFile(e.target.files[0])} />
        </div>
      ) : (
        <div className="flex items-center justify-between bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/50 p-4 rounded-xl mb-8 transition-colors">
          <div className="flex items-center gap-4">
            <div className="text-emerald-500 text-3xl"><i className="fa-solid fa-file-pdf"></i></div>
            <div>
              <div className="font-bold text-gray-900 dark:text-gray-100">{file.name}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Original Size: {fileSize}</div>
            </div>
          </div>
          {!isCompressing && !result && (
            <button className="text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition p-2" onClick={() => setFile(null)}>
              <i className="fa-solid fa-xmark text-xl"></i>
            </button>
          )}
        </div>
      )}

      {/* Options Panel (Only show if file selected and not converted yet) */}
      {file && !result && (
        <div className="mt-8 pb-8 border-b border-gray-100 dark:border-gray-800 transition-colors">
          <label className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide block mb-4">Compression Level</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            <div 
              className={`border-2 rounded-xl p-4 cursor-pointer transition ${level === 'extreme' ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 shadow-sm' : 'border-gray-200 dark:border-gray-800 hover:border-emerald-300'}`}
              onClick={() => setLevel('extreme')}
            >
              <h4 className={`font-bold mb-1 ${level === 'extreme' ? 'text-emerald-700 dark:text-emerald-400' : 'text-gray-900 dark:text-white'}`}>Extreme Compression</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">Less quality, extremely small file size.</p>
            </div>

            <div 
              className={`border-2 rounded-xl p-4 cursor-pointer transition relative ${level === 'recommended' ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 shadow-sm' : 'border-gray-200 dark:border-gray-800 hover:border-emerald-300'}`}
              onClick={() => setLevel('recommended')}
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Recommended</div>
              <h4 className={`font-bold mb-1 ${level === 'recommended' ? 'text-emerald-700 dark:text-emerald-400' : 'text-gray-900 dark:text-white'}`}>Good Compression</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">Perfect balance of quality and file size.</p>
            </div>

            <div 
              className={`border-2 rounded-xl p-4 cursor-pointer transition ${level === 'low' ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 shadow-sm' : 'border-gray-200 dark:border-gray-800 hover:border-emerald-300'}`}
              onClick={() => setLevel('low')}
            >
              <h4 className={`font-bold mb-1 ${level === 'low' ? 'text-emerald-700 dark:text-emerald-400' : 'text-gray-900 dark:text-white'}`}>Less Compression</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">High quality, slightly smaller file size.</p>
            </div>

          </div>

          <div className="flex justify-end mt-8">
            <button 
              className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 disabled:from-gray-300 dark:disabled:from-gray-800 disabled:to-gray-400 dark:disabled:to-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed text-white px-10 py-4 rounded-2xl font-extrabold text-lg flex items-center gap-3 transition-all duration-300 shadow-[0_8px_30px_rgba(16,185,129,0.3)] hover:shadow-[0_10px_40px_rgba(16,185,129,0.5)] disabled:shadow-none hover:-translate-y-1" 
              disabled={isCompressing || !pdfjsLib} 
              onClick={handleCompress}
            >
              {isCompressing ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-compress"></i>}
              <span>{isCompressing ? "Compressing..." : "Compress PDF"}</span>
            </button>
          </div>
        </div>
      )}

      {/* Progress */}
      {isCompressing && (
        <div className="mt-8 bg-gray-50 dark:bg-gray-900 p-6 rounded-xl border border-gray-100 dark:border-gray-800 transition-colors">
          <div className="flex justify-between text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
            <span>{progress.text}</span>
            <span className="text-emerald-600 dark:text-emerald-400">{progress.percent}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2.5">
            <div className="bg-emerald-500 dark:bg-emerald-500 h-2.5 rounded-full transition-all duration-300" style={{ width: `${progress.percent}%` }}></div>
          </div>
        </div>
      )}

      {/* Result Panel */}
      {result && (
        <div className="mt-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-500 rounded-full mb-6 shadow-sm border border-emerald-200 dark:border-emerald-800">
            <i className={result.isAlreadyOptimized ? "fa-solid fa-thumbs-up text-4xl" : "fa-solid fa-check-double text-4xl"}></i>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
            {result.isAlreadyOptimized ? "Already Optimized!" : "Compression Complete!"}
          </h2>
          <div className="flex flex-col items-center gap-2 mb-8 mt-4">
            {result.isAlreadyOptimized ? (
              <p className="text-gray-500 dark:text-gray-400 font-medium max-w-md mx-auto">
                Your PDF is already highly optimized. Any further compression would reduce quality without saving space.
              </p>
            ) : (
              <>
                <p className="text-gray-500 dark:text-gray-400 font-medium">
                  New file size: <span className="font-bold text-emerald-600 dark:text-emerald-400 text-lg">{result.size}</span>
                </p>
                <div className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 px-4 py-2 rounded-full text-sm font-bold border border-emerald-200 dark:border-emerald-800">
                  You saved {result.savings} space!
                </div>
              </>
            )}
          </div>

          <div className="flex justify-center gap-4">
            <button className="px-6 py-4 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-bold transition" onClick={() => { setFile(null); setResult(null); }}>
              Compress Another
            </button>
            <a href={result.url} download={result.filename} className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/30 rounded-xl font-extrabold transition flex items-center gap-3 hover:-translate-y-1">
              <i className="fa-solid fa-download"></i> Download PDF
            </a>
          </div>
        </div>
      )}

      {/* Premium Alert Modal */}
      {premiumAlert.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity">
          <div className="bg-white dark:bg-[#09090b] w-full max-w-md rounded-[2rem] shadow-2xl border border-gray-100 dark:border-gray-800 p-8 relative animate-in fade-in zoom-in duration-300 text-left">
            <button 
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition"
              onClick={() => setPremiumAlert({ show: false, message: "" })}
            >
              <i className="fa-solid fa-xmark text-xl"></i>
            </button>
            
            <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center text-white text-3xl shadow-lg mb-6 shadow-orange-500/30">
              <i className="fa-solid fa-crown"></i>
            </div>
            
            <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-3">
              Pro Feature Locked
            </h3>
            
            <p className="text-gray-600 dark:text-gray-400 mb-8 font-medium leading-relaxed">
              {premiumAlert.message}
            </p>
            
            <div className="flex flex-col gap-3">
              <a 
                href="/pricing"
                className="w-full text-center py-4 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md transition"
              >
                Upgrade to Pro (₹49)
              </a>
              <button 
                onClick={() => setPremiumAlert({ show: false, message: "" })}
                className="w-full text-center py-4 rounded-xl font-bold text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
