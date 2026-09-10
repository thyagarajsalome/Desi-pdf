"use client";

import React, { useState, useRef, useEffect } from 'react';
import JSZip from 'jszip';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useProStatus } from '@/hooks/useProStatus';

export default function ImageResizer() {
  const [user, setUser] = useState(null);
  const { isPro } = useProStatus(user);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const [files, setFiles] = useState([]);
  const [width, setWidth] = useState(132);
  const [height, setHeight] = useState(170);
  const [lockAspectRatio, setLockAspectRatio] = useState(false);
  const [aspectRatio, setAspectRatio] = useState(132 / 170);
  
  const [isResizing, setIsResizing] = useState(false);
  const [resizeProgress, setResizeProgress] = useState(0);
  const [isZipping, setIsZipping] = useState(false);
  const [premiumAlert, setPremiumAlert] = useState({ show: false, message: "" });
  
  const fileInputRef = useRef(null);

  const presets = [
    { label: "SSC Photo (132x170 px)", width: 132, height: 170 },
    { label: "Bank Signature (140x60 px)", width: 140, height: 60 },
    { label: "UPSC Photo (300x300 px)", width: 300, height: 300 },
    { label: "Passport (350x450 px)", width: 350, height: 450 },
    { label: "Instagram Square (1080x1080 px)", width: 1080, height: 1080 },
  ];

  const formatSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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

    if (validFiles.length > 1 && !isPro) {
      setPremiumAlert({
        show: true,
        message: `You uploaded ${validFiles.length} images. Bulk resizing is a Pro feature! Free accounts can resize 1 image at a time. Upgrade to Pro to resize batches of images together with 1-click ZIP download.`
      });
      const single = validFiles[0];
      setFiles([{
        id: Math.random().toString(36).substring(2, 9),
        file: single,
        name: single.name,
        originalSize: single.size,
        originalUrl: URL.createObjectURL(single),
        resizedBlob: null,
        resizedUrl: null,
        resizedSize: 0,
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
      resizedBlob: null,
      resizedUrl: null,
      resizedSize: 0,
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

  const handleWidthChange = (e) => {
    const newWidth = parseInt(e.target.value) || '';
    setWidth(newWidth);
    if (lockAspectRatio && newWidth && aspectRatio) {
      setHeight(Math.round(newWidth / aspectRatio));
    }
  };

  const handleHeightChange = (e) => {
    const newHeight = parseInt(e.target.value) || '';
    setHeight(newHeight);
    if (lockAspectRatio && newHeight && aspectRatio) {
      setWidth(Math.round(newHeight * aspectRatio));
    }
  };

  const applyPreset = (pWidth, pHeight) => {
    setWidth(pWidth);
    setHeight(pHeight);
    setLockAspectRatio(false);
    setAspectRatio(pWidth / pHeight);
  };

  const removeFile = (id) => {
    setFiles(prev => {
      const target = prev.find(f => f.id === id);
      if (target?.originalUrl) URL.revokeObjectURL(target.originalUrl);
      if (target?.resizedUrl) URL.revokeObjectURL(target.resizedUrl);
      return prev.filter(f => f.id !== id);
    });
  };

  const clearAll = () => {
    files.forEach(f => {
      if (f.originalUrl) URL.revokeObjectURL(f.originalUrl);
      if (f.resizedUrl) URL.revokeObjectURL(f.resizedUrl);
    });
    setFiles([]);
  };

  // Resize single image onto canvas
  const resizeSingleItem = (item, targetW, targetH) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = targetW;
        canvas.height = targetH;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, targetW, targetH);
        ctx.drawImage(img, 0, 0, targetW, targetH);

        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            resolve({
              ...item,
              resizedBlob: blob,
              resizedUrl: url,
              resizedSize: blob.size,
              status: 'done'
            });
          } else {
            resolve({ ...item, status: 'error' });
          }
        }, item.file.type || 'image/jpeg', 0.92);
      };
      img.onerror = () => resolve({ ...item, status: 'error' });
      img.src = item.originalUrl;
    });
  };

  const handleResizeAll = async () => {
    if (files.length === 0 || !width || !height) return;
    setIsResizing(true);
    setResizeProgress(0);

    const updatedFiles = [...files];

    for (let i = 0; i < updatedFiles.length; i++) {
      updatedFiles[i].status = 'resizing';
      setFiles([...updatedFiles]);

      const res = await resizeSingleItem(updatedFiles[i], parseInt(width), parseInt(height));
      updatedFiles[i] = res;
      setFiles([...updatedFiles]);
      setResizeProgress(Math.round(((i + 1) / updatedFiles.length) * 100));
    }

    setIsResizing(false);
  };

  const downloadSingle = (item) => {
    if (!item.resizedUrl) return;
    const originalBase = item.name.substring(0, item.name.lastIndexOf('.')) || item.name;
    const ext = item.file.name.endsWith('.png') ? 'png' : 'jpg';
    const a = document.createElement('a');
    a.href = item.resizedUrl;
    a.download = `${originalBase}_${width}x${height}.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const downloadAllZip = async () => {
    const doneItems = files.filter(f => f.resizedBlob && f.status === 'done');
    if (doneItems.length === 0) return;

    setIsZipping(true);
    try {
      const zip = new JSZip();
      doneItems.forEach((item, index) => {
        const originalBase = item.name.substring(0, item.name.lastIndexOf('.')) || `resized_${index + 1}`;
        const ext = item.file.name.endsWith('.png') ? 'png' : 'jpg';
        zip.file(`${originalBase}_${width}x${height}.${ext}`, item.resizedBlob);
      });

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `resized_${doneItems.length}_images_${width}x${height}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 10000);
    } catch (err) {
      console.error('ZIP failed', err);
      alert('Failed to create ZIP. Please download images individually.');
    } finally {
      setIsZipping(false);
    }
  };

  const allDone = files.length > 0 && files.every(f => f.status === 'done');

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      
      <div className="bg-white dark:bg-[#09090b] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 md:p-8 shadow-sm">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-gray-100 dark:border-gray-800 pb-5">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center text-xl">
              <i className="fa-solid fa-expand"></i>
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                Exact Pixel Image Resizer
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Resize single or bulk images to exact width and height in pixels or official exam presets.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isPro ? (
              <span className="text-[11px] font-extrabold px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 flex items-center gap-1.5">
                <i className="fa-solid fa-crown text-amber-500"></i> Pro Bulk Enabled
              </span>
            ) : (
              <span className="text-[11px] font-semibold px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                Free: 1 Image • Pro: Bulk
              </span>
            )}
          </div>
        </div>

        {/* Upload Zone */}
        {files.length === 0 && (
          <div 
            className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-3xl p-10 sm:p-14 text-center cursor-pointer hover:border-amber-500 dark:hover:border-amber-500 hover:bg-amber-50/20 dark:hover:bg-amber-950/10 transition group"
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
          >
            <div className="w-16 h-16 bg-amber-50 dark:bg-amber-900/20 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform">
              <i className="fa-solid fa-cloud-arrow-up text-3xl"></i>
            </div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">
              Drag &amp; Drop Images to Resize
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
              Upload JPG or PNG files. Set custom width and height or pick an official Govt exam preset. <br />
              <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                Free: 1 Image • Pro: Unlimited Bulk Batch Resizing
              </span>
            </p>
            <button className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-8 rounded-xl transition shadow-md">
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
            
            {/* Top Bar with file counter */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gray-50 dark:bg-[#121217] p-4 rounded-2xl border border-gray-200/80 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <i className="fa-regular fa-images text-amber-500 text-xl"></i>
                <div>
                  <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                    {files.length === 1 ? '1 Image Uploaded' : `${files.length} Images in Bulk Batch`}
                  </span>
                  <p className="text-xs text-gray-500">
                    Target Dimensions: {width}px × {height}px
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (!isPro && files.length >= 1) {
                      setPremiumAlert({
                        show: true,
                        message: "Bulk resizing is a Pro feature! Free accounts can resize 1 image at a time. Upgrade to Pro to resize batches of images simultaneously."
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

            {/* Dimension & Preset Controls */}
            <div className="space-y-4 bg-gray-50 dark:bg-[#121217] p-5 rounded-2xl border border-gray-200/80 dark:border-gray-800">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
                Quick Presets
              </span>
              <div className="flex flex-wrap gap-2">
                {presets.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => applyPreset(p.width, p.height)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                      width === p.width && height === p.height
                        ? 'bg-amber-600 text-white shadow-sm'
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-amber-400'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>

              {/* Exact Width & Height Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                    Width (Pixels)
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="10000"
                    value={width}
                    onChange={handleWidthChange}
                    className="w-full bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-xl py-2.5 px-4 text-sm font-semibold text-gray-900 dark:text-gray-100 outline-none focus:border-amber-500"
                    placeholder="Width in px"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                    Height (Pixels)
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="10000"
                    value={height}
                    onChange={handleHeightChange}
                    className="w-full bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-xl py-2.5 px-4 text-sm font-semibold text-gray-900 dark:text-gray-100 outline-none focus:border-amber-500"
                    placeholder="Height in px"
                  />
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            {isResizing && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-gray-700 dark:text-gray-300">
                  <span className="flex items-center gap-2">
                    <i className="fa-solid fa-spinner fa-spin text-amber-500"></i>
                    Resizing Images to {width}x{height} px...
                  </span>
                  <span>{resizeProgress}%</span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2.5 overflow-hidden">
                  <div 
                    className="bg-amber-600 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${resizeProgress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Image Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[460px] overflow-y-auto pr-1">
              {files.map((item) => (
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
                        src={item.resizedUrl || item.originalUrl} 
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
                      {item.status === 'done' && (
                        <p className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                          Resized: {width}×{height} px ({formatSize(item.resizedSize)})
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-gray-200/60 dark:border-gray-800 flex items-center justify-between text-xs">
                    <div>
                      {item.status === 'idle' && (
                        <span className="text-[10px] font-bold text-gray-400 bg-gray-200 dark:bg-gray-800 px-2 py-0.5 rounded">Ready</span>
                      )}
                      {item.status === 'resizing' && (
                        <span className="text-[10px] font-bold text-amber-600 bg-amber-100 dark:bg-amber-950/50 px-2 py-0.5 rounded flex items-center gap-1">
                          <i className="fa-solid fa-spinner fa-spin"></i> Resizing
                        </span>
                      )}
                      {item.status === 'done' && (
                        <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/50 px-2 py-0.5 rounded flex items-center gap-1">
                          <i className="fa-solid fa-check"></i> {width}×{height} px
                        </span>
                      )}
                      {item.status === 'error' && (
                        <span className="text-[10px] font-bold text-red-600 bg-red-100 dark:bg-red-950/50 px-2 py-0.5 rounded">Error</span>
                      )}
                    </div>

                    {item.status === 'done' ? (
                      <button
                        onClick={() => downloadSingle(item)}
                        className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
                      >
                        <i className="fa-solid fa-download"></i>
                        <span>Download</span>
                      </button>
                    ) : (
                      <span className="text-[11px] text-gray-400">Set: {width}×{height}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons Footer */}
            <div className="pt-6 border-t border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              {!allDone ? (
                <button
                  onClick={handleResizeAll}
                  disabled={isResizing || !width || !height}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold transition flex items-center justify-center gap-2 shadow-md disabled:opacity-60"
                >
                  {isResizing ? (
                    <>
                      <i className="fa-solid fa-spinner fa-spin"></i>
                      <span>Resizing ({resizeProgress}%)...</span>
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-expand"></i>
                      <span>Resize {files.length > 1 ? `All ${files.length} Images` : 'Image'} to {width}×{height} px</span>
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
                      <span>Download Resized Image</span>
                    </button>
                  )}

                  <button
                    onClick={clearAll}
                    className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                  >
                    Resize Another Batch
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
            
            <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center text-white text-3xl shadow-lg mb-6 shadow-orange-500/30">
              <i className="fa-solid fa-crown"></i>
            </div>
            
            <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-3">
              Bulk Resizing is Pro Only
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
