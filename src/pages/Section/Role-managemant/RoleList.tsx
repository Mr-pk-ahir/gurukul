import { useState } from "react";
import { useTheme } from "../../../components/theme/ThemeContext";
import Table from "../../../components/common/Table";
import DataCruding from "../../../components/common/DataCruding";

interface RoleData {
  id: number;
  roleName: string;
  roleCode: string;
  description: string;
  allowedModules: string[];
}

export default function RoleList() {
    const { theme } = useTheme();

    // લોકલ સ્ટેટ ડમી ડેટા સાથે (તમારા લિસ્ટના લુક પ્રમાણે)
    const [roles, setRoles] = useState<RoleData[]>([
        {
            id: 1,
            roleName: "Super Admin",
            roleCode: "ROLE_SUPER_ADMIN",
            description: "Full access to all software modules and configuration settings.",
            allowedModules: ["Department", "Users", "Roles"],
        },
        {
            id: 2,
            roleName: "Academic Teacher",
            roleCode: "ROLE_TEACHER",
            description: "Access to student attendance, homework, and test section markings.",
            allowedModules: ["Users"],
        },
        {
            id: 3,
            roleName: "HR Manager",
            roleCode: "ROLE_HR",
            description: "Manages employee profiles, leave application permissions.",
            allowedModules: ["Department", "Users"],
        }
    ]);

    const handleDeleteRole = (id: number) => {
        setRoles((prev) => prev.filter((role) => role.id !== id));
        console.log(`Role ID ${id} લોકલ સ્ટેટમાંથી ટેમ્પરરી ડિલીટ થયો.`);
    };

    const columns = [
        {
            header: "Role Code",
            className: "w-44 text-left font-mono text-xs tracking-wider",
            accessor: (role: RoleData) => (
                <span className="px-2.5 py-1 rounded-md font-bold bg-neutral-100 text-neutral-700 dark:bg-gray-800 dark:text-gray-300 border dark:border-gray-700">
                    {role.roleCode}
                </span>
            ),
        },
        {
            header: "Role Name",
            className: "font-bold text-left",
            accessor: (role: RoleData) => role.roleName,
        },
        {
            header: "Description",
            className: "max-w-xs truncate text-neutral-500 dark:text-gray-400 font-normal",
            accessor: (role: RoleData) => role.description,
        },
        {
            header: "Allowed Modules",
            accessor: (role: RoleData) => (
                <div className="flex flex-wrap gap-1">
                    {role.allowedModules.map((mod) => (
                        <span key={mod} className="px-2 py-0.5 text-[11px] font-bold rounded-full bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400">
                            {mod}
                        </span>
                    ))}
                </div>
            ),
        },
        {
            header: "Actions",
            className: "w-16 text-center",
            accessor: (role: RoleData) => (
                <DataCruding
                    onEdit={() => console.log("Edit Role ID:", role.id)}
                    onDelete={() => handleDeleteRole(role.id)}
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

            <Table
                columns={columns}
                data={roles}
                keyExtractor={(role) => role.id}
                emptyMessage="No roles defined yet!"
            />
        </div>
    );
}