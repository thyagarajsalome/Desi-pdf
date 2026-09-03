"use client";

import React, { useState, useEffect } from 'react';
import { jsPDF } from "jspdf";

export default function AadhaarUnlocker() {
  const [file, setFile] = useState(null);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    // Load pdf.js dynamically via CDN
    const script = document.createElement('script');
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js";
    script.async = true;
    script.onload = () => {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js";
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleUnlock = async () => {
    if (!file) {
      setError("Please select a PDF file first.");
      return;
    }
    if (!password) {
      setError("Please enter the password.");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const arrayBuffer = await file.arrayBuffer();
      
      const loadingTask = window.pdfjsLib.getDocument({
        data: arrayBuffer,
        password: password
      });

      const pdf = await loadingTask.promise;
      
      const pdfDoc = new jsPDF({
        orientation: 'p',
        unit: 'pt',
        format: 'a4'
      });

      // Loop through all pages and render to off-screen canvas
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale: 2.0 }); // High quality scale
        
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
          canvasContext: context,
          viewport: viewport
        };

        await page.render(renderContext).promise;
        
        const imgData = canvas.toDataURL('image/jpeg', 1.0);
        
        const pdfWidth = pdfDoc.internal.pageSize.getWidth();
        const pdfHeight = (viewport.height * pdfWidth) / viewport.width;

        if (pageNum > 1) {
          pdfDoc.addPage();
        }
        
        pdfDoc.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      }

      // Download the flattened, unlocked PDF
      pdfDoc.save('unlocked_document.pdf');
    } catch (err) {
      if (err.name === 'PasswordException') {
        setError("Incorrect password. For Aadhaar, it's usually first 4 letters of name in CAPITAL + birth year (e.g., AMIT1990)");
      } else {
        setError("Error processing PDF. Ensure it is a valid file and try again.");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      
      <div className="bg-white dark:bg-[#09090b] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 md:p-8 shadow-sm max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 mb-4">
            <i className="fa-solid fa-unlock-keyhole text-2xl"></i>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Unlock Secure PDF</h2>
          <p className="text-gray-500 dark:text-gray-400">Remove password from e-Aadhaar or Bank Statements securely in your browser.</p>
        </div>

        <div className="space-y-6">
          {/* File Upload Zone */}
          <div className="relative border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl p-8 text-center hover:border-emerald-500 transition-colors">
            <input 
              type="file" 
              accept="application/pdf" 
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            {file ? (
              <div className="flex flex-col items-center">
                <i className="fa-solid fa-file-pdf text-4xl text-red-500 mb-3"></i>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{file.name}</p>
                <p className="text-xs text-gray-500 mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <i className="fa-solid fa-cloud-arrow-up text-4xl text-emerald-500 mb-3"></i>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Click or drag PDF file here</p>
                <p className="text-xs text-gray-500 mt-1">Only PDF files are supported</p>
              </div>
            )}
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Document Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i className="fa-solid fa-lock text-gray-400"></i>
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-black text-gray-900 dark:text-white focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                placeholder="e.g. AMIT1990"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-start gap-3">
              <i className="fa-solid fa-circle-exclamation text-red-500 mt-0.5"></i>
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            onClick={handleUnlock}
            disabled={isProcessing || !file || !password}
            className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-8 py-3 font-bold transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <>
                <i className="fa-solid fa-circle-notch fa-spin"></i>
                Unlocking... Please wait
              </>
            ) : (
              <>
                <i className="fa-solid fa-unlock"></i>
                Unlock & Download
              </>
            )}
          </button>
        </div>
        
        {/* Security Note */}
        <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 text-center">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <i className="fa-solid fa-shield-halved text-emerald-500"></i>
            <p><strong>100% Private.</strong> Your password and PDF are processed locally in your browser and never sent to our servers.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
