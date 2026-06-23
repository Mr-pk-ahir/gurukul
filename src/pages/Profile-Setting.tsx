import React, { useState, useRef, useEffect } from "react";
import {
  AtSign,
  Calendar,
  Camera,
  Check,
  Eye,
  EyeOff,
  Hash,
  Lock,
  ShieldCheck,
  User,
  Gift,
} from "lucide-react";
import { useTheme } from "../components/theme/ThemeContext";

/* ----------------------------- Types ----------------------------- */

export interface ProfileSettingsUser {
  suid: string; // User ID
  username: string;
  fullName: string;
  birthDate: string;
  joinedDate: string;
  roleLabel: string;
  avatarUrl?: string;
}

interface ProfileSettingProps {
  user?: ProfileSettingsUser;
  onSaveProfile?: (data: Omit<ProfileSettingsUser, "roleLabel">) => Promise<void> | void;
  onChangePassword?: (data: { currentPassword: string; newPassword: string }) => Promise<void> | void;
}

const DEFAULT_USER: ProfileSettingsUser = {
  suid: "123098",
  username: "super-admin",
  fullName: "Super Admin Principal",
  birthDate: "1990-08-08",
  joinedDate: "2024-01-14",
  roleLabel: "SUPER_ADMIN",
};

/* ------------------------- Sub components ------------------------- */

function SectionHeading({ icon, title, theme }: { icon: React.ReactNode; title: string; theme: boolean }) {
  return (
    <div className="flex items-center gap-4 mb-8 group">
      <div
        className={`flex items-center justify-center w-9 h-9 rounded-xl shrink-0 shadow-sm transition-all duration-300 group-hover:scale-110 ${
          theme
            ? "bg-linear-to-br from-blue-500/20 to-blue-600/10 text-blue-400 border border-blue-500/20 group-hover:border-blue-500/40 group-hover:shadow-[0_0_15px_rgba(59,130,246,0.2)]"
            : "bg-linear-to-br from-red-500/10 to-red-600/5 text-red-600 border border-red-100 group-hover:border-red-300 group-hover:shadow-[0_0_15px_rgba(220,38,38,0.15)]"
        }`}
      >
        {icon}
      </div>
      <h3
        className={`text-sm font-bold uppercase tracking-widest transition-colors duration-300 ${
          theme ? "text-gray-300 group-hover:text-white" : "text-neutral-500 group-hover:text-neutral-900"
        }`}
      >
        {title}
      </h3>
      <div className={`flex-1 h-px ml-4 transition-colors duration-300 ${theme ? "bg-gray-800 group-hover:bg-gray-700" : "bg-neutral-200 group-hover:bg-neutral-300"}`} />
    </div>
  );
}

const TextField: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
  type?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  theme: boolean;
}> = ({ icon, label, value, type = "text", onChange, theme }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleContainerClick = () => {
    if (type === "date" && inputRef.current) {
      try {
        inputRef.current.showPicker();
      } catch (e) {
        inputRef.current.focus();
      }
    } else {
      inputRef.current?.focus();
    }
  };

  return (
    <label className="block group">
      <span
        className={`text-xs font-bold uppercase tracking-wider transition-colors duration-300 ${
          theme ? "text-gray-400 group-focus-within:text-blue-400 group-hover:text-blue-300" : "text-neutral-500 group-focus-within:text-red-600 group-hover:text-red-500"
        }`}
      >
        {label}
      </span>
      <div
        onClick={handleContainerClick}
        className={`mt-2 flex items-center gap-4 rounded-xl border px-4 py-4 transition-all duration-300 cursor-text shadow-sm ${
          theme
            ? "border-gray-800 bg-gray-950/50 focus-within:border-blue-500/50 focus-within:bg-gray-900/80 focus-within:ring-2 focus-within:ring-blue-500/10 hover:-translate-y-1 hover:border-blue-500/30 hover:bg-gray-900/40 hover:shadow-[0_10px_20px_-5px_rgba(59,130,246,0.15)]"
            : "border-neutral-200 bg-white focus-within:border-red-400 focus-within:ring-2 focus-within:ring-red-600/10 hover:-translate-y-1 hover:border-red-200 hover:shadow-[0_10px_20px_-5px_rgba(220,38,38,0.08)]"
        }`}
      >
        <span
          className={`transition-all duration-300 ${
            theme ? "text-blue-400 group-focus-within:text-blue-300 group-hover:scale-110" : "text-red-500 group-focus-within:text-red-600 group-hover:scale-110"
          }`}
        >
          {icon}
        </span>
        <input
          ref={inputRef}
          type={type}
          value={value}
          onChange={onChange}
          className={`w-full bg-transparent text-base font-semibold outline-none transition-colors ${
            theme ? "text-gray-100 scheme-dark" : "text-neutral-900 scheme-light"
          } ${
            type === "date"
              ? "[&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-inner-spin-button]:hidden"
              : ""
          }`}
        />
      </div>
    </label>
  );
};

