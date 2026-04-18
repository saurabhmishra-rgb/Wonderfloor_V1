// app.jsx
import React, { useState, useRef, useEffect } from 'react';
import ARVisualizer from './components/ARVisualizer'; 

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
import Logo from './assets/logo.png';


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
    "USER INDUSTRY", // Added default state to the list for easy resetting
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

  // --- 2. Update demoRooms to include categories ---
  // All imported images are now included in the demo rooms
  const allDemoRooms = [
    { id: 12, name: 'Industrial Flooring', img: Industrial, category: 'Industrial Flooring' },
    { id: 4, name: 'Office Flooring', img: office02, category: 'Office Flooring' },
    { id: 7, name: 'Residential Flooring', img: residential03, category: 'Residential Flooring' },
     { id: 10, name: 'School Flooring', img: school03, category: 'School Flooring' },
      { id: 13, name: 'Sports Flooring', img: Sport, category: 'Sports Flooring' },
    { id: 11, name: 'Supermarket Flooring', img: superMarket01, category: 'Supermarket Flooring' }, 
    { id: 14, name: 'Transport Flooring', img: Transport, category: 'Transport Flooring' },
     { id: 2, name: 'Hospital Flooring', img: Hospital, category: 'Hospital Flooring' },
    { id: 15, name: 'Auditorium Flooring', img: Auditorial, category: 'Auditorium Flooring' },
    { id: 16, name: 'Hotel/ Hospitality Flooring', img: Hotel, category: 'Hotel/ Hospitality Flooring' },
  ];

  // --- 3. Filter Logic ---
  // If "USER INDUSTRY" is selected, show all. Otherwise, filter by selected category.
  const displayedRooms = selectedIndustry === 'USER INDUSTRY' 
    ? allDemoRooms 
    : allDemoRooms.filter(room => room.category === selectedIndustry);

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

  return (
    <div className="relative max-w-[1300px] mx-auto px-4 sm:px-6 py-12 font-sans text-gray-800 bg-white min-h-screen flex flex-col overflow-x-hidden">
      
      {/* Top Section */}
      <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-8 lg:gap-16 mt-16 sm:mt-20 md:mt-24 mb-16 sm:mb-24 w-full">
        
        <div className="w-full lg:w-[480px] flex flex-col gap-4 shrink-0 mt-8 lg:mt-0 lg:-mt-2">
          <img 
            src={Logo} 
            alt="Wonderfloor Logo" 
            className="w-[200px] h-auto mb-1 mx-auto lg:mx-0"
          />
          <h1 className="text-[32px] sm:text-[36px] lg:text-[42px] font-bold text-[#202938] mb-1 tracking-tight text-center lg:text-left leading-[1.15] break-words">
            See live floor transformation in your room
          </h1>

          <div className="text-[15px] sm:text-[16px] text-gray-800 space-y-1 font-normal mb-1">
            <p className="text-center lg:text-left">Upload a photo of your room</p>
          </div>
          
          <button 
            onClick={handleUploadClick}
            className="cursor-pointer bg-[#e8f442] hover:bg-[#d4e030] text-black font-bold py-3.5 px-6 rounded-[4px] text-[16px] tracking-wide transition duration-200 w-full lg:w-[280px] flex items-center justify-center gap-2 shadow-sm mt-2"
          >
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

        <div className="hidden lg:flex flex-1 w-full h-[351px] rounded-lg overflow-hidden shadow-xl select-none">
          <img 
            src={HeroImage} 
            alt="Floor Visualization Demo" 
            className="w-full h-full"
          />
        </div>
      </div>

      {/* Bottom Section - Demo Rooms Grid */}
      <div className="flex-grow">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-6 relative z-30 gap-4">
          <h3 className="text-[18px] sm:text-[20px] font-bold text-gray-400">
            Don't have a picture? Try our demo rooms instead
          </h3>
          
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
                      setIsDropdownOpen(false);
                    }}
                    className={`cursor-pointer w-full text-left px-5 py-2.5 text-[15px] transition-colors ${
                      selectedIndustry === industry 
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
        
        {/* Render dynamically filtered rooms */}
        {displayedRooms.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-10 relative z-10">
            {displayedRooms.map((room) => (
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
        ) : (
          /* Empty state when an industry has no images yet */
          <div className="w-full py-12 text-center text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <p className="text-lg">No demo rooms available for {selectedIndustry} yet.</p>
          </div>
        )}
      </div>

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