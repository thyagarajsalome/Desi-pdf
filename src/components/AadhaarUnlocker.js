"use client";

import { useState, useEffect, useRef } from "react";
import { jsPDF } from "jspdf";
import { Loader2 } from "lucide-react";
import { auth } from "@/lib/firebase";

export default function AadhaarUnlocker() {
  const [file, setFile] = useState(null);
  const [password, setPassword] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState("");
  const [result, setResult] = useState(null);
  const [pdfjsLib, setPdfjsLib] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [needsPassword, setNeedsPassword] = useState(false);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (window.pdfjsLib) {
      setPdfjsLib(window.pdfjsLib);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
    script.async = true;
    script.onload = () => {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
      setPdfjsLib(window.pdfjsLib);
    };
    document.body.appendChild(script);
  }, []);

  const handleFile = async (selectedFile) => {
    if (!selectedFile || selectedFile.type !== "application/pdf") {
      setErrorMsg("Please upload a valid PDF file.");
      return;
    }
    
    setFile(selectedFile);
    setResult(null);
    setErrorMsg("");
    setNeedsPassword(false);
    setPassword("");

    // Quick test to see if it actually needs a password
    if (pdfjsLib) {
      try {
        const arrayBuffer = await selectedFile.arrayBuffer();
        await pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) }).promise;
        // If it succeeds without a password, it's not locked.
        setErrorMsg("This PDF is not password protected. You don't need to unlock it!");
      } catch (error) {
        if (error.name === "PasswordException") {
          setNeedsPassword(true);
        } else {
          setErrorMsg("Could not read PDF. It might be corrupted.");
        }
      }
    }
  };

  const handleUnlock = async () => {
    if (!file || !pdfjsLib || !password) return;
    setIsProcessing(true);
    setErrorMsg("");
    setProgress("Verifying password...");

    try {
      const arrayBuffer = await file.arrayBuffer();
      
      // 1. Try to open with password
      let loadedPdf;
      try {
        loadedPdf = await pdfjsLib.getDocument({ 
          data: new Uint8Array(arrayBuffer),
          password: password 
        }).promise;
      } catch (pwError) {
        if (pwError.name === "PasswordException") {
          throw new Error("Incorrect Password. Remember, for Aadhaar it is usually the first 4 letters of your name (in CAPITALS) followed by your birth year (e.g., AMIT1990).");
        }
        throw pwError;
      }

      // 2. Unlocked! Now we rebuild it as an unencrypted PDF using jsPDF
      setProgress("Unlocking and removing encryption...");
      const numPages = loadedPdf.numPages;
      const doc = new jsPDF({ unit: "pt", format: "a4" });
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      for (let i = 1; i <= numPages; i++) {
        setProgress(`Processing page ${i} of ${numPages}...`);
        const page = await loadedPdf.getPage(i);
        
        // Render at very high DPI to preserve ID card quality (scale 2.5 = ~180 DPI)
        const viewport = page.getViewport({ scale: 2.5 });
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        
        await page.render({ canvasContext: context, viewport }).promise;
        const imgData = canvas.toDataURL("image/jpeg", 0.95);
        
        const pdfViewport = page.getViewport({ scale: 1.0 });
        if (i > 1) doc.addPage([pdfViewport.width, pdfViewport.height]);
        else doc.setPage(1);
        
        doc.addImage(imgData, 'JPEG', 0, 0, pdfViewport.width, pdfViewport.height, undefined, 'FAST');
      }

      setProgress("Finalizing unlocked file...");
      const pdfBlob = doc.output('blob');
      
      setResult({
        blob: pdfBlob,
        url: URL.createObjectURL(pdfBlob),
        filename: `Unlocked_${file.name}`
      });

    } catch (error) {
      console.error(error);
      setErrorMsg(error.message || "An error occurred while unlocking the PDF.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white dark:bg-[#09090b] rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-gray-100 dark:border-gray-800 p-8 w-full max-w-2xl mx-auto transition-colors duration-300">
      <canvas ref={canvasRef} style={{ display: "none" }} />

      {!file ? (
        <div 
          className="border-2 border-dashed border-indigo-300 dark:border-indigo-700 hover:border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 rounded-2xl p-12 text-center cursor-pointer transition duration-300"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => { e.preventDefault(); handleFile(e.dataTransfer.files[0]); }}
          onClick={() => document.getElementById("pdf-upload").click()}
        >
          <div className="text-indigo-500 text-6xl mb-4"><i className="fa-solid fa-lock"></i></div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Upload Protected PDF</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">Select your e-Aadhaar or locked Bank Statement</p>
          <div className="inline-block bg-white dark:bg-[#09090b] text-indigo-600 dark:text-indigo-400 font-bold px-6 py-3 rounded-full shadow-sm border border-gray-200 dark:border-gray-700">
            Browse Files
          </div>
          <input type="file" id="pdf-upload" accept=".pdf" className="hidden" onChange={(e) => handleFile(e.target.files[0])} />
        </div>
      ) : !result ? (
        <div className="animate-in fade-in zoom-in-95 duration-300">
          <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-4 rounded-xl mb-6">
            <div className="flex items-center gap-4">
              <div className="text-red-500 text-3xl"><i className="fa-solid fa-file-pdf"></i></div>
              <div className="font-bold text-gray-900 dark:text-gray-100 truncate max-w-[200px] sm:max-w-xs">{file.name}</div>
            </div>
            <button className="text-gray-400 hover:text-red-500 p-2" onClick={() => setFile(null)}><i className="fa-solid fa-xmark text-xl"></i></button>
          </div>

          {errorMsg && !needsPassword && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-xl text-red-600 dark:text-red-400 font-semibold text-center mb-6">
              {errorMsg}
            </div>
          )}

          {needsPassword && (
            <div className="space-y-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800 text-sm text-blue-800 dark:text-blue-300">
                <i className="fa-solid fa-circle-info mr-2"></i>
                <strong>Aadhaar Password Format:</strong> First 4 letters of your name in CAPITALS + Year of Birth (e.g., <strong>AMIT1990</strong>).
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Enter PDF Password</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="e.g. AMIT1990"
                  className="w-full px-5 py-4 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-gray-900 dark:text-white font-mono text-lg tracking-widest text-center"
                />
              </div>

              {errorMsg && (
                <div className="text-red-500 text-sm font-bold text-center">{errorMsg}</div>
              )}

              <button 
                onClick={handleUnlock}
                disabled={isProcessing || !password}
                className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 disabled:opacity-50 text-white px-6 py-4 rounded-xl font-extrabold text-lg flex items-center justify-center gap-3 transition-all shadow-md hover:shadow-lg"
              >
                {isProcessing ? (
                  <><Loader2 className="animate-spin h-5 w-5" /> {progress}</>
                ) : (
                  <><i className="fa-solid fa-unlock"></i> Remove Password Permanently</>
                )}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center animate-in fade-in zoom-in duration-500">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-500 rounded-full mb-6 shadow-sm border border-emerald-200 dark:border-emerald-800">
            <i className="fa-solid fa-lock-open text-4xl"></i>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">Unlocked Successfully!</h2>
          <p className="text-gray-500 dark:text-gray-400 font-medium mb-8">
            The password has been permanently removed. You can now easily share or print this file.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="px-6 py-4 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-bold transition" onClick={() => { setFile(null); setResult(null); }}>
              Unlock Another
            </button>
            <a href={result.url} download={result.filename} className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/30 rounded-xl font-extrabold transition flex items-center justify-center gap-3 hover:-translate-y-1">
              <i className="fa-solid fa-download"></i> Download Unlocked PDF
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
