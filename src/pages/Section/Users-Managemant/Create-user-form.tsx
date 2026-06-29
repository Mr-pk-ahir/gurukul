import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../../../components/theme/ThemeContext";
import Input from "../../../components/common/Input";
import Button from "../../../components/common/Button";
import SearchableDropdown from "../../../components/common/SearchableDropdown";
import DatePicker from "../../../components/common/Calendar";
import {
    HiOutlineUser,
    HiOutlineIdentification,
    HiOutlineKey,
    HiCamera,
    HiOutlineOfficeBuilding,
    HiOutlineCalendar,
    HiOutlineShieldCheck,
} from "react-icons/hi";
import type { UserCreate } from "../../../Types/User-create";
import { FaUserCircle } from "react-icons/fa";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

interface RoleOption {
    role_id: number;
    role_name: string;
    role_code: string;
}

interface DepartmentOption {
    departmentId: number;
    departmentName: string;
    description?: string;
    departmentHeadId?: number | null;
    departmentHeadName?: string | null;
    created_at?: string;
}

function SectionHeading({
    icon,
    title,
    theme,
}: {
    icon: React.ReactNode;
    title: string;
    theme: boolean;
}) {
    return (
        <div className="flex items-center gap-2 mb-4">
            <span
                className={`flex items-center justify-center w-7 h-7 rounded-lg shrink-0 ${theme ? "bg-blue-500/10 text-blue-300" : "bg-red-500/10 text-red-600"
                    }`}
            >
                {icon}
            </span>
            <h3
                className={`text-xs font-semibold uppercase tracking-wider ${theme ? "text-gray-400" : "text-neutral-500"
                    }`}
            >
                {title}
            </h3>
            <div className={`flex-1 h-px ${theme ? "bg-gray-800" : "bg-neutral-200"}`} />
        </div>
    );
}

