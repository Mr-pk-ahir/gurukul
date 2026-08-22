import React, { useState, useEffect, useRef } from 'react';
import { Upload, Save, ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';
import DatePicker from '../../../components/common/Calendar';
import { useTheme } from '../../../components/theme/ThemeContext';

interface ActivityData {
  id: string;
  image: string;
  description: string;
  date: string; // Format: YYYY-MM-DD
  timestamp: number;
}

const Activities: React.FC = () => {
  const { theme } = useTheme();

  const [dataList, setDataList] = useState<ActivityData[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [description, setDescription] = useState('');

  const [headerDate, setHeaderDate] = useState(new Date().toISOString().split('T')[0]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ActivityData | null>(null);

  // Description states for Modal
  const [isDescExpanded, setIsDescExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  // 1 Year (365 Days) in milliseconds
  const oneYearInMs = 365 * 24 * 60 * 60 * 1000;

  useEffect(() => {
    const savedData = localStorage.getItem('activitiesData');
    if (savedData) {
      const parsedData: ActivityData[] = JSON.parse(savedData);
      const currentTime = new Date().getTime();

      // Filter out data older than 1 year
      const filteredData = parsedData.filter(item => currentTime - item.timestamp <= oneYearInMs);
      setDataList(filteredData);

      // Update storage if old data was removed
      if (filteredData.length !== parsedData.length) {
        localStorage.setItem('activitiesData', JSON.stringify(filteredData));
      }
    }
  }, [oneYearInMs]);

  // Get currently selected month (Format: YYYY-MM)
  const selectedMonthString = headerDate.substring(0, 7);

  // Filter data for the selected month only
  const displayData = dataList.filter(item => item.date.substring(0, 7) === selectedMonthString);

  // Format Month for UI (e.g., "August 2026")
  const formattedMonthName = new Date(headerDate).toLocaleString('default', { month: 'long', year: 'numeric' });

  // Description splitting for Modal
  const lines = selectedItem?.description ? selectedItem.description.trim().split('\n') : [];
  const firstLine = lines[0] || "";
  const hasMultipleLines = lines.length > 1;

  useEffect(() => {
    const checkOverflow = () => {
      if (textRef.current && !isDescExpanded) {
        setIsOverflowing(textRef.current.scrollWidth > textRef.current.clientWidth);
      }
    };

    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, [selectedItem, isDescExpanded, isModalOpen]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setSelectedImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!selectedImage) {
      alert('Please select an image first!');
      return;
    }

    const newData: ActivityData = {
      id: Date.now().toString(),
      image: selectedImage,
      description: description.trim(),
      date: headerDate,
      timestamp: new Date().getTime(),
    };

    const updatedList = [newData, ...dataList];
    setDataList(updatedList);

    try {
      localStorage.setItem('activitiesData', JSON.stringify(updatedList));
    } catch (error) {
      console.error("Storage full error caught:", error);
    }

    setSelectedImage(null);
    setDescription('');

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const openModal = (item: ActivityData) => {
    setSelectedItem(item);
    setIsDescExpanded(false);
    setIsOverflowing(false);
    setIsModalOpen(true);
  };

  // Index calculation based on current month's display data
  const currentIndex = selectedItem ? displayData.findIndex(item => item.id === selectedItem.id) : -1;

  const handleNext = React.useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (currentIndex !== -1 && currentIndex < displayData.length - 1) {
      setSelectedItem(displayData[currentIndex + 1]);
      setIsDescExpanded(false);
      setIsOverflowing(false);
    }
  }, [currentIndex, displayData]);

  const handlePrev = React.useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (currentIndex > 0) {
      setSelectedItem(displayData[currentIndex - 1]);
      setIsDescExpanded(false);
      setIsOverflowing(false);
    }
  }, [currentIndex, displayData]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isModalOpen) return;
      if (e.key === 'ArrowRight') handleNext();
      else if (e.key === 'ArrowLeft') handlePrev();
      else if (e.key === 'Escape') setIsModalOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, handleNext, handlePrev]);

  return (
    <div className={`flex flex-col gap-4 p-4 min-h-screen transition-colors duration-300 relative ${theme ? "bg-[#0B1120] text-slate-200" : "bg-white text-slate-900"}`}>

      {/* --- HEADER --- */}
      <div className="relative mb-6">
        {/* 🌟 Background Ambient Glow (Luxury Effect for Dark Mode) */}
        {theme && (
          <div className="absolute -top-6 -left-6 w-40 h-40 bg-blue-500/20 blur-[70px] rounded-full pointer-events-none z-0" />
        )}

        <div className={`relative z-10 flex flex-col md:flex-row justify-between items-center p-6 rounded-2xl border transition-all duration-500 ${theme
          ? "bg-linear-to-r from-[#151D2F] to-[#0B1120] border-slate-700/50 shadow-[0_8px_30px_rgba(0,0,0,0.4)] hover:shadow-[0_10px_40px_rgba(59,130,246,0.15)] hover:border-blue-500/30"
          : "bg-linear-to-r from-white to-slate-50 border-slate-200 shadow-[0_8px_30px_rgba(0,0,0,0.05)] hover:shadow-[0_10px_40px_rgba(59,130,246,0.1)] hover:border-blue-200"
          }`}>
          <div className="flex flex-col gap-2">
            {/* Gradient Title */}
            <h1 className={`text-3xl sm:text-4xl font-black tracking-tight ${theme
              ? "bg-clip-text text-transparent bg-linear-to-r from-blue-600 via-blue-400 to-blue-200 drop-shadow-[0_2px_15px_rgba(96,165,250,0.3)]"
              : "bg-clip-text text-transparent bg-linear-to-r from-slate-800 via-slate-600 to-slate-400 drop-shadow-[0_2px_15px_rgba(255,255,255,0.1)]"
              }`}>
              Activities Overview
            </h1>

            {/* Subtitle with Glowing Dot */}
            <p className={`text-sm sm:text-base font-medium flex items-center gap-2.5 transition-colors ${theme ? "text-slate-400" : "text-slate-500"
              }`}>
              Manage and explore yearly institutional activities
            </p>
          </div>

          <div className="w-full md:w-64 mt-5 md:mt-0 relative z-20">
            <DatePicker
              label=""
              selectedValue={headerDate}
              onChange={(dateStr) => setHeaderDate(dateStr)}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
        {/* --- LEFT SIDE: ADD RECORD --- */}
        <div className={`rounded-xl p-5 border transition-all ${theme ? "bg-[#151D2F] border-slate-800 shadow-none" : "bg-slate-50 border-slate-200 shadow-sm"}`}>
          <h2 className={`text-md font-bold mb-4 border-b pb-3 ${theme ? "text-white border-slate-800" : "text-slate-900 border-slate-200"}`}>
            Add New Activity
          </h2>

          <div className="flex flex-wrap items-start gap-4">
            <label className={`shrink-0 w-24 h-20 border-2 border-dashed rounded-xl cursor-pointer flex flex-col items-center justify-center overflow-hidden transition-colors ${theme ? "border-slate-700 hover:border-blue-500 bg-[#0B1120]" : "border-slate-300 hover:border-blue-500 bg-white"}`}>
              {selectedImage ? (
                <img src={selectedImage} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <Upload size={22} className={theme ? "text-slate-400" : "text-slate-500"} />
              )}
              <input
                ref={fileInputRef}
                id="file-upload"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </label>

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
              className={`w-full max-w-[calc(100%-8rem)] h-20 rounded-xl p-3 text-md outline-none focus:ring-2 resize-none transition-all ${theme
                ? "bg-[#0B1120] border border-slate-700 focus:ring-blue-500/50 focus:border-blue-500 text-slate-200 placeholder:text-slate-500"
                : "bg-white border border-slate-300 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900 placeholder:text-slate-400"
                }`}
            />

            <div className="flex justify-end w-full mt-4">
              <button
                onClick={handleSave}
                className={`w-full sm:w-auto px-8 h-12 text-white rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg ${theme ? "bg-blue-600 hover:bg-blue-500 shadow-blue-500/20" : "bg-red-600 hover:bg-red-700 shadow-red-500/30"}`}>
                <Save size={18} />
                <span className="text-md font-bold tracking-wide">Save Activity</span>
              </button>
            </div>
          </div>
        </div>

        {/* --- RIGHT SIDE: LIST (FILTERED BY MONTH) --- */}
        <div className={`rounded-xl p-5 border min-h-100 flex flex-col transition-all ${theme ? "bg-[#151D2F] border-slate-800 shadow-none" : "bg-slate-50 border-slate-200 shadow-sm"}`}>
          <div className={`flex justify-between items-center mb-4 border-b pb-3 ${theme ? "border-slate-800" : "border-slate-200"}`}>
            <h2 className={`text-md font-bold flex items-center gap-2 ${theme ? "text-white" : "text-slate-900"}`}>
              <CalendarDays size={18} className={theme ? "text-blue-400" : "text-blue-600"} />
              Activity Preview
            </h2>
            <span className={`text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider ${theme ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" : "bg-blue-50 text-blue-700 border border-blue-200"}`}>
              {formattedMonthName}
            </span>
          </div>

          <div className="space-y-3 overflow-y-auto pr-1 grow">
            {displayData.length > 0 ? (
              displayData.map((item) => (
                <div key={item.id} className={`flex items-center gap-4 p-2.5 rounded-xl border group transition-all duration-300 ${theme ? "bg-[#0B1120] border-slate-800 hover:border-slate-700" : "bg-white border-slate-200 shadow-sm hover:shadow-md"}`}>
                  <img
                    src={item.image}
                    alt="thumb"
                    className={`w-14 h-14 object-cover rounded-lg cursor-pointer ring-offset-2 transition-all ${theme ? "hover:ring-2 ring-blue-500 ring-offset-[#0B1120]" : "hover:ring-2 ring-blue-500"}`}
                    onClick={() => openModal(item)}
                  />
                  <div className="grow flex flex-col justify-center">
                    <p className={`text-sm line-clamp-2 ${item.description ? "font-medium" : "italic font-normal"} ${theme ? "text-slate-300" : "text-slate-800"}`}>
                      {item.description ? item.description : <span className="opacity-50">No description provided</span>}
                    </p>
                  </div>
                  <span className={`shrink-0 text-xs font-bold px-2.5 py-1.5 rounded-lg ${theme ? "text-slate-300 bg-slate-800" : "text-slate-600 bg-slate-100"}`}>
                    {item.date}
                  </span>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-full opacity-60 mt-10">
                <CalendarDays size={40} className={`mb-3 ${theme ? "text-slate-600" : "text-slate-300"}`} />
                <p className={`text-center text-sm font-medium ${theme ? "text-slate-400" : "text-slate-500"}`}>
                  No activities found for {formattedMonthName}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* --- IMAGE POPUP MODAL (70% Image & 30% Description) --- */}
      {isModalOpen && selectedItem && (
        <div
          onClick={() => setIsModalOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-black/85 backdrop-blur-md cursor-pointer transition-opacity"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`w-full max-w-7xl rounded-2xl overflow-hidden border cursor-default shadow-[0_0_40px_rgba(0,0,0,0.5)] ${theme ? "bg-[#151D2F] border-slate-700/50" : "bg-white border-slate-200"
              }`}
          >
            <div className="flex flex-col md:flex-row h-auto md:h-[80vh] max-h-212.5">

              {/* --- LEFT SIDE: IMAGE AREA (70% Width) --- */}
              <div className={`w-full md:w-[70%] flex items-center justify-center p-6 relative overflow-hidden border-b md:border-b-0 ${theme ? "bg-[#090F1C]" : "bg-slate-100"
                }`}>
                {/* Blur Background */}
                <img
                  key={`blur-${selectedItem.id}`}
                  src={selectedItem.image}
                  alt="Blur bg"
                  className="absolute inset-0 w-full h-full object-cover blur-3xl scale-110 opacity-30 pointer-events-none select-none"
                />

                {/* Center Image Wrapper */}
                <div className="relative z-10 w-full h-full flex items-center justify-center">
                  <img
                    key={selectedItem.id}
                    src={selectedItem.image}
                    alt="Full view"
                    className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
                  />
                </div>

                {/* Left Navigation */}
                {currentIndex > 0 && (
                  <button
                    onClick={handlePrev}
                    className={`absolute left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full shadow-xl border z-20 transition-transform hover:scale-110 active:scale-95 ${theme ? "bg-black/50 text-white hover:bg-black/80 border-white/10 backdrop-blur-md" : "bg-white/90 text-slate-800 hover:bg-white border-slate-200 backdrop-blur-md"
                      }`}
                  >
                    <ChevronLeft size={24} strokeWidth={2.5} />
                  </button>
                )}

                {/* Right Navigation */}
                {currentIndex < displayData.length - 1 && (
                  <button
                    onClick={handleNext}
                    className={`absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full shadow-xl border z-20 transition-transform hover:scale-110 active:scale-95 ${theme ? "bg-black/50 text-white hover:bg-black/80 border-white/10 backdrop-blur-md" : "bg-white/90 text-slate-800 hover:bg-white border-slate-200 backdrop-blur-md"
                      }`}
                  >
                    <ChevronRight size={24} strokeWidth={2.5} />
                  </button>
                )}
              </div>

              {/* --- RIGHT SIDE: CONTENT AREA (30% Width) --- */}
              <div className={`w-full md:w-[30%] p-8 flex flex-col md:border-l ${theme ? "bg-[#151D2F] border-slate-700/50" : "bg-white border-slate-200"
                }`}>
                <div className="grow flex flex-col gap-6 overflow-hidden">
                  <div className="flex items-start justify-between shrink-0">
                    <h3 className={`text-2xl font-black tracking-tight uppercase ${theme ? "text-blue-400" : "text-blue-600"
                      }`}>
                      Gurukul
                    </h3>
                    <span className={`text-[12px] px-3 py-1.5 rounded-lg font-mono font-bold border shadow-sm ${theme ? "bg-blue-500/10 text-blue-300 border-blue-500/20" : "bg-slate-100 text-slate-700 border-slate-200"
                      }`}>
                      {selectedItem.date}
                    </span>
                  </div>

                  {/* DESCRIPTION BOX */}
                  <div className="overflow-y-auto pr-2 grow block custom-scrollbar">
                    {isDescExpanded ? (
                      <p className={`font-serif text-[18px] leading-relaxed whitespace-pre-line wrap-break-word block ${theme ? "text-slate-300/90" : "text-slate-700"
                        }`}>
                        {selectedItem.description ? selectedItem.description : <span className="italic opacity-60">No description provided</span>}
                      </p>
                    ) : (
                      <div className="block max-w-full text-[18px] font-serif leading-8">
                        <span
                          ref={textRef}
                          className={`whitespace-nowrap overflow-hidden text-clip inline-block max-w-[calc(100%-25px)] align-bottom ${theme ? "text-slate-300/90" : "text-slate-700"
                            }`}
                        >
                          {selectedItem.description ? firstLine : <span className="italic opacity-60">No description provided</span>}
                        </span>

                        {(isOverflowing || hasMultipleLines) && (
                          <span
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsDescExpanded(true);
                            }}
                            className={`inline-block cursor-pointer text-sm font-black tracking-widest px-2 align-baseline transition-colors ${theme ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-500"
                              }`}
                            title="Read full description"
                          >
                            ...
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-6 pt-5 border-t flex justify-between items-center shrink-0 border-slate-200 dark:border-slate-700/50">
                  <p className={`text-xs font-bold tracking-widest uppercase ${theme ? "text-slate-500" : "text-slate-400"
                    }`}>
                    Activity {currentIndex + 1} of {displayData.length}
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Activities;