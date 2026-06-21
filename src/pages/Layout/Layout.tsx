import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar";
import Header from "../Header";
import { useTheme } from "../../components/theme/ThemeContext";

export default function Layout() {
    const { theme } = useTheme(); // true = Dark, false = Light

    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsMobileSidebarOpen((prev) => !prev);
    };

    return (
        /* મિમેચ અટકાવવા માટે min-h-screen કાઢીને h-screen અને overflow-hidden કર્યું */
        <div className={`h-screen w-screen flex font-sans overflow-hidden transition-colors duration-300 ${
            theme ? 'bg-gray-900 text-gray-50' : 'bg-gray-50 text-gray-800'
        }`}>

            {/* સાઇડબાર કમ્પોનન્ટ */}
            <Sidebar isOpen={isMobileSidebarOpen} setIsOpen={setIsMobileSidebarOpen} />

            {/* મેઈન કન્ટેન્ટ કન્ટેનર */}
            <div className={`flex-1 flex flex-col min-w-0 h-full overflow-hidden transition-colors duration-300 ${
                theme ? 'bg-gray-900 text-gray-50' : 'bg-gray-50 text-gray-800'
            }`}>
                
                {/* હેડર (ટોપબાર) */}
                <Header toggleSidebar={toggleSidebar} />

                {/* આ મેઈન સેક્શન જ ફક્ત સ્ક્રોલ થશે, આખા બ્રાઉઝરમાં સ્ક્રોલબાર નહીં દેખાય */}
                <main className="flex-1 p-6 md:p-3 w-full mx-auto overflow-y-auto no-scrollbar">
                    <div className={`w-full min-h-full rounded-2xl p-6 border transition-colors duration-300 ${
                        theme
                            ? 'bg-gray-900 text-gray-50 border-gray-800'
                            : 'bg-white text-gray-800 border-gray-100'
                    }`}>
                        {/* અહીં તમારા બધા પેજીસ (જેમ કે CreateUserForm) લોડ થશે */}
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}