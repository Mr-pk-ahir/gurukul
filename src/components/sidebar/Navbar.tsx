/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../theme/ThemeContext";
import SidebarDropdown from "./SidebarDropdown";
import {
    HiOutlineHome,
    HiOutlineLibrary,
    HiOutlineShieldCheck,
    HiOutlineAcademicCap,
    HiOutlineOfficeBuilding
} from "react-icons/hi";
import { FiUsers } from "react-icons/fi";
import { CiCircleList } from "react-icons/ci";
import { IoCreateOutline } from "react-icons/io5";
import { SiGoogledataproc, SiGoogleearth, SiNginxproxymanager } from "react-icons/si";
import { RiEditBoxLine } from "react-icons/ri";
import type { AuthUser } from "../../Types/Role-create";
import { AiOutlineFileProtect } from "react-icons/ai";
import { toast } from "sonner";
import { departmentService } from "../../services/departmentService";
import { sectionService } from "../../services/sectionService";

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

interface SectionData {
    section_id: number;
    name: string;
    department_id: number;
}

export default function Navbar({ setSidebarOpen, isMiniSidebar }: NavbarProps) {
    const { theme } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const [departments, setDepartment] = useState<DepartmentData[]>([]);
    const [sectionsByDept, setSectionsByDept] = useState<Record<number, SectionData[]>>({});
    const [sectionsLoading, setSectionsLoading] = useState<boolean>(false);

    const [user, setUser] = useState<AuthUser | null>(null);

    useEffect(() => {
        const data = localStorage.getItem("user");
        if (data) {
            try {
                const parsed: AuthUser = JSON.parse(data);
                console.log("🔴 1. Raw User from LocalStorage:", parsed);

                if (typeof parsed.permissions === "string") {
                    console.log("🟡 2. Permissions is a string, converting to JSON...");
                    try {
                        parsed.permissions = JSON.parse(parsed.permissions);
                    } catch (parseError) {
                        console.error("❌ Error parsing permissions string:", parseError);
                    }
                }

                console.log("🟢 3. Final User State (Will be set):", parsed);
                setUser(parsed);
            } catch (e) {
                console.error("❌ Error parsing overall user data:", e);
            }
        } else {
            console.log("⚠️ No user data found in localStorage");
        }
    }, []);

    console.log("🔵 4. Component Render -> Current User:", user);
    console.log("🔵 5. Component Render -> Permissions:", user?.permissions);

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const result = await departmentService.getAllDepartments();
                if (result.success) {
                    const mapped = result.data.map((d: any) => ({
                        departmentId: d.department_id,
                        departmentName: d.department_name,
                        departmentHeadId: d.department_head_id,
                        departmentHeadName: d.department_head_name,
                        description: d.description,
                    }));
                    setDepartment(mapped);
                }
            } catch (error: any) {
                toast.error(error.message || "Error fetching departments");
            }
        };
        fetchDepartments();
    }, []);

    useEffect(() => {
        const fetchAllSections = async () => {
            if (departments.length === 0) return;
            try {
                setSectionsLoading(true);
                const results = await Promise.all(
                    departments.map((dept) => sectionService.getSectionsByDepartment(dept.departmentId))
                );

                const map: Record<number, SectionData[]> = {};
                departments.forEach((dept, idx) => {
                    const res = results[idx];
                    map[dept.departmentId] = res.success && Array.isArray(res.data) ? res.data : [];
                });
                setSectionsByDept(map);
            } catch (error: any) {
                toast.error(error.message || "Error fetching sections");
            } finally {
                setSectionsLoading(false);
            }
        };
        fetchAllSections();
    }, [departments]);


    // 🎯 HELPER FUNCTION: જો યુઝર SUPER_ADMIN હોય તો બધી પરમિશન True આપે છે
    const hasAccess = (module: string, action: string) => {
        if (user?.roleCode === "SUPER_ADMIN") return true;

        const userPerms: any = user?.permissions;
        if (userPerms && typeof userPerms === "object") {
            const result = !!userPerms[module]?.[action];
            // 🎯 3. કયું મોડ્યુલ ચેક થયું અને શું રિઝલ્ટ આવ્યું તે જોવા માટે
            console.log(`🔍 Checking Access: [${module}][${action}] =>`, result);
            return result;
        }
        return false;
    };


    const departmentItems = [];
    if (hasAccess("Department", "create")) {
        departmentItems.push({ name: "Create Departments", path: "/dashboard/departments/create", icon: <IoCreateOutline /> });
    }
    if (hasAccess("Department", "view")) {
        departmentItems.push({ name: "Departments List", path: "/dashboard/departments/list", icon: <CiCircleList /> });
    }

    const isPermActive = location.pathname === "/dashboard/permissions/messages";

    const filteredDepartments = (user?.roleCode === "SUPER_ADMIN"
        ? departments
        : (departments || []).filter(d => d.departmentId === (user as any)?.departmentId)) || [];


    const userItems = [];
    if (hasAccess("Users", "create")) {
        userItems.push({ name: "Create User", path: "/dashboard/users/create", icon: <IoCreateOutline /> });
    }
    if (hasAccess("Users", "view")) {
        userItems.push({ name: "User List", path: "/dashboard/users/list", icon: <CiCircleList /> });
    }


    const websiteItems = [];
    if (hasAccess("OverviewEdit", "view")) {
        websiteItems.push({ name: "Overview", path: "/dashboard/overview-management", icon: <RiEditBoxLine /> });
    }
    if (hasAccess("AmrutNuAachaman", "create") || hasAccess("AmrutNuAachaman", "view")) {
        websiteItems.push({ name: "Amrut Nu Aachaman", path: "/dashboard/overview-management/amrut-nu-aachaman", icon: <SiGoogledataproc /> });
    }
    if (hasAccess("DailyDarshan", "create") || hasAccess("DailyDarshan", "view")) {
        websiteItems.push({ name: "Daily Darshan", path: "/dashboard/overview-management/daily-darshan", icon: <SiGoogleearth /> });
    }


    const sectionItems = [];
    if (hasAccess("Section", "create")) {
        sectionItems.push({ name: "Create Section", path: "/dashboard/sections/create", icon: <IoCreateOutline /> });
    }
    if (hasAccess("Section", "view")) {
        sectionItems.push({ name: "Section List", path: "/dashboard/sections/list", icon: <CiCircleList /> });
    }

    const roleItems = [];
    if (hasAccess("RolesPermissions", "create")) {
        roleItems.push({ name: "Create Role", path: "/dashboard/permissions/role", icon: <IoCreateOutline /> });
    }
    if (hasAccess("RolesPermissions", "view")) {
        roleItems.push({ name: "Role List", path: "/dashboard/permissions/lesson", icon: <CiCircleList /> });
    }

    const isActive = location.pathname === "/dashboard";

    const showDashboardBtn = hasAccess("Dashboard", "view");
    const showPermissionsBtn = hasAccess("Permissions", "view");

    return (
        <div className="w-full flex flex-col space-y-1.5">

            {/* Dashboard Button */}
            {showDashboardBtn && (
                <button
                    onClick={() => { navigate("/dashboard"); setSidebarOpen(false); }}
                    title={isMiniSidebar ? "Dashboard" : ""}
                    className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl font-semibold text-[15px] transition-all duration-200 group cursor-pointer 
                        ${isMiniSidebar ? "justify-center px-2" : ""}
                        ${isActive
                            ? theme ? "text-blue-200 bg-gray-800" : "text-red-600 bg-red-50"
                            : theme ? "text-white bg-gray-900 hover:bg-gray-800 hover:text-blue-200" : "text-gray-500 hover:bg-red-50 hover:text-red-600"
                        }`}
                >
                    <span className={`transition-colors ${isActive ? (theme ? "text-blue-200" : "text-red-600") : (theme ? "text-gray-300 group-hover:text-blue-200" : "text-gray-400 group-hover:text-red-600")}`}>
                        <HiOutlineHome className="text-xl" />
                    </span>
                    {!isMiniSidebar && "Dashboard"}
                </button>
            )}

            {/* Permissions Button */}
            {showPermissionsBtn && (
                <button
                    onClick={() => { navigate("/dashboard/permissions/messages"); setSidebarOpen(false); }}
                    title={isMiniSidebar ? "Permissions" : ""}
                    className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl font-semibold text-[15px] transition-all duration-200 group cursor-pointer 
                        ${isMiniSidebar ? "justify-center px-2" : ""}
                        ${isPermActive
                            ? theme ? "text-blue-200 bg-gray-800" : "text-red-600 bg-red-50"
                            : theme ? "text-white hover:bg-gray-800" : "text-gray-500 hover:bg-red-50"
                        }`}
                >
                    <span className={`transition-colors ${isActive ? (theme ? "text-blue-200" : "text-red-600") : (theme ? "text-gray-300 group-hover:text-blue-200" : "text-gray-400 group-hover:text-red-600")}`}>
                        <AiOutlineFileProtect className="text-xl" />
                    </span>
                    {!isMiniSidebar && "Permissions"}
                </button>
            )}

            {departmentItems.length > 0 && (
                <SidebarDropdown title="Department" icon={<HiOutlineLibrary className="text-xl" />} items={departmentItems} setSidebarOpen={setSidebarOpen} isMiniSidebar={isMiniSidebar} />
            )}

            {userItems.length > 0 && (
                <SidebarDropdown title="Users" icon={<FiUsers className="text-xl" />} items={userItems} setSidebarOpen={setSidebarOpen} isMiniSidebar={isMiniSidebar} />
            )}

            {websiteItems.length > 0 && (
                <SidebarDropdown title="Overview Manage" icon={<SiNginxproxymanager className="text-xl" />} items={websiteItems} setSidebarOpen={setSidebarOpen} isMiniSidebar={isMiniSidebar} />
            )}

            {sectionItems.length > 0 && (
                <SidebarDropdown title="Section Management" icon={<HiOutlineOfficeBuilding className="text-xl" />} items={sectionItems} setSidebarOpen={setSidebarOpen} isMiniSidebar={isMiniSidebar} />
            )}

            {roleItems.length > 0 && (
                <SidebarDropdown title="Roles & Permissions" icon={<HiOutlineShieldCheck className="text-xl" />} items={roleItems} setSidebarOpen={setSidebarOpen} isMiniSidebar={isMiniSidebar} />
            )}

            <h1 className={`text-sm font-normal my-4 ${theme ? "text-gray-400" : "text-gray-600"}`}>
                Departments Pipeline
            </h1>

            {filteredDepartments.map((dept) => {
                const sections = sectionsByDept[dept.departmentId] || [];

                const sectionStudentItems = sections.flatMap((sec) => {
                    const items = [];
                    if (hasAccess("Student", "create")) {
                        items.push({
                            name: `${sec.name} — Create Student`,
                            path: `/dashboard/departments/${dept.departmentId}/sections/${sec.section_id}/create-student`,
                            icon: <IoCreateOutline />
                        });
                    }
                    if (hasAccess("Student", "view")) {
                        items.push({
                            name: `${sec.name} — Student List`,
                            path: `/dashboard/departments/${dept.departmentId}/sections/${sec.section_id}/student-list`,
                            icon: <CiCircleList />
                        });
                    }
                    return items;
                });

                if (sectionStudentItems.length === 0) {
                    return (
                        <div
                            key={dept.departmentId}
                            className={`px-4 py-2.5 rounded-xl text-xs italic ${theme ? "text-gray-600 bg-gray-900/50" : "text-neutral-400 bg-neutral-50"}`}
                        >
                            {!isMiniSidebar && `${dept.departmentName}: No sections created yet`}
                        </div>
                    );
                }

                return (
                    <SidebarDropdown
                        key={dept.departmentId}
                        title={dept.departmentName}
                        icon={<HiOutlineAcademicCap className="text-xl" />}
                        items={sectionStudentItems}
                        setSidebarOpen={setSidebarOpen}
                        isMiniSidebar={isMiniSidebar}
                    />
                );
            })}

            {sectionsLoading && !isMiniSidebar && (
                <p className={`text-xs px-4 ${theme ? "text-gray-600" : "text-neutral-400"}`}>Loading sections...</p>
            )}
        </div>
    );
}