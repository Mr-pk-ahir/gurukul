import { useTheme } from "../components/theme/ThemeContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/gurukul.png";

import Navbar from "../components/sidebar/Navbar";
import {
    HiOutlineLogout,
    HiChevronLeft,
    HiChevronRight,
} from "react-icons/hi";

interface SidebarProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
    const { theme } = useTheme(); // theme: true (Dark Mode), false (Light Mode)
    const navigate = useNavigate();

    const [isCollapsed, setIsCollapsed] = useState(false);
    const isMiniSidebar = isCollapsed && window.innerWidth >= 768;

    const handleLogout = () => {
        localStorage.removeItem("adminData");
        navigate("/login");
    };

    return (
        <>
            <aside
                onClick={(e) => e.stopPropagation()}
                className={`fixed inset-y-0 left-0 z-50 flex flex-col transition-all duration-300 md:translate-x-0 md:relative 
                    ${isOpen ? "translate-x-0" : "-translate-x-full"} 
                    ${isMiniSidebar ? "w-22" : "w-65"} 
                    ${theme
                        ? "bg-gray-900 text-white border-r border-gray-800 shadow-[4px_0_24px_rgba(0,0,0,0.5)]"
                        : "bg-white text-gray-800 border-r border-gray-200 shadow-[4px_0_24px_rgba(0,0,0,0.02)]"
                    }`}
            >
                {/* --- હેડર વિભાગ --- */}
                <div className={`flex items-center justify-between h-19 px-4 mb-4 shrink-0 w-full border-b 
                    ${theme ? "border-gray-800" : "border-gray-200"}`}
                >
                    <div className="flex items-center justify-start overflow-hidden flex-1">
                        {!isMiniSidebar ? (
                            /* --- મોટું સાઇડબાર: લોગો + ટેક્સ્ટ --- */
                            <div className="flex items-center gap-3 py-2 animate-fadeIn">
                                <div className={`w-11 h-11 rounded-xl flex items-center justify-center p-1.5 shadow-sm 
                                    ${theme ? "bg-blue-200" : "bg-gradient-to-tr from-red-700 to-red-400"}`}
                                >
                                    <img
                                        src={Logo}
                                        alt="Gurukul Logo"
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                                <div>
                                    <h2 className={`font-extrabold leading-tight text-base tracking-wide 
                                        ${theme ? "text-white" : "text-gray-800"}`}
                                    >
                                        Gurukul
                                    </h2>
                                    <span className={`text-[10px] font-bold uppercase tracking-widest block mt-0.5
                                        ${theme ? "text-blue-200" : "text-red-500"}`}
                                    >
                                        Admin
                                    </span>
                                </div>
                            </div>
                        ) : (
                            /* --- મિની સાઇડબાર: લોગો હોવર ઇફેક્ટ --- */
                            <div className="w-full flex justify-center py-2 animate-fadeIn">
                                <div
                                    onClick={() => setIsCollapsed(false)}
                                    className={`relative w-11 h-11 rounded-xl flex items-center justify-center p-1.5 shadow-sm transition-all duration-300 group cursor-pointer 
                                        ${theme 
                                            ? "bg-blue-200 hover:bg-blue-300" 
                                            : "bg-red-50 hover:bg-red-600"
                                        }`}
                                    title="Expand Sidebar"
                                >
                                    <img
                                        src={Logo}
                                        alt="Gurukul Logo"
                                        className="w-full h-full object-contain transition-opacity duration-300 group-hover:opacity-0"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <HiChevronRight className={`text-xl font-bold ${theme ? "text-gray-400" : "text-white"}`} />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* --- કોલેપ્સ બટન --- */}
                    {!isMiniSidebar && (
                        <button
                            onClick={() => setIsCollapsed(!isCollapsed)}
                            className={`hidden md:flex p-2 ml-2 rounded-xl border transition-all cursor-pointer shadow-sm active:scale-95 
                                ${theme
                                    ? "bg-gray-800 text-blue-200 border-gray-700 hover:bg-blue-200 hover:text-gray-900"
                                    : "bg-gray-50 text-gray-500 border-gray-100 hover:bg-red-50 hover:text-red-600"
                                }`}
                        >
                            <HiChevronLeft size={18} />
                        </button>
                    )}
                </div>

                {/* --- નેવિગેશન મેનુ --- */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar p-3">
                    <nav className="space-y-1.5 relative">
                        <Navbar setSidebarOpen={setIsOpen} isMiniSidebar={isMiniSidebar} />
                    </nav>
                </div>

                {/* --- લોગઆઉટ બટન વિભાગ --- */}
                <div className={`pt-4 mt-auto shrink-0 border-t 
                    ${theme ? "border-gray-800" : "border-gray-100"}`}
                >
                    <button
                        onClick={handleLogout}
                        title={isMiniSidebar ? "Logout" : ""}
                        className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl font-semibold text-[15px] transition-all duration-200 group cursor-pointer 
                            ${isMiniSidebar ? "justify-center px-2" : ""} 
                            ${theme
                                ? "text-gray-300 hover:bg-gray-800 hover:text-blue-200"
                                : "text-gray-500 hover:bg-red-50 hover:text-red-600"
                            }`}
                       >
                        <HiOutlineLogout className={`text-xl transition-colors 
                            ${theme ? "text-gray-400 group-hover:text-blue-200" : "text-gray-400 group-hover:text-red-600"}`}
                        />
                        {!isMiniSidebar && "Logout"}
                    </button>
                </div>
            </aside>

            {/* --- મોબાઈલ ઓવરલે --- */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-40 md:hidden cursor-pointer"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </>
    );
}