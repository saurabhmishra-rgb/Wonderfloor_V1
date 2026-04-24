// app.jsx
import React, { useState, useRef, useEffect } from 'react';
import ARVisualizer from './components/ARVisualizer';
import { io } from 'socket.io-client';
import { QRCodeCanvas } from 'qrcode.react';

// --- 1. Import all local images from your assets folder ---
import Hospital from './assets/Hospital_02.jpg';
import office02 from './assets/Office-Flooring_02.jpg';
import residential03 from './assets/Residential-Flooring_02.jpg';
import school03 from './assets/School-Flooring_02.jpg';
import superMarket01 from './assets/Super-Market-Flooring_01.jpg';
import HeroImage from './assets/hero.png';
import Sport from './assets/Sports-Flooring_01.jpg';
import Transport from './assets/Transport-Flooring_03.jpg';
import Auditorial from './assets/Auditorium-Flooring_01.jpg';
import Hotel from './assets/Hotel_Hospitality-Flooring_01.jpg';
import Industrial from './assets/Industrial-Flooring_02.jpg';
import DefaultImage from './assets/Default.jpg';
import Logo from './assets/logo.png';

// --- CONNECT TO PYTHON BACKEND ---
const socket = io('http://192.168.1.130:5000');

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRoomImage, setSelectedRoomImage] = useState(null);

  // --- QR Code & Session State ---
  const [showQR, setShowQR] = useState(false);
  const [sessionId, setSessionId] = useState('');

  const fileInputRef = useRef(null);
  const dropdownRef = useRef(null);
  const productDropdownRef = useRef(null);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedIndustry, setSelectedIndustry] = useState('ALL INDUSTRY');

  const [isProductDropdownOpen, setIsProductDropdownOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState('FLOORING PRODUCTS');

  // --- NEW: Lock body scroll when modals are open to make mobile perfect ---
  useEffect(() => {
    if (isModalOpen || showQR) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen, showQR]);

  // --- Real-time Mobile Sync Logic ---
  useEffect(() => {
    socket.on('image_uploaded_from_mobile', async (base64Data) => {
      console.log("Image received from mobile! Processing...");

      try {
        const res = await fetch(base64Data);
        const blob = await res.blob();
        const file = new File([blob], "mobile_upload.jpg", { type: "image/jpeg" });

        setSelectedRoomImage({ previewUrl: base64Data, isDemo: false, rawFile: file });
        setShowQR(false);
        setIsModalOpen(true);
        console.log("Visualizer opened successfully!");
      } catch (error) {
        console.error("Failed to process the mobile image:", error);
        alert("Received the image, but it was too large or corrupted to display.");
      }
    });

    return () => {
      socket.off('image_uploaded_from_mobile');
    };
  }, []);

  const handleGenerateQR = () => {
    const newSessionId = Math.random().toString(36).substring(2, 10);
    setSessionId(newSessionId);
    setShowQR(true);
    socket.emit('join_session', newSessionId);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (productDropdownRef.current && !productDropdownRef.current.contains(event.target)) {
        setIsProductDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef, productDropdownRef]);

  const industries = [
    "ALL INDUSTRY",
    "Industrial Flooring",
    "Office Flooring",
    "Residential Flooring",
    "School Flooring",
    "Sports Flooring",
    "Supermarket Flooring",
    "Transport Flooring",
    "Hospital Flooring",
    "Auditorium Flooring",
    "Hotel/ Hospitality Flooring",
    "Luxury Vinyl Tile"
  ];

  const flooringProducts = [
    "FLOORING PRODUCTS",
    "Antique",
    "Adventus",
    "Braavo",
    "Durofloor",
    "Duratek",
    "D'ZINER",
    "Galaxxy",
    "GDP",
    "Hi-Tech",
    "Krayons",
    "Luxuria",
    "Matrixx",
    "Meteor",
    "Ornate",
    "Orbit",
    "Oriion",
    "Rangolie",
    "Rhythm",
    "Robust",
    "Siggma",
    "Stoneland Monza",
    "Traction / Safety",
    "Trendo wood",
    "Trendo Chips",
    "Uttsav",
    "Wallspro Plus"
  ];

  const allDemoRooms = [
    { id: 'ind-duro', name: 'Industrial Flooring Option 1', img: Industrial, category: 'Industrial Flooring', product: ['Durofloor', 'Antique'] },
    { id: 'ind-sig', name: 'Industrial Flooring Option 2', img: DefaultImage, category: 'Industrial Flooring', product: 'Siggma' },
    { id: 'ind-sig', name: 'Industrial Flooring Option 3', img: DefaultImage, category: 'Industrial Flooring', product: 'Siggma' },
    { id: 'ind-sig', name: 'Industrial Flooring Option 4', img: DefaultImage, category: 'Industrial Flooring', product: 'Siggma' },

    { id: 4, name: 'Office Flooring Option 1', img: office02, category: 'Office Flooring', product: ['Siggma', 'Trendo wood', 'Ornate', 'Antique', 'Hi-Tech', 'Trendo Chips', 'Stoneland Monza', 'Adventus'] },
    { id: 41, name: 'Office Flooring Option 2', img: DefaultImage, category: 'Office Flooring', product: ['Siggma', 'Trendo wood', 'Ornate', 'Antique', 'Hi-Tech', 'Trendo Chips', 'Stoneland Monza', 'Adventus'] },
    { id: 42, name: 'Office Flooring Option 3', img: DefaultImage, category: 'Office Flooring', product: ['Siggma', 'Trendo wood', 'Ornate', 'Antique', 'Hi-Tech', 'Trendo Chips', 'Stoneland Monza', 'Adventus'] },
    { id: 43, name: 'Office Flooring Option 4', img: DefaultImage, category: 'Office Flooring', product: ['Siggma', 'Trendo wood', 'Ornate', 'Antique', 'Hi-Tech', 'Trendo Chips', 'Stoneland Monza', 'Adventus'] },

    { id: 7, name: 'Residential Flooring Option 1', img: residential03, category: 'Residential Flooring', product: ['Trendo wood', 'Ornate', 'Duratek', 'Galaxxy', 'Luxuria', 'Antique', 'GDP', 'Hi-Tech', 'Uttsav', 'Oriion', 'Rangolie',] },
    { id: 122, name: 'Residential Flooring Option 2', img: DefaultImage, category: 'Residential Flooring', product: ['Trendo wood', 'Ornate', 'Duratek', 'Galaxxy', 'Luxuria', 'Antique', 'GDP', 'Hi-Tech', 'Uttsav', 'Oriion', 'Rangolie',] },
    { id: 122, name: 'Residential Flooring Option 3', img: DefaultImage, category: 'Residential Flooring', product: ['Trendo wood', 'Ornate', 'Duratek', 'Galaxxy', 'Luxuria', 'Antique', 'GDP', 'Hi-Tech', 'Uttsav', 'Oriion', 'Rangolie',] },
    { id: 122, name: 'Residential Flooring Option 4', img: DefaultImage, category: 'Residential Flooring', product: ['Trendo wood', 'Ornate', 'Duratek', 'Galaxxy', 'Luxuria', 'Antique', 'GDP', 'Hi-Tech', 'Uttsav', 'Oriion', 'Rangolie',] },

    { id: 10, name: 'School Flooring Option 1', img: school03, category: 'School Flooring', product: ['Krayons', 'Rhythm', 'Trendo Chips'] },
    { id: 123, name: 'School Flooring Option 2', img: DefaultImage, category: 'School Flooring', product: ['Krayons', 'Rhythm', 'Trendo Chips'] },
    { id: 123, name: 'School Flooring Option 3', img: DefaultImage, category: 'School Flooring', product: ['Krayons', 'Rhythm', 'Trendo Chips'] },
    { id: 123, name: 'School Flooring Option 4', img: DefaultImage, category: 'School Flooring', product: ['Krayons', 'Rhythm', 'Trendo Chips'] },

    { id: 13, name: 'Sports Flooring Option 1', img: Sport, category: 'Sports Flooring', product: ['Ornate', 'Braavo'] },
    { id: 124, name: 'Sports Flooring Option 2', img: DefaultImage, category: 'Sports Flooring', product: ['Ornate', 'Braavo'] },
    { id: 124, name: 'Sports Flooring Option 3', img: DefaultImage, category: 'Sports Flooring', product: ['Ornate', 'Braavo'] },
    { id: 124, name: 'Sports Flooring Option 4', img: DefaultImage, category: 'Sports Flooring', product: ['Ornate', 'Braavo'] },

    { id: 11, name: 'Supermarket Flooring Option 1', img: superMarket01, category: 'Supermarket Flooring', product: ['Durofloor', 'Siggma', 'Timberland Exotica 2mm', 'Trendo wood', 'Ornate', 'Trendo Chips', 'Oriion'] },
    { id: 125, name: 'Supermarket Flooring Option 2', img: DefaultImage, category: 'Supermarket Flooring', product: ['Durofloor', 'Siggma', 'Timberland Exotica 2mm', 'Trendo wood', 'Ornate', 'Trendo Chips', 'Oriion'] },
    { id: 125, name: 'Supermarket Flooring Option 3', img: DefaultImage, category: 'Supermarket Flooring', product: ['Durofloor', 'Siggma', 'Timberland Exotica 2mm', 'Trendo wood', 'Ornate', 'Trendo Chips', 'Oriion'] },
    { id: 125, name: 'Supermarket Flooring Option 4', img: DefaultImage, category: 'Supermarket Flooring', product: ['Durofloor', 'Siggma', 'Timberland Exotica 2mm', 'Trendo wood', 'Ornate', 'Trendo Chips', 'Oriion'] },

    { id: 14, name: 'Transport Flooring Option 1', img: Transport, category: 'Transport Flooring', product: ['Traction / Safety', 'Matrixx (Export)', 'D’ziner',] },
    { id: 126, name: 'Transport Flooring Option 2', img: DefaultImage, category: 'Transport Flooring', product: ['Traction / Safety', 'Matrixx (Export)', 'D’ziner',] },
    { id: 126, name: 'Transport Flooring Option 3', img: DefaultImage, category: 'Transport Flooring', product: ['Traction / Safety', 'Matrixx (Export)', 'D’ziner',] },
    { id: 126, name: 'Transport Flooring Option 4', img: DefaultImage, category: 'Transport Flooring', product: ['Traction / Safety', 'Matrixx (Export)', 'D’ziner',] },


    { id: 2, name: 'Hospital Flooring Option 1', img: Hospital, category: 'Hospital Flooring', product: ['Siggma', 'Orbit', 'Trendo Chips', 'Wallspro Plus', 'Adventus'] },
    { id: 127, name: 'Hospital Flooring Option 2', img: DefaultImage, category: 'Hospital Flooring', product: ['Siggma', 'Orbit', 'Trendo Chips', 'Wallspro Plus', 'Adventus'] },
    { id: 127, name: 'Hospital Flooring Option 3', img: DefaultImage, category: 'Hospital Flooring', product: ['Siggma', 'Orbit', 'Trendo Chips', 'Wallspro Plus', 'Adventus'] },
    { id: 127, name: 'Hospital Flooring Option 4', img: DefaultImage, category: 'Hospital Flooring', product: ['Siggma', 'Orbit', 'Trendo Chips', 'Wallspro Plus', 'Adventus'] },


    { id: 15, name: 'Auditorium Flooring Option 1', img: Auditorial, category: 'Auditorium Flooring', product: ['Timberland Exotica 2mm', 'Trendo wood', 'Braavo', 'Stoneland Monza', 'Timberland Herringbone 2mm'] },
    { id: 128, name: 'Auditorium Flooring Option 2', img: DefaultImage, category: 'Auditorium Flooring', product: ['Timberland Exotica 2mm', 'Trendo wood', 'Braavo', 'Stoneland Monza', 'Timberland Herringbone 2mm'] },
    { id: 128, name: 'Auditorium Flooring Option 3', img: DefaultImage, category: 'Auditorium Flooring', product: ['Timberland Exotica 2mm', 'Trendo wood', 'Braavo', 'Stoneland Monza', 'Timberland Herringbone 2mm'] },
    { id: 128, name: 'Auditorium Flooring Option 4', img: DefaultImage, category: 'Auditorium Flooring', product: ['Timberland Exotica 2mm', 'Trendo wood', 'Braavo', 'Stoneland Monza', 'Timberland Herringbone 2mm'] },


    { id: 129, name: 'Hotel Flooring Option 1', img: Hotel, category: 'Hotel/ Hospitality Flooring', product: ['Timberland Exotica 2mm', 'Trendo wood', 'Ornate', 'Braavo', 'Timberworld 1.5 mm', 'Stoneland Monza', 'Meteor', 'Timberland Herringbone 2mm', 'Grandeure Premium Luxury Planks 2mm'] },          
    { id: 130, name: 'Hotel Flooring Option 2', img: DefaultImage, category: 'Hotel/ Hospitality Flooring', product: ['Timberland Exotica 2mm', 'Trendo wood', 'Ornate', 'Braavo', 'Timberworld 1.5 mm', 'Stoneland Monza', 'Meteor', 'Timberland Herringbone 2mm', 'Grandeure Premium Luxury Planks 2mm'] },
    { id: 130, name: 'Hotel Flooring Option 3', img: DefaultImage, category: 'Hotel/ Hospitality Flooring', product: ['Timberland Exotica 2mm', 'Trendo wood', 'Ornate', 'Braavo', 'Timberworld 1.5 mm', 'Stoneland Monza', 'Meteor', 'Timberland Herringbone 2mm', 'Grandeure Premium Luxury Planks 2mm'] },
    { id: 130, name: 'Hotel Flooring Option 4', img: DefaultImage, category: 'Hotel/ Hospitality Flooring', product: ['Timberland Exotica 2mm', 'Trendo wood', 'Ornate', 'Braavo', 'Timberworld 1.5 mm', 'Stoneland Monza', 'Meteor', 'Timberland Herringbone 2mm', 'Grandeure Premium Luxury Planks 2mm'] },
  ];

  const handleUploadClick = () => fileInputRef.current.click();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedRoomImage({ previewUrl: URL.createObjectURL(file), isDemo: false, rawFile: file });
      setIsModalOpen(true);
    }
  };

  const handleDemoRoomClick = async (imgUrl) => {
    try {
      const response = await fetch(imgUrl);
      const blob = await response.blob();
      const file = new File([blob], "demo_room.jpg", { type: "image/jpeg" });

      setSelectedRoomImage({ previewUrl: imgUrl, isDemo: true, rawFile: file });
      setIsModalOpen(true);
    } catch (error) {
      console.error("Failed to load demo image:", error);
      alert("Could not load the demo room. Check if the image path is correct.");
    }
  };

  const isDefaultView = selectedIndustry === 'ALL INDUSTRY' && selectedProduct === 'FLOORING PRODUCTS';

  const displayedRooms = allDemoRooms.filter(room => {
    if (selectedProduct !== 'FLOORING PRODUCTS') {
      if (Array.isArray(room.product)) {
        return room.product.includes(selectedProduct);
      }
      return room.product === selectedProduct;
    }
    return room.category === selectedIndustry;
  });

  const uniqueCategories = [];
  const categoryNames = new Set();
  for (const room of allDemoRooms) {
    if (!categoryNames.has(room.category)) {
      categoryNames.add(room.category);
      uniqueCategories.push(room);
    }
  }

  return (
    // --- UPDATED: Global Wrapper strictly preventing any horizontal scrolling ---
    <div className="w-full min-h-screen mt-[-5%] bg-white  overflow-x-hidden">

      {/* --- Main Content Container --- */}
      <div className="relative inset-0 w-full max-w-[1300px] mx-auto px-4 sm:px-6 py-15 font-sans text-gray-800 flex flex-col">

        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-8 lg:gap-16 mt-16 sm:mt-20 md:mt-24 mb-16 sm:mb-24 w-full">
          <div className="w-full lg:w-[480px] flex flex-col gap-4 shrink-0 mt-8 lg:mt-0 lg:-mt-2">
            <img src={Logo} alt="Wonderfloor Logo" className="w-[200px] h-auto mb-1 mx-auto lg:mx-0" />
            <h1 className="text-[32px] sm:text-[36px] lg:text-[42px] font-bold text-[#202938] mb-1 tracking-tight text-center lg:text-left leading-[1.15] break-words">
              See live floor transformation in your room
            </h1>

            <div className="text-[15px] sm:text-[16px] text-gray-800 space-y-1 font-normal mb-1">
              <p className="text-center lg:text-left">Upload a photo of your room</p>
            </div>

            <button
              onClick={handleUploadClick}
              className="cursor-pointer bg-[#f05c3f] hover:bg-[#f05c4f] text-[#ffffff] font-bold py-3.5 px-6 rounded-[4px] text-[16px] tracking-wide transition duration-200 w-full lg:w-[280px] flex items-center justify-center gap-2 shadow-sm mt-2"
            >
              Upload
            </button>

            <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileChange} />

            {/* QR CODE BUTTON */}
            <button
              onClick={handleGenerateQR}
              className="cursor-pointer bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 py-3.5 px-6 rounded-[4px] text-[14px] transition duration-200 w-full lg:w-[280px] flex items-center justify-center gap-2 mt-1 shadow-sm"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
              Or scan a QR code to upload
            </button>

            {showQR && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity">
                <div className="bg-white p-8 rounded-2xl shadow-2xl flex flex-col items-center relative max-w-sm w-full mx-4 border-t-4 border-[#f05c3f] animate-fade-in-up">

                  <button
                    onClick={() => setShowQR(false)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 transition-colors cursor-pointer"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                  </button>

                  <h3 className="text-xl font-bold text-[#202938] mb-2">Scan to Upload</h3>
                  <p className="text-sm text-gray-500 mb-6 text-center leading-relaxed">
                    Use your phone's camera to scan this QR code and snap a photo of your room.
                  </p>

                  <div className="p-3 border-4 border-gray-100 rounded-xl bg-white mb-6 shadow-sm">
                    <QRCodeCanvas
                      value={`http://192.168.1.130:5173/mobile-upload?session=${sessionId}`}
                      size={180}
                    />
                  </div>

                  <div className="flex items-center gap-2 text-[#f05c3f]">
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="text-sm font-bold tracking-wide">Waiting for image...</p>
                  </div>
                </div>
              </div>
            )}

          </div>

          <div className="hidden lg:flex flex-1 w-full h-[421px] rounded-lg overflow-hidden shadow-xl select-none">
            <img src={HeroImage} alt="Floor Visualization Demo" className="w-full h-full" />
          </div>
        </div>

        <div className="flex-grow">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-6 relative z-30 gap-4">
            <h3 className="text-[18px] sm:text-[20px] font-bold text-gray-400">
              Don't have a picture? Try our demo rooms instead
            </h3>

            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">

              {/* 1. Flooring Products Dropdown */}
              <div className="relative w-full sm:w-auto" ref={productDropdownRef}>
                <button
                  onClick={() => setIsProductDropdownOpen(!isProductDropdownOpen)}
                  className="cursor-pointer flex items-center justify-between sm:justify-center gap-2 bg-[#6a6a6a] text-white px-5 py-3 sm:py-2.5 rounded text-[13px] font-bold tracking-wide transition-colors hover:bg-gray-600 uppercase w-full sm:w-auto"
                >
                  {selectedProduct}
                  <svg className={`w-4 h-4 transition-transform ${isProductDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>

                {isProductDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-full sm:w-64 bg-white shadow-[0_10px_40px_rgba(0,0,0,0.15)] border-t-[3px] border-[#fc6c3f] py-2 z-50 rounded-b max-h-[300px] overflow-y-auto">
                    {flooringProducts.map((product, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setSelectedProduct(product);
                          setSelectedIndustry('ALL INDUSTRY');
                          setIsProductDropdownOpen(false);
                        }}
                        className={`cursor-pointer w-full text-left px-5 py-2.5 text-[15px] transition-colors ${selectedProduct === product
                          ? 'text-[#fc6c3f] bg-gray-50'
                          : 'text-gray-600 hover:text-[#fc6c3f] hover:bg-gray-50'
                          }`}
                      >
                        {product}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* 2. User Industry Dropdown */}
              <div className="relative w-full sm:w-auto" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="cursor-pointer flex items-center justify-between sm:justify-center gap-2 bg-[#6a6a6a] text-white px-5 py-3 sm:py-2.5 rounded text-[13px] font-bold tracking-wide transition-colors hover:bg-gray-600 uppercase w-full sm:w-auto"
                >
                  {selectedIndustry}
                  <svg className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-full sm:w-64 bg-white shadow-[0_10px_40px_rgba(0,0,0,0.15)] border-t-[3px] border-[#fc6c3f] py-2 z-50 rounded-b max-h-[300px] overflow-y-auto">
                    {industries.map((industry, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setSelectedIndustry(industry);
                          setSelectedProduct('FLOORING PRODUCTS');
                          setIsDropdownOpen(false);
                        }}
                        className={`cursor-pointer w-full text-left px-5 py-2.5 text-[15px] transition-colors ${selectedIndustry === industry
                          ? 'text-[#fc6c3f] bg-gray-50'
                          : 'text-gray-600 hover:text-[#fc6c3f] hover:bg-gray-50'
                          }`}
                      >
                        {industry}
                      </button>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>

          {isDefaultView ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-10 relative z-10">
              {uniqueCategories.map((cat) => (
                <div key={`cat-${cat.id}`} className="cursor-pointer group flex flex-col gap-3" onClick={() => setSelectedIndustry(cat.category)}>
                  <div className="overflow-hidden rounded-none bg-gray-100">
                    <img src={cat.img} alt={cat.category} className="w-full h-[200px] object-cover hover:opacity-90 transition-opacity duration-200" />
                  </div>
                  <p className="text-[12px] text-[#0b5c58] font-bold uppercase tracking-wider px-1 group-hover:text-[#f05c3f] transition-colors">
                    {cat.category}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div>
              <button
                onClick={() => {
                  setSelectedIndustry('ALL INDUSTRY');
                  setSelectedProduct('FLOORING PRODUCTS');
                }}
                className="mb-6 flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-[#f05c3f] transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                Go Back
              </button>

              {displayedRooms.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-10 relative z-10">
                  {displayedRooms.map((room) => (
                    <div key={room.id} className="cursor-pointer group flex flex-col gap-3" onClick={() => handleDemoRoomClick(room.img)}>
                      <div className="overflow-hidden rounded-none bg-gray-100">
                        <img src={room.img} alt={room.name} className="w-full h-[200px] object-cover hover:opacity-90 transition-opacity duration-200" />
                      </div>
                      <p className="text-[12px] text-[#0b5c58] font-bold uppercase tracking-wider px-1 group-hover:text-[#f05c3f] transition-colors">
                        {room.name}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="w-full py-12 text-center text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                  <p className="text-lg">
                    No demo rooms available for {selectedProduct !== 'FLOORING PRODUCTS' ? selectedProduct : selectedIndustry} yet.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ARVisualizer placed safely outside the width-restricted container */}
      {isModalOpen && (
        <ARVisualizer closeModal={() => setIsModalOpen(false)} initialImage={selectedRoomImage} />
      )}

    </div>
  );
}

export default App;