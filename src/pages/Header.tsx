import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiOutlineMenuAlt2, HiOutlineBell } from "react-icons/hi";
import { useTheme } from "../components/theme/ThemeContext";
import ThemeToggle from "../components/theme/ThemeToggle";
import NotificationBox from "../components/Notification/NotificationBox"; // NotificationBox ઇમ્પોર્ટ કર્યું
import ProfilePopup, { type ProfileUser } from "../components/Profile-Popup/Profile-Popup"; // પ્રિમિયમ પ્રોફાઈલ પોપઅપ

interface HeaderProps {
    toggleSidebar: () => void;
}

export default function Header({ toggleSidebar }: HeaderProps) {
    const { theme } = useTheme(); // ડાર્ક/લાઇટ થીમ લેવા માટે
    const navigate = useNavigate();
    const adminData = JSON.parse(localStorage.getItem("adminData") || '{"username": "Admin"}');

    const [isNotifOpen, setIsNotifOpen] = useState<boolean>(false);

    // localStorage ના adminData ને ProfilePopup ના ProfileUser format માં map કર્યું.
    // જે field adminData માં ન હોય તેના માટે safe fallback રાખ્યો છે.
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

                    <ProfilePopup
                        user={profileUser}
                        onLogout={handleLogout}
                        profilePath="/Dashboard/Profile"
                        settingsPath="/Dashboard/Profile-Settings"
                    />
                
            </div>
        </header>
    );
}