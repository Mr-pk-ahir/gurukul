import React, { useState, useRef, useEffect } from "react";
import {
  AtSign,
  Calendar,
  Camera,
  Check,
  Eye,
  EyeOff,
  Hash,
  Lock,
  ShieldCheck,
  User,
  Gift,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useTheme } from "../components/theme/ThemeContext";

/* ----------------------------- Types ----------------------------- */

export interface ProfileSettingsUser {
  suid: string;
  username: string;
  fullName: string;
  birthDate: string;
  joinedDate: string;
  roleLabel: string;
  avatarUrl?: string;
}

interface ProfileSettingProps {
  user?: ProfileSettingsUser;
  onSaveProfile?: (data: Omit<ProfileSettingsUser, "roleLabel">) => Promise<void> | void;
  onChangePassword?: (data: { currentPassword: string; newPassword: string }) => Promise<void> | void;
}

const DEFAULT_USER: ProfileSettingsUser = {
  suid: "123098",
  username: "super-admin",
  fullName: "Super Admin Principal",
  birthDate: "1990-08-08",
  joinedDate: "2024-01-14",
  roleLabel: "SUPER_ADMIN",
};

/* ------------------------- Sub components ------------------------- */

function SectionHeading({ icon, title, theme }: { icon: React.ReactNode; title: string; theme: boolean }) {
  return (
    <div className="flex items-center gap-4 mb-8 group">
      <div
        className={`flex items-center justify-center w-9 h-9 rounded-xl shrink-0 shadow-sm transition-all duration-300 group-hover:scale-110 ${
          theme
            ? "bg-linear-to-br from-blue-500/20 to-blue-600/10 text-blue-400 border border-blue-500/20 group-hover:border-blue-500/40 group-hover:shadow-[0_0_15px_rgba(59,130,246,0.2)]"
            : "bg-linear-to-br from-red-500/10 to-red-600/5 text-red-600 border border-red-100 group-hover:border-red-300 group-hover:shadow-[0_0_15px_rgba(220,38,38,0.15)]"
        }`}
      >
        {icon}
      </div>
      <h3
        className={`text-sm font-bold uppercase tracking-widest transition-colors duration-300 ${
          theme ? "text-gray-300 group-hover:text-white" : "text-neutral-500 group-hover:text-neutral-900"
        }`}
      >
        {title}
      </h3>
      <div className={`flex-1 h-px ml-4 transition-colors duration-300 ${theme ? "bg-gray-800 group-hover:bg-gray-700" : "bg-neutral-200 group-hover:bg-neutral-300"}`} />
    </div>
  );
}

const TextField: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
  type?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  theme: boolean;
}> = ({ icon, label, value, type = "text", onChange, theme }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleContainerClick = () => {
    inputRef.current?.focus();
  };

  return (
    <label className="block group">
      <span
        className={`text-xs font-bold uppercase tracking-wider transition-colors duration-300 ${
          theme ? "text-gray-400 group-focus-within:text-blue-400 group-hover:text-blue-300" : "text-neutral-500 group-focus-within:text-red-600 group-hover:text-red-500"
        }`}
      >
        {label}
      </span>
      <div
        onClick={handleContainerClick}
        className={`mt-2 flex items-center gap-4 rounded-xl border px-4 py-4 transition-all duration-300 cursor-text shadow-sm ${
          theme
            ? "border-gray-800 bg-gray-950/50 focus-within:border-blue-500/50 focus-within:bg-gray-900/80 focus-within:ring-2 focus-within:ring-blue-500/10 hover:-translate-y-1 hover:border-blue-500/30 hover:bg-gray-900/40 hover:shadow-[0_10px_20px_-5px_rgba(59,130,246,0.15)]"
            : "border-neutral-200 bg-white focus-within:border-red-400 focus-within:ring-2 focus-within:ring-red-600/10 hover:-translate-y-1 hover:border-red-200 hover:shadow-[0_10px_20px_-5px_rgba(220,38,38,0.08)]"
        }`}
      >
        <span
          className={`transition-all duration-300 ${
            theme ? "text-blue-400 group-focus-within:text-blue-300 group-hover:scale-110" : "text-red-500 group-focus-within:text-red-600 group-hover:scale-110"
          }`}
        >
          {icon}
        </span>
        <input
          ref={inputRef}
          type={type}
          value={value}
          onChange={onChange}
          className={`w-full bg-transparent text-base font-semibold outline-none transition-colors ${
            theme ? "text-gray-100 scheme-dark" : "text-neutral-900 scheme-light"
          }`}
        />
      </div>
    </label>
  );
};

