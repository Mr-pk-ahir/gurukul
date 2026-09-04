import { useMemo, useRef, useState } from "react";
import { CheckCircle2, FileAudio, FileImage, FileText, FileVideo, UploadCloud } from "lucide-react";

interface LessonMediaUploaderProps {
  lessonType: string;
  onFileChange?: (file: File | null) => void;
  label?: string;
}

const mediaTypeConfig: Record<string, { label: string; accept: string; icon: typeof FileVideo; helper: string }> = {
  video: {
    label: "Video",
    accept: "video/*",
    icon: FileVideo,
    helper: "Upload a video file for this lesson",
  },
  audio: {
    label: "Audio",
    accept: "audio/*",
    icon: FileAudio,
    helper: "Upload a voice note or audio lesson",
  },
  image: {
    label: "Image",
    accept: "image/*",
    icon: FileImage,
    helper: "Upload a lesson image or cover graphic",
  },
  document: {
    label: "Document",
    accept: ".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt",
    icon: FileText,
    helper: "Upload a PDF, document, or presentation",
  },
};

export default function LessonMediaUploader({ lessonType, onFileChange, label = "Lesson Media" }: LessonMediaUploaderProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const config = useMemo(() => mediaTypeConfig[lessonType] ?? mediaTypeConfig.document, [lessonType]);
  const Icon = config.icon;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setSelectedFile(file);
    onFileChange?.(file);
    event.target.value = "";
  };

  const clearSelection = () => {
    setSelectedFile(null);
    onFileChange?.(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="w-full">
      <label className="mb-1.5 block text-sm font-medium text-gray-300">{label}</label>

      <div
        onClick={() => inputRef.current?.click()}
        className="group cursor-pointer rounded-2xl border border-dashed border-blue-400/50 bg-blue-500/5 p-5 transition-all duration-200 hover:border-blue-400 hover:bg-blue-500/10"
      >
        <div className="flex flex-col items-center justify-center gap-3 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-300">
            <Icon className="h-7 w-7" />
          </div>

          <div>
            <p className="text-base font-semibold text-white">{config.label} upload</p>
            <p className="mt-1 text-sm text-gray-400">{config.helper}</p>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-3 py-1.5 text-xs font-medium text-blue-200">
            <UploadCloud className="h-3.5 w-3.5" />
            Select file
          </div>
        </div>

        <input ref={inputRef} type="file" accept={config.accept} onChange={handleChange} className="hidden" />
      </div>

      {selectedFile ? (
        <div className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">
          <div className="flex min-w-0 items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span className="truncate">{selectedFile.name}</span>
          </div>
          <button
            type="button"
            onClick={clearSelection}
            className="rounded-md px-2 py-1 text-xs font-medium text-emerald-200 transition hover:bg-emerald-500/10"
          >
            Remove
          </button>
        </div>
      ) : null}
    </div>
  );
}
