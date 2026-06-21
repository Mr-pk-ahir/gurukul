import { useState } from "react";
import Table from "../../../components/common/Table";
import { useTheme } from "../../../components/theme/ThemeContext";
import DataCruding from "../../../components/common/DataCruding";
import { FaBuildingColumns } from "react-icons/fa6";

interface DepartmentData {
    departmentId: number;
    departmentName: string;
    departmentHeadId: number;
    description: string;
}

export default function DepartmentList() {
    const { theme } = useTheme();

    // ૧. ડિપાર્ટમેન્ટનો સ્ટેટ ડેટા
    const [departments, setDepartments] = useState<DepartmentData[]>([
        {
            departmentId: 10,
            departmentName: "Primary Section",
            departmentHeadId: 101,
            description: "Manages class 1 to 5 activities.",
        },
        {
            departmentId: 20,
            departmentName: "Secondary Section",
            departmentHeadId: 102,
            description: "Manages class 6 to 10 curriculum.",
        },
        {
            departmentId: 30,
            departmentName: "Higher Secondary",
            departmentHeadId: 103,
            description: "Science and Commerce streams.",
        },
        {
            departmentId: 40,
            departmentName: "Admin & Accounts",
            departmentHeadId: 104,
            description: "Handles fees and staff payroll.",
        },
    ]);

    // ૨. એડિટ અને ડિલીટ હેન્ડલર્સ
    const handleEditDepartment = (id: number) => {
        console.log("Edit કરાયેલ Department ID:", id);
    };

    const handleDeleteDepartment = (id: number) => {
        if (window.confirm("Are you sure you want to delete this department?")) {
            setDepartments((prev) => prev.filter((dept) => dept.departmentId !== id));
            console.log(`Department ID ${id} લોકલ સ્ટેટમાંથી ડિલીટ થયો.`);
        }
    };

    // ૩. રીયુઝેબલ Table માટેના કોલમ્સ ડેફિનેશન
    const columns = [
        {
            header: "ID",
            className: "w-20 text-center font-mono font-bold text-gray-400",
            accessor: (dept: DepartmentData) => dept.departmentId,
        },
        {
            header: "Department Name",
            className: "text-left font-bold",
            accessor: (dept: DepartmentData) => dept.departmentName,
        },
        {
            header: "Head ID",
            className: "text-center",
            accessor: (dept: DepartmentData) => (
                <span className={`px-2.5 py-1 text-xs rounded-md font-medium ${theme ? "bg-gray-800 text-gray-300" : "bg-neutral-100 text-neutral-700"
                    }`}>
                    {dept.departmentHeadId}
                </span>
            ),
        },
        {
            header: "Description",
            className: "text-left text-gray-500 dark:text-gray-400 max-w-xs truncate hidden md:table-cell",
            accessor: (dept: DepartmentData) => dept.description || "-",
        },
        {
            header: "Actions",
            className: "w-16 text-center",
            accessor: (dept: DepartmentData) => (
                /* ૩-ડોટ્સ ડ્રોપડાઉન મેનૂ કમ્પોનન્ટ */
                <DataCruding
                    onEdit={() => handleEditDepartment(dept.departmentId)}
                    onDelete={() => handleDeleteDepartment(dept.departmentId)}
                />
            ),
        },
    ];

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <span
                        className={`flex items-center justify-center w-9 h-9 rounded-xl shrink-0 ${theme ? "bg-blue-500/10 text-blue-300" : "bg-[#9b001c]/10 text-[#9b001c]"
                            }`}
                    >
                        <FaBuildingColumns size={20} />
                    </span>
                    <div>
                        <h2 className={`text-xl font-bold leading-tight ${theme ? "text-blue-200" : "text-[#9b001c]"}`}>
                            Department List
                        </h2>
                    </div>
                </div>
            </div>

            <Table
                columns={columns}
                data={departments}
                keyExtractor={(dept) => dept.departmentId}
                emptyMessage="No departments found!"
            />
        </div>
    );
}