import type { ReactNode } from "react";
import { useTheme } from "../theme/ThemeContext";

type ColorScheme = "red" | "blue" | "green" | "purple" | "amber";

interface StatCardProps {
    label: string;
    value: number | string;
    subLabel: string;
    icon: ReactNode;
    colorScheme: ColorScheme;
    loading?: boolean;
}

const COLOR_MAP: Record<ColorScheme, { iconBgDark: string; iconBgLight: string; iconTextDark: string; iconTextLight: string; barFrom: string; barTo: string; subDark: string; subLight: string }> = {
    red: {
        iconBgDark: "bg-red-500/10",
        iconBgLight: "bg-[#9b001c]/10",
        iconTextDark: "text-red-400",
        iconTextLight: "text-[#9b001c]",
        barFrom: "from-red-600/60",
        barTo: "to-red-500/10",
        subDark: "text-emerald-400",
        subLight: "text-emerald-600",
    },
    blue: {
        iconBgDark: "bg-blue-500/10",
        iconBgLight: "bg-blue-500/10",
        iconTextDark: "text-blue-300",
        iconTextLight: "text-blue-600",
        barFrom: "from-blue-600/60",
        barTo: "to-blue-500/10",
        subDark: "text-emerald-400",
        subLight: "text-emerald-600",
    },
    green: {
        iconBgDark: "bg-emerald-500/10",
        iconBgLight: "bg-emerald-500/10",
        iconTextDark: "text-emerald-400",
        iconTextLight: "text-emerald-600",
        barFrom: "from-emerald-600/60",
        barTo: "to-emerald-500/10",
        subDark: "text-emerald-400",
        subLight: "text-emerald-600",
    },
    purple: {
        iconBgDark: "bg-purple-500/10",
        iconBgLight: "bg-purple-500/10",
        iconTextDark: "text-purple-400",
        iconTextLight: "text-purple-600",
        barFrom: "from-purple-600/60",
        barTo: "to-purple-500/10",
        subDark: "text-emerald-400",
        subLight: "text-emerald-600",
    },
    amber: {
        iconBgDark: "bg-amber-500/10",
        iconBgLight: "bg-amber-500/10",
        iconTextDark: "text-amber-400",
        iconTextLight: "text-amber-600",
        barFrom: "from-amber-600/60",
        barTo: "to-amber-500/10",
        subDark: "text-emerald-400",
        subLight: "text-emerald-600",
    },
};

export default function StatCard({ label, value, subLabel, icon, colorScheme, loading }: StatCardProps) {
    const { theme } = useTheme();
    const c = COLOR_MAP[colorScheme];

    return (
        <div
            className={`rounded-2xl border p-5 transition-colors ${
                theme ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"
            }`}
        >
            <div className="flex items-start justify-between">
                <span className={`text-xs font-bold tracking-wide uppercase ${theme ? "text-gray-500" : "text-gray-400"}`}>
                    {label}
                </span>
                <span
                    className={`flex items-center justify-center w-9 h-9 rounded-xl shrink-0 ${
                        theme ? `${c.iconBgDark} ${c.iconTextDark}` : `${c.iconBgLight} ${c.iconTextLight}`
                    }`}
                >
                    {icon}
                </span>
            </div>

            <div className="flex items-end justify-between mt-5">
                <div>
                    {loading ? (
                        <div className={`h-9 w-14 rounded-lg animate-pulse ${theme ? "bg-gray-800" : "bg-gray-100"}`} />
                    ) : (
                        <p className={`text-4xl font-black leading-none ${theme ? "text-white" : "text-gray-900"}`}>{value}</p>
                    )}
                    <p className={`text-xs font-semibold mt-2 ${theme ? c.subDark : c.subLight}`}>{subLabel}</p>
                </div>

                <div
                    className={`h-10 w-24 rounded-md bg-linear-to-r ${c.barFrom} ${c.barTo}`}
                    aria-hidden
                />
            </div>
        </div>
    );
}