const PasswordField: React.FC<{
  label: string;
  value: string;
  show: boolean;
  onToggleShow: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  theme: boolean;
}> = ({ label, value, show, onToggleShow, onChange, theme }) => (
  <label className="block group">
    <span
      className={`text-xs font-bold uppercase tracking-wider transition-colors duration-300 ${
        theme ? "text-gray-400 group-focus-within:text-blue-400 group-hover:text-blue-300" : "text-neutral-500 group-focus-within:text-red-600 group-hover:text-red-500"
      }`}
    >
      {label}
    </span>
    <div
      className={`mt-2 flex items-center gap-4 rounded-xl border px-4 py-4 transition-all duration-300 shadow-sm ${
        theme
          ? "border-gray-800 bg-gray-950/50 focus-within:border-blue-500/50 focus-within:bg-gray-900/80 focus-within:ring-2 focus-within:ring-blue-500/10 hover:-translate-y-1 hover:border-blue-500/30 hover:bg-gray-900/40 hover:shadow-[0_10px_20px_-5px_rgba(59,130,246,0.15)]"
          : "border-neutral-200 bg-white focus-within:border-red-400 focus-within:ring-2 focus-within:ring-red-600/10 hover:-translate-y-1 hover:border-red-200 hover:shadow-[0_10px_20px_-5px_rgba(220,38,38,0.08)]"
      }`}
    >
      <Lock
        size={18}
        className={`shrink-0 transition-all duration-300 ${
          theme ? "text-blue-400 group-focus-within:text-blue-300 group-hover:scale-110" : "text-red-500 group-focus-within:text-red-600 group-hover:scale-110"
        }`}
      />
      <input
        type={show ? "text" : "password"}
        value={value}
        onChange={onChange}
        autoComplete="new-password"
        className={`w-full bg-transparent text-base font-semibold outline-none ${
          theme ? "text-gray-100" : "text-neutral-900"
        }`}
      />
      <button
        type="button"
        onClick={onToggleShow}
        className={`cursor-pointer transition-transform duration-300 p-1 hover:scale-110 ${
          theme ? "text-gray-500 hover:text-blue-400" : "text-neutral-400 hover:text-red-500"
        }`}
      >
        {show ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  </label>
);

/* ----------------------------- Main ----------------------------- */

const ProfileSetting: React.FC<ProfileSettingProps> = ({
  user = DEFAULT_USER,
  onSaveProfile,
  onChangePassword,
}) => {
  const { theme } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    suid: user.suid,
    username: user.username,
    fullName: user.fullName,
    birthDate: user.birthDate,
    joinedDate: user.joinedDate,
    avatarUrl: user.avatarUrl || "",
  });

  // Load existing saved local data if any on mount
  useEffect(() => {
    if (user === DEFAULT_USER) {
      const stored = localStorage.getItem("adminData");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setForm((prev) => ({ ...prev, ...parsed }));
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, [user]);
  
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleFormChange = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
    setProfileSaved(false);
  };

  const processFile = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setForm((prev) => ({ ...prev, avatarUrl: reader.result as string }));
          setProfileSaved(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    try {
      if (onSaveProfile) {
        await onSaveProfile(form);
      } else {
        const stored = JSON.parse(localStorage.getItem("adminData") || "{}");
        localStorage.setItem("adminData", JSON.stringify({ ...stored, ...form }));
      }
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 3000);
    } finally {
      setSavingProfile(false);
    }
  };

  const [pwd, setPwd] = useState({ current: "", next: "", confirm: "" });
  const [showPwd, setShowPwd] = useState({ current: false, next: false, confirm: false });
  const [pwdError, setPwdError] = useState("");
  const [savingPwd, setSavingPwd] = useState(false);
  const [pwdSaved, setPwdSaved] = useState(false);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwdError("");
    setPwdSaved(false);

    if (!pwd.current || !pwd.next || !pwd.confirm) {
      setPwdError("Please fill in all password fields.");
      return;
    }
    if (pwd.next.length < 8) {
      setPwdError("New password must be at least 8 characters.");
      return;
    }
    if (pwd.next !== pwd.confirm) {
      setPwdError("New password and confirm password do not match.");
      return;
    }
    if (pwd.next === pwd.current) {
      setPwdError("New password must be different from the current password.");
      return;
    }

    setSavingPwd(true);
    try {
      if (onChangePassword) {
        await onChangePassword({ currentPassword: pwd.current, newPassword: pwd.next });
      }
      setPwdSaved(true);
      setPwd({ current: "", next: "", confirm: "" });
      setTimeout(() => setPwdSaved(false), 3000);
    } catch {
      setPwdError("Failed to update password. Please check your current password.");
    } finally {
      setSavingPwd(false);
    }
  };

  const initial = form.fullName?.charAt(0)?.toUpperCase() || "U";

  return (
    <div
      className={`w-full h-full p-4 sm:p-8 transition-all duration-300 ${
        theme ? "bg-[#0B1120] text-white" : "bg-white text-neutral-900"
      }`}
    >
      {/* ===== Premium Header ===== */}
      <div className={`mb-10 pb-6 border-b transition-colors duration-300 ${theme ? "border-gray-800/70" : "border-neutral-200/70"}`}>
          <h2 className={`text-3xl lg:text-4xl font-bold tracking-tight ${theme ? "text-white" : "text-neutral-900"}`}>
            Account Settings
          </h2>
          <p className={`text-sm sm:text-base mt-2 font-medium tracking-wide ${theme ? "text-gray-400/90" : "text-neutral-500"}`}>
            Manage your profile details and security preferences seamlessly.
          </p>
      </div>

      {/* ===== Main Content ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: Avatar & Quick Info */}
        <div className={`lg:col-span-4 h-max lg:sticky lg:top-4 flex flex-col items-center text-center p-6 rounded-3xl border transition-all duration-300 group-card ${
          theme 
            ? "border-transparent bg-gray-950/10 hover:border-gray-800 hover:bg-gray-950/30 hover:shadow-[0_15px_35px_-10px_rgba(0,0,0,0.3)] hover:-translate-y-1" 
            : "border-transparent bg-neutral-50/40 hover:border-neutral-200 hover:bg-neutral-50/80 hover:shadow-[0_15px_35px_-10px_rgba(0,0,0,0.05)] hover:-translate-y-1"
        }`}>
          <div 
            className="relative group cursor-pointer"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={triggerFileInput}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/*" 
              className="hidden" 
            />

            <div
              className={`relative flex h-32 w-32 items-center justify-center overflow-hidden rounded-full text-5xl font-black shadow-xl ring-4 transition-all duration-500 ${
                isDragging 
                  ? "ring-emerald-500 scale-105 bg-emerald-500/10" 
                  : theme
                  ? "bg-linear-to-tr from-gray-800 to-gray-700 text-blue-300 ring-gray-800/50 group-hover:ring-blue-500/40 group-hover:shadow-[0_0_25px_rgba(59,130,246,0.2)]"
                  : "bg-linear-to-tr from-neutral-100 to-white text-red-600 ring-neutral-100 group-hover:ring-red-500/30 group-hover:shadow-[0_0_25px_rgba(220,38,38,0.15)]"
              }`}
            >
              {form.avatarUrl ? (
                <img src={form.avatarUrl} alt={form.fullName} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
              ) : (
                initial
              )}
              
              {/* Hover Overlay for Camera */}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Camera size={32} className="text-white drop-shadow-md" />
              </div>
            </div>
          </div>
          <h2 className={`mt-6 text-2xl font-black tracking-tight transition-colors duration-300 ${theme ? "text-gray-50 group-hover:text-white" : "text-neutral-900 group-hover:text-neutral-950"}`}>
            {form.fullName}
          </h2>
          <p className={`text-base font-medium mt-1 transition-colors duration-300 ${theme ? "text-blue-400/80 group-hover:text-blue-400" : "text-red-500/80 group-hover:text-red-600"}`}>
            @{form.username}
          </p>
          
          <span
            className={`mt-5 inline-flex items-center gap-2 rounded-full px-5 py-2 text-xs font-black tracking-widest uppercase shadow-sm transition-all duration-300 ${
              theme
                ? "bg-blue-500/10 text-blue-300 border border-blue-500/20 hover:bg-blue-500/20 hover:border-blue-500/40"
                : "bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 hover:border-red-300"
            }`}
          >
            <ShieldCheck size={16} /> {user.roleLabel}
          </span>
        </div>

        {/* Right Column: Editable Forms */}
        <div className="lg:col-span-8 space-y-12">
          
          {/* Account Details Form */}
          <section>
            <SectionHeading icon={<User size={18} />} title="Profile Information" theme={theme} />
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              
              <TextField
                icon={<Hash size={18} />}
                label="User ID (System ID)"
                value={form.suid}
                onChange={handleFormChange("suid")}
                theme={theme}
              />
              <TextField
                icon={<AtSign size={18} />}
                label="Username"
                value={form.username}
                onChange={handleFormChange("username")}
                theme={theme}
              />
              <TextField
                icon={<User size={18} />}
                label="Full Name"
                value={form.fullName}
                onChange={handleFormChange("fullName")}
                theme={theme}
              />
              
              <TextField
                icon={<Gift size={18} />}
                label="Birthdate"
                type="date"
                value={form.birthDate}
                onChange={handleFormChange("birthDate")}
                theme={theme}
              />
              <TextField
                icon={<Calendar size={18} />}
                label="Joined Date"
                type="date"
                value={form.joinedDate}
                onChange={handleFormChange("joinedDate")}
                theme={theme}
              />
            </div>

            <div className={`mt-8 flex items-center gap-5 pt-6 border-t transition-colors duration-300 ${theme ? "border-gray-800/80" : "border-neutral-200"}`}>
              <button
                onClick={handleSaveProfile}
                disabled={savingProfile}
                className={`rounded-xl px-8 py-3.5 text-base font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-xl disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:scale-100 cursor-pointer ${
                  theme
                    ? "bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 shadow-blue-900/30 hover:shadow-blue-500/20"
                    : "bg-linear-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 shadow-red-600/20 hover:shadow-red-500/30"
                }`}
              >
                {savingProfile ? "Saving..." : "Save Changes"}
              </button>
              {profileSaved && (
                <span className={`flex items-center gap-2 text-base font-bold px-4 py-3 rounded-xl transition-all duration-500 animate-in fade-in slide-in-from-left-4 ${theme ? "bg-emerald-500/10 text-emerald-400" : "bg-emerald-50 text-emerald-600"}`}>
                  <Check size={20} className="animate-bounce" /> Updated
                </span>
              )}
            </div>
          </section>

          {/* Security Form */}
          <section>
            <SectionHeading icon={<ShieldCheck size={18} />} title="Security & Password" theme={theme} />
            <form onSubmit={handlePasswordSubmit} className="space-y-6">
              
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <PasswordField
                  label="Current Password"
                  value={pwd.current}
                  show={showPwd.current}
                  onToggleShow={() => setShowPwd((p) => ({ ...p, current: !p.current }))}
                  onChange={(e) => setPwd((p) => ({ ...p, current: e.target.value }))}
                  theme={theme}
                />
                <PasswordField
                  label="New Password"
                  value={pwd.next}
                  show={showPwd.next}
                  onToggleShow={() => setShowPwd((p) => ({ ...p, next: !p.next }))}
                  onChange={(e) => setPwd((p) => ({ ...p, next: e.target.value }))}
                  theme={theme}
                />
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <PasswordField
                  label="Confirm New Password"
                  value={pwd.confirm}
                  show={showPwd.confirm}
                  onToggleShow={() => setShowPwd((p) => ({ ...p, confirm: !p.confirm }))}
                  onChange={(e) => setPwd((p) => ({ ...p, confirm: e.target.value }))}
                  theme={theme}
                />
              </div>

              {pwdError && (
                <div role="alert" className={`flex items-start gap-3 p-4 rounded-xl text-sm font-semibold border shadow-sm w-fit animate-in fade-in slide-in-from-top-2 ${
                  theme ? "bg-red-500/10 text-red-400 border-red-500/20" : "bg-red-50 text-red-700 border-red-200"
                }`}>
                  <span className="mt-0.5 shrink-0 bg-red-500/20 text-red-500 rounded-full h-5 w-5 flex items-center justify-center">!</span>
                  <span>{pwdError}</span>
                </div>
              )}
              
              {pwdSaved && (
                <p className={`flex w-max items-center gap-2 text-sm font-bold px-5 py-3.5 rounded-xl border shadow-sm animate-in fade-in slide-in-from-top-2 ${theme ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-emerald-50 text-emerald-600 border-emerald-200"}`}>
                  <Check size={20} /> Password updated successfully
                </p>
              )}

              <div className={`pt-6 border-t mt-8 transition-colors duration-300 ${theme ? "border-gray-800/80" : "border-neutral-200"}`}>
                <button
                  type="submit"
                  disabled={savingPwd}
                  className={`flex items-center gap-3 rounded-xl px-8 py-3.5 text-base font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-xl disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:scale-100 cursor-pointer ${
                    theme
                      ? "bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 shadow-blue-900/30 hover:shadow-blue-500/20 border border-transparent"
                      : "bg-linear-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 shadow-red-600/20 hover:shadow-red-500/30 border border-transparent"
                  }`}
                >
                  <Lock size={18} className="transition-transform duration-300 group-hover:rotate-12" />
                  {savingPwd ? "Updating..." : "Update Password"}
                </button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetting;