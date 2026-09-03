"use client";

import React, { useRef, useState, useEffect } from 'react';

export default function SignatureMaker() {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [thickness, setThickness] = useState(2);
  const [mode, setMode] = useState('draw'); // 'draw' or 'type'
  const [typedName, setTypedName] = useState('');
  
  const [history, setHistory] = useState([]);
  
  useEffect(() => {
    if (mode === 'draw' && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    }
  }, [mode]);

  const saveState = () => {
    if (canvasRef.current) {
      setHistory([...history, canvasRef.current.toDataURL()]);
    }
  };

  const getCoordinates = (e, canvas) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    if (e.touches && e.touches.length > 0) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  };

  const startDrawing = (e) => {
    e.preventDefault();
    setIsDrawing(true);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const { x, y } = getCoordinates(e, canvas);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const { x, y } = getCoordinates(e, canvas);
    
    ctx.strokeStyle = color;
    ctx.lineWidth = thickness;
    
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      saveState();
    }
  };

  const clearCanvas = () => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setHistory([]);
    }
  };

  const undo = () => {
    if (history.length > 0) {
      const newHistory = [...history];
      newHistory.pop(); // Remove current state
      setHistory(newHistory);
      
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      if (newHistory.length > 0) {
        const img = new Image();
        img.src = newHistory[newHistory.length - 1];
        img.onload = () => {
          ctx.drawImage(img, 0, 0);
        };
      }
    } else {
      clearCanvas();
    }
  };

  const downloadImage = (type) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let downloadCanvas = canvas;

    if (type === 'jpg') {
      downloadCanvas = document.createElement('canvas');
      downloadCanvas.width = canvas.width;
      downloadCanvas.height = canvas.height;
      const ctx = downloadCanvas.getContext('2d');
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, downloadCanvas.width, downloadCanvas.height);
      ctx.drawImage(canvas, 0, 0);
    }

    const dataUrl = downloadCanvas.toDataURL(type === 'jpg' ? 'image/jpeg' : 'image/png');
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `signature.${type}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadTyped = (fontFamily, type) => {
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 200;
    const ctx = canvas.getContext('2d');
    
    if (type === 'jpg') {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    
    ctx.font = `48px "${fontFamily}", cursive`;
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(typedName || 'Your Name', canvas.width / 2, canvas.height / 2);

    const dataUrl = canvas.toDataURL(type === 'jpg' ? 'image/jpeg' : 'image/png');
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `signature.${type}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const typeFonts = ['Brush Script MT', 'Caveat', 'Dancing Script', 'cursive'];

  return (
    <div className="bg-white dark:bg-[#09090b] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 md:p-8 shadow-sm max-w-4xl mx-auto w-full">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4 md:mb-0">
          <i className="fa-solid fa-signature mr-2 text-indigo-600"></i>
          Signature Maker
        </h2>
        
        <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
          <button
            onClick={() => setMode('draw')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${mode === 'draw' ? 'bg-white dark:bg-gray-700 shadow-sm text-indigo-600 dark:text-indigo-400' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'}`}
          >
            <i className="fa-solid fa-pen mr-2"></i> Draw
          </button>
          <button
            onClick={() => setMode('type')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${mode === 'type' ? 'bg-white dark:bg-gray-700 shadow-sm text-indigo-600 dark:text-indigo-400' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'}`}
          >
            <i className="fa-solid fa-keyboard mr-2"></i> Type
          </button>
        </div>
      </div>

      {mode === 'draw' ? (
        <div className="space-y-6">
          <div className="flex flex-wrap gap-4 items-center justify-between bg-gray-50 dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Color:</span>
              <button onClick={() => setColor('#000000')} className={`w-8 h-8 rounded-full bg-black ring-2 ring-offset-2 dark:ring-offset-gray-900 ${color === '#000000' ? 'ring-indigo-500' : 'ring-transparent'}`}></button>
              <button onClick={() => setColor('#0000FF')} className={`w-8 h-8 rounded-full bg-blue-600 ring-2 ring-offset-2 dark:ring-offset-gray-900 ${color === '#0000FF' ? 'ring-indigo-500' : 'ring-transparent'}`}></button>
              <button onClick={() => setColor('#FF0000')} className={`w-8 h-8 rounded-full bg-red-600 ring-2 ring-offset-2 dark:ring-offset-gray-900 ${color === '#FF0000' ? 'ring-indigo-500' : 'ring-transparent'}`}></button>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Thickness:</span>
              <input 
                type="range" 
                min="1" 
                max="5" 
                value={thickness} 
                onChange={(e) => setThickness(Number(e.target.value))}
                className="w-24 md:w-32 accent-indigo-600"
              />
              <span className="text-sm text-gray-500 w-4">{thickness}</span>
            </div>
            
            <div className="flex gap-2">
              <button onClick={undo} className="px-3 py-1.5 text-sm bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg transition-colors">
                <i className="fa-solid fa-rotate-left mr-1"></i> Undo
              </button>
              <button onClick={clearCanvas} className="px-3 py-1.5 text-sm bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-700 dark:text-red-400 rounded-lg transition-colors">
                <i className="fa-solid fa-trash mr-1"></i> Clear
              </button>
            </div>
          </div>

          <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl overflow-hidden bg-white dark:bg-gray-900 cursor-crosshair touch-none">
            <canvas
              ref={canvasRef}
              width={800}
              height={300}
              className="w-full h-auto max-h-[300px] object-contain"
              style={{ touchAction: 'none' }}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseOut={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <button onClick={() => downloadImage('png')} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-medium transition-colors shadow-sm flex items-center justify-center">
              <i className="fa-solid fa-download mr-2"></i> Download PNG (Transparent)
            </button>
            <button onClick={() => downloadImage('jpg')} className="bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 px-6 py-3 rounded-xl font-medium transition-colors shadow-sm flex items-center justify-center">
              <i className="fa-solid fa-image mr-2"></i> Download JPG (White BG)
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4 items-center bg-gray-50 dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
            <div className="flex-1 w-full relative">
              <i className="fa-solid fa-keyboard absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
              <input
                type="text"
                placeholder="Type your name here..."
                value={typedName}
                onChange={(e) => setTypedName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-gray-800 dark:text-gray-100"
              />
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Color:</span>
              <button onClick={() => setColor('#000000')} className={`w-8 h-8 rounded-full bg-black ring-2 ring-offset-2 dark:ring-offset-gray-900 ${color === '#000000' ? 'ring-indigo-500' : 'ring-transparent'}`}></button>
              <button onClick={() => setColor('#0000FF')} className={`w-8 h-8 rounded-full bg-blue-600 ring-2 ring-offset-2 dark:ring-offset-gray-900 ${color === '#0000FF' ? 'ring-indigo-500' : 'ring-transparent'}`}></button>
              <button onClick={() => setColor('#FF0000')} className={`w-8 h-8 rounded-full bg-red-600 ring-2 ring-offset-2 dark:ring-offset-gray-900 ${color === '#FF0000' ? 'ring-indigo-500' : 'ring-transparent'}`}></button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {typeFonts.map((font, idx) => (
              <div key={idx} className="border border-gray-200 dark:border-gray-800 rounded-2xl p-4 flex flex-col items-center bg-white dark:bg-gray-900/50 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors">
                <div 
                  className="w-full h-32 flex items-center justify-center text-4xl overflow-hidden px-4"
                  style={{ fontFamily: `"${font}", cursive`, color: color }}
                >
                  {typedName || 'Your Name'}
                </div>
                <div className="text-xs text-gray-400 mb-3">{font}</div>
                <div className="flex gap-2 w-full">
                  <button onClick={() => downloadTyped(font, 'png')} className="flex-1 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/20 dark:hover:bg-indigo-900/40 text-indigo-700 dark:text-indigo-400 py-2 rounded-lg text-sm font-medium transition-colors">
                    PNG
                  </button>
                  <button onClick={() => downloadTyped(font, 'jpg')} className="flex-1 bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 py-2 rounded-lg text-sm font-medium transition-colors">
                    JPG
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 rounded-r-xl">
        <p className="text-sm text-yellow-800 dark:text-yellow-200 flex items-start">
          <i className="fa-solid fa-circle-info mt-1 mr-2 flex-shrink-0"></i>
          <span><strong>Note:</strong> Always use Black or Blue ink for official government and bank signatures. Red ink is usually not accepted.</span>
        </p>
      </div>
    </div>
  );
}
