import React, { useState, useRef, useEffect } from "react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";

interface PremiumDateFieldProps {
    label: string;
    value: string;
    onChange: (dateStr: string) => void;
    theme: boolean;
    required?: boolean;
}

const PremiumDateField: React.FC<PremiumDateFieldProps> = ({ label, value, onChange, theme, required }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [view, setView] = useState<"days" | "months" | "years">("days");

    let initialDate = new Date();
    if (value) {
        const parts = value.split("-");
        if (parts.length === 3) {
            initialDate = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
        }
    }

    const [currentDate, setCurrentDate] = useState(initialDate);
    const [yearRangeStart, setYearRangeStart] = useState(() => Math.floor(initialDate.getFullYear() / 12) * 12);
    const containerRef = useRef<HTMLDivElement>(null);

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const monthsShort = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const handlePrevMonth = (e: React.MouseEvent) => { e.stopPropagation(); setCurrentDate(new Date(year, month - 1, 1)); };
    const handleNextMonth = (e: React.MouseEvent) => { e.stopPropagation(); setCurrentDate(new Date(year, month + 1, 1)); };
    const handlePrevYearRange = (e: React.MouseEvent) => { e.stopPropagation(); setYearRangeStart((y) => y - 12); };
    const handleNextYearRange = (e: React.MouseEvent) => { e.stopPropagation(); setYearRangeStart((y) => y + 12); };

    const handleMonthLabelClick = (e: React.MouseEvent) => { e.stopPropagation(); setView("months"); };
    const handleYearLabelClick = (e: React.MouseEvent) => { e.stopPropagation(); setYearRangeStart(Math.floor(year / 12) * 12); setView("years"); };

    const handleMonthSelect = (monthIndex: number, e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentDate(new Date(year, monthIndex, 1));
        setView("days");
    };

    const handleYearSelect = (selectedYear: number, e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentDate(new Date(selectedYear, month, 1));
        setView("months");
    };

    const handleDateClick = (day: number, e: React.MouseEvent) => {
        e.stopPropagation();
        const formattedMonth = String(month + 1).padStart(2, "0");
        const formattedDay = String(day).padStart(2, "0");
        onChange(`${year}-${formattedMonth}-${formattedDay}`);
        setIsOpen(false);
    };

    useEffect(() => {
        if (isOpen) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setView("days");
            setYearRangeStart(Math.floor(year / 12) * 12);
        }
    }, [isOpen, year]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const getDisplayDate = () => {
        if (!value) return "";
        const parts = value.split("-");
        if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
        return value;
    };

    const isToday = (day: number) => { const today = new Date(); return today.getDate() === day && today.getMonth() === month && today.getFullYear() === year; };
    const isSelected = (day: number) => { if (!value) return false; const parts = value.split("-"); return Number(parts[2]) === day && (Number(parts[1]) - 1) === month && Number(parts[0]) === year; };
    const isCurrentMonth = (monthIndex: number) => { const today = new Date(); return today.getMonth() === monthIndex && today.getFullYear() === year; };
    const isSelectedMonth = (monthIndex: number) => { if (!value) return false; return (Number(value.split("-")[1]) - 1) === monthIndex && Number(value.split("-")[0]) === year; };
    const isCurrentYear = (y: number) => new Date().getFullYear() === y;
    const isSelectedYear = (y: number) => { if (!value) return false; return Number(value.split("-")[0]) === y; };

    const blanks = Array(firstDayOfMonth).fill(null);
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const yearGrid = Array.from({ length: 12 }, (_, i) => yearRangeStart + i);

    const cellBase = "text-xs font-bold rounded-lg transition-all duration-300 cursor-pointer flex items-center justify-center py-2";
    const cellSelected = theme ? "bg-blue-600 text-white shadow-[0_0_10px_rgba(37,99,235,0.4)] scale-105" : "bg-red-500 text-white shadow-[0_0_10px_rgba(239,68,68,0.4)] scale-105";
    const cellCurrent = theme ? "bg-[#1f2937] border border-blue-500/50 text-blue-300" : "bg-slate-50 border border-red-300 text-red-600";
    const cellDefault = theme ? "hover:bg-gray-700 text-gray-300 hover:text-white" : "hover:bg-slate-100 text-slate-800";

    const inputWrapperClasses = "relative group transition-all duration-300";
    const inputClasses = `w-full border rounded-xl py-3 pl-11 pr-4 focus:outline-none transition-all duration-500 ease-out transform group-hover:-translate-y-1 cursor-pointer ${theme
        ? "bg-[#1f2937]/80 border-gray-700/60 text-white placeholder-gray-500 group-hover:border-blue-500/50 group-hover:bg-[#1f2937] group-hover:shadow-[0_8px_20px_-5px_rgba(59,130,246,0.15)]"
        : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 group-hover:border-red-400/60 group-hover:bg-white group-hover:shadow-[0_8px_20px_-5px_rgba(239,68,68,0.1)]"
        } ${isOpen ? (theme ? "!border-blue-500 !bg-[#1f2937] ring-2 ring-blue-500/20 -translate-y-1 shadow-[0_8px_25px_-5px_rgba(59,130,246,0.2)]" : "!border-red-500 !bg-white ring-2 ring-red-500/10 -translate-y-1 shadow-[0_8px_25px_-5px_rgba(239,68,68,0.15)]") : ""}`;

    const iconClasses = `absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-500 z-10 ${theme
        ? "text-gray-500 group-hover:text-blue-400"
        : "text-slate-400 group-hover:text-red-500"
        } ${isOpen ? (theme ? "!text-blue-400" : "!text-red-500") : ""}`;

    return (
        <div className="flex flex-col gap-2 relative w-full" ref={containerRef}>
            <label className={`text-sm font-semibold tracking-wide transition-colors ${theme ? "text-gray-300" : "text-slate-700"}`}>
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <div className={inputWrapperClasses} onClick={() => setIsOpen(!isOpen)}>
                <Calendar size={20} className={iconClasses} />
                <input
                    type="text"
                    readOnly
                    value={getDisplayDate()}
                    placeholder="DD/MM/YYYY"
                    className={inputClasses}
                />
            </div>

            <div className={`absolute z-50 top-[105%] left-0 w-full min-w-70 p-5 border rounded-2xl shadow-2xl transition-all duration-300 origin-top ${isOpen ? "opacity-100 scale-100 translate-y-0 visible" : "opacity-0 scale-95 -translate-y-2 invisible"} ${theme ? "bg-[#1f2937] border-gray-700 shadow-black/60" : "bg-white border-slate-200 shadow-slate-200/60"}`}>
                {view === "days" && (
                    <>
                        <div className="flex items-center justify-between mb-4">
                            <h4 className={`text-sm font-bold flex items-center gap-1 ${theme ? "text-white" : "text-slate-900"}`}>
                                <button type="button" onClick={handleMonthLabelClick} className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${theme ? "hover:bg-gray-700 text-gray-200" : "hover:bg-slate-100 text-slate-800"}`}>{months[month]}</button>
                                <button type="button" onClick={handleYearLabelClick} className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${theme ? "hover:bg-gray-700 text-gray-200" : "hover:bg-slate-100 text-slate-800"}`}>{year}</button>
                            </h4>
                            <div className="flex space-x-1">
                                <button type="button" onClick={handlePrevMonth} className={`p-1.5 rounded-lg border transition-all cursor-pointer ${theme ? "border-gray-600 bg-gray-700 hover:bg-gray-600 text-gray-300" : "border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600"}`}><ChevronLeft size={16} /></button>
                                <button type="button" onClick={handleNextMonth} className={`p-1.5 rounded-lg border transition-all cursor-pointer ${theme ? "border-gray-600 bg-gray-700 hover:bg-gray-600 text-gray-300" : "border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600"}`}><ChevronRight size={16} /></button>
                            </div>
                        </div>
                        <div className="grid grid-cols-7 gap-1 text-center mb-2">
                            {daysOfWeek.map((d) => <div key={d} className={`text-[10px] font-black uppercase tracking-wider ${theme ? "text-gray-500" : "text-slate-400"}`}>{d}</div>)}
                        </div>
                        <div className="grid grid-cols-7 gap-1 text-center">
                            {blanks.map((_, idx) => <div key={`blank-${idx}`} className="py-2"></div>)}
                            {days.map((day) => <button key={day} type="button" onClick={(e) => handleDateClick(day, e)} className={`${cellBase} ${isSelected(day) ? cellSelected : isToday(day) ? cellCurrent : cellDefault}`}>{day}</button>)}
                        </div>
                    </>
                )}

                {view === "months" && (
                    <>
                        <div className="flex items-center justify-between mb-4">
                            <button type="button" onClick={handleYearLabelClick} className={`text-sm font-bold px-2 py-1 rounded-lg transition-colors cursor-pointer ${theme ? "hover:bg-gray-700 text-gray-200" : "hover:bg-slate-100 text-slate-800"}`}>{year}</button>
                            <div className="flex space-x-1">
                                <button type="button" onClick={(e) => { e.stopPropagation(); setCurrentDate(new Date(year - 1, month, 1)); }} className={`p-1.5 rounded-lg border transition-all cursor-pointer ${theme ? "border-gray-600 bg-gray-700 hover:bg-gray-600 text-gray-300" : "border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600"}`}><ChevronLeft size={16} /></button>
                                <button type="button" onClick={(e) => { e.stopPropagation(); setCurrentDate(new Date(year + 1, month, 1)); }} className={`p-1.5 rounded-lg border transition-all cursor-pointer ${theme ? "border-gray-600 bg-gray-700 hover:bg-gray-600 text-gray-300" : "border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600"}`}><ChevronRight size={16} /></button>
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            {monthsShort.map((m, idx) => <button key={m} type="button" onClick={(e) => handleMonthSelect(idx, e)} className={`${cellBase} py-3! ${isSelectedMonth(idx) ? cellSelected : isCurrentMonth(idx) ? cellCurrent : cellDefault}`}>{m}</button>)}
                        </div>
                    </>
                )}

                {view === "years" && (
                    <>
                        <div className="flex items-center justify-between mb-4">
                            <h4 className={`text-sm font-bold ${theme ? "text-gray-200" : "text-slate-800"}`}>{yearRangeStart} - {yearRangeStart + 11}</h4>
                            <div className="flex space-x-1">
                                <button type="button" onClick={handlePrevYearRange} className={`p-1.5 rounded-lg border transition-all cursor-pointer ${theme ? "border-gray-600 bg-gray-700 hover:bg-gray-600 text-gray-300" : "border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600"}`}><ChevronLeft size={16} /></button>
                                <button type="button" onClick={handleNextYearRange} className={`p-1.5 rounded-lg border transition-all cursor-pointer ${theme ? "border-gray-600 bg-gray-700 hover:bg-gray-600 text-gray-300" : "border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600"}`}><ChevronRight size={16} /></button>
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            {yearGrid.map((y) => <button key={y} type="button" onClick={(e) => handleYearSelect(y, e)} className={`${cellBase} py-3! ${isSelectedYear(y) ? cellSelected : isCurrentYear(y) ? cellCurrent : cellDefault}`}>{y}</button>)}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default PremiumDateField;