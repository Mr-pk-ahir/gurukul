import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../theme/ThemeContext";
import { HiChevronDown } from "react-icons/hi";
import SidebarHoverMenu from "./SidebarHoverMenu";

interface SubItem {
    name: string;
    path: string;
    icon?: React.ReactNode;
}

interface DropdownProps {
    title: string;
    icon: React.ReactNode;
    items: SubItem[];
    setSidebarOpen: (isOpen: boolean) => void;
    isMiniSidebar: boolean;
}

export default function SidebarDropdown({ title, icon, items, setSidebarOpen, isMiniSidebar }: DropdownProps) {
    const { theme } = useTheme(); 
    const navigate = useNavigate();
    const location = useLocation();

    const isChildActive = items.some(item => location.pathname.includes(item.path));
    const [isOpen, setIsOpen] = useState(isChildActive && !isMiniSidebar);

    const [isHovered, setIsHovered] = useState(false);
    const [menuTop, setMenuTop] = useState<number>(0);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isMiniSidebar) {
            setIsOpen(false);
            setIsHovered(false);
        } else if (isChildActive) {
            setIsOpen(true);
        }
    }, [isMiniSidebar, isChildActive]);

    const handleMouseEnter = () => {
        if (isMiniSidebar && menuRef.current) {
            const rect = menuRef.current.getBoundingClientRect();
            setMenuTop(rect.top);
            setIsHovered(true);
        }
    };

    const handleMouseLeave = () => {
        if (isMiniSidebar) {
            setIsHovered(false);
        }
    };

    return (
        <div
            className="w-full relative cursor-pointer"
            ref={menuRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* --- ડ્રોપડાઉન મેઇન બટન --- */}
            <button
                onClick={() => {
                    if (!isMiniSidebar) {
                        setIsOpen(!isOpen);
                    }
                }}
                title={isMiniSidebar ? title : ""}
                className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl font-semibold text-[15px] transition-all duration-200 group
                    ${isMiniSidebar ? "justify-center px-2" : ""}
                    ${
                        isChildActive
                            ? theme 
                                ? "bg-blue-200 text-gray-900" 
                                : "bg-red-50 text-red-600"
                            : theme 
                                ? "text-white hover:bg-gray-800 hover:text-blue-200" 
                                : "text-gray-500 hover:bg-red-50 hover:text-red-600"
                    }
                `}
            >
                <div className="flex items-center gap-3.5">
                    <span className={`transition-colors ${
                        isChildActive 
                            ? theme ? "text-gray-900" : "text-red-600" 
                            : theme ? "text-gray-400 group-hover:text-blue-200" : "text-gray-400 group-hover:text-red-600"
                    }`}>
                        {icon}
                    </span>
                    {!isMiniSidebar && title}
                </div>

                {!isMiniSidebar && (
                    <HiChevronDown className={`text-lg transition-transform duration-300 ${isOpen ? "rotate-180" : ""} ${
                        isChildActive 
                            ? theme ? "text-gray-900" : "text-red-600" 
                            : theme ? "text-gray-400" : "text-gray-400"
                    }`} />
                )}
            </button>

            {/* --- સબ-મેનુ આઇટમ્સ (Accordion) --- */}
            <div className={`overflow-hidden transition-all duration-300 ${isOpen && !isMiniSidebar ? "max-h-[500px] mt-1" : "max-h-0"}`}>
                <div className="pl-12 space-y-1">
                    {items.map((sub, index) => {
                        const isActive = location.pathname === sub.path;
                        return (
                            <button
                                key={index}
                                onClick={() => {
                                    navigate(sub.path);
                                    setSidebarOpen(false);
                                }}
                                className={`w-full flex items-center justify-start gap-3.5 text-left px-3 py-2 rounded-xl text-[13px] font-semibold transition-all cursor-pointer
                                    ${
                                        isActive
                                            ? theme 
                                                ? "bg-blue-200/20 text-blue-200 font-bold" 
                                                : "bg-red-50 text-red-600 font-bold"
                                            : theme 
                                                ? "text-gray-400 hover:bg-gray-800 hover:text-blue-200" 
                                                : "text-gray-600 hover:bg-gray-50 hover:text-red-600"
                                    }
                                `}
                            >
                                <span className={`text-lg transition-colors ${
                                    isActive 
                                        ? theme ? "text-blue-200" : "text-red-600"
                                        : theme ? "text-gray-400" : "text-gray-400"
                                }`}>
                                    {sub.icon}
                                </span>
                                {sub.name}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* --- મિની સાઇડબાર માટેનું હોવર મેનુ --- */}
            {isMiniSidebar && isHovered && (
                <SidebarHoverMenu
                    title={title}
                    items={items}
                    setIsOpen={setSidebarOpen}
                    parentTop={menuTop}
                />
            )}
        </div>
    );
}