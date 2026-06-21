import { useState, useRef, useEffect } from "react";
import { useTheme } from "../theme/ThemeContext"; // તમારી ThemeContext ફાઇલ પાથ અહીં કન્ફર્મ કરી લેવો
import { HiDotsVertical } from "react-icons/hi";

interface DataCrudingProps {
  onEdit: () => void;
  onDelete: () => void;
  editLabel?: string;
  deleteLabel?: string;
}

export default function DataCruding({
  onEdit,
  onDelete,
  editLabel = "Edit",
  deleteLabel = "Delete",
}: DataCrudingProps) {
  const { theme } = useTheme(); // true = Dark, false = Light
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // મેનુની બહાર ક્લિક કરવાથી ડ્રોપડાઉન બંધ કરવા માટે
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      {/* 3-Dots બટન */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation(); // રો (Row) પર ક્લિક ઇવેન્ટ ટ્રિગર ન થાય તે માટે
          setIsOpen(!isOpen);
        }}
        className={`p-2 rounded-full border transition cursor-pointer flex items-center justify-center ${
          theme 
            ? "border-gray-700 bg-gray-800 text-gray-400 hover:text-white" 
            : "border-neutral-200 bg-neutral-50 text-neutral-500 hover:bg-neutral-100"
        }`}
      >
        <HiDotsVertical className="text-sm" />
      </button>

      {/* ડ્રોપડાઉન લિસ્ટ */}
      {isOpen && (
        <div className={`absolute right-0 mt-1 w-28 rounded-xl shadow-lg border p-1 z-20 transition-all origin-top-right ${
          theme ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-neutral-100 text-neutral-700"
        }`}>
          {/* Edit બટન */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
              setIsOpen(false);
            }}
            className="w-full text-left px-3 py-1.5 text-xs font-semibold rounded-lg hover:bg-neutral-100 dark:hover:bg-gray-700 transition cursor-pointer"
          >
            {editLabel}
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
              setIsOpen(false);
            }}
            className="w-full text-left px-3 py-1.5 text-xs font-semibold rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition cursor-pointer"
          >
            {deleteLabel}
          </button>
        </div>
      )}
    </div>
  );
}