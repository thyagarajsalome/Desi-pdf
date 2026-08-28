"use client";

import React, { useState, useRef } from 'react';
import { jsPDF } from 'jspdf';

export default function ImageToPdf() {
  const [images, setImages] = useState([]);
  const [options, setOptions] = useState({
    pageSize: 'a4',
    orientation: 'portrait',
    imageFit: 'fit',
    margin: 'none'
  });
  const [draggedItemIndex, setDraggedItemIndex] = useState(null);
  const fileInputRef = useRef(null);

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'));
    processFiles(files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files).filter(file => file.type.startsWith('image/'));
    processFiles(files);
  };

  const processFiles = (files) => {
    const newImages = files.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      preview: URL.createObjectURL(file)
    }));
    setImages(prev => [...prev, ...newImages]);
  };

  const removeImage = (id) => {
    setImages(prev => prev.filter(img => img.id !== id));
  };

  const handleDragStart = (index) => {
    setDraggedItemIndex(index);
  };

  const handleDragEnter = (e, index) => {
    if (draggedItemIndex === null) return;
    const newImages = [...images];
    const draggedItem = newImages[draggedItemIndex];
    newImages.splice(draggedItemIndex, 1);
    newImages.splice(index, 0, draggedItem);
    setDraggedItemIndex(index);
    setImages(newImages);
  };

  const handleDragEnd = () => {
    setDraggedItemIndex(null);
  };

  const generatePDF = async () => {
    if (images.length === 0) return;

    const doc = new jsPDF({
      orientation: options.orientation,
      unit: 'mm',
      format: options.pageSize
    });

    const marginMap = { none: 0, small: 10, medium: 20 };
    const margin = marginMap[options.margin];

    for (let i = 0; i < images.length; i++) {
      if (i > 0) doc.addPage();
      const img = images[i];
      
      const imgObj = await new Promise((resolve) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.src = img.preview;
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const imgWidth = imgObj.width;
      const imgHeight = imgObj.height;

      let renderWidth = pageWidth - (margin * 2);
      let renderHeight = pageHeight - (margin * 2);
      let x = margin;
      let y = margin;

      if (options.imageFit === 'fit') {
        const ratio = Math.min(renderWidth / imgWidth, renderHeight / imgHeight);
        renderWidth = imgWidth * ratio;
        renderHeight = imgHeight * ratio;
        x = (pageWidth - renderWidth) / 2;
        y = (pageHeight - renderHeight) / 2;
      } else if (options.imageFit === 'original') {
        renderWidth = imgWidth * 0.264583; // approx px to mm
        renderHeight = imgHeight * 0.264583;
        x = (pageWidth - renderWidth) / 2;
        y = (pageHeight - renderHeight) / 2;
      }

      doc.addImage(imgObj, 'JPEG', x, y, renderWidth, renderHeight);
    }

    doc.save('converted-images.pdf');
  };

  return (
    <>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      <div className="w-full max-w-4xl mx-auto p-4">
        <div className="bg-white dark:bg-[#09090b] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 md:p-8 shadow-sm">
          
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100"><i className="fa-solid fa-file-pdf mr-2"></i>Image to PDF Converter</h2>
          
          <div 
            className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl p-8 text-center cursor-pointer mb-6 transition-colors hover:border-blue-500"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => fileInputRef.current.click()}
          >
            <input 
              type="file" 
              multiple 
              accept="image/png, image/jpeg, image/webp" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
            />
            <i className="fa-solid fa-cloud-arrow-up text-4xl text-gray-400 mb-3"></i>
            <p className="text-gray-600 dark:text-gray-400 text-lg">Drag & drop images here</p>
            <p className="text-sm text-gray-500 mt-2">or click to browse (JPG, PNG, WEBP)</p>
          </div>

          {images.length > 0 && (
            <div className="mb-6">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">{images.length} image{images.length !== 1 ? 's' : ''} selected</p>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {images.map((img, index) => (
                  <div 
                    key={img.id}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragEnter={(e) => handleDragEnter(e, index)}
                    onDragEnd={handleDragEnd}
                    onDragOver={(e) => e.preventDefault()}
                    className="relative group aspect-square rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden cursor-move"
                  >
                    <img src={img.preview} alt="preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button 
                        onClick={(e) => { e.stopPropagation(); removeImage(img.id); }}
                        className="bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600"
                      >
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Page Size</label>
              <select 
                className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 rounded-lg p-2.5"
                value={options.pageSize}
                onChange={(e) => setOptions({...options, pageSize: e.target.value})}
              >
                <option value="a4">A4</option>
                <option value="letter">Letter</option>
                <option value="legal">Legal</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Orientation</label>
              <select 
                className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 rounded-lg p-2.5"
                value={options.orientation}
                onChange={(e) => setOptions({...options, orientation: e.target.value})}
              >
                <option value="portrait">Portrait</option>
                <option value="landscape">Landscape</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Image Fit</label>
              <select 
                className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 rounded-lg p-2.5"
                value={options.imageFit}
                onChange={(e) => setOptions({...options, imageFit: e.target.value})}
              >
                <option value="fit">Fit to page</option>
                <option value="stretch">Stretch</option>
                <option value="original">Original size</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Margin</label>
              <select 
                className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 rounded-lg p-2.5"
                value={options.margin}
                onChange={(e) => setOptions({...options, margin: e.target.value})}
              >
                <option value="none">No margin</option>
                <option value="small">Small</option>
                <option value="medium">Medium</option>
              </select>
            </div>
          </div>

          <div className="flex justify-center">
            <button 
              onClick={generatePDF}
              disabled={images.length === 0}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl px-8 py-3 w-full md:w-auto transition-colors"
            >
              <i className="fa-solid fa-file-pdf mr-2"></i>
              Convert to PDF
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
