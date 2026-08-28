"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';

const formatBytes = (bytes, decimals = 2) => {
  if (!+bytes) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

export default function ImageCompressor() {
  const [file, setFile] = useState(null);
  const [originalUrl, setOriginalUrl] = useState(null);
  const [compressedFile, setCompressedFile] = useState(null);
  const [compressedUrl, setCompressedUrl] = useState(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const [targetSizeKB, setTargetSizeKB] = useState(100);
  const [isCustomSize, setIsCustomSize] = useState(false);
  const [customSizeInput, setCustomSizeInput] = useState('');
  
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const presets = [
    { label: '10KB', value: 10 },
    { label: '20KB', value: 20 },
    { label: '50KB', value: 50 },
    { label: '100KB', value: 100 },
    { label: '200KB', value: 200 },
    { label: '500KB', value: 500 },
    { label: '1MB', value: 1024 },
  ];

  useEffect(() => {
    return () => {
      if (originalUrl) URL.revokeObjectURL(originalUrl);
      if (compressedUrl) URL.revokeObjectURL(compressedUrl);
    };
  }, [originalUrl, compressedUrl]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type.match(/^image\/(jpeg|png|webp)$/)) {
      setFile(selectedFile);
      setOriginalUrl(URL.createObjectURL(selectedFile));
      setCompressedFile(null);
      if (compressedUrl) URL.revokeObjectURL(compressedUrl);
      setCompressedUrl(null);
      setError(null);
    } else if (selectedFile) {
      setError('Please upload a valid image file (JPG, PNG, WEBP).');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile && droppedFile.type.match(/^image\/(jpeg|png|webp)$/)) {
      setFile(droppedFile);
      setOriginalUrl(URL.createObjectURL(droppedFile));
      setCompressedFile(null);
      if (compressedUrl) URL.revokeObjectURL(compressedUrl);
      setCompressedUrl(null);
      setError(null);
    } else if (droppedFile) {
      setError('Please upload a valid image file (JPG, PNG, WEBP).');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const compressImage = async () => {
    if (!file) return;

    const targetBytes = targetSizeKB * 1024;
    if (file.size <= targetBytes) {
      setError('Image is already smaller than the target size.');
      return;
    }

    setIsCompressing(true);
    setProgress(0);
    setError(null);

    const img = new Image();
    img.src = originalUrl;

    await new Promise((resolve) => {
      img.onload = resolve;
    });

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Calculate new dimensions to help with compression if needed
    // First let's try with original dimensions
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);

    const compress = async () => {
      let minQ = 0.01;
      let maxQ = 1.0;
      let currentQ = 0.5;
      let bestBlob = null;
      const maxIterations = 15;
      
      for (let i = 0; i < maxIterations; i++) {
        setProgress(Math.round(((i + 1) / maxIterations) * 100));
        
        const blob = await new Promise((resolve) => {
          canvas.toBlob(resolve, 'image/jpeg', currentQ);
        });

        if (!blob) break;

        bestBlob = blob;

        if (Math.abs(blob.size - targetBytes) < targetBytes * 0.05) {
          // Within 5% of target size, good enough
          break;
        }

        if (blob.size > targetBytes) {
          maxQ = currentQ;
        } else {
          minQ = currentQ;
        }
        currentQ = (minQ + maxQ) / 2;
      }

      // If even lowest quality is still too big, we might need to resize
      if (bestBlob.size > targetBytes && currentQ < 0.1) {
        let scale = Math.sqrt(targetBytes / bestBlob.size);
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        bestBlob = await new Promise((resolve) => {
          canvas.toBlob(resolve, 'image/jpeg', 0.5); // try with 0.5 after resize
        });
      }

      setProgress(100);
      
      const compressedFileObj = new File([bestBlob], file.name.replace(/\.[^/.]+$/, "") + "_compressed.jpg", {
        type: 'image/jpeg',
        lastModified: Date.now(),
      });
      
      setCompressedFile(compressedFileObj);
      setCompressedUrl(URL.createObjectURL(bestBlob));
      setIsCompressing(false);
    };

    // Give UI time to update
    setTimeout(compress, 50);
  };

  const handleDownload = () => {
    if (compressedUrl) {
      const a = document.createElement('a');
      a.href = compressedUrl;
      a.download = compressedFile.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto font-sans">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      
      <div className="bg-white dark:bg-[#09090b] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 md:p-8 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">
          <i className="fa-solid fa-compress text-emerald-500 mr-2"></i>
          Image Compressor
        </h2>

        {!file ? (
          <div 
            className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl p-8 text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <i className="fa-solid fa-cloud-arrow-up text-4xl text-gray-400 dark:text-gray-500 mb-4"></i>
            <p className="text-gray-600 dark:text-gray-300 font-medium mb-2">
              Drag & Drop your image here
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              or click to browse (JPG, PNG, WEBP)
            </p>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/jpeg, image/png, image/webp" 
              className="hidden" 
            />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
              <div className="flex items-center truncate mr-4">
                <i className="fa-regular fa-image text-emerald-500 text-xl mr-3"></i>
                <div className="truncate">
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{file.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Original: {formatBytes(file.size)}</p>
                </div>
              </div>
              <button 
                onClick={() => {
                  setFile(null);
                  setCompressedFile(null);
                }}
                className="text-gray-400 hover:text-red-500 transition-colors shrink-0"
                title="Remove image"
              >
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>

            {!compressedFile && (
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Target File Size
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2">
                  {presets.map((preset) => (
                    <button
                      key={preset.value}
                      onClick={() => {
                        setTargetSizeKB(preset.value);
                        setIsCustomSize(false);
                      }}
                      className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                        !isCustomSize && targetSizeKB === preset.value
                          ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 border-2 border-emerald-500'
                          : 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-2 border-transparent hover:border-gray-200 dark:hover:border-gray-700'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
                
                <div className="flex items-center mt-3">
                  <button
                    onClick={() => setIsCustomSize(true)}
                    className={`py-2 px-4 rounded-lg text-sm font-medium transition-all mr-3 ${
                      isCustomSize
                        ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 border-2 border-emerald-500'
                        : 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-2 border-transparent hover:border-gray-200 dark:hover:border-gray-700'
                    }`}
                  >
                    Custom Size
                  </button>
                  {isCustomSize && (
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        min="1"
                        value={customSizeInput}
                        onChange={(e) => {
                          setCustomSizeInput(e.target.value);
                          const val = parseInt(e.target.value);
                          if (!isNaN(val) && val > 0) {
                            setTargetSizeKB(val);
                          }
                        }}
                        placeholder="e.g. 150"
                        className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg py-2 px-3 text-sm text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 w-24"
                      />
                      <span className="text-gray-600 dark:text-gray-400 text-sm">KB</span>
                    </div>
                  )}
                </div>

                {error && (
                  <div className="text-red-500 text-sm mt-2 flex items-center">
                    <i className="fa-solid fa-circle-exclamation mr-2"></i>
                    {error}
                  </div>
                )}

                <button
                  onClick={compressImage}
                  disabled={isCompressing || (!isCustomSize && !targetSizeKB) || (isCustomSize && !customSizeInput)}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl px-6 py-3 mt-6 transition-colors flex items-center justify-center"
                >
                  {isCompressing ? (
                    <>
                      <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                      Compressing... {progress}%
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-down-left-and-up-right-to-center mr-2"></i>
                      Compress to {targetSizeKB} KB
                    </>
                  )}
                </button>
                
                {isCompressing && (
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mt-4 overflow-hidden">
                    <div className="bg-emerald-600 h-2.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                  </div>
                )}
              </div>
            )}

            {compressedFile && (
              <div className="space-y-6 animate-fade-in mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Original Image */}
                  <div className="flex flex-col border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden bg-gray-50 dark:bg-gray-900">
                    <div className="p-3 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
                      <span className="font-semibold text-gray-700 dark:text-gray-300">Original</span>
                      <span className="text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-gray-600 dark:text-gray-400">
                        {formatBytes(file.size)}
                      </span>
                    </div>
                    <div className="p-4 flex-1 flex items-center justify-center">
                      <img src={originalUrl} alt="Original" className="max-h-64 object-contain rounded" />
                    </div>
                  </div>

                  {/* Compressed Image */}
                  <div className="flex flex-col border border-emerald-200 dark:border-emerald-900/50 rounded-2xl overflow-hidden bg-emerald-50/30 dark:bg-emerald-900/10">
                    <div className="p-3 bg-white dark:bg-gray-800 border-b border-emerald-100 dark:border-emerald-900/50 flex justify-between items-center">
                      <span className="font-semibold text-emerald-700 dark:text-emerald-400">Compressed</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 px-2 py-1 rounded font-medium">
                          {formatBytes(compressedFile.size)}
                        </span>
                        <span className="text-xs bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 px-2 py-1 rounded-full font-bold">
                          -{((1 - compressedFile.size / file.size) * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>
                    <div className="p-4 flex-1 flex items-center justify-center">
                      <img src={compressedUrl} alt="Compressed" className="max-h-64 object-contain rounded" />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setCompressedFile(null)}
                    className="flex-1 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 font-bold rounded-xl px-6 py-3 transition-colors"
                  >
                    <i className="fa-solid fa-arrow-rotate-left mr-2"></i>
                    Try Again
                  </button>
                  <button
                    onClick={handleDownload}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl px-6 py-3 transition-colors"
                  >
                    <i className="fa-solid fa-download mr-2"></i>
                    Download Image
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
