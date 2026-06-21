import React, { useState } from "react";
import { HiOutlineMenuAlt2, HiOutlineBell } from "react-icons/hi";
import { useTheme } from "../components/theme/ThemeContext";
import ThemeToggle from "../components/theme/ThemeToggle";
import NotificationBox from "../components/Notification/NotificationBox"; // NotificationBox ઇમ્પોર્ટ કર્યું

interface HeaderProps {
    toggleSidebar: () => void;
}

export default function Header({ toggleSidebar }: HeaderProps) {
    const { theme } = useTheme(); // ડાર્ક/લાઇટ થીમ લેવા માટે
    const adminData = JSON.parse(localStorage.getItem("adminData") || '{"username": "Admin"}');
    
    const [isNotifOpen, setIsNotifOpen] = useState<boolean>(false);

    return (
        <header className={`h-18 border-b flex items-center justify-between px-4 sm:px-6 sticky top-0 z-20 shadow-sm transition-colors duration-300 ${
            theme 
                ? "bg-gray-900 border-gray-800 text-white" 
                : "bg-white border-gray-200 text-gray-800"
        }`}>
            
            <div className="flex items-center gap-4">
                <button 
                    onClick={toggleSidebar}
                    className={`p-2 rounded-lg md:hidden transition-colors cursor-pointer ${
                        theme 
                            ? "bg-gray-800 text-gray-300 hover:bg-gray-700" 
                            : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                    }`}
                >
                    <HiOutlineMenuAlt2 className="text-2xl" />
                </button>
                
                <h1 className={`text-lg sm:text-2xl font-extrabold hidden sm:block tracking-wide ${
                    theme ? "text-white" : "text-gray-800"
                }`}>
                    GURUKUL
                </h1>
            </div>

            <div className="flex items-center gap-3 sm:gap-5">
                
                {/* --- Notification Bell --- */}
                <button 
                    onClick={() => setIsNotifOpen(true)} // ક્લિક ઇવેન્ટ ઉમેરી
                    className={`p-2.5 duration-300 cursor-pointer rounded-xl transition-colors relative ${
                        theme 
                            ? "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-blue-200" 
                            : "bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-600"
                    }`}
                >
                    <HiOutlineBell className="text-xl" />
                    {/* Badge (લાલ/ભૂરું ટપકું) */}
                    <span className={`absolute top-2 right-2.5 w-2 h-2 rounded-full border ${
                        theme ? "bg-blue-200 border-gray-900" : "bg-red-600 border-white"
                    }`}></span>
                </button>
                
                {/* Notification Box Component (અહીં કોલ કર્યું છે) */}
                <NotificationBox 
                    isOpen={isNotifOpen} 
                    onClose={() => setIsNotifOpen(false)} 
                />
                
                <ThemeToggle />

                <div className={`h-8 w-px hidden sm:block ${theme ? "bg-gray-800" : "bg-gray-200"}`} />

                {/* --- Admin Profile Section --- */}
                <div className={`flex items-center gap-3 cursor-pointer p-1.5 pr-3 rounded-2xl transition-colors border border-transparent duration-300 ${
                    theme 
                        ? "bg-gray-800 hover:bg-gray-700 hover:border-gray-700" 
                        : "bg-gray-200 hover:bg-gray-50 hover:border-gray-100"
                }`}>
                    
                    <div className={`h-9 w-9 rounded-full flex items-center justify-center font-bold text-sm shadow-md ${
                        theme ? "bg-blue-200 text-gray-900" : "bg-red-600 text-white"
                    }`}>
                        {adminData.username.charAt(0)}
                    </div>
                    
                    <div className="text-left hidden sm:block">
                        <p className={`text-sm font-bold leading-tight ${theme ? "text-white" : "text-gray-800"}`}>
                            {adminData.username}
                        </p>
                        <p className={`text-[11px] font-bold uppercase tracking-wide mt-0.5 ${
                            theme ? "text-blue-200" : "text-red-500"
                        }`}>
                            Super Admin
                        </p>
                    </div>
                </div>
                
            </div>
        </header>
    );
}