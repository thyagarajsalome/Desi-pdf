"use client";

import { useState, useRef, useEffect } from "react";
import JSZip from "jszip";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useProStatus } from "@/hooks/useProStatus";

export default function PdfConverter({ defaultFormat = "image/jpeg" }) {
  const [pdfjsLib, setPdfjsLib] = useState(null);
  const [user, setUser] = useState(null);
  const { isPro } = useProStatus(user);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
    script.async = true;
    script.onload = () => {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
      setPdfjsLib(window.pdfjsLib);
    };
    document.body.appendChild(script);
    return () => {
      if(document.body.contains(script)) {
         document.body.removeChild(script);
      }
    }
  }, []);

  const [file, setFile] = useState(null);
  const [fileSize, setFileSize] = useState("0 KB");
  const [dpi, setDpi] = useState(300);
  const [format, setFormat] = useState(defaultFormat);
  const [quality, setQuality] = useState(0.9);
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState({ percent: 0, text: "" });
  const [pages, setPages] = useState([]);
  const [pdfDoc, setPdfDoc] = useState(null);
  const canvasRef = useRef(null);
  const [premiumAlert, setPremiumAlert] = useState({ show: false, message: "" });

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
    setFile(selectedFile);
    setFileSize(formatBytes(selectedFile.size));
    setPages([]);
  };

  const handleConvert = async () => {
    if (!file) return;
    setIsConverting(true);
    setProgress({ percent: 0, text: "Reading PDF..." });
    setPages([]);

    const reader = new FileReader();
    reader.onload = async function() {
      try {
        const typedarray = new Uint8Array(this.result);
        const loadedPdf = await pdfjsLib.getDocument({ data: typedarray }).promise;
        
        // --- PREMIUM CHECK ---
        const numPages = loadedPdf.numPages;
        
        if (numPages > 5 && !isPro) {
          setPremiumAlert({ 
            show: true, 
            message: `Your PDF has ${numPages} pages. The Free Plan allows a maximum of 5 pages. Upgrade to Pro for unlimited pages!` 
          });
          setIsConverting(false);
          return;
        }

        setPdfDoc(loadedPdf);
        const newPages = [];
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");

        for (let i = 1; i <= numPages; i++) {
          setProgress({ percent: Math.round((i / numPages) * 100), text: `Rendering page ${i} of ${numPages}...` });
          const page = await loadedPdf.getPage(i);
          const scale = dpi / 72;
          const viewport = page.getViewport({ scale: scale, rotation: page.rotate });
          
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          
          await page.render({ canvasContext: context, viewport }).promise;
          const dataUrl = canvas.toDataURL(format, quality);
          
          newPages.push({ pageNum: i, rotation: 0, baseRotation: page.rotate, selected: true, dataUrl });
        }
        setPages(newPages);
        setProgress({ percent: 100, text: "Conversion complete!" });
      } catch (error) {
        console.error(error);
        alert("Error converting PDF.");
      } finally {
        setIsConverting(false);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const toggleSelectAll = (select) => setPages(pages.map(p => ({ ...p, selected: select })));
  const togglePageSelect = (pageNum) => setPages(pages.map(p => p.pageNum === pageNum ? { ...p, selected: !p.selected } : p));

  const rotatePage = async (pageNum, delta) => {
    if (!pdfDoc) return;
    const pageObj = pages.find(p => p.pageNum === pageNum);
    const newRotation = (pageObj.rotation + delta + 360) % 360;
    const page = await pdfDoc.getPage(pageNum);
    const scale = dpi / 72;
    const totalRotation = (page.baseRotation || page.rotate + newRotation) % 360;
    const viewport = page.getViewport({ scale, rotation: totalRotation });
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    await page.render({ canvasContext: context, viewport }).promise;
    const newDataUrl = canvas.toDataURL(format, quality);
    setPages(pages.map(p => p.pageNum === pageNum ? { ...p, rotation: newRotation, dataUrl: newDataUrl } : p));
  };

  const downloadZip = async () => {
    const isAdmin = auth.currentUser?.email === "thyagarajsalome@gmail.com";
    
    // --- PREMIUM CHECK: NO BATCH DOWNLOADS ---
    if (!isAdmin) {
      setPremiumAlert({ 
        show: true, 
        message: "Batch ZIP downloading is a Pro feature. Upgrade your account to download all 100+ images in one click!" 
      });
      return; // Block execution
    }

    const selected = pages.filter(p => p.selected);
    if (selected.length === 0) return;
    const zip = new JSZip();
    const ext = format.split("/")[1];
    selected.forEach(p => {
      const base64Data = p.dataUrl.split(",")[1];
      const filename = `${file.name.replace(/\.[^/.]+$/, "")}_page_${p.pageNum}.${ext}`;
      zip.file(filename, base64Data, { base64: true });
    });
    const content = await zip.generateAsync({ type: "blob" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(content);
    link.download = `${file.name.replace(/\.[^/.]+$/, "")}_converted_images.zip`;
    link.click();
  };

  return (
    <div className="bg-white dark:bg-[#09090b] rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-gray-100 dark:border-gray-800 p-8 w-full transition-colors duration-300">
      <canvas ref={canvasRef} style={{ display: "none" }} />
      
      {!file ? (
        <div 
          className="border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 bg-gray-50 dark:bg-gray-900 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-2xl p-16 text-center cursor-pointer transition duration-300"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => { e.preventDefault(); handleFile(e.dataTransfer.files[0]); }}
          onClick={() => document.getElementById("pdf-upload").click()}
        >
          <div className="text-blue-500 text-6xl mb-4"><i className="fa-solid fa-cloud-arrow-up"></i></div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Select PDF file</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">or drop PDF here</p>
          
          {/* Transparent Limits Note */}
          <div className="inline-flex items-center gap-2 bg-white dark:bg-[#09090b] border border-gray-200 dark:border-gray-700 shadow-sm text-gray-600 dark:text-gray-400 text-xs font-semibold px-4 py-2 rounded-full transition-colors group-hover:border-blue-200 dark:group-hover:border-blue-800">
            <span className="text-blue-600 dark:text-blue-400 font-bold">Free:</span> Max 5 Pages
            <span className="mx-2 text-gray-300 dark:text-gray-600">|</span>
            <i className="fa-solid fa-crown text-amber-500"></i> <span className="text-amber-600 dark:text-amber-500 font-bold">Pro:</span> Unlimited + ZIP
          </div>
          
          <input type="file" id="pdf-upload" accept=".pdf" className="hidden" onChange={(e) => handleFile(e.target.files[0])} />
        </div>
      ) : (
        <div className="flex items-center justify-between bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50 p-4 rounded-xl mb-8 transition-colors">
          <div className="flex items-center gap-4">
            <div className="text-red-500 text-3xl"><i className="fa-solid fa-file-pdf"></i></div>
            <div>
              <div className="font-bold text-gray-900 dark:text-gray-100">{file.name}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{fileSize}</div>
            </div>
          </div>
          <button className="text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition p-2" onClick={() => setFile(null)}>
            <i className="fa-solid fa-xmark text-xl"></i>
          </button>
        </div>
      )}

      {/* Options Panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8 pb-8 border-b border-gray-100 dark:border-gray-800 transition-colors">
        
        <div className="flex flex-col gap-3">
          <label className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">Image Format</label>
          <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg transition-colors">
            {[{v: "image/jpeg", l: "JPG"}, {v: "image/png", l: "PNG"}, {v: "image/webp", l: "WebP"}].map(f => (
              <button key={f.v} className={`flex-1 py-2 text-sm font-semibold rounded-md transition ${format === f.v ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`} onClick={() => setFormat(f.v)}>{f.l}</button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <label className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">Resolution</label>
          <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg transition-colors">
            {[150, 300, 450].map(val => (
              <button key={val} className={`flex-1 py-2 text-sm font-semibold rounded-md transition ${dpi === val ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`} onClick={() => setDpi(val)}>{val} DPI</button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex justify-between">
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">Quality</label>
            <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{Math.round(quality * 100)}%</span>
          </div>
          <input type="range" className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600 dark:accent-blue-500 mt-2 transition-colors" min="10" max="100" value={quality * 100} disabled={format === "image/png"} onChange={(e) => setQuality(e.target.value / 100)} />
        </div>
      </div>

      {/* Action Button */}
      <div className="flex justify-end mt-8">
        <button 
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-300 dark:disabled:from-gray-800 disabled:to-gray-400 dark:disabled:to-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed text-white px-10 py-4 rounded-2xl font-extrabold text-lg flex items-center gap-3 transition-all duration-300 shadow-[0_8px_30px_rgba(79,70,229,0.3)] hover:shadow-[0_10px_40px_rgba(79,70,229,0.5)] disabled:shadow-none hover:-translate-y-1" 
          disabled={!file || isConverting || !pdfjsLib} 
          onClick={handleConvert}
        >
          {isConverting ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-wand-magic-sparkles"></i>}
          <span>{isConverting ? "Converting..." : "Convert to Images"}</span>
        </button>
      </div>

      {/* Progress */}
      {isConverting && (
        <div className="mt-8 bg-gray-50 dark:bg-gray-900 p-6 rounded-xl border border-gray-100 dark:border-gray-800 transition-colors">
          <div className="flex justify-between text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
            <span>{progress.text}</span>
            <span className="text-blue-600 dark:text-blue-400">{progress.percent}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2.5">
            <div className="bg-blue-600 dark:bg-blue-500 h-2.5 rounded-full transition-all duration-300" style={{ width: `${progress.percent}%` }}></div>
          </div>
        </div>
      )}

      {/* Previews */}
      {pages.length > 0 && (
        <div className="mt-12 pt-12 border-t border-gray-100 dark:border-gray-800 transition-colors">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">Your Images</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Select the pages you want to download</p>
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-semibold transition" onClick={() => toggleSelectAll(true)}>Select All</button>
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white shadow-md rounded-lg text-sm font-bold transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed" disabled={!pages.some(p => p.selected)} onClick={downloadZip}>
                <i className="fa-solid fa-file-zipper"></i> Download ZIP
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {pages.map(page => (
              <div key={page.pageNum} className={`group relative bg-white dark:bg-gray-900 border-2 rounded-xl overflow-hidden transition-all duration-200 ${page.selected ? 'border-blue-500 shadow-md' : 'border-gray-200 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-700'}`}>
                
                {/* Selection Checkbox */}
                <div className="absolute top-3 left-3 z-10">
                  <div 
                    className={`w-6 h-6 rounded-md border-2 flex items-center justify-center cursor-pointer transition ${page.selected ? 'bg-blue-500 border-blue-500 text-white' : 'bg-white/80 dark:bg-gray-800/80 border-gray-300 dark:border-gray-600 text-transparent hover:border-blue-400 dark:hover:border-blue-500'}`}
                    onClick={() => togglePageSelect(page.pageNum)}
                  >
                    <i className="fa-solid fa-check text-xs"></i>
                  </div>
                </div>

                {/* Canvas Container */}
                <div className="aspect-[3/4] bg-gray-50 dark:bg-gray-950 p-4 flex items-center justify-center relative cursor-pointer" onClick={() => togglePageSelect(page.pageNum)}>
                  <img src={page.dataUrl} alt={`Page ${page.pageNum}`} className="max-w-full max-h-full object-contain shadow-sm" />
                  
                  {/* Rotation Overlay (Shows on Hover) */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-gray-900/80 backdrop-blur-sm rounded-full px-3 py-1.5 flex gap-2 opacity-0 group-hover:opacity-100 transition duration-200">
                    <button className="text-white hover:text-blue-400 transition" onClick={(e) => { e.stopPropagation(); rotatePage(page.pageNum, -90); }}><i className="fa-solid fa-rotate-left"></i></button>
                    <button className="text-white hover:text-blue-400 transition" onClick={(e) => { e.stopPropagation(); rotatePage(page.pageNum, 90); }}><i className="fa-solid fa-rotate-right"></i></button>
                  </div>
                </div>

                {/* Meta Bar */}
                <div className="bg-white dark:bg-[#09090b] p-3 flex justify-between items-center border-t border-gray-100 dark:border-gray-800 transition-colors">
                  <span className="text-sm font-bold text-gray-700 dark:text-gray-300">Page {page.pageNum}</span>
                  <a href={page.dataUrl} download={`${file.name}_page_${page.pageNum}.${format.split("/")[1]}`} className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 flex items-center justify-center transition" onClick={(e) => e.stopPropagation()}>
                    <i className="fa-solid fa-download text-sm"></i>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Premium Alert Modal */}
      {premiumAlert.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity">
          <div className="bg-white dark:bg-[#09090b] w-full max-w-md rounded-[2rem] shadow-2xl border border-gray-100 dark:border-gray-800 p-8 relative animate-in fade-in zoom-in duration-300">
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
