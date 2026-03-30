import React, { useState, useRef, useEffect } from 'react';
import ARVisualizer from './components/ARVisualizer'; 

// --- 1. Import all local images from your assets folder ---
import Hospital from './assets/Hospital_02.jpg';
import office02 from './assets/Office-Flooring_02.jpg';
import residential03 from './assets/Residential-Flooring_03.jpg';
import school03 from './assets/School-Flooring_03.jpg';
import superMarket01 from './assets/Super-Market-Flooring_01.jpg';
import HeroImage from './assets/hero.png'; // ← Add this import for the Hero image


function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRoomImage, setSelectedRoomImage] = useState(null);
  
  const fileInputRef = useRef(null);
  const dropdownRef = useRef(null);

  // --- Dropdown State ---
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedIndustry, setSelectedIndustry] = useState('USER INDUSTRY');

  // --- Click Outside to Close Logic ---
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  // --- Industry Data ---
  const industries = [
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

  // --- 2. Update demoRooms to use the imported local images ---
  const demoRooms = [
    { id: 2, name: 'Hospital', img: Hospital },
    { id: 4, name: 'Office Space', img: office02 },
    { id: 7, name: 'Residential', img: residential03 },
    { id: 10, name: 'School-Flooring', img: school03 },
    { id: 11, name: 'Supermarket', img: superMarket01 },
  ];

  const handleUploadClick = () => fileInputRef.current.click();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedRoomImage({ previewUrl: URL.createObjectURL(file), isDemo: false, rawFile: file });
      setIsModalOpen(true);
    }
  };

  // --- 3. Updated Demo Click Handler ---
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

  return (
    <div className="relative max-w-[1300px] mx-auto px-4 sm:px-6 py-12 font-sans text-gray-800 bg-white min-h-screen flex flex-col overflow-x-hidden">
      
      {/* Top Section: Responsive Stack to Side-by-Side */}
      <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-8 lg:gap-16 mt-16 sm:mt-20 md:mt-24 mb-16 sm:mb-24 w-full">
        
        {/* Left Column - Heading & Controls */}
        <div className="w-full lg:w-[480px] flex flex-col gap-6 shrink-0 mt-8 lg:mt-0 lg:-mt-2">
          
          <h1 className="text-[32px] sm:text-[36px] lg:text-[42px] font-bold text-[#202938] mb-2 tracking-tight text-center lg:text-left leading-[1.2] break-words">
            See live floor transformation in your room
          </h1>

          <ul className="text-[15px] sm:text-[16px] text-gray-600 space-y-4 font-medium mb-2">
            <li className="flex items-center gap-3 justify-center lg:justify-start">
              <svg className="w-6 h-6 text-gray-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              Upload a picture of your room
            </li>
            <li className="flex items-center gap-3 justify-center lg:justify-start">
              <svg className="w-6 h-6 text-gray-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
              Try our products in your room
            </li>
          </ul>
          
          {/* Primary Upload Button */}
          <button 
            onClick={handleUploadClick}
            className="cursor-pointer bg-[#0c5bc6] hover:bg-[#09479e] text-white font-bold py-3.5 px-6 rounded-[8px] border-[2.5px] border-[#4b8cf3] text-[17px] tracking-wide transition duration-200 w-full lg:w-[340px] flex items-center justify-center gap-2 shadow-sm"
          >
            <svg className="w-[26px] h-[26px]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M4 4h3v2H5v13h14V9h-2V7h3a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z" />
              <path d="M12 20a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11zm0-2a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM9 2h2v3H9V2zM7 4V2h2v2H7z" />
            </svg>
            Upload
          </button>
          
          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            ref={fileInputRef}
            onChange={handleFileChange}
          />
        </div>

        {/* Right Column - Hero Image (REPLACED) */}
        <div className="hidden lg:flex flex-1 w-full h-[400px] rounded-lg overflow-hidden shadow-xl select-none">
          <img 
            src={HeroImage} 
            alt="Floor Visualization Demo" 
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Bottom Section - Demo Rooms Grid */}
      <div className="flex-grow">
        
        {/* === HEADER & DROPDOWN CONTAINER === */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-6 relative z-30 gap-4">
          
          <h3 className="text-[18px] sm:text-[20px] font-bold text-gray-400">
            Don't have a picture? Try our demo rooms instead
          </h3>
          
          {/* USER INDUSTRY DROPDOWN */}
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

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-full sm:w-64 bg-white shadow-[0_10px_40px_rgba(0,0,0,0.15)] border-t-[3px] border-[#fc6c3f] py-2 z-50 rounded-b max-h-[300px] overflow-y-auto">
                {industries.map((industry, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSelectedIndustry(industry);
                      setIsDropdownOpen(false);
                    }}
                    className={`cursor-pointer w-full text-left px-5 py-2.5 text-[15px] transition-colors ${
                      selectedIndustry === industry || (selectedIndustry === 'USER INDUSTRY' && index === 0)
                        ? 'text-[#fc6c3f]' 
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
        
        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-10 relative z-10">
          {demoRooms.map((room) => (
            <div 
              key={room.id} 
              className="cursor-pointer group flex flex-col gap-3"
              onClick={() => handleDemoRoomClick(room.img)}
            >
              <div className="overflow-hidden rounded-none bg-gray-100">
                <img 
                  src={room.img} 
                  alt={room.name} 
                  className="w-full h-[200px] object-cover hover:opacity-90 transition-opacity duration-200" 
                />
              </div>
              <p className="text-[12px] text-[#0b5c58] font-bold uppercase tracking-wider px-1">
                {room.name}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ================= FOOTER LOGO ================= */}
      <div className="w-full flex justify-center items-center py-10 mt-auto">
        <img 
          src="https://www.wonderfloor.co.in/assets/img/logo/logo.png" 
          alt="Wonderfloor Logo" 
          className="h-10 object-contain opacity-90 hover:opacity-100 transition-opacity"
        />
      </div>

      {/* AR Modal Overlay */}
      {isModalOpen && (
        <ARVisualizer 
           closeModal={() => setIsModalOpen(false)} 
           initialImage={selectedRoomImage} 
        />
      )}
    </div>
  );
}

export default App;