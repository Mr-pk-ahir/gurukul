import { useState, useRef, useEffect } from "react";
import { useTheme } from "../theme/ThemeContext";
import { HiCalendar, HiChevronLeft, HiChevronRight } from "react-icons/hi"; // અથવા 'react-icons/hi'

interface DatePickerProps {
  label: string;
  selectedValue: string;
  onChange: (dateStr: string) => void;
  required?: boolean;
}

export default function DatePicker({
  label,
  selectedValue,
  onChange,
  required = false,
}: DatePickerProps) {
  const { theme } = useTheme(); // true = Dark, false = Light
  const [isOpen, setIsOpen] = useState(false);
  
  // શરૂઆતની તારીખ સેટ કરવા માટે
  const initialDate = selectedValue ? new Date(selectedValue) : new Date();
  const [currentDate, setCurrentDate] = useState(initialDate);

  const containerRef = useRef<HTMLDivElement>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // અગાઉના અને આગામી મહિના માટે
  const handlePrevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // તારીખ સિલેક્ટ થાય ત્યારે
  const handleDateClick = (day: number, e: React.MouseEvent) => {
    e.stopPropagation();
    
    // મહિનો અને દિવસ હંમેશા ૨ આંકડામાં આવે (MM-DD) તે માટે ફોર્મેટિંગ
    const formattedMonth = String(month + 1).padStart(2, "0");
    const formattedDay = String(day).padStart(2, "0");
    const dateString = `${year}-${formattedMonth}-${formattedDay}`;

    onChange(dateString); // મેઈન ફોર્મ સ્ટેટને ડેટા મોકલશે
    setIsOpen(false); // કેલેન્ડર બંધ કરશે
  };

  // બહાર ક્લિક કરવાથી કેલેન્ડર બંધ કરવા માટે
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // આજની તારીખ હાઇલાઇટ કરવા માટે
  const isToday = (day: number) => {
    const today = new Date();
    return today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;
  };

  // સિલેક્ટ કરેલી તારીખ હાઇલાઇટ કરવા માટે
  const isSelected = (day: number) => {
    if (!selectedValue) return false;
    const selDate = new Date(selectedValue);
    return selDate.getDate() === day && selDate.getMonth() === month && selDate.getFullYear() === year;
  };

  const blanks = Array(firstDayOfMonth).fill(null);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // ડિસ્પ્લે માટે તારીખનું ફોર્મેટ સાદું કરવા (DD/MM/YYYY)
  const getDisplayDate = () => {
    if (!selectedValue) return "";
    const [y, m, d] = selectedValue.split("-");
    return `${d}/${m}/${y}`;
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      {/* Label */}
      <label className={`block text-sm font-medium mb-1.5 ${theme ? "text-gray-300" : "text-neutral-700"}`}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      {/* Input Box (તમારા ગ્લોબલ ઇનપુટ જેવો જ લુક) */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm border transition outline-none cursor-pointer ${
          theme 
            ? "bg-gray-800 border-gray-700 text-white focus-within:border-blue-200" 
            : "bg-neutral-50 border-neutral-200 text-neutral-900 focus-within:border-red-500"
        }`}
      >
        <span className={`shrink-0 ${theme ? "text-gray-400" : "text-neutral-400"}`}>
          <HiCalendar className="text-lg" />
        </span>
        
        <input
          type="text"
          readOnly
          placeholder="Select Date (DD/MM/YYYY)"
          value={getDisplayDate()}
          className={`w-full bg-transparent outline-none cursor-pointer ${
            theme ? "placeholder:text-gray-500 text-white" : "placeholder:text-neutral-400 text-neutral-900"
          }`}
        />
      </div>

      {/* Dropdown Calendar */}
      {isOpen && (
        <div className={`absolute z-30 mt-1.5 w-full max-w-sm p-4 border rounded-2xl shadow-lg transition-all duration-200 ${
          theme ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-neutral-200 text-neutral-900"
        }`}>
          
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-semibold">
              {months[month]} {year}
            </h4>
            <div className="flex space-x-1">
              <button
                type="button"
                onClick={handlePrevMonth}
                className={`p-1 rounded-lg border transition cursor-pointer ${
                  theme ? "border-gray-600 bg-gray-700 hover:bg-gray-600" : "border-neutral-200 bg-neutral-50 hover:bg-neutral-100"
                }`}
              >
                <HiChevronLeft className="text-base" />
              </button>
              <button
                type="button"
                onClick={handleNextMonth}
                className={`p-1 rounded-lg border transition cursor-pointer ${
                  theme ? "border-gray-600 bg-gray-700 hover:bg-gray-600" : "border-neutral-200 bg-neutral-50 hover:bg-neutral-100"
                }`}
              >
                <HiChevronRight className="text-base" />
              </button>
            </div>
          </div>

          {/* Week Labels */}
          <div className="grid grid-cols-7 gap-1 text-center mb-1">
            {daysOfWeek.map((d) => (
              <div key={d} className={`text-xs font-medium py-1 ${theme ? "text-gray-500" : "text-neutral-400"}`}>
                {d}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {blanks.map((_, idx) => (
              <div key={`blank-${idx}`} className="py-1.5"></div>
            ))}

            {days.map((day) => (
              <button
                key={day}
                type="button"
                onClick={(e) => handleDateClick(day, e)}
                className={`py-1.5 text-xs font-medium rounded-lg transition cursor-pointer flex items-center justify-center
                  ${isSelected(day)
                    ? theme ? "bg-blue-600 text-white font-bold" : "bg-red-500 text-white font-bold"
                    : isToday(day)
                      ? theme ? "bg-gray-700 border border-blue-400 text-blue-200" : "bg-red-50 border border-red-400 text-red-600"
                      : theme ? "hover:bg-gray-700 text-gray-200" : "hover:bg-neutral-100 text-neutral-800"
                  }
                `}
              >
                {day}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}