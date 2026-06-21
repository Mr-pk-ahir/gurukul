import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
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
    <div className="flex items-center gap-3 mb-8">
      <div
        className={`flex items-center justify-center w-8 h-8 rounded-xl shrink-0 shadow-sm ${
          theme
            ? "bg-linear-to-br from-blue-500/20 to-blue-600/10 text-blue-400 border border-blue-500/20"
            : "bg-linear-to-br from-red-500/10 to-red-600/5 text-red-600 border border-red-100"
        }`}
      >
        {icon}
      </div>
      <h3
        className={`text-xs font-bold uppercase tracking-widest ${
          theme ? "text-gray-300" : "text-neutral-500"
        }`}
      >
        {title}
      </h3>
      <div className={`flex-1 h-px ml-4 ${theme ? "bg-gray-800" : "bg-neutral-200"}`} />
    </div>
  );
}

// Premium Text/Date Field
const TextField: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
  type?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  theme: boolean;
}> = ({ icon, label, value, type = "text", onChange, theme }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus functionality for date fields to open the picker smoothly
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
        className={`text-[11px] font-bold uppercase tracking-wider transition-colors ${
          theme ? "text-gray-400 group-focus-within:text-blue-400" : "text-neutral-500 group-focus-within:text-red-600"
        }`}
      >
        {label}
      </span>
      <div
        onClick={handleContainerClick}
        className={`mt-2 flex items-center gap-3 rounded-xl border px-4 py-3.5 transition-all duration-300 cursor-text shadow-sm ${
          theme
            ? "border-gray-800 bg-gray-950/50 focus-within:border-blue-500/50 focus-within:bg-gray-900/80 focus-within:ring-4 focus-within:ring-blue-500/10 hover:border-gray-700 hover:bg-gray-900"
            : "border-neutral-200 bg-white focus-within:border-red-400 focus-within:ring-4 focus-within:ring-red-600/10 hover:border-neutral-300 hover:bg-neutral-50"
        }`}
      >
        <span
          className={`transition-colors ${
            theme ? "text-blue-400 group-focus-within:text-blue-300" : "text-red-500 group-focus-within:text-red-600"
          }`}
        >
          {icon}
        </span>
        <input
          ref={inputRef}
          type={type}
          value={value}
          onChange={onChange}
          className={`w-full bg-transparent text-sm font-semibold outline-none transition-colors ${
            theme ? "text-gray-100 scheme-dark" : "text-neutral-900 scheme-light"
          } ${
            type === "date"
              ? /* Hiding the ugly native calendar icon completely */
                "[&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-inner-spin-button]:hidden"
              : ""
          }`}
        />
      </div>
    </label>
  );
};

