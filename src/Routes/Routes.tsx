import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "../pages/Layout/Layout";
import Overview from "../pages/Overview/Overview";
import Login from "../auth/Login";
import Dashboard from "../pages/Dashboard";

// નવા કમ્પોનન્ટ્સ ઇમ્પોર્ટ કર્યા (તમારા પ્રોજેક્ટ ફોલ્ડર સ્ટ્રક્ચર પ્રમાણે)
import CreateUserForm from "../pages/Section/Users-Managemant/Create-user-form";
import UserList from "../pages/Section/Users-Managemant/User-list";

export default function Routers() {
    return (
        <Routes>
            {/* પબ્લિક રૂટ્સ */}
            <Route path="/" element={<Overview />} />
            <Route path="/login" element={<Login />} />
            
            {/* પ્રોટેક્ટેડ/ડેશબોર્ડ રૂટ્સ (Layout ની અંદર Nested) */}
            <Route path="/dashboard" element={<Layout />} >
                {/* /dashboard ઓપન થાય ત્યારે આ લોડ થશે */}
                <Route index element={<Dashboard />} />
            </Route>

            {/* યુઝર મેનેજમેન્ટ રૂટ્સ (આ પણ Layout ની અંદર જ ઓપન થશે) */}
            <Route path="/users" element={<Layout />}>
                {/* પાથ: /users/create */}
                <Route path="create" element={<CreateUserForm />} />
                {/* પાથ: /users/list */}
                <Route path="list" element={<UserList />} />
            </Route>
            
            {/* બાકીના બધા જ ખોટા પાથ માટે લોગિન પર રીડાયરેક્ટ */}
            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    );
}