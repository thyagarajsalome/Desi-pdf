"use client";

import React, { useState, useRef } from 'react';

export default function ImageResizer() {
  const [file, setFile] = useState(null);
  const [originalImage, setOriginalImage] = useState(null);
  const [originalDimensions, setOriginalDimensions] = useState({ width: 0, height: 0 });
  const [originalSize, setOriginalSize] = useState(0);
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [lockAspectRatio, setLockAspectRatio] = useState(true);
  const [aspectRatio, setAspectRatio] = useState(1);
  const [resizedBlob, setResizedBlob] = useState(null);
  const [resizedDimensions, setResizedDimensions] = useState({ width: 0, height: 0 });
  
  const canvasRef = useRef(null);

  const presets = [
    { label: "SSC Photo (3.5x4.5 cm ~ 132x170 px)", width: 132, height: 170 },
    { label: "Bank Signature (140x60 px)", width: 140, height: 60 },
    { label: "UPSC Photo (300x300 px)", width: 300, height: 300 }
  ];

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setOriginalSize(selectedFile.size);
      
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          setOriginalImage(img);
          setOriginalDimensions({ width: img.width, height: img.height });
          setWidth(img.width);
          setHeight(img.height);
          setAspectRatio(img.width / img.height);
          setResizedBlob(null); // Reset resized image
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(selectedFile);
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

  const toggleAspectRatio = () => {
    if (!lockAspectRatio && width && height) {
      setAspectRatio(width / height);
    }
    setLockAspectRatio(!lockAspectRatio);
  };

  const applyPreset = (presetWidth, presetHeight) => {
    setWidth(presetWidth);
    setHeight(presetHeight);
    if (lockAspectRatio) {
       setLockAspectRatio(false);
    }
  };

  const resizeImage = () => {
    if (!originalImage || !width || !height) return;

    const canvas = canvasRef.current;
    canvas.width = width;
    canvas.height = height;
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, width, height);
    
    // Draw original image on the new canvas size
    ctx.drawImage(originalImage, 0, 0, width, height);
    
    canvas.toBlob((blob) => {
      if (blob) {
        setResizedBlob(blob);
        setResizedDimensions({ width, height });
      }
    }, file.type);
  };

  const downloadImage = () => {
    if (!resizedBlob) return;
    
    const url = URL.createObjectURL(resizedBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `resized_${file.name}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      
      <div className="bg-white dark:bg-[#09090b] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 md:p-8 shadow-sm">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100 flex items-center">
          <i className="fa-solid fa-image text-amber-600 mr-3"></i> Exact Pixel Image Resizer
        </h2>

        {!originalImage ? (
          <div 
            className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl p-12 text-center transition-colors hover:border-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/10"
            onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('border-amber-500', 'bg-amber-50', 'dark:bg-amber-900/10'); }}
            onDragLeave={(e) => { e.preventDefault(); e.currentTarget.classList.remove('border-amber-500', 'bg-amber-50', 'dark:bg-amber-900/10'); }}
            onDrop={(e) => {
              e.preventDefault();
              e.currentTarget.classList.remove('border-amber-500', 'bg-amber-50', 'dark:bg-amber-900/10');
              const file = e.dataTransfer.files[0];
              if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
                setFile(file);
                const objectUrl = URL.createObjectURL(file);
                setOriginalSize(file.size);
                
                const img = new Image();
                img.onload = () => {
                  setOriginalDimensions({ width: img.width, height: img.height });
                  setWidth(img.width);
                  setHeight(img.height);
                  setOriginalImage(img);
                };
                img.src = objectUrl;
              } else {
                alert("Please drop a valid JPG or PNG image.");
              }
            }}
          >
            <input
              type="file"
              accept="image/jpeg, image/png"
              onChange={handleFileChange}
              className="hidden"
              id="fileUpload"
            />
            <label htmlFor="fileUpload" className="cursor-pointer flex flex-col items-center">
              <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 text-amber-600 rounded-full flex items-center justify-center mb-4">
                <i className="fa-solid fa-cloud-arrow-up text-2xl"></i>
              </div>
              <span className="text-gray-700 dark:text-gray-300 font-bold mb-2 text-xl">Click or drag image here</span>
              <span className="text-sm text-gray-500 font-medium">Supports JPG, PNG</span>
            </label>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column: Controls */}
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-800/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Original Size</p>
                  <p className="font-semibold text-gray-800 dark:text-gray-200">{formatSize(originalSize)}</p>
                </div>
                <div className="w-px h-8 bg-gray-200 dark:bg-gray-700"></div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Original Dimensions</p>
                  <p className="font-semibold text-gray-800 dark:text-gray-200">{originalDimensions.width} x {originalDimensions.height} px</p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium text-gray-800 dark:text-gray-200">Custom Dimensions</h3>
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <label className="block text-xs text-gray-500 mb-1">Width (px)</label>
                    <input 
                      type="number"
                      value={width}
                      onChange={handleWidthChange}
                      className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-transparent text-gray-800 dark:text-gray-200 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-shadow"
                    />
                  </div>
                  
                  <button 
                    onClick={toggleAspectRatio}
                    className={`mt-5 p-3 rounded-xl transition-all ${lockAspectRatio ? 'text-amber-600 bg-amber-50 dark:bg-amber-900/20 ring-1 ring-amber-500/50' : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 border border-transparent'}`}
                    title={lockAspectRatio ? "Unlock Aspect Ratio" : "Lock Aspect Ratio"}
                  >
                    <i className={`fa-solid ${lockAspectRatio ? 'fa-link' : 'fa-link-slash'}`}></i>
                  </button>

                  <div className="flex-1">
                    <label className="block text-xs text-gray-500 mb-1">Height (px)</label>
                    <input 
                      type="number"
                      value={height}
                      onChange={handleHeightChange}
                      className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-transparent text-gray-800 dark:text-gray-200 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-shadow"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-medium text-gray-800 dark:text-gray-200">Quick Presets</h3>
                <div className="flex flex-wrap gap-2">
                  {presets.map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => applyPreset(preset.width, preset.height)}
                      className="px-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#09090b] text-gray-700 dark:text-gray-300 hover:border-amber-500 hover:text-amber-600 dark:hover:text-amber-500 transition-colors shadow-sm"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex space-x-3 pt-2">
                <button 
                  onClick={resizeImage}
                  className="flex-1 py-3 px-4 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-medium transition-colors flex justify-center items-center shadow-sm"
                >
                  <i className="fa-solid fa-crop-simple mr-2"></i> Apply Resize
                </button>
                <button 
                  onClick={() => {
                    setOriginalImage(null);
                    setResizedBlob(null);
                  }}
                  className="py-3 px-4 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  title="Upload different image"
                >
                  <i className="fa-solid fa-trash-can"></i>
                </button>
              </div>
            </div>

            {/* Right Column: Preview & Download */}
            <div className="flex flex-col h-full">
              <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-4">Preview</h3>
              
              <div className="flex-1 bg-gray-50 dark:bg-gray-800/30 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 flex flex-col items-center justify-center overflow-hidden min-h-[300px] relative">
                {resizedBlob ? (
                  <div className="flex flex-col h-full w-full">
                    <div className="flex-1 flex items-center justify-center p-2 mb-4 overflow-hidden">
                      <img 
                        src={URL.createObjectURL(resizedBlob)} 
                        alt="Resized preview" 
                        className="object-contain drop-shadow-md rounded max-w-full max-h-[220px]"
                      />
                    </div>
                    <div className="w-full mt-auto space-y-4">
                      <div className="flex justify-between text-sm bg-white dark:bg-[#09090b] p-3 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
                        <div className="text-center flex-1">
                          <p className="text-xs text-gray-500 mb-1">New Size</p>
                          <p className="font-semibold text-green-600 dark:text-green-500">{formatSize(resizedBlob.size)}</p>
                        </div>
                        <div className="w-px bg-gray-200 dark:bg-gray-700 mx-2"></div>
                        <div className="text-center flex-1">
                          <p className="text-xs text-gray-500 mb-1">New Dimensions</p>
                          <p className="font-semibold text-gray-800 dark:text-gray-200">{resizedDimensions.width} x {resizedDimensions.height}</p>
                        </div>
                      </div>
                      
                      <button 
                        onClick={downloadImage}
                        className="w-full py-3 px-4 bg-gray-900 dark:bg-gray-100 hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-gray-900 rounded-xl font-medium transition-colors flex justify-center items-center shadow-sm"
                      >
                        <i className="fa-solid fa-download mr-2"></i> Download Image
                      </button>
                    </div>
                  </div>
                ) : (
                   <div className="text-center text-gray-400 dark:text-gray-600">
                     <i className="fa-regular fa-image text-5xl mb-3 opacity-50"></i>
                     <p className="text-sm">Click "Apply Resize" to preview the changes</p>
                   </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Hidden canvas for processing */}
      <canvas ref={canvasRef} className="hidden"></canvas>
    </div>
  );
}
