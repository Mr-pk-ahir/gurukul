import { useState } from "react";
import { motion } from "framer-motion";
import type { IconType } from "react-icons"; // 🎯 FIX: react-icons vaprva mate (FaSave, FaTrashAlt)
import { useTheme } from "../theme/ThemeContext";

export interface ButtonGroupItem {
    key: string;
    label: string;
    icon?: IconType;
    onClick: () => void;
    disabled?: boolean;
}

interface ButtonGroupProps {
    buttons: ButtonGroupItem[];
    defaultActiveKey?: string;
    className?: string;
}

export default function ButtonGroup({ buttons, defaultActiveKey, className = "" }: ButtonGroupProps) {
    const { theme } = useTheme();

    // 🎯 Je button par click thay e j active (theme color) thay
    const [activeKey, setActiveKey] = useState<string | undefined>(defaultActiveKey);

    const focusRingClass = theme
        ? "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B1120]"
        : "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white";

    const handleClick = (item: ButtonGroupItem) => {
        setActiveKey(item.key);
        item.onClick();
    };

    return (
        <div
            className={`flex items-center gap-2 rounded-xl border p-1 shadow-sm transition-all duration-300 ${theme
                ? "border-slate-800 bg-[#151D2F]/80 backdrop-blur-md"
                : "border-slate-200 bg-white/80 backdrop-blur-md"
                } ${className}`}
        >
            {buttons.map((item) => {
                const { key, label, icon: Icon, disabled } = item;
                const isActive = activeKey === key;

                return (
                    <motion.button
                        key={key}
                        whileHover={disabled ? undefined : { scale: 1.03 }}
                        whileTap={disabled ? undefined : { scale: 0.97 }}
                        type="button"
                        onClick={() => handleClick(item)}
                        disabled={disabled}
                        className={`flex h-10 items-center gap-2 rounded-lg px-5 text-sm font-bold transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50 ${isActive
                            ? theme
                                ? "bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]"
                                : "bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.4)]"
                            : theme
                                ? "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                                : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                            } ${focusRingClass}`}
                    >
                        {Icon && <Icon size={16} />}
                        {label}
                    </motion.button>
                );
            })}
        </div>
    );
}