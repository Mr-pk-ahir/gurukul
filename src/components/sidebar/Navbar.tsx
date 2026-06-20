import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../theme/ThemeContext"; // તમારી ThemeContext ફાઇલ પાથ અહીં ચેક કરી લેવો
import SidebarDropdown from "./SidebarDropdown";
import { 
    HiOutlineHome, 
    HiOutlineLibrary, 
    HiOutlineUser
} from "react-icons/hi";
import { FiUsers } from "react-icons/fi"; // યુઝર્સ મેનૂ માટે નવો આઇકોન
import { CiCircleList } from "react-icons/ci";
import { IoCreateOutline } from "react-icons/io5";

interface NavbarProps {
    setSidebarOpen: (isOpen: boolean) => void;
    isMiniSidebar: boolean;
}

export default function Navbar({ setSidebarOpen, isMiniSidebar }: NavbarProps) {
    const { theme } = useTheme(); // ડાર્ક/લાઇટ થીમ લેવા માટે (true = Dark, false = Light assumed)
    const navigate = useNavigate();
    const location = useLocation();
    
    const [hasGurukulAccess, setHasGurukulAccess] = useState<boolean>(false);
    const [hasPermissionAccess, setHasPermissionAccess] = useState<boolean>(false);

    useEffect(() => {
        const data = localStorage.getItem("user");
        if (data) {
            try {
                const parsed = JSON.parse(data);
                if (parsed.permissions) {
                    setHasGurukulAccess(!!parsed.permissions.hasGurukulAccess);
                    setHasPermissionAccess(!!parsed.permissions.hasPermissionAccess);
                }
            } catch (e) {
                console.error("Error parsing permissions:", e);
            }
        }
    }, []);

    // ૧. ડિપાર્ટમેન્ટના આઇટમ્સ અને પાથ
    const departmentItems = [
        { name: "Create Departments", path: "/departments", icon: <IoCreateOutline /> },
        { name: "Departments List", path: "/lessons", icon: <CiCircleList /> },
    ];

    // ૨. યુઝર્સ મેનેજમેન્ટના સાચા પાથ (અહીં ફેરફાર કર્યો છે)
    const userItems = [
        { name: "Create User", path: "/users/create", icon: <IoCreateOutline /> },
        { name: "User List", path: "/users/list", icon: <CiCircleList /> },
    ];

    // ૩. રોલ્સ અને પરમિશનના પાથ
    const roleItems = [
        { name: "Create Role", path: "/permissions/role", icon: <IoCreateOutline /> },
        { name: "Role List", path: "/permissions/lesson", icon: <CiCircleList /> },
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

            {/* --- Department Dropdown --- */}
            {hasGurukulAccess && (
                <SidebarDropdown 
                    title="Department"
                    icon={<HiOutlineLibrary className="text-xl" />}
                    items={departmentItems}
                    setSidebarOpen={setSidebarOpen}
                    isMiniSidebar={isMiniSidebar}
                />
            )}

            {/* --- Users Dropdown --- */}
            {hasPermissionAccess && (
                <SidebarDropdown 
                    title="Users"
                    icon={<FiUsers className="text-xl" />} // અહીં યુઝર્સ માટે અલગ આઇકોન સેટ કર્યો
                    items={userItems}
                    setSidebarOpen={setSidebarOpen}
                    isMiniSidebar={isMiniSidebar}
                />
            )}
            
            {/* --- Roles & Permission Dropdown --- */}
            {hasPermissionAccess && (
                <SidebarDropdown 
                    title="Roles & permmision"
                    icon={<HiOutlineUser className="text-xl" />}
                    items={roleItems}
                    setSidebarOpen={setSidebarOpen}
                    isMiniSidebar={isMiniSidebar}
                />
            )}

        </div>
    );
}