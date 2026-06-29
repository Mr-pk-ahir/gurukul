import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiOutlineMenuAlt2, HiOutlineBell } from "react-icons/hi";
import { useTheme } from "../components/theme/ThemeContext";
import ThemeToggle from "../components/theme/ThemeToggle";
import NotificationBox from "../components/Notification/NotificationBox";
import EventCalendarPopup, { eventsData } from "../components/Event-Calendar/Event-Calendar";
import ProfilePopup, { type ProfileUser } from "../components/Profile-Popup/Profile-Popup";

interface HeaderProps {
    toggleSidebar: () => void;
}

export default function Header({ toggleSidebar }: HeaderProps) {
    const { theme } = useTheme();
    const navigate = useNavigate();
    const adminData = JSON.parse(localStorage.getItem("adminData") || '{"username": "Admin"}');

    const [isNotifOpen, setIsNotifOpen] = useState<boolean>(false);
    const [isEventCalendarOpen, setIsEventCalendarOpen] = useState<boolean>(false);

    const profileUser: ProfileUser = {
        suid: adminData.suid ?? adminData.id ?? "-",
        fullName: adminData.fullName ?? adminData.username ?? "Admin",
        username: adminData.username ?? "-",
        joinedDate: adminData.joinedDate ?? "-",
        birthDate: adminData.birthDate ?? "-",
        roleLabel: adminData.role ?? adminData.roleLabel ?? "SUPER_ADMIN",
        avatarUrl: adminData.avatarUrl,
    };

    const handleLogout = () => {
        localStorage.removeItem("adminData");
        localStorage.removeItem("token");
        navigate("/login");
    };

    // આજના દિવસ અને મહિનાની માહિતી મેળવવા
    const currentDate = new Date();
    const dayNumber = currentDate.getDate().toString().padStart(2, '0');
    const monthShort = currentDate.toLocaleString('en-US', { month: 'short' }).toUpperCase();

    // આજની તારીખને 'YYYY-MM-DD' ફોર્મેટમાં ફેરવીને ઇવેન્ટ ડેટા ચેક કરવા
    const yearStr = currentDate.getFullYear();
    const monthStr = String(currentDate.getMonth() + 1).padStart(2, '0');
    const dateStr = String(currentDate.getDate()).padStart(2, '0');
    const todayStr = `${yearStr}-${monthStr}-${dateStr}`;

    // ઇવેન્ટ કે તિથિ છે કે નહિ તે ચેક કરો
    const todayEvent = eventsData ? eventsData[todayStr] : null;

    return (
        <header className={`h-18 border-b flex items-center justify-between px-4 sm:px-6 sticky top-0 z-20 shadow-sm transition-colors duration-300 ${theme ? "bg-[#0f172a]/95 backdrop-blur-xl border-slate-800 text-white" : "bg-white border-slate-200 text-slate-800"
            }`}>

            <div className="flex items-center gap-4">
                <button
                    onClick={toggleSidebar}
                    className={`p-2 rounded-lg md:hidden transition-colors cursor-pointer ${theme ? "bg-slate-800 text-slate-300 hover:bg-slate-700" : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                        }`}
                >
                    <HiOutlineMenuAlt2 className="text-2xl" />
                </button>

                <h1 className={`text-lg sm:text-2xl font-black hidden sm:block tracking-wide ${theme ? "text-white" : "text-slate-800"
                    }`}>
                    GURUKUL
                </h1>
            </div>

            <div className="flex items-center gap-3 sm:gap-5 h-full">

                {/* --- Minimal Luxury Event Calendar Button --- */}
                <div className="relative flex items-center">
                    <button
                        onClick={() => { setIsEventCalendarOpen(!isEventCalendarOpen); setIsNotifOpen(false); }}
                        className={`group relative flex items-center justify-center h-9.5 px-3.5 rounded-xl border transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md hover:scale-[1.03] ${theme
                                ? "bg-slate-800/90 border-slate-700/80 hover:border-slate-500 hover:bg-slate-800"
                                : "bg-slate-50 border-slate-200 hover:border-slate-300 hover:bg-white"
                            }`}
                    >
                        {/* Date | Month Layout */}
                        <div className="flex items-center">
                            {/* અહીં તારીખના રંગમાં ફેરફાર કર્યો છે */}
                            <span className={`text-[17px] font-black leading-none tracking-tight transition-colors ${theme ? "text-blue-500" : "text-red-500"
                                }`}>
                                {dayNumber}
                            </span>

                            {/* Vertical Divider ( | ) */}
                            <span className={`text-[12px] font-light mx-2 ${theme ? "text-slate-600 group-hover:text-slate-500" : "text-slate-300 group-hover:text-slate-400"
                                }`}>
                                |
                            </span>

                            <span className={`text-[11px] font-extrabold tracking-widest leading-none mt-0.5 ${theme ? "text-slate-300 group-hover:text-white" : "text-slate-600 group-hover:text-slate-900"
                                }`}>
                                {monthShort}
                            </span>
                        </div>

                        {/* ડાયનેમિક ડોટ: ઇવેન્ટ (Blue) અથવા તિથિ (Green) */}
                        {todayEvent && (
                            <span className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full border-2 animate-pulse ${theme ? "border-slate-800" : "border-white"
                                } ${todayEvent.category === 'event'
                                    ? "bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.9)]"
                                    : "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.9)]"
                                }`}></span>
                        )}
                    </button>

                    {/* Calendar Popup Component */}
                    <EventCalendarPopup
                        isOpen={isEventCalendarOpen}
                        onClose={() => setIsEventCalendarOpen(false)}
                    />
                </div>

                {/* --- Notification Bell --- */}
                <div className="relative flex items-center">
                    <button
                        onClick={() => { setIsNotifOpen(!isNotifOpen); setIsEventCalendarOpen(false); }}
                        className={`p-2.5 duration-300 cursor-pointer rounded-xl border transition-colors relative shadow-sm ${theme
                                ? "bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-blue-200"
                                : "bg-slate-50 border-slate-200 text-slate-500 hover:bg-white hover:text-red-500"
                            }`}
                    >
                        <HiOutlineBell className="text-[20px]" />
                        <span className={`absolute top-2 right-2.5 w-2 h-2 rounded-full border ${theme ? "bg-blue-400 border-slate-800" : "bg-red-500 border-white"
                            }`}></span>
                    </button>

                    <NotificationBox
                        isOpen={isNotifOpen}
                        onClose={() => setIsNotifOpen(false)}
                    />
                </div>

                <ThemeToggle />

                <div className={`h-7 w-px hidden sm:block ${theme ? "bg-slate-700" : "bg-slate-200"}`} />

                <ProfilePopup
                    user={profileUser}
                    onLogout={handleLogout}
                    profilePath="/dashboard/profile"
                    settingsPath="/dashboard/settings/profile"
                />
            </div>
        </header>
    );
}