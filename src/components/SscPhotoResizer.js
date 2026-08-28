"use client";

import { useState, useRef } from "react";
import { Loader2 } from "lucide-react";

export default function SscPhotoResizer() {
  const [file, setFile] = useState(null);
  const [mode, setMode] = useState("ssc_photo"); // ssc_photo, ssc_sign, ibps_sign
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
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
      setErrorMsg("Please upload a valid image file (JPG, PNG).");
      return;
    }
    setFile(selectedFile);
    setResult(null);
    setErrorMsg("");
  };

  const processImage = async () => {
    if (!file) return;
    setIsProcessing(true);
    setErrorMsg("");

    try {
      // Setup targets based on mode
      let targetWidth, targetHeight, minKB, maxKB;
      
      if (mode === "ssc_photo") {
        targetWidth = 413; // ~3.5cm at 300 DPI
        targetHeight = 531; // ~4.5cm at 300 DPI
        minKB = 20;
        maxKB = 49;
      } else if (mode === "ssc_sign") {
        targetWidth = 472; // ~4.0cm at 300 DPI
        targetHeight = 236; // ~2.0cm at 300 DPI
        minKB = 10;
        maxKB = 20;
      } else if (mode === "ibps_sign") {
        targetWidth = 140; 
        targetHeight = 60; 
        minKB = 10;
        maxKB = 20;
      }

      // Load image
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = objectUrl;
      });

      // Draw to canvas with exact dimensions
      const canvas = canvasRef.current;
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext("2d");
      
      // Fill white background (in case of transparent PNGs)
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, targetWidth, targetHeight);

      // Simple scaling (Cover/Center)
      const scale = Math.max(targetWidth / img.width, targetHeight / img.height);
      const x = (targetWidth / 2) - (img.width / 2) * scale;
      const y = (targetHeight / 2) - (img.height / 2) * scale;
      ctx.drawImage(img, x, y, img.width * scale, img.height * scale);

      // Binary Search for perfect File Size (JPEG Quality)
      let minQ = 0.01;
      let maxQ = 1.0;
      let quality = 0.9;
      let finalBlob = null;
      let attempts = 0;

      while (attempts < 10) {
        quality = (minQ + maxQ) / 2;
        const dataUrl = canvas.toDataURL("image/jpeg", quality);
        
        // Convert base64 to blob to check true size
        const res = await fetch(dataUrl);
        const blob = await res.blob();
        const sizeKB = blob.size / 1024;

        if (sizeKB > maxKB) {
          maxQ = quality; // Too big, lower quality
        } else if (sizeKB < minKB) {
          minQ = quality; // Too small, raise quality
          finalBlob = blob; // Save just in case we don't hit the perfect middle
        } else {
          finalBlob = blob; // Perfect!
          break;
        }
        attempts++;
      }

      if (!finalBlob) {
        // Fallback if we couldn't hit the strict range
        const dataUrl = canvas.toDataURL("image/jpeg", 0.5);
        const res = await fetch(dataUrl);
        finalBlob = await res.blob();
      }

      setResult({
        blob: finalBlob,
        url: URL.createObjectURL(finalBlob),
        size: formatBytes(finalBlob.size),
        width: targetWidth,
        height: targetHeight,
        filename: `${mode}_${Date.now()}.jpg`
      });

    } catch (error) {
      console.error(error);
      setErrorMsg("Failed to process image. Please try a different photo.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white dark:bg-[#09090b] rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-gray-100 dark:border-gray-800 p-8 w-full max-w-4xl mx-auto transition-colors duration-300">
      <canvas ref={canvasRef} style={{ display: "none" }} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Left Col: Upload & Settings */}
        <div className="flex flex-col gap-6">
          <div className="bg-emerald-50 dark:bg-emerald-900/10 p-5 rounded-2xl border border-emerald-100 dark:border-emerald-900/30">
            <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-3 uppercase tracking-wider text-sm">Select Output Format</h3>
            <div className="flex flex-col gap-3">
              <label className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition ${mode === 'ssc_photo' ? 'border-emerald-500 bg-white dark:bg-gray-800 shadow-sm' : 'border-transparent hover:bg-white/50 dark:hover:bg-gray-800/50'}`}>
                <input type="radio" name="mode" checked={mode === 'ssc_photo'} onChange={() => setMode('ssc_photo')} className="hidden" />
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${mode === 'ssc_photo' ? 'border-emerald-500' : 'border-gray-400'}`}>
                  {mode === 'ssc_photo' && <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full"></div>}
                </div>
                <div>
                  <div className="font-bold text-gray-900 dark:text-white">SSC / UPSC Photo</div>
                  <div className="text-xs text-gray-500">3.5cm x 4.5cm • 20KB to 50KB</div>
                </div>
              </label>

              <label className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition ${mode === 'ssc_sign' ? 'border-emerald-500 bg-white dark:bg-gray-800 shadow-sm' : 'border-transparent hover:bg-white/50 dark:hover:bg-gray-800/50'}`}>
                <input type="radio" name="mode" checked={mode === 'ssc_sign'} onChange={() => setMode('ssc_sign')} className="hidden" />
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${mode === 'ssc_sign' ? 'border-emerald-500' : 'border-gray-400'}`}>
                  {mode === 'ssc_sign' && <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full"></div>}
                </div>
                <div>
                  <div className="font-bold text-gray-900 dark:text-white">SSC Signature</div>
                  <div className="text-xs text-gray-500">4.0cm x 2.0cm • 10KB to 20KB</div>
                </div>
              </label>

              <label className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition ${mode === 'ibps_sign' ? 'border-emerald-500 bg-white dark:bg-gray-800 shadow-sm' : 'border-transparent hover:bg-white/50 dark:hover:bg-gray-800/50'}`}>
                <input type="radio" name="mode" checked={mode === 'ibps_sign'} onChange={() => setMode('ibps_sign')} className="hidden" />
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${mode === 'ibps_sign' ? 'border-emerald-500' : 'border-gray-400'}`}>
                  {mode === 'ibps_sign' && <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full"></div>}
                </div>
                <div>
                  <div className="font-bold text-gray-900 dark:text-white">IBPS / Bank Signature</div>
                  <div className="text-xs text-gray-500">140px x 60px • 10KB to 20KB</div>
                </div>
              </label>
            </div>
          </div>

          {!file ? (
            <div 
              className="border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-emerald-500 dark:hover:border-emerald-500 bg-gray-50 dark:bg-gray-900 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-2xl p-8 text-center cursor-pointer transition duration-300"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => { e.preventDefault(); handleFile(e.dataTransfer.files[0]); }}
              onClick={() => document.getElementById("img-upload").click()}
            >
              <div className="text-emerald-500 text-4xl mb-3"><i className="fa-solid fa-image"></i></div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">Upload Raw Photo</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">JPG or PNG</p>
              <input type="file" id="img-upload" accept="image/jpeg, image/png" className="hidden" onChange={(e) => handleFile(e.target.files[0])} />
            </div>
          ) : (
            <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-4 rounded-xl">
              <div className="flex items-center gap-4 truncate">
                <img src={URL.createObjectURL(file)} alt="preview" className="w-12 h-12 object-cover rounded-lg border border-gray-200" />
                <div className="truncate">
                  <div className="font-bold text-gray-900 dark:text-gray-100 truncate text-sm">{file.name}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{formatBytes(file.size)}</div>
                </div>
              </div>
              <button className="text-gray-400 hover:text-red-500 p-2 ml-2" onClick={() => { setFile(null); setResult(null); }}><i className="fa-solid fa-xmark"></i></button>
            </div>
          )}

          {errorMsg && <div className="text-red-500 text-sm font-bold">{errorMsg}</div>}

          <button 
            onClick={processImage}
            disabled={!file || isProcessing}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 disabled:from-gray-300 disabled:to-gray-400 text-white px-6 py-4 rounded-xl font-extrabold text-lg flex items-center justify-center gap-3 transition-all shadow-md hover:shadow-lg disabled:shadow-none"
          >
            {isProcessing ? <Loader2 className="animate-spin h-5 w-5" /> : <i className="fa-solid fa-crop-simple"></i>}
            {isProcessing ? "Processing..." : "Fix Photo Format"}
          </button>
        </div>

        {/* Right Col: Result */}
        <div className="flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 border-2 border-gray-100 dark:border-gray-800 rounded-3xl p-8 min-h-[400px]">
          {!result ? (
            <div className="text-center text-gray-400 dark:text-gray-600">
              <i className="fa-solid fa-id-badge text-6xl mb-4 opacity-50"></i>
              <p className="font-medium">Your processed photo will appear here.</p>
            </div>
          ) : (
            <div className="text-center animate-in zoom-in duration-300 w-full">
              <div className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 px-4 py-2 rounded-full text-sm font-bold inline-flex items-center gap-2 mb-6 border border-emerald-200 dark:border-emerald-800">
                <i className="fa-solid fa-circle-check"></i> Perfect Format Achieved!
              </div>
              
              <div className="relative inline-block mx-auto mb-6 p-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                <img src={result.url} alt="Final" className="rounded-lg object-contain" style={{ maxHeight: '200px' }} />
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-white dark:bg-[#09090b] p-3 rounded-xl border border-gray-200 dark:border-gray-800">
                  <div className="text-xs text-gray-500 uppercase font-bold mb-1">Final Size</div>
                  <div className="font-extrabold text-emerald-600 text-lg">{result.size}</div>
                </div>
                <div className="bg-white dark:bg-[#09090b] p-3 rounded-xl border border-gray-200 dark:border-gray-800">
                  <div className="text-xs text-gray-500 uppercase font-bold mb-1">Dimensions</div>
                  <div className="font-extrabold text-gray-900 dark:text-white text-lg">{result.width}x{result.height}</div>
                </div>
              </div>

              <a href={result.url} download={result.filename} className="w-full inline-flex items-center justify-center gap-3 px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/30 rounded-xl font-extrabold transition hover:-translate-y-1">
                <i className="fa-solid fa-download"></i> Download Image
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
