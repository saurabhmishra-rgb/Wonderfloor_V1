// ARVisualization.jsx
import React, { useState, useRef, useEffect } from 'react';

// 1. IMPORT YOUR LOCAL ASSETS HERE
import floorActon from '../assets/image1.jpeg';
import floorHolmes from '../assets/image2.jpeg';
import floorCedar from '../assets/image3.jpeg';
import floorCalla from '../assets/image4.jpeg';
import floorTansy from '../assets/image5.jpeg';
import floorPoppy from '../assets/image6.jpeg';
import floorPoppy1 from '../assets/image7.jpeg';
import floorPoppy2 from '../assets/image8.jpeg';
import floorPoppy3 from '../assets/image9.jpeg';
import floorPoppy4 from '../assets/image10.jpeg';
import floorPoppy5 from '../assets/image11.jpeg';

// const BACKEND_URL = 'http://127.0.0.8000
const BACKEND_URL = 'https://wonderfloor-backend-1.onrender.com';

const ARVisualizer = ({ closeModal, initialImage }) => {
  // 2. USE THE IMPORTED VARIABLES FOR THE `img` PROPERTY
  const mockProducts = [
    { id: 1, name: 'Acton', size: '30cm x 30cm', img: floorActon },
    { id: 2, name: 'Holmes', size: '30cm x 30cm', img: floorHolmes },
    { id: 3, name: 'Cedar', size: '30cm x 30cm', img: floorCedar },
    // { id: 4, name: 'Faye', size: '6cm x 36cm', img: floorFaye },
    { id: 5, name: 'Calla', size: '30cm x 30cm', img: floorCalla },
    { id: 6, name: 'Tansy', size: '30cm x 30cm', img: floorTansy },
    { id: 7, name: 'Vintage Wood', size: '30cm x 30cm', img: floorPoppy },
    { id: 9, name: 'Urban', size: '30cm x 30cm', img: floorPoppy1 },
    { id: 10, name: 'Pearl Shine', size: '30cm x 30cm', img: floorPoppy2 },
    { id: 11, name: 'Terra Brown', size: '30cm x 30cm', img: floorPoppy3 },
    { id: 12, name: 'Poppy5', size: '30cm x 30cm', img: floorPoppy4 },
    { id: 13, name: 'Poppy6', size: '30cm x 30cm', img: floorPoppy5 },


    // { id: 8, name: 'wonderfloorImage', size: '30cm x 30cm', img: wonderfloorimage },
    // { id: 8, name: 'Alchimia', size: 'Custom Size', img: floorAlchimia, description: 'glossy white marble ceramic tile with grey veining' }
  ];

  const [selectedProduct, setSelectedProduct] = useState(mockProducts[0]);
  const [processedImage, setProcessedImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const [zoomScale, setZoomScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const imageContainerRef = useRef(null);

  useEffect(() => {
    const container = imageContainerRef.current;
    if (!container) return;
    const handleWheel = (e) => {
      e.preventDefault();
      setZoomScale(prev => {
        const next = Math.min(Math.max(1, prev - e.deltaY * 0.002), 5);
        if (next === 1) setPan({ x: 0, y: 0 });
        return next;
      });
    };
    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, []);

  const handleMouseDown = (e) => { if (zoomScale > 1) { setIsDragging(true); setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y }); } };
  const handleMouseMove = (e) => { if (isDragging) setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y }); };
  const handleMouseUpOrLeave = () => setIsDragging(false);

  // 3. NEW SIMPLIFIED FUNCTION TO GET LOCAL IMAGE AS BLOB
  const getLocalImageAsBlob = async (imageSrc) => {
    const response = await fetch(imageSrc);
    if (!response.ok) throw new Error("Failed to load local asset");
    return await response.blob();
  };

  const handleTileSelection = async (product) => {
    setSelectedProduct(product);
    setErrorMsg(null);

    if (!initialImage?.rawFile) return;

    setIsProcessing(true);
    setProcessedImage(null);

    try {
      // 4. GET THE BLOB LOCALLY (No more proxy needed!)
      const tileBlob = await getLocalImageAsBlob(product.img);

      const formData = new FormData();
      formData.append('roomImage', initialImage.rawFile);
      // Naming the file with the product name is critical, 
      // as your Python backend uses this filename to generate the prompt!
      formData.append('floorImage', tileBlob, `${product.name}.jpg`);
      // Pass the explicit tile dimension to help the AI scale the layout correctly
      const dimensionInstruction = `The flooring tiles have physical dimensions of ${product.size}. Please scale the floor pattern realistically relative to the room perspective. ${product.description || ""}`.trim();
      formData.append('instructions', dimensionInstruction);

      console.log(`Sending request to ${BACKEND_URL}/api/replace-floor...`);

      const response = await fetch(`${BACKEND_URL}/api/replace-floor`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setProcessedImage(data.imageDataUrl);
      } else {
        const msg = data.error || 'Unknown server error.';
        console.error('Server error:', msg);
        setErrorMsg(`Backend Error: ${msg}`);
      }
    } catch (err) {
      console.error('Network / processing error:', err);
      setErrorMsg(`Connection Error: ${err.message}. Is the Python server running on port 8000?`);
    } finally {
      setIsProcessing(false);
    }
  };

  const currentSrc =
    processedImage ||
    initialImage?.previewUrl ||
    'https://images.unsplash.com/photo-1595844730298-b960fa25fa48?auto=format&fit=crop&w=1200&q=80';

  return (
    <div className="fixed inset-0 bg-[#f9fafb] flex z-50 overflow-hidden font-sans text-gray-800">

      {/* ── Sidebar ── */}
      <div className="w-[320px] bg-white border-r border-gray-200 flex flex-col shadow-sm z-20 shrink-0 h-full">
        <div className="p-5 flex justify-between items-center border-b border-gray-100">
          <img
            src="https://www.wonderfloor.co.in/assets/img/logo/logo.png"
            alt="Logo"
            className="h-8 max-w-[180px] object-contain"
          />
          <button onClick={closeModal} className="text-gray-400 hover:text-red-500 transition-colors">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {errorMsg && (
          <div className="mx-5 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm break-words font-medium">
            ⚠️ {errorMsg}
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-5 pb-5 pt-4 flex flex-col gap-3">
          {mockProducts.map((prod) => (
            <div
              key={prod.id}
              onClick={() => handleTileSelection(prod)}
              className={`flex gap-4 p-3 border rounded-lg cursor-pointer transition-all ${selectedProduct.id === prod.id
                ? 'border-[#0b5e5e] shadow-sm bg-[#0b5e5e]/5'
                : 'border-gray-200 hover:bg-gray-50'
                }`}
            >
              <img
                src={prod.img}
                alt={prod.name}
                className="w-20 h-20 object-cover rounded shadow-sm bg-gray-100 shrink-0"
              />
              <div className="flex flex-col justify-center min-w-0">
                <span className="text-[11px] text-gray-500 uppercase tracking-wide">Wonderfloor</span>
                <span className="font-bold text-sm text-gray-900 truncate mt-0.5">{prod.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right Content Area ── */}
      <div className="flex-1 flex flex-col bg-[#e5e7eb] h-full overflow-hidden relative">

        {/* Top Action Bar */}
        <div className="h-[60px] bg-white border-b border-gray-200 flex justify-between items-center px-4 shadow-sm z-10 shrink-0">
          <button onClick={closeModal} className="flex items-center gap-2 text-gray-600 hover:text-black text-sm font-medium px-2 border-r border-gray-200 pr-6 h-full transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            Exit
          </button>

          <div className="flex items-center gap-6 text-sm text-gray-600 font-medium">
            <button className="flex items-center gap-2 hover:text-black transition-colors"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 3h5v5M4 20L20 4M21 16v5h-5M15 15l6 6M4 4l5 5"></path></svg> Compare</button>
            <button className="flex items-center gap-2 hover:text-black transition-colors cursor-default">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              Zoom {zoomScale > 1 ? `(${zoomScale.toFixed(1)}x)` : ''}
            </button>
            <button className="flex items-center gap-2 hover:text-black transition-colors"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg> Share</button>
            <button className="flex items-center gap-2 hover:text-black transition-colors"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg> Download</button>
          </div>

          <div className="flex items-center gap-4 border-l border-gray-200 pl-6 h-full">
            <button className="bg-[#0b5e5e] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-[#084747] flex items-center gap-2 shadow-sm transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
              Change Room
            </button>
            <button className="text-gray-600 hover:text-black text-sm font-medium flex items-center gap-1 transition-colors">
              Menu
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
            </button>
          </div>
        </div>

        {/* Main Viewer (Image Canvas) */}
        <div className="flex-1 relative flex items-center justify-center p-2 md:px-3 md:py-4 overflow-hidden">
          <div
            className="relative flex flex-col bg-white shadow-xl rounded-md overflow-hidden max-w-[98%]"
            style={{ aspectRatio: '4/3', maxHeight: '100%' }}
          >
            <div
              ref={imageContainerRef}
              className="flex-1 relative overflow-hidden bg-gray-200"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUpOrLeave}
              onMouseLeave={handleMouseUpOrLeave}
              style={{ cursor: zoomScale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'zoom-in' }}
            >
              {isProcessing && (
                <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex flex-col justify-center items-center z-40">
                  <div className="w-12 h-12 border-4 border-[#0b5e5e]/20 border-t-[#0b5e5e] rounded-full animate-spin mb-4" />
                  <p className="text-[#0b5e5e] font-bold text-lg">Applying {selectedProduct.name}…</p>
                </div>
              )}
              <img
                src={currentSrc}
                alt="Room"
                draggable="false"
                className="w-full h-full object-cover select-none"
                style={{
                  transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoomScale})`,
                  transformOrigin: 'center center',
                  transition: isDragging ? 'none' : 'transform 0.1s ease-out',
                }}
              />
            </div>
          </div>
        </div>

        {/* Footer bar */}
        <div className="h-[60px] md:h-[70px] bg-white border-t border-gray-200 px-4 md:px-6 shrink-0 flex items-center justify-between z-20">
          <div className="flex items-center gap-3">
            <img
              src={selectedProduct.img}
              alt="Selected"
              className="w-10 h-10 object-cover rounded border border-gray-200"
            />
            <div className="flex flex-col">
              <span className="font-bold text-gray-900">{selectedProduct.name}</span>
              <span className="text-xs text-gray-400">{selectedProduct.size}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {processedImage && (
              <button
                onClick={() => { setProcessedImage(null); setErrorMsg(null); }}
                className="text-xs text-red-500 hover:underline"
              >
                Reset
              </button>
            )}
            <button
              onClick={() => { setZoomScale(1); setPan({ x: 0, y: 0 }); }}
              className="text-sm text-gray-600 hover:underline"
            >
              Reset Zoom
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ARVisualizer;
