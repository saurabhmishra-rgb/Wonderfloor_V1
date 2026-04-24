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

const BACKEND_URL = 'http://127.0.0.8000';
// const BACKEND_URL = 'https://wonderfloor-backend-1.onrender.com';

const ARVisualizer = ({ closeModal, initialImage }) => {
  const mockProducts = [
    { id: 1, name: 'GDP-550406', size: '30cm x 30cm', img: floorActon, colour: 'Grey', shade: 'Dark', category: 'Tiles', materials: 'Nylon', collection: 'GDP', accordionCategory: 'Durofloor', sku: 'WF000051' },
    { id: 2, name: 'GDP-551004', size: '30cm x 30cm', img: floorHolmes, colour: 'Beige', shade: 'Light', category: 'Planks', materials: 'PET', collection: 'Classic', accordionCategory: 'Durofloor', sku: 'WF000052' },
    { id: 3, name: 'GDP-551007', size: '30cm x 30cm', img: floorCedar, colour: 'Brown', shade: 'Medium', category: 'Tiles', materials: 'Vinyl', collection: 'GDP', accordionCategory: 'Siggma', sku: 'WF000053' },
    { id: 5, name: 'GDP-552107', size: '30cm x 30cm', img: floorCalla, colour: 'Grey', shade: 'Light', category: 'Carpet', materials: 'Nylon', collection: 'Premium', accordionCategory: 'Siggma', sku: 'WF000054' },
    { id: 6, name: 'GDP-552112', size: '30cm x 30cm', img: floorTansy, colour: 'Black', shade: 'Dark', category: 'Planks', materials: 'Ceramic', collection: 'Classic', accordionCategory: 'Orbit', sku: 'WF000055' },
    { id: 7, name: 'GDP-554306', size: '30cm x 30cm', img: floorPoppy, colour: 'White', shade: 'Light', category: 'Tiles', materials: 'PET', collection: 'GDP', accordionCategory: 'Orbit', sku: 'WF000056' },
    { id: 9, name: 'GDP-555902', size: '30cm x 30cm', img: floorPoppy1, colour: 'Grey', shade: 'Medium', category: 'Carpet', materials: 'Vinyl', collection: 'Premium', accordionCategory: 'Stoneland Monza', sku: 'WF000057' },
    { id: 10, name: 'GDP-557304', size: '30cm x 30cm', img: floorPoppy2, colour: 'Beige', shade: 'Medium', category: 'Tiles', materials: 'Nylon', collection: 'Classic', accordionCategory: 'Stoneland Monza', sku: 'WF000058' },
    { id: 11, name: 'GDP-557703', size: '30cm x 30cm', img: floorPoppy3, colour: 'Brown', shade: 'Dark', category: 'Planks', materials: 'Ceramic', collection: 'Premium', accordionCategory: 'Meteor', sku: 'WF000059' },
    { id: 12, name: 'GDP-559204', size: '30cm x 30cm', img: floorPoppy4, colour: 'Black', shade: 'Dark', category: 'Carpet', materials: 'PET', collection: 'GDP', accordionCategory: 'Meteor', sku: 'WF000060' },
    { id: 13, name: 'GDP-559404', size: '30cm x 30cm', img: floorPoppy5, colour: 'White', shade: 'Light', category: 'Tiles', materials: 'Vinyl', collection: 'Classic', accordionCategory: 'Aventus', sku: 'WF000061' },
  ];

  const productCategories = ['Durofloor', 'Siggma', 'Orbit', 'Stoneland Monza', 'Meteor', 'Aventus'];

  const [selectedProduct, setSelectedProduct] = useState(mockProducts[0]);
  const [processedImage, setProcessedImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const [zoomScale, setZoomScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [floorRotation, setFloorRotation] = useState(0); 
  
  // Sidebar states
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [expandedProductCategory, setExpandedProductCategory] = useState('Durofloor'); 

  // Modal States for Product Details
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [detailsProduct, setDetailsProduct] = useState(null);

  // Favorites Tracking
  const [favoriteProducts, setFavoriteProducts] = useState([]);

  // Dropdown States
  const [isShareMenuOpen, setIsShareMenuOpen] = useState(false);
  const [isDownloadMenuOpen, setIsDownloadMenuOpen] = useState(false); 
  const [isMenuDropdownOpen, setIsMenuDropdownOpen] = useState(false); 
  
  const shareRef = useRef(null);
  const downloadRef = useRef(null);
  const menuRef = useRef(null);
  
  // Toolbar States
  const [viewMode, setViewMode] = useState('list'); 
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter Sidebar States
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [expandedFilterCategory, setExpandedFilterCategory] = useState(null); 
  const [activeFilters, setActiveFilters] = useState({}); 

  const imageContainerRef = useRef(null);

  const currentSrc = processedImage || initialImage?.previewUrl || 'https://images.unsplash.com/photo-1595844730298-b960fa25fa48?auto=format&fit=crop&w=1200&q=80';

  useEffect(() => {
    const container = imageContainerRef.current;
    if (!container) return;
    const handleWheel = (e) => {
      if (isDetailsModalOpen) return;

      e.preventDefault();
      setZoomScale(prev => {
        const next = Math.min(Math.max(1, prev - e.deltaY * 0.002), 5);
        if (next === 1) setPan({ x: 0, y: 0 });
        return next;
      });
    };
    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, [isDetailsModalOpen]);

  // Handle clicking outside Dropdowns
  useEffect(() => {
    function handleClickOutside(event) {
      if (shareRef.current && !shareRef.current.contains(event.target)) {
        setIsShareMenuOpen(false);
      }
      if (downloadRef.current && !downloadRef.current.contains(event.target)) {
        setIsDownloadMenuOpen(false);
      }
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMouseDown = (e) => { if (zoomScale > 1 && !isDetailsModalOpen) { setIsDragging(true); setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y }); } };
  const handleMouseMove = (e) => { if (isDragging && !isDetailsModalOpen) setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y }); };
  const handleMouseUpOrLeave = () => setIsDragging(false);

  const handleTouchStart = (e) => {
    if (zoomScale > 1 && !isDetailsModalOpen) {
      setIsDragging(true);
      setDragStart({ x: e.touches[0].clientX - pan.x, y: e.touches[0].clientY - pan.y });
    }
  };
  const handleTouchMove = (e) => {
    if (isDragging && !isDetailsModalOpen) {
      setPan({ x: e.touches[0].clientX - dragStart.x, y: e.touches[0].clientY - dragStart.y });
    }
  };

  const getRotatedTileBlob = async (imageSrc, angle) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        if (angle % 180 !== 0) {
          canvas.width = img.height;
          canvas.height = img.width;
        } else {
          canvas.width = img.width;
          canvas.height = img.height;
        }
        const ctx = canvas.getContext('2d');
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((angle * Math.PI) / 180);
        ctx.drawImage(img, -img.width / 2, -img.height / 2);
        canvas.toBlob(resolve, 'image/jpeg');
      };
      img.onerror = reject;
      img.src = imageSrc;
    });
  };

  const applyFloorOverlay = async (product, angle) => {
    if (!initialImage?.rawFile) return;
    setIsProcessing(true);

    try {
      const tileBlob = await getRotatedTileBlob(product.img, angle); 
      const formData = new FormData();
      formData.append('roomImage', initialImage.rawFile);
      formData.append('floorImage', tileBlob, `${product.name}_rotated.jpg`);
      const dimensionInstruction = `The flooring tiles have physical dimensions of ${product.size}. Please scale the floor pattern realistically relative to the room perspective. ${product.description || ""}`.trim();
      formData.append('instructions', dimensionInstruction);

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

  const handleTileSelection = (product) => {
    setSelectedProduct(product);
    setErrorMsg(null);
    setFloorRotation(0); 
    applyFloorOverlay(product, 0);
    setIsSidebarOpen(false); 
  };

  const handleOpenDetails = (e, product) => {
    e.stopPropagation(); 
    setDetailsProduct(product);
    setIsDetailsModalOpen(true);
  };

  const toggleFavorite = (e, productId) => {
    e.stopPropagation(); 
    setFavoriteProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId) 
        : [...prev, productId]
    );
  };

  const handleRotate = () => {
    const nextAngle = (floorRotation + 90) % 360;
    setFloorRotation(nextAngle);
    applyFloorOverlay(selectedProduct, nextAngle);
  };

  const handleReset = () => {
    setProcessedImage(null); 
    setErrorMsg(null);
    setZoomScale(1);
    setPan({ x: 0, y: 0 });
    setFloorRotation(0);
  };

  const handleShare = (platform) => {
    const shareUrl = encodeURIComponent(window.location.href);
    const shareText = encodeURIComponent("Check out my new floor design from Wonderfloor!");
    switch (platform) {
      case 'copy': navigator.clipboard.writeText(window.location.href); alert("Link copied!"); break;
      case 'facebook': window.open(`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`, '_blank'); break;
      case 'whatsapp': window.open(`https://api.whatsapp.com/send?text=${shareText} ${shareUrl}`, '_blank'); break;
      case 'pinterest': window.open(`https://pinterest.com/pin/create/button/?url=${shareUrl}&description=${shareText}`, '_blank'); break;
      case 'email': window.location.href = `mailto:?subject=Wonderfloor Design&body=${shareText} ${shareUrl}`; break;
      default: break;
    }
    setIsShareMenuOpen(false);
  };

  const handleDownload = (option) => {
    if (!currentSrc) return;
    setIsDownloadMenuOpen(false);

    try {
      if (option === 'image') {
        const link = document.createElement('a');
        link.href = currentSrc;
        const fileName = `Wonderfloor_Design_${Date.now()}.jpg`;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else if (option === 'details') {
        alert("Downloading Image & Product Details...");
      }
    } catch (error) {
      console.error("Failed to download image:", error);
      alert("There was an error downloading your image.");
    }
  };

  const filterCategories = [
    { id: 'colour', label: 'Colour', options: ['Grey', 'Beige', 'Brown', 'Black', 'White'] },
    { id: 'shade', label: 'Shade', options: ['Light', 'Medium', 'Dark'] },
    { id: 'User Industry', label: 'User Industry', options: ['Industrial Flooring', 'Office Flooring', 'Residential Flooring','School Flooring', 'Sports Flooring'] },
    { id: 'Pattern/Layout', label: 'Pattern/Layout', options: ['Harringbone'] },
    { id: 'collection/Style', label: 'Collection/Style', options: ['Wood', 'Stone'] },
  ];

  const handleToggleFilter = (categoryId, option) => {
    setActiveFilters(prev => {
      const currentSelected = prev[categoryId] || [];
      if (currentSelected.includes(option)) {
        return { ...prev, [categoryId]: currentSelected.filter(item => item !== option) };
      } else {
        return { ...prev, [categoryId]: [...currentSelected, option] };
      }
    });
  };

  const clearFilters = () => setActiveFilters({});

  // --- UPDATED SEARCH & FILTER LOGIC ---
  const filteredProducts = mockProducts.filter(prod => {
    const searchLower = searchQuery.trim().toLowerCase();
    
    // Check if the search query matches the SKU name, Accordion Category (Siggma, Durofloor, etc), Collection, or Category
    const matchesSearch = searchLower === '' || 
      prod.name.toLowerCase().includes(searchLower) ||
      (prod.accordionCategory && prod.accordionCategory.toLowerCase().includes(searchLower)) ||
      (prod.collection && prod.collection.toLowerCase().includes(searchLower)) ||
      (prod.category && prod.category.toLowerCase().includes(searchLower)) ||
      (prod.colour && prod.colour.toLowerCase().includes(searchLower));

    // Check Checkbox Filters
    const matchesFilters = Object.entries(activeFilters).every(([key, selectedValues]) => {
      if (selectedValues.length === 0) return true; 
      return selectedValues.includes(prod[key]); 
    });

    return matchesSearch && matchesFilters;
  });

  const totalActiveFiltersCount = Object.values(activeFilters).reduce((acc, curr) => acc + curr.length, 0);

  return (
    <div className="fixed inset-0 bg-[#f9fafb] flex z-50 overflow-hidden font-sans text-gray-800">

      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar (Responsive) ── */}
      <div className={`fixed md:relative bg-white border-r border-gray-200 flex flex-col shadow-xl md:shadow-sm z-30 shrink-0 h-full w-[280px] md:w-[320px] transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        
        {/* VIEW 1: FILTER MENU */}
        {isFilterMenuOpen ? (
          <div className="flex flex-col h-full bg-white absolute inset-0 z-40 animate-fade-in">
            <div className="p-4 md:p-5 flex items-center gap-3 border-b border-gray-100">
              <button onClick={() => setIsFilterMenuOpen(false)} className="text-gray-500 hover:text-black hover:bg-gray-100 p-1.5 rounded-md cursor-pointer transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
              </button>
              <h2 className="text-xl font-bold text-gray-900">Filters</h2>
            </div>

            <div className="flex-1 overflow-y-auto px-4 md:px-5 py-4">
              <p className="text-sm font-medium text-gray-800 mb-4">
                {totalActiveFiltersCount === 0 ? "No active filters" : `${totalActiveFiltersCount} active filter${totalActiveFiltersCount > 1 ? 's' : ''}`}
              </p>

              <div className="flex flex-col gap-1">
                {filterCategories.map((category) => {
                  const isExpanded = expandedFilterCategory === category.id;
                  const selectedCount = activeFilters[category.id]?.length || 0;

                  return (
                    <div key={category.id} className="flex flex-col">
                      <button 
                        onClick={() => setExpandedFilterCategory(isExpanded ? null : category.id)}
                        className={`flex justify-between items-center py-3 px-2 rounded-md transition-colors cursor-pointer ${isExpanded ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                      >
                        <span className="font-medium text-[15px] text-gray-800 flex items-center gap-2">
                          {category.label}
                          {selectedCount > 0 && (
                            <span className="bg-[#0b5e5e] text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                              {selectedCount}
                            </span>
                          )}
                        </span>
                        <svg className={`w-5 h-5 text-gray-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                      </button>

                      {isExpanded && (
                        <div className="flex flex-col gap-3 py-3 px-2 pl-4">
                          {category.options.map(option => {
                            const isChecked = activeFilters[category.id]?.includes(option) || false;
                            return (
                              <label key={option} className="flex justify-between items-center cursor-pointer group">
                                <span className="text-sm text-gray-700">{option}</span>
                                <input 
                                  type="checkbox" 
                                  checked={isChecked}
                                  onChange={() => handleToggleFilter(category.id, option)}
                                  className="w-4 h-4 rounded border-gray-300 text-[#0b5e5e] focus:ring-[#0b5e5e] cursor-pointer accent-[#0b5e5e]"
                                />
                              </label>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-4 border-t border-gray-200 bg-white flex justify-between gap-3 shrink-0">
              <button 
                onClick={clearFilters}
                className="flex-1 py-2.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Clear filters
              </button>
              <button 
                onClick={() => setIsFilterMenuOpen(false)}
                className="flex-1 py-2.5 bg-[#202938] rounded-md text-sm font-medium text-white hover:bg-black transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          
          /* VIEW 2: PRODUCT LIST (Accordion Layout) */
          <>
            <div className="p-4 md:p-5 flex justify-between items-center pb-4">
              <img
                src="https://www.wonderfloor.co.in/assets/img/logo/logo.png"
                alt="Logo"
                className="h-8 max-w-[150px] md:max-w-[180px] object-contain"
              />
              <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-gray-400 hover:text-gray-800 hover:bg-gray-100 p-1.5 rounded-md transition-colors cursor-pointer">
                 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg> 
              </button>
            </div>

            <div className="px-4 md:px-5 pb-3">
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className="w-10 h-10 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-100 transition-colors text-gray-600 shrink-0 cursor-pointer"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                </button>

                <button 
                  onClick={() => setIsFilterMenuOpen(true)}
                  className="flex-1 h-10 border border-gray-300 rounded flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors text-sm font-medium text-gray-700 cursor-pointer relative"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
                  Filters
                  {totalActiveFiltersCount > 0 && (
                    <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#f05c3f] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-[#f05c3f]"></span>
                    </span>
                  )}
                </button>

                <div className="flex border border-gray-300 rounded overflow-hidden h-10 shrink-0">
                  <button onClick={() => setViewMode('list')} className={`w-10 flex justify-center items-center transition-colors cursor-pointer ${viewMode === 'list' ? 'bg-gray-800 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
                  </button>
                  <div className="w-px bg-gray-300"></div>
                  <button onClick={() => setViewMode('grid')} className={`w-10 flex justify-center items-center transition-colors cursor-pointer ${viewMode === 'grid' ? 'bg-gray-800 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                  </button>
                </div>
              </div>

              {isSearchOpen && (
                <div className="mt-3 animate-fade-in">
                  <input
                    type="text"
                    placeholder="Search products, collections, colors..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-10 border border-gray-300 rounded px-3 text-sm focus:outline-none focus:border-[#0b5e5e] focus:ring-1 focus:ring-[#0b5e5e]"
                    autoFocus
                  />
                </div>
              )}
            </div>
            <div className="border-b border-gray-100"></div>

            {errorMsg && (
              <div className="mx-4 md:mx-5 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm break-words font-medium">
                ⚠️ {errorMsg}
              </div>
            )}

            {/* Product Rendering with Accordions */}
            <div className="flex-1 overflow-y-auto px-4 md:px-5 pb-5 pt-4 flex flex-col relative">
              
              <div className="flex-1">
                {productCategories.map(categoryName => {
                  const categoryProducts = filteredProducts.filter(p => p.accordionCategory === categoryName);
                  if (categoryProducts.length === 0) return null;

                  // --- UX IMPROVEMENT: Auto-expand the accordion if the user is currently searching ---
                  const isExpanded = (expandedProductCategory === categoryName) || (searchQuery.trim().length > 0);

                  return (
                    <div key={categoryName} className="mb-3">
                      {/* Accordion Header */}
                      <button
                        onClick={() => setExpandedProductCategory(isExpanded && searchQuery.length === 0 ? null : categoryName)}
                        className={`w-full flex justify-between items-center py-3 px-4 border rounded-lg transition-all duration-300 cursor-pointer ${
                          isExpanded ? 'bg-[#0b5e5e] border-[#0b5e5e] text-white shadow-md' : 'bg-white border-gray-200 hover:bg-gray-50 hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)]'
                        }`}
                      >
                        <span className="font-bold text-sm tracking-wide">{categoryName}</span>
                        <svg className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180 text-white' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                      </button>

                      {/* Accordion Body */}
                      {isExpanded && (
                        <div className="pt-3 pb-1">
                          {viewMode === 'list' ? (
                            <div className="flex flex-col gap-3">
                              {categoryProducts.map((prod) => {
                                const isFavorite = favoriteProducts.includes(prod.id);
                                return (
                                  <div
                                    key={prod.id}
                                    onClick={() => handleTileSelection(prod)}
                                    className={`relative flex gap-3 md:gap-4 p-2 md:p-3 border rounded-lg cursor-pointer transition-all duration-300 bg-white ${
                                      selectedProduct.id === prod.id
                                        ? 'border-[#0b5e5e] shadow-md bg-[#0b5e5e]/5 transform scale-[1.02]'
                                        : 'border-gray-200 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:-translate-y-1'
                                      }`}
                                  >
                                    {/* HEART ICON (LIST VIEW) */}
                                    <button 
                                      onClick={(e) => toggleFavorite(e, prod.id)} 
                                      className="absolute top-2 right-2 p-1 z-10 cursor-pointer"
                                    >
                                      <svg width="20" height="20" viewBox="0 0 24 24" fill={isFavorite ? "#ef4444" : "none"} stroke={isFavorite ? "#ef4444" : "#9ca3af"} strokeWidth="2" className="transition-colors hover:scale-110">
                                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                                      </svg>
                                    </button>

                                    <img src={prod.img} alt={prod.name} className="w-16 h-16 md:w-20 md:h-20 object-cover rounded shadow-sm bg-gray-100 shrink-0 border border-gray-200" />
                                    <div className="flex flex-col justify-center min-w-0 flex-1">
                                      <span className="text-[10px] md:text-[11px] text-gray-500 uppercase tracking-wide">Wonderfloor</span>
                                      <span className="font-bold text-sm text-gray-900 truncate mt-0.5 pr-6">{prod.name}</span>
                                      <span className="text-xs text-gray-500 mt-1">Size: {prod.size}</span>
                                      <button 
                                        onClick={(e) => handleOpenDetails(e, prod)}
                                        className="text-xs text-[#0b5e5e] mt-1 hover:underline text-left cursor-pointer z-10 block w-max"
                                      >
                                        More details →
                                      </button>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <div className="grid grid-cols-3 gap-2">
                              {categoryProducts.map((prod) => {
                                const isFavorite = favoriteProducts.includes(prod.id);
                                return (
                                  <div 
                                    key={prod.id}
                                    onClick={() => handleTileSelection(prod)}
                                    className={`relative aspect-square rounded overflow-hidden cursor-pointer border-2 transition-all duration-300 bg-white ${
                                      selectedProduct.id === prod.id 
                                        ? 'border-[#0b5e5e] shadow-lg transform scale-105 z-10' 
                                        : 'border-transparent hover:border-gray-200 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:scale-105'
                                      }`}
                                  >
                                    {/* HEART ICON (GRID VIEW) */}
                                    <button 
                                      onClick={(e) => toggleFavorite(e, prod.id)} 
                                      className="absolute top-1.5 right-1.5 p-1 bg-white/70 backdrop-blur-sm rounded-full z-20 cursor-pointer shadow-sm"
                                    >
                                      <svg width="14" height="14" viewBox="0 0 24 24" fill={isFavorite ? "#ef4444" : "none"} stroke={isFavorite ? "#ef4444" : "#6b7280"} strokeWidth="2" className="transition-colors hover:scale-110">
                                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                                      </svg>
                                    </button>
                                    <img src={prod.img} alt={prod.name} className="w-full h-full object-cover bg-gray-100" />
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}

                {filteredProducts.length === 0 && (
                  <div className="text-center text-gray-500 py-8 text-sm">
                    No products match your search or filters.
                  </div>
                )}
              </div>

              {viewMode === 'grid' && selectedProduct && (
                <div className="mt-auto border-t border-gray-200 pt-5 pb-2 shrink-0 bg-white sticky bottom-0">
                  <div className="flex flex-col">
                    <span className="text-[11px] text-gray-500 uppercase tracking-wide">Wonderfloor</span>
                    <span className="font-bold text-base text-gray-900 mt-1">{selectedProduct.name}</span>
                    <span className="text-sm text-gray-600 mt-2">Size: <span className="font-medium text-gray-900">{selectedProduct.size}</span></span>
                    <button 
                      onClick={(e) => handleOpenDetails(e, selectedProduct)}
                      className="text-sm text-[#0b5e5e] mt-4 flex items-center hover:underline cursor-pointer w-max"
                    >
                      More product details
                      <svg className="ml-1" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                    </button>
                  </div>
                </div>
              )}
              
            </div>
          </>
        )}
      </div>

      {/* ── Right Content Area ── */}
      <div className="flex-1 flex flex-col bg-[#e5e7eb] h-full overflow-hidden relative w-full">

       {/* Top Action Bar */}
        <div className="h-[60px] bg-white border-b border-gray-200 flex justify-between items-center px-2 md:px-4 shadow-sm z-30 shrink-0 w-full relative">
          
          <div className="flex items-center gap-1 md:gap-2 text-gray-600 hover:text-black text-sm font-medium px-2 border-r border-gray-200 pr-3 md:pr-6 h-full transition-colors">
            {/* Mobile Sidebar Toggle */}
            <button onClick={() => setIsSidebarOpen(true)} className="md:hidden p-1.5 rounded-md hover:bg-gray-100 cursor-pointer">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
            </button>
            <button onClick={closeModal} className="flex items-center gap-1 md:gap-2 px-3 py-2 rounded-md hover:bg-gray-100 hover:text-gray-900 transition-colors cursor-pointer">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              <span className="hidden sm:inline">Exit</span>
            </button>
          </div>

          <div className="flex-1 flex items-center justify-center gap-1 md:gap-2 text-sm text-gray-600 font-medium px-3 whitespace-nowrap h-full">
            <button className="flex items-center gap-1.5 px-3 py-2 rounded-md hover:bg-gray-100 hover:text-gray-900 transition-colors cursor-pointer">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 3h5v5M4 20L20 4M21 16v5h-5M15 15l6 6M4 4l5 5"></path></svg> 
              <span className="hidden lg:inline">Compare</span>
            </button>
            
           
            
            {/* SHARE DROPDOWN */}
            <div className="relative flex items-center h-full" ref={shareRef}>
              <button onClick={() => setIsShareMenuOpen(!isShareMenuOpen)} className="flex items-center gap-1.5 px-3 py-2 rounded-md hover:bg-gray-100 hover:text-gray-900 transition-colors cursor-pointer">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg> 
                <span className="hidden sm:inline">Share</span>
              </button>
              
              {isShareMenuOpen && (
                <div className="absolute top-[50px] left-1/2 -translate-x-1/2 md:translate-x-0 md:left-auto md:right-0 bg-white shadow-xl border border-gray-200 rounded-md py-2 w-[220px] z-50 flex flex-col">
                  <button onClick={() => handleShare('copy')} className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-50 text-left transition-colors cursor-pointer"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-500"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg> Copy Link</button>
                  <button onClick={() => handleShare('facebook')} className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-50 text-left transition-colors cursor-pointer"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-500"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg> Facebook</button>
                  <button onClick={() => handleShare('whatsapp')} className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-50 text-left transition-colors cursor-pointer"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-500"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg> WhatsApp</button>
                  <button onClick={() => handleShare('pinterest')} className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-50 text-left transition-colors cursor-pointer"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-500"><line x1="12" y1="22" x2="12" y2="12"></line><line x1="12" y1="2" x2="12" y2="4"></line><line x1="2" y1="12" x2="4" y2="12"></line><line x1="22" y1="12" x2="20" y2="12"></line><circle cx="12" cy="12" r="10"></circle><path d="M8 12a4 4 0 0 0 8 0"></path></svg> Pinterest</button>
                  <button onClick={() => handleShare('email')} className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-50 text-left transition-colors cursor-pointer"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-500"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg> Email</button>
                </div>
              )}
            </div>

            {/* DOWNLOAD DROPDOWN (UPDATED) */}
            <div className="relative flex items-center h-full" ref={downloadRef}>
              <button onClick={() => setIsDownloadMenuOpen(!isDownloadMenuOpen)} className="flex items-center gap-1.5 px-3 py-2 rounded-md hover:bg-gray-100 hover:text-gray-900 transition-colors cursor-pointer">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg> 
                <span className="hidden sm:inline">Download</span>
              </button>
              
              {isDownloadMenuOpen && (
                <div className="absolute top-[50px] left-1/2 -translate-x-1/2 md:translate-x-0 md:left-auto md:right-0 bg-white shadow-xl border border-gray-200 rounded-md py-2 w-[240px] z-50 flex flex-col">
                  <button onClick={() => handleDownload('image')} className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-50 text-left transition-colors cursor-pointer border-b border-gray-100">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-500"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                    Image
                  </button>
                  <button onClick={() => handleDownload('details')} className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-50 text-left transition-colors cursor-pointer">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-500"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                    Image & Product Details
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1 md:gap-2 border-l border-gray-200 pl-2 md:pl-4 h-full shrink-0">
            <a href="https://www.wonderfloor.co.in/contact-us" target="_blank" rel="noopener noreferrer" title="Contact Us | Wonderfloor">
              <button 
                className="bg-[#0b5e5e] text-white px-3 py-1.5 md:px-4 md:py-2 rounded-md text-xs md:text-sm font-medium hover:bg-[#084747] flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="hidden sm:block"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                Contact us
              </button>
            </a>

            <div className="relative flex items-center h-full" ref={menuRef}>
              <button 
                onClick={() => setIsMenuDropdownOpen(!isMenuDropdownOpen)}
                className="hidden lg:flex text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium items-center gap-1 transition-colors cursor-pointer"
              >
                Menu <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
              </button>

              {isMenuDropdownOpen && (
                <div className="absolute top-[50px] right-0 bg-white shadow-xl border border-gray-200 rounded-md py-2 w-[180px] z-50 flex flex-col">
                  <button onClick={closeModal} className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-50 text-left transition-colors cursor-pointer">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-500"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                    Change Room
                  </button>
                  <button onClick={() => { setIsMenuDropdownOpen(false); alert("Upload functionality can be wired up here!"); }} className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-50 text-left transition-colors cursor-pointer">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-500"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                    Upload
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Viewer (Image Canvas) */}
        <div 
          ref={imageContainerRef}
          className="flex-1 relative flex items-center justify-center p-2 md:px-3 md:py-4 overflow-hidden touch-none"
          onMouseDown={handleMouseDown} 
          onMouseMove={handleMouseMove} 
          onMouseUp={handleMouseUpOrLeave} 
          onMouseLeave={handleMouseUpOrLeave}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleMouseUpOrLeave}
          onTouchCancel={handleMouseUpOrLeave}
          style={{ cursor: zoomScale > 1 && !isDetailsModalOpen ? (isDragging ? 'grabbing' : 'grab') : 'zoom-in' }}
        >
          <div 
            className="relative flex flex-col bg-white shadow-xl rounded-md overflow-hidden" 
            style={{ 
              aspectRatio: '4/3', 
              maxHeight: '100%',
              maxWidth: '98%',
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoomScale})`, 
              transformOrigin: 'center center', 
              transition: isDragging ? 'none' : 'transform 0.1s ease-out' 
            }}
          >
            <div className="flex-1 relative overflow-hidden bg-gray-200">
              {isProcessing && (
                <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex flex-col justify-center items-center z-40">
                  <div className="w-10 h-10 md:w-12 md:h-12 border-4 border-[#0b5e5e]/20 border-t-[#0b5e5e] rounded-full animate-spin mb-3 md:mb-4" />
                  <p className="text-[#0b5e5e] font-bold text-sm md:text-lg">Applying {selectedProduct.name}…</p>
                </div>
              )}
              <img
                src={currentSrc} alt="Room" draggable="false"
                className="w-full h-full object-cover select-none"
              />

              <div className="absolute bottom-3 right-3 md:bottom-5 md:right-5 bg-black/40 backdrop-blur-md border border-white/10 px-3 md:px-4 py-1.5 md:py-2 rounded-full z-30 pointer-events-none flex items-center gap-1.5 shadow-lg">
                <span className="text-[10px] md:text-[11px] font-normal text-gray-200">Powered by</span>
                <span className="text-[11px] md:text-[12px] font-bold text-white tracking-wide">wonderfloor</span>
              </div>
            </div>
          </div>
        </div>

        {/* Responsive Footer bar */}
        <div className="min-h-[60px] md:h-[70px] bg-white border-t border-gray-200 px-3 md:px-6 py-2 md:py-0 shrink-0 flex flex-wrap md:flex-nowrap items-center justify-between z-20 gap-y-2">
          
          <div 
            onClick={(e) => handleOpenDetails(e, selectedProduct)}
            className="flex items-center gap-2 md:gap-3 w-full md:w-auto cursor-pointer hover:bg-gray-50 p-1.5 -ml-1.5 rounded-md transition-colors group"
          >
            <img src={selectedProduct.img} alt="Selected" className="w-8 h-8 md:w-10 md:h-10 object-cover rounded border border-gray-200" />
            <div className="flex flex-col mr-auto md:mr-0">
              <span className="font-bold text-sm md:text-base text-gray-900 leading-tight group-hover:text-[#0b5e5e] transition-colors">{selectedProduct.name}</span>
              <span className="text-[10px] md:text-xs text-gray-400">{selectedProduct.size}</span>
            </div>

            <div className="flex items-center gap-3 md:gap-6 text-xs md:text-sm text-gray-600 font-medium md:ml-6 md:border-l border-gray-200 pl-2 md:pl-6 h-full py-1">
              <button 
                onClick={(e) => { e.stopPropagation(); handleReset(); }} 
                className="flex items-center gap-1 md:gap-2 px-2 py-1.5 md:py-2 rounded-md hover:bg-gray-100 hover:text-gray-900 transition-colors cursor-pointer"
              >
                <span className="hidden sm:inline">Reset</span> 
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="md:w-4 md:h-4">
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                  <polyline points="3 3 3 8 8 8"></polyline>
                </svg>
              </button>
              
              <button 
                onClick={(e) => { e.stopPropagation(); handleRotate(); }} 
                className="flex items-center gap-1 md:gap-2 px-2 py-1.5 md:py-2 rounded-md hover:bg-gray-100 hover:text-gray-900 transition-colors cursor-pointer"
              >
                <span className="hidden sm:inline">Rotate</span> 
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="md:w-4 md:h-4">
                  <path d="M21 2v6h-6"></path>
                  <path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path>
                  <path d="M3 22v-6h6"></path>
                  <path d="M21 12a9 9 0 0 1-15 6.7L3 16"></path>
                </svg>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-end border-t border-gray-100 pt-2 md:border-none md:pt-0">
             <button className="flex items-center gap-1.5 px-3 py-2 rounded-md hover:bg-gray-100 hover:text-gray-900 transition-colors cursor-default">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              <span className="hidden sm:inline">Zoom</span> {zoomScale > 1 ? `(${zoomScale.toFixed(1)}x)` : ''}
            </button>
            <button onClick={() => { setZoomScale(1); setPan({ x: 0, y: 0 }); }} className="text-xs md:text-sm px-3 py-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer">
              Reset Zoom
            </button>

          </div>
        </div>

      </div>

      {/* ── PRODUCT DETAILS MODAL (POPUP) ── */}
      {isDetailsModalOpen && detailsProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh] overflow-hidden transform transition-all animate-fade-in-up">
            
            <div className="flex justify-between items-center p-4 sm:p-6 border-b border-gray-100 shrink-0">
              <h2 className="text-xl font-bold text-gray-900">Product Details</h2>
              <button onClick={() => setIsDetailsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer text-gray-500 hover:text-black">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>

            <div className="overflow-y-auto p-4 sm:p-6 flex flex-col flex-1">
              
              <div className="flex flex-col sm:flex-row gap-6 mb-8">
                <div className="w-full sm:w-1/2 aspect-square rounded-xl overflow-hidden border border-gray-200 bg-gray-50 shadow-sm shrink-0">
                  <img src={detailsProduct.img} alt={detailsProduct.name} className="w-full h-full object-cover" />
                </div>
                
                <div className="w-full sm:w-1/2 flex flex-col justify-start pt-2">
                  <span className="text-xs text-gray-500 uppercase tracking-widest font-semibold">Wonderfloor</span>
                  <h3 className="text-2xl font-bold text-gray-900 mt-1">{detailsProduct.name}</h3>
                  <div className="mt-4 space-y-2">
                    <p className="text-sm text-gray-600 font-medium flex items-center gap-2">
                      <span className="text-gray-400">Size:</span> 
                      <span className="text-gray-900 bg-gray-100 px-2 py-1 rounded font-semibold">{detailsProduct.size}</span>
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center justify-between cursor-default">
                  Specifications
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400 transform rotate-180"><polyline points="18 15 12 9 6 15"></polyline></svg>
                </h4>
                
                <div className="border-t border-gray-200 flex flex-col">
                  <div className="flex py-3 sm:py-4 border-b border-gray-100 items-center">
                    <span className="w-1/3 text-sm text-gray-500 font-medium">SKU</span>
                    <span className="w-2/3 text-sm font-bold text-gray-900">{detailsProduct.sku || detailsProduct.name}</span>
                  </div>
                  <div className="flex py-3 sm:py-4 border-b border-gray-100 items-center">
                    <span className="w-1/3 text-sm text-gray-500 font-medium">Collection</span>
                    <span className="w-2/3 text-sm font-bold text-gray-900">{detailsProduct.collection}</span>
                  </div>
                  <div className="flex py-3 sm:py-4 border-b border-gray-100 items-center">
                    <span className="w-1/3 text-sm text-gray-500 font-medium">Category</span>
                    <span className="w-2/3 text-sm font-bold text-gray-900">{detailsProduct.category}</span>
                  </div>
                  <div className="flex py-3 sm:py-4 border-b border-gray-100 items-center">
                    <span className="w-1/3 text-sm text-gray-500 font-medium">Colour Family</span>
                    <span className="w-2/3 text-sm font-bold text-gray-900">{detailsProduct.colour}</span>
                  </div>
                  <div className="flex py-3 sm:py-4 border-b border-gray-100 items-center">
                    <span className="w-1/3 text-sm text-gray-500 font-medium">Shade</span>
                    <span className="w-2/3 text-sm font-bold text-gray-900">{detailsProduct.shade}</span>
                  </div>
                  <div className="flex py-3 sm:py-4 border-b border-gray-100 items-center">
                    <span className="w-1/3 text-sm text-gray-500 font-medium">Material</span>
                    <span className="w-2/3 text-sm font-bold text-gray-900">{detailsProduct.materials}</span>
                  </div>
                </div>
              </div>

            </div>

            <div className="p-4 sm:p-5 border-t border-gray-200 bg-gray-50 flex flex-col sm:flex-row justify-between items-center gap-4 shrink-0">
              <button className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-[#0b5e5e] hover:underline transition-colors w-full sm:w-auto justify-center sm:justify-start cursor-pointer">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                Go to product page
              </button>
              <button 
                onClick={() => {
                   handleTileSelection(detailsProduct);
                   setIsDetailsModalOpen(false);
                }}
                className="w-full sm:w-auto bg-[#1877f2] hover:bg-[#1564cd] text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                Apply to Room
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default ARVisualizer;