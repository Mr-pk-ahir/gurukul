import React from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import Layout from "../pages/Layout/Layout";
import Overview from "../pages/Overview/Overview";
import Login from "../auth/Login";
import Dashboard from "../pages/Dashboard";

import AmrutAachaman from "../pages/Overview/Amrut-Nu-Aachaman";
import DailyDarshanPage from "../pages/Overview/Daily-Darshan";
import ActivitiesPage from "../pages/Overview/ActivitiesPage";
import UpcomingEventsPage from "../pages/Overview/UpcomingEventsPage";

// યુઝર મેનેજમેન્ટ
import CreateUserForm from "../pages/Section/Users-Managemant/Create-user-form";
import UserList from "../pages/Section/Users-Managemant/User-list";

// ડિપાર્ટમેન્ટ મેનેજમેન્ટ
import CreateDepartment from "../pages/Section/Department-Management/Create-Department";
import DepartmentList from "../pages/Section/Department-Management/Department-List";
import CreateStudent from "../pages/Section/Department-Management/Create-Student";
import StudentListPage from "../pages/Section/Department-Management/StudentListPage";

// 👑 સેક્શન મેનેજમેન્ટ ઇમ્પોર્ટ
import CreateSection from "../pages/Section/Section-Managemant/Section-Create";
import SectionList from "../pages/Section/Section-Managemant/Section-list";

// રોલ મેનેજમેન્ટ
import CreateRole from "../pages/Section/Role-managemant/Create-Role";
import RoleList from "../pages/Section/Role-managemant/RoleList";

// પ્રોફાઈલ
import Profile from "../pages/Profile";
import ProfileSetting from "../pages/Profile-Setting";
import type { AuthUser } from "../Types/Role-create";

// ઓવરવ્યૂ મેનેજમેન્ટ
import OverviewManagement from "../pages/Section/Overview-Management/Overview-Management";
import AdminAmrutNuAachaman from "../pages/Section/Overview-Management/Amrut-Nu-Aachaman";
import AdminDailyDarshan from "../pages/Section/Overview-Management/Daily-Darshan";
import Permission from "../pages/Section/Permissions-Managemant/Permission";

import Activities from "../pages/Section/Overview-Management/Activities";
import UpcomingEvents from "../pages/Section/Overview-Management/Upcoming-Events";

import ProgressDashboard from "../pages/Section/ProgressDashboard";

// 👑 ગ્રુપ મેનેજમેન્ટ ઇમ્પોર્ટ
import CreateGroup from "../pages/Section/Group-Managemant/Create-Group";
import GroupList from "../pages/Section/Group-Managemant/Group-List";

// 👥 NAVU: Group Member Detail — group ma je member chhe e joi shake tevu page
import GroupMemberDetail from "../pages/Section/Group-Managemant/Groupmemberdetail";


interface ProtectedRouteProps {
    module?: string;
    action?: "view" | "create" | "edit" | "delete";
    requireLoginOnly?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ module, action = "view", requireLoginOnly = false }) => {
    const userString = localStorage.getItem("user");
    let user: AuthUser | null = userString ? JSON.parse(userString) : null;

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (requireLoginOnly) {
        return <Outlet />;
    }

    // Permissions string parse safety check
    let permissions = user.permissions;
    if (typeof permissions === "string") {
        try {
            permissions = JSON.parse(permissions);
        } catch (e) {
            permissions = {};
        }
    }

    const hasPermission = permissions?.[module || ""]?.[action];

    if (!hasPermission) {
        return <Navigate to="/dashboard/unauthorized" replace />;
    }

    return <Outlet />;
};

const UnauthorizedView = () => (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
        <h1 className="text-5xl font-black text-red-500 tracking-wide animate-bounce">403</h1>
        <h2 className="text-xl font-bold text-gray-700 mt-2 dark:text-gray-300">Access Denied!</h2>
        <p className="text-sm text-gray-400 mt-1 max-w-sm">
            You do not have permission to view this page. Please contact your administrator if you believe this is an error.
        </p>
    </div>
);

