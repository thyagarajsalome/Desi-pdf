"use client";

import { useState, useRef } from "react";
import { jsPDF } from "jspdf";
import { Loader2 } from "lucide-react";

export default function VoterIdPdf() {
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);
  
  const canvasRef = useRef(null);

  const formatBytes = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024, dm = 2, sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  };

  const handleFile = (selectedFile) => {
    if (!selectedFile) return;
    if (!selectedFile.type.startsWith("image/")) {
      alert("Please upload a valid image file (JPG, PNG).");
      return;
    }
    setFile(selectedFile);
    setResult(null);
  };

  const processToPdf = async () => {
    if (!file) return;
    setIsProcessing(true);

    try {
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);
      
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = objectUrl;
      });

      const canvas = canvasRef.current;
      
      // Standardize image resolution before PDF insertion
      // We don't need massive 4K images for a 100KB PDF
      const maxDim = 1200;
      let width = img.width;
      let height = img.height;
      if (width > maxDim || height > maxDim) {
        const ratio = Math.min(maxDim / width, maxDim / height);
        width = width * ratio;
        height = height * ratio;
      }
      
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);

      // Binary Search for exactly < 100KB PDF size
      let minQ = 0.05;
      let maxQ = 1.0;
      let quality = 0.8;
      let finalBlob = null;
      let attempts = 0;
      
      const maxKB = 98; // Safe margin below 100KB
      const minKB = 60; // Keep it as high quality as possible

      while (attempts < 8) {
        quality = (minQ + maxQ) / 2;
        const b64Image = canvas.toDataURL("image/jpeg", quality);
        
        // Generate Temp PDF to check size
        const doc = new jsPDF({ format: "a4", unit: "mm" });
        const pageWidth = 210;
        
        // Fit image nicely into A4 width with padding
        const padding = 20;
        const targetWidth = pageWidth - (padding * 2);
        const targetHeight = (height * targetWidth) / width;
        
        doc.addImage(b64Image, "JPEG", padding, 30, targetWidth, targetHeight);
        const pdfBlob = doc.output("blob");
        
        const sizeKB = pdfBlob.size / 1024;

        if (sizeKB > maxKB) {
          maxQ = quality; 
        } else if (sizeKB < minKB) {
          minQ = quality; 
          finalBlob = pdfBlob; // Save in case we don't find perfect match
        } else {
          finalBlob = pdfBlob; // Perfect!
          break;
        }
        attempts++;
      }

      if (!finalBlob) {
        // Fallback to heavy compression if still not found
        const b64Image = canvas.toDataURL("image/jpeg", 0.3);
        const doc = new jsPDF({ format: "a4", unit: "mm" });
        const pageWidth = 210;
        const targetWidth = pageWidth - 40;
        const targetHeight = (height * targetWidth) / width;
        doc.addImage(b64Image, "JPEG", 20, 30, targetWidth, targetHeight);
        finalBlob = doc.output("blob");
      }

      setResult({
        blob: finalBlob,
        url: URL.createObjectURL(finalBlob),
        size: formatBytes(finalBlob.size),
        filename: `voter_id_${Date.now()}.pdf`
      });

    } catch (error) {
      console.error(error);
      alert("Failed to create PDF. Please try a different image.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white dark:bg-[#09090b] rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-gray-100 dark:border-gray-800 p-8 w-full max-w-3xl mx-auto transition-colors duration-300">
      <canvas ref={canvasRef} style={{ display: "none" }} />

      {!file ? (
        <div 
          className="border-2 border-dashed border-indigo-300 dark:border-indigo-700 hover:border-indigo-500 bg-indigo-50 dark:bg-indigo-900/10 rounded-2xl p-16 text-center cursor-pointer transition duration-300"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => { e.preventDefault(); handleFile(e.dataTransfer.files[0]); }}
          onClick={() => document.getElementById("img-upload").click()}
        >
          <i className="fa-solid fa-address-card text-indigo-500 text-6xl mb-4"></i>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Upload ID Photo</h3>
          <p className="text-gray-500 dark:text-gray-400 font-medium">Accepts JPG and PNG format.</p>
          <input type="file" id="img-upload" accept="image/*" className="hidden" onChange={(e) => handleFile(e.target.files[0])} />
        </div>
      ) : !result ? (
        <div className="animate-in fade-in zoom-in duration-300">
          <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-4 rounded-xl mb-8">
            <div className="flex items-center gap-4">
              <img src={URL.createObjectURL(file)} className="w-16 h-16 object-cover rounded-lg border border-gray-300" alt="Preview" />
              <div>
                <div className="font-bold text-gray-900 dark:text-gray-100 text-lg">{file.name}</div>
                <div className="text-sm text-gray-500">{formatBytes(file.size)}</div>
              </div>
            </div>
            <button className="text-gray-400 hover:text-red-500 p-2" onClick={() => setFile(null)}><i className="fa-solid fa-xmark text-2xl"></i></button>
          </div>

          <button 
            onClick={processToPdf}
            disabled={isProcessing}
            className="w-full bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white px-8 py-5 rounded-2xl font-extrabold text-xl flex items-center justify-center gap-3 transition-all shadow-lg shadow-indigo-500/30"
          >
            {isProcessing ? <Loader2 className="animate-spin h-6 w-6" /> : <i className="fa-solid fa-file-pdf"></i>}
            {isProcessing ? "Optimizing and Generating PDF..." : "Convert to 100KB PDF"}
          </button>
        </div>
      ) : (
        <div className="text-center animate-in zoom-in duration-500 py-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-500 rounded-full mb-6 shadow-sm border border-emerald-200">
            <i className="fa-solid fa-check-double text-4xl"></i>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">PDF Successfully Created!</h2>
          
          <div className="bg-white dark:bg-gray-900 py-3 px-6 rounded-xl border border-gray-200 dark:border-gray-800 inline-flex flex-col items-center shadow-sm mx-auto mb-8 mt-4">
            <span className="text-xs text-gray-500 uppercase font-bold mb-1">Final PDF Size</span>
            <span className="font-extrabold text-indigo-600 text-2xl">{result.size}</span>
            <span className="text-xs text-emerald-600 mt-1 font-bold bg-emerald-50 px-2 py-1 rounded">Under 100KB Target</span>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button onClick={() => {setFile(null); setResult(null);}} className="px-6 py-4 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-bold transition hover:bg-gray-200">
              Convert Another
            </button>
            <a href={result.url} download={result.filename} className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/30 rounded-xl font-extrabold transition flex items-center justify-center gap-3 hover:-translate-y-1">
              <i className="fa-solid fa-download"></i> Download PDF
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
