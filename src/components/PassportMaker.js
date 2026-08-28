"use client";

import { useState, useRef, useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function PassportMaker() {
  const [file, setFile] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
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
    setZoom(1);
    setOffsetX(0);
    setOffsetY(0);

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        imageRef.current = img;
        processImage(); 
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(selectedFile);
  };

  useEffect(() => {
    if (file && imageRef.current) {
      processImage();
    }
  }, [zoom, offsetX, offsetY]);

  const processImage = async () => {
    if (!imageRef.current) return;

    try {
      const img = imageRef.current;
      // Exact Indian Passport Dimensions (3.5cm x 4.5cm at 300 DPI)
      const targetWidth = 413; 
      const targetHeight = 531; 

      const canvas = canvasRef.current;
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext("2d");

      // White background fill
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, targetWidth, targetHeight);

      // Calculate base scale to 'cover' the box
      const baseScale = Math.max(targetWidth / img.width, targetHeight / img.height);
      const finalScale = baseScale * zoom;

      const drawWidth = img.width * finalScale;
      const drawHeight = img.height * finalScale;

      // Center it, then apply offsets
      const startX = (targetWidth - drawWidth) / 2 + (offsetX * 2);
      const startY = (targetHeight - drawHeight) / 2 + (offsetY * 2);

      ctx.drawImage(img, startX, startY, drawWidth, drawHeight);

      // Quick preview rendering (not full compression logic to keep slider fast)
      setResult({
        previewUrl: canvas.toDataURL("image/jpeg", 0.7),
        width: targetWidth,
        height: targetHeight
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleFinalize = async () => {
    setIsProcessing(true);
    try {
      const canvas = canvasRef.current;
      
      // Binary Search to hit EXACT 20KB - 50KB range
      let minQ = 0.01;
      let maxQ = 1.0;
      let quality = 0.9;
      let finalBlob = null;
      let attempts = 0;
      
      const maxKB = 49;
      const minKB = 20;

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
          finalBlob = blob; 
          break;
        }
        attempts++;
      }

      if (!finalBlob) {
        const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
        const res = await fetch(dataUrl);
        finalBlob = await res.blob();
      }

      setResult({
        ...result,
        blob: finalBlob,
        finalUrl: URL.createObjectURL(finalBlob),
        size: formatBytes(finalBlob.size),
        filename: `passport_${Date.now()}.jpg`
      });
    } catch (err) {
      console.error(err);
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
              className="border-2 border-dashed border-emerald-300 dark:border-emerald-700 hover:border-emerald-500 bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl p-10 text-center cursor-pointer transition duration-300 h-full flex flex-col justify-center items-center"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => { e.preventDefault(); handleFile(e.dataTransfer.files[0]); }}
              onClick={() => document.getElementById("img-upload").click()}
            >
              <i className="fa-solid fa-camera text-emerald-500 text-6xl mb-4"></i>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Upload Portrait Photo</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">We'll help you crop it perfectly to 3.5cm x 4.5cm.</p>
              <input type="file" id="img-upload" accept="image/*" className="hidden" onChange={(e) => handleFile(e.target.files[0])} />
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-4 rounded-xl">
                <div className="flex items-center gap-4 truncate">
                  <div className="text-emerald-500 text-2xl"><i className="fa-solid fa-image"></i></div>
                  <div className="truncate">
                    <div className="font-bold text-gray-900 dark:text-gray-100 truncate text-sm">{file.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Original Upload</div>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-red-500 p-2" onClick={() => { setFile(null); setResult(null); }}><i className="fa-solid fa-trash"></i></button>
              </div>

              {/* Tools Panel */}
              <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-5 rounded-2xl">
                <h4 className="font-bold text-gray-900 dark:text-white mb-4 uppercase text-xs tracking-wider">Crop Adjustments</h4>
                
                <div className="mb-6">
                  <label className="flex justify-between text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                    <span><i className="fa-solid fa-magnifying-glass-plus mr-1"></i> Zoom In/Out</span>
                  </label>
                  <input 
                    type="range" 
                    min="1" max="3" step="0.01"
                    value={zoom} 
                    onChange={(e) => setZoom(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                </div>

                <div className="mb-6">
                  <label className="flex justify-between text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                    <span><i className="fa-solid fa-arrows-up-down mr-1"></i> Move Up/Down</span>
                  </label>
                  <input 
                    type="range" 
                    min="-150" max="150" step="1"
                    value={offsetY} 
                    onChange={(e) => setOffsetY(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                </div>

                <div>
                  <label className="flex justify-between text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                    <span><i className="fa-solid fa-arrows-left-right mr-1"></i> Move Left/Right</span>
                  </label>
                  <input 
                    type="range" 
                    min="-150" max="150" step="1"
                    value={offsetX} 
                    onChange={(e) => setOffsetX(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Right Col: Live Result Preview */}
        <div className="flex flex-col">
          <div className="flex-grow flex flex-col items-center justify-center bg-gray-50 dark:bg-[#09090b] border-2 border-gray-100 dark:border-gray-800 rounded-3xl p-8 min-h-[400px]">
            {!result ? (
              <div className="text-center text-gray-400 dark:text-gray-600">
                <div className="w-32 h-40 border-4 border-dashed border-gray-300 dark:border-gray-700 rounded-lg mx-auto mb-4 flex items-center justify-center opacity-50">
                  <i className="fa-solid fa-user text-4xl"></i>
                </div>
                <p className="font-medium">Live crop preview.</p>
              </div>
            ) : (
              <div className="text-center w-full animate-in zoom-in duration-300">
                <div className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 px-4 py-2 rounded-full text-xs font-bold inline-flex items-center gap-2 mb-6 border border-emerald-200 dark:border-emerald-800">
                  <i className="fa-solid fa-ruler-combined"></i> Exact 3.5cm x 4.5cm
                </div>
                
                <div className="relative inline-block mx-auto mb-6 p-2 bg-white rounded-xl shadow-lg border border-gray-200">
                  <img src={result.finalUrl || result.previewUrl} alt="Passport Crop" className="rounded-lg object-contain w-[180px] shadow-sm border border-gray-100" />
                  
                  {/* Photo Guides Overlay (only shows when adjusting, not after finalizing) */}
                  {!result.finalUrl && (
                    <div className="absolute inset-2 border border-white/50 pointer-events-none rounded-lg flex flex-col items-center justify-center">
                      <div className="w-16 h-20 border-2 border-dashed border-white/70 rounded-[40%] mt-4"></div>
                      <div className="w-24 h-8 border-t-2 border-dashed border-white/70 mt-2 rounded-t-[50%]"></div>
                    </div>
                  )}
                </div>
                
                {result.finalUrl && (
                  <div className="bg-emerald-50 dark:bg-emerald-900/20 py-2 px-6 rounded-xl border border-emerald-100 dark:border-emerald-900 inline-flex items-center gap-3 w-full justify-center shadow-sm mx-auto mb-2">
                    <span className="font-extrabold text-emerald-600 text-lg">{result.size}</span>
                    <span className="text-xs text-emerald-600 font-bold uppercase tracking-wider opacity-80">(Passed 20-50KB Limit)</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          {result && !result.finalUrl && (
            <button 
              onClick={handleFinalize}
              disabled={isProcessing}
              className="mt-6 w-full inline-flex items-center justify-center gap-3 px-8 py-5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg shadow-emerald-500/30 rounded-2xl font-extrabold text-lg transition-all hover:-translate-y-1"
            >
              {isProcessing ? <Loader2 className="animate-spin h-5 w-5" /> : <i className="fa-solid fa-compress"></i>}
              {isProcessing ? "Optimizing Size..." : "Looks Good, Finalize Size"}
            </button>
          )}

          {result?.finalUrl && (
            <a 
              href={result.finalUrl} 
              download={result.filename} 
              className="mt-6 w-full inline-flex items-center justify-center gap-3 px-8 py-5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg shadow-emerald-500/30 rounded-2xl font-extrabold text-lg transition-all hover:-translate-y-1"
            >
              <i className="fa-solid fa-download"></i> Download Passport Photo
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
