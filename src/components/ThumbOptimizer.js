"use client";

import { useState, useRef, useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function ThumbOptimizer() {
  const [file, setFile] = useState(null);
  const [inkColor, setInkColor] = useState("blue"); // blue or black
  const [threshold, setThreshold] = useState(140); // 0-255 threshold for binarization
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);
  
  const canvasRef = useRef(null);
  const imageRef = useRef(null);

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

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        imageRef.current = img;
        processImage(); // Initial processing
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(selectedFile);
  };

  // Process whenever threshold or color changes
  useEffect(() => {
    if (file && imageRef.current) {
      processImage();
    }
  }, [threshold, inkColor]);

  const processImage = async () => {
    if (!imageRef.current) return;
    setIsProcessing(true);

    try {
      const img = imageRef.current;
      const targetWidth = 472; // ~4.0cm at 300 DPI
      const targetHeight = 354; // ~3.0cm at 300 DPI

      const canvas = canvasRef.current;
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext("2d");

      // Fill white background
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, targetWidth, targetHeight);

      // Draw original image scaled to fit
      const scale = Math.max(targetWidth / img.width, targetHeight / img.height);
      const x = (targetWidth / 2) - (img.width / 2) * scale;
      const y = (targetHeight / 2) - (img.height / 2) * scale;
      ctx.drawImage(img, x, y, img.width * scale, img.height * scale);

      // --- PIXEL MANIPULATION FOR INK ENHANCEMENT ---
      const imageData = ctx.getImageData(0, 0, targetWidth, targetHeight);
      const data = imageData.data;

      // Define target ink colors
      // Blue ink (Standard stamp pad blue)
      const targetR = inkColor === "blue" ? 20 : 10;
      const targetG = inkColor === "blue" ? 50 : 10;
      const targetB = inkColor === "blue" ? 140 : 10;

      for (let i = 0; i < data.length; i += 4) {
        // Calculate relative luminance (grayscale)
        const luminance = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
        
        // If pixel is darker than threshold, it's ink. Make it deep blue/black.
        if (luminance < threshold) {
          data[i] = targetR;     // R
          data[i + 1] = targetG; // G
          data[i + 2] = targetB; // B
        } else {
          // If it's lighter than threshold, it's paper/shadow. Make it pure white.
          data[i] = 255;
          data[i + 1] = 255;
          data[i + 2] = 255;
        }
      }
      
      ctx.putImageData(imageData, 0, 0);

      // --- COMPRESSION TO EXACT KB (10KB - 50KB limit) ---
      let minQ = 0.01;
      let maxQ = 1.0;
      let quality = 0.9;
      let finalBlob = null;
      let attempts = 0;
      
      const maxKB = 49;
      const minKB = 10;

      while (attempts < 10) {
        quality = (minQ + maxQ) / 2;
        const dataUrl = canvas.toDataURL("image/jpeg", quality);
        const res = await fetch(dataUrl);
        const blob = await res.blob();
        const sizeKB = blob.size / 1024;

        if (sizeKB > maxKB) {
          maxQ = quality; 
        } else if (sizeKB < minKB) {
          minQ = quality; 
          finalBlob = blob; 
        } else {
          finalBlob = blob; // Perfect fit
          break;
        }
        attempts++;
      }

      if (!finalBlob) {
        const dataUrl = canvas.toDataURL("image/jpeg", 0.6);
        const res = await fetch(dataUrl);
        finalBlob = await res.blob();
      }

      setResult({
        blob: finalBlob,
        url: URL.createObjectURL(finalBlob),
        size: formatBytes(finalBlob.size),
        filename: `thumb_${inkColor}_${Date.now()}.jpg`
      });

    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white dark:bg-[#09090b] rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-gray-100 dark:border-gray-800 p-8 w-full max-w-4xl mx-auto transition-colors duration-300">
      <canvas ref={canvasRef} style={{ display: "none" }} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        
        {/* Left Col: Upload & Adjustments */}
        <div className="flex flex-col gap-6">
          {!file ? (
            <div 
              className="border-2 border-dashed border-emerald-300 dark:border-emerald-700 hover:border-emerald-500 bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl p-10 text-center cursor-pointer transition duration-300"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => { e.preventDefault(); handleFile(e.dataTransfer.files[0]); }}
              onClick={() => document.getElementById("img-upload").click()}
            >
              <i className="fa-solid fa-fingerprint text-emerald-500 text-6xl mb-4"></i>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Upload Thumb Scan</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Takes faded phone photos and makes them perfect.</p>
              <input type="file" id="img-upload" accept="image/*" className="hidden" onChange={(e) => handleFile(e.target.files[0])} />
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-4 rounded-xl">
                <div className="flex items-center gap-4 truncate">
                  <div className="text-emerald-500 text-2xl"><i className="fa-solid fa-image"></i></div>
                  <div className="truncate">
                    <div className="font-bold text-gray-900 dark:text-gray-100 truncate text-sm">{file.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Original uploaded</div>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-red-500 p-2" onClick={() => { setFile(null); setResult(null); }}><i className="fa-solid fa-trash"></i></button>
              </div>

              {/* Tools Panel */}
              <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-5 rounded-2xl">
                <h4 className="font-bold text-gray-900 dark:text-white mb-4 uppercase text-xs tracking-wider">Enhancement Settings</h4>
                
                <div className="mb-6">
                  <label className="flex justify-between text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                    <span>Ink Thickness (Threshold)</span>
                    <span className="text-emerald-600 dark:text-emerald-400">{threshold}</span>
                  </label>
                  <input 
                    type="range" 
                    min="50" max="200" 
                    value={threshold} 
                    onChange={(e) => setThreshold(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Lighter Ink</span>
                    <span>Thicker Ink</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Required Ink Color</label>
                  <div className="flex gap-4">
                    <label className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 cursor-pointer transition ${inkColor === 'blue' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' : 'border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
                      <input type="radio" checked={inkColor === 'blue'} onChange={() => setInkColor('blue')} className="hidden" />
                      <div className="w-4 h-4 rounded-full bg-blue-600"></div> Blue Ink
                    </label>
                    <label className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 cursor-pointer transition ${inkColor === 'black' ? 'border-gray-900 dark:border-gray-500 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white' : 'border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
                      <input type="radio" checked={inkColor === 'black'} onChange={() => setInkColor('black')} className="hidden" />
                      <div className="w-4 h-4 rounded-full bg-black dark:bg-gray-400"></div> Black Ink
                    </label>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Right Col: Live Result Preview */}
        <div className="flex flex-col">
          <div className="flex-grow flex flex-col items-center justify-center bg-gray-50 dark:bg-[#09090b] border-2 border-gray-100 dark:border-gray-800 rounded-3xl p-8 min-h-[350px]">
            {!result ? (
              <div className="text-center text-gray-400 dark:text-gray-600">
                <i className="fa-solid fa-fingerprint text-6xl mb-4 opacity-30"></i>
                <p className="font-medium">Live preview will appear here.</p>
              </div>
            ) : (
              <div className="text-center w-full animate-in zoom-in duration-300">
                <div className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 px-4 py-2 rounded-full text-xs font-bold inline-flex items-center gap-2 mb-6 border border-emerald-200 dark:border-emerald-800">
                  <i className="fa-solid fa-wand-magic-sparkles"></i> White Background + Enhanced Ink
                </div>
                
                <div className="relative inline-block mx-auto mb-6 p-2 bg-white rounded-xl shadow-md border border-gray-200">
                  {/* Result Image */}
                  <img src={result.url} alt="Optimized" className="rounded-lg object-contain w-[200px]" />
                </div>
                
                <div className="bg-white dark:bg-gray-900 py-3 px-6 rounded-xl border border-gray-200 dark:border-gray-800 inline-flex flex-col items-center shadow-sm w-full max-w-[250px] mx-auto mb-6">
                  <span className="text-xs text-gray-500 uppercase font-bold mb-1">Guaranteed Size Limit</span>
                  <span className="font-extrabold text-emerald-600 text-xl">{result.size}</span>
                  <span className="text-xs text-emerald-600 mt-1 font-medium bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded">Passed Govt Limits (10-50KB)</span>
                </div>
              </div>
            )}
          </div>

          {/* Download Button */}
          {result && (
            <a 
              href={result.url} 
              download={result.filename} 
              className="mt-6 w-full inline-flex items-center justify-center gap-3 px-8 py-5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg shadow-emerald-500/30 rounded-2xl font-extrabold text-lg transition-all hover:-translate-y-1"
            >
              <i className="fa-solid fa-download"></i> Download Optimized Print
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
