"use client";

import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useProStatus } from "@/hooks/useProStatus";
import SecurityBadge from "@/components/SecurityBadge";

export default function IdCardMerger() {
  const [frontImage, setFrontImage] = useState(null);
  const [backImage, setBackImage] = useState(null);
  const [premiumAlert, setPremiumAlert] = useState({ show: false, message: "" });
  const [user, setUser] = useState(null);
  const { isPro } = useProStatus(user);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleFileDrop = (e, side) => {
    e.preventDefault();
    const file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/webp')) {
      
      // Limit for free users: Max 2MB per image
      if (file.size > 2097152 && !isPro) {
        setPremiumAlert({
          show: true,
          message: "You are trying to upload a high-resolution image over 2MB. Upgrade to Pro to merge large files without quality loss!"
        });
        if (e.target.value) e.target.value = "";
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        if (side === 'front') setFrontImage(event.target.result);
        if (side === 'back') setBackImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const removeImage = (side) => {
    if (side === 'front') setFrontImage(null);
    if (side === 'back') setBackImage(null);
  };

  const generatePDF = () => {
    if (!frontImage && !backImage) return;

    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = 210;
    const pageHeight = 297;
    const targetWidth = 85;

    const addImageToPdf = (imgData, isFront) => {
      return new Promise((resolve) => {
        if (!imgData) {
          resolve();
          return;
        }
        const img = new Image();
        img.src = imgData;
        img.onload = () => {
          const ratio = img.height / img.width;
          const targetHeight = targetWidth * ratio;
          
          const x = (pageWidth - targetWidth) / 2;
          const yCenter = isFront ? pageHeight / 4 : (pageHeight * 3) / 4;
          const y = yCenter - (targetHeight / 2);
          
          // Determine format from data URL (jpeg, png, webp)
          const formatMatch = imgData.match(/^data:image\/(jpeg|png|webp);base64,/);
          let format = 'JPEG'; // default
          if (formatMatch) {
            format = formatMatch[1].toUpperCase();
          }
          
          doc.addImage(imgData, format, x, y, targetWidth, targetHeight);
          resolve();
        };
      });
    };

    Promise.all([
      addImageToPdf(frontImage, true),
      addImageToPdf(backImage, false)
    ]).then(() => {
      doc.save('ID_Card_Merged.pdf');
    });
  };

  return (
    <>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      <div className="bg-white dark:bg-[#09090b] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 md:p-8 shadow-sm w-full max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">Aadhaar / PAN Front &amp; Back Merger</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Front Side */}
          <div 
            className="border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-indigo-500 rounded-2xl p-8 text-center cursor-pointer transition-colors relative"
            onDrop={(e) => handleFileDrop(e, 'front')}
            onDragOver={handleDragOver}
            onClick={() => !frontImage && document.getElementById('front-upload').click()}
          >
            <input type="file" id="front-upload" className="hidden" accept="image/jpeg, image/png, image/webp" onChange={(e) => handleFileDrop(e, 'front')} />
            {frontImage ? (
              <div className="relative w-full h-48 flex items-center justify-center">
                <img src={frontImage} alt="Front Side" className="max-h-full max-w-full rounded-lg shadow-sm" />
                <button 
                  onClick={(e) => { e.stopPropagation(); removeImage('front'); }}
                  className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 shadow-md"
                >
                  <i className="fa-solid fa-times"></i>
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center text-gray-500 dark:text-gray-400">
                <i className="fa-solid fa-id-card text-4xl mb-4"></i>
                <p className="font-semibold text-lg">Upload Front Side</p>
                <p className="text-sm mt-2">Drag &amp; drop or click to select</p>
                <p className="text-xs mt-1">(JPG, PNG, WEBP)</p>
              </div>
            )}
          </div>

          {/* Back Side */}
          <div 
            className="border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-indigo-500 rounded-2xl p-8 text-center cursor-pointer transition-colors relative"
            onDrop={(e) => handleFileDrop(e, 'back')}
            onDragOver={handleDragOver}
            onClick={() => !backImage && document.getElementById('back-upload').click()}
          >
            <input type="file" id="back-upload" className="hidden" accept="image/jpeg, image/png, image/webp" onChange={(e) => handleFileDrop(e, 'back')} />
            {backImage ? (
              <div className="relative w-full h-48 flex items-center justify-center">
                <img src={backImage} alt="Back Side" className="max-h-full max-w-full rounded-lg shadow-sm" />
                <button 
                  onClick={(e) => { e.stopPropagation(); removeImage('back'); }}
                  className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 shadow-md"
                >
                  <i className="fa-solid fa-times"></i>
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center text-gray-500 dark:text-gray-400">
                <i className="fa-regular fa-id-card text-4xl mb-4"></i>
                <p className="font-semibold text-lg">Upload Back Side</p>
                <p className="text-sm mt-2">Drag &amp; drop or click to select</p>
                <p className="text-xs mt-1">(JPG, PNG, WEBP)</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col items-center gap-6">
          <button 
            onClick={generatePDF}
            disabled={!frontImage && !backImage}
            className={`bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-8 py-3 text-lg font-bold transition-colors ${(!frontImage && !backImage) ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <i className="fa-solid fa-file-pdf mr-2"></i> Download as PDF
          </button>

          <SecurityBadge />

          <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400 rounded-xl p-4 flex items-start gap-3 w-full max-w-2xl border border-blue-100 dark:border-blue-900/30">
            <i className="fa-solid fa-lightbulb mt-1 text-blue-500 dark:text-blue-400"></i>
            <div>
              <p className="font-semibold text-sm mb-1">Pro tip:</p>
              <p className="text-sm opacity-90">Make sure images are clear and well-lit. We automatically arrange them to fit perfectly on an A4 sheet for printing.</p>
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
                className="w-full text-center py-4 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-md transition"
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
    </>
  );
}