// Premium Password Field
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
      className={`text-[11px] font-bold uppercase tracking-wider transition-colors ${
        theme ? "text-gray-400 group-focus-within:text-blue-400" : "text-neutral-500 group-focus-within:text-red-600"
      }`}
    >
      {label}
    </span>
    <div
      className={`mt-2 flex items-center gap-3 rounded-xl border px-4 py-3.5 transition-all duration-300 shadow-sm ${
        theme
          ? "border-gray-800 bg-gray-950/50 focus-within:border-blue-500/50 focus-within:bg-gray-900/80 focus-within:ring-4 focus-within:ring-blue-500/10 hover:border-gray-700"
          : "border-neutral-200 bg-white focus-within:border-red-400 focus-within:ring-4 focus-within:ring-red-600/10 hover:border-neutral-300"
      }`}
    >
      <Lock
        size={18}
        className={`shrink-0 transition-colors ${
          theme ? "text-blue-400 group-focus-within:text-blue-300" : "text-red-500 group-focus-within:text-red-600"
        }`}
      />
      <input
        type={show ? "text" : "password"}
        value={value}
        onChange={onChange}
        autoComplete="new-password"
        className={`w-full bg-transparent text-sm font-semibold outline-none ${
          theme ? "text-gray-100" : "text-neutral-900"
        }`}
      />
      <button
        type="button"
        onClick={onToggleShow}
        className={`cursor-pointer transition-colors ${
          theme ? "text-gray-500 hover:text-gray-300" : "text-neutral-400 hover:text-neutral-600"
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
  const navigate = useNavigate();
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
  
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleFormChange = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
    setProfileSaved(false);
  };

  // Profile Image Handling Logic
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
      className={`w-full mx-auto p-6 sm:p-10 rounded-3xl shadow-sm mt-6 border transition-all duration-300 ${
        theme ? "bg-[#0B1120] border-gray-800 text-white" : "bg-white border-neutral-200 text-neutral-900"
      }`}
    >
      {/* ===== Header (Updated divider line for Light theme) ===== */}
      <div className="mb-10 pb-8 border-b flex flex-col items-start gap-4 border-neutral-100 dark:border-gray-400">
        <button
          onClick={() => navigate(-1)}
          className={`flex items-center gap-2 text-sm font-bold transition-all cursor-pointer w-fit group ${
            theme ? "text-gray-400 hover:text-white" : "text-neutral-500 hover:text-neutral-900"
          }`}
        >
          <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" /> Back
        </button>
        <div>
          <h2 className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${theme ? "text-white" : "text-neutral-900"}`}>
            Account Settings
          </h2>
          <p className={`text-sm mt-1.5 max-w-md font-medium ${theme ? "text-gray-400" : "text-neutral-500"}`}>
            Manage your profile details and security preferences seamlessly.
          </p>
        </div>
      </div>

      {/* ===== Main Content ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: Avatar & Quick Info with Drag and Drop Support */}
        <div className="lg:col-span-4 h-max lg:sticky lg:top-8 flex flex-col items-center text-center p-6 rounded-2xl border border-transparent transition-colors hover:border-gray-800/30">
          <div 
            className="relative group cursor-pointer"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={triggerFileInput}
          >
            {/* Hidden File Input */}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/*" 
              className="hidden" 
            />

            <div
              className={`flex h-32 w-32 items-center justify-center overflow-hidden rounded-full text-5xl font-black shadow-2xl ring-4 transition-all duration-300 ${
                isDragging 
                  ? "ring-emerald-500 scale-105 bg-emerald-500/10" 
                  : theme
                  ? "bg-linear-to-tr from-gray-800 to-gray-700 text-blue-300 ring-gray-800/50 group-hover:ring-blue-500/40"
                  : "bg-linear-to-tr from-neutral-100 to-white text-red-600 ring-neutral-100 group-hover:ring-red-500/30"
              }`}
            >
              {form.avatarUrl ? (
                <img src={form.avatarUrl} alt={form.fullName} className="h-full w-full object-cover" />
              ) : (
                initial
              )}
            </div>
            <button
              type="button"
              aria-label="Change photo"
              className={`absolute bottom-1 right-1 flex h-10 w-10 items-center justify-center rounded-full text-white shadow-xl transition-all duration-300 group-hover:scale-110 border-4 ${
                theme
                  ? "bg-blue-600 hover:bg-blue-500 border-[#0B1120]"
                  : "bg-red-600 hover:bg-red-500 border-white"
              }`}
            >
              <Camera size={18} />
            </button>
          </div>
          <h2 className={`mt-6 text-2xl font-black tracking-tight ${theme ? "text-gray-50" : "text-neutral-900"}`}>
            {form.fullName}
          </h2>
          <p className={`text-[15px] font-medium mt-1 ${theme ? "text-blue-400/80" : "text-red-500/80"}`}>
            @{form.username}
          </p>
          
          <span
            className={`mt-5 inline-flex items-center gap-1.5 rounded-full px-5 py-2 text-[11px] font-black tracking-widest uppercase shadow-sm ${
              theme
                ? "bg-blue-500/10 text-blue-300 border border-blue-500/20"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            <ShieldCheck size={14} /> {user.roleLabel}
          </span>
        </div>

        {/* Right Column: Editable Forms */}
        <div className="lg:col-span-8 space-y-12">
          
          {/* Account Details Form */}
          <section>
            <SectionHeading icon={<User size={16} />} title="Profile Information" theme={theme} />
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

            <div className={`mt-8 flex items-center gap-4 pt-6 border-t ${theme ? "border-gray-800/80" : "border-neutral-200"}`}>
              <button
                onClick={handleSaveProfile}
                disabled={savingProfile}
                className={`rounded-xl px-8 py-3.5 text-sm font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-60 disabled:hover:translate-y-0 cursor-pointer ${
                  theme
                    ? "bg-linear-to-r from-blue-600 to-blue-500 shadow-blue-900/30"
                    : "bg-linear-to-r from-red-600 to-red-500 shadow-red-600/20"
                }`}
              >
                {savingProfile ? "Saving Details..." : "Save Changes"}
              </button>
              {profileSaved && (
                <span className={`flex items-center gap-2 text-sm font-bold px-4 py-3 rounded-xl transition-all duration-500 ${theme ? "bg-emerald-500/10 text-emerald-400" : "bg-emerald-50 text-emerald-600"}`}>
                  <Check size={18} /> Profile Updated
                </span>
              )}
            </div>
          </section>

          {/* Security Form */}
          <section>
            <SectionHeading icon={<ShieldCheck size={16} />} title="Security & Password" theme={theme} />
            <form onSubmit={handlePasswordSubmit} className="space-y-6">
              
              {/* Row 1: Current Password & New Password */}
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

              {/* Row 2: Confirm Password */}
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
                <div role="alert" className={`flex items-start gap-3 p-4 rounded-xl text-sm font-semibold border shadow-sm w-fit ${
                  theme ? "bg-red-500/10 text-red-400 border-red-500/20" : "bg-red-50 text-red-700 border-red-200"
                }`}>
                  <span className="mt-0.5 shrink-0 bg-red-500/20 text-red-500 rounded-full h-5 w-5 flex items-center justify-center text-xs">!</span>
                  <span>{pwdError}</span>
                </div>
              )}
              
              {pwdSaved && (
                <p className={`flex w-max items-center gap-2 text-sm font-bold px-5 py-3.5 rounded-xl border shadow-sm ${theme ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-emerald-50 text-emerald-600 border-emerald-200"}`}>
                  <Check size={18} /> Password updated successfully
                </p>
              )}

              <div className={`pt-4 border-t mt-8 ${theme ? "border-gray-800/80" : "border-neutral-200"}`}>
                <button
                  type="submit"
                  disabled={savingPwd}
                  className={`flex items-center gap-2.5 rounded-xl px-8 py-3.5 text-sm font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-60 disabled:hover:translate-y-0 cursor-pointer ${
                    theme
                      ? "bg-linear-to-b from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-700 shadow-black/40 border border-gray-600/50"
                      : "bg-linear-to-b from-red-500 to-red-600 hover:from-red-700 hover:to-red-800 shadow-neutral-900/20"
                  }`}
                >
                  <Lock size={16} />
                  {savingPwd ? "Updating Password..." : "Update Password"}
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