import React, { useState, useEffect, useRef, type DragEvent } from 'react';
import { Upload, Save, X, CalendarDays, Trash2, CheckCircle2 } from 'lucide-react';
import { useTheme } from '../../../components/theme/ThemeContext';
import PremiumDateField from '../../../components/Students/PremiumDateField';

interface UpcomingEvent {
  id: string;
  image: string;
  description: string;
  date: string;
  timestamp: number;
}

const UpcomingEvents: React.FC = () => {
  const { theme } = useTheme();

  // State Management
  const [eventsList, setEventsList] = useState<UpcomingEvent[]>([]);

  // Draft Box States
  const [draftImage, setDraftImage] = useState<string | null>(null);
  const [draftDescription, setDraftDescription] = useState('');
  const [draftDate, setDraftDate] = useState(new Date().toISOString().split('T')[0]);

  // ફોર્મને ફોર્સફુલી રી-માઉન્ટ (રીસેટ) કરવા માટેની કી
  const [formKey, setFormKey] = useState(0);

  // Drag & Drop State
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_EVENTS = 20;

  // Load saved events on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('upcomingEventsData');
    if (savedData) {
      setEventsList(JSON.parse(savedData));
    }
  }, []);

  const processFile = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => setDraftImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  // ફોર્મને સંપૂર્ણપણે ખાલી (Reset) કરવા માટેનું ફંક્શન
  const resetDraft = () => {
    setDraftImage(null);
    setDraftDescription('');
    setDraftDate(new Date().toISOString().split('T')[0]);
    setFormKey(prev => prev + 1);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // save event to localStorage and update state
  const handleSave = () => {
    if (!draftImage || !draftDate) {
      alert("Please provide an Image and Date to save the event.");
      return;
    }

    const newEvent: UpcomingEvent = {
      id: Date.now().toString(),
      image: draftImage,
      description: draftDescription.trim(),
      date: draftDate,
      timestamp: new Date().getTime(),
    };

    const updatedList = [...eventsList, newEvent];
    setEventsList(updatedList);
    localStorage.setItem('upcomingEventsData', JSON.stringify(updatedList));

    resetDraft();
  };

  const deleteEvent = (id: string) => {
    const updatedList = eventsList.filter(ev => ev.id !== id);
    setEventsList(updatedList);
    localStorage.setItem('upcomingEventsData', JSON.stringify(updatedList));
  };

  return (
    <div className={`min-h-screen p-6 md:p-8 font-sans transition-colors duration-500 relative ${theme ? "bg-[#050B14] text-slate-200" : "bg-[#F8FAFC] text-slate-900"}`}>

      {theme && (
        <>
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/10 blur-[120px] rounded-full pointer-events-none" />
        </>
      )}

      {/* PAGE HEADER */}
      <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className={`text-4xl font-black tracking-tight mb-2 ${theme ? "bg-clip-text text-transparent bg-linear-to-r from-blue-400 to-indigo-300" : "bg-clip-text text-transparent bg-linear-to-r from-slate-900 to-slate-600"}`}>
            Upcoming Events
          </h1>
          <p className={`text-sm font-medium flex items-center gap-2 ${theme ? "text-slate-400" : "text-slate-500"}`}>
            Curate and manage premium institutional events
          </p>
        </div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto space-y-8">

        {/* SAVED EVENTS LIST */}
        {eventsList.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {eventsList.map((event) => (
              <div key={event.id} className={`group relative rounded-3xl overflow-hidden border p-4 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] ${theme ? "bg-[#0B1120] border-slate-800 hover:border-blue-500/30" : "bg-white border-slate-200 hover:border-blue-300 hover:shadow-blue-500/5"}`}>

                <button
                  onClick={() => deleteEvent(event.id)}
                  className={`absolute top-6 right-6 z-20 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 ${theme ? "bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white" : "bg-red-100 text-red-600 hover:bg-red-500 hover:text-white"}`}
                >
                  <Trash2 size={16} />
                </button>

                <div className="relative h-48 rounded-2xl overflow-hidden mb-4">
                  <img src={event.image} alt="Event" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent"></div>

                  <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-lg bg-white/20 backdrop-blur-md border border-white/30 flex items-center gap-2 text-white text-xs font-bold">
                    <CalendarDays size={14} />
                    {event.date}
                  </div>
                </div>

                <div className="px-1 pb-1">
                  <p className={`text-sm font-medium line-clamp-3 leading-relaxed ${theme ? "text-slate-300" : "text-slate-700"}`}>
                    {event.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* DRAFTING BOX WITH PREMIUM BORDER */}
        {eventsList.length < MAX_EVENTS ? (
          <div
            key={formKey}
            className={`rounded-4xl p-6 md:p-10 border-2 backdrop-blur-xl transition-all duration-500 animate-in fade-in slide-in-from-bottom-8 mb-20 relative overflow-hidden ${theme
              ? "bg-[#111827]/90 border-slate-800 hover:border-blue-500/40 shadow-[0_20px_50px_rgba(0,0,0,0.6),0_0_30px_rgba(59,130,246,0.1)]"
              : "bg-white/95 border-slate-200 hover:border-blue-300 shadow-[0_20px_50px_rgba(148,163,184,0.15)]"
              }`}
          >
            {/* Top Premium Subtle Accent Light */}
            <div className={`absolute top-0 left-0 right-0 h-1 bg-linear-to-r ${theme ? "from-blue-500 via-indigo-500 to-purple-500" : "from-red-400 via-orange-400 to-sky-400"}`} />

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 border-b pb-6 border-slate-500/30 relative z-50">
              <div className="flex items-center gap-3">
                <h2 className={`text-2xl font-bold tracking-wide ${theme ? "text-white" : "text-slate-800"}`}>
                  Design New Event
                </h2>
              </div>

              <div className="w-full sm:w-64">
                <PremiumDateField
                  label="Event Date"
                  value={draftDate}
                  onChange={(newDate) => setDraftDate(newDate)}
                  theme={theme}
                  required={true}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 relative z-0">

              {/* IMAGE UPLOAD CONTAINER */}
              <div className="lg:col-span-2">
                <label
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  htmlFor="event-image-upload"
                  className={`relative flex flex-col items-center justify-center w-full h-64 rounded-3xl border-2 border-dashed cursor-pointer overflow-hidden transition-all duration-300 group ${isDragging
                    ? theme ? "border-blue-400 bg-blue-500/10 scale-[1.02]" : "border-blue-500 bg-blue-50 scale-[1.02]"
                    : theme
                      ? "border-slate-800 hover:border-blue-500/50 bg-[#0B1120]/70 hover:bg-[#0B1120]"
                      : "border-slate-300 hover:border-blue-400 bg-slate-50/70 hover:bg-slate-50"
                    }`}
                >
                  <input id="event-image-upload" type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageSelect} />

                  {draftImage ? (
                    <>
                      <img src={draftImage} alt="Preview" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="px-4 py-2 bg-white/20 backdrop-blur-md rounded-lg text-white text-sm font-medium border border-white/30">
                          Change Image
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-center p-6">
                      <div className={`p-4 rounded-full mb-4 transition-transform group-hover:-translate-y-2 duration-300 ${theme ? "bg-slate-800/80 text-slate-400 group-hover:text-blue-400 group-hover:bg-blue-500/10" : "bg-white shadow-sm text-slate-400 group-hover:text-blue-500 group-hover:bg-blue-50"}`}>
                        <Upload size={28} strokeWidth={1.5} />
                      </div>
                      <p className={`text-sm font-bold mb-1 ${theme ? "text-slate-300" : "text-slate-700"}`}>
                        Click to upload or drag and drop
                      </p>
                      <p className={`text-xs ${theme ? "text-slate-500" : "text-slate-400"}`}>
                        SVG, PNG, JPG or WEBP
                      </p>
                    </div>
                  )}
                </label>
              </div>

              {/* DESCRIPTION TEXTAREA WITH THEMED PLACEHOLDER */}
              <div className="lg:col-span-3 flex flex-col h-full">
                <div className={`flex-1 rounded-3xl border-2 overflow-hidden focus-within:ring-4 transition-all duration-300 ${theme
                  ? "bg-[#0B1120] border-slate-800 focus-within:border-blue-500/60 focus-within:ring-blue-500/15"
                  : "bg-slate-50 border-slate-200 focus-within:border-blue-400 focus-within:ring-blue-500/10"
                  }`}>
                  <textarea
                    defaultValue={draftDescription}
                    onChange={(e) => setDraftDescription(e.target.value)}
                    placeholder="Capture the essence of the event here"
                    className={`w-full h-full min-h-40 p-6 text-base md:text-lg resize-none outline-none bg-transparent leading-relaxed font-serif transition-colors ${theme
                      ? "text-slate-100 placeholder:text-slate-500"
                      : "text-slate-800 placeholder:text-slate-400"
                      }`}
                  />
                </div>
              </div>
            </div>

            {/* BUTTON ACTION AREA */}
            <div className={`mt-8 pt-6 border-t flex flex-wrap justify-end gap-4 ${theme ? "border-slate-800" : "border-slate-200"}`}>
              <button
                onClick={resetDraft}
                className={`px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all active:scale-95 ${theme ? "text-slate-300 hover:text-white hover:bg-slate-800" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"}`}
              >
                <X size={18} strokeWidth={2.5} />
                Clear
              </button>

              <button
                onClick={handleSave}
                className={`px-10 py-3 rounded-xl font-bold flex items-center gap-2 transition-all active:scale-95 shadow-lg ${theme
                  ? "bg-blue-600 text-white hover:bg-blue-500 shadow-blue-900/40 hover:shadow-blue-600/50"
                  : "bg-red-600 text-white hover:bg-red-700 shadow-red-900/10 hover:shadow-red-900/20"
                  }`}
              >
                <Save size={18} strokeWidth={2.5} />
                Save Event
              </button>
            </div>

          </div>
        ) : (
          <div className="flex justify-center mt-12 mb-20">
            <div className={`px-8 py-4 rounded-2xl border flex items-center gap-3 font-medium ${theme ? "bg-green-500/10 border-green-500/20 text-green-400" : "bg-green-50 border-green-200 text-green-700"}`}>
              <CheckCircle2 size={24} />
              Maximum limit of 20 premium events has been reached.
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default UpcomingEvents;