export default function CreateUserForm() {
    const { theme } = useTheme();
    const location = useLocation();
    const navigate = useNavigate();

    const [loading, setLoading] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>("");

    const [roles, setRoles] = useState<RoleOption[]>([]);
    const [departments, setDepartments] = useState<DepartmentOption[]>([]);

    const incomingData = location.state as { id: number; applicantName: string; requestedRole: string; departmentId: number } | null;

    const isUserRole = incomingData?.requestedRole === "USER";

    const [formData, setFormData] = useState<UserCreate>({
        suid: Math.floor(100000 + Math.random() * 900000),
        avatar: "",
        name: incomingData?.applicantName || "",
        username: "",
        password: "",
        roleId: 0,
        bod: new Date().toISOString().split("T")[0],
        roleCode: "",
        // 🎯 અહિયાં 0 ની જગ્યાએ default null રાખ્યું છે
        departmentId: incomingData?.departmentId || (null as any), 
        sectionId: 0,
        standardId: 0,
        joiningDate: new Date().toISOString().split("T")[0],
        status: isUserRole ? "PENDING" : "APPROVED",
    });

    const isHeadRole = formData.roleCode === "HEAD100"; 
    const isFromPipeline = !!incomingData;

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const token = localStorage.getItem("token");

                const [rolesRes, deptsRes] = await Promise.all([
                    fetch(`${API_URL}/roles`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`
                        }
                    }),
                    fetch(`${API_URL}/departments`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`
                        }
                    })
                ]);

                const rolesResult = await rolesRes.json();
                const deptsResult = await deptsRes.json();

                if (rolesRes.ok && rolesResult.success) {
                    setRoles(rolesResult.data);

                    if (incomingData) {
                        const matched = rolesResult.data.find((r: RoleOption) => r.role_code === incomingData.requestedRole);
                        if (matched) {
                            setFormData(prev => ({
                                ...prev,
                                roleId: matched.role_id,
                                roleCode: matched.role_code
                            }));
                        }
                    }
                }

                if (deptsRes.ok && deptsResult.success) {
                    setDepartments(deptsResult.data);
                } else {
                    console.error(deptsResult.message);
                }

            } catch (error) {
                console.error("Error fetching initial data:", error);
            }
        };

        fetchInitialData();
    }, [incomingData]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "suid" ? (value === "" ? 0 : Number(value)) : value,
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData((prev) => ({ ...prev, avatar: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage("");

        try {
            const backendBaseUrl = window.location.hostname === "localhost"
                ? "http://localhost:5000"
                : "https://તમારા-બેકએન્ડની-vercel-લિંક.vercel.app";

            // 🎯 રોલ HEAD100 હોય તો જ ડિપાર્ટમેન્ટ આઈડી જશે, નહિતર null જશે
            const finalPayload = {
                ...formData,
                departmentId: formData.roleCode === "HEAD100" ? formData.departmentId : null
            };

            const response = await fetch(`${backendBaseUrl}/users/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(finalPayload), // અહિયાં નવો પેલોડ મોકલ્યો
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "સર્વર પર યુઝર ક્રિએટ કરવામાં સમસ્યા આવી.");
            }

            if (isFromPipeline && incomingData) {
                const allReqs = localStorage.getItem("admission_requests");
                if (allReqs) {
                    const parsedReqs = JSON.parse(allReqs);
                    const filteredReqs = parsedReqs.filter((r: any) => r.id !== incomingData.id);
                    localStorage.setItem("admission_requests", JSON.stringify(filteredReqs));
                }
                navigate(`/dashboard/departments/${formData.departmentId}/student-list`);
            } else {
                navigate("/dashboard/users/list");
            }

        } catch (error: any) {
            setErrorMessage(error.message || "કંઈક ખોટું થયું છે, ફરી પ્રયાસ કરો.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className={`max-w-7xl mx-auto p-6 sm:p-8 rounded-2xl shadow-sm mt-6 border transition-all duration-200 ${theme ? "bg-gray-900 border-gray-800 text-white" : "bg-white border-neutral-200 text-neutral-900"
                }`}
        >
            {/* ===== Header ===== */}
            <div className="mb-8 pb-6 border-b flex flex-col items-center text-center gap-2 border-neutral-200 dark:border-gray-800">
                <div
                    className={`w-16 h-16 text-white rounded-full shadow-lg ${theme
                        ? "bg-linear-to-bl from-blue-300 to-blue-900 shadow-blue-950/40"
                        : "bg-linear-to-bl from-red-300 to-red-900 shadow-red-950/20"
                        } flex items-center justify-center mb-1`}
                >
                    <FaUserCircle size={24} />
                </div>
                <h2 className={`text-3xl sm:text-4xl font-bold tracking-tight ${theme ? "text-blue-200" : "text-red-600"}`}>
                    {isFromPipeline ? "Onboard Approved Applicant" : "Create User & Allocate Head"}
                </h2>
                <p className={`text-sm max-w-md ${theme ? "text-gray-400" : "text-neutral-500"}`}>
                    {isFromPipeline
                        ? "Review the applicant's details below, then confirm to generate their account."
                        : "Fill in the details below to add a new user to the system."}
                </p>
                {isFromPipeline && incomingData && (
                    <span
                        className={`inline-flex items-center gap-1.5 mt-1 px-3 py-1 rounded-full text-xs font-medium ${theme ? "bg-amber-500/10 text-amber-400" : "bg-amber-50 text-amber-700"
                            }`}
                    >
                        Processing Request <span className="font-bold">#{incomingData.id}</span>
                    </span>
                )}
            </div>

            {/* ===== Error banner ===== */}
            {errorMessage && (
                <div
                    role="alert"
                    className={`mb-6 flex items-start gap-2.5 p-3.5 rounded-xl text-sm font-medium border ${theme
                        ? "bg-red-500/10 text-red-300 border-red-500/20"
                        : "bg-red-50 text-red-700 border-red-100"
                        }`}
                >
                    <span className="mt-0.5 shrink-0">⚠</span>
                    <span>{errorMessage}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">

                {/* ===== Avatar ===== */}
                <div className="flex flex-col items-center justify-center gap-2">
                    <label
                        className={`relative w-40 h-30 rounded-3xl overflow-hidden border-2 ${theme ? "border-blue-500/60" : "border-red-500/60"
                            } flex items-center justify-center shrink-0 cursor-pointer group transition-shadow ring-4 ${theme ? "ring-blue-500/5 hover:ring-blue-500/10" : "ring-red-500/5 hover:ring-red-500/10"
                            }`}
                    >
                        {formData.avatar ? (
                            <img src={formData.avatar} alt="Selected Profile" className="w-full h-full object-cover" />
                        ) : (
                            <span
                                className={`flex items-center justify-center w-full h-full ${theme ? "bg-gray-800 text-gray-500" : "bg-neutral-100 text-neutral-400"
                                    }`}
                            >
                                <HiOutlineUser className="text-5xl" />
                            </span>
                        )}

                        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <HiCamera className="text-white text-2xl" />
                            <span className="text-white text-[10px] font-medium">Upload</span>
                        </div>

                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                    </label>
                    <p className={`text-xs ${theme ? "text-gray-500" : "text-neutral-400"}`}>
                        Profile photo (optional)
                    </p>
                </div>

                {/* ===== Identity section ===== */}
                <div>
                    <SectionHeading icon={<HiOutlineIdentification className="text-sm" />} title="Identity" theme={theme} />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1.5">User ID (SUID) *</label>
                            <Input
                                type="number"
                                name="suid"
                                value={formData.suid ? String(formData.suid) : ""}
                                onChange={handleInputChange}
                                icon={<HiOutlineIdentification className="text-lg" />}
                                placeholder="Ex: 5001"
                                required
                                disabled={isFromPipeline}
                                className={isFromPipeline ? "bg-gray-50 dark:bg-gray-800 text-gray-500" : ""}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1.5">Full Name *</label>
                            <Input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                icon={<HiOutlineUser className="text-lg" />}
                                placeholder="Enter full name"
                                required
                                disabled={isFromPipeline}
                                className={isFromPipeline ? "bg-gray-50 dark:bg-gray-800 font-semibold" : ""}
                            />
                        </div>
                    </div>
                </div>

                {/* ===== Role & department section ===== */}
                <div>
                    <SectionHeading icon={<HiOutlineShieldCheck className="text-sm" />} title="Role & Department" theme={theme} />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        
                        {/* 🌟 1. Role Dropdown */}
                        <SearchableDropdown
                            label="Select Role *"
                            placeholder={roles.length === 0 ? "Loading roles..." : "Choose Role"}
                            options={roles.map(r => ({ value: r.role_code, label: `${r.role_name} (${r.role_code})` }))}
                            selectedValue={formData.roleCode || ""}
                            onSelect={(val) => {
                                const selectedRole = roles.find(r => r.role_code === String(val));

                                setFormData(prev => ({
                                    ...prev,
                                    roleId: selectedRole?.role_id ?? 0,
                                    roleCode: selectedRole?.role_code ?? "",
                                    status: selectedRole?.role_code === "USER" ? "PENDING" : "APPROVED",
                                    // 🎯 જો HEAD100 ના હોય તો અહિયાં પણ 0 ની જગ્યાએ null સેટ કર્યું
                                    ...(selectedRole?.role_code !== "HEAD100" && {
                                        departmentId: null as any,
                                    }),
                                }));
                            }}
                            required
                            disabled={isFromPipeline || roles.length === 0}
                        />

                        {/* 🌟 2. Department Dropdown */}
                        {(isHeadRole || isFromPipeline) ? (
                            <SearchableDropdown
                                label="Assign Department *"
                                placeholder={departments.length === 0 ? "Loading departments..." : "Choose Department"}
                                options={departments.map((d) => ({
                                    value: d.departmentId,
                                    label: d.departmentName,
                                }))}
                                selectedValue={formData.departmentId || ""}
                                onSelect={(val) => {
                                    setFormData((prev) => ({ ...prev, departmentId: Number(val) }))
                                }}
                                required
                                disabled={departments.length === 0}
                            />
                        ) : (
                            <div
                                className={`flex items-center gap-2.5 border border-dashed rounded-xl p-4 text-xs ${theme
                                    ? "border-gray-700 bg-gray-800/30 text-gray-500"
                                    : "border-neutral-200 bg-neutral-50/50 text-neutral-400"
                                    }`}
                            >
                                <HiOutlineOfficeBuilding className="text-base shrink-0" />
                                Department allocation is only available for the Department Head role.
                            </div>
                        )}
                    </div>
                </div>

                {/* ===== Account section ===== */}
                <div>
                    <SectionHeading icon={<HiOutlineKey className="text-sm" />} title="Account Credentials" theme={theme} />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1.5">Username *</label>
                            <Input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleInputChange}
                                icon={<HiOutlineUser className="text-lg" />}
                                placeholder="Ex: rahul_p"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1.5">Password *</label>
                            <Input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                icon={<HiOutlineKey className="text-lg" />}
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* ===== Dates section ===== */}
                <div>
                    <SectionHeading icon={<HiOutlineCalendar className="text-sm" />} title="Important Dates" theme={theme} />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <DatePicker
                            label="Joining Date *"
                            selectedValue={formData.joiningDate}
                            onChange={(dateStr) => setFormData((prev) => ({ ...prev, joiningDate: dateStr }))}
                            required
                        />
                        <DatePicker
                            label="BOD *"
                            selectedValue={formData.bod}
                            onChange={(dateStr) => setFormData((prev) => ({ ...prev, bod: dateStr }))}
                            required
                        />
                    </div>
                </div>

                {/* ===== Submit ===== */}
                <div className="flex justify-end items-center gap-3 pt-6 border-t border-neutral-200 dark:border-gray-800">
                    <p className={`text-xs mr-auto hidden sm:block ${theme ? "text-gray-500" : "text-neutral-400"}`}>
                        Fields marked * are required.
                    </p>
                    <Button
                        type="submit"
                        disabled={loading || roles.length === 0}
                        className={`${theme ? "bg-blue-600 hover:bg-blue-700" : "bg-red-600 hover:bg-red-700"} min-w-45 transition-colors duration-150 disabled:opacity-60 disabled:cursor-not-allowed`}
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <span className="w-3.5 h-3.5 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                                Processing...
                            </span>
                        ) : isFromPipeline ? (
                            "Confirm & Generate User"
                        ) : (
                            "Create User Profile"
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}