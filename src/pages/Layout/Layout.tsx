import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { HiOutlineArrowLeft } from "react-icons/hi";
import Sidebar from "../Sidebar";
import Header from "../Header";
import { useTheme } from "../../components/theme/ThemeContext";
import SkeletonLoader from "../../components/loader/Skeleton";
import { SidebarViewProvider } from "../../context/SidebarViewContext";

export default function Layout() {
    const { theme } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const [isRouteLoading, setIsRouteLoading] = useState(false);

    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

    useEffect(() => {
        setIsRouteLoading(true);

        const timer = window.setTimeout(() => {
            setIsRouteLoading(false);
        }, 200);

        return () => window.clearTimeout(timer);
    }, [location.pathname]);

    const toggleSidebar = () => {
        setIsMobileSidebarOpen((prev) => !prev);
    };

    return (
        <SidebarViewProvider>
            <div className={`h-screen w-screen flex font-sans overflow-hidden transition-colors duration-300 ${theme ? 'bg-gray-900 text-gray-50' : 'bg-gray-50 text-gray-800'
                }`}>

                <Sidebar isOpen={isMobileSidebarOpen} setIsOpen={setIsMobileSidebarOpen} />

                <div className={`flex-1 flex flex-col min-w-0 h-full overflow-hidden transition-colors duration-300 ${theme ? 'bg-gray-900 text-gray-50' : 'bg-gray-50 text-gray-800'
                    }`}>

                    <Header toggleSidebar={toggleSidebar} />

                    <main className="flex-1 p-6 md:p-3 w-full mx-auto overflow-y-auto no-scrollbar">
                        <div className={`w-full min-h-full rounded-2xl p-6 border transition-colors duration-300 ${theme
                                ? 'bg-gray-900 text-gray-50 border-gray-800'
                                : 'bg-white text-gray-800 border-gray-100'
                            }`}>
                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                className={`inline-flex items-center gap-2 mb-5 px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${theme
                                        ? "text-gray-300 hover:bg-gray-800 hover:text-white"
                                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                                    }`}
                            >
                                <HiOutlineArrowLeft className="text-base" />
                                Back
                            </button>

                            {isRouteLoading ? (
                                <div className="space-y-4">
                                    <SkeletonLoader variant="text" rows={3} />
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <SkeletonLoader variant="card" rows={1} />
                                        <SkeletonLoader variant="card" rows={1} />
                                    </div>
                                    <SkeletonLoader variant="table" rows={4} />
                                </div>
                            ) : (
                                <Outlet />
                            )}
                        </div>
                    </main>
                </div>
            </div>
        </SidebarViewProvider>
    );
}