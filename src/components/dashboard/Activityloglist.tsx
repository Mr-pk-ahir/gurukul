import { useTheme } from "../theme/ThemeContext";
import { HiOutlineClock, HiOutlineSparkles } from "react-icons/hi";

export interface ActivityLogItem {
    id: string | number;
    message: string;
    timestamp: string; // ISO date string
}

interface ActivityLogListProps {
    logs: ActivityLogItem[];
    loading?: boolean;
}

export default function ActivityLogList({ logs, loading }: ActivityLogListProps) {
    const { theme } = useTheme();

    return (
        <div
            className={`rounded-2xl border shadow-sm transition-all duration-200 ${
                theme ? "border-gray-800 bg-gray-900/80 shadow-black/20" : "border-gray-200 bg-white shadow-gray-100"
            }`}
        >
            <div className="flex items-center justify-between border-b px-5 py-4 dark:border-gray-800">
                <div className="flex items-center gap-2.5">
                    <span className={`flex h-8 w-8 items-center justify-center rounded-xl ${theme ? "bg-blue-500/10 text-blue-300" : "bg-[#9b001c]/10 text-[#9b001c]"}`}>
                        <HiOutlineSparkles className="text-base" />
                    </span>
                    <div>
                        <h3 className={`text-sm font-bold ${theme ? "text-white" : "text-gray-900"}`}>
                            Recent System Activity
                        </h3>
                        <p className={`text-[11px] ${theme ? "text-gray-500" : "text-gray-400"}`}>
                            Last updates across the platform
                        </p>
                    </div>
                </div>
            </div>

            <div className="p-4">
                {loading ? (
                    <div className="space-y-3">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className={`h-14 rounded-xl animate-pulse ${theme ? "bg-gray-800/70" : "bg-gray-100"}`} />
                        ))}
                    </div>
                ) : logs.length === 0 ? (
                    <div className={`rounded-xl border border-dashed py-8 text-center ${theme ? "border-gray-700 text-gray-500" : "border-gray-200 text-gray-400"}`}>
                        No recent activity yet
                    </div>
                ) : (
                    <ul className="space-y-3">
                        {logs.map((log) => (
                            <li
                                key={log.id}
                                className={`relative pl-6 ${theme ? "text-gray-300" : "text-gray-700"}`}
                            >
                                <div className="absolute left-0 top-2 h-2.5 w-2.5 rounded-full bg-gradient-to-br from-[#9b001c] to-red-500 shadow-sm" />
                                <div className={`rounded-xl border p-3 transition-colors ${theme ? "border-gray-800 bg-gray-800/40 hover:bg-gray-800" : "border-gray-100 bg-gray-50 hover:bg-gray-100"}`}>
                                    <div className="flex items-start gap-3">
                                        <HiOutlineClock className={`mt-0.5 shrink-0 ${theme ? "text-gray-500" : "text-gray-400"}`} />
                                        <div className="min-w-0 flex-1">
                                            <p className={`text-sm font-medium leading-6 ${theme ? "text-gray-200" : "text-gray-800"}`}>
                                                {log.message}
                                            </p>
                                            <p className={`mt-1 text-[11px] ${theme ? "text-gray-500" : "text-gray-400"}`}>
                                                {new Date(log.timestamp).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}