import { HiOutlineStar } from "react-icons/hi";
import { useTheme } from "../theme/ThemeContext";

interface LevelBadgeProps {
    // 🎯 STATIC FOR NOW: level design pachi decide thashe — abhi hardcoded rakhyu chhe.
    level?: number;
}

export default function LevelBadge({ level = 1 }: LevelBadgeProps) {
    const { theme } = useTheme();

    return (
        <div
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border ${
                theme
                    ? "bg-linear-to-r from-indigo-500/10 to-cyan-500/10 border-indigo-500/20 text-indigo-300"
                    : "bg-linear-to-r from-indigo-50 to-cyan-50 border-indigo-100 text-indigo-600"
            }`}
        >
            <HiOutlineStar className="text-lg" />
            <span className="text-sm font-bold">Level {level}</span>
        </div>
    );
}