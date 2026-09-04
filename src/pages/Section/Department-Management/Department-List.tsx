import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Table from "../../../components/common/Table";
import { useTheme } from "../../../components/theme/ThemeContext";
import DataCruding from "../../../components/common/DataCruding";
import { FaBuildingColumns } from "react-icons/fa6";
import { HiSearch, HiFilter, HiChevronDown, HiEye } from "react-icons/hi";
import { toast } from "sonner";
import { getDepartments, deleteDepartment, type DepartmentData } from "../../../action/Department/View";

export default function DepartmentList() {
    const { theme } = useTheme();
    const navigate = useNavigate();
    const [departments, setDepartments] = useState<DepartmentData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterType, setFilterType] = useState("all");
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const filterOptions = [
        { label: "All Fields", value: "all" },
        { label: "Department Name", value: "departmentName" },
        { label: "ID", value: "departmentId" },
        { label: "Description", value: "description" },
    ];

    const fetchDepartments = async () => {
        try {
            setLoading(true);
            const data = await getDepartments();
            setDepartments(data);
        } catch (error) {
            console.error("Department fetch error:", error);
            toast.error("Failed to fetch departments.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void fetchDepartments();
    }, []);

    const getSearchInputConfig = () => {
        switch (filterType) {
            case "departmentId":
                return { type: "number", placeholder: "Enter Department ID..." };
            case "departmentName":
                return { type: "text", placeholder: "Search Department Name" };
            case "description":
                return { type: "text", placeholder: "Search Description" };
            default:
                return { type: "text", placeholder: "Search Across All Records" };
        }
    };

    const inputConfig = getSearchInputConfig();

    const filteredDepartments = departments.filter((dept) => {
        const query = searchQuery.toLowerCase().trim();
        if (!query) return true;

        switch (filterType) {
            case "departmentName":
                return dept.departmentName.toLowerCase().includes(query);
            case "departmentId":
                return dept.departmentId.toString().includes(query);
            case "description":
                return dept.description?.toLowerCase().includes(query);
            default:
                return (
                    dept.departmentName.toLowerCase().includes(query) ||
                    dept.departmentId.toString().includes(query) ||
                    dept.description?.toLowerCase().includes(query) ||
                    (dept.departmentHeadName && dept.departmentHeadName.toLowerCase().includes(query))
                );
        }
    });

    const handleViewDepartment = (id: number) => {
        navigate(`/dashboard/departments/view/${id}`);
    };

    const handleEditDepartment = (id: number) => {
        navigate(`/dashboard/departments/edit/${id}`);
    };

    const handleDeleteDepartment = async (id: number) => {
        try {
            const isDeleted = await deleteDepartment(id);
            if (isDeleted) {
                setDepartments((prev) => prev.filter((dept) => dept.departmentId !== id));
            }
        } catch (error) {
            console.error("Department delete error:", error);
            toast.error("Something went wrong while deleting.");
        }
    };

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
            header: "Department Head",
            className: "text-left",
            accessor: (dept: DepartmentData) => (
                <div className="flex flex-col">
                    <span className="font-medium text-sm">
                        {dept.departmentHeadName || "Not Assigned"}
                    </span>
                    {dept.departmentHeadId && (
                        <span className="text-xs text-gray-400 font-mono">
                            ID: {dept.departmentHeadId}
                        </span>
                    )}
                </div>
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
                <DataCruding
                    onView={() => handleViewDepartment(dept.departmentId)}
                    onEdit={() => handleEditDepartment(dept.departmentId)}
                    onDelete={() => void handleDeleteDepartment(dept.departmentId)}
                    viewLabel="View"
                    editLabel="Edit"
                    deleteLabel="Delete"
                />
            ),
        },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-3">
                    <span
                        className={`flex items-center justify-center w-10 h-10 rounded-xl shrink-0 transition-colors ${theme ? "bg-blue-500/10 text-blue-300" : "bg-[#9b001c]/10 text-[#9b001c]"
                            }`}
                    >
                        <FaBuildingColumns size={20} />
                    </span>
                    <div>
                        <h2 className={`text-xl font-bold leading-tight ${theme ? "text-blue-200" : "text-[#9b001c]"}`}>
                            Department List
                        </h2>
                        <p className={`text-xs mt-0.5 ${theme ? "text-gray-500" : "text-neutral-400"}`}>
                            Showing {filteredDepartments.length} of {departments.length} departments
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto mt-2 sm:mt-1">
                    <button
                        type="button"
                        onClick={() => navigate("/dashboard/departments/create")}
                        className={`rounded-xl px-4 py-2.5 text-sm font-semibold shadow-sm transition ${theme ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-[#9b001c] text-white hover:bg-[#7d0017]"}`}
                    >
                        + Add Department
                    </button>

                    <div className="relative group">
                        <button
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            className={`flex items-center justify-between pl-9 pr-3 py-2.5 w-40 sm:w-44 rounded-xl border text-sm font-medium outline-none transition-all duration-300 ${theme
                                ? "bg-gray-800/60 border-gray-700 text-gray-200 focus:ring-2 focus:ring-blue-500/50 hover:border-gray-600 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.3)]"
                                : "bg-white border-gray-200/80 text-gray-700 focus:ring-2 focus:ring-[#9b001c]/20 hover:border-gray-300 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)]"
                                }`}
                        >
                            <div className={`absolute left-3 flex items-center pointer-events-none transition-colors ${theme ? "text-gray-400 group-hover:text-blue-400" : "text-gray-500 group-hover:text-[#9b001c]"}`}>
                                <HiFilter className="w-4 h-4" />
                            </div>
                            <span className="truncate mr-2">
                                {filterOptions.find((opt) => opt.value === filterType)?.label}
                            </span>
                            <HiChevronDown className={`w-4 h-4 shrink-0 transition-transform duration-300 ${isFilterOpen ? "rotate-180" : ""} ${theme ? "text-gray-400" : "text-gray-500"}`} />
                        </button>

                        {isFilterOpen && (
                            <div className="fixed inset-0 z-10" onClick={() => setIsFilterOpen(false)}></div>
                        )}

                        {isFilterOpen && (
                            <div className={`absolute right-0 z-20 mt-2 w-48 rounded-xl border py-1.5 shadow-xl backdrop-blur-md transform transition-all duration-200 origin-top-right ${theme
                                ? "bg-gray-800/95 border-gray-700 text-gray-200 shadow-black/40"
                                : "bg-white/95 border-gray-100 text-gray-700 shadow-gray-200/50"
                                }`}
                            >
                                {filterOptions.map((option) => (
                                    <div
                                        key={option.value}
                                        onClick={() => {
                                            setFilterType(option.value);
                                            setSearchQuery("");
                                            setIsFilterOpen(false);
                                        }}
                                        className={`px-4 py-2 text-sm cursor-pointer transition-colors flex items-center justify-between ${filterType === option.value
                                            ? theme ? "bg-blue-500/10 text-blue-400 font-bold" : "bg-[#9b001c]/5 text-[#9b001c] font-bold"
                                            : theme ? "hover:bg-gray-700/50" : "hover:bg-gray-50"
                                            }`}
                                    >
                                        {option.label}
                                        {filterType === option.value && (
                                            <span className={`w-1.5 h-1.5 rounded-full ${theme ? "bg-blue-400" : "bg-[#9b001c]"}`}></span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="relative group">
                        <div className={`absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors ${theme ? "text-gray-400 group-focus-within:text-blue-400" : "text-gray-400 group-focus-within:text-[#9b001c]"}`}>
                            <HiSearch className="w-4 h-4" />
                        </div>
                        <input
                            type={inputConfig.type}
                            placeholder={inputConfig.placeholder}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={`pl-10 pr-4 py-2.5 w-full sm:w-48 lg:w-64 xl:w-72 rounded-xl border text-sm outline-none transition-all duration-300 ease-in-out focus:w-full sm:focus:w-56 lg:focus:w-72 xl:focus:w-80 ${theme
                                ? "bg-gray-800/60 border-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 hover:border-gray-600 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.3)]"
                                : "bg-white border-gray-200/80 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-[#9b001c]/20 focus:border-[#9b001c] hover:border-gray-300 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)]"
                                } [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
                        />
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <div className={`w-10 h-10 rounded-full border-4 border-t-transparent animate-spin ${theme ? "border-blue-500" : "border-[#9b001c]"}`} />
                </div>
            ) : (
                <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
                    <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-3 dark:border-gray-800">
                        <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
                            <HiEye className="text-base" />
                            Department Overview
                        </div>
                    </div>

                    <Table
                        columns={columns}
                        data={filteredDepartments}
                        keyExtractor={(dept) => dept.departmentId}
                        emptyMessage={
                            searchQuery
                                ? `No departments found matching "${searchQuery}"`
                                : "No departments found!"
                        }
                    />
                </div>
            )}
        </div>
    );
}