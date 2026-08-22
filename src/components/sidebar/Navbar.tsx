/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../theme/ThemeContext";
import SidebarDropdown from "./SidebarDropdown";
import {
    HiOutlineHome,
    HiOutlineLibrary,
    HiOutlineShieldCheck,
    HiOutlineAcademicCap,
    HiOutlineOfficeBuilding,
    HiOutlineChartBar,
    HiOutlineBookOpen,
    HiOutlineClipboardCheck,
    HiOutlineUserGroup,
    HiStar
} from "react-icons/hi";
import { FiUsers, FiRefreshCw } from "react-icons/fi";
import { CiCircleList } from "react-icons/ci";
import { IoCreateOutline } from "react-icons/io5";
import { SiGoogledataproc, SiGoogleearth, SiNginxproxymanager } from "react-icons/si";
import { RiEditBoxLine } from "react-icons/ri";
import type { AuthUser } from "../../Types/Role-create";
import { AiOutlineFileProtect } from "react-icons/ai";
import { toast } from "sonner";
import { departmentService } from "../../services/departmentService";
import { sectionService } from "../../services/sectionService";
import { groupService, isGroupLeader, type GroupData } from "../../services/groupService";
import { RxActivityLog } from "react-icons/rx";
import { MdOutlineEvent } from "react-icons/md";

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

    const [refreshing, setRefreshing] = useState<boolean>(false);

    // 🎯 NAVU: user je-je groups no member chhe e list — data-driven (role-based nathi)
    const [myGroups, setMyGroups] = useState<GroupData[]>([]);
    const [groupsLoading, setGroupsLoading] = useState<boolean>(false);

    const [user, setUser] = useState<AuthUser | null>(null);

    useEffect(() => {
        const data = localStorage.getItem("user");
        if (data) {
            try {
                const parsed: AuthUser = JSON.parse(data);

                if (typeof parsed.permissions === "string") {
                    try {
                        parsed.permissions = JSON.parse(parsed.permissions);
                    } catch (parseError) {
                        console.error("❌ Error parsing permissions string:", parseError);
                    }
                }

                setUser(parsed);

                // 🎯 NAVU: user load thay etle j tena groups fetch karo (navbar "My Groups" mate)
                if ((parsed as any)?.suid) {
                    setGroupsLoading(true);
                    groupService.getGroupsByMember((parsed as any).suid)
                        .then((res) => {
                            if (res.success && Array.isArray(res.data)) setMyGroups(res.data);
                        })
                        .finally(() => setGroupsLoading(false));
                }
            } catch (e) {
                console.error("❌ Error parsing overall user data:", e);
            }
        }
    }, []);

    const fetchDepartments = useCallback(async () => {
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
    }, []);

    useEffect(() => {
        fetchDepartments();
    }, [fetchDepartments]);

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

    const handleRefresh = async () => {
        if (refreshing) return;
        setRefreshing(true);
        try {
            await fetchDepartments();
            toast.success("Navbar refreshed!");
        } finally {
            setRefreshing(false);
        }
    };

    const hasAccess = (module: string, action: string) => {
        if (user?.roleCode === "SUPER_ADMIN") return true;

        const userPerms: any = user?.permissions;
        if (userPerms && typeof userPerms === "object") {
            return !!userPerms[module]?.[action];
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
    const isProgressActive = location.pathname === "/dashboard/progress";
    const isMyLessonsActive = location.pathname === "/dashboard/lessons/my-lessons";

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
    if (hasAccess("OverviewEdit", "view") || hasAccess("Activities", "view")) {
        websiteItems.push({ name: "Activities", path: "/dashboard/overview-management/activities", icon: <RxActivityLog /> });
    }
    if (hasAccess("OverviewEdit", "view") || hasAccess("UpcomingEvents", "view")) {
        websiteItems.push({ name: "Upcoming Events", path: "/dashboard/overview-management/events", icon: <MdOutlineEvent /> });
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

    // 🎯 Lesson Management dropdown — fakt SUPER_ADMIN / HEAD100 / SECHEAD101 mate (create+list)
    const lessonItems = [];
    if (hasAccess("Lesson", "create")) {
        lessonItems.push({ name: "Create Lesson", path: "/dashboard/lessons/create", icon: <IoCreateOutline /> });
    }
    if (hasAccess("Lesson", "view")) {
        lessonItems.push({ name: "Lesson List", path: "/dashboard/lessons/list", icon: <CiCircleList /> });
    }

    // 🎯 Groups management dropdown — fakt SUPER_ADMIN / HEAD100 mate (create/edit/list — WhatsApp-style)
    const groupItems = [];
    if (hasAccess("Group", "create")) {
        groupItems.push({ name: "Create Group", path: "/dashboard/groups/create", icon: <IoCreateOutline /> });
    }
    if (hasAccess("Group", "view")) {
        groupItems.push({ name: "Group List", path: "/dashboard/groups/list", icon: <CiCircleList /> });
    }

    const isActive = location.pathname === "/dashboard";

    const showDashboardBtn = hasAccess("Dashboard", "view");
    const showPermissionsBtn = hasAccess("Permissions", "view");
    const showProgressBtn = hasAccess("Progress", "view");
    const showMyLessonsBtn = hasAccess("MyLessons", "view");

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
                    <span className={`transition-colors ${isPermActive ? (theme ? "text-blue-200" : "text-red-600") : (theme ? "text-gray-300 group-hover:text-blue-200" : "text-gray-400 group-hover:text-red-600")}`}>
                        <AiOutlineFileProtect className="text-xl" />
                    </span>
                    {!isMiniSidebar && "Permissions"}
                </button>
            )}

            {/* Progress Button */}
            {showProgressBtn && (
                <button
                    onClick={() => { navigate("/dashboard/progress"); setSidebarOpen(false); }}
                    title={isMiniSidebar ? "Progress" : ""}
                    className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl font-semibold text-[15px] transition-all duration-200 group cursor-pointer 
                        ${isMiniSidebar ? "justify-center px-2" : ""}
                        ${isProgressActive
                            ? theme ? "text-blue-200 bg-gray-800" : "text-red-600 bg-red-50"
                            : theme ? "text-white hover:bg-gray-800" : "text-gray-500 hover:bg-red-50"
                        }`}
                >
                    <span className={`transition-colors ${isProgressActive ? (theme ? "text-blue-200" : "text-red-600") : (theme ? "text-gray-300 group-hover:text-blue-200" : "text-gray-400 group-hover:text-red-600")}`}>
                        <HiOutlineChartBar className="text-xl" />
                    </span>
                    {!isMiniSidebar && "Progress"}
                </button>
            )}

            {/* My Lessons Button */}
            {showMyLessonsBtn && (
                <button
                    onClick={() => { navigate("/dashboard/lessons/my-lessons"); setSidebarOpen(false); }}
                    title={isMiniSidebar ? "My Lessons" : ""}
                    className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl font-semibold text-[15px] transition-all duration-200 group cursor-pointer 
                        ${isMiniSidebar ? "justify-center px-2" : ""}
                        ${isMyLessonsActive
                            ? theme ? "text-blue-200 bg-gray-800" : "text-red-600 bg-red-50"
                            : theme ? "text-white hover:bg-gray-800" : "text-gray-500 hover:bg-red-50"
                        }`}
                >
                    <span className={`transition-colors ${isMyLessonsActive ? (theme ? "text-blue-200" : "text-red-600") : (theme ? "text-gray-300 group-hover:text-blue-200" : "text-gray-400 group-hover:text-red-600")}`}>
                        <HiOutlineClipboardCheck className="text-xl" />
                    </span>
                    {!isMiniSidebar && "My Lessons"}
                </button>
            )}

            {/* 🎯 NAVU: My Groups — user je groups no member chhe e badha dynamically, leader ne gold star */}
            {myGroups.length > 0 && (
                <div className="space-y-1">
                    {!isMiniSidebar && (
                        <p className={`text-xs font-bold uppercase tracking-wide px-4 mt-3 mb-1 ${theme ? "text-gray-600" : "text-gray-400"}`}>
                            My Groups
                        </p>
                    )}
                    {myGroups.map((group) => {
                        const isGroupActive = location.pathname === `/dashboard/groups/member/${group.group_id}`;
                        const leader = isGroupLeader(group, (user as any)?.suid);
                        return (
                            <button
                                key={group.group_id}
                                onClick={() => { navigate(`/dashboard/groups/member/${group.group_id}`); setSidebarOpen(false); }}
                                title={isMiniSidebar ? group.group_name : ""}
                                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200 group cursor-pointer
                                    ${isMiniSidebar ? "justify-center px-2" : ""}
                                    ${isGroupActive
                                        ? theme ? "text-blue-200 bg-gray-800" : "text-red-600 bg-red-50"
                                        : theme ? "text-gray-300 hover:bg-gray-800" : "text-gray-500 hover:bg-red-50"
                                    }`}
                            >
                                <HiOutlineUserGroup className="text-lg shrink-0" />
                                {!isMiniSidebar && <span className="flex-1 text-left truncate">{group.group_name}</span>}
                                {leader && <HiStar className="text-amber-400 shrink-0" title="Group Leader" />}
                            </button>
                        );
                    })}
                </div>
            )}
            {groupsLoading && !isMiniSidebar && (
                <p className={`text-xs px-4 ${theme ? "text-gray-600" : "text-neutral-400"}`}>Loading groups...</p>
            )}

            {departmentItems.length > 0 && (
                <SidebarDropdown title="Department" icon={<HiOutlineLibrary className="text-xl" />} items={departmentItems} setSidebarOpen={setSidebarOpen} isMiniSidebar={isMiniSidebar} />
            )}

            {userItems.length > 0 && (
                <SidebarDropdown title="Users" icon={<FiUsers className="text-xl" />} items={userItems} setSidebarOpen={setSidebarOpen} isMiniSidebar={isMiniSidebar} />
            )}

            {lessonItems.length > 0 && (
                <SidebarDropdown title="Lesson Management" icon={<HiOutlineBookOpen className="text-xl" />} items={lessonItems} setSidebarOpen={setSidebarOpen} isMiniSidebar={isMiniSidebar} />
            )}

            {groupItems.length > 0 && (
                <SidebarDropdown title="Group Management" icon={<HiOutlineUserGroup className="text-xl" />} items={groupItems} setSidebarOpen={setSidebarOpen} isMiniSidebar={isMiniSidebar} />
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

            <div className="flex items-center justify-between my-4 px-1">
                {!isMiniSidebar && (
                    <h1 className={`text-sm font-normal ${theme ? "text-gray-400" : "text-gray-600"}`}>
                        Departments Pipeline
                    </h1>
                )}
                <button
                    onClick={handleRefresh}
                    disabled={refreshing}
                    title="Refresh departments"
                    className={`flex items-center justify-center w-7 h-7 rounded-lg shrink-0 transition-colors disabled:opacity-50 ${theme ? "text-gray-400 hover:bg-gray-800 hover:text-blue-300" : "text-gray-400 hover:bg-gray-100 hover:text-[#9b001c]"
                        } ${isMiniSidebar ? "mx-auto" : ""}`}
                >
                    <FiRefreshCw className={`text-sm ${refreshing ? "animate-spin" : ""}`} />
                </button>
            </div>

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