import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "../pages/Layout/Layout";
import Overview from "../pages/Overview/Overview";
import Login from "../auth/Login";
import Dashboard from "../pages/Dashboard";

// યુઝર મેનેજમેન્ટ
import CreateUserForm from "../pages/Section/Users-Managemant/Create-user-form";
import UserList from "../pages/Section/Users-Managemant/User-list";

// ડિપાર્ટમેન્ટ મેનેજમેન્ટ
import CreateDepartment from "../pages/Section/Department-Management/Create-Department";
import DepartmentList from "../pages/Section/Department-Management/Department-List";

// 🎯 નવા ડાયનેમિક પેજ ઈમ્પોર્ટ કર્યા
import AdmissionRequestPage from "../pages/Section/Department-Management/AdmissionRequestPage";
import StudentListPage from "../pages/Section/Department-Management/StudentListPage";

// રોલ મેનેજમેન્ટ
import CreateRole from "../pages/Section/Role-managemant/Create-Role";
import RoleList from "../pages/Section/Role-managemant/RoleList";
import CreateAdmission from "../pages/Section/Department-Management/CreateAdmission";

// પ્રોફાઈલ (Popup એ header નું dropdown trigger છે, route નથી —
// એટલે ProfileView (read-only page) અને ProfileSetting (edit page) જ route થાય છે)
import Profile from "../pages/Profile";
import ProfileSetting from "../pages/Profile-Setting";

export default function Routers() {
    return (
        <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="/login" element={<Login />} />

            {/* મેઈન પેરેન્ટ Route */}
            <Route path="/dashboard" element={<Layout />} >
                <Route index element={<Dashboard />} />
                    <Route path="users/create" element={<CreateUserForm />} />
                    <Route path="users/list" element={<UserList />} />
                    <Route path="departments/create" element={<CreateDepartment />} />
                    <Route path="departments/list" element={<DepartmentList />} />
                    <Route path="departments/:deptId/create-admission" element={<CreateAdmission />} />
                    <Route path="departments/:deptId/admission-requests" element={<AdmissionRequestPage />} />
                    <Route path="departments/:deptId/student-list" element={<StudentListPage />} />
                    <Route path="permissions/role" element={<CreateRole />} />
                    <Route path="permissions/lesson" element={<RoleList />} />
                    <Route path="profile" element={<Profile />} />
                    <Route path="settings/profile" element={<ProfileSetting />} />

                <Route path="*" element={<Navigate to="/login" replace />} />
            </Route>
        </Routes>
    );
}