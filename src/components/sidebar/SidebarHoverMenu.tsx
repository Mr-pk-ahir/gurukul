import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../theme/ThemeContext";

interface SubItem {
    name: string;
    path: string;
    icon?: React.ReactNode;
}

interface SidebarHoverMenuProps {
    title: string;
    items: SubItem[];
    setIsOpen: (isOpen: boolean) => void;
    parentTop: number;
}

export default function SidebarHoverMenu({ title, items, setIsOpen, parentTop }: SidebarHoverMenuProps) {
    const { theme } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <div
            style={{ top: parentTop }}
            className={`fixed left-18 z-50 w-56 rounded-2xl border shadow-2xl p-2 ${
                theme
                    ? "bg-gray-900 border-gray-800"
                    : "bg-white border-neutral-100"
            }`}
        >
            <p className={`px-3 py-2 text-xs font-bold uppercase tracking-wider ${
                theme ? "text-gray-500" : "text-neutral-400"
            }`}>
                {title}
            </p>

            <div className="flex flex-col gap-1">
                {items.map((sub, index) => {
                    const isActive = location.pathname === sub.path;
                    return (
                        <button
                            key={index}
                            onClick={() => {
                                navigate(sub.path);
                                setIsOpen(false);
                            }}
                            className={`w-full flex items-center gap-2.5 text-left px-3 py-2.5 rounded-xl text-[13px] font-semibold transition-all cursor-pointer ${
                                isActive
                                    ? theme
                                        ? "bg-linear-to-r from-blue-500 to-blue-200/10 text-blue-200 font-bold"
                                        : "bg-red-50 text-red-600 font-bold"
                                    : theme
                                        ? "text-gray-400 hover:bg-gray-800 hover:text-blue-200"
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
        </div>
    );
}