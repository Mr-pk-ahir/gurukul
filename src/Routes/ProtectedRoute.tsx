import React from "react";
import { Navigate, Outlet } from "react-router-dom";

interface ProtectedRouteProps {
    module: string; // કયા મોડ્યુલ માટે ચેક કરવું છે? દા.ત. "Department"
    action?: "view" | "create" | "edit" | "delete"; // કઈ એક્શન? (બાય ડિફોલ્ટ "view")
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ module, action = "view" }) => {
    const userString = localStorage.getItem("user");
    const user = userString ? JSON.parse(userString) : null;

    // ૧. જો યુઝર લોગિન નથી, તો લોગિન પેજ પર મોકલો
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // ૨. ડાયનેમિક ચેક: શું આ યુઝર પાસે આ મોડ્યુલની આ એક્શન કરવાની પરમિશન છે?
    const hasPermission = user.permissions?.[module]?.[action];

    if (!hasPermission) {
        // જો પરમિશન ના હોય તો Unauthorized પેજ
        return <Navigate to="/unauthorized" replace />;
    }

    // ૩. પરમિશન હોય તો પેજ એક્સેસ કરવા દો
    return <Outlet />;
};

export default ProtectedRoute;