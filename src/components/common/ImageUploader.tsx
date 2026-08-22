import React, { useState, useRef } from "react";
import { Camera, ImagePlus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { uploadService } from "../../services/uploadService";

interface ImageUploaderProps {
    value?: string | null;
    onChange: (url: string) => void;
    theme: boolean;
    uploadType?: "avatar" | "section";
    shape?: "circle" | "square";
    size?: number;
    label?: string;
}

export default function ImageUploader({
    value,
    onChange,
    theme,
    uploadType = "avatar",
    shape = "circle",
    size = 128,
    label,
}: ImageUploaderProps) {
    const [uploading, setUploading] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const doUpload = async (file: File) => {
        if (!file.type.startsWith("image/")) {
            toast.error("Sirf image files (jpg, png, webp) allowed che.");
            return;
        }
        if (file.size > 10 * 1024 * 1024) {
            toast.error("Image 10MB thi vadhu na hovi joie.");
            return;
        }

        try {
            setUploading(true);
            const url =
                uploadType === "avatar"
                    ? await uploadService.uploadAvatar(file)
                    : await uploadService.uploadSectionImage(file);

            onChange(url);
            toast.success("Image uploaded successfully");
        } catch (error: any) {
            toast.error(error.message || "Failed to upload image");
        } finally {
            setUploading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) doUpload(file);
        e.target.value = "";
    };

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
        const file = e.dataTransfer.files?.[0];
        if (file) doUpload(file);
    };

    const roundedClass = shape === "circle" ? "rounded-full" : "rounded-2xl";

    return (
        <div className="flex flex-col items-center gap-2">
            <div
                onClick={() => !uploading && fileInputRef.current?.click()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                style={{ width: size, height: size }}
                className={`relative group ${roundedClass} overflow-hidden border-2 flex items-center justify-center cursor-pointer transition-all duration-300 ${
                    isDragging
                        ? theme
                            ? "border-blue-500 bg-blue-500/10 scale-105"
                            : "border-red-500 bg-red-500/10 scale-105"
                        : theme
                        ? "border-gray-700 bg-gray-800/50 hover:border-blue-500/50"
                        : "border-neutral-200 bg-neutral-50 hover:border-red-400"
                }`}
            >
                {value ? (
                    <img src={value} alt="Uploaded" className="w-full h-full object-cover" />
                ) : (
                    <div className={`flex flex-col items-center justify-center ${theme ? "text-gray-500" : "text-neutral-400"}`}>
                        <ImagePlus size={size > 80 ? 32 : 20} />
                    </div>
                )}

                {!uploading && (
                    <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Camera size={size > 80 ? 24 : 16} className="text-white" />
                        {size > 80 && <span className="text-white text-[10px] font-bold mt-1">UPLOAD</span>}
                    </div>
                )}

                {uploading && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <Loader2 className="text-white animate-spin" size={size > 80 ? 28 : 18} />
                    </div>
                )}

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    disabled={uploading}
                />
            </div>

            {label && (
                <span className={`text-xs font-medium ${theme ? "text-gray-500" : "text-neutral-400"}`}>
                    {uploading ? "Uploading..." : label}
                </span>
            )}
        </div>
    );
}