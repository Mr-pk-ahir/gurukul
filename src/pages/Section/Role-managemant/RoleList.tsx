import { useState, useEffect } from "react";
import { useTheme } from "../../../components/theme/ThemeContext";
import Table from "../../../components/common/Table";
import DataCruding from "../../../components/common/DataCruding";
import { roleDelete } from "../../../action/Role/Delete";

interface RoleData {
    role_code: string;
    role_name: string;
    description: string;
    permissions: {
        [key: string]: {
            create: boolean;
            edit: boolean;
            view: boolean;
            delete: boolean;
        };
    };
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function RoleList() {
    const { theme } = useTheme();

    const [roles, setRoles] = useState<RoleData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchRoles = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/roles`);
            const result = await response.json();

            if (response.ok && result.success) {
                setRoles(result.data);
            } else {
                alert(`⚠️ ભૂલ: ${result.message || "ડેટા લોડ થઈ શક્યો નહીં."}`);
            }
        } catch (error) {
            console.error("Error fetching roles:", error);
            alert("❌ સર્વર સાથે કનેક્ટ થવામાં પ્રોબ્લેમ આવ્યો છે!");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRoles();
    }, []);

    // 📊 Table Columns (Perfect Premium Colors)
    const columns = [
        {
            header: "ROLE CODE",
            className: "w-40 text-left text-[11px] font-bold tracking-wider text-slate-500",
            accessor: (role: RoleData) => (
                <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold tracking-wide transition-colors ${
                        theme
                            ? "bg-slate-500/10 text-slate-200" 
                            : "bg-blue-50 text-red-700"     
                    }`}
                >
                    {role.role_code}
                </span>
            ),
        },
        {
            header: "ROLE NAME",
            className: "text-left text-[11px] font-bold tracking-wider text-slate-500",
            accessor: (role: RoleData) => (
                <span className={`text-sm font-medium ${theme ? "text-slate-200" : "text-slate-800"}`}>
                    {role.role_name}
                </span>
            ),
        },
        {
            header: "DESCRIPTION",
            className: "text-left text-[11px] font-bold tracking-wider text-slate-500 max-w-xs truncate",
            accessor: (role: RoleData) => (
                <span className={`text-sm ${theme ? "text-slate-400" : "text-slate-500"}`}>
                    {role.description || "No description provided."}
                </span>
            ),
        },
        {
            header: "ALLOWED MODULES",
            className: "text-left text-[11px] font-bold tracking-wider text-slate-500",
            accessor: (role: RoleData) => {
                const allowedModules = role.permissions ? Object.keys(role.permissions) : [];

                return (
                    <div className="flex flex-wrap gap-2 py-1">
                        {allowedModules.length > 0 ? (
                            allowedModules.map((mod) => (
                                <span
                                    key={mod}
                                    className={`px-2.5 py-0.5 text-[11px] font-semibold rounded-full transition-colors ${
                                        theme
                                            ? "bg-slate-500/10 text-slate-200 border border-slate-500/20" 
                                            : "bg-rose-50 text-rose-700 border border-rose-200"
                                    }`}
                                >
                                    {mod}
                                </span>
                            ))
                        ) : (
                            <span className={`text-xs italic ${theme ? "text-slate-500" : "text-slate-400"}`}>
                                No modules assigned
                            </span>
                        )}
                    </div>
                );
            },
        },
        {
            header: "ACTIONS",
            className: "w-20 text-center text-[11px] font-bold tracking-wider text-slate-500",
            accessor: (role: RoleData) => (
                <div className="flex justify-center">
                    <DataCruding
                        onEdit={() => console.log("Edit Role:", role.role_code)}
                        onDelete={async () => {
                            if (!window.confirm("Are you sure you want to delete this role?")) {
                                return;
                            }
                            const success = await roleDelete(role.role_code);
                            if (success) {
                                setRoles((prev) =>
                                    prev.filter((r) => r.role_code !== role.role_code)
                                );
                            }
                        }}
                    />
                </div>
            ),
        },
    ];

    return (
        <div className="space-y-6 w-full pb-8">
            {/* Header Section (Title color matched with your screenshot) */}
            <div className="flex justify-between items-center mb-6">
                <h2 className={`text-xl md:text-2xl font-bold tracking-wide ${theme ? "text-blue-500" : "text-rose-600"}`}>
                    Role & Permissions List
                </h2>
            </div>

            {/* Loading / Table Section (No extra ugly boxes) */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                    <div className={`w-8 h-8 border-4 border-t-transparent rounded-full animate-spin ${theme ? 'border-blue-500' : 'border-rose-600'}`}></div>
                    <p className={`text-sm font-medium ${theme ? 'text-blue-400' : 'text-slate-500'}`}>Loading roles from database...</p>
                </div>
            ) : (
                <div className="w-full">
                    <Table
                        columns={columns}
                        data={roles}
                        keyExtractor={(role) => role.role_code}
                        emptyMessage="No roles defined yet!"
                    />
                </div>
            )}
        </div>
    );
}