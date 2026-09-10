"use client";

import React, { useState, useRef, useEffect } from "react";
import JSZip from "jszip";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useProStatus } from "@/hooks/useProStatus";

export default function JpgToWebp() {
  const [user, setUser] = useState(null);
  const { isPro } = useProStatus(user);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const [files, setFiles] = useState([]);
  const [quality, setQuality] = useState(0.8);
  const [isConverting, setIsConverting] = useState(false);
  const [conversionProgress, setConversionProgress] = useState(0);
  const [isZipping, setIsZipping] = useState(false);
  const [premiumAlert, setPremiumAlert] = useState({ show: false, message: "" });
  const fileInputRef = useRef(null);

  const formatSize = (bytes) => {
    if (!bytes || bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleFiles = (incomingFiles) => {
    if (!incomingFiles || incomingFiles.length === 0) return;

    const validFiles = Array.from(incomingFiles).filter(file => 
      file.type.match(/^image\/(jpeg|png|webp|jpg)$/) || file.name.match(/\.(jpe?g|png|webp)$/i)
    );

    if (validFiles.length === 0) {
      alert("Please upload valid JPG or PNG images.");
      return;
    }

    // Free users can only process 1 image at a time
    if (validFiles.length > 1 && !isPro) {
      setPremiumAlert({
        show: true,
        message: `You selected ${validFiles.length} images. Bulk conversion is a Pro feature! Free accounts can convert 1 image at a time. Upgrade to Pro for unlimited bulk conversion with 1-click ZIP download.`
      });
      // Accept only the first file for free users
      const singleFile = validFiles[0];
      const previewUrl = URL.createObjectURL(singleFile);
      setFiles([{
        id: Math.random().toString(36).substring(2, 9),
        file: singleFile,
        name: singleFile.name,
        originalSize: singleFile.size,
        previewUrl: previewUrl,
        webpBlob: null,
        webpUrl: null,
        newSize: 0,
        status: "idle"
      }]);
      return;
    }

    // Pro users can add multiple files (or single file for free users)
    const newItems = validFiles.map(file => ({
      id: Math.random().toString(36).substring(2, 9),
      file: file,
      name: file.name,
      originalSize: file.size,
      previewUrl: URL.createObjectURL(file),
      webpBlob: null,
      webpUrl: null,
      newSize: 0,
      status: "idle"
    }));

    if (isPro) {
      setFiles(prev => [...prev, ...newItems]);
    } else {
      setFiles(newItems.slice(0, 1));
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
    // reset input so same file can be reselected if needed
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const removeFile = (id) => {
    setFiles(prev => {
      const filtered = prev.filter(f => f.id !== id);
      const target = prev.find(f => f.id === id);
      if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl);
      if (target?.webpUrl) URL.revokeObjectURL(target.webpUrl);
      return filtered;
    });
  };

  const clearAll = () => {
    files.forEach(f => {
      if (f.previewUrl) URL.revokeObjectURL(f.previewUrl);
      if (f.webpUrl) URL.revokeObjectURL(f.webpUrl);
    });
    setFiles([]);
  };

  // Convert single image helper
  const convertImageToWebp = (fileObj) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob);
              resolve({
                ...fileObj,
                webpBlob: blob,
                webpUrl: url,
                newSize: blob.size,
                status: "done"
              });
            } else {
              resolve({ ...fileObj, status: "error" });
            }
          },
          "image/webp",
          parseFloat(quality)
        );
      };
      img.onerror = () => {
        resolve({ ...fileObj, status: "error" });
      };
      img.src = fileObj.previewUrl;
    });
  };

  const handleConvertAll = async () => {
    if (files.length === 0) return;
    setIsConverting(true);
    setConversionProgress(0);

    const updatedFiles = [...files];

    for (let i = 0; i < updatedFiles.length; i++) {
      const item = updatedFiles[i];
      // mark as converting
      item.status = "converting";
      setFiles([...updatedFiles]);

      const result = await convertImageToWebp(item);
      updatedFiles[i] = result;
      setFiles([...updatedFiles]);
      setConversionProgress(Math.round(((i + 1) / updatedFiles.length) * 100));
    }

    setIsConverting(false);
  };

  const downloadSingle = (item) => {
    if (!item.webpUrl) return;
    const originalBase = item.name.substring(0, item.name.lastIndexOf(".")) || item.name;
    const a = document.createElement("a");
    a.href = item.webpUrl;
    a.download = `${originalBase}.webp`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const downloadAllZip = async () => {
    const convertedItems = files.filter(f => f.webpBlob && f.status === "done");
    if (convertedItems.length === 0) return;

    setIsZipping(true);
    try {
      const zip = new JSZip();
      convertedItems.forEach((item, index) => {
        const originalBase = item.name.substring(0, item.name.lastIndexOf(".")) || `image_${index + 1}`;
        zip.file(`${originalBase}.webp`, item.webpBlob);
      });

      const zipBlob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `converted_webp_${convertedItems.length}_images.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 10000);
    } catch (err) {
      console.error("ZIP creation failed", err);
      alert("Failed to create ZIP file. Please download images individually.");
    } finally {
      setIsZipping(false);
    }
  };

  const allConverted = files.length > 0 && files.every(f => f.status === "done");
  const anyConverted = files.some(f => f.status === "done");

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />

      {/* Upload Zone */}
      {files.length === 0 && (
        <div 
          className="bg-white dark:bg-[#09090b] border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-3xl p-10 sm:p-14 text-center hover:border-amber-500 dark:hover:border-amber-500 transition cursor-pointer shadow-sm relative overflow-hidden group"
          onClick={() => fileInputRef.current.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 flex items-center gap-1.5">
              <i className="fa-solid fa-crown text-amber-500"></i>
              <span>Bulk Conversion for Pro</span>
            </span>
          </div>

          <div className="w-20 h-20 bg-amber-50 dark:bg-amber-900/20 text-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-105 transition-transform">
            <i className="fa-solid fa-file-image text-4xl"></i>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Upload Images to Convert to WEBP
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto text-sm sm:text-base">
            Drag &amp; drop JPG, PNG, or WEBP images here. <br />
            <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">
              Free: 1 image at a time • Pro: Unlimited Bulk Batch Conversion + 1-Click ZIP
            </span>
          </p>
          <button className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-3.5 px-8 rounded-xl transition shadow-md hover:shadow-lg">
            Choose Files
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
            accept="image/jpeg, image/png, image/webp" 
            multiple
          />
        </div>
      )}

      {/* Editor & Multi-file Workspace */}
      {files.length > 0 && (
        <div className="bg-white dark:bg-[#09090b] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          
          {/* Top Bar with stats and Pro badge */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 dark:border-gray-800 pb-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {files.length === 1 ? "1 Image Selected" : `Bulk Conversion (${files.length} Images)`}
                </h3>
                {isPro ? (
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                    <i className="fa-solid fa-crown text-emerald-500"></i> Pro Unlocked
                  </span>
                ) : (
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                    Free Plan
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Adjust compression quality below and convert to high-efficiency next-gen WEBP.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (!isPro && files.length >= 1) {
                    setPremiumAlert({
                      show: true,
                      message: "Bulk conversion is a Pro feature! Free accounts can convert 1 image at a time. Upgrade to Pro to convert multiple images together."
                    });
                    return;
                  }
                  fileInputRef.current?.click();
                }}
                className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition flex items-center gap-1.5"
              >
                <i className="fa-solid fa-plus"></i>
                <span>Add More</span>
              </button>
              <button
                onClick={clearAll}
                className="px-4 py-2 rounded-xl text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition"
              >
                Clear All
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept="image/jpeg, image/png, image/webp" 
                multiple={isPro}
              />
            </div>
          </div>

          {/* Quality Slider Controls */}
          <div className="bg-gray-50 dark:bg-[#121217] rounded-2xl p-5 border border-gray-200/80 dark:border-gray-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <i className="fa-solid fa-sliders text-amber-500"></i>
                <label className="text-sm font-bold text-gray-900 dark:text-gray-200">
                  WEBP Quality: <span className="text-amber-600 dark:text-amber-400">{Math.round(quality * 100)}%</span>
                </label>
              </div>
              <span className="text-xs text-gray-500">
                Recommended: 80% (Maximum compression with zero visible loss)
              </span>
            </div>
            <input 
              type="range" 
              min="0.1" 
              max="1" 
              step="0.05" 
              value={quality}
              onChange={(e) => setQuality(parseFloat(e.target.value))}
              className="w-full accent-amber-600 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-gray-400 mt-1 font-medium">
              <span>Smallest Size (10%)</span>
              <span>Balanced (80%)</span>
              <span>Lossless / Max Quality (100%)</span>
            </div>
          </div>

          {/* Progress Bar (when converting) */}
          {isConverting && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-gray-700 dark:text-gray-300">
                <span className="flex items-center gap-2">
                  <i className="fa-solid fa-spinner fa-spin text-amber-500"></i>
                  Converting Images to WEBP...
                </span>
                <span>{conversionProgress}%</span>
              </div>
              <div className="w-full h-2.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-amber-500 to-amber-600 transition-all duration-300 rounded-full"
                  style={{ width: `${conversionProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Image Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[500px] overflow-y-auto pr-1">
            {files.map((item) => {
              const savedPct = item.newSize > 0 
                ? Math.round(((item.originalSize - item.newSize) / item.originalSize) * 100) 
                : 0;

              return (
                <div 
                  key={item.id} 
                  className="relative bg-gray-50 dark:bg-[#121217] border border-gray-200 dark:border-gray-800 rounded-2xl p-4 flex flex-col justify-between hover:border-gray-300 dark:hover:border-gray-700 transition"
                >
                  <button
                    onClick={() => removeFile(item.id)}
                    className="absolute top-3 right-3 h-7 w-7 rounded-full bg-white dark:bg-gray-800 shadow-xs border border-gray-200 dark:border-gray-700 text-gray-400 hover:text-red-500 flex items-center justify-center transition text-xs z-10"
                    title="Remove"
                  >
                    <i className="fa-solid fa-xmark"></i>
                  </button>

                  <div className="flex gap-3 items-center mb-3">
                    <div className="w-16 h-16 rounded-xl bg-white dark:bg-black border border-gray-200 dark:border-gray-800 overflow-hidden flex items-center justify-center shrink-0">
                      <img 
                        src={item.webpUrl || item.previewUrl} 
                        alt={item.name} 
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    <div className="min-w-0 flex-1 pr-6">
                      <p className="text-xs font-bold text-gray-900 dark:text-gray-100 truncate" title={item.name}>
                        {item.name}
                      </p>
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        Original: {formatSize(item.originalSize)}
                      </p>
                      {item.status === "done" && (
                        <p className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                          WEBP: {formatSize(item.newSize)} {savedPct > 0 ? `(-${savedPct}%)` : ""}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-gray-200/60 dark:border-gray-800 flex items-center justify-between text-xs">
                    <div>
                      {item.status === "idle" && (
                        <span className="text-[10px] font-bold text-gray-400 bg-gray-200 dark:bg-gray-800 px-2 py-0.5 rounded">Ready</span>
                      )}
                      {item.status === "converting" && (
                        <span className="text-[10px] font-bold text-amber-600 bg-amber-100 dark:bg-amber-950/50 px-2 py-0.5 rounded flex items-center gap-1">
                          <i className="fa-solid fa-spinner fa-spin"></i> Converting
                        </span>
                      )}
                      {item.status === "done" && (
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 dark:bg-emerald-950/50 px-2 py-0.5 rounded flex items-center gap-1">
                          <i className="fa-solid fa-check"></i> Converted
                        </span>
                      )}
                      {item.status === "error" && (
                        <span className="text-[10px] font-bold text-red-600 bg-red-100 dark:bg-red-950/50 px-2 py-0.5 rounded">Error</span>
                      )}
                    </div>

                    {item.status === "done" ? (
                      <button
                        onClick={() => downloadSingle(item)}
                        className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
                      >
                        <i className="fa-solid fa-download"></i>
                        <span>Download</span>
                      </button>
                    ) : (
                      <span className="text-[11px] text-gray-400">Pending conversion</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Buttons Footer */}
          <div className="pt-6 border-t border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            {!allConverted ? (
              <button
                onClick={handleConvertAll}
                disabled={isConverting}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold transition flex items-center justify-center gap-2 shadow-md disabled:opacity-60"
              >
                {isConverting ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin"></i>
                    <span>Converting ({conversionProgress}%)...</span>
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-wand-magic-sparkles"></i>
                    <span>Convert {files.length > 1 ? `All ${files.length} Images` : "to WEBP"}</span>
                  </>
                )}
              </button>
            ) : (
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                {files.length > 1 && (
                  <button
                    onClick={downloadAllZip}
                    disabled={isZipping}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition flex items-center justify-center gap-2 shadow-md disabled:opacity-60"
                  >
                    {isZipping ? (
                      <>
                        <i className="fa-solid fa-spinner fa-spin"></i>
                        <span>Creating ZIP...</span>
                      </>
                    ) : (
                      <>
                        <i className="fa-solid fa-file-zipper"></i>
                        <span>Download All as ZIP</span>
                      </>
                    )}
                  </button>
                )}

                {files.length === 1 && (
                  <button
                    onClick={() => downloadSingle(files[0])}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition flex items-center justify-center gap-2 shadow-md"
                  >
                    <i className="fa-solid fa-download"></i>
                    <span>Download Converted WEBP</span>
                  </button>
                )}

                <button
                  onClick={clearAll}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                >
                  Convert Another Batch
                </button>
              </div>
            )}
          </div>

        </div>
      )}

      {/* Pro Upgrade Modal */}
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
              Bulk Conversion is Pro Only
            </h3>
            
            <p className="text-gray-600 dark:text-gray-400 mb-8 font-medium leading-relaxed text-sm sm:text-base">
              {premiumAlert.message}
            </p>
            
            <div className="flex flex-col gap-3">
              <a 
                href="/pricing"
                className="w-full text-center py-4 rounded-xl font-bold text-white bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 shadow-md transition"
              >
                Upgrade to Pro (₹49)
              </a>
              <button 
                onClick={() => setPremiumAlert({ show: false, message: "" })}
                className="w-full text-center py-3.5 rounded-xl font-bold text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                Continue with 1 Image
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
