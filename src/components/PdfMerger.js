"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { Loader2 } from "lucide-react";
import { auth } from "@/lib/firebase";

export default function PdfMerger() {
  const [files, setFiles] = useState([]);
  const [isMerging, setIsMerging] = useState(false);
  const [result, setResult] = useState(null);
  const [premiumAlert, setPremiumAlert] = useState({ show: false, message: "" });

  const formatBytes = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024, dm = 2, sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  };

  const handleFiles = (selectedFiles) => {
    if (!selectedFiles || selectedFiles.length === 0) return;
    
    const validFiles = Array.from(selectedFiles).filter(f => f.type === "application/pdf" || f.name.endsWith(".pdf"));
    
    if (validFiles.length !== selectedFiles.length) {
      alert("Some files were ignored. Please upload only PDF files.");
    }

    setFiles(prev => [...prev, ...validFiles]);
    setResult(null);
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const moveFile = (index, direction) => {
    if (direction === "up" && index > 0) {
      const newFiles = [...files];
      [newFiles[index - 1], newFiles[index]] = [newFiles[index], newFiles[index - 1]];
      setFiles(newFiles);
    } else if (direction === "down" && index < files.length - 1) {
      const newFiles = [...files];
      [newFiles[index], newFiles[index + 1]] = [newFiles[index + 1], newFiles[index]];
      setFiles(newFiles);
    }
  };

  const handleMerge = async () => {
    if (files.length < 2) {
      alert("Please upload at least 2 PDF files to merge.");
      return;
    }

    // --- PREMIUM CHECK: MAX 3 FILES for Free Users ---
    const isAdmin = auth.currentUser?.email === "thyagarajsalome@gmail.com";
    if (files.length > 3 && !isAdmin) {
      setPremiumAlert({
        show: true,
        message: `You are trying to merge ${files.length} files. The Free Plan allows a maximum of 3 files. Upgrade to Pro to merge unlimited files!`
      });
      return;
    }

    setIsMerging(true);

    try {
      const mergedPdf = await PDFDocument.create();

      for (const file of files) {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const mergedPdfFile = await mergedPdf.save();
      const blob = new Blob([mergedPdfFile], { type: "application/pdf" });
      
      setResult({
        blob: blob,
        size: formatBytes(blob.size),
        url: URL.createObjectURL(blob),
        filename: `merged_${files.length}_files.pdf`
      });
    } catch (error) {
      console.error(error);
      alert("Error merging PDFs. One of the files might be encrypted or corrupted.");
    } finally {
      setIsMerging(false);
    }
  };

  return (
    <div className="bg-white dark:bg-[#09090b] rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-gray-100 dark:border-gray-800 p-8 w-full transition-colors duration-300">
      
      {/* Upload Zone */}
      {!result && (
        <div 
          className="border-2 border-dashed border-indigo-300 dark:border-indigo-700/50 hover:border-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/10 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-2xl p-16 text-center cursor-pointer transition duration-300 group mb-8"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
          onClick={() => document.getElementById("pdf-upload").click()}
        >
          <div className="text-indigo-500 text-6xl mb-4 group-hover:scale-110 transition duration-300"><i className="fa-solid fa-layer-group"></i></div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Select multiple PDFs</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">or drag and drop them here</p>
          
          {/* Transparent Limits Note */}
          <div className="inline-flex items-center gap-2 bg-white dark:bg-[#09090b] border border-gray-200 dark:border-gray-700 shadow-sm text-gray-600 dark:text-gray-400 text-xs font-semibold px-4 py-2 rounded-full transition-colors group-hover:border-indigo-200 dark:group-hover:border-indigo-800">
            <span className="text-indigo-600 dark:text-indigo-400 font-bold">Free:</span> Max 3 Files
            <span className="mx-2 text-gray-300 dark:text-gray-600">|</span>
            <i className="fa-solid fa-crown text-amber-500"></i> <span className="text-amber-600 dark:text-amber-500 font-bold">Pro:</span> Unlimited
          </div>
          
          <input type="file" id="pdf-upload" accept=".pdf" multiple className="hidden" onChange={(e) => handleFiles(e.target.files)} />
        </div>
      )}

      {/* File List */}
      {!result && files.length > 0 && (
        <div className="mb-8 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden">
          <div className="bg-gray-50 dark:bg-gray-900 px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
            <h4 className="font-bold text-gray-900 dark:text-white">Files to Merge ({files.length})</h4>
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Order matters</span>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-800 max-h-96 overflow-y-auto">
            {files.map((file, index) => (
              <div key={index} className="px-6 py-4 flex items-center justify-between bg-white dark:bg-[#09090b] hover:bg-indigo-50/50 dark:hover:bg-indigo-900/10 transition">
                <div className="flex items-center gap-4 truncate">
                  <div className="text-indigo-500 text-2xl flex-shrink-0"><i className="fa-solid fa-file-pdf"></i></div>
                  <div className="truncate">
                    <div className="font-bold text-gray-900 dark:text-gray-100 truncate text-sm">{file.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{formatBytes(file.size)}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                  <button onClick={() => moveFile(index, "up")} disabled={index === 0} className="p-2 text-gray-400 hover:text-indigo-600 disabled:opacity-30 transition"><i className="fa-solid fa-chevron-up"></i></button>
                  <button onClick={() => moveFile(index, "down")} disabled={index === files.length - 1} className="p-2 text-gray-400 hover:text-indigo-600 disabled:opacity-30 transition"><i className="fa-solid fa-chevron-down"></i></button>
                  <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-2"></div>
                  <button onClick={() => removeFile(index)} className="p-2 text-gray-400 hover:text-red-500 transition"><i className="fa-solid fa-xmark text-lg"></i></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Button */}
      {!result && files.length > 0 && (
        <div className="flex justify-end">
          <button 
            className="bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 disabled:from-gray-300 dark:disabled:from-gray-800 disabled:text-gray-500 text-white px-10 py-4 rounded-2xl font-extrabold text-lg flex items-center gap-3 transition-all shadow-[0_8px_30px_rgba(99,102,241,0.3)] hover:shadow-[0_10px_40px_rgba(99,102,241,0.5)] disabled:shadow-none hover:-translate-y-1" 
            disabled={files.length < 2 || isMerging} 
            onClick={handleMerge}
          >
            {isMerging ? <Loader2 className="animate-spin h-5 w-5" /> : <i className="fa-solid fa-object-group"></i>}
            <span>{isMerging ? "Merging PDFs..." : "Merge PDFs Now"}</span>
          </button>
        </div>
      )}

      {/* Result Panel */}
      {result && (
        <div className="mt-4 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-500 rounded-full mb-6 shadow-sm border border-indigo-200 dark:border-indigo-800">
            <i className="fa-solid fa-check-double text-3xl"></i>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">Merge Complete!</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8 font-medium">Your new PDF is ready. Total size: <span className="font-bold text-indigo-600 dark:text-indigo-400">{result.size}</span></p>

          <div className="flex justify-center gap-4">
            <button className="px-6 py-4 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-bold transition" onClick={() => { setFiles([]); setResult(null); }}>
              Merge More
            </button>
            <a href={result.url} download={result.filename} className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/30 rounded-xl font-extrabold transition flex items-center gap-3">
              <i className="fa-solid fa-download"></i> Download Merged PDF
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
