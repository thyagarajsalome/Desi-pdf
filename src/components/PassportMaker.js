"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useProStatus } from "@/hooks/useProStatus";

export default function PassportMaker() {
  const [image, setImage] = useState(null);
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [preset, setPreset] = useState('ssc'); // 'ssc' or 'neet'
  
  const [premiumAlert, setPremiumAlert] = useState({ show: false, message: "" });
  const [user, setUser] = useState(null);
  const { isPro } = useProStatus(user);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handlePresetChange = (newPreset) => {
    if (newPreset === 'neet' && !isPro) {
      setPremiumAlert({
        show: true,
        message: "The NEET Postcard (4x6 inch) high-resolution preset is a Pro feature. Upgrade to Pro to generate official NTA Postcard photos!"
      });
      return;
    }
    setPreset(newPreset);
  };
  
  const canvasRef = useRef(null);
  
  const presets = {
    ssc: {
      width: 350,
      height: 450,
      imageHeight: 370,
      stripHeight: 80,
      label: "SSC/UPSC (3.5x4.5 cm)",
      fontSize: 18,
      lineHeight: 22
    },
    neet: {
      width: 400,
      height: 600,
      imageHeight: 500,
      stripHeight: 100,
      label: "NEET Postcard (4x6 inch - 400x600 px)",
      fontSize: 22,
      lineHeight: 28
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          setImage(img);
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'image/jpeg' || file.type === 'image/png') {
        const reader = new FileReader();
        reader.onload = (event) => {
          const img = new Image();
          img.onload = () => {
            setImage(img);
          };
          img.src = event.target.result;
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const config = presets[preset];
    
    // Set canvas dimensions
    canvas.width = config.width;
    canvas.height = config.height;
    
    // Fill background with white
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    if (image) {
      // Object-fit: cover logic
      const imgRatio = image.width / image.height;
      const targetRatio = config.width / config.imageHeight;
      
      let srcX = 0, srcY = 0, srcWidth = image.width, srcHeight = image.height;
      
      if (imgRatio > targetRatio) {
        // Image is wider than target
        srcWidth = image.height * targetRatio;
        srcX = (image.width - srcWidth) / 2;
      } else {
        // Image is taller than target
        srcHeight = image.width / targetRatio;
        srcY = (image.height - srcHeight) / 2;
      }
      
      ctx.drawImage(
        image,
        srcX, srcY, srcWidth, srcHeight,
        0, 0, config.width, config.imageHeight
      );
    } else {
      // Draw placeholder
      ctx.fillStyle = '#f3f4f6'; // Gray placeholder
      ctx.fillRect(0, 0, config.width, config.imageHeight);
      ctx.fillStyle = '#9ca3af';
      ctx.font = '16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Upload Image', config.width / 2, config.imageHeight / 2);
    }
    
    // Draw text in the bottom white strip
    ctx.fillStyle = '#000000';
    ctx.font = `bold ${config.fontSize}px Arial`;
    ctx.textAlign = 'center';
    
    const textCenterY = config.imageHeight + (config.stripHeight / 2);
    const formattedDate = date ? formatDate(date) : '';
    
    if (name || formattedDate) {
      if (name && formattedDate) {
        ctx.fillText(name.toUpperCase(), config.width / 2, textCenterY - (config.lineHeight / 2) + 4);
        ctx.fillText(formattedDate, config.width / 2, textCenterY + (config.lineHeight / 2) + 4);
      } else if (name) {
        ctx.fillText(name.toUpperCase(), config.width / 2, textCenterY + 6);
      } else if (formattedDate) {
        ctx.fillText(formattedDate, config.width / 2, textCenterY + 6);
      }
    } else {
      ctx.fillStyle = '#9ca3af';
      ctx.font = `${config.fontSize}px Arial`;
      ctx.fillText('Name & Date will appear here', config.width / 2, textCenterY + 6);
    }
  }, [image, name, date, preset, presets]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const dataUrl = canvas.toDataURL('image/jpeg', 1.0);
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `passport_photo_${preset}.jpg`;
    link.click();
  };

  return (
    <div className="w-full">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      
      <div className="bg-white dark:bg-[#09090b] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 md:p-8 shadow-sm max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
          <i className="fa-solid fa-id-badge mr-3 text-blue-600"></i>
          SSC & NEET Passport Photo Maker
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column: Controls */}
          <div className="space-y-6">
            
            {/* Preset Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select Photo Size
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => handlePresetChange('ssc')}
                  className={`flex-1 py-2 px-4 rounded-xl border text-sm font-semibold transition-colors ${
                    preset === 'ssc' 
                      ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-400' 
                      : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 dark:bg-transparent dark:border-gray-700 dark:text-gray-400'
                  }`}
                >
                  SSC/UPSC (3.5x4.5 cm)
                </button>
                <button
                  onClick={() => handlePresetChange('neet')}
                  className={`flex-1 py-2 px-4 rounded-xl border text-sm font-semibold transition-colors flex items-center justify-center gap-2 ${
                    preset === 'neet' 
                      ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-400' 
                      : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 dark:bg-transparent dark:border-gray-700 dark:text-gray-400'
                  }`}
                >
                  NEET Postcard (4x6 inch) {!isPro && <i className="fa-solid fa-lock text-xs text-amber-500"></i>}
                </button>
              </div>
            </div>

            {/* Upload Zone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Upload Photo (JPG/PNG)
              </label>
              <div 
                className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl p-6 text-center hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => document.getElementById('file-upload').click()}
              >
                <i className="fa-solid fa-cloud-arrow-up text-3xl text-gray-400 mb-3"></i>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Drag and drop your image here, or <span className="text-blue-600 font-medium">browse</span>
                </p>
                <input 
                  id="file-upload" 
                  type="file" 
                  accept="image/jpeg, image/png" 
                  className="hidden" 
                  onChange={handleImageUpload} 
                />
              </div>
            </div>

            {/* Text Inputs */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Candidate Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. JOHN DOE"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#18181b] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all uppercase"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Date of Photo
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#18181b] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4">
              <p className="text-xs text-yellow-800 dark:text-yellow-500 leading-relaxed">
                <i className="fa-solid fa-circle-info mr-2"></i>
                Official NTA & SSC Guidelines state that your face should cover 80% of the photo and the white strip must contain your Name and Date of Capture.
              </p>
            </div>
            
            <button
              onClick={downloadImage}
              disabled={!image}
              className={`w-full py-3 px-6 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                image 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md' 
                  : 'bg-gray-200 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
              }`}
            >
              <i className="fa-solid fa-download"></i>
              Download Photo
            </button>
          </div>

          {/* Right Column: Preview */}
          <div className="flex flex-col items-center justify-center bg-gray-50 dark:bg-[#121214] rounded-2xl p-6 border border-gray-100 dark:border-gray-800 min-h-[500px]">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4 uppercase tracking-wider">
              Live Preview
            </p>
            <div className="shadow-lg border border-gray-200 dark:border-gray-700 bg-white overflow-hidden" 
                 style={{
                   width: '100%',
                   maxWidth: presets[preset].width + 'px',
                   aspectRatio: `${presets[preset].width}/${presets[preset].height}`
                 }}>
              <canvas
                ref={canvasRef}
                className="w-full h-auto block"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Premium Alert Modal */}
      {premiumAlert.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity">
          <div className="bg-white dark:bg-[#09090b] w-full max-w-md rounded-[2rem] shadow-2xl border border-gray-100 dark:border-gray-800 p-8 relative animate-in fade-in zoom-in duration-300 text-left">
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
              Pro Feature Locked
            </h3>
            
            <p className="text-gray-600 dark:text-gray-400 mb-8 font-medium leading-relaxed">
              {premiumAlert.message}
            </p>
            
            <div className="flex flex-col gap-3">
              <a 
                href="/pricing"
                className="w-full text-center py-4 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md transition"
              >
                Upgrade to Pro (₹49)
              </a>
              <button 
                onClick={() => setPremiumAlert({ show: false, message: "" })}
                className="w-full text-center py-4 rounded-xl font-bold text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
