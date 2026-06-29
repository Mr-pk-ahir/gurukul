import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../theme/ThemeContext";
import SidebarDropdown from "./SidebarDropdown";
import {
    HiOutlineHome,
    HiOutlineLibrary,
    HiOutlineShieldCheck,
    HiOutlineAcademicCap,
    HiOutlineOfficeBuilding // 👑 સેક્શન માટે આઇકોન ઇમ્પોર્ટ કર્યો
} from "react-icons/hi";
import { FiUsers } from "react-icons/fi";
import { CiCircleList } from "react-icons/ci";
import { IoCreateOutline } from "react-icons/io5";
import { SiGoogledataproc, SiGoogleearth, SiNginxproxymanager } from "react-icons/si";
import { RiEditBoxLine } from "react-icons/ri";
import type { AuthUser } from "../../Types/Role-create";
import { AiOutlineFileProtect } from "react-icons/ai";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

interface NavbarProps {
    setSidebarOpen: (isOpen: boolean) => void;
    isMiniSidebar: boolean;
}

interface DepartmentData {
    departmentId: number;
    departmentName: string;
    departmentHeadId: number | null;
    departmentHeadName: string | null;
    description: string;
}

export default function Navbar({ setSidebarOpen, isMiniSidebar }: NavbarProps) {
    const { theme } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const [departments, setDepartment] = useState<DepartmentData[]>([]);

    const [user, setUser] = useState<AuthUser | null>(null);

    useEffect(() => {
        const data = localStorage.getItem("user");
        if (data) {
            try {
                const parsed: AuthUser = JSON.parse(data);
                setUser(parsed);
            } catch (e) {
                console.error("Error parsing user data:", e);
            }
        }
    }, []);

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const response = await fetch(`${API_URL}/departments`);
                const result = await response.json();
                if (result.success) {
                    setDepartment(result.data);
                }
            } catch {
                toast.error("Error fetching departments:");
            }
        };
        fetchDepartments();
    }, []);

    // ૧. ડિપાર્ટમેન્ટ આઇટમ્સ
    const departmentItems = [];
    if (user?.permissions?.["Department"]?.create) {
        departmentItems.push({ name: "Create Departments", path: "/dashboard/departments/create", icon: <IoCreateOutline /> });
    }
    if (user?.permissions?.["Department"]?.view) {
        departmentItems.push({ name: "Departments List", path: "/dashboard/departments/list", icon: <CiCircleList /> });
    }

    const isPermActive = location.pathname === "/dashboard/permissions/messages";

    // ૨. પાઇપલાઇન આઇટમ્સ
    const pipelineItems = [];
    const deptId = user && ('departmentId' in user ? (user as any).departmentId : null);

    if (deptId && user?.permissions?.["Department"]?.view) {
        pipelineItems.push(
            { name: "Student List", path: `/dashboard/departments/${deptId}/student-list`, icon: <HiOutlineAcademicCap /> }
        );
    }

    const filteredDepartments = (user?.roleCode === "SUPER_ADMIN"
        ? departments
        : (departments || []).filter(d => d.departmentId === (user as any)?.departmentId)) || [];

    // ૩. યુઝર આઇટમ્સ
    const userItems = [];
    if (user?.permissions?.["Users"]?.create) {
        userItems.push({ name: "Create User", path: "/dashboard/users/create", icon: <IoCreateOutline /> });
    }
    if (user?.permissions?.["Users"]?.view) {
        userItems.push({ name: "User List", path: "/dashboard/users/list", icon: <CiCircleList /> });
    }

    // ૪. વેબસાઇટ / ઓવરવ્યૂ મેનેજમેન્ટ આઇટમ્સ
    const websiteItems = [];
    if (user?.permissions?.["overview-management"]?.view) {
        websiteItems.push({ name: "Overview", path: "/dashboard/overview-management", icon: <RiEditBoxLine /> });
    }
    if (user?.permissions?.["overview-management"]?.create || user?.permissions?.["overview-management"]?.view) {
        websiteItems.push(
            { name: "Amrut Nu Aachaman", path: "/dashboard/overview-management/amrut-nu-aachaman", icon: <SiGoogledataproc /> },
            { name: "Daily Darshan", path: "/dashboard/overview-management/daily-darshan", icon: <SiGoogleearth /> }
        );
    }

    const sectionItems = [];
    if (user?.permissions?.["Section"]?.create) {
        sectionItems.push({ name: "Create Section", path: "/dashboard/sections/create", icon: <IoCreateOutline /> });
    }
    if (user?.permissions?.["Section"]?.view) {
        sectionItems.push({ name: "Section List", path: "/dashboard/sections/list", icon: <CiCircleList /> });
    }

    // ૬. રોલ આઇટમ્સ
    const roleItems = [];
    if (user?.permissions?.["Roles & Permissions"]?.create) {
        roleItems.push({ name: "Create Role", path: "/dashboard/permissions/role", icon: <IoCreateOutline /> });
    }
    if (user?.permissions?.["Roles & Permissions"]?.view) {
        roleItems.push({ name: "Role List", path: "/dashboard/permissions/lesson", icon: <CiCircleList /> });
    }

    const isActive = location.pathname === "/dashboard";

    return (
        <div className="w-full flex flex-col space-y-1.5">

            {/* Dashboard Button */}
            <button
                onClick={() => {
                    navigate("/dashboard");
                    setSidebarOpen(false);
                }}
                title={isMiniSidebar ? "Dashboard" : ""}
                className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl font-semibold text-[15px] transition-all duration-200 group cursor-pointer 
                    ${isMiniSidebar ? "justify-center px-2" : ""}
                    ${isActive
                        ? theme ? "text-blue-200 bg-gray-800" : "text-red-600 bg-red-50"
                        : theme ? "text-white bg-gray-900 hover:bg-gray-800 hover:text-blue-200" : "text-gray-500 hover:bg-red-50 hover:text-red-600"
                    }
                `}
            >
                <span className={`transition-colors ${isActive
                    ? theme ? "text-blue-200" : "text-red-600"
                    : theme ? "text-gray-300 group-hover:text-blue-200" : "text-gray-400 group-hover:text-red-600"
                    }`}>
                    <HiOutlineHome className="text-xl" />
                </span>
                {!isMiniSidebar && "Dashboard"}
            </button>

            <button
                onClick={() => {
                    navigate("/dashboard/permissions/messages");
                    setSidebarOpen(false);
                }}
                title={isMiniSidebar ? "Permissions" : ""}
                className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl font-semibold text-[15px] transition-all duration-200 group cursor-pointer 
        ${isMiniSidebar ? "justify-center px-2" : ""}
        ${isPermActive
                        ? theme ? "text-blue-200 bg-gray-800" : "text-red-600 bg-red-50"
                        : theme ? "text-white hover:bg-gray-800" : "text-gray-500 hover:bg-red-50"
                    }
    `}
            >
                <span className={`transition-colors ${isActive
                    ? theme ? "text-blue-200" : "text-red-600"
                    : theme ? "text-gray-300 group-hover:text-blue-200" : "text-gray-400 group-hover:text-red-600"
                    }`}>
                    <AiOutlineFileProtect className="text-xl" />
                </span>
                {!isMiniSidebar && "Permissions"}
            </button>

            {/* Department Dropdown */}
            {departmentItems.length > 0 && (
                <SidebarDropdown
                    title="Department"
                    icon={<HiOutlineLibrary className="text-xl" />}
                    items={departmentItems}
                    setSidebarOpen={setSidebarOpen}
                    isMiniSidebar={isMiniSidebar}
                />
            )}

            {/* Users Dropdown */}
            {userItems.length > 0 && (
                <SidebarDropdown
                    title="Users"
                    icon={<FiUsers className="text-xl" />}
                    items={userItems}
                    setSidebarOpen={setSidebarOpen}
                    isMiniSidebar={isMiniSidebar}
                />
            )}

            {/* Overview Management Dropdown */}
            {websiteItems.length > 0 && (
                <SidebarDropdown
                    title="Overview Manage"
                    icon={<SiNginxproxymanager className="text-xl" />}
                    items={websiteItems}
                    setSidebarOpen={setSidebarOpen}
                    isMiniSidebar={isMiniSidebar}
                />
            )}

            {sectionItems.length > 0 && (
                <SidebarDropdown
                    title="Section Management"
                    icon={<HiOutlineOfficeBuilding className="text-xl" />}
                    items={sectionItems}
                    setSidebarOpen={setSidebarOpen}
                    isMiniSidebar={isMiniSidebar}
                />
            )}

            {/* Roles & Permissions Dropdown */}
            {roleItems.length > 0 && (
                <SidebarDropdown
                    title="Roles & Permissions"
                    icon={<HiOutlineShieldCheck className="text-xl" />}
                    items={roleItems}
                    setSidebarOpen={setSidebarOpen}
                    isMiniSidebar={isMiniSidebar}
                />
            )}

            <h1 className={`text-sm font-normal my-4 ${theme ? "text-gray-400" : "text-gray-600"}`}>
                Departments Pipeline
            </h1>

            {filteredDepartments.map((dept) => (
                <SidebarDropdown
                    key={dept.departmentId}
                    title={dept.departmentName}
                    icon={<HiOutlineAcademicCap className="text-xl" />}
                    items={[
                        {
                            name: "Create Student",
                            path: `/dashboard/departments/${dept.departmentId}/create-student`,
                            icon: <IoCreateOutline />
                        },
                        {
                            name: "Student List",
                            path: `/dashboard/departments/${dept.departmentId}/student-list`,
                            icon: <CiCircleList />
                        }
                    ]}
                    setSidebarOpen={setSidebarOpen}
                    isMiniSidebar={isMiniSidebar}
                />
            ))}
        </div>
    );
}