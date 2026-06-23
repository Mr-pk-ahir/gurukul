import React, { useState, useRef } from 'react';
import { useTheme } from '../../../components/theme/ThemeContext';

// TypeScript Interface
interface DarshanEntry {
  id: string;
  imageFile: File | null;
  imagePreview: string;
  description: string;
}

const DailyDarshan: React.FC = () => {
  const { theme } = useTheme(); 
  
  // Custom helper to handle true/false logic cleanly
  const isDark = theme === true; 

  const [entries, setEntries] = useState<DarshanEntry[]>([]);
  const [currentImage, setCurrentImage] = useState<File | null>(null);
  const [currentPreview, setCurrentPreview] = useState<string>('');
  const [currentDesc, setCurrentDesc] = useState<string>('');
  
  // Drag & Drop State
  const [isDragging, setIsDragging] = useState(false);

  // Lightbox Modal State
  const [activeModalImage, setActiveModalImage] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Date Header Logic ---
  const today = new Date();
  const date = today.getDate();
  const month = today.toLocaleString('default', { month: 'short' }); 
  const day = today.toLocaleString('default', { weekday: 'long' }); 
  const year = today.getFullYear();

  // --- Handlers ---
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCurrentImage(file);
      setCurrentPreview(URL.createObjectURL(file));
    }
  };

  // Drag & Drop Handlers
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      // Check if dropped file is an image
      if (file.type.startsWith('image/')) {
        setCurrentImage(file);
        setCurrentPreview(URL.createObjectURL(file));
      } else {
        alert('Please drop a valid image file!');
      }
    }
  };

  const handleSave = () => {
    if (!currentImage) {
      alert('Please upload an image first!');
      return;
    }
    
    const newEntry: DarshanEntry = {
      id: Date.now().toString(),
      imageFile: currentImage,
      imagePreview: currentPreview,
      description: currentDesc,
    };

    setEntries([...entries, newEntry]);
    setCurrentImage(null);
    setCurrentPreview('');
    setCurrentDesc('');
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDeleteSavedEntry = (idToRemove: string) => {
    setEntries(entries.filter((entry) => entry.id !== idToRemove));
  };

  const handleClearCurrent = () => {
    setCurrentImage(null);
    setCurrentPreview('');
    setCurrentDesc('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`min-h-screen p-6 md:p-10 font-sans transition-colors duration-300 ${isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-800'}`}>
      <div className="max-w-6xl mx-auto">
        
        {/* --- PREMIUM HEADER SECTION --- */}
        <div className={`flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 pb-8 border-b transition-colors duration-300 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
          <div>
            <h1 className={`text-3xl md:text-4xl font-extrabold tracking-tight transition-colors duration-300 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Daily Darshan Management
            </h1>
            <p className={`mt-2 text-sm md:text-base font-medium max-w-xl transition-colors duration-300 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
               Divine Darshan Images for Today. Upload, Save, and Manage your daily darshan images with ease.
            </p>
          </div>
          
          {/* Static Premium Date Widget */}
          <div className={`flex items-center rounded-2xl p-3 px-5 border shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${isDark ? 'bg-slate-900 border-slate-800 shadow-black/40 hover:border-slate-700' : 'bg-white border-slate-200 shadow-slate-200/50 hover:border-slate-300'}`}>
            {/* Date & Month */}
            <div className={`flex flex-col items-center justify-center pr-5 border-r transition-colors duration-300 ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
              <span className={`text-3xl font-black leading-none ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                {date < 10 ? `0${date}` : date}
              </span>
              <span className={`text-[11px] font-bold uppercase tracking-widest mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {month}
              </span>
            </div>
            {/* Day & Year */}
            <div className="flex flex-col items-start justify-center pl-5">
              <span className={`text-sm font-bold leading-tight ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                {day}
              </span>
              <span className={`text-xs font-semibold tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                {year}
              </span>
            </div>
          </div>
        </div>

        {/* --- SAVED ENTRIES LIST --- */}
        <div className="space-y-4 mb-8">
          {entries.map((entry, index) => (
            <div 
              key={entry.id} 
              className={`flex flex-col sm:flex-row items-center p-4 rounded-2xl border shadow-sm transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg gap-5 ${isDark ? 'bg-slate-900 border-slate-800 hover:border-slate-700' : 'bg-white border-slate-200 hover:border-slate-300'}`}
            >
              <div className={`w-8 h-8 flex items-center justify-center font-bold text-xs rounded-full shrink-0 transition-colors duration-300 ${isDark ? 'bg-slate-800 text-slate-500' : 'bg-slate-100 text-slate-400'}`}>
                {index + 1}
              </div>
              
              {/* Saved Image Preview (Click to view Ultra-Premium Lightbox) */}
              <div 
                onClick={() => setActiveModalImage(entry.imagePreview)}
                className={`w-28 h-16 rounded-xl border shrink-0 overflow-hidden shadow-inner cursor-pointer transition-all duration-300 transform hover:scale-105 hover:ring-2 hover:ring-blue-500/50 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200'}`}
                title="Click to view full screen"
              >
                <img src={entry.imagePreview} alt={`Darshan ${index + 1}`} className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" />
              </div>

              {/* Saved Description */}
              <div className="w-full max-w-xs group">
                <input 
                  type="text" 
                  value={entry.description || "No description provided"} 
                  readOnly 
                  className={`w-full p-2.5 rounded-xl text-sm font-medium border focus:outline-none transition-all duration-300 cursor-default ${isDark ? 'bg-slate-950 border-slate-800 text-slate-300 group-hover:border-slate-700' : 'bg-slate-50 border-slate-100 text-slate-700 group-hover:border-slate-200'}`}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 ml-auto">
                <button 
                  onClick={() => handleDeleteSavedEntry(entry.id)}
                  className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 ${isDark ? 'text-red-400 bg-red-950/30 hover:bg-red-900/60 hover:shadow-md' : 'text-red-600 bg-red-50 hover:bg-red-100 hover:shadow-sm'}`}
                >
                  Delete
                </button>
                
                <span className={`px-4 py-2.5 text-xs font-bold rounded-xl shadow-sm cursor-default transition-colors duration-300 transform hover:scale-105 active:scale-95 ${isDark ? 'bg-emerald-950/30 text-emerald-400 border border-emerald-900/30' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'}`}>
                  Saved
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* --- CURRENT ENTRY BOX --- */}
        {entries.length < 10 ? (
          <div className={`relative p-6 rounded-3xl border shadow-xl transition-all duration-500 hover:shadow-2xl flex justify-center ${isDark ? 'bg-slate-900 border-slate-800 shadow-black/50 hover:border-slate-700' : 'bg-white border-blue-100/60 shadow-blue-50/50 hover:border-blue-200'}`}>
            <div className="flex flex-col lg:flex-row items-center justify-between w-full gap-6">
              
              {/* 1. Integrated Clickable Select + Drag & Drop Box with Premium Hover Effect */}
              <div 
                onClick={() => fileInputRef.current?.click()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`w-full lg:w-32 h-24 rounded-2xl border-2 border-dashed flex items-center justify-center p-1.5 text-center cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${
                  isDragging 
                    ? (isDark ? 'border-blue-500 bg-slate-800/80 scale-95 shadow-blue-500/20' : 'border-blue-500 bg-blue-50/80 scale-95 shadow-blue-500/10')
                    : currentPreview
                      ? (isDark ? 'border-slate-700 bg-slate-950 hover:border-blue-500 shadow-inner' : 'border-slate-200 bg-white hover:border-blue-500 shadow-inner')
                      : (isDark ? 'border-slate-700 bg-slate-800/40 hover:border-blue-500 hover:bg-slate-800/80' : 'border-slate-200 bg-slate-50 hover:border-blue-500 hover:bg-slate-100/80')
                }`}
              >
                <input 
                  type="file" 
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  className="hidden"
                />

                {currentPreview ? (
                  <div className="relative w-full h-full rounded-xl overflow-hidden group/preview">
                    <img src={currentPreview} alt="Preview" className="w-full h-full object-cover transition-transform duration-500 group-hover/preview:scale-110" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/preview:opacity-100 flex items-center justify-center transition-opacity duration-300">
                      <span className="text-[10px] font-bold text-white uppercase tracking-wider">Change</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center gap-1.5 pointer-events-none">
                    <span className={`text-[10px] font-black uppercase tracking-widest transition-colors duration-300 ${
                      isDragging ? 'text-blue-500' : (isDark ? 'text-slate-400' : 'text-slate-500')
                    }`}>
                      {isDragging ? 'Drop Here' : 'Select'}
                    </span>
                    <span className={`text-[8px] font-bold tracking-wider uppercase opacity-60 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                      Image
                    </span>
                  </div>
                )}
              </div>

              {/* 2 & 3. Description Input & Buttons ALIGNED IN ONE LINE */}
              <div className="grow flex flex-col lg:flex-row items-start lg:items-end gap-4 w-full">
                
                {/* Description Input */}
                <div className="grow w-full">
                  <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1.5 transition-colors duration-300 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                     Description
                  </label>
                  <input 
                    type="text" 
                    placeholder="Enter Details..." 
                    value={currentDesc}
                    onChange={(e) => setCurrentDesc(e.target.value)}
                    className={`w-full p-3.5 rounded-xl text-sm font-medium border shadow-inner focus:outline-none focus:ring-2 transition-all duration-300 hover:shadow-md ${isDark ? 'bg-slate-950 border-slate-700 text-slate-100 focus:border-blue-500 focus:ring-blue-500/20 hover:border-slate-600' : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-500 focus:ring-blue-500/20 hover:border-slate-300'}`}
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-4 w-full lg:w-auto shrink-0 pt-2 lg:pt-0">
                  <button 
                    onClick={handleClearCurrent}
                    className={`px-8 py-3.5 text-sm font-bold rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95 border hover:shadow-md ${isDark ? 'text-slate-300 border-slate-700 hover:bg-slate-800 hover:border-slate-500' : 'text-slate-600 border-slate-200 hover:bg-slate-100 hover:border-slate-300'}`}
                  >
                    Clear
                  </button>

                  <button 
                    onClick={handleSave}
                    className={`px-10 py-3.5 text-sm font-bold tracking-wider rounded-xl shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95 hover:shadow-md ${isDark ? 'bg-blue-500 hover:bg-blue-400 text-white shadow-blue-900/30 hover:shadow-blue-500/50' : 'bg-red-600 hover:bg-red-500 text-white shadow-red-600/30 hover:shadow-red-500/50'}`}
                  >
                    Save 
                  </button>
                </div>

              </div>

            </div>
          </div>
        ) : (
          <div className={`text-center p-8 rounded-3xl border font-bold text-sm tracking-wide shadow-inner transition-colors duration-300 ${isDark ? 'bg-emerald-900/20 border-emerald-800/50 text-emerald-400' : 'bg-green-50 border-green-200 text-green-700'}`}>
             Maximum limit of 10 Darshan images reached for today!
          </div>
        )}

      </div>

      {/* --- ULTRA-PREMIUM LIGHTBOX MODAL --- */}
      {activeModalImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-xl bg-black/70 backdrop-saturate-150 transition-all duration-300 cursor-zoom-out"
          onClick={() => setActiveModalImage(null)}
        >
          <div 
            className={`relative max-w-4xl max-h-[85vh] rounded-3xl p-2 border shadow-2xl overflow-hidden transform scale-100 transition-all duration-300 cursor-default ${
              isDark ? 'bg-slate-900 border-slate-800 shadow-black/80' : 'bg-white border-slate-100 shadow-slate-400/40'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Ultra-premium Close Button */}
            <button 
              onClick={() => setActiveModalImage(null)}
              className={`absolute top-4 right-4 z-10 w-9 h-9 flex items-center justify-center rounded-full border shadow-sm text-xs font-black transition-all duration-300 transform hover:scale-110 active:scale-95 ${
                isDark ? 'bg-slate-950/80 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white' : 'bg-white/90 border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-black'
              }`}
            >
              ✕
            </button>

            {/* Modal Image Wrapper */}
            <div className="rounded-2xl overflow-hidden max-h-[82vh]">
              <img 
                src={activeModalImage} 
                alt="Darshan Preview Large" 
                className="w-full h-full object-contain max-h-[80vh] rounded-xl shadow-md"
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default DailyDarshan;