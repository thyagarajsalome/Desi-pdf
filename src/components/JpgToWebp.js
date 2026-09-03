"use client";

import React, { useState, useRef } from "react";

export default function JpgToWebp() {
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [webpUrl, setWebpUrl] = useState(null);
  const [quality, setQuality] = useState(0.8);
  const [originalSize, setOriginalSize] = useState(0);
  const [newSize, setNewSize] = useState(0);
  const [isConverting, setIsConverting] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && (file.type.match("image/jpeg") || file.type.match("image/png") || file.type.match("image/webp"))) {
      setOriginalSize(file.size);
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target.result);
        setPreviewUrl(event.target.result);
        setWebpUrl(null);
      };
      reader.readAsDataURL(file);
    } else {
      alert("Please upload a valid JPG or PNG image.");
    }
  };

  const convertToWebp = () => {
    if (!image) return;
    setIsConverting(true);

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
            setNewSize(blob.size);
            const url = URL.createObjectURL(blob);
            setWebpUrl(url);
          }
          setIsConverting(false);
        },
        "image/webp",
        parseFloat(quality)
      );
    };
    img.src = image;
  };

  const formatSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange({ target: { files: [e.dataTransfer.files[0]] } });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />

      {/* Upload Box */}
      {!image && (
        <div 
          className="bg-white dark:bg-[#09090b] border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-3xl p-12 text-center hover:border-amber-500 dark:hover:border-amber-500 transition cursor-pointer shadow-sm"
          onClick={() => fileInputRef.current.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          <div className="w-20 h-20 bg-amber-50 dark:bg-amber-900/20 text-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <i className="fa-solid fa-file-image text-4xl"></i>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Upload Image to Convert</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">Drag and drop a JPG or PNG file here, or click to browse</p>
          <button className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-8 rounded-xl transition shadow-md hover:shadow-lg">
            Choose File
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
            accept="image/jpeg, image/png, image/webp" 
          />
        </div>
      )}

      {/* Editor & Preview */}
      {image && (
        <div className="bg-white dark:bg-[#09090b] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-sm">
          
          <div className="flex flex-col md:flex-row gap-8">
            {/* Left: Original */}
            <div className="flex-1 space-y-4">
              <h3 className="font-bold text-gray-900 dark:text-white flex justify-between items-center">
                Original Image
                <span className="text-sm font-normal text-gray-500 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
                  {formatSize(originalSize)}
                </span>
              </h3>
              <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-2 overflow-hidden flex items-center justify-center h-64">
                <img src={previewUrl} alt="Original" className="max-h-full max-w-full object-contain" />
              </div>
            </div>

            {/* Right: Converted or Controls */}
            <div className="flex-1 space-y-4">
              <h3 className="font-bold text-gray-900 dark:text-white flex justify-between items-center">
                WEBP Output
                {webpUrl && (
                  <span className="text-sm font-normal text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                    {formatSize(newSize)} (-{((originalSize - newSize) / originalSize * 100).toFixed(0)}%)
                  </span>
                )}
              </h3>
              <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-2 overflow-hidden flex items-center justify-center h-64 relative">
                {webpUrl ? (
                  <img src={webpUrl} alt="WEBP Converted" className="max-h-full max-w-full object-contain" />
                ) : (
                  <div className="text-center p-6">
                    <p className="text-gray-500 dark:text-gray-400 mb-4 text-sm">
                      WEBP format provides superior compression for images on the web, often reducing file size by 30-50% compared to JPG without visible quality loss.
                    </p>
                    
                    <div className="space-y-2 text-left mb-6">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Quality: {Math.round(quality * 100)}%</label>
                      <input 
                        type="range" 
                        min="0.1" 
                        max="1" 
                        step="0.05" 
                        value={quality}
                        onChange={(e) => setQuality(e.target.value)}
                        className="w-full accent-amber-600"
                      />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Smallest File</span>
                        <span>Best Quality</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 items-center justify-center border-t border-gray-100 dark:border-gray-800 pt-6">
            <button 
              onClick={() => { setImage(null); setWebpUrl(null); }}
              className="px-6 py-3 rounded-xl border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition w-full sm:w-auto"
            >
              Start Over
            </button>
            
            {!webpUrl ? (
              <button 
                onClick={convertToWebp}
                disabled={isConverting}
                className="px-8 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold transition flex items-center justify-center gap-2 shadow-md w-full sm:w-auto disabled:opacity-70"
              >
                {isConverting ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-wand-magic-sparkles"></i>}
                Convert to WEBP
              </button>
            ) : (
              <a 
                href={webpUrl}
                download="converted-image.webp"
                className="px-8 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition flex items-center justify-center gap-2 shadow-md w-full sm:w-auto"
              >
                <i className="fa-solid fa-download"></i>
                Download WEBP
              </a>
            )}
          </div>

        </div>
      )}
    </div>
  );
}
