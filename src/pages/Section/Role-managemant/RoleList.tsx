import { useState, useEffect } from "react"; // 👈 useEffect ઇમ્પોર્ટ કર્યો
import { useTheme } from "../../../components/theme/ThemeContext";
import Table from "../../../components/common/Table";
import DataCruding from "../../../components/common/DataCruding";
import { roleDelete } from "../../../action/Role/Delete";


interface RoleData {
    role_code: string;      // Primary Key
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

    // સ્ટેટ્સ: લોડિંગ અને રોલ્સનો રિયલ ડેટા સ્ટોર કરવા માટે
    const [roles, setRoles] = useState<RoleData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    // 🔍 ૧. બેકએન્ડમાંથી ડેટા ફેચ કરવાનું ફંક્શન
    const fetchRoles = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token"); // મિડલવેર માટે ઓથોરાઇઝેશન ટોકન

            const response = await fetch(`${API_URL}/roles`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            const result = await response.json();

            if (response.ok && result.success) {
                setRoles(result.data); // બેકએન્ડમાંથી આવેલો એરે સેટ કર્યો
            } else {
                alert(`⚠️ ભૂલ: ${result.message || "ડેટા લોડ થઈ શક્યો નહીં."}`);
            }
        } catch (error) {
            console.error("Error fetching roles:", error);
            alert("❌ સર્વર સાથે કનેક્ટ થવામાં પ્રોબ્લેમ આવ્યો છે!");
        } finally {
            setLoading(false); // લોડિંગ પૂરું
        }
    };

    // 🔄 ૨. પેજ ઓપન થાય ત્યારે રિક્વેસ્ટ ટ્રિગર થશે
    useEffect(() => {
        fetchRoles();
    }, []);

    // 📊 ટેબલ કોલમ્સ (જેમાં ડેટાબેઝના સાચા કી-નેમ્સ સેટ કર્યા છે)
    const columns = [
        {
            header: "Role Code",
            className: "w-44 text-left font-mono text-xs tracking-wider",
            accessor: (role: RoleData) => (
                <span className="px-2.5 py-1 rounded-md font-bold bg-neutral-100 text-neutral-700 dark:bg-gray-800 dark:text-gray-300 border dark:border-gray-700">
                    {role.role_code} {/* 👈 roleCode નું role_code કર્યું */}
                </span>
            ),
        },
        {
            header: "Role Name",
            className: "font-bold text-left",
            accessor: (role: RoleData) => role.role_name, // 👈 roleName નું role_name કર્યું
        },
        {
            header: "Description",
            className: "max-w-xs truncate text-neutral-500 dark:text-gray-400 font-normal",
            accessor: (role: RoleData) => role.description || "No description provided.",
        },
        {
            header: "Allowed Modules",
            accessor: (role: RoleData) => {
                // 💡 ડેટાબેઝના JSONB ઓબ્જેક્ટની કીઝ (મોડ્યુલના નામ) ડાયનેમિક મેળવવા માટે
                const allowedModules = role.permissions ? Object.keys(role.permissions) : [];

                return (
                    <div className="flex flex-wrap gap-1">
                        {allowedModules.length > 0 ? (
                            allowedModules.map((mod) => (
                                <span key={mod} className="px-2 py-0.5 text-[11px] font-bold rounded-full bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400">
                                    {mod}
                                </span>
                            ))
                        ) : (
                            <span className="text-xs text-neutral-400">No modules assigned</span>
                        )}
                    </div>
                );
            },
        },
        {
            header: "Actions",
            className: "w-16 text-center",
            accessor: (role: RoleData) => (
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
            ),
        },
    ];

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className={`text-xl font-bold ${theme ? "text-blue-200" : "text-red-600"}`}>
                    Role & Permissions List
                </h2>
            </div>

            {/* ⏳ જો ડેટા લોડ થતો હોય તો લોડિંગ મેસેજ બતાવશે */}
            {loading ? (
                <div className="text-center py-10 font-medium text-neutral-500">
                    Loading roles from database...
                </div>
            ) : (
                <Table
                    columns={columns}
                    data={roles}
                    keyExtractor={(role) => role.role_code}
                    emptyMessage="No roles defined yet!"
                />
            )}
        </div>
    );
}