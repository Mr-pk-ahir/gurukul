import { useState } from "react";
import { useTheme } from "../components/theme/ThemeContext";
import { HiOutlineLibrary, HiOutlineUsers, HiOutlineShieldCheck } from "react-icons/hi";
import {
    AreaChart,
    Area,
    ResponsiveContainer,
} from "recharts";

export default function Dashboard() {
    const { theme } = useTheme();
    const userData = localStorage.getItem("user");
    const username = userData ? JSON.parse(userData).username : "Guest";

    // ફક્ત ટાઇમફ્રેમ સ્ટેટ રાખ્યો છે (sparkline cards ne filter karva mate)
    const [timeFrame, setTimeFrame] = useState<"week" | "month">("month");

    const stats = {
        departmentsCount: 12,
        usersCount: 48,
        rolesCount: 6,
    };

    // ગ્રાફ માટેનો ડાયનેમિક મોક ડેટા
    const graphData = {
        month: [
            { name: "Week 1", department: 2, user: 10, role: 1 },
            { name: "Week 2", department: 5, user: 25, role: 2 },
            { name: "Week 3", department: 3, user: 18, role: 4 },
            { name: "Week 4", department: 12, user: 48, role: 6 },
        ],
        week: [
            { name: "Mon", department: 1, user: 4, role: 1 },
            { name: "Tue", department: 3, user: 8, role: 2 },
            { name: "Wed", department: 2, user: 12, role: 3 },
            { name: "Thu", department: 5, user: 6, role: 3 },
            { name: "Fri", department: 1, user: 15, role: 5 },
            { name: "Sat", department: 0, user: 3, role: 6 },
            { name: "Sun", department: 0, user: 0, role: 6 },
        ],
    };

    const currentChartData = graphData[timeFrame];

    // 🌟 દરેક stat card ની maahiti ek j place ma define — have navo card
    // add karvo hoy to fakt aa array ma entry ઉમેરવી padshe, JSX touch nathi karvanu.
    // `recentItems` have static mock chhe — backend API connect karvanu hoy tyare
    // fakt aa array ne API response thi map kari devu (niche "Backend connect karva mate" note).
    const statCards = [
        {
            key: "department" as const,
            label: "Total Departments",
            value: stats.departmentsCount,
            caption: "Active Modules",
            icon: HiOutlineLibrary,
            color: "#9b001c",
            iconBg: theme ? "bg-red-950/50 text-red-400" : "bg-red-50 text-red-600",
            recentItems: [
                { name: "Academic Main", meta: "Added 2d ago" },
                { name: "Primary Section", meta: "Added 5d ago" },
                { name: "Higher Secondary", meta: "Added 1w ago" },
            ],
        },
        {
            key: "user" as const,
            label: "Total Active Users",
            value: stats.usersCount,
            caption: "Verified Accounts",
            icon: HiOutlineUsers,
            color: "#2563eb",
            iconBg: theme ? "bg-blue-950/50 text-blue-400" : "bg-blue-50 text-blue-600",
            recentItems: [
                { name: "Marakna Priyank", meta: "Joined today" },
                { name: "Ankit Patel", meta: "Joined 3d ago" },
                { name: "Pooja Sharma", meta: "Joined 4d ago" },
            ],
        },
        {
            key: "role" as const,
            label: "Total System Roles",
            value: stats.rolesCount,
            caption: "Configured Permissions",
            icon: HiOutlineShieldCheck,
            color: "#10b981",
            iconBg: theme ? "bg-emerald-950/50 text-emerald-400" : "bg-emerald-50 text-emerald-600",
            recentItems: [
                { name: "Department Head", meta: "6 users" },
                { name: "Teacher / Staff", meta: "22 users" },
                { name: "Student", meta: "20 users" },
            ],
        },
    ];

    // 🌟 Card ni andar background ma vaprai shake evu transparent sparkline —
    // axes/grid/tooltip kashu nathi, fakt ek thin area-fill curve.
    function CardSparkline({
        dataKey,
        color,
    }: {
        dataKey: "department" | "user" | "role";
        color: string;
    }) {
        return (
            <div className="h-16 w-24 sm:h-20 sm:w-28 opacity-60">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={currentChartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id={`spark-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor={color} stopOpacity={0.5} />
                                <stop offset="100%" stopColor={color} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <Area
                            type="monotone"
                            dataKey={dataKey}
                            stroke={color}
                            strokeWidth={2}
                            fillOpacity={1}
                            fill={`url(#spark-${dataKey})`}
                            isAnimationActive={false}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        );
    }

    return (
        <div className={`w-full space-y-8 rounded-2xl p-4 sm:p-6 transition-all duration-300 border ${theme ? "bg-gray-900 text-gray-50 border-gray-800" : "bg-neutral-50 text-neutral-900 border-neutral-200"
            }`}>

            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 border-b pb-4 dark:border-gray-800 border-neutral-200">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
                        Welcome back, <span className={theme ? "text-blue-400" : "text-red-600"}>{username}</span> 👋
                    </h1>
                    <p className={`text-xs mt-1 ${theme ? "text-gray-400" : "text-neutral-500"}`}>
                        Here is what's happening with your Gurukul management today.
                    </p>
                </div>

                {/* 1 Week અને 1 Month ફિલ્ટર — have sparkline cards ne control kare chhe */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setTimeFrame("week")}
                        className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${timeFrame === "week"
                            ? theme ? "bg-gray-700 border-gray-600 text-white" : "bg-neutral-900 border-neutral-900 text-white"
                            : theme ? "border-gray-800 text-gray-400 hover:text-white" : "border-neutral-200 text-neutral-600 hover:bg-neutral-50"
                            }`}
                    >
                        1 Week
                    </button>
                    <button
                        onClick={() => setTimeFrame("month")}
                        className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${timeFrame === "month"
                            ? theme ? "bg-gray-700 border-gray-600 text-white" : "bg-neutral-900 border-neutral-900 text-white"
                            : theme ? "border-gray-800 text-gray-400 hover:text-white" : "border-neutral-200 text-neutral-600 hover:bg-neutral-50"
                            }`}
                    >
                        1 Month
                    </button>
                </div>
            </div>

            {/* 🌟 ત્રણેય card statCards.map() થી render */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                {statCards.map((card) => {
                    const Icon = card.icon;
                    return (
                        <div
                            key={card.key}
                            className={`relative p-5 sm:p-6 lg:p-8 rounded-3xl border flex flex-col shadow-md shadow-black/20 transition-all hover:scale-[1.01] overflow-hidden ${theme ? "bg-gray-800/50 border-gray-800" : "bg-white border-neutral-200"
                                }`}
                        >
                            {/* ===== Header: label + icon ===== */}
                            <div className="relative z-10 flex justify-between items-start">
                                <p className={`text-sm sm:text-base font-bold tracking-wide uppercase ${theme ? "text-gray-400" : "text-neutral-500"}`}>
                                    {card.label}
                                </p>
                                <div className={`p-3 sm:p-4 rounded-2xl shrink-0 ${card.iconBg}`}>
                                    <Icon className="text-2xl sm:text-3xl" />
                                </div>
                            </div>

                            {/* ===== Top 3 Recent items ===== */}
                            <div className="w-full mt-5 flex flex-col gap-2.5">
                                {card.recentItems.map((item, idx) => (
                                    <div
                                        key={idx}
                                        className={`w-full px-3.5 py-2.5 rounded-2xl border flex justify-between items-center gap-3 ${theme
                                            ? "border-gray-700 bg-gray-900/40"
                                            : "border-neutral-200 bg-neutral-50/60"
                                            }`}
                                    >
                                        <span className={`text-sm font-semibold truncate ${theme ? "text-gray-100" : "text-neutral-800"}`}>
                                            {item.name}
                                        </span>
                                        <span className={`text-xs font-medium shrink-0 ${theme ? "text-gray-500" : "text-neutral-400"}`}>
                                            {item.meta}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* ===== Footer: total value + sparkline ===== */}
                            <div
                                className={`relative mt-5 rounded-3xl z-10 flex flex-wrap sm:flex-nowrap gap-4 p-5 sm:p-6 justify-between items-center backdrop-blur-2xl border shadow-lg shadow-black/10 ${theme ? "border-gray-700" : "border-neutral-200"
                                    }`}
                            >
                                <div>
                                    <h3 className={`text-4xl sm:text-5xl lg:text-6xl ${theme ? 'text-gray-50' : 'text-gray-800'} font-black tracking-tight`}>
                                        {card.value}
                                    </h3>
                                    <p className="text-xs text-emerald-500 font-semibold mt-1">{card.caption}</p>
                                </div>

                                <CardSparkline dataKey={card.key} color={card.color} />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}