import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../theme/ThemeContext"; 
import SidebarDropdown from "./SidebarDropdown";
import { 
    HiOutlineHome, 
    HiOutlineLibrary, 
    HiOutlineShieldCheck,
    HiOutlineClipboardList, // રિક્વેસ્ટ માટે આઇકોન
    HiOutlineAcademicCap    // સ્ટુડન્ટ લિસ્ટ માટે આઇકોન
} from "react-icons/hi";
import { FiUsers } from "react-icons/fi"; 
import { CiCircleList } from "react-icons/ci";
import { IoCreateOutline } from "react-icons/io5";

interface NavbarProps {
    setSidebarOpen: (isOpen: boolean) => void;
    isMiniSidebar: boolean;
}

export default function Navbar({ setSidebarOpen, isMiniSidebar }: NavbarProps) {
    const { theme } = useTheme(); 
    const navigate = useNavigate();
    const location = useLocation();
    
    const [hasGurukulAccess, setHasGurukulAccess] = useState<boolean>(true);
    const [hasPermissionAccess, setHasPermissionAccess] = useState<boolean>(true);
    
    const [userDeptId, setUserDeptId] = useState<number | null>(null);

    useEffect(() => {
        const data = localStorage.getItem("user");
        if (data) {
            try {
                const parsed = JSON.parse(data);
                
                if (parsed.departmentId) {
                    setUserDeptId(Number(parsed.departmentId));
                }

                if (parsed.permissions) {
                    setHasGurukulAccess(!!parsed.permissions.hasGurukulAccess);
                    setHasPermissionAccess(!!parsed.permissions.hasPermissionAccess);
                }
            } catch (e) {
                console.error("Error parsing user data:", e);
            }
        }
    }, []);

    const departmentItems = [
        { name: "Create Departments", path: "/dashboard/departments/create", icon: <IoCreateOutline /> },
        { name: "Departments List", path: "/dashboard/departments/list", icon: <CiCircleList /> }, 
    ];
    
    const pipelineItems = userDeptId ? [
        { name: "Create Admission", path: `/dashboard/departments/${userDeptId}/create-admission`, icon: <IoCreateOutline /> },
        { name: "Admission Requests", path: `/dashboard/departments/${userDeptId}/admission-requests`, icon: <HiOutlineClipboardList /> },
        { name: "Student List", path: `/dashboard/departments/${userDeptId}/student-list`, icon: <HiOutlineAcademicCap /> },
    ] : [];

    const userItems = [
        { name: "Create User", path: "/dashboard/users/create", icon: <IoCreateOutline /> },
        { name: "User List", path: "/dashboard/users/list", icon: <CiCircleList /> },
    ];

    const roleItems = [
        { name: "Create Role", path: "/dashboard/permissions/role", icon: <IoCreateOutline /> },
        { name: "Role List", path: "/dashboard/permissions/lesson", icon: <CiCircleList /> }, 
    ];
    
    const isActive = location.pathname === "/dashboard";

    return (
        <div className="w-full flex flex-col space-y-1.5">
            
            {/* --- Dashboard --- */}
            <button
                onClick={() => {
                    navigate("/dashboard");
                    setSidebarOpen(false);
                }}
                title={isMiniSidebar ? "Dashboard" : ""}
                className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl font-semibold text-[15px] transition-all duration-200 group cursor-pointer 
                    ${isMiniSidebar ? "justify-center px-2" : ""}
                    ${
                        isActive
                            ? theme 
                                ? "text-blue-200 bg-gray-800" 
                                : "text-red-600 bg-red-50"
                            : theme 
                                ? "text-white bg-gray-900 hover:bg-gray-800 hover:text-blue-200" 
                                : "text-gray-500 hover:bg-red-50 hover:text-red-600"
                    }
                `}
            >
                <span className={`transition-colors ${
                    isActive 
                        ? theme ? "text-blue-200" : "text-red-600" 
                        : theme 
                            ? "text-gray-300 group-hover:text-blue-200" 
                            : "text-gray-400 group-hover:text-red-600"
                }`}>
                    <HiOutlineHome className="text-xl" />
                </span>
                {!isMiniSidebar && "Dashboard"}
            </button>

            {userDeptId && pipelineItems.length > 0 && (
                <SidebarDropdown 
                    title="My Pipeline"
                    icon={<HiOutlineAcademicCap className="text-xl" />}
                    items={pipelineItems}
                    setSidebarOpen={setSidebarOpen}
                    isMiniSidebar={isMiniSidebar}
                />
            )}

            {hasGurukulAccess && (
                <SidebarDropdown 
                    title="Department"
                    icon={<HiOutlineLibrary className="text-xl" />}
                    items={departmentItems}
                    setSidebarOpen={setSidebarOpen}
                    isMiniSidebar={isMiniSidebar}
                />
            )}

            {hasPermissionAccess && (
                <SidebarDropdown 
                    title="Users"
                    icon={<FiUsers className="text-xl" />} 
                    items={userItems}
                    setSidebarOpen={setSidebarOpen}
                    isMiniSidebar={isMiniSidebar}
                />
            )}
            
            {hasPermissionAccess && (
                <SidebarDropdown 
                    title="Roles & Permissions"
                    icon={<HiOutlineShieldCheck className="text-xl" />}
                    items={roleItems}
                    setSidebarOpen={setSidebarOpen}
                    isMiniSidebar={isMiniSidebar}
                />
            )}

        </div>
    );
}