/* ===== New Custom Date Field ===== */
const DateField: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
  onChange: (dateStr: string) => void;
  theme: boolean;
}> = ({ icon, label, value, onChange, theme }) => {
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
    if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`; // DD/MM/YYYY
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
  const cellCurrent = theme ? "bg-gray-800 border border-blue-500/50 text-blue-300" : "bg-red-50 border border-red-300 text-red-600";
  const cellDefault = theme ? "hover:bg-gray-800 text-gray-300 hover:text-white" : "hover:bg-neutral-100 text-neutral-800";

  return (
    <div className="block group relative" ref={containerRef}>
      {/* Outer Label matching TextField */}
      <span className={`text-xs font-bold uppercase tracking-wider transition-colors duration-300 block ${
          theme ? "text-gray-400 group-focus-within:text-blue-400 group-hover:text-blue-300" : "text-neutral-500 group-focus-within:text-red-600 group-hover:text-red-500"
        } ${isOpen ? (theme ? "text-blue-400!" : "text-red-600!") : ""}`}
      >
        {label}
      </span>
      
      {/* Input container matching TextField */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`mt-2 flex items-center gap-4 rounded-xl border px-4 py-4 transition-all duration-300 cursor-pointer shadow-sm ${
          theme
            ? "border-gray-800 bg-gray-950/50 hover:-translate-y-1 hover:border-blue-500/30 hover:bg-gray-900/40 hover:shadow-[0_10px_20px_-5px_rgba(59,130,246,0.15)]"
            : "border-neutral-200 bg-white hover:-translate-y-1 hover:border-red-200 hover:shadow-[0_10px_20px_-5px_rgba(220,38,38,0.08)]"
        } ${isOpen ? (theme ? "border-blue-500/50! bg-gray-900/80! ring-2 ring-blue-500/10" : "border-red-400! ring-2 ring-red-600/10") : ""}`}
      >
        <span className={`transition-all duration-300 ${
            theme ? "text-blue-400 group-hover:scale-110" : "text-red-500 group-hover:scale-110"
          } ${isOpen ? "scale-110" : ""}`}
        >
          {icon}
        </span>
        <input
          type="text"
          readOnly
          value={getDisplayDate()}
          placeholder="DD/MM/YYYY"
          className={`w-full bg-transparent text-base font-semibold outline-none cursor-pointer transition-colors ${
            theme ? "text-gray-100 placeholder:text-gray-600" : "text-neutral-900 placeholder:text-neutral-400"
          }`}
        />
      </div>

      {/* Dropdown Calendar UI */}
      <div className={`absolute z-40 mt-3 w-full min-w-70 p-5 border rounded-2xl shadow-2xl transition-all duration-300 origin-top ${
        isOpen ? "opacity-100 scale-100 translate-y-0 visible" : "opacity-0 scale-95 -translate-y-2 invisible"
      } ${theme ? "bg-gray-900 border-gray-800 shadow-black/60" : "bg-white border-neutral-200 shadow-neutral-200/60"}`}>
        
        {view === "days" && (
          <>
            <div className="flex items-center justify-between mb-4">
              <h4 className={`text-sm font-bold flex items-center gap-1 ${theme ? "text-white" : "text-neutral-900"}`}>
                <button type="button" onClick={handleMonthLabelClick} className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${theme ? "hover:bg-gray-800 text-gray-200" : "hover:bg-neutral-100 text-neutral-800"}`}>
                  {months[month]}
                </button>
                <button type="button" onClick={handleYearLabelClick} className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${theme ? "hover:bg-gray-800 text-gray-200" : "hover:bg-neutral-100 text-neutral-800"}`}>
                  {year}
                </button>
              </h4>
              <div className="flex space-x-1">
                <button type="button" onClick={handlePrevMonth} className={`p-1.5 rounded-lg border transition-all cursor-pointer ${theme ? "border-gray-700 bg-gray-800 hover:bg-gray-700 hover:border-gray-600 text-gray-300" : "border-neutral-200 bg-neutral-50 hover:bg-neutral-100 hover:border-neutral-300 text-neutral-600"}`}>
                  <ChevronLeft size={16} />
                </button>
                <button type="button" onClick={handleNextMonth} className={`p-1.5 rounded-lg border transition-all cursor-pointer ${theme ? "border-gray-700 bg-gray-800 hover:bg-gray-700 hover:border-gray-600 text-gray-300" : "border-neutral-200 bg-neutral-50 hover:bg-neutral-100 hover:border-neutral-300 text-neutral-600"}`}>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center mb-2">
              {daysOfWeek.map((d) => (
                <div key={d} className={`text-[10px] font-black uppercase tracking-wider ${theme ? "text-gray-500" : "text-neutral-400"}`}>
                  {d}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1 text-center">
              {blanks.map((_, idx) => <div key={`blank-${idx}`} className="py-2"></div>)}
              {days.map((day) => (
                <button key={day} type="button" onClick={(e) => handleDateClick(day, e)} className={`${cellBase} ${isSelected(day) ? cellSelected : isToday(day) ? cellCurrent : cellDefault}`}>
                  {day}
                </button>
              ))}
            </div>
          </>
        )}

        {view === "months" && (
          <>
            <div className="flex items-center justify-between mb-4">
              <button type="button" onClick={handleYearLabelClick} className={`text-sm font-bold px-2 py-1 rounded-lg transition-colors cursor-pointer ${theme ? "hover:bg-gray-800 text-gray-200" : "hover:bg-neutral-100 text-neutral-800"}`}>
                {year}
              </button>
              <div className="flex space-x-1">
                <button type="button" onClick={(e) => { e.stopPropagation(); setCurrentDate(new Date(year - 1, month, 1)); }} className={`p-1.5 rounded-lg border transition-all cursor-pointer ${theme ? "border-gray-700 bg-gray-800 hover:bg-gray-700 text-gray-300" : "border-neutral-200 bg-neutral-50 hover:bg-neutral-100 text-neutral-600"}`}>
                  <ChevronLeft size={16} />
                </button>
                <button type="button" onClick={(e) => { e.stopPropagation(); setCurrentDate(new Date(year + 1, month, 1)); }} className={`p-1.5 rounded-lg border transition-all cursor-pointer ${theme ? "border-gray-700 bg-gray-800 hover:bg-gray-700 text-gray-300" : "border-neutral-200 bg-neutral-50 hover:bg-neutral-100 text-neutral-600"}`}>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {monthsShort.map((m, idx) => (
                <button key={m} type="button" onClick={(e) => handleMonthSelect(idx, e)} className={`${cellBase} py-3! ${isSelectedMonth(idx) ? cellSelected : isCurrentMonth(idx) ? cellCurrent : cellDefault}`}>
                  {m}
                </button>
              ))}
            </div>
          </>
        )}

        {view === "years" && (
          <>
            <div className="flex items-center justify-between mb-4">
              <h4 className={`text-sm font-bold ${theme ? "text-gray-200" : "text-neutral-800"}`}>
                {yearRangeStart} - {yearRangeStart + 11}
              </h4>
              <div className="flex space-x-1">
                <button type="button" onClick={handlePrevYearRange} className={`p-1.5 rounded-lg border transition-all cursor-pointer ${theme ? "border-gray-700 bg-gray-800 hover:bg-gray-700 text-gray-300" : "border-neutral-200 bg-neutral-50 hover:bg-neutral-100 text-neutral-600"}`}>
                  <ChevronLeft size={16} />
                </button>
                <button type="button" onClick={handleNextYearRange} className={`p-1.5 rounded-lg border transition-all cursor-pointer ${theme ? "border-gray-700 bg-gray-800 hover:bg-gray-700 text-gray-300" : "border-neutral-200 bg-neutral-50 hover:bg-neutral-100 text-neutral-600"}`}>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {yearGrid.map((y) => (
                <button key={y} type="button" onClick={(e) => handleYearSelect(y, e)} className={`${cellBase} py-3! ${isSelectedYear(y) ? cellSelected : isCurrentYear(y) ? cellCurrent : cellDefault}`}>
                  {y}
                </button>
              ))}
            </div>
          </>
        )}

      </div>
    </div>
  );
};

/* ------------------------- Password Field ------------------------- */
const PasswordField: React.FC<{
  label: string;
  value: string;
  show: boolean;
  onToggleShow: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  theme: boolean;
}> = ({ label, value, show, onToggleShow, onChange, theme }) => (
  <label className="block group">
    <span
      className={`text-xs font-bold uppercase tracking-wider transition-colors duration-300 ${
        theme ? "text-gray-400 group-focus-within:text-blue-400 group-hover:text-blue-300" : "text-neutral-500 group-focus-within:text-red-600 group-hover:text-red-500"
      }`}
    >
      {label}
    </span>
    <div
      className={`mt-2 flex items-center gap-4 rounded-xl border px-4 py-4 transition-all duration-300 shadow-sm ${
        theme
          ? "border-gray-800 bg-gray-950/50 focus-within:border-blue-500/50 focus-within:bg-gray-900/80 focus-within:ring-2 focus-within:ring-blue-500/10 hover:-translate-y-1 hover:border-blue-500/30 hover:bg-gray-900/40 hover:shadow-[0_10px_20px_-5px_rgba(59,130,246,0.15)]"
          : "border-neutral-200 bg-white focus-within:border-red-400 focus-within:ring-2 focus-within:ring-red-600/10 hover:-translate-y-1 hover:border-red-200 hover:shadow-[0_10px_20px_-5px_rgba(220,38,38,0.08)]"
      }`}
    >
      <Lock
        size={18}
        className={`shrink-0 transition-all duration-300 ${
          theme ? "text-blue-400 group-focus-within:text-blue-300 group-hover:scale-110" : "text-red-500 group-focus-within:text-red-600 group-hover:scale-110"
        }`}
      />
      <input
        type={show ? "text" : "password"}
        value={value}
        onChange={onChange}
        autoComplete="new-password"
        className={`w-full bg-transparent text-base font-semibold outline-none ${
          theme ? "text-gray-100" : "text-neutral-900"
        }`}
      />
      <button
        type="button"
        onClick={onToggleShow}
        className={`cursor-pointer transition-transform duration-300 p-1 hover:scale-110 ${
          theme ? "text-gray-500 hover:text-blue-400" : "text-neutral-400 hover:text-red-500"
        }`}
      >
        {show ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  </label>
);

/* ----------------------------- Main ----------------------------- */

const ProfileSetting: React.FC<ProfileSettingProps> = ({
  user = DEFAULT_USER,
  onSaveProfile,
  onChangePassword,
}) => {
  const { theme } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    suid: user.suid,
    username: user.username,
    fullName: user.fullName,
    birthDate: user.birthDate,
    joinedDate: user.joinedDate,
    avatarUrl: user.avatarUrl || "",
  });

  useEffect(() => {
    if (user === DEFAULT_USER) {
      const stored = localStorage.getItem("adminData");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setForm((prev) => ({ ...prev, ...parsed }));
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, [user]);
  
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleFormChange = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
    setProfileSaved(false);
  };

  // Custom handler for our new DateField
  const handleDateChange = (key: keyof typeof form) => (dateStr: string) => {
    setForm((prev) => ({ ...prev, [key]: dateStr }));
    setProfileSaved(false);
  };

  const processFile = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setForm((prev) => ({ ...prev, avatarUrl: reader.result as string }));
          setProfileSaved(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    try {
      if (onSaveProfile) {
        await onSaveProfile(form);
      } else {
        const stored = JSON.parse(localStorage.getItem("adminData") || "{}");
        localStorage.setItem("adminData", JSON.stringify({ ...stored, ...form }));
      }
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 3000);
    } finally {
      setSavingProfile(false);
    }
  };

  const [pwd, setPwd] = useState({ current: "", next: "", confirm: "" });
  const [showPwd, setShowPwd] = useState({ current: false, next: false, confirm: false });
  const [pwdError, setPwdError] = useState("");
  const [savingPwd, setSavingPwd] = useState(false);
  const [pwdSaved, setPwdSaved] = useState(false);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwdError("");
    setPwdSaved(false);

    if (!pwd.current || !pwd.next || !pwd.confirm) {
      setPwdError("Please fill in all password fields.");
      return;
    }
    if (pwd.next.length < 8) {
      setPwdError("New password must be at least 8 characters.");
      return;
    }
    if (pwd.next !== pwd.confirm) {
      setPwdError("New password and confirm password do not match.");
      return;
    }
    if (pwd.next === pwd.current) {
      setPwdError("New password must be different from the current password.");
      return;
    }

    setSavingPwd(true);
    try {
      if (onChangePassword) {
        await onChangePassword({ currentPassword: pwd.current, newPassword: pwd.next });
      }
      setPwdSaved(true);
      setPwd({ current: "", next: "", confirm: "" });
      setTimeout(() => setPwdSaved(false), 3000);
    } catch {
      setPwdError("Failed to update password. Please check your current password.");
    } finally {
      setSavingPwd(false);
    }
  };

  const initial = form.fullName?.charAt(0)?.toUpperCase() || "U";

  return (
    <div
      className={`w-full h-full p-4 sm:p-8 transition-all duration-300 ${
        theme ? "bg-[#0B1120] text-white" : "bg-white text-neutral-900"
      }`}
    >
      {/* ===== Premium Header ===== */}
      <div className={`mb-10 pb-6 border-b transition-colors duration-300 ${theme ? "border-gray-800/70" : "border-neutral-200/70"}`}>
          <h2 className={`text-3xl lg:text-4xl font-bold tracking-tight ${theme ? "text-white" : "text-neutral-900"}`}>
            Account Settings
          </h2>
          <p className={`text-sm sm:text-base mt-2 font-medium tracking-wide ${theme ? "text-gray-400/90" : "text-neutral-500"}`}>
            Manage your profile details and security preferences seamlessly.
          </p>
      </div>

      {/* ===== Main Content ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: Avatar & Quick Info */}
        <div className={`lg:col-span-4 h-max lg:sticky lg:top-4 flex flex-col items-center text-center p-6 rounded-3xl border transition-all duration-300 group-card ${
          theme 
            ? "border-transparent bg-gray-950/10 hover:border-gray-800 hover:bg-gray-950/30 hover:shadow-[0_15px_35px_-10px_rgba(0,0,0,0.3)] hover:-translate-y-1" 
            : "border-transparent bg-neutral-50/40 hover:border-neutral-200 hover:bg-neutral-50/80 hover:shadow-[0_15px_35px_-10px_rgba(0,0,0,0.05)] hover:-translate-y-1"
        }`}>
          <div 
            className="relative group cursor-pointer"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={triggerFileInput}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/*" 
              className="hidden" 
            />

            <div
              className={`relative flex h-32 w-32 items-center justify-center overflow-hidden rounded-full text-5xl font-black shadow-xl ring-4 transition-all duration-500 ${
                isDragging 
                  ? "ring-emerald-500 scale-105 bg-emerald-500/10" 
                  : theme
                  ? "bg-linear-to-tr from-gray-800 to-gray-700 text-blue-300 ring-gray-800/50 group-hover:ring-blue-500/40 group-hover:shadow-[0_0_25px_rgba(59,130,246,0.2)]"
                  : "bg-linear-to-tr from-neutral-100 to-white text-red-600 ring-neutral-100 group-hover:ring-red-500/30 group-hover:shadow-[0_0_25px_rgba(220,38,38,0.15)]"
              }`}
            >
              {form.avatarUrl ? (
                <img src={form.avatarUrl} alt={form.fullName} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
              ) : (
                initial
              )}
              
              {/* Hover Overlay for Camera */}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Camera size={32} className="text-white drop-shadow-md" />
              </div>
            </div>
          </div>
          <h2 className={`mt-6 text-2xl font-black tracking-tight transition-colors duration-300 ${theme ? "text-gray-50 group-hover:text-white" : "text-neutral-900 group-hover:text-neutral-950"}`}>
            {form.fullName}
          </h2>
          <p className={`text-base font-medium mt-1 transition-colors duration-300 ${theme ? "text-blue-400/80 group-hover:text-blue-400" : "text-red-500/80 group-hover:text-red-600"}`}>
            @{form.username}
          </p>
          
          <span
            className={`mt-5 inline-flex items-center gap-2 rounded-full px-5 py-2 text-xs font-black tracking-widest uppercase shadow-sm transition-all duration-300 ${
              theme
                ? "bg-blue-500/10 text-blue-300 border border-blue-500/20 hover:bg-blue-500/20 hover:border-blue-500/40"
                : "bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 hover:border-red-300"
            }`}
          >
            <ShieldCheck size={16} /> {user.roleLabel}
          </span>
        </div>

        {/* Right Column: Editable Forms */}
        <div className="lg:col-span-8 space-y-12">
          
          {/* Account Details Form */}
          <section>
            <SectionHeading icon={<User size={18} />} title="Profile Information" theme={theme} />
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              
              <TextField
                icon={<Hash size={18} />}
                label="User ID (System ID)"
                value={form.suid}
                onChange={handleFormChange("suid")}
                theme={theme}
              />
              <TextField
                icon={<AtSign size={18} />}
                label="Username"
                value={form.username}
                onChange={handleFormChange("username")}
                theme={theme}
              />
              <TextField
                icon={<User size={18} />}
                label="Full Name"
                value={form.fullName}
                onChange={handleFormChange("fullName")}
                theme={theme}
              />
              
              {/* ===== New Custom DateFields Used Here ===== */}
              <DateField
                icon={<Gift size={18} />}
                label="Birthdate"
                value={form.birthDate}
                onChange={handleDateChange("birthDate")}
                theme={theme}
              />
              <DateField
                icon={<Calendar size={18} />}
                label="Joined Date"
                value={form.joinedDate}
                onChange={handleDateChange("joinedDate")}
                theme={theme}
              />
            </div>

            <div className={`mt-8 flex items-center gap-5 pt-6 border-t transition-colors duration-300 ${theme ? "border-gray-800/80" : "border-neutral-200"}`}>
              <button
                onClick={handleSaveProfile}
                disabled={savingProfile}
                className={`rounded-xl px-8 py-3.5 text-base font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-xl disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:scale-100 cursor-pointer ${
                  theme
                    ? "bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 shadow-blue-900/30 hover:shadow-blue-500/20"
                    : "bg-linear-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 shadow-red-600/20 hover:shadow-red-500/30"
                }`}
              >
                {savingProfile ? "Saving..." : "Save Changes"}
              </button>
              {profileSaved && (
                <span className={`flex items-center gap-2 text-base font-bold px-4 py-3 rounded-xl transition-all duration-500 animate-in fade-in slide-in-from-left-4 ${theme ? "bg-emerald-500/10 text-emerald-400" : "bg-emerald-50 text-emerald-600"}`}>
                  <Check size={20} className="animate-bounce" /> Updated
                </span>
              )}
            </div>
          </section>

          {/* Security Form */}
          <section>
            <SectionHeading icon={<ShieldCheck size={18} />} title="Security & Password" theme={theme} />
            <form onSubmit={handlePasswordSubmit} className="space-y-6">
              
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <PasswordField
                  label="Current Password"
                  value={pwd.current}
                  show={showPwd.current}
                  onToggleShow={() => setShowPwd((p) => ({ ...p, current: !p.current }))}
                  onChange={(e) => setPwd((p) => ({ ...p, current: e.target.value }))}
                  theme={theme}
                />
                <PasswordField
                  label="New Password"
                  value={pwd.next}
                  show={showPwd.next}
                  onToggleShow={() => setShowPwd((p) => ({ ...p, next: !p.next }))}
                  onChange={(e) => setPwd((p) => ({ ...p, next: e.target.value }))}
                  theme={theme}
                />
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <PasswordField
                  label="Confirm New Password"
                  value={pwd.confirm}
                  show={showPwd.confirm}
                  onToggleShow={() => setShowPwd((p) => ({ ...p, confirm: !p.confirm }))}
                  onChange={(e) => setPwd((p) => ({ ...p, confirm: e.target.value }))}
                  theme={theme}
                />
              </div>

              {pwdError && (
                <div role="alert" className={`flex items-start gap-3 p-4 rounded-xl text-sm font-semibold border shadow-sm w-fit animate-in fade-in slide-in-from-top-2 ${
                  theme ? "bg-red-500/10 text-red-400 border-red-500/20" : "bg-red-50 text-red-700 border-red-200"
                }`}>
                  <span className="mt-0.5 shrink-0 bg-red-500/20 text-red-500 rounded-full h-5 w-5 flex items-center justify-center">!</span>
                  <span>{pwdError}</span>
                </div>
              )}
              
              {pwdSaved && (
                <p className={`flex w-max items-center gap-2 text-sm font-bold px-5 py-3.5 rounded-xl border shadow-sm animate-in fade-in slide-in-from-top-2 ${theme ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-emerald-50 text-emerald-600 border-emerald-200"}`}>
                  <Check size={20} /> Password updated successfully
                </p>
              )}

              <div className={`pt-6 border-t mt-8 transition-colors duration-300 ${theme ? "border-gray-800/80" : "border-neutral-200"}`}>
                <button
                  type="submit"
                  disabled={savingPwd}
                  className={`flex items-center gap-3 rounded-xl px-8 py-3.5 text-base font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-xl disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:scale-100 cursor-pointer ${
                    theme
                      ? "bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 shadow-blue-900/30 hover:shadow-blue-500/20 border border-transparent"
                      : "bg-linear-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 shadow-red-600/20 hover:shadow-red-500/30 border border-transparent"
                  }`}
                >
                  <Lock size={18} className="transition-transform duration-300 group-hover:rotate-12" />
                  {savingPwd ? "Updating..." : "Update Password"}
                </button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetting;