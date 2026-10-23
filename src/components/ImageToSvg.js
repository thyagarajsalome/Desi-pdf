"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { vectorizeImage } from "@/lib/vectorizer";

export default function ImageToSvg() {
  const [imageSrc, setImageSrc] = useState(null);
  const [imageName, setImageName] = useState("");
  const [imageInfo, setImageInfo] = useState({ width: 0, height: 0, sizeKb: 0 });
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Vectorizer settings
  const [mode, setMode] = useState("monochrome"); // 'monochrome' | 'color'
  const [threshold, setThreshold] = useState(128);
  const [invert, setInvert] = useState(false);
  const [numberOfColors, setNumberOfColors] = useState(8);
  const [pathOmit, setPathOmit] = useState(4); // noise filter
  const [smoothing, setSmoothing] = useState("balanced"); // 'smooth' | 'balanced' | 'sharp'

  // Result state
  const [svgResult, setSvgResult] = useState(null);
  const [copiedStatus, setCopiedStatus] = useState("");
  const [activeView, setActiveView] = useState("compare"); // 'compare' | 'vector' | 'original'

  const fileInputRef = useRef(null);
  const debounceTimerRef = useRef(null);

  // Perform vectorization
  const runVectorization = useCallback(async () => {
    if (!imageSrc) return;
    setIsProcessing(true);

    try {
      const ltres = smoothing === "smooth" ? 2.5 : smoothing === "sharp" ? 0.5 : 1.0;
      const qtres = smoothing === "smooth" ? 2.5 : smoothing === "sharp" ? 0.5 : 1.0;

      const result = await vectorizeImage(imageSrc, {
        mode,
        threshold,
        invert,
        numberOfColors,
        pathOmit,
        ltres,
        qtres,
      });

      setSvgResult(result);
    } catch (err) {
      console.error("Vectorization failed:", err);
    } finally {
      setIsProcessing(false);
    }
  }, [imageSrc, mode, threshold, invert, numberOfColors, pathOmit, smoothing]);

  // Debounced auto-re-vectorize when settings change
  useEffect(() => {
    if (!imageSrc) return;
    clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(() => {
      runVectorization();
    }, 180);

    return () => clearTimeout(debounceTimerRef.current);
  }, [imageSrc, mode, threshold, invert, numberOfColors, pathOmit, smoothing, runVectorization]);

  // File Loader
  const handleFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file (PNG, JPG, JPEG, WEBP).");
      return;
    }

    const name = file.name.replace(/\.[^/.]+$/, "");
    setImageName(name);

    const sizeKb = Math.round(file.size / 1024);
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result;
      setImageSrc(dataUrl);

      // Measure dimensions
      const img = new Image();
      img.onload = () => {
        setImageInfo({
          width: img.naturalWidth,
          height: img.naturalHeight,
          sizeKb,
        });
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  // Drag and Drop
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  // Paste from clipboard
  useEffect(() => {
    const handlePaste = (e) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith("image/")) {
          const file = items[i].getAsFile();
          if (file) handleFile(file);
          break;
        }
      }
    };
    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, []);

  // Download SVG
  const handleDownloadSvg = () => {
    if (!svgResult?.svgString) return;
    const blob = new Blob([svgResult.svgString], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${imageName || "vector"}-converted.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Copy SVG Code
  const handleCopySvg = () => {
    if (!svgResult?.svgString) return;
    navigator.clipboard.writeText(svgResult.svgString);
    setCopiedStatus("svg");
    setTimeout(() => setCopiedStatus(""), 2000);
  };

  // Copy React JSX
  const handleCopyJsx = () => {
    if (!svgResult?.svgString) return;
    const cleanSvg = svgResult.svgString
      .replace(/<\?xml[^>]*\?>/gi, "")
      .replace(/<!DOCTYPE[^>]*>/gi, "");
    const componentName = (imageName || "VectorIcon")
      .replace(/[^a-zA-Z0-9]/g, " ")
      .split(" ")
      .filter(Boolean)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join("") + "Icon";

    const jsx = `export function ${componentName}({ className = "", ...props }) {
  return (
    ${cleanSvg.replace("<svg", '<svg className={className} {...props}')}
  );
}`;
    navigator.clipboard.writeText(jsx);
    setCopiedStatus("jsx");
    setTimeout(() => setCopiedStatus(""), 2000);
  };

  // Calculate approximate SVG size in KB
  const svgSizeKb = svgResult?.svgString
    ? (new Blob([svgResult.svgString]).size / 1024).toFixed(1)
    : 0;

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      {/* Top Banner / Hero Card */}
      <div className="bg-white dark:bg-[#09090b] text-gray-900 dark:text-white rounded-3xl p-6 sm:p-8 border border-gray-200 dark:border-gray-800 shadow-sm relative">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700/60 text-gray-700 dark:text-gray-300 text-xs font-semibold tracking-wide">
              <i className="fa-solid fa-bezier-curve text-gray-500 dark:text-gray-400"></i> Pure In-Browser Vector Engine
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              Convert Image to Vector (SVG) Online
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base leading-relaxed">
              Trace any raster picture (<strong className="text-gray-900 dark:text-gray-200 font-semibold">PNG, JPG, JPEG, WEBP</strong>) into infinitely scalable mathematical SVG paths. Perfect for logos, CAD designs, laser cutting, and web icons.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-gray-900 hover:bg-black dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900 font-bold text-xs sm:text-sm border border-transparent transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <i className="fa-solid fa-cloud-arrow-up text-sm"></i>
              <span>{imageSrc ? "Upload New Image" : "Select Image to Vectorize"}</span>
            </button>
            <Link
              href="/icon-generator"
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 font-bold text-xs sm:text-sm border border-gray-200 dark:border-gray-700 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <i className="fa-solid fa-shapes text-sm"></i>
              <span>Open CAD Icon Studio</span>
            </Link>
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => handleFile(e.target.files?.[0])}
              accept="image/png, image/jpeg, image/webp, .png, .jpg, .jpeg, .webp"
              className="hidden"
            />
          </div>
        </div>
      </div>

      {/* Main Vectorizer Studio Area */}
      {!imageSrc ? (
        /* Empty State Dropzone */
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`bg-white dark:bg-[#09090b] border-2 border-dashed rounded-3xl p-12 text-center transition cursor-pointer flex flex-col items-center justify-center gap-4 ${
            isDragging
              ? "border-gray-900 dark:border-white bg-gray-50 dark:bg-[#121217]"
              : "border-gray-300 dark:border-gray-800 hover:border-gray-400 dark:hover:border-gray-700"
          }`}
        >
          <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 flex items-center justify-center text-2xl shadow-inner">
            <i className="fa-solid fa-bezier-curve"></i>
          </div>
          <div className="space-y-1.5">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Drag &amp; Drop your image here, or browse from computer
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Supports PNG, JPG, JPEG, and WEBP • You can also press <kbd className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-[10px] font-mono">Ctrl+V</kbd> to paste from clipboard
            </p>
          </div>
          <div className="flex gap-2 pt-2">
            {["PNG", "JPG", "WEBP"].map((fmt) => (
              <span
                key={fmt}
                className="px-2.5 py-1 rounded-lg text-xs font-bold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
              >
                .{fmt.toLowerCase()}
              </span>
            ))}
          </div>
        </div>
      ) : (
        /* Active Workspace: Preview & Controls */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Visual Inspector (7 cols) */}
          <div className="lg:col-span-7 bg-white dark:bg-[#09090b] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-sm space-y-6">
            
            {/* View Mode Tabs */}
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm text-gray-900 dark:text-white truncate max-w-[220px]">
                  {imageName}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
                  {imageInfo.width}×{imageInfo.height}px • {imageInfo.sizeKb} KB
                </span>
              </div>

              {/* View Switcher */}
              <div className="flex p-1 bg-gray-100 dark:bg-gray-800 rounded-xl text-xs font-bold">
                {[
                  { id: "compare", label: "Side-by-Side" },
                  { id: "vector", label: "Vector (SVG)" },
                  { id: "original", label: "Original" },
                ].map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setActiveView(v.id)}
                    className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                      activeView === v.id
                        ? "bg-white dark:bg-black text-gray-900 dark:text-white shadow-xs"
                        : "text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                    }`}
                  >
                    {v.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Display Stage */}
            <div className="relative min-h-[360px] max-h-[520px] rounded-2xl bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:16px_16px] bg-gray-50 dark:bg-[#121217] border border-gray-200 dark:border-gray-800 flex items-center justify-center p-6 overflow-hidden">
              
              {isProcessing && (
                <div className="absolute inset-0 bg-white/70 dark:bg-black/70 backdrop-blur-xs z-20 flex flex-col items-center justify-center gap-2 text-xs font-bold text-gray-800 dark:text-gray-200">
                  <i className="fa-solid fa-circle-notch fa-spin text-2xl text-gray-900 dark:text-white"></i>
                  <span>Tracing Vector Paths...</span>
                </div>
              )}

              {/* Compare Mode */}
              {activeView === "compare" && (
                <div className="grid grid-cols-2 gap-4 w-full h-full">
                  <div className="flex flex-col items-center justify-center p-4 bg-white/60 dark:bg-black/40 rounded-xl border border-gray-200/60 dark:border-gray-800/80">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">
                      Original Raster (Pixelated on Zoom)
                    </span>
                    <div className="w-full h-56 flex items-center justify-center overflow-hidden">
                      <img
                        src={imageSrc}
                        alt="Original"
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col items-center justify-center p-4 bg-white/60 dark:bg-black/40 rounded-xl border border-gray-200/60 dark:border-gray-800/80">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2">
                      Infinite Scalable Vector (SVG)
                    </span>
                    <div className="w-full h-56 flex items-center justify-center overflow-hidden [&>svg]:w-full [&>svg]:h-full [&>svg]:object-contain">
                      {svgResult?.svgString ? (
                        <div
                          dangerouslySetInnerHTML={{ __html: svgResult.svgString }}
                          className="w-full h-full flex items-center justify-center [&>svg]:max-w-full [&>svg]:max-h-full"
                        />
                      ) : null}
                    </div>
                  </div>
                </div>
              )}

              {/* Vector Only Mode */}
              {activeView === "vector" && (
                <div className="w-full h-72 flex items-center justify-center overflow-hidden">
                  {svgResult?.svgString ? (
                    <div
                      dangerouslySetInnerHTML={{ __html: svgResult.svgString }}
                      className="w-full h-full flex items-center justify-center [&>svg]:max-w-full [&>svg]:max-h-full [&>svg]:w-auto [&>svg]:h-auto"
                    />
                  ) : null}
                </div>
              )}

              {/* Original Only Mode */}
              {activeView === "original" && (
                <div className="w-full h-72 flex items-center justify-center overflow-hidden">
                  <img
                    src={imageSrc}
                    alt="Original"
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              )}
            </div>

            {/* Path & Stats Bar */}
            <div className="flex flex-wrap items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-4">
                <span>
                  Paths: <strong className="text-gray-900 dark:text-white">{svgResult?.pathCount || 0}</strong>
                </span>
                <span>
                  SVG Size: <strong className="text-gray-900 dark:text-white">{svgSizeKb} KB</strong>
                </span>
              </div>
              <span className="text-[11px] text-gray-400">
                Resolution: {svgResult?.width}×{svgResult?.height} viewBox
              </span>
            </div>

          </div>

          {/* Right Column: Vectorization Controls & Export (5 cols) */}
          <div className="lg:col-span-5 bg-white dark:bg-[#09090b] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-sm space-y-6">
            
            <div className="border-b border-gray-100 dark:border-gray-800 pb-3">
              <h3 className="text-base font-extrabold text-gray-900 dark:text-white">
                Vector Tuning Controls
              </h3>
              <p className="text-xs text-gray-400">
                Fine-tune curve sensitivity, contrast threshold, and noise reduction
              </p>
            </div>

            {/* Tracing Mode Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">
                Vector Style
              </label>
              <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl text-xs font-bold">
                <button
                  onClick={() => setMode("monochrome")}
                  className={`py-2 px-3 rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    mode === "monochrome"
                      ? "bg-white dark:bg-black text-gray-900 dark:text-white shadow-xs"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                >
                  <i className="fa-solid fa-circle-half-stroke"></i>
                  <span>Monochrome / CAD</span>
                </button>
                <button
                  onClick={() => setMode("color")}
                  className={`py-2 px-3 rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    mode === "color"
                      ? "bg-white dark:bg-black text-gray-900 dark:text-white shadow-xs"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                >
                  <i className="fa-solid fa-palette"></i>
                  <span>Color Layers</span>
                </button>
              </div>
            </div>

            {/* Mode-Specific Sliders */}
            {mode === "monochrome" ? (
              <div className="space-y-4 pt-1">
                {/* Threshold Slider */}
                <div>
                  <div className="flex justify-between text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                    <span>Luminance Threshold: {threshold}</span>
                    <span className="text-gray-400 text-[11px]">{threshold < 100 ? "Finer lines" : threshold > 160 ? "Bolder lines" : "Balanced"}</span>
                  </div>
                  <input
                    type="range"
                    min="30"
                    max="225"
                    step="5"
                    value={threshold}
                    onChange={(e) => setThreshold(parseInt(e.target.value, 10))}
                    className="w-full accent-gray-900 dark:accent-white cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                    <button onClick={() => setThreshold(80)} className="hover:underline">Fine (80)</button>
                    <button onClick={() => setThreshold(128)} className="font-bold hover:underline">Standard (128)</button>
                    <button onClick={() => setThreshold(175)} className="hover:underline">Bold (175)</button>
                  </div>
                </div>

                {/* Invert Dark / Light */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-[#121217] border border-gray-200/60 dark:border-gray-800/80 text-xs">
                  <div>
                    <span className="font-bold text-gray-800 dark:text-gray-200 block">
                      Invert Silhouette
                    </span>
                    <span className="text-gray-400 text-[11px]">
                      Trace light areas instead of dark areas
                    </span>
                  </div>
                  <button
                    onClick={() => setInvert(!invert)}
                    className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                      invert ? "bg-gray-900 dark:bg-white" : "bg-gray-300 dark:bg-gray-700"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white dark:bg-black transition-transform absolute top-1 ${
                        invert ? "left-6" : "left-1"
                      }`}
                    />
                  </button>
                </div>
              </div>
            ) : (
              /* Color Mode Settings */
              <div className="space-y-4 pt-1">
                <div>
                  <div className="flex justify-between text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                    <span>Number of Colors: {numberOfColors}</span>
                    <span className="text-gray-400 text-[11px]">Posterization Layers</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {[4, 8, 16, 24].map((num) => (
                      <button
                        key={num}
                        onClick={() => setNumberOfColors(num)}
                        className={`py-2 rounded-xl text-xs font-bold transition cursor-pointer border ${
                          numberOfColors === num
                            ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-transparent shadow-xs"
                            : "bg-gray-50 dark:bg-[#121217] text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-800 hover:border-gray-300"
                        }`}
                      >
                        {num} Colors
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* General Curve Quality & Noise Reduction */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                  Curve Smoothing
                </label>
                <select
                  value={smoothing}
                  onChange={(e) => setSmoothing(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800 rounded-xl py-2 px-2.5 text-xs font-bold text-gray-800 dark:text-gray-200 outline-none"
                >
                  <option value="smooth">Smooth Curves</option>
                  <option value="balanced">Balanced Fidelity</option>
                  <option value="sharp">Sharp / Precise</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                  Speck / Noise Filter
                </label>
                <select
                  value={pathOmit}
                  onChange={(e) => setPathOmit(parseInt(e.target.value, 10))}
                  className="w-full bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800 rounded-xl py-2 px-2.5 text-xs font-bold text-gray-800 dark:text-gray-200 outline-none"
                >
                  <option value={0}>Keep All Details (0px)</option>
                  <option value={4}>Standard Filter (4px)</option>
                  <option value={8}>Clean Small Dust (8px)</option>
                  <option value={16}>High Cleanup (16px)</option>
                </select>
              </div>
            </div>

            {/* Action & Export Section */}
            <div className="pt-4 border-t border-gray-100 dark:border-gray-800 space-y-3">
              {/* Primary Download SVG */}
              <button
                onClick={handleDownloadSvg}
                disabled={!svgResult}
                className="w-full py-3.5 px-4 rounded-xl bg-gray-900 hover:bg-black dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900 font-extrabold text-xs transition flex items-center justify-center gap-2 shadow-xs cursor-pointer disabled:opacity-50"
              >
                <i className="fa-solid fa-download text-sm"></i>
                <span>Download SVG Vector File</span>
              </button>

              {/* Secondary Code Copy Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleCopySvg}
                  disabled={!svgResult}
                  className="py-2.5 px-3 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 font-bold text-xs border border-gray-200 dark:border-gray-700 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <i className={`fa-solid ${copiedStatus === "svg" ? "fa-check text-emerald-500" : "fa-copy"}`}></i>
                  <span>{copiedStatus === "svg" ? "SVG Copied!" : "Copy SVG Code"}</span>
                </button>
                <button
                  onClick={handleCopyJsx}
                  disabled={!svgResult}
                  className="py-2.5 px-3 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 font-bold text-xs border border-gray-200 dark:border-gray-700 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <i className={`fa-solid ${copiedStatus === "jsx" ? "fa-check text-emerald-500" : "fa-code"}`}></i>
                  <span>{copiedStatus === "jsx" ? "React JSX Copied!" : "Copy React JSX"}</span>
                </button>
              </div>

              {/* Cross-Link to Icon Studio */}
              <Link
                href="/icon-generator"
                className="w-full py-2.5 px-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-300 font-bold text-xs border border-blue-200 dark:border-blue-900/60 transition flex items-center justify-center gap-2"
              >
                <i className="fa-solid fa-shapes"></i>
                <span>Use this in App Icon &amp; Favicon Maker</span>
              </Link>
            </div>

          </div>

        </div>
      )}

      {/* SEO & Rich Guide Content */}
      <div className="bg-white dark:bg-[#09090b] border border-gray-200 dark:border-gray-800 rounded-3xl p-8 sm:p-12 space-y-8">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-2">
            Why Convert Raster Images (PNG, JPG) to Vector (SVG)?
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base leading-relaxed">
            Bitmap images (JPEG, PNG, WEBP) are made of fixed pixels that become blurry, jagged, or pixelated when zoomed in or printed at high resolutions. Vector graphics (SVG) store geometric mathematical curves and shapes, which render with razor-sharp fidelity at any scale—from a tiny 16px favicon up to a giant architectural billboard.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-gray-50 dark:bg-[#121217] border border-gray-100 dark:border-gray-800 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 flex items-center justify-center text-sm font-bold">
              <i className="fa-solid fa-expand"></i>
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white">Infinite Scalability</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Scale your artwork to any dimension without losing quality. Perfect for logos, responsive website headers, and high-DPI displays.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-gray-50 dark:bg-[#121217] border border-gray-100 dark:border-gray-800 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 flex items-center justify-center text-sm font-bold">
              <i className="fa-solid fa-industry"></i>
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white">CAD, CNC &amp; Laser Ready</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Compatible with AutoCAD, Illustrator, CorelDRAW, Inkscape, vinyl cutters, laser engravers, and embroidery machines.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-gray-50 dark:bg-[#121217] border border-gray-100 dark:border-gray-800 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 flex items-center justify-center text-sm font-bold">
              <i className="fa-solid fa-shield-halved"></i>
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white">100% Client-Side Privacy</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              All contour path calculations occur right inside your browser with HTML5 Canvas. Your confidential files never touch external servers.
            </p>
          </div>
        </div>

        {/* FAQs */}
        <div className="space-y-4 pt-6 border-t border-gray-100 dark:border-gray-800">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Frequently Asked Questions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-[#121217] border border-gray-100 dark:border-gray-800">
              <span className="font-bold text-gray-800 dark:text-gray-200 block mb-1">
                How does Image to Vector conversion work?
              </span>
              <span className="text-gray-500 leading-relaxed">
                The engine analyzes the luminance and edge boundaries of your bitmap image, clusters pixels into mathematical polygons, and fits smooth quadratic Bézier curves along the outlines to generate standard SVG code.
              </span>
            </div>
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-[#121217] border border-gray-100 dark:border-gray-800">
              <span className="font-bold text-gray-800 dark:text-gray-200 block mb-1">
                Can I convert signatures and hand-drawn sketches to SVG?
              </span>
              <span className="text-gray-500 leading-relaxed">
                Yes! Upload a photo or scan of your signature or drawing, use the "Monochrome / CAD" mode, and adjust the threshold slider until the lines appear crisp and smooth with zero background artifacts.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
