/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, Image as ImageIcon, X, RefreshCw, Layers, CheckCircle, Loader2 } from "lucide-react";
import { useTheme } from "../../../components/theme/ThemeContext";
import { RiGalleryLine } from "react-icons/ri";

type ImageSection = "heroSlider" | "featureImage" | "smartInfrastructure";

interface ImageItem {
    id: number;
    url: string;
}

const defaultImages: { [key in ImageSection]: ImageItem[] } = {
    heroSlider: [],
    featureImage: [],
    smartInfrastructure: [],
};

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// --- Reusable Upload Card Component (Extracted outside) ---
interface UploadCardProps {
    title: string;
    description: string;
    section: ImageSection;
    multiple?: boolean;
    limit?: number;
    icon: React.ComponentType<any>;
    currentImages: ImageItem[];
    isUploading: boolean;
    onUpload: (event: React.ChangeEvent<HTMLInputElement>, section: ImageSection) => void;
    onRemove: (section: ImageSection, id: number) => void;
}

const UploadCard = ({
    title,
    description,
    section,
    multiple = false,
    limit = 10,
    icon: Icon,
    currentImages,
    isUploading,
    onUpload,
    onRemove,
}: UploadCardProps) => {
    const { theme } = useTheme();
    const isSingleUploadComplete = !multiple && currentImages.length > 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-6 rounded-3xl border shadow-sm transition-all duration-300 flex flex-col ${
                theme ? "bg-slate-900/60 border-slate-800 shadow-black/20" : "bg-white border-gray-100 shadow-gray-200/50 hover:shadow-xl"
            }`}
        >
            <div className="flex rounded-2xl items-start gap-4 mb-6">
                <div className={`p-3.5 rounded-2xl shrink-0 ${theme ? "bg-slate-800 text-indigo-400" : "bg-indigo-50 text-indigo-600"}`}>
                    <Icon size={26} strokeWidth={1.5} />
                </div>
                <div className="flex-1">
                    <div className="flex justify-between items-center w-full">
                        <h3 className={`text-lg font-bold ${theme ? "text-white" : "text-slate-800"}`}>{title}</h3>
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${theme ? "bg-slate-800 text-slate-300" : "bg-gray-100 text-gray-600"}`}>
                            {currentImages.length} / {limit}
                        </span>
                    </div>
                    <p className={`text-sm mt-1 leading-snug ${theme ? "text-slate-400" : "text-gray-500"}`}>{description}</p>
                </div>
            </div>

            <div className="relative group flex-1 flex flex-col justify-center min-h-40">
                {isUploading ? (
                    <div className={`w-full flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed min-h-40 ${theme ? "border-slate-700 bg-slate-800/30" : "border-gray-300 bg-gray-50"}`}>
                        <Loader2 size={32} className="animate-spin mb-3 text-indigo-500" />
                        <p className={`font-medium text-center ${theme ? "text-slate-300" : "text-slate-700"}`}>Uploading...</p>
                    </div>
                ) : isSingleUploadComplete ? (
                    <div className="relative w-full rounded-2xl overflow-hidden border border-gray-200 dark:border-slate-700 shadow-sm aspect-video">
                        <img src={currentImages[0].url} alt="Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
                            <button onClick={() => onRemove(section, currentImages[0].id)} className="p-3 bg-red-500 text-white rounded-full hover:bg-red-600 transform hover:scale-110 transition-all shadow-lg">
                                <X size={20} strokeWidth={3} />
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        <input type="file" multiple={multiple} accept="image/*" onChange={(e) => onUpload(e, section)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" disabled={currentImages.length >= limit} />
                        <div className={`w-full flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed transition-all duration-300 min-h-40 ${theme ? "border-slate-700 bg-slate-800/30 group-hover:border-indigo-500 group-hover:bg-slate-800/50" : "border-gray-300 bg-gray-50 group-hover:border-indigo-400 group-hover:bg-indigo-50/30"}`}>
                            <UploadCloud size={40} className={`mb-3 transition-colors ${theme ? "text-slate-500 group-hover:text-indigo-400" : "text-gray-400 group-hover:text-indigo-500"}`} />
                            <p className={`font-medium text-center ${theme ? "text-slate-300" : "text-slate-700"}`}>Click to upload (Max 60MB)</p>
                        </div>
                    </>
                )}
            </div>

            {multiple && currentImages.length > 0 && (
                <div className="grid gap-3 mt-6 grid-cols-2 sm:grid-cols-3">
                    {currentImages.map((img) => (
                        <div key={img.id} className="relative group rounded-xl overflow-hidden aspect-video border border-gray-200 dark:border-slate-700 shadow-sm">
                            <img src={img.url} alt="Preview" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm z-20">
                                <button onClick={() => onRemove(section, img.id)} className="p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transform hover:scale-110 transition-all shadow-lg">
                                    <X size={16} strokeWidth={3} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </motion.div>
    );
};

export default function OverviewManagement() {
    const { theme } = useTheme();
    const [images, setImages] = useState<{ [key in ImageSection]: ImageItem[] }>(defaultImages);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("Saved Successfully!");
    const [isLoading, setIsLoading] = useState(true);
    const [uploadingSection, setUploadingSection] = useState<ImageSection | null>(null);

    // 🚀 Backend thi data fetch karo
    const fetchOverview = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/overview`);
            const result = await res.json();
            if (result.success) {
                setImages({
                    heroSlider: result.data.heroSlider || [],
                    featureImage: result.data.featureImage || [],
                    smartInfrastructure: result.data.smartInfrastructure || [],
                });
            }
        } catch (error) {
            console.error("Error fetching overview:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchOverview();
    }, []);

    const showNotification = (message: string) => {
        setToastMessage(message);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    // 🚀 Upload direct backend/Cloudinary ne thay chhe - IndexedDB/base64 nathi
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, section: ImageSection) => {
        if (!e.target.files || e.target.files.length === 0) return;

        const selectedFiles = Array.from(e.target.files);

        const MAX_SIZE_BYTE = 60 * 1024 * 1024;
        for (const file of selectedFiles) {
            if (file.size > MAX_SIZE_BYTE) {
                alert(`"${file.name}" આ ફાઇલ 60MB કરતાં મોટી છે! મહેરબાની કરીને નાની ફાઇલ સિલેક્ટ કરો.`);
                return;
            }
        }

        if (section === "heroSlider" && images.heroSlider.length + selectedFiles.length > 10) {
            alert("તમે સ્લાઈડરમાં વધુમાં વધુ ૧૦ ઈમેજીસ જ રાખી શકો છો.");
            return;
        }

        setUploadingSection(section);

        try {
            // Multiple files hoy to ek pachi ek upload thashe (backend single file j lai chhe)
            for (const file of selectedFiles) {
                const formData = new FormData();
                formData.append("section", section);
                formData.append("image", file);

                const res = await fetch(`${API_BASE_URL}/overview/update`, {
                    method: "POST",
                    body: formData,
                });

                const result = await res.json();
                if (!result.success) {
                    throw new Error(result.message || "Upload failed");
                }
            }

            await fetchOverview(); // fresh data reload karo
            showNotification("Image uploaded successfully!");
        } catch (error: any) {
            console.error("Upload error:", error);
            alert(error.message || "Upload failed. Please try again.");
        } finally {
            setUploadingSection(null);
            e.target.value = "";
        }
    };

    const removeImage = async (section: ImageSection, imageId: number) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this image?");
        if (!confirmDelete) return;

        try {
            const res = await fetch(`${API_BASE_URL}/overview/${imageId}`, {
                method: "DELETE",
            });
            const result = await res.json();

            if (!result.success) {
                throw new Error(result.message || "Delete failed");
            }

            setImages((prev) => ({
                ...prev,
                [section]: prev[section].filter((img) => img.id !== imageId),
            }));
            showNotification("Image deleted successfully!");
        } catch (error: any) {
            console.error("Delete error:", error);
            alert(error.message || "Delete failed. Please try again.");
        }
    };

    // --- Reusable Upload Card Component (Extracted outside) ---
    
    if (isLoading) {
        return (
            <div className={`min-h-screen flex items-center justify-center ${theme ? "bg-slate-950" : "bg-slate-50"}`}>
                <Loader2 size={40} className="animate-spin text-indigo-500" />
            </div>
        );
    }

    return (
        <div className={`min-h-screen p-6 md:p-10 transition-colors duration-500 relative ${theme ? "bg-slate-950" : "bg-slate-50"}`}>
            <AnimatePresence>
                {showToast && (
                    <motion.div initial={{ opacity: 0, y: -50, x: "-50%" }} animate={{ opacity: 1, y: 0, x: "-50%" }} exit={{ opacity: 0, y: -20, x: "-50%" }} className={`fixed top-6 left-1/2 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl shadow-xl border font-semibold text-sm transition-all ${theme ? "bg-slate-900 border-slate-800 text-emerald-400 shadow-black/40" : "bg-white border-emerald-100 text-emerald-600 shadow-emerald-100"}`}>
                        <CheckCircle size={20} className="text-emerald-500" />
                        <span>{toastMessage}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="max-w-6xl mx-auto space-y-8">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className={`flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-6 rounded-3xl shadow-sm border ${theme ? "bg-slate-900 border-slate-800" : "bg-white border-gray-200"}`}>
                    <div>
                        <h1 className={`text-2xl font-black tracking-wide ${theme ? "text-white" : "text-slate-900"}`}>Overview Controller</h1>
                        <p className={`text-sm mt-1 font-medium ${theme ? "text-slate-400" : "text-gray-500"}`}>Manage and update the images for the website's overview sections.</p>
                    </div>
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <button onClick={fetchOverview} className={`flex-1 md:flex-none flex justify-center items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all active:scale-95 border ${theme ? "border-slate-600 text-slate-300 hover:bg-slate-800" : "border-gray-500 text-slate-700 hover:bg-gray-200"}`}>
                            <RefreshCw size={16} /> Refresh
                        </button>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    <div className="flex flex-col gap-8">
                        <UploadCard
                            title="Section 1 : Feature Image"
                            description="Upload the main feature image (Single Image)"
                            section="featureImage"
                            multiple={false}
                            limit={1}
                            icon={ImageIcon}
                            currentImages={images.featureImage}
                            isUploading={uploadingSection === "featureImage"}
                            onUpload={handleImageUpload}
                            onRemove={removeImage}
                        />
                        <UploadCard
                            title="Section 3 : Smart Infrastructure"
                            description="Upload single image for Smart Infrastructure"
                            section="smartInfrastructure"
                            multiple={false}
                            limit={1}
                            icon={RiGalleryLine}
                            currentImages={images.smartInfrastructure}
                            isUploading={uploadingSection === "smartInfrastructure"}
                            onUpload={handleImageUpload}
                            onRemove={removeImage}
                        />
                    </div>
                    <div className="flex flex-col gap-8">
                        <UploadCard
                            title="Section 2 : Scroll Slider Images"
                            description="Upload multiple images for the scrolling slider"
                            section="heroSlider"
                            multiple={true}
                            limit={10}
                            icon={Layers}
                            currentImages={images.heroSlider}
                            isUploading={uploadingSection === "heroSlider"}
                            onUpload={handleImageUpload}
                            onRemove={removeImage}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}