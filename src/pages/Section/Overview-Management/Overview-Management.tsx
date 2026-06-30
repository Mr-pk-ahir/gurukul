import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, Image as ImageIcon, X, Save, RefreshCw, Layers, CheckCircle } from "lucide-react";
import { useTheme } from "../../../components/theme/ThemeContext";
import { RiGalleryLine } from "react-icons/ri";

type ImageSection = "heroSlider" | "featureImage" | "smartInfrastructure";

const defaultImages: { [key in ImageSection]: string[] } = {
    heroSlider: [],
    featureImage: [],
    smartInfrastructure: [],
};

const DB_NAME = "GurukulOverviewDB";
const STORE_NAME = "images_store";

const initDB = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, 1);
        request.onupgradeneeded = () => {
            const db = request.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME);
            }
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
};

const saveToIndexedDB = async (key: string, data: any) => {
    const db = await initDB();
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).put(data, key);
};

const getFromIndexedDB = async (key: string): Promise<any> => {
    const db = await initDB();
    return new Promise((resolve) => {
        const tx = db.transaction(STORE_NAME, "readonly");
        const request = tx.objectStore(STORE_NAME).get(key);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => resolve(null);
    });
};

export default function OverviewManagement() {
    const { theme } = useTheme();
    const [images, setImages] = useState<{ [key in ImageSection]: string[] }>(defaultImages);
    const [showToast, setShowToast] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            const savedData = await getFromIndexedDB("overview_data");
            if (savedData) {
                setImages(savedData);
            }
        };
        loadData();
    }, []);

    const compressImage = (file: File, callback: (base64: string) => void) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;
            img.onload = () => {
                const canvas = document.createElement("canvas");
                
                const MAX_WIDTH = 4000;
                const MAX_HEIGHT = 4000;
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH;
                    }
                } else {
                    if (height > MAX_HEIGHT) {
                        width *= MAX_HEIGHT / height;
                        height = MAX_HEIGHT;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext("2d");
                ctx?.drawImage(img, 0, 0, width, height);

                const dataUrl = canvas.toDataURL("image/jpeg", 0.95);
                callback(dataUrl);
            };
        };
    };

    // ઈમેજ અપલોડ હેન્ડલર
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, section: ImageSection) => {
        if (e.target.files) {
            const selectedFiles = Array.from(e.target.files);

            // 🚀 60MB સાઈઝ ચેક (60 * 1024 * 1024 bytes)
            const MAX_SIZE_BYTE = 60 * 1024 * 1024;
            for (let file of selectedFiles) {
                if (file.size > MAX_SIZE_BYTE) {
                    alert(`"${file.name}" આ ફાઇલ 60MB કરતાં મોટી છે! મહેરબાની કરીને નાની ફાઇલ સિલેક્ટ કરો.`);
                    return;
                }
            }

            if (section === "heroSlider" && images.heroSlider.length + selectedFiles.length > 10) {
                alert("તમે સ્લાઈડરમાં વધુમાં વધુ ૧૦ ઈમેજીસ જ રાખી શકો છો.");
                return;
            }

            selectedFiles.forEach((file) => {
                compressImage(file, (compressedBase64) => {
                    if (section === "featureImage" || section === "smartInfrastructure") {
                        setImages((prev) => ({ ...prev, [section]: [compressedBase64] }));
                    } else {
                        setImages((prev) => ({ ...prev, [section]: [...(prev[section] || []), compressedBase64] }));
                    }
                });
            });
        }
    };

    const removeImage = (section: ImageSection, indexToRemove: number) => {
        setImages((prev) => ({
            ...prev,
            [section]: prev[section].filter((_, index) => index !== indexToRemove),
        }));
    };

    const handleReset = async () => {
        setImages(defaultImages);
        await saveToIndexedDB("overview_data", defaultImages);
    };

    // 🚀 સેવ બટન - હવે ડેટા સીધો IndexedDB માં સેવ થશે
    const handleSave = async () => {
        try {
            await saveToIndexedDB("overview_data", images);
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
        } catch (error) {
            alert("ડેટા સેવ કરવામાં કોઈ સમસ્યા આવી છે.");
            console.error(error);
        }
    };

    // --- Reusable Upload Card Component ---
    const UploadCard = ({ title, description, section, multiple = false, limit = 10, icon: Icon }: any) => {
        const currentImages = images[section as ImageSection] || [];
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
                    {isSingleUploadComplete ? (
                        <div className="relative w-full rounded-2xl overflow-hidden border border-gray-200 dark:border-slate-700 shadow-sm aspect-video">
                            <img src={currentImages[0]} alt="Preview" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
                                <button onClick={() => removeImage(section, 0)} className="p-3 bg-red-500 text-white rounded-full hover:bg-red-600 transform hover:scale-110 transition-all shadow-lg">
                                    <X size={20} strokeWidth={3} />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <input type="file" multiple={multiple} accept="image/*" onChange={(e) => handleImageUpload(e, section)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" disabled={currentImages.length >= limit} />
                            <div className={`w-full flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed transition-all duration-300 min-h-40 ${theme ? "border-slate-700 bg-slate-800/30 group-hover:border-indigo-500 group-hover:bg-slate-800/50" : "border-gray-300 bg-gray-50 group-hover:border-indigo-400 group-hover:bg-indigo-50/30"}`}>
                                <UploadCloud size={40} className={`mb-3 transition-colors ${theme ? "text-slate-500 group-hover:text-indigo-400" : "text-gray-400 group-hover:text-indigo-500"}`} />
                                <p className={`font-medium text-center ${theme ? "text-slate-300" : "text-slate-700"}`}>Click to upload (Max 60MB)</p>
                            </div>
                        </>
                    )}
                </div>

                {multiple && currentImages.length > 0 && (
                    <div className="grid gap-3 mt-6 grid-cols-2 sm:grid-cols-3">
                        {currentImages.map((imgSrc, idx) => (
                            <div key={idx} className="relative group rounded-xl overflow-hidden aspect-video border border-gray-200 dark:border-slate-700 shadow-sm">
                                <img src={imgSrc} alt="Preview" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm z-20">
                                    <button onClick={() => removeImage(section, idx)} className="p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transform hover:scale-110 transition-all shadow-lg">
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

    return (
        <div className={`min-h-screen p-6 md:p-10 transition-colors duration-500 relative ${theme ? "bg-slate-950" : "bg-slate-50"}`}>
            <AnimatePresence>
                {showToast && (
                    <motion.div initial={{ opacity: 0, y: -50, x: "-50%" }} animate={{ opacity: 1, y: 0, x: "-50%" }} exit={{ opacity: 0, y: -20, x: "-50%" }} className={`fixed top-6 left-1/2 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl shadow-xl border font-semibold text-sm transition-all ${theme ? "bg-slate-900 border-slate-800 text-emerald-400 shadow-black/40" : "bg-white border-emerald-100 text-emerald-600 shadow-emerald-100"}`}>
                        <CheckCircle size={20} className="text-emerald-500" />
                        <span>Saved Successfully!</span>
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
                        <button onClick={handleReset} className={`flex-1 md:flex-none flex justify-center items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all active:scale-95 border ${theme ? "border-slate-600 text-slate-300 hover:bg-slate-800" : "border-gray-500 text-slate-700 hover:bg-gray-200"}`}>
                            <RefreshCw size={16} /> Reset
                        </button>
                        <button onClick={handleSave} className={`flex-1 md:flex-none flex justify-center items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm text-white shadow-lg transition-all active:scale-95 ${theme ? "bg-indigo-600 hover:bg-indigo-500 shadow-indigo-900/30" : "bg-linear-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 shadow-red-500/30"}`}>
                            <Save size={16} /> Save Settings
                        </button>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    <div className="flex flex-col gap-8">
                        <UploadCard title="Section 1 : Feature Image" description="Upload the main feature image (Single Image)" section="featureImage" multiple={false} limit={1} icon={ImageIcon} />
                        <UploadCard title="Section 3 : Smart Infrastructure" description="Upload single image for Smart Infrastructure" section="smartInfrastructure" multiple={false} limit={1} icon={RiGalleryLine} />
                    </div>
                    <div className="flex flex-col gap-8">
                        <UploadCard title="Section 2 : Scroll Slider Images" description="Upload multiple images for the scrolling slider" section="heroSlider" multiple={true} limit={10} icon={Layers} />
                    </div>
                </div>
            </div>
        </div>
    );
}