import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AtSign, Calendar, Gift, Hash, Settings, User, ShieldCheck, X } from "lucide-react";
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
    className={`group flex items-center gap-5 rounded-2xl border px-5 py-4 transition-all duration-300 shadow-sm cursor-default ${
      theme
        ? "border-gray-800 bg-gray-950/50 hover:-translate-y-1 hover:border-blue-500/30 hover:bg-gray-900/40 hover:shadow-[0_10px_25px_-5px_rgba(59,130,246,0.15)]"
        : "border-neutral-200 bg-neutral-50 hover:-translate-y-1 hover:border-red-200 hover:bg-white hover:shadow-[0_10px_25px_-5px_rgba(220,38,38,0.08)]"
    }`}
  >
    <span
      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl shadow-sm transition-all duration-300 ${
        theme 
          ? "bg-blue-500/10 text-blue-300 border border-blue-500/20 group-hover:bg-blue-500/20 group-hover:text-blue-200 group-hover:scale-105" 
          : "bg-red-500/10 text-red-600 border border-red-100 group-hover:bg-red-500/20 group-hover:text-red-700 group-hover:scale-105"
      }`}
    >
      {icon}
    </span>
    <span className="flex min-w-0 flex-col gap-0.5">
      <span className={`text-xs font-bold uppercase tracking-wider transition-colors duration-300 ${
        theme ? "text-gray-400 group-hover:text-blue-400" : "text-neutral-500 group-hover:text-red-500"
      }`}>
        {label}
      </span>
      <span className={`truncate text-base font-extrabold transition-colors duration-300 ${
        theme ? "text-gray-100 group-hover:text-white" : "text-neutral-900 group-hover:text-neutral-950"
      }`}>
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
  
  // State for synced user data and Image Modal
  const [userData, setUserData] = useState<ProfileViewUser>(user);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  // Sync with localStorage dynamically if default user is used
  useEffect(() => {
    if (user === DEFAULT_USER) {
      const stored = localStorage.getItem("adminData");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setUserData((prev) => ({ ...prev, ...parsed }));
        } catch (e) {
          console.error("Failed to parse admin data", e);
        }
      }
    } else {
      setUserData(user);
    }
  }, [user]);

  const initial = userData.fullName?.charAt(0)?.toUpperCase() || "U";

  const rows: { icon: React.ReactNode; label: string; value: string }[] = [
    { icon: <Hash size={20} />, label: "User ID (System ID)", value: userData.suid },
    { icon: <AtSign size={20} />, label: "Username", value: userData.username },
    { icon: <User size={20} />, label: "Full Name", value: userData.fullName },
    { icon: <Gift size={20} />, label: "Birthdate", value: userData.birthDate },
    { icon: <Calendar size={20} />, label: "Joined Date", value: userData.joinedDate },
  ];

  return (
    <div
      className={`w-full h-full p-4 sm:p-8 transition-all duration-300 ${
        theme ? "bg-[#0B1120] text-white" : "bg-white text-neutral-900"
      }`}
    >
      {/* ===== Header ===== */}
      <div className="mb-8 pb-4 border-b flex flex-col items-start gap-2 border-neutral-100 dark:border-gray-800">
        <div>
          <h2 className={`text-3xl sm:text-4xl font-bold tracking-tight ${theme ? "text-white" : "text-neutral-900"}`}>
            My Profile
          </h2>
          <p className={`text-sm sm:text-base mt-2 max-w-md font-medium ${theme ? "text-gray-400" : "text-neutral-500"}`}>
            View your personal information and details seamlessly.
          </p>
        </div>
      </div>

      {/* ===== Main Content ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: Avatar & Quick Info Card */}
        <div className={`lg:col-span-4 flex flex-col items-center text-center p-6 rounded-3xl border transition-all duration-300 h-max group ${
          theme 
            ? "border-transparent bg-gray-950/10 hover:border-gray-800 hover:bg-gray-950/30 hover:shadow-[0_15px_35px_-10px_rgba(0,0,0,0.3)] hover:-translate-y-1" 
            : "border-transparent bg-neutral-50/40 hover:border-neutral-200 hover:bg-neutral-50/80 hover:shadow-[0_15px_35px_-10px_rgba(0,0,0,0.05)] hover:-translate-y-1"
        }`}>
          <div
            onClick={() => setIsImageModalOpen(true)}
            className={`flex h-32 w-32 items-center justify-center overflow-hidden rounded-full text-5xl font-black shadow-xl ring-4 cursor-pointer transition-all duration-300 ${
              theme 
                ? "bg-linear-to-tr from-gray-800 to-gray-700 text-blue-300 ring-gray-800/50 group-hover:ring-blue-500/40 group-hover:scale-105 group-hover:shadow-blue-500/10" 
                : "bg-linear-to-tr from-neutral-100 to-white text-red-600 ring-neutral-100 group-hover:ring-red-500/30 group-hover:scale-105 group-hover:shadow-red-500/10"
            }`}
          >
            {userData.avatarUrl ? (
              <img src={userData.avatarUrl} alt={userData.fullName} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
            ) : (
              initial
            )}
          </div>
          <h2 className={`mt-6 text-2xl font-black tracking-tight transition-colors duration-300 ${theme ? "text-gray-50 group-hover:text-white" : "text-neutral-900 group-hover:text-neutral-950"}`}>
            {userData.fullName}
          </h2>
          <p className={`text-base font-medium mt-1 transition-colors duration-300 ${theme ? "text-blue-400/80 group-hover:text-blue-400" : "text-red-500/80 group-hover:text-red-600"}`}>
            @{userData.username}
          </p>
          
          <span
            className={`mt-5 inline-flex items-center gap-2 rounded-full px-5 py-2 text-xs font-black tracking-widest uppercase shadow-sm transition-all duration-300 ${
              theme
                ? "bg-blue-500/10 text-blue-300 border border-blue-500/20 group-hover:bg-blue-500/20 group-hover:border-blue-500/40"
                : "bg-red-50 text-red-700 border border-red-200 group-hover:bg-red-100 group-hover:border-red-300"
            }`}
          >
            <ShieldCheck size={16} /> {userData.roleLabel}
          </span>
        </div>

        {/* Right Column: Information List */}
        <div className="lg:col-span-8 space-y-6">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className={`text-xl font-bold tracking-tight ${theme ? "text-gray-100" : "text-neutral-900"}`}>
                Account Details
              </h3>
            </div>
            <button
              onClick={() => navigate(settingsPath)}
              className={`flex items-center gap-3 rounded-xl px-8 py-3.5 text-base font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-xl cursor-pointer w-fit ${
                theme 
                  ? "bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 shadow-blue-900/30 hover:shadow-blue-500/20" 
                  : "bg-linear-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 shadow-red-600/20 hover:shadow-red-500/30"
              }`}
            >
              <Settings size={18} className="transition-transform duration-500 group-hover:rotate-45" />
              Edit Profile
            </button>
          </div>
          
          {/* Info Grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {rows.map((row) => (
              <InfoRow key={row.label} icon={row.icon} label={row.label} value={row.value} theme={theme} />
            ))}
          </div>
        </div>
      </div>

      {/* ===== Ultra-Premium Image Lightbox Modal ===== */}
      {isImageModalOpen && (
        <div 
          onClick={() => setIsImageModalOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-xl bg-black/80 animate-in fade-in duration-300"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className={`relative max-w-md w-full aspect-square rounded-3xl p-3 border transition-all duration-300 scale-in-95 animate-in zoom-in-95 ${
              theme 
                ? "bg-gray-950 border-gray-850 shadow-[0_0_50px_rgba(59,130,246,0.25)]" 
                : "bg-white border-neutral-200 shadow-[0_0_50px_rgba(220,38,38,0.15)]"
            }`}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsImageModalOpen(false)}
              className={`absolute top-5 right-5 p-2 rounded-xl border transition-all duration-300 cursor-pointer hover:rotate-90 z-10 ${
                theme 
                  ? "bg-gray-900 border-gray-800 text-gray-400 hover:text-white hover:bg-gray-800" 
                  : "bg-neutral-50 border-neutral-200 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100"
              }`}
            >
              <X size={18} />
            </button>

            {/* Premium Full View Canvas */}
            <div className="w-full h-full rounded-2xl overflow-hidden flex items-center justify-center">
              {userData.avatarUrl ? (
                <img 
                  src={userData.avatarUrl} 
                  alt={userData.fullName} 
                  className="w-full h-full object-cover rounded-2xl animate-in fade-in zoom-in-90 duration-500" 
                />
              ) : (
                <div className={`w-full h-full flex items-center justify-center text-7xl font-black rounded-2xl ${
                  theme ? "bg-gray-900/50 text-blue-400" : "bg-neutral-50 text-red-600"
                }`}>
                  {initial}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileView;