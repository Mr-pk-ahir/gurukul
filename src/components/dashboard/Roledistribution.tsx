import { useTheme } from "../theme/ThemeContext";

export interface RoleDistributionItem {
    roleCode: string;
    roleName: string;
    userCount: number;
}

interface RoleDistributionProps {
    roles: RoleDistributionItem[];
    loading?: boolean;
}

export default function RoleDistribution({ roles, loading }: RoleDistributionProps) {
    const { theme } = useTheme();
    const maxCount = Math.max(1, ...roles.map((r) => r.userCount));

    return (
        <div
            className={`rounded-2xl border p-5 transition-colors ${
                theme ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"
            }`}
        >
            <h3 className={`text-sm font-bold mb-4 ${theme ? "text-gray-200" : "text-gray-800"}`}>
                Users by Role
            </h3>

            {loading ? (
                <div className="space-y-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className={`h-8 rounded-lg animate-pulse ${theme ? "bg-gray-800/60" : "bg-gray-100"}`} />
                    ))}
                </div>
            ) : roles.length === 0 ? (
                <p className={`text-sm py-6 text-center ${theme ? "text-gray-600" : "text-gray-400"}`}>No roles configured yet</p>
            ) : (
                <ul className="space-y-3.5">
                    {roles.map((role) => (
                        <li key={role.roleCode}>
                            <div className="flex items-center justify-between mb-1.5">
                                <span className={`text-xs font-semibold capitalize ${theme ? "text-gray-300" : "text-gray-600"}`}>
                                    {role.roleName.replace(/_/g, " ")}
                                </span>
                                <span className={`text-xs font-bold ${theme ? "text-gray-400" : "text-gray-500"}`}>
                                    {role.userCount}
                                </span>
                            </div>
                            <div className={`h-2 rounded-full overflow-hidden ${theme ? "bg-gray-800" : "bg-gray-100"}`}>
                                <div
                                    className={`h-full rounded-full ${theme ? "bg-blue-500" : "bg-[#9b001c]"}`}
                                    style={{ width: `${(role.userCount / maxCount) * 100}%` }}
                                />
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}