import { useState, useRef, useEffect } from "react";
import { useTheme } from "../theme/ThemeContext"; // તમારી ThemeContext ફાઇલ પાથ અહીં કન્ફર્મ કરી લેવો
import Input from "./Input"; 

interface DropdownOption {
  id: number;
  name: string;
}

interface SearchableDropdownProps {
  label: string;
  placeholder: string;
  searchPlaceholder?: string;
  options: DropdownOption[]; // string[] ને બદલે ઓબ્જેક્ટ લિસ્ટ
  selectedId: number | string; // સિલેક્ટેડ ID
  onSelect: (id: number) => void; // ID રિટર્ન કરશે
  required?: boolean;
}

export default function SearchableDropdown({
  label,
  placeholder,
  searchPlaceholder = "Search...",
  options,
  selectedId,
  onSelect,
  required = false,
}: SearchableDropdownProps) {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // આઈડી પરથી નામ શોધવા માટે (ડિસ્પ્લે કરવા)
  const selectedOption = options.find((opt) => opt.id === Number(selectedId));

  const filteredOptions = options.filter((option) =>
    option.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      <label className={`block text-sm font-medium mb-1.5 ${theme ? "text-gray-300" : "text-neutral-700"}`}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full border rounded-xl px-3 py-2.5 text-sm cursor-pointer min-h-[42px] flex items-center justify-between transition ${
          theme 
            ? "bg-gray-800 border-gray-700 text-white focus-within:border-blue-200" 
            : "bg-neutral-50 border-neutral-200 text-neutral-900"
        }`}
      >
        <span className={selectedOption ? "" : "text-gray-400"}>
          {selectedOption ? selectedOption.name : placeholder}
        </span>
        <span className={`text-xs transition-transform duration-200 ${isOpen ? "rotate-180" : ""} ${theme ? "text-gray-400" : "text-neutral-400"}`}>
          ▼
        </span>
      </div>

      {isOpen && (
        <div className={`absolute z-20 w-full mt-1 border rounded-xl shadow-lg max-h-60 overflow-y-auto p-2 ${
          theme ? "bg-gray-800 border-gray-700" : "bg-white border-neutral-200"
        }`}>
          <Input
            type="text"
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="mb-2"
            autoFocus
          />

          <div className="space-y-0.5">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <div
                  key={option.id}
                  onClick={() => {
                    onSelect(option.id); // આઈડી પાછો મોકલશે (Number)
                    setSearchQuery("");
                    setIsOpen(false);
                  }}
                  className={`px-3 py-2 text-sm rounded-lg cursor-pointer transition ${
                    Number(selectedId) === option.id
                      ? theme ? "bg-gray-700 text-blue-200 font-medium" : "bg-red-50 text-red-600 font-medium"
                      : theme ? "hover:bg-gray-700 text-white" : "hover:bg-neutral-100 text-neutral-900"
                  }`}
                >
                  {option.name}
                </div>
              ))
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