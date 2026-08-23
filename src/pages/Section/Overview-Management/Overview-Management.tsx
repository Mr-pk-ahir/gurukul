import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiPlus, HiX } from "react-icons/hi";
import { toast } from "sonner";
import { useTheme } from "../../../components/theme/ThemeContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const SECTION = "heroSlider"; // 🎯 Aa component sirf "Overview" module (heroSlider) mate j che

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

// 🎯 Ek box nu data structure — id null hoy matlab hajuye backend par upload nathi thayu (nava added empty slot)
interface OverviewImageItem {
    localKey: string;
    id: number | null;
    url: string | null;
    uploading?: boolean;
}

export default function OverviewManagement() {
    const { theme } = useTheme();

    const [images, setImages] = useState<OverviewImageItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [draggingKey, setDraggingKey] = useState<string | null>(null);

    // 🎯 Dynamic refs — box ganya vagar j (fixed 3 nahi have) — key thi map karyu
    const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});
    const changeInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

    // 📥 Page load thata j backend thi heroSlider images fetch karo
    useEffect(() => {
        fetchOverviewImages();
    }, []);

    const fetchOverviewImages = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${API_URL}/overview`);
            const result = await res.json();

            if (result.success && result.data?.[SECTION]) {
                const mapped: OverviewImageItem[] = result.data[SECTION].map((img: { id: number; url: string }) => ({
                    localKey: `db-${img.id}`,
                    id: img.id,
                    url: img.url,
                }));
                setImages(mapped);
            }
        } catch (error) {
            toast.error("Failed to load overview images");
        } finally {
            setLoading(false);
        }
    };

    // ➕ Naya empty slot add karo — click thata file picker khule
    const addNewSlot = () => {
        const newItem: OverviewImageItem = {
            localKey: `new-${Date.now()}-${Math.random()}`,
            id: null,
            url: null,
        };
        setImages((prev) => [...prev, newItem]);
    };

    // 📤 File upload karo backend par (naya image mate)
    const handleFileUpload = async (localKey: string, file: File) => {
        if (!file.type.startsWith("image/")) {
            toast.error("Sirf image files allowed che.");
            return;
        }

        setImages((prev) => prev.map((img) => (img.localKey === localKey ? { ...img, uploading: true } : img)));

        try {
            const formData = new FormData();
            formData.append("image", file);
            formData.append("section", SECTION);

            const res = await fetch(`${API_URL}/overview/update`, {
                method: "POST",
                body: formData,
            });

            const result = await res.json();

            if (!result.success) {
                throw new Error(result.message || "Upload failed");
            }

            setImages((prev) =>
                prev.map((img) =>
                    img.localKey === localKey
                        ? { ...img, id: result.data.id, url: result.data.url, uploading: false }
                        : img
                )
            );
            toast.success("Image uploaded successfully");
        } catch (error: any) {
            toast.error(error.message || "Failed to upload image");
            setImages((prev) => prev.map((img) => (img.localKey === localKey ? { ...img, uploading: false } : img)));
        }
    };

    // 🔄 Existing image ne badalo (navi file upload thay, juni delete thay)
    const handleChangeImage = async (item: OverviewImageItem, file: File) => {
        if (!file.type.startsWith("image/")) {
            toast.error("Sirf image files allowed che.");
            return;
        }

        setImages((prev) => prev.map((img) => (img.localKey === item.localKey ? { ...img, uploading: true } : img)));

        try {
            const formData = new FormData();
            formData.append("image", file);
            formData.append("section", SECTION);

            const res = await fetch(`${API_URL}/overview/update`, {
                method: "POST",
                body: formData,
            });
            const result = await res.json();

            if (!result.success) {
                throw new Error(result.message || "Upload failed");
            }

            // Navi image successfully upload thai gayi — have juni delete karo (best effort)
            if (item.id) {
                try {
                    await fetch(`${API_URL}/overview/${item.id}`, { method: "DELETE" });
                } catch {
                    // juni delete fail thay to pan navi to save thai j gayi che, ignore karo
                }
            }

            setImages((prev) =>
                prev.map((img) =>
                    img.localKey === item.localKey
                        ? { ...img, id: result.data.id, url: result.data.url, uploading: false }
                        : img
                )
            );
            toast.success("Image updated successfully");
        } catch (error: any) {
            toast.error(error.message || "Failed to update image");
            setImages((prev) => prev.map((img) => (img.localKey === item.localKey ? { ...img, uploading: false } : img)));
        }
    };

    // ❌ Element remove karo — top na close icon thi (uploaded hoy to backend delete, empty hoy to sirf local remove)
    const handleRemoveItem = async (item: OverviewImageItem, e: React.MouseEvent) => {
        e.stopPropagation();

        if (item.id) {
            try {
                const res = await fetch(`${API_URL}/overview/${item.id}`, { method: "DELETE" });
                const result = await res.json();
                if (!result.success) {
                    throw new Error(result.message || "Failed to delete image");
                }
                toast.success("Image removed");
            } catch (error: any) {
                toast.error(error.message || "Failed to delete image");
                return; // delete fail thayu to list ma thi hatavo nahi
            }
        }

        setImages((prev) => prev.filter((img) => img.localKey !== item.localKey));
    };

    const onDragOver = (e: React.DragEvent, localKey: string) => {
        e.preventDefault();
        setDraggingKey(localKey);
    };

    const onDragLeave = () => setDraggingKey(null);

    const onDrop = (e: React.DragEvent, item: OverviewImageItem) => {
        e.preventDefault();
        setDraggingKey(null);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const file = e.dataTransfer.files[0];
            if (item.url) {
                handleChangeImage(item, file);
            } else {
                handleFileUpload(item.localKey, file);
            }
        }
    };

    return (
        <div
            className={`w-full min-h-screen p-6 sm:p-10 lg:p-12 font-sans transition-colors duration-500 ${theme ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-800"
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
                            className={`bg-clip-text text-transparent ${theme
                                    ? "bg-linear-to-r from-white via-slate-200 to-slate-400 drop-shadow-[0_2px_15px_rgba(255,255,255,0.08)]"
                                    : "bg-linear-to-r from-slate-900 via-slate-700 to-slate-500"
                                }`}
                        >
                            Overview{" "}
                        </span>

                        <span
                            className={`bg-clip-text text-transparent ${theme
                                    ? "bg-linear-to-r from-blue-400 to-indigo-400 drop-shadow-[0_0_20px_rgba(96,165,250,0.3)]"
                                    : "bg-linear-to-r from-red-600 to-rose-500 drop-shadow-xs"
                                }`}
                        >
                            Management
                        </span>
                    </h1>

                    <p
                        className={`relative z-10 text-base sm:text-lg max-w-2xl mx-auto font-medium leading-relaxed transition-colors duration-300 ${theme ? "text-slate-400" : "text-slate-500"
                            }`}
                    >
                        Curate and manage your featured section images with precision.
                    </p>
                </div>
            </Reveal>

            {/* ➕ Add Image button */}
            <div className="max-w-7xl mx-auto flex justify-end mb-6">
                <button
                    type="button"
                    onClick={addNewSlot}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg transition-all duration-300 hover:-translate-y-1 active:scale-95 ${theme
                            ? "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/30"
                            : "bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/20"
                        }`}
                >
                    <HiPlus size={18} />
                    Add Image
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className={`w-10 h-10 rounded-full border-4 border-t-transparent animate-spin ${theme ? "border-blue-500" : "border-rose-600"}`} />
                </div>
            ) : (
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                    <AnimatePresence>
                        {images.map((item, index) => (
                            <motion.div
                                key={item.localKey}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Reveal delay={index * 0.05}>
                                    <motion.div
                                        whileHover={{ y: -6, scale: 1.01 }}
                                        transition={{ duration: 0.3, ease: "easeOut" }}
                                        className={`relative h-105 rounded-3xl overflow-hidden cursor-pointer backdrop-blur-md transition-all duration-500 group flex flex-col justify-center items-center ${item.url
                                                ? theme
                                                    ? "bg-slate-900/80 border border-slate-700/80 hover:border-blue-400/80 shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_0_30px_rgba(59,130,246,0.25)]"
                                                    : "bg-white border border-slate-200 hover:border-rose-400/80 shadow-[0_10px_30px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_rgba(225,29,72,0.15)]"
                                                : draggingKey === item.localKey
                                                    ? theme
                                                        ? "bg-blue-950/40 border-2 border-dashed border-blue-400 scale-[1.02] shadow-[0_0_35px_rgba(59,130,246,0.3)]"
                                                        : "bg-rose-50/60 border-2 border-dashed border-rose-500 scale-[1.02] shadow-[0_15px_30px_rgba(225,29,72,0.18)]"
                                                    : theme
                                                        ? "bg-slate-900/40 border-2 border-dashed border-slate-700/70 hover:border-blue-400/80 hover:bg-slate-900/70 hover:shadow-[0_0_25px_rgba(59,130,246,0.2)]"
                                                        : "bg-white/80 border-2 border-dashed border-slate-300 hover:border-rose-400/90 hover:bg-white hover:shadow-[0_15px_35px_rgba(225,29,72,0.12)]"
                                            }`}
                                        onClick={() => !item.url && !item.uploading && fileInputRefs.current[item.localKey]?.click()}
                                        onDragOver={(e) => onDragOver(e, item.localKey)}
                                        onDragLeave={onDragLeave}
                                        onDrop={(e) => onDrop(e, item)}
                                    >
                                        {/* Luxury Accent Top Border Glow Line */}
                                        <div
                                            className={`absolute top-0 left-0 right-0 h-0.5 transition-all duration-500 ${theme
                                                    ? "bg-linear-to-r from-transparent via-blue-500/60 to-transparent group-hover:via-blue-400"
                                                    : "bg-linear-to-r from-transparent via-rose-500/50 to-transparent group-hover:via-rose-500"
                                                }`}
                                        />

                                        {/* 🎯 NAVU: Close icon — hammesha top-right ma, badha boxes (uploaded ke empty) par */}
                                        <button
                                            type="button"
                                            onClick={(e) => handleRemoveItem(item, e)}
                                            className={`absolute top-3 right-3 z-20 w-8 h-8 flex items-center justify-center rounded-full backdrop-blur-md border shadow-lg transition-all duration-300 hover:scale-110 active:scale-95 ${theme
                                                    ? "bg-slate-900/80 border-slate-700 text-slate-300 hover:bg-red-500/90 hover:border-red-400 hover:text-white"
                                                    : "bg-white/90 border-slate-200 text-slate-600 hover:bg-red-500 hover:border-red-400 hover:text-white"
                                                }`}
                                            title="Remove"
                                        >
                                            <HiX size={16} />
                                        </button>

                                        {/* Hidden file input — naya upload mate */}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            ref={(el) => { fileInputRefs.current[item.localKey] = el; }}
                                            onChange={(e) => {
                                                if (e.target.files?.[0]) handleFileUpload(item.localKey, e.target.files[0]);
                                                e.target.value = "";
                                            }}
                                        />

                                        {/* Hidden file input — "Change Image" mate (existing image par) */}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            ref={(el) => { changeInputRefs.current[item.localKey] = el; }}
                                            onChange={(e) => {
                                                if (e.target.files?.[0]) handleChangeImage(item, e.target.files[0]);
                                                e.target.value = "";
                                            }}
                                        />

                                        {item.uploading ? (
                                            /* ⏳ Uploading state */
                                            <div className="flex flex-col items-center gap-3">
                                                <div className={`w-10 h-10 rounded-full border-4 border-t-transparent animate-spin ${theme ? "border-blue-500" : "border-rose-600"}`} />
                                                <span className={`text-xs font-bold ${theme ? "text-slate-400" : "text-slate-500"}`}>Uploading...</span>
                                            </div>
                                        ) : item.url ? (
                                            /* 📸 Uploaded Image Display */
                                            <div className="w-full h-full relative overflow-hidden">
                                                <img
                                                    src={item.url}
                                                    alt={`Overview Image ${index + 1}`}
                                                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                                                />

                                                {/* Slot Number Badge */}
                                                <div
                                                    className={`absolute top-4 left-4 z-10 px-3.5 py-1.5 rounded-full text-xs font-bold backdrop-blur-md border shadow-md ${theme
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
                                                                changeInputRefs.current[item.localKey]?.click();
                                                            }}
                                                            className={`px-5 py-2.5 rounded-full font-bold text-xs backdrop-blur-md border shadow-lg transition-all duration-300 active:scale-95 ${theme
                                                                    ? "bg-slate-800/90 text-slate-100 border-slate-600 hover:bg-blue-600 hover:border-blue-500 hover:text-white"
                                                                    : "bg-white/90 text-slate-800 border-slate-200 hover:bg-rose-600 hover:border-rose-500 hover:text-white"
                                                                }`}
                                                        >
                                                            Change Image
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            /* 📤 Empty Upload Placeholder */
                                            <div className="flex flex-col items-center justify-center p-8 text-center pointer-events-none select-none">
                                                <div
                                                    className={`w-16 h-16 mb-5 rounded-2xl flex items-center justify-center border transition-all duration-300 shadow-lg ${theme
                                                            ? "bg-slate-800/60 border-slate-700/80 text-blue-400 group-hover:scale-110 group-hover:border-blue-400 group-hover:shadow-blue-500/20"
                                                            : "bg-slate-100/90 border-slate-200/80 text-rose-500 group-hover:scale-110 group-hover:border-rose-400 group-hover:shadow-rose-500/20"
                                                        }`}
                                                >
                                                    <svg className="w-8 h-8 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth={1.8}>
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
                                                        />
                                                    </svg>
                                                </div>

                                                <span className={`text-xs font-bold tracking-wider uppercase mb-1 transition-colors duration-300 ${theme ? "text-blue-400" : "text-rose-600"}`}>
                                                    Image
                                                </span>

                                                <h3 className={`text-lg font-bold transition-colors duration-300 ${theme ? "text-slate-200" : "text-slate-800"}`}>
                                                    Upload Overview Image
                                                </h3>

                                                <p className={`text-xs mt-2 font-medium max-w-50 leading-relaxed transition-colors duration-300 ${theme ? "text-slate-400" : "text-slate-500"}`}>
                                                    Drag & drop high-resolution image here or click to browse
                                                </p>
                                            </div>
                                        )}
                                    </motion.div>
                                </Reveal>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {!loading && images.length === 0 && (
                <p className={`text-center mt-10 ${theme ? "text-slate-500" : "text-slate-400"}`}>
                    No images yet — click "Add Image" to upload your first overview image.
                </p>
            )}
        </div>
    );
}