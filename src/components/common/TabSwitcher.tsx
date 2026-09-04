import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { useTheme } from "../theme/ThemeContext";

export interface TabItem<T extends string> {
    key: T;
    label: string;
    icon: LucideIcon;
}

interface TabSwitcherProps<T extends string> {
    tabs: TabItem<T>[];
    activeTab: T;
    onChange: (tab: T) => void;
    className?: string;
}

export default function TabSwitcher<T extends string>({
    tabs,
    activeTab,
    onChange,
    className = "",
}: TabSwitcherProps<T>) {
    const { theme } = useTheme();

    const focusRingClass = theme
        ? "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B1120]"
        : "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white";

    return (
        <div
            className={`flex items-center gap-2 rounded-xl border p-1 shadow-sm transition-all duration-300 ${theme
                ? "border-slate-800 bg-[#151D2F]/80 backdrop-blur-md"
                : "border-slate-200 bg-white/80 backdrop-blur-md"
                } ${className}`}
        >
            {tabs.map(({ key, label, icon: Icon }) => {
                const isActive = activeTab === key;
                return (
                    <motion.button
                        key={key}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        type="button"
                        onClick={() => onChange(key)}
                        className={`flex h-10 items-center gap-2 rounded-lg px-5 text-sm font-bold transition-all duration-300 ${isActive
                            ? theme
                                ? "bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]"
                                : "bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.4)]"
                            : theme
                                ? "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                                : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                            } ${focusRingClass}`}
                    >
                        <Icon size={16} />
                        {label}
                    </motion.button>
                );
            })}
        </div>
    );
}