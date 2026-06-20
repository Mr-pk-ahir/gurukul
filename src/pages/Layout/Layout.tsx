import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar";
import Header from "../Header";
import { useTheme } from "../../components/theme/ThemeContext";

export default function Layout() {
    const { theme } = useTheme(); // { theme } ડી-સ્ટ્રક્ચર કરવું જરૂરી છે

    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsMobileSidebarOpen((prev) => !prev);
    };

    return (
        <div className={`min-h-screen flex font-sans transition-colors duration-300 ${theme ? 'bg-gray-900 text-gray-50' : 'bg-gray-50 text-gray-800'}`}>

            <Sidebar isOpen={isMobileSidebarOpen} setIsOpen={setIsMobileSidebarOpen} />

            <div className={`flex-1 flex flex-col min-w-0 transition-colors duration-300 ${theme ? 'bg-gray-900 text-gray-50' : 'bg-gray-50 text-gray-800'}`}>
                <Header toggleSidebar={toggleSidebar} />

                <main className="flex-1 p-6 md:p-3 w-full mx-auto overflow-y-auto">
                    <div className={`w-full h-full rounded-2xl p-6 transition-colors duration-300 ${theme
                            ? 'bg-gray-900 text-gray-50 border-gray-800'
                            : 'bg-white text-gray-800 border-gray-100'
                        }`}>
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}