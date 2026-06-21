import { useState, useRef, useEffect } from "react";
import { useTheme } from "../theme/ThemeContext";
import Input from "./Input";

interface DropdownOption {
  id: number;
  name: string;
}

interface SearchableDropdownProps {
  label: string;
  placeholder: string;
  searchPlaceholder?: string;
  options: DropdownOption[];
  selectedId: number | string;
  onSelect: (id: number) => void;
  required?: boolean;
  disabled?: boolean;
}

export default function SearchableDropdown({
  label,
  placeholder,
  searchPlaceholder = "Search...",
  options,
  selectedId,
  onSelect,
  required = false,
  disabled = false,
}: SearchableDropdownProps) {
  const { theme } = useTheme();
  
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(0); // 🌟 નવું: કીબોર્ડ હાઇલાઇટ ટ્રેક કરવા
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null); // 🌟 નવું: ઓટો-સ્ક્રોલિંગ માટે

  const selectedOption = options.find((opt) => opt.id === Number(selectedId));

  const filteredOptions = options.filter((option) =>
    option.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 🌟 જ્યારે પણ સર્ચ બદલાય અથવા ડ્રોપડાઉન ખુલે, ત્યારે હાઇલાઇટ પાછું 0 પર લાવી દો
  useEffect(() => {
    setHighlightedIndex(0);
  }, [searchQuery, isOpen]);

  // 🌟 ઓટો-સ્ક્રોલ લોજીક: જ્યારે કીબોર્ડથી નીચે જાઓ ત્યારે લિસ્ટ પણ નીચે સ્ક્રોલ થવું જોઈએ
  useEffect(() => {
    if (isOpen && listRef.current && listRef.current.children[highlightedIndex]) {
      const activeItem = listRef.current.children[highlightedIndex] as HTMLElement;
      activeItem.scrollIntoView({ block: "nearest" });
    }
  }, [highlightedIndex, isOpen]);

  // બહાર ક્લિક કરવાથી બંધ કરવાનું લોજીક
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <label className={`block text-sm font-medium mb-1.5 ${theme ? "text-gray-300" : "text-neutral-700"} ${disabled ? "opacity-60" : ""}`}>
        {label} {required && !disabled && <span className="text-red-500">*</span>}
      </label>

      {/* 🎯 મેઇન બટન / બોક્સ */}
      <div
        tabIndex={disabled ? -1 : 0} 
        onClick={() => {
          if (!disabled) setIsOpen(!isOpen);
        }}
        onKeyDown={(e) => {
          // બંધ હોય ત્યારે Enter, Space કે ArrowDown દબાવવાથી ખૂલશે
          if (!isOpen && !disabled && (e.key === "Enter" || e.key === " " || e.key === "ArrowDown")) {
            e.preventDefault();
            setIsOpen(true);
          }
        }}
        className={`w-full border rounded-xl px-3 py-2.5 text-sm min-h-[42px] flex items-center justify-between outline-none transition-all duration-200 ${
          disabled 
            ? theme 
              ? "bg-gray-800/50 border-gray-700/50 text-gray-500 cursor-not-allowed" 
              : "bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed"
            : `cursor-pointer ${
                theme 
                  ? `bg-gray-800 text-white ${isOpen ? "border-blue-500 ring-2 ring-blue-500/30" : "border-gray-700 hover:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"}` 
                  : `bg-neutral-50 text-neutral-900 ${isOpen ? "border-blue-500 ring-2 ring-blue-500/20" : "border-neutral-200 hover:border-neutral-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"}`
              }`
        }`}
      >
        <span className={selectedOption ? "" : disabled ? "" : "text-gray-400"}>
          {selectedOption ? selectedOption.name : placeholder}
        </span>
        
        {!disabled && (
          <span className={`text-xs transition-transform duration-200 ${isOpen ? "rotate-180" : ""} ${theme ? "text-gray-400" : "text-neutral-400"}`}>
            ▼
          </span>
        )}
      </div>

      {/* 🎯 ડ્રોપડાઉન લિસ્ટ (ખુલે ત્યારે) */}
      {isOpen && !disabled && (
        <div 
          className={`absolute z-20 w-full mt-1 border rounded-xl shadow-lg max-h-60 overflow-hidden flex flex-col ${
            theme ? "bg-gray-800 border-gray-700" : "bg-white border-neutral-200"
          }`}
          // 🌟 જ્યારે ડ્રોપડાઉન ખુલ્લું હોય ત્યારે કીબોર્ડ ઇવેન્ટ્સ કેચ કરવા માટે
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setHighlightedIndex((prev) => Math.min(prev + 1, filteredOptions.length - 1));
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setHighlightedIndex((prev) => Math.max(prev - 1, 0));
            } else if (e.key === "Enter") {
              e.preventDefault();
              if (filteredOptions[highlightedIndex]) {
                onSelect(filteredOptions[highlightedIndex].id);
                setSearchQuery("");
                setIsOpen(false);
              }
            } else if (e.key === "Escape") {
              setIsOpen(false);
            }
          }}
        >
          <div className="p-2 border-b border-inherit">
            <Input
              type="text"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
          </div>

          <div className="overflow-y-auto p-2 space-y-0.5" ref={listRef}>
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => {
                const isSelected = Number(selectedId) === option.id;
                const isHighlighted = highlightedIndex === index; // 🌟 ચેક કરો કે આ ઓપ્શન કીબોર્ડથી હાઇલાઇટ થયેલ છે કે નહિ?

                return (
                  <div
                    key={option.id}
                    onMouseEnter={() => setHighlightedIndex(index)} // માઉસથી જાઓ તો પણ હાઇલાઇટ થાય
                    onClick={() => {
                      onSelect(option.id);
                      setSearchQuery("");
                      setIsOpen(false);
                    }}
                    className={`px-3 py-2 text-sm rounded-lg cursor-pointer transition-colors duration-150 ${
                      isSelected
                        ? theme ? "bg-blue-900/40 text-blue-300 font-medium" : "bg-blue-50 text-blue-600 font-medium"
                        : isHighlighted 
                          ? theme ? "bg-gray-700 text-white" : "bg-neutral-100 text-neutral-900" // કીબોર્ડ હાઇલાઇટ કલર
                          : theme ? "hover:bg-gray-700 text-gray-300" : "hover:bg-neutral-100 text-neutral-700"
                    }`}
                  >
                    {option.name}
                  </div>
                );
              })
            ) : (
              <div className={`px-3 py-2 text-sm text-center ${theme ? "text-gray-500" : "text-neutral-400"}`}>
                No data found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}