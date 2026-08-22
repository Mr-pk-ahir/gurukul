import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../../../components/theme/ThemeContext";

// Smooth Entrance Animation Component
function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

export default function OverviewManagement() {
  const { theme } = useTheme();

  // 3 Images State
  const [images, setImages] = useState<Array<string | null>>([null, null, null]);
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);

  // Hidden File Input Refs
  const fileInputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  // Image Upload Handler
  const handleFileUpload = (index: number, file: File) => {
    if (file && file.type.startsWith("image/")) {
      const imageUrl = URL.createObjectURL(file);
      const newImages = [...images];
      newImages[index] = imageUrl;
      setImages(newImages);
    }
  };

  // Drag & Drop Handlers
  const onDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDraggingIndex(index);
  };

  const onDragLeave = () => {
    setDraggingIndex(null);
  };

  const onDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDraggingIndex(null);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(index, e.dataTransfer.files[0]);
    }
  };

  // Remove Image Handler
  const removeImage = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const newImages = [...images];
    newImages[index] = null;
    setImages(newImages);
  };

  return (
    <div
      className={`w-full min-h-screen p-6 sm:p-10 lg:p-12 font-sans transition-colors duration-500 ${
        theme ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-800"
      }`}
    >
      {/* 📌 Header Section */}
      <Reveal>
        <div className="text-center mb-14 relative">
          {theme && (
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-48 h-48 bg-blue-500/10 blur-[70px] rounded-full pointer-events-none" />
          )}

          <h1 className="relative z-10 text-4xl sm:text-5xl font-extrabold tracking-tight mb-4 transition-all duration-500">
            <span
              className={`bg-clip-text text-transparent ${
                theme
                  ? "bg-linear-to-r from-white via-slate-200 to-slate-400 drop-shadow-[0_2px_15px_rgba(255,255,255,0.08)]"
                  : "bg-linear-to-r from-slate-900 via-slate-700 to-slate-500"
              }`}
            >
              Overview{" "}
            </span>

            <span
              className={`bg-clip-text text-transparent ${
                theme
                  ? "bg-linear-to-r from-blue-400 to-indigo-400 drop-shadow-[0_0_20px_rgba(96,165,250,0.3)]"
                  : "bg-linear-to-r from-red-600 to-rose-500 drop-shadow-xs"
              }`}
            >
              Management
            </span>
          </h1>

          <p
            className={`relative z-10 text-base sm:text-lg max-w-2xl mx-auto font-medium leading-relaxed transition-colors duration-300 ${
              theme ? "text-slate-400" : "text-slate-500"
            }`}
          >
            Curate and manage your featured section images with precision.
          </p>
        </div>
      </Reveal>

      {/* 📌 3 Equal Premium Luxury Image Boxes */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {[0, 1, 2].map((index) => (
          <Reveal key={index} delay={index * 0.1}>
            <motion.div
              whileHover={{ y: -6, scale: 1.01 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className={`relative h-105 rounded-3xl overflow-hidden cursor-pointer backdrop-blur-md transition-all duration-500 group flex flex-col justify-center items-center ${
                images[index]
                  ? theme
                    ? "bg-slate-900/80 border border-slate-700/80 hover:border-blue-400/80 shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_0_30px_rgba(59,130,246,0.25)]"
                    : "bg-white border border-slate-200 hover:border-rose-400/80 shadow-[0_10px_30px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_rgba(225,29,72,0.15)]"
                  : draggingIndex === index
                  ? theme
                    ? "bg-blue-950/40 border-2 border-dashed border-blue-400 scale-[1.02] shadow-[0_0_35px_rgba(59,130,246,0.3)]"
                    : "bg-rose-50/60 border-2 border-dashed border-rose-500 scale-[1.02] shadow-[0_15px_30px_rgba(225,29,72,0.18)]"
                  : theme
                  ? "bg-slate-900/40 border-2 border-dashed border-slate-700/70 hover:border-blue-400/80 hover:bg-slate-900/70 hover:shadow-[0_0_25px_rgba(59,130,246,0.2)]"
                  : "bg-white/80 border-2 border-dashed border-slate-300 hover:border-rose-400/90 hover:bg-white hover:shadow-[0_15px_35px_rgba(225,29,72,0.12)]"
              }`}
              onClick={() => !images[index] && fileInputRefs[index].current?.click()}
              onDragOver={(e) => onDragOver(e, index)}
              onDragLeave={onDragLeave}
              onDrop={(e) => onDrop(e, index)}
            >
              {/* Luxury Accent Top Border Glow Line */}
              <div
                className={`absolute top-0 left-0 right-0 h-0.5 transition-all duration-500 ${
                  theme
                    ? "bg-linear-to-r from-transparent via-blue-500/60 to-transparent group-hover:via-blue-400"
                    : "bg-linear-to-r from-transparent via-rose-500/50 to-transparent group-hover:via-rose-500"
                }`}
              />

              {/* Hidden File Input */}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRefs[index]}
                onChange={(e) => {
                  if (e.target.files) handleFileUpload(index, e.target.files[0]);
                }}
              />

              {images[index] ? (
                /* 📸 Uploaded Image Display */
                <div className="w-full h-full relative overflow-hidden">
                  <img
                    src={images[index]!}
                    alt={`Overview Image ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />

                  {/* Slot Number Badge */}
                  <div
                    className={`absolute top-4 left-4 z-10 px-3.5 py-1.5 rounded-full text-xs font-bold backdrop-blur-md border shadow-md ${
                      theme
                        ? "bg-slate-900/80 text-blue-400 border-slate-700/80"
                        : "bg-white/90 text-rose-600 border-slate-200"
                    }`}
                  >
                    Slot 0{index + 1}
                  </div>

                  {/* Glassmorphism Action Overlay */}
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-[3px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center p-6">
                    <div className="flex flex-col sm:flex-row gap-3 transform translate-y-3 group-hover:translate-y-0 transition-all duration-300">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          fileInputRefs[index].current?.click();
                        }}
                        className={`px-5 py-2.5 rounded-full font-bold text-xs backdrop-blur-md border shadow-lg transition-all duration-300 active:scale-95 ${
                          theme
                            ? "bg-slate-800/90 text-slate-100 border-slate-600 hover:bg-blue-600 hover:border-blue-500 hover:text-white"
                            : "bg-white/90 text-slate-800 border-slate-200 hover:bg-rose-600 hover:border-rose-500 hover:text-white"
                        }`}
                      >
                        Change Image
                      </button>

                      <button
                        type="button"
                        onClick={(e) => removeImage(index, e)}
                        className="px-5 py-2.5 rounded-full font-bold text-xs bg-red-500/90 hover:bg-red-600 text-white border border-red-400/30 backdrop-blur-md shadow-lg transition-all duration-300 active:scale-95"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* 📤 Empty Upload Placeholder */
                <div className="flex flex-col items-center justify-center p-8 text-center pointer-events-none select-none">
                  {/* Luxury Icon Box */}
                  <div
                    className={`w-16 h-16 mb-5 rounded-2xl flex items-center justify-center border transition-all duration-300 shadow-lg ${
                      theme
                        ? "bg-slate-800/60 border-slate-700/80 text-blue-400 group-hover:scale-110 group-hover:border-blue-400 group-hover:shadow-blue-500/20"
                        : "bg-slate-100/90 border-slate-200/80 text-rose-500 group-hover:scale-110 group-hover:border-rose-400 group-hover:shadow-rose-500/20"
                    }`}
                  >
                    <svg
                      className="w-8 h-8 stroke-current"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.8}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
                      />
                    </svg>
                  </div>

                  <span
                    className={`text-xs font-bold tracking-wider uppercase mb-1 transition-colors duration-300 ${
                      theme ? "text-blue-400" : "text-rose-600"
                    }`}
                  >
                    Image
                  </span>

                  <h3
                    className={`text-lg font-bold transition-colors duration-300 ${
                      theme ? "text-slate-200" : "text-slate-800"
                    }`}
                  >
                    Upload Overview Image
                  </h3>

                  <p
                    className={`text-xs mt-2 font-medium max-w-50 leading-relaxed transition-colors duration-300 ${
                      theme ? "text-slate-400" : "text-slate-500"
                    }`}
                  >
                    Drag & drop high-resolution image here or click to browse
                  </p>
                </div>
              )}
            </motion.div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}