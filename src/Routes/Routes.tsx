import React from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import Layout from "../pages/Layout/Layout";
import Overview from "../pages/Overview/Overview";
import Login from "../auth/Login";
import Dashboard from "../pages/Dashboard";

import PublicAmrutNuAachaman from "../pages/Overview/Amrut-Nu-Aachaman";
import PublicDailyDarshan from "../pages/Overview/Daily-Darshan";

// યુઝર મેનેજમેન્ટ
import CreateUserForm from "../pages/Section/Users-Managemant/Create-user-form";
import UserList from "../pages/Section/Users-Managemant/User-list";

// ડિપાર્ટમેન્ટ મેનેજમેન્ટ
import CreateDepartment from "../pages/Section/Department-Management/Create-Department";
import DepartmentList from "../pages/Section/Department-Management/Department-List";

// નવા ડાયનેમિક પેજ
import AdmissionRequestPage from "../pages/Section/Department-Management/AdmissionRequestPage";
import StudentListPage from "../pages/Section/Department-Management/StudentListPage";

// રોલ મેનેજમેન્ટ
import CreateRole from "../pages/Section/Role-managemant/Create-Role";
import RoleList from "../pages/Section/Role-managemant/RoleList";
import CreateAdmission from "../pages/Section/Department-Management/CreateAdmission";

// પ્રોફાઈલ
import Profile from "../pages/Profile";
import ProfileSetting from "../pages/Profile-Setting";
import type { AuthUser } from "../Types/Role-create";

// ઓવરવ્યૂ મેનેજમેન્ટ
import OverviewManagement from "../pages/Section/Overview-Management/Overview-Management";
import AdminAmrutNuAachaman from "../pages/Section/Overview-Management/Amrut-Nu-Aachaman";
import AdminDailyDarshan from "../pages/Section/Overview-Management/Daily-Darshan";

interface ProtectedRouteProps {
    module?: string;
    action?: "view" | "create" | "edit" | "delete";
    requireLoginOnly?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ module, action = "view", requireLoginOnly = false }) => {
    const userString = localStorage.getItem("user");
    const user: AuthUser | null = userString ? JSON.parse(userString) : null;

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (requireLoginOnly) {
        return <Outlet />;
    }

    const hasPermission = user.permissions?.[module || ""]?.[action];

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
            તમારી પાસે આ મોડ્યુલ અથવા એક્શન એક્સેસ કરવાની પરમિશન નથી. કૃપા કરીને એડમિનનો સંપર્ક કરો.
        </p>
    </div>
);

export default function Routers() {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Overview />} />
            <Route path="/amrut-nu-aachaman" element={<PublicAmrutNuAachaman />} />
            <Route path="/daily-darshan" element={<PublicDailyDarshan />} />
            <Route path="/login" element={<Login />} />

            {/* Protected Dashboard Layout */}
            <Route path="/dashboard" element={<Layout />} >
                <Route index element={<Dashboard />} />
                <Route path="unauthorized" element={<UnauthorizedView />} />

                {/* Users Management */}
                <Route element={<ProtectedRoute module="Users" action="create" />}>
                    <Route path="users/create" element={<CreateUserForm />} />
                </Route>
                <Route element={<ProtectedRoute module="Users" action="view" />}>
                    <Route path="users/list" element={<UserList />} />
                </Route>

                {/* Department Management */}
                <Route element={<ProtectedRoute module="Department" action="create" />}>
                    <Route path="departments/create" element={<CreateDepartment />} />
                </Route>
                <Route element={<ProtectedRoute module="Department" action="view" />}>
                    <Route path="departments/list" element={<DepartmentList />} />
                    <Route path="departments/:deptId/create-admission" element={<CreateAdmission />} />
                    <Route path="departments/:deptId/admission-requests" element={<AdmissionRequestPage />} />
                    <Route path="departments/:deptId/student-list" element={<StudentListPage />} />
                </Route>

                {/* Roles & Permissions */}
                <Route element={<ProtectedRoute module="Roles & Permissions" action="create" />}>
                    <Route path="permissions/role" element={<CreateRole />} />
                </Route>
                <Route element={<ProtectedRoute module="Roles & Permissions" action="view" />}>
                    <Route path="permissions/lesson" element={<RoleList />} />
                </Route>

                <Route element={<ProtectedRoute requireLoginOnly />}>
                    <Route path="profile" element={<Profile />} />
                    <Route path="settings/profile" element={<ProfileSetting />} />
                </Route>

                {/* Overview Management (Dynamic Action Checks) */}
                <Route element={<ProtectedRoute module="overview-management" action="view" />}>
                    <Route path="overview-management" element={<OverviewManagement />} />
                </Route>
                <Route element={<ProtectedRoute module="overview-management" action="create" />}>
                    <Route path="overview-management/amrut-nu-aachaman" element={<AdminAmrutNuAachaman />} />
                    <Route path="overview-management/daily-darshan" element={<AdminDailyDarshan />} />
                </Route>

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Route>
        </Routes>
    );
}