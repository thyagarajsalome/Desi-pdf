"use client";

import React, { useState, useRef, useEffect } from 'react';
import JSZip from 'jszip';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useProStatus } from '@/hooks/useProStatus';

const formatBytes = (bytes, decimals = 2) => {
  if (!+bytes) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

export default function ImageCompressor() {
  const [user, setUser] = useState(null);
  const { isPro } = useProStatus(user);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const [files, setFiles] = useState([]);
  const [targetSizeKB, setTargetSizeKB] = useState(100);
  const [isCustomSize, setIsCustomSize] = useState(false);
  const [customSizeInput, setCustomSizeInput] = useState('');
  
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressProgress, setCompressProgress] = useState(0);
  const [isZipping, setIsZipping] = useState(false);
  const [error, setError] = useState(null);
  const [premiumAlert, setPremiumAlert] = useState({ show: false, message: "" });
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

  const handleFiles = (incomingFiles) => {
    if (!incomingFiles || incomingFiles.length === 0) return;
    setError(null);

    const validFiles = Array.from(incomingFiles).filter(file => 
      file.type.match(/^image\/(jpeg|png|webp|jpg)$/) || file.name.match(/\.(jpe?g|png|webp)$/i)
    );

    if (validFiles.length === 0) {
      setError('Please upload valid image files (JPG, PNG, WEBP).');
      return;
    }

    if (validFiles.length > 1 && !isPro) {
      setPremiumAlert({
        show: true,
        message: `You uploaded ${validFiles.length} images. Bulk compression is a Pro feature! Free accounts can compress 1 image at a time. Upgrade to Pro to compress batches of images together with 1-click ZIP download.`
      });
      // Process only the first image for free user
      const firstFile = validFiles[0];
      setFiles([{
        id: Math.random().toString(36).substring(2, 9),
        file: firstFile,
        name: firstFile.name,
        originalSize: firstFile.size,
        originalUrl: URL.createObjectURL(firstFile),
        compressedBlob: null,
        compressedUrl: null,
        compressedSize: 0,
        status: 'idle'
      }]);
      return;
    }

    const newItems = validFiles.map(file => ({
      id: Math.random().toString(36).substring(2, 9),
      file: file,
      name: file.name,
      originalSize: file.size,
      originalUrl: URL.createObjectURL(file),
      compressedBlob: null,
      compressedUrl: null,
      compressedSize: 0,
      status: 'idle'
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
      const target = prev.find(f => f.id === id);
      if (target?.originalUrl) URL.revokeObjectURL(target.originalUrl);
      if (target?.compressedUrl) URL.revokeObjectURL(target.compressedUrl);
      return prev.filter(f => f.id !== id);
    });
  };

  const clearAll = () => {
    files.forEach(f => {
      if (f.originalUrl) URL.revokeObjectURL(f.originalUrl);
      if (f.compressedUrl) URL.revokeObjectURL(f.compressedUrl);
    });
    setFiles([]);
    setError(null);
  };

  // Compression engine for a single file item
  const compressSingleItem = async (item, targetKB) => {
    const targetBytes = targetKB * 1024;
    
    // If already below target size, return original
    if (item.originalSize <= targetBytes) {
      return {
        ...item,
        compressedBlob: item.file,
        compressedUrl: item.originalUrl,
        compressedSize: item.originalSize,
        status: 'done'
      };
    }

    const img = new Image();
    img.src = item.originalUrl;
    await new Promise((resolve) => {
      img.onload = resolve;
      img.onerror = resolve;
    });

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);

    let minQ = 0.01;
    let maxQ = 1.0;
    let currentQ = 0.5;
    let bestBlob = null;
    const maxIterations = 14;

    for (let i = 0; i < maxIterations; i++) {
      const blob = await new Promise((resolve) => {
        canvas.toBlob(resolve, 'image/jpeg', currentQ);
      });
      if (!blob) break;
      bestBlob = blob;

      if (Math.abs(blob.size - targetBytes) < targetBytes * 0.05) {
        break;
      }

      if (blob.size > targetBytes) {
        maxQ = currentQ;
      } else {
        minQ = currentQ;
      }
      currentQ = (minQ + maxQ) / 2;
    }

    // Downscale if still exceeding target at minimal quality
    if (bestBlob && bestBlob.size > targetBytes && currentQ < 0.1) {
      const scale = Math.sqrt(targetBytes / bestBlob.size);
      canvas.width = Math.max(50, Math.round(img.width * scale));
      canvas.height = Math.max(50, Math.round(img.height * scale));
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      bestBlob = await new Promise((resolve) => {
        canvas.toBlob(resolve, 'image/jpeg', 0.6);
      });
    }

    if (bestBlob) {
      const url = URL.createObjectURL(bestBlob);
      return {
        ...item,
        compressedBlob: bestBlob,
        compressedUrl: url,
        compressedSize: bestBlob.size,
        status: 'done'
      };
    } else {
      return { ...item, status: 'error' };
    }
  };

  const handleCompressAll = async () => {
    if (files.length === 0) return;
    setIsCompressing(true);
    setCompressProgress(0);
    setError(null);

    const updatedFiles = [...files];

    for (let i = 0; i < updatedFiles.length; i++) {
      updatedFiles[i].status = 'compressing';
      setFiles([...updatedFiles]);

      const res = await compressSingleItem(updatedFiles[i], targetSizeKB);
      updatedFiles[i] = res;
      setFiles([...updatedFiles]);
      setCompressProgress(Math.round(((i + 1) / updatedFiles.length) * 100));
    }

    setIsCompressing(false);
  };

  const downloadSingle = (item) => {
    if (!item.compressedUrl) return;
    const originalBase = item.name.substring(0, item.name.lastIndexOf('.')) || item.name;
    const a = document.createElement('a');
    a.href = item.compressedUrl;
    a.download = `${originalBase}_${targetSizeKB}kb.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const downloadAllZip = async () => {
    const doneItems = files.filter(f => f.compressedBlob && f.status === 'done');
    if (doneItems.length === 0) return;

    setIsZipping(true);
    try {
      const zip = new JSZip();
      doneItems.forEach((item, index) => {
        const originalBase = item.name.substring(0, item.name.lastIndexOf('.')) || `compressed_${index + 1}`;
        zip.file(`${originalBase}_${targetSizeKB}kb.jpg`, item.compressedBlob);
      });

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `compressed_${doneItems.length}_images_${targetSizeKB}kb.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 10000);
    } catch (err) {
      console.error('ZIP failed', err);
      alert('Failed to generate ZIP. Please download images individually.');
    } finally {
      setIsZipping(false);
    }
  };

  const allDone = files.length > 0 && files.every(f => f.status === 'done');

  return (
    <div className="w-full max-w-5xl mx-auto font-sans space-y-6">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      
      <div className="bg-white dark:bg-[#09090b] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 md:p-8 shadow-sm">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-gray-100 dark:border-gray-800 pb-5">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xl">
              <i className="fa-solid fa-compress"></i>
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                Image Compressor
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Compress images to an exact target KB with intelligent binary search quality optimization.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isPro ? (
              <span className="text-[11px] font-extrabold px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5">
                <i className="fa-solid fa-crown text-emerald-500"></i> Pro Bulk Enabled
              </span>
            ) : (
              <span className="text-[11px] font-semibold px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                Free: 1 Image • Pro: Bulk
              </span>
            )}
          </div>
        </div>

        {/* Upload Box */}
        {files.length === 0 && (
          <div 
            className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-3xl p-10 sm:p-14 text-center cursor-pointer hover:border-emerald-500 dark:hover:border-emerald-500 hover:bg-emerald-50/20 dark:hover:bg-emerald-950/10 transition group"
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
          >
            <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform">
              <i className="fa-solid fa-cloud-arrow-up text-3xl"></i>
            </div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">
              Drag &amp; Drop Image Here
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
              Select JPG, PNG, or WEBP images to compress down to exact target KB size. <br />
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                Free: 1 Image • Pro: Unlimited Bulk Batch Compression
              </span>
            </p>
            <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-8 rounded-xl transition shadow-md">
              Choose Images
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/jpeg, image/png, image/webp" 
              className="hidden" 
              multiple
            />
          </div>
        )}

        {/* Workspace when files are uploaded */}
        {files.length > 0 && (
          <div className="space-y-6">
            
            {/* Top Bar with file counter and Add More */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gray-50 dark:bg-[#121217] p-4 rounded-2xl border border-gray-200/80 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <i className="fa-regular fa-images text-emerald-500 text-xl"></i>
                <div>
                  <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                    {files.length === 1 ? '1 Image Uploaded' : `${files.length} Images in Bulk Batch`}
                  </span>
                  <p className="text-xs text-gray-500">
                    Total Raw Size: {formatBytes(files.reduce((acc, f) => acc + f.originalSize, 0))}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (!isPro && files.length >= 1) {
                      setPremiumAlert({
                        show: true,
                        message: "Bulk compression is a Pro feature! Free accounts can compress 1 image at a time. Upgrade to Pro to compress multiple images together."
                      });
                      return;
                    }
                    fileInputRef.current?.click();
                  }}
                  className="px-3.5 py-1.5 rounded-xl border border-gray-300 dark:border-gray-700 text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition flex items-center gap-1.5"
                >
                  <i className="fa-solid fa-plus"></i> Add More
                </button>
                <button
                  onClick={clearAll}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition"
                >
                  Clear All
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  accept="image/jpeg, image/png, image/webp" 
                  className="hidden" 
                  multiple={isPro}
                />
              </div>
            </div>

            {/* Target Size Controls */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-gray-800 dark:text-gray-200">
                  Select Target File Size (Max limit)
                </label>
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                  Target: {targetSizeKB} KB
                </span>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2">
                {presets.map((preset) => (
                  <button
                    key={preset.value}
                    onClick={() => {
                      setTargetSizeKB(preset.value);
                      setIsCustomSize(false);
                    }}
                    className={`py-2 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                      !isCustomSize && targetSizeKB === preset.value
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-gray-100 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              {/* Custom Size Option */}
              <div className="flex items-center gap-3 pt-1">
                <button
                  onClick={() => setIsCustomSize(true)}
                  className={`py-2 px-3.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                    isCustomSize
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-gray-100 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  Custom Size (KB)
                </button>
                {isCustomSize && (
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="5"
                      value={customSizeInput}
                      onChange={(e) => {
                        setCustomSizeInput(e.target.value);
                        const val = parseInt(e.target.value);
                        if (!isNaN(val) && val > 0) setTargetSizeKB(val);
                      }}
                      placeholder="e.g. 50"
                      className="bg-white dark:bg-[#121217] border border-gray-300 dark:border-gray-700 rounded-xl py-1.5 px-3 text-sm text-gray-800 dark:text-gray-200 w-28 outline-none focus:border-emerald-500"
                    />
                    <span className="text-xs text-gray-500">KB</span>
                  </div>
                )}
              </div>

              {error && (
                <div className="text-red-500 text-xs mt-2 flex items-center gap-1.5">
                  <i className="fa-solid fa-circle-exclamation"></i>
                  <span>{error}</span>
                </div>
              )}
            </div>

            {/* Progress Bar */}
            {isCompressing && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-gray-700 dark:text-gray-300">
                  <span className="flex items-center gap-2">
                    <i className="fa-solid fa-spinner fa-spin text-emerald-500"></i>
                    Compressing Images to ~{targetSizeKB}KB...
                  </span>
                  <span>{compressProgress}%</span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2.5 overflow-hidden">
                  <div 
                    className="bg-emerald-600 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${compressProgress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[460px] overflow-y-auto pr-1">
              {files.map((item) => {
                const isReduced = item.compressedSize > 0 && item.compressedSize < item.originalSize;
                const reductionPct = isReduced 
                  ? Math.round(((item.originalSize - item.compressedSize) / item.originalSize) * 100) 
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
                          src={item.compressedUrl || item.originalUrl} 
                          alt={item.name} 
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                      <div className="min-w-0 flex-1 pr-6">
                        <p className="text-xs font-bold text-gray-900 dark:text-gray-100 truncate" title={item.name}>
                          {item.name}
                        </p>
                        <p className="text-[11px] text-gray-400 mt-0.5">
                          Original: {formatBytes(item.originalSize)}
                        </p>
                        {item.status === 'done' && (
                          <p className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                            Compressed: {formatBytes(item.compressedSize)} {reductionPct > 0 ? `(-${reductionPct}%)` : ''}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-gray-200/60 dark:border-gray-800 flex items-center justify-between text-xs">
                      <div>
                        {item.status === 'idle' && (
                          <span className="text-[10px] font-bold text-gray-400 bg-gray-200 dark:bg-gray-800 px-2 py-0.5 rounded">Ready</span>
                        )}
                        {item.status === 'compressing' && (
                          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 dark:bg-emerald-950/50 px-2 py-0.5 rounded flex items-center gap-1">
                            <i className="fa-solid fa-spinner fa-spin"></i> Compressing
                          </span>
                        )}
                        {item.status === 'done' && (
                          <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/50 px-2 py-0.5 rounded flex items-center gap-1">
                            <i className="fa-solid fa-check"></i> Ready ({formatBytes(item.compressedSize)})
                          </span>
                        )}
                        {item.status === 'error' && (
                          <span className="text-[10px] font-bold text-red-600 bg-red-100 dark:bg-red-950/50 px-2 py-0.5 rounded">Error</span>
                        )}
                      </div>

                      {item.status === 'done' ? (
                        <button
                          onClick={() => downloadSingle(item)}
                          className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                        >
                          <i className="fa-solid fa-download"></i>
                          <span>Download</span>
                        </button>
                      ) : (
                        <span className="text-[11px] text-gray-400">Target: {targetSizeKB}KB</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Action Buttons */}
            <div className="pt-6 border-t border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              {!allDone ? (
                <button
                  onClick={handleCompressAll}
                  disabled={isCompressing}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition flex items-center justify-center gap-2 shadow-md disabled:opacity-60"
                >
                  {isCompressing ? (
                    <>
                      <i className="fa-solid fa-spinner fa-spin"></i>
                      <span>Compressing ({compressProgress}%)...</span>
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-down-left-and-up-right-to-center"></i>
                      <span>Compress {files.length > 1 ? `All ${files.length} Images` : 'Image'} to {targetSizeKB}KB</span>
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
                      <span>Download Compressed Image</span>
                    </button>
                  )}

                  <button
                    onClick={clearAll}
                    className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                  >
                    Compress Another Batch
                  </button>
                </div>
              )}
            </div>

          </div>
        )}

      </div>

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
            
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center text-white text-3xl shadow-lg mb-6 shadow-emerald-500/30">
              <i className="fa-solid fa-crown"></i>
            </div>
            
            <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-3">
              Bulk Compression is Pro Only
            </h3>
            
            <p className="text-gray-600 dark:text-gray-400 mb-8 font-medium leading-relaxed text-sm sm:text-base">
              {premiumAlert.message}
            </p>
            
            <div className="flex flex-col gap-3">
              <a 
                href="/pricing"
                className="w-full text-center py-4 rounded-xl font-bold text-white bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-600 hover:to-teal-600 shadow-md transition"
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
