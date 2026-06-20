import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../theme/ThemeContext"; // તમારી ThemeContext ફાઇલ પાથ અહીં કન્ફર્મ કરી લેવો

interface SubItem {
    name: string;
    path: string;
    icon?: React.ReactNode;
}

interface HoverMenuProps {
    title: string;
    items: SubItem[];
    setIsOpen: (isOpen: boolean) => void;
    parentLeft?: number | null;
    parentTop?: number | null;
}

export default function SidebarHoverMenu({ title, items, setIsOpen, parentTop }: HoverMenuProps) {
    const { theme } = useTheme(); // ડાર્ક/લાઇટ થીમ લેવા માટે
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <div 
            style={{ top: parentTop !== undefined ? `${parentTop}px` : '0px' }}
            className={`fixed left-15 w-48 border rounded-2xl shadow-xl duration-500 p-2 z-9999 flex flex-col space-y-1 transition-colors ${
                theme 
                    ? "bg-gray-900 border-gray-800 text-white" 
                    : "bg-white border-gray-100 text-gray-800"
            }`}
        >
            <div className={`px-3 py-1.5 text-xs font-bold border-b uppercase tracking-wider ${
                theme 
                    ? "text-blue-200 border-gray-800" 
                    : "text-red-600 border-gray-200"
            }`}>
                {title}
            </div>
            {items.map((sub, index) => {
                const isActive = location.pathname === sub.path;
                return (
                    <button
                        key={index}
                        onClick={() => {
                            navigate(sub.path);
                            setIsOpen(false);
                        }}
                        className={`w-full flex items-center justify-start gap-3.5 text-left px-3 py-2 rounded-xl text-[13px] font-semibold transition-all cursor-pointer ${
                            isActive 
                                ? theme 
                                    ? "bg-blue-200/20 text-blue-200 font-bold" 
                                    : "bg-red-50 text-red-600 font-bold" 
                                : theme 
                                    ? "text-gray-300 hover:bg-gray-800 hover:text-blue-200" 
                                    : "text-gray-600 hover:bg-gray-50 hover:text-red-600"
                        }`}
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
    );
}