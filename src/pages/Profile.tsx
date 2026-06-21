import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, AtSign, Calendar, Gift, Hash, Settings, User } from "lucide-react";
import { useTheme } from "../components/theme/ThemeContext";

/* ----------------------------- Types ----------------------------- */

export interface ProfileViewUser {
  suid: string; // User ID
  username: string;
  fullName: string;
  birthDate: string;
  joinedDate: string;
  roleLabel: string;
  avatarUrl?: string;
}

interface ProfileViewProps {
  user?: ProfileViewUser;
  settingsPath?: string;
}

const DEFAULT_USER: ProfileViewUser = {
  suid: "123098",
  username: "super-admin",
  fullName: "Super Admin Principal",
  birthDate: "1990-08-08",
  joinedDate: "2024-01-14",
  roleLabel: "SUPER_ADMIN",
};

/* ------------------------- Sub components ------------------------- */

const InfoRow: React.FC<{ icon: React.ReactNode; label: string; value: string; theme: boolean }> = ({
  icon,
  label,
  value,
  theme,
}) => (
  <div
    className={`flex items-center gap-4 rounded-xl border px-5 py-4 transition-colors ${
      theme ? "border-gray-800 bg-gray-950/50" : "border-neutral-200 bg-neutral-50"
    }`}
  >
    <span
      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg shadow-sm ${
        theme ? "bg-blue-500/10 text-blue-300 border border-blue-500/20" : "bg-red-500/10 text-red-600 border border-red-100"
      }`}
    >
      {icon}
    </span>
    <span className="flex min-w-0 flex-col">
      <span className={`text-[11px] font-semibold uppercase tracking-wider ${theme ? "text-gray-400" : "text-neutral-500"}`}>
        {label}
      </span>
      <span className={`truncate text-[15px] font-bold mt-0.5 ${theme ? "text-gray-100" : "text-neutral-900"}`}>
        {value}
      </span>
    </span>
  </div>
);

/* ----------------------------- Main ----------------------------- */

const ProfileView: React.FC<ProfileViewProps> = ({
  user = DEFAULT_USER,
  settingsPath = "/dashboard/settings/profile",
}) => {
  const navigate = useNavigate();
  const { theme } = useTheme();

  const initial = user.fullName?.charAt(0)?.toUpperCase() || "U";

  const rows: { icon: React.ReactNode; label: string; value: string }[] = [
    { icon: <Hash size={20} />, label: "User ID", value: user.suid },
    { icon: <AtSign size={20} />, label: "Username", value: user.username },
    { icon: <User size={20} />, label: "Full Name", value: user.fullName },
    { icon: <Gift size={20} />, label: "Birthdate", value: user.birthDate },
    { icon: <Calendar size={20} />, label: "Joined Date", value: user.joinedDate },
  ];

  return (
    <div
      className={`w-full mx-auto p-6 sm:p-8 rounded-2xl shadow-sm mt-6 border transition-all duration-200 ${
        theme ? "bg-gray-900 border-gray-800 text-white" : "bg-white border-neutral-200 text-neutral-900"
      }`}
    >
      {/* ===== Header (Updated divider line for Light theme) ===== */}
      <div className="mb-8 pb-6 border-b flex flex-col items-start gap-4 border-neutral-100 dark:border-gray-400">
        <button
          onClick={() => navigate(-1)}
          className={`flex items-center gap-2 text-sm font-bold transition-colors cursor-pointer w-fit ${
            theme ? "text-gray-400 hover:text-white" : "text-neutral-500 hover:text-neutral-900"
          }`}
        >
          <ArrowLeft size={18} /> Dashboard
        </button>
        <div>
          <h2 className={`text-3xl sm:text-4xl font-bold tracking-tight ${theme ? "text-blue-200" : "text-red-600"}`}>
            My Profile
          </h2>
          <p className={`text-sm mt-1 max-w-md ${theme ? "text-gray-400" : "text-neutral-500"}`}>
            View your personal information and details
          </p>
        </div>
      </div>

      {/* ===== Main Content ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Avatar */}
        <div className="lg:col-span-4 h-max lg:sticky lg:top-8 flex flex-col items-center text-center">
          <div
            className={`flex h-32 w-32 items-center justify-center overflow-hidden rounded-full text-5xl font-black shadow-xl ring-4 ${
              theme ? "bg-gray-800 text-blue-300 ring-gray-800" : "bg-neutral-100 text-red-600 ring-neutral-100"
            }`}
          >
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.fullName} className="h-full w-full object-cover" />
            ) : (
              initial
            )}
          </div>
          <h2 className={`mt-6 text-2xl font-black tracking-tight ${theme ? "text-gray-100" : "text-neutral-900"}`}>
            {user.fullName}
          </h2>
          <p className={`text-[15px] font-medium mt-1 ${theme ? "text-gray-400" : "text-neutral-500"}`}>
            @{user.username}
          </p>
          
          <span
            className={`mt-5 inline-block rounded-full px-5 py-2 text-xs font-bold tracking-widest uppercase ${
              theme
                ? "bg-blue-500/10 text-blue-300 border border-blue-500/20"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            {user.roleLabel}
          </span>
        </div>

        {/* Right Column: Information List */}
        <div className="lg:col-span-8">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className={`text-lg font-bold ${theme ? "text-gray-100" : "text-neutral-900"}`}>
                Account Details
              </h3>
              <p className={`text-sm mt-1 ${theme ? "text-gray-400" : "text-neutral-500"}`}>
                Your assigned credentials and personal data.
              </p>
            </div>
            <button
              onClick={() => navigate(settingsPath)}
              className={`flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:-translate-y-0.5 cursor-pointer w-fit ${
                theme ? "bg-blue-600 hover:bg-blue-700 shadow-blue-600/20" : "bg-red-600 hover:bg-red-700 shadow-red-600/20"
              }`}
            >
              <Settings size={16} />
              Edit Profile
            </button>
          </div>
          
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {rows.map((row) => (
              <InfoRow key={row.label} icon={row.icon} label={row.label} value={row.value} theme={theme} />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProfileView;