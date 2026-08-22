import { useTheme } from "../theme/ThemeContext";
import { HiOutlineClock } from "react-icons/hi";

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
            className={`rounded-2xl border p-5 transition-colors ${
                theme ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"
            }`}
        >
            <h3 className={`text-sm font-bold mb-4 ${theme ? "text-gray-200" : "text-gray-800"}`}>Recent System Activity</h3>

            {loading ? (
                <div className="space-y-3">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className={`h-10 rounded-lg animate-pulse ${theme ? "bg-gray-800/60" : "bg-gray-100"}`} />
                    ))}
                </div>
            ) : logs.length === 0 ? (
                <p className={`text-sm py-6 text-center ${theme ? "text-gray-600" : "text-gray-400"}`}>No recent activity yet</p>
            ) : (
                <ul className="space-y-1">
                    {logs.map((log) => (
                        <li
                            key={log.id}
                            className={`flex items-start gap-3 px-3 py-2.5 rounded-xl text-sm ${
                                theme ? "hover:bg-gray-800/50" : "hover:bg-gray-50"
                            }`}
                        >
                            <HiOutlineClock className={`mt-0.5 shrink-0 ${theme ? "text-gray-600" : "text-gray-300"}`} />
                            <div className="flex-1">
                                <p className={theme ? "text-gray-300" : "text-gray-700"}>{log.message}</p>
                                <p className={`text-xs mt-0.5 ${theme ? "text-gray-600" : "text-gray-400"}`}>
                                    {new Date(log.timestamp).toLocaleString()}
                                </p>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}