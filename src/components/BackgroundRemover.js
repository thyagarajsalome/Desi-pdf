"use client";

import React, { useState, useRef, useEffect } from 'react';
import { removeBackground } from '@imgly/background-removal';

export default function BackgroundRemover() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [originalImage, setOriginalImage] = useState(null);
    const [processedImage, setProcessedImage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState(null);

    const fileInputRef = useRef(null);

    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (file && (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/webp')) {
            setSelectedFile(file);
            const objectUrl = URL.createObjectURL(file);
            setOriginalImage(objectUrl);
            setProcessedImage(null);
            setError(null);
            setProgress(0);
        } else {
            setError('Please select a valid image file (JPG, PNG, WEBP).');
        }
    };

    const processImage = async () => {
        if (!selectedFile) return;

        setIsLoading(true);
        setError(null);
        setProgress(0);

        try {
            const blob = await removeBackground(selectedFile, {
                progress: (key, current, total) => {
                    if (total > 0) {
                        const percentage = Math.round((current / total) * 100);
                        setProgress(percentage);
                    }
                }
            });
            const url = URL.createObjectURL(blob);
            setProcessedImage(url);
        } catch (err) {
            console.error(err);
            setError('Failed to process the image. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const downloadPNG = () => {
        if (!processedImage) return;
        const link = document.createElement('a');
        link.href = processedImage;
        link.download = 'removed-background.png';
        link.click();
    };

    const downloadJPG = () => {
        if (!processedImage) return;
        
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            
            // Fill with white background
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Draw transparent image over white background
            ctx.drawImage(img, 0, 0);
            
            const jpegUrl = canvas.toDataURL('image/jpeg', 0.9);
            const link = document.createElement('a');
            link.href = jpegUrl;
            link.download = 'white-background.jpg';
            link.click();
        };
        
        img.src = processedImage;
    };
    
    // Clear object URLs on unmount to avoid memory leaks
    useEffect(() => {
        return () => {
            if (originalImage) URL.revokeObjectURL(originalImage);
            if (processedImage) URL.revokeObjectURL(processedImage);
        };
    }, [originalImage, processedImage]);

    return (
        <div className="w-full max-w-5xl mx-auto">
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
            <div className="bg-white dark:bg-[#09090b] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 md:p-8 shadow-sm">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Background Remover</h2>
                    <p className="text-gray-500 dark:text-gray-400">Remove background from your images instantly</p>
                </div>

                {!originalImage && (
                    <div 
                        className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl p-12 text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <i className="fa-solid fa-cloud-arrow-up text-4xl text-gray-400 mb-4"></i>
                        <p className="text-gray-600 dark:text-gray-300 font-medium">Click to upload an image</p>
                        <p className="text-gray-400 text-sm mt-2">Supports JPG, PNG, WEBP</p>
                        <input 
                            type="file" 
                            className="hidden" 
                            ref={fileInputRef} 
                            onChange={handleFileSelect}
                            accept="image/jpeg, image/png, image/webp"
                        />
                    </div>
                )}

                {error && (
                    <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-center">
                        <i className="fa-solid fa-circle-exclamation mr-2"></i>
                        {error}
                    </div>
                )}

                {originalImage && !processedImage && !isLoading && (
                    <div className="mt-8 flex flex-col items-center">
                        <div className="relative w-full max-w-md rounded-2xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700">
                            <img src={originalImage} alt="Original" className="w-full h-auto object-cover" />
                        </div>
                        <div className="mt-6 flex gap-4">
                            <button 
                                onClick={() => {
                                    setOriginalImage(null);
                                    setSelectedFile(null);
                                    if (fileInputRef.current) fileInputRef.current.value = '';
                                }}
                                className="px-6 py-3 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={processImage}
                                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium transition-colors shadow-sm flex items-center gap-2"
                            >
                                <i className="fa-solid fa-wand-magic-sparkles"></i>
                                Remove Background
                            </button>
                        </div>
                    </div>
                )}

                {isLoading && (
                    <div className="mt-8 flex flex-col items-center justify-center p-12 border border-gray-200 dark:border-gray-800 rounded-2xl bg-gray-50 dark:bg-gray-900/50">
                        <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mb-6"></div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Processing Image</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-center max-w-sm mb-4">
                            This runs entirely in your browser using AI. The first time might take a few moments to load the model.
                        </p>
                        <div className="w-full max-w-xs bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                            <div className="bg-purple-600 h-2.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                        </div>
                    </div>
                )}

                {processedImage && (
                    <div className="mt-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div>
                                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 text-center">Original</h3>
                                <div className="rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4 min-h-[300px]">
                                    <img src={originalImage} alt="Original" className="max-w-full max-h-[400px] object-contain rounded-xl" />
                                </div>
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 text-center">Result</h3>
                                <div className="rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-[url('https://upload.wikimedia.org/wikipedia/commons/4/48/Light_Grey_Checkerboard.svg')] dark:bg-[url('https://upload.wikimedia.org/wikipedia/commons/5/5c/Dark_Grey_Checkerboard.svg')] flex items-center justify-center p-4 min-h-[300px]">
                                    <img src={processedImage} alt="Processed" className="max-w-full max-h-[400px] object-contain" />
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <button 
                                onClick={() => {
                                    setOriginalImage(null);
                                    setProcessedImage(null);
                                    setSelectedFile(null);
                                    if (fileInputRef.current) fileInputRef.current.value = '';
                                }}
                                className="w-full sm:w-auto px-6 py-3 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
                            >
                                <i className="fa-solid fa-rotate-left mr-2"></i>
                                Start Over
                            </button>
                            <button 
                                onClick={downloadPNG}
                                className="w-full sm:w-auto px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium transition-colors shadow-sm flex items-center justify-center gap-2"
                            >
                                <i className="fa-solid fa-download"></i>
                                Download as PNG
                            </button>
                            <button 
                                onClick={downloadJPG}
                                className="w-full sm:w-auto px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium transition-colors shadow-sm flex items-center justify-center gap-2"
                            >
                                <i className="fa-solid fa-download"></i>
                                Download as JPG
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