export default function Routers() {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Overview />} />
            <Route path="/amrut-nu-aachaman" element={<AmrutAachaman />} />
            <Route path="/daily-darshan" element={<DailyDarshanPage />} />
            <Route path="/events" element={<UpcomingEventsPage />} />
            <Route path="/activities" element={<ActivitiesPage />} />
            <Route path="/login" element={<Login />} />

            <Route path="/dashboard" element={<Layout />} >
                <Route index element={<Dashboard />} />
                <Route path="unauthorized" element={<UnauthorizedView />} />

                <Route element={<ProtectedRoute module="Users" action="create" />}>
                    <Route path="users/create" element={<CreateUserForm />} />
                </Route>
                <Route element={<ProtectedRoute module="Users" action="view" />}>
                    <Route path="users/list" element={<UserList />} />
                </Route>

                <Route element={<ProtectedRoute module="Department" action="create" />}>
                    <Route path="departments/create" element={<CreateDepartment />} />
                </Route>
                <Route element={<ProtectedRoute module="Department" action="view" />}>
                    <Route path="departments/list" element={<DepartmentList />} />
                </Route>

                <Route element={<ProtectedRoute module="Student" action="create" />}>
                    <Route path="departments/:deptId/sections/:sectionId/create-student" element={<CreateStudent />} />
                </Route>
                <Route element={<ProtectedRoute module="Student" action="view" />}>
                    <Route path="departments/:deptId/sections/:sectionId/student-list" element={<StudentListPage />} />
                </Route>

                <Route element={<ProtectedRoute module="Section" action="create" />}>
                    <Route path="sections/create" element={<CreateSection />} />
                </Route>
                <Route element={<ProtectedRoute module="Section" action="view" />}>
                    <Route path="sections/list" element={<SectionList />} />
                </Route>

                <Route path="permissions/messages" element={<Permission />} />

                <Route element={<ProtectedRoute module="RolesPermissions" action="create" />}>
                    <Route path="permissions/role" element={<CreateRole />} />
                </Route>
                <Route element={<ProtectedRoute module="RolesPermissions" action="view" />}>
                    <Route path="permissions/lesson" element={<RoleList />} />
                </Route>

                {/* 👑 Group Management - fakt SUPER_ADMIN, HEAD100 mate */}
                <Route element={<ProtectedRoute module="Group" action="create" />}>
                    <Route path="groups/create" element={<CreateGroup />} />
                </Route>
                <Route element={<ProtectedRoute module="Group" action="view" />}>
                    <Route path="groups/list" element={<GroupList />} />
                </Route>
                <Route element={<ProtectedRoute module="Group" action="view" />}>
                    <Route path="groups/edit/:groupId" element={<CreateGroup />} />
                </Route>

                {/* 👥 NAVU: Group Member Detail — access group-membership thi backend check thashe,
                    etle requireLoginOnly vaparyu chhe (static role permission na badle). Badha members
                    (SUPER_ADMIN thi student sudhi) potana group no detail joi shake. */}
                <Route element={<ProtectedRoute requireLoginOnly />}>
                    <Route path="groups/member/:groupId" element={<GroupMemberDetail />} />
                </Route>

                <Route element={<ProtectedRoute requireLoginOnly />}>
                    <Route path="profile" element={<Profile />} />
                    <Route path="settings/profile" element={<ProfileSetting />} />
                </Route>

                {/* 📊 Progress Module Route */}
                <Route element={<ProtectedRoute module="Progress" action="view" />}>
                    <Route path="progress" element={<ProgressDashboard />} />
                </Route>

                <Route element={<ProtectedRoute module="OverviewEdit" action="view" />}>
                    <Route path="overview-management" element={<OverviewManagement />} />
                </Route>
                <Route element={<ProtectedRoute module="AmrutNuAachaman" action="view" />}>
                    <Route path="overview-management/amrut-nu-aachaman" element={<AdminAmrutNuAachaman />} />
                </Route>
                <Route element={<ProtectedRoute module="DailyDarshan" action="view" />}>
                    <Route path="overview-management/daily-darshan" element={<AdminDailyDarshan />} />
                </Route>
                <Route element={<ProtectedRoute module="OverviewEdit" action="view" />}>
                    <Route path="overview-management/activities" element={<Activities />} />
                </Route>
                <Route element={<ProtectedRoute module="OverviewEdit" action="view" />}>
                    <Route path="overview-management/events" element={<UpcomingEvents />} />
                </Route>

                <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Route>
        </Routes>
    